"use client"

import { Tag, ShieldCheck, Headphones, Star } from "lucide-react"
import { DEALS_VALUE_PILLARS } from "@/features/landing/data/stayea-mock-data"

function renderIcon(icon: string) {
  switch (icon) {
    case "tag":
      return <Tag className="w-5 h-5 text-amber-500" />
    case "shield-check":
      return <ShieldCheck className="w-5 h-5 text-amber-500" />
    case "headphones":
      return <Headphones className="w-5 h-5 text-amber-500" />
    case "star":
      return <Star className="w-5 h-5 text-amber-500" />
    default:
      return <Tag className="w-5 h-5 text-amber-500" />
  }
}

export function DealsValueBar() {
  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {DEALS_VALUE_PILLARS.map((pillar) => (
          <div key={pillar.title} className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-50/80 border border-amber-100 flex items-center justify-center shrink-0">
              {renderIcon(pillar.icon)}
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                {pillar.title}
              </div>
              <div className="text-[11px] text-slate-500 mt-1 leading-tight">
                {pillar.subtitle}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
