"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function PackageCustomBanner() {
  return (
    <div className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200/80 shadow-[0_4px_24px_rgba(0,0,0,0.04)] bg-gradient-to-r from-emerald-50/60 via-white/80 to-teal-50/60 p-6 sm:p-8 lg:p-10 my-10">
      {/* Background Tropical Palms Overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
        <Image
          src="/packages/custom-trip-banner-bg.jpg"
          alt="Thiết kế hành trình riêng Stayea"
          fill
          unoptimized
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="max-w-2xl space-y-2">
          <h3 className="font-sans text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">
            Bạn cần một hành trình riêng?
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Đội ngũ Stayea sẵn sàng thiết kế hành trình theo nhu cầu, ngân sách và sở thích của bạn.
          </p>
        </div>

        <div className="shrink-0">
          <Link
            href="#contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0c3b40] hover:bg-[#072528] text-white text-xs sm:text-sm font-semibold shadow-sm transition-all hover:shadow active:scale-95"
          >
            <span>Liên hệ tư vấn</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
