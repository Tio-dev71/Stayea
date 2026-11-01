import { describe, expect, it, vi } from "vitest"
import { ConflictException, BadRequestException } from "@nestjs/common"

import { StayeaBookingService } from "@/modules/stayea/booking/stayea-booking.service"

describe("stayea booking service", () => {
  it("detects double-booking conflict and throws ConflictException atomically inside transaction", async () => {
    const mockTx = {
      select: vi.fn().mockReturnThis(),
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      limit: vi.fn().mockResolvedValue([
        {
          id: "bk-existing",
          bookingCode: "STA-202610-1111",
          startDate: "2026-10-25",
          endDate: "2026-10-28",
          status: "pending",
        },
      ]),
    }

    const mockDb = {
      select: vi.fn().mockReturnThis(),
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      limit: vi.fn().mockResolvedValue([]),
      transaction: vi.fn().mockImplementation(async (callback) => callback(mockTx)),
    }

    const service = new StayeaBookingService(mockDb as any)

    await expect(
      service.createBooking("user-1", {
        bookingType: "stay",
        title: "Sunset Beach Villa",
        destination: "Phú Quốc",
        startDate: "2026-10-26",
        endDate: "2026-10-29",
        totalAmount: 15_000_000,
        details: { stayId: "villa-1" },
      })
    ).rejects.toThrow(ConflictException)

    expect(mockDb.transaction).toHaveBeenCalledTimes(1)
  })

  it("creates a booking with initial status pending and reserves inventory", async () => {
    const mockBooking = {
      id: "bk-new",
      bookingCode: "STA-202610-9999",
      userId: "user-1",
      totalAmount: "5000000",
      finalAmount: "5000000",
      status: "pending",
      paymentStatus: "unpaid",
    }

    const mockTx = {
      select: vi.fn().mockReturnThis(),
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      limit: vi.fn().mockResolvedValue([]),
      insert: vi.fn().mockReturnValue({
        values: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([mockBooking]),
        }),
      }),
      update: vi.fn().mockReturnValue({
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([]),
        }),
      }),
    }

    const mockDb = {
      select: vi.fn().mockReturnThis(),
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      limit: vi.fn().mockResolvedValue([]),
      transaction: vi.fn().mockImplementation(async (callback) => callback(mockTx)),
    }

    const service = new StayeaBookingService(mockDb as any)

    const result = await service.createBooking("user-1", {
      bookingType: "stay",
      title: "Seaside Bungalow",
      destination: "Phú Quốc",
      startDate: "2026-11-01",
      endDate: "2026-11-03",
      totalAmount: 5_000_000,
    })

    expect(result).toBeDefined()
    expect(result?.id).toBe("bk-new")
    expect(result?.status).toBe("pending")
    expect(mockDb.transaction).toHaveBeenCalledTimes(1)
  })

  it("rejects cancellation if booking is already completed or cancelled", async () => {
    const mockDb = {
      select: vi.fn().mockReturnThis(),
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      limit: vi.fn().mockResolvedValue([
        {
          id: "bk-1",
          userId: "user-1",
          status: "completed",
        },
      ]),
    }

    const service = new StayeaBookingService(mockDb as any)

    await expect(service.cancelBooking("user-1", "bk-1")).rejects.toThrow(
      BadRequestException
    )
  })

  it("rejects booking if requested dates conflict with partner blackout dates", async () => {
    let selectCallCount = 0
    const mockTx = {
      select: vi.fn().mockReturnThis(),
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      limit: vi.fn().mockImplementation(() => {
        selectCallCount++
        if (selectCallCount === 1) {
          // No booking collision
          return Promise.resolve([])
        }
        // Blackout date found!
        return Promise.resolve([
          {
            id: "inv-1",
            date: "2026-11-02",
            isAvailable: false,
            note: "Bảo trì định kỳ",
          },
        ])
      }),
    }

    const mockDb = {
      select: vi.fn().mockReturnThis(),
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      limit: vi.fn().mockResolvedValue([]),
      transaction: vi.fn().mockImplementation(async (callback) => callback(mockTx)),
    }

    const service = new StayeaBookingService(mockDb as any)

    await expect(
      service.createBooking("user-1", {
        bookingType: "stay",
        title: "Villa Blackout Test",
        destination: "Phú Quốc",
        startDate: "2026-11-01",
        endDate: "2026-11-04",
        totalAmount: 10_000_000,
        details: { stayId: "villa-blackout" },
      })
    ).rejects.toThrow(ConflictException)
  })

  it("releases expired pending bookings in releaseExpiredBookings cron worker", async () => {
    const mockExpired = [
      { id: "bk-expired-1", bookingCode: "STA-202611-1001" },
      { id: "bk-expired-2", bookingCode: "STA-202611-1002" },
    ]

    const mockDb = {
      select: vi.fn().mockReturnThis(),
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockResolvedValue(mockExpired),
      update: vi.fn().mockReturnValue({
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([]),
        }),
      }),
    }

    const service = new StayeaBookingService(mockDb as any)
    const result = await service.releaseExpiredBookings()

    expect(result.releasedCount).toBe(2)
    expect(mockDb.update).toHaveBeenCalledTimes(1)
  })

  it("aggregates real-time financial metrics and continuous timeline points in getRevenueAnalytics", async () => {
    const today = new Date()
    const mockBookings = [
      {
        id: "bk-1",
        createdAt: today,
        finalAmount: "5000000",
        currency: "VND",
        status: "confirmed",
        paymentStatus: "paid",
        serviceType: "stay",
      },
      {
        id: "bk-2",
        createdAt: today,
        finalAmount: "2000000",
        currency: "VND",
        status: "pending",
        paymentStatus: "unpaid",
        serviceType: "tour",
      },
    ]

    const mockDb = {
      select: vi.fn().mockReturnThis(),
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      orderBy: vi.fn().mockResolvedValue(mockBookings),
    }

    const service = new StayeaBookingService(mockDb as any)
    const analytics = await service.getRevenueAnalytics(7)

    expect(analytics.windowDays).toBe(7)
    expect(analytics.timeline).toHaveLength(7)
    expect(analytics.kpis.totalBookings).toBe(2)
    expect(analytics.kpis.totalRevenue).toBe(7_000_000)
    expect(analytics.kpis.paidRevenue).toBe(5_000_000)
    expect(analytics.kpis.pendingRevenue).toBe(2_000_000)
    expect(analytics.kpis.platformCommission).toBe(Math.round(7_000_000 * 0.12))
    expect(analytics.categoryBreakdown).toHaveLength(2)
  })
})
