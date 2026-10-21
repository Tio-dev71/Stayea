"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Heart,
  Star,
  Clock,
  ArrowRight,
  Car,
  Package,
  GlassWater,
  MapPin,
  Waves,
  User,
  Hotel,
  Bus,
} from "lucide-react"
import type { ExperienceListingItem } from "@/features/landing/data/stayea-mock-data"

interface ExperienceCardProps {
  readonly item: ExperienceListingItem
  readonly onSelect?: () => void
}

function getHighlightIcon(iconName: string) {
  switch (iconName) {
    case "car":
      return <Car className="w-3 h-3 text-slate-500 shrink-0" />
    case "package":
      return <Package className="w-3 h-3 text-slate-500 shrink-0" />
    case "cocktail":
      return <GlassWater className="w-3 h-3 text-slate-500 shrink-0" />
    case "map-pin":
      return <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
    case "diving":
      return <Waves className="w-3 h-3 text-slate-500 shrink-0" />
    case "user":
      return <User className="w-3 h-3 text-slate-500 shrink-0" />
    case "hotel":
      return <Hotel className="w-3 h-3 text-slate-500 shrink-0" />
    case "bus":
      return <Bus className="w-3 h-3 text-slate-500 shrink-0" />
    default:
      return <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
  }
}

export function ExperienceCard({ item, onSelect }: ExperienceCardProps) {
  const [isFavorited, setIsFavorited] = React.useState(false)

  return (
    <div role="button" tabIndex={0} onClick={onSelect} onKeyDown={(e) => { if (e.key === "Enter") onSelect?.() }} className="group cursor-pointer flex flex-col rounded-2xl overflow-hidden bg-white border border-slate-100 hover:border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)] transition-all duration-300">
      {/* 1. Image Header */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
        <Image
          src={item.imageUrl}
          alt={item.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
        />

        {/* Top-left Tag Badge */}
        <div className="absolute top-2.5 left-2.5 z-10 pointer-events-none">
          <span className="inline-block px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold bg-black/60 text-white backdrop-blur-xs shadow-xs">
            {item.tag}
          </span>
        </div>

        {/* Top-right Heart Wishlist */}
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); setIsFavorited(!isFavorited); }}
          className="absolute top-2.5 right-2.5 z-10 p-1.5 rounded-full bg-black/30 hover:bg-black/55 backdrop-blur-xs text-white transition-all active:scale-90"
          aria-label="Wishlist"
        >
          <Heart
            className={`w-3.5 h-3.5 transition-colors ${
              isFavorited ? "fill-rose-500 text-rose-500" : "text-white"
            }`}
          />
        </button>
      </div>

      {/* 2. Content Body */}
      <div className="p-3.5 flex-1 flex flex-col justify-between">
        <div>
          {/* Title */}
          <h3 className="font-bold text-[14px] text-slate-900 group-hover:text-[#0c3b40] transition-colors line-clamp-1 leading-snug">
            {item.title}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 mt-1 text-[11.5px] text-slate-600 font-medium">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400 shrink-0" />
            <span className="font-bold text-slate-800">{item.rating.toFixed(1)}</span>
            <span className="text-slate-400">({item.reviewsCount})</span>
          </div>

          {/* Description */}
          <p className="text-[11.5px] text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
            {item.description}
          </p>

          {/* Meta Info Row: Duration + Highlight */}
          <div className="flex items-center gap-3 mt-3 text-[11px] text-slate-600">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400 shrink-0" />
              <span>{item.duration}</span>
            </div>
            <div className="flex items-center gap-1">
              {getHighlightIcon(item.highlightIcon)}
              <span className="truncate max-w-[120px]">{item.highlight}</span>
            </div>
          </div>
        </div>

        {/* 3. Footer Row: Price + Circle Arrow Button */}
        <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100">
          <div>
            <span className="font-bold text-slate-900 text-[14px]">
              {item.formattedPrice}
            </span>
          </div>

          <Link
            href={`#experience-${item.id}`} onClick={(e) => { if (onSelect) { e.preventDefault(); onSelect(); } }}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#0c3b40] hover:bg-[#072528] text-white text-[11px] font-semibold shadow-xs transition-all group-hover:scale-105 active:scale-95"
            aria-label={`Xem chi tiết ${item.title}`}
          >
            <span>Xem chi tiết</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  )
}
