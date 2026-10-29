"use client"

import {
  Home,
  Building2,
  Pause,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"
import type { PropertyKpiItem } from "@/features/admin-properties/stayea-admin-properties-mock-data"
import { PROPERTIES_KPI_DATA } from "@/features/admin-properties/stayea-admin-properties-mock-data"

function getKpiIcon(type: PropertyKpiItem["iconType"]) {
  const iconClass = "w-4 h-4 shrink-0"
  switch (type) {
    case "total": {
      return (
        <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
          <Home className={iconClass} />
        </div>
      )
    }
    case "active": {
      return (
        <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
          <Building2 className={iconClass} />
        </div>
      )
    }
    case "paused": {
      return (
        <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
          <Pause className={iconClass} />
        </div>
      )
    }
    case "pending": {
      return (
        <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
          <Clock className={iconClass} />
        </div>
      )
    }
  }
}

interface PropertiesKpiCardsProps {
  kpiData?: readonly PropertyKpiItem[]
}

export function PropertiesKpiCards({
  kpiData = PROPERTIES_KPI_DATA,
}: PropertiesKpiCardsProps = {}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
      {kpiData.map((kpi) => (
        <div
          key={kpi.id}
          className="group relative bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-200/80 shadow-xs flex flex-col justify-between gap-2.5 hover:shadow-md hover:border-slate-300 transition-all text-left"
        >
          {/* Top Row: Title on Left, Icon Badge on Top-Right */}
          <div className="flex items-start justify-between gap-2">
            <span className="text-xs sm:text-[13px] font-semibold text-slate-600 leading-snug line-clamp-2">
              {kpi.title}
            </span>
            <div className="shrink-0">
              {getKpiIcon(kpi.iconType)}
            </div>
          </div>

          {/* Middle: Big Value */}
          <div className="my-0.5">
            <span className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900 tracking-tight tabular-nums">
              {kpi.value}
            </span>
          </div>

          {/* Bottom: Delta & Subtext */}
          <div className="flex items-center gap-1.5 text-[11px] sm:text-xs">
            <span
              className={`font-bold inline-flex items-center gap-0.5 shrink-0 ${
                kpi.isPositive ? "text-emerald-600" : "text-rose-500"
              }`}
            >
              {kpi.isPositive ? (
                <ArrowUpRight className="w-3.5 h-3.5" />
              ) : (
                <ArrowDownRight className="w-3.5 h-3.5" />
              )}
              {kpi.change}
            </span>
            <span className="text-slate-400 font-medium truncate">
              {kpi.comparisonText}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
