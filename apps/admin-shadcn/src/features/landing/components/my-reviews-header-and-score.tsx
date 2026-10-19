"use client"

import { Star } from "lucide-react"

interface MyReviewsHeaderAndScoreProps {
  readonly averageRating: number
  readonly totalReviews: number
  readonly thankYouMessage: string
}

export function MyReviewsHeaderAndScore({
  averageRating,
  totalReviews,
  thankYouMessage,
}: MyReviewsHeaderAndScoreProps) {
  return (
    <section className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-1">
      {/* 1. Left Title & Description */}
      <div className="space-y-1">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Đánh giá của tôi
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-xl leading-relaxed">
          Quản lý những đánh giá bạn đã chia sẻ về hành trình, lưu trú và trải nghiệm cùng STAYEA.
        </p>
      </div>

      {/* 2. Right Score Summary Widget */}
      <div className="shrink-0">
        <div className="bg-white rounded-2xl border border-slate-200/90 px-4 py-2.5 shadow-2xs flex items-center gap-3.5">
          {/* Big Gold Star Icon */}
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500 shrink-0">
            <Star className="w-6 h-6 fill-amber-400 text-amber-500" />
          </div>

          {/* Rating Number & Subtext */}
          <div className="space-y-0.5">
            <div className="flex items-baseline gap-1">
              <span className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-none">
                {averageRating.toFixed(1)}
              </span>
              <span className="text-xs text-slate-400 font-semibold">/ 5</span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              Từ {totalReviews} đánh giá
            </p>
          </div>

          {/* Vertical Divider */}
          <div className="h-8 w-px bg-slate-200 shrink-0 hidden sm:block" />

          {/* Thank You Note */}
          <p className="text-[11px] sm:text-xs text-slate-600 font-normal leading-snug max-w-[170px] hidden sm:block">
            {thankYouMessage}
          </p>
        </div>
      </div>
    </section>
  )
}
