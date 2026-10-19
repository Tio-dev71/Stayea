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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi) => (
        <div
          key={kpi.id}
          onClick={() => onKpiClick && onKpiClick(kpi.id)}
          className="bg-white border border-slate-200/85 rounded-2xl p-4 sm:p-5 shadow-2xs hover:shadow-xs hover:border-slate-300 transition-all flex items-start gap-3.5 cursor-pointer group"
        >
          {/* Icon tròn nền pastel */}
          <div
            className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${kpi.bgLightColor} transition-transform group-hover:scale-105`}
          >
            {renderKpiIcon(kpi.iconType, kpi.iconColor)}
          </div>

          {/* Metric Details */}
          <div className="flex-1 min-w-0">
            <span className="text-xs font-medium text-slate-500 block truncate">
              {kpi.label}
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl sm:text-[26px] font-extrabold text-slate-900 tracking-tight leading-tight">
                {kpi.value}
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] font-medium">
              <span
                className={`flex items-center font-bold ${
                  kpi.trendDirection === "up" ? "text-[#007a48]" : "text-[#ef4444]"
                }`}
              >
                {kpi.trendDirection === "up" ? (
                  <TrendingUp className="w-3 h-3 mr-0.5" />
                ) : (
                  <TrendingDown className="w-3 h-3 mr-0.5" />
                )}
                {kpi.trend.replaceAll(/[↑↓]/g, "").trim()}
              </span>
              <span className="text-slate-400 truncate">{kpi.comparisonText}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
