"use client"

import * as React from "react"
import { Check, ArrowRight } from "lucide-react"
import { AirlineLogo } from "./airline-logo"
import type { FlightItem } from "@/features/landing/data/stayea-mock-data"

export interface StayeaFlightCardItemProps {
  readonly flight: FlightItem
  readonly isSelected?: boolean
  readonly onSelect?: (flight: FlightItem) => void
}

function formatVND(val: number): string {
  return new Intl.NumberFormat("vi-VN").format(val) + "đ"
}

export const StayeaFlightCardItem: React.FC<StayeaFlightCardItemProps> = ({
  flight,
  isSelected = false,
  onSelect,
}) => {
  return (
    <div
      className={`relative bg-white rounded-2xl border transition-all overflow-hidden ${
        isSelected
          ? "border-[#1E3A8A] ring-1 ring-[#1E3A8A]/30 shadow-xs"
          : "border-slate-200/90 hover:border-slate-300 shadow-2xs"
      }`}
    >
      {/* 1. Top Ribbon: "Khuyến nghị" */}
      {flight.isRecommended && (
        <div className="absolute top-0 left-0 z-10">
          <span className="inline-block px-3 py-0.5 bg-[#059669] text-white text-[11px] font-bold rounded-br-lg shadow-2xs">
            Khuyến nghị
          </span>
        </div>
      )}

      {/* 2. Main Content Card */}
      <div className="p-4 sm:p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Airline Block */}
          <div className="flex items-center gap-3 w-full md:w-48 shrink-0 pt-2 sm:pt-0">
            <AirlineLogo type={flight.airline.type} size="md" />
            <div className="leading-tight">
              <span className="block text-xs sm:text-sm font-bold text-slate-900">
                {flight.airline.name}
              </span>
              <span className="block text-[11px] text-slate-400 mt-0.5">
                {flight.flightNumber}
              </span>
            </div>
          </div>

          {/* Times & Route Block */}
          <div className="flex-1 flex items-center justify-between md:justify-center gap-4 sm:gap-6 min-w-0">
            {/* Departure */}
            <div className="text-left md:text-right min-w-[55px]">
              <span className="block text-base sm:text-lg font-black text-slate-900 leading-none">
                {flight.departureTime}
              </span>
              <span className="block text-xs text-slate-500 font-semibold mt-1">
                {flight.departureAirport}
              </span>
            </div>

            {/* Flight Duration Line */}
            <div className="flex-1 max-w-[140px] flex flex-col items-center">
              <span className="text-[10px] text-slate-400 font-medium">
                {flight.duration}
              </span>
              <div className="relative w-full flex items-center justify-center my-1">
                <div className="w-full h-px bg-slate-300" />
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 absolute right-0" />
              </div>
              <span className="text-[10px] text-slate-500 font-medium">
                {flight.stops}
              </span>
            </div>

            {/* Arrival */}
            <div className="text-right md:text-left min-w-[55px]">
              <span className="block text-base sm:text-lg font-black text-slate-900 leading-none">
                {flight.arrivalTime}
              </span>
              <span className="block text-xs text-slate-500 font-semibold mt-1">
                {flight.arrivalAirport}
              </span>
            </div>
          </div>

          {/* Price & Action Button Block */}
          <div className="flex items-center justify-between md:justify-end gap-4 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
            <div className="text-left md:text-right">
              {flight.originalPrice > flight.price && (
                <span className="block text-xs text-slate-400 line-through leading-tight">
                  {formatVND(flight.originalPrice)}
                </span>
              )}
              <span className="block text-base sm:text-lg font-black text-[#DC2626] leading-tight">
                {formatVND(flight.price)}
              </span>
              <span className="block text-[10px] text-slate-400">
                Giá một chiều/khách
              </span>
            </div>

            {/* Button "Chọn ->" */}
            <button
              type="button"
              onClick={() => onSelect?.(flight)}
              className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#0A2239] hover:bg-[#071726] text-white text-xs sm:text-sm font-bold shadow-2xs transition-all active:scale-95 cursor-pointer"
            >
              <span>Chọn</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Bottom Strip: Club Applied Discount Notification */}
      {flight.isClubDiscountApplied && (
        <div className="bg-[#EDFDF5] border-t border-[#A7F3D0]/60 px-4 py-2 flex items-center gap-2 text-xs font-semibold text-[#065F46]">
          <span className="w-4 h-4 rounded-full bg-[#10B981] flex items-center justify-center text-white shrink-0">
            <Check className="w-2.5 h-2.5 stroke-[3]" />
          </span>
          <span>
            Đã áp dụng ưu đãi Stayea Club – 10% (STAYEA10AIR)
          </span>
        </div>
      )}
    </div>
  )
}
