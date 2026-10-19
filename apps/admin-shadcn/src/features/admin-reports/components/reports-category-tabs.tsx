"use client"

import { MOCK_REPORT_CATEGORY_TABS } from "@/features/admin-reports/stayea-admin-reports-mock-data"

interface ReportsCategoryTabsProps {
  activeTab: string
  setActiveTab: (tabId: string) => void
}

export function ReportsCategoryTabs({
  activeTab,
  setActiveTab,
}: ReportsCategoryTabsProps) {
  return (
    <div className="border-b border-slate-200/90 overflow-x-auto no-scrollbar -mb-1">
      <div className="flex items-center gap-1 sm:gap-2 min-w-max pb-0.5">
        {MOCK_REPORT_CATEGORY_TABS.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`relative px-3.5 py-2.5 text-xs sm:text-[13px] font-medium transition-all rounded-t-lg cursor-pointer ${
                isActive
                  ? "text-[#007a48] font-semibold bg-emerald-50/50"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50/80"
              }`}
            >
              <span>{tab.label}</span>
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#007a48] rounded-full" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
