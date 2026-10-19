"use client"

import { Crown, ArrowRight } from "lucide-react"

interface AuthStayaClubBannerProps {
  readonly onLearnMore?: () => void
}

export function AuthStayaClubBanner({ onLearnMore }: AuthStayaClubBannerProps) {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 mt-8 sm:mt-10">
      <div className="rounded-2xl bg-[#EEF5FC] border border-[#DCE9F6] p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
        {/* Left Side: Crown & Content */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-200/80 flex items-center justify-center shrink-0">
            <Crown className="w-6 h-6 text-amber-600 fill-amber-500" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-[#0A2239] leading-tight">
              Tham gia Staya Club
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-snug">
              Tích điểm, nhận ưu đãi độc quyền, trải nghiệm nhiều hơn cùng STAYEA.
            </p>
          </div>
        </div>

        {/* Right Side: CTA Button */}
        <div className="w-full sm:w-auto shrink-0">
          <button
            type="button"
            onClick={onLearnMore}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 hover:text-slate-900 text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 shadow-2xs transition-all active:scale-[0.98]"
          >
            <span>Tìm hiểu ngay</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
