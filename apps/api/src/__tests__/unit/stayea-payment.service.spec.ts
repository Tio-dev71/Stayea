import { describe, expect, it, vi } from "vitest"
import { BadRequestException } from "@nestjs/common"

import { StayeaPaymentService } from "@/modules/stayea/payment/stayea-payment.service"

describe("stayea payment service", () => {
  it("initiates payment with valid VietQR URL and pending transaction", async () => {
    const mockBooking = {
      id: "bk-100",
      bookingCode: "STA-202610-7777",
      userId: "user-1",
      finalAmount: "3500000",
      currency: "VND",
      paymentStatus: "unpaid",
    }

    const mockDb = {
      select: vi.fn().mockReturnThis(),
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      limit: vi.fn().mockResolvedValue([mockBooking]),
      insert: vi.fn().mockReturnValue({
        values: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([
            { id: "tx-1", bookingId: "bk-100", status: "pending" },
          ]),
        }),
      }),
    }

    const service = new StayeaPaymentService(mockDb as any)

    const res = await service.initiatePayment("user-1", {
      bookingId: "bk-100",
      gatewayProvider: "vietqr",
    })

    expect(res.success).toBe(true)
    expect(res.qrCodeUrl).toContain("img.vietqr.io")
    expect(res.amount).toBe(3_500_000)
    expect(res.bookingCode).toBe("STA-202610-7777")
  })

  it("rejects initiatePayment if booking is already paid", async () => {
    const mockPaidBooking = {
      id: "bk-100",
      userId: "user-1",
      paymentStatus: "paid",
    }

    const mockDb = {
      select: vi.fn().mockReturnThis(),
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      limit: vi.fn().mockResolvedValue([mockPaidBooking]),
    }

    const service = new StayeaPaymentService(mockDb as any)

    await expect(
      service.initiatePayment("user-1", { bookingId: "bk-100" })
    ).rejects.toThrow(BadRequestException)
  })

  it("handles idempotent webhook replay without double crediting", async () => {
    const mockAlreadyPaidBooking = {
      id: "bk-100",
      bookingCode: "STA-202610-7777",
      userId: "user-1",
      paymentStatus: "paid",
    }

    const mockDb = {
      select: vi.fn().mockReturnThis(),
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      limit: vi.fn().mockResolvedValue([mockAlreadyPaidBooking]),
    }

    const service = new StayeaPaymentService(mockDb as any)

    const res = await service.handlePaymentWebhook({
      orderCode: "STA-202610-7777",
      transactionRef: "TX-001",
      amount: 3_500_000,
      status: "PAID",
    }, "skip_dev_check")

    expect(res.success).toBe(true)
    expect(res.replayed).toBe(true)
  })
})
