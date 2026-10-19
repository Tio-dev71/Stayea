"use client"

import { Ticket, Heart, CheckCircle2, Crown, ChevronRight } from "lucide-react"
import type { MyDealsMetrics } from "@/features/landing/data/stayea-mock-data"

interface MyDealsMetricsBarProps {
  readonly metrics: MyDealsMetrics
  readonly onNavigateToClub?: () => void
}

export function MyDealsMetricsBar({
  metrics,
  onNavigateToClub,
}: MyDealsMetricsBarProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Ưu đãi khả dụng */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 flex items-center gap-4 shadow-2xs">
        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
          <Ticket className="w-6 h-6 text-[#1E40AF]" />
        </div>
        <div>
          <span className="block text-xs text-slate-500 font-medium">
            Ưu đãi khả dụng
          </span>
          <span className="block text-2xl font-black text-[#0A2239] leading-tight">
            {metrics.availableCount}
          </span>
          <span className="block text-[11px] text-slate-400 mt-0.5 line-clamp-1">
            Voucher, mã giảm giá còn hiệu lực
          </span>
        </div>
      </div>

      {/* 2. Đã lưu */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 flex items-center gap-4 shadow-2xs">
        <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center shrink-0">
          <Heart className="w-6 h-6 text-rose-500 fill-rose-500/20" />
        </div>
        <div>
          <span className="block text-xs text-slate-500 font-medium">
            Đã lưu
          </span>
          <span className="block text-2xl font-black text-[#0A2239] leading-tight">
            {metrics.savedCount}
          </span>
          <span className="block text-[11px] text-slate-400 mt-0.5 line-clamp-1">
            Ưu đãi đã lưu để sử dụng sau
          </span>
        </div>
      </div>

      {/* 3. Đã sử dụng */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 flex items-center gap-4 shadow-2xs">
        <div className="w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-6 h-6 text-sky-600" />
        </div>
        <div>
          <span className="block text-xs text-slate-500 font-medium">
            Đã sử dụng
          </span>
          <span className="block text-2xl font-black text-[#0A2239] leading-tight">
            {metrics.usedCount}
          </span>
          <span className="block text-[11px] text-slate-400 mt-0.5 line-clamp-1">
            Ưu đãi đã được áp dụng
          </span>
        </div>
      </div>

      {/* 4. Điểm Staya Club */}
      <button
        type="button"
        onClick={onNavigateToClub}
        className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 flex items-center justify-between text-left shadow-2xs hover:border-slate-300 transition-all cursor-pointer group"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
            <Crown className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <span className="block text-xs text-slate-500 font-medium">
              Điểm Staya Club
            </span>
            <span className="block text-2xl font-black text-[#0A2239] leading-tight">
              {metrics.stayaClubPoints.toLocaleString("vi-VN")}
            </span>
            <span className="block text-[11px] text-slate-400 mt-0.5 line-clamp-1">
              Điểm tích lũy hiện tại
            </span>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-[#0A2239] group-hover:translate-x-0.5 transition-all shrink-0" />
      </button>
    </div>
  )
}
