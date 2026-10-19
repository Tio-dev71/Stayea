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
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
      {items.map((kpi) => (
        <div
          key={kpi.id}
          className="bg-white border border-slate-200/85 rounded-2xl p-3.5 sm:p-4 shadow-2xs hover:shadow-xs transition-all flex items-start gap-3"
        >
          {/* Icon Badge */}
          <div
            className={`w-11 h-11 rounded-xl border shrink-0 flex items-center justify-center ${getKpiBg(
              kpi.iconType
            )}`}
          >
            {renderKpiIcon(kpi.iconType)}
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0">
            <span className="text-[11.5px] sm:text-xs xl:text-[12.5px] 2xl:text-[13px] font-medium text-slate-500 block leading-tight truncate">
              {kpi.label}
            </span>
            <div className="text-[19px] sm:text-[21px] font-bold text-slate-900 tracking-tight mt-0.5 leading-snug">
              {kpi.value}
            </div>
            <div className="flex items-center flex-wrap gap-1 mt-1 text-xs">
              <span className="font-bold text-emerald-600 flex items-center gap-0.5">
                <TrendingUp className="w-3.5 h-3.5 shrink-0" />
                {kpi.trend}
              </span>
              <span className="text-[11px] text-slate-400 font-normal">
                {kpi.comparisonText}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
