"use client"

import React from "react"
import { ShieldCheck, Route } from "lucide-react"
import type { StayeaClubClaimedStep } from "@/features/landing/data/stayea-mock-data"

export interface StayeaClubClaimedTermsAndGuideProps {
  readonly terms: readonly string[]
  readonly steps: readonly StayeaClubClaimedStep[]
}

export const StayeaClubClaimedTermsAndGuide: React.FC<StayeaClubClaimedTermsAndGuideProps> = ({
  terms,
  steps,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
      {/* 1. Điều kiện sử dụng */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="flex items-center gap-2.5 text-[#0A2239] mb-4 pb-2 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#1E40AF] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="text-sm sm:text-base font-bold text-[#0A2239]">
              Điều kiện sử dụng
            </h3>
          </div>

          {/* Terms Bullet List */}
          <ul className="space-y-2.5">
            {terms.map((term) => (
              <li key={term} className="flex items-start gap-2 text-xs text-slate-600 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0 mt-1.5" />
                <span>{term}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 2. Cách sử dụng */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="flex items-center gap-2.5 text-[#0A2239] mb-4 pb-2 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#1E40AF] flex items-center justify-center shrink-0">
              <Route className="w-4 h-4" />
            </div>
            <h3 className="text-sm sm:text-base font-bold text-[#0A2239]">
              Cách sử dụng
            </h3>
          </div>

          {/* Steps List */}
          <div className="space-y-4">
            {steps.map((s) => (
              <div key={s.step} className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-[#EBF3FC] text-[#1E40AF] font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                  {s.step}
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-xs sm:text-sm font-bold text-[#0A2239]">
                    {s.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    {s.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
