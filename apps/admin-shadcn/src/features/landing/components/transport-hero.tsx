"use client"

import * as React from "react"
import Image from "next/image"
import {
  Zap,
  ShieldCheck,
  Tag,
  Headphones,
  MapPin,
  Calendar,
  Car,
  User,
  Search,
  ChevronDown,
} from "lucide-react"
import { TRANSPORT_HERO_BADGES } from "@/features/landing/data/stayea-mock-data"

interface TransportHeroProps {
  readonly onSearch?: (params: {
    pickup: string
    date: string
    serviceType: string
    guests: string
  }) => void
}

export function TransportHero({ onSearch }: TransportHeroProps) {
  const [pickup, setPickup] = React.useState("Sân bay Phú Quốc")
  const [date, setDate] = React.useState("2026-10-20")
  const [serviceType, setServiceType] = React.useState("Tất cả dịch vụ")
  const [guests, setGuests] = React.useState("1 khách")

  function handleSearchClick(e: React.FormEvent) {
    e.preventDefault()
    onSearch?.({ pickup, date, serviceType, guests })
  }

  return (
    <section className="relative w-full pt-28 pb-16 lg:pt-32 lg:pb-20 overflow-hidden bg-slate-900 text-white">
      {/* Background Hero Image with Coastal Road & Airplane Atmosphere */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/transport/hero-transport.jpg"
          alt="Di chuyển Phú Quốc"
          fill
          unoptimized
          priority
          className="object-cover object-center scale-105 transform motion-safe:transition-transform duration-1000"
        />
        {/* Cinematic gradient overlay matching reference palette */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#071E33]/90 via-[#0A2E4D]/75 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/40" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Text Content & Calligraphy */}
        <div className="relative max-w-3xl">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[11px] font-semibold tracking-widest uppercase text-teal-300 mb-4">
            PHÚ QUỐC, VIỆT NAM
          </div>

          {/* Headline H1 */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-[1.15] tracking-tight mb-4 drop-shadow-md">
            Di chuyển dễ dàng <br className="hidden sm:inline" />
            tại Phú Quốc
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base md:text-lg text-slate-200 max-w-2xl font-normal leading-relaxed drop-shadow">
            Đặt dịch vụ di chuyển thuận tiện, an toàn, linh hoạt để khám phá trọn vẹn đảo ngọc theo cách của bạn.
          </p>

          {/* Left Cursive Calligraphy: More Than a Trip */}
          <div className="mt-6 flex items-center gap-3">
            <span className="font-serif italic text-2xl sm:text-3xl text-teal-200/90 font-medium tracking-wide drop-shadow-sm select-none">
              More Than a Trip
            </span>
          </div>
        </div>

        {/* Right Cursive Calligraphy (Floating on Desktop) */}
        <div className="hidden lg:block absolute right-8 top-12 text-right pointer-events-none select-none">
          <p className="font-serif italic text-2xl xl:text-3xl text-white/80 leading-snug drop-shadow-md">
            Good Journeys <br />
            Brighter Memories
          </p>
        </div>

        {/* 4 Frosted Value Badges */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-4xl">
          {TRANSPORT_HERO_BADGES.map((badge) => {
            return (
              <div
                key={badge.title}
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 text-white shadow-sm hover:bg-white/20 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-teal-500/20 border border-teal-300/30 flex items-center justify-center shrink-0 text-teal-300">
                  {badge.icon === "zap" && <Zap className="w-4 h-4" />}
                  {badge.icon === "shield-check" && <ShieldCheck className="w-4 h-4" />}
                  {badge.icon === "tag" && <Tag className="w-4 h-4" />}
                  {badge.icon === "headphones" && <Headphones className="w-4 h-4" />}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold leading-tight truncate">{badge.title}</div>
                  <div className="text-[11px] text-slate-300 leading-tight truncate">{badge.desc}</div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Floating Search Bar (Centered Overlap) */}
        <div className="mt-8">
          <form
            onSubmit={handleSearchClick}
            className="bg-white rounded-2xl shadow-2xl p-2.5 sm:p-3 text-slate-800 border border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 items-center"
          >
            {/* 1. Điểm đón */}
            <div className="px-3.5 py-2 hover:bg-slate-50 rounded-xl transition-colors border border-transparent hover:border-slate-200">
              <label className="text-[11px] font-medium text-slate-400 block leading-none mb-1">
                Điểm đón
              </label>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-teal-600 shrink-0" />
                <input
                  type="text"
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                  placeholder="Chọn điểm đón"
                  className="w-full text-xs sm:text-sm font-semibold text-slate-800 bg-transparent outline-none placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* 2. Ngày đi */}
            <div className="px-3.5 py-2 hover:bg-slate-50 rounded-xl transition-colors border border-transparent hover:border-slate-200">
              <label className="text-[11px] font-medium text-slate-400 block leading-none mb-1">
                Ngày đi
              </label>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-teal-600 shrink-0" />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full text-xs sm:text-sm font-semibold text-slate-800 bg-transparent outline-none cursor-pointer"
                />
              </div>
            </div>

            {/* 3. Loại dịch vụ */}
            <div className="px-3.5 py-2 hover:bg-slate-50 rounded-xl transition-colors border border-transparent hover:border-slate-200 relative">
              <label className="text-[11px] font-medium text-slate-400 block leading-none mb-1">
                Loại dịch vụ
              </label>
              <div className="flex items-center justify-between gap-1">
                <div className="flex items-center gap-2 min-w-0">
                  <Car className="w-4 h-4 text-teal-600 shrink-0" />
                  <select
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value)}
                    className="w-full text-xs sm:text-sm font-semibold text-slate-800 bg-transparent outline-none cursor-pointer truncate"
                  >
                    <option value="Tất cả dịch vụ">Tất cả dịch vụ</option>
                    <option value="Đưa đón sân bay">Đưa đón sân bay</option>
                    <option value="Thuê ô tô">Thuê ô tô</option>
                    <option value="Thuê xe máy">Thuê xe máy</option>
                    <option value="Tài xế riêng">Tài xế riêng</option>
                  </select>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 pointer-events-none" />
              </div>
            </div>

            {/* 4. Số khách */}
            <div className="px-3.5 py-2 hover:bg-slate-50 rounded-xl transition-colors border border-transparent hover:border-slate-200">
              <label className="text-[11px] font-medium text-slate-400 block leading-none mb-1">
                Số khách
              </label>
              <div className="flex items-center justify-between gap-1">
                <div className="flex items-center gap-2 min-w-0">
                  <User className="w-4 h-4 text-teal-600 shrink-0" />
                  <select
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    className="w-full text-xs sm:text-sm font-semibold text-slate-800 bg-transparent outline-none cursor-pointer truncate"
                  >
                    <option value="1 khách">1 khách</option>
                    <option value="2 khách">2 khách</option>
                    <option value="3-4 khách">3 - 4 khách</option>
                    <option value="5-7 khách">5 - 7 khách</option>
                    <option value="Nhóm đông người">Nhóm đông người</option>
                  </select>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 pointer-events-none" />
              </div>
            </div>

            {/* 5. Nút Tìm kiếm */}
            <div className="p-1 sm:col-span-2 lg:col-span-1">
              <button
                type="submit"
                className="w-full h-12 rounded-xl bg-[#0A2239] hover:bg-[#071626] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-[0.99]"
              >
                <Search className="w-4 h-4" />
                <span>Tìm kiếm</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
