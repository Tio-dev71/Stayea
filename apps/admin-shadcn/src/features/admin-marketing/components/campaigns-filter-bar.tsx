"use client"

import { useState } from "react"
import { Calendar, ChevronDown, SlidersHorizontal, Download } from "lucide-react"

interface CampaignsFilterBarProps {
  selectedChannel?: string
  selectedType?: string
  selectedStatus?: string
  dateRange?: string
  onChannelChange?: (channel: string) => void
  onTypeChange?: (type: string) => void
  onStatusChange?: (status: string) => void
  onDateRangeChange?: (range: string) => void
  onOpenAdvancedFilter?: () => void
  onExportReport?: () => void
}

export function CampaignsFilterBar({
  selectedChannel = "all",
  selectedType = "all",
  selectedStatus = "all",
  dateRange = "01/06/2024 - 31/08/2024",
  onChannelChange,
  onTypeChange,
  onStatusChange,
  onDateRangeChange,
  onOpenAdvancedFilter,
  onExportReport,
}: CampaignsFilterBarProps) {
  const [channel, setChannel] = useState(selectedChannel)
  const [type, setType] = useState(selectedType)
  const [status, setStatus] = useState(selectedStatus)
  const [currentDateRange, setCurrentDateRange] = useState(dateRange)

  return (
    <div className="bg-white border border-slate-200/85 rounded-2xl p-3 sm:p-3.5 shadow-2xs flex flex-wrap items-center justify-between gap-3">
      {/* Left controls: 3 dropdowns + 1 date range */}
      <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-0">
        {/* 1. Tất cả kênh */}
        <div className="relative">
          <select
            value={channel}
            aria-label="Lọc theo kênh"
            onChange={(e) => {
              setChannel(e.target.value)
              if (onChannelChange) onChannelChange(e.target.value)
            }}
            className="px-3 py-2 pr-7 bg-slate-50/90 border border-slate-200/90 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors appearance-none cursor-pointer outline-hidden"
          >
            <option value="all">Tất cả kênh</option>
            <option value="Facebook">Facebook</option>
            <option value="Google">Google</option>
            <option value="Instagram">Instagram</option>
            <option value="Zalo">Zalo</option>
            <option value="Email Marketing">Email Marketing</option>
            <option value="TikTok">TikTok</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* 2. Tất cả loại chiến dịch */}
        <div className="relative">
          <select
            value={type}
            aria-label="Lọc theo loại chiến dịch"
            onChange={(e) => {
              setType(e.target.value)
              if (onTypeChange) onTypeChange(e.target.value)
            }}
            className="px-3 py-2 pr-7 bg-slate-50/90 border border-slate-200/90 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors appearance-none cursor-pointer outline-hidden"
          >
            <option value="all">Tất cả loại chiến dịch</option>
            <option value="Quảng cáo trả phí">Quảng cáo trả phí</option>
            <option value="Google Ads">Google Ads</option>
            <option value="Nội dung mạng xã hội">Nội dung mạng xã hội</option>
            <option value="Zalo Official Account">Zalo Official Account</option>
            <option value="Email Marketing">Email Marketing</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* 3. Tất cả trạng thái */}
        <div className="relative">
          <select
            value={status}
            aria-label="Lọc theo trạng thái"
            onChange={(e) => {
              setStatus(e.target.value)
              if (onStatusChange) onStatusChange(e.target.value)
            }}
            className="px-3 py-2 pr-7 bg-slate-50/90 border border-slate-200/90 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors appearance-none cursor-pointer outline-hidden"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="running">Đang chạy</option>
            <option value="completed">Đã hoàn thành</option>
            <option value="paused">Tạm dừng</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* 4. Date range picker */}
        <div className="relative">
          <div className="flex items-center gap-2 px-3 py-2 bg-slate-50/90 border border-slate-200/90 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer">
            <Calendar className="w-4 h-4 text-slate-500 shrink-0" />
            <select
              value={currentDateRange}
              aria-label="Chọn khoảng thời gian"
              onChange={(e) => {
                setCurrentDateRange(e.target.value)
                if (onDateRangeChange) onDateRangeChange(e.target.value)
              }}
              className="bg-transparent appearance-none pr-5 outline-hidden cursor-pointer text-slate-800 text-xs font-semibold"
            >
              <option value="01/06/2024 - 31/08/2024">01/06/2024 - 31/08/2024</option>
              <option value="01/07/2024 - 30/09/2024">01/07/2024 - 30/09/2024</option>
              <option value="01/08/2024 - 31/10/2024">01/08/2024 - 31/10/2024</option>
              <option value="01/01/2024 - 31/12/2024">Cả năm 2024</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Right controls: Bộ lọc nâng cao & Xuất báo cáo */}
      <div className="flex items-center gap-2.5 shrink-0">
        <button
          type="button"
          onClick={onOpenAdvancedFilter}
          className="flex items-center gap-1.5 px-3 py-2 bg-white border border-[#007a48]/30 text-[#007a48] hover:bg-[#e6f5ef]/60 rounded-xl text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Bộ lọc nâng cao</span>
        </button>

        <button
          type="button"
          onClick={onExportReport}
          className="flex items-center gap-1.5 px-3 py-2 bg-white border border-[#007a48]/30 text-[#007a48] hover:bg-[#e6f5ef]/60 rounded-xl text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Xuất báo cáo</span>
        </button>
      </div>
    </div>
  )
}
