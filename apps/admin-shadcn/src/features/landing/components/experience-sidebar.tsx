"use client"

import * as React from "react"
import {
  Compass,
  Palmtree,
  Waves,
  Utensils,
  Sparkles,
  Ship,
  Sparkle,
  Ticket,
} from "lucide-react"
import { EXPERIENCE_SIDEBAR_CATEGORIES } from "@/features/landing/data/stayea-mock-data"
import type {
  ExperienceCategorySidebarItem,
  ExperienceListingItem,
} from "@/features/landing/data/stayea-mock-data"

export interface ExperienceFilterState {
  category: string
  priceMax: number
  durations: string[]
}

interface ExperienceSidebarProps {
  readonly filters: ExperienceFilterState
  readonly onFiltersChange: (newFilters: ExperienceFilterState) => void
  readonly items?: readonly ExperienceListingItem[]
}

function getCategoryIcon(iconName: string, isActive: boolean) {
  const iconClass = `w-4 h-4 shrink-0 transition-colors ${
    isActive ? "text-[#0c3b40]" : "text-slate-500 group-hover:text-[#0c3b40]"
  }`

  switch (iconName) {
    case "all":
      return <Ticket className={iconClass} />
    case "tours":
      return <Compass className={iconClass} />
    case "island-trips":
      return <Palmtree className={iconClass} />
    case "snorkeling":
    case "diving":
      return <Waves className={iconClass} />
    case "cruises":
      return <Ship className={iconClass} />
    case "food":
      return <Utensils className={iconClass} />
    case "spa":
      return <Sparkles className={iconClass} />
    case "activities":
      return <Sparkle className={iconClass} />
    default:
      return <Compass className={iconClass} />
  }
}

export function ExperienceSidebar({
  filters,
  onFiltersChange,
  items = [],
}: ExperienceSidebarProps) {
  const handleSelectCategory = (categoryId: string) => {
    onFiltersChange({
      ...filters,
      category: categoryId,
    })
  }

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const max = Number(e.target.value)
    onFiltersChange({
      ...filters,
      priceMax: max,
    })
  }

  const handleToggleDuration = (dur: string) => {
    const list = filters.durations
    const updated = list.includes(dur) ? list.filter((d) => d !== dur) : [...list, dur]
    onFiltersChange({
      ...filters,
      durations: updated,
    })
  }

  const formattedMaxPrice =
    filters.priceMax >= 5_000_000
      ? "5.000.000đ+"
      : `${filters.priceMax.toLocaleString("vi-VN")}đ`

  return (
    <aside className="w-full lg:w-[260px] xl:w-[280px] shrink-0 space-y-6 select-none">
      {/* 1. Danh mục */}
      <div className="space-y-2 pb-5 border-b border-slate-100">
        <h3 className="font-bold text-slate-900 text-[14px] tracking-tight mb-2">
          Danh mục
        </h3>
        <div className="space-y-1">
          {EXPERIENCE_SIDEBAR_CATEGORIES.map((cat: ExperienceCategorySidebarItem) => {
            const isActive = filters.category === cat.id
            const count =
              cat.id === "all"
                ? items.length
                : items.filter((it) => it.categoryId === cat.id).length
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleSelectCategory(cat.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all duration-150 group ${
                  isActive
                    ? "bg-[#e6f4f5] text-[#0c3b40] font-bold border border-teal-200/80 shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {getCategoryIcon(cat.iconName, isActive)}
                  <span className="truncate">{cat.label}</span>
                </div>
                <span
                  className={`text-[11px] shrink-0 ${
                    isActive ? "text-[#0c3b40] font-semibold" : "text-slate-400 group-hover:text-slate-600"
                  }`}
                >
                  ({count})
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* 2. Khoảng giá */}
      <div className="space-y-3 pb-5 border-b border-slate-100">
        <h4 className="font-bold text-slate-800 text-[13px]">Khoảng giá</h4>
        <div className="text-[12px] font-medium text-slate-600">
          0đ - {formattedMaxPrice}
        </div>
        <div className="relative pt-1">
          {(() => {
            const progress = Math.min(100, Math.max(0, (filters.priceMax / 5_000_000) * 100))
            return (
              <input
                type="range"
                min={0}
                max={5_000_000}
                step={100_000}
                value={filters.priceMax}
                style={{ '--range-progress': `${progress}%` } as React.CSSProperties}
                onChange={handlePriceChange}
                className="w-full h-1.5 rounded-lg appearance-none cursor-pointer"
              />
            )
          })()}
        </div>
      </div>

      {/* 3. Thời gian */}
      <div className="space-y-3 pb-5 border-b border-slate-100">
        <h4 className="font-bold text-slate-800 text-[13px]">Thời gian</h4>
        <div className="space-y-2">
          {["Nửa ngày", "1 ngày", "Từ 2 ngày trở lên"].map((dur) => {
            const isChecked = filters.durations.includes(dur)
            return (
              <label
                key={dur}
                className="flex items-center gap-2.5 text-xs text-slate-600 hover:text-slate-900 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleToggleDuration(dur)}
                  className="w-4 h-4 rounded border-slate-300 text-[#0c3b40] focus:ring-[#0c3b40] cursor-pointer"
                />
                <span className={isChecked ? "font-semibold text-slate-900" : ""}>{dur}</span>
              </label>
            )
          })}
        </div>
      </div>
    </aside>
  )
}
