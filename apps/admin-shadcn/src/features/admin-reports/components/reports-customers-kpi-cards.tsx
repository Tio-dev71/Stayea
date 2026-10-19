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
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
      {kpis.map((card) => (
        <div
          key={card.id}
          className="bg-white border border-slate-200/85 rounded-2xl p-3.5 sm:p-4 shadow-2xs hover:shadow-xs transition-all flex items-start gap-3"
        >
          {/* Left circular/rounded badge icon */}
          <div
            className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 ${getCustomerKpiBg(
              card.icon
            )}`}
          >
            {getCustomerKpiIcon(card.icon)}
          </div>

          {/* Right card content */}
          <div className="flex-1 min-w-0">
            <span className="text-[11.5px] sm:text-xs xl:text-[12.5px] 2xl:text-[13px] font-medium text-slate-500 block leading-tight truncate">
              {card.title}
            </span>
            <div className="text-[19px] sm:text-[21px] font-bold text-slate-900 tracking-tight mt-0.5 leading-snug">
              {card.value}
            </div>

            <div className="flex items-center flex-wrap gap-1 mt-1 text-xs">
              <span className="font-bold text-emerald-600 flex items-center gap-0.5">
                <TrendingUp className="w-3.5 h-3.5 shrink-0" />
                {card.changePercent}
              </span>
              <span className="text-[11px] text-slate-400 font-normal">
                {card.subText}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
