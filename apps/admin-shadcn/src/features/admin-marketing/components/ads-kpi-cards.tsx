"use client"

import {
  Megaphone,
  Eye,
  MousePointer,
  Users,
  BarChart3,
  TrendingUp,
  TrendingDown,
} from "lucide-react"
import type { AdsKpiItem } from "@/features/admin-marketing/stayea-admin-marketing-mock-data"

interface AdsKpiCardsProps {
  items: AdsKpiItem[]
}

function renderKpiIcon(iconType: AdsKpiItem["iconType"]) {
  switch (iconType) {
    case "megaphone":
      return (
        <div className="w-10 h-10 rounded-full bg-emerald-50 text-[#007a48] flex items-center justify-center shrink-0">
          <Megaphone className="w-5 h-5" />
        </div>
      )
    case "eye":
      return (
        <div className="w-10 h-10 rounded-full bg-emerald-50 text-[#007a48] flex items-center justify-center shrink-0">
          <Eye className="w-5 h-5" />
        </div>
      )
    case "cursor":
      return (
        <div className="w-10 h-10 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
          <MousePointer className="w-5 h-5" />
        </div>
      )
    case "users":
      return (
        <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
          <Users className="w-5 h-5" />
        </div>
      )
    case "roas":
      return (
        <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
          <BarChart3 className="w-5 h-5" />
        </div>
      )
    default:
      return null
  }
}

export function AdsKpiCards({ items }: AdsKpiCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
      {items.map((kpi) => (
        <div
          key={kpi.id}
          className="bg-white rounded-xl border border-slate-100 p-4 shadow-xs flex flex-col justify-between hover:border-slate-200 transition-colors"
        >
          <div className="flex items-start gap-3">
            {renderKpiIcon(kpi.iconType)}
            <div className="min-w-0 flex-1">
              <span className="text-xs text-slate-500 font-medium line-clamp-1">
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
