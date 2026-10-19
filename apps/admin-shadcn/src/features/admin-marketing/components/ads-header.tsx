"use client"

import { useState } from "react"
import { Calendar, ChevronDown, Download, SlidersHorizontal } from "lucide-react"

interface AdsHeaderProps {
  onDateRangeChange?: (range: string) => void
  onComparisonChange?: (period: string) => void
  onExportReport?: () => void
}

export function AdsHeader({
  onDateRangeChange,
  onComparisonChange,
  onExportReport,
}: AdsHeaderProps) {
  const [selectedDateRange, setSelectedDateRange] = useState("01/06/2024 - 31/08/2024")
  const [selectedComparison, setSelectedComparison] = useState("So sánh với 3 tháng trước")

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-1">
      {/* Left: Titles */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Báo cáo Quảng cáo
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Theo dõi hiệu quả quảng cáo, tối ưu chi phí và đo lường ROI cho Stayea.
        </p>
      </div>

      {/* Right: Date filter + Comparison + Export */}
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Date range picker */}
        <div className="relative">
          <div className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200/90 rounded-lg text-xs sm:text-[13px] font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-sm transition-all cursor-pointer">
            <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <select
              value={selectedDateRange}
              aria-label="Chọn khoảng thời gian"
              onChange={(e) => {
                setSelectedDateRange(e.target.value)
                onDateRangeChange?.(e.target.value)
              }}
              className="bg-transparent appearance-none pr-5 outline-hidden cursor-pointer text-slate-700 text-xs sm:text-[13px] font-medium"
            >
              <option value="01/06/2024 - 31/08/2024">01/06/2024 - 31/08/2024</option>
              <option value="01/07/2024 - 30/09/2024">01/07/2024 - 30/09/2024</option>
              <option value="01/08/2024 - 31/10/2024">01/08/2024 - 31/10/2024</option>
              <option value="Cả năm 2024">Cả năm 2024</option>
            </select>
            <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2.5 pointer-events-none" />
          </div>
        </div>

        {/* Comparison period */}
        <div className="relative">
          <div className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200/90 rounded-lg text-xs sm:text-[13px] font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-sm transition-all cursor-pointer">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <select
              value={selectedComparison}
              aria-label="So sánh thời gian"
              onChange={(e) => {
                setSelectedComparison(e.target.value)
                onComparisonChange?.(e.target.value)
              }}
              className="bg-transparent appearance-none pr-5 outline-hidden cursor-pointer text-slate-700 text-xs sm:text-[13px] font-medium"
            >
              <option value="So sánh với 3 tháng trước">So sánh với 3 tháng trước</option>
              <option value="So sánh cùng kỳ năm trước">So sánh cùng kỳ năm trước</option>
              <option value="So sánh với tháng trước">So sánh với tháng trước</option>
              <option value="Không so sánh">Không so sánh</option>
            </select>
            <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2.5 pointer-events-none" />
          </div>
        </div>

        {/* Export report button */}
        <button
          type="button"
          onClick={onExportReport}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#007a48] hover:bg-[#00653b] text-white rounded-lg text-xs sm:text-[13px] font-medium shadow-sm transition-all cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Xuất báo cáo</span>
        </button>
      </div>
    </div>
  )
}
