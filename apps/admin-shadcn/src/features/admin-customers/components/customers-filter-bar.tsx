"use client"

import { useState } from "react"
import { Search, ChevronDown, SlidersHorizontal } from "lucide-react"
import type { CustomerSegmentItem } from "@/features/admin-customers/stayea-admin-customers-mock-data"
import { CUSTOMERS_SEGMENT_TABS } from "@/features/admin-customers/stayea-admin-customers-mock-data"

interface CustomersFilterBarProps {
  searchQuery?: string
  onSearchChange?: (val: string) => void
  selectedNationality?: string
  onNationalityChange?: (val: string) => void
  selectedGroup?: string
  onGroupChange?: (val: string) => void
  selectedStatus?: string
  onStatusChange?: (val: string) => void
  selectedDateRange?: string
  onDateRangeChange?: (val: string) => void
  onAdvancedFilter?: () => void
  activeSegment?: string
  onSegmentChange?: (segmentId: string) => void
}

export function CustomersFilterBar({
  searchQuery = "",
  onSearchChange,
  selectedNationality = "",
  onNationalityChange,
  selectedGroup = "",
  onGroupChange,
  selectedStatus = "",
  onStatusChange,
  selectedDateRange = "",
  onDateRangeChange,
  onAdvancedFilter,
  activeSegment = "all",
  onSegmentChange,
}: CustomersFilterBarProps) {
  const [internalSearch, setInternalSearch] = useState(searchQuery)

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearchChange?.(internalSearch)
  }

  return (
    <div className="space-y-4">
      {/* 1. Main Filter Bar: Search + Dropdowns + Advanced Filter */}
      <div className="flex flex-wrap items-center gap-2.5 text-xs sm:text-sm">
        {/* Search input */}
        <form
          onSubmit={handleSearchSubmit}
          className="relative min-w-[260px] flex-1 sm:max-w-sm"
        >
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={internalSearch}
            onChange={(e) => {
              setInternalSearch(e.target.value)
              onSearchChange?.(e.target.value)
            }}
            placeholder="Tìm kiếm theo tên, SĐT, email, mã khách hàng..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-slate-200/90 placeholder:text-slate-400 text-slate-700 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all shadow-xs text-xs sm:text-sm"
          />
        </form>

        {/* Dropdown: Quốc tịch */}
        <div className="relative">
          <select
            value={selectedNationality}
            onChange={(e) => onNationalityChange?.(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2 rounded-xl bg-white border border-slate-200/90 text-slate-700 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all shadow-xs cursor-pointer text-xs sm:text-sm font-medium"
          >
            <option value="">Quốc tịch</option>
            <option value="Việt Nam">Việt Nam</option>
            <option value="Mỹ">Mỹ</option>
            <option value="Hàn Quốc">Hàn Quốc</option>
            <option value="Anh">Anh</option>
            <option value="Pháp">Pháp</option>
            <option value="Úc">Úc</option>
            <option value="Tây Ban Nha">Tây Ban Nha</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Dropdown: Nhóm khách hàng */}
        <div className="relative">
          <select
            value={selectedGroup}
            onChange={(e) => onGroupChange?.(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2 rounded-xl bg-white border border-slate-200/90 text-slate-700 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all shadow-xs cursor-pointer text-xs sm:text-sm font-medium"
          >
            <option value="">Nhóm khách hàng</option>
            <option value="loyal">Khách hàng thân thiết</option>
            <option value="new">Khách hàng mới</option>
            <option value="enterprise">Doanh nghiệp</option>
            <option value="international">Quốc tế</option>
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
            <option value="paused">Tạm ngừng</option>
            <option value="pending">Chưa kích hoạt</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Dropdown: Ngày tạo */}
        <div className="relative">
          <select
            value={selectedDateRange}
            onChange={(e) => onDateRangeChange?.(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2 rounded-xl bg-white border border-slate-200/90 text-slate-700 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all shadow-xs cursor-pointer text-xs sm:text-sm font-medium"
          >
            <option value="">Ngày tạo</option>
            <option value="today">Hôm nay</option>
            <option value="this-week">Tuần này</option>
            <option value="this-month">Tháng này</option>
            <option value="this-year">Năm nay</option>
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

      {/* 2. Segment Tabs (Tất cả, Thân thiết, Mới, Doanh nghiệp, Quốc tế) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs select-none">
        {CUSTOMERS_SEGMENT_TABS.map((tab: CustomerSegmentItem) => {
          const isActive = activeSegment === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSegmentChange?.(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? "bg-emerald-50/80 text-emerald-800 border border-emerald-600 shadow-2xs"
                  : "bg-slate-100/80 text-slate-600 hover:text-slate-900 hover:bg-slate-200/70"
              }`}
            >
              {tab.label} ({tab.count.toLocaleString("vi-VN")})
            </button>
          )
        })}
      </div>
    </div>
  )
}
