"use client"

import Image from "next/image"
import Link from "next/link"
import { ShieldCheck, ArrowRight, CheckCircle2, Star, Sparkles } from "lucide-react"

export function StayPromoBanner() {
  return (
    <div className="w-full mt-10 rounded-3xl overflow-hidden bg-gradient-to-r from-amber-50/70 via-slate-50 to-teal-50/60 border border-amber-200/60 shadow-[0_4px_20px_rgba(0,0,0,0.04)] p-6 sm:p-8 lg:p-10 relative">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Content (Span 7) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/80 border border-amber-300/60 text-amber-900 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
            <span>STAYEA VERIFIED</span>
          </div>

          <h3 className="font-sans text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight leading-snug">
            Những nơi lưu trú được tuyển chọn kỹ lưỡng
          </h3>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl">
            Trải nghiệm an tâm hơn với các đối tác được kiểm định chất lượng, đánh giá thực tế và dịch vụ đạt chuẩn của STAYEA.
          </p>

          <div className="pt-2">
            <Link
              href="#verified"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0c3b40] hover:bg-[#072528] text-white text-xs font-semibold shadow-sm transition-all hover:shadow active:scale-95"
            >
              <span>Khám phá Stayea Verified</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* 3 Trust points */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-200/70 text-xs text-slate-700 font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-[11.5px] leading-tight">Kiểm định thực tế bởi đội ngũ STAYEA</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-500 shrink-0" />
              <span className="text-[11.5px] leading-tight">Đánh giá minh bạch từ khách hàng thật</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-600 shrink-0" />
              <span className="text-[11.5px] leading-tight">Trải nghiệm chất lượng đáng tin cậy</span>
            </div>
          </div>
        </div>

        {/* Right Visual Image (Span 5) */}
        <div className="lg:col-span-5 relative h-56 sm:h-64 lg:h-72 w-full rounded-2xl overflow-hidden shadow-md">
          <Image
            src="/stay/verified-resort.jpg"
            alt="STAYEA Verified Resort"
            fill
            className="object-cover object-center"
            sizes="(max-width: 1024px) 100vw, 40vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute bottom-4 right-4 text-right text-white font-script-vi text-3xl sm:text-4xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] -rotate-3 select-none">
            Good Stays<br />
            Brighter Days
          </div>
        </div>
      </div>
    </div>
  )
}
