"use client"

import Image from "next/image"
import { ArrowRight, Crown, Shield, Gift, Headphones, Plane } from "lucide-react"

interface DealsPromoBannerProps {
  readonly onExploreClick?: () => void
  readonly onJoinClubClick?: () => void
}

export function DealsPromoBanner({
  onExploreClick,
  onJoinClubClick,
}: DealsPromoBannerProps) {
  return (
    <section className="w-full mb-10 grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
      {/* 1. Left Large Promotional Banner (~8/12 width) */}
      <div className="lg:col-span-8 relative overflow-hidden rounded-2xl bg-slate-900 text-white min-h-[260px] p-6 sm:p-8 flex flex-col justify-between shadow-sm">
        {/* Background Image: Phu Quoc Beach with Plane in Sky */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/deals/banner-deals.jpg"
            alt="Khám phá Phú Quốc Tiết kiệm hơn cùng STAYEA"
            fill
            unoptimized
            className="object-cover object-center"
          />
          {/* Subtle gradient to ensure text readability */}
          <div className="absolute inset-0 bg-linear-to-r from-[#031B33]/90 via-[#0A2E4D]/75 to-transparent" />
        </div>

        {/* Top-Left Red Ribbon Badge */}
        <div className="relative z-10 self-start mb-4">
          <span className="inline-block bg-[#E50914] text-white text-[11px] font-black uppercase px-3.5 py-1 rounded-sm shadow-md tracking-wider">
            ƯU ĐÃI ĐẶC BIỆT
          </span>
        </div>

        {/* Content & Call to Action */}
        <div className="relative z-10 max-w-md space-y-2">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white leading-tight tracking-tight drop-shadow">
            Khám phá Phú Quốc <br />
            Tiết kiệm hơn cùng STAYEA
          </h2>
          <p className="text-xs sm:text-sm text-slate-200 font-medium drop-shadow-xs">
            Du lịch chất lượng – Giá tốt mỗi ngày
          </p>

          <div className="pt-3">
            <button
              type="button"
              onClick={onExploreClick}
              className="h-10 px-5 rounded-xl bg-[#0A2239] hover:bg-[#071626] border border-white/20 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-[0.99]"
            >
              <span>Xem ưu đãi ngay</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Decorative Airplane with Contrail Trail */}
        <div className="hidden md:flex items-center absolute right-36 top-10 z-10 pointer-events-none select-none">
          <div className="relative">
            <svg className="w-20 h-10 text-white/70" viewBox="0 0 100 50" fill="none">
              <path d="M5 45 C30 40, 50 25, 80 15" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
            </svg>
            <div className="absolute right-0 top-0 rotate-[-25deg] text-white drop-shadow">
              <Plane className="w-5 h-5 fill-white" />
            </div>
          </div>
        </div>

        {/* Right Starburst Sticker: GIẢM ĐẾN 50% */}
        <div className="hidden sm:flex absolute right-6 md:right-10 top-1/2 -translate-y-1/2 z-10 flex-col items-center justify-center w-28 h-28 md:w-32 md:h-32 rounded-full bg-[#FFD000] border-4 border-white shadow-xl rotate-[-5deg] text-center select-none transform hover:rotate-0 transition-transform">
          <span className="text-[11px] font-black text-slate-900 tracking-wider uppercase leading-none">
            GIẢM ĐẾN
          </span>
          <span className="text-3xl md:text-4xl font-black text-[#E50914] leading-none my-0.5">
            50%
          </span>
        </div>
      </div>

      {/* 2. Right Widget: Staya Club Card (~4/12 width) */}
      <div className="lg:col-span-4 bg-[#FFF9F0] border border-[#FDE6C8] rounded-2xl p-6 flex flex-col justify-between shadow-2xs">
        <div>
          {/* Header */}
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
              <Crown className="w-5 h-5 fill-amber-500 text-amber-600" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 leading-tight">
                Staya Club
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Thành viên nhận thêm ưu đãi
              </p>
            </div>
          </div>

          {/* Benefits List */}
          <div className="mt-4 space-y-2.5">
            <div className="flex items-center gap-2.5 text-xs text-slate-700 font-medium">
              <Shield className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Giảm giá độc quyền</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-700 font-medium">
              <Gift className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Tích điểm đổi quà</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-700 font-medium">
              <Headphones className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Ưu tiên hỗ trợ 24/7</span>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="mt-6">
          <button
            type="button"
            onClick={onJoinClubClick}
            className="w-full h-10 rounded-xl bg-[#0A2239] hover:bg-[#071626] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors active:scale-[0.99]"
          >
            <span>Tham gia ngay</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  )
}
