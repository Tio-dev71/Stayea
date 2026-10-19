"use client"

import { Ticket, Coins, Headphones, Gift } from "lucide-react"
import { STAYEA_CLUB_PERKS } from "@/features/landing/data/stayea-mock-data"
import type { StayeaClubPerkItem } from "@/features/landing/data/stayea-mock-data"

function renderPerkIcon(name: StayeaClubPerkItem["iconName"], className: string) {
  switch (name) {
    case "ticket":
      return <Ticket className={className} />
    case "coins":
      return <Coins className={className} />
    case "headphones":
      return <Headphones className={className} />
    case "gift":
      return <Gift className={className} />
    default:
      return <Ticket className={className} />
  }
}

export function StayeaClubPerksBar() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {STAYEA_CLUB_PERKS.map((perk: StayeaClubPerkItem) => (
        <div
          key={perk.id}
          className="bg-white border border-slate-200/80 rounded-2xl p-4 flex items-center gap-3.5 shadow-2xs hover:border-slate-300 hover:shadow-xs transition-all"
        >
          {/* Icon in Colored Rounded Box */}
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${perk.iconBg}`}
          >
            {renderPerkIcon(perk.iconName, `w-5 h-5 ${perk.iconColor}`)}
          </div>

          {/* Text Content without truncation */}
          <div className="space-y-0.5 min-w-0">
            <h3 className="text-xs sm:text-sm font-bold text-[#0A2239] leading-snug">
              {perk.title}
            </h3>
            <p className="text-[11px] text-slate-500 leading-snug">
              {perk.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
