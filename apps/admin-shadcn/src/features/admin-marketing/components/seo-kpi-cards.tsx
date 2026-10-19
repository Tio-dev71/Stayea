"use client"

import {
  Search,
  BarChart3,
  Key,
  Link2,
  Star,
  TrendingUp,
  TrendingDown,
} from "lucide-react"
import type { SeoKpiItem } from "@/features/admin-marketing/stayea-admin-marketing-mock-data"

interface SeoKpiCardsProps {
  items: SeoKpiItem[]
  onKpiClick?: (id: string) => void
}

function renderSeoKpiIcon(iconType: SeoKpiItem["iconType"]) {
  switch (iconType) {
    case "search":
      return (
        <div className="w-10 h-10 rounded-full bg-emerald-50 text-[#007a48] flex items-center justify-center shrink-0">
          <Search className="w-5 h-5" />
        </div>
      )
    case "chart":
      return (
        <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
          <BarChart3 className="w-5 h-5" />
        </div>
      )
    case "key":
      return (
        <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
          <Key className="w-5 h-5" />
        </div>
      )
    case "link":
      return (
        <div className="w-10 h-10 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
          <Link2 className="w-5 h-5" />
        </div>
      )
    case "star":
      return (
        <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
          <Star className="w-5 h-5 fill-orange-500 text-orange-500" />
        </div>
      )
    default:
      return null
  }
}

export function SeoKpiCards({ items, onKpiClick }: SeoKpiCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
      {items.map((kpi) => (
        <div
          key={kpi.id}
          onClick={() => onKpiClick?.(kpi.id)}
          className="bg-white rounded-xl border border-slate-100 p-4 shadow-xs flex flex-col justify-between hover:border-slate-200 transition-colors cursor-pointer"
        >
          <div className="flex items-start gap-3">
            {renderSeoKpiIcon(kpi.iconType)}
            <div className="min-w-0 flex-1">
              <span className="text-[11px] leading-tight text-slate-500 font-medium block h-[28px] line-clamp-2">
                {kpi.title}
              </span>
              <div className="text-xl font-bold text-slate-900 mt-1 tracking-tight truncate">
                {kpi.value}
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-50 flex items-center gap-1.5 text-xs">
            <span className="inline-flex items-center gap-0.5 font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded text-[11px]">
              {kpi.trendDirection === "down" ? (
                <TrendingDown className="w-3 h-3 text-emerald-600" />
              ) : (
                <TrendingUp className="w-3 h-3 text-emerald-600" />
              )}
              {kpi.trendPercent}
            </span>
            <span className="text-slate-400 text-[11px] truncate">
              {kpi.trendPeriod}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
