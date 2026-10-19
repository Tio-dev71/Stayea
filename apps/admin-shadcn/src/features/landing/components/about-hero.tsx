"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Leaf, MapPin, Heart } from "lucide-react"
import { ABOUT_PAGE_DATA } from "@/features/landing/data/stayea-mock-data"

export function AboutHero() {
  const { hero } = ABOUT_PAGE_DATA

  return (
    <section className="relative w-full overflow-hidden bg-slate-900 min-h-[580px] sm:min-h-[640px] lg:min-h-[700px] flex items-center">
      {/* Full-width Background Pool & Bay Image */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src="/homepagemainbanner.png"
          alt="Về Stayea - Hơn cả một nơi lưu trú"
          fill
          priority
          unoptimized
          className="object-cover object-center"
        />
        {/* Subtle Dark Gradient Overlay for optimal contrast & luminous water */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-black/30" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      </div>

      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 w-full flex flex-col justify-between min-h-[580px] sm:min-h-[640px] lg:min-h-[700px]">
        {/* Top & Middle: Main Hero Message */}
        <div className="max-w-3xl space-y-4 pt-4 sm:pt-6">
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.24em] text-white/90 drop-shadow">
            {hero.kicker}
          </span>

          <h1 className="font-sans text-3xl sm:text-4xl lg:text-[44px] font-bold text-white tracking-tight leading-[1.18] drop-shadow">
            STAYEA – Hơn cả một nơi lưu trú,
            <span className="block mt-1">là cách bạn khám phá Phú Quốc</span>
            <span className="block mt-1">tinh tế hơn</span>
          </h1>

          <p className="text-xs sm:text-sm lg:text-[15px] text-white/90 leading-relaxed max-w-2xl font-normal drop-shadow">
            {hero.description}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-4">
            <Link
              href="#story"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white hover:bg-slate-100 text-[#0c3b40] text-xs sm:text-sm font-bold shadow-md transition-all hover:gap-3 group"
            >
              <span>{hero.ctaPrimary}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <Link
              href="#contact"
              className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-white/70 hover:border-white text-white hover:bg-white/10 text-xs sm:text-sm font-semibold transition-all backdrop-blur-xs"
            >
              {hero.ctaSecondary}
            </Link>
          </div>

          {/* 3 Value Propositions */}
          <div className="flex flex-wrap items-center gap-5 sm:gap-7 pt-4 text-xs sm:text-[13px] font-medium text-white/95">
            <div className="flex items-center gap-2 drop-shadow">
              <Leaf className="w-4 h-4 text-[#e8c783]" />
              <span>Tinh tuyển điểm đến</span>
            </div>
            <div className="flex items-center gap-2 drop-shadow">
              <MapPin className="w-4 h-4 text-[#e8c783]" />
              <span>Trải nghiệm đáng nhớ</span>
            </div>
            <div className="flex items-center gap-2 drop-shadow">
              <Heart className="w-4 h-4 text-[#e8c783]" />
              <span>Hành trình dễ dàng hơn</span>
            </div>
          </div>
        </div>

        {/* Bottom Right: Cursive Script & Location Pin */}
        <div className="flex justify-end items-end pt-8">
          <div className="text-right space-y-1">
            <div className="font-serif italic text-2xl sm:text-3xl text-[#e8c783] drop-shadow font-normal">
              More Than a Stay
            </div>
            <div className="flex items-center justify-end gap-1.5 text-xs font-semibold text-white drop-shadow">
              <MapPin className="w-3.5 h-3.5 text-[#e8c783]" />
              <span>{hero.location}</span>
            </div>
            <p className="text-[10.5px] text-white/80 drop-shadow">
              {hero.locationSub}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
