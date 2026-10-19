"use client"

import { useState, useMemo } from "react"
import { Download } from "lucide-react"
import { toast } from "sonner"
import { StayeaAdminHeader } from "@/features/admin-dashboard/components/stayea-admin-header"
import { StayeaAdminSidebar } from "@/features/admin-dashboard/components/stayea-admin-sidebar"
import { StayeaAdminFooter } from "@/features/admin-dashboard/components/stayea-admin-footer"
import {
  MOCK_REVIEWS_LIST,
  MOCK_RATING_DISTRIBUTION,
  MOCK_CATEGORY_REVIEWS,
  MOCK_LOCATION_REVIEWS,
  MOCK_REVIEW_QUICK_ACTIONS,
} from "./stayea-admin-reviews-mock-data"
import type { ReviewItem } from "./stayea-admin-reviews-mock-data"
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
      <div className="flex-1 flex overflow-hidden">
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
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-7 py-6">
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
                <ReviewsKpiCards />

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
                  distribution={MOCK_RATING_DISTRIBUTION}
                  categories={MOCK_CATEGORY_REVIEWS}
                  locations={MOCK_LOCATION_REVIEWS}
                  quickActions={MOCK_REVIEW_QUICK_ACTIONS}
                  onViewDistributionDetails={() =>
                    toast.info("Báo cáo phân bổ đánh giá", {
                      description: "Tỷ lệ khách hàng hài lòng (4 - 5 sao) đạt 89% toàn hệ thống.",
                    })
                  }
                  onViewCategoryDetails={() =>
                    toast.info("Chi tiết theo loại hình", {
                      description: "Tour biển đảo và tham quan chiếm trên 50% tổng lượng đánh giá 5 sao.",
                    })
                  }
                  onViewLocationDetails={() =>
                    toast.info("Chi tiết theo địa điểm", {
                      description: "Phú Quốc hiện đang dẫn đầu với 562 lượt đánh giá trải nghiệm thực tế.",
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
