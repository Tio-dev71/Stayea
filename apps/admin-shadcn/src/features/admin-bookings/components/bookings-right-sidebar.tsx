"use client"

import { useMemo } from "react"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { BookingsScheduleCard } from "./bookings-schedule-card"
import { BookingsChannelChart } from "./bookings-channel-chart"
import type { BookingRecord } from "../stayea-admin-bookings-mock-data"

interface BookingsRightSidebarProps {
  bookings?: readonly BookingRecord[]
  onBannerAction?: () => void
  onViewAllSchedule?: () => void
  onViewChannelDetails?: () => void
}

export function BookingsRightSidebar({
  bookings = [],
  onBannerAction,
  onViewAllSchedule,
  onViewChannelDetails,
}: BookingsRightSidebarProps) {
  const totalBookings = bookings.length

  const channelData = useMemo(() => {
    if (!bookings || bookings.length === 0) return []
    const counts: Record<string, number> = {}
    bookings.forEach((b) => {
      const ch = b.channel || "Website"
      counts[ch] = (counts[ch] || 0) + 1
    })
    const palette = ["#10b981", "#ef4444", "#3b82f6", "#f59e0b", "#8b5cf6", "#64748b"]
    return Object.entries(counts).map(([ch, count], idx) => ({
      channel: ch,
      percentage: Math.round((count / bookings.length) * 100),
      color: palette[idx % palette.length]!,
    }))
  }, [bookings])

  return (
    <div className="flex flex-col gap-5">
      {/* 1. Top Banner */}
      <div className="relative overflow-hidden rounded-2xl aspect-[16/6] border border-slate-200/80 shadow-xs group">
        <Image
          src="/about/beach-opt-1.jpg"
          alt="Kỳ nghỉ tuyệt vời"
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/75 via-slate-900/40 to-transparent flex items-center justify-between p-4 sm:p-5 text-white">
          <div className="space-y-0.5">
            <h3 className="text-xs sm:text-sm font-bold tracking-tight leading-snug">
              Những kỳ nghỉ tuyệt vời
            </h3>
            <p className="text-[11px] text-emerald-100 font-medium">
              bắt đầu từ những đặt phòng thành công
            </p>
          </div>
          <button
            type="button"
            aria-label="Khám phá đặt phòng"
            onClick={onBannerAction}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white text-slate-800 flex items-center justify-center shrink-0 shadow-md hover:scale-105 active:scale-95 transition-transform"
          >
            <ArrowRight className="w-4 h-4 text-emerald-700" />
          </button>
        </div>
      </div>

      {/* 2. Lịch check-in / check-out hôm nay */}
      <BookingsScheduleCard onViewAll={onViewAllSchedule} />

      {/* 3. Tình trạng đặt phòng theo kênh */}
      <BookingsChannelChart
        data={channelData}
        totalCount={totalBookings}
        onViewDetails={onViewChannelDetails}
      />
    </div>
  )
}
