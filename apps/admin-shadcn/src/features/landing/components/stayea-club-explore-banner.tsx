"use client"

import React from "react"
import Image from "next/image"
import { ArrowRight, Sparkles } from "lucide-react"

export interface StayeaClubExploreBannerProps {
  readonly onExploreClick?: () => void
}

export const StayeaClubExploreBanner: React.FC<StayeaClubExploreBannerProps> = ({
  onExploreClick,
}) => {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200/90 shadow-2xs min-h-[96px] flex items-center bg-gradient-to-r from-sky-100 via-sky-50 to-blue-50/40">
      {/* Background Tropical Resort Image */}
      <div className="absolute inset-0 z-0 opacity-45 pointer-events-none">
        <Image
          src="/stay/verified-resort.jpg"
          alt="Khám phá đặc quyền Stayea Club"
          fill
          unoptimized
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/70 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full px-5 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="hidden sm:flex w-10 h-10 rounded-xl bg-amber-100/90 text-amber-700 items-center justify-center shrink-0 shadow-2xs">
            <Sparkles className="w-5 h-5 fill-amber-500/20" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-[#0A2239]">
              Mời bạn khám phá thêm đặc quyền Stayea Club
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Nhiều ưu đãi hấp dẫn, trải nghiệm độc quyền và quà tặng đặc biệt đang chờ bạn
            </p>
          </div>
        </div>

        <div className="shrink-0 w-full sm:w-auto">
          <button
            type="button"
            onClick={onExploreClick}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#0A2239] hover:bg-[#071726] text-white text-xs sm:text-sm font-semibold shadow-2xs transition-all active:scale-95 cursor-pointer"
          >
            <span>Khám phá ngay</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
