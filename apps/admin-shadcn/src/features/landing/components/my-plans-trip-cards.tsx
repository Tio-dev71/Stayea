"use client"

import Image from "next/image"
import { Calendar, MapPin, Users, MoreHorizontal, ArrowRight } from "lucide-react"
import type { MyPlanTripCard } from "@/features/landing/data/stayea-mock-data"

interface MyPlansTripCardsProps {
  readonly trips: readonly MyPlanTripCard[]
  readonly selectedTripId: string
  readonly onSelectTrip: (trip: MyPlanTripCard) => void
  readonly onTripActionMenu: (trip: MyPlanTripCard) => void
}

export function MyPlansTripCards({
  trips,
  selectedTripId,
  onSelectTrip,
  onTripActionMenu,
}: MyPlansTripCardsProps) {
  if (trips.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/90 p-8 text-center space-y-2 shadow-2xs">
        <p className="text-sm font-semibold text-slate-800">Bạn chưa có kế hoạch chuyến đi nào</p>
        <p className="text-xs text-slate-400">
          Nhấn nút &quot;Tạo kế hoạch mới +&quot; ở trên để thiết lập lịch trình kỳ nghỉ riêng tại Phú Quốc.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 pt-1">
      {trips.map((trip) => {
        const isSelected = trip.id === selectedTripId
        const isUpcoming = trip.statusVariant === "emerald"

        return (
          <div
            key={trip.id}
            className={`group bg-white rounded-2xl border transition-all duration-200 overflow-hidden shadow-2xs hover:shadow-md flex flex-col sm:flex-row ${
              isSelected ? "border-[#0A2239] ring-1 ring-[#0A2239]/20" : "border-slate-200/90"
            }`}
          >
            {/* Left Image (on sm: fixed width, on mobile full width top) */}
            <div className="relative w-full sm:w-44 md:w-48 h-40 sm:h-auto shrink-0 overflow-hidden bg-slate-100">
              <Image
                src={trip.imageUrl}
                alt={trip.title}
                fill
                unoptimized
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Right Content */}
            <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
              {/* Top Row: Badge + More menu button */}
              <div className="flex items-center justify-between">
                <span
                  className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                    isUpcoming
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                      : "bg-blue-50 text-blue-700 border border-blue-200/60"
                  }`}
                >
                  {trip.statusLabel}
                </span>

                <button
                  type="button"
                  onClick={() => onTripActionMenu(trip)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
                  aria-label="Tùy chọn kế hoạch"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>

              {/* Title & Metadata */}
              <div className="space-y-1.5">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-[#0A2239] transition-colors line-clamp-1">
                  {trip.title}
                </h3>

                <div className="space-y-1 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{trip.dates}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{trip.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{trip.guests}</span>
                  </div>
                </div>
              </div>

              {/* Bottom CTA Button */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => onSelectTrip(trip)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-all active:scale-95 group/btn"
                >
                  <span>{trip.actionLabel}</span>
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
