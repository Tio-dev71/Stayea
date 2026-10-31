"use client"

import {
  ArrowUpDown,
  ChevronDown,
} from "lucide-react"

export type StarTabType = "all" | "5" | "4" | "3" | "2" | "1"

export interface StarCounts {
  all: number
  star5: number
  star4: number
  star3: number
  star2: number
  star1: number
}

interface ReviewsStarTabsProps {
  activeTab: StarTabType
  onSelectTab: (tab: StarTabType) => void
  selectedSort: string
  onSortChange: (sort: string) => void
  counts?: StarCounts
}

const STAR_TABS: { id: StarTabType; label: string; countKey: keyof StarCounts }[] = [
  { id: "all", label: "Tất cả", countKey: "all" },
  { id: "5", label: "5 sao", countKey: "star5" },
  { id: "4", label: "4 sao", countKey: "star4" },
  { id: "3", label: "3 sao", countKey: "star3" },
  { id: "2", label: "2 sao", countKey: "star2" },
  { id: "1", label: "1 sao", countKey: "star1" },
]

export function ReviewsStarTabs({
  activeTab,
  onSelectTab,
  selectedSort,
  onSortChange,
  counts = {
    all: 0,
    star5: 0,
    star4: 0,
    star3: 0,
    star2: 0,
    star1: 0,
  },
}: ReviewsStarTabsProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-1">
      {/* Star Tabs List */}
      <div
        role="tablist"
        aria-label="Lọc đánh giá theo số sao"
        className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none"
      >
        {STAR_TABS.map((tab) => {
          const isActive = activeTab === tab.id
          const count = counts[tab.countKey]

          return (
            <button
              key={tab.id}
              id={`review-tab-${tab.id}`}
              role="tab"
              type="button"
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              onClick={() => onSelectTab(tab.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                isActive
                  ? "bg-[#007a48] text-white shadow-xs"
                  : "bg-white border border-slate-200/90 text-slate-600 hover:border-slate-300 hover:text-slate-900"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-xs ${
                  isActive ? "text-emerald-100" : "text-slate-400"
                }`}
              >
                ({count.toLocaleString("vi-VN")})
              </span>
            </button>
          )
        })}
      </div>

      {/* Sort Dropdown */}
      <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
        <div className="relative inline-flex items-center">
          <label htmlFor="reviews-sort-select" className="sr-only">
            Sắp xếp danh sách đánh giá
          </label>
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" aria-hidden="true" />
          <select
            id="reviews-sort-select"
            aria-label="Sắp xếp danh sách đánh giá"
            value={selectedSort}
            onChange={(e) => onSortChange(e.target.value)}
            className="pl-8 pr-8 py-1.5 bg-white border border-slate-200/90 rounded-full text-xs sm:text-sm font-medium text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 appearance-none cursor-pointer"
          >
            <option value="newest">Sắp xếp: Mới nhất</option>
            <option value="highest">Xếp hạng: Cao nhất</option>
            <option value="lowest">Xếp hạng: Thấp nhất</option>
            <option value="oldest">Sắp xếp: Cũ nhất</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 pointer-events-none" aria-hidden="true" />
        </div>
      </div>
    </div>
  )
}
