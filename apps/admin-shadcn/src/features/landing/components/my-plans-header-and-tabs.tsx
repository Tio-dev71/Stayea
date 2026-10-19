"use client"

import { Plus } from "lucide-react"

export type PlanFilterTab = "upcoming" | "past" | "draft" | "wishlist"

interface MyPlansHeaderAndTabsProps {
  readonly activeTab: PlanFilterTab
  readonly onSelectTab: (tab: PlanFilterTab) => void
  readonly onCreateNewPlan: () => void
}

interface PlanTabItem {
  readonly id: PlanFilterTab
  readonly label: string
}

const PLAN_TABS: readonly PlanTabItem[] = [
  { id: "upcoming", label: "Chuyến đi sắp tới (2)" },
  { id: "past", label: "Chuyến đi đã qua (3)" },
  { id: "draft", label: "Kế hoạch nháp (1)" },
  { id: "wishlist", label: "Danh sách mong muốn" },
]

export function MyPlansHeaderAndTabs({
  activeTab,
  onSelectTab,
  onCreateNewPlan,
}: MyPlansHeaderAndTabsProps) {
  return (
    <div className="space-y-4">
      {/* 1. Page Header Title + "Tạo kế hoạch mới +" CTA Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Kế hoạch của tôi
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Quản lý lịch trình, dịch vụ và những điều bạn mong muốn cho các chuyến đi cùng STAYEA.
          </p>
        </div>

        <div className="shrink-0 self-start sm:self-auto">
          <button
            type="button"
            onClick={onCreateNewPlan}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0A2239] hover:bg-[#071726] text-white text-xs sm:text-sm font-semibold shadow-xs transition-all active:scale-95"
          >
            <span>Tạo kế hoạch mới</span>
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Plan Filter Status Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
        {PLAN_TABS.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all shrink-0 active:scale-95 ${
                isActive
                  ? "bg-[#0A2239] text-white shadow-2xs font-semibold"
                  : "bg-white text-slate-700 border border-slate-200/90 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              {tab.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
