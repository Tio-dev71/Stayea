"use client"

import { useState } from "react"
import {
  Search,
  ChevronDown,
  SlidersHorizontal,
  List,
  MapPin,
} from "lucide-react"

interface PropertiesFilterBarProps {
  searchQuery?: string
  onSearchChange?: (val: string) => void
  selectedType?: string
  onTypeChange?: (val: string) => void
  selectedArea?: string
  onAreaChange?: (val: string) => void
  selectedStatus?: string
  onStatusChange?: (val: string) => void
  selectedManager?: string
  onManagerChange?: (val: string) => void
  onAdvancedFilter?: () => void
  viewMode?: "list" | "map"
  onViewModeChange?: (mode: "list" | "map") => void
}

export function PropertiesFilterBar({
  searchQuery = "",
  onSearchChange,
  selectedType = "",
  onTypeChange,
  selectedArea = "",
  onAreaChange,
  selectedStatus = "",
  onStatusChange,
  selectedManager = "",
  onManagerChange,
  onAdvancedFilter,
  viewMode = "list",
  onViewModeChange,
}: PropertiesFilterBarProps) {
  const [internalSearch, setInternalSearch] = useState(searchQuery)

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearchChange?.(internalSearch)
  }

  return (
    <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-3 text-xs sm:text-sm">
      {/* Left: Search & Filter Dropdowns */}
      <div className="flex flex-wrap items-center gap-2.5 flex-1">
        {/* Search input */}
        <form
          onSubmit={handleSearchSubmit}
          className="relative min-w-[240px] flex-1 sm:max-w-xs"
        >
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={internalSearch}
            onChange={(e) => {
              setInternalSearch(e.target.value)
              onSearchChange?.(e.target.value)
            }}
            placeholder="Tìm kiếm theo tên, địa điểm, loại hình..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-slate-200/90 placeholder:text-slate-400 text-slate-700 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all shadow-xs text-xs sm:text-sm"
          />
        </form>

        {/* Dropdown: Loại hình */}
        <div className="relative">
          <select
            value={selectedType}
            onChange={(e) => onTypeChange?.(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2 rounded-xl bg-white border border-slate-200/90 text-slate-700 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all shadow-xs cursor-pointer text-xs sm:text-sm font-medium"
          >
            <option value="">Loại hình</option>
            <option value="Biệt thự">Biệt thự</option>
            <option value="Căn hộ">Căn hộ</option>
            <option value="Homestay">Homestay</option>
            <option value="Khách sạn">Khách sạn</option>
            <option value="Resort">Resort</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Dropdown: Khu vực */}
        <div className="relative">
          <select
            value={selectedArea}
            onChange={(e) => onAreaChange?.(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2 rounded-xl bg-white border border-slate-200/90 text-slate-700 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all shadow-xs cursor-pointer text-xs sm:text-sm font-medium"
          >
            <option value="">Khu vực</option>
            <option value="Dương Đông">Dương Đông</option>
            <option value="An Thới">An Thới</option>
            <option value="Gành Dầu">Gành Dầu</option>
            <option value="Cửa Cạn">Cửa Cạn</option>
            <option value="Bãi Trường">Bãi Trường</option>
            <option value="Cửa Dương">Cửa Dương</option>
            <option value="Hàm Ninh">Hàm Ninh</option>
            <option value="Ông Lang">Ông Lang</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Dropdown: Trạng thái */}
        <div className="relative">
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange?.(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2 rounded-xl bg-white border border-slate-200/90 text-slate-700 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all shadow-xs cursor-pointer text-xs sm:text-sm font-medium"
          >
            <option value="">Trạng thái</option>
            <option value="active">Đang hoạt động</option>
            <option value="paused">Tạm dừng</option>
            <option value="pending">Cần kiểm duyệt</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Dropdown: Người quản lý */}
        <div className="relative">
          <select
            value={selectedManager}
            onChange={(e) => onManagerChange?.(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2 rounded-xl bg-white border border-slate-200/90 text-slate-700 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all shadow-xs cursor-pointer text-xs sm:text-sm font-medium"
          >
            <option value="">Người quản lý</option>
            <option value="minh">Nguyễn Minh</option>
            <option value="lan">Trần Lan</option>
            <option value="hoang">Lê Hoàng</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Button: Bộ lọc nâng cao */}
        <button
          type="button"
          onClick={onAdvancedFilter}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200/90 text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50/50 transition-colors shadow-xs font-medium text-xs sm:text-sm"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-600" />
          <span>Bộ lọc nâng cao</span>
        </button>
      </div>

      {/* Right: View Mode Switcher (Danh sách / Bản đồ) */}
      <div className="flex items-center self-end xl:self-auto bg-slate-100/90 p-1 rounded-xl border border-slate-200/70">
        <button
          type="button"
          onClick={() => onViewModeChange?.("list")}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            viewMode === "list"
              ? "bg-white text-emerald-700 shadow-xs border border-slate-200/80"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <List className="w-3.5 h-3.5" />
          <span>Danh sách</span>
        </button>

        <button
          type="button"
          onClick={() => onViewModeChange?.("map")}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            viewMode === "map"
              ? "bg-white text-emerald-700 shadow-xs border border-slate-200/80"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>Bản đồ</span>
        </button>
      </div>
    </div>
  )
}
