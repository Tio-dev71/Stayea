"use client"

import * as React from "react"
import Image from "next/image"
import {
  Clock,
  Building,
  Shield,
  Coffee,
  Car,
  User,
  Utensils,
  Flower2,
  Fish,
  Sparkles,
  Star,
  Heart,
  ArrowRight,
} from "lucide-react"
import type { PackageListingItem } from "@/features/landing/data/stayea-mock-data"

interface PackageCardProps {
  readonly item: PackageListingItem
  readonly isWishlisted?: boolean
  readonly onToggleWishlist?: (id: string) => void
  readonly viewMode?: "grid" | "list"
  readonly onSelect?: () => void
}

function getHighlightIcon(iconName: PackageListingItem["highlightIcon"]) {
  switch (iconName) {
    case "building":
      return <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
    case "shield":
      return <Shield className="w-3.5 h-3.5 text-slate-400 shrink-0" />
    case "coffee":
      return <Coffee className="w-3.5 h-3.5 text-slate-400 shrink-0" />
    case "car":
      return <Car className="w-3.5 h-3.5 text-slate-400 shrink-0" />
    case "user":
      return <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
    case "utensils":
      return <Utensils className="w-3.5 h-3.5 text-slate-400 shrink-0" />
    case "spa":
      return <Flower2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
    case "fish":
      return <Fish className="w-3.5 h-3.5 text-slate-400 shrink-0" />
    case "food":
      return <Utensils className="w-3.5 h-3.5 text-slate-400 shrink-0" />
    case "activity":
      return <Sparkles className="w-3.5 h-3.5 text-slate-400 shrink-0" />
    default:
      return <Sparkles className="w-3.5 h-3.5 text-slate-400 shrink-0" />
  }
}

function getTagBadgeColor(color: PackageListingItem["tagColor"]) {
  switch (color) {
    case "emerald":
      return "bg-emerald-600 text-white"
    case "rose":
      return "bg-rose-600 text-white"
    case "blue":
      return "bg-blue-600 text-white"
    case "cyan":
      return "bg-cyan-600 text-white"
    case "sky":
      return "bg-sky-600 text-white"
    case "amber":
      return "bg-amber-600 text-white"
    case "indigo":
      return "bg-indigo-700 text-white"
    case "slate":
      return "bg-slate-800 text-white"
    default:
      return "bg-[#0c3b40] text-white"
  }
}

export function PackageCard({
  item,
  isWishlisted = false,
  onToggleWishlist,
  viewMode = "grid",
  onSelect,
}: PackageCardProps) {
  const [internalWishlist, setInternalWishlist] = React.useState(isWishlisted)

  function handleHeartClick(e: React.MouseEvent) {
    e.stopPropagation()
    e.preventDefault()
    setInternalWishlist(!internalWishlist)
    onToggleWishlist?.(item.id)
  }

  // LIST VIEW LAYOUT
  if (viewMode === "list") {
    return (
      <div role="button" tabIndex={0} onClick={onSelect} onKeyDown={(e) => { if (e.key === "Enter") onSelect?.() }} className="group cursor-pointer bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all overflow-hidden flex flex-col sm:flex-row gap-4 p-3.5">
        {/* Left Thumbnail Image */}
        <div className="relative w-full sm:w-64 h-48 sm:h-auto rounded-xl overflow-hidden shrink-0">
          <Image
            src={item.imageUrl}
            alt={item.title}
            fill
            sizes="(max-width: 640px) 100vw, 256px"
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
          {/* Top-left category tag badge */}
          <span
            className={`absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide shadow-xs ${getTagBadgeColor(
              item.tagColor
            )}`}
          >
            {item.tag}
          </span>
          {/* Wishlist Heart */}
          <button
            type="button"
            onClick={handleHeartClick}
            aria-label="Lưu vào danh sách yêu thích"
            className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-black/30 backdrop-blur-xs flex items-center justify-center text-white hover:bg-black/50 transition-colors"
          >
            <Heart
              className={`w-3.5 h-3.5 transition-colors ${
                internalWishlist
                  ? "fill-rose-500 text-rose-500"
                  : "text-white"
              }`}
            />
          </button>
        </div>

        {/* Right Info Section */}
        <div className="flex-1 flex flex-col justify-between py-1">
          <div className="space-y-2">
            <h3 className="font-sans text-base sm:text-lg font-bold text-slate-900 group-hover:text-[#0c3b40] transition-colors">
              {item.title}
            </h3>

            {/* Metadata (Duration + Highlight) */}
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{item.duration}</span>
              </div>
              <div className="flex items-center gap-1.5">
                {getHighlightIcon(item.highlightIcon)}
                <span>{item.highlight}</span>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1.5 text-xs">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />
              <span className="font-bold text-slate-800">{item.rating}</span>
              <span className="text-slate-500">({item.reviewsCount})</span>
            </div>
          </div>

          {/* Price & CTA Button */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-3">
            <div>
              <div className="text-base sm:text-lg font-bold text-[#0c3b40]">
                {item.formattedPrice}
              </div>
            </div>
            <button
              type="button"
              onClick={onSelect}
              aria-label={`Xem chi tiết ${item.title}`}
              className="w-9 h-9 rounded-full bg-[#0c3b40] hover:bg-[#072528] text-white flex items-center justify-center shadow-xs transition-transform active:scale-95 group-hover:scale-105"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  // DEFAULT GRID VIEW LAYOUT (Matches 4-column design)
  return (
    <div role="button" tabIndex={0} onClick={onSelect} onKeyDown={(e) => { if (e.key === "Enter") onSelect?.() }} className="group cursor-pointer bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_10px_28px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-200 overflow-hidden flex flex-col justify-between">
      <div>
        {/* Card Image Container */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
          <Image
            src={item.imageUrl}
            alt={item.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />

          {/* Floating Category Tag Badge */}
          <span
            className={`absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide shadow-xs ${getTagBadgeColor(
              item.tagColor
            )}`}
          >
            {item.tag}
          </span>

          {/* Wishlist Heart */}
          <button
            type="button"
            onClick={handleHeartClick}
            aria-label="Lưu vào danh sách yêu thích"
            className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-black/30 backdrop-blur-xs flex items-center justify-center text-white hover:bg-black/50 transition-colors"
          >
            <Heart
              className={`w-3.5 h-3.5 transition-colors ${
                internalWishlist
                  ? "fill-rose-500 text-rose-500"
                  : "text-white"
              }`}
            />
          </button>
        </div>

        {/* Card Content */}
        <div className="p-3.5 sm:p-4 space-y-2">
          {/* Title */}
          <h3 className="font-sans text-sm sm:text-base font-bold text-slate-900 group-hover:text-[#0c3b40] transition-colors line-clamp-1">
            {item.title}
          </h3>

          {/* Metadata Row: Duration + Highlight */}
          <div className="flex items-center gap-3 text-[11.5px] text-slate-500">
            <div className="flex items-center gap-1 shrink-0">
              <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{item.duration}</span>
            </div>
            <div className="flex items-center gap-1 truncate">
              {getHighlightIcon(item.highlightIcon)}
              <span className="truncate">{item.highlight}</span>
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1.5 text-xs pt-0.5">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />
            <span className="font-bold text-slate-800">{item.rating}</span>
            <span className="text-slate-500">({item.reviewsCount})</span>
          </div>
        </div>
      </div>

      {/* Card Footer: Price & Circular Arrow Button */}
      <div className="px-3.5 sm:px-4 pb-3.5 sm:pb-4 pt-1 flex items-center justify-between border-t border-slate-50">
        <div className="text-sm sm:text-base font-bold text-[#0c3b40]">
          {item.formattedPrice}
        </div>
        <button
          type="button"
          onClick={onSelect}
          aria-label={`Xem chi tiết ${item.title}`}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#0c3b40] hover:bg-[#072528] text-white text-[11px] font-semibold shadow-xs transition-transform active:scale-95 group-hover:scale-105"
        >
          <span>Xem chi tiết</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  )
}
