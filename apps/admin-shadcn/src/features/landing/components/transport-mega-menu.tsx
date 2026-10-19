"use client"

import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  ChevronRight,
  Plane,
  Shield,
  Diamond,
} from "lucide-react"
import {
  TRANSPORT_CATEGORIES,
  TRANSPORT_MEGA_MENU_DATA,
} from "@/features/landing/data/stayea-mock-data"

/* Authentic Gold Stroke Icons matching the Reference Design */
function AirportPlaneIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3.5c-.5-.5-2.5 0-4 1.5L13.5 8.5 5.3 6.7c-.7-.2-1.4.1-1.8.7l-.5.8c-.3.5-.2 1.2.3 1.5l6.5 4.5L7 17l-2.2-.4c-.4-.1-.8.1-1.1.4l-.4.4c-.3.4-.2 1 .2 1.3l3.2 2.5 2.5 3.2c.3.4.9.5 1.3.2l.4-.4c.3-.3.5-.7.4-1.1L11 21l2.8-2.8 4.5 6.5c.3.5 1 .6 1.5.3l.8-.5c.6-.4.9-1.1.7-1.8l-1.8-8.2z" />
    </svg>
  )
}

function CarRentalIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9C2.1 11.2 2 11.6 2 12v4c0 .6.4 1 1 1h2" />
      <circle cx="7" cy="17" r="2" />
      <path d="M9 17h6" />
      <circle cx="17" cy="17" r="2" />
    </svg>
  )
}

function ScooterIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="6" cy="17.5" r="2.5" />
      <circle cx="18" cy="17.5" r="2.5" />
      <path d="M6 15h6.5l2.2-7h3.3" />
      <path d="M15 8h4.5" />
      <path d="M10 15v-2.5a1.5 1.5 0 0 1 1.5-1.5h2" />
      <path d="M5.5 12a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
    </svg>
  )
}

function ChauffeurIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Peaked driver cap visor and crown */}
      <path d="M5 8h14l-1.5-3.5a1 1 0 0 0-.9-.5H7.4a1 1 0 0 0-.9.5L5 8z" />
      <path d="M3 8.5h18" />
      {/* Driver Head */}
      <circle cx="12" cy="12.5" r="3" />
      {/* Suit and collar */}
      <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
      <path d="M10.5 15.5 12 18l1.5-2.5" />
    </svg>
  )
}

function getTransportIcon(iconName: string) {
  switch (iconName) {
    case "plane-takeoff":
      return <AirportPlaneIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[#c59b27] shrink-0" />
    case "car":
      return <CarRentalIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[#c59b27] shrink-0" />
    case "bike":
      return <ScooterIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[#c59b27] shrink-0" />
    case "chauffeur":
      return <ChauffeurIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[#c59b27] shrink-0" />
    default:
      return <CarRentalIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[#c59b27] shrink-0" />
  }
}

interface TransportMegaMenuProps {
  readonly onClose: () => void
}

export function TransportMegaMenu({ onClose }: TransportMegaMenuProps) {
  const { kicker, title, description, features, ctaText, ctaHref, banners } =
    TRANSPORT_MEGA_MENU_DATA

  return (
    <div
      role="region"
      aria-label="Khám phá di chuyển menu"
      className="relative w-full max-w-[1380px] mx-auto bg-white rounded-3xl border border-slate-100 shadow-[0_25px_70px_rgba(0,0,0,0.18)] p-5 sm:p-6 lg:p-7 z-20 animate-in fade-in-0 zoom-in-95 duration-200"
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
                  {feat.icon === "plane" && <Plane className="w-4 h-4 text-[#c59b27] shrink-0" />}
                  {feat.icon === "shield" && <Shield className="w-4 h-4 text-[#c59b27] shrink-0" />}
                  {feat.icon === "diamond" && <Diamond className="w-4 h-4 text-[#c59b27] shrink-0" />}
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
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-slate-300 hover:border-slate-800 text-slate-800 text-xs font-semibold hover:bg-slate-50 transition-all shadow-sm group"
            >
              <span>{ctaText}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 2. MIDDLE COLUMN: 4 Transport Categories in 2x2 Grid      */}
        {/* ========================================================= */}
        <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-0.5">
          {TRANSPORT_CATEGORIES.map((item) => (
            <Link
              key={item.id}
              href={`#${item.id}`}
              onClick={onClose}
              className="group flex flex-col rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md hover:border-teal-200 transition-all bg-white"
            >
              {/* Top Landscape Image */}
              <div className="relative w-full h-[120px] sm:h-[130px] overflow-hidden bg-slate-100">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 300px"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Bottom Info Bar: Icon + Title/Subtitle + Chevron */}
              <div className="p-3 sm:p-3.5 flex items-center justify-between gap-2.5 bg-white">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="text-[#c59b27] shrink-0">
                    {getTransportIcon(item.iconName)}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-[13px] sm:text-sm font-bold text-slate-900 group-hover:text-[#0c3b40] transition-colors truncate">
                      {item.title}
                    </h4>
                    <p className="text-[10.5px] sm:text-[11px] text-slate-500 leading-tight mt-0.5 line-clamp-1">
                      {item.description}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#0c3b40] group-hover:translate-x-0.5 transition-all shrink-0" />
              </div>
            </Link>
          ))}
        </div>

        {/* ========================================================= */}
        {/* 3. RIGHT COLUMN: 2 Visual Inspiration Banners             */}
        {/* ========================================================= */}
        <div className="lg:col-span-4 flex flex-col gap-3.5">
          {banners.map((banner) => (
            <Link
              key={banner.id}
              href={banner.href}
              onClick={onClose}
              className="group relative h-[155px] sm:h-[162px] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all block"
            >
              <Image
                src={banner.imageUrl}
                alt={banner.title}
                fill
                sizes="(max-width: 1024px) 100vw, 400px"
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
                  <div>
                    <h4 className="text-[13px] sm:text-[14px] font-bold text-white leading-snug drop-shadow line-clamp-2">
                      {banner.title}
                    </h4>
                    <p className="text-[11px] text-slate-300 drop-shadow mt-1">
                      {banner.subtitle}
                    </p>
                  </div>
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
