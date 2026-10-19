"use client"

import { Search, X } from "lucide-react"
import { PHU_QUOC_CATEGORIES } from "@/features/landing/data/stayea-mock-data"

interface PhuQuocCategoryTabsProps {
  readonly activeCategory: string
  readonly onSelectCategory: (categoryId: string) => void
  readonly searchQuery: string
  readonly onSearchChange: (query: string) => void
}

export function PhuQuocCategoryTabs({
  activeCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
}: PhuQuocCategoryTabsProps) {
  return (
    <div className="w-full pt-6 pb-2 border-b border-slate-100">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Category Pills Row */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar pb-1">
          {PHU_QUOC_CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id
            const displayLabel = cat.id === "all" ? "Tất cả" : cat.label
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.id)}
                className={`h-9 px-3.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all select-none shrink-0 ${
                  isActive
                    ? "bg-[#0c3b40] text-white shadow-sm"
                    : "bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/80 hover:border-slate-300"
                }`}
              >
                {displayLabel}
              </button>
            )
          })}
        </div>

        {/* Search Input Box */}
        <div className="relative w-full lg:w-72 shrink-0">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm bài viết..."
            className="w-full h-9 pl-3.5 pr-9 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm placeholder:text-slate-400 focus:outline-none focus:border-[#0c3b40] focus:ring-1 focus:ring-[#0c3b40] transition-colors shadow-2xs"
          />
          {searchQuery ? (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 rounded-full"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          )}
        </div>
      </div>
    </div>
  )
}
