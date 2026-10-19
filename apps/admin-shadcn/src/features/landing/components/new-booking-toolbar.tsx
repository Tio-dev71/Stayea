"use client"

import { Home, Umbrella, Gift, Car, Search } from "lucide-react"

export type ServiceFilterType = "all" | "stay" | "experience" | "package" | "transport"

interface NewBookingToolbarProps {
  readonly activeTab: ServiceFilterType
  readonly onSelectTab: (tab: ServiceFilterType) => void
  readonly searchQuery: string
  readonly onSearchChange: (query: string) => void
}

interface FilterTabItem {
  readonly id: ServiceFilterType
  readonly label: string
  readonly icon?: "home" | "umbrella" | "gift" | "car"
}

const FILTER_TABS: readonly FilterTabItem[] = [
  { id: "all", label: "Tất cả" },
  { id: "stay", label: "Lưu trú", icon: "home" },
  { id: "experience", label: "Trải nghiệm", icon: "umbrella" },
  { id: "package", label: "Gói", icon: "gift" },
  { id: "transport", label: "Di chuyển", icon: "car" },
]

function renderTabIcon(icon?: "home" | "umbrella" | "gift" | "car") {
  if (!icon) return null
  switch (icon) {
    case "home":
      return <Home className="w-4 h-4 shrink-0" />
    case "umbrella":
      return <Umbrella className="w-4 h-4 shrink-0" />
    case "gift":
      return <Gift className="w-4 h-4 shrink-0" />
    case "car":
      return <Car className="w-4 h-4 shrink-0" />
    default:
      return null
  }
}

export function NewBookingToolbar({
  activeTab,
  onSelectTab,
  searchQuery,
  onSearchChange,
}: NewBookingToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
      {/* 1. Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
        {FILTER_TABS.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectTab(tab.id)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all shrink-0 active:scale-95 ${
                isActive
                  ? "bg-[#0A2239] text-white shadow-2xs font-semibold"
                  : "bg-white text-slate-700 border border-slate-200/90 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              {renderTabIcon(tab.icon)}
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* 2. Search Input */}
      <div className="relative w-full sm:w-64 lg:w-72 shrink-0">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Tìm dịch vụ..."
          className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200/90 bg-white text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0A2239] focus:ring-1 focus:ring-[#0A2239] transition-all shadow-2xs"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-slate-400 hover:text-slate-600"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  )
}
