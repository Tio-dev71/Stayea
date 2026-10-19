"use client"

import * as React from "react"
import {
  Plane,
  Ship,
  Car,
  Bus,
  MapPin,
  ArrowLeftRight,
  Calendar,
  ChevronDown,
  User,
  Search,
} from "lucide-react"
import type { FlightSearchQuery } from "@/features/landing/data/stayea-mock-data"

export type TransportTabType = "plane" | "ferry" | "car-rental" | "shuttle"

export interface StayeaFlightSearchBarProps {
  readonly query: FlightSearchQuery
  readonly activeTab?: TransportTabType
  readonly onTabChange?: (tab: TransportTabType) => void
  readonly onSearch?: (query: FlightSearchQuery) => void
  readonly onSwapLocations?: () => void
}

export const StayeaFlightSearchBar: React.FC<StayeaFlightSearchBarProps> = ({
  query,
  activeTab = "plane",
  onTabChange,
  onSearch,
  onSwapLocations,
}) => {
  const [fromCity, setFromCity] = React.useState(query.fromCity)
  const [fromCode, setFromCode] = React.useState(query.fromCode)
  const [toCity, setToCity] = React.useState(query.toCity)
  const [toCode, setToCode] = React.useState(query.toCode)

  function handleSwap() {
    setFromCity(toCity)
    setFromCode(toCode)
    setToCity(fromCity)
    setToCode(fromCode)
    onSwapLocations?.()
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSearch?.({
      fromCity,
      fromCode,
      toCity,
      toCode,
      departureDate: query.departureDate,
      returnDate: query.returnDate,
      passengerText: query.passengerText,
      passengerSubtext: query.passengerSubtext,
    })
  }

  return (
    <div className="space-y-3">
      {/* 1. Mode of Transport Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {/* Plane (Active) */}
        <button
          type="button"
          onClick={() => onTabChange?.("plane")}
          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-2xs ${
            activeTab === "plane"
              ? "bg-[#1E3A8A] text-white"
              : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/80"
          }`}
        >
          <Plane className="w-4 h-4 fill-current" />
          <span>Máy bay</span>
        </button>

        {/* High-speed Ferry */}
        <button
          type="button"
          onClick={() => onTabChange?.("ferry")}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all cursor-pointer ${
            activeTab === "ferry"
              ? "bg-[#1E3A8A] text-white"
              : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/80"
          }`}
        >
          <Ship className="w-4 h-4 text-slate-500" />
          <span>Tàu cao tốc</span>
        </button>

        {/* Car Rental */}
        <button
          type="button"
          onClick={() => onTabChange?.("car-rental")}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all cursor-pointer ${
            activeTab === "car-rental"
              ? "bg-[#1E3A8A] text-white"
              : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/80"
          }`}
        >
          <Car className="w-4 h-4 text-slate-500" />
          <span>Thuê xe</span>
        </button>

        {/* Shuttle Bus */}
        <button
          type="button"
          onClick={() => onTabChange?.("shuttle")}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all cursor-pointer ${
            activeTab === "shuttle"
              ? "bg-[#1E3A8A] text-white"
              : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/80"
          }`}
        >
          <Bus className="w-4 h-4 text-slate-500" />
          <span>Xe đưa đón</span>
        </button>
      </div>

      {/* 2. Main Flight Search Bar (Horizontal Form) */}
      <form
        onSubmit={handleSearchSubmit}
        className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-3 sm:p-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Group 1: From + Swap + To (Col 5) */}
          <div className="md:col-span-5 flex items-center gap-2 bg-slate-50/70 border border-slate-200/70 rounded-xl px-3 py-2">
            {/* Field: Từ */}
            <div className="flex-1 min-w-0 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
              <div className="min-w-0">
                <span className="block text-[10px] text-slate-400 font-medium leading-none">
                  Từ
                </span>
                <span className="block text-xs sm:text-sm font-bold text-slate-800 truncate leading-tight mt-0.5">
                  {fromCity} ({fromCode})
                </span>
              </div>
            </div>

            {/* Swap Button */}
            <button
              type="button"
              onClick={handleSwap}
              className="w-7 h-7 rounded-full bg-white border border-slate-200 hover:border-blue-400 hover:text-blue-600 flex items-center justify-center shrink-0 shadow-2xs transition-colors cursor-pointer"
              aria-label="Đổi chiều chuyến bay"
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
            </button>

            {/* Field: Đến */}
            <div className="flex-1 min-w-0 flex items-center gap-2 pl-1">
              <MapPin className="w-4 h-4 text-[#1E3A8A] shrink-0" />
              <div className="min-w-0">
                <span className="block text-[10px] text-slate-400 font-medium leading-none">
                  Đến
                </span>
                <span className="block text-xs sm:text-sm font-bold text-slate-800 truncate leading-tight mt-0.5">
                  {toCity} ({toCode})
                </span>
              </div>
            </div>
          </div>

          {/* Group 2: Departure Date (Col 2) */}
          <div className="md:col-span-2 flex items-center justify-between bg-slate-50/70 border border-slate-200/70 rounded-xl px-3 py-2 cursor-pointer hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-2 min-w-0">
              <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
              <div className="min-w-0">
                <span className="block text-[10px] text-slate-400 font-medium leading-none">
                  Ngày đi
                </span>
                <span className="block text-xs sm:text-sm font-bold text-slate-800 truncate leading-tight mt-0.5">
                  {query.departureDate}
                </span>
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          </div>

          {/* Group 3: Return Date (Col 2) */}
          <div className="md:col-span-2 flex items-center justify-between bg-slate-50/70 border border-slate-200/70 rounded-xl px-3 py-2 cursor-pointer hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-2 min-w-0">
              <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
              <div className="min-w-0">
                <span className="block text-[10px] text-slate-400 font-medium leading-none">
                  Ngày về
                </span>
                <span className="block text-xs sm:text-sm font-bold text-slate-800 truncate leading-tight mt-0.5">
                  {query.returnDate}
                </span>
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          </div>

          {/* Group 4: Passengers (Col 2) */}
          <div className="md:col-span-2 flex items-center justify-between bg-slate-50/70 border border-slate-200/70 rounded-xl px-3 py-2 cursor-pointer hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-2 min-w-0">
              <User className="w-4 h-4 text-slate-400 shrink-0" />
              <div className="min-w-0">
                <span className="block text-[10px] text-slate-400 font-medium leading-none">
                  Hành khách
                </span>
                <span className="block text-xs sm:text-sm font-bold text-slate-800 truncate leading-tight mt-0.5">
                  {query.passengerText}
                </span>
                <span className="block text-[9px] text-slate-400 truncate leading-none">
                  ({query.passengerSubtext})
                </span>
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          </div>

          {/* Group 5: Search Button (Col 1) */}
          <div className="md:col-span-1 flex justify-stretch">
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#0A2239] hover:bg-[#071726] text-white text-xs font-bold shadow-2xs transition-all active:scale-95 cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span className="md:hidden lg:inline text-nowrap">Tìm chuyến bay</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
