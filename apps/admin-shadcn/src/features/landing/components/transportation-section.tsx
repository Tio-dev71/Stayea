"use client"

import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { TRANSPORTATION_SERVICES } from "@/features/landing/data/stayea-mock-data"

interface TransportationSectionProps {
  readonly onNavigate?: (item: string) => void
}

export function TransportationSection({ onNavigate }: TransportationSectionProps = {}) {
  return (
    <section id="transportation" className="py-12 bg-slate-50/50">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="font-sans text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Dịch vụ di chuyển
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Di chuyển dễ dàng, an toàn và thoải mái trên khắp đảo Phú Quốc.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate?.("transport")}
            className="group inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-[#0c3b40] transition-colors active:scale-95"
          >
            <span>Xem tất cả dịch vụ</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 4 Landscape Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {TRANSPORTATION_SERVICES.map((item) => (
            <div
              key={item.id}
              role="button"
              tabIndex={0}
              onClick={() => onNavigate?.("transport")}
              onKeyDown={(e) => { if (e.key === 'Enter') onNavigate?.("transport") }}
              className="group cursor-pointer flex flex-col rounded-2xl overflow-hidden bg-white border border-slate-100 shadow-sm hover:shadow-lg hover:border-slate-200 transition-all duration-300 hover:-translate-y-1"
            >
              {/* Landscape Image */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              </div>

              {/* Text Info */}
              <div className="p-3.5 flex flex-col justify-center">
                <h4 className="font-bold text-sm text-slate-800 group-hover:text-[#0c3b40] transition-colors">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
