"use client"

import { useState } from "react"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import type { ScheduleItem } from "@/features/admin-bookings/stayea-admin-bookings-mock-data"
import {
  TODAY_CHECKIN_ITEMS,
  TODAY_CHECKOUT_ITEMS,
} from "@/features/admin-bookings/stayea-admin-bookings-mock-data"

interface BookingsScheduleCardProps {
  checkInItems?: readonly ScheduleItem[]
  checkOutItems?: readonly ScheduleItem[]
  onViewAll?: () => void
}

export function BookingsScheduleCard({
  checkInItems = TODAY_CHECKIN_ITEMS,
  checkOutItems = TODAY_CHECKOUT_ITEMS,
  onViewAll,
}: BookingsScheduleCardProps) {
  const [activeTab, setActiveTab] = useState<"checkin" | "checkout">("checkin")

  const items = activeTab === "checkin" ? checkInItems : checkOutItems

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight leading-tight">
            Lịch check-in / check-out hôm nay
          </h3>
          <p className="text-[11px] text-slate-400 font-medium mt-0.5">
            Thứ Sáu, 25/04/2025
          </p>
        </div>
        <button
          type="button"
          onClick={onViewAll}
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#1b7a4e] hover:text-emerald-800 hover:underline transition-colors shrink-0"
        >
          <span>Xem tất cả</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-100 pb-2 text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab("checkin")}
          className={`px-3 py-1.5 rounded-lg transition-all ${
            activeTab === "checkin"
              ? "bg-[#eef8f3] text-[#1b7a4e]"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          Check-in ({checkInItems.length + 3})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("checkout")}
          className={`px-3 py-1.5 rounded-lg transition-all ${
            activeTab === "checkout"
              ? "bg-[#eef8f3] text-[#1b7a4e]"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          Check-out ({checkOutItems.length + 3})
        </button>
      </div>

      {/* List */}
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative w-8 h-8 rounded-full overflow-hidden ring-1 ring-slate-200 shrink-0">
                <Image
                  src={item.guestAvatar}
                  alt={item.guestName}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-slate-800 truncate">
                  {item.guestName}
                </p>
                <p className="text-[11px] text-slate-400 truncate">
                  {item.propertyName} · {item.guestsCountText}
                </p>
              </div>
            </div>

            {/* Time Pill */}
            <span className="shrink-0 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-bold text-[11px]">
              {item.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
