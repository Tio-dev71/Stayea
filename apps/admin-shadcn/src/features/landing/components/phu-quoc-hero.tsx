"use client"

import Image from "next/image"
import Link from "next/link"
import {
  BookOpen,
  MapPin,
  FileText,
  Heart,
  ChevronRight,
} from "lucide-react"
import { PHU_QUOC_HERO_BADGES } from "@/features/landing/data/stayea-mock-data"

function getBadgeIcon(iconName: string) {
  switch (iconName) {
    case "book":
      return <BookOpen className="w-4 h-4 text-white shrink-0" />
    case "pin":
      return <MapPin className="w-4 h-4 text-white shrink-0" />
    case "note":
      return <FileText className="w-4 h-4 text-white shrink-0" />
    case "heart":
      return <Heart className="w-4 h-4 text-white shrink-0" />
    default:
      return <BookOpen className="w-4 h-4 text-white shrink-0" />
  }
}

export function PhuQuocHero() {
  return (
    <section className="relative w-full overflow-hidden bg-slate-950 min-h-[340px] sm:min-h-[380px] lg:min-h-[400px]">
      {/* Background Image */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src="/phu-quoc/hero-phu-quoc.jpg"
          alt="Khám phá Phú Quốc từ A-Z"
          fill
          priority
          unoptimized
          className="object-cover object-center"
        />
        {/* Coastal gradient overlays for crisp readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-teal-950/85 via-teal-900/50 to-slate-900/40" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-teal-950/80 to-transparent" />
      </div>

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-6 flex flex-col justify-between min-h-[340px] sm:min-h-[380px] lg:min-h-[400px]">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-white/80 select-none">
          <Link href="/" className="hover:text-white transition-colors">
            Trang chủ
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-white/60" />
          <span className="text-white font-medium">Khám phá Phú Quốc</span>
        </nav>

        {/* Main Title + Subtitle + Right Script Accent */}
        <div className="my-auto py-3 sm:py-5 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-2xl space-y-2.5">
            <h1 className="font-sans text-3xl sm:text-4xl lg:text-[44px] font-bold text-white tracking-tight leading-[1.18] drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]">
              Khám phá Phú Quốc
            </h1>
            <p className="text-white/95 text-xs sm:text-sm leading-relaxed max-w-xl drop-shadow-[0_1px_6px_rgba(0,0,0,0.85)]">
              Cảm hứng, kinh nghiệm và những câu chuyện tuyệt vời về đảo ngọc từ A-Z
            </p>
          </div>

          {/* Right Signature & Script */}
          <div className="text-right text-white select-none shrink-0 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
            <div className="font-brand text-xs sm:text-sm font-bold tracking-[0.22em] text-white/90">
              Phú Quốc
            </div>
            <div className="font-script-vi text-2xl sm:text-3xl text-white/95 leading-tight -rotate-2 mt-1">
              More Than A Destination,<br />
              A Feeling ♡
            </div>
          </div>
        </div>

        {/* Bottom Feature Bar (4 Badges) */}
        <div className="pt-4 border-t border-white/20">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5">
            {PHU_QUOC_HERO_BADGES.map((badge) => (
              <div
                key={badge.id}
                className="flex items-center gap-2.5 text-white/95 select-none bg-black/15 backdrop-blur-xs px-3 py-2 rounded-xl border border-white/10"
              >
                <div className="p-1.5 rounded-lg bg-white/15 shrink-0">
                  {getBadgeIcon(badge.iconName)}
                </div>
                <div className="text-[12px] font-semibold truncate">{badge.title}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
