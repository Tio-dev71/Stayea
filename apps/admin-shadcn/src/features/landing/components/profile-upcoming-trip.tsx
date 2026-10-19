"use client"

import Image from "next/image"
import { Calendar, Users, Heart, ArrowRight } from "lucide-react"
import type { UpcomingTrip } from "@/features/landing/data/stayea-mock-data"

interface ProfileUpcomingTripProps {
  readonly trip: UpcomingTrip
  readonly onViewDetails?: (trip: UpcomingTrip) => void
  readonly onManageBooking?: (trip: UpcomingTrip) => void
  readonly onViewAll?: () => void
}

export function ProfileUpcomingTrip({
  trip,
  onViewDetails,
  onManageBooking,
  onViewAll,
}: ProfileUpcomingTripProps) {
  return (
    <section className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-slate-800" />
          <h3 className="font-bold text-slate-900 text-base sm:text-lg tracking-tight">
            Chuyến đi sắp tới
          </h3>
        </div>

        <button
          type="button"
          onClick={onViewAll}
          className="text-xs font-semibold text-[#1E3A8A] hover:underline inline-flex items-center gap-1 transition-colors"
        >
          <span>Xem tất cả</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Upcoming Trip Horizontal Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-3.5 sm:p-4 shadow-xs hover:border-slate-300 transition-all">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          {/* Left Thumbnail Image */}
          <div className="relative w-full md:w-56 h-36 rounded-xl overflow-hidden shrink-0 bg-slate-100">
            <Image
              src={trip.imageUrl}
              alt={trip.title}
              fill
              unoptimized
              className="object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>

          {/* Middle Trip Information */}
          <div className="flex-1 min-w-0 space-y-2.5 w-full">
            {/* Status Badge */}
            <div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>{trip.statusBadge}</span>
              </span>
            </div>

            {/* Title */}
            <h4
              onClick={() => onViewDetails?.(trip)}
              className="text-base sm:text-lg font-bold text-slate-900 hover:text-teal-700 transition-colors cursor-pointer truncate"
            >
              {trip.title}
            </h4>

            {/* Metadata Row: Dates, Guests, Type */}
            <div className="flex flex-wrap items-center gap-y-1.5 gap-x-4 text-xs text-slate-600">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{trip.dates}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{trip.guests}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{trip.tripType}</span>
              </div>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex flex-col gap-2 shrink-0 w-full md:w-44 pt-2 md:pt-0">
            <button
              type="button"
              onClick={() => onViewDetails?.(trip)}
              className="w-full py-2 px-3 rounded-xl border border-slate-300 hover:border-slate-400 hover:bg-slate-50 text-slate-800 text-xs font-semibold text-center transition-all active:scale-95 shadow-2xs"
            >
              Xem chi tiết
            </button>
            <button
              type="button"
              onClick={() => onManageBooking?.(trip)}
              className="w-full py-2 px-3 rounded-xl bg-[#0A2239] hover:bg-[#071726] text-white text-xs font-semibold text-center shadow-xs transition-all active:scale-95"
            >
              Quản lý đặt dịch vụ
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
