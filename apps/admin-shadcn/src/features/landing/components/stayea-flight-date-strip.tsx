"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { FlightDateOption } from "@/features/landing/data/stayea-mock-data"

export interface StayeaFlightDateStripProps {
  readonly dates: readonly FlightDateOption[]
  readonly selectedDateId?: string
  readonly onSelectDate?: (dateId: string) => void
  readonly onPrev?: () => void
  readonly onNext?: () => void
}

export const StayeaFlightDateStrip: React.FC<StayeaFlightDateStripProps> = ({
  dates,
  selectedDateId = "date-4",
  onSelectDate,
  onPrev,
  onNext,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-1.5 flex items-center gap-1 overflow-x-auto no-scrollbar">
      {/* Previous Arrow */}
      <button
        type="button"
        onClick={onPrev}
        className="w-8 h-12 flex items-center justify-center rounded-xl hover:bg-slate-100 text-slate-500 transition-colors shrink-0 cursor-pointer"
        aria-label="Ngày trước"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Date Tabs Carousel */}
      <div className="flex-1 grid grid-cols-7 gap-1 min-w-[560px]">
        {dates.map((item) => {
          const isSelected = item.id === selectedDateId

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectDate?.(item.id)}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl text-center transition-all cursor-pointer select-none ${
                isSelected
                  ? "bg-[#0A2239] text-white shadow-xs font-bold"
                  : "bg-transparent text-slate-700 hover:bg-slate-50"
              }`}
            >
              {/* Day of Week */}
              <span
                className={`text-[11px] leading-tight ${
                  isSelected ? "text-white font-extrabold" : "text-slate-600 font-semibold"
                }`}
              >
                {item.dayOfWeek}
              </span>

              {/* Day/Month */}
              <span
                className={`text-xs leading-tight ${
                  isSelected ? "text-white/95 font-bold" : "text-slate-800 font-medium"
                }`}
              >
                {item.date}
              </span>

              {/* Price */}
              <span
                className={`text-[10px] mt-0.5 leading-tight ${
                  isSelected ? "text-white font-semibold" : "text-slate-500"
                }`}
              >
                {item.priceText}
              </span>
            </button>
          )
        })}
      </div>

      {/* Next Arrow */}
      <button
        type="button"
        onClick={onNext}
        className="w-8 h-12 flex items-center justify-center rounded-xl hover:bg-slate-100 text-slate-500 transition-colors shrink-0 cursor-pointer"
        aria-label="Ngày sau"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  )
}
