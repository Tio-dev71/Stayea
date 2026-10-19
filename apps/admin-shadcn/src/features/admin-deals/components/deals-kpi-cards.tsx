import { Tag, Percent, Clock, CheckCircle2, TrendingUp } from "lucide-react"
import type { DealKpiStat } from "@/features/admin-deals/stayea-admin-deals-mock-data"

interface DealsKpiCardsProps {
  stats: readonly DealKpiStat[]
}

export function DealsKpiCards({ stats }: DealsKpiCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5">
      {stats.map((stat) => (
        <div
          key={stat.id}
          className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs hover:shadow-xs transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#1b7a4e] flex items-center justify-center">
              {stat.icon === "tag" && <Tag className="w-5 h-5 stroke-[2.2]" />}
              {stat.icon === "percent" && <Percent className="w-5 h-5 stroke-[2.2]" />}
              {stat.icon === "clock" && <Clock className="w-5 h-5 stroke-[2.2]" />}
              {stat.icon === "check-circle" && <CheckCircle2 className="w-5 h-5 stroke-[2.2]" />}
            </div>

            <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              <TrendingUp className="w-3 h-3 stroke-[2.5]" />
              <span>{stat.change}</span>
            </div>
          </div>

          <div className="mt-3">
            <span className="text-xs text-slate-500 font-medium block">{stat.title}</span>
            <div className="text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
              {stat.value}
            </div>
            <span className="text-[11px] text-slate-400 mt-0.5 block">{stat.subtext}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
