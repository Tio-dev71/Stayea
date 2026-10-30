"use client"

import Image from "next/image"
import { Gift, Calendar, Crown, ArrowRight } from "lucide-react"
import { STAYEA_CLUB_OFFERS } from "@/features/landing/data/stayea-mock-data"
import type { StayeaClubOfferItem } from "@/features/landing/data/stayea-mock-data"

interface StayeaClubOffersSectionProps {
  readonly onClaimOffer: (offer: StayeaClubOfferItem) => void
  readonly onViewAllOffers?: () => void
}

function renderBadge(variant: StayeaClubOfferItem["badgeVariant"], text: string) {
  switch (variant) {
    case "emerald":
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100/90 text-emerald-800 border border-emerald-300 shadow-2xs">
          {text}
        </span>
      )
    case "blue":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100/90 text-blue-800 border border-blue-300 shadow-2xs">
          <Crown className="w-2.5 h-2.5 text-blue-700" />
          <span>{text}</span>
        </span>
      )
    case "amber":
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100/90 text-amber-800 border border-amber-300 shadow-2xs">
          {text}
        </span>
      )
    default:
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-100/90 text-sky-800 border border-sky-300 shadow-2xs">
          {text}
        </span>
      )
  }
}

export function StayeaClubOffersSection({
  onClaimOffer,
  onViewAllOffers,
}: StayeaClubOffersSectionProps) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-[#0A2239]">
          <Gift className="w-5 h-5 text-[#1E40AF]" />
          <h3 className="text-base font-bold text-[#0A2239]">
            Ưu đãi dành riêng cho bạn
          </h3>
        </div>

        <button
          type="button"
          onClick={onViewAllOffers}
          className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
        >
          <span>Xem tất cả ưu đãi</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Grid of Offers */}
      {STAYEA_CLUB_OFFERS.length === 0 ? (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 text-center space-y-2 shadow-2xs">
          <p className="text-sm font-semibold text-slate-700">Chưa có ưu đãi độc quyền nào được kích hoạt</p>
          <p className="text-xs text-slate-400">Các chương trình ưu đãi mới của STAYEA Club sẽ sớm được cập nhật tại đây.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {STAYEA_CLUB_OFFERS.map((offer: StayeaClubOfferItem) => (
            <div
              key={offer.id}
              className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-2xs hover:shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Thumbnail + Floating Badge */}
                <div className="relative w-full h-32 sm:h-36 overflow-hidden bg-slate-100">
                  <Image
                    src={offer.imageUrl}
                    alt={offer.title}
                    fill
                    unoptimized
                    className="object-cover object-center transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute bottom-2.5 left-2.5 z-10">
                    {renderBadge(offer.badgeVariant, offer.badgeText)}
                  </div>
                </div>

                {/* Offer Details */}
                <div className="p-3.5 space-y-1.5">
                  <h4
                    className="text-xs sm:text-sm font-bold text-[#0A2239] line-clamp-1"
                    title={offer.title}
                  >
                    {offer.title}
                  </h4>
                  <p
                    className="text-[11px] text-slate-500 line-clamp-1"
                    title={offer.description}
                  >
                    {offer.description}
                  </p>
                  <div className="flex items-center gap-1 text-[10px] text-slate-400 pt-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <span>HSD: {offer.expiryDate}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-3.5 pt-0">
                <button
                  type="button"
                  onClick={() => onClaimOffer(offer)}
                  className="w-full py-2 bg-[#0A2239] hover:bg-[#071726] text-white text-xs font-semibold rounded-xl shadow-2xs transition-all active:scale-95 cursor-pointer"
                >
                  {offer.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
