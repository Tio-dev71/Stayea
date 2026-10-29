"use client"

import {
  CalendarCheck,
  CheckCircle2,
  Clock,
  XCircle,
  TrendingUp,
  TrendingDown,
} from "lucide-react"
import type { BookingReportKpiItem } from "@/features/admin-reports/stayea-admin-reports-bookings-mock-data"
import { MOCK_BOOKING_REPORT_KPIS } from "@/features/admin-reports/stayea-admin-reports-bookings-mock-data"

function getBookingIcon(type: BookingReportKpiItem["icon"]) {
  switch (type) {
    case "calendar-check":
      return <CalendarCheck className="w-5 h-5 text-sky-600" />
    case "check-circle":
      return <CheckCircle2 className="w-5 h-5 text-emerald-600" />
    case "clock":
      return <Clock className="w-5 h-5 text-amber-600" />
    case "x-circle":
      return <XCircle className="w-5 h-5 text-rose-600" />
    default:
      return <CalendarCheck className="w-5 h-5 text-sky-600" />
  }
}

function getBookingIconWrapperBg(type: BookingReportKpiItem["icon"]) {
  switch (type) {
    case "calendar-check":
      return "bg-sky-50 border-sky-100/80"
    case "check-circle":
      return "bg-emerald-50 border-emerald-100/80"
    case "clock":
      return "bg-amber-50 border-amber-100/80"
    case "x-circle":
      return "bg-rose-50 border-rose-100/80"
    default:
      return "bg-slate-50 border-slate-100"
  }
}

interface ReportsBookingsKpiCardsProps {
  kpis?: BookingReportKpiItem[]
}

export function ReportsBookingsKpiCards({
  kpis = MOCK_BOOKING_REPORT_KPIS,
}: ReportsBookingsKpiCardsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
      {kpis.map((card) => {
        const isUp = card.changeType === "up"

        return (
          <div
            key={card.id}
            className="group relative bg-white border border-slate-200/80 rounded-2xl p-3.5 sm:p-4 shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between gap-2.5 text-left"
          >
            {/* Top Row: Title on Left, Icon Badge on Top-Right */}
            <div className="flex items-start justify-between gap-2">
              <span className="text-xs sm:text-[13px] font-semibold text-slate-600 leading-snug line-clamp-2">
                {card.title}
              </span>
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${getBookingIconWrapperBg(
                  card.icon
                )}`}
              >
                {getBookingIcon(card.icon)}
              </div>
            </div>

            {/* Middle: Big Value */}
            <div className="my-0.5">
              <span className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900 tracking-tight tabular-nums truncate block">
                {card.value}
              </span>
            </div>

            {/* Bottom: Trend & Subtext */}
            <div className="flex items-center gap-1.5 text-[11px] sm:text-xs">
              <span
                className={`font-bold flex items-center gap-0.5 shrink-0 ${
                  isUp ? "text-emerald-600" : "text-rose-500"
                }`}
              >
                {isUp ? (
                  <TrendingUp className="w-3.5 h-3.5 stroke-[2.5]" />
                ) : (
                  <TrendingDown className="w-3.5 h-3.5 stroke-[2.5]" />
                )}
                {card.changePercent}
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
