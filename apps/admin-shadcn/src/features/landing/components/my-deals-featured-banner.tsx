"use client"

import Image from "next/image"
import { Crown, ArrowRight } from "lucide-react"

interface MyDealsFeaturedBannerProps {
  readonly onExploreClick?: () => void
}

export function MyDealsFeaturedBanner({ onExploreClick }: MyDealsFeaturedBannerProps) {
  return (
    <div className="relative w-full h-[180px] sm:h-[200px] md:h-[220px] rounded-2xl overflow-hidden shadow-2xs select-none">
      {/* 1. Background Cover Photo */}
      <Image
        src="/deals/banner-deals.jpg"
        alt="Staya Club Combo Phú Quốc"
        fill
        unoptimized
        className="object-cover object-center"
      />

      {/* 2. Gradient Overlays for High Legibility */}
      <div className="absolute inset-0 bg-gradient-to-r from-sky-100/95 via-sky-50/85 to-transparent sm:w-2/3 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />

      {/* 3. Banner Content Stack */}
      <div className="relative z-10 w-full h-full p-6 sm:p-8 flex flex-col justify-center">
        <div className="flex items-center justify-between">
          {/* Left Text & CTA */}
          <div className="space-y-2 max-w-md">
            {/* Staya Club Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-xs border border-blue-200 shadow-2xs">
              <Crown className="w-3.5 h-3.5 text-blue-700" />
              <span className="text-xs font-bold text-blue-900">Staya Club</span>
            </div>

            {/* Main Title */}
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#0A2239] tracking-tight leading-tight">
              Giảm 15% combo Phú Quốc
            </h2>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm font-medium text-slate-700">
              Áp dụng cho lưu trú + trải nghiệm
            </p>

            {/* CTA Button */}
            <div className="pt-1">
              <button
                type="button"
                onClick={onExploreClick}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0A2239] hover:bg-[#071726] text-white text-xs sm:text-sm font-semibold transition-all shadow-sm active:scale-95 cursor-pointer"
              >
                <span>Xem ưu đãi</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Cursive Calligraphy */}
          <div className="hidden lg:flex flex-col items-end pr-6 text-white drop-shadow-md">
            <p
              className="text-2xl xl:text-3xl italic tracking-wide text-right leading-relaxed"
              style={{ fontFamily: 'Georgia, "Brush Script MT", cursive, serif' }}
            >
              Khám phá Phú Quốc
            </p>
            <p
              className="text-lg xl:text-xl italic text-sky-100 text-right"
              style={{ fontFamily: 'Georgia, "Brush Script MT", cursive, serif' }}
            >
              theo cách riêng của bạn
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
