"use client"

import * as React from "react"
import {
  LayoutGrid,
  List,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { PackageHero } from "./package-hero"
import { PackageFilterToolbar } from "./package-filter-toolbar"
import { PackageCard } from "./package-card"
import { PackageCustomBanner } from "./package-custom-banner"
import {
  PACKAGE_LISTINGS,
  PACKAGE_FILTER_DURATIONS,
  PACKAGE_FILTER_PRICES,
  PACKAGE_FILTER_TYPES,
  PACKAGE_FILTER_SUITABILITIES,
  PACKAGE_SORT_OPTIONS,
} from "@/features/landing/data/stayea-mock-data"
import type { PackageListingItem } from "@/features/landing/data/stayea-mock-data"

export function PackageListingPage() {
  const [selectedAudience, setSelectedAudience] = React.useState<string>("all")
  const [searchQuery, setSearchQuery] = React.useState<string>("")
  const [selectedDuration, setSelectedDuration] = React.useState<string>(PACKAGE_FILTER_DURATIONS[0] ?? "Tất cả thời gian")
  const [selectedPrice, setSelectedPrice] = React.useState<string>(PACKAGE_FILTER_PRICES[0] ?? "Tất cả mức giá")
  const [selectedType, setSelectedType] = React.useState<string>(PACKAGE_FILTER_TYPES[0] ?? "Tất cả loại trải nghiệm")
  const [selectedSuitability, setSelectedSuitability] = React.useState<string>(PACKAGE_FILTER_SUITABILITIES[0] ?? "Tất cả phù hợp")
  const [selectedSort, setSelectedSort] = React.useState<string>(PACKAGE_SORT_OPTIONS[0] ?? "Phổ biến nhất")
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid")
  const [isExpanded, setIsExpanded] = React.useState<boolean>(false)
  const [wishlistIds, setWishlistIds] = React.useState<Set<string>>(new Set())

  function handleToggleWishlist(id: string) {
    setWishlistIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  function handleResetFilters() {
    setSelectedAudience("all")
    setSearchQuery("")
    setSelectedDuration(PACKAGE_FILTER_DURATIONS[0] ?? "Tất cả thời gian")
    setSelectedPrice(PACKAGE_FILTER_PRICES[0] ?? "Tất cả mức giá")
    setSelectedType(PACKAGE_FILTER_TYPES[0] ?? "Tất cả loại trải nghiệm")
    setSelectedSuitability(PACKAGE_FILTER_SUITABILITIES[0] ?? "Tất cả phù hợp")
    setSelectedSort(PACKAGE_SORT_OPTIONS[0] ?? "Phổ biến nhất")
  }

  // Filter and sort items
  const filteredItems = React.useMemo(() => {
    let list: PackageListingItem[] = [...PACKAGE_LISTINGS]

    // 1. Audience category filter
    if (selectedAudience !== "all") {
      list = list.filter((item) => item.audienceId === selectedAudience || item.audienceId === "all")
    }

    // 2. Search query filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      list = list.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.highlight.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query)
      )
    }

    // 3. Duration filter
    if (selectedDuration !== (PACKAGE_FILTER_DURATIONS[0] ?? "Tất cả thời gian")) {
      list = list.filter((item) => item.duration.toLowerCase().includes(selectedDuration.toLowerCase().replace("tất cả ", "")))
    }

    // 4. Price filter
    if (selectedPrice === "Dưới 700.000đ") {
      list = list.filter((item) => item.price < 700_000)
    } else if (selectedPrice === "700.000đ - 1.200.000đ") {
      list = list.filter((item) => item.price >= 700_000 && item.price <= 1_200_000)
    } else if (selectedPrice === "Trên 1.200.000đ") {
      list = list.filter((item) => item.price > 1_200_000)
    }

    // 5. Type filter
    if (selectedType !== (PACKAGE_FILTER_TYPES[0] ?? "Tất cả loại trải nghiệm")) {
      list = list.filter((item) => item.category.toLowerCase().includes(selectedType.toLowerCase()))
    }

    // 6. Suitability filter
    if (selectedSuitability === "Cặp đôi") {
      list = list.filter((item) => item.audienceId === "couple" || item.audienceId === "all")
    } else if (selectedSuitability === "Gia đình") {
      list = list.filter((item) => item.audienceId === "family" || item.audienceId === "all")
    } else if (selectedSuitability === "Nhóm bạn") {
      list = list.filter((item) => item.audienceId === "friends" || item.audienceId === "all")
    }

    // 7. Sort
    if (selectedSort === "Giá: Thấp đến cao") {
      list = list.toSorted((a, b) => a.price - b.price)
    } else if (selectedSort === "Giá: Cao đến thấp") {
      list = list.toSorted((a, b) => b.price - a.price)
    } else if (selectedSort === "Đánh giá cao nhất") {
      list = list.toSorted((a, b) => b.rating - a.rating)
    }

    return list
  }, [
    selectedAudience,
    searchQuery,
    selectedDuration,
    selectedPrice,
    selectedType,
    selectedSuitability,
    selectedSort,
  ])

  // Initial display limit is 12 cards, expanding to all when "Xem thêm gói hành trình" is clicked
  const displayedItems = isExpanded ? filteredItems : filteredItems.slice(0, 12)

  return (
    <div className="w-full bg-[#f8fafc]/50 min-h-screen">
      {/* 1. Edge-to-edge Hero Banner */}
      <PackageHero />

      {/* Main Content Area */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* 2. Filter Toolbar (Audience Pills, Search, Dropdowns) */}
        <PackageFilterToolbar
          selectedAudience={selectedAudience}
          onSelectAudience={setSelectedAudience}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedDuration={selectedDuration}
          onSelectDuration={setSelectedDuration}
          selectedPrice={selectedPrice}
          onSelectPrice={setSelectedPrice}
          selectedType={selectedType}
          onSelectType={setSelectedType}
          selectedSuitability={selectedSuitability}
          onSelectSuitability={setSelectedSuitability}
          selectedSort={selectedSort}
          onSelectSort={setSelectedSort}
          onResetFilters={handleResetFilters}
        />

        {/* 3. Section Title + Counter + View Mode Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-6 pb-4">
          <div>
            <div className="text-[11px] uppercase tracking-wider font-bold text-slate-400">
              DANH SÁCH GÓI HÀNH TRÌNH
            </div>
            <h2 className="font-sans text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
              Tất cả các gói hành trình tại Phú Quốc
            </h2>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="text-xs text-slate-500 font-medium">
              Hiển thị {displayedItems.length > 0 ? `1-${displayedItems.length}` : "0"} trong {filteredItems.length} gói
            </span>

            {/* View Mode Buttons (Lưới / Danh sách) */}
            <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200/90 shadow-2xs">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                aria-label="Chế độ xem lưới"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === "grid"
                    ? "bg-[#0c3b40] text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Lưới</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode("list")}
                aria-label="Chế độ xem danh sách"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === "list"
                    ? "bg-[#0c3b40] text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>Danh sách</span>
              </button>
            </div>
          </div>
        </div>

        {/* 4. Packages Grid / List */}
        {displayedItems.length > 0 ? (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5"
                : "flex flex-col gap-3.5"
            }
          >
            {displayedItems.map((item) => (
              <PackageCard
                key={item.id}
                item={item}
                viewMode={viewMode}
                isWishlisted={wishlistIds.has(item.id)}
                onToggleWishlist={handleToggleWishlist}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
            <p className="text-slate-500 text-sm">
              Không tìm thấy gói hành trình nào phù hợp với bộ lọc hiện tại.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="mt-3 px-4 py-2 rounded-xl bg-[#0c3b40] text-white text-xs font-medium hover:bg-[#072528] transition-colors"
            >
              Đặt lại bộ lọc
            </button>
          </div>
        )}

        {/* 5. Load More / Collapse Button */}
        {filteredItems.length > 12 && (
          <div className="flex justify-center pt-8 pb-4">
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold text-slate-700 shadow-2xs transition-all hover:border-slate-300 active:scale-95"
            >
              <span>{isExpanded ? "Thu gọn danh sách" : "Xem thêm gói hành trình"}</span>
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 text-slate-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-500" />
              )}
            </button>
          </div>
        )}

        {/* 6. Custom Itinerary CTA Banner */}
        <PackageCustomBanner />
      </div>
    </div>
  )
}
