"use client"

import { ArrowRight } from "lucide-react"

interface FavoritesDiscoveryBannerProps {
  readonly onExploreClick: () => void
}

export function FavoritesDiscoveryBanner({
  onExploreClick,
}: FavoritesDiscoveryBannerProps) {
  return (
    <section className="bg-[#EDF4FB] border border-[#D5E5F5] rounded-2xl p-5 sm:p-6 shadow-2xs">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Left Info with Heart Icon */}
        <div className="flex items-center gap-3.5 sm:gap-4">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white shadow-2xs flex items-center justify-center shrink-0">
            <span className="text-xl sm:text-2xl leading-none select-none text-rose-500" role="img" aria-label="heart">
              ❤️
            </span>
          </div>

          <div className="space-y-0.5">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
              Khám phá thêm những trải nghiệm yêu thích khác
            </h3>
            <p className="text-xs sm:text-[13px] text-slate-500 leading-relaxed">
              Lưu lại các dịch vụ bạn quan tâm để dễ dàng so sánh và lên kế hoạch chuyến đi hoàn hảo.
            </p>
          </div>
        </div>

        {/* Right CTA Button */}
        <div className="shrink-0 self-end sm:self-center">
          <button
            type="button"
            onClick={onExploreClick}
            className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-xs sm:text-sm font-semibold shadow-2xs transition-all active:scale-95 group"
          >
            <span>Khám phá ngay</span>
            <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  )
}
