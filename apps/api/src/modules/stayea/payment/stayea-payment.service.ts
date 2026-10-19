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
  stayeaPaymentMethodsTable,
  stayeaPaymentTransactionsTable,
} from "@workspace/database"
import dayjs from "dayjs"
import { and, desc, eq } from "drizzle-orm"

import { DB_TOKEN } from "@/app/database/db.port"
import { ErrorCode } from "@/shared-kernel/infrastructure/enums/error-code"

import type { DrizzleDb } from "@/app/database/db.port"
import type { CheckoutBookingDto, CreatePaymentMethodDto } from "@/modules/stayea/payment/dtos/payment.dto"

@Injectable()
export class StayeaPaymentService {
  constructor(@Inject(DB_TOKEN) private readonly db: DrizzleDb) {}

  /**
   * Get all user saved payment methods
   */
  async getPaymentMethods(userId: string) {
    return this.db
      .select()
      .from(stayeaPaymentMethodsTable)
      .where(eq(stayeaPaymentMethodsTable.userId, userId))
      .orderBy(desc(stayeaPaymentMethodsTable.isDefault))
  }

  /**
   * Add a new payment method with secure masking
   */
  async addPaymentMethod(userId: string, dto: CreatePaymentMethodDto) {
    if (dto.isDefault) {
      // Clear current default
      await this.db
        .update(stayeaPaymentMethodsTable)
        .set({ isDefault: false })
        .where(eq(stayeaPaymentMethodsTable.userId, userId))
    }

    const details = dto.details ?? {}
    const rawCard = details.cardNumber?.replaceAll(" ", "") || ""
    const maskedCard = rawCard.length >= 4 ? `•••• ${rawCard.slice(-4)}` : "•••• 8899"
    const rawAcc = details.accountNumber?.replaceAll(" ", "") || ""
    const maskedAcc = rawAcc.length >= 4 ? `•••• ${rawAcc.slice(-4)}` : undefined

    const [created] = await this.db
      .insert(stayeaPaymentMethodsTable)
      .values({
        id: `pm-${crypto.randomUUID()}`,
        userId,
        type: dto.type,
        brand: dto.brand.toLowerCase(),
        title: dto.title,
        isDefault: dto.isDefault ?? false,
        details: {
          cardHolder: details.cardHolder,
          cardNumberMasked: maskedCard,
          expDate: details.expDate,
          bankName: details.bankName,
          accountNumberMasked: maskedAcc,
          walletProvider: details.walletProvider,
          phoneNumberMasked: details.phoneNumber,
        },
      })
      .returning()

    return created
  }

  /**
   * Delete payment method
   */
  async deletePaymentMethod(userId: string, id: string) {
    const [deleted] = await this.db
      .delete(stayeaPaymentMethodsTable)
      .where(
        and(
          eq(stayeaPaymentMethodsTable.userId, userId),
          eq(stayeaPaymentMethodsTable.id, id)
        )
      )
      .returning()

    if (!deleted) {
      throw new NotFoundException({
        code: ErrorCode.RESOURCE_NOT_FOUND,
        message: `Payment method ${id} not found`,
      })
    }

    return { success: true, id: deleted.id }
  }

  /**
   * Set default payment method
   */
  async setDefaultPaymentMethod(userId: string, id: string) {
    await this.db
      .update(stayeaPaymentMethodsTable)
      .set({ isDefault: false })
      .where(eq(stayeaPaymentMethodsTable.userId, userId))

    const [updated] = await this.db
      .update(stayeaPaymentMethodsTable)
      .set({ isDefault: true, updatedAt: new Date() })
      .where(
        and(
          eq(stayeaPaymentMethodsTable.userId, userId),
          eq(stayeaPaymentMethodsTable.id, id)
        )
      )
      .returning()

    if (!updated) {
      throw new NotFoundException({
        code: ErrorCode.RESOURCE_NOT_FOUND,
        message: `Payment method ${id} not found`,
      })
    }

    return updated
  }

  /**
   * Sandbox Payment Checkout Simulation
   *
   * Validates booking, marks as paid, creates transaction log, awards club points!
   */
  async processCheckout(userId: string, dto: CheckoutBookingDto) {
    const [booking] = await this.db
      .select()
      .from(stayeaBookingsTable)
      .where(
        and(
          eq(stayeaBookingsTable.userId, userId),
          eq(stayeaBookingsTable.id, dto.bookingId)
        )
      )
      .limit(1)

    if (!booking) {
      throw new NotFoundException({
        code: ErrorCode.RESOURCE_NOT_FOUND,
        message: `Booking ${dto.bookingId} not found`,
      })
    }

    if (booking.paymentStatus === "paid") {
      throw new BadRequestException({
        code: ErrorCode.BAD_REQUEST,
        message: "Đơn đặt này đã được thanh toán",
      })
    }

    const randomSuffix = Math.floor(100_000 + Math.random() * 900_000)
    const transactionRef = `TX-${dayjs().format("YYYYMMDD")}-${randomSuffix}`

    // 1. Record transaction log
    const [transaction] = await this.db
      .insert(stayeaPaymentTransactionsTable)
      .values({
        id: `tx-${crypto.randomUUID()}`,
        bookingId: booking.id,
        userId,
        amount: booking.finalAmount,
        currency: booking.currency,
        paymentMethod: dto.paymentMethodType ?? booking.paymentMethod ?? "credit_card",
        status: "success",
        transactionRef,
        gatewayResponse: {
          gateway: "stayea-sandbox-pay",
          authorizedAt: new Date().toISOString(),
          paymentMethodId: dto.paymentMethodId ?? null,
        },
      })
      .returning()

    // 2. Update booking paymentStatus
    const [updatedBooking] = await this.db
      .update(stayeaBookingsTable)
      .set({
        paymentStatus: "paid",
        status: "confirmed",
        updatedAt: new Date(),
      })
      .where(eq(stayeaBookingsTable.id, booking.id))
      .returning()

    // 3. Award loyalty points if booking has pointsEarned
    let awardedPoints = 0
    if (booking.pointsEarned && booking.pointsEarned > 0) {
      awardedPoints = booking.pointsEarned
      const [clubProfile] = await this.db
        .select()
        .from(stayeaClubProfilesTable)
        .where(eq(stayeaClubProfilesTable.userId, userId))
        .limit(1)

      if (clubProfile) {
        await this.db
          .update(stayeaClubProfilesTable)
          .set({
            pointsBalance: clubProfile.pointsBalance + awardedPoints,
            updatedAt: new Date(),
          })
          .where(eq(stayeaClubProfilesTable.userId, userId))

        await this.db.insert(stayeaClubPointsTransactionsTable).values({
          id: `ptx-${crypto.randomUUID()}`,
          userId,
          points: awardedPoints,
          type: "earned",
          title: `Tích điểm thanh toán: ${booking.title}`,
          description: `Thanh toán thành công ${Number(booking.finalAmount).toLocaleString("vi-VN")} VND`,
          bookingId: booking.id,
        })
      }
    }

    return {
      success: true,
      transactionRef,
      transaction,
      booking: updatedBooking,
      awardedPoints,
    }
  }
}
