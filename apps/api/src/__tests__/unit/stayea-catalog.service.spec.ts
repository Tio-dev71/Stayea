import { describe, expect, it, vi } from "vitest"

import { StayeaCatalogService } from "@/modules/stayea/catalog/stayea-catalog.service"

describe("stayea catalog service", () => {
  it("validates percentage promo codes correctly", async () => {
    const mockDb = {
      select: vi.fn().mockReturnThis(),
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      limit: vi.fn().mockResolvedValue([
        {
          id: "promo-1",
          code: "STAYEA10AIR",
          title: "Giảm 10% Vé máy bay",
          discountType: "percentage",
          discountValue: "10.00",
          maxDiscount: "300000",
          minSpend: "1000000",
          isActive: true,
        },
      ]),
    }

    const service = new StayeaCatalogService(mockDb as any)

    const result = await service.validatePromoCode({
      code: "STAYEA10AIR",
      subtotal: 2_000_000,
    })

    expect(result.isValid).toBe(true)
    expect(result.discountAmount).toBe(200_000)
    expect(result.finalAmount).toBe(1_800_000)
  })

  it("caps percentage discount at maxDiscount", async () => {
    const mockDb = {
      select: vi.fn().mockReturnThis(),
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      limit: vi.fn().mockResolvedValue([
        {
          id: "promo-1",
          code: "STAYEA10AIR",
          title: "Giảm 10% Vé máy bay",
          discountType: "percentage",
          discountValue: "10.00",
          maxDiscount: "150000",
          minSpend: "500000",
          isActive: true,
        },
      ]),
    }

    const service = new StayeaCatalogService(mockDb as any)

    const result = await service.validatePromoCode({
      code: "STAYEA10AIR",
      subtotal: 5_000_000,
    })

    expect(result.isValid).toBe(true)
    expect(result.discountAmount).toBe(150_000)
    expect(result.finalAmount).toBe(4_850_000)
  })

  it("rejects promo when subtotal is below minSpend", async () => {
    const mockDb = {
      select: vi.fn().mockReturnThis(),
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      limit: vi.fn().mockResolvedValue([
        {
          id: "promo-1",
          code: "STAYEA10AIR",
          title: "Giảm 10%",
          discountType: "percentage",
          discountValue: "10.00",
          minSpend: "2000000",
          isActive: true,
        },
      ]),
    }

    const service = new StayeaCatalogService(mockDb as any)

    const result = await service.validatePromoCode({
      code: "STAYEA10AIR",
      subtotal: 1_000_000,
    })

    expect(result.isValid).toBe(false)
    expect(result.message).toContain("Đơn hàng tối thiểu")
  })
})
