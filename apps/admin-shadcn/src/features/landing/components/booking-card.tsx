"use client"

import Image from "next/image"
import {
  Calendar,
  MapPin,
  Users,
  Bed,
  Sparkles,
  Plane,
  Ticket,
  Utensils,
  ChevronRight,
} from "lucide-react"
import type { ServiceBookingItem } from "@/features/landing/data/stayea-mock-data"

interface BookingCardProps {
  readonly item: ServiceBookingItem
  readonly onActionClick?: (action: string, item: ServiceBookingItem) => void
  readonly onViewDetails?: (item: ServiceBookingItem) => void
}

function renderDetailIcon(iconType: string, className: string) {
  switch (iconType) {
    case "bed":
      return <Bed className={className} />
    case "sparkles":
      return <Sparkles className={className} />
    case "plane":
      return <Plane className={className} />
    case "ticket":
      return <Ticket className={className} />
    case "utensils":
      return <Utensils className={className} />
    default:
      return <Ticket className={className} />
  }
}

export function BookingCard({
  item,
  onActionClick,
  onViewDetails,
}: BookingCardProps) {
  const isUpcoming = item.status === "upcoming"

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs hover:border-slate-300 hover:shadow-md transition-all">
      <div className="flex flex-col md:flex-row gap-4 sm:gap-5 items-stretch md:items-center">
        {/* 1. Left Thumbnail Image */}
        <div className="relative w-full md:w-52 h-44 md:h-36 rounded-xl overflow-hidden bg-slate-100 shrink-0">
          <Image
            src={item.imageUrl}
            alt={item.title}
            fill
            unoptimized
            className="object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>

        {/* 2. Middle Content Information */}
        <div className="flex-1 min-w-0 space-y-2">
          {/* Status Badge */}
          <div>
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                isUpcoming
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                  : "bg-slate-100 text-slate-700 border border-slate-200"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isUpcoming ? "bg-emerald-500 animate-pulse" : "bg-slate-500"
                }`}
              />
              <span>{item.statusLabel}</span>
            </span>
          </div>

          {/* Title */}
          <h3
            onClick={() => onViewDetails?.(item)}
            className="text-base sm:text-[17px] font-bold text-slate-900 hover:text-teal-700 transition-colors cursor-pointer leading-snug line-clamp-1"
          >
            {item.title}
          </h3>

          {/* Metadata Grid / Rows */}
          <div className="space-y-1 text-xs text-slate-600 pt-0.5">
            {/* Dates */}
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{item.dates}</span>
            </div>

            {/* Location or Flight Route */}
            {(item.location || item.route) && (
              <div className="flex items-center gap-2">
                {item.route ? (
                  <Plane className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                ) : (
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                )}
                <span>{item.route || item.location}</span>
              </div>
            )}

            {/* Guests count if applicable */}
            {item.guests && (
              <div className="flex items-center gap-2">
                <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{item.guests}</span>
              </div>
            )}

            {/* Room / Ticket / Experience Detail */}
            <div className="flex items-center gap-2">
              <span className="text-slate-400 shrink-0">
                {renderDetailIcon(item.detailIcon, "w-3.5 h-3.5")}
              </span>
              <span>{item.detailInfo}</span>
            </div>
          </div>
        </div>

        {/* 3. Right Column: Code, Price, Action Buttons */}
        <div className="flex flex-col justify-between items-start md:items-end gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 min-w-[210px]">
          {/* Top: Booking Code & Detail Link */}
          <div className="flex items-center justify-between md:justify-end gap-3 w-full text-xs">
            <span className="text-slate-500 font-mono">
              Mã đơn: <strong className="font-semibold text-slate-700">{item.code}</strong>
            </span>
            <button
              type="button"
              onClick={() => onViewDetails?.(item)}
              className="text-[#1E3A8A] font-semibold hover:underline inline-flex items-center gap-0.5 transition-colors"
            >
              <span>Chi tiết</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Center: Total Price */}
          <div className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight my-1">
            {item.price}
          </div>

          {/* Bottom: 2 Action Buttons */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <button
              type="button"
              onClick={() => onActionClick?.(item.primaryActionLabel, item)}
              className="flex-1 md:flex-initial px-3.5 py-2 rounded-xl border border-slate-300 hover:border-slate-400 hover:bg-slate-50 text-slate-800 text-xs font-semibold shadow-2xs transition-all active:scale-95 text-center whitespace-nowrap"
            >
              {item.primaryActionLabel}
            </button>

            <button
              type="button"
              onClick={() => onActionClick?.(item.secondaryActionLabel, item)}
              className="flex-1 md:flex-initial px-3.5 py-2 rounded-xl border border-slate-300 hover:border-slate-400 hover:bg-slate-50 text-slate-800 text-xs font-semibold shadow-2xs transition-all active:scale-95 text-center whitespace-nowrap"
            >
              {item.secondaryActionLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
