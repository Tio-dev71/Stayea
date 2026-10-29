"use client"

import {
  FileText,
  Eye,
  Heart,
  Link2,
  Users,
  TrendingUp,
} from "lucide-react"
import { MOCK_CONTENT_PAGE_KPIS } from "@/features/admin-marketing/stayea-admin-marketing-mock-data"
import type { ContentPageKpi } from "@/features/admin-marketing/stayea-admin-marketing-mock-data"

interface ContentKpiCardsProps {
  items?: ContentPageKpi[]
  onKpiClick?: (id: string) => void
}

function getIconConfig(type: ContentPageKpi["iconType"]) {
  switch (type) {
    case "file-text":
      return {
        icon: FileText,
        bg: "bg-emerald-50",
        text: "text-[#007a48]",
      }
    case "eye":
      return {
        icon: Eye,
        bg: "bg-emerald-50",
        text: "text-emerald-600",
      }
    case "heart":
      return {
        icon: Heart,
        bg: "bg-rose-50",
        text: "text-rose-500",
      }
    case "link":
      return {
        icon: Link2,
        bg: "bg-emerald-50",
        text: "text-emerald-600",
      }
    case "users":
      return {
        icon: Users,
        bg: "bg-sky-50",
        text: "text-sky-600",
      }
    default:
      return {
        icon: TrendingUp,
        bg: "bg-slate-50",
        text: "text-slate-600",
      }
  }
}

export function ContentKpiCards({
  items = MOCK_CONTENT_PAGE_KPIS,
  onKpiClick,
}: ContentKpiCardsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-5 gap-3 sm:gap-4">
      {items.map((kpi) => {
        const { icon: IconComp, bg, text } = getIconConfig(kpi.iconType)

        return (
          <div
            key={kpi.id}
            onClick={() => onKpiClick?.(kpi.id)}
            className="group relative bg-white rounded-2xl border border-slate-200/80 p-3.5 sm:p-4 shadow-xs hover:shadow-md hover:border-slate-300 transition-all cursor-pointer flex flex-col justify-between gap-2.5 text-left"
          >
            {/* Top Row: Title on Left, Icon Badge on Top-Right */}
            <div className="flex items-start justify-between gap-2">
              <span className="text-xs sm:text-[13px] font-semibold text-slate-600 leading-snug line-clamp-2">
                {kpi.label}
              </span>
              <div
                className={`w-8 h-8 shrink-0 rounded-xl flex items-center justify-center ${bg} ${text}`}
              >
                <IconComp className="w-4 h-4" />
              </div>
            </div>

            {/* Middle: Big Value */}
            <div className="my-0.5">
              <span className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900 tracking-tight tabular-nums truncate block">
                {kpi.value}
              </span>
            </div>

            {/* Bottom: Trend */}
            <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-emerald-600">
              <TrendingUp className="w-3.5 h-3.5 shrink-0 stroke-[2.5]" />
              <span className="font-bold">{kpi.trend}</span>
              <span className="text-slate-400 font-medium truncate">
                {kpi.comparisonText}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
