"use client"

import Image from "next/image"
import { ArrowRight, Users, TrendingUp, Settings, ShieldCheck, MapPin } from "lucide-react"

function scrollToForm() {
  const el = document.querySelector("#host-register-form")
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" })
  }
}

function scrollToBenefits() {
  const el = document.querySelector("#host-benefits")
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" })
  }
}

export function HostHero() {

  return (
    <section className="relative w-full overflow-hidden bg-slate-900 min-h-[560px] sm:min-h-[620px] lg:min-h-[680px]">
      {/* Background Image: Luxury infinity pool villa in Phu Quoc */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src="/homepagemainbanner.png"
          alt="Trở thành chủ nhà cùng STAYEA"
          fill
          priority
          unoptimized
          className="object-cover object-center"
        />
        {/* Cinematic gradient overlays for high legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-black/30" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      </div>

      {/* Foreground Content Container */}
      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 lg:pt-20 pb-10 flex flex-col justify-between min-h-[560px] sm:min-h-[620px] lg:min-h-[680px]">
        {/* Main Hero Header Text */}
        <div className="max-w-2xl text-white space-y-4">
          <span className="inline-block text-[11px] sm:text-xs font-semibold uppercase tracking-[0.24em] text-white/90 drop-shadow">
            CHIA SẺ KHÔNG GIAN, LAN TỎA NHỮNG TRẢI NGHIỆM ĐẸP
          </span>

          <h1 className="font-sans text-3xl sm:text-5xl lg:text-[52px] font-bold text-white leading-[1.12] tracking-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]">
            Trở thành chủ nhà
            <br />
            cùng STAYEA
          </h1>

          <p className="text-white/95 text-xs sm:text-sm lg:text-[15px] font-normal leading-relaxed max-w-xl drop-shadow-[0_1px_6px_rgba(0,0,0,0.85)]">
            Chia sẻ không gian của bạn với những du khách chất lượng,
            <br className="hidden sm:inline" />
            {" "}gia tăng thu nhập bền vững và cùng lan tỏa vẻ đẹp Phú Quốc
            <br className="hidden sm:inline" />
            {" "}đến khắp thế giới.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={scrollToForm}
              className="px-6 py-2.5 rounded-full bg-white hover:bg-slate-100 text-[#0c3b40] text-xs sm:text-sm font-semibold transition-all shadow-md inline-flex items-center gap-2 group active:scale-95"
            >
              <span>Đăng ký chủ nhà</span>
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

        {/* Bottom Bar: 4 Value Pillars & Script Branding */}
        <div className="pt-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          {/* 4 Value Pillars */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 lg:gap-8 text-white/95 text-xs sm:text-[13px] font-medium drop-shadow">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-white/90 shrink-0" />
              <span>Tiếp cận khách chất lượng</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-white/90 shrink-0" />
              <span>Tối ưu doanh thu</span>
            </div>
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4 text-white/90 shrink-0" />
              <span>Hỗ trợ vận hành</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-white/90 shrink-0" />
              <span>Đồng hành minh bạch</span>
            </div>
          </div>

          {/* Bottom Right Callout */}
          <div className="text-right text-white space-y-0.5 shrink-0 self-end">
            <div className="font-script-vi text-2xl sm:text-3xl text-[#e8c783] drop-shadow -rotate-[3deg]">
              More Than a Stay
            </div>
            <div className="flex items-center justify-end gap-1 text-[11px] text-white/90 drop-shadow">
              <MapPin className="w-3 h-3 text-[#e8c783]" />
              <span>Phú Quốc, Việt Nam</span>
            </div>
            <div className="text-[10px] text-white/75 drop-shadow">
              Nơi những câu chuyện đẹp bắt đầu
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
