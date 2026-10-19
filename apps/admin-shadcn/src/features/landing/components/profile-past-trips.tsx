"use client"

import Image from "next/image"
import { Clock, Calendar, MapPin, ArrowRight } from "lucide-react"
import type { PastTrip } from "@/features/landing/data/stayea-mock-data"

interface ProfilePastTripsProps {
  readonly trips: readonly PastTrip[]
  readonly onSelectTrip?: (trip: PastTrip) => void
  readonly onViewAll?: () => void
}

export function ProfilePastTrips({
  trips,
  onSelectTrip,
  onViewAll,
}: ProfilePastTripsProps) {
  return (
    <section className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-slate-800" />
          <h3 className="font-bold text-slate-900 text-base sm:text-lg tracking-tight">
            Chuyến đi đã qua
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

      {/* 3-Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {trips.map((trip: PastTrip) => (
          <div
            key={trip.id}
            onClick={() => onSelectTrip?.(trip)}
            className="group bg-white rounded-2xl border border-slate-200/80 p-3 shadow-xs hover:border-slate-300 hover:shadow-md transition-all cursor-pointer"
          >
            {/* Card Thumbnail */}
            <div className="relative w-full h-40 rounded-xl overflow-hidden bg-slate-100">
              <Image
                src={trip.imageUrl}
                alt={trip.title}
                fill
                unoptimized
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            {/* Content Details */}
            <div className="pt-3 pb-1 px-1">
              <h4 className="font-bold text-slate-900 text-sm group-hover:text-teal-700 transition-colors truncate">
                {trip.title}
              </h4>

              <div className="space-y-1 mt-2 text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{trip.dates}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{trip.location}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
