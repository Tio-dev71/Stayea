"use client"

import * as React from "react"
import { ArrowUpDown, ChevronDown, ChevronRight } from "lucide-react"
import { PhuQuocHero } from "./phu-quoc-hero"
import { PhuQuocCategoryTabs } from "./phu-quoc-category-tabs"
import { PhuQuocArticleCard } from "./phu-quoc-article-card"
import { PhuQuocSidebar } from "./phu-quoc-sidebar"
import {
  PHU_QUOC_ARTICLES,
  PHU_QUOC_CATEGORIES,
} from "@/features/landing/data/stayea-mock-data"
import type { PhuQuocArticleItem } from "@/features/landing/data/stayea-mock-data"

const SORT_OPTIONS = [
  "Mới nhất",
  "Xem nhiều nhất",
  "Cũ nhất",
]

export function PhuQuocListingPage() {
  const [activeCategory, setActiveCategory] = React.useState<string>("all")
  const [searchQuery, setSearchQuery] = React.useState<string>("")
  const [selectedSort, setSelectedSort] = React.useState<string>(SORT_OPTIONS[0] ?? "Mới nhất")
  const [isSortOpen, setIsSortOpen] = React.useState<boolean>(false)
  const [pageIndex, setPageIndex] = React.useState<number>(1)
  const sortRef = React.useRef<HTMLDivElement>(null)

  // Outside click handler for sort dropdown
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Filter and sort articles
  const filteredArticles = React.useMemo(() => {
    let list: PhuQuocArticleItem[] = [...PHU_QUOC_ARTICLES]

    // Category filter
    if (activeCategory !== "all") {
      list = list.filter((item) => item.categoryId === activeCategory)
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      list = list.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.excerpt.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q)
      )
    }

    // Sort
    if (selectedSort === "Xem nhiều nhất") {
      list = list.toSorted((a, b) => b.viewsCount - a.viewsCount)
    } else if (selectedSort === "Cũ nhất") {
      list = list.toSorted((a, b) => a.id.localeCompare(b.id))
    }

    return list
  }, [activeCategory, searchQuery, selectedSort])

  const totalCount = activeCategory === "all" ? 256 : (PHU_QUOC_CATEGORIES.find((c) => c.id === activeCategory)?.count ?? filteredArticles.length)

  return (
    <div className="w-full bg-[#f8fafc]/50 min-h-screen">
      {/* 1. Panoramic Hero Banner */}
      <PhuQuocHero />

      {/* Main Container */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6">
        {/* 2. Category Tabs & Search Bar */}
        <PhuQuocCategoryTabs
          activeCategory={activeCategory}
          onSelectCategory={(id) => {
            setActiveCategory(id)
            setPageIndex(1)
          }}
          searchQuery={searchQuery}
          onSearchChange={(q) => {
            setSearchQuery(q)
            setPageIndex(1)
          }}
        />

        {/* 3. Main Content: 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 pt-2">
          {/* Left Column: Articles Grid (Span 8 or 9) */}
          <main className="lg:col-span-8 xl:col-span-9 space-y-5">
            {/* Section Header: Title & Sort Dropdown */}
            <div className="flex items-center justify-between pb-1">
              <h2 className="font-sans text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                Tất cả bài viết ({totalCount})
              </h2>

              {/* Sort Dropdown */}
              <div ref={sortRef} className="relative">
                <button
                  type="button"
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  className="h-8 sm:h-9 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition-colors select-none"
                >
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                  <span>{selectedSort}</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isSortOpen ? "rotate-180" : ""}`} />
                </button>

                {isSortOpen && (
                  <div className="absolute right-0 mt-1.5 w-44 bg-white border border-slate-200 rounded-xl shadow-lg z-30 py-1.5 animate-in fade-in-0 zoom-in-95">
                    {SORT_OPTIONS.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          setSelectedSort(opt)
                          setIsSortOpen(false)
                        }}
                        className={`w-full text-left px-3.5 py-2 text-xs transition-colors ${
                          selectedSort === opt
                            ? "bg-teal-50 text-[#0c3b40] font-bold"
                            : "text-slate-700 hover:bg-slate-50 font-medium"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Articles Grid (3 Columns) */}
            {filteredArticles.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
                {filteredArticles.map((article) => (
                  <PhuQuocArticleCard key={article.id} article={article} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
                <p className="text-slate-500 text-sm">
                  Không tìm thấy bài viết nào phù hợp với danh mục hoặc từ khóa tìm kiếm.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setActiveCategory("all")
                    setSearchQuery("")
                  }}
                  className="mt-3 px-4 py-2 rounded-xl bg-[#0c3b40] text-white text-xs font-medium hover:bg-[#072528] transition-colors"
                >
                  Xem tất cả bài viết
                </button>
              </div>
            )}

            {/* Pagination */}
            <div className="pt-8 pb-4 flex justify-center">
              <nav aria-label="Phân trang bài viết" className="flex items-center gap-1.5 text-xs font-semibold select-none">
                {[1, 2, 3, 4, 5].map((page) => {
                  const isActive = pageIndex === page
                  return (
                    <button
                      key={page}
                      type="button"
                      onClick={() => setPageIndex(page)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                        isActive
                          ? "bg-[#0c3b40] text-white shadow-xs"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      }`}
                    >
                      {page}
                    </button>
                  )
                })}
                <span className="px-1 text-slate-400">...</span>
                <button
                  type="button"
                  onClick={() => setPageIndex(26)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    pageIndex === 26
                      ? "bg-[#0c3b40] text-white shadow-xs"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  26
                </button>
                <button
                  type="button"
                  onClick={() => setPageIndex((p) => Math.min(26, p + 1))}
                  aria-label="Trang tiếp theo"
                  className="w-8 h-8 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors ml-1"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </nav>
            </div>
          </main>

          {/* Right Column: Sidebar (Span 4 or 3) */}
          <aside className="lg:col-span-4 xl:col-span-3">
            <PhuQuocSidebar
              activeCategory={activeCategory}
              onSelectCategory={(id) => {
                setActiveCategory(id)
                setPageIndex(1)
              }}
            />
          </aside>
        </div>
      </div>
    </div>
  )
}
