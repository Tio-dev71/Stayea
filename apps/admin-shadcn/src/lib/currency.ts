/**
 * STAYEA International Currency & Exchange Rate Utility
 * Supports ISO-4217 Currencies (VND, USD, EUR, KRW, JPY) with localized formatting
 * Default property base currency: VND (Phú Quốc / Việt Nam)
 */

export type SupportedCurrency = "VND" | "USD" | "EUR" | "KRW" | "JPY"

// Reference snapshot exchange rates pegged to VND
export const FX_RATES_TO_VND: Record<SupportedCurrency, number> = {
  VND: 1,
  USD: 25450,
  EUR: 27500,
  KRW: 18.5,
  JPY: 168,
}

export const CURRENCY_SYMBOLS: Record<SupportedCurrency, string> = {
  VND: "₫",
  USD: "$",
  EUR: "€",
  KRW: "₩",
  JPY: "¥",
}

/**
 * Convert base VND amount into target currency
 */
export function convertFromVnd(amountVnd: number, targetCurrency: SupportedCurrency): number {
  if (targetCurrency === "VND") return amountVnd
  const rate = FX_RATES_TO_VND[targetCurrency] || 1
  return amountVnd / rate
}

/**
 * Format an amount in VND to localized display string for any supported currency
 */
export function formatLocalizedPrice(
  amountVnd: number,
  currency: SupportedCurrency = "VND",
  _locale: string = "vi-VN"
): string {
  if (isNaN(amountVnd) || amountVnd < 0) return "0 ₫"

  const converted = convertFromVnd(amountVnd, currency)

  switch (currency) {
    case "USD":
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 2,
      }).format(converted)

    case "EUR":
      return new Intl.NumberFormat("de-DE", {
        style: "currency",
        currency: "EUR",
        maximumFractionDigits: 2,
      }).format(converted)

    case "KRW":
      return new Intl.NumberFormat("ko-KR", {
        style: "currency",
        currency: "KRW",
        maximumFractionDigits: 0,
      }).format(converted)

    case "JPY":
      return new Intl.NumberFormat("ja-JP", {
        style: "currency",
        currency: "JPY",
        maximumFractionDigits: 0,
      }).format(converted)

    case "VND":
    default:
      return `${new Intl.NumberFormat("vi-VN", {
        maximumFractionDigits: 0,
      }).format(Math.round(amountVnd))} ₫`
  }
}

/**
 * Calculate tax and service fee breakdowns compliant with Vietnamese hospitality standards
 */
export function calculatePriceBreakdown(totalVnd: number, vatPercent = 8, serviceFeePercent = 5) {
  const basePrice = Math.round(totalVnd / (1 + (vatPercent + serviceFeePercent) / 100))
  const vatAmount = Math.round((basePrice * vatPercent) / 100)
  const serviceFee = totalVnd - basePrice - vatAmount

  return {
    basePrice,
    vatAmount,
    vatPercent,
    serviceFee,
    serviceFeePercent,
    totalVnd,
  }
}

