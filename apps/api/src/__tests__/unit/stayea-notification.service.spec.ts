import { describe, expect, it, vi } from "vitest"
import { ConfigService } from "@nestjs/config"
import { StayeaNotificationService } from "@/modules/stayea/notification/stayea-notification.service"

describe("StayeaNotificationService (Transactional Notifications & Partner Dispatch)", () => {
  const mockConfigService = {
    get: vi.fn((key: string) => {
      if (key === "SMTP_HOST") return undefined
      if (key === "TELEGRAM_BOT_TOKEN") return undefined
      return undefined
    }),
  } as unknown as ConfigService

  const mockDb = {
    insert: vi.fn().mockReturnValue({
      values: vi.fn().mockReturnValue({
        returning: vi.fn().mockResolvedValue([{
          id: "notif-test",
          recipientType: "partner",
          recipientId: "ptn-phuquoc-01",
          title: "Test",
          message: "Test",
          type: "order",
          priority: "high",
        }]),
      }),
    }),
    select: vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          orderBy: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([]),
          }),
        }),
      }),
    }),
  } as any

  const service = new StayeaNotificationService(mockConfigService, mockDb)

  it("successfully formats and drafts booking confirmation voucher for customer", async () => {
    const res = await service.sendBookingConfirmation({
      bookingCode: "STA-202611-9999",
      serviceTitle: "Sunset Beachfront Villa Phú Quốc",
      serviceType: "stay",
      customerName: "Nguyễn Văn A",
      customerEmail: "khachhang@example.com",
      customerPhone: "0912345678",
      startDate: "10/11/2026",
      endDate: "12/11/2026",
      totalAmount: 15_000_000,
      paymentMethod: "VietQR",
      transactionId: "TX-202611-12345",
    })

    expect(res).toBe(true)
  })

  it("successfully dispatches instant partner alert for incoming order", async () => {
    const res = await service.sendPartnerOrderAlert({
      partnerId: "ptn-phuquoc-01",
      partnerName: "Phú Quốc Eco Villas",
      partnerEmail: "host@ecovillas.vn",
      serviceTitle: "Sunset Beachfront Villa Phú Quốc",
      bookingCode: "STA-202611-9999",
      startDate: "10/11/2026",
      endDate: "12/11/2026",
      customerName: "Nguyễn Văn A",
      customerPhone: "0912345678",
      estimatedPayout: 13_500_000,
    })

    expect(res).toBe(true)
  })

  it("successfully dispatches partner payout status update notification", async () => {
    const res = await service.sendPayoutStatusNotification({
      partnerId: "ptn-phuquoc-01",
      partnerName: "Phú Quốc Eco Villas",
      payoutId: "pay-100",
      amount: 50_000_000,
      bankName: "Vietcombank",
      bankAccount: "1012345678",
      status: "paid",
    })

    expect(res).toBe(true)
  })
})

