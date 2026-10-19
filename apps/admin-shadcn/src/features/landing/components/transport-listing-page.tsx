"use client"

import * as React from "react"
import Image from "next/image"
import { LayoutGrid, List, ChevronDown, Check, X } from "lucide-react"
import { TransportHero } from "./transport-hero"
import { TransportServiceTabs } from "./transport-service-tabs"
import { TransportFilterSidebar } from "./transport-filter-sidebar"
import type { TransportFilterState } from "./transport-filter-sidebar"
import { TransportCard } from "./transport-card"
import { TransportAdvisoryBanners } from "./transport-advisory-banners"
import { TRANSPORT_ITEMS } from "@/features/landing/data/stayea-mock-data"
import type { TransportItem } from "@/features/landing/data/stayea-mock-data"

const INITIAL_FILTERS: TransportFilterState = {
  pricePreset: null,
  maxPrice: 5_000_000,
  selectedServiceTypes: [],
  selectedLocations: [],
  selectedAmenities: [],
  selectedSuitability: [],
  sortOption: "popular",
}

export function TransportListingPage() {
  const [activeTab, setActiveTab] = React.useState<string>("all")
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = React.useState<string>("popular")
  const [itemsPerPage, setItemsPerPage] = React.useState<number>(12)
  const [selectedTransport, setSelectedTransport] = React.useState<TransportItem | null>(null)
  const [showBookingSuccess, setShowBookingSuccess] = React.useState<boolean>(false)

  const [filters, setFilters] = React.useState<TransportFilterState>(INITIAL_FILTERS)

  // Reset filters
  const handleResetFilters = React.useCallback(() => {
    setFilters(INITIAL_FILTERS)
    setActiveTab("all")
  }, [])

  // Sync tab change with service type filter
  function handleTabChange(tabId: string) {
    setActiveTab(tabId)
    if (tabId === "all") {
      setFilters((prev) => ({ ...prev, selectedServiceTypes: [] }))
    } else {
      setFilters((prev) => ({ ...prev, selectedServiceTypes: [tabId] }))
    }
  }

  // Filter & sort logic
  const filteredItems = React.useMemo(() => {
    const matched = TRANSPORT_ITEMS.filter((item) => {
      // 1. Tab filter
      if (activeTab !== "all" && item.serviceTypeId !== activeTab) {
        return false
      }

      // 2. Service type checkbox filter
      if (
        filters.selectedServiceTypes.length > 0 &&
        !filters.selectedServiceTypes.includes(item.serviceTypeId)
      ) {
        return false
      }

      // 3. Price preset
      if (filters.pricePreset === "under-500k" && item.price >= 500_000) {
        return false
      }
      if (
        filters.pricePreset === "500k-1m" &&
        (item.price < 500_000 || item.price > 1_000_000)
      ) {
        return false
      }
      if (
        filters.pricePreset === "1m-2m" &&
        (item.price < 1_000_000 || item.price > 2_000_000)
      ) {
        return false
      }
      if (filters.pricePreset === "above-2m" && item.price <= 2_000_000) {
        return false
      }

      // 4. Max price slider
      if (filters.maxPrice < 5_000_000 && item.price > filters.maxPrice) {
        return false
      }

      return true
    })

    return matched.toSorted((a, b) => {
      const activeSort = filters.sortOption || sortBy
      if (activeSort === "price-low") return a.price - b.price
      if (activeSort === "price-high") return b.price - a.price
      if (activeSort === "rating") return b.rating - a.rating
      // default: keep curated design order from reference design
      return 0
    })
  }, [activeTab, filters, sortBy])

  return (
    <div className="w-full bg-[#f8fafc] min-h-screen pb-20">
      {/* 1. Hero Section with Floating Search Widget */}
      <TransportHero
        onSearch={({ pickup }) => {
          if (pickup.includes("Sân bay")) {
            setFilters((prev) => ({
              ...prev,
              selectedLocations: ["san-bay-phu-quoc"],
            }))
          }
        }}
      />

      {/* 2. Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Horizontal Service Tabs Pills */}
        <TransportServiceTabs
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />

        {/* 2-Column Content: Sidebar (Left) + Listings Grid (Right) */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Left Sidebar Filter */}
          <TransportFilterSidebar
            filters={filters}
            onFiltersChange={setFilters}
            onResetFilters={handleResetFilters}
          />

          {/* Right Main Listing Content */}
          <div className="flex-1 w-full min-w-0">
            {/* Listing Header Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-4 border-b border-slate-200">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                  Có 186 dịch vụ di chuyển tại Phú Quốc
                </h2>
                <p className="text-xs sm:text-[13px] text-slate-500 mt-0.5">
                  Đa dạng phương tiện, linh hoạt lựa chọn, phù hợp mọi hành trình của bạn.
                </p>
              </div>

              {/* View & Sort Controls */}
              <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                {/* View Toggles: Lưới vs Danh sách */}
                <div className="flex items-center rounded-xl bg-slate-100 p-1 border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setViewMode("grid")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      viewMode === "grid"
                        ? "bg-[#0A2239] text-white shadow-2xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                    <span>Lưới</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("list")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      viewMode === "list"
                        ? "bg-[#0A2239] text-white shadow-2xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <List className="w-3.5 h-3.5" />
                    <span>Danh sách</span>
                  </button>
                </div>

                {/* Sắp xếp */}
                <div className="relative">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-2xs">
                    <span className="hidden md:inline">Sắp xếp:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="bg-transparent font-semibold text-slate-800 outline-none cursor-pointer pr-4 appearance-none"
                    >
                      <option value="popular">Phổ biến nhất</option>
                      <option value="price-low">Giá: Thấp đến cao</option>
                      <option value="price-high">Giá: Cao đến thấp</option>
                      <option value="rating">Đánh giá cao nhất</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
                  </div>
                </div>

                {/* Hiển thị */}
                <div className="relative hidden xl:block">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-2xs">
                    <span>Hiển thị:</span>
                    <select
                      value={itemsPerPage}
                      onChange={(e) => setItemsPerPage(Number(e.target.value))}
                      className="bg-transparent font-semibold text-slate-800 outline-none cursor-pointer pr-4 appearance-none"
                    >
                      <option value={12}>12 / trang</option>
                      <option value={24}>24 / trang</option>
                      <option value={48}>48 / trang</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Cards Grid: Exactly 5 columns on large screens as reference design */}
            {filteredItems.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center my-6">
                <p className="text-sm font-semibold text-slate-700">
                  Không tìm thấy phương tiện nào phù hợp với bộ lọc hiện tại.
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="mt-3 text-xs text-teal-600 font-bold hover:underline"
                >
                  Xóa bộ lọc và thử lại
                </button>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3.5">
                {filteredItems.map((item) => (
                  <TransportCard
                    key={item.id}
                    item={item}
                    onSelect={(it) => setSelectedTransport(it)}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col md:flex-row items-center gap-4 hover:shadow-md transition-shadow"
                  >
                    <div className="relative w-full md:w-48 h-32 rounded-xl overflow-hidden shrink-0">
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md">
                          {item.serviceType}
                        </span>
                        <span className="text-xs text-slate-500">{item.location}</span>
                      </div>
                      <h4 className="text-base font-bold text-slate-900">{item.title}</h4>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">{item.description}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0 w-full md:w-auto">
                      <div className="text-right">
                        <div className="text-base font-bold text-slate-900">{item.priceDisplay}</div>
                        <div className="text-xs text-slate-500">{item.priceUnit}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedTransport(item)}
                        className="px-4 py-2 rounded-xl bg-[#0A2239] text-white text-xs font-semibold hover:bg-[#071626]"
                      >
                        Xem chi tiết
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 4. Bottom Promotional & Trust Banners */}
            <TransportAdvisoryBanners />
          </div>
        </div>
      </div>

      {/* Detail / Booking Modal */}
      {selectedTransport && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              type="button"
              onClick={() => {
                setSelectedTransport(null)
                setShowBookingSuccess(false)
              }}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/80 backdrop-blur-xs flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-white shadow-xs"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="aspect-[16/9] w-full overflow-hidden relative">
              <Image
                src={selectedTransport.imageUrl}
                alt={selectedTransport.title}
                fill
                unoptimized
                className="object-cover"
              />
              {selectedTransport.badge && (
                <span
                  className={`absolute top-4 left-4 px-2.5 py-1 rounded-md text-xs font-bold uppercase shadow-xs ${selectedTransport.badge.bgClass}`}
                >
                  {selectedTransport.badge.text}
                </span>
              )}
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full">
                  {selectedTransport.serviceType}
                </span>
                <span className="text-xs font-medium text-slate-500">
                  {selectedTransport.location}
                </span>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-2">
                {selectedTransport.title}
              </h3>

              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                {selectedTransport.description}
              </p>

              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100 mb-5">
                <div>
                  <div className="text-[11px] text-slate-400 font-medium">Giá trọn gói</div>
                  <div className="text-lg font-extrabold text-slate-900">
                    {selectedTransport.priceDisplay}{" "}
                    <span className="text-xs font-normal text-slate-500">
                      {selectedTransport.priceUnit}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-amber-500">
                    ★ {selectedTransport.rating} / 5.0
                  </div>
                  <div className="text-[11px] text-slate-400">
                    ({selectedTransport.reviewsCount} đánh giá)
                  </div>
                </div>
              </div>

              {showBookingSuccess ? (
                <div className="p-3.5 rounded-2xl bg-teal-50 border border-teal-200 text-teal-800 flex items-center gap-2.5 text-xs font-semibold">
                  <Check className="w-5 h-5 text-teal-600 shrink-0" />
                  <span>Yêu cầu đặt xe đã được gửi! Chuyên viên STAYEA sẽ liên hệ bạn ngay.</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowBookingSuccess(true)}
                  className="w-full h-11 rounded-xl bg-[#0A2239] hover:bg-[#071626] text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99]"
                >
                  <span>Đặt dịch vụ ngay</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
