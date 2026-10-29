"use client"

import {
  Star,
  MessageSquare,
  ThumbsUp,
  MessageCircle,
  ArrowUp,
} from "lucide-react"
import type { ReviewKpiItem } from "@/features/admin-reviews/stayea-admin-reviews-mock-data"
import { MOCK_REVIEWS_KPIS } from "@/features/admin-reviews/stayea-admin-reviews-mock-data"

interface ReviewsKpiCardsProps {
  stats?: readonly ReviewKpiItem[]
}

function getKpiIcon(icon: ReviewKpiItem["icon"]) {
  const iconClass = "w-5 h-5 sm:w-6 sm:h-6 stroke-[2]"
  switch (icon) {
    case "star":
      return <Star className={`${iconClass} fill-amber-400 text-amber-500`} />
    case "total":
      return <MessageSquare className={iconClass} />
    case "positive":
      return <ThumbsUp className={iconClass} />
    case "new":
      return <MessageCircle className={iconClass} />
    default:
      return <Star className={iconClass} />
  }
}

function getThemeStyles(theme: ReviewKpiItem["colorTheme"]) {
  switch (theme) {
    case "yellow":
      return {
        iconBg: "bg-[#fffbeb] text-amber-500",
      }
    case "blue":
      return {
        iconBg: "bg-[#eff6ff] text-[#0284c7]",
      }
    case "green":
      return {
        iconBg: "bg-[#e8f7ee] text-[#007a48]",
      }
    case "purple":
      return {
        iconBg: "bg-[#f5f3ff] text-[#7c3aed]",
      }
    default:
      return {
        iconBg: "bg-[#fffbeb] text-amber-500",
      }
  }
}

export function ReviewsKpiCards({ stats = MOCK_REVIEWS_KPIS }: ReviewsKpiCardsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
      {stats.map((item) => {
        const theme = getThemeStyles(item.colorTheme)
        return (
          <div
            key={item.id}
            className="group relative bg-white border border-slate-200/80 rounded-2xl p-3.5 sm:p-4 shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between gap-2.5 text-left"
          >
            {/* Top Row: Title on Left, Icon Badge on Top-Right */}
            <div className="flex items-start justify-between gap-2">
              <span className="text-xs sm:text-[13px] font-semibold text-slate-600 leading-snug line-clamp-2">
                {item.title}
              </span>
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${theme.iconBg}`}
              >
                {getKpiIcon(item.icon)}
              </div>
            </div>

            {/* Middle: Big Value */}
            <div className="my-0.5">
              <span className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900 tracking-tight tabular-nums truncate block">
                {item.value}
              </span>
            </div>

            {/* Bottom: Trend */}
            <div className="flex items-center gap-1.5 text-[11px] sm:text-xs">
              <span className="inline-flex items-center gap-0.5 font-semibold text-[#007a48] shrink-0">
                <ArrowUp className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>{item.trendPercent}</span>
              </span>
              <span className="text-slate-400 font-medium truncate">
                {item.trendLabel}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
