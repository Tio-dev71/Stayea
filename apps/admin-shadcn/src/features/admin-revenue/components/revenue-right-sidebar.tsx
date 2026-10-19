"use client"

import Image from "next/image"
import {
  ArrowRight,
  ChevronRight,
  Wallet,
  CreditCard,
  ArrowLeftRight,
  Smartphone,
  Banknote,
  FileSpreadsheet,
  Handshake,
  RotateCcw,
  Sliders,
  Calendar,
  Medal,
} from "lucide-react"
import type {
  PaymentMethodItem,
  LocationRevenueItem,
  QuickActionItem,
} from "@/features/admin-revenue/stayea-admin-revenue-mock-data"
import {
  MOCK_PAYMENT_METHODS,
  MOCK_LOCATION_REVENUES,
  MOCK_QUICK_ACTIONS,
} from "@/features/admin-revenue/stayea-admin-revenue-mock-data"

interface RevenueRightSidebarProps {
  paymentMethods?: PaymentMethodItem[]
  locations?: LocationRevenueItem[]
  quickActions?: QuickActionItem[]
  onViewPaymentDetails?: () => void
  onViewLocationDetails?: () => void
  onQuickAction?: (actionId: string) => void
  onPromoClick?: () => void
}

function getPaymentIcon(icon: PaymentMethodItem["icon"]) {
  const iconClass = "w-4 h-4"
  switch (icon) {
    case "wallet":
      return <Wallet className={iconClass} />
    case "card":
      return <CreditCard className={iconClass} />
    case "transfer":
      return <ArrowLeftRight className={iconClass} />
    case "e-wallet":
      return <Smartphone className={iconClass} />
    case "cash":
      return <Banknote className={iconClass} />
    default:
      return <Wallet className={iconClass} />
  }
}

function getQuickActionIcon(icon: QuickActionItem["icon"]) {
  const iconClass = "w-4 h-4 stroke-[2]"
  switch (icon) {
    case "export":
      return <FileSpreadsheet className={iconClass} />
    case "reconcile":
      return <Handshake className={iconClass} />
    case "refund":
      return <RotateCcw className={iconClass} />
    case "payment-settings":
      return <Sliders className={iconClass} />
    case "schedule":
      return <Calendar className={iconClass} />
    default:
      return <FileSpreadsheet className={iconClass} />
  }
}

export function RevenueRightSidebar({
  paymentMethods = MOCK_PAYMENT_METHODS,
  locations = MOCK_LOCATION_REVENUES,
  quickActions = MOCK_QUICK_ACTIONS,
  onViewPaymentDetails,
  onViewLocationDetails,
  onQuickAction,
  onPromoClick,
}: RevenueRightSidebarProps) {
  return (
    <div className="space-y-5">
      {/* 1. Promo Card Banner */}
      <div className="relative overflow-hidden rounded-2xl aspect-[16/6] sm:aspect-[16/5] border border-slate-200/80 shadow-xs group cursor-pointer" onClick={onPromoClick}>
        <Image
          src="/about/beach-opt-0.jpg"
          alt="Tăng doanh thu với trải nghiệm đặc sắc"
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-sky-950/70 via-sky-900/40 to-transparent flex items-center justify-between p-4 sm:p-5 text-white">
          <div className="max-w-[70%]">
            <h3 className="text-sm sm:text-base font-bold leading-snug drop-shadow-xs">
              Tăng doanh thu với trải nghiệm đặc sắc
            </h3>
          </div>
          <button
            type="button"
            aria-label="Khám phá ngay"
            className="w-8 h-8 rounded-full bg-white text-slate-800 shadow-md flex items-center justify-center shrink-0 group-hover:translate-x-1 transition-transform"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Phương thức thanh toán */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-3.5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
            Phương thức thanh toán
          </h2>
          <button
            type="button"
            onClick={onViewPaymentDetails}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#007a48] hover:text-emerald-800 hover:underline transition-colors cursor-pointer"
          >
            <span>Xem chi tiết</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2.5">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className="flex items-center justify-between gap-3 text-xs sm:text-sm py-1"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                  {getPaymentIcon(method.icon)}
                </div>
                <span className="font-medium text-slate-700 truncate">
                  {method.name}
                </span>
              </div>
              <span className="font-bold text-slate-900 shrink-0 text-xs">
                {method.percentage}%{" "}
                <span className="text-slate-400 font-normal">
                  ({method.amountFormatted})
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Doanh thu theo địa điểm */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-3.5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
            Doanh thu theo địa điểm
          </h2>
          <button
            type="button"
            onClick={onViewLocationDetails}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#007a48] hover:text-emerald-800 hover:underline transition-colors cursor-pointer"
          >
            <span>Xem chi tiết</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-3">
          {locations.map((loc) => (
            <div
              key={loc.id}
              className="flex items-center justify-between gap-3 text-xs sm:text-sm"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {/* Rank Badge */}
                {loc.rank === 1 ? (
                  <div className="w-5 h-5 flex items-center justify-center text-amber-500 shrink-0">
                    <Medal className="w-4 h-4 fill-amber-400 text-amber-600" />
                  </div>
                ) : (
                  <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 font-bold text-[11px] flex items-center justify-center shrink-0">
                    {loc.rank}
                  </span>
                )}

                {/* Round City Thumbnail */}
                <div className="relative w-7 h-7 rounded-full overflow-hidden shrink-0 border border-slate-200">
                  <Image
                    src={loc.imageUrl}
                    alt={loc.city}
                    fill
                    className="object-cover"
                  />
                </div>

                <span className="font-medium text-slate-800 truncate">
                  {loc.city}
                </span>
              </div>

              <span className="font-bold text-slate-900 shrink-0 text-xs">
                {loc.revenueFormatted}{" "}
                <span className="text-slate-400 font-normal">
                  ({loc.percentage}%)
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Thao tác nhanh */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-3">
        <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
          Thao tác nhanh
        </h2>

        <div className="space-y-1.5">
          {quickActions.map((action) => (
            <button
              key={action.id}
              type="button"
              onClick={() => onQuickAction?.(action.id)}
              className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-slate-700 hover:text-slate-900 transition-colors group text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#e8f7ee] text-[#007a48] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  {getQuickActionIcon(action.icon)}
                </div>
                <span className="text-xs sm:text-sm font-medium">
                  {action.label}
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-0.5 transition-all" />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
