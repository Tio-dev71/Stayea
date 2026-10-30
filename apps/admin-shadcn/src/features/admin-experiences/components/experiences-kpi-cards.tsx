"use client"

import { useMemo } from "react"
import {
  Compass,
  Users,
  AlertCircle,
  Star,
  TrendingUp,
  TrendingDown,
} from "lucide-react"
import type { ExperienceItem, ExperienceKpiMetric } from "@/features/admin-experiences/stayea-admin-experiences-mock-data"

interface ExperiencesKpiCardsProps {
  readonly experiences?: readonly ExperienceItem[]
}

export function ExperiencesKpiCards({ experiences = [] }: ExperiencesKpiCardsProps) {
  const dynamicKpis: ExperienceKpiMetric[] = useMemo(() => {
    const total = experiences.length
    const active = experiences.filter((e) => e.status === "active").length
    const paused = experiences.filter((e) => e.status !== "active").length
    const avgRating =
      total > 0
        ? (experiences.reduce((sum, e) => sum + (e.rating || 5), 0) / total).toFixed(1)
        : "0.0"

    return [
      {
        id: "total",
        title: "Tổng trải nghiệm / Tour",
        value: total.toString(),
        trend: total > 0 ? "100%" : "0%",
        trendLabel: total > 0 ? "dữ liệu thực tế" : "chưa có tour",
        trendType: "up",
        icon: "compass",
        color: "emerald",
      },
      {
        id: "active",
        title: "Đang hoạt động",
        value: active.toString(),
        trend: total > 0 ? `${Math.round((active / total) * 100)}%` : "0%",
        trendLabel: active > 0 ? "sẵn sàng đặt" : "chưa có tour hoạt động",
        trendType: "up",
        icon: "users",
        color: "amber",
      },
      {
        id: "paused",
        title: "Tạm ngưng",
        value: paused.toString(),
        trend: total > 0 ? `${Math.round((paused / total) * 100)}%` : "0%",
        trendLabel: paused > 0 ? "đang bảo trì" : "không có tour tạm dừng",
        trendType: "down",
        icon: "alert",
        color: "rose",
      },
      {
        id: "rating",
        title: "Đánh giá trung bình",
        value: `${avgRating}/5`,
        trend: total > 0 ? "100%" : "0%",
        trendLabel: total > 0 ? "chất lượng dịch vụ" : "chưa có đánh giá",
        trendType: "up",
        icon: "star",
        color: "amber",
      },
    ]
  }, [experiences])

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
      {dynamicKpis.map((metric) => {
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
