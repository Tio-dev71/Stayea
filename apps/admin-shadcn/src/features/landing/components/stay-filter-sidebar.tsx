"use client"

import * as React from "react"
import { STAY_FILTER_OPTIONS } from "@/features/landing/data/stayea-mock-data"

export interface StayFilterState {
  priceMin: number
  priceMax: number
  types: string[]
  locations: string[]
  amenities: string[]
  suitability: string[]
  sortBy: string
}

interface StayFilterSidebarProps {
  readonly filters: StayFilterState
  readonly onFiltersChange: (newFilters: StayFilterState) => void
  readonly onResetFilters: () => void
}

export function StayFilterSidebar({
  filters,
  onFiltersChange,
  onResetFilters,
}: StayFilterSidebarProps) {
  const handleToggle = (
    category: "types" | "locations" | "amenities" | "suitability",
    id: string
  ) => {
    const list = filters[category]
    const updated = list.includes(id) ? list.filter((item) => item !== id) : [...list, id]
    onFiltersChange({
      ...filters,
      [category]: updated,
    })
  }

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const max = Number(e.target.value)
    onFiltersChange({
      ...filters,
      priceMax: max,
    })
  }

  const handleSortChange = (sortId: string) => {
    onFiltersChange({
      ...filters,
      sortBy: sortId,
    })
  }

  const formattedMaxPrice =
    filters.priceMax >= 20_000_000
      ? "20.000.000 đ+"
      : `${filters.priceMax.toLocaleString("vi-VN")} đ`

  return (
    <aside className="w-full lg:w-[260px] xl:w-[280px] shrink-0 space-y-6 select-none">
      {/* Header: Bộ lọc + Xóa tất cả */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <h3 className="font-bold text-slate-900 text-[15px] tracking-tight">Bộ lọc</h3>
        <button
          type="button"
          onClick={onResetFilters}
          className="text-[12px] font-semibold text-[#0c3b40] hover:text-[#08292d] hover:underline transition-colors"
        >
          Xóa tất cả
        </button>
      </div>

      {/* 1. Khoảng giá (mỗi đêm) */}
      <div className="space-y-3 pb-5 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <span className="text-[13px] font-bold text-slate-800">Khoảng giá (mỗi đêm)</span>
        </div>
        <div className="text-[12.5px] font-medium text-slate-600">
          0 đ - {formattedMaxPrice}
        </div>

        {/* Dual Slider Simulation / Range Input */}
        <div className="relative pt-2 pb-1">
          <input
            type="range"
            min={0}
            max={20_000_000}
            step={500_000}
            value={filters.priceMax}
            onChange={handlePriceChange}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0c3b40]"
          />
          <div className="flex justify-between items-center text-[10px] text-slate-600 font-medium pt-2">
            <span>0 đ</span>
            <span>5 triệu</span>
            <span>10 triệu</span>
            <span>20 triệu+</span>
          </div>
        </div>
      </div>

      {/* 2. Loại lưu trú */}
      <div className="space-y-3 pb-5 border-b border-slate-100">
        <h4 className="text-[13px] font-bold text-slate-800">Loại lưu trú</h4>
        <div className="space-y-2">
          {STAY_FILTER_OPTIONS.accommodationTypes.map((item) => {
            const isChecked = filters.types.includes(item.id)
            return (
              <label
                key={item.id}
                className="flex items-center justify-between group cursor-pointer text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleToggle("types", item.id)}
                    className="w-4 h-4 rounded border-slate-300 text-[#0c3b40] focus:ring-[#0c3b40] cursor-pointer"
                  />
                  <span
                    className={`transition-colors ${
                      isChecked
                        ? "font-semibold text-slate-900"
                        : "text-slate-600 group-hover:text-slate-900"
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
                <span className="text-[11px] text-slate-600">({item.count})</span>
              </label>
            )
          })}
        </div>
      </div>

      {/* 3. Khu vực */}
      <div className="space-y-3 pb-5 border-b border-slate-100">
        <h4 className="text-[13px] font-bold text-slate-800">Khu vực</h4>
        <div className="space-y-2">
          {STAY_FILTER_OPTIONS.locations.map((item) => {
            const isChecked = filters.locations.includes(item.id)
            return (
              <label
                key={item.id}
                className="flex items-center justify-between group cursor-pointer text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleToggle("locations", item.id)}
                    className="w-4 h-4 rounded border-slate-300 text-[#0c3b40] focus:ring-[#0c3b40] cursor-pointer"
                  />
                  <span
                    className={`transition-colors ${
                      isChecked
                        ? "font-semibold text-slate-900"
                        : "text-slate-600 group-hover:text-slate-900"
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
                <span className="text-[11px] text-slate-600">({item.count})</span>
              </label>
            )
          })}
        </div>
      </div>

      {/* 4. Tiện nghi */}
      <div className="space-y-3 pb-5 border-b border-slate-100">
        <h4 className="text-[13px] font-bold text-slate-800">Tiện nghi</h4>
        <div className="space-y-2">
          {STAY_FILTER_OPTIONS.amenities.map((item) => {
            const isChecked = filters.amenities.includes(item.id)
            return (
              <label
                key={item.id}
                className="flex items-center justify-between group cursor-pointer text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleToggle("amenities", item.id)}
                    className="w-4 h-4 rounded border-slate-300 text-[#0c3b40] focus:ring-[#0c3b40] cursor-pointer"
                  />
                  <span
                    className={`transition-colors ${
                      isChecked
                        ? "font-semibold text-slate-900"
                        : "text-slate-600 group-hover:text-slate-900"
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
                <span className="text-[11px] text-slate-600">({item.count})</span>
              </label>
            )
          })}
        </div>
      </div>

      {/* 5. Phù hợp cho */}
      <div className="space-y-3 pb-5 border-b border-slate-100">
        <h4 className="text-[13px] font-bold text-slate-800">Phù hợp cho</h4>
        <div className="space-y-2">
          {STAY_FILTER_OPTIONS.suitability.map((item) => {
            const isChecked = filters.suitability.includes(item.id)
            return (
              <label
                key={item.id}
                className="flex items-center justify-between group cursor-pointer text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleToggle("suitability", item.id)}
                    className="w-4 h-4 rounded border-slate-300 text-[#0c3b40] focus:ring-[#0c3b40] cursor-pointer"
                  />
                  <span
                    className={`transition-colors ${
                      isChecked
                        ? "font-semibold text-slate-900"
                        : "text-slate-600 group-hover:text-slate-900"
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
                <span className="text-[11px] text-slate-600">({item.count})</span>
              </label>
            )
          })}
        </div>
      </div>

      {/* 6. Sắp xếp */}
      <div className="space-y-3">
        <h4 className="text-[13px] font-bold text-slate-800">Sắp xếp</h4>
        <div className="space-y-2">
          {STAY_FILTER_OPTIONS.sortOptions.map((item) => {
            const isSelected = filters.sortBy === item.id
            return (
              <label
                key={item.id}
                className="flex items-center gap-2.5 group cursor-pointer text-xs"
              >
                <input
                  type="radio"
                  name="stay-sort"
                  value={item.id}
                  checked={isSelected}
                  onChange={() => handleSortChange(item.id)}
                  className="w-4 h-4 border-slate-300 text-[#0c3b40] focus:ring-[#0c3b40] cursor-pointer"
                />
                <span
                  className={`transition-colors ${
                    isSelected
                      ? "font-bold text-slate-900"
                      : "text-slate-600 group-hover:text-slate-900"
                  }`}
                >
                  {item.label}
                </span>
              </label>
            )
          })}
        </div>
      </div>
    </aside>
  )
}
