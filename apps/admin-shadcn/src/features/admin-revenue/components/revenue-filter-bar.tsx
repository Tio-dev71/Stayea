"use client"

import { useState } from "react"
import {
  Calendar,
  ChevronDown,
  ChevronsUpDown,
  SlidersHorizontal,
} from "lucide-react"

interface RevenueFilterBarProps {
  dateRange?: string
  selectedCategory?: string
  selectedLocation?: string
  selectedPartner?: string
  onDateRangeChange?: (range: string) => void
  onCategoryChange?: (category: string) => void
  onLocationChange?: (location: string) => void
  onPartnerChange?: (partner: string) => void
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

const PARTNER_OPTIONS = [
  "Tất cả đối tác",
  "Vinpearl Safari & Wonders",
  "Sun World Hòn Thơm",
  "John's Island Tours",
  "Phú Quốc Speedboat Co.",
  "Đà Nẵng River Cruise",
]

export function RevenueFilterBar({
  dateRange = "01/06/2024 - 31/08/2024",
  selectedCategory = "Tất cả loại hình",
  selectedLocation = "Tất cả địa điểm",
  selectedPartner = "Tất cả đối tác",
  onDateRangeChange,
  onCategoryChange,
  onLocationChange,
  onPartnerChange,
  onOpenAdvancedFilter,
}: RevenueFilterBarProps) {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-3 sm:p-3.5 shadow-xs flex flex-wrap items-center justify-between gap-3">
      {/* Left: Date Range & Dropdown Selectors */}
      <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 flex-1">
        {/* Date Range Picker Button */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsDatePickerOpen((prev) => !prev)}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs sm:text-sm font-medium text-slate-700 shadow-2xs transition-colors"
          >
            <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="font-semibold text-slate-800">{dateRange}</span>
            <ChevronsUpDown className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1" />
          </button>

          {/* Quick Date Range Dropdown */}
          {isDatePickerOpen && (
            <div className="absolute left-0 top-full mt-1.5 w-60 bg-white border border-slate-200 rounded-xl shadow-lg p-2 z-30 text-xs">
              <div className="p-1.5 font-semibold text-slate-500 text-[11px] uppercase tracking-wider">
                Chọn khoảng thời gian
              </div>
              {[
                "01/06/2024 - 31/08/2024",
                "Tháng này (01/10 - 31/10/2026)",
                "Quý này (Q3/2026)",
                "Năm nay (2026)",
                "Tùy chỉnh...",
              ].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    onDateRangeChange?.(opt)
                    setIsDatePickerOpen(false)
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors ${
                    dateRange === opt
                      ? "bg-[#e8f7ee] text-[#007a48] font-semibold"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Dropdown 1: Tất cả loại hình */}
        <div className="relative">
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange?.(e.target.value)}
            className="appearance-none bg-white hover:bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 pr-8 text-xs sm:text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer shadow-2xs transition-colors"
          >
            {CATEGORY_OPTIONS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Dropdown 2: Tất cả địa điểm */}
        <div className="relative">
          <select
            value={selectedLocation}
            onChange={(e) => onLocationChange?.(e.target.value)}
            className="appearance-none bg-white hover:bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 pr-8 text-xs sm:text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer shadow-2xs transition-colors"
          >
            {LOCATION_OPTIONS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Dropdown 3: Tất cả đối tác */}
        <div className="relative">
          <select
            value={selectedPartner}
            onChange={(e) => onPartnerChange?.(e.target.value)}
            className="appearance-none bg-white hover:bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 pr-8 text-xs sm:text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer shadow-2xs transition-colors"
          >
            {PARTNER_OPTIONS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Right: Lọc nâng cao */}
      <button
        type="button"
        onClick={onOpenAdvancedFilter}
        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#e8f7ee] hover:bg-[#d8f0e2] active:bg-[#c6e9d4] text-[#007a48] text-xs sm:text-sm font-semibold transition-colors cursor-pointer shadow-2xs shrink-0"
      >
        <SlidersHorizontal className="w-4 h-4 stroke-[2.2]" />
        <span>Lọc nâng cao</span>
      </button>
    </div>
  )
}
