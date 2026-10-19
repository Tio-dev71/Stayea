import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common"
import {
  stayeaBookingsTable,
  stayeaClubProfilesTable,
  stayeaClubPointsTransactionsTable,
  stayeaPromotionsTable,
  stayeaUserVouchersTable,
} from "@workspace/database"
import dayjs from "dayjs"
import { and, desc, eq } from "drizzle-orm"

import { DB_TOKEN } from "@/app/database/db.port"
import { ErrorCode } from "@/shared-kernel/infrastructure/enums/error-code"

import type { DrizzleDb } from "@/app/database/db.port"
import type { BookingQueryDto, CreateBookingDto } from "@/modules/stayea/booking/dtos/booking.dto"

@Injectable()
export class StayeaBookingService {
  constructor(@Inject(DB_TOKEN) private readonly db: DrizzleDb) {}

  /**
   * Create a new unified booking across Stays, Flights, Experiences, Packages
   */
  async createBooking(userId: string, dto: CreateBookingDto) {
    let voucherDiscount = 0
    let pointsDiscount = 0
    let validatedVoucherCode: string | null = null

    // 1. Process voucher discount if code supplied
    if (dto.voucherCode) {
      const cleanCode = dto.voucherCode.trim().toUpperCase()
      const [promo] = await this.db
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
          const calc = (dto.totalAmount * discountVal) / 100
          const maxDisc = promo.maxDiscount ? Number(promo.maxDiscount) : Infinity
          voucherDiscount = Math.min(calc, maxDisc)
        } else {
          voucherDiscount = Math.min(discountVal, dto.totalAmount)
        }
        validatedVoucherCode = promo.code
      }
    }

    // 2. Process points redemption (1 point = 1,000 VND)
    let pointsUsed = 0
    if (dto.pointsToRedeem && dto.pointsToRedeem > 0) {
      const [clubProfile] = await this.db
        .select()
        .from(stayeaClubProfilesTable)
        .where(eq(stayeaClubProfilesTable.userId, userId))
        .limit(1)

      if (clubProfile && clubProfile.pointsBalance >= dto.pointsToRedeem) {
        pointsUsed = dto.pointsToRedeem
        pointsDiscount = pointsUsed * 1000

        // Deduct points from user club profile
        await this.db
          .update(stayeaClubProfilesTable)
          .set({
            pointsBalance: clubProfile.pointsBalance - pointsUsed,
          })
          .where(eq(stayeaClubProfilesTable.userId, userId))

        // Record transaction
        await this.db.insert(stayeaClubPointsTransactionsTable).values({
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
    const finalAmount = Math.max(0, dto.totalAmount - totalDiscount)
    // Points earned on completion: 1 point per 50,000 VND spent
    const pointsEarned = Math.floor(finalAmount / 50_000)

    const bookingId = `bk-${crypto.randomUUID()}`
    const randomSuffix = Math.floor(1000 + Math.random() * 9000)
    const bookingCode = `STA-${dayjs().format("YYYYMM")}-${randomSuffix}`

    const [newBooking] = await this.db
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
        status: "confirmed", // auto-confirm in Stayea
        paymentStatus: "unpaid",
        paymentMethod: dto.paymentMethod ?? "credit_card",
        totalAmount: dto.totalAmount.toString(),
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
      await this.db
        .update(stayeaUserVouchersTable)
        .set({ isUsed: true, usedAt: new Date() })
        .where(
          and(
            eq(stayeaUserVouchersTable.userId, userId),
            eq(stayeaUserVouchersTable.code, validatedVoucherCode)
          )
        )
    }

    return newBooking
  }

  /**
   * Find user bookings with optional status or type filter
   */
  async findUserBookings(userId: string, query: BookingQueryDto) {
    const conditions = [eq(stayeaBookingsTable.userId, userId)]

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
   * Get booking details by ID or bookingCode
   */
  async findBookingById(userId: string, idOrCode: string) {
    const [booking] = await this.db
      .select()
      .from(stayeaBookingsTable)
      .where(
        and(
          eq(stayeaBookingsTable.userId, userId),
          eq(stayeaBookingsTable.id, idOrCode)
        )
      )
      .limit(1)

    if (booking) return booking

    // Try by code
    const [bookingByCode] = await this.db
      .select()
      .from(stayeaBookingsTable)
      .where(
        and(
          eq(stayeaBookingsTable.userId, userId),
          eq(stayeaBookingsTable.bookingCode, idOrCode)
        )
      )
      .limit(1)

    if (!bookingByCode) {
      throw new NotFoundException({
        code: ErrorCode.RESOURCE_NOT_FOUND,
        message: `Booking ${idOrCode} not found`,
      })
    }

    return bookingByCode
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
