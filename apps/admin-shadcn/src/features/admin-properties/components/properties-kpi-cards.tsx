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
        <div className="w-11 h-11 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
          <Home className={iconClass} />
        </div>
      )
    }
    case "active": {
      return (
        <div className="w-11 h-11 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
          <Building2 className={iconClass} />
        </div>
      )
    }
    case "paused": {
      return (
        <div className="w-11 h-11 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center">
          <Pause className={iconClass} />
        </div>
      )
    }
    case "pending": {
      return (
        <div className="w-11 h-11 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
          <Clock className={iconClass} />
        </div>
      )
    }
  }
}

export function PropertiesKpiCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {PROPERTIES_KPI_DATA.map((kpi) => (
        <div
          key={kpi.id}
          className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex items-center gap-4 hover:shadow-md transition-shadow"
        >
          {getKpiIcon(kpi.iconType)}
          <div className="flex-1 min-w-0">
            <span className="text-xs text-slate-500 font-medium block truncate">
              {kpi.title}
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-bold text-slate-900 tracking-tight">
                {kpi.value}
              </span>
            </div>
            <div className="flex items-center gap-1 mt-1 text-xs">
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
        </div>
      ))}
    </div>
  )
}
