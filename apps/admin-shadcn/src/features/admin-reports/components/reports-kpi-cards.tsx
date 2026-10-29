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
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {kpis.map((card) => {
        return (
          <div
            key={card.id}
            className="bg-white border border-slate-200/85 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between gap-3 text-left"
          >
            {/* Top Row: Icon & Title */}
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${getIconWrapperBg(
                  card.icon
                )}`}
              >
                {getIcon(card.icon)}
              </div>
              <span className="text-xs sm:text-sm font-medium text-slate-700 leading-snug">
                {card.title}
              </span>
            </div>

            {/* Middle: Big Value */}
            <div className="mt-0.5">
              <span className="text-lg sm:text-xl xl:text-2xl font-black text-slate-900 tracking-tight whitespace-nowrap">
                {card.value}
              </span>
            </div>

            {/* Bottom Row: Trend and Subtext */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="font-bold text-emerald-600 inline-flex items-center gap-0.5">
                <TrendingUp className="w-3.5 h-3.5 shrink-0" />
                <span>{card.changePercent}</span>
              </span>
              <span className="text-slate-400 font-normal">
                {card.subText}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
