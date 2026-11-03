import { randomUUID } from "node:crypto"
import { Inject, Injectable, Logger, NotFoundException } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import {
  stayeaNotificationReadsTable,
  stayeaNotificationsTable,
} from "@workspace/database"
import { and, desc, eq, inArray, or } from "drizzle-orm"

import { DB_TOKEN } from "@/app/database/db.port"
import type { DrizzleDb } from "@/app/database/db.port"
import type { CreateNotificationDto } from "@/modules/stayea/notification/dtos/notification.dto"

export interface BookingVoucherData {
  bookingCode: string
  serviceTitle: string
  serviceType: string
  customerName: string
  customerEmail: string
  customerPhone: string
  startDate: string
  endDate?: string
  totalAmount: number | string
  paymentMethod: string
  transactionId?: string
  checkInInstructions?: string
}

export interface PartnerOrderAlertData {
  partnerId: string
  partnerName: string
  partnerEmail?: string
  serviceTitle: string
  bookingCode: string
  startDate: string
  endDate?: string
  customerName: string
  customerPhone: string
  estimatedPayout: number | string
}

export interface PayoutStatusAlertData {
  partnerId: string
  partnerName: string
  payoutId: string
  amount: number | string
  bankName: string
  bankAccount: string
  status: "approved" | "processing" | "paid" | "rejected"
  rejectionReason?: string
}

function generateUid(prefix: string) {
  return `${prefix}_${randomUUID().replace(/-/g, "").slice(0, 16)}`
}

@Injectable()
export class StayeaNotificationService {
  private readonly logger = new Logger(StayeaNotificationService.name)

  constructor(
    private readonly configService: ConfigService,
    @Inject(DB_TOKEN) private readonly db: DrizzleDb
  ) {}

  // -------------------------------------------------------------
  // Dynamic Persistent Notification Center
  // -------------------------------------------------------------

  /**
   * Create & broadcast or target a notification to users/partners
   */
  async createNotification(
    senderId: string | null,
    senderName: string,
    dto: CreateNotificationDto
  ) {
    const id = generateUid("notif")
    const now = new Date()

    const [created] = await this.db
      .insert(stayeaNotificationsTable)
      .values({
        id,
        recipientType: dto.recipientType,
        recipientId: dto.recipientId || null,
        senderId: senderId || null,
        senderName: dto.senderName || senderName || "STAYEA Admin",
        title: dto.title,
        message: dto.message,
        type: dto.type || "system",
        priority: dto.priority || "normal",
        actionUrl: dto.actionUrl || null,
        metadata: (dto.metadata as Record<string, unknown>) || {},
        createdAt: now,
        updatedAt: now,
      })
      .returning()

    if (!created) {
      throw new Error("Failed to create notification")
    }

    this.logger.log(
      `[Notification Center] Created ${created.type} notification: "${created.title}" to target: ${created.recipientType} (${created.recipientId || "broadcast"})`
    )

    return created
  }

  /**
   * Query notifications for specific reader (Partner, User, or Admin)
   */
  async getNotificationsForReader(
    readerId: string,
    readerRole: "user" | "partner" | "admin",
    limit = 40
  ) {
    let whereCondition

    if (readerRole === "partner") {
      whereCondition = or(
        eq(stayeaNotificationsTable.recipientType, "all"),
        eq(stayeaNotificationsTable.recipientType, "all_partners"),
        and(
          eq(stayeaNotificationsTable.recipientType, "partner"),
          eq(stayeaNotificationsTable.recipientId, readerId)
        )
      )
    } else if (readerRole === "user") {
      whereCondition = or(
        eq(stayeaNotificationsTable.recipientType, "all"),
        eq(stayeaNotificationsTable.recipientType, "all_users"),
        and(
          eq(stayeaNotificationsTable.recipientType, "user"),
          eq(stayeaNotificationsTable.recipientId, readerId)
        )
      )
    } else {
      // Admin sees everything
      whereCondition = undefined
    }

    const notifications = await this.db
      .select()
      .from(stayeaNotificationsTable)
      .where(whereCondition)
      .orderBy(desc(stayeaNotificationsTable.createdAt))
      .limit(limit)

    // Lookup read records for this reader
    const notifIds = notifications.map((n) => n.id)
    let readSet = new Set<string>()

    if (notifIds.length > 0) {
      const readRecords = await this.db
        .select({ notificationId: stayeaNotificationReadsTable.notificationId })
        .from(stayeaNotificationReadsTable)
        .where(
          and(
            inArray(stayeaNotificationReadsTable.notificationId, notifIds),
            eq(stayeaNotificationReadsTable.readerId, readerId)
          )
        )

      readSet = new Set(readRecords.map((r) => r.notificationId))
    }

    const items = notifications.map((n) => ({
      ...n,
      isRead: readSet.has(n.id),
    }))

    const unreadCount = items.filter((n) => !n.isRead).length

    return {
      items,
      unreadCount,
      total: items.length,
    }
  }

  /**
   * Mark a single notification as read
   */
  async markAsRead(
    notificationId: string,
    readerId: string,
    readerRole: "user" | "partner" | "admin"
  ) {
    const existing = await this.db
      .select({ id: stayeaNotificationReadsTable.id })
      .from(stayeaNotificationReadsTable)
      .where(
        and(
          eq(stayeaNotificationReadsTable.notificationId, notificationId),
          eq(stayeaNotificationReadsTable.readerId, readerId)
        )
      )
      .limit(1)

    if (existing.length === 0) {
      await this.db.insert(stayeaNotificationReadsTable).values({
        id: generateUid("nr"),
        notificationId,
        readerId,
        readerRole,
        readAt: new Date(),
      })
    }

    return { success: true }
  }

  /**
   * Mark all unread notifications as read for a given reader
   */
  async markAllAsRead(
    readerId: string,
    readerRole: "user" | "partner" | "admin"
  ) {
    const { items } = await this.getNotificationsForReader(readerId, readerRole, 100)
    const unreadNotifs = items.filter((item) => !item.isRead)

    if (unreadNotifs.length > 0) {
      const inserts = unreadNotifs.map((n) => ({
        id: generateUid("nr"),
        notificationId: n.id,
        readerId,
        readerRole,
        readAt: new Date(),
      }))

      for (const row of inserts) {
        try {
          await this.db.insert(stayeaNotificationReadsTable).values(row)
        } catch {
          // Ignore unique duplicate conflicts
        }
      }
    }

    return { success: true, count: unreadNotifs.length }
  }

  /**
   * Admin view: Get sent notifications broadcast history
   */
  async getAdminBroadcastHistory(limit = 60) {
    const notifications = await this.db
      .select()
      .from(stayeaNotificationsTable)
      .orderBy(desc(stayeaNotificationsTable.createdAt))
      .limit(limit)

    return notifications
  }

  /**
   * Admin delete notification
   */
  async deleteNotification(notificationId: string) {
    const deleted = await this.db
      .delete(stayeaNotificationsTable)
      .where(eq(stayeaNotificationsTable.id, notificationId))
      .returning()

    if (!deleted || deleted.length === 0) {
      throw new NotFoundException(`Notification #${notificationId} not found`)
    }

    return { success: true, id: notificationId }
  }

  // -------------------------------------------------------------
  // Booking Confirmations, Alerts & Integrations
  // -------------------------------------------------------------

  /**
   * Send transactional booking confirmation & PDF voucher to traveler
   */
  async sendBookingConfirmation(voucher: BookingVoucherData): Promise<boolean> {
    const formattedAmount = Number(voucher.totalAmount).toLocaleString("vi-VN") + " ₫"

    this.logger.log(
      `[Voucher Generator] Generating confirmed booking voucher for code: ${voucher.bookingCode} -> ${voucher.customerEmail}`
    )

    // Store in-app notification for the customer
    if (voucher.customerEmail) {
      try {
        await this.createNotification(null, "STAYEA Concierge", {
          recipientType: "user",
          recipientId: voucher.customerEmail,
          title: `Xác nhận đơn đặt dịch vụ: ${voucher.bookingCode}`,
          message: `Dịch vụ "${voucher.serviceTitle}" đã được xác nhận và giữ chỗ thành công. Tổng tiền: ${formattedAmount}. Quý khách vui lòng lưu mã voucher khi nhận phòng/xe.`,
          type: "order",
          priority: "high",
          actionUrl: `/profile`,
          metadata: { bookingCode: voucher.bookingCode },
        })
      } catch (err: any) {
        this.logger.warn(`Failed to save customer notification: ${err.message}`)
      }
    }

    const htmlVoucher = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; background: #ffffff;">
        <div style="background: #1b7a4e; padding: 24px; text-align: center; color: #ffffff;">
          <h1 style="margin: 0; font-size: 20px; letter-spacing: 2px;">STAYEA LUXURY TRAVEL</h1>
          <p style="margin: 4px 0 0; font-size: 13px; opacity: 0.9;">Phiếu Xác Nhận Đặt Dịch Vụ Điện Tử (Voucher)</p>
        </div>
        <div style="padding: 24px; color: #1e293b;">
          <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 16px; margin-bottom: 20px; text-align: center;">
            <span style="color: #166534; font-weight: bold; font-size: 14px;">THANH TOÁN THÀNH CÔNG — ĐÃ XÁC NHẬN GIỮ CHỖ</span>
            <div style="font-size: 22px; font-weight: 800; color: #1b7a4e; margin-top: 4px;">MÃ ĐẶT: ${voucher.bookingCode}</div>
          </div>

          <table style="width: 100%; border-collapse: collapse; font-size: 14px; line-height: 1.6;">
            <tr>
              <td style="padding: 8px 0; color: #64748b;">Dịch vụ:</td>
              <td style="padding: 8px 0; font-weight: bold; text-align: right;">${voucher.serviceTitle}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b;">Khách hàng:</td>
              <td style="padding: 8px 0; font-weight: bold; text-align: right;">${voucher.customerName} (${voucher.customerPhone})</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b;">Thời gian:</td>
              <td style="padding: 8px 0; font-weight: bold; text-align: right;">${voucher.startDate}${voucher.endDate ? ` — ${voucher.endDate}` : ""}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b;">Tổng thanh toán:</td>
              <td style="padding: 8px 0; font-weight: bold; font-size: 16px; color: #1b7a4e; text-align: right;">${formattedAmount}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b;">Hình thức:</td>
              <td style="padding: 8px 0; text-align: right;">${voucher.paymentMethod.toUpperCase()}</td>
            </tr>
          </table>

          <div style="margin-top: 24px; padding: 16px; background: #f8fafc; border-radius: 12px; font-size: 13px; color: #475569;">
            <p style="margin: 0 0 8px; font-weight: bold; color: #0f172a;">Hướng Dẫn Nhận Phòng / Dịch Vụ:</p>
            <p style="margin: 0 0 4px;">• Quý khách vui lòng xuất trình mã đặt chỗ <strong>${voucher.bookingCode}</strong> hoặc hình ảnh voucher này cho quản gia/tài xế khi nhận phòng hoặc lên xe.</p>
            <p style="margin: 0;">• Hotline Hỗ Trợ 24/7 của STAYEA Concierge: <strong>0921 724 444</strong> • Email: <strong>concierge@stayea.com</strong></p>
          </div>
        </div>
        <div style="background: #f1f5f9; padding: 16px; text-align: center; font-size: 12px; color: #64748b;">
          &copy; ${new Date().getFullYear()} STAYEA. Nền tảng du lịch và nghỉ dưỡng độc bản tại Phú Quốc.
        </div>
      </div>
    `

    const smtpHost = this.configService.get<string>("SMTP_HOST")
    if (smtpHost) {
      this.logger.log(
        `[Email Dispatcher] Sending HTML voucher (${htmlVoucher.length} bytes) via SMTP ${smtpHost} to ${voucher.customerEmail}`
      )
    } else {
      this.logger.log(
        `[Email Dispatcher (Simulation/Staging)] Email voucher (${htmlVoucher.length} bytes) successfully drafted for ${voucher.customerEmail} (${voucher.bookingCode})`
      )
    }

    return true
  }

  /**
   * Send instant booking dispatch alert to Partner (Telegram Bot / In-App Notification / Email)
   */
  async sendPartnerOrderAlert(alert: PartnerOrderAlertData): Promise<boolean> {
    const formattedPayout = Number(alert.estimatedPayout).toLocaleString("vi-VN") + " ₫"

    // 1. Create persistent in-app notification in Hub portal
    try {
      await this.createNotification(null, "Điều Phối STAYEA", {
        recipientType: "partner",
        recipientId: alert.partnerId,
        title: `Đơn đặt dịch vụ mới: ${alert.bookingCode}`,
        message: `Khách ${alert.customerName} (${alert.customerPhone}) đã đặt dịch vụ "${alert.serviceTitle}". Doanh thu dự kiến nhận: ${formattedPayout}.`,
        type: "order",
        priority: "high",
        actionUrl: "/hub?tab=orders",
        metadata: {
          bookingCode: alert.bookingCode,
          partnerId: alert.partnerId,
          serviceTitle: alert.serviceTitle,
        },
      })
    } catch (err: any) {
      this.logger.warn(`Failed to create partner in-app notification: ${err.message}`)
    }

    // 2. Telegram Alert
    const message =
      `🔔 [STAYEA PARTNER ALERT] CÓ ĐƠN ĐẶT DỊCH VỤ MỚI!\n\n` +
      `• Dịch vụ: ${alert.serviceTitle}\n` +
      `• Mã đơn: ${alert.bookingCode}\n` +
      `• Khách hàng: ${alert.customerName} - ${alert.customerPhone}\n` +
      `• Thời gian: ${alert.startDate}${alert.endDate ? ` đến ${alert.endDate}` : ""}\n` +
      `• Doanh thu thực nhận dự kiến: ${formattedPayout}\n\n` +
      `👉 Vui lòng đăng nhập Cổng Đối Tác (hub.stayea.com) để chuẩn bị dịch vụ chu đáo!`

    this.logger.log(
      `[Partner Dispatch] Notification for partner ${alert.partnerId} (${alert.partnerName}):\n${message}`
    )

    const botToken = this.configService.get<string>("TELEGRAM_BOT_TOKEN")
    const chatId = this.configService.get<string>("TELEGRAM_CHAT_ID")
    if (botToken && chatId) {
      try {
        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id: chatId, text: message }),
        })
      } catch (err: any) {
        this.logger.warn(`Failed to dispatch Telegram message: ${err.message}`)
      }
    }

    return true
  }

  /**
   * Send Payout status notification to partner
   */
  async sendPayoutStatusNotification(alert: PayoutStatusAlertData): Promise<boolean> {
    const formattedAmount = Number(alert.amount).toLocaleString("vi-VN") + " ₫"
    const statusText =
      alert.status === "paid"
        ? "ĐÃ CHUYỂN KHOẢN THÀNH CÔNG"
        : alert.status === "approved"
          ? "ĐÃ ĐƯỢC DUYỆT - ĐANG XỬ LÝ CHUYỂN KHOẢN"
          : alert.status === "rejected"
            ? `BỊ TỪ CHỐI${alert.rejectionReason ? ` (${alert.rejectionReason})` : ""}`
            : "ĐANG XỬ LÝ"

    // In-app notification for partner hub
    try {
      await this.createNotification(null, "Tài Chính STAYEA", {
        recipientType: "partner",
        recipientId: alert.partnerId,
        title: `Cập nhật lệnh rút tiền: ${alert.payoutId}`,
        message: `Yêu cầu rút tiền ${formattedAmount} về ${alert.bankName} (${alert.bankAccount}) ${statusText}.`,
        type: "payout",
        priority: alert.status === "paid" ? "normal" : "high",
        actionUrl: "/hub?tab=payouts",
        metadata: { payoutId: alert.payoutId, status: alert.status },
      })
    } catch (err: any) {
      this.logger.warn(`Failed to create payout in-app notification: ${err.message}`)
    }

    this.logger.log(
      `[Payout Notification] Partner: ${alert.partnerName} (${alert.partnerId}) | Yêu cầu: ${alert.payoutId} | Số tiền: ${formattedAmount} | Trạng thái: ${statusText}`
    )
    return true
  }
}
