"use client"

import { useState } from "react"
import { Calendar, ChevronDown, Plus } from "lucide-react"

interface CampaignsHeaderProps {
  onDateRangeChange?: (range: string) => void
  onCreateCampaign?: () => void
}

export function CampaignsHeader({
  onDateRangeChange,
  onCreateCampaign,
}: CampaignsHeaderProps) {
  const [dateRange, setDateRange] = useState("01/06/2024 - 31/08/2024")

  const handleSelectDate = (range: string) => {
    setDateRange(range)
    if (onDateRangeChange) {
      onDateRangeChange(range)
    }
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-1">
      {/* Title & Subtitle */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Báo cáo Chiến dịch Marketing
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Theo dõi hiệu quả từng chiến dịch, tối ưu chi phí và tăng trưởng cho Stayea.
        </p>
      </div>

      {/* Action controls */}
      <div className="flex flex-wrap items-center gap-2.5 shrink-0">
        {/* Date range picker */}
        <div className="relative">
          <div className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200/90 rounded-xl text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition-colors cursor-pointer">
            <Calendar className="w-4 h-4 text-slate-500 shrink-0" />
            <select
              value={dateRange}
              aria-label="Chọn khoảng thời gian"
              onChange={(e) => handleSelectDate(e.target.value)}
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

        {/* Primary "+ Tạo chiến dịch mới" button */}
        <button
          type="button"
          onClick={onCreateCampaign}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-[#007a48] hover:bg-[#00683d] text-white rounded-xl text-xs font-semibold shadow-xs hover:shadow-md transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tạo chiến dịch mới</span>
        </button>
      </div>
    </div>
  )
}
