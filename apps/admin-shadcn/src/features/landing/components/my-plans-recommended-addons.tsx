"use client"

import * as React from "react"
import Image from "next/image"
import { Heart, MapPin, Star, ArrowRight, ChevronRight } from "lucide-react"
import type { PlanRecommendedAddonItem } from "@/features/landing/data/stayea-mock-data"

interface MyPlansRecommendedAddonsProps {
  readonly items: readonly PlanRecommendedAddonItem[]
  readonly onAddAddonToPlan: (item: PlanRecommendedAddonItem) => void
  readonly onNextSlide?: () => void
}

export function MyPlansRecommendedAddons({
  items,
  onAddAddonToPlan,
  onNextSlide,
}: MyPlansRecommendedAddonsProps) {
  const [favoriteMap, setFavoriteMap] = React.useState<Record<string, boolean>>({})

  function toggleFavorite(id: string, e: React.MouseEvent) {
    e.stopPropagation()
    setFavoriteMap((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  return (
    <section className="space-y-4 pt-3 relative">
      {/* 1. Header: Heart Icon + Title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Heart className="w-4 h-4 text-[#0A2239]" />
          <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            Gợi ý bổ sung cho chuyến đi của bạn
          </h3>
        </div>
      </div>

      {/* 2. 4 Cards Row with Carousel Right Arrow */}
      <div className="relative">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map((addon) => {
            const isFav = favoriteMap[addon.id]

            return (
              <div
                key={addon.id}
                className="group bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Image banner with favorite heart toggle */}
                  <div className="relative w-full h-36 sm:h-40 overflow-hidden bg-slate-100">
                    <Image
                      src={addon.imageUrl}
                      alt={addon.title}
                      fill
                      unoptimized
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Top-right Heart button */}
                    <button
                      type="button"
                      onClick={(e) => toggleFavorite(addon.id, e)}
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

                  {/* Body details */}
                  <div className="p-3.5 space-y-1.5">
                    <h4 className="text-xs sm:text-[13px] font-bold text-slate-900 line-clamp-1 group-hover:text-[#0A2239] transition-colors">
                      {addon.title}
                    </h4>

                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 truncate">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{addon.location}</span>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-slate-500">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500 shrink-0" />
                      <span className="font-semibold text-slate-700">
                        {addon.rating}
                      </span>
                      <span>({addon.reviewsCount})</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Button */}
                <div className="p-3.5 pt-0">
                  <button
                    type="button"
                    onClick={() => onAddAddonToPlan(addon)}
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-all active:scale-95 group/btn"
                  >
                    <span>Thêm vào kế hoạch</span>
                    <ArrowRight className="w-3.5 h-3.5 transform group-hover/btn:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Carousel Next Arrow on the right edge */}
        <button
          type="button"
          onClick={onNextSlide}
          className="hidden xl:flex absolute -right-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white shadow-md border border-slate-200 items-center justify-center text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-all active:scale-90"
          aria-label="Xem tiếp"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  )
}
