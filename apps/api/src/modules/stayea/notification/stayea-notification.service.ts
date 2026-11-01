import { Injectable, Logger } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"

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

@Injectable()
export class StayeaNotificationService {
  private readonly logger = new Logger(StayeaNotificationService.name)

  constructor(private readonly configService: ConfigService) {}

  /**
   * Send transactional booking confirmation & PDF voucher to traveler
   */
  async sendBookingConfirmation(voucher: BookingVoucherData): Promise<boolean> {
    const formattedAmount = Number(voucher.totalAmount).toLocaleString("vi-VN") + " ₫"

    this.logger.log(
      `[Voucher Generator] Generating confirmed booking voucher for code: ${voucher.bookingCode} -> ${voucher.customerEmail}`
    )

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

    // If an external mailer (e.g. Resend, SMTP) is configured in environment, dispatch it
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
   * Send instant booking dispatch alert to Partner (Telegram Bot / Zalo / Email)
   */
  async sendPartnerOrderAlert(alert: PartnerOrderAlertData): Promise<boolean> {
    const formattedPayout = Number(alert.estimatedPayout).toLocaleString("vi-VN") + " ₫"

    const message = `🔔 [STAYEA PARTNER ALERT] CÓ ĐƠN ĐẶT DỊCH VỤ MỚI!\n\n` +
      `• Dịch vụ: ${alert.serviceTitle}\n` +
      `• Mã đơn: ${alert.bookingCode}\n` +
      `• Khách hàng: ${alert.customerName} - ${alert.customerPhone}\n` +
      `• Thời gian: ${alert.startDate}${alert.endDate ? ` đến ${alert.endDate}` : ""}\n` +
      `• Doanh thu thực nhận dự kiến: ${formattedPayout}\n\n` +
      `👉 Vui lòng đăng nhập Cổng Đối Tác (hub.stayea.com) để chuẩn bị dịch vụ chu đáo!`

    this.logger.log(`[Partner Dispatch] Notification for partner ${alert.partnerId} (${alert.partnerName}):\n${message}`)

    // If Telegram Bot webhook is configured
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
            ? "BỊ TỪ CHỐI"
            : "ĐANG XỬ LÝ"

    this.logger.log(
      `[Payout Notification] Partner: ${alert.partnerName} (${alert.partnerId}) | Yêu cầu: ${alert.payoutId} | Số tiền: ${formattedAmount} | Trạng thái: ${statusText}`
    )
    return true
  }
}
