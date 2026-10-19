"use client"

import {
  Compass,
  Users,
  AlertCircle,
  Star,
  TrendingUp,
  TrendingDown,
} from "lucide-react"
import { EXPERIENCES_KPIS } from "@/features/admin-experiences/stayea-admin-experiences-mock-data"

export function ExperiencesKpiCards() {
  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-3.5">
      {EXPERIENCES_KPIS.map((metric) => {
        return (
          <div
            key={metric.id}
            className="bg-white rounded-2xl border border-slate-100 shadow-xs p-3.5 sm:p-4 flex items-center gap-3 hover:shadow-sm transition-shadow min-w-0"
          >
            {/* Left circular icon badge */}
            <div
              className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center shrink-0 ${
                metric.color === "emerald"
                  ? "bg-emerald-50 text-[#1b7a4e]"
                  : metric.color === "amber"
                  ? "bg-amber-50 text-amber-600"
                  : metric.color === "rose"
                  ? "bg-rose-50 text-rose-600"
                  : "bg-amber-50 text-amber-500"
              }`}
            >
              {metric.icon === "compass" && <Compass className="w-5 h-5 stroke-[2.25]" />}
              {metric.icon === "users" && <Users className="w-5 h-5 stroke-[2.25]" />}
              {metric.icon === "alert" && <AlertCircle className="w-5 h-5 stroke-[2.25]" />}
              {metric.icon === "star" && <Star className="w-5 h-5 fill-amber-400 stroke-amber-500" />}
            </div>

            {/* Right text metrics */}
            <div className="min-w-0 flex-1">
              <span className="text-[11px] sm:text-xs font-medium text-slate-500 block truncate">
                {metric.title}
              </span>
              <div className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-0.5 leading-none">
                {metric.value}
              </div>
              <div className="flex items-center gap-1 mt-1.5 text-[10px] sm:text-[11px]">
                <span
                  className={`inline-flex items-center font-bold gap-0.5 shrink-0 ${
                    metric.trendType === "up" ? "text-emerald-600" : "text-rose-600"
                  }`}
                >
                  {metric.trendType === "up" ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  <span>{metric.trend}</span>
                </span>
                <span className="text-slate-400 font-medium truncate">
                  {metric.trendLabel}
                </span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
