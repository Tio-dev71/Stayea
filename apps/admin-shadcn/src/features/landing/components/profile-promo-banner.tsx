"use client"

import { Gift, ArrowRight } from "lucide-react"

interface ProfilePromoBannerProps {
  readonly onExploreDeals?: () => void
}

export function ProfilePromoBanner({ onExploreDeals }: ProfilePromoBannerProps) {
  return (
    <div className="bg-[#FFF9EE] border border-[#FDE68A] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
      {/* Left Icon + Text */}
      <div className="flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-xl bg-amber-100/80 text-amber-600 flex items-center justify-center shrink-0 shadow-2xs">
          <Gift className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-bold text-slate-900 text-sm sm:text-base">
            Còn nhiều ưu đãi dành riêng cho bạn!
          </h3>
          <p className="text-xs text-slate-600 mt-0.5">
            Khám phá các đặc quyền thành viên và nhận ưu đãi độc quyền từ STAYEA.
          </p>
        </div>
      </div>

      {/* Right Action Button */}
      <div className="shrink-0 self-end sm:self-auto">
        <button
          type="button"
          onClick={onExploreDeals}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 hover:border-slate-400 text-slate-800 text-xs font-semibold shadow-2xs transition-all active:scale-95"
        >
          <span>Xem ưu đãi</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-700" />
        </button>
      </div>
    </div>
  )
}
