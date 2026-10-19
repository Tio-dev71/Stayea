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
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
      {kpis.map((card) => {
        const isUp = card.changeType === "up"

        return (
          <div
            key={card.id}
            className="bg-white border border-slate-200/85 rounded-2xl p-4 sm:p-4.5 shadow-2xs hover:shadow-xs transition-all flex items-start gap-3.5"
          >
            {/* Left circular/rounded badge icon */}
            <div
              className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 ${getBookingIconWrapperBg(
                card.icon
              )}`}
            >
              {getBookingIcon(card.icon)}
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
                <span
                  className={`font-bold flex items-center gap-0.5 ${
                    isUp ? "text-emerald-600" : "text-rose-500"
                  }`}
                >
                  {isUp ? (
                    <TrendingUp className="w-3.5 h-3.5 shrink-0" />
                  ) : (
                    <TrendingDown className="w-3.5 h-3.5 shrink-0" />
                  )}
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
