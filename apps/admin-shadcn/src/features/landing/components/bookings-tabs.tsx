"use client"

import { BOOKING_TABS } from "@/features/landing/data/stayea-mock-data"
import type { BookingTabOption } from "@/features/landing/data/stayea-mock-data"

interface BookingsTabsProps {
  readonly activeTab: "all" | "stay" | "experience" | "transport" | "cancelled"
  readonly onSelectTab: (tabId: "all" | "stay" | "experience" | "transport" | "cancelled") => void
}

export function BookingsTabs({ activeTab, onSelectTab }: BookingsTabsProps) {
  return (
    <div className="w-full overflow-x-auto scrollbar-none pb-1">
      <div className="inline-flex items-center rounded-xl border border-slate-200 bg-white p-1 shadow-2xs">
        {BOOKING_TABS.map((tab: BookingTabOption) => {
          const isActive = activeTab === tab.id

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectTab(tab.id)}
              className={`whitespace-nowrap px-4 sm:px-6 py-2 rounded-lg text-xs font-semibold transition-all ${
                isActive
                  ? "bg-[#0A2239] text-white shadow-xs"
                  : "text-slate-700 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <span>{tab.label}</span>
              <span className="ml-1">({tab.count})</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
