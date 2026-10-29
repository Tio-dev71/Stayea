import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common"
import {
  stayeaAccommodationsTable,
  stayeaBookingsTable,
  stayeaClubProfilesTable,
  stayeaClubPointsTransactionsTable,
  stayeaExperiencesTable,
  stayeaPromotionsTable,
  stayeaUserVouchersTable,
  partnerOrdersTable,
  partnerProfilesTable,
} from "@workspace/database"
import dayjs from "dayjs"
import { and, desc, eq, ilike, ne, or, sql } from "drizzle-orm"

import { DB_TOKEN } from "@/app/database/db.port"
import { ErrorCode } from "@/shared-kernel/infrastructure/enums/error-code"

import type { DrizzleDb } from "@/app/database/db.port"
import type { BookingQueryDto, CreateBookingDto } from "@/modules/stayea/booking/dtos/booking.dto"

@Injectable()
export class StayeaBookingService {
  constructor(@Inject(DB_TOKEN) private readonly db: DrizzleDb) {}

  /**
   * Create a new unified booking across Stays, Flights, Experiences, Packages
   * Protected with:
   * - Double-booking collision checks
   * - Server-side price verification
   * - Atomic DB transaction for point deduction, vouchers, and booking insertion
   */
  async createBooking(userId: string, dto: CreateBookingDto) {
    // 1. Prevent Double-Booking collisions on Stays
    if (dto.bookingType === "stay" && dto.details?.stayId) {
      const conflictingBookings = await this.db
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
          message: `Chỗ nghỉ này đã có khách đặt từ ${conflict.startDate} đến ${conflict.endDate}. Vui lòng chọn ngày khác.`,
        })
      }
    }

    // 2. Server-side price validation to prevent price tampering
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

    // 3. Execute atomic creation inside a database transaction
    return this.db.transaction(async (tx) => {
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
          status: "confirmed",
          paymentStatus: "unpaid",
          paymentMethod: dto.paymentMethod ?? "credit_card",
          totalAmount: verifiedTotal.toString(),
          discountAmount: totalDiscount.toString(),
          finalAmount: finalAmount.toString(),
          currency: "VND",
          voucherCode: validatedVoucherCode,
          pointsUsed,
          pointsEarned,
          details: dto.details ?? {},
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
        const partnerBusinessType =
          dto.bookingType === "stay"
            ? "homestay"
            : dto.bookingType === "experience" || dto.bookingType === "combo"
            ? "tour"
            : "transport"

        const [matchedPartner] = await tx
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

        const fallbackPartnerId =
          dto.bookingType === "stay"
            ? "ptn_sunshine_01"
            : dto.bookingType === "experience"
            ? "ptn_tour_01"
            : "ptn_carrent_01"

        const targetPartnerId = matchedPartner?.id || fallbackPartnerId
        const commissionRate = matchedPartner?.commissionRate
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
          adminNotes: `Đơn đặt dịch vụ trực tuyến từ website (Mã booking: ${bookingCode})`,
        })
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
   */
  async updateStatus(id: string, status: "pending" | "confirmed" | "completed" | "cancelled" | "refunded") {
    const [updated] = await this.db
      .update(stayeaBookingsTable)
      .set({
        status,
        updatedAt: new Date(),
      })
      .where(eq(stayeaBookingsTable.id, id))
      .returning()

    if (!updated) {
      throw new NotFoundException({
        code: ErrorCode.RESOURCE_NOT_FOUND,
        message: `Booking ${id} not found`,
      })
    }

    return updated
  }
}
