"use client"

import * as React from "react"
import {
  Bed,
  Trophy,
  Luggage,
  Car,
  MapPin,
  Calendar as CalendarIcon,
  Users,
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  Plus,
  Minus,
  Sparkles,
} from "lucide-react"
import type { DestinationSuggestion } from "@/lib/stayea-api-service"
import { PHU_QUOC_DESTINATIONS, stayeaApi } from "@/lib/stayea-api-service"

export type SearchTabType = "stay" | "experience" | "package" | "transport"

interface SearchWidgetProps {
  readonly onNavigate?: (item: string, subCategory?: string) => void
}

interface GuestConfig {
  adults: number
  children: number
  infants: number
  rooms: number
}

// Vietnamese month names
const MONTH_NAMES = [
  "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
  "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
]
const DAY_LABELS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"]

function formatDateVN(date: Date | null): string {
  if (!date) return "Chọn ngày"
  const day = String(date.getDate()).padStart(2, "0")
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

function formatShortDateVN(date: Date | null): string {
  if (!date) return "Chọn ngày"
  const day = date.getDate()
  const month = date.getMonth() + 1
  return `${day} thg ${month}`
}

function isSameDay(d1: Date | null, d2: Date | null): boolean {
  if (!d1 || !d2) return false
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  )
}

function isBeforeDay(d1: Date, d2: Date): boolean {
  const t1 = new Date(d1.getFullYear(), d1.getMonth(), d1.getDate()).getTime()
  const t2 = new Date(d2.getFullYear(), d2.getMonth(), d2.getDate()).getTime()
  return t1 < t2
}

function calculateNights(start: Date | null, end: Date | null): number {
  if (!start || !end) return 0
  const t1 = new Date(start.getFullYear(), start.getMonth(), start.getDate()).getTime()
  const t2 = new Date(end.getFullYear(), end.getMonth(), end.getDate()).getTime()
  const diff = Math.round((t2 - t1) / (1000 * 60 * 60 * 24))
  return Math.max(0, diff)
}

export function SearchWidget({ onNavigate }: SearchWidgetProps = {}) {
  const widgetRef = React.useRef<HTMLDivElement>(null)

  // Active Tab
  const [activeTab, setActiveTab] = React.useState<SearchTabType>("stay")

  // Destination State
  const [destination, setDestination] = React.useState<string>("Phú Quốc, Việt Nam")
  const [selectedDestObj, setSelectedDestObj] = React.useState<DestinationSuggestion | null>(null)
  const [destPopoverOpen, setDestPopoverOpen] = React.useState<boolean>(false)
  const [destQuery, setDestQuery] = React.useState<string>("")

  // Date State
  const today = React.useMemo(() => new Date(), [])
  const defaultCheckIn = React.useMemo(() => {
    const d = new Date()
    d.setDate(d.getDate() + 1)
    return d
  }, [])
  const defaultCheckOut = React.useMemo(() => {
    const d = new Date()
    d.setDate(d.getDate() + 4)
    return d
  }, [])

  const [startDate, setStartDate] = React.useState<Date | null>(defaultCheckIn)
  const [endDate, setEndDate] = React.useState<Date | null>(defaultCheckOut)
  const [datePopoverOpen, setDatePopoverOpen] = React.useState<boolean>(false)
  const [calendarMonth, setCalendarMonth] = React.useState<Date>(() => new Date())

  // Guests State
  const [guests, setGuests] = React.useState<GuestConfig>({
    adults: 2,
    children: 0,
    infants: 0,
    rooms: 1,
  })
  const [guestPopoverOpen, setGuestPopoverOpen] = React.useState<boolean>(false)

  // Experience Choices
  const [experienceChoice, setExperienceChoice] = React.useState<string>("Tất cả trải nghiệm")
  const [expDropdownOpen, setExpDropdownOpen] = React.useState<boolean>(false)

  // Transport Specific State
  const [pickupPoint, setPickupPoint] = React.useState<string>("Sân bay Phú Quốc (PQC)")
  const [pickupDropdownOpen, setPickupDropdownOpen] = React.useState<boolean>(false)
  const [serviceType, setServiceType] = React.useState<string>("Đưa đón sân bay")
  const [serviceDropdownOpen, setServiceDropdownOpen] = React.useState<boolean>(false)

  // Close popovers on outside click
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (widgetRef.current && !widgetRef.current.contains(event.target as Node)) {
        setDestPopoverOpen(false)
        setDatePopoverOpen(false)
        setGuestPopoverOpen(false)
        setExpDropdownOpen(false)
        setPickupDropdownOpen(false)
        setServiceDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Filtered Destinations
  const filteredDestinations = React.useMemo(() => {
    return stayeaApi.searchDestinations(destQuery)
  }, [destQuery])

  // Destination verification check
  const isDestinationVerified = React.useMemo(() => {
    const trimmed = destination.trim().toLowerCase()
    if (!trimmed || trimmed === "phú quốc, việt nam" || trimmed.includes("phú quốc")) return true
    return PHU_QUOC_DESTINATIONS.some(
      (d) =>
        d.name.toLowerCase().includes(trimmed) ||
        trimmed.includes(d.name.toLowerCase()) ||
        d.region.toLowerCase().includes(trimmed)
    )
  }, [destination])

  // Guest Summary String
  const guestSummaryString = React.useMemo(() => {
    const totalPeople = guests.adults + guests.children
    const parts: string[] = [`${totalPeople} khách`]
    if (guests.children > 0) {
      parts.push(`(${guests.adults} lớn, ${guests.children} trẻ)`)
    }
    if (guests.rooms > 1) {
      parts.push(`· ${guests.rooms} phòng`)
    }
    return parts.join(" ")
  }, [guests])

  // Nights count
  const nights = React.useMemo(() => calculateNights(startDate, endDate), [startDate, endDate])

  // Calendar Days generator
  const calendarDays = React.useMemo(() => {
    const year = calendarMonth.getFullYear()
    const month = calendarMonth.getMonth()

    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)

    // Day of week in VN (Monday is 0, Sunday is 6)
    let startDayOfWeek = firstDay.getDay() - 1
    if (startDayOfWeek === -1) startDayOfWeek = 6

    const days: { date: Date; currentMonth: boolean; isPast: boolean }[] = []

    // Previous month padding
    const prevMonthLastDay = new Date(year, month, 0).getDate()
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const d = new Date(year, month - 1, prevMonthLastDay - i)
      days.push({ date: d, currentMonth: false, isPast: isBeforeDay(d, today) })
    }

    // Current month days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const d = new Date(year, month, i)
      days.push({ date: d, currentMonth: true, isPast: isBeforeDay(d, today) })
    }

    // Next month padding to fill 35 or 42 cells
    const remaining = 35 - days.length
    if (remaining > 0) {
      for (let i = 1; i <= remaining; i++) {
        const d = new Date(year, month + 1, i)
        days.push({ date: d, currentMonth: false, isPast: false })
      }
    }

    return days
  }, [calendarMonth, today])

  // Handle Date Click
  function handleDateClick(date: Date, isPast: boolean) {
    if (isPast) return

    if (activeTab === "experience") {
      // Single date selection
      setStartDate(date)
      setEndDate(null)
      setDatePopoverOpen(false)
      return
    }

    if (!startDate || (startDate && endDate)) {
      // Starting new range
      setStartDate(date)
      setEndDate(null)
    } else if (isBeforeDay(date, startDate)) {
      setStartDate(date)
      setEndDate(null)
    } else {
      setEndDate(date)
      setDatePopoverOpen(false)
    }
  }

  // Quick Preset Selection
  function applyDatePreset(type: "tomorrow" | "weekend" | "3d2n" | "4d3n") {
    const now = new Date()
    if (type === "tomorrow") {
      const s = new Date(now)
      s.setDate(now.getDate() + 1)
      const e = new Date(now)
      e.setDate(now.getDate() + 2)
      setStartDate(s)
      setEndDate(e)
    } else if (type === "weekend") {
      const s = new Date(now)
      // Find upcoming Friday (5)
      const daysUntilFri = (5 - now.getDay() + 7) % 7 || 7
      s.setDate(now.getDate() + daysUntilFri)
      const e = new Date(s)
      e.setDate(s.getDate() + 2) // Sunday
      setStartDate(s)
      setEndDate(e)
    } else if (type === "3d2n") {
      const s = new Date(now)
      s.setDate(now.getDate() + 3)
      const e = new Date(s)
      e.setDate(s.getDate() + 2)
      setStartDate(s)
      setEndDate(e)
    } else if (type === "4d3n") {
      const s = new Date(now)
      s.setDate(now.getDate() + 5)
      const e = new Date(s)
      e.setDate(s.getDate() + 3)
      setStartDate(s)
      setEndDate(e)
    }
    setDatePopoverOpen(false)
  }

  // Handle Form Search Submit
  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault()

    // Trigger API query in background to pre-warm cache
    if (activeTab === "stay") {
      stayeaApi.getAccommodations({
        search: destination === "Phú Quốc, Việt Nam" ? undefined : destination,
      }).catch(() => {})
    } else if (activeTab === "experience") {
      stayeaApi.getExperiences({
        search: destination === "Phú Quốc, Việt Nam" ? undefined : destination,
      }).catch(() => {})
    } else if (activeTab === "package") {
      stayeaApi.getPackages({
        search: destination === "Phú Quốc, Việt Nam" ? undefined : destination,
      }).catch(() => {})
    }

    if (onNavigate) {
      if (activeTab === "stay") {
        onNavigate("stay", selectedDestObj?.name || destination)
        return
      }
      if (activeTab === "experience") {
        onNavigate("experience")
        return
      }
      if (activeTab === "package") {
        onNavigate("packages")
        return
      }
      if (activeTab === "transport") {
        if (serviceType.includes("máy bay")) {
          onNavigate("flight-booking")
        } else {
          onNavigate("transport")
        }
        return
      }
    }

    // Fallback: smooth scroll on landing page
    let targetId = "#accommodations"
    if (activeTab === "experience") targetId = "#experiences"
    if (activeTab === "transport") targetId = "#transportation"
    if (activeTab === "package") targetId = "#packages"
    const element = document.querySelector(targetId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div
      ref={widgetRef}
      className="w-full bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.22)] p-2.5 sm:p-3 relative z-30"
    >
      {/* 4 Tabs above the inputs inside the white card */}
      <div className="flex items-center gap-1 sm:gap-2 mb-2 sm:mb-2.5 px-1 overflow-x-auto scrollbar-none">
        <button
          type="button"
          onClick={() => {
            setActiveTab("stay")
            setDestPopoverOpen(false)
            setDatePopoverOpen(false)
          }}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
            activeTab === "stay"
              ? "bg-[#0c3b40] text-white shadow-sm"
              : "text-slate-700 hover:text-[#0c3b40] hover:bg-slate-50"
          }`}
        >
          <Bed className={`w-3.5 h-3.5 ${activeTab === "stay" ? "text-amber-400" : "text-[#c29851]"}`} />
          <span>Lưu trú</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab("experience")
            setDestPopoverOpen(false)
            setDatePopoverOpen(false)
          }}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
            activeTab === "experience"
              ? "bg-[#0c3b40] text-white shadow-sm"
              : "text-slate-700 hover:text-[#0c3b40] hover:bg-slate-50"
          }`}
        >
          <Trophy className={`w-3.5 h-3.5 ${activeTab === "experience" ? "text-amber-400" : "text-[#c29851]"}`} />
          <span>Trải nghiệm</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab("package")
            setDestPopoverOpen(false)
            setDatePopoverOpen(false)
          }}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
            activeTab === "package"
              ? "bg-[#0c3b40] text-white shadow-sm"
              : "text-slate-700 hover:text-[#0c3b40] hover:bg-slate-50"
          }`}
        >
          <Luggage className={`w-3.5 h-3.5 ${activeTab === "package" ? "text-amber-400" : "text-[#c29851]"}`} />
          <span>Gói</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab("transport")
            setDestPopoverOpen(false)
            setDatePopoverOpen(false)
          }}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
            activeTab === "transport"
              ? "bg-[#0c3b40] text-white shadow-sm"
              : "text-slate-700 hover:text-[#0c3b40] hover:bg-slate-50"
          }`}
        >
          <Car className={`w-3.5 h-3.5 ${activeTab === "transport" ? "text-amber-400" : "text-[#c29851]"}`} />
          <span>Di chuyển</span>
        </button>
      </div>

      {/* Inputs & search button row */}
      <form
        onSubmit={handleSearchSubmit}
        className="flex flex-col lg:flex-row items-stretch lg:items-center gap-2"
      >
        {/* ========================================================= */}
        {/* CASE 1: TRANSPORT MODE                                    */}
        {/* ========================================================= */}
        {activeTab === "transport" ? (
          <div className="flex-1 flex flex-col md:flex-row items-stretch md:items-center border border-slate-200/90 rounded-xl divide-y md:divide-y-0 md:divide-x divide-slate-200 bg-white">
            {/* Field 1: Điểm đón */}
            <div className="relative px-3.5 py-1.5 flex-1 flex items-center gap-2.5 hover:bg-slate-50/60 rounded-l-xl transition-colors">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <label className="block text-[9.5px] font-medium text-slate-400 uppercase tracking-wider leading-none mb-0.5">
                  Điểm đón
                </label>
                <button
                  type="button"
                  onClick={() => setPickupDropdownOpen(!pickupDropdownOpen)}
                  className="w-full flex items-center justify-between text-left text-[12px] font-semibold text-slate-800 leading-tight"
                >
                  <span className="truncate">{pickupPoint}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1 shrink-0" />
                </button>
              </div>

              {pickupDropdownOpen && (
                <div className="absolute top-full left-0 w-64 mt-2 p-1.5 bg-white rounded-xl shadow-xl border border-slate-100 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Điểm đón phổ biến
                  </div>
                  {[
                    "Sân bay Phú Quốc (PQC)",
                    "Bến tàu cao tốc Bãi Vòng",
                    "Thị trấn Dương Đông",
                    "Bắc đảo Grand World / Vinpearl",
                    "Khu vực Nam đảo An Thới / Bãi Khem",
                  ].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => {
                        setPickupPoint(p)
                        setPickupDropdownOpen(false)
                      }}
                      className="w-full text-left px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:text-[#0c3b40] hover:bg-teal-50/50 rounded-lg flex items-center justify-between"
                    >
                      <span className="truncate">{p}</span>
                      {pickupPoint === p && <Check className="w-3.5 h-3.5 text-teal-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Field 2: Ngày đi (Interactive Date Picker) */}
            <div
              onClick={() => setDatePopoverOpen(!datePopoverOpen)}
              className="px-3.5 py-1.5 flex-1 flex items-center gap-2.5 hover:bg-slate-50/60 transition-colors cursor-pointer"
            >
              <CalendarIcon className="w-4 h-4 text-slate-400 shrink-0" />
              <div>
                <span className="block text-[9.5px] font-medium text-slate-400 uppercase tracking-wider leading-none mb-0.5">
                  Ngày đi
                </span>
                <span className="text-[12px] font-semibold text-slate-800 leading-tight">
                  {startDate ? formatDateVN(startDate) : "Chọn ngày"}
                </span>
              </div>
            </div>

            {/* Field 3: Loại dịch vụ */}
            <div className="relative px-3.5 py-1.5 flex-1 flex items-center gap-2.5 hover:bg-slate-50/60 transition-colors">
              <Car className="w-4 h-4 text-slate-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="block text-[9.5px] font-medium text-slate-400 uppercase tracking-wider leading-none mb-0.5">
                  Loại dịch vụ
                </span>
                <button
                  type="button"
                  onClick={() => setServiceDropdownOpen(!serviceDropdownOpen)}
                  className="w-full flex items-center justify-between text-left text-[12px] font-semibold text-slate-800 leading-tight"
                >
                  <span className="truncate">{serviceType}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1 shrink-0" />
                </button>
              </div>

              {serviceDropdownOpen && (
                <div className="absolute top-full left-0 w-60 mt-2 p-1.5 bg-white rounded-xl shadow-xl border border-slate-100 z-50 animate-in fade-in zoom-in-95">
                  {[
                    "Đưa đón sân bay",
                    "Thuê ô tô tự lái (4 - 7 chỗ)",
                    "Thuê xe máy tay ga",
                    "Tài xế riêng theo ngày",
                    "Đặt vé máy bay khứ hồi Phú Quốc",
                  ].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => {
                        setServiceType(s)
                        setServiceDropdownOpen(false)
                      }}
                      className="w-full text-left px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:text-[#0c3b40] hover:bg-teal-50/50 rounded-lg flex items-center justify-between"
                    >
                      <span>{s}</span>
                      {serviceType === s && <Check className="w-3.5 h-3.5 text-teal-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Field 4: Số khách */}
            <div
              onClick={() => setGuestPopoverOpen(!guestPopoverOpen)}
              className="relative px-3.5 py-1.5 min-w-[130px] flex items-center gap-2.5 hover:bg-slate-50/60 rounded-r-xl transition-colors cursor-pointer"
            >
              <Users className="w-4 h-4 text-slate-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="block text-[9.5px] font-medium text-slate-400 uppercase tracking-wider leading-none mb-0.5">
                  Số khách
                </span>
                <div className="flex items-center justify-between text-left text-[12px] font-semibold text-slate-800 leading-tight">
                  <span className="truncate">{guests.adults + guests.children} khách</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1 shrink-0" />
                </div>
              </div>
            </div>
          </div>
        ) : activeTab === "experience" ? (
          /* ========================================================= */
          /* CASE 2: EXPERIENCE MODE                                   */
          /* ========================================================= */
          <div className="flex-1 flex flex-col md:flex-row items-stretch md:items-center border border-slate-200/90 rounded-xl divide-y md:divide-y-0 md:divide-x divide-slate-200 bg-white">
            {/* Field 1: Điểm đến / Khu vực */}
            <div
              onClick={() => {
                setDestPopoverOpen(true)
                setDatePopoverOpen(false)
                setGuestPopoverOpen(false)
              }}
              className="px-3.5 py-1.5 flex-1 flex items-center gap-2.5 hover:bg-slate-50/60 rounded-l-xl transition-colors cursor-pointer"
            >
              <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="block text-[9.5px] font-medium text-slate-400 uppercase tracking-wider leading-none">
                    Khu vực trải nghiệm
                  </span>
                  {isDestinationVerified && (
                    <span className="inline-flex items-center text-[9px] text-teal-600 font-semibold bg-teal-50 px-1 rounded">
                      ✓ Đã xác thực
                    </span>
                  )}
                </div>
                <div className="text-[12px] font-semibold text-slate-800 leading-tight truncate">
                  {destination || "Toàn đảo Phú Quốc"}
                </div>
              </div>
            </div>

            {/* Field 2: Loại trải nghiệm */}
            <div className="relative px-3.5 py-1.5 flex-1 flex items-center gap-2.5 hover:bg-slate-50/60 transition-colors">
              <Trophy className="w-4 h-4 text-slate-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="block text-[9.5px] font-medium text-slate-400 uppercase tracking-wider leading-none mb-0.5">
                  Loại trải nghiệm
                </span>
                <button
                  type="button"
                  onClick={() => setExpDropdownOpen(!expDropdownOpen)}
                  className="w-full flex items-center justify-between text-left text-[12px] font-semibold text-slate-800 leading-tight"
                >
                  <span className="truncate">{experienceChoice}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1 shrink-0" />
                </button>
              </div>

              {expDropdownOpen && (
                <div className="absolute top-full left-0 w-64 mt-2 p-1.5 bg-white rounded-xl shadow-xl border border-slate-100 z-50 animate-in fade-in zoom-in-95">
                  {[
                    "Tất cả trải nghiệm",
                    "Tour 4 đảo cáp treo Hòn Thơm & Cano cao tốc",
                    "Lặn ngắm san hô Scuba Diving chuyên nghiệp",
                    "Du thuyền hoàng hôn Sunset Cruise ngắm vịnh",
                    "Tour ẩm thực & Chợ đêm Dương Đông",
                    "Khám phá Rừng nguyên sinh & Suối Tranh",
                  ].map((exp) => (
                    <button
                      key={exp}
                      type="button"
                      onClick={() => {
                        setExperienceChoice(exp)
                        setExpDropdownOpen(false)
                      }}
                      className="w-full text-left px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:text-[#0c3b40] hover:bg-teal-50/50 rounded-lg flex items-center justify-between"
                    >
                      <span className="truncate">{exp}</span>
                      {experienceChoice === exp && <Check className="w-3.5 h-3.5 text-teal-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Field 3: Ngày khởi hành */}
            <div
              onClick={() => setDatePopoverOpen(!datePopoverOpen)}
              className="px-3.5 py-1.5 flex-1 flex items-center gap-2.5 hover:bg-slate-50/60 transition-colors cursor-pointer"
            >
              <CalendarIcon className="w-4 h-4 text-slate-400 shrink-0" />
              <div>
                <span className="block text-[9.5px] font-medium text-slate-400 uppercase tracking-wider leading-none mb-0.5">
                  Ngày khởi hành
                </span>
                <span className="text-[12px] font-semibold text-slate-800 leading-tight">
                  {startDate ? formatDateVN(startDate) : "Chọn ngày"}
                </span>
              </div>
            </div>

            {/* Field 4: Số khách */}
            <div
              onClick={() => setGuestPopoverOpen(!guestPopoverOpen)}
              className="relative px-3.5 py-1.5 min-w-[130px] flex items-center gap-2.5 hover:bg-slate-50/60 rounded-r-xl transition-colors cursor-pointer"
            >
              <Users className="w-4 h-4 text-slate-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="block text-[9.5px] font-medium text-slate-400 uppercase tracking-wider leading-none mb-0.5">
                  Số khách
                </span>
                <div className="flex items-center justify-between text-left text-[12px] font-semibold text-slate-800 leading-tight">
                  <span>{guests.adults + guests.children} khách</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1 shrink-0" />
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ========================================================= */
          /* CASE 3: STAY / PACKAGE MODE                               */
          /* ========================================================= */
          <>
            {/* Field: Điểm đến với Autocomplete Popover */}
            <div
              onClick={() => {
                setDestPopoverOpen(true)
                setDatePopoverOpen(false)
                setGuestPopoverOpen(false)
              }}
              className="border border-slate-200/90 rounded-xl px-3 py-1.5 flex-1 min-w-[190px] flex items-center gap-2.5 hover:border-slate-300 transition-colors cursor-pointer relative"
            >
              <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <label className="block text-[9.5px] font-medium text-slate-400 uppercase tracking-wider leading-none">
                    Điểm đến
                  </label>
                  {isDestinationVerified && (
                    <span className="inline-flex items-center text-[9px] text-teal-600 font-semibold bg-teal-50 px-1 rounded">
                      ✓ Đã xác thực
                    </span>
                  )}
                </div>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => {
                    setDestination(e.target.value)
                    setDestQuery(e.target.value)
                    setDestPopoverOpen(true)
                  }}
                  onFocus={() => {
                    setDestPopoverOpen(true)
                    setDestQuery("")
                  }}
                  className="w-full bg-transparent text-[12.5px] font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none leading-tight"
                  placeholder="Chọn khu vực Phú Quốc..."
                />
              </div>
              {destination && destination !== "Phú Quốc, Việt Nam" && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setDestination("Phú Quốc, Việt Nam")
                    setSelectedDestObj(null)
                    setDestQuery("")
                  }}
                  className="text-slate-400 hover:text-slate-600 p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Field: Chọn Ngày Nhận & Trả Phòng */}
            <div
              onClick={() => {
                setDatePopoverOpen(!datePopoverOpen)
                setDestPopoverOpen(false)
                setGuestPopoverOpen(false)
              }}
              className="border border-slate-200/90 rounded-xl px-3 py-1.5 flex items-center gap-2 sm:gap-3 hover:border-slate-300 transition-colors shrink-0 cursor-pointer"
            >
              {/* Nhận phòng */}
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <div>
                  <span className="block text-[9.5px] font-medium text-slate-400 uppercase tracking-wider leading-none mb-0.5">
                    Nhận phòng
                  </span>
                  <span className="text-[12px] font-semibold text-slate-700 leading-tight">
                    {startDate ? formatShortDateVN(startDate) : "Chọn ngày"}
                  </span>
                </div>
              </div>

              {/* Nights indicator pill */}
              <div className="flex items-center gap-1.5">
                <div className="w-px h-6 bg-slate-200 shrink-0" />
                {nights > 0 && (
                  <span className="text-[10px] font-bold text-[#0c3b40] bg-teal-50 px-1.5 py-0.5 rounded-full border border-teal-200/60 shrink-0">
                    {nights} đêm
                  </span>
                )}
                <div className="w-px h-6 bg-slate-200 shrink-0" />
              </div>

              {/* Trả phòng */}
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <div>
                  <span className="block text-[9.5px] font-medium text-slate-400 uppercase tracking-wider leading-none mb-0.5">
                    Trả phòng
                  </span>
                  <span className="text-[12px] font-semibold text-slate-700 leading-tight">
                    {endDate ? formatShortDateVN(endDate) : "Chọn ngày"}
                  </span>
                </div>
              </div>

              <div className="w-px h-6 bg-slate-200 shrink-0" />

              {/* Khách */}
              <div
                onClick={(e) => {
                  e.stopPropagation()
                  setGuestPopoverOpen(!guestPopoverOpen)
                  setDatePopoverOpen(false)
                  setDestPopoverOpen(false)
                }}
                className="flex items-center gap-1.5 text-left"
              >
                <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <div>
                  <span className="block text-[9.5px] font-medium text-slate-400 uppercase tracking-wider leading-none mb-0.5">
                    Khách & Phòng
                  </span>
                  <span className="text-[12px] font-semibold text-slate-800 leading-tight">
                    {guests.adults + guests.children} khách · {guests.rooms}P
                  </span>
                </div>
                <ChevronDown className="w-3 h-3 text-slate-400 ml-1" />
              </div>
            </div>
          </>
        )}

        {/* Search CTA Button */}
        <div className="shrink-0">
          <button
            type="submit"
            className="w-full lg:w-auto px-6 py-2.5 min-h-[38px] flex items-center justify-center gap-2 rounded-xl bg-[#0c3b40] hover:bg-[#08292d] text-white text-xs font-semibold shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
          >
            <Search className="w-4 h-4 text-amber-400" />
            <span>Tìm kiếm</span>
          </button>
        </div>
      </form>

      {/* ========================================================= */}
      {/* POPOVER 1: DESTINATION AUTOCOMPLETE / VERIFICATION        */}
      {/* ========================================================= */}
      {destPopoverOpen && (
        <div className="absolute top-full left-0 w-full sm:w-[480px] max-w-[calc(100vw-2rem)] mt-2 p-3 bg-white rounded-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35)] border border-slate-100 z-50 animate-in fade-in zoom-in-95">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2.5">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Điểm đến tuyển chọn tại Phú Quốc
              </span>
            </div>
            <button
              type="button"
              onClick={() => setDestPopoverOpen(false)}
              className="text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick preset chips */}
          <div className="flex items-center gap-1.5 mb-2.5 overflow-x-auto scrollbar-none pb-0.5">
            {[
              "Toàn đảo Phú Quốc",
              "Bãi Trường",
              "Dương Đông",
              "Bãi Khem",
              "An Thới",
              "Gành Dầu",
            ].map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => {
                  setDestination(chip === "Toàn đảo Phú Quốc" ? "Phú Quốc, Việt Nam" : `${chip}, Phú Quốc`)
                  setDestPopoverOpen(false)
                }}
                className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 hover:bg-[#0c3b40] hover:text-white transition-colors shrink-0"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Destination items list */}
          <div className="max-h-[180px] overflow-y-auto space-y-1 pr-1 scrollbar-thin">
            {filteredDestinations.map((dest) => (
              <button
                key={dest.id}
                type="button"
                onClick={() => {
                  setDestination(`${dest.name}, Phú Quốc`)
                  setSelectedDestObj(dest)
                  setDestPopoverOpen(false)
                }}
                className="w-full text-left p-2 rounded-xl hover:bg-teal-50/50 transition-colors flex items-start gap-3 border border-transparent hover:border-teal-200/60 group"
              >
                <div className="w-8 h-8 rounded-lg bg-teal-100/60 text-[#0c3b40] flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-[#0c3b40] group-hover:text-amber-300 transition-colors">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800 group-hover:text-[#0c3b40]">
                      {dest.name}
                    </span>
                    <span className="text-[10px] font-semibold text-teal-700 bg-teal-100/50 px-1.5 py-0.2 rounded">
                      {dest.region}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                    {dest.description}
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
                    <span>{dest.accommodationsCount} lưu trú cao cấp</span>
                    <span>·</span>
                    <span>{dest.experiencesCount} trải nghiệm</span>
                  </div>
                </div>
                <Check
                  className={`w-4 h-4 text-teal-600 shrink-0 self-center ${
                    destination.includes(dest.name) ? "opacity-100" : "opacity-0"
                  }`}
                />
              </button>
            ))}
            {filteredDestinations.length === 0 && (
              <div className="text-center py-6 text-slate-400 text-xs">
                Không tìm thấy địa điểm phù hợp. Bạn có thể chọn "Toàn đảo Phú Quốc".
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* POPOVER 2: DATE RANGE PICKER CALENDAR                     */}
      {/* ========================================================= */}
      {datePopoverOpen && (
        <div className="absolute top-full right-0 lg:right-auto lg:left-[240px] w-full sm:w-[380px] max-w-[calc(100vw-2rem)] mt-2 p-3.5 bg-white rounded-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35)] border border-slate-100 z-50 animate-in fade-in zoom-in-95">
          {/* Calendar Header with navigation */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <div className="text-xs font-bold text-slate-900">
                {MONTH_NAMES[calendarMonth.getMonth()]} {calendarMonth.getFullYear()}
              </div>
              <div className="text-[11px] text-slate-500 font-medium">
                {startDate && endDate ? (
                  <span className="text-[#0c3b40] font-semibold">
                    {formatDateVN(startDate)} → {formatDateVN(endDate)} ({nights} đêm)
                  </span>
                ) : startDate ? (
                  <span>Chọn ngày trả phòng (sau {formatDateVN(startDate)})</span>
                ) : (
                  <span>Chọn ngày nhận phòng</span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => {
                  const prev = new Date(calendarMonth)
                  prev.setMonth(prev.getMonth() - 1)
                  setCalendarMonth(prev)
                }}
                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  const next = new Date(calendarMonth)
                  next.setMonth(next.getMonth() + 1)
                  setCalendarMonth(next)
                }}
                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick presets row */}
          <div className="grid grid-cols-2 gap-1.5 my-2">
            <button
              type="button"
              onClick={() => applyDatePreset("tomorrow")}
              className="text-[10.5px] font-medium py-1 px-2 rounded-lg bg-slate-50 hover:bg-teal-50 hover:text-[#0c3b40] text-slate-700 transition-colors text-left"
            >
              ⚡ Hôm nay - Ngày mai (1 đêm)
            </button>
            <button
              type="button"
              onClick={() => applyDatePreset("weekend")}
              className="text-[10.5px] font-medium py-1 px-2 rounded-lg bg-slate-50 hover:bg-teal-50 hover:text-[#0c3b40] text-slate-700 transition-colors text-left"
            >
              🌴 Cuối tuần này (T6 - CN)
            </button>
            <button
              type="button"
              onClick={() => applyDatePreset("3d2n")}
              className="text-[10.5px] font-medium py-1 px-2 rounded-lg bg-slate-50 hover:bg-teal-50 hover:text-[#0c3b40] text-slate-700 transition-colors text-left"
            >
              🌊 3 ngày 2 đêm tuần sau
            </button>
            <button
              type="button"
              onClick={() => applyDatePreset("4d3n")}
              className="text-[10.5px] font-medium py-1 px-2 rounded-lg bg-slate-50 hover:bg-teal-50 hover:text-[#0c3b40] text-slate-700 transition-colors text-left"
            >
              ✨ 4 ngày 3 đêm trọn gói
            </button>
          </div>

          {/* Day of Week Labels */}
          <div className="grid grid-cols-7 gap-1 text-center mb-1">
            {DAY_LABELS.map((d) => (
              <span key={d} className="text-[10px] font-bold text-slate-400 py-1">
                {d}
              </span>
            ))}
          </div>

          {/* Day Cells Grid */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {calendarDays.map((cell) => {
              const isStart = isSameDay(cell.date, startDate)
              const isEnd = isSameDay(cell.date, endDate)
              const isInRange =
                startDate &&
                endDate &&
                cell.date.getTime() > startDate.getTime() &&
                cell.date.getTime() < endDate.getTime()
              const isToday = isSameDay(cell.date, today)

              return (
                <button
                  key={cell.date.toISOString()}
                  type="button"
                  disabled={cell.isPast}
                  onClick={() => handleDateClick(cell.date, cell.isPast)}
                  className={`h-7 text-xs rounded-lg transition-all flex items-center justify-center relative font-medium ${
                    cell.isPast
                      ? "text-slate-300 cursor-not-allowed"
                      : isStart || isEnd
                      ? "bg-[#0c3b40] text-white font-bold ring-2 ring-amber-400 z-10 shadow-sm"
                      : isInRange
                      ? "bg-teal-50 text-[#0c3b40] font-semibold rounded-none"
                      : cell.currentMonth
                      ? "text-slate-700 hover:bg-teal-100/50"
                      : "text-slate-300"
                  }`}
                >
                  <span>{cell.date.getDate()}</span>
                  {isToday && !isStart && !isEnd && (
                    <span className="absolute bottom-0.5 w-1 h-1 bg-amber-500 rounded-full" />
                  )}
                </button>
              )
            })}
          </div>

          {/* Popover Footer actions */}
          <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                setStartDate(null)
                setEndDate(null)
              }}
              className="text-xs text-slate-500 hover:text-slate-800 font-medium px-2 py-1"
            >
              Xoá ngày
            </button>
            <button
              type="button"
              onClick={() => setDatePopoverOpen(false)}
              className="text-xs font-semibold px-4 py-1.5 rounded-lg bg-[#0c3b40] text-white hover:bg-[#08292d] transition-colors"
            >
              Áp dụng
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* POPOVER 3: GUEST & ROOM COUNTER POPPER                    */}
      {/* ========================================================= */}
      {guestPopoverOpen && (
        <div className="absolute top-full right-0 w-72 max-w-[calc(100vw-2rem)] mt-2 p-3 bg-white rounded-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35)] border border-slate-100 z-50 animate-in fade-in zoom-in-95">
          <div className="text-xs font-bold text-slate-800 uppercase tracking-wider pb-2 border-b border-slate-100 mb-2">
            Số lượng khách & Phòng
          </div>

          <div className="space-y-3">
            {/* Người lớn */}
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-slate-800">Người lớn</div>
                <div className="text-[10px] text-slate-400">Từ 13 tuổi trở lên</div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={guests.adults <= 1}
                  onClick={() => setGuests((g) => ({ ...g, adults: Math.max(1, g.adults - 1) }))}
                  className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-5 text-center text-xs font-bold text-slate-800">
                  {guests.adults}
                </span>
                <button
                  type="button"
                  disabled={guests.adults >= 16}
                  onClick={() => setGuests((g) => ({ ...g, adults: g.adults + 1 }))}
                  className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-100 disabled:opacity-30"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Trẻ em */}
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-slate-800">Trẻ em</div>
                <div className="text-[10px] text-slate-400">Từ 2 - 12 tuổi</div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={guests.children <= 0}
                  onClick={() => setGuests((g) => ({ ...g, children: Math.max(0, g.children - 1) }))}
                  className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-5 text-center text-xs font-bold text-slate-800">
                  {guests.children}
                </span>
                <button
                  type="button"
                  disabled={guests.children >= 10}
                  onClick={() => setGuests((g) => ({ ...g, children: g.children + 1 }))}
                  className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-100 disabled:opacity-30"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Em bé */}
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-slate-800">Em bé</div>
                <div className="text-[10px] text-slate-400">Dưới 2 tuổi</div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={guests.infants <= 0}
                  onClick={() => setGuests((g) => ({ ...g, infants: Math.max(0, g.infants - 1) }))}
                  className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-5 text-center text-xs font-bold text-slate-800">
                  {guests.infants}
                </span>
                <button
                  type="button"
                  disabled={guests.infants >= 5}
                  onClick={() => setGuests((g) => ({ ...g, infants: g.infants + 1 }))}
                  className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-100 disabled:opacity-30"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Phòng */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <div>
                <div className="text-xs font-semibold text-slate-800">Số lượng phòng</div>
                <div className="text-[10px] text-slate-400">Phòng lưu trú</div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={guests.rooms <= 1}
                  onClick={() => setGuests((g) => ({ ...g, rooms: Math.max(1, g.rooms - 1) }))}
                  className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-5 text-center text-xs font-bold text-slate-800">
                  {guests.rooms}
                </span>
                <button
                  type="button"
                  disabled={guests.rooms >= 8}
                  onClick={() => setGuests((g) => ({ ...g, rooms: g.rooms + 1 }))}
                  className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-100 disabled:opacity-30"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setGuestPopoverOpen(false)}
            className="w-full mt-3 py-1.5 rounded-lg bg-[#0c3b40] text-white text-xs font-semibold hover:bg-[#08292d] transition-colors"
          >
            Xong ({guestSummaryString})
          </button>
        </div>
      )}
    </div>
  )
}
