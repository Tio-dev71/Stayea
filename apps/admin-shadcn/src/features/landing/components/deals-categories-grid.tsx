"use client"

import {
  Plane,
  Ship,
  Car,
  Bus,
  Hotel,
  Palmtree,
  ChevronRight,
  ArrowRight,
} from "lucide-react"
import { DEALS_CATEGORY_ITEMS } from "@/features/landing/data/stayea-mock-data"
import type { DealsCategoryItem } from "@/features/landing/data/stayea-mock-data"

interface DealsCategoriesGridProps {
  readonly onCategorySelect?: (item: DealsCategoryItem) => void
  readonly onViewAll?: () => void
}

function renderCategoryIcon(icon: string) {
  switch (icon) {
    case "plane":
      return <Plane className="w-5 h-5 shrink-0" />
    case "ship":
      return <Ship className="w-5 h-5 shrink-0" />
    case "car":
      return <Car className="w-5 h-5 shrink-0" />
    case "bus":
      return <Bus className="w-5 h-5 shrink-0" />
    case "hotel":
      return <Hotel className="w-5 h-5 shrink-0" />
    case "palmtree":
      return <Palmtree className="w-5 h-5 shrink-0" />
    default:
      return <Plane className="w-5 h-5 shrink-0" />
  }
}

export function DealsCategoriesGrid({
  onCategorySelect,
  onViewAll,
}: DealsCategoriesGridProps) {
  return (
    <section className="w-full mb-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
          Ưu đãi theo danh mục
        </h3>
        <button
          type="button"
          onClick={onViewAll}
          className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 hover:underline transition-all"
        >
          <span>Xem tất cả</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 6 Category Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {DEALS_CATEGORY_ITEMS.map((item) => (
          <div
            key={item.id}
            onClick={() => onCategorySelect?.(item)}
            className={`rounded-2xl border p-4 flex flex-col justify-between gap-3 cursor-pointer shadow-2xs hover:shadow-sm hover:scale-[1.02] transition-all ${item.bgClass} ${item.borderClass}`}
          >
            <div className={`p-2 rounded-xl bg-white/70 w-fit ${item.textClass}`}>
              {renderCategoryIcon(item.icon)}
            </div>

            <div>
              <div className="text-xs sm:text-sm font-bold text-slate-900 mb-0.5">
                {item.label}
              </div>
              <div className={`flex items-center gap-0.5 text-[11px] font-semibold ${item.textClass}`}>
                <span>{item.discountText}</span>
                <ChevronRight className="w-3 h-3 shrink-0" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
