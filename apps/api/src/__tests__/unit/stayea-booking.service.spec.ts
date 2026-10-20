import { describe, expect, it, vi } from "vitest"
import { ConflictException, BadRequestException } from "@nestjs/common"

import { StayeaBookingService } from "@/modules/stayea/booking/stayea-booking.service"

describe("stayea booking service", () => {
  it("detects double-booking conflict and throws ConflictException", async () => {
    const mockDb = {
      select: vi.fn().mockReturnThis(),
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      limit: vi.fn().mockResolvedValue([
        {
          id: "bk-existing",
          bookingCode: "STA-202610-1111",
          startDate: "2026-10-25",
          endDate: "2026-10-28",
          status: "confirmed",
        },
      ]),
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
  })

  it("creates a booking inside a transaction when no conflict", async () => {
    const mockBooking = {
      id: "bk-new",
      bookingCode: "STA-202610-9999",
      userId: "user-1",
      totalAmount: "5000000",
      finalAmount: "5000000",
      status: "confirmed",
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
      limit: vi.fn().mockResolvedValue([]), // no conflict, no accommodation override
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
})
