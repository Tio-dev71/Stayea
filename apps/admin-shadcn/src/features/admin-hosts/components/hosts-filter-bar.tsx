"use client"

import { useState } from "react"
import { Search, ChevronDown, SlidersHorizontal, Download } from "lucide-react"
import type { HostSegmentItem } from "@/features/admin-hosts/stayea-admin-hosts-mock-data"
import { HOSTS_SEGMENT_TABS } from "@/features/admin-hosts/stayea-admin-hosts-mock-data"

interface HostsFilterBarProps {
  searchQuery?: string
  onSearchChange?: (val: string) => void
  selectedPartnerType?: string
  onPartnerTypeChange?: (val: string) => void
  selectedStatus?: string
  onStatusChange?: (val: string) => void
  selectedRegion?: string
  onRegionChange?: (val: string) => void
  selectedDateJoined?: string
  onDateJoinedChange?: (val: string) => void
  onAdvancedFilter?: () => void
  onExport?: () => void
  activeSegment?: string
  onSegmentChange?: (segmentId: string) => void
  segmentCounts?: Record<string, number>
}

export function HostsFilterBar({
  searchQuery = "",
  onSearchChange,
  selectedPartnerType = "",
  onPartnerTypeChange,
  selectedStatus = "",
  onStatusChange,
  selectedRegion = "",
  onRegionChange,
  selectedDateJoined = "",
  onDateJoinedChange,
  onAdvancedFilter,
  onExport,
  activeSegment = "all",
  onSegmentChange,
  segmentCounts,
}: HostsFilterBarProps) {
  const [internalSearch, setInternalSearch] = useState(searchQuery)

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearchChange?.(internalSearch)
  }

  return (
    <div className="space-y-4">
      {/* 1. Main Filter Bar: Search + Dropdowns + Advanced Filter + Export */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-3.5 sm:p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        {/* Search Input */}
        <form
          onSubmit={handleSearchSubmit}
          className="relative min-w-[240px] flex-1 max-w-sm"
        >
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={internalSearch}
            onChange={(e) => {
              setInternalSearch(e.target.value)
              onSearchChange?.(e.target.value)
            }}
            placeholder="Tìm kiếm theo tên, email, số điện thoại..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1b7a4e]/20 focus:border-[#1b7a4e] transition-all placeholder:text-slate-400 font-medium"
          />
        </form>

        {/* Dropdowns & Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Loại đối tác */}
          <div className="relative">
            <select
              value={selectedPartnerType}
              onChange={(e) => onPartnerTypeChange?.(e.target.value)}
              className="appearance-none pl-3 pr-7 py-2 rounded-xl text-xs font-medium bg-white border border-slate-200/80 text-slate-700 hover:bg-slate-50 focus:outline-none cursor-pointer"
            >
              <option value="">Loại đối tác</option>
              <option value="individual">Chủ nhà cá nhân</option>
              <option value="management_company">Công ty quản lý</option>
              <option value="agency">Đối tác đại lý</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Trạng thái */}
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => onStatusChange?.(e.target.value)}
              className="appearance-none pl-3 pr-7 py-2 rounded-xl text-xs font-medium bg-white border border-slate-200/80 text-slate-700 hover:bg-slate-50 focus:outline-none cursor-pointer"
            >
              <option value="">Trạng thái</option>
              <option value="active">Đang hợp tác</option>
              <option value="pending">Chờ duyệt</option>
              <option value="paused">Tạm ngưng</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Khu vực */}
          <div className="relative">
            <select
              value={selectedRegion}
              onChange={(e) => onRegionChange?.(e.target.value)}
              className="appearance-none pl-3 pr-7 py-2 rounded-xl text-xs font-medium bg-white border border-slate-200/80 text-slate-700 hover:bg-slate-50 focus:outline-none cursor-pointer"
            >
              <option value="">Khu vực</option>
              <option value="duong-dong">Dương Đông</option>
              <option value="an-thoi">An Thới</option>
              <option value="ganh-dau">Gành Dầu</option>
              <option value="cua-can">Cửa Cạn</option>
              <option value="ham-ninh">Hàm Ninh</option>
              <option value="ong-lang">Ông Lang</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Ngày tham gia */}
          <div className="relative">
            <select
              value={selectedDateJoined}
              onChange={(e) => onDateJoinedChange?.(e.target.value)}
              className="appearance-none pl-3 pr-7 py-2 rounded-xl text-xs font-medium bg-white border border-slate-200/80 text-slate-700 hover:bg-slate-50 focus:outline-none cursor-pointer"
            >
              <option value="">Ngày tham gia</option>
              <option value="30d">30 ngày gần nhất</option>
              <option value="quarter">Quý này</option>
              <option value="year">Năm 2024</option>
              <option value="2023">Năm 2023</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Bộ lọc nâng cao */}
          <button
            type="button"
            onClick={onAdvancedFilter}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-white border border-slate-200/80 text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-700" />
            <span>Bộ lọc nâng cao</span>
          </button>

          {/* Xuất file */}
          <button
            type="button"
            onClick={onExport}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-50/70 border border-emerald-200/80 text-emerald-800 hover:bg-emerald-100/80 transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-emerald-700" />
            <span>Xuất file</span>
          </button>
        </div>
      </div>

      {/* 2. Segment Tabs */}
      <div className="flex items-center gap-1.5 border-b border-slate-200/70 overflow-x-auto no-scrollbar pt-1">
        {HOSTS_SEGMENT_TABS.map((tab: HostSegmentItem) => {
          const isActive = activeSegment === tab.id
          const count = segmentCounts ? (segmentCounts[tab.id] ?? 0) : tab.count
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSegmentChange?.(tab.id)}
              className={`relative px-4 py-2.5 text-xs font-medium rounded-t-xl transition-all whitespace-nowrap ${
                isActive
                  ? "bg-white text-[#1b7a4e] font-semibold border-t-2 border-x border-[#1b7a4e] border-b-transparent shadow-xs -mb-px"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`ml-1.5 text-[11px] font-medium px-1.5 py-0.5 rounded-full ${
                  isActive
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                ({count})
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
