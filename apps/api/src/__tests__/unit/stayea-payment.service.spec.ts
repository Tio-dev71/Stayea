import crypto from "node:crypto"
import { describe, expect, it, vi } from "vitest"
import { BadRequestException, ForbiddenException, UnauthorizedException } from "@nestjs/common"

import { StayeaPaymentService } from "@/modules/stayea/payment/stayea-payment.service"

const TEST_SECRET = "stayea-webhook-secret-key-2026"

function computeSignature(orderCode: string, amount: number, status: string, secret: string = TEST_SECRET): string {
  const data = `${orderCode}|${amount}|${status}`
  return crypto.createHmac("sha256", secret).update(data).digest("hex")
}

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

  it("rejects webhook if signature header is missing", async () => {
    const mockDb = {}
    const service = new StayeaPaymentService(mockDb as any)

    await expect(
      service.handlePaymentWebhook({
        orderCode: "STA-202610-7777",
        transactionRef: "TX-001",
        amount: 3_500_000,
        status: "PAID",
      })
    ).rejects.toThrow(UnauthorizedException)
  })

  it("rejects webhook if signature is skip_dev_check bypass attempt", async () => {
    const mockDb = {}
    const service = new StayeaPaymentService(mockDb as any)

    await expect(
      service.handlePaymentWebhook(
        {
          orderCode: "STA-202610-7777",
          transactionRef: "TX-001",
          amount: 3_500_000,
          status: "PAID",
        },
        "skip_dev_check"
      )
    ).rejects.toThrow(UnauthorizedException)
  })

  it("rejects webhook if signature hash is tampered or invalid", async () => {
    const mockDb = {}
    const service = new StayeaPaymentService(mockDb as any)

    await expect(
      service.handlePaymentWebhook(
        {
          orderCode: "STA-202610-7777",
          transactionRef: "TX-001",
          amount: 3_500_000,
          status: "PAID",
        },
        "invalid-hex-signature-1234567890abcdef"
      )
    ).rejects.toThrow(UnauthorizedException)
  })

  it("accepts webhook with valid HMAC signature and handles idempotent replay", async () => {
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
    const validSignature = computeSignature("STA-202610-7777", 3_500_000, "PAID")

    const res = await service.handlePaymentWebhook(
      {
        orderCode: "STA-202610-7777",
        transactionRef: "TX-001",
        amount: 3_500_000,
        status: "PAID",
      },
      validSignature
    )

    expect(res.success).toBe(true)
    expect(res.replayed).toBe(true)
  })

  it("handles webhook with STAYEA prefix in transfer description and dispatches order to partner", async () => {
    const mockPendingBooking = {
      id: "bk-200",
      bookingCode: "STA-202611-1001",
      userId: "user-2",
      finalAmount: "4500000",
      currency: "VND",
      paymentStatus: "unpaid",
      title: "Sunset Villa Phu Quoc",
    }

    const mockTx = {
      insert: vi.fn().mockReturnValue({
        values: vi.fn().mockResolvedValue([{ id: "tx-2" }]),
      }),
      update: vi.fn().mockImplementation(() => ({
        set: vi.fn().mockImplementation(() => ({
          where: vi.fn().mockImplementation(() => ({
            returning: vi.fn().mockResolvedValue([{ ...mockPendingBooking, paymentStatus: "paid", status: "confirmed" }]),
          })),
        })),
      })),
    }

    const mockDb = {
      select: vi.fn().mockReturnThis(),
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      limit: vi.fn().mockResolvedValue([mockPendingBooking]),
      transaction: vi.fn().mockImplementation(async (cb) => cb(mockTx)),
    }

    const service = new StayeaPaymentService(mockDb as any)
    const validSignature = computeSignature("STAYEA STA-202611-1001", 4_500_000, "PAID")

    const res = await service.handlePaymentWebhook(
      {
        orderCode: "STAYEA STA-202611-1001",
        transactionRef: "TX-20261102-001",
        amount: 4_500_000,
        status: "PAID",
      },
      validSignature
    )

    expect(res.success).toBe(true)
    expect(res.replayed).toBe(false)
    if ("booking" in res && res.booking) {
      expect(res.booking.status).toBe("confirmed")
    }
    expect(mockTx.update).toHaveBeenCalled()
  })

  it("rejects payout request if user has no partner profile", async () => {
    const mockDb = {
      select: vi.fn().mockReturnThis(),
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      limit: vi.fn().mockResolvedValue([]),
    }

    const service = new StayeaPaymentService(mockDb as any)

    await expect(
      service.requestPartnerPayout("user-without-partner", {
        amount: 1_000_000,
      })
    ).rejects.toThrow(ForbiddenException)
  })

  it("rejects payout request if amount is less than 100,000 VND", async () => {
    const mockPartner = {
      id: "ptn-1",
      userId: "user-1",
      bankName: "MB Bank",
      bankAccount: "0988776655",
      bankAccountHolder: "NGUYEN VAN A",
    }

    const mockDb = {
      select: vi.fn().mockReturnThis(),
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      limit: vi.fn().mockResolvedValue([mockPartner]),
    }

    const service = new StayeaPaymentService(mockDb as any)

    await expect(
      service.requestPartnerPayout("user-1", {
        amount: 50_000,
      })
    ).rejects.toThrow(BadRequestException)
  })

  it("rejects payout request if amount exceeds available balance", async () => {
    const mockPartner = {
      id: "ptn-1",
      userId: "user-1",
      bankName: "MB Bank",
      bankAccount: "0988776655",
      bankAccountHolder: "NGUYEN VAN A",
    }

    // Orders earned: 2,000,000; already requested: 1,500,000 -> Available: 500,000
    const mockOrders = [
      { partnerPayoutAmount: "2000000", status: "completed" },
    ]
    const mockPayouts = [
      { amount: "1500000", status: "paid" },
    ]

    let selectCount = 0
    const mockDb = {
      select: vi.fn().mockReturnThis(),
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockImplementation(() => {
        selectCount++
        if (selectCount === 1) {
          // partner profile query
          return { limit: vi.fn().mockResolvedValue([mockPartner]) }
        }
        if (selectCount === 2) {
          // partner orders query
          return Promise.resolve(mockOrders)
        }
        // existing payouts query
        return Promise.resolve(mockPayouts)
      }),
    }

    const service = new StayeaPaymentService(mockDb as any)

    await expect(
      service.requestPartnerPayout("user-1", {
        amount: 1_000_000, // exceeds available 500,000
      })
    ).rejects.toThrow(BadRequestException)
  })

  it("successfully processes valid payout request and calculates remaining balance", async () => {
    const mockPartner = {
      id: "ptn-1",
      userId: "user-1",
      bankName: "MB Bank",
      bankAccount: "0988776655",
      bankAccountHolder: "NGUYEN VAN A",
    }

    const mockOrders = [
      { partnerPayoutAmount: "5000000", status: "completed" },
    ]
    const mockPayouts: any[] = []

    let selectCount = 0
    const mockDb = {
      select: vi.fn().mockReturnThis(),
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockImplementation(() => {
        selectCount++
        if (selectCount === 1) {
          return { limit: vi.fn().mockResolvedValue([mockPartner]) }
        }
        if (selectCount === 2) {
          return Promise.resolve(mockOrders)
        }
        return Promise.resolve(mockPayouts)
      }),
      insert: vi.fn().mockReturnValue({
        values: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([
            {
              id: "pay-1",
              payoutCode: "PAY-202611-1234",
              amount: "2000000",
              status: "pending",
            },
          ]),
        }),
      }),
    }

    const service = new StayeaPaymentService(mockDb as any)

    const res = await service.requestPartnerPayout("user-1", {
      amount: 2_000_000,
    })

    expect(res.success).toBe(true)
    expect(res.availableBalance).toBe(3_000_000)
    expect(res.payoutRequest?.status).toBe("pending")
  })

  it("admin updates payout status successfully", async () => {
    const mockExistingPayout = {
      id: "pay-1",
      payoutCode: "PAY-202611-1234",
      amount: "2000000",
      status: "pending",
      adminNotes: null,
      transactionRef: null,
    }

    const mockDb = {
      select: vi.fn().mockReturnThis(),
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      limit: vi.fn().mockResolvedValue([mockExistingPayout]),
      update: vi.fn().mockReturnValue({
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            returning: vi.fn().mockResolvedValue([
              {
                ...mockExistingPayout,
                status: "paid",
                adminNotes: "Đã giải ngân qua VCB",
                transactionRef: "FT123456",
              },
            ]),
          }),
        }),
      }),
    }

    const service = new StayeaPaymentService(mockDb as any)

    const updated = await service.updatePayoutStatus("pay-1", {
      status: "paid",
      adminNotes: "Đã giải ngân qua VCB",
      transactionRef: "FT123456",
    })

    expect(updated?.status).toBe("paid")
    expect(updated?.adminNotes).toBe("Đã giải ngân qua VCB")
    expect(updated?.transactionRef).toBe("FT123456")
  })
})
