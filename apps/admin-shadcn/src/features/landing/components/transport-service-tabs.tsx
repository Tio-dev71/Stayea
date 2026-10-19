"use client"

import { Car, Plane, Bike, UserCheck, Palmtree } from "lucide-react"
import { TRANSPORT_SERVICE_TABS } from "@/features/landing/data/stayea-mock-data"

interface TransportServiceTabsProps {
  readonly activeTab: string
  readonly onTabChange: (tabId: string) => void
}

export function TransportServiceTabs({
  activeTab,
  onTabChange,
}: TransportServiceTabsProps) {
  return (
    <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4 py-4 border-b border-slate-100 mb-6">
      {/* 5 Service Tabs Pills */}
      <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
        {TRANSPORT_SERVICE_TABS.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all shrink-0 ${
                isActive
                  ? "bg-[#0A2239] text-white shadow-sm"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              {tab.icon === "car" && <Car className="w-4 h-4 shrink-0" />}
              {tab.icon === "plane" && <Plane className="w-4 h-4 shrink-0" />}
              {tab.icon === "bike" && <Bike className="w-4 h-4 shrink-0" />}
              {tab.icon === "user" && <UserCheck className="w-4 h-4 shrink-0" />}
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Right Brand Badge: Khám phá Phú Quốc Theo cách của riêng bạn */}
      <div className="hidden lg:flex items-center gap-2 text-right text-slate-600 select-none">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-teal-50 text-teal-700">
          <Palmtree className="w-4 h-4" />
        </div>
        <div>
          <div className="text-[11px] font-semibold tracking-wide text-slate-700 uppercase">
            Khám phá Phú Quốc
          </div>
          <div className="font-serif italic text-xs text-teal-700 font-medium leading-none">
            Theo cách của riêng bạn
          </div>
        </div>
      </div>
    </div>
  )
}
