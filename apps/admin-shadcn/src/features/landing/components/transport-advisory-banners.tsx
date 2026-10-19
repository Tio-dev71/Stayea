"use client"

import Image from "next/image"
import { ArrowRight, ShieldCheck, Tag, CalendarCheck, Headphones } from "lucide-react"

export function TransportAdvisoryBanners() {
  return (
    <section className="w-full mt-10 grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
      {/* 1. Left Promotional Advisory Banner (~7/12 width) */}
      <div className="lg:col-span-7 relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0C3B5E] via-[#0E4C7A] to-[#12588D] p-6 sm:p-7 text-white flex flex-col justify-between shadow-xs">
        {/* Decorative background image */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
          <Image
            src="/transport/coastal-road-phuquoc.jpg"
            alt="Đường biển Phú Quốc"
            fill
            unoptimized
            className="object-cover object-center"
          />
        </div>

        <div className="relative z-10 space-y-2 max-w-xl">
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-white leading-snug">
            Bạn cần tư vấn phương tiện phù hợp?
          </h3>
          <p className="text-xs sm:text-sm text-slate-200 font-normal leading-relaxed">
            Đội ngũ STAYEA luôn sẵn sàng hỗ trợ để bạn có hành trình hoàn hảo tại Phú Quốc.
          </p>
        </div>

        <div className="relative z-10 mt-5 pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => {
              window.location.hash = "partner"
            }}
            className="h-10 px-5 rounded-xl border border-white/40 bg-white/10 hover:bg-white/20 backdrop-blur-xs text-white text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all shadow-xs active:scale-[0.99]"
          >
            <span>Liên hệ tư vấn</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Right Cursive Calligraphy: Every Journey A Greater You */}
          <span className="font-serif italic text-base sm:text-lg text-teal-200/90 font-medium select-none">
            Every Journey A Greater You
          </span>
        </div>
      </div>

      {/* 2. Right Trust & Quality Widget (~5/12 width) */}
      <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col justify-between shadow-xs">
        <h4 className="text-xs sm:text-sm font-bold text-slate-900 mb-4 tracking-tight">
          Dịch vụ được tuyển chọn kỹ lưỡng bởi STAYEA
        </h4>

        <div className="grid grid-cols-2 gap-3.5">
          {/* Pillar 1 */}
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-100/70 text-teal-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800 leading-tight">Đối tác uy tín</div>
              <div className="text-[11px] text-slate-500 leading-tight mt-0.5">Đã được kiểm duyệt</div>
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-100/70 text-teal-700 flex items-center justify-center shrink-0">
              <Tag className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800 leading-tight">Giá rõ ràng</div>
              <div className="text-[11px] text-slate-500 leading-tight mt-0.5">Không phí ẩn</div>
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-100/70 text-teal-700 flex items-center justify-center shrink-0">
              <CalendarCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800 leading-tight">Đặt nhanh</div>
              <div className="text-[11px] text-slate-500 leading-tight mt-0.5">Chỉ vài phút</div>
            </div>
          </div>

          {/* Pillar 4 */}
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-100/70 text-teal-700 flex items-center justify-center shrink-0">
              <Headphones className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800 leading-tight">Hỗ trợ nhanh</div>
              <div className="text-[11px] text-slate-500 leading-tight mt-0.5">24/7 tận tâm</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
