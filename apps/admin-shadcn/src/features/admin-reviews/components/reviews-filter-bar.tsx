"use client"

import {
  Search,
  ChevronDown,
  SlidersHorizontal,
} from "lucide-react"

interface ReviewsFilterBarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  selectedCategory: string
  onCategoryChange: (category: string) => void
  selectedLocation: string
  onLocationChange: (location: string) => void
  selectedRating: string
  onRatingChange: (rating: string) => void
  selectedTimeRange: string
  onTimeRangeChange: (time: string) => void
  onOpenAdvancedFilter?: () => void
}

const CATEGORY_OPTIONS = [
  "Tất cả loại hình",
  "Tour biển đảo",
  "Tham quan",
  "Ẩm thực",
  "Thể thao biển",
  "Văn hóa",
  "Wellness",
  "Khác",
]

const LOCATION_OPTIONS = [
  "Tất cả địa điểm",
  "Phú Quốc",
  "Hà Nội",
  "Đà Nẵng",
  "Nha Trang",
  "Đà Lạt",
]

const RATING_FILTER_OPTIONS = [
  "Tất cả đánh giá",
  "5 sao",
  "4 sao",
  "3 sao",
  "2 sao",
  "1 sao",
]

const TIME_RANGE_OPTIONS = [
  "Thời gian: 30 ngày",
  "Thời gian: 7 ngày",
  "Thời gian: 90 ngày",
  "Năm nay",
  "Tất cả",
]

export function ReviewsFilterBar({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedLocation,
  onLocationChange,
  selectedRating,
  onRatingChange,
  selectedTimeRange,
  onTimeRangeChange,
  onOpenAdvancedFilter,
}: ReviewsFilterBarProps) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-2.5 sm:p-3 shadow-xs flex flex-wrap items-center justify-between gap-2.5">
      {/* Left: Search Input & Selectors */}
      <div className="flex flex-wrap items-center gap-2 flex-1 min-w-0">
        {/* Search input */}
        <div className="relative flex-1 min-w-[170px] sm:min-w-[210px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm kiếm đánh giá, tên tour, khách hàng..."
            className="w-full bg-slate-50/70 hover:bg-slate-50 focus:bg-white text-xs sm:text-[13px] text-slate-800 placeholder:text-slate-400 rounded-xl pl-9 pr-3 py-2 border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all shadow-2xs"
          />
        </div>

        {/* Dropdown 1: Tất cả loại hình */}
        <div className="relative">
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="appearance-none bg-white hover:bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 pr-7 text-xs sm:text-[13px] font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer shadow-2xs transition-colors"
          >
            {CATEGORY_OPTIONS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Dropdown 2: Tất cả địa điểm */}
        <div className="relative">
          <select
            value={selectedLocation}
            onChange={(e) => onLocationChange(e.target.value)}
            className="appearance-none bg-white hover:bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 pr-7 text-xs sm:text-[13px] font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer shadow-2xs transition-colors"
          >
            {LOCATION_OPTIONS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Dropdown 3: Tất cả đánh giá */}
        <div className="relative">
          <select
            value={selectedRating}
            onChange={(e) => onRatingChange(e.target.value)}
            className="appearance-none bg-white hover:bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 pr-7 text-xs sm:text-[13px] font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer shadow-2xs transition-colors"
          >
            {RATING_FILTER_OPTIONS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Dropdown 4: Thời gian: 30 ngày */}
        <div className="relative">
          <select
            value={selectedTimeRange}
            onChange={(e) => onTimeRangeChange(e.target.value)}
            className="appearance-none bg-white hover:bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 pr-7 text-xs sm:text-[13px] font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer shadow-2xs transition-colors"
          >
            {TIME_RANGE_OPTIONS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Right: Lọc nâng cao */}
      <button
        type="button"
        onClick={onOpenAdvancedFilter}
        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#e8f7ee] hover:bg-[#d8f0e2] active:bg-[#c6e9d4] text-[#007a48] text-xs sm:text-[13px] font-semibold transition-colors cursor-pointer shadow-2xs shrink-0"
      >
        <SlidersHorizontal className="w-3.5 h-3.5 stroke-[2.2]" />
        <span>Bộ lọc nâng cao</span>
      </button>
    </div>
  )
}
