"use client"

import Image from "next/image"
import { ArrowRight } from "lucide-react"
import type { PartnerCategoryItem } from "@/features/landing/data/stayea-mock-data"
import { PARTNER_CATEGORIES } from "@/features/landing/data/stayea-mock-data"

export function PartnerCategories() {
  return (
    <section className="py-12 sm:py-16 bg-white border-t border-slate-200/60">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6">
          <h2 className="font-sans text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Chúng tôi tìm kiếm những đối tác nào?
          </h2>

          <a
            href="#partner-register-form"
            className="text-xs sm:text-[13px] font-semibold text-[#0c3b40] hover:text-[#082b30] inline-flex items-center gap-1.5 group self-start sm:self-auto transition-colors"
          >
            <span>Đa dạng mô hình – Cùng tạo nên hệ sinh thái du lịch Phú Quốc</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>

        {/* 6 Category Cards Grid (6 columns on desktop) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 pt-2">
          {PARTNER_CATEGORIES.map((item: PartnerCategoryItem) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-2xs hover:shadow-md hover:border-teal-200 transition-all group flex flex-col justify-between"
            >
              {/* Image banner */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  unoptimized
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                />
              </div>

              {/* Text Info */}
              <div className="p-3 sm:p-3.5 space-y-1 bg-white">
                <h3 className="font-sans text-xs sm:text-[13px] font-bold text-slate-900 leading-tight">
                  {item.title}
                </h3>
                <p className="text-[10.5px] sm:text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                  {item.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
