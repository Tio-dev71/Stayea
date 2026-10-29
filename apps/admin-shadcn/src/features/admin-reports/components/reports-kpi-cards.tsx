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
  const iconClass = "w-4 h-4"
  switch (type) {
    case "bar-chart":
      return <BarChart3 className={`${iconClass} text-emerald-600`} />
    case "calendar":
      return <CalendarDays className={`${iconClass} text-sky-600`} />
    case "users":
      return <Users className={`${iconClass} text-amber-600`} />
    case "mouse-pointer":
      return <MousePointer2 className={`${iconClass} text-purple-600`} />
    default:
      return <BarChart3 className={`${iconClass} text-emerald-600`} />
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

function renderReportKpiValue(value: string) {
  const trimmed = value.trim()
  const match = trimmed.match(/^([\d.,]+)\s*([₫đđD]|\S+)?$/i)
  if (match && match[1]) {
    const numPart = match[1]
    const suffix = match[2] || ""
    const isLong = numPart.length > 7
    return (
      <div className="flex items-baseline gap-1 overflow-hidden" title={value}>
        <span
          className={`font-black text-slate-900 tracking-tight tabular-nums truncate ${
            isLong
              ? "text-base sm:text-lg xl:text-[17px] 2xl:text-[20px]"
              : "text-xl sm:text-2xl 2xl:text-3xl"
          }`}
        >
          {numPart}
        </span>
        {suffix && (
          <span className="text-xs sm:text-sm font-bold text-emerald-800/80 shrink-0 select-none">
            {suffix}
          </span>
        )}
      </div>
    )
  }
  return (
    <div className="overflow-hidden" title={value}>
      <span className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900 tracking-tight tabular-nums truncate">
        {value}
      </span>
    </div>
  )
}

interface ReportsKpiCardsProps {
  kpis?: ReportKpiCardItem[]
}

export function ReportsKpiCards({ kpis = MOCK_REPORT_KPIS }: ReportsKpiCardsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
      {kpis.map((card) => {
        return (
          <div
            key={card.id}
            className="group relative bg-white border border-slate-200/85 rounded-2xl p-3.5 sm:p-4 shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between gap-2.5 text-left"
          >
            {/* Top Row: Title on Left, Icon Badge on Top-Right */}
            <div className="flex items-start justify-between gap-2">
              <span className="text-xs sm:text-[13px] font-semibold text-slate-600 leading-snug line-clamp-2">
                {card.title}
              </span>
              <div
                className={`w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 ${getIconWrapperBg(
                  card.icon
                )}`}
              >
                {getIcon(card.icon)}
              </div>
            </div>

            {/* Middle: Big Value */}
            <div className="my-0.5">
              {renderReportKpiValue(card.value)}
            </div>

            {/* Bottom Row: Trend and Subtext */}
            <div className="flex items-center gap-1.5 text-[11px] sm:text-xs">
              <span className="font-bold text-emerald-600 inline-flex items-center gap-0.5 shrink-0">
                <TrendingUp className="w-3.5 h-3.5 shrink-0" />
                <span>{card.changePercent}</span>
              </span>
              <span className="text-slate-400 font-medium truncate">
                {card.subText}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
