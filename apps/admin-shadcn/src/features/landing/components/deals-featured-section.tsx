"use client"

import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { DEALS_FEATURED_CARDS } from "@/features/landing/data/stayea-mock-data"
import type { DealsFeaturedCard } from "@/features/landing/data/stayea-mock-data"

interface DealsFeaturedSectionProps {
  readonly onCardSelect?: (card: DealsFeaturedCard) => void
  readonly onViewAll?: () => void
}

export function DealsFeaturedSection({
  onCardSelect,
  onViewAll,
}: DealsFeaturedSectionProps) {
  return (
    <section className="w-full mb-10">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
          Ưu đãi nổi bật
        </h2>
        <button
          type="button"
          onClick={onViewAll}
          className="text-xs sm:text-sm font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1 group transition-colors"
        >
          <span>Xem tất cả</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* 4 Cards Grid */}
      {DEALS_FEATURED_CARDS.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-8 text-center space-y-2">
          <p className="text-sm font-semibold text-slate-700">Chưa có ưu đãi nổi bật nào được đăng tải</p>
          <p className="text-xs text-slate-400">Các chương trình khuyến mãi và ưu đãi độc quyền sẽ sớm được cập nhật tại đây.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {DEALS_FEATURED_CARDS.map((card) => (
            <div
              key={card.id}
              onClick={() => onCardSelect?.(card)}
              className="group cursor-pointer bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-2xs hover:shadow-lg hover:border-slate-300 transition-all duration-300 flex flex-col"
            >
              {/* Thumbnail with overlay badges */}
              <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-100">
                <Image
                  src={card.imageUrl}
                  alt={card.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent pointer-events-none" />

                {/* Category pill badge (top-left) */}
                <div className="absolute top-3 left-3 z-10">
                  <span className="inline-block px-2.5 py-1 rounded-md text-[11px] font-bold text-white bg-[#0A2239]/90 backdrop-blur-xs shadow-xs">
                    {card.category}
                  </span>
                </div>

                {/* Discount pill badge (top-right) */}
                <div className="absolute top-3 right-3 z-10">
                  <span
                    className={`inline-block px-2.5 py-1 rounded-md text-[11px] font-bold text-white shadow-xs ${card.discountColor}`}
                  >
                    {card.discount}
                  </span>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-4 sm:p-4.5 flex flex-col flex-1">
                <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug group-hover:text-teal-700 transition-colors">
                  {card.title}
                </h3>

                {card.highlight && (
                  <div className="font-bold text-slate-900 text-sm sm:text-base leading-snug group-hover:text-teal-700 transition-colors">
                    {card.highlight}
                  </div>
                )}

                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  {card.subtitle}
                </p>

                {/* CTA link at bottom */}
                <div className="mt-auto pt-4 flex items-center justify-center border-t border-slate-100">
                  <div className="text-xs font-bold text-slate-800 group-hover:text-teal-700 flex items-center gap-1.5 transition-colors">
                    <span>Xem ưu đãi</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
