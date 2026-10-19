"use client"

import React from "react"
import Image from "next/image"
import { Check, Heart, Calendar, Copy, Plane } from "lucide-react"
import type { StayeaClubClaimedOfferDetails } from "@/features/landing/data/stayea-mock-data"

export interface StayeaClubClaimedOfferHeroProps {
  readonly offer: StayeaClubClaimedOfferDetails
  readonly onCopyCode: (code: string) => void
  readonly onUseNow?: () => void
  readonly onViewFlights?: () => void
  readonly onToggleFavorite?: () => void
}

export const StayeaClubClaimedOfferHero: React.FC<StayeaClubClaimedOfferHeroProps> = ({
  offer,
  onCopyCode,
  onUseNow,
  onViewFlights,
  onToggleFavorite,
}) => {
  const [isFavorited, setIsFavorited] = React.useState(false)

  function handleFavorite() {
    setIsFavorited(!isFavorited)
    onToggleFavorite?.()
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left Column: Image with badges (Col 5) */}
        <div className="md:col-span-5 relative w-full h-52 sm:h-60 rounded-xl overflow-hidden bg-slate-100 shadow-2xs">
          <Image
            src={offer.imageUrl}
            alt={offer.title}
            fill
            unoptimized
            priority
            className="object-cover object-center"
          />

          {/* Top-left: "✓ Đã nhận" badge */}
          <div className="absolute top-3 left-3 z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/95 text-emerald-700 shadow-2xs border border-emerald-100 backdrop-blur-xs">
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Đã nhận</span>
            </span>
          </div>

          {/* Top-right: Heart Favorite button */}
          <button
            type="button"
            onClick={handleFavorite}
            className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/95 hover:bg-white flex items-center justify-center shadow-2xs border border-slate-100 transition-colors cursor-pointer"
            aria-label="Yêu thích ưu đãi"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                isFavorited ? "fill-rose-500 text-rose-500" : "text-slate-500 hover:text-rose-500"
              }`}
            />
          </button>
        </div>

        {/* Right Column: Offer information & Code (Col 7) */}
        <div className="md:col-span-7 flex flex-col justify-between space-y-4">
          <div>
            {/* Tag */}
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200/80 shadow-2xs">
              {offer.badgeText}
            </span>

            {/* Title */}
            <h2 className="text-xl sm:text-2xl font-black text-[#0A2239] leading-tight mt-1.5">
              {offer.title}
            </h2>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
              {offer.description}
            </p>

            {/* Expiry */}
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-2">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>HSD: {offer.expiryDate}</span>
            </div>
          </div>

          {/* Code Box */}
          <div className="space-y-1.5">
            <span className="block text-[11px] font-medium text-slate-500">
              Mã ưu đãi của bạn
            </span>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="flex-1 bg-[#F0F7FF] border border-[#D0E2FF] rounded-xl px-4 py-2.5 font-mono font-bold text-sm sm:text-base text-[#0A2239] tracking-wider select-all">
                {offer.code}
              </div>
              <button
                type="button"
                onClick={() => onCopyCode(offer.code)}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0A2239] hover:bg-[#071726] text-white text-xs font-semibold shadow-2xs transition-all active:scale-95 cursor-pointer shrink-0"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Sao chép mã</span>
              </button>
            </div>
          </div>

          {/* Action Buttons Row */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
            <button
              type="button"
              onClick={onUseNow}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#1E40AF] hover:bg-[#1D4ED8] text-white text-xs sm:text-sm font-semibold shadow-2xs transition-all active:scale-95 cursor-pointer"
            >
              <Plane className="w-4 h-4 fill-white" />
              <span>Dùng ngay</span>
            </button>
            <button
              type="button"
              onClick={onViewFlights}
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-[#1E40AF] border border-[#BFDBFE] text-xs sm:text-sm font-semibold shadow-2xs transition-all active:scale-95 cursor-pointer"
            >
              <span>Xem vé máy bay</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
