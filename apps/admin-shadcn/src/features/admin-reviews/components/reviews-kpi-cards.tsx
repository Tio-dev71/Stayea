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
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
      {stats.map((item) => {
        const theme = getThemeStyles(item.colorTheme)
        return (
          <div
            key={item.id}
            className="bg-white border border-slate-200/80 rounded-2xl p-3.5 sm:p-4 shadow-xs flex items-center gap-3 sm:gap-3.5 hover:shadow-md transition-shadow"
          >
            {/* Left: Icon inside soft background rounded container */}
            <div
              className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shrink-0 ${theme.iconBg}`}
            >
              {getKpiIcon(item.icon)}
            </div>

            {/* Right: Title, Value, Trend */}
            <div className="flex-1 min-w-0">
              <span className="text-[11px] sm:text-xs font-medium text-slate-500 block truncate">
                {item.title}
              </span>
              <div className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-none mt-1">
                {item.value}
              </div>
              <div className="mt-1 flex items-center gap-1 text-[11px] sm:text-xs">
                <span className="inline-flex items-center gap-0.5 font-semibold text-[#007a48] shrink-0">
                  <ArrowUp className="w-3 h-3 stroke-[2.5]" />
                  <span>{item.trendPercent}</span>
                </span>
                <span className="text-slate-400 font-normal truncate">
                  {item.trendLabel}
                </span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
