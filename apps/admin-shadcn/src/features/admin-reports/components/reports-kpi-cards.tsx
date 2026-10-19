"use client"

import {
  BarChart3,
  CalendarDays,
  Users,
  MousePointer2,
  TrendingUp,
} from "lucide-react"
import type { ReportKpiCardItem } from "@/features/admin-reports/stayea-admin-reports-mock-data"
import { MOCK_REPORT_KPIS } from "@/features/admin-reports/stayea-admin-reports-mock-data"

function getIcon(type: ReportKpiCardItem["icon"]) {
  switch (type) {
    case "bar-chart":
      return <BarChart3 className="w-5 h-5 text-emerald-600" />
    case "calendar":
      return <CalendarDays className="w-5 h-5 text-sky-600" />
    case "users":
      return <Users className="w-5 h-5 text-amber-600" />
    case "mouse-pointer":
      return <MousePointer2 className="w-5 h-5 text-purple-600" />
    default:
      return <BarChart3 className="w-5 h-5 text-emerald-600" />
  }
}

function getIconWrapperBg(type: ReportKpiCardItem["icon"]) {
  switch (type) {
    case "bar-chart":
      return "bg-emerald-50 border-emerald-100/80"
    case "calendar":
      return "bg-sky-50 border-sky-100/80"
    case "users":
      return "bg-amber-50 border-amber-100/80"
    case "mouse-pointer":
      return "bg-purple-50 border-purple-100/80"
    default:
      return "bg-slate-50 border-slate-100"
  }
}

interface ReportsKpiCardsProps {
  kpis?: ReportKpiCardItem[]
}

export function ReportsKpiCards({ kpis = MOCK_REPORT_KPIS }: ReportsKpiCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
      {kpis.map((card) => {
        return (
          <div
            key={card.id}
            className="bg-white border border-slate-200/85 rounded-2xl p-4 sm:p-4.5 shadow-2xs hover:shadow-xs transition-all flex items-start gap-3.5"
          >
            {/* Left circular/rounded badge icon */}
            <div
              className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 ${getIconWrapperBg(
                card.icon
              )}`}
            >
              {getIcon(card.icon)}
            </div>

            {/* Right card content */}
            <div className="flex-1 min-w-0">
              <span className="text-[12px] sm:text-[13px] font-medium text-slate-500 block truncate">
                {card.title}
              </span>
              <div className="text-[19px] sm:text-[21px] font-bold text-slate-900 tracking-tight mt-0.5 leading-snug">
                {card.value}
              </div>

              <div className="flex items-center flex-wrap gap-1 mt-1 text-xs">
                <span className="font-bold text-emerald-600 flex items-center gap-0.5">
                  <TrendingUp className="w-3.5 h-3.5 shrink-0" />
                  {card.changePercent}
                </span>
                <span className="text-[11px] text-slate-400 font-normal">
                  {card.subText}
                </span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
