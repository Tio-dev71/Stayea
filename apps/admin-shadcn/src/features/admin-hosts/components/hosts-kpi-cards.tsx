import { Users, Handshake, Clock, Ban, TrendingUp, TrendingDown } from "lucide-react"
import { HOSTS_KPI_DATA } from "@/features/admin-hosts/stayea-admin-hosts-mock-data"
import type { HostKpiItem } from "@/features/admin-hosts/stayea-admin-hosts-mock-data"

function renderHostKpiIcon(iconType: HostKpiItem["iconType"]) {
  const iconClass = "w-4 h-4 shrink-0"
  switch (iconType) {
    case "total":
      return (
        <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
          <Users className={iconClass} />
        </div>
      )
    case "active":
      return (
        <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
          <Handshake className={iconClass} />
        </div>
      )
    case "pending":
      return (
        <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
          <Clock className={iconClass} />
        </div>
      )
    case "paused":
      return (
        <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
          <Ban className={iconClass} />
        </div>
      )
  }
}

export function HostsKpiCards() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
      {HOSTS_KPI_DATA.map((item) => (
        <div
          key={item.id}
          className="group relative bg-white rounded-2xl border border-slate-200/80 p-3.5 sm:p-4 shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between gap-2.5 text-left"
        >
          {/* Top Row: Title on Left, Icon Badge on Top-Right */}
          <div className="flex items-start justify-between gap-2">
            <span className="text-xs sm:text-[13px] font-semibold text-slate-600 leading-snug line-clamp-2">
              {item.title}
            </span>
            <div className="shrink-0">
              {renderHostKpiIcon(item.iconType)}
            </div>
          </div>

          {/* Middle: Big Value */}
          <div className="my-0.5">
            <span className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900 tracking-tight tabular-nums truncate block">
              {item.value}
            </span>
          </div>

          {/* Bottom Row: Trend & Subtext */}
          <div className="flex items-center gap-1.5 text-[11px] sm:text-xs">
            {item.isPositive ? (
              <span className="font-bold text-emerald-600 inline-flex items-center gap-0.5 shrink-0">
                <TrendingUp className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>{item.change}</span>
              </span>
            ) : (
              <span className="font-bold text-rose-600 inline-flex items-center gap-0.5 shrink-0">
                <TrendingDown className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>{item.change}</span>
              </span>
            )}
            <span className="text-slate-400 font-medium truncate">
              {item.comparisonText}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
