"use client"

import Image from "next/image"
import { Crown, ArrowRight } from "lucide-react"

interface NewBookingHeaderAndPromoProps {
  readonly onExploreClub?: () => void
}

export function NewBookingHeaderAndPromo({
  onExploreClub,
}: NewBookingHeaderAndPromoProps) {
  return (
    <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
      {/* 1. Left: Page Heading & Subtitle */}
      <div className="space-y-1">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Đặt dịch vụ mới
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          Chọn dịch vụ bạn muốn đặt cho hành trình tiếp theo tại STAYEA.
        </p>
      </div>

      {/* 2. Right: Staya Club Member Promo Card */}
      <div className="relative overflow-hidden rounded-2xl border border-amber-200/90 bg-gradient-to-r from-[#FFFBF2] via-[#FFF6E9] to-[#FFF1D6] p-4 sm:p-5 shadow-xs flex items-center justify-between gap-4 min-w-[320px] sm:min-w-[420px] lg:max-w-[480px]">
        {/* Text & Button content */}
        <div className="space-y-2 z-10 max-w-[280px]">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-amber-500/10 text-amber-600">
              <Crown className="w-4 h-4 fill-amber-500 text-amber-600" />
            </span>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900">
              Ưu đãi thành viên Staya Club
            </h3>
          </div>
          <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed">
            Đặc quyền riêng, ưu đãi hấp dẫn và nhiều trải nghiệm độc quyền.
          </p>
          <div className="pt-1">
            <button
              type="button"
              onClick={onExploreClub}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-slate-800 bg-white hover:bg-slate-50 text-slate-900 text-xs font-semibold shadow-2xs transition-all active:scale-95"
            >
              <span>Khám phá ngay</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right side Gift Box Visual */}
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 shrink-0 overflow-hidden rounded-xl">
          <Image
            src="/about/conversion-club.jpg"
            alt="Staya Club Gift"
            fill
            unoptimized
            className="object-cover object-center transform hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-[#FFF6E9]/40 pointer-events-none" />
        </div>
      </div>
    </div>
  )
}
