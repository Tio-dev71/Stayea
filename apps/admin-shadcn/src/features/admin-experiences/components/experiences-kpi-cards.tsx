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
    <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
      {EXPERIENCES_KPIS.map((metric) => {
        return (
          <div
            key={metric.id}
            className="group relative bg-white rounded-2xl border border-slate-200/80 p-3.5 sm:p-4 shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between gap-2.5 text-left"
          >
            {/* Top Row: Title on Left, Icon Badge on Top-Right */}
            <div className="flex items-start justify-between gap-2">
              <span className="text-xs sm:text-[13px] font-semibold text-slate-600 leading-snug line-clamp-2">
                {metric.title}
              </span>
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  metric.color === "emerald"
                    ? "bg-emerald-50 text-[#1b7a4e]"
                    : metric.color === "amber"
                    ? "bg-amber-50 text-amber-600"
                    : metric.color === "rose"
                    ? "bg-rose-50 text-rose-600"
                    : "bg-amber-50 text-amber-500"
                }`}
              >
                {metric.icon === "compass" && <Compass className="w-4 h-4 stroke-[2.25]" />}
                {metric.icon === "users" && <Users className="w-4 h-4 stroke-[2.25]" />}
                {metric.icon === "alert" && <AlertCircle className="w-4 h-4 stroke-[2.25]" />}
                {metric.icon === "star" && <Star className="w-4 h-4 fill-amber-400 stroke-amber-500" />}
              </div>
            </div>

            {/* Middle: Big Value */}
            <div className="my-0.5">
              <span className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900 tracking-tight tabular-nums truncate block">
                {metric.value}
              </span>
            </div>

            {/* Bottom: Trend Indicator */}
            <div className="flex items-center gap-1.5 text-[11px] sm:text-xs">
              <span
                className={`inline-flex items-center font-bold gap-0.5 shrink-0 ${
                  metric.trendType === "up" ? "text-emerald-600" : "text-rose-600"
                }`}
              >
                {metric.trendType === "up" ? (
                  <TrendingUp className="w-3.5 h-3.5 stroke-[2.5]" />
                ) : (
                  <TrendingDown className="w-3.5 h-3.5 stroke-[2.5]" />
                )}
                <span>{metric.trend}</span>
              </span>
              <span className="text-slate-400 font-medium truncate">
                {metric.trendLabel}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
