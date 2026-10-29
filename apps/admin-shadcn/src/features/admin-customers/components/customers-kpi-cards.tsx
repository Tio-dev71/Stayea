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
  const iconClass = "w-5 h-5 shrink-0"
  switch (type) {
    case "total": {
      return (
        <div className="w-11 h-11 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
          <Users className={iconClass} />
        </div>
      )
    }
    case "loyal": {
      return (
        <div className="w-11 h-11 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
          <Crown className={iconClass} />
        </div>
      )
    }
    case "new": {
      return (
        <div className="w-11 h-11 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
          <UserPlus className={iconClass} />
        </div>
      )
    }
    case "revenue": {
      return (
        <div className="w-11 h-11 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
          <Wallet className={iconClass} />
        </div>
      )
    }
  }
}

interface CustomersKpiCardsProps {
  kpiData?: readonly CustomerKpiItem[]
}

export function CustomersKpiCards({
  kpiData = CUSTOMERS_KPI_DATA,
}: CustomersKpiCardsProps = {}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpiData.map((kpi) => (
        <div
          key={kpi.id}
          className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex items-center gap-4 hover:shadow-md transition-shadow"
        >
          {getCustomerKpiIcon(kpi.iconType)}
          <div className="flex-1 min-w-0">
            <span className="text-xs text-slate-500 font-medium block truncate">
              {kpi.title}
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
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
