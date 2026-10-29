"use client"

import { Megaphone, Users, MousePointer, BarChart2, TrendingUp } from "lucide-react"
import type { MarketingKpiItem } from "@/features/admin-marketing/stayea-admin-marketing-mock-data"
import { MOCK_MARKETING_KPIS } from "@/features/admin-marketing/stayea-admin-marketing-mock-data"

function renderKpiIcon(type: MarketingKpiItem["iconType"]) {
  switch (type) {
    case "megaphone":
      return <Megaphone className="w-5 h-5 text-emerald-600" />
    case "users":
      return <Users className="w-5 h-5 text-amber-500" />
    case "mouse-pointer":
      return <MousePointer className="w-5 h-5 text-sky-600" />
    case "bar-chart":
      return <BarChart2 className="w-5 h-5 text-amber-600" />
    default:
      return <Megaphone className="w-5 h-5 text-emerald-600" />
  }
}

function getKpiBg(type: MarketingKpiItem["iconType"]) {
  switch (type) {
    case "megaphone":
      return "bg-emerald-50 border-emerald-100/80"
    case "users":
      return "bg-amber-50 border-amber-100/80"
    case "mouse-pointer":
      return "bg-sky-50 border-sky-100/80"
    case "bar-chart":
      return "bg-amber-50 border-amber-100/80"
    default:
      return "bg-slate-50 border-slate-100"
  }
}

interface MarketingKpiCardsProps {
  items?: MarketingKpiItem[]
}

export function MarketingKpiCards({ items = MOCK_MARKETING_KPIS }: MarketingKpiCardsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
      {items.map((kpi) => (
        <div
          key={kpi.id}
          className="group relative bg-white border border-slate-200/80 rounded-2xl p-3.5 sm:p-4 shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between gap-2.5 text-left"
        >
          {/* Top Row: Title on Left, Icon Badge on Top-Right */}
          <div className="flex items-start justify-between gap-2">
            <span className="text-xs sm:text-[13px] font-semibold text-slate-600 leading-snug line-clamp-2">
              {kpi.label}
            </span>
            <div
              className={`w-8 h-8 rounded-xl border shrink-0 flex items-center justify-center ${getKpiBg(
                kpi.iconType
              )}`}
            >
              {renderKpiIcon(kpi.iconType)}
            </div>
          </div>

          {/* Middle: Big Value */}
          <div className="my-0.5">
            <span className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900 tracking-tight tabular-nums truncate block">
              {kpi.value}
            </span>
          </div>

          {/* Bottom: Trend */}
          <div className="flex items-center gap-1.5 text-[11px] sm:text-xs">
            <span className="font-bold text-emerald-600 flex items-center gap-0.5 shrink-0">
              <TrendingUp className="w-3.5 h-3.5 stroke-[2.5]" />
              {kpi.trend}
            </span>
            <span className="text-slate-400 font-medium truncate">
              {kpi.comparisonText}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
