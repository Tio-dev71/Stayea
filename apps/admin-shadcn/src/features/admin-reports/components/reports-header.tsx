"use client"

import { useState } from "react"
import { Calendar, ChevronDown, Download, RefreshCw } from "lucide-react"

interface ReportsHeaderProps {
  dateRange: string
  setDateRange: (range: string) => void
  comparisonPeriod: string
  setComparisonPeriod: (period: string) => void
  onOpenExportModal: () => void
}

export function ReportsHeader({
  dateRange,
  setDateRange,
  comparisonPeriod,
  setComparisonPeriod,
  onOpenExportModal,
}: ReportsHeaderProps) {
  const [isDateOpen, setIsDateOpen] = useState(false)
  const [isCompareOpen, setIsCompareOpen] = useState(false)

  const datePresets = [
    { label: "7 ngày qua", value: "24/08/2024 - 31/08/2024" },
    { label: "30 ngày qua", value: "01/08/2024 - 31/08/2024" },
    { label: "3 tháng hè (01/06 - 31/08)", value: "01/06/2024 - 31/08/2024" },
    { label: "Quý 3/2024", value: "01/07/2024 - 30/09/2024" },
    { label: "Năm 2024", value: "01/01/2024 - 31/12/2024" },
  ]

  const comparePresets = [
    "3 tháng trước",
    "Cùng kỳ năm trước",
    "Tháng liền kề trước",
    "Không so sánh",
  ]

  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-1">
      {/* Title & Subtitle */}
      <div>
        <h1 className="text-2xl sm:text-[26px] font-bold text-slate-900 tracking-tight">
          Báo cáo
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Theo dõi hiệu quả kinh doanh, marketing và vận hành trên Stayea.
        </p>
      </div>

      {/* Controls: Date Range, Compare & Export */}
      <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
        {/* Date Range Picker */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setIsDateOpen(!isDateOpen)
              setIsCompareOpen(false)
            }}
            className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200/90 rounded-lg text-xs sm:text-[13px] font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors shadow-2xs"
          >
            <Calendar className="w-4 h-4 text-slate-500 shrink-0" />
            <span>{dateRange}</span>
          </button>

          {isDateOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-60 bg-white border border-slate-200 rounded-xl shadow-lg z-30 py-1.5 animate-in fade-in-50 zoom-in-95">
              <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Chọn khoảng thời gian
              </div>
              {datePresets.map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => {
                    setDateRange(preset.value)
                    setIsDateOpen(false)
                  }}
                  className={`w-full text-left px-3 py-2 text-xs transition-colors flex items-center justify-between ${
                    dateRange === preset.value
                      ? "bg-emerald-50 text-[#007a48] font-semibold"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <span>{preset.label}</span>
                  <span className="text-[10px] text-slate-400 font-normal">
                    {preset.value}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Comparison Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setIsCompareOpen(!isCompareOpen)
              setIsDateOpen(false)
            }}
            className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200/90 rounded-lg text-xs sm:text-[13px] font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors shadow-2xs"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <div className="flex flex-col text-left">
              <span className="text-[10px] text-slate-400 leading-tight">So sánh với</span>
              <span className="text-xs sm:text-[13px] font-medium text-slate-700 leading-tight">
                {comparisonPeriod}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5 shrink-0" />
          </button>

          {isCompareOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-48 bg-white border border-slate-200 rounded-xl shadow-lg z-30 py-1.5 animate-in fade-in-50 zoom-in-95">
              <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Thời kỳ đối chiếu
              </div>
              {comparePresets.map((period) => (
                <button
                  key={period}
                  type="button"
                  onClick={() => {
                    setComparisonPeriod(period)
                    setIsCompareOpen(false)
                  }}
                  className={`w-full text-left px-3 py-2 text-xs transition-colors ${
                    comparisonPeriod === period
                      ? "bg-emerald-50 text-[#007a48] font-semibold"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Export Button */}
        <button
          type="button"
          onClick={onOpenExportModal}
          className="flex items-center gap-2 px-4 py-2 bg-[#007a48] hover:bg-[#00683d] text-white rounded-lg text-xs sm:text-[13px] font-medium shadow-sm hover:shadow transition-all shrink-0 cursor-pointer"
        >
          <Download className="w-4 h-4 shrink-0" />
          <span>Xuất báo cáo</span>
        </button>
      </div>
    </div>
  )
}
