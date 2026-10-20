"use client"

import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { PROMO_BANNERS, PARTNER_CARDS } from "@/features/landing/data/stayea-mock-data"

interface PromosAndPartnersSectionProps {
  readonly onNavigate?: (item: string) => void
}

export function PromosAndPartnersSection({ onNavigate }: PromosAndPartnersSectionProps = {}) {
  const plannerBanner = PROMO_BANNERS[0]
  const dealsBanner = PROMO_BANNERS[1]

  return (
    <section id="planner" className="py-12 bg-white">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Row 1: 2 Wide Promotional Cards */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Card 1: Trip Planner */}
          {plannerBanner && (
            <div className="md:col-span-7 relative rounded-3xl overflow-hidden min-h-[200px] p-6 sm:p-8 flex flex-col justify-between shadow-sm hover:shadow-md border border-slate-100 transition-all duration-300 group bg-slate-50">
              <div className="absolute inset-0 z-0">
                <Image
                  src={plannerBanner.imageUrl}
                  alt={plannerBanner.title}
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, 60vw"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/70 to-transparent" />
              </div>

              <div className="relative z-10 max-w-sm space-y-2">
                <h3 className="font-sans text-lg sm:text-xl font-bold text-slate-900 tracking-tight leading-snug">
                  {plannerBanner.title}
                </h3>
                <p className="text-xs text-slate-600 font-normal leading-relaxed">
                  {plannerBanner.description}
                </p>
              </div>

              <div className="relative z-10 pt-4">
                <button
                  type="button"
                  onClick={() => onNavigate?.("plans")}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0c3b40] hover:bg-[#072528] text-white text-xs font-semibold shadow-sm transition-all hover:gap-3 active:scale-95"
                >
                  <span>{plannerBanner.buttonText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Card 2: Special Deals */}
          {dealsBanner && (
            <div className="md:col-span-5 relative rounded-3xl overflow-hidden min-h-[200px] p-6 sm:p-8 flex flex-col justify-between shadow-sm hover:shadow-md border border-slate-100 transition-all duration-300 group bg-amber-50/30">
              <div className="absolute inset-0 z-0">
                <Image
                  src={dealsBanner.imageUrl}
                  alt={dealsBanner.title}
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, 40vw"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-amber-50/95 via-amber-50/70 to-transparent" />
              </div>

              <div className="relative z-10 max-w-xs space-y-2">
                <h3 className="font-sans text-lg sm:text-xl font-bold text-slate-900 tracking-tight leading-snug">
                  {dealsBanner.title}
                </h3>
                <p className="text-xs text-slate-600 font-normal leading-relaxed">
                  {dealsBanner.description}
                </p>
              </div>

              <div className="relative z-10 pt-4">
                <button
                  type="button"
                  onClick={() => onNavigate?.("deals")}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0c3b40] hover:bg-[#072528] text-white text-xs font-semibold shadow-sm transition-all hover:gap-3 active:scale-95"
                >
                  <span>{dealsBanner.buttonText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Row 2: 3 Action & Partner Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PARTNER_CARDS.map((card) => (
            <div
              key={card.id}
              className="relative rounded-3xl overflow-hidden min-h-[190px] p-6 flex flex-col justify-between shadow-sm hover:shadow-md border border-slate-100 transition-all duration-300 group bg-slate-50"
            >
              <div className="absolute inset-0 z-0">
                <Image
                  src={card.imageUrl}
                  alt={card.title}
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/70 to-transparent" />
              </div>

              <div className="relative z-10 space-y-1.5 max-w-[220px]">
                <h3 className="font-sans text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-snug">
                  {card.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {card.description}
                </p>
              </div>

              <div className="relative z-10 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    if (card.id === "stayea-club") onNavigate?.("stayea-club")
                    else if (card.id === "become-host") onNavigate?.("host")
                    else if (card.id === "partner-stayea") onNavigate?.("partner")
                    else onNavigate?.(card.href.replace("#", ""))
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#0c3b40] hover:bg-[#072528] text-white text-xs font-semibold shadow-sm transition-all hover:gap-2.5 active:scale-95"
                >
                  <span>{card.buttonText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
