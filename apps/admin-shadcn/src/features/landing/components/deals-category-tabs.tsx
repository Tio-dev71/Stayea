"use client"

import {
  Tag,
  Plane,
  Ship,
  Car,
  Bus,
  Hotel,
  Palmtree,
} from "lucide-react"
import { DEALS_SERVICE_TABS } from "@/features/landing/data/stayea-mock-data"

interface DealsCategoryTabsProps {
  readonly activeTab: string
  readonly onTabChange: (tabId: string) => void
}

function renderTabIcon(icon: string) {
  switch (icon) {
    case "tag":
      return <Tag className="w-4 h-4 shrink-0" />
    case "plane":
      return <Plane className="w-4 h-4 shrink-0" />
    case "ship":
      return <Ship className="w-4 h-4 shrink-0" />
    case "car":
      return <Car className="w-4 h-4 shrink-0" />
    case "bus":
      return <Bus className="w-4 h-4 shrink-0" />
    case "hotel":
      return <Hotel className="w-4 h-4 shrink-0" />
    case "palmtree":
      return <Palmtree className="w-4 h-4 shrink-0" />
    default:
      return <Tag className="w-4 h-4 shrink-0" />
  }
}

export function DealsCategoryTabs({
  activeTab,
  onTabChange,
}: DealsCategoryTabsProps) {
  return (
    <div className="w-full py-5 border-b border-slate-100 mb-6">
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {DEALS_SERVICE_TABS.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
                isActive
                  ? "bg-[#0A2239] text-white shadow-xs"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              {renderTabIcon(tab.icon)}
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
