"use client"

import { SlidersHorizontal } from "lucide-react"
import type {
  FavoriteItemCategory,
  FavoriteCategoryTab,
} from "@/features/landing/data/stayea-mock-data"

interface FavoritesHeaderAndTabsProps {
  readonly activeCategory: FavoriteItemCategory
  readonly tabs: readonly FavoriteCategoryTab[]
  readonly onSelectCategory: (category: FavoriteItemCategory) => void
  readonly onOpenManageModal: () => void
}

export function FavoritesHeaderAndTabs({
  activeCategory,
  tabs,
  onSelectCategory,
  onOpenManageModal,
}: FavoritesHeaderAndTabsProps) {
  return (
    <section className="space-y-4">
      {/* 1. Header Bar: Title with red heart + Subtitle & Manage button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-1">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xl sm:text-2xl leading-none select-none text-rose-500" role="img" aria-label="heart">
              ❤️
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Yêu thích
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
            Các dịch vụ, điểm đến và trải nghiệm bạn đã lưu. Dễ dàng xem lại và lên kế hoạch cho chuyến đi tiếp theo.
          </p>
        </div>

        {/* Right CTA Button: Quản lý yêu thích */}
        <div className="shrink-0">
          <button
            type="button"
            onClick={onOpenManageModal}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold shadow-2xs transition-all active:scale-95"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
            <span>Quản lý yêu thích</span>
          </button>
        </div>
      </div>

      {/* 2. 4 Filter Category Tabs */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-1 no-scrollbar">
        {tabs.map((tab) => {
          const isActive = activeCategory === tab.id

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectCategory(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                isActive
                  ? "bg-[#0A2239] text-white shadow-2xs font-semibold"
                  : "bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 hover:border-slate-300"
              }`}
            >
              <span>{tab.label}</span>
              <span className="ml-1 opacity-85">({tab.count})</span>
            </button>
          )
        })}
      </div>
    </section>
  )
}
