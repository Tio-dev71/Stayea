"use client"

import { useState } from "react"
import { Calendar, Download, SlidersHorizontal, ChevronDown } from "lucide-react"

interface ExperienceReportHeaderProps {
  onDateRangeChange?: (range: string) => void
  onComparisonChange?: (period: string) => void
  onExportReport?: () => void
}

export function ExperienceReportHeader({
  onDateRangeChange,
  onComparisonChange,
  onExportReport,
}: ExperienceReportHeaderProps) {
  const [dateRange, setDateRange] = useState("01/06/2024 - 31/08/2024")
  const [comparisonPeriod, setComparisonPeriod] = useState("3 tháng trước")

  const dateOptions = [
    "01/06/2024 - 31/08/2024",
    "01/03/2024 - 31/05/2024",
    "01/01/2024 - 31/12/2024",
    "30 ngày qua",
    "7 ngày qua",
  ]

  const comparisonOptions = [
    "3 tháng trước",
    "Cùng kỳ năm ngoái",
    "Tháng trước",
    "Không so sánh",
  ]

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      {/* Left: Title & Subtitle */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Báo cáo Trải nghiệm & Tour
        </h1>
        <p className="text-xs sm:text-[13px] text-slate-500 mt-1">
          Theo dõi hiệu quả các tour, trải nghiệm, hoạt động và dịch vụ du lịch trên Stayea.
        </p>
      </div>

      {/* Right: Date Picker, Comparison, Export Button */}
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Date Filter Dropdown */}
        <div className="relative">
          <div className="flex items-center gap-2 bg-white border border-slate-200/90 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 shadow-2xs hover:border-slate-300 transition-colors cursor-pointer">
            <Calendar className="w-4 h-4 text-slate-500 shrink-0" />
            <select
              value={dateRange}
              onChange={(e) => {
                setDateRange(e.target.value)
                onDateRangeChange?.(e.target.value)
              }}
              className="bg-transparent border-none outline-hidden text-xs font-medium text-slate-700 cursor-pointer pr-4 appearance-none"
            >
              {dateOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 pointer-events-none" />
          </div>
        </div>

        {/* Comparison Dropdown */}
        <div className="relative">
          <div className="flex items-center gap-2 bg-white border border-slate-200/90 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 shadow-2xs hover:border-slate-300 transition-colors cursor-pointer">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <div className="flex flex-col text-left">
              <span className="text-[10px] text-slate-400 leading-none">So sánh với</span>
              <select
                value={comparisonPeriod}
                onChange={(e) => {
                  setComparisonPeriod(e.target.value)
                  onComparisonChange?.(e.target.value)
                }}
                className="bg-transparent border-none outline-hidden text-xs font-medium text-slate-700 cursor-pointer pr-4 appearance-none mt-0.5"
              >
                {comparisonOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 pointer-events-none" />
          </div>
        </div>

        {/* Export Button */}
        <button
          type="button"
          onClick={onExportReport}
          className="inline-flex items-center gap-1.5 bg-[#007a48] hover:bg-[#00683d] text-white text-xs font-semibold px-3.5 py-2 rounded-lg shadow-xs transition-colors cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Xuất báo cáo</span>
        </button>
      </div>
    </div>
  )
}
