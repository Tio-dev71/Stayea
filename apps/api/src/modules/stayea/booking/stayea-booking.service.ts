import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common"
import { Cron, CronExpression } from "@nestjs/schedule"
import {
  stayeaAccommodationsTable,
  stayeaBookingsTable,
  stayeaClubProfilesTable,
  stayeaClubPointsTransactionsTable,
  stayeaExperiencesTable,
  stayeaPromotionsTable,
  stayeaUserVouchersTable,
  partnerInventoryTable,
  partnerOrdersTable,
  partnerProfilesTable,
  partnerServicesTable,
} from "@workspace/database"
import dayjs from "dayjs"
import { and, asc, desc, eq, gte, ilike, inArray, lte, ne, or, sql } from "drizzle-orm"

import { DB_TOKEN } from "@/app/database/db.port"
import { ErrorCode } from "@/shared-kernel/infrastructure/enums/error-code"

import type { DrizzleDb } from "@/app/database/db.port"
import type { BookingQueryDto, CreateBookingDto } from "@/modules/stayea/booking/dtos/booking.dto"

@Injectable()
export class StayeaBookingService {
  private readonly logger = new Logger(StayeaBookingService.name)

  constructor(@Inject(DB_TOKEN) private readonly db: DrizzleDb) {}

  /**
   * Create a new unified booking across Stays, Flights, Experiences, Packages
   * Protected with:
   * - Double-booking collision checks
   * - Server-side price verification
   * - Atomic DB transaction for point deduction, vouchers, and booking insertion
   */
  async createBooking(userId: string, dto: CreateBookingDto) {
    // 1. Server-side price validation to prevent price tampering
    let verifiedTotal = Number(dto.totalAmount)
    if (dto.bookingType === "stay" && dto.details?.stayId) {
      const [acc] = await this.db
        .select()
        .from(stayeaAccommodationsTable)
        .where(eq(stayeaAccommodationsTable.id, dto.details.stayId))
        .limit(1)
      if (acc) {
        const nights = dto.details.nightCount ?? 1
        const pricePerNight = Number(acc.pricePerNight)
        const expectedTotal = pricePerNight * nights
        if (verifiedTotal <= 0 || Math.abs(verifiedTotal - expectedTotal) > 100) {
          verifiedTotal = expectedTotal
        }
      }
    } else if (dto.bookingType === "experience" && dto.details?.experienceId) {
      const [exp] = await this.db
        .select()
        .from(stayeaExperiencesTable)
        .where(eq(stayeaExperiencesTable.id, dto.details.experienceId))
        .limit(1)
      if (exp) {
        const guestCount = dto.guestCount ?? 1
        const pricePerGuest = Number(exp.price)
        const expectedTotal = pricePerGuest * guestCount
        if (verifiedTotal <= 0 || Math.abs(verifiedTotal - expectedTotal) > 100) {
          verifiedTotal = expectedTotal
        }
      }
    }

    // 2. Execute atomic reservation inside a database transaction (SEC-003: prevents double booking race conditions)
    return this.db.transaction(async (tx) => {
      // Concurrency Gate: Atomically check for conflicting active or pending reservations
      if (dto.bookingType === "stay" && dto.details?.stayId) {
        const conflictingBookings = await tx
          .select()
          .from(stayeaBookingsTable)
          .where(
            and(
              eq(stayeaBookingsTable.bookingType, "stay"),
              ne(stayeaBookingsTable.status, "cancelled"),
              ne(stayeaBookingsTable.status, "refunded"),
              sql`(${stayeaBookingsTable.details}->>'stayId') = ${dto.details.stayId}`,
              sql`${stayeaBookingsTable.startDate} < ${dto.endDate} AND ${stayeaBookingsTable.endDate} > ${dto.startDate}`
            )
          )
          .limit(1)

        const conflict = conflictingBookings[0]
        if (conflict) {
          throw new ConflictException({
            code: ErrorCode.RESOURCE_CONFLICT,
            message: `Chỗ nghỉ này đã có khách giữ chỗ hoặc đặt từ ${conflict.startDate} đến ${conflict.endDate}. Vui lòng chọn ngày khác.`,
          })
        }
      }

      // Blackout Dates check: Verify dates are not blocked by the partner in partnerInventoryTable
      const serviceId = dto.details?.stayId || dto.details?.experienceId
      if (serviceId) {
        const blackoutDates = await tx
          .select()
          .from(partnerInventoryTable)
          .where(
            and(
              eq(partnerInventoryTable.serviceId, serviceId),
              eq(partnerInventoryTable.isAvailable, false),
              gte(partnerInventoryTable.date, dto.startDate),
              lte(partnerInventoryTable.date, dto.endDate)
            )
          )
          .limit(1)

        const blackout = blackoutDates[0]
        if (blackout) {
          throw new ConflictException({
            code: ErrorCode.RESOURCE_CONFLICT,
            message: `Dịch vụ này đã bị khóa vào ngày ${blackout.date} (${blackout.note || "Lịch bận của cơ sở"}). Vui lòng chọn khoảng thời gian khác.`,
          })
        }
      }
      let voucherDiscount = 0
      let pointsDiscount = 0
      let validatedVoucherCode: string | null = null

      // Voucher discount validation
      if (dto.voucherCode) {
        const cleanCode = dto.voucherCode.trim().toUpperCase()
        const [promo] = await tx
          .select()
          .from(stayeaPromotionsTable)
          .where(
            and(
              eq(stayeaPromotionsTable.code, cleanCode),
              eq(stayeaPromotionsTable.isActive, true)
            )
          )
          .limit(1)

        if (promo) {
          const discountVal = Number(promo.discountValue)
          if (promo.discountType === "percentage") {
            const calc = (verifiedTotal * discountVal) / 100
            const maxDisc = promo.maxDiscount ? Number(promo.maxDiscount) : Infinity
            voucherDiscount = Math.min(calc, maxDisc)
          } else {
            voucherDiscount = Math.min(discountVal, verifiedTotal)
          }
          validatedVoucherCode = promo.code
        }
      }

      // Loyalty points redemption (1 point = 1,000 VND)
      let pointsUsed = 0
      if (dto.pointsToRedeem && dto.pointsToRedeem > 0) {
        const [clubProfile] = await tx
          .select()
          .from(stayeaClubProfilesTable)
          .where(eq(stayeaClubProfilesTable.userId, userId))
          .limit(1)

        if (clubProfile && clubProfile.pointsBalance >= dto.pointsToRedeem) {
          pointsUsed = dto.pointsToRedeem
          pointsDiscount = pointsUsed * 1000

          // Atomically deduct points
          await tx
            .update(stayeaClubProfilesTable)
            .set({
              pointsBalance: clubProfile.pointsBalance - pointsUsed,
              updatedAt: new Date(),
            })
            .where(eq(stayeaClubProfilesTable.userId, userId))

          // Record points transaction
          await tx.insert(stayeaClubPointsTransactionsTable).values({
            id: `ptx-${crypto.randomUUID()}`,
            userId,
            points: -pointsUsed,
            type: "redeemed",
            title: `Dùng điểm cho đặt chỗ: ${dto.title}`,
            description: `Giảm ${pointsDiscount.toLocaleString("vi-VN")} VND`,
          })
        }
      }

      const totalDiscount = voucherDiscount + pointsDiscount
      const finalAmount = Math.max(0, verifiedTotal - totalDiscount)
      const pointsEarned = Math.floor(finalAmount / 50_000)

      const bookingId = `bk-${crypto.randomUUID()}`
      const randomSuffix = Math.floor(1000 + Math.random() * 9000)
      const bookingCode = `STA-${dayjs().format("YYYYMM")}-${randomSuffix}`

      const [newBooking] = await tx
        .insert(stayeaBookingsTable)
        .values({
          id: bookingId,
          bookingCode,
          userId,
          bookingType: dto.bookingType,
          title: dto.title,
          destination: dto.destination,
          startDate: dto.startDate,
          endDate: dto.endDate,
          guestCount: dto.guestCount ?? 1,
          status: "pending", // State Machine: Unpaid reservations are 'pending', confirmed only after payment
          paymentStatus: "unpaid",
          paymentMethod: dto.paymentMethod ?? "credit_card",
          totalAmount: verifiedTotal.toString(),
          discountAmount: totalDiscount.toString(),
          finalAmount: finalAmount.toString(),
          currency: "VND",
          voucherCode: validatedVoucherCode,
          pointsUsed,
          pointsEarned,
          details: {
            ...(dto.details ?? {}),
            metadata: {
              ...((dto.details as any)?.metadata ?? {}),
              expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
            },
          },
        })
        .returning()

      if (validatedVoucherCode) {
        await tx
          .update(stayeaUserVouchersTable)
          .set({ isUsed: true, usedAt: new Date() })
          .where(
            and(
              eq(stayeaUserVouchersTable.userId, userId),
              eq(stayeaUserVouchersTable.code, validatedVoucherCode)
            )
          )
      }

      // Automatically dispatch order to partnerOrdersTable so Admin Approval Queue
      // and Partner Hub receive and update the state in real time!
      try {
        let targetPartnerId: string | null = null

        // 1. Prioritize real owner from partnerServicesTable
        const serviceLookupId = dto.details?.stayId || dto.details?.experienceId
        if (serviceLookupId) {
          const [service] = await tx
            .select()
            .from(partnerServicesTable)
            .where(eq(partnerServicesTable.id, serviceLookupId))
            .limit(1)
          if (service?.partnerId) {
            targetPartnerId = service.partnerId
          }
        }

        // 2. Fetch partner profile
        let matchedPartner: any = null
        if (targetPartnerId) {
          const [p] = await tx
            .select()
            .from(partnerProfilesTable)
            .where(eq(partnerProfilesTable.id, targetPartnerId))
            .limit(1)
          matchedPartner = p
        }

        // 3. Fallback only if item is platform direct listing without a specific partner
        if (!matchedPartner) {
          const partnerBusinessType =
            dto.bookingType === "stay"
              ? "homestay"
              : dto.bookingType === "experience" || dto.bookingType === "combo"
              ? "tour"
              : "transport"

          const [fallback] = await tx
            .select()
            .from(partnerProfilesTable)
            .where(
              and(
                eq(partnerProfilesTable.status, "approved"),
                or(
                  eq(partnerProfilesTable.businessType, partnerBusinessType),
                  eq(partnerProfilesTable.businessType, "multi")
                )
              )
            )
            .limit(1)
          matchedPartner = fallback
        }

        if (matchedPartner) {
          const targetPartnerId = matchedPartner.id
          const commissionRate = matchedPartner.commissionRate
            ? Number.parseFloat(matchedPartner.commissionRate) / 100
            : 0.1
          const commissionAmount = Math.round(finalAmount * commissionRate)
          const partnerPayoutAmount = Math.max(0, finalAmount - commissionAmount)

          const rawPhone = dto.details?.contactInfo?.phone || "0912345678"
          const cleanPhone = rawPhone.replace(/[\s.-]/g, "")
          const customerName = dto.details?.contactInfo?.fullName || "Khách hàng STAYEA"
          const customerEmail = dto.details?.contactInfo?.email || null

          await tx.insert(partnerOrdersTable).values({
            id: `pord-${crypto.randomUUID()}`,
            orderCode: `ORD-${bookingCode}`,
            partnerId: targetPartnerId,
            serviceId:
              dto.details?.stayId ||
              dto.details?.experienceId ||
              dto.details?.packageId ||
              `srv-${crypto.randomUUID().slice(0, 8)}`,
            bookingId: newBooking?.id || bookingId,
            customerName,
            customerPhone: cleanPhone,
            customerEmail,
            serviceTitle: dto.title,
            serviceType: dto.bookingType,
            startDate: dto.startDate,
            endDate: dto.endDate,
            quantity: dto.guestCount ?? 1,
            unitPrice: verifiedTotal.toString(),
            totalAmount: finalAmount.toString(),
            commissionAmount: commissionAmount.toString(),
            partnerPayoutAmount: partnerPayoutAmount.toString(),
            status: "pending_admin",
            source: "direct_customer",
            customerNote: dto.details?.contactInfo?.note || "",
            adminNotes: `Đơn đặt dịch vụ trực tuyến từ website (Mã booking: ${bookingCode})`,
          })
        }
      } catch (orderErr) {
        // Log but do not block booking if partner order dispatch hits non-critical warning
        console.warn("[StayeaBooking] Partner order dispatch warning:", orderErr)
      }

      return newBooking
    })
  }

  /**
   * Find user bookings with optional status or type filter
   */
  async findUserBookings(userId: string, query: BookingQueryDto, userEmail?: string) {
    const userMatchConditions = [eq(stayeaBookingsTable.userId, userId)]
    if (userEmail) {
      userMatchConditions.push(
        sql`lower(${stayeaBookingsTable.details}->'contactInfo'->>'email') = ${userEmail.toLowerCase()}`
      )
    }

    const conditions = [or(...userMatchConditions)]

    if (query.status && query.status !== "all") {
      conditions.push(eq(stayeaBookingsTable.status, query.status as any))
    }

    if (query.bookingType) {
      conditions.push(eq(stayeaBookingsTable.bookingType, query.bookingType as any))
    }

    const items = await this.db
      .select()
      .from(stayeaBookingsTable)
      .where(and(...conditions))
      .orderBy(desc(stayeaBookingsTable.createdAt))
      .limit(query.limit ?? 20)
      .offset(query.offset ?? 0)

    return {
      items,
      count: items.length,
      limit: query.limit ?? 20,
      offset: query.offset ?? 0,
    }
  }

  /**
   * Find all bookings for Admin Management with pagination, search, status filter
   */
  async findAllBookingsForAdmin(query: BookingQueryDto & { search?: string }) {
    const conditions = []

    if (query.status && query.status !== "all") {
      conditions.push(eq(stayeaBookingsTable.status, query.status as any))
    }

    if (query.bookingType) {
      conditions.push(eq(stayeaBookingsTable.bookingType, query.bookingType as any))
    }

    if (query.search) {
      const term = `%${query.search.trim()}%`
      conditions.push(
        or(
          ilike(stayeaBookingsTable.bookingCode, term),
          ilike(stayeaBookingsTable.title, term),
          ilike(stayeaBookingsTable.destination, term)
        )
      )
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined

    const items = await this.db
      .select()
      .from(stayeaBookingsTable)
      .where(whereClause)
      .orderBy(desc(stayeaBookingsTable.createdAt))
      .limit(query.limit ?? 50)
      .offset(query.offset ?? 0)

    return {
      items,
      count: items.length,
      limit: query.limit ?? 50,
      offset: query.offset ?? 0,
    }
  }

  /**
   * Get booking details by ID or bookingCode (for authenticated user)
   */
  async findBookingById(userId: string, idOrCode: string) {
    const [booking] = await this.db
      .select()
      .from(stayeaBookingsTable)
      .where(
        and(
          eq(stayeaBookingsTable.userId, userId),
          or(
            eq(stayeaBookingsTable.id, idOrCode),
            eq(stayeaBookingsTable.bookingCode, idOrCode)
          )
        )
      )
      .limit(1)

    if (!booking) {
      throw new NotFoundException({
        code: ErrorCode.RESOURCE_NOT_FOUND,
        message: `Booking ${idOrCode} not found`,
      })
    }

    return booking
  }

  /**
   * Get booking details by ID or bookingCode (for Admin)
   */
  async findBookingByIdForAdmin(idOrCode: string) {
    const [booking] = await this.db
      .select()
      .from(stayeaBookingsTable)
      .where(
        or(
          eq(stayeaBookingsTable.id, idOrCode),
          eq(stayeaBookingsTable.bookingCode, idOrCode)
        )
      )
      .limit(1)

    if (!booking) {
      throw new NotFoundException({
        code: ErrorCode.RESOURCE_NOT_FOUND,
        message: `Booking ${idOrCode} not found`,
      })
    }

    return booking
  }

  /**
   * Cancel an active booking
   */
  async cancelBooking(userId: string, id: string) {
    const [booking] = await this.db
      .select()
      .from(stayeaBookingsTable)
      .where(
        and(
          eq(stayeaBookingsTable.userId, userId),
          eq(stayeaBookingsTable.id, id)
        )
      )
      .limit(1)

    if (!booking) {
      throw new NotFoundException({
        code: ErrorCode.RESOURCE_NOT_FOUND,
        message: `Booking ${id} not found`,
      })
    }

    if (booking.status === "completed" || booking.status === "cancelled") {
      throw new BadRequestException({
        code: ErrorCode.BAD_REQUEST,
        message: `Không thể hủy đơn đặt ở trạng thái ${booking.status}`,
      })
    }

    const [updated] = await this.db
      .update(stayeaBookingsTable)
      .set({
        status: "cancelled",
        updatedAt: new Date(),
      })
      .where(eq(stayeaBookingsTable.id, id))
      .returning()

    return updated
  }

  /**
   * Update booking status (used by payment callback or admin)
   * Automatically synchronizes status across stayeaBookingsTable and partnerOrdersTable
   */
  async updateStatus(id: string, status: "pending" | "confirmed" | "completed" | "cancelled" | "refunded") {
    const [updated] = await this.db
      .update(stayeaBookingsTable)
      .set({
        status,
        updatedAt: new Date(),
      })
      .where(
        or(
          eq(stayeaBookingsTable.id, id),
          eq(stayeaBookingsTable.bookingCode, id)
        )
      )
      .returning()

    if (!updated) {
      throw new NotFoundException({
        code: ErrorCode.RESOURCE_NOT_FOUND,
        message: `Booking ${id} not found`,
      })
    }

    // Automatically synchronize status with partner orders table
    try {
      let partnerStatus: "pending_admin" | "admin_approved" | "sent_to_partner" | "partner_accepted" | "completed" | "cancelled" | null = null
      if (status === "confirmed") {
        partnerStatus = "sent_to_partner"
      } else if (status === "completed") {
        partnerStatus = "completed"
      } else if (status === "cancelled" || status === "refunded") {
        partnerStatus = "cancelled"
      }

      if (partnerStatus) {
        // If transitioning to sent_to_partner, ONLY update orders that are still pending_admin or admin_approved.
        // DO NOT downgrade orders that are already partner_accepted, in_progress, or completed!
        const whereClause = partnerStatus === "sent_to_partner"
          ? and(
              or(
                eq(partnerOrdersTable.bookingId, updated.id),
                eq(partnerOrdersTable.orderCode, `ORD-${updated.bookingCode}`)
              ),
              inArray(partnerOrdersTable.status, ["pending_admin", "admin_approved"])
            )
          : or(
              eq(partnerOrdersTable.bookingId, updated.id),
              eq(partnerOrdersTable.orderCode, `ORD-${updated.bookingCode}`)
            )

        await this.db
          .update(partnerOrdersTable)
          .set({
            status: partnerStatus,
            updatedAt: new Date(),
            adminNotes: `Đơn đã được Quản trị viên STAYEA xác nhận chuyển sang trạng thái: "${status}"`,
          })
          .where(whereClause)
      }
    } catch (syncErr) {
      this.logger.warn(`Failed to synchronize partner order for booking ${updated.id}: ${syncErr}`)
    }

    return updated
  }

  /**
   * Automated cron worker running every minute to release expired pending reservations (SEC-004)
   * Any booking with status 'pending' whose expiration timestamp has passed will be marked 'cancelled'
   */
  @Cron(CronExpression.EVERY_MINUTE)
  async releaseExpiredBookings(): Promise<{ releasedCount: number }> {
    const nowIso = new Date().toISOString()

    const expiredBookings = await this.db
      .select({
        id: stayeaBookingsTable.id,
        bookingCode: stayeaBookingsTable.bookingCode,
      })
      .from(stayeaBookingsTable)
      .where(
        and(
          eq(stayeaBookingsTable.status, "pending"),
          eq(stayeaBookingsTable.paymentStatus, "unpaid"),
          sql`(${stayeaBookingsTable.details}->'metadata'->>'expiresAt') IS NOT NULL`,
          sql`(${stayeaBookingsTable.details}->'metadata'->>'expiresAt') < ${nowIso}`
        )
      )

    if (expiredBookings.length === 0) {
      return { releasedCount: 0 }
    }

    const ids = expiredBookings.map((b) => b.id)

    await this.db
      .update(stayeaBookingsTable)
      .set({
        status: "cancelled",
        updatedAt: new Date(),
      })
      .where(inArray(stayeaBookingsTable.id, ids))

    this.logger.log(
      `Released ${ids.length} expired reservations: ${expiredBookings.map((b) => b.bookingCode).join(", ")}`
    )

    return { releasedCount: ids.length }
  }

  /**
   * Real-time financial aggregation & revenue trends for Admin Control Plane
   */
  async getRevenueAnalytics(days = 7) {
    const windowDays = Math.max(1, Math.min(days, 90))
    const startDate = dayjs().subtract(windowDays - 1, "day").startOf("day")

    // Fetch all bookings in range
    const bookings = await this.db
      .select({
        id: stayeaBookingsTable.id,
        createdAt: stayeaBookingsTable.createdAt,
        finalAmount: stayeaBookingsTable.finalAmount,
        currency: stayeaBookingsTable.currency,
        status: stayeaBookingsTable.status,
        paymentStatus: stayeaBookingsTable.paymentStatus,
        serviceType: stayeaBookingsTable.bookingType,
      })
      .from(stayeaBookingsTable)
      .where(sql`${stayeaBookingsTable.createdAt} >= ${startDate.toDate()}`)
      .orderBy(asc(stayeaBookingsTable.createdAt))

    // Build day buckets map for continuous timeline
    const bucketsMap = new Map<
      string,
      {
        date: string
        fullDate: string
        totalRevenue: number
        paidRevenue: number
        bookingCount: number
      }
    >()

    for (let i = 0; i < windowDays; i++) {
      const d = startDate.add(i, "day")
      const key = d.format("YYYY-MM-DD")
      bucketsMap.set(key, {
        date: d.format("DD/MM"),
        fullDate: d.format("DD/MM/YYYY"),
        totalRevenue: 0,
        paidRevenue: 0,
        bookingCount: 0,
      })
    }

    let grandTotal = 0
    let grandPaid = 0
    let grandPending = 0

    const categoryMap = new Map<string, number>()
    const statusMap = new Map<string, number>()

    for (const b of bookings) {
      const bDate = dayjs(b.createdAt).format("YYYY-MM-DD")
      const amt = Number(b.finalAmount) || 0
      const isPaid = b.paymentStatus === "paid"

      grandTotal += amt
      if (isPaid) grandPaid += amt
      else grandPending += amt

      const bucket = bucketsMap.get(bDate)
      if (bucket) {
        bucket.totalRevenue += amt
        if (isPaid) bucket.paidRevenue += amt
        bucket.bookingCount += 1
      }

      // Categories
      const cat = b.serviceType || "stay"
      categoryMap.set(cat, (categoryMap.get(cat) || 0) + amt)

      // Status
      const st = b.status || "pending"
      statusMap.set(st, (statusMap.get(st) || 0) + 1)
    }

    const fmtVnd = (num: number) =>
      new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(num)

    const timeline = Array.from(bucketsMap.values()).map((p) => ({
      date: p.date,
      fullDate: p.fullDate,
      revenue: p.totalRevenue / 1_000_000,
      rawRevenue: p.totalRevenue,
      paidRevenue: p.paidRevenue,
      totalRevenue: p.totalRevenue,
      bookingCount: p.bookingCount,
      displayAmount: fmtVnd(p.totalRevenue),
      totalFormatted: fmtVnd(p.totalRevenue),
      paidFormatted: fmtVnd(p.paidRevenue),
    }))

    const platformCommission = Math.round(grandTotal * 0.12)

    return {
      windowDays,
      timeline,
      kpis: {
        totalBookings: bookings.length,
        totalRevenue: grandTotal,
        totalRevenueFormatted: fmtVnd(grandTotal),
        paidRevenue: grandPaid,
        paidRevenueFormatted: fmtVnd(grandPaid),
        pendingRevenue: grandPending,
        pendingRevenueFormatted: fmtVnd(grandPending),
        platformCommission,
        platformCommissionFormatted: fmtVnd(platformCommission),
      },
      categoryBreakdown: Array.from(categoryMap.entries()).map(([cat, val]) => ({
        category: cat,
        value: val,
        formattedValue: fmtVnd(val),
        percent: grandTotal > 0 ? Math.round((val / grandTotal) * 100) : 0,
      })),
      statusBreakdown: Array.from(statusMap.entries()).map(([st, count]) => ({
        status: st,
        count,
        percent: bookings.length > 0 ? Math.round((count / bookings.length) * 100) : 0,
      })),
    }
  }
}
