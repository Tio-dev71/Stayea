"use client"

import * as React from "react"
import Image from "next/image"
import { ShieldCheck, Clock, Headphones, CreditCard, ChevronRight } from "lucide-react"

export interface StayeaFlightBookingHeroProps {
  readonly onNavigateBreadcrumb?: (target: string) => void
}

export const StayeaFlightBookingHero: React.FC<StayeaFlightBookingHeroProps> = ({
  onNavigateBreadcrumb,
}) => {
  return (
    <section className="relative w-full h-[230px] sm:h-[260px] md:h-[280px] overflow-hidden bg-slate-900 select-none">
      {/* 1. Background Cover Panorama with Tropical Island, Blue Sky & Stayea Airplane */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/homepagemainbanner.png"
          alt="Đặt vé máy bay đến Phú Quốc"
          fill
          unoptimized
          priority
          className="object-cover object-center"
        />
        {/* Gradients to match the screenshot atmosphere */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-950/65 via-blue-900/35 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />
      </div>

      {/* 2. Content Container */}
      <div className="relative z-10 w-full h-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-between py-5 sm:py-6 text-white">
        {/* Top: Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-xs text-white/85 font-medium"
        >
          <button
            type="button"
            onClick={() => onNavigateBreadcrumb?.("home")}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Trang chủ
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-white/60" />
          <button
            type="button"
            onClick={() => onNavigateBreadcrumb?.("transport")}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Di chuyển
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-white/60" />
          <span className="text-white font-semibold">Máy bay</span>
        </nav>

        {/* Center: Heading & Slogan */}
        <div className="flex items-end justify-between">
          <div className="space-y-1 sm:space-y-1.5 max-w-2xl">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white drop-shadow-md">
              Đặt vé máy bay đến Phú Quốc
            </h1>
            <p className="text-white/95 text-xs sm:text-sm md:text-base font-normal drop-shadow-sm leading-relaxed">
              Bay dễ dàng – Khởi hành trọn vẹn
            </p>
          </div>

          {/* Right Cursive Calligraphy: More Than a Trip ♡ */}
          <div className="hidden md:flex flex-col items-end pr-2 pb-1">
            <div
              className="text-white text-2xl xl:text-3xl leading-tight text-right drop-shadow-lg"
              style={{ fontFamily: 'Georgia, "Brush Script MT", cursive, serif' }}
            >
              <p className="italic">More</p>
              <p className="italic flex items-center gap-1.5 justify-end">
                <span>Than a Trip</span>
                <span className="text-xl">♡</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom: 4 Benefit Badges Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 pt-1 border-t border-white/15">
          {/* 1. Giá tốt nhất */}
          <div className="flex items-center gap-2 text-white">
            <ShieldCheck className="w-4 h-4 text-white/90 shrink-0" />
            <div className="leading-tight">
              <span className="block text-xs font-bold">Giá tốt nhất</span>
              <span className="block text-[11px] text-white/80">Cam kết cạnh tranh</span>
            </div>
          </div>

          {/* 2. Đặt vé nhanh chóng */}
          <div className="flex items-center gap-2 text-white">
            <Clock className="w-4 h-4 text-white/90 shrink-0" />
            <div className="leading-tight">
              <span className="block text-xs font-bold">Đặt vé nhanh chóng</span>
              <span className="block text-[11px] text-white/80">Chỉ trong vài phút</span>
            </div>
          </div>

          {/* 3. Hỗ trợ 24/7 */}
          <div className="flex items-center gap-2 text-white">
            <Headphones className="w-4 h-4 text-white/90 shrink-0" />
            <div className="leading-tight">
              <span className="block text-xs font-bold">Hỗ trợ 24/7</span>
              <span className="block text-[11px] text-white/80">Đồng hành cùng bạn</span>
            </div>
          </div>

          {/* 4. Thanh toán an toàn */}
          <div className="flex items-center gap-2 text-white">
            <CreditCard className="w-4 h-4 text-white/90 shrink-0" />
            <div className="leading-tight">
              <span className="block text-xs font-bold">Thanh toán an toàn</span>
              <span className="block text-[11px] text-white/80">Bảo mật thông tin</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
