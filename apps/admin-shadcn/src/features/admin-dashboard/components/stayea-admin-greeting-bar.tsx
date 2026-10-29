"use client"

import { Calendar, ChevronDown } from "lucide-react"

interface StayeaAdminGreetingBarProps {
  adminName?: string
  dateRange?: string
  onDateRangeClick?: () => void
  onCreateNew?: () => void
}

export function StayeaAdminGreetingBar({
  adminName = "Quản trị viên",
  dateRange = "21/04/2025 - 27/04/2025",
  onDateRangeClick,
  onCreateNew,
}: StayeaAdminGreetingBarProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
      {/* Left: Greeting Title & Subtitle */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <span>Chào mừng, {adminName}!</span>
          <span className="inline-block text-xl sm:text-2xl">👋</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
          Cùng Stayea kiến tạo những hành trình đáng nhớ tại Phú Quốc và hơn thế nữa.
        </p>
      </div>

      {/* Right: Date Range Selector & Create New Button */}
      <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
        {/* Date Filter */}
        <button
          type="button"
          onClick={onDateRangeClick}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 shadow-xs transition-all whitespace-nowrap shrink-0"
        >
          <Calendar className="w-4 h-4 text-slate-500 shrink-0" />
          <span className="whitespace-nowrap">{dateRange}</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        </button>

        {/* Primary Action Button: Tạo mới */}
        <button
          type="button"
          onClick={onCreateNew}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1b7a4e] hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs sm:text-sm font-semibold shadow-xs transition-all"
        >
          <span>Tạo mới</span>
          <ChevronDown className="w-3.5 h-3.5 text-emerald-200" />
        </button>
      </div>
    </div>
  )
}
