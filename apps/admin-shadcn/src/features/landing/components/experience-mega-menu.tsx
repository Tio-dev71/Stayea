"use client"

import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  ChevronRight,
  Ship,
  Palmtree,
  Glasses,
  Anchor,
  Sailboat,
  Utensils,
  Flower2,
  Compass,
  Sparkles,
  Leaf,
  MapPin,
  Heart,
} from "lucide-react"
import {
  EXPERIENCE_CATEGORIES,
  EXPERIENCE_MEGA_MENU_DATA,
} from "@/features/landing/data/stayea-mock-data"

function getExperienceIcon(iconName: string) {
  switch (iconName) {
    case "tour":
      return <Ship className="w-4 h-4 text-[#c69a58] shrink-0" />
    case "island":
      return <Palmtree className="w-4 h-4 text-[#c69a58] shrink-0" />
    case "snorkeling":
      return <Glasses className="w-4 h-4 text-[#c69a58] shrink-0" />
    case "diving":
      return <Anchor className="w-4 h-4 text-[#c69a58] shrink-0" />
    case "cruise":
      return <Sailboat className="w-4 h-4 text-[#c69a58] shrink-0" />
    case "food":
      return <Utensils className="w-4 h-4 text-[#c69a58] shrink-0" />
    case "spa":
      return <Flower2 className="w-4 h-4 text-[#c69a58] shrink-0" />
    case "activity":
      return <Compass className="w-4 h-4 text-[#c69a58] shrink-0" />
    default:
      return <Sparkles className="w-4 h-4 text-[#c69a58] shrink-0" />
  }
}

interface ExperienceMegaMenuProps {
  readonly onClose: () => void
  readonly onNavigate?: (item: string, category?: string) => void
}

export function ExperienceMegaMenu({ onClose, onNavigate }: ExperienceMegaMenuProps) {
  const { kicker, title, description, features, ctaText, banners } =
    EXPERIENCE_MEGA_MENU_DATA

  return (
    <div
      role="region"
      aria-label="Khám phá trải nghiệm menu"
      className="relative w-full max-w-[1380px] mx-auto bg-white rounded-3xl border border-slate-100 shadow-[0_25px_70px_rgba(0,0,0,0.18)] p-6 sm:p-8 lg:p-9 z-20 animate-in fade-in-0 zoom-in-95 duration-200"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* ========================================================= */}
        {/* 1. LEFT COLUMN: Intro, Highlights & CTA                   */}
        {/* ========================================================= */}
        <div className="lg:col-span-3 flex flex-col justify-between h-full relative pr-2">
          {/* Subtle tropical palm watermark background in bottom-left */}
          <div className="absolute -bottom-6 -left-6 w-48 h-48 opacity-[0.07] pointer-events-none select-none text-[#0c3b40]">
            <svg viewBox="0 0 200 200" fill="currentColor" className="w-full h-full">
              <path d="M100 190 C100 120, 140 80, 190 60 C140 75, 115 105, 105 130 C130 90, 160 50, 180 10 C145 35, 120 70, 105 105 C115 65, 130 30, 140 0 C115 25, 95 65, 95 100 C85 60, 75 25, 60 0 C70 30, 85 65, 95 105 C80 70, 55 35, 20 10 C40 50, 70 90, 95 130 C85 105, 60 75, 10 60 C60 80, 100 120, 100 190 Z" />
            </svg>
          </div>

          <div className="relative z-10">
            <span className="inline-block text-[11px] font-bold tracking-[0.2em] text-[#0c3b40] uppercase">
              {kicker}
            </span>

            <h3 className="font-sans text-2xl lg:text-[26px] font-bold text-[#0c3b40] leading-[1.18] mt-3 tracking-tight">
              {title.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h3>

            <p className="text-xs sm:text-[13px] text-slate-500 leading-relaxed mt-3 max-w-[270px]">
              {description}
            </p>

            {/* 3 Value Proposition Bullets */}
            <div className="space-y-3 mt-6 pt-5 border-t border-slate-100">
              {features.map((feat) => (
                <div key={feat.text} className="flex items-center gap-2.5 text-xs font-medium text-slate-700">
                  {feat.icon === "leaf" && <Leaf className="w-4 h-4 text-[#c69a58] shrink-0" />}
                  {feat.icon === "map-pin" && <MapPin className="w-4 h-4 text-[#c69a58] shrink-0" />}
                  {feat.icon === "heart" && <Heart className="w-4 h-4 text-[#c69a58] shrink-0" />}
                  <span>{feat.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Button */}
          <div className="relative z-10 mt-7">
            <Link
              href="/experience"
              onClick={(e) => {
                if (onNavigate) {
                  e.preventDefault()
                  onNavigate("Trải nghiệm")
                }
                onClose()
              }}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-slate-300 hover:border-slate-800 text-slate-800 text-xs font-semibold hover:bg-slate-50 transition-all shadow-sm group"
            >
              <span>{ctaText}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 2. MIDDLE COLUMN: 8 Experience Categories in 2x4 Grid     */}
        {/* ========================================================= */}
        <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 pt-1">
          {EXPERIENCE_CATEGORIES.map((item) => (
            <Link
              key={item.id}
              href={`/experience#${item.id}`}
              onClick={(e) => {
                if (onNavigate) {
                  e.preventDefault()
                  onNavigate("experience", item.id)
                }
                onClose()
              }}
              className="group flex items-center gap-3 p-1.5 rounded-2xl hover:bg-slate-50/90 transition-all"
            >
              {/* Thumbnail Image */}
              <div className="relative w-[76px] h-[58px] rounded-xl overflow-hidden shrink-0 shadow-sm border border-slate-100/80 bg-slate-100">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  sizes="80px"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Text Info */}
              <div className="flex-1 min-w-0 pr-1">
                <div className="flex items-center justify-between gap-1">
                  <div className="flex items-center gap-1.5 min-w-0 flex-wrap">
                    {getExperienceIcon(item.iconName)}
                    <span className="font-bold text-slate-900 text-[13px] truncate group-hover:text-[#0c3b40] transition-colors">
                      {item.title}
                    </span>
                    {item.badge && (
                      <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full shrink-0 bg-[#faeec7] text-[#9a6a1a]">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-800 group-hover:translate-x-0.5 transition-all shrink-0" />
                </div>
                <p className="text-[11px] text-slate-500 leading-tight mt-1 line-clamp-1">
                  {item.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* ========================================================= */}
        {/* 3. RIGHT COLUMN: 2 Visual Inspiration Banners             */}
        {/* ========================================================= */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {banners.map((banner) => (
            <Link
              key={banner.id}
              href="/experience"
              onClick={(e) => {
                if (onNavigate) {
                  e.preventDefault()
                  onNavigate("experience")
                }
                onClose()
              }}
              className="group relative h-[160px] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all block"
            >
              <Image
                src={banner.imageUrl}
                alt={banner.title}
                fill
                sizes="(max-width: 1024px) 100vw, 400px"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {/* Gradient Dark Overlay for Legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />

              {/* Content */}
              <div className="relative z-10 h-full p-4 flex flex-col justify-end">
                {banner.kicker && (
                  <span className="text-[10px] uppercase font-bold tracking-[0.16em] text-white/90 drop-shadow mb-1">
                    {banner.kicker}
                  </span>
                )}
                <div className="flex items-end justify-between gap-3">
                  <h4 className="text-[13px] sm:text-[14px] font-bold text-white leading-snug drop-shadow line-clamp-2">
                    {banner.title}
                  </h4>
                  <div className="w-8 h-8 rounded-full border border-white/50 flex items-center justify-center text-white shrink-0 group-hover:bg-white group-hover:text-[#0c3b40] group-hover:border-white transition-all shadow-sm">
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
