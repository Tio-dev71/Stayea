"use client"

import { useState } from "react"
import { Search, ChevronDown, SlidersHorizontal, Download } from "lucide-react"

interface BookingsFilterBarProps {
  onSearchChange?: (val: string) => void
  onFilterChange?: (filterType: string, val: string) => void
  onAdvancedFilter?: () => void
  onExport?: () => void
}

export function BookingsFilterBar({
  onSearchChange,
  onAdvancedFilter,
  onExport,
}: BookingsFilterBarProps) {
  const [searchVal, setSearchVal] = useState("")

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs space-y-3">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* 1. Search Box */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchVal}
            onChange={(e) => {
              setSearchVal(e.target.value)
              onSearchChange?.(e.target.value)
            }}
            placeholder="Tìm kiếm theo mã đặt chỗ, tên khách hàng, bất động sản..."
            className="w-full bg-slate-50/70 hover:bg-slate-50 focus:bg-white text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 rounded-xl pl-9 pr-4 py-2 border border-slate-200/80 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all"
          />
        </div>

        {/* 2. Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Trạng thái */}
          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 shadow-2xs transition-colors"
          >
            <span>Trạng thái</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* Loại lưu trú */}
          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 shadow-2xs transition-colors"
          >
            <span>Loại lưu trú</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* Nguồn khách */}
          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 shadow-2xs transition-colors"
          >
            <span>Nguồn khách</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* Thanh toán */}
          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 shadow-2xs transition-colors"
          >
            <span>Thanh toán</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* Bộ lọc nâng cao */}
          <button
            type="button"
            onClick={onAdvancedFilter}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-emerald-300 bg-emerald-50/50 hover:bg-emerald-50 text-xs font-semibold text-[#1b7a4e] shadow-2xs transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Bộ lọc nâng cao</span>
          </button>

          {/* Xuất file */}
          <button
            type="button"
            onClick={onExport}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 shadow-2xs transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Xuất file</span>
          </button>
        </div>
      </div>
    </div>
  )
}
