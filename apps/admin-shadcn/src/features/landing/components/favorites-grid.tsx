"use client"

import Image from "next/image"
import {
  Heart,
  Star,
  Calendar,
  MapPin,
  Users,
  Bed,
  Ticket,
  ArrowRight,
  Sparkles,
} from "lucide-react"
import type { FavoriteItem } from "@/features/landing/data/stayea-mock-data"

interface FavoritesGridProps {
  readonly items: readonly FavoriteItem[]
  readonly onRemoveFavorite: (item: FavoriteItem) => void
  readonly onViewDetails: (item: FavoriteItem) => void
  readonly onResetFilter?: () => void
}

function renderExtraIcon(iconType: "users" | "bed" | "ticket") {
  switch (iconType) {
    case "users":
      return <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
    case "bed":
      return <Bed className="w-3.5 h-3.5 text-slate-400 shrink-0" />
    case "ticket":
      return <Ticket className="w-3.5 h-3.5 text-slate-400 shrink-0" />
    default:
      return <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
  }
}

function renderBadgeStyle(variant: "purple" | "emerald" | "sky" | "amber") {
  switch (variant) {
    case "emerald":
      return "bg-emerald-100/90 text-emerald-800"
    case "purple":
      return "bg-purple-100/90 text-purple-800"
    case "sky":
      return "bg-sky-100/90 text-sky-800"
    case "amber":
      return "bg-amber-100/90 text-amber-800"
    default:
      return "bg-slate-100 text-slate-800"
  }
}

function formatPrice(amount: number): string {
  return new Intl.NumberFormat("vi-VN").format(amount) + "đ"
}

export function FavoritesGrid({
  items,
  onRemoveFavorite,
  onViewDetails,
  onResetFilter,
}: FavoritesGridProps) {
  if (items.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/90 p-8 sm:p-12 text-center space-y-3 shadow-2xs">
        <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center text-rose-400 mx-auto">
          <Heart className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-900">
          Chưa có mục nào trong danh mục này
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
          Bạn chưa lưu dịch vụ hoặc trải nghiệm nào trong phân loại đã chọn. Hãy khám phá và nhấn icon trái tim để lưu lại nhé.
        </p>
        {onResetFilter && (
          <button
            type="button"
            onClick={onResetFilter}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0A2239] text-white text-xs sm:text-sm font-semibold shadow-2xs hover:bg-[#12365A] transition-all"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Xem tất cả yêu thích</span>
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {items.map((item) => (
        <div
          key={item.id}
          className="group bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between"
        >
          <div>
            {/* 1. Cover Image with Category Badge & Heart Toggle */}
            <div className="relative w-full h-44 sm:h-48 overflow-hidden bg-slate-100">
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                unoptimized
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />

              {/* Category Pill Badge (Top Left) */}
              <div className="absolute top-3 left-3 z-10">
                <span
                  className={`inline-flex items-center text-[11px] font-semibold px-2.5 py-0.5 rounded-full shadow-xs backdrop-blur-xs ${renderBadgeStyle(
                    item.categoryVariant
                  )}`}
                >
                  {item.categoryLabel}
                </span>
              </div>

              {/* Red Heart Button (Top Right) */}
              <button
                type="button"
                onClick={() => onRemoveFavorite(item)}
                className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white shadow-sm hover:scale-110 active:scale-95 flex items-center justify-center transition-all"
                title="Bỏ khỏi yêu thích"
                aria-label="Bỏ khỏi yêu thích"
              >
                <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
              </button>
            </div>

            {/* 2. Card Content Body */}
            <div className="p-4 space-y-2.5">
              {/* Title */}
              <h3 className="text-sm sm:text-[14px] font-bold text-slate-900 group-hover:text-[#0A2239] transition-colors line-clamp-1">
                {item.title}
              </h3>

              {/* Star Rating & Reviews */}
              <div className="flex items-center gap-1.5 text-xs text-slate-600">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500 shrink-0" />
                <span className="font-bold text-slate-900">{item.rating}</span>
                <span className="text-slate-500">({item.reviewsCount})</span>
              </div>

              {/* Metadata Rows */}
              <div className="space-y-1.5 pt-0.5 text-xs text-slate-600">
                {/* Date / Duration */}
                <div className="flex items-center gap-2 truncate">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{item.dateOrDuration}</span>
                </div>

                {/* Location */}
                <div className="flex items-center gap-2 truncate">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{item.location}</span>
                </div>

                {/* Extra Detail (Guests / Room / Seat) */}
                <div className="flex items-center gap-2 truncate">
                  {renderExtraIcon(item.extraDetailIcon)}
                  <span className="truncate">{item.extraDetail}</span>
                </div>
              </div>

              {/* Price Row */}
              <div className="pt-2">
                <div className="flex items-baseline gap-1">
                  <span className="text-base sm:text-lg font-bold text-[#0A2239] tracking-tight">
                    {formatPrice(item.price)}
                  </span>
                  <span className="text-xs text-slate-500 font-normal">
                    {item.priceUnit}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Bottom Action Buttons: Xem chi tiết + Bỏ khỏi yêu thích */}
          <div className="p-4 pt-0">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onViewDetails(item)}
                className="w-full inline-flex items-center justify-center gap-1 py-2 px-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-all active:scale-95 group/btn"
              >
                <span>Xem chi tiết</span>
                <ArrowRight className="w-3 h-3 transform group-hover/btn:translate-x-0.5 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => onRemoveFavorite(item)}
                className="w-full inline-flex items-center justify-center py-2 px-2.5 rounded-xl border border-slate-200 bg-white hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 text-slate-600 text-xs font-medium shadow-2xs transition-all active:scale-95"
              >
                Bỏ khỏi yêu thích
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
