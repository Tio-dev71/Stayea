"use client"

import Image from "next/image"
import { ArrowRight, Crown, Home, Building2, Calendar, ShieldCheck, Hotel, Sparkles } from "lucide-react"
import { ACCOMMODATIONS } from "@/features/landing/data/stayea-mock-data"

function getCategoryIcon(iconName: string) {
  switch (iconName) {
    case "villa":
      return <Home className="w-4 h-4 text-amber-600" />
    case "building":
      return <Building2 className="w-4 h-4 text-amber-600" />
    case "home":
      return <Home className="w-4 h-4 text-amber-600" />
    case "hotel":
      return <Hotel className="w-4 h-4 text-amber-600" />
    case "calendar":
      return <Calendar className="w-4 h-4 text-amber-600" />
    case "shield-check":
      return <ShieldCheck className="w-4 h-4 text-amber-600" />
    case "crown":
      return <Crown className="w-4 h-4 text-amber-500 fill-amber-400/20" />
    default:
      return <Sparkles className="w-4 h-4 text-amber-600" />
  }
}

interface AccommodationSectionProps {
  readonly onNavigate?: (item: string, subCategory?: string, itemData?: any) => void
}

export function AccommodationSection({ onNavigate }: AccommodationSectionProps = {}) {
  return (
    <section id="accommodations" className="py-12 bg-white">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="font-sans text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Tìm nơi lưu trú phù hợp
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Từ biệt thự biển sang trọng đến homestay ấm cúng, luôn có một nơi dành riêng cho bạn.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate?.("stay")}
            className="group inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-[#0c3b40] transition-colors active:scale-95"
          >
            <span>Xem tất cả lưu trú</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 7 Columns Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
          {ACCOMMODATIONS.map((item) => (
            <div
              key={item.id}
              role="button"
              tabIndex={0}
              onClick={() => onNavigate?.("stay", item.id)}
              onKeyDown={(e) => { if (e.key === 'Enter') onNavigate?.("stay", item.id) }}
              className={`group cursor-pointer flex flex-col rounded-2xl overflow-hidden bg-white border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                item.isSelect
                  ? "border-amber-300/80 ring-1 ring-amber-300/40 shadow-sm"
                  : "border-slate-100 shadow-sm hover:border-slate-200"
              }`}
            >
              {/* Card Image */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 14vw"
                />
                {item.isSelect && (
                  <div className="absolute top-2 right-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                    <Crown className="w-2.5 h-2.5" />
                    <span>Select</span>
                  </div>
                )}
              </div>

              {/* Card Content */}
              <div className="p-3 flex flex-col flex-grow justify-between">
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    {getCategoryIcon(item.iconName)}
                    <h3 className="font-semibold text-xs sm:text-[13px] text-slate-800 leading-snug">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
