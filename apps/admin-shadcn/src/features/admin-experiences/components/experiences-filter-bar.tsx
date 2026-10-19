"use client"

import {
  Search,
  ChevronDown,
  SlidersHorizontal,
  Download,
} from "lucide-react"

interface ExperiencesFilterBarProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  selectedCategory: string
  onCategoryChange: (value: string) => void
  selectedLocation: string
  onLocationChange: (value: string) => void
  selectedStatus: string
  onStatusChange: (value: string) => void
  selectedProvider: string
  onProviderChange: (value: string) => void
  onAdvancedFilter?: () => void
  onExport?: () => void
}

export function ExperiencesFilterBar({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedLocation,
  onLocationChange,
  selectedStatus,
  onStatusChange,
  selectedProvider,
  onProviderChange,
  onAdvancedFilter,
  onExport,
}: ExperiencesFilterBarProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-2.5 sm:p-3 flex flex-wrap xl:flex-nowrap items-center justify-between gap-2">
      {/* Left side: Search & Dropdown Filters in single row */}
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 flex-1 min-w-0">
        {/* Search Input */}
        <div className="relative w-full sm:w-[200px] shrink-0">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm kiếm tên tour, địa điểm, đối tác..."
            className="w-full pl-8 pr-2.5 py-1.5 text-[11px] rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Filter: Loại trải nghiệm */}
        <div className="relative shrink-0">
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="appearance-none pl-2.5 pr-6 py-1.5 rounded-lg border border-slate-200 bg-white text-[11px] font-medium text-slate-700 hover:bg-slate-50 focus:outline-none cursor-pointer"
          >
            <option value="all">Loại trải nghiệm</option>
            <option value="Tour biển">Tour biển đảo</option>
            <option value="Tham quan">Tham quan</option>
            <option value="Ẩm thực">Ẩm thực</option>
            <option value="Thể thao biển">Thể thao biển</option>
            <option value="Văn hóa">Văn hóa</option>
            <option value="Sức khỏe">Wellness</option>
          </select>
          <ChevronDown className="w-3 h-3 text-slate-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Filter: Địa điểm */}
        <div className="relative shrink-0">
          <select
            value={selectedLocation}
            onChange={(e) => onLocationChange(e.target.value)}
            className="appearance-none pl-2.5 pr-6 py-1.5 rounded-lg border border-slate-200 bg-white text-[11px] font-medium text-slate-700 hover:bg-slate-50 focus:outline-none cursor-pointer"
          >
            <option value="all">Địa điểm</option>
            <option value="Phú Quốc">Phú Quốc</option>
            <option value="Hà Nội">Hà Nội</option>
            <option value="Đà Nẵng">Đà Nẵng</option>
            <option value="Nha Trang">Nha Trang</option>
            <option value="Đà Lạt">Đà Lạt</option>
          </select>
          <ChevronDown className="w-3 h-3 text-slate-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Filter: Trạng thái */}
        <div className="relative shrink-0">
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="appearance-none pl-2.5 pr-6 py-1.5 rounded-lg border border-slate-200 bg-white text-[11px] font-medium text-slate-700 hover:bg-slate-50 focus:outline-none cursor-pointer"
          >
            <option value="all">Trạng thái</option>
            <option value="active">Đang hoạt động</option>
            <option value="pending">Chờ duyệt</option>
            <option value="paused">Tạm ngưng</option>
          </select>
          <ChevronDown className="w-3 h-3 text-slate-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Filter: Đối tác cung cấp */}
        <div className="relative shrink-0">
          <select
            value={selectedProvider}
            onChange={(e) => onProviderChange(e.target.value)}
            className="appearance-none pl-2.5 pr-6 py-1.5 rounded-lg border border-slate-200 bg-white text-[11px] font-medium text-slate-700 hover:bg-slate-50 focus:outline-none cursor-pointer"
          >
            <option value="all">Đối tác cung cấp</option>
            <option value="Ocean Stay">Ocean Stay</option>
            <option value="PhuQuoc Dive">PhuQuoc Dive</option>
            <option value="Sunset Tours">Sunset Tours</option>
            <option value="VinWonders">VinWonders</option>
            <option value="Sun World">Sun World</option>
            <option value="Local Tours">Local Tours</option>
            <option value="Taste of Phu Quoc">Taste of Phu Quoc</option>
          </select>
          <ChevronDown className="w-3 h-3 text-slate-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Right side: Action Buttons */}
      <div className="flex items-center gap-1.5 shrink-0 self-end xl:self-auto">
        <button
          type="button"
          onClick={onAdvancedFilter}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-50/70 hover:bg-emerald-100/80 text-emerald-800 text-[11px] font-semibold transition-colors border border-emerald-200/50"
        >
          <SlidersHorizontal className="w-3 h-3 text-emerald-700" />
          <span>Bộ lọc nâng cao</span>
        </button>

        <button
          type="button"
          onClick={onExport}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-50/70 hover:bg-emerald-100/80 text-emerald-800 text-[11px] font-semibold transition-colors border border-emerald-200/50"
        >
          <Download className="w-3 h-3 text-emerald-700" />
          <span>Xuất file</span>
        </button>
      </div>
    </div>
  )
}
