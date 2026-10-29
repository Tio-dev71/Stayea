"use client"

import {
  UserCheck,
  UserPlus,
  Users,
  Crown,
  TrendingUp,
} from "lucide-react"
import type { CustomerReportKpiItem } from "@/features/admin-reports/stayea-admin-reports-customers-mock-data"
import { MOCK_CUSTOMER_REPORT_KPIS } from "@/features/admin-reports/stayea-admin-reports-customers-mock-data"

function getCustomerKpiIcon(type: CustomerReportKpiItem["icon"]) {
  switch (type) {
    case "user-check":
      return <UserCheck className="w-5 h-5 text-emerald-600" />
    case "user-plus":
      return <UserPlus className="w-5 h-5 text-sky-600" />
    case "users":
      return <Users className="w-5 h-5 text-teal-600" />
    case "crown":
      return <Crown className="w-5 h-5 text-amber-600" />
    default:
      return <UserCheck className="w-5 h-5 text-emerald-600" />
  }
}

function getCustomerKpiBg(type: CustomerReportKpiItem["icon"]) {
  switch (type) {
    case "user-check":
      return "bg-emerald-50 border-emerald-100/80"
    case "user-plus":
      return "bg-sky-50 border-sky-100/80"
    case "users":
      return "bg-teal-50 border-teal-100/80"
    case "crown":
      return "bg-amber-50 border-amber-100/80"
    default:
      return "bg-slate-50 border-slate-100"
  }
}

interface ReportsCustomersKpiCardsProps {
  kpis?: CustomerReportKpiItem[]
}

export function ReportsCustomersKpiCards({
  kpis = MOCK_CUSTOMER_REPORT_KPIS,
}: ReportsCustomersKpiCardsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
      {kpis.map((card) => (
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
              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${getCustomerKpiBg(
                card.icon
              )}`}
            >
              {getCustomerKpiIcon(card.icon)}
            </div>
          </div>

          {/* Middle: Big Value */}
          <div className="my-0.5">
            <span className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900 tracking-tight tabular-nums truncate block">
              {card.value}
            </span>
          </div>

          {/* Bottom: Trend */}
          <div className="flex items-center gap-1.5 text-[11px] sm:text-xs">
            <span className="font-bold text-emerald-600 flex items-center gap-0.5 shrink-0">
              <TrendingUp className="w-3.5 h-3.5 stroke-[2.5]" />
              {card.changePercent}
            </span>
            <span className="text-slate-400 font-medium truncate">
              {card.subText}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
