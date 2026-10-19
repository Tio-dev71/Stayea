"use client"

import { Crown, ArrowRight } from "lucide-react"

interface ProfileStayaClubBannerProps {
  readonly onExploreClub?: () => void
}

export function ProfileStayaClubBanner({ onExploreClub }: ProfileStayaClubBannerProps) {
  return (
    <div className="bg-[#EEF5FC] border border-[#D8E6F8] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
      {/* Crown Icon + Text */}
      <div className="flex items-center gap-4 text-center sm:text-left">
        <div className="w-12 h-12 rounded-xl bg-amber-100/70 text-amber-600 flex items-center justify-center shrink-0">
          <Crown className="w-7 h-7 fill-amber-500/20 text-amber-600" />
        </div>
        <div>
          <h3 className="font-bold text-slate-900 text-sm sm:text-base">
            Nâng tầm trải nghiệm cùng Staya Club
          </h3>
          <p className="text-xs text-slate-600 mt-0.5">
            Tận hưởng nhiều đặc quyền, ưu đãi và dịch vụ riêng dành cho thành viên.
          </p>
        </div>
      </div>

      {/* Action Button */}
      <div className="shrink-0">
        <button
          type="button"
          onClick={onExploreClub}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 hover:border-slate-400 text-slate-800 text-xs font-semibold shadow-2xs transition-all active:scale-95"
        >
          <span>Khám phá ngay</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-700" />
        </button>
      </div>
    </div>
  )
}
