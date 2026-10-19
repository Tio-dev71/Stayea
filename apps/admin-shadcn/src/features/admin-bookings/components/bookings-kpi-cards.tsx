"use client"

import {
  Calendar,
  Clock,
  Bed,
  DollarSign,
  ArrowUp,
} from "lucide-react"
import type { BookingKpiItem } from "@/features/admin-bookings/stayea-admin-bookings-mock-data"
import { BOOKINGS_KPIS } from "@/features/admin-bookings/stayea-admin-bookings-mock-data"

interface BookingsKpiCardsProps {
  kpis?: readonly BookingKpiItem[]
}

function renderKpiIcon(type: BookingKpiItem["iconType"]) {
  const iconClass = "w-5 h-5 transition-transform group-hover:scale-110"
  switch (type) {
    case "calendar": {
      return <Calendar className={iconClass} />
    }
    case "clock": {
      return <Clock className={iconClass} />
    }
    case "bed": {
      return <Bed className={iconClass} />
    }
    case "currency": {
      return <DollarSign className={iconClass} />
    }
  }
}

function getIconContainerClass(type: BookingKpiItem["iconType"]) {
  switch (type) {
    case "calendar":
    case "currency": {
      return "bg-[#eef8f3] text-[#1b7a4e]"
    }
    case "clock": {
      return "bg-amber-50 text-amber-600"
    }
    case "bed": {
      return "bg-sky-50 text-sky-600"
    }
  }
}

export function BookingsKpiCards({
  kpis = BOOKINGS_KPIS,
}: BookingsKpiCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {kpis.map((kpi) => (
        <div
          key={kpi.id}
          className="group relative bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md hover:border-slate-300 transition-all text-left flex flex-col justify-between gap-3"
        >
          {/* Top Row: Icon & Title */}
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${getIconContainerClass(
                kpi.iconType
              )}`}
            >
              {renderKpiIcon(kpi.iconType)}
            </div>
            <span className="text-xs sm:text-sm font-medium text-slate-600 leading-tight">
              {kpi.title}
            </span>
          </div>

          {/* Middle: Big Value */}
          <div className="mt-1">
            <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {kpi.value}
            </span>
          </div>

          {/* Bottom: Trend and comparison text */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="inline-flex items-center font-bold text-emerald-600">
              <ArrowUp className="w-3 h-3 stroke-[3]" />
              <span>{kpi.change}</span>
            </span>
            <span className="text-slate-400 font-medium">
              {kpi.comparisonText}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
