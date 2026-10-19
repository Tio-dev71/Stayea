"use client"

import Image from "next/image"
import { Calendar, Tag, CheckCircle2, ArrowRight } from "lucide-react"
import type { PlanBookedServiceItem } from "@/features/landing/data/stayea-mock-data"

interface MyPlansBookedServicesProps {
  readonly services: readonly PlanBookedServiceItem[]
  readonly onSelectService: (service: PlanBookedServiceItem) => void
  readonly onViewAll?: () => void
}

export function MyPlansBookedServices({
  services,
  onSelectService,
  onViewAll,
}: MyPlansBookedServicesProps) {
  return (
    <section className="space-y-4 pt-2">
      {/* 1. Header: Icon + Title + "Xem tất cả →" Link */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#0A2239]" />
          <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            Dịch vụ đã đặt (4)
          </h3>
        </div>

        <div>
          <button
            type="button"
            onClick={onViewAll}
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-[#0A2239] hover:underline"
          >
            <span>Xem tất cả</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. 4 Cards Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {services.map((item) => (
          <div
            key={item.id}
            className="group bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between"
          >
            <div>
              {/* Image banner with "Đã xác nhận" badge */}
              <div className="relative w-full h-32 sm:h-36 overflow-hidden bg-slate-100">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  unoptimized
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />

                {/* Top-right "Đã xác nhận" Badge */}
                <div className="absolute top-2.5 right-2.5 z-10">
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/95 text-emerald-700 shadow-xs border border-emerald-200/60 text-[10px] font-semibold backdrop-blur-2xs">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>{item.statusLabel}</span>
                  </div>
                </div>
              </div>

              {/* Information body */}
              <div className="p-3.5 space-y-2">
                <h4 className="text-xs sm:text-[13px] font-bold text-slate-900 line-clamp-1 group-hover:text-[#0A2239] transition-colors">
                  {item.title}
                </h4>

                <div className="space-y-1 text-[11px] text-slate-500">
                  {item.route && (
                    <p className="font-medium text-slate-700 truncate">
                      {item.route}
                    </p>
                  )}
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{item.dates}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{item.typeLabel}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Button */}
            <div className="p-3.5 pt-0">
              <button
                type="button"
                onClick={() => onSelectService(item)}
                className="w-full inline-flex items-center justify-center py-2 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-all active:scale-95"
              >
                <span>Xem chi tiết</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
