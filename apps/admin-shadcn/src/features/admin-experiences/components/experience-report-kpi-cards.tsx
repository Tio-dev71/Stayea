"use client"

import {
  Ticket,
  Users,
  Coins,
  Star,
  MapPin,
  TrendingUp,
  TrendingDown,
} from "lucide-react"
import type { ExperienceReportKpiItem } from "@/features/admin-experiences/stayea-admin-experience-report-mock-data"

interface ExperienceReportKpiCardsProps {
  items: ExperienceReportKpiItem[]
  onKpiClick?: (id: string) => void
}

function renderExperienceKpiIcon(iconType: ExperienceReportKpiItem["iconType"]) {
  switch (iconType) {
    case "ticket":
      return (
        <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
          <Ticket className="w-5 h-5" />
        </div>
      )
    case "users":
      return (
        <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
          <Users className="w-5 h-5" />
        </div>
      )
    case "revenue":
      return (
        <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
          <Coins className="w-5 h-5" />
        </div>
      )
    case "star":
      return (
        <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
          <Star className="w-5 h-5 fill-rose-500 text-rose-500" />
        </div>
      )
    case "location":
      return (
        <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
          <MapPin className="w-5 h-5" />
        </div>
      )
    default:
      return null
  }
}

export function ExperienceReportKpiCards({
  items,
  onKpiClick,
}: ExperienceReportKpiCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
      {items.map((kpi) => (
        <div
          key={kpi.id}
          onClick={() => onKpiClick?.(kpi.id)}
          className="bg-white rounded-xl border border-slate-100 p-4 shadow-xs flex flex-col justify-between hover:border-slate-200 transition-colors cursor-pointer"
        >
          <div className="flex items-start gap-3">
            {renderExperienceKpiIcon(kpi.iconType)}
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
