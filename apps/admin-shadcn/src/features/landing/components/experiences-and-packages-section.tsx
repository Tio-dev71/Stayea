"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { EXPERIENCES, PACKAGES } from "@/features/landing/data/stayea-mock-data"

export function ExperiencesAndPackagesSection() {
  return (
    <section id="experiences" className="py-12 bg-slate-50/60 border-y border-slate-100">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Trải nghiệm không thể bỏ lỡ (~60%) */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            {/* Header */}
            <div className="flex items-end justify-between gap-2 mb-6">
              <div>
                <h2 className="font-sans text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  Trải nghiệm không thể bỏ lỡ
                </h2>
                <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                  Khám phá những hoạt động đặc sắc, cảm nhận trọn vẹn vẻ đẹp Phú Quốc.
                </p>
              </div>

              <Link
                href="#experiences"
                className="group inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 hover:text-[#0c3b40] transition-colors shrink-0"
              >
                <span>Xem tất cả trải nghiệm</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            {/* 8 Cards Grid */}
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5">
              {EXPERIENCES.map((exp) => (
                <div
                  key={exp.id}
                  className="group flex flex-col rounded-xl overflow-hidden bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200 transition-all text-center"
                >
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-100">
                    <Image
                      src={exp.imageUrl}
                      alt={exp.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 25vw, 10vw"
                    />
                  </div>
                  <div className="p-2 flex flex-col justify-center">
                    <h4 className="font-bold text-[11px] sm:text-xs text-slate-800 leading-tight">
                      {exp.title}
                    </h4>
                    <p className="text-[9.5px] text-slate-400 mt-0.5 line-clamp-1 leading-tight">
                      {exp.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Gói hành trình (~40%) */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            {/* Header */}
            <div className="flex items-end justify-between gap-2 mb-6">
              <div>
                <h2 className="font-sans text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  Gói hành trình
                </h2>
                <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                  Hành trình được thiết kế sẵn cho mọi phong cách du lịch.
                </p>
              </div>

              <Link
                href="#packages"
                className="group inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 hover:text-[#0c3b40] transition-colors shrink-0"
              >
                <span>Xem tất cả gói</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            {/* 5 Cards Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
              {PACKAGES.map((pkg) => (
                <div
                  key={pkg.id}
                  className="group flex flex-col rounded-xl overflow-hidden bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200 transition-all text-center"
                >
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-100">
                    <Image
                      src={pkg.imageUrl}
                      alt={pkg.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 33vw, 10vw"
                    />
                  </div>
                  <div className="p-2 flex flex-col justify-center">
                    <h4 className="font-bold text-[11px] sm:text-xs text-slate-800 leading-tight">
                      {pkg.title}
                    </h4>
                    <p className="text-[9.5px] text-slate-400 mt-0.5 line-clamp-1 leading-tight">
                      {pkg.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
