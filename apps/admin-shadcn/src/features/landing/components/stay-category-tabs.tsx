"use client"

import {
  LayoutGrid,
  Home,
  Building2,
  Hotel,
  Calendar,
  ShieldCheck,
  Crown,
} from "lucide-react"
import { STAY_CATEGORY_TABS } from "@/features/landing/data/stayea-mock-data"
import type { StayCategoryTab } from "@/features/landing/data/stayea-mock-data"

interface StayCategoryTabsProps {
  readonly activeTab: string
  readonly onSelectTab: (tabId: string) => void
}

function getTabIcon(iconName: StayCategoryTab["iconName"], isActive: boolean) {
  const iconClass = `w-4 h-4 shrink-0 transition-colors ${
    isActive ? "text-white" : "text-slate-600 group-hover:text-[#0c3b40]"
  }`

  switch (iconName) {
    case "all":
      return <LayoutGrid className={iconClass} />
    case "villa":
      return <Home className={iconClass} />
    case "building":
      return <Building2 className={iconClass} />
    case "home":
      return <Home className={iconClass} />
    case "hotel":
      return <Hotel className={iconClass} />
    case "calendar":
      return <Calendar className={iconClass} />
    case "verified":
      return (
        <ShieldCheck
          className={`w-4 h-4 shrink-0 transition-colors ${
            isActive ? "text-white" : "text-amber-600 group-hover:text-amber-700"
          }`}
        />
      )
    case "select":
      return (
        <Crown
          className={`w-4 h-4 shrink-0 transition-colors ${
            isActive ? "text-white" : "text-amber-500 group-hover:text-amber-600"
          }`}
        />
      )
    default:
      return <LayoutGrid className={iconClass} />
  }
}

export function StayCategoryTabs({ activeTab, onSelectTab }: StayCategoryTabsProps) {
  return (
    <div className="w-full bg-white border-b border-slate-100 py-3.5 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-0.5">
          {STAY_CATEGORY_TABS.map((tab) => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onSelectTab(tab.id)}
                className={`group flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 select-none shrink-0 ${
                  isActive
                    ? "bg-[#0c3b40] text-white shadow-sm ring-1 ring-[#0c3b40]"
                    : "bg-white text-slate-700 hover:text-[#0c3b40] hover:bg-slate-50 border border-slate-200/90"
                }`}
              >
                {getTabIcon(tab.iconName, isActive)}
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
