"use client"

import { useState, useMemo } from "react"
import { Download } from "lucide-react"
import { toast } from "sonner"
import { StayeaAdminHeader } from "@/features/admin-dashboard/components/stayea-admin-header"
import { StayeaAdminSidebar } from "@/features/admin-dashboard/components/stayea-admin-sidebar"
import { StayeaAdminFooter } from "@/features/admin-dashboard/components/stayea-admin-footer"
import {
  MOCK_REVIEWS_LIST,
  MOCK_REVIEW_QUICK_ACTIONS,
} from "./stayea-admin-reviews-mock-data"
import type {
  ReviewItem,
  ReviewKpiItem,
  RatingDistributionSlice,
  CategoryReviewCountItem,
  LocationReviewCountItem,
} from "./stayea-admin-reviews-mock-data"
import { ReviewsKpiCards } from "./components/reviews-kpi-cards"
import { ReviewsFilterBar } from "./components/reviews-filter-bar"
import type { StarTabType } from "./components/reviews-star-tabs"
import { ReviewsStarTabs } from "./components/reviews-star-tabs"
import { ReviewsDataTable } from "./components/reviews-data-table"
import { ReviewsRightSidebar } from "./components/reviews-right-sidebar"
import { ExportReviewsModal } from "./components/export-reviews-modal"
import { ReplyReviewModal } from "./components/reply-review-modal"

interface StayeaAdminReviewsPageProps {
  onNavigateLanding?: () => void
  onNavigateTab?: (tabId: string) => void
}

export function StayeaAdminReviewsPage({
  onNavigateLanding,
  onNavigateTab,
}: StayeaAdminReviewsPageProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [reviewsList, setReviewsList] = useState<ReviewItem[]>([...MOCK_REVIEWS_LIST])
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)
  const [selectedReviewForReply, setSelectedReviewForReply] = useState<ReviewItem | null>(null)
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false)

  // Filters state
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Tất cả loại hình")
  const [selectedLocation, setSelectedLocation] = useState("Tất cả địa điểm")
  const [selectedRating, setSelectedRating] = useState("Tất cả đánh giá")
  const [selectedTimeRange, setSelectedTimeRange] = useState("Thời gian: 30 ngày")
  const [activeStarTab, setActiveStarTab] = useState<StarTabType>("all")
  const [selectedSort, setSelectedSort] = useState("newest")

  // Filtered reviews
  const filteredReviews = useMemo(() => {
    const list = reviewsList.filter((review) => {
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim()
        const matchCustomer = review.customerName.toLowerCase().includes(query)
        const matchTour = review.tourTitle.toLowerCase().includes(query)
        const matchContent = review.content.toLowerCase().includes(query)
        if (!matchCustomer && !matchTour && !matchContent) return false
      }

      // Star tab filter
      if (activeStarTab !== "all") {
        const targetStars = Number.parseInt(activeStarTab, 10)
        if (review.rating !== targetStars) return false
      }

      // Rating dropdown filter
      if (selectedRating !== "Tất cả đánh giá") {
        const stars = Number.parseInt(selectedRating[0] || "0", 10)
        if (stars > 0 && review.rating !== stars) return false
      }

      // Location dropdown
      if (
        selectedLocation !== "Tất cả địa điểm" &&
        !review.tourLocation.includes(selectedLocation)
      ) {
        return false
      }

      // Category dropdown
      if (
        selectedCategory !== "Tất cả loại hình" &&
        review.category !== selectedCategory
      ) {
        return false
      }

      return true
    })

    // Sorting
    return list.toSorted((a, b) => {
      if (selectedSort === "highest") return b.rating - a.rating
      if (selectedSort === "lowest") return a.rating - b.rating
      return 0
    })
  }, [
    reviewsList,
    searchQuery,
    activeStarTab,
    selectedRating,
    selectedLocation,
    selectedCategory,
    selectedSort,
  ])

  // Dynamic star counts for tabs
  const starCounts = useMemo(() => {
    const counts = { all: reviewsList.length, star5: 0, star4: 0, star3: 0, star2: 0, star1: 0 }
    reviewsList.forEach((r) => {
      const star = Math.max(1, Math.min(5, Math.round(r.rating || 5)))
      if (star === 5) counts.star5 += 1
      else if (star === 4) counts.star4 += 1
      else if (star === 3) counts.star3 += 1
      else if (star === 2) counts.star2 += 1
      else if (star === 1) counts.star1 += 1
    })
    return counts
  }, [reviewsList])

  // Dynamic rating distribution from reviews
  const dynamicDistribution: RatingDistributionSlice[] = useMemo(() => {
    if (reviewsList.length === 0) return []
    const total = reviewsList.length
    return [
      { stars: 5, label: "5 sao", count: starCounts.star5, percentage: Math.round((starCounts.star5 / total) * 100), color: "#007a48" },
      { stars: 4, label: "4 sao", count: starCounts.star4, percentage: Math.round((starCounts.star4 / total) * 100), color: "#10b981" },
      { stars: 3, label: "3 sao", count: starCounts.star3, percentage: Math.round((starCounts.star3 / total) * 100), color: "#f59e0b" },
      { stars: 2, label: "2 sao", count: starCounts.star2, percentage: Math.round((starCounts.star2 / total) * 100), color: "#0284c7" },
      { stars: 1, label: "1 sao", count: starCounts.star1, percentage: Math.round((starCounts.star1 / total) * 100), color: "#ef4444" },
    ]
  }, [reviewsList, starCounts])

  // Dynamic categories from reviews
  const dynamicCategories: CategoryReviewCountItem[] = useMemo(() => {
    if (reviewsList.length === 0) return []
    const counts: Record<string, number> = {}
    reviewsList.forEach((r) => {
      const cat = r.category || "Trải nghiệm"
      counts[cat] = (counts[cat] || 0) + 1
    })
    const total = reviewsList.length
    return Object.entries(counts).map(([name, count], idx) => ({
      id: `cat-${idx}`,
      name,
      icon: "island",
      count,
      percentage: Math.round((count / total) * 100),
    }))
  }, [reviewsList])

  // Dynamic locations from reviews
  const dynamicLocations: LocationReviewCountItem[] = useMemo(() => {
    if (reviewsList.length === 0) return []
    const counts: Record<string, number> = {}
    reviewsList.forEach((r) => {
      const loc = r.tourLocation || "Phú Quốc"
      counts[loc] = (counts[loc] || 0) + 1
    })
    return Object.entries(counts).map(([city, count], idx) => ({
      id: `loc-${idx}`,
      rank: idx + 1,
      city,
      reviewCountFormatted: `${count} đánh giá`,
      imageUrl: "/phu-quoc/hero-phu-quoc.jpg",
    }))
  }, [reviewsList])

  // Dynamic KPI Cards
  const dynamicKpis: ReviewKpiItem[] = useMemo(() => {
    const total = reviewsList.length
    if (total === 0) {
      return [
        {
          id: "avg-rating",
          title: "Đánh giá trung bình",
          value: "0.0/5",
          trendPercent: "0%",
          trendLabel: "chưa có đánh giá",
          isPositive: true,
          icon: "star",
          colorTheme: "yellow",
        },
        {
          id: "total-reviews",
          title: "Tổng số đánh giá",
          value: "0",
          trendPercent: "0%",
          trendLabel: "dữ liệu thực tế",
          isPositive: true,
          icon: "total",
          colorTheme: "blue",
        },
        {
          id: "positive-rate",
          title: "Đánh giá tích cực",
          value: "0%",
          trendPercent: "0%",
          trendLabel: "chưa có dữ liệu",
          isPositive: true,
          icon: "positive",
          colorTheme: "green",
        },
        {
          id: "new-reviews",
          title: "Đánh giá mới",
          value: "0",
          trendPercent: "0%",
          trendLabel: "tuần này",
          isPositive: true,
          icon: "new",
          colorTheme: "purple",
        },
      ]
    }
    const avg = (reviewsList.reduce((acc, r) => acc + (r.rating || 5), 0) / total).toFixed(1)
    const positive = reviewsList.filter((r) => r.rating >= 4).length
    const positiveRate = Math.round((positive / total) * 100)
    return [
      {
        id: "avg-rating",
        title: "Đánh giá trung bình",
        value: `${avg}/5`,
        trendPercent: "100%",
        trendLabel: "tổng hợp thực tế",
        isPositive: true,
        icon: "star",
        colorTheme: "yellow",
      },
      {
        id: "total-reviews",
        title: "Tổng số đánh giá",
        value: String(total),
        trendPercent: "100%",
        trendLabel: "dữ liệu thực tế",
        isPositive: true,
        icon: "total",
        colorTheme: "blue",
      },
      {
        id: "positive-rate",
        title: "Đánh giá tích cực",
        value: `${positiveRate}%`,
        trendPercent: `${positiveRate}%`,
        trendLabel: "4 - 5 sao",
        isPositive: true,
        icon: "positive",
        colorTheme: "green",
      },
      {
        id: "new-reviews",
        title: "Đánh giá mới",
        value: String(reviewsList.length),
        trendPercent: "0%",
        trendLabel: "tuần này",
        isPositive: true,
        icon: "new",
        colorTheme: "purple",
      },
    ]
  }, [reviewsList])

  // Handlers
  const handleExport = (options: {
    format: "xlsx" | "pdf" | "csv"
    timeframe: string
    ratingFilter: string
    includeComments: boolean
  }) => {
    toast.success("Xuất báo cáo đánh giá thành công!", {
      description: `Đã chuẩn bị tệp .${options.format.toUpperCase()} cho kỳ ${options.timeframe}. Tải xuống bắt đầu sau giây lát.`,
    })
  }

  const handleReviewAction = (
    review: ReviewItem,
    action: "view" | "reply" | "hide" | "delete"
  ) => {
    if (action === "reply") {
      setSelectedReviewForReply(review)
      setIsReplyModalOpen(true)
    } else if (action === "view") {
      toast.info(`Đánh giá của ${review.customerName}`, {
        description: `"${review.content}" (${review.rating} sao • ${review.tourTitle})`,
      })
    } else if (action === "hide") {
      setReviewsList((prev) =>
        prev.map((item) =>
          item.id === review.id
            ? {
                ...item,
                status: item.status === "displayed" ? "pending" : "displayed",
              }
            : item
        )
      )
      toast.success(
        review.status === "displayed"
          ? `Đã ẩn đánh giá của ${review.customerName}`
          : `Đã công khai đánh giá của ${review.customerName}`
      )
    } else if (action === "delete") {
      setReviewsList((prev) => prev.filter((item) => item.id !== review.id))
      toast.success(`Đã xóa đánh giá của ${review.customerName}`)
    }
  }

  const handleReplySubmit = (reviewId: string, replyContent: string) => {
    setReviewsList((prev) =>
      prev.map((item) =>
        item.id === reviewId
          ? {
              ...item,
              status: "replied",
              replyText: replyContent,
              repliedAt: "Vừa xong",
            }
          : item
      )
    )
    toast.success("Đã gửi phản hồi đánh giá thành công!", {
      description: "Phản hồi của bạn đã được xuất bản công khai trên trang chi tiết dịch vụ.",
    })
  }

  const handleQuickAction = (actionId: string) => {
    switch (actionId) {
      case "new-reviews":
        setActiveStarTab("all")
        setSearchQuery("")
        toast.info("Đang lọc hiển thị các đánh giá mới nhất")
        break
      case "reply-pending": {
        const pendingReview = reviewsList.find((r) => r.status === "pending" || r.status === "displayed")
        if (pendingReview) {
          setSelectedReviewForReply(pendingReview)
          setIsReplyModalOpen(true)
        } else {
          toast.info("Tất cả đánh giá hiện đã được phản hồi đầy đủ!")
        }
        break
      }
      case "manage-reviews":
        toast.info("Bạn đang ở chế độ Quản lý danh sách đánh giá")
        break
      case "review-policy":
        toast.info("Chính sách đánh giá Stayea", {
          description: "Mọi đánh giá phải tuân thủ tiêu chuẩn cộng đồng, không chứa từ ngữ phản cảm và được xác thực qua mã đặt chỗ thực tế.",
        })
        break
      default:
        break
    }
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans antialiased">
      {/* 1. Header with exact search placeholder */}
      <StayeaAdminHeader
        searchPlaceholder="Tìm kiếm tour, trải nghiệm, địa điểm, đối tác..."
        onNavigateLanding={onNavigateLanding}
        onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        onSearch={(query) => {
          if (query.trim()) {
            setSearchQuery(query)
            toast.info(`Tìm kiếm: "${query}"`, {
              description: "Đang lọc danh sách đánh giá...",
            })
          }
        }}
      />

      {/* 2. Main Body */}
      <div className="flex-1 flex overflow-hidden min-w-0">
        {/* Left Sidebar */}
        <div className={`${sidebarOpen ? "block" : "hidden"} lg:block`}>
          <StayeaAdminSidebar
            activeTab="danh-gia"
            promoTitle="Phú Quốc"
            promoSubtitle="Trải nghiệm vạn điều thú vị"
            promoButtonText="Khám phá ngay"
            onSelectTab={(tabId) => {
              if (onNavigateTab) {
                onNavigateTab(tabId)
              }
            }}
            onExplorePhuQuoc={() => {
              window.location.hash = "phu-quoc"
              onNavigateLanding?.()
            }}
          />
        </div>

        {/* Scrollable Main Content */}
        <main className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden px-4 sm:px-6 lg:px-7 py-6">
          <div className="max-w-[1600px] w-full mx-auto space-y-5">
            {/* Page Title & Action Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-tight">
                  Đánh giá
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Quản lý và theo dõi đánh giá của khách hàng về các trải nghiệm, tour và dịch vụ trên Stayea.
                </p>
              </div>

              {/* Export Report Action */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsExportModalOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#007a48] hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs sm:text-sm font-semibold shadow-xs hover:shadow-md transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4 stroke-[2.2]" />
                  <span>Xuất báo cáo</span>
                </button>
              </div>
            </div>

            {/* 2-Column Grid Layout: 75% Left Main Column / 25% Right Sidebar */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
              {/* Left Column (col-span-9 on xl, col-span-8 on lg) */}
              <div className="xl:col-span-9 space-y-4 sm:space-y-5">
                {/* 4 KPI Cards */}
                <ReviewsKpiCards stats={dynamicKpis} />

                {/* Filter Bar */}
                <ReviewsFilterBar
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                  selectedLocation={selectedLocation}
                  onLocationChange={setSelectedLocation}
                  selectedRating={selectedRating}
                  onRatingChange={setSelectedRating}
                  selectedTimeRange={selectedTimeRange}
                  onTimeRangeChange={setSelectedTimeRange}
                  onOpenAdvancedFilter={() =>
                    toast.info("Bộ lọc nâng cao", {
                      description: "Đã bật cấu hình lọc chi tiết theo thời gian lưu trú và phương thức đặt chỗ.",
                    })
                  }
                />

                {/* Star Rating Tabs & Sort */}
                <ReviewsStarTabs
                  activeTab={activeStarTab}
                  onSelectTab={setActiveStarTab}
                  selectedSort={selectedSort}
                  onSortChange={setSelectedSort}
                  counts={starCounts}
                />

                {/* Reviews Data Table with Pagination & Bulk selection */}
                <ReviewsDataTable
                  reviews={filteredReviews}
                  onActionClick={handleReviewAction}
                />
              </div>

              {/* Right Column (col-span-3 on xl, col-span-4 on lg) */}
              <div className="xl:col-span-3">
                <ReviewsRightSidebar
                  totalReviews={filteredReviews.length}
                  distribution={dynamicDistribution}
                  categories={dynamicCategories}
                  locations={dynamicLocations}
                  quickActions={MOCK_REVIEW_QUICK_ACTIONS}
                  onViewDistributionDetails={() =>
                    toast.info("Báo cáo phân bổ đánh giá", {
                      description: dynamicDistribution.length > 0
                        ? "Tỷ lệ đánh giá dựa trên dữ liệu thực tế hệ thống."
                        : "Chưa có dữ liệu đánh giá nào được ghi nhận.",
                    })
                  }
                  onViewCategoryDetails={() =>
                    toast.info("Chi tiết theo loại hình", {
                      description: dynamicCategories.length > 0
                        ? `${dynamicCategories[0]?.name} đang dẫn đầu đánh giá.`
                        : "Chưa có dữ liệu theo loại hình.",
                    })
                  }
                  onViewLocationDetails={() =>
                    toast.info("Chi tiết theo địa điểm", {
                      description: dynamicLocations.length > 0
                        ? `${dynamicLocations[0]?.city} đang dẫn đầu đánh giá.`
                        : "Chưa có dữ liệu theo địa điểm.",
                    })
                  }
                  onQuickAction={handleQuickAction}
                  onPromoClick={() =>
                    toast.info("Khu vực trải nghiệm khách hàng", {
                      description: "Xem các video feedback và ảnh check-in thực tế của du khách tại Phú Quốc.",
                    })
                  }
                />
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Footer */}
      <StayeaAdminFooter />

      {/* Export Report Modal */}
      <ExportReviewsModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={handleExport}
      />

      {/* Reply Review Modal */}
      <ReplyReviewModal
        isOpen={isReplyModalOpen}
        review={selectedReviewForReply}
        onClose={() => {
          setIsReplyModalOpen(false)
          setSelectedReviewForReply(null)
        }}
        onSubmitReply={handleReplySubmit}
      />
    </div>
  )
}
