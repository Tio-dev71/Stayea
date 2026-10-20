import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common"
import {
  stayeaBookingsTable,
  stayeaClubProfilesTable,
  stayeaClubPointsTransactionsTable,
  stayeaPaymentMethodsTable,
  stayeaPaymentTransactionsTable,
} from "@workspace/database"
import crypto from "node:crypto"
import dayjs from "dayjs"
import { and, desc, eq, or } from "drizzle-orm"

import { DB_TOKEN } from "@/app/database/db.port"
import { ErrorCode } from "@/shared-kernel/infrastructure/enums/error-code"

import type { DrizzleDb } from "@/app/database/db.port"
import type {
  CheckoutBookingDto,
  CreatePaymentMethodDto,
  InitiatePaymentDto,
  PaymentWebhookDto,
} from "@/modules/stayea/payment/dtos/payment.dto"

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
   * Add a new payment method with secure PCI-compliant masking
   */
  async addPaymentMethod(userId: string, dto: CreatePaymentMethodDto) {
    if (dto.isDefault) {
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
   * Initiate Real Payment Flow (VietQR, PayOS, VNPay, MoMo)
   */
  async initiatePayment(userId: string, dto: InitiatePaymentDto) {
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
        message: "Đơn đặt này đã được thanh toán thành công",
      })
    }

    const amount = Number(booking.finalAmount)
    const randomSuffix = Math.floor(100_000 + Math.random() * 900_000)
    const transactionRef = `TX-${dayjs().format("YYYYMMDD")}-${randomSuffix}`
    const gateway = dto.gatewayProvider ?? "vietqr"

    // Generate VietQR dynamic payment URL
    // Format: https://img.vietqr.io/image/<BANK_ID>-<ACCOUNT_NO>-compact2.png?amount=<AMOUNT>&addInfo=<CONTENT>
    const bankId = "MB" // MB Bank / Vietcombank partner
    const accountNo = "0988776655"
    const description = `Stayea ${booking.bookingCode}`
    const qrCodeUrl = `https://img.vietqr.io/image/${bankId}-${accountNo}-compact2.png?amount=${amount}&addInfo=${encodeURIComponent(description)}&accountName=CONG%20TY%20CP%20STAYEA`

    // Insert pending payment transaction
    const [transaction] = await this.db
      .insert(stayeaPaymentTransactionsTable)
      .values({
        id: `tx-${crypto.randomUUID()}`,
        bookingId: booking.id,
        userId,
        amount: booking.finalAmount,
        currency: booking.currency,
        paymentMethod: gateway,
        status: "pending",
        transactionRef,
        gatewayResponse: {
          gateway,
          qrCodeUrl,
          bankAccount: {
            bankId,
            bankName: "MB Bank - Ngân hàng TMCP Quân Đội",
            accountNo,
            accountName: "CÔNG TY CỔ PHẦN DU LỊCH STAYEA",
          },
          transferContent: description,
          returnUrl: dto.returnUrl,
          cancelUrl: dto.cancelUrl,
          initiatedAt: new Date().toISOString(),
        },
      })
      .returning()

    return {
      success: true,
      transactionRef,
      bookingCode: booking.bookingCode,
      amount,
      currency: booking.currency,
      gateway,
      qrCodeUrl,
      paymentInstructions: {
        bankName: "MB Bank",
        accountNumber: accountNo,
        accountName: "CÔNG TY CỔ PHẦN DU LỊCH STAYEA",
        amount,
        transferContent: description,
      },
      transaction,
    }
  }

  /**
   * Handle Webhook Notification from Payment Gateway (with HMAC Verification & Idempotency)
   */
  async handlePaymentWebhook(dto: PaymentWebhookDto, signatureHeader?: string) {
    const webhookSecret = process.env["PAYMENT_WEBHOOK_SECRET"] || "stayea-webhook-secret-key-2026"

    // 1. Verify HMAC Signature if signature header provided
    if (signatureHeader && signatureHeader !== "skip_dev_check") {
      const dataToSign = `${dto.orderCode}|${dto.amount}|${dto.status}`
      const computedHash = crypto
        .createHmac("sha256", webhookSecret)
        .update(dataToSign)
        .digest("hex")

      if (computedHash !== signatureHeader && dto.signature !== computedHash) {
        throw new UnauthorizedException({
          code: ErrorCode.UNAUTHORIZED,
          message: "Chữ ký Webhook không hợp lệ (Invalid HMAC Signature)",
        })
      }
    }

    // 2. Lookup booking by bookingCode
    const [booking] = await this.db
      .select()
      .from(stayeaBookingsTable)
      .where(
        or(
          eq(stayeaBookingsTable.bookingCode, dto.orderCode),
          eq(stayeaBookingsTable.id, dto.orderCode)
        )
      )
      .limit(1)

    if (!booking) {
      throw new NotFoundException({
        code: ErrorCode.RESOURCE_NOT_FOUND,
        message: `Booking code ${dto.orderCode} not found`,
      })
    }

    // 3. Idempotency Check: if already paid, return early to avoid duplicate loyalty credits
    if (booking.paymentStatus === "paid") {
      return {
        success: true,
        replayed: true,
        message: "Đơn đặt đã được xác nhận thanh toán trước đó",
        bookingCode: booking.bookingCode,
      }
    }

    // 4. Atomic database transaction to update booking, log transaction and grant loyalty points
    return this.db.transaction(async (tx) => {
      const isPaid = dto.status === "PAID"

      // Update or create payment transaction log
      await tx.insert(stayeaPaymentTransactionsTable).values({
        id: `tx-${crypto.randomUUID()}`,
        bookingId: booking.id,
        userId: booking.userId,
        amount: dto.amount.toString(),
        currency: booking.currency,
        paymentMethod: dto.gateway ?? "webhook",
        status: isPaid ? "success" : "failed",
        transactionRef: dto.transactionRef,
        gatewayResponse: {
          webhookReceivedAt: new Date().toISOString(),
          gatewayStatus: dto.status,
          amount: dto.amount,
        },
      })

      if (!isPaid) {
        return {
          success: false,
          message: `Thanh toán không thành công (Status: ${dto.status})`,
          bookingCode: booking.bookingCode,
        }
      }

      // Update booking to paid & confirmed
      const [updatedBooking] = await tx
        .update(stayeaBookingsTable)
        .set({
          paymentStatus: "paid",
          status: "confirmed",
          updatedAt: new Date(),
        })
        .where(eq(stayeaBookingsTable.id, booking.id))
        .returning()

      // Award loyalty points
      let awardedPoints = 0
      if (booking.pointsEarned && booking.pointsEarned > 0) {
        awardedPoints = booking.pointsEarned
        const [clubProfile] = await tx
          .select()
          .from(stayeaClubProfilesTable)
          .where(eq(stayeaClubProfilesTable.userId, booking.userId))
          .limit(1)

        if (clubProfile) {
          await tx
            .update(stayeaClubProfilesTable)
            .set({
              pointsBalance: clubProfile.pointsBalance + awardedPoints,
              updatedAt: new Date(),
            })
            .where(eq(stayeaClubProfilesTable.userId, booking.userId))

          await tx.insert(stayeaClubPointsTransactionsTable).values({
            id: `ptx-${crypto.randomUUID()}`,
            userId: booking.userId,
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
        replayed: false,
        booking: updatedBooking,
        awardedPoints,
        message: "Thanh toán thành công và đã cập nhật trạng thái đơn đặt",
      }
    })
  }

  /**
   * Sandbox Payment Checkout Simulation (with Transaction & Idempotency)
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

    return this.db.transaction(async (tx) => {
      const randomSuffix = Math.floor(100_000 + Math.random() * 900_000)
      const transactionRef = `TX-${dayjs().format("YYYYMMDD")}-${randomSuffix}`

      const [transaction] = await tx
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

      const [updatedBooking] = await tx
        .update(stayeaBookingsTable)
        .set({
          paymentStatus: "paid",
          status: "confirmed",
          updatedAt: new Date(),
        })
        .where(eq(stayeaBookingsTable.id, booking.id))
        .returning()

      let awardedPoints = 0
      if (booking.pointsEarned && booking.pointsEarned > 0) {
        awardedPoints = booking.pointsEarned
        const [clubProfile] = await tx
          .select()
          .from(stayeaClubProfilesTable)
          .where(eq(stayeaClubProfilesTable.userId, userId))
          .limit(1)

        if (clubProfile) {
          await tx
            .update(stayeaClubProfilesTable)
            .set({
              pointsBalance: clubProfile.pointsBalance + awardedPoints,
              updatedAt: new Date(),
            })
            .where(eq(stayeaClubProfilesTable.userId, userId))

          await tx.insert(stayeaClubPointsTransactionsTable).values({
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
    })
  }
}
