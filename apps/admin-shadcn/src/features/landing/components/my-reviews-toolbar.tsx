"use client"

import * as React from "react"
import { ArrowUpDown, ChevronDown, Check } from "lucide-react"
import type {
  ReviewCategory,
  ReviewCategoryTab,
} from "@/features/landing/data/stayea-mock-data"

export type ReviewSortOption = "newest" | "oldest" | "highest" | "lowest"

interface MyReviewsToolbarProps {
  readonly activeCategory: ReviewCategory
  readonly tabs: readonly ReviewCategoryTab[]
  readonly onSelectCategory: (category: ReviewCategory) => void
  readonly sortBy: ReviewSortOption
  readonly onSelectSort: (sort: ReviewSortOption) => void
}

const SORT_OPTIONS: readonly { id: ReviewSortOption; label: string }[] = [
  { id: "newest", label: "Mới nhất" },
  { id: "oldest", label: "Cũ nhất" },
  { id: "highest", label: "Đánh giá cao nhất" },
  { id: "lowest", label: "Đánh giá thấp nhất" },
]

export function MyReviewsToolbar({
  activeCategory,
  tabs,
  onSelectCategory,
  sortBy,
  onSelectSort,
}: MyReviewsToolbarProps) {
  const [isSortOpen, setIsSortOpen] = React.useState<boolean>(false)
  const sortRef = React.useRef<HTMLDivElement | null>(null)

  const activeSortLabel =
    SORT_OPTIONS.find((opt) => opt.id === sortBy)?.label || "Mới nhất"

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <section className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-1">
      {/* 1. Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
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

      {/* 2. Sort Dropdown */}
      <div className="relative shrink-0" ref={sortRef}>
        <button
          type="button"
          onClick={() => setIsSortOpen((prev) => !prev)}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-medium shadow-2xs transition-all active:scale-95"
        >
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
          <span>{activeSortLabel}</span>
          <ChevronDown
            className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
              isSortOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isSortOpen && (
          <div className="absolute right-0 top-full mt-1.5 w-48 bg-white rounded-xl border border-slate-200 shadow-lg py-1.5 z-30 animate-in fade-in zoom-in-95 duration-150">
            {SORT_OPTIONS.map((opt) => {
              const isSelected = opt.id === sortBy

              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    onSelectSort(opt.id)
                    setIsSortOpen(false)
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2 text-xs font-medium text-left transition-colors ${
                    isSelected
                      ? "bg-slate-50 text-[#0A2239] font-bold"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <span>{opt.label}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#0A2239]" />}
                </button>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
