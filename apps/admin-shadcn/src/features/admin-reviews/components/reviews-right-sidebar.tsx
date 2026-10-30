"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import {
  ArrowRight,
  ChevronRight,
  FileText,
  MessageSquareReply,
  ShieldCheck,
  Settings,
  Medal,
  Compass,
  Landmark,
  Utensils,
  Waves,
  Palette,
  Sparkles,
  HelpCircle,
} from "lucide-react"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts"
import type {
  RatingDistributionSlice,
  CategoryReviewCountItem,
  LocationReviewCountItem,
  ReviewQuickActionItem,
} from "@/features/admin-reviews/stayea-admin-reviews-mock-data"
import {
  MOCK_RATING_DISTRIBUTION,
  MOCK_CATEGORY_REVIEWS,
  MOCK_LOCATION_REVIEWS,
  MOCK_REVIEW_QUICK_ACTIONS,
} from "@/features/admin-reviews/stayea-admin-reviews-mock-data"

interface ReviewsRightSidebarProps {
  distribution?: RatingDistributionSlice[]
  categories?: CategoryReviewCountItem[]
  locations?: LocationReviewCountItem[]
  quickActions?: ReviewQuickActionItem[]
  totalReviews?: number
  onViewDistributionDetails?: () => void
  onViewCategoryDetails?: () => void
  onViewLocationDetails?: () => void
  onQuickAction?: (actionId: string) => void
  onPromoClick?: () => void
}

function getCategoryIcon(icon: CategoryReviewCountItem["icon"]) {
  const iconClass = "w-3.5 h-3.5 text-slate-500"
  switch (icon) {
    case "island":
      return <Compass className={iconClass} />
    case "monument":
      return <Landmark className={iconClass} />
    case "food":
      return <Utensils className={iconClass} />
    case "sport":
      return <Waves className={iconClass} />
    case "culture":
      return <Palette className={iconClass} />
    case "wellness":
      return <Sparkles className={iconClass} />
    case "other":
      return <HelpCircle className={iconClass} />
    default:
      return <Compass className={iconClass} />
  }
}

function getQuickActionIcon(icon: ReviewQuickActionItem["icon"]) {
  const iconClass = "w-4 h-4 stroke-[2]"
  switch (icon) {
    case "new-reviews":
      return <FileText className={iconClass} />
    case "reply-pending":
      return <MessageSquareReply className={iconClass} />
    case "manage-reviews":
      return <ShieldCheck className={iconClass} />
    case "review-policy":
      return <Settings className={iconClass} />
    default:
      return <FileText className={iconClass} />
  }
}

export function ReviewsRightSidebar({
  distribution = MOCK_RATING_DISTRIBUTION,
  categories = MOCK_CATEGORY_REVIEWS,
  locations = MOCK_LOCATION_REVIEWS,
  quickActions = MOCK_REVIEW_QUICK_ACTIONS,
  totalReviews,
  onViewDistributionDetails,
  onViewCategoryDetails,
  onViewLocationDetails,
  onQuickAction,
  onPromoClick,
}: ReviewsRightSidebarProps) {
  const [mounted, setMounted] = useState(false)

  const total = totalReviews !== undefined ? totalReviews : distribution.reduce((acc, d) => acc + (d.count || 0), 0)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="space-y-5">
      {/* 1. Promo Card Banner */}
      <div
        className="relative overflow-hidden rounded-2xl aspect-[16/6] sm:aspect-[16/5] border border-slate-200/80 shadow-xs group cursor-pointer"
        onClick={onPromoClick}
      >
        <Image
          src="/about/beach-opt-0.jpg"
          alt="Khách hàng nói gì?"
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-sky-950/75 via-sky-900/45 to-transparent flex items-center justify-between p-4 sm:p-5 text-white">
          <div className="max-w-[75%]">
            <h3 className="text-sm sm:text-base font-bold leading-snug drop-shadow-xs">
              Khách hàng nói gì?
            </h3>
            <p className="text-[11px] text-sky-100 font-medium leading-tight mt-0.5 drop-shadow-xs">
              Những trải nghiệm thật, cảm xúc thật
            </p>
          </div>
          <button
            type="button"
            aria-label="Xem ngay"
            className="w-8 h-8 rounded-full bg-white text-slate-800 shadow-md flex items-center justify-center shrink-0 group-hover:translate-x-1 transition-transform"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Phân bố đánh giá (Donut Chart) */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-3.5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
            Phân bố đánh giá
          </h2>
          <button
            type="button"
            onClick={onViewDistributionDetails}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#007a48] hover:text-emerald-800 hover:underline transition-colors cursor-pointer"
          >
            <span>Xem chi tiết</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Donut Chart with Legend */}
        <div className="flex items-center justify-between gap-3 py-1">
          {/* Donut Canvas */}
          <div className="relative w-32 h-32 sm:w-36 sm:h-36 shrink-0 flex items-center justify-center">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length > 0 && payload[0]?.payload) {
                        const item = payload[0].payload as RatingDistributionSlice
                        return (
                          <div className="bg-slate-900 text-white rounded-xl px-3 py-1.5 text-xs shadow-lg border border-slate-800">
                            <span className="font-semibold">{item.label}: </span>
                            <span className="text-emerald-400 font-bold">
                              {item.percentage}% ({item.count})
                            </span>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Pie
                    data={distribution}
                    dataKey="percentage"
                    nameKey="label"
                    cx="50%"
                    cy="50%"
                    innerRadius={42}
                    outerRadius={58}
                    paddingAngle={2}
                    stroke="#ffffff"
                    strokeWidth={2}
                  >
                    {distribution.map((entry) => (
                      <Cell key={entry.stars} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-slate-50/50 rounded-xl text-xs text-slate-400 animate-pulse">
                Đang tải...
              </div>
            )}

            {/* Center Text Badge */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-base sm:text-lg font-black text-slate-900 leading-none">
                {total}
              </span>
              <span className="text-[10px] text-slate-400 font-medium mt-0.5">
                Đánh giá
              </span>
            </div>
          </div>

          {/* Legend Items List on Right */}
          <div className="flex-1 w-full space-y-1.5 text-xs pl-1">
            {distribution.map((item) => (
              <div
                key={item.stars}
                className="flex items-center justify-between gap-1.5 text-[11px]"
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-slate-700 font-medium truncate">
                    {item.label}
                  </span>
                </div>
                <span className="text-slate-900 font-bold shrink-0">
                  {item.percentage}%{" "}
                  <span className="text-slate-400 font-normal">
                    ({item.count})
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Đánh giá theo loại hình */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-3.5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
            Đánh giá theo loại hình
          </h2>
          <button
            type="button"
            onClick={onViewCategoryDetails}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#007a48] hover:text-emerald-800 hover:underline transition-colors cursor-pointer"
          >
            <span>Xem chi tiết</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="flex items-center justify-between gap-2 text-xs py-0.5"
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-6 h-6 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
                  {getCategoryIcon(cat.icon)}
                </div>
                <span className="font-medium text-slate-700 truncate text-[11px] sm:text-xs">
                  {cat.name}
                </span>
              </div>
              <span className="font-bold text-slate-900 shrink-0 text-xs">
                {cat.percentage}%{" "}
                <span className="text-slate-400 font-normal">
                  ({cat.count})
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Địa điểm được đánh giá nhiều */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-3.5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
            Địa điểm được đánh giá nhiều
          </h2>
          <button
            type="button"
            onClick={onViewLocationDetails}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#007a48] hover:text-emerald-800 hover:underline transition-colors cursor-pointer"
          >
            <span>Xem chi tiết</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2.5">
          {locations.map((loc) => (
            <div
              key={loc.id}
              className="flex items-center justify-between gap-2.5 text-xs sm:text-sm"
            >
              <div className="flex items-center gap-2 min-w-0">
                {loc.rank === 1 ? (
                  <div className="w-5 h-5 flex items-center justify-center text-amber-500 shrink-0">
                    <Medal className="w-4 h-4 fill-amber-400 text-amber-600" />
                  </div>
                ) : (
                  <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 font-bold text-[11px] flex items-center justify-center shrink-0">
                    {loc.rank}
                  </span>
                )}

                <div className="relative w-6 h-6 sm:w-7 sm:h-7 rounded-full overflow-hidden shrink-0 border border-slate-200">
                  <Image
                    src={loc.imageUrl}
                    alt={loc.city}
                    fill
                    className="object-cover"
                  />
                </div>

                <span className="font-medium text-slate-800 truncate text-xs">
                  {loc.city}
                </span>
              </div>

              <span className="font-bold text-slate-900 shrink-0 text-xs">
                {loc.reviewCountFormatted}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Thao tác nhanh */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-3">
        <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
          Thao tác nhanh
        </h2>

        <div className="space-y-1.5">
          {quickActions.map((action) => (
            <button
              key={action.id}
              type="button"
              onClick={() => onQuickAction?.(action.id)}
              className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-slate-700 hover:text-slate-900 transition-colors group text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#e8f7ee] text-[#007a48] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  {getQuickActionIcon(action.icon)}
                </div>
                <span className="text-xs sm:text-sm font-medium">
                  {action.title}
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-0.5 transition-all" />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
