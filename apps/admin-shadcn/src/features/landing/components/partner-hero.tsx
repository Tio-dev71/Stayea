"use client"

import Image from "next/image"
import { ArrowRight, Users, BarChart3, Handshake, ShieldCheck } from "lucide-react"

function scrollToForm() {
  const el = document.querySelector("#partner-register-form")
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" })
  }
}

function scrollToBenefits() {
  const el = document.querySelector("#partner-benefits")
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" })
  }
}

export function PartnerHero() {
  return (
    <section className="relative w-full overflow-hidden bg-slate-900 min-h-[560px] sm:min-h-[620px] lg:min-h-[660px]">
      {/* Background Image: Luxury infinity pool villa in sunset Phu Quoc */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src="/homepagemainbanner.png"
          alt="Hợp tác cùng STAYEA"
          fill
          priority
          unoptimized
          className="object-cover object-center"
        />
        {/* Cinematic gradient overlays for maximum text legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-black/35" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/65 via-black/25 to-transparent" />
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 lg:pt-20 pb-10 flex flex-col justify-between min-h-[560px] sm:min-h-[620px] lg:min-h-[660px]">
        {/* Main Hero Header */}
        <div className="max-w-2xl text-white space-y-4">
          <span className="inline-block text-[11px] sm:text-xs font-semibold uppercase tracking-[0.24em] text-white/90 drop-shadow">
            CÙNG KIẾN TẠO NHỮNG HÀNH TRÌNH Ý NGHĨA
          </span>

          <h1 className="font-sans text-3xl sm:text-5xl lg:text-[52px] font-bold text-white leading-[1.12] tracking-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]">
            Hợp tác cùng STAYEA
          </h1>

          <div className="space-y-2">
            <h2 className="text-white text-sm sm:text-base lg:text-lg font-medium leading-snug drop-shadow-[0_1px_8px_rgba(0,0,0,0.85)]">
              Kết nối giá trị – cùng phát triển du lịch Phú Quốc theo cách tinh tế, minh bạch và bền vững.
            </h2>
            <p className="text-white/90 text-xs sm:text-sm font-normal leading-relaxed max-w-xl drop-shadow-[0_1px_6px_rgba(0,0,0,0.85)]">
              STAYEA hợp tác với các đối tác lưu trú, trải nghiệm, di chuyển, ẩm thực, spa & wellness và các dịch vụ bản địa để cùng tạo ra hành trình trọn vẹn cho du khách.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={scrollToForm}
              className="px-6 py-2.5 rounded-full bg-[#d4a359] hover:bg-[#c69a58] text-white text-xs sm:text-sm font-semibold transition-all shadow-md inline-flex items-center gap-2 group active:scale-95"
            >
              <span>Đăng ký hợp tác</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>

            <button
              type="button"
              onClick={scrollToBenefits}
              className="px-6 py-2.5 rounded-full border border-white/70 hover:border-white bg-black/25 hover:bg-white/10 text-white text-xs sm:text-sm font-medium transition-all backdrop-blur-xs active:scale-95"
            >
              Tìm hiểu quyền lợi
            </button>
          </div>
        </div>

        {/* Bottom Bar: 4 Value Pillars & Script Callout */}
        <div className="pt-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          {/* 4 Value Pillars */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 lg:gap-8 text-white/95 text-xs sm:text-[13px] font-medium drop-shadow">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#e8c783] shrink-0" />
              <span>Tiếp cận khách hàng chất lượng</span>
            </div>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#e8c783] shrink-0" />
              <span>Truyền thông & bán hàng hiệu quả</span>
            </div>
            <div className="flex items-center gap-2">
              <Handshake className="w-4 h-4 text-[#e8c783] shrink-0" />
              <span>Đồng hành triển khai tận tâm</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#e8c783] shrink-0" />
              <span>Minh bạch – rõ ràng – bền vững</span>
            </div>
          </div>

          {/* Bottom Right Callout */}
          <div className="text-right text-white space-y-0.5 shrink-0 self-end">
            <div className="font-script-vi text-2xl sm:text-3xl text-[#e8c783] drop-shadow -rotate-[3deg] leading-tight">
              Phú Quốc
              <br />
              Đẹp hơn
              <br />
              khi cùng nhau
            </div>
            <div className="text-[9.5px] uppercase tracking-[0.24em] font-bold text-white/85 drop-shadow pt-1">
              GOOD PARTNERS
            </div>
            <div className="text-[8.5px] uppercase tracking-[0.22em] text-white/70 drop-shadow">
              GREATER JOURNEYS
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
