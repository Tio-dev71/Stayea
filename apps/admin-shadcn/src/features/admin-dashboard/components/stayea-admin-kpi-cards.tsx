"use client"

import {
  Calendar,
  DollarSign,
  Home,
  Users,
  ArrowUp,
} from "lucide-react"
import type { AdminKpiItem } from "@/features/admin-dashboard/stayea-admin-mock-data"
import { ADMIN_KPIS_VI } from "@/features/admin-dashboard/stayea-admin-mock-data"

interface StayeaAdminKpiCardsProps {
  kpis?: readonly AdminKpiItem[]
}

function renderKpiIcon(name: AdminKpiItem["iconName"]) {
  const iconClass = "w-4 h-4 transition-transform group-hover:scale-110"
  switch (name) {
    case "calendar":
      return <Calendar className={iconClass} />
    case "currency":
      return <DollarSign className={iconClass} />
    case "home":
      return <Home className={iconClass} />
    case "users":
      return <Users className={iconClass} />
  }
}

function renderKpiValue(value: string) {
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
              : "text-xl sm:text-2xl xl:text-[22px] 2xl:text-2xl"
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
      <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight tabular-nums truncate">
        {value}
      </span>
    </div>
  )
}

export function StayeaAdminKpiCards({
  kpis = ADMIN_KPIS_VI,
}: StayeaAdminKpiCardsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
      {kpis.map((kpi) => (
        <div
          key={kpi.id}
          className="group relative bg-white border border-slate-200/80 rounded-2xl p-3.5 sm:p-4 shadow-xs hover:shadow-md hover:border-slate-300 transition-all text-left flex flex-col justify-between gap-2.5"
        >
          {/* Top Row: Title on Left, Icon Badge on Top-Right */}
          <div className="flex items-start justify-between gap-2">
            <span className="text-xs sm:text-[13px] font-semibold text-slate-600 leading-snug line-clamp-2">
              {kpi.title}
            </span>
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                kpi.id === "total-guests"
                  ? "bg-sky-50 text-sky-600"
                  : "bg-[#eef8f3] text-[#1b7a4e]"
              }`}
            >
              {renderKpiIcon(kpi.iconName)}
            </div>
          </div>

          {/* Middle: Value */}
          <div className="my-0.5">
            {renderKpiValue(kpi.value)}
          </div>

          {/* Bottom: Trend and comparison text */}
          <div className="flex items-center gap-1.5 text-[11px] sm:text-xs">
            <span className="inline-flex items-center font-bold text-emerald-600 shrink-0">
              <ArrowUp className="w-3 h-3 stroke-[3]" />
              <span>{kpi.change}</span>
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
