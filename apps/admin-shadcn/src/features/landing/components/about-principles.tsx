"use client"

import Image from "next/image"
import { Binoculars, Target, Gem, Leaf, ShieldCheck, Star, Users } from "lucide-react"
import { ABOUT_PAGE_DATA } from "@/features/landing/data/stayea-mock-data"

export function AboutPrinciples() {
  const { principles } = ABOUT_PAGE_DATA

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-[#f8fafb]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="inline-block text-[11px] font-bold uppercase tracking-[0.2em] text-[#0c3b40]">
              {principles.kicker}
            </span>
            <h2 className="font-sans text-2xl sm:text-3xl lg:text-[34px] font-bold text-slate-900 tracking-tight leading-tight">
              {principles.title}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md font-normal leading-relaxed md:text-right">
            {principles.subtitle}
          </p>
        </div>

        {/* 3 Principles Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {/* Card 1: Tầm nhìn */}
          <div className="relative bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col justify-between group hover:shadow-md transition-all">
            <div className="p-6 sm:p-7 space-y-3 z-10">
              <div className="flex items-center gap-2.5">
                <div className="text-[#c59b27]">
                  <Binoculars className="w-5 h-5" />
                </div>
                <h3 className="font-sans text-lg font-bold text-slate-900">
                  {principles.vision.title}
                </h3>
              </div>
              <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed font-normal">
                {principles.vision.description}
              </p>
            </div>

            {/* Bottom Sea Texture Banner */}
            <div className="relative h-28 w-full mt-auto overflow-hidden">
              <Image
                src="/about/card-sea.jpg"
                alt="Tầm nhìn Stayea Phú Quốc"
                fill
                unoptimized
                className="object-cover opacity-85 group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white" />
            </div>
          </div>

          {/* Card 2: Sứ mệnh */}
          <div className="relative bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col justify-between group hover:shadow-md transition-all">
            <div className="p-6 sm:p-7 space-y-3 z-10">
              <div className="flex items-center gap-2.5">
                <div className="text-[#c59b27]">
                  <Target className="w-5 h-5" />
                </div>
                <h3 className="font-sans text-lg font-bold text-slate-900">
                  {principles.mission.title}
                </h3>
              </div>
              <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed font-normal">
                {principles.mission.description}
              </p>
            </div>

            {/* Bottom Sea Texture Banner */}
            <div className="relative h-28 w-full mt-auto overflow-hidden">
              <Image
                src="/about/story-beach.jpg"
                alt="Sứ mệnh Stayea Phú Quốc"
                fill
                unoptimized
                className="object-cover opacity-85 group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white" />
            </div>
          </div>

          {/* Card 3: Giá trị cốt lõi */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-7 flex flex-col justify-between hover:shadow-md transition-all">
            <div className="space-y-5">
              <div className="flex items-center gap-2.5">
                <div className="text-[#c59b27]">
                  <Gem className="w-5 h-5" />
                </div>
                <h3 className="font-sans text-lg font-bold text-slate-900">
                  Giá trị cốt lõi
                </h3>
              </div>

              {/* 2x2 Sub-values Grid */}
              <div className="grid grid-cols-2 gap-4 pt-1">
                {principles.coreValues.map((val) => (
                  <div key={val.title} className="space-y-1">
                    <div className="flex items-center gap-1.5 text-[#c59b27]">
                      {val.icon === "leaf" && <Leaf className="w-3.5 h-3.5" />}
                      {val.icon === "shield" && <ShieldCheck className="w-3.5 h-3.5" />}
                      {val.icon === "star" && <Star className="w-3.5 h-3.5" />}
                      {val.icon === "users" && <Users className="w-3.5 h-3.5" />}
                      <span className="font-bold text-xs sm:text-[13px] text-slate-900">
                        {val.title}
                      </span>
                    </div>
                    <p className="text-[10.5px] sm:text-[11px] text-slate-500 leading-snug">
                      {val.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
