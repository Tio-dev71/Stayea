"use client"

import { Megaphone, Users, CheckCircle, PauseCircle, TrendingUp, TrendingDown } from "lucide-react"
import type { CampaignPageKpiItem } from "@/features/admin-marketing/stayea-admin-marketing-mock-data"
import { MOCK_CAMPAIGN_PAGE_KPIS } from "@/features/admin-marketing/stayea-admin-marketing-mock-data"

interface CampaignsKpiCardsProps {
  kpis?: CampaignPageKpiItem[]
  onKpiClick?: (kpiId: string) => void
}

function renderKpiIcon(type: CampaignPageKpiItem["iconType"], iconColor: string) {
  switch (type) {
    case "megaphone":
      return <Megaphone className={`w-5 h-5 ${iconColor}`} />
    case "users":
      return <Users className={`w-5 h-5 ${iconColor}`} />
    case "check-circle":
      return <CheckCircle className={`w-5 h-5 ${iconColor}`} />
    case "pause-circle":
      return <PauseCircle className={`w-5 h-5 ${iconColor}`} />
  }
}

export function CampaignsKpiCards({
  kpis = MOCK_CAMPAIGN_PAGE_KPIS,
  onKpiClick,
}: CampaignsKpiCardsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
      {kpis.map((kpi) => (
        <div
          key={kpi.id}
          onClick={() => onKpiClick && onKpiClick(kpi.id)}
          className="group relative bg-white border border-slate-200/80 rounded-2xl p-3.5 sm:p-4 shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between gap-2.5 text-left cursor-pointer"
        >
          {/* Top Row: Title on Left, Icon Badge on Top-Right */}
          <div className="flex items-start justify-between gap-2">
            <span className="text-xs sm:text-[13px] font-semibold text-slate-600 leading-snug line-clamp-2">
              {kpi.label}
            </span>
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${kpi.bgLightColor}`}
            >
              {renderKpiIcon(kpi.iconType, kpi.iconColor)}
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
            <span
              className={`flex items-center font-bold shrink-0 ${
                kpi.trendDirection === "up" ? "text-[#007a48]" : "text-[#ef4444]"
              }`}
            >
              {kpi.trendDirection === "up" ? (
                <TrendingUp className="w-3.5 h-3.5 stroke-[2.5]" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5 stroke-[2.5]" />
              )}
              {kpi.trend.replaceAll(/[↑↓]/g, "").trim()}
            </span>
            <span className="text-slate-400 font-medium truncate">{kpi.comparisonText}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
