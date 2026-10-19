"use client"

import Image from "next/image"
import Link from "next/link"
import {
  Sparkles,
  ShieldCheck,
  UserCheck,
  Heart,
  Globe,
  ArrowLeft,
} from "lucide-react"
import { EXPERIENCE_HERO_BADGES } from "@/features/landing/data/stayea-mock-data"

function getBadgeIcon(iconName: string) {
  switch (iconName) {
    case "leaf":
      return <Sparkles className="w-4 h-4 text-white shrink-0" />
    case "shield":
      return <ShieldCheck className="w-4 h-4 text-white shrink-0" />
    case "guide":
      return <UserCheck className="w-4 h-4 text-white shrink-0" />
    case "heart":
      return <Heart className="w-4 h-4 text-white shrink-0" />
    case "headset":
      return <Globe className="w-4 h-4 text-white shrink-0" />
    default:
      return <Sparkles className="w-4 h-4 text-white shrink-0" />
  }
}

export function ExperienceHero() {
  return (
    <section className="relative w-full overflow-hidden bg-slate-950 min-h-[360px] sm:min-h-[400px] lg:min-h-[440px]">
      {/* Edge-to-edge Underwater Image Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src="/experience/hero-underwater.png"
          alt="Khám phá trải nghiệm Phú Quốc"
          fill
          priority
          unoptimized
          className="object-cover object-center"
        />
        {/* Ocean gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-teal-950/85 via-teal-900/55 to-slate-900/40" />
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
            <span>TRẢI NGHIỆM PHÚ QUỐC</span>
          </Link>
        </div>

        {/* Main Title + Subtitle + Right Calligraphy */}
        <div className="my-auto py-4 sm:py-6 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <h1 className="font-sans text-3xl sm:text-4xl lg:text-[46px] font-bold text-white tracking-tight leading-[1.15] drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]">
              Khám phá nhiều hơn<br />
              một điểm đến
            </h1>
            <p className="text-white/95 text-xs sm:text-sm leading-relaxed max-w-xl drop-shadow-[0_1px_6px_rgba(0,0,0,0.85)]">
              Những trải nghiệm độc đáo, chân thực và đáng nhớ đang chờ bạn tại đảo ngọc Phú Quốc.
            </p>
          </div>

          {/* Right Signature & Logo */}
          <div className="text-right text-white select-none shrink-0 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
            <div className="font-script-vi text-3xl sm:text-4xl text-white/95 leading-tight -rotate-3">
              Good Experiences<br />
              Brighter You ♡
            </div>
            <div className="mt-3 flex flex-col items-end">
              <span className="font-brand text-xs sm:text-sm font-bold tracking-[0.22em] text-white">
                PHÚ QUỐC
              </span>
              <span className="text-[8px] uppercase tracking-[0.26em] font-semibold text-white/80">
                MORE THAN A STAY
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Feature Strip (5 Badges) */}
        <div className="pt-5 border-t border-white/20">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {EXPERIENCE_HERO_BADGES.map((badge) => (
              <div
                key={badge.id}
                className="flex items-center gap-2.5 text-white/95 select-none bg-black/15 backdrop-blur-xs p-2 rounded-xl border border-white/10"
              >
                <div className="p-1.5 rounded-lg bg-white/15 shrink-0">
                  {getBadgeIcon(badge.iconName)}
                </div>
                <div className="min-w-0 leading-tight">
                  <div className="text-[11.5px] font-bold truncate">{badge.title}</div>
                  {badge.subtitle && (
                    <div className="text-[10px] text-white/80 truncate mt-0.5">{badge.subtitle}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
