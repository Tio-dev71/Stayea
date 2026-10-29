"use client"

import {
  Users,
  Crown,
  UserPlus,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"
import type { CustomerKpiItem } from "@/features/admin-customers/stayea-admin-customers-mock-data"
import { CUSTOMERS_KPI_DATA } from "@/features/admin-customers/stayea-admin-customers-mock-data"

function getCustomerKpiIcon(type: CustomerKpiItem["iconType"]) {
  const iconClass = "w-4 h-4 shrink-0"
  switch (type) {
    case "total": {
      return (
        <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
          <Users className={iconClass} />
        </div>
      )
    }
    case "loyal": {
      return (
        <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
          <Crown className={iconClass} />
        </div>
      )
    }
    case "new": {
      return (
        <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
          <UserPlus className={iconClass} />
        </div>
      )
    }
    case "revenue": {
      return (
        <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
          <Wallet className={iconClass} />
        </div>
      )
    }
  }
}

function renderCustomerKpiValue(value: string) {
  const trimmed = value.trim()
  const match = trimmed.match(/^([\d.,]+[M|K|B|m|k|b]?)\s*([₫đđD]|\S+)?$/i)
  if (match && match[1]) {
    const numPart = match[1]
    const suffix = match[2] || ""
    return (
      <div className="flex items-baseline gap-1 overflow-hidden" title={value}>
        <span className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900 tracking-tight tabular-nums truncate">
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

interface CustomersKpiCardsProps {
  kpiData?: readonly CustomerKpiItem[]
}

export function CustomersKpiCards({
  kpiData = CUSTOMERS_KPI_DATA,
}: CustomersKpiCardsProps = {}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 2xl:grid-cols-4 gap-3 sm:gap-4">
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
              {getCustomerKpiIcon(kpi.iconType)}
            </div>
          </div>

          {/* Middle: Big Value */}
          <div className="my-0.5">
            {renderCustomerKpiValue(kpi.value)}
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
