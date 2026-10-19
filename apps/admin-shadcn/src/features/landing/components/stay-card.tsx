"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Heart,
  Star,
  ArrowRight,
  Crown,
  ShieldCheck,
  Flame,
  Calendar,
  Tag,
  Users,
  Waves,
  Utensils,
  Sparkles,
  TreePine,
  Coffee,
  Armchair,
  Laptop,
  Check,
} from "lucide-react"
import type { StayAccommodationItem } from "@/features/landing/data/stayea-mock-data"

interface StayCardProps {
  readonly item: StayAccommodationItem
  readonly isListView?: boolean
}

function getBadgeElement(badge: StayAccommodationItem["badge"]) {
  if (!badge) return null

  switch (badge.variant) {
    case "select":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#0c3b40]/90 text-white backdrop-blur-xs shadow-xs">
          <Crown className="w-2.5 h-2.5 text-amber-400" />
          <span>{badge.text}</span>
        </span>
      )
    case "verified":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/90 text-white backdrop-blur-xs shadow-xs">
          <ShieldCheck className="w-2.5 h-2.5" />
          <span>{badge.text}</span>
        </span>
      )
    case "bestseller":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-600/90 text-white backdrop-blur-xs shadow-xs">
          <Flame className="w-2.5 h-2.5" />
          <span>{badge.text}</span>
        </span>
      )
    case "longstay":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#0c3b40]/90 text-white backdrop-blur-xs shadow-xs">
          <Calendar className="w-2.5 h-2.5" />
          <span>{badge.text}</span>
        </span>
      )
    case "bestprice":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600/90 text-white backdrop-blur-xs shadow-xs">
          <Tag className="w-2.5 h-2.5" />
          <span>{badge.text}</span>
        </span>
      )
    case "family":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-600/90 text-white backdrop-blur-xs shadow-xs">
          <Users className="w-2.5 h-2.5" />
          <span>{badge.text}</span>
        </span>
      )
    default:
      return null
  }
}

function getAmenityIcon(iconName: string) {
  switch (iconName) {
    case "pool":
      return <Waves className="w-3 h-3 text-sky-600" />
    case "beach":
      return <Waves className="w-3 h-3 text-teal-600" />
    case "kitchen":
      return <Utensils className="w-3 h-3 text-amber-600" />
    case "spa":
      return <Sparkles className="w-3 h-3 text-rose-500" />
    case "restaurant":
      return <Utensils className="w-3 h-3 text-orange-500" />
    case "green":
    case "garden":
      return <TreePine className="w-3 h-3 text-emerald-600" />
    case "furniture":
      return <Armchair className="w-3 h-3 text-indigo-500" />
    case "work":
      return <Laptop className="w-3 h-3 text-blue-600" />
    case "breakfast":
      return <Coffee className="w-3 h-3 text-amber-600" />
    default:
      return <Check className="w-3 h-3 text-slate-500" />
  }
}

export function StayCard({ item, isListView = false }: StayCardProps) {
  const [isFavorited, setIsFavorited] = React.useState(false)

  if (isListView) {
    return (
      <div className="group flex flex-col sm:flex-row rounded-2xl overflow-hidden bg-white border border-slate-100 hover:border-slate-200 shadow-xs hover:shadow-md transition-all duration-300">
        <div className="relative w-full sm:w-64 h-48 shrink-0 overflow-hidden bg-slate-100">
          <Image
            src={item.imageUrl}
            alt={item.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, 256px"
          />
          {item.badge && <div className="absolute top-2.5 left-2.5 z-10">{getBadgeElement(item.badge)}</div>}
          <button
            type="button"
            onClick={() => setIsFavorited(!isFavorited)}
            className="absolute top-2.5 right-2.5 z-10 p-1.5 rounded-full bg-black/35 hover:bg-black/55 backdrop-blur-xs text-white transition-colors"
            aria-label="Wishlist"
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorited ? "fill-rose-500 text-rose-500" : ""}`} />
          </button>
          <div className="absolute bottom-2.5 left-2.5 z-10 flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-white text-[11px] font-semibold">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>{item.rating.toFixed(1)}</span>
            <span className="text-white/70 font-normal">({item.reviewsCount})</span>
          </div>
        </div>

        <div className="p-4 flex-1 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-[15px] text-slate-900 group-hover:text-[#0c3b40] transition-colors leading-snug">
              {item.title}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">{item.type} · {item.location}</p>
            <div className="flex flex-wrap items-center gap-2 mt-3">
              {item.amenities.map((am) => (
                <span key={am.label} className="inline-flex items-center gap-1 text-[11px] text-slate-600 bg-slate-50 px-2 py-0.5 rounded-md">
                  {getAmenityIcon(am.icon)}
                  <span>{am.label}</span>
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 mt-2 border-t border-slate-100">
            <div>
              <span className="font-bold text-slate-900 text-base">{item.formattedPrice}</span>
              <span className="text-xs text-slate-500 font-normal"> / đêm</span>
            </div>
            <Link
              href={`#details-${item.id}`}
              className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-[#0c3b40] hover:bg-[#072528] text-white text-xs font-semibold shadow-xs transition-all active:scale-95"
            >
              <span>Xem chi tiết</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="group flex flex-col rounded-2xl overflow-hidden bg-white border border-slate-100 hover:border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)] transition-all duration-300">
      {/* 1. Image Container with Top Badge + Wishlist + Bottom Rating */}
      <div className="relative aspect-[16/11] w-full overflow-hidden bg-slate-100">
        <Image
          src={item.imageUrl}
          alt={item.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
        />

        {/* Top-left Badge */}
        {item.badge && (
          <div className="absolute top-2.5 left-2.5 z-10 pointer-events-none">
            {getBadgeElement(item.badge)}
          </div>
        )}

        {/* Top-right Heart Wishlist */}
        <button
          type="button"
          onClick={() => setIsFavorited(!isFavorited)}
          className="absolute top-2.5 right-2.5 z-10 p-1.5 rounded-full bg-black/30 hover:bg-black/55 backdrop-blur-xs text-white transition-all active:scale-90"
          aria-label="Wishlist"
        >
          <Heart
            className={`w-3.5 h-3.5 transition-colors ${
              isFavorited ? "fill-rose-500 text-rose-500" : "text-white"
            }`}
          />
        </button>

        {/* Bottom-left Rating Badge */}
        <div className="absolute bottom-2 left-2 z-10 flex items-center gap-1 px-2 py-0.5 rounded-lg bg-black/60 backdrop-blur-xs text-white text-[11px] font-semibold shadow-xs">
          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          <span>{item.rating.toFixed(1)}</span>
          <span className="text-white/70 font-normal">({item.reviewsCount})</span>
        </div>
      </div>

      {/* 2. Content Body */}
      <div className="p-3 sm:p-3.5 flex-1 flex flex-col justify-between">
        <div>
          {/* Title */}
          <h3 className="font-bold text-[14px] text-slate-900 group-hover:text-[#0c3b40] transition-colors line-clamp-1 leading-snug">
            {item.title}
          </h3>

          {/* Subtitle / Type & Location */}
          <p className="text-[11.5px] text-slate-500 mt-0.5 line-clamp-1">
            {item.type} · {item.location}
          </p>

          {/* Amenities Row with Icons */}
          <div className="flex items-center gap-2 mt-2.5 text-[10.5px] text-slate-600 overflow-hidden flex-nowrap">
            {item.amenities.map((am) => (
              <span key={am.label} className="inline-flex items-center gap-1 shrink-0">
                {getAmenityIcon(am.icon)}
                <span className="truncate max-w-[85px]">{am.label}</span>
              </span>
            ))}
          </div>
        </div>

        {/* 3. Footer Row: Price + CTA Button */}
        <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100">
          <div>
            <span className="font-bold text-slate-900 text-[13.5px] sm:text-[14px]">
              {item.formattedPrice}
            </span>
            <span className="text-[11px] text-slate-500 font-normal"> / đêm</span>
          </div>

          <Link
            href={`#details-${item.id}`}
            className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-lg bg-[#0c3b40] hover:bg-[#072528] text-white text-[11px] font-semibold shadow-xs transition-all active:scale-95"
          >
            <span>Xem chi tiết</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  )
}
