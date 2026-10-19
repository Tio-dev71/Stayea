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
  const iconClass = "w-5 h-5 stroke-[2.2]"
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

export function RevenueKpiCards({ stats }: RevenueKpiCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map((item) => {
        const theme = getThemeStyles(item.colorTheme)
        return (
          <div
            key={item.id}
            className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
          >
            {/* Top row: Icon container + Title */}
            <div className="flex items-center gap-3">
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-2xs ${theme.iconBg}`}
              >
                {getKpiIcon(item.icon)}
              </div>
              <span className="text-xs sm:text-sm font-medium text-slate-500 leading-tight">
                {item.title}
              </span>
            </div>

            {/* Middle: Big Revenue Amount */}
            <div className="mt-4">
              <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {item.value}
              </span>
            </div>

            {/* Bottom: Trend Indicator */}
            <div className="mt-2.5 flex items-center gap-1.5 text-xs">
              <div className="inline-flex items-center gap-0.5 font-bold text-emerald-600">
                <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>{item.trendPercent}</span>
              </div>
              <span className="text-slate-400 font-normal truncate">
                {item.trendLabel}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
