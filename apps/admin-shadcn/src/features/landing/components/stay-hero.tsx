"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { MapPin, Calendar, Users, ChevronDown, Search } from "lucide-react"

interface StayHeroProps {
  readonly onSearch?: (params: { destination: string; guests: string }) => void
}

export function StayHero({ onSearch }: StayHeroProps) {
  const [destination, setDestination] = React.useState("Phú Quốc, Việt Nam")
  const [checkIn, setCheckIn] = React.useState("Chọn ngày")
  const [checkOut, setCheckOut] = React.useState("Chọn ngày")
  const [guests, setGuests] = React.useState("2 khách")
  const [guestDropdownOpen, setGuestDropdownOpen] = React.useState(false)

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch?.({ destination, guests })
  }

  return (
    <section className="relative z-20 w-full overflow-visible bg-slate-900 min-h-[380px] sm:min-h-[420px] lg:min-h-[460px]">
      {/* Background Image with Dark Contrast Overlays */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <Image
          src="/homepagemainbanner.png"
          alt="Tất cả lưu trú tại Phú Quốc"
          fill
          priority
          unoptimized
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/35" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-7 sm:pt-9 lg:pt-10 pb-8 sm:pb-10 flex flex-col justify-between min-h-[380px] sm:min-h-[420px] lg:min-h-[460px]">
        {/* Top Area: Breadcrumbs + Right Slogan */}
        <div className="flex items-start justify-between gap-4">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="text-xs text-white/80 flex items-center gap-1.5 font-medium drop-shadow-sm">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span className="text-white/50">&gt;</span>
            <span className="text-white">Lưu trú</span>
          </nav>

          {/* Right Slogan Calligraphy */}
          <div className="hidden md:block text-right text-[#e8c783] font-script-vi text-2xl lg:text-3xl leading-snug drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] -rotate-[2deg]">
            Những nơi lưu trú<br />
            tạo nên kỳ nghỉ đáng nhớ
          </div>
        </div>

        {/* Middle Area: Headline + Subtitle + Script Accent */}
        <div className="my-auto py-4 sm:py-6 max-w-3xl space-y-3">
          <h1 className="font-sans text-3xl sm:text-4xl lg:text-[46px] font-bold text-white tracking-tight leading-[1.15] drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]">
            Tất cả lưu trú<br />
            tại Phú Quốc
          </h1>
          <p className="text-white/95 text-xs sm:text-sm leading-relaxed max-w-2xl drop-shadow-[0_1px_6px_rgba(0,0,0,0.85)]">
            Khám phá villas, căn hộ, homestays, khách sạn, lưu trú dài hạn và những lựa chọn được tuyển chọn kỹ lưỡng tại đảo ngọc Phú Quốc.
          </p>
          <div className="text-white/90 font-script-vi text-2xl sm:text-3xl drop-shadow pt-1">
            More Than a Trip
          </div>
        </div>

        {/* Bottom Area: Embedded Integrated Search Bar */}
        <div className="w-full max-w-[960px] bg-white rounded-2xl shadow-[0_12px_32px_rgba(0,0,0,0.22)] p-2 sm:p-2.5 border border-white/60">
          <form onSubmit={handleSearchSubmit} className="flex flex-col lg:flex-row items-stretch lg:items-center gap-2">
            {/* Field 1: Điểm đến */}
            <div className="flex-1 min-w-[200px] px-3.5 py-1.5 flex items-center gap-2.5 rounded-xl hover:bg-slate-50 transition-colors">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="block text-[9.5px] font-medium text-slate-400 uppercase tracking-wider leading-none mb-0.5">
                  Điểm đến
                </span>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full bg-transparent text-[12.5px] font-semibold text-slate-800 focus:outline-none leading-tight"
                  placeholder="Nhập địa điểm..."
                />
              </div>
            </div>

            <div className="hidden lg:block w-px h-8 bg-slate-200" />

            {/* Field 2: Ngày nhận phòng */}
            <div
              onClick={() => setCheckIn(checkIn === "Chọn ngày" ? "15/11/2026" : "Chọn ngày")}
              className="px-3.5 py-1.5 min-w-[150px] flex items-center gap-2.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
              <div>
                <span className="block text-[9.5px] font-medium text-slate-400 uppercase tracking-wider leading-none mb-0.5">
                  Ngày nhận phòng
                </span>
                <span className="text-[12px] font-semibold text-slate-800 leading-tight">
                  {checkIn}
                </span>
              </div>
            </div>

            <div className="hidden lg:block w-px h-8 bg-slate-200" />

            {/* Field 3: Ngày trả phòng */}
            <div
              onClick={() => setCheckOut(checkOut === "Chọn ngày" ? "18/11/2026" : "Chọn ngày")}
              className="px-3.5 py-1.5 min-w-[150px] flex items-center gap-2.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
              <div>
                <span className="block text-[9.5px] font-medium text-slate-400 uppercase tracking-wider leading-none mb-0.5">
                  Ngày trả phòng
                </span>
                <span className="text-[12px] font-semibold text-slate-800 leading-tight">
                  {checkOut}
                </span>
              </div>
            </div>

            <div className="hidden lg:block w-px h-8 bg-slate-200" />

            {/* Field 4: Khách */}
            <div className="relative px-3.5 py-1.5 min-w-[140px] flex items-center gap-2.5 rounded-xl hover:bg-slate-50 transition-colors">
              <Users className="w-4 h-4 text-slate-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="block text-[9.5px] font-medium text-slate-400 uppercase tracking-wider leading-none mb-0.5">
                  Khách
                </span>
                <button
                  type="button"
                  onClick={() => setGuestDropdownOpen(!guestDropdownOpen)}
                  className="w-full flex items-center justify-between text-left text-[12px] font-semibold text-slate-800 leading-tight"
                >
                  <span>{guests}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1 shrink-0" />
                </button>
              </div>

              {guestDropdownOpen && (
                <div className="absolute top-full right-0 w-36 mt-2 p-1.5 bg-white rounded-xl shadow-xl border border-slate-100 z-50 animate-in fade-in zoom-in-95">
                  {["1 khách", "2 khách", "3 - 4 khách", "5+ khách"].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => {
                        setGuests(g)
                        setGuestDropdownOpen(false)
                      }}
                      className="w-full text-left px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:text-[#0c3b40] hover:bg-teal-50/50 rounded-lg"
                    >
                      {g}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Search Button */}
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#0c3b40] hover:bg-[#08292d] text-white text-xs font-semibold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 shrink-0 active:scale-95"
            >
              <Search className="w-4 h-4" />
              <span>Tìm kiếm</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
