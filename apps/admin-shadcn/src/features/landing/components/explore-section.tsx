"use client"

import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { EXPLORE_GUIDES } from "@/features/landing/data/stayea-mock-data"

interface ExploreSectionProps {
  readonly onNavigate?: (item: string) => void
}

export function ExploreSection({ onNavigate }: ExploreSectionProps = {}) {
  return (
    <section id="explore" className="py-12 bg-white">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="font-sans text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Khám phá Phú Quốc
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Cẩm nang, gợi ý và cảm hứng du lịch từ A-Z.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate?.("phu-quoc")}
            className="group inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-[#0c3b40] transition-colors active:scale-95"
          >
            <span>Xem tất cả bài viết</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 8 Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
          {EXPLORE_GUIDES.map((item) => (
            <div
              key={item.id}
              role="button"
              tabIndex={0}
              onClick={() => onNavigate?.("phu-quoc")}
              onKeyDown={(e) => { if (e.key === 'Enter') onNavigate?.("phu-quoc") }}
              className="group cursor-pointer flex flex-col rounded-2xl overflow-hidden bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200 transition-all duration-300 hover:-translate-y-0.5"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 12.5vw"
                />
              </div>

              {/* Text info */}
              <div className="p-2.5 flex flex-col flex-grow justify-between">
                <div>
                  <h4 className="font-bold text-xs sm:text-[13px] text-slate-800 leading-snug group-hover:text-[#0c3b40] transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-[10.5px] text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
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
