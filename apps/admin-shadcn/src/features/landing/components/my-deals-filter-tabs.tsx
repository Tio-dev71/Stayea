"use client"

import { Search } from "lucide-react"

export type DealCategoryFilter = "all" | "voucher" | "discount" | "member" | "expired"

interface MyDealsFilterTabsProps {
  readonly activeCategory: DealCategoryFilter
  readonly onSelectCategory: (cat: DealCategoryFilter) => void
  readonly searchQuery: string
  readonly onSearchChange: (q: string) => void
  readonly counts: {
    readonly all: number
    readonly voucher: number
    readonly discount: number
    readonly member: number
    readonly expired: number
  }
}

export function MyDealsFilterTabs({
  activeCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  counts,
}: MyDealsFilterTabsProps) {
  const tabs: readonly { id: DealCategoryFilter; label: string; count: number }[] = [
    { id: "all", label: "Tất cả", count: counts.all },
    { id: "voucher", label: "Voucher của tôi", count: counts.voucher },
    { id: "discount", label: "Mã giảm giá", count: counts.discount },
    { id: "member", label: "Ưu đãi thành viên", count: counts.member },
    { id: "expired", label: "Đã hết hạn", count: counts.expired },
  ]

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-1">
      {/* Horizontal Tabs */}
      <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto scrollbar-none py-1">
        {tabs.map((tab) => {
          const isActive = activeCategory === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectCategory(tab.id)}
              className={`relative px-3 py-2 text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                isActive
                  ? "text-[#0A2239]"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <span>{tab.label}</span>
              <span className="ml-1 text-slate-400 font-normal">({tab.count})</span>
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0A2239] rounded-full" />
              )}
            </button>
          )
        })}
      </div>

      {/* Search Input */}
      <div className="relative w-full sm:w-64 shrink-0">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Tìm ưu đãi..."
          className="w-full pl-9 pr-3.5 py-1.5 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs sm:text-sm placeholder:text-slate-400 focus:outline-hidden focus:border-[#0A2239] focus:ring-1 focus:ring-[#0A2239]/20 transition-all"
        />
      </div>
    </div>
  )
}
