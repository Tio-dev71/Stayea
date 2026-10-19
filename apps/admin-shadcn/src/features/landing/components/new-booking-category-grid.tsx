"use client"

import Image from "next/image"
import { Home, Umbrella, Gift, Car, ArrowRight } from "lucide-react"
import type { NewBookingCategoryItem } from "@/features/landing/data/stayea-mock-data"

interface NewBookingCategoryGridProps {
  readonly categories: readonly NewBookingCategoryItem[]
  readonly onSelectCategory: (targetRoute: string, categoryId: string) => void
}

function renderCategoryIcon(iconName: "home" | "umbrella" | "gift" | "car") {
  switch (iconName) {
    case "home":
      return <Home className="w-5 h-5 text-[#0A2239]" />
    case "umbrella":
      return <Umbrella className="w-5 h-5 text-[#0A2239]" />
    case "gift":
      return <Gift className="w-5 h-5 text-[#0A2239]" />
    case "car":
      return <Car className="w-5 h-5 text-[#0A2239]" />
    default:
      return null
  }
}

export function NewBookingCategoryGrid({
  categories,
  onSelectCategory,
}: NewBookingCategoryGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 pt-1">
      {categories.map((category) => {
        const isTransport = category.id === "transport"

        return (
          <div
            key={category.id}
            className="group bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col"
          >
            {/* 1. Card Image Banner */}
            <div className="relative w-full h-44 sm:h-52 overflow-hidden bg-slate-100">
              {isTransport && category.secondaryImageUrl ? (
                /* Composite Split Visual: Airplane + Luxury Airport Van matching reference screenshot */
                <div className="w-full h-full grid grid-cols-2 gap-0.5">
                  <div className="relative w-full h-full overflow-hidden">
                    <Image
                      src={category.secondaryImageUrl}
                      alt="Vietjet Flight"
                      fill
                      unoptimized
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="relative w-full h-full overflow-hidden">
                    <Image
                      src={category.imageUrl}
                      alt="Luxury Airport Transfer"
                      fill
                      unoptimized
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>
              ) : (
                <Image
                  src={category.imageUrl}
                  alt={category.title}
                  fill
                  unoptimized
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
              )}

              {/* Floating Circular Icon Badge Overlapping bottom-left */}
              <div className="absolute -bottom-5 left-5 z-20">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white shadow-md border border-slate-100 flex items-center justify-center transition-transform group-hover:scale-110 duration-300">
                  {renderCategoryIcon(category.iconName)}
                </div>
              </div>
            </div>

            {/* 2. Card Content & CTA */}
            <div className="p-5 sm:p-6 pt-8 sm:pt-9 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-1.5">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-[#0A2239] transition-colors">
                  {category.title}
                </h3>
                <p className="text-xs sm:text-[13px] text-slate-500 leading-relaxed">
                  {category.description}
                </p>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => onSelectCategory(category.targetRoute, category.id)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 sm:py-2.5 rounded-xl bg-[#0A2239] hover:bg-[#071726] text-white text-xs sm:text-[13px] font-semibold shadow-2xs transition-all active:scale-95 group/btn"
                >
                  <span>{category.actionLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover/btn:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
