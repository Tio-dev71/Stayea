"use client"

import Image from "next/image"
import { SearchWidget } from "./search-widget"
import { TRUST_BADGES } from "@/features/landing/data/stayea-mock-data"
import { ShieldCheck, Tag, Star, Headphones } from "lucide-react"

function getBadgeIcon(iconName: string) {
  switch (iconName) {
    case "diamond":
    case "shield":
      return <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-[#e8c783] drop-shadow shrink-0" />
    case "tag":
      return <Tag className="w-5 h-5 sm:w-6 sm:h-6 text-[#e8c783] drop-shadow shrink-0" />
    case "star":
      return <Star className="w-5 h-5 sm:w-6 sm:h-6 text-[#e8c783] drop-shadow shrink-0" />
    case "headset":
      return <Headphones className="w-5 h-5 sm:w-6 sm:h-6 text-[#e8c783] drop-shadow shrink-0" />
    default:
      return <Star className="w-5 h-5 sm:w-6 sm:h-6 text-[#e8c783] drop-shadow shrink-0" />
  }
}

interface StayeaHeroProps {
  readonly onNavigate?: (item: string, subCategory?: string) => void
}

export function StayeaHero({ onNavigate }: StayeaHeroProps = {}) {
  return (
    <section className="relative z-20 w-full overflow-visible bg-slate-900 min-h-[660px] sm:min-h-[720px] lg:min-h-[780px] flex flex-col justify-between">
      {/* Full-width Edge-to-Edge Background Image */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <Image
          src="/homepagemainbanner.png"
          alt="Khám phá Phú Quốc theo cách của bạn"
          fill
          priority
          unoptimized
          className="object-cover object-center"
        />
        {/* Balanced cinematic gradient overlays for crystal clear contrast and text legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/35 to-black/75" />
        <div className="absolute inset-0 bg-radial-[at_center] from-transparent via-black/20 to-black/60" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
      </div>

      {/* Foreground Content Container - 1440px Grid */}
      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 lg:pt-10 pb-8 sm:pb-10 flex-1 flex flex-col justify-between w-full">
        {/* ========================================================= */}
        {/* 1. ASYMMETRICAL CORNER ACCENTS                            */}
        {/*    Left: Shifted noticeably down, tilted -3deg, no dash   */}
        {/*    Right: High top corner handwritten postcard note       */}
        {/* ========================================================= */}
        <div className="w-full flex items-start justify-between gap-4 select-none">
          {/* Left: Noticeably lower down, tilted, organic human feel */}
          <div className="flex flex-col items-start mt-12 sm:mt-16 lg:mt-20 -rotate-3 hover:rotate-0 transition-transform duration-300">
            <span className="font-serif italic text-sm sm:text-base lg:text-[17px] font-medium text-[#f5dfa8] tracking-wide drop-shadow-md">
              Hơn cả một chuyến đi
            </span>
            <span className="text-[9.5px] sm:text-[10px] font-semibold tracking-[0.2em] uppercase text-white/70 drop-shadow mt-0.5">
              Đảo Ngọc Phú Quốc
            </span>
          </div>

          {/* Right: High at top-right, floating naturally over palm tree canopy */}
          <div className="flex flex-col items-end text-right text-[#f5dfa8] drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)] -rotate-2 hover:rotate-0 transition-transform duration-300 pt-1">
            <span className="font-script-vi text-2xl sm:text-3xl lg:text-[34px] leading-none text-[#f5dfa8] drop-shadow">
              Phú Quốc
            </span>
            <span className="font-script-vi text-lg sm:text-2xl lg:text-[26px] mt-0.5 text-[#f5dfa8] drop-shadow">
              Chờ bạn khám phá ♡
            </span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 2. MAIN CENTER HERO CONTENT: Headline + Search Widget     */}
        {/* ========================================================= */}
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto w-full space-y-3.5 sm:space-y-4 my-auto pt-1 sm:pt-2">
          {/* Centered Main Headline */}
          <h1 className="font-sans text-3xl sm:text-4xl lg:text-[50px] font-bold leading-[1.16] text-white tracking-tight drop-shadow-[0_3px_16px_rgba(0,0,0,0.9)] max-w-3xl">
            Khám phá Phú Quốc
            <br className="hidden sm:inline" />{" "}
            theo cách của bạn
          </h1>

          {/* Subtitle */}
          <p className="text-white/95 text-xs sm:text-sm sm:text-[14.5px] font-normal leading-relaxed max-w-xl drop-shadow-[0_1px_6px_rgba(0,0,0,0.85)]">
            Lưu trú tuyệt vời · Trải nghiệm đáng nhớ · Những khoảnh khắc ý nghĩa.
            <br className="hidden sm:inline" />
            {" "}Tất cả trong một hành trình cùng STAYEA.
          </p>

          {/* Centered Search Widget (Bảng Khám Phá) */}
          <div className="w-full max-w-[880px] pt-2 sm:pt-3 relative z-30">
            <SearchWidget onNavigate={onNavigate} />
          </div>
        </div>

        {/* ========================================================= */}
        {/* 3. BOTTOM: 4 TRUST BADGES Floating over Crystal Water     */}
        {/* ========================================================= */}
        <div className="pt-6 sm:pt-8 border-t border-white/15 w-full">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {TRUST_BADGES.map((badge) => (
              <div
                key={badge.id}
                className="flex items-center gap-2.5 sm:gap-3 group select-none bg-black/25 backdrop-blur-xs p-2.5 sm:p-3 rounded-xl border border-white/10 hover:border-white/25 transition-all"
              >
                <div className="shrink-0 transition-transform group-hover:scale-110 duration-200">
                  {getBadgeIcon(badge.iconName)}
                </div>
                <div className="min-w-0">
                  <h4 className="text-[12px] sm:text-[13px] font-bold text-white drop-shadow leading-snug truncate">
                    {badge.title}
                  </h4>
                  <p className="text-[10px] sm:text-[11px] text-white/85 drop-shadow leading-tight mt-0.5 truncate">
                    {badge.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
