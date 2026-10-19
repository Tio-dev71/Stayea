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
  const iconClass = "w-5 h-5 transition-transform group-hover:scale-110"
  switch (name) {
    case "calendar": {
      return <Calendar className={iconClass} />
    }
    case "currency": {
      return <DollarSign className={iconClass} />
    }
    case "home": {
      return <Home className={iconClass} />
    }
    case "users": {
      return <Users className={iconClass} />
    }
  }
}

export function StayeaAdminKpiCards({
  kpis = ADMIN_KPIS_VI,
}: StayeaAdminKpiCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {kpis.map((kpi) => (
        <div
          key={kpi.id}
          className="group relative bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md hover:border-slate-300 transition-all text-left flex flex-col justify-between gap-3"
        >
          {/* Top Row: Icon on left, Title on right */}
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                kpi.id === "total-guests"
                  ? "bg-sky-50 text-sky-600"
                  : "bg-[#eef8f3] text-[#1b7a4e]"
              }`}
            >
              {renderKpiIcon(kpi.iconName)}
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
