"use client"

import * as React from "react"
import Image from "next/image"
import { Star, MapPin, Heart, ArrowRight } from "lucide-react"
import type { NewBookingRecommendationItem } from "@/features/landing/data/stayea-mock-data"

interface NewBookingRecommendationsProps {
  readonly items: readonly NewBookingRecommendationItem[]
  readonly onSelectRecommendation: (item: NewBookingRecommendationItem) => void
  readonly onViewAll?: () => void
}

export function NewBookingRecommendations({
  items,
  onSelectRecommendation,
  onViewAll,
}: NewBookingRecommendationsProps) {
  const [favoriteIds, setFavoriteIds] = React.useState<Record<string, boolean>>({})

  if (!items || items.length === 0) {
    return null
  }

  function toggleFavorite(id: string, e: React.MouseEvent) {
    e.stopPropagation()
    setFavoriteIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  return (
    <section className="space-y-4 pt-6">
      {/* 1. Section Header: Title + Subtitle + "Xem tất cả →" Link */}
      <div className="flex flex-row items-center justify-between gap-3">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            Gợi ý dành cho bạn
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Những dịch vụ được nhiều du khách yêu thích tại Phú Quốc.
          </p>
        </div>

        <div>
          <button
            type="button"
            onClick={onViewAll}
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-[#0A2239] hover:underline shrink-0"
          >
            <span>Xem tất cả</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. 4-Card Horizontal Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((item) => {
          const isFav = favoriteIds[item.id]

          return (
            <div
              key={item.id}
              className="group bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Image Banner + Heart Toggle */}
                <div className="relative w-full h-36 sm:h-40 overflow-hidden bg-slate-100">
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    unoptimized
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Top-right Heart button */}
                  <button
                    type="button"
                    onClick={(e) => toggleFavorite(item.id, e)}
                    className="absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-black/25 hover:bg-black/40 backdrop-blur-xs flex items-center justify-center text-white transition-colors"
                    aria-label="Yêu thích"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        isFav ? "fill-rose-500 text-rose-500" : "text-white"
                      }`}
                    />
                  </button>
                </div>

                {/* Card Information */}
                <div className="p-3.5 space-y-2">
                  <h4 className="text-xs sm:text-[13px] font-bold text-slate-900 line-clamp-1 group-hover:text-[#0A2239] transition-colors">
                    {item.title}
                  </h4>

                  {/* Rating */}
                  <div className="flex items-center gap-1 text-[11px] text-slate-500">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500 shrink-0" />
                    <span className="font-semibold text-slate-700">
                      {item.rating}
                    </span>
                    <span>({item.reviewsCount} đánh giá)</span>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-1 text-[11px] text-slate-500 truncate">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{item.location}</span>
                  </div>

                  {/* Price */}
                  <div className="pt-1 flex items-baseline gap-1">
                    <span className="text-sm font-bold text-[#0A2239]">
                      {item.priceDisplay}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      / {item.priceUnit}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom "Xem chi tiết →" Button */}
              <div className="p-3.5 pt-0">
                <button
                  type="button"
                  onClick={() => onSelectRecommendation(item)}
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-all active:scale-95 group/btn"
                >
                  <span>Xem chi tiết</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover/btn:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
