import { describe, expect, it } from "vitest"
import {
  calculatePriceBreakdown,
  convertFromVnd,
  formatLocalizedPrice,
} from "./currency"

describe("STAYEA International Currency & Pricing Engine", () => {
  it("formats standard VND price with Vietnamese locale symbol", () => {
    const formatted = formatLocalizedPrice(1500000, "VND")
    expect(formatted).toMatch(/1\.500\.000\s*₫/)
  })

  it("converts and formats USD accurately", () => {
    const amountVnd = 2545000 // 100 USD at 25,450 rate
    const converted = convertFromVnd(amountVnd, "USD")
    expect(converted).toBeCloseTo(100, 2)

    const formatted = formatLocalizedPrice(amountVnd, "USD")
    expect(formatted).toBe("$100.00")
  })

  it("converts and formats EUR with European standard formatting", () => {
    const amountVnd = 2750000 // 100 EUR at 27,500 rate
    const converted = convertFromVnd(amountVnd, "EUR")
    expect(converted).toBeCloseTo(100, 2)

    const formatted = formatLocalizedPrice(amountVnd, "EUR")
    expect(formatted).toContain("100,00")
    expect(formatted).toContain("€")
  })

  it("converts and formats KRW without decimal fractions", () => {
    const amountVnd = 185000 // 10,000 KRW
    const formatted = formatLocalizedPrice(amountVnd, "KRW")
    expect(formatted).toContain("10,000")
    expect(formatted).toContain("₩")
  })

  it("handles negative or invalid prices gracefully", () => {
    expect(formatLocalizedPrice(-5000, "VND")).toBe("0 ₫")
    expect(formatLocalizedPrice(NaN, "VND")).toBe("0 ₫")
  })

  it("calculates accurate tax and service fee breakdown", () => {
    const total = 1130000 // Total with 8% VAT and 5% service fee
    const breakdown = calculatePriceBreakdown(total, 8, 5)

    expect(breakdown.basePrice).toBe(1000000)
    expect(breakdown.vatAmount).toBe(80000)
    expect(breakdown.serviceFee).toBe(50000)
    expect(breakdown.totalVnd).toBe(total)
  })
})

