"use client"

import * as React from "react"
import Image from "next/image"
import {
  Plane,
  Share2,
  Download,
  Edit3,
  Calendar,
  Map,
  Waves,
  Fish,
  ShoppingBag,
  Sparkles,
  ArrowRight,
} from "lucide-react"
import type { ItineraryDayItem } from "@/features/landing/data/stayea-mock-data"

export type ItinerarySubTab = "overview" | "detailed" | "booked" | "budget" | "notes"

interface MyPlansActiveItineraryProps {
  readonly itineraryDays: readonly ItineraryDayItem[]
  readonly onShare: () => void
  readonly onDownloadPdf: () => void
  readonly onEditPlan: () => void
  readonly onViewMap: () => void
  readonly onViewDayDetail: (day: ItineraryDayItem) => void
}

const SUB_TABS: readonly { id: ItinerarySubTab; label: string }[] = [
  { id: "overview", label: "Tổng quan" },
  { id: "detailed", label: "Lịch trình chi tiết" },
  { id: "booked", label: "Dịch vụ đã đặt" },
  { id: "budget", label: "Chi phí dự kiến" },
  { id: "notes", label: "Ghi chú" },
]

function renderDayIcon(iconName: "plane-arrival" | "waves" | "fish" | "shopping-bag") {
  switch (iconName) {
    case "plane-arrival":
      return <Plane className="w-4 h-4 text-[#0A2239]" />
    case "waves":
      return <Waves className="w-4 h-4 text-[#0A2239]" />
    case "fish":
      return <Fish className="w-4 h-4 text-[#0A2239]" />
    case "shopping-bag":
      return <ShoppingBag className="w-4 h-4 text-[#0A2239]" />
    default:
      return null
  }
}

export function MyPlansActiveItinerary({
  itineraryDays,
  onShare,
  onDownloadPdf,
  onEditPlan,
  onViewMap,
  onViewDayDetail,
}: MyPlansActiveItineraryProps) {
  const [activeSubTab, setActiveSubTab] = React.useState<ItinerarySubTab>("overview")

  return (
    <section className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 space-y-5 shadow-2xs">
      {/* 1. Header Bar: Flight Icon + Title + 3 Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#EBF3FC] text-[#0A2239] flex items-center justify-center shrink-0">
            <Plane className="w-5 h-5 -rotate-45" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              Phú Quốc – Biển xanh, nắng vàng
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              15/06/2025 - 18/06/2025 (4 ngày)
            </p>
          </div>
        </div>

        {/* 3 Action Buttons: Chia sẻ, Tải PDF, Chỉnh sửa */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={onShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium shadow-2xs transition-all active:scale-95 shrink-0"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Chia sẻ</span>
          </button>
          <button
            type="button"
            onClick={onDownloadPdf}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium shadow-2xs transition-all active:scale-95 shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Tải lịch trình (PDF)</span>
          </button>
          <button
            type="button"
            onClick={onEditPlan}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium shadow-2xs transition-all active:scale-95 shrink-0"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Chỉnh sửa</span>
          </button>
        </div>
      </div>

      {/* 2. Sub-tabs Row (Tổng quan, Lịch trình chi tiết, Dịch vụ đã đặt, Chi phí dự kiến, Ghi chú) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-slate-100 pb-3">
        {SUB_TABS.map((tab) => {
          const isActive = activeSubTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSubTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all shrink-0 active:scale-95 ${
                isActive
                  ? "bg-[#0A2239] text-white font-semibold shadow-2xs"
                  : "bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* 3. Main Itinerary Content (2-Column Grid matching reference) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 pt-1">
        {/* Left Side: Beach Photo Card + Slogan Banner + "Xem bản đồ hành trình" */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-3">
          <div className="rounded-2xl border border-slate-200/90 overflow-hidden bg-white shadow-2xs flex flex-col flex-1">
            <div className="relative w-full h-48 sm:h-56 bg-slate-100 overflow-hidden">
              <Image
                src="/profile/bai-sao.jpg"
                alt="Phú Quốc Biển Xanh Nắng Vàng"
                fill
                unoptimized
                className="object-cover object-center"
              />
            </div>

            {/* Slogan Banner with quote icon */}
            <div className="p-4 bg-[#EBF3FC]/80 border-t border-slate-200/70 flex items-center justify-center gap-2 text-center text-xs font-medium text-[#0A2239]">
              <Sparkles className="w-4 h-4 text-[#0A2239] shrink-0" />
              <span>&ldquo;Một hành trình tuyệt vời đang chờ đón!&rdquo;</span>
            </div>
          </div>

          {/* "Xem bản đồ hành trình" Button */}
          <button
            type="button"
            onClick={onViewMap}
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold shadow-2xs transition-all active:scale-95"
          >
            <Map className="w-4 h-4 text-slate-600" />
            <span>Xem bản đồ hành trình</span>
          </button>
        </div>

        {/* Right Side: Timeline of 4 Days ("Lịch trình tóm tắt") */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-200/90 p-5 bg-white shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Calendar className="w-4 h-4 text-[#0A2239]" />
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wide">
              Lịch trình tóm tắt
            </h4>
          </div>

          {/* 4 Days Vertical Timeline */}
          <div className="space-y-4 relative">
            {/* Timeline continuous vertical connecting line */}
            <div className="absolute left-[88px] top-4 bottom-4 w-0.5 bg-slate-200 pointer-events-none hidden sm:block" />

            {itineraryDays.map((day) => (
              <div
                key={day.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-2 sm:p-2.5 rounded-xl hover:bg-slate-50/80 transition-colors"
              >
                {/* Date & Day Column */}
                <div className="flex items-center gap-3 min-w-[85px] shrink-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#0A2239] ring-4 ring-[#EBF3FC] shrink-0 hidden sm:block" />
                  <div className="leading-tight">
                    <p className="text-xs font-bold text-slate-900">{day.date}</p>
                    <p className="text-[11px] text-slate-500">{day.dayLabel}</p>
                  </div>
                </div>

                {/* Day Activity Details with Icon */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-[#EBF3FC] flex items-center justify-center shrink-0">
                    {renderDayIcon(day.iconName)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {day.title}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">
                      {day.description}
                    </p>
                  </div>
                </div>

                {/* Day Action Button */}
                <div className="shrink-0 self-end sm:self-auto">
                  <button
                    type="button"
                    onClick={() => onViewDayDetail(day)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium shadow-2xs transition-all active:scale-95 group/btn"
                  >
                    <span>Xem chi tiết</span>
                    <ArrowRight className="w-3 h-3 transform group-hover/btn:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
