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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {HOSTS_KPI_DATA.map((item) => (
        <div
          key={item.id}
          className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs flex items-center gap-3.5 hover:border-slate-300 transition-colors"
        >
          {renderHostKpiIcon(item.iconType)}
          <div className="min-w-0 flex-1">
            <span className="text-xs font-medium text-slate-500 block truncate">
              {item.title}
            </span>
            <div className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-tight mt-0.5">
              {item.value}
            </div>
            <div className="flex items-center gap-1 mt-1 text-[11px]">
              {item.isPositive ? (
                <span className="font-semibold text-emerald-600 flex items-center gap-0.5">
                  <TrendingUp className="w-3 h-3 stroke-[2.5]" />
                  <span>{item.change}</span>
                </span>
              ) : (
                <span className="font-semibold text-rose-600 flex items-center gap-0.5">
                  <TrendingDown className="w-3 h-3 stroke-[2.5]" />
                  <span>{item.change}</span>
                </span>
              )}
              <span className="text-slate-400 font-normal truncate">
                {item.comparisonText}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
