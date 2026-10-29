"use client"

import {
  Banknote,
  CalendarCheck,
  Clock,
  Percent,
  ArrowUpRight,
} from "lucide-react"
import type { RevenueKpiItem } from "@/features/admin-revenue/stayea-admin-revenue-mock-data"

interface RevenueKpiCardsProps {
  stats: RevenueKpiItem[]
}

function getKpiIcon(icon: RevenueKpiItem["icon"]) {
  const iconClass = "w-4 h-4 stroke-[2.2]"
  switch (icon) {
    case "wallet":
      return <Banknote className={iconClass} />
    case "paid":
      return <CalendarCheck className={iconClass} />
    case "pending":
      return <Clock className={iconClass} />
    case "commission":
      return <Percent className={iconClass} />
    default:
      return <Banknote className={iconClass} />
  }
}

function getThemeStyles(theme: RevenueKpiItem["colorTheme"]) {
  switch (theme) {
    case "green":
      return {
        iconBg: "bg-[#e8f7ee] text-[#007a48]",
        badgeBg: "text-emerald-700 font-bold",
      }
    case "blue":
      return {
        iconBg: "bg-[#e0f2fe] text-[#0284c7]",
        badgeBg: "text-emerald-700 font-bold",
      }
    case "orange":
      return {
        iconBg: "bg-[#fef3c7] text-[#d97706]",
        badgeBg: "text-emerald-700 font-bold",
      }
    case "purple":
      return {
        iconBg: "bg-[#ede9fe] text-[#7c3aed]",
        badgeBg: "text-emerald-700 font-bold",
      }
    default:
      return {
        iconBg: "bg-[#e8f7ee] text-[#007a48]",
        badgeBg: "text-emerald-700 font-bold",
      }
  }
}

function renderRevenueKpiValue(value: string) {
  const trimmed = value.trim()
  const match = trimmed.match(/^([\d.,]+)\s*([₫đđD]|\S+)?$/i)
  if (match && match[1]) {
    const numPart = match[1]
    const suffix = match[2] || ""
    const isLong = numPart.length > 7
    return (
      <div className="flex items-baseline gap-1 overflow-hidden" title={value}>
        <span
          className={`font-black text-slate-900 tracking-tight tabular-nums truncate ${
            isLong
              ? "text-base sm:text-lg xl:text-[17px] 2xl:text-[20px]"
              : "text-xl sm:text-2xl 2xl:text-3xl"
          }`}
        >
          {numPart}
        </span>
        {suffix && (
          <span className="text-xs sm:text-sm font-bold text-emerald-800/80 shrink-0 select-none">
            {suffix}
          </span>
        )}
      </div>
    )
  }
  return (
    <div className="overflow-hidden" title={value}>
      <span className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900 tracking-tight tabular-nums truncate">
        {value}
      </span>
    </div>
  )
}

export function RevenueKpiCards({ stats }: RevenueKpiCardsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
      {stats.map((item) => {
        const theme = getThemeStyles(item.colorTheme)
        return (
          <div
            key={item.id}
            className="group relative bg-white border border-slate-200/80 rounded-2xl p-3.5 sm:p-4 shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between gap-2.5 text-left"
          >
            {/* Top row: Title on left, Icon Badge on Top-Right */}
            <div className="flex items-start justify-between gap-2">
              <span className="text-xs sm:text-[13px] font-semibold text-slate-600 leading-snug line-clamp-2">
                {item.title}
              </span>
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-2xs ${theme.iconBg}`}
              >
                {getKpiIcon(item.icon)}
              </div>
            </div>

            {/* Middle: Big Revenue Amount */}
            <div className="my-0.5">
              {renderRevenueKpiValue(item.value)}
            </div>

            {/* Bottom: Trend percent and comparison text */}
            <div className="flex items-center gap-1.5 text-[11px] sm:text-xs">
              <span className="inline-flex items-center font-bold text-emerald-600 shrink-0">
                <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>{item.trendPercent}</span>
              </span>
              <span className="text-slate-400 font-medium truncate">
                {item.trendLabel}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
