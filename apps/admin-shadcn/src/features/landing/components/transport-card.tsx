"use client"

import * as React from "react"
import Image from "next/image"
import {
  Heart,
  Star,
  ArrowRight,
  Plane,
  Car,
  Bike,
  UserCheck,
  MapPin,
  Shield,
  Wifi,
  Key,
  Headphones,
  HardHat,
  Clock,
  Armchair,
  Briefcase,
  Infinity as InfinityIcon,
  Truck,
  Calendar,
  MessageSquare,
  Sparkles,
  Crown,
} from "lucide-react"
import type { TransportItem } from "@/features/landing/data/stayea-mock-data"

interface TransportCardProps {
  readonly item: TransportItem
  readonly onSelect?: (item: TransportItem) => void
}

function renderFeatureIcon(icon: string) {
  switch (icon) {
    case "car":
      return <Car className="w-3 h-3 text-slate-500 shrink-0" />
    case "shield":
      return <Shield className="w-3 h-3 text-slate-500 shrink-0" />
    case "wifi":
      return <Wifi className="w-3 h-3 text-slate-500 shrink-0" />
    case "key":
      return <Key className="w-3 h-3 text-slate-500 shrink-0" />
    case "headphones":
      return <Headphones className="w-3 h-3 text-slate-500 shrink-0" />
    case "hard-hat":
      return <HardHat className="w-3 h-3 text-slate-500 shrink-0" />
    case "user-check":
      return <UserCheck className="w-3 h-3 text-slate-500 shrink-0" />
    case "clock":
      return <Clock className="w-3 h-3 text-slate-500 shrink-0" />
    case "armchair":
      return <Armchair className="w-3 h-3 text-slate-500 shrink-0" />
    case "briefcase":
      return <Briefcase className="w-3 h-3 text-slate-500 shrink-0" />
    case "infinity":
      return <InfinityIcon className="w-3 h-3 text-slate-500 shrink-0" />
    case "truck":
      return <Truck className="w-3 h-3 text-slate-500 shrink-0" />
    case "calendar":
      return <Calendar className="w-3 h-3 text-slate-500 shrink-0" />
    case "message-square":
      return <MessageSquare className="w-3 h-3 text-slate-500 shrink-0" />
    case "sparkles":
      return <Sparkles className="w-3 h-3 text-slate-500 shrink-0" />
    case "crown":
      return <Crown className="w-3 h-3 text-slate-500 shrink-0" />
    default:
      return <Car className="w-3 h-3 text-slate-500 shrink-0" />
  }
}

function renderServiceIcon(serviceTypeId: string) {
  switch (serviceTypeId) {
    case "airport-transfer":
      return <Plane className="w-3 h-3 text-teal-600 shrink-0" />
    case "car-rental":
      return <Car className="w-3 h-3 text-teal-600 shrink-0" />
    case "motorbike-rental":
      return <Bike className="w-3 h-3 text-teal-600 shrink-0" />
    case "private-driver":
      return <UserCheck className="w-3 h-3 text-teal-600 shrink-0" />
    default:
      return <Car className="w-3 h-3 text-teal-600 shrink-0" />
  }
}

export function TransportCard({ item, onSelect }: TransportCardProps) {
  const [isFavorite, setIsFavorite] = React.useState(false)

  return (
    <div className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col h-full">
      {/* 1. Card Image Header */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
        <Image
          src={item.imageUrl}
          alt={item.title}
          fill
          unoptimized
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
        />

        {/* Top-left Promotional Badge */}
        {item.badge && (
          <div className="absolute top-2.5 left-2.5 z-10">
            <span
              className={`px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wide uppercase shadow-xs ${item.badge.bgClass}`}
            >
              {item.badge.text}
            </span>
          </div>
        )}

        {/* Top-right Heart Favorite Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            setIsFavorite(!isFavorite)
          }}
          className="absolute top-2.5 right-2.5 z-10 w-7 h-7 rounded-full bg-white/80 backdrop-blur-xs flex items-center justify-center text-slate-600 hover:text-rose-500 hover:bg-white transition-colors shadow-xs"
          aria-label="Lưu vào danh sách yêu thích"
        >
          <Heart
            className={`w-4 h-4 transition-transform active:scale-125 ${
              isFavorite ? "fill-rose-500 text-rose-500" : ""
            }`}
          />
        </button>
      </div>

      {/* 2. Card Content Body */}
      <div className="p-3.5 flex flex-col flex-grow justify-between gap-2.5">
        <div>
          {/* Title */}
          <h4 className="font-bold text-slate-900 text-xs sm:text-[13px] leading-snug group-hover:text-teal-700 transition-colors line-clamp-1 mb-1">
            {item.title}
          </h4>

          {/* Meta Line: Service Type | Location */}
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-1.5">
            <div className="flex items-center gap-1 min-w-0">
              {renderServiceIcon(item.serviceTypeId)}
              <span className="truncate">{item.serviceType}</span>
            </div>
            <span className="text-slate-300">|</span>
            <div className="flex items-center gap-1 min-w-0">
              <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
              <span className="truncate">{item.location}</span>
            </div>
          </div>

          {/* Short Description */}
          <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2 min-h-[32px]">
            {item.description}
          </p>
        </div>

        {/* Rating & Price */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1">
          {/* Star Rating */}
          <div className="flex items-center gap-1 shrink-0">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
            <span className="text-xs font-bold text-slate-800">{item.rating}</span>
            <span className="text-[10px] text-slate-400">({item.reviewsCount})</span>
          </div>

          {/* Price */}
          <div className="text-right">
            <span className="text-xs sm:text-[13px] font-bold text-slate-900 tracking-tight">
              {item.priceDisplay}
            </span>
            <span className="text-[10px] text-slate-500 ml-1">{item.priceUnit}</span>
          </div>
        </div>

        {/* 3 Feature Chips */}
        <div className="grid grid-cols-3 gap-1 pt-1 text-[10px] text-slate-500">
          {item.features.slice(0, 3).map((feat) => (
            <div
              key={feat.label}
              className="flex items-center gap-1 overflow-hidden"
              title={feat.label}
            >
              {renderFeatureIcon(feat.icon)}
              <span className="truncate">{feat.label}</span>
            </div>
          ))}
        </div>

        {/* Bottom CTA Button */}
        <button
          type="button"
          onClick={() => onSelect?.(item)}
          className="w-full mt-1 h-8 rounded-xl bg-[#0A2239] hover:bg-[#071626] text-white text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs active:scale-[0.99]"
        >
          <span>Xem chi tiết</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  )
}
