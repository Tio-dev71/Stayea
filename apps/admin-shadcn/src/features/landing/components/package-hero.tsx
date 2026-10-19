"use client"

import Image from "next/image"
import Link from "next/link"
import {
  CalendarCheck,
  Tag,
  Headphones,
  Sparkles,
  CheckCircle2,
  MapPin,
  ArrowLeft,
} from "lucide-react"
import { PACKAGE_HERO_BADGES } from "@/features/landing/data/stayea-mock-data"

function getBadgeIcon(iconName: string) {
  switch (iconName) {
    case "calendar":
      return <CalendarCheck className="w-4 h-4 text-white shrink-0" />
    case "tag":
      return <Tag className="w-4 h-4 text-white shrink-0" />
    case "headset":
      return <Headphones className="w-4 h-4 text-white shrink-0" />
    case "sparkles":
      return <Sparkles className="w-4 h-4 text-white shrink-0" />
    case "check":
      return <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
    default:
      return <Sparkles className="w-4 h-4 text-white shrink-0" />
  }
}

export function PackageHero() {
  return (
    <section className="relative w-full overflow-hidden bg-slate-950 min-h-[360px] sm:min-h-[400px] lg:min-h-[440px]">
      {/* Edge-to-edge Tropical Archipelago Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src="/packages/hero-package-cropped.jpg"
          alt="Gói hành trình tuyệt vời tại Phú Quốc"
          fill
          priority
          unoptimized
          className="object-cover object-center"
        />
        {/* Coastal gradient overlays for typography contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-teal-950/85 via-teal-900/50 to-slate-900/40" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-teal-950/80 to-transparent" />
      </div>

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-7 sm:pt-9 lg:pt-10 pb-6 sm:pb-8 flex flex-col justify-between min-h-[360px] sm:min-h-[400px] lg:min-h-[440px]">
        {/* Top Kicker */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/90 hover:text-white text-xs font-semibold uppercase tracking-[0.2em] transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span>GÓI HÀNH TRÌNH</span>
          </Link>
        </div>

        {/* Main Title + Subtitle + Right Calligraphy */}
        <div className="my-auto py-4 sm:py-6 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <h1 className="font-sans text-3xl sm:text-4xl lg:text-[46px] font-bold text-white tracking-tight leading-[1.15] drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]">
              Những hành trình tuyệt vời<br />
              đang chờ bạn tại Phú Quốc
            </h1>
            <p className="text-white/95 text-xs sm:text-sm leading-relaxed max-w-xl drop-shadow-[0_1px_6px_rgba(0,0,0,0.85)]">
              Các gói hành trình được thiết kế sẵn, tối ưu thời gian, chi phí và trải nghiệm – để bạn chỉ cần xách vali lên và tận hưởng.
            </p>
          </div>

          {/* Right Signature & Pin */}
          <div className="text-right text-white select-none shrink-0 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
            <div className="font-script-vi text-3xl sm:text-4xl text-white/95 leading-tight -rotate-3">
              More Than A Trip ♡
            </div>
            <div className="mt-3 flex items-center justify-end gap-1.5 text-white/90">
              <MapPin className="w-3.5 h-3.5 text-teal-300 shrink-0" />
              <span className="font-brand text-xs sm:text-sm font-bold tracking-[0.22em] text-white">
                PHÚ QUỐC
              </span>
              <span className="text-[10px] uppercase tracking-[0.24em] font-medium text-white/80">
                · VIỆT NAM
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Feature Strip (5 Trust Badges) */}
        <div className="pt-5 border-t border-white/20">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {PACKAGE_HERO_BADGES.map((badge) => (
              <div
                key={badge.id}
                className="flex items-center gap-2.5 text-white/95 select-none bg-black/15 backdrop-blur-xs p-2 rounded-xl border border-white/10"
              >
                <div className="p-1.5 rounded-lg bg-white/15 shrink-0">
                  {getBadgeIcon(badge.iconName)}
                </div>
                <div className="min-w-0 leading-tight">
                  <div className="text-[12px] font-bold truncate">{badge.title}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
