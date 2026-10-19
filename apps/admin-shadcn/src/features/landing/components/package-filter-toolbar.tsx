"use client"

import * as React from "react"
import {
  LayoutGrid,
  Heart,
  Users,
  Briefcase,
  Laptop,
  Search,
  Calendar,
  Tag,
  Star,
  UserCheck,
  ArrowUpDown,
  ChevronDown,
  X,
} from "lucide-react"
import {
  PACKAGE_AUDIENCE_TABS,
  PACKAGE_FILTER_DURATIONS,
  PACKAGE_FILTER_PRICES,
  PACKAGE_FILTER_TYPES,
  PACKAGE_FILTER_SUITABILITIES,
  PACKAGE_SORT_OPTIONS,
} from "@/features/landing/data/stayea-mock-data"

interface PackageFilterToolbarProps {
  readonly selectedAudience: string
  readonly onSelectAudience: (id: string) => void
  readonly searchQuery: string
  readonly onSearchChange: (query: string) => void
  readonly selectedDuration: string
  readonly onSelectDuration: (duration: string) => void
  readonly selectedPrice: string
  readonly onSelectPrice: (price: string) => void
  readonly selectedType: string
  readonly onSelectType: (type: string) => void
  readonly selectedSuitability: string
  readonly onSelectSuitability: (suitability: string) => void
  readonly selectedSort: string
  readonly onSelectSort: (sort: string) => void
  readonly onResetFilters?: () => void
}

function getAudienceIcon(iconName: string) {
  switch (iconName) {
    case "grid":
      return <LayoutGrid className="w-4 h-4 shrink-0" />
    case "heart":
      return <Heart className="w-4 h-4 text-amber-500 fill-amber-500/20 shrink-0" />
    case "family":
      return <Users className="w-4 h-4 text-amber-600 shrink-0" />
    case "friends":
      return <Users className="w-4 h-4 text-amber-700 shrink-0" />
    case "luggage":
      return <Briefcase className="w-4 h-4 text-amber-700 shrink-0" />
    case "laptop":
      return <Laptop className="w-4 h-4 text-amber-800 shrink-0" />
    default:
      return <LayoutGrid className="w-4 h-4 shrink-0" />
  }
}

export function PackageFilterToolbar({
  selectedAudience,
  onSelectAudience,
  searchQuery,
  onSearchChange,
  selectedDuration,
  onSelectDuration,
  selectedPrice,
  onSelectPrice,
  selectedType,
  onSelectType,
  selectedSuitability,
  onSelectSuitability,
  selectedSort,
  onSelectSort,
  onResetFilters,
}: PackageFilterToolbarProps) {
  const [openDropdown, setOpenDropdown] = React.useState<string | null>(null)
  const dropdownRef = React.useRef<HTMLDivElement>(null)

  // Close dropdown on outside click
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const hasActiveSecondaryFilters =
    selectedDuration !== PACKAGE_FILTER_DURATIONS[0] ||
    selectedPrice !== PACKAGE_FILTER_PRICES[0] ||
    selectedType !== PACKAGE_FILTER_TYPES[0] ||
    selectedSuitability !== PACKAGE_FILTER_SUITABILITIES[0]

  return (
    <div ref={dropdownRef} className="w-full space-y-4 pt-6 pb-2">
      {/* Row 1: Audience Tabs + Search Input */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {PACKAGE_AUDIENCE_TABS.map((tab) => {
            const isActive = selectedAudience === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onSelectAudience(tab.id)}
                className={`h-10 px-4 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 shrink-0 transition-all select-none ${
                  isActive
                    ? "bg-[#0c3b40] text-white shadow-sm"
                    : "bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/80 hover:border-slate-300"
                }`}
              >
                {getAudienceIcon(tab.icon)}
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Search Input Box */}
        <div className="relative w-full lg:w-72 shrink-0">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm gói hành trình..."
            className="w-full h-10 pl-4 pr-10 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm placeholder:text-slate-400 focus:outline-none focus:border-[#0c3b40] focus:ring-1 focus:ring-[#0c3b40] transition-colors shadow-2xs"
          />
          {searchQuery ? (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 rounded-full"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          )}
        </div>
      </div>

      {/* Row 2: Secondary Dropdown Filters + Sorter */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1 border-t border-slate-100">
        <div className="flex flex-wrap items-center gap-2">
          {/* Dropdown 1: Thời gian */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpenDropdown(openDropdown === "duration" ? null : "duration")}
              className={`h-9 px-3.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-colors select-none ${
                selectedDuration === PACKAGE_FILTER_DURATIONS[0]
                  ? "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                  : "border-[#0c3b40] bg-teal-50/50 text-[#0c3b40]"
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{selectedDuration === PACKAGE_FILTER_DURATIONS[0] ? "Thời gian" : selectedDuration}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${openDropdown === "duration" ? "rotate-180" : ""}`} />
            </button>
            {openDropdown === "duration" && (
              <div className="absolute left-0 mt-1.5 w-48 bg-white border border-slate-200 rounded-xl shadow-lg z-30 py-1.5 animate-in fade-in-0 zoom-in-95">
                {PACKAGE_FILTER_DURATIONS.map((dur) => (
                  <button
                    key={dur}
                    type="button"
                    onClick={() => {
                      onSelectDuration(dur)
                      setOpenDropdown(null)
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs transition-colors ${
                      selectedDuration === dur ? "bg-teal-50 text-[#0c3b40] font-semibold" : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {dur}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Dropdown 2: Khoảng giá */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpenDropdown(openDropdown === "price" ? null : "price")}
              className={`h-9 px-3.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-colors select-none ${
                selectedPrice === PACKAGE_FILTER_PRICES[0]
                  ? "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                  : "border-[#0c3b40] bg-teal-50/50 text-[#0c3b40]"
              }`}
            >
              <Tag className="w-3.5 h-3.5 text-slate-400" />
              <span>{selectedPrice === PACKAGE_FILTER_PRICES[0] ? "Khoảng giá" : selectedPrice}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${openDropdown === "price" ? "rotate-180" : ""}`} />
            </button>
            {openDropdown === "price" && (
              <div className="absolute left-0 mt-1.5 w-52 bg-white border border-slate-200 rounded-xl shadow-lg z-30 py-1.5 animate-in fade-in-0 zoom-in-95">
                {PACKAGE_FILTER_PRICES.map((pr) => (
                  <button
                    key={pr}
                    type="button"
                    onClick={() => {
                      onSelectPrice(pr)
                      setOpenDropdown(null)
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs transition-colors ${
                      selectedPrice === pr ? "bg-teal-50 text-[#0c3b40] font-semibold" : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {pr}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Dropdown 3: Loại trải nghiệm */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpenDropdown(openDropdown === "type" ? null : "type")}
              className={`h-9 px-3.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-colors select-none ${
                selectedType === PACKAGE_FILTER_TYPES[0]
                  ? "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                  : "border-[#0c3b40] bg-teal-50/50 text-[#0c3b40]"
              }`}
            >
              <Star className="w-3.5 h-3.5 text-slate-400" />
              <span>{selectedType === PACKAGE_FILTER_TYPES[0] ? "Loại trải nghiệm" : selectedType}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${openDropdown === "type" ? "rotate-180" : ""}`} />
            </button>
            {openDropdown === "type" && (
              <div className="absolute left-0 mt-1.5 w-52 bg-white border border-slate-200 rounded-xl shadow-lg z-30 py-1.5 animate-in fade-in-0 zoom-in-95">
                {PACKAGE_FILTER_TYPES.map((tp) => (
                  <button
                    key={tp}
                    type="button"
                    onClick={() => {
                      onSelectType(tp)
                      setOpenDropdown(null)
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs transition-colors ${
                      selectedType === tp ? "bg-teal-50 text-[#0c3b40] font-semibold" : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {tp}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Dropdown 4: Phù hợp với */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpenDropdown(openDropdown === "suitability" ? null : "suitability")}
              className={`h-9 px-3.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-colors select-none ${
                selectedSuitability === PACKAGE_FILTER_SUITABILITIES[0]
                  ? "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                  : "border-[#0c3b40] bg-teal-50/50 text-[#0c3b40]"
              }`}
            >
              <UserCheck className="w-3.5 h-3.5 text-slate-400" />
              <span>{selectedSuitability === PACKAGE_FILTER_SUITABILITIES[0] ? "Phù hợp với" : selectedSuitability}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${openDropdown === "suitability" ? "rotate-180" : ""}`} />
            </button>
            {openDropdown === "suitability" && (
              <div className="absolute left-0 mt-1.5 w-48 bg-white border border-slate-200 rounded-xl shadow-lg z-30 py-1.5 animate-in fade-in-0 zoom-in-95">
                {PACKAGE_FILTER_SUITABILITIES.map((suit) => (
                  <button
                    key={suit}
                    type="button"
                    onClick={() => {
                      onSelectSuitability(suit)
                      setOpenDropdown(null)
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs transition-colors ${
                      selectedSuitability === suit ? "bg-teal-50 text-[#0c3b40] font-semibold" : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {suit}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Clear filters shortcut */}
          {hasActiveSecondaryFilters && onResetFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="text-xs text-rose-600 hover:text-rose-700 font-medium px-2 py-1 rounded-md hover:bg-rose-50 transition-colors"
            >
              Xóa bộ lọc
            </button>
          )}
        </div>

        {/* Dropdown 5: Sắp xếp */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpenDropdown(openDropdown === "sort" ? null : "sort")}
            className="h-9 px-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 flex items-center gap-1.5 transition-colors select-none"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <span>Sắp xếp: {selectedSort}</span>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${openDropdown === "sort" ? "rotate-180" : ""}`} />
          </button>
          {openDropdown === "sort" && (
            <div className="absolute right-0 mt-1.5 w-48 bg-white border border-slate-200 rounded-xl shadow-lg z-30 py-1.5 animate-in fade-in-0 zoom-in-95">
              {PACKAGE_SORT_OPTIONS.map((sortOpt) => (
                <button
                  key={sortOpt}
                  type="button"
                  onClick={() => {
                    onSelectSort(sortOpt)
                    setOpenDropdown(null)
                  }}
                  className={`w-full text-left px-3.5 py-2 text-xs transition-colors ${
                    selectedSort === sortOpt ? "bg-teal-50 text-[#0c3b40] font-semibold" : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {sortOpt}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
