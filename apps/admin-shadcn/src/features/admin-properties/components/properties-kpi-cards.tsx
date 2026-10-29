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
  const iconClass = "w-5 h-5 shrink-0"
  switch (type) {
    case "total": {
      return (
        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
          <Home className={iconClass} />
        </div>
      )
    }
    case "active": {
      return (
        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
          <Building2 className={iconClass} />
        </div>
      )
    }
    case "paused": {
      return (
        <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
          <Pause className={iconClass} />
        </div>
      )
    }
    case "pending": {
      return (
        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
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
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {kpiData.map((kpi) => (
        <div
          key={kpi.id}
          className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between gap-3 hover:shadow-md hover:border-slate-300 transition-all text-left"
        >
          {/* Top Row: Icon & Title */}
          <div className="flex items-center gap-3">
            {getKpiIcon(kpi.iconType)}
            <span className="text-xs sm:text-sm font-medium text-slate-700 leading-snug">
              {kpi.title}
            </span>
          </div>

          {/* Middle: Big Value */}
          <div className="mt-0.5">
            <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {kpi.value}
            </span>
          </div>

          {/* Bottom: Delta & Subtext */}
          <div className="flex items-center gap-1.5 text-xs">
            <span
              className={`font-semibold inline-flex items-center gap-0.5 ${
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
            <span className="text-slate-400 font-normal">
              {kpi.comparisonText}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
