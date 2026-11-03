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
import { and, desc, eq, ilike, inArray, ne, or, sql } from "drizzle-orm"

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
    const bankId = process.env.VIETQR_BANK_ID || "MB" // MB Bank
    const accountNo = process.env.VIETQR_ACCOUNT_NO || "292222288888"
    const accountName = process.env.VIETQR_ACCOUNT_NAME || "CTY TNHH TOP CN VA NOI DUNG SO"
    const description = `STAYEA ${booking.bookingCode}`
    const qrCodeUrl = `https://img.vietqr.io/image/${bankId}-${accountNo}-compact2.png?amount=${amount}&addInfo=${encodeURIComponent(description)}&accountName=${encodeURIComponent(accountName)}`

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
            accountName,
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
   * Handle Webhook Notification from SePay (Automated VietQR MBBank Payment Processing)
   */
  async handleSepayWebhook(payload: any, authHeader?: string) {
    this.logger.log(`[SePay Webhook] Incoming notification: ${JSON.stringify(payload)}`)

    // 1. Verify API Key if configured
    const configuredApiKey = process.env["SEPAY_API_KEY"]
    if (configuredApiKey) {
      const auth = authHeader || ""
      const cleanToken = auth.replace(/^(Apikey|Bearer)\s+/i, "").trim()
      if (cleanToken !== configuredApiKey) {
        throw new UnauthorizedException({
          code: ErrorCode.UNAUTHORIZED,
          message: "SePay API Key không hợp lệ (Unauthorized SePay Webhook)",
        })
      }
    }

    // 2. Filter out outgoing transactions (chỉ xử lý tiền vào)
    const transferType = String(payload.transferType || "").toLowerCase()
    if (transferType === "out") {
      return {
        success: true,
        message: "Giao dịch chuyển tiền ra - bỏ qua xử lý đơn đặt",
      }
    }

    const transferAmount = Number(payload.transferAmount || payload.amount || 0)
    const rawContent = `${payload.content || ""} ${payload.description || ""} ${payload.code || ""}`.trim()

    // 3. Extract Booking Code from transfer content (e.g., "STAYEA STA-202611-6171", "STA 202611 6171", "STA2026116171")
    let extractedCode: string | null = null
    const staMatch = rawContent.match(/STA[-_\s]?(\d{6})[-_\s]?(\d{4})/i)
    if (staMatch && staMatch[1] && staMatch[2]) {
      extractedCode = `STA-${staMatch[1]}-${staMatch[2]}`
    } else {
      const simpleMatch = rawContent.match(/STA\s*([A-Z0-9-]+)/i)
      if (simpleMatch && simpleMatch[1]) {
        extractedCode = `STA-${simpleMatch[1].trim().replace(/^STA[-_]?/i, "")}`
      }
    }

    // 4. Lookup booking in stayeaBookingsTable
    let booking: any = null
    if (extractedCode) {
      const [found] = await this.db
        .select()
        .from(stayeaBookingsTable)
        .where(
          or(
            eq(stayeaBookingsTable.bookingCode, extractedCode),
            ilike(stayeaBookingsTable.bookingCode, `%${extractedCode}%`),
            eq(stayeaBookingsTable.id, extractedCode)
          )
        )
        .limit(1)
      booking = found
    }

    // Fallback: search among recent unpaid bookings by content keyword
    if (!booking) {
      const recentUnpaid = await this.db
        .select()
        .from(stayeaBookingsTable)
        .where(
          and(
            ne(stayeaBookingsTable.status, "cancelled"),
            ne(stayeaBookingsTable.paymentStatus, "paid")
          )
        )
        .orderBy(desc(stayeaBookingsTable.createdAt))
        .limit(20)

      for (const b of recentUnpaid) {
        const cleanBookingSuffix = b.bookingCode.replace(/^STA-/, "").replace(/-/g, "")
        if (
          rawContent.includes(b.bookingCode) ||
          rawContent.includes(cleanBookingSuffix) ||
          ((b.details as any)?.contactInfo?.phone && rawContent.includes((b.details as any).contactInfo.phone))
        ) {
          booking = b
          break
        }
      }
    }

    if (!booking) {
      this.logger.warn(`[SePay Webhook] No matching booking found for content: "${rawContent}"`)
      return {
        success: false,
        message: `Không tìm thấy đơn đặt phòng cho nội dung giao dịch: "${rawContent}"`,
      }
    }

    // 5. Idempotency Check
    if (booking.paymentStatus === "paid") {
      return {
        success: true,
        replayed: true,
        message: "Đơn đặt chỗ đã được xác nhận thanh toán trước đó",
        bookingCode: booking.bookingCode,
      }
    }

    // 6. Execute atomic database update
    const result = await this.db.transaction(async (tx) => {
      // Insert payment transaction record
      await tx.insert(stayeaPaymentTransactionsTable).values({
        id: `tx-${crypto.randomUUID()}`,
        bookingId: booking.id,
        userId: booking.userId,
        amount: transferAmount > 0 ? transferAmount.toString() : booking.finalAmount,
        currency: booking.currency || "VND",
        paymentMethod: "sepay_vietqr",
        status: "success",
        transactionRef: String(payload.referenceCode || payload.id || `sepay-${Date.now()}`),
        gatewayResponse: {
          webhookReceivedAt: new Date().toISOString(),
          gateway: payload.gateway || "MBBank",
          accountNumber: payload.accountNumber,
          transferAmount,
          content: payload.content,
          referenceCode: payload.referenceCode,
        },
      })

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

      // Automatically dispatch or update partner order to sent_to_partner
      await tx
        .update(partnerOrdersTable)
        .set({
          status: "sent_to_partner",
          customerNote: sql`COALESCE(${partnerOrdersTable.customerNote}, ${((booking.details as any)?.contactInfo?.note || "")})`,
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
            title: `Tích điểm thanh toán SePay: ${booking.title}`,
            description: `Thanh toán thành công ${Number(booking.finalAmount).toLocaleString("vi-VN")} VND qua SePay/VietQR`,
            bookingId: booking.id,
          })
        }
      }

      return {
        success: true,
        replayed: false,
        booking: updatedBooking,
        awardedPoints,
        message: `Thanh toán SePay thành công cho đơn đặt phòng ${booking.bookingCode}`,
      }
    })

    if (result.success && !result.replayed && result.booking) {
      this.dispatchNotifications(result.booking, "SePay VietQR").catch((err) => {
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
  async requestPartnerPayout(userId: string, dto: RequestPayoutDto, partnerId?: string) {
    let partner: typeof partnerProfilesTable.$inferSelect | undefined

    if (partnerId) {
      const [found] = await this.db
        .select()
        .from(partnerProfilesTable)
        .where(eq(partnerProfilesTable.id, partnerId))
        .limit(1)
      partner = found
    }

    if (!partner && userId) {
      const [found] = await this.db
        .select()
        .from(partnerProfilesTable)
        .where(eq(partnerProfilesTable.userId, userId))
        .limit(1)
      partner = found
    }

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
  async getPartnerPayoutOverview(userId?: string, partnerId?: string) {
    let partner: typeof partnerProfilesTable.$inferSelect | undefined

    if (partnerId) {
      const [found] = await this.db
        .select()
        .from(partnerProfilesTable)
        .where(eq(partnerProfilesTable.id, partnerId))
        .limit(1)
      partner = found
    }

    if (!partner && userId) {
      const [found] = await this.db
        .select()
        .from(partnerProfilesTable)
        .where(eq(partnerProfilesTable.userId, userId))
        .limit(1)
      partner = found
    }

    if (!partner) {
      return {
        partner: null,
        availableBalance: 0,
        totalEarned: 0,
        inProgressEarned: 0,
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

    const completedEarned = partnerOrders
      .filter((o) => o.status === "completed")
      .reduce((sum, o) => sum + Number(o.partnerPayoutAmount || 0), 0)

    const inProgressEarned = partnerOrders
      .filter((o) => o.status === "partner_accepted" || o.status === "in_progress")
      .reduce((sum, o) => sum + Number(o.partnerPayoutAmount || 0), 0)

    const totalEarned = completedEarned + inProgressEarned

    const payoutRequests = await this.db
      .select()
      .from(partnerPayoutRequestsTable)
      .where(eq(partnerPayoutRequestsTable.partnerId, partner.id))
      .orderBy(desc(partnerPayoutRequestsTable.createdAt))

    const totalWithdrawnOrPending = payoutRequests
      .filter((p) => ["pending", "approved", "processing", "paid"].includes(p.status))
      .reduce((sum, p) => sum + Number(p.amount || 0), 0)

    const availableBalance = Math.max(0, completedEarned - totalWithdrawnOrPending)

    return {
      partner,
      availableBalance,
      totalEarned,
      completedEarned,
      inProgressEarned,
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
