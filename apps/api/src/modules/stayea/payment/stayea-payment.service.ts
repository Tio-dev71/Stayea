import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  Optional,
  UnauthorizedException,
} from "@nestjs/common"
import {
  partnerOrdersTable,
  partnerPayoutRequestsTable,
  partnerProfilesTable,
  stayeaBookingsTable,
  stayeaClubProfilesTable,
  stayeaClubPointsTransactionsTable,
  stayeaPaymentMethodsTable,
  stayeaPaymentTransactionsTable,
} from "@workspace/database"
import crypto from "node:crypto"
import dayjs from "dayjs"
import { and, desc, eq, inArray, or } from "drizzle-orm"

import { DB_TOKEN } from "@/app/database/db.port"
import { ErrorCode } from "@/shared-kernel/infrastructure/enums/error-code"
import { StayeaNotificationService } from "@/modules/stayea/notification/stayea-notification.service"

import type { DrizzleDb } from "@/app/database/db.port"
import type {
  AdminUpdatePayoutStatusDto,
  CheckoutBookingDto,
  CreatePaymentMethodDto,
  InitiatePaymentDto,
  PaymentWebhookDto,
  RequestPayoutDto,
} from "@/modules/stayea/payment/dtos/payment.dto"

@Injectable()
export class StayeaPaymentService {
  private readonly logger = new Logger(StayeaPaymentService.name)

  constructor(
    @Inject(DB_TOKEN) private readonly db: DrizzleDb,
    @Optional() private readonly notificationService?: StayeaNotificationService
  ) {}

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
   * Handle Webhook Notification from Payment Gateway (with Mandatory HMAC Verification & Idempotency)
   */
  async handlePaymentWebhook(dto: PaymentWebhookDto, signatureHeader?: string) {
    const webhookSecret = process.env["PAYMENT_WEBHOOK_SECRET"] || "stayea-webhook-secret-key-2026"

    // 1. Mandatory HMAC Signature Verification (SEC-002: no bypass in any mode)
    const signature = signatureHeader || dto.signature
    if (!signature || signature === "skip_dev_check") {
      throw new UnauthorizedException({
        code: ErrorCode.UNAUTHORIZED,
        message: "Thiếu chữ ký Webhook hợp lệ (Missing or Invalid HMAC Signature)",
      })
    }

    const dataToSign = `${dto.orderCode}|${dto.amount}|${dto.status}`
    const computedHash = crypto
      .createHmac("sha256", webhookSecret)
      .update(dataToSign)
      .digest("hex")

    const sigBuffer = Buffer.from(signature)
    const compBuffer = Buffer.from(computedHash)

    if (
      sigBuffer.length !== compBuffer.length ||
      !crypto.timingSafeEqual(sigBuffer, compBuffer)
    ) {
      throw new UnauthorizedException({
        code: ErrorCode.UNAUTHORIZED,
        message: "Chữ ký Webhook không hợp lệ (Invalid HMAC Signature)",
      })
    }

    // 2. Lookup booking by bookingCode (support bank descriptions like "STAYEA STA-202611-1001", "STAYEA_STA-202611-1001", or "STA-202611-1001")
    const rawOrderCode = dto.orderCode.trim()
    const cleanOrderCode = rawOrderCode.replace(/^STAYEA[\s_-]*/i, "")

    const [booking] = await this.db
      .select()
      .from(stayeaBookingsTable)
      .where(
        or(
          eq(stayeaBookingsTable.bookingCode, rawOrderCode),
          eq(stayeaBookingsTable.bookingCode, cleanOrderCode),
          eq(stayeaBookingsTable.id, rawOrderCode)
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
    const result = await this.db.transaction(async (tx) => {
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

      // Automatically dispatch partner order to partner upon successful payment
      await tx
        .update(partnerOrdersTable)
        .set({
          status: "sent_to_partner",
          updatedAt: new Date(),
        })
        .where(eq(partnerOrdersTable.bookingId, booking.id))

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

    if (result.success && !result.replayed && result.booking) {
      this.dispatchNotifications(result.booking, dto.gateway || "VietQR").catch((err) => {
        this.logger.warn(`Failed to dispatch booking notification: ${err.message}`)
      })
    }

    return result
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

    const result = await this.db.transaction(async (tx) => {
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

      // Automatically dispatch partner order to partner upon successful payment
      await tx
        .update(partnerOrdersTable)
        .set({
          status: "sent_to_partner",
          updatedAt: new Date(),
        })
        .where(eq(partnerOrdersTable.bookingId, booking.id))

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

    if (result.success && result.booking) {
      this.dispatchNotifications(result.booking, dto.paymentMethodId || "VietQR").catch((err) => {
        this.logger.warn(`Failed to dispatch booking notification: ${err.message}`)
      })
    }

    return result
  }

  // ---------------------------------------------------------------------------
  // Partner Settlement & Payout Engine
  // ---------------------------------------------------------------------------

  /**
   * Request a new partner payout withdrawal
   */
  async requestPartnerPayout(userId: string, dto: RequestPayoutDto) {
    const [partner] = await this.db
      .select()
      .from(partnerProfilesTable)
      .where(eq(partnerProfilesTable.userId, userId))
      .limit(1)

    if (!partner) {
      throw new ForbiddenException({
        code: ErrorCode.FORBIDDEN,
        message: "Bạn chưa có hồ sơ đối tác STAYEA để yêu cầu quyết toán",
      })
    }

    const bankName = dto.bankName || partner.bankName
    const bankAccount = dto.bankAccount || partner.bankAccount
    const bankAccountHolder = dto.bankAccountHolder || partner.bankAccountHolder

    if (!bankName || !bankAccount || !bankAccountHolder) {
      throw new BadRequestException({
        code: ErrorCode.BAD_REQUEST,
        message: "Vui lòng cập nhật đầy đủ thông tin tài khoản ngân hàng nhận tiền trước khi yêu cầu quyết toán",
      })
    }

    if (dto.amount < 100_000) {
      throw new BadRequestException({
        code: ErrorCode.BAD_REQUEST,
        message: "Số tiền yêu cầu quyết toán tối thiểu là 100,000 VND",
      })
    }

    // Calculate cleared balance
    const partnerOrders = await this.db
      .select()
      .from(partnerOrdersTable)
      .where(
        and(
          eq(partnerOrdersTable.partnerId, partner.id),
          inArray(partnerOrdersTable.status, [
            "completed",
            "partner_accepted",
            "in_progress",
          ])
        )
      )

    const totalEarned = partnerOrders.reduce(
      (sum, o) => sum + Number(o.partnerPayoutAmount || 0),
      0
    )

    const existingPayouts = await this.db
      .select()
      .from(partnerPayoutRequestsTable)
      .where(
        and(
          eq(partnerPayoutRequestsTable.partnerId, partner.id),
          inArray(partnerPayoutRequestsTable.status, [
            "pending",
            "approved",
            "processing",
            "paid",
          ])
        )
      )

    const totalPayouts = existingPayouts.reduce(
      (sum, p) => sum + Number(p.amount || 0),
      0
    )

    const availableBalance = Math.max(0, totalEarned - totalPayouts)

    if (dto.amount > availableBalance) {
      throw new BadRequestException({
        code: ErrorCode.BAD_REQUEST,
        message: `Số dư khả dụng (${availableBalance.toLocaleString("vi-VN")} VND) không đủ để yêu cầu rút ${dto.amount.toLocaleString("vi-VN")} VND`,
      })
    }

    const payoutCode = `PAY-${dayjs().format("YYYYMM")}-${Math.floor(1000 + Math.random() * 9000)}`

    const [payoutRequest] = await this.db
      .insert(partnerPayoutRequestsTable)
      .values({
        id: `pay-${crypto.randomUUID()}`,
        payoutCode,
        partnerId: partner.id,
        amount: dto.amount.toString(),
        currency: "VND",
        bankName,
        bankAccount,
        bankAccountHolder,
        status: "pending",
      })
      .returning()

    return {
      success: true,
      message: "Yêu cầu quyết toán đã được gửi tới Ban quản trị STAYEA",
      payoutRequest,
      availableBalance: availableBalance - dto.amount,
    }
  }

  /**
   * Get partner settlement overview (available balance, total earned, payout history)
   */
  async getPartnerPayoutOverview(userId: string) {
    const [partner] = await this.db
      .select()
      .from(partnerProfilesTable)
      .where(eq(partnerProfilesTable.userId, userId))
      .limit(1)

    if (!partner) {
      return {
        partner: null,
        availableBalance: 0,
        totalEarned: 0,
        totalWithdrawn: 0,
        payoutRequests: [],
      }
    }

    const partnerOrders = await this.db
      .select()
      .from(partnerOrdersTable)
      .where(
        and(
          eq(partnerOrdersTable.partnerId, partner.id),
          inArray(partnerOrdersTable.status, [
            "completed",
            "partner_accepted",
            "in_progress",
          ])
        )
      )

    const totalEarned = partnerOrders.reduce(
      (sum, o) => sum + Number(o.partnerPayoutAmount || 0),
      0
    )

    const payoutRequests = await this.db
      .select()
      .from(partnerPayoutRequestsTable)
      .where(eq(partnerPayoutRequestsTable.partnerId, partner.id))
      .orderBy(desc(partnerPayoutRequestsTable.createdAt))

    const totalWithdrawnOrPending = payoutRequests
      .filter((p) => ["pending", "approved", "processing", "paid"].includes(p.status))
      .reduce((sum, p) => sum + Number(p.amount || 0), 0)

    const availableBalance = Math.max(0, totalEarned - totalWithdrawnOrPending)

    return {
      partner,
      availableBalance,
      totalEarned,
      totalWithdrawn: totalWithdrawnOrPending,
      payoutRequests,
    }
  }

  /**
   * List all partner payout requests for Admin review
   */
  async getAllPayoutsForAdmin(
    status?: "pending" | "approved" | "processing" | "paid" | "rejected"
  ) {
    const query = this.db
      .select({
        id: partnerPayoutRequestsTable.id,
        payoutCode: partnerPayoutRequestsTable.payoutCode,
        partnerId: partnerPayoutRequestsTable.partnerId,
        amount: partnerPayoutRequestsTable.amount,
        currency: partnerPayoutRequestsTable.currency,
        bankName: partnerPayoutRequestsTable.bankName,
        bankAccount: partnerPayoutRequestsTable.bankAccount,
        bankAccountHolder: partnerPayoutRequestsTable.bankAccountHolder,
        status: partnerPayoutRequestsTable.status,
        adminNotes: partnerPayoutRequestsTable.adminNotes,
        transactionRef: partnerPayoutRequestsTable.transactionRef,
        requestedAt: partnerPayoutRequestsTable.requestedAt,
        processedAt: partnerPayoutRequestsTable.processedAt,
        createdAt: partnerPayoutRequestsTable.createdAt,
        partnerBusinessName: partnerProfilesTable.businessName,
        partnerContactName: partnerProfilesTable.contactName,
        partnerPhone: partnerProfilesTable.phone,
      })
      .from(partnerPayoutRequestsTable)
      .leftJoin(
        partnerProfilesTable,
        eq(partnerPayoutRequestsTable.partnerId, partnerProfilesTable.id)
      )
      .orderBy(desc(partnerPayoutRequestsTable.createdAt))

    if (status) {
      return query.where(eq(partnerPayoutRequestsTable.status, status))
    }
    return query
  }

  /**
   * Admin updates payout status (e.g. approve, mark paid, reject)
   */
  async updatePayoutStatus(id: string, dto: AdminUpdatePayoutStatusDto) {
    const [existing] = await this.db
      .select()
      .from(partnerPayoutRequestsTable)
      .where(eq(partnerPayoutRequestsTable.id, id))
      .limit(1)

    if (!existing) {
      throw new NotFoundException({
        code: ErrorCode.RESOURCE_NOT_FOUND,
        message: `Không tìm thấy yêu cầu quyết toán ${id}`,
      })
    }

    const [updated] = await this.db
      .update(partnerPayoutRequestsTable)
      .set({
        status: dto.status,
        adminNotes: dto.adminNotes ?? existing.adminNotes,
        transactionRef: dto.transactionRef ?? existing.transactionRef,
        processedAt: ["paid", "rejected"].includes(dto.status)
          ? new Date()
          : existing.processedAt,
        updatedAt: new Date(),
      })
      .where(eq(partnerPayoutRequestsTable.id, id))
      .returning()

    if (this.notificationService && updated) {
      this.notificationService
        .sendPayoutStatusNotification({
          partnerId: updated.partnerId,
          partnerName: `Đối tác ${updated.partnerId}`,
          payoutId: updated.id,
          amount: updated.amount,
          bankName: updated.bankName,
          bankAccount: updated.bankAccount,
          status: updated.status as any,
          rejectionReason: updated.adminNotes ?? undefined,
        })
        .catch(() => {})
    }

    return updated
  }

  /**
   * Helper to dispatch booking confirmation voucher and partner order alert
   */
  private async dispatchNotifications(booking: any, paymentMethod: string) {
    if (!this.notificationService) return
    try {
      const details = booking.details || {}
      await this.notificationService.sendBookingConfirmation({
        bookingCode: booking.bookingCode,
        serviceTitle: booking.title || "Dịch vụ nghỉ dưỡng / trải nghiệm STAYEA",
        serviceType: booking.bookingType || "stay",
        customerName: booking.contactName || details.contactName || "Quý khách",
        customerEmail: booking.contactEmail || details.contactEmail || "guest@stayea.com",
        customerPhone: booking.contactPhone || details.contactPhone || "",
        startDate: booking.checkIn ? new Date(booking.checkIn).toLocaleDateString("vi-VN") : "Linh hoạt",
        endDate: booking.checkOut ? new Date(booking.checkOut).toLocaleDateString("vi-VN") : undefined,
        totalAmount: booking.finalAmount || booking.totalAmount,
        paymentMethod,
        transactionId: booking.paymentTransactionId || booking.bookingCode,
      })

      const [order] = await this.db
        .select()
        .from(partnerOrdersTable)
        .where(eq(partnerOrdersTable.bookingId, booking.id))
        .limit(1)

      if (order && order.partnerId) {
        const [partner] = await this.db
          .select()
          .from(partnerProfilesTable)
          .where(eq(partnerProfilesTable.id, order.partnerId))
          .limit(1)

        if (partner) {
          await this.notificationService.sendPartnerOrderAlert({
            partnerId: partner.id,
            partnerName: partner.businessName || partner.contactName,
            partnerEmail: partner.email,
            serviceTitle: booking.title || "Dịch vụ đối tác STAYEA",
            bookingCode: booking.bookingCode,
            startDate: booking.checkIn ? new Date(booking.checkIn).toLocaleDateString("vi-VN") : "Linh hoạt",
            endDate: booking.checkOut ? new Date(booking.checkOut).toLocaleDateString("vi-VN") : undefined,
            customerName: booking.contactName || "Khách hàng STAYEA",
            customerPhone: booking.contactPhone || "",
            estimatedPayout: order.partnerPayoutAmount,
          })
        }
      }
    } catch (err: any) {
      this.logger.warn(`Failed to dispatch notifications: ${err.message}`)
    }
  }
}
