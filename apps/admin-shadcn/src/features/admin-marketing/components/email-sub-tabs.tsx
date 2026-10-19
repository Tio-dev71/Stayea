"use client"

import { MOCK_EMAIL_SUB_TABS } from "@/features/admin-marketing/stayea-admin-marketing-mock-data"

interface EmailSubTabsProps {
  activeTab: string
  onTabChange: (tabId: string) => void
}

export function EmailSubTabs({ activeTab, onTabChange }: EmailSubTabsProps) {
  return (
    <div className="border-b border-slate-200/80 -mt-1 mb-2">
      <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar scroll-smooth">
        {MOCK_EMAIL_SUB_TABS.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`px-3.5 py-2.5 text-xs sm:text-[13px] font-medium whitespace-nowrap transition-colors relative cursor-pointer ${
                isActive
                  ? "text-[#007a48] font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {tab.label}
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
