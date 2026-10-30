"use client"

import * as React from "react"
import { ChevronUp } from "lucide-react"

export interface StayeaFlightFilterSidebarProps {
  readonly onFilterChange?: (filterCategory: string, value: string, checked: boolean) => void
}

export const StayeaFlightFilterSidebar: React.FC<StayeaFlightFilterSidebarProps> = ({
  onFilterChange,
}) => {
  // Collapsible section state
  const [openAirlines, setOpenAirlines] = React.useState(true)
  const [openDepartureTime, setOpenDepartureTime] = React.useState(true)
  const [openStops, setOpenStops] = React.useState(true)

  // Selected filters state matching screenshot
  const [selectedAirlines, setSelectedAirlines] = React.useState<Record<string, boolean>>({
    all: true,
    vietnamAirlines: false,
    vietjetAir: false,
    bambooAirways: false,
    vietravelAirlines: false,
    pacificAirlines: false,
  })

  const [selectedTimes, setSelectedTimes] = React.useState<Record<string, boolean>>({
    morningEarly: false,
    morning: false,
    afternoon: false,
    evening: false,
  })

  const [selectedStops, setSelectedStops] = React.useState<Record<string, boolean>>({
    all: true,
    nonStop: false,
    oneStop: false,
  })

  const [priceRange, setPriceRange] = React.useState<number>(5_000_000)

  function toggleAirline(key: string) {
    setSelectedAirlines((prev) => {
      const next = { ...prev, [key]: !prev[key] }
      if (key === "all" && !prev.all) {
        return {
          all: true,
          vietnamAirlines: false,
          vietjetAir: false,
          bambooAirways: false,
          vietravelAirlines: false,
          pacificAirlines: false,
        }
      }
      if (key !== "all") {
        next.all = false
      }
      onFilterChange?.("airline", key, !prev[key])
      return next
    })
  }

  function toggleTime(key: string) {
    setSelectedTimes((prev) => {
      const next = { ...prev, [key]: !prev[key] }
      onFilterChange?.("time", key, !prev[key])
      return next
    })
  }

  function toggleStop(key: string) {
    setSelectedStops((prev) => {
      const next = { ...prev, [key]: !prev[key] }
      if (key === "all" && !prev.all) {
        return { all: true, nonStop: false, oneStop: false }
      }
      if (key !== "all") {
        next.all = false
      }
      onFilterChange?.("stops", key, !prev[key])
      return next
    })
  }

  return (
    <aside className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-6">
      <h2 className="text-base font-black text-[#0A2239]">Bộ lọc tìm kiếm</h2>

      {/* 1. Hãng hàng không */}
      <div className="space-y-3 pb-5 border-b border-slate-100">
        <button
          type="button"
          onClick={() => setOpenAirlines(!openAirlines)}
          className="w-full flex items-center justify-between text-left group cursor-pointer"
        >
          <span className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
            Hãng hàng không
          </span>
          <ChevronUp
            className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
              openAirlines ? "" : "rotate-180"
            }`}
          />
        </button>

        {openAirlines && (
          <div className="space-y-2.5 pt-1">
            {[
              { id: "all", label: "Tất cả" },
              { id: "vietnamAirlines", label: "Vietnam Airlines" },
              { id: "vietjetAir", label: "Vietjet Air" },
              { id: "bambooAirways", label: "Bamboo Airways" },
              { id: "vietravelAirlines", label: "Vietravel Airlines" },
              { id: "pacificAirlines", label: "Pacific Airlines" },
            ].map((item) => (
              <label
                key={item.id}
                className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer hover:text-slate-900 select-none"
              >
                <input
                  type="checkbox"
                  checked={!!selectedAirlines[item.id]}
                  onChange={() => toggleAirline(item.id)}
                  className="w-4 h-4 rounded border-slate-300 text-[#1E3A8A] focus:ring-[#1E3A8A] cursor-pointer"
                />
                <span>{item.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* 2. Thời gian khởi hành */}
      <div className="space-y-3 pb-5 border-b border-slate-100">
        <button
          type="button"
          onClick={() => setOpenDepartureTime(!openDepartureTime)}
          className="w-full flex items-center justify-between text-left group cursor-pointer"
        >
          <span className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
            Thời gian khởi hành
          </span>
          <ChevronUp
            className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
              openDepartureTime ? "" : "rotate-180"
            }`}
          />
        </button>

        {openDepartureTime && (
          <div className="space-y-2.5 pt-1">
            {[
              { id: "morningEarly", label: "Sáng (00:00 - 06:00)" },
              { id: "morning", label: "Sáng (06:00 - 12:00)" },
              { id: "afternoon", label: "Chiều (12:00 - 18:00)" },
              { id: "evening", label: "Tối (18:00 - 24:00)" },
            ].map((item) => (
              <label
                key={item.id}
                className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer hover:text-slate-900 select-none"
              >
                <input
                  type="checkbox"
                  checked={!!selectedTimes[item.id]}
                  onChange={() => toggleTime(item.id)}
                  className="w-4 h-4 rounded border-slate-300 text-[#1E3A8A] focus:ring-[#1E3A8A] cursor-pointer"
                />
                <span>{item.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* 3. Số điểm dừng */}
      <div className="space-y-3 pb-5 border-b border-slate-100">
        <button
          type="button"
          onClick={() => setOpenStops(!openStops)}
          className="w-full flex items-center justify-between text-left group cursor-pointer"
        >
          <span className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
            Số điểm dừng
          </span>
          <ChevronUp
            className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
              openStops ? "" : "rotate-180"
            }`}
          />
        </button>

        {openStops && (
          <div className="space-y-2.5 pt-1">
            {[
              { id: "all", label: "Tất cả" },
              { id: "nonStop", label: "Bay thẳng" },
              { id: "oneStop", label: "1 điểm dừng" },
            ].map((item) => (
              <label
                key={item.id}
                className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer hover:text-slate-900 select-none"
              >
                <input
                  type="checkbox"
                  checked={!!selectedStops[item.id]}
                  onChange={() => toggleStop(item.id)}
                  className="w-4 h-4 rounded border-slate-300 text-[#1E3A8A] focus:ring-[#1E3A8A] cursor-pointer"
                />
                <span>{item.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* 4. Khoảng giá */}
      <div className="space-y-3">
        <span className="text-xs sm:text-sm font-bold text-slate-900 block">
          Khoảng giá
        </span>

        {/* Range Track */}
        <div className="relative pt-2 pb-1">
          {(() => {
            const progress = Math.min(100, Math.max(0, ((priceRange - 500_000) / 4_500_000) * 100))
            return (
              <input
                type="range"
                min="500000"
                max="5000000"
                step="100000"
                value={priceRange}
                style={{ '--range-progress': `${progress}%` } as React.CSSProperties}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full h-1.5 rounded-lg appearance-none cursor-pointer"
                aria-label="Khoảng giá"
              />
            )
          })()}
        </div>

        {/* Price Labels */}
        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600">
          <span>500.000đ</span>
          <span>5.000.000đ</span>
        </div>
      </div>
    </aside>
  )
}
