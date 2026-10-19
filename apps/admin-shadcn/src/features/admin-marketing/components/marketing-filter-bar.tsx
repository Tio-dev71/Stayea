"use client"

import { Calendar, ChevronDown, SlidersHorizontal, Download } from "lucide-react"

interface MarketingFilterBarProps {
  dateRange: string
  selectedChannel: string
  selectedType: string
  selectedStatus: string
  onDateRangeChange: (val: string) => void
  onChannelChange: (val: string) => void
  onTypeChange: (val: string) => void
  onStatusChange: (val: string) => void
  onOpenAdvancedFilter: () => void
  onExportFile: () => void
}

export function MarketingFilterBar({
  dateRange,
  selectedChannel,
  selectedType,
  selectedStatus,
  onDateRangeChange,
  onChannelChange,
  onTypeChange,
  onStatusChange,
  onOpenAdvancedFilter,
  onExportFile,
}: MarketingFilterBarProps) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-3 sm:p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
      {/* Left controls: date picker & 3 selects */}
      <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-0">
        {/* Date range picker */}
        <div className="relative">
          <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200/90 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer">
            <Calendar className="w-4 h-4 text-slate-500 shrink-0" />
            <select
              value={dateRange}
              aria-label="Chọn khoảng thời gian"
              onChange={(e) => onDateRangeChange(e.target.value)}
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

        {/* Channel select */}
        <div className="relative">
          <select
            value={selectedChannel}
            aria-label="Lọc theo kênh marketing"
            onChange={(e) => onChannelChange(e.target.value)}
            className="px-3 py-2 pr-7 bg-slate-50 border border-slate-200/90 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors appearance-none cursor-pointer outline-hidden"
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

        {/* Campaign type select */}
        <div className="relative">
          <select
            value={selectedType}
            aria-label="Lọc theo loại chiến dịch"
            onChange={(e) => onTypeChange(e.target.value)}
            className="px-3 py-2 pr-7 bg-slate-50 border border-slate-200/90 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors appearance-none cursor-pointer outline-hidden"
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

        {/* Status select */}
        <div className="relative">
          <select
            value={selectedStatus}
            aria-label="Lọc theo trạng thái chiến dịch"
            onChange={(e) => onStatusChange(e.target.value)}
            className="px-3 py-2 pr-7 bg-slate-50 border border-slate-200/90 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors appearance-none cursor-pointer outline-hidden"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="running">Đang chạy</option>
            <option value="scheduled">Đã lên lịch</option>
            <option value="paused">Tạm dừng</option>
            <option value="ended">Đã kết thúc</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Right controls: Advanced filter & Export button */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={onOpenAdvancedFilter}
          className="flex items-center gap-1.5 px-3 py-2 bg-[#e6f7f0] border border-[#007a48]/25 text-[#007a48] rounded-xl text-xs font-semibold hover:bg-[#d8f3e5] transition-colors cursor-pointer"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Bộ lọc nâng cao</span>
        </button>

        <button
          type="button"
          onClick={onExportFile}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-200/80 transition-colors cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-slate-600" />
          <span>Xuất file</span>
        </button>
      </div>
    </div>
  )
}
