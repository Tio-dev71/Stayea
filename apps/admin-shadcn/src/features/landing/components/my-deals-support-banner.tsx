"use client"

import { Headphones, ArrowRight } from "lucide-react"

interface MyDealsSupportBannerProps {
  readonly onContactSupport?: () => void
}

export function MyDealsSupportBanner({ onContactSupport }: MyDealsSupportBannerProps) {
  return (
    <div className="relative overflow-hidden bg-[#F0F7FF] border border-[#BFDBFE]/60 rounded-2xl p-5 sm:p-6 shadow-2xs mt-8">
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left Information */}
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
            <Headphones className="w-5 h-5 text-[#1E40AF]" />
          </div>
          <div>
            <h4 className="text-sm sm:text-base font-bold text-[#0A2239]">
              Cần hỗ trợ chọn ưu đãi phù hợp?
            </h4>
            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
              Đội ngũ STAYEA luôn sẵn sàng tư vấn và giúp bạn tìm ưu đãi tốt nhất cho chuyến đi tiếp theo.
            </p>
          </div>
        </div>

        {/* Right CTA */}
        <button
          type="button"
          onClick={onContactSupport}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#0A2239] hover:bg-[#071726] text-white text-xs sm:text-sm font-semibold transition-all shadow-sm active:scale-95 cursor-pointer shrink-0 self-start sm:self-auto"
        >
          <span>Liên hệ hỗ trợ</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Decorative Tropical Palm Tree Beach Watermark */}
      <div className="pointer-events-none absolute -bottom-3 -right-2 w-48 h-28 opacity-20 text-sky-500 select-none">
        <svg viewBox="0 0 200 120" fill="currentColor" className="w-full h-full">
          <path d="M0,110 Q50,105 100,110 T200,110 L200,120 L0,120 Z" opacity="0.4" />
          <path d="M0,115 Q60,112 120,115 T200,115 L200,120 L0,120 Z" opacity="0.6" />
          <ellipse cx="170" cy="115" rx="50" ry="12" />
          <path d="M165,115 Q158,80 148,50 Q145,50 143,51 Q154,82 161,115 Z" />
          <path d="M146,50 Q130,40 105,45 Q125,52 145,51 Z" />
          <path d="M147,49 Q135,30 115,22 Q130,38 146,50 Z" />
          <path d="M148,49 Q155,25 142,8 Q152,28 149,50 Z" />
          <path d="M149,50 Q170,30 185,25 Q170,42 149,51 Z" />
          <path d="M149,51 Q180,48 195,58 Q175,60 148,52 Z" />
        </svg>
      </div>
    </div>
  )
}
