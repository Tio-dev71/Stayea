"use client"

import * as React from "react"
import { ChevronDown, SlidersHorizontal, Check } from "lucide-react"

import type { TransportItem } from "@/features/landing/data/stayea-mock-data"

export interface TransportFilterState {
  pricePreset: string | null
  maxPrice: number
  selectedServiceTypes: string[]
  selectedLocations: string[]
  selectedAmenities: string[]
  selectedSuitability: string[]
  sortOption: string
}

interface TransportFilterSidebarProps {
  readonly filters: TransportFilterState
  readonly onFiltersChange: React.Dispatch<React.SetStateAction<TransportFilterState>>
  readonly onResetFilters: () => void
  readonly items?: readonly TransportItem[]
}

export function TransportFilterSidebar({
  filters,
  onFiltersChange,
  onResetFilters,
  items = [],
}: TransportFilterSidebarProps) {
  const counts = React.useMemo(() => {
    const serviceTypeMap = {
      "airport-transfer": 0,
      "car-rental": 0,
      "motorbike-rental": 0,
      "private-driver": 0,
    }
    const locationMap = {
      "san-bay-phu-quoc": 0,
      "duong-dong": 0,
      "bai-truong": 0,
      "bai-sao": 0,
      "nam-dao": 0,
      "bac-dao": 0,
    }
    const amenityMap = {
      "don-tan-noi": 0,
      "bao-hiem": 0,
      "ghe-tre-em": 0,
      "wifi": 0,
      "nuoc-uong": 0,
    }
    const suitabilityMap = {
      "ca-nhan": 0,
      "cap-doi": 0,
      "gia-dinh": 0,
      "nhom-ban": 0,
      "doanh-nghiep": 0,
    }

    if (Array.isArray(items)) {
      items.forEach((it) => {
        if (it.serviceTypeId === "airport-transfer") serviceTypeMap["airport-transfer"] += 1
        else if (it.serviceTypeId === "car-rental") serviceTypeMap["car-rental"] += 1
        else if (it.serviceTypeId === "motorbike-rental") serviceTypeMap["motorbike-rental"] += 1
        else if (it.serviceTypeId === "private-driver") serviceTypeMap["private-driver"] += 1

        const loc = (it.pickupLocation || "").toLowerCase()
        if (loc.includes("sân bay")) locationMap["san-bay-phu-quoc"] += 1
        if (loc.includes("dương đông")) locationMap["duong-dong"] += 1
        if (loc.includes("bãi trường")) locationMap["bai-truong"] += 1
        if (loc.includes("bãi sao")) locationMap["bai-sao"] += 1
        if (loc.includes("nam đảo") || loc.includes("an thới")) locationMap["nam-dao"] += 1
        if (loc.includes("bắc đảo") || loc.includes("gành dầu")) locationMap["bac-dao"] += 1
      })
    }

    return {
      serviceTypeMap: serviceTypeMap as Record<string, number>,
      locationMap: locationMap as Record<string, number>,
      amenityMap: amenityMap as Record<string, number>,
      suitabilityMap: suitabilityMap as Record<string, number>,
    }
  }, [items])
  function toggleServiceType(id: string) {
    onFiltersChange((prev) => {
      const exists = prev.selectedServiceTypes.includes(id)
      return {
        ...prev,
        selectedServiceTypes: exists
          ? prev.selectedServiceTypes.filter((item) => item !== id)
          : [...prev.selectedServiceTypes, id],
      }
    })
  }

  function toggleLocation(id: string) {
    onFiltersChange((prev) => {
      const exists = prev.selectedLocations.includes(id)
      return {
        ...prev,
        selectedLocations: exists
          ? prev.selectedLocations.filter((item) => item !== id)
          : [...prev.selectedLocations, id],
      }
    })
  }

  function toggleAmenity(id: string) {
    onFiltersChange((prev) => {
      const exists = prev.selectedAmenities.includes(id)
      return {
        ...prev,
        selectedAmenities: exists
          ? prev.selectedAmenities.filter((item) => item !== id)
          : [...prev.selectedAmenities, id],
      }
    })
  }

  function toggleSuitability(id: string) {
    onFiltersChange((prev) => {
      const exists = prev.selectedSuitability.includes(id)
      return {
        ...prev,
        selectedSuitability: exists
          ? prev.selectedSuitability.filter((item) => item !== id)
          : [...prev.selectedSuitability, id],
      }
    })
  }

  function handlePriceChipClick(preset: string) {
    onFiltersChange((prev) => ({
      ...prev,
      pricePreset: prev.pricePreset === preset ? null : preset,
    }))
  }

  return (
    <aside className="w-full lg:w-[280px] shrink-0 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-6">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-teal-600" />
          <h3 className="font-bold text-slate-900 text-base">Bộ lọc tìm kiếm</h3>
        </div>
        <button
          type="button"
          onClick={onResetFilters}
          className="text-xs text-blue-600 hover:text-blue-700 font-medium hover:underline transition-all"
        >
          Xóa tất cả
        </button>
      </div>

      {/* 1. Khoảng giá (VND) */}
      <div className="space-y-3 pb-5 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800">Khoảng giá (VND)</span>
          <span className="text-[11px] text-slate-500 font-medium">
            0đ - {filters.maxPrice >= 5_000_000 ? "5.000.000đ+" : `${filters.maxPrice.toLocaleString("vi-VN")}đ`}
          </span>
        </div>

        {/* Range slider visual */}
        <div className="relative pt-1 pb-2">
          {(() => {
            const progress = Math.min(100, Math.max(0, (filters.maxPrice / 5_000_000) * 100))
            return (
              <input
                type="range"
                min={0}
                max={5_000_000}
                step={100_000}
                value={filters.maxPrice}
                style={{
                  '--range-progress': `${progress}%`,
                  background: `linear-gradient(to right, #0c3b40 0%, #0c3b40 ${progress}%, #e2e8f0 ${progress}%, #e2e8f0 100%)`,
                } as React.CSSProperties}
                onChange={(e) =>
                  onFiltersChange((prev) => ({ ...prev, maxPrice: Number(e.target.value) }))
                }
                className="w-full cursor-pointer h-1.5 rounded-lg"
              />
            )
          })()}
        </div>

        {/* 4 Quick price chips (2x2 grid) */}
        <div className="grid grid-cols-2 gap-1.5">
          {[
            { id: "under-500k", label: "Dưới 500.000đ" },
            { id: "500k-1m", label: "500.000đ - 1.000.000đ" },
            { id: "1m-2m", label: "1.000.000đ - 2.000.000đ" },
            { id: "above-2m", label: "Trên 2.000.000đ" },
          ].map((chip) => {
            const isSelected = filters.pricePreset === chip.id
            return (
              <button
                key={chip.id}
                type="button"
                onClick={() => handlePriceChipClick(chip.id)}
                className={`px-2 py-1.5 rounded-lg text-[11px] font-medium transition-colors border text-left truncate ${
                  isSelected
                    ? "bg-teal-50 border-teal-500 text-teal-800 font-semibold"
                    : "bg-slate-50/60 border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
              >
                {chip.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* 2. Loại dịch vụ */}
      <div className="space-y-2.5 pb-5 border-b border-slate-100">
        <h4 className="text-xs font-bold text-slate-800">Loại dịch vụ</h4>
        <div className="grid grid-cols-2 gap-y-2 gap-x-1">
          {[
            { id: "airport-transfer", label: "Đưa đón sân bay" },
            { id: "car-rental", label: "Thuê ô tô" },
            { id: "motorbike-rental", label: "Thuê xe máy" },
            { id: "private-driver", label: "Tài xế riêng" },
          ].map((item) => {
            const isChecked = filters.selectedServiceTypes.includes(item.id)
            const count = counts.serviceTypeMap[item.id] || 0
            return (
              <label
                key={item.id}
                className="flex items-center gap-1.5 cursor-pointer text-[11px] text-slate-600 hover:text-slate-900 group select-none"
              >
                <div
                  onClick={() => toggleServiceType(item.id)}
                  className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 transition-colors ${
                    isChecked
                      ? "bg-[#0c3b40] border-[#0c3b40] text-white"
                      : "border-slate-300 group-hover:border-slate-400 bg-white"
                  }`}
                >
                  {isChecked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                </div>
                <span className="truncate">{item.label}</span>
                <span className="text-[10px] text-slate-400">({count})</span>
              </label>
            )
          })}
        </div>
      </div>

      {/* 3. Khu vực */}
      <div className="space-y-2.5 pb-5 border-b border-slate-100">
        <h4 className="text-xs font-bold text-slate-800">Khu vực</h4>
        <div className="grid grid-cols-2 gap-y-2 gap-x-1">
          {[
            { id: "san-bay-phu-quoc", label: "Sân bay Phú Quốc" },
            { id: "duong-dong", label: "Dương Đông" },
            { id: "bai-truong", label: "Bãi Trường" },
            { id: "bai-sao", label: "Bãi Sao" },
            { id: "nam-dao", label: "Nam Đảo" },
            { id: "bac-dao", label: "Bắc Đảo" },
          ].map((item) => {
            const isChecked = filters.selectedLocations.includes(item.id)
            const count = counts.locationMap[item.id] || 0
            return (
              <label
                key={item.id}
                className="flex items-center gap-1.5 cursor-pointer text-[11px] text-slate-600 hover:text-slate-900 group select-none"
              >
                <div
                  onClick={() => toggleLocation(item.id)}
                  className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 transition-colors ${
                    isChecked
                      ? "bg-[#0c3b40] border-[#0c3b40] text-white"
                      : "border-slate-300 group-hover:border-slate-400 bg-white"
                  }`}
                >
                  {isChecked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                </div>
                <span className="truncate">{item.label}</span>
                <span className="text-[10px] text-slate-400">({count})</span>
              </label>
            )
          })}
        </div>
      </div>

      {/* 4. Tiện ích */}
      <div className="space-y-2.5 pb-5 border-b border-slate-100">
        <h4 className="text-xs font-bold text-slate-800">Tiện ích</h4>
        <div className="grid grid-cols-2 gap-y-2 gap-x-1">
          {[
            { id: "don-tan-noi", label: "Đón tiễn tận nơi" },
            { id: "bao-hiem", label: "Bảo hiểm" },
            { id: "ghe-tre-em", label: "Ghế trẻ em" },
            { id: "wifi", label: "Wi-Fi" },
            { id: "nuoc-uong", label: "Nước uống miễn phí" },
          ].map((item) => {
            const isChecked = filters.selectedAmenities.includes(item.id)
            const count = counts.amenityMap[item.id] || 0
            return (
              <label
                key={item.id}
                className="flex items-center gap-1.5 cursor-pointer text-[11px] text-slate-600 hover:text-slate-900 group select-none"
              >
                <div
                  onClick={() => toggleAmenity(item.id)}
                  className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 transition-colors ${
                    isChecked
                      ? "bg-[#0c3b40] border-[#0c3b40] text-white"
                      : "border-slate-300 group-hover:border-slate-400 bg-white"
                  }`}
                >
                  {isChecked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                </div>
                <span className="truncate">{item.label}</span>
                <span className="text-[10px] text-slate-400">({count})</span>
              </label>
            )
          })}
        </div>
      </div>

      {/* 5. Phù hợp cho */}
      <div className="space-y-2.5 pb-5 border-b border-slate-100">
        <h4 className="text-xs font-bold text-slate-800">Phù hợp cho</h4>
        <div className="grid grid-cols-2 gap-y-2 gap-x-1">
          {[
            { id: "ca-nhan", label: "Cá nhân" },
            { id: "cap-doi", label: "Cặp đôi" },
            { id: "gia-dinh", label: "Gia đình" },
            { id: "nhom-ban", label: "Nhóm bạn" },
            { id: "doanh-nghiep", label: "Doanh nghiệp" },
          ].map((item) => {
            const isChecked = filters.selectedSuitability.includes(item.id)
            const count = counts.suitabilityMap[item.id] || 0
            return (
              <label
                key={item.id}
                className="flex items-center gap-1.5 cursor-pointer text-[11px] text-slate-600 hover:text-slate-900 group select-none"
              >
                <div
                  onClick={() => toggleSuitability(item.id)}
                  className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 transition-colors ${
                    isChecked
                      ? "bg-[#0c3b40] border-[#0c3b40] text-white"
                      : "border-slate-300 group-hover:border-slate-400 bg-white"
                  }`}
                >
                  {isChecked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                </div>
                <span className="truncate">{item.label}</span>
                <span className="text-[10px] text-slate-400">({count})</span>
              </label>
            )
          })}
        </div>
      </div>

      {/* 6. Sắp xếp Dropdown */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-800 block">Sắp xếp</label>
        <div className="relative">
          <select
            value={filters.sortOption}
            onChange={(e) =>
              onFiltersChange((prev) => ({ ...prev, sortOption: e.target.value }))
            }
            className="w-full h-9 pl-3 pr-8 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 outline-none cursor-pointer appearance-none hover:bg-slate-100 transition-colors"
          >
            <option value="popular">Phổ biến nhất</option>
            <option value="price-low">Giá: Thấp đến cao</option>
            <option value="price-high">Giá: Cao đến thấp</option>
            <option value="rating">Đánh giá cao nhất</option>
          </select>
          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
        </div>
      </div>
    </aside>
  )
}
