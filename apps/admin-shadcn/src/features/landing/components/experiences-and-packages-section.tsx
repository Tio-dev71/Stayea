"use client"

import Image from "next/image"
import { ArrowRight, Compass, Sparkles } from "lucide-react"
import { EXPERIENCES, PACKAGES } from "@/features/landing/data/stayea-mock-data"

interface ExperiencesAndPackagesSectionProps {
  readonly onNavigate?: (item: string) => void
}

export function ExperiencesAndPackagesSection({ onNavigate }: ExperiencesAndPackagesSectionProps = {}) {
  // Show 4 top featured experiences & 3 top featured packages for spacious, luxurious width
  const featuredExperiences = EXPERIENCES.slice(0, 4)
  const featuredPackages = PACKAGES.slice(0, 3)

  return (
    <section id="experiences" className="py-12 bg-slate-50/60 border-y border-slate-100">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left Column: Trải nghiệm không thể bỏ lỡ (~58%) */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            {/* Header */}
            <div className="flex items-end justify-between gap-2 mb-6">
              <div>
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#0c3b40] uppercase tracking-wider mb-1">
                  <Compass className="w-3.5 h-3.5 text-[#c69a58]" />
                  <span>Hoạt động đặc sắc</span>
                </div>
                <h2 className="font-sans text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  Trải nghiệm không thể bỏ lỡ
                </h2>
                <p className="text-xs sm:text-[13px] text-slate-500 mt-1 line-clamp-1">
                  Khám phá những hoạt động đặc sắc, cảm nhận trọn vẹn vẻ đẹp Phú Quốc.
                </p>
              </div>

              <button
                type="button"
                onClick={() => onNavigate?.("experience")}
                className="group inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-[#0c3b40] transition-colors shrink-0 active:scale-95"
              >
                <span>Xem tất cả trải nghiệm</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            {/* 4 Spacious Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-4">
              {featuredExperiences.map((exp) => (
                <div
                  key={exp.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => onNavigate?.("experience")}
                  onKeyDown={(e) => { if (e.key === "Enter") onNavigate?.("experience") }}
                  className="group cursor-pointer flex flex-col rounded-2xl overflow-hidden bg-white border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_10px_25px_rgba(0,0,0,0.08)] hover:border-[#0c3b40]/30 transition-all duration-300 text-center hover:-translate-y-1"
                >
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-100">
                    <Image
                      src={exp.imageUrl}
                      alt={exp.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 15vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="p-3 flex flex-col justify-center flex-grow">
                    <h4 className="font-bold text-xs sm:text-[13px] text-slate-800 leading-snug group-hover:text-[#0c3b40] transition-colors">
                      {exp.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-1 leading-tight">
                      {exp.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Gói hành trình (~42%) */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            {/* Header */}
            <div className="flex items-end justify-between gap-2 mb-6">
              <div>
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#0c3b40] uppercase tracking-wider mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#c69a58]" />
                  <span>Combo tiện ích</span>
                </div>
                <h2 className="font-sans text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  Gói hành trình
                </h2>
                <p className="text-xs sm:text-[13px] text-slate-500 mt-1 line-clamp-1">
                  Hành trình thiết kế sẵn cho mọi phong cách du lịch.
                </p>
              </div>

              <button
                type="button"
                onClick={() => onNavigate?.("packages")}
                className="group inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-[#0c3b40] transition-colors shrink-0 active:scale-95"
              >
                <span>Xem tất cả gói</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            {/* 3 Spacious Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
              {featuredPackages.map((pkg) => (
                <div
                  key={pkg.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => onNavigate?.("packages")}
                  onKeyDown={(e) => { if (e.key === "Enter") onNavigate?.("packages") }}
                  className="group cursor-pointer flex flex-col rounded-2xl overflow-hidden bg-white border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_10px_25px_rgba(0,0,0,0.08)] hover:border-[#0c3b40]/30 transition-all duration-300 text-center hover:-translate-y-1"
                >
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-100">
                    <Image
                      src={pkg.imageUrl}
                      alt={pkg.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 15vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="p-3 flex flex-col justify-center flex-grow">
                    <h4 className="font-bold text-xs sm:text-[13px] text-slate-800 leading-snug group-hover:text-[#0c3b40] transition-colors">
                      {pkg.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-1 leading-tight">
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
