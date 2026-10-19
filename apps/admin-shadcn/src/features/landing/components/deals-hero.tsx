"use client"

import Image from "next/image"
import { Tag, Gift, ShieldCheck, Headphones, Crown, ChevronRight } from "lucide-react"
import { DEALS_HERO_BADGES } from "@/features/landing/data/stayea-mock-data"

export function DealsHero() {
  return (
    <section className="relative w-full pt-28 pb-14 lg:pt-32 lg:pb-16 overflow-hidden bg-slate-900 text-white">
      {/* Background Image: Scenic Tropical Bay in Phu Quoc */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/deals/hero-deals.jpg"
          alt="Ưu đãi Phú Quốc"
          fill
          unoptimized
          priority
          className="object-cover object-center scale-105"
        />
        {/* Soft Coastal Blue Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-r from-[#07243F]/90 via-[#0A365C]/75 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-slate-950/40" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-slate-300 font-medium mb-3">
          <a href="#home" className="hover:text-white transition-colors">
            Trang chủ
          </a>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-white font-semibold">Ưu đãi</span>
        </div>

        {/* Content & Calligraphy */}
        <div className="relative max-w-3xl">
          {/* Main Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight tracking-tight mb-2 drop-shadow-md">
            Ưu đãi Phú Quốc
          </h1>
          <div className="text-base sm:text-lg md:text-xl font-bold text-teal-200 mb-3 drop-shadow-xs">
            Ưu đãi đặc biệt – Trải nghiệm trọn vẹn hơn
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm md:text-base text-slate-200 max-w-2xl font-normal leading-relaxed drop-shadow-xs">
            Khám phá các chương trình ưu đãi hấp dẫn cho vé máy bay, tàu cao tốc, thuê xe, xe đưa đón, khách sạn và tour trải nghiệm tại Phú Quốc cùng STAYEA.
          </p>
        </div>

        {/* Right Cursive Calligraphy */}
        <div className="hidden lg:block absolute right-8 top-10 text-right pointer-events-none select-none">
          <p
            className="italic text-3xl xl:text-4xl text-white/90 leading-tight drop-shadow-md"
            style={{ fontFamily: 'Georgia, "Brush Script MT", cursive, serif' }}
          >
            More
            <br />
            Than a Trip ♡
          </p>
        </div>

        {/* 5 Frosted Value Badges */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3">
          {DEALS_HERO_BADGES.map((badge) => {
            return (
              <div
                key={badge.label}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 text-white shadow-xs hover:bg-white/20 transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-teal-500/20 border border-teal-300/30 flex items-center justify-center shrink-0 text-teal-300">
                  {badge.icon === "tag" && <Tag className="w-3.5 h-3.5" />}
                  {badge.icon === "gift" && <Gift className="w-3.5 h-3.5" />}
                  {badge.icon === "shield-check" && <ShieldCheck className="w-3.5 h-3.5" />}
                  {badge.icon === "headphones" && <Headphones className="w-3.5 h-3.5" />}
                  {badge.icon === "crown" && <Crown className="w-3.5 h-3.5" />}
                </div>
                <span className="text-[11px] font-semibold leading-tight line-clamp-2">
                  {badge.label}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
