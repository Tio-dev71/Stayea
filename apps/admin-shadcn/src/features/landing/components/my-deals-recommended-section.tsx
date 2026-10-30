"use client"

import Image from "next/image"
import { Gift, Heart } from "lucide-react"
import * as React from "react"
import { RECOMMENDED_DEALS_LIST } from "@/features/landing/data/stayea-mock-data"
import type { RecommendedDealItem } from "@/features/landing/data/stayea-mock-data"

interface MyDealsRecommendedSectionProps {
  readonly onSaveDeal?: (id: string, title: string) => void
  readonly onViewDeal?: (deal: RecommendedDealItem) => void
}

export function MyDealsRecommendedSection({
  onSaveDeal,
  onViewDeal,
}: MyDealsRecommendedSectionProps) {
  const [savedIds, setSavedIds] = React.useState<Record<string, boolean>>({})

  if (RECOMMENDED_DEALS_LIST.length === 0) {
    return null
  }

  function handleToggleSave(item: RecommendedDealItem) {
    setSavedIds((prev) => {
      const nextState = !prev[item.id]
      if (nextState) {
        onSaveDeal?.(item.id, item.title)
      }
      return { ...prev, [item.id]: nextState }
    })
  }

  return (
    <div className="space-y-4 pt-4">
      {/* Section Header */}
      <div className="flex items-center gap-2 text-[#0A2239]">
        <Gift className="w-5 h-5 text-[#1E40AF]" />
        <h3 className="text-base font-bold text-[#0A2239]">Gợi ý ưu đãi khác</h3>
      </div>

      {/* 4 Recommended Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {RECOMMENDED_DEALS_LIST.map((item: RecommendedDealItem) => {
          const isSaved = !!savedIds[item.id]
          return (
            <div
              key={item.id}
              className="bg-white border border-slate-200/80 rounded-2xl p-3 flex items-center gap-3 shadow-2xs hover:border-slate-300 transition-all"
            >
              {/* Thumbnail */}
              <div className="relative w-18 h-18 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 bg-slate-100">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  unoptimized
                  className="object-cover object-center"
                />
              </div>

              {/* Information */}
              <div className="flex-1 min-w-0 space-y-1">
                <h4
                  className="text-xs font-bold text-[#0A2239] line-clamp-1"
                  title={item.title}
                >
                  {item.title}
                </h4>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-rose-600">
                    {item.discountTag}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-1">
                  {item.subtitle}
                </p>

                {/* Action button */}
                <div className="pt-1">
                  {item.actionType === "save" ? (
                    <button
                      type="button"
                      onClick={() => handleToggleSave(item)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all cursor-pointer ${
                        isSaved
                          ? "bg-rose-50 text-rose-600 border-rose-200"
                          : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <Heart
                        className={`w-3 h-3 ${
                          isSaved ? "fill-rose-500 text-rose-500" : "text-slate-400"
                        }`}
                      />
                      <span>{isSaved ? "Đã lưu" : "Lưu ưu đãi"}</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onViewDeal?.(item)}
                      className="inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-medium border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
                    >
                      Xem chi tiết
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
