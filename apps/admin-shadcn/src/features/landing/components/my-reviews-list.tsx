"use client"

import Image from "next/image"
import {
  Star,
  Calendar,
  MapPin,
  ArrowRight,
  PenLine,
  Sparkles,
} from "lucide-react"
import type { UserReviewItem } from "@/features/landing/data/stayea-mock-data"

interface MyReviewsListProps {
  readonly items: readonly UserReviewItem[]
  readonly onEditReview: (item: UserReviewItem) => void
  readonly onViewDetails: (item: UserReviewItem) => void
  readonly onResetFilter?: () => void
}

function renderCategoryTagStyle(variant: "sky" | "purple" | "amber" | "emerald") {
  switch (variant) {
    case "sky":
      return "bg-sky-50 text-sky-700"
    case "purple":
      return "bg-purple-50 text-purple-700"
    case "amber":
      return "bg-amber-50 text-amber-700"
    case "emerald":
      return "bg-emerald-50 text-emerald-700"
    default:
      return "bg-slate-100 text-slate-700"
  }
}

function renderStarRating(rating: number) {
  const fullStars = Math.floor(rating)
  const stars = []

  for (let i = 1; i <= 5; i++) {
    stars.push(
      <Star
        key={i}
        className={`w-3.5 h-3.5 ${
          i <= fullStars
            ? "fill-amber-400 text-amber-500"
            : "fill-amber-100 text-amber-300"
        }`}
      />
    )
  }

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-0.5">{stars}</div>
      <span className="text-xs font-bold text-slate-900 ml-1">{rating.toFixed(1)}</span>
    </div>
  )
}

export function MyReviewsList({
  items,
  onEditReview,
  onViewDetails,
  onResetFilter,
}: MyReviewsListProps) {
  if (items.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/90 p-8 sm:p-12 text-center space-y-3 shadow-2xs">
        <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-500 mx-auto">
          <Star className="w-6 h-6 fill-amber-400 text-amber-500" />
        </div>
        <h3 className="text-base font-bold text-slate-900">
          Chưa có đánh giá nào trong danh mục này
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
          Bạn chưa viết đánh giá cho dịch vụ thuộc phân loại đã chọn. Hãy trải nghiệm và chia sẻ cảm nhận chân thực nhé!
        </p>
        {onResetFilter && (
          <button
            type="button"
            onClick={onResetFilter}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0A2239] text-white text-xs sm:text-sm font-semibold shadow-2xs hover:bg-[#12365A] transition-all"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Xem tất cả đánh giá</span>
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {items.map((review) => (
        <div
          key={review.id}
          className="group bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all duration-300 p-4 sm:p-5 flex flex-col md:flex-row items-start gap-4 sm:gap-5 justify-between"
        >
          {/* Left Thumbnail + Center Details */}
          <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-4.5 flex-1 w-full min-w-0">
            {/* Image Thumbnail */}
            <div className="w-full sm:w-48 lg:w-52 h-36 sm:h-32 shrink-0 rounded-xl overflow-hidden relative bg-slate-100">
              <Image
                src={review.imageUrl}
                alt={review.title}
                fill
                unoptimized
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Content Details */}
            <div className="space-y-1.5 min-w-0 flex-1">
              {/* Badge "Đã đánh giá" */}
              <div className="inline-block">
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full inline-block">
                  Đã đánh giá
                </span>
              </div>

              {/* Title */}
              <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-[#0A2239] transition-colors truncate">
                {review.title}
              </h3>

              {/* Date & Location */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{review.date}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{review.location}</span>
                </div>
              </div>

              {/* Star Rating */}
              <div className="pt-0.5">{renderStarRating(review.rating)}</div>

              {/* Review Comment */}
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-1 line-clamp-3">
                {review.comment}
              </p>
            </div>
          </div>

          {/* Right Column: Category Tag + Action Buttons */}
          <div className="w-full md:w-auto shrink-0 flex flex-col md:items-end justify-between self-stretch gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
            {/* Top Right Tag */}
            <div className="hidden md:block">
              <span
                className={`text-xs font-semibold px-2.5 py-0.5 rounded-md ${renderCategoryTagStyle(
                  review.categoryTagVariant
                )}`}
              >
                {review.categoryTagLabel}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-row md:flex-col items-center gap-2 w-full md:w-44">
              <button
                type="button"
                onClick={() => onViewDetails(review)}
                className="w-full inline-flex items-center justify-center gap-1 py-2 px-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-all active:scale-95 group/btn"
              >
                <span>Xem chi tiết</span>
                <ArrowRight className="w-3 h-3 transform group-hover/btn:translate-x-0.5 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => onEditReview(review)}
                className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-all active:scale-95"
              >
                <PenLine className="w-3.5 h-3.5 text-slate-500" />
                <span>Chỉnh sửa đánh giá</span>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
