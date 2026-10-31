import { Search, Plus } from "lucide-react"

interface DealsFilterBarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  activeStatusTab: string
  onSelectStatusTab: (tab: string) => void
  onOpenCreateModal: () => void
  totalCount: number
  activeCount: number
  upcomingCount: number
  expiredCount: number
}

export function DealsFilterBar({
  searchQuery,
  onSearchChange,
  activeStatusTab,
  onSelectStatusTab,
  onOpenCreateModal,
  totalCount,
  activeCount,
  upcomingCount,
  expiredCount,
}: DealsFilterBarProps) {
  const tabs = [
    { id: "all", label: `Tất cả (${totalCount})` },
    { id: "active", label: `Đang hoạt động (${activeCount})` },
    { id: "upcoming", label: `Sắp diễn ra (${upcomingCount})` },
    { id: "expired", label: `Đã kết thúc (${expiredCount})` },
  ]

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-3 sm:p-4 shadow-2xs flex flex-col xl:flex-row xl:items-center xl:justify-between gap-3">
      {/* Accessible Tabs */}
      <div
        role="tablist"
        aria-label="Lọc khuyến mãi theo trạng thái"
        className="flex flex-wrap items-center gap-1.5"
      >
        {tabs.map((tab) => {
          const isActive = activeStatusTab === tab.id
          return (
            <button
              key={tab.id}
              id={`deal-tab-${tab.id}`}
              role="tab"
              type="button"
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              onClick={() => onSelectStatusTab(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                isActive
                  ? "bg-[#1b7a4e] text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200/70"
              }`}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Right: Search & Create Button */}
      <div className="flex items-center gap-2.5 w-full xl:w-auto">
        <div className="relative flex-1 xl:w-64">
          <label htmlFor="deals-search-input" className="sr-only">
            Tìm kiếm khuyến mãi, mã giá
          </label>
          <Search
            className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            aria-hidden="true"
          />
          <input
            id="deals-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm kiếm khuyến mãi, mã giá..."
            aria-label="Tìm kiếm khuyến mãi, mã giá"
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-slate-400"
          />
        </div>

        <button
          type="button"
          onClick={onOpenCreateModal}
          aria-label="Tạo chương trình khuyến mãi"
          className="px-3.5 py-1.5 bg-[#1b7a4e] hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" aria-hidden="true" />
          <span className="hidden sm:inline">Tạo chương trình</span>
        </button>
      </div>
    </div>
  )
}
