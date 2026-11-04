import { ConflictException, NotFoundException } from "@nestjs/common"
import { describe, expect, it, vi } from "vitest"

import { StayeaPmsService } from "@/modules/stayea/pms/stayea-pms.service"

describe("StayeaPmsService", () => {
  it("rejects duplicate room number in the same property", async () => {
    const mockDb = {
      select: vi.fn().mockReturnThis(),
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      limit: vi.fn().mockResolvedValue([{ id: "rm-existing" }]),
    }

    const service = new StayeaPmsService(mockDb as any)

    await expect(
      service.createRoom("partner-1", {
        roomTypeId: "rt-1",
        roomNumber: "101",
      })
    ).rejects.toThrow(ConflictException)
  })

  it("detects room double-booking collision when creating reservation", async () => {
    const mockDb = {
      select: vi.fn().mockReturnThis(),
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      limit: vi
        .fn()
        // First select: roomTypeId lookup
        .mockResolvedValueOnce([{ id: "rt-1", basePrice: "1000000" }])
        // Second select: room physical lookup
        .mockResolvedValueOnce([{ id: "rm-101", roomNumber: "101", status: "vacant_clean" }])
        // Third select: conflicting overlapping reservations
        .mockResolvedValueOnce([{ id: "res-exist", code: "RES-202611-1234" }]),
    }

    const service = new StayeaPmsService(mockDb as any)

    await expect(
      service.createReservation(
        "partner-1",
        {
          roomTypeId: "rt-1",
          roomId: "rm-101",
          guestName: "Trần Anh Tuấn",
          guestPhone: "0912345678",
          expectedCheckIn: "2026-11-10T14:00:00Z",
          expectedCheckOut: "2026-11-12T12:00:00Z",
          roomRate: 1000000,
        },
        "Lễ tân ca sáng"
      )
    ).rejects.toThrow(ConflictException)
  })

  it("posts minibar item to folio and deducts stock inside transaction", async () => {
    const mockItem = {
      id: "item-aqua",
      partnerId: "partner-1",
      name: "Nước suối Aquafina",
      sellingPrice: "20000",
      costPrice: "8000",
      trackInventory: true,
      currentStock: 50,
    }

    const mockFolio = {
      id: "folio-1",
      reservationId: "res-1",
      partnerId: "partner-1",
      roomCharges: "1000000",
      serviceCharges: "0",
      surcharges: "0",
      discountAmount: "0",
      totalAmount: "1000000",
      paidAmount: "0",
      remainingBalance: "1000000",
      status: "open",
    }

    const mockTx = {
      select: vi.fn().mockReturnThis(),
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      limit: vi
        .fn()
        // 1. check service item inside tx
        .mockResolvedValueOnce([mockItem]),
      insert: vi.fn().mockReturnThis(),
      values: vi.fn().mockReturnThis(),
      returning: vi.fn().mockResolvedValue([
        {
          id: "fitem-1",
          folioId: "folio-1",
          description: "2x Nước suối Aquafina",
          quantity: "2",
          unitPrice: "20000",
          amount: "40000",
          isCancelled: false,
        },
      ]),
      update: vi.fn().mockReturnThis(),
      set: vi.fn().mockReturnThis(),
    }

    const mockDb = {
      select: vi.fn().mockReturnThis(),
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      limit: vi.fn().mockResolvedValueOnce([mockFolio]),
      transaction: vi.fn().mockImplementation(async (cb) => cb(mockTx)),
    }

    const service = new StayeaPmsService(mockDb as any)

    const result = await service.postServiceItem(
      "partner-1",
      "res-1",
      {
        serviceItemId: "item-aqua",
        description: "2x Nước suối Aquafina",
        quantity: 2,
        unitPrice: 20000,
        itemType: "minibar",
      },
      "Lễ tân ca chiều"
    )

    expect(result.item).toBeDefined()
    expect(result.item.amount).toBe("40000")
    expect(mockTx.update).toHaveBeenCalled() // updates stock and folio
  })

  it("completes checkout by settling balance, closing folio, and setting room to vacant_dirty", async () => {
    const mockReservation = {
      id: "res-1",
      partnerId: "partner-1",
      roomId: "rm-101",
      status: "checked_in",
    }

    const mockFolio = {
      id: "folio-1",
      reservationId: "res-1",
      partnerId: "partner-1",
      roomCharges: "1000000",
      serviceCharges: "40000",
      surcharges: "0",
      discountAmount: "0",
      totalAmount: "1040000",
      paidAmount: "500000", // Paid deposit
      remainingBalance: "540000",
      status: "open",
    }

    const mockTx = {
      select: vi.fn().mockReturnThis(),
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      limit: vi.fn().mockResolvedValueOnce([mockFolio]),
      insert: vi.fn().mockReturnThis(),
      values: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      set: vi.fn().mockReturnThis(),
      returning: vi.fn().mockResolvedValue([
        {
          ...mockReservation,
          status: "checked_out",
          actualCheckOut: new Date(),
        },
      ]),
    }

    const mockDb = {
      select: vi.fn().mockReturnThis(),
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      limit: vi
        .fn()
        // 1. check reservation
        .mockResolvedValueOnce([mockReservation])
        // 2. check folio
        .mockResolvedValueOnce([mockFolio]),
      transaction: vi.fn().mockImplementation(async (cb) => cb(mockTx)),
    }

    const service = new StayeaPmsService(mockDb as any)

    const result = await service.checkOut(
      "partner-1",
      "res-1",
      {
        paymentMethod: "bank_transfer",
        paymentAmount: 540000,
        note: "Khách thanh toán quét mã QR tại quầy",
      },
      "Lễ tân ca sáng"
    )

    expect(result.reservation.status).toBe("checked_out")
    expect(mockTx.update).toHaveBeenCalled() // updates room to vacant_dirty & folio to closed
  })
})
