"use client"

import * as React from "react"
import { LayoutGrid, List, ChevronDown, SlidersHorizontal, X } from "lucide-react"
import { StayHero } from "./stay-hero"
import { StayCategoryTabs } from "./stay-category-tabs"
import { StayFilterSidebar } from "./stay-filter-sidebar"
import type { StayFilterState } from "./stay-filter-sidebar"
import { StayCard } from "./stay-card"
import { StayPromoBanner } from "./stay-promo-banner"
import { STAY_ACCOMMODATION_LISTINGS } from "@/features/landing/data/stayea-mock-data"
import type { StayAccommodationItem } from "@/features/landing/data/stayea-mock-data"

const INITIAL_FILTERS: StayFilterState = {
  priceMin: 0,
  priceMax: 20_000_000,
  types: [],
  locations: [],
  amenities: [],
  suitability: [],
  sortBy: "popular",
}

export function StayListingPage() {
  const [activeCategoryTab, setActiveCategoryTab] = React.useState<string>("all")
  const [filters, setFilters] = React.useState<StayFilterState>(INITIAL_FILTERS)
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid")
  const [pageSize, setPageSize] = React.useState<number>(12)
  const [pageSizeOpen, setPageSizeOpen] = React.useState(false)
  const [mobileFilterOpen, setMobileFilterOpen] = React.useState(false)

  // Handle Tab Switch
  const handleSelectTab = (tabId: string) => {
    setActiveCategoryTab(tabId)
  }

  // Handle Filter Reset
  const handleResetFilters = () => {
    setFilters(INITIAL_FILTERS)
    setActiveCategoryTab("all")
  }

  // Filtered & Sorted items
  const filteredItems = React.useMemo(() => {
    return STAY_ACCOMMODATION_LISTINGS.filter((item: StayAccommodationItem) => {
      // 1. Tab category filter
      if (activeCategoryTab === "villas" && item.categoryId !== "villas") return false
      if (activeCategoryTab === "apartments" && item.categoryId !== "apartments") return false
      if (activeCategoryTab === "homestays" && item.categoryId !== "homestays") return false
      if (activeCategoryTab === "hotels" && item.categoryId !== "hotels") return false
      if (activeCategoryTab === "long-stay" && item.categoryId !== "long-stay") return false
      if (activeCategoryTab === "verified" && item.badge?.variant !== "verified") return false
      if (activeCategoryTab === "select" && item.badge?.variant !== "select") return false

      // 2. Price filter
      if (item.pricePerNight > filters.priceMax) return false

      // 3. Types filter
      if (filters.types.length > 0 && !filters.types.includes(item.categoryId)) {
        return false
      }

      return true
    }).toSorted((a, b) => {
      switch (filters.sortBy) {
        case "price-asc":
          return a.pricePerNight - b.pricePerNight
        case "price-desc":
          return b.pricePerNight - a.pricePerNight
        case "rating":
          return b.rating - a.rating
        default:
          return 0
      }
    })
  }, [activeCategoryTab, filters])

  return (
    <div className="w-full bg-[#fbfcfd] min-h-screen">
      {/* 1. Hero Banner with integrated Search Widget */}
      <StayHero />

      {/* 2. Horizontal Category Tabs */}
      <StayCategoryTabs
        activeTab={activeCategoryTab}
        onSelectTab={handleSelectTab}
      />

      {/* 3. Main 2-Column Listing Layout */}
      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="flex flex-col lg:flex-row gap-8 xl:gap-10 items-start">
          {/* Mobile Filter Toggle Button */}
          <div className="lg:hidden w-full flex items-center justify-between pb-3 border-b border-slate-200">
            <button
              type="button"
              onClick={() => setMobileFilterOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-800 shadow-xs"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#0c3b40]" />
              <span>Bộ lọc</span>
            </button>
            <span className="text-xs text-slate-500 font-medium">
              324 lưu trú tại Phú Quốc
            </span>
          </div>

          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block">
            <StayFilterSidebar
              filters={filters}
              onFiltersChange={setFilters}
              onResetFilters={handleResetFilters}
            />
          </div>

          {/* Mobile Drawer Filter Sidebar */}
          {mobileFilterOpen && (
            <div className="fixed inset-0 z-50 flex lg:hidden">
              <div
                className="fixed inset-0 bg-black/50 backdrop-blur-xs"
                onClick={() => setMobileFilterOpen(false)}
              />
              <div className="relative ml-auto w-full max-w-xs h-full bg-white p-5 overflow-y-auto shadow-2xl z-10 space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="font-bold text-base text-slate-900">Bộ lọc</span>
                  <button
                    type="button"
                    onClick={() => setMobileFilterOpen(false)}
                    className="p-1 rounded-md text-slate-400 hover:text-slate-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <StayFilterSidebar
                  filters={filters}
                  onFiltersChange={setFilters}
                  onResetFilters={handleResetFilters}
                />
              </div>
            </div>
          )}

          {/* Right Column: Listing Results + Header + Promo Banner */}
          <div className="flex-1 min-w-0 w-full space-y-6">
            {/* Results Header Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
              <h2 className="font-bold text-slate-900 text-lg sm:text-[19px] tracking-tight">
                Có 324 lưu trú tại Phú Quốc
              </h2>

              <div className="flex items-center gap-3 text-xs text-slate-500 font-medium select-none">
                <span className="hidden sm:inline">
                  Hiển thị 1 - {Math.min(pageSize, filteredItems.length)} của 324 kết quả
                </span>

                {/* View Mode Toggle: Grid / List */}
                <div className="flex items-center p-0.5 rounded-lg border border-slate-200 bg-white">
                  <button
                    type="button"
                    onClick={() => setViewMode("grid")}
                    className={`p-1.5 rounded-md transition-colors ${
                      viewMode === "grid"
                        ? "bg-[#0c3b40] text-white shadow-xs"
                        : "text-slate-500 hover:text-slate-900"
                    }`}
                    aria-label="Grid view"
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("list")}
                    className={`p-1.5 rounded-md transition-colors ${
                      viewMode === "list"
                        ? "bg-[#0c3b40] text-white shadow-xs"
                        : "text-slate-500 hover:text-slate-900"
                    }`}
                    aria-label="List view"
                  >
                    <List className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Page Size Select */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setPageSizeOpen(!pageSizeOpen)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:border-slate-300 transition-colors"
                  >
                    <span>{pageSize} mỗi trang</span>
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </button>

                  {pageSizeOpen && (
                    <div className="absolute top-full right-0 mt-1.5 w-32 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-20 animate-in fade-in zoom-in-95">
                      {[12, 24, 36].map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => {
                            setPageSize(size)
                            setPageSizeOpen(false)
                          }}
                          className={`w-full text-left px-3 py-1.5 text-xs transition-colors ${
                            pageSize === size
                              ? "bg-teal-50 text-[#0c3b40] font-bold"
                              : "text-slate-700 hover:bg-slate-50"
                          }`}
                        >
                          {size} mỗi trang
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Accommodation Cards (4 columns x 3 rows on large desktop) */}
            {filteredItems.length === 0 ? (
              <div className="py-16 text-center bg-white rounded-2xl border border-slate-100 p-8">
                <p className="text-slate-600 font-semibold text-sm">
                  Không tìm thấy chỗ lưu trú phù hợp với bộ lọc đã chọn.
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="mt-3 text-xs font-semibold text-[#0c3b40] hover:underline"
                >
                  Xóa tất cả bộ lọc và thử lại
                </button>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                {filteredItems.slice(0, pageSize).map((item) => (
                  <StayCard key={item.id} item={item} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredItems.slice(0, pageSize).map((item) => (
                  <StayCard key={item.id} item={item} isListView />
                ))}
              </div>
            )}

            {/* Bottom Promo Banner (STAYEA VERIFIED) */}
            <StayPromoBanner />
          </div>
        </div>
      </main>
    </div>
  )
}
