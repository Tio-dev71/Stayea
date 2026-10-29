import { Users, Handshake, Clock, Ban, TrendingUp, TrendingDown } from "lucide-react"
import { HOSTS_KPI_DATA } from "@/features/admin-hosts/stayea-admin-hosts-mock-data"
import type { HostKpiItem } from "@/features/admin-hosts/stayea-admin-hosts-mock-data"

function renderHostKpiIcon(iconType: HostKpiItem["iconType"]) {
  const iconClass = "w-5 h-5"
  switch (iconType) {
    case "total":
      return (
        <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
          <Users className={iconClass} />
        </div>
      )
    case "active":
      return (
        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
          <Handshake className={iconClass} />
        </div>
      )
    case "pending":
      return (
        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
          <Clock className={iconClass} />
        </div>
      )
    case "paused":
      return (
        <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
          <Ban className={iconClass} />
        </div>
      )
  }
}

export function HostsKpiCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {HOSTS_KPI_DATA.map((item) => (
        <div
          key={item.id}
          className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between gap-3 text-left"
        >
          {/* Top Row: Icon & Title */}
          <div className="flex items-center gap-3">
            {renderHostKpiIcon(item.iconType)}
            <span className="text-xs sm:text-sm font-medium text-slate-700 leading-snug">
              {item.title}
            </span>
          </div>

          {/* Middle: Big Value */}
          <div className="mt-0.5">
            <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight whitespace-nowrap">
              {item.value}
            </span>
          </div>

          {/* Bottom Row: Trend & Subtext */}
          <div className="flex items-center gap-1.5 text-xs">
            {item.isPositive ? (
              <span className="font-semibold text-emerald-600 inline-flex items-center gap-0.5">
                <TrendingUp className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>{item.change}</span>
              </span>
            ) : (
              <span className="font-semibold text-rose-600 inline-flex items-center gap-0.5">
                <TrendingDown className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>{item.change}</span>
              </span>
            )}
            <span className="text-slate-400 font-normal">
              {item.comparisonText}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
