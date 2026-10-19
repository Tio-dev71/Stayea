"use client"

import { Search, Calendar, Heart, Plane } from "lucide-react"
import { AUTH_ONBOARDING_STEPS } from "@/features/landing/data/stayea-mock-data"

function renderStepIcon(icon: string) {
  switch (icon) {
    case "search":
      return <Search className="w-7 h-7 text-[#0A2239]" strokeWidth={1.8} />
    case "calendar":
      return <Calendar className="w-7 h-7 text-[#0A2239]" strokeWidth={1.8} />
    case "heart":
      return <Heart className="w-7 h-7 text-[#0A2239]" strokeWidth={1.8} />
    case "plane":
      return <Plane className="w-7 h-7 text-[#0A2239]" strokeWidth={1.8} />
    default:
      return <Search className="w-7 h-7 text-[#0A2239]" strokeWidth={1.8} />
  }
}

export function AuthOnboardingSteps() {
  return (
    <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 my-12 sm:my-16">
      {/* Centered Heading */}
      <h3 className="text-xl sm:text-2xl font-bold text-[#0A2239] text-center mb-8 sm:mb-10 tracking-tight">
        Bạn mới đến với STAYEA?
      </h3>

      {/* 4 Pillars Grid with vertical dividing lines */}
      <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-200">
        {AUTH_ONBOARDING_STEPS.map((step) => (
          <div
            key={step.id}
            className="flex flex-col items-center justify-center p-4 sm:p-6 text-center group cursor-pointer hover:bg-slate-50/60 rounded-xl transition-colors"
          >
            <div className="mb-3.5 transform group-hover:scale-110 transition-transform duration-300">
              {renderStepIcon(step.icon)}
            </div>
            <div className="text-xs sm:text-sm font-bold text-slate-800 leading-tight">
              {step.line1}
            </div>
            <div className="text-xs sm:text-sm font-bold text-slate-800 leading-tight mt-0.5">
              {step.line2}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
