"use client"

import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  ChevronRight,
  PiggyBank,
  Star,
  Gift,
  Calendar,
  Crown,
  Clock,
  Tag,
  Bed,
  Briefcase,
  Sun,
  Users,
} from "lucide-react"
import {
  DEALS_CATEGORIES,
  DEALS_MEGA_MENU_DATA,
} from "@/features/landing/data/stayea-mock-data"

function getDealIcon(iconName: string) {
  switch (iconName) {
    case "calendar":
      return <Calendar className="w-4 h-4" />
    case "crown":
      return <Crown className="w-4 h-4" />
    case "clock":
      return <Clock className="w-4 h-4" />
    case "tag":
      return <Tag className="w-4 h-4" />
    case "hotel":
      return <Bed className="w-4 h-4" />
    case "briefcase":
      return <Briefcase className="w-4 h-4" />
    case "sun":
      return <Sun className="w-4 h-4" />
    case "users":
      return <Users className="w-4 h-4" />
    default:
      return <Tag className="w-4 h-4" />
  }
}

interface DealsMegaMenuProps {
  readonly onClose: () => void
}

export function DealsMegaMenu({ onClose }: DealsMegaMenuProps) {
  const { kicker, title, description, features, ctaText, ctaHref, banners } =
    DEALS_MEGA_MENU_DATA

  return (
    <div
      role="region"
      aria-label="Ưu đãi Stayea menu"
      className="relative w-full max-w-[1400px] mx-auto bg-white rounded-3xl border border-slate-100 shadow-[0_25px_70px_rgba(0,0,0,0.18)] p-5 sm:p-6 lg:p-7 z-20 animate-in fade-in-0 zoom-in-95 duration-200"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-7 items-start">
        {/* ========================================================= */}
        {/* 1. LEFT COLUMN: Kicker, Title, Description, Bullets & CTA  */}
        {/* ========================================================= */}
        <div className="lg:col-span-3 flex flex-col justify-between h-full relative pr-1">
          {/* Subtle tropical palm watermark background */}
          <div className="absolute -bottom-6 -left-6 w-48 h-48 opacity-[0.07] pointer-events-none select-none text-[#0c3b40]">
            <svg viewBox="0 0 200 200" fill="currentColor" className="w-full h-full">
              <path d="M100 190 C100 120, 140 80, 190 60 C140 75, 115 105, 105 130 C130 90, 160 50, 180 10 C145 35, 120 70, 105 105 C115 65, 130 30, 140 0 C115 25, 95 65, 95 100 C85 60, 75 25, 60 0 C70 30, 85 65, 95 105 C80 70, 55 35, 20 10 C40 50, 70 90, 95 130 C85 105, 60 75, 10 60 C60 80, 100 120, 100 190 Z" />
            </svg>
          </div>

          <div className="relative z-10">
            <span className="inline-block text-[11px] font-bold tracking-[0.2em] text-[#0c3b40] uppercase">
              {kicker}
            </span>

            <h3 className="font-sans text-2xl lg:text-[25px] font-bold text-[#0c3b40] leading-[1.18] mt-2.5 tracking-tight">
              {title.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h3>

            <p className="text-xs text-slate-500 leading-relaxed mt-2.5 max-w-[270px]">
              {description}
            </p>

            {/* 3 Value Proposition Bullets */}
            <div className="space-y-2.5 mt-5 pt-4 border-t border-slate-100">
              {features.map((feat) => (
                <div key={feat.text} className="flex items-center gap-2.5 text-xs font-medium text-slate-700">
                  {feat.icon === "piggy" && <PiggyBank className="w-4 h-4 text-[#c59b27] shrink-0" />}
                  {feat.icon === "star" && <Star className="w-4 h-4 text-[#c59b27] shrink-0" />}
                  {feat.icon === "gift" && <Gift className="w-4 h-4 text-[#c59b27] shrink-0" />}
                  <span>{feat.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Button */}
          <div className="relative z-10 mt-6">
            <Link
              href={ctaHref}
              onClick={onClose}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-slate-300 hover:border-slate-800 text-slate-800 text-xs font-semibold hover:bg-slate-50 transition-all shadow-xs group"
            >
              <span>{ctaText}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 2. MIDDLE COLUMN: 8 Deal Categories in 4x2 Grid            */}
        {/* ========================================================= */}
        <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-x-3.5 gap-y-3 pt-0.5">
          {DEALS_CATEGORIES.map((item) => (
            <Link
              key={item.id}
              href={`#${item.id}`}
              onClick={onClose}
              className="group flex items-center gap-2.5 p-1.5 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100"
            >
              {/* Left Square Thumbnail */}
              <div className="relative w-[50px] h-[50px] sm:w-[54px] sm:h-[54px] rounded-xl overflow-hidden bg-slate-100 shrink-0">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  sizes="60px"
                  unoptimized
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Right Content: Icon + Title + Subtitle + Chevron */}
              <div className="flex-1 min-w-0 pr-0.5">
                <div className="flex items-center justify-between gap-1">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <div className="text-[#c59b27] shrink-0">
                      {getDealIcon(item.iconName)}
                    </div>
                    <h4 className="text-[12.5px] sm:text-[13px] xl:text-[13.5px] font-bold text-slate-900 group-hover:text-[#0c3b40] transition-colors whitespace-nowrap">
                      {item.title}
                    </h4>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0c3b40] group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
                </div>
                <p className="text-[10px] sm:text-[10.5px] text-slate-500 leading-tight mt-0.5 line-clamp-1">
                  {item.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* ========================================================= */}
        {/* 3. RIGHT COLUMN: 2 Featured Inspiration Banners           */}
        {/* ========================================================= */}
        <div className="lg:col-span-4 flex flex-col gap-3.5">
          {banners.map((banner) => (
            <Link
              key={banner.id}
              href={banner.href}
              onClick={onClose}
              className="group relative h-[155px] sm:h-[162px] rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all block"
            >
              <Image
                src={banner.imageUrl}
                alt={banner.title}
                fill
                sizes="(max-width: 1024px) 100vw, 400px"
                unoptimized
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {/* Gradient Dark Overlay for Legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/15" />

              {/* Content */}
              <div className="relative z-10 h-full p-4 flex flex-col justify-end">
                {banner.kicker && (
                  <span className="text-[10px] uppercase font-bold tracking-[0.16em] text-white/90 drop-shadow mb-1">
                    {banner.kicker}
                  </span>
                )}
                <div className="flex items-end justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h4 className="text-[13px] sm:text-[14px] font-bold text-white leading-snug drop-shadow line-clamp-2">
                      {banner.title}
                    </h4>
                    {banner.subtitle ? (
                      <p className="text-[11px] text-slate-300 drop-shadow mt-1">
                        {banner.subtitle}
                      </p>
                    ) : null}
                  </div>
                  <div className="w-8 h-8 rounded-full border border-white/50 flex items-center justify-center text-white shrink-0 group-hover:bg-white group-hover:text-[#0c3b40] group-hover:border-white transition-all shadow-xs">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
