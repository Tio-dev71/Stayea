"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { ABOUT_PAGE_DATA } from "@/features/landing/data/stayea-mock-data"

export function AboutTeam() {
  const { team } = ABOUT_PAGE_DATA

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-white">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="inline-block text-[11px] font-bold uppercase tracking-[0.2em] text-[#0c3b40]">
              {team.kicker}
            </span>
            <h2 className="font-sans text-2xl sm:text-3xl lg:text-[34px] font-bold text-slate-900 tracking-tight leading-tight">
              {team.title}
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 md:justify-end">
            <p className="text-xs sm:text-sm text-slate-500 max-w-md font-normal leading-relaxed md:text-right">
              {team.subtitle}
            </p>
            <Link
              href="#careers"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs sm:text-sm font-semibold transition-all shadow-2xs shrink-0 group"
            >
              <span>{team.ctaText}</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* 4 Team Member Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.members.map((member) => (
            <div
              key={member.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden flex flex-col group hover:shadow-md hover:border-slate-300 transition-all duration-300"
            >
              {/* Member Portrait */}
              <div className="relative aspect-[4/3.8] w-full overflow-hidden bg-slate-100">
                <Image
                  src={member.imageUrl}
                  alt={member.name}
                  fill
                  unoptimized
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              </div>

              {/* Member Info */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-0.5">
                  <h3 className="font-sans text-base font-bold text-slate-900 group-hover:text-[#0c3b40] transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-xs font-medium text-slate-500">
                    {member.role}
                  </p>
                </div>

                <p className="text-xs italic text-slate-600 font-normal leading-relaxed border-t border-slate-100 pt-3">
                  {member.quote}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
