"use client"

import * as React from "react"
import Link from "next/link"
import { Search, ChevronDown, SlidersHorizontal, X } from "lucide-react"
import { ExperienceHero } from "./experience-hero"
import { ExperienceSidebar } from "./experience-sidebar"
import type { ExperienceFilterState } from "./experience-sidebar"
import { ExperienceCard } from "./experience-card"
import { stayeaApi } from "@/lib/stayea-api-service"
import {
  EXPERIENCE_LISTINGS,
} from "@/features/landing/data/stayea-mock-data"
import type { ExperienceListingItem } from "@/features/landing/data/stayea-mock-data"

const INITIAL_FILTERS: ExperienceFilterState = {
  category: "all",
  priceMax: 5_000_000,
  durations: [],
}

interface ExperienceListingPageProps {
  readonly onNavigate?: (item: string, subCategory?: string, itemData?: any) => void
  readonly initialCategory?: string
}

export function ExperienceListingPage({ onNavigate, initialCategory }: ExperienceListingPageProps = {}) {
  const handleViewDetail = React.useCallback((item: ExperienceListingItem) => {
    onNavigate?.("service-detail", undefined, { type: "experience", item })
  }, [onNavigate])
  const [filters, setFilters] = React.useState<ExperienceFilterState>(() => ({
    ...INITIAL_FILTERS,
    category: initialCategory || "all",
  }))
  const [experiences, setExperiences] = React.useState<readonly ExperienceListingItem[]>(EXPERIENCE_LISTINGS)

  React.useEffect(() => {
    let isMounted = true
    stayeaApi.getExperiences().then((res) => {
      if (!isMounted || !res || !Array.isArray(res.items)) return
      if (res.items.length === 0) {
        setExperiences([])
        return
      }
      const mapped: ExperienceListingItem[] = res.items.map((db: any) => {
        const p = Number(db.price || 0)
        return {
          id: db.id,
          title: db.title,
          tag: db.badge || "Trải nghiệm",
          categoryId: db.category === "tour" ? "tours" : db.category,
          rating: Number(db.rating || 5.0),
          reviewsCount: `${db.reviewCount || 0} đánh giá`,
          description: db.description || "",
          duration: db.duration || "Nửa ngày",
          highlight: Array.isArray(db.highlights) && db.highlights[0] ? db.highlights[0] : "Trải nghiệm độc đáo",
          highlightIcon: "palmtree",
          price: p,
          formattedPrice: `${p.toLocaleString("vi-VN")}đ/khách`,
          imageUrl: db.imageUrl,
        }
      })
      setExperiences(mapped)
    }).catch(() => {})
    return () => {
      isMounted = false
    }
  }, [])

  React.useEffect(() => {
    if (initialCategory) {
      setFilters((prev) => ({ ...prev, category: initialCategory }))
    }
  }, [initialCategory])
  const [searchQuery, setSearchQuery] = React.useState("")
  const [sortBy, setSortBy] = React.useState("popular")
  const [sortDropdownOpen, setSortDropdownOpen] = React.useState(false)
  const [mobileFilterOpen, setMobileFilterOpen] = React.useState(false)

  // Filter logic
  const filteredItems = React.useMemo(() => {
    return experiences.filter((item: ExperienceListingItem) => {
      // 1. Category filter
      if (filters.category !== "all" && item.categoryId !== filters.category) {
        return false
      }

      // 2. Price filter
      if (item.price > filters.priceMax) {
        return false
      }

      // 3. Duration filter
      if (filters.durations.length > 0 && !filters.durations.includes(item.duration)) {
        return false
      }

      // 4. Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase()
        return (
          item.title.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.tag.toLowerCase().includes(query)
        )
      }

      return true
    }).toSorted((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price
      if (sortBy === "price-desc") return b.price - a.price
      if (sortBy === "rating") return b.rating - a.rating
      return 0
    })
  }, [experiences, filters, searchQuery, sortBy])

  const sortLabelMap: Record<string, string> = {
    popular: "Phổ biến nhất",
    "price-asc": "Giá thấp đến cao",
    "price-desc": "Giá cao đến thấp",
    rating: "Đánh giá cao nhất",
  }

  return (
    <div className="w-full bg-[#fbfcfd] min-h-screen">
      {/* 1. Underwater Coral Reef Hero Banner */}
      <ExperienceHero />

      {/* 2. Main Container with Sub-Header Toolbar & 2-Column Grid */}
      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Section Header Bar */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="space-y-1.5 max-w-2xl">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="text-xs text-slate-500 flex items-center gap-1.5 font-medium mb-1">
              <Link href="/" className="hover:text-[#0c3b40] transition-colors">
                Trang chủ
              </Link>
              <span className="text-slate-300">&gt;</span>
              <span className="text-slate-800 font-semibold">Trải nghiệm</span>
            </nav>

            <h2 className="font-sans text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Tất cả trải nghiệm tại Phú Quốc
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Từ biển đảo tuyệt đẹp đến ẩm thực đặc sắc, văn hóa bản địa và những hoạt động thú vị – cùng STAYEA tạo nên hành trình đáng nhớ của bạn.
            </p>
          </div>

          {/* Right Controls: Count + Search + Sort */}
          <div className="flex flex-wrap items-center gap-3 shrink-0 select-none">
            <span className="text-xs text-slate-500 font-medium">
              Hiển thị {filteredItems.length === 0 ? 0 : 1}-{Math.min(12, filteredItems.length)} trong {filteredItems.length} trải nghiệm
            </span>

            {/* Search Input Box */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm trải nghiệm..."
                className="w-48 sm:w-56 pl-3 pr-8 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#0c3b40] transition-colors shadow-2xs"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:border-slate-300 transition-colors shadow-2xs"
              >
                <span>Sắp xếp: <strong className="font-semibold text-slate-900">{sortLabelMap[sortBy]}</strong></span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {sortDropdownOpen && (
                <div className="absolute top-full right-0 mt-1.5 w-44 bg-white rounded-xl shadow-lg border border-slate-100 py-1.5 z-30 animate-in fade-in zoom-in-95">
                  {Object.entries(sortLabelMap).map(([key, label]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => {
                        setSortBy(key)
                        setSortDropdownOpen(false)
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs transition-colors ${
                        sortBy === key
                          ? "bg-teal-50 text-[#0c3b40] font-bold"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 2-Column Content Grid */}
        <div className="flex flex-col lg:flex-row gap-8 xl:gap-10 items-start pt-8">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden w-full flex items-center justify-between pb-3 border-b border-slate-200">
            <button
              type="button"
              onClick={() => setMobileFilterOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-800 shadow-xs"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#0c3b40]" />
              <span>Danh mục & Bộ lọc</span>
            </button>
            <span className="text-xs text-slate-500 font-medium">
              {filteredItems.length} trải nghiệm
            </span>
          </div>

          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block">
            <ExperienceSidebar
              filters={filters}
              onFiltersChange={setFilters}
            />
          </div>

          {/* Mobile Drawer Filter Sidebar */}
          {mobileFilterOpen && (
            <div className="fixed inset-0 z-50 flex lg:hidden">
              <div
                className="fixed inset-0 bg-black/50 backdrop-blur-xs"
                onClick={() => setMobileFilterOpen(false)}
              />
              <div className="relative ml-auto w-full max-w-xs h-full bg-white p-5 overflow-y-auto shadow-2xl z-10 space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="font-bold text-base text-slate-900">Danh mục & Bộ lọc</span>
                  <button
                    type="button"
                    onClick={() => setMobileFilterOpen(false)}
                    className="p-1 rounded-md text-slate-400 hover:text-slate-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <ExperienceSidebar
                  filters={filters}
                  onFiltersChange={setFilters}
                />
              </div>
            </div>
          )}

          {/* Right Column: 4-Column Cards Grid */}
          <div className="flex-1 min-w-0 w-full space-y-6">
            {filteredItems.length === 0 ? (
              <div className="py-16 text-center bg-white rounded-2xl border border-slate-100 p-8 space-y-2">
                <p className="text-slate-800 font-bold text-sm">
                  Chưa có trải nghiệm nào được đăng tải.
                </p>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Bạn có thể tự đăng ký thêm tour đảo, lặn ngắm san hô hoặc hoạt động vui chơi từ Hub đối tác hoặc Quản trị hệ thống.
                </p>
                <button
                  type="button"
                  onClick={() => setFilters(INITIAL_FILTERS)}
                  className="mt-3 text-xs font-semibold text-[#0c3b40] hover:underline cursor-pointer"
                >
                  Xóa tất cả bộ lọc và thử lại
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                {filteredItems.map((item) => (
                  <ExperienceCard key={item.id} item={item} onSelect={() => handleViewDetail(item)} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
