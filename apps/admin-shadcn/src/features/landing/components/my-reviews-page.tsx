"use client"

import * as React from "react"
import Image from "next/image"
import {
  Star,
  MapPin,
  ExternalLink,
  Check,
  AlertCircle,
  X,
  Send,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@workspace/ui/components/dialog"
import { ProfileSidebar } from "./profile-sidebar"
import { MyReviewsHeroBanner } from "./my-reviews-hero-banner"
import { MyReviewsHeaderAndScore } from "./my-reviews-header-and-score"
import { MyReviewsToolbar } from "./my-reviews-toolbar"
import type { ReviewSortOption } from "./my-reviews-toolbar"
import { MyReviewsList } from "./my-reviews-list"
import { MyReviewsCtaBanner } from "./my-reviews-cta-banner"
import {
  MY_REVIEWS_ITEMS,
  MY_REVIEWS_SUMMARY,
} from "@/features/landing/data/stayea-mock-data"
import type {
  UserReviewItem,
  ReviewCategory,
  ReviewCategoryTab,
} from "@/features/landing/data/stayea-mock-data"

interface MyReviewsPageProps {
  readonly onNavigate?: (route: string) => void
}

export function MyReviewsPage({ onNavigate }: MyReviewsPageProps) {
  // 1. State: Category filter & Sort
  const [activeCategory, setActiveCategory] = React.useState<ReviewCategory>("all")
  const [sortBy, setSortBy] = React.useState<ReviewSortOption>("newest")

  // 2. Reviews state
  const [reviewsList, setReviewsList] = React.useState<readonly UserReviewItem[]>(MY_REVIEWS_ITEMS)

  // 3. Modals state
  const [editingReview, setEditingReview] = React.useState<UserReviewItem | null>(null)
  const [editRating, setEditRating] = React.useState<number>(5)
  const [editComment, setEditComment] = React.useState<string>("")

  const [isWriteModalOpen, setIsWriteModalOpen] = React.useState<boolean>(false)
  const [newReviewService, setNewReviewService] = React.useState<string>("Phú Quốc – Biển xanh, nắng vàng")
  const [newReviewRating, setNewReviewRating] = React.useState<number>(5)
  const [newReviewComment, setNewReviewComment] = React.useState<string>("")

  const [selectedReviewForDetail, setSelectedReviewForDetail] = React.useState<UserReviewItem | null>(null)

  // 4. Toast feedback state
  const [toastMessage, setToastMessage] = React.useState<string | null>(null)
  const [toastType, setToastType] = React.useState<"success" | "info">("info")
  const toastTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)

  const showToast = React.useCallback(
    (message: string, type: "success" | "info" = "info") => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current)
      }
      setToastMessage(message)
      setToastType(type)
      toastTimeoutRef.current = setTimeout(() => {
        setToastMessage(null)
      }, 4000)
    },
    []
  )

  // Computed summary
  const averageRating = React.useMemo(() => {
    if (reviewsList.length === 0) return 0
    const sum = reviewsList.reduce((acc, r) => acc + r.rating, 0)
    return Math.round((sum / reviewsList.length) * 10) / 10
  }, [reviewsList])

  // Computed tabs
  const computedTabs = React.useMemo<readonly ReviewCategoryTab[]>(() => {
    const stayCount = reviewsList.filter((r) => r.category === "stay").length
    const expCount = reviewsList.filter((r) => r.category === "experience").length
    const transCount = reviewsList.filter((r) => r.category === "transport").length
    const diningCount = reviewsList.filter((r) => r.category === "dining").length

    return [
      { id: "all", label: "Tất cả", count: reviewsList.length },
      { id: "stay", label: "Lưu trú", count: stayCount },
      { id: "experience", label: "Trải nghiệm", count: expCount },
      { id: "transport", label: "Di chuyển", count: transCount },
      { id: "dining", label: "Ẩm thực", count: diningCount },
    ]
  }, [reviewsList])

  // Filtered & sorted items
  const processedItems = React.useMemo(() => {
    let result =
      activeCategory === "all"
        ? [...reviewsList]
        : reviewsList.filter((r) => r.category === activeCategory)

    if (sortBy === "highest") {
      result.sort((a, b) => b.rating - a.rating)
    } else if (sortBy === "lowest") {
      result.sort((a, b) => a.rating - b.rating)
    } else if (sortBy === "oldest") {
      result.reverse()
    }

    return result
  }, [reviewsList, activeCategory, sortBy])

  // Handlers
  function handleOpenEditModal(review: UserReviewItem) {
    setEditingReview(review)
    setEditRating(review.rating)
    setEditComment(review.comment)
  }

  function handleSaveEditReview() {
    if (!editingReview) return

    setReviewsList((prev) =>
      prev.map((r) =>
        r.id === editingReview.id
          ? {
              ...r,
              rating: editRating,
              comment: editComment.trim() || r.comment,
            }
          : r
      )
    )

    setEditingReview(null)
    showToast(`Đã cập nhật đánh giá cho "${editingReview.title}"`, "success")
  }

  function handleSubmitNewReview() {
    if (!newReviewComment.trim()) {
      showToast("Vui lòng nhập nội dung đánh giá trước khi gửi", "info")
      return
    }

    const newRev: UserReviewItem = {
      id: `rev-${Date.now()}`,
      title: newReviewService,
      category: "experience",
      categoryTagLabel: "Trải nghiệm",
      categoryTagVariant: "sky",
      date: new Date().toLocaleDateString("vi-VN"),
      location: "Phú Quốc (PQC)",
      rating: newReviewRating,
      comment: newReviewComment.trim(),
      imageUrl: "/profile/bai-sao.jpg",
      targetRoute: "packages",
    }

    setReviewsList((prev) => [newRev, ...prev])
    setIsWriteModalOpen(false)
    setNewReviewComment("")
    showToast("Cảm ơn bạn đã đóng góp đánh giá mới cho cộng đồng STAYEA!", "success")
  }

  function handleSelectSidebarTab(tabId: string) {
    if (tabId === "reviews") return
    if (tabId === "deals" || tabId === "my-deals") {
      onNavigate?.("my-deals")
      return
    }
    if (tabId === "staya-club" || tabId === "stayea-club") {
      onNavigate?.("stayea-club")
      return
    }
    if (tabId === "settings" || tabId === "cai-dat") {
      onNavigate?.("settings")
      return
    }
    onNavigate?.(tabId)
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* 1. Hero Panorama Banner */}
      <MyReviewsHeroBanner />

      {/* 2. Main 2-Column Dashboard Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
          {/* Left Sidebar Menu */}
          <ProfileSidebar
            activeTab="reviews"
            hideBadges
            onSelectTab={handleSelectSidebarTab}
            onLogout={() => {
              showToast("Đã đăng xuất thành công!", "info")
              setTimeout(() => onNavigate?.("login"), 600)
            }}
          />

          {/* Right Main Content Area */}
          <div className="flex-1 w-full space-y-5">
            {/* Header + Rating Score Widget */}
            <MyReviewsHeaderAndScore
              averageRating={averageRating}
              totalReviews={reviewsList.length}
              thankYouMessage={MY_REVIEWS_SUMMARY.thankYouMessage}
            />

            {/* Category Tabs & Sort Dropdown */}
            <MyReviewsToolbar
              activeCategory={activeCategory}
              tabs={computedTabs}
              onSelectCategory={setActiveCategory}
              sortBy={sortBy}
              onSelectSort={setSortBy}
            />

            {/* Reviews List */}
            <MyReviewsList
              items={processedItems}
              onEditReview={handleOpenEditModal}
              onViewDetails={(item) => setSelectedReviewForDetail(item)}
              onResetFilter={() => setActiveCategory("all")}
            />

            {/* Bottom Callout: Write Review */}
            <MyReviewsCtaBanner
              onWriteReviewClick={() => setIsWriteModalOpen(true)}
            />
          </div>
        </div>
      </div>

      {/* 3. Toast Notification Pill */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-3 duration-300">
          <div className="bg-[#0A2239] text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-700/60 max-w-md">
            <span className="text-sm shrink-0">
              {toastType === "success" ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 text-sky-400" />
              )}
            </span>

            <p className="text-xs sm:text-sm font-medium flex-1">{toastMessage}</p>

            <button
              type="button"
              onClick={() => setToastMessage(null)}
              className="text-slate-400 hover:text-white shrink-0"
              aria-label="Đóng"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 4. Modal Chỉnh sửa Đánh giá */}
      <Dialog
        open={Boolean(editingReview)}
        onOpenChange={(open) => {
          if (!open) setEditingReview(null)
        }}
      >
        <DialogContent className="sm:max-w-lg rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900">
              Chỉnh sửa đánh giá
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm text-slate-500">
              {editingReview?.title}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Interactive Star Picker */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Mức độ hài lòng của bạn
              </label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((starVal) => (
                  <button
                    key={starVal}
                    type="button"
                    onClick={() => setEditRating(starVal)}
                    className="p-1 hover:scale-110 transition-transform cursor-pointer"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        starVal <= editRating
                          ? "fill-amber-400 text-amber-500"
                          : "fill-slate-100 text-slate-300"
                      }`}
                    />
                  </button>
                ))}
                <span className="text-sm font-bold text-slate-900 ml-2">
                  {editRating}.0 / 5.0
                </span>
              </div>
            </div>

            {/* Comment Textarea */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Nhận xét chi tiết
              </label>
              <textarea
                value={editComment}
                onChange={(e) => setEditComment(e.target.value)}
                rows={4}
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#0A2239] transition-all resize-none"
                placeholder="Chia sẻ trải nghiệm của bạn về dịch vụ này..."
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setEditingReview(null)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold transition-all"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleSaveEditReview}
              className="px-4 py-2 rounded-xl bg-[#0A2239] hover:bg-[#12365A] text-white text-xs font-semibold shadow-2xs transition-all"
            >
              Lưu thay đổi
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 5. Modal Viết đánh giá mới */}
      <Dialog open={isWriteModalOpen} onOpenChange={setIsWriteModalOpen}>
        <DialogContent className="sm:max-w-lg rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
              <span>Viết đánh giá mới</span>
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm text-slate-500">
              Chia sẻ cảm nhận về dịch vụ hoặc trải nghiệm gần đây bạn đã tham gia cùng STAYEA.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Service Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Chọn dịch vụ / chuyến đi đã trải nghiệm
              </label>
              <select
                value={newReviewService}
                onChange={(e) => setNewReviewService(e.target.value)}
                className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#0A2239] bg-white transition-all"
              >
                <option value="Phú Quốc – Biển xanh, nắng vàng">
                  Phú Quốc – Biển xanh, nắng vàng
                </option>
                <option value="Khám phá Hòn Thơm">Khám phá Hòn Thơm</option>
                <option value="Sunset Sanato">Sunset Sanato</option>
                <option value="Grand World Phú Quốc">Grand World Phú Quốc</option>
                <option value="VinWonders Phú Quốc">VinWonders Phú Quốc</option>
              </select>
            </div>

            {/* Rating Stars Picker */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Đánh giá chất lượng
              </label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((starVal) => (
                  <button
                    key={starVal}
                    type="button"
                    onClick={() => setNewReviewRating(starVal)}
                    className="p-1 hover:scale-110 transition-transform cursor-pointer"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        starVal <= newReviewRating
                          ? "fill-amber-400 text-amber-500"
                          : "fill-slate-100 text-slate-300"
                      }`}
                    />
                  </button>
                ))}
                <span className="text-sm font-bold text-slate-900 ml-2">
                  {newReviewRating}.0 / 5.0
                </span>
              </div>
            </div>

            {/* Comment Textarea */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Nội dung nhận xét & lời khuyên cho du khách
              </label>
              <textarea
                value={newReviewComment}
                onChange={(e) => setNewReviewComment(e.target.value)}
                rows={4}
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#0A2239] transition-all resize-none"
                placeholder="Hãy chia sẻ điều bạn ấn tượng nhất về dịch vụ, phong cách phục vụ, không gian..."
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsWriteModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold transition-all"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleSubmitNewReview}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0A2239] hover:bg-[#12365A] text-white text-xs font-semibold shadow-2xs transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Gửi đánh giá</span>
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 6. Modal Chi tiết Đánh giá */}
      <Dialog
        open={Boolean(selectedReviewForDetail)}
        onOpenChange={(open) => {
          if (!open) setSelectedReviewForDetail(null)
        }}
      >
        <DialogContent className="sm:max-w-xl p-0 overflow-hidden rounded-2xl">
          {selectedReviewForDetail && (
            <div>
              <div className="relative w-full h-48 sm:h-56 bg-slate-900">
                <Image
                  src={selectedReviewForDetail.imageUrl}
                  alt={selectedReviewForDetail.title}
                  fill
                  unoptimized
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute top-4 left-4 z-10">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/95 text-slate-900 backdrop-blur-xs shadow-xs">
                    {selectedReviewForDetail.categoryTagLabel}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4 z-10 text-white">
                  <h3 className="text-lg sm:text-xl font-bold drop-shadow-md">
                    {selectedReviewForDetail.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-white/90 mt-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="font-bold">{selectedReviewForDetail.rating.toFixed(1)}</span>
                    <span>• Đã đăng ngày {selectedReviewForDetail.date}</span>
                  </div>
                </div>
              </div>

              <div className="p-5 sm:p-6 space-y-4">
                <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{selectedReviewForDetail.location}</span>
                </div>

                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Nhận xét của bạn
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50/70 p-3.5 rounded-xl border border-slate-100">
                    "{selectedReviewForDetail.comment}"
                  </p>
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      const itemToEdit = selectedReviewForDetail
                      setSelectedReviewForDetail(null)
                      handleOpenEditModal(itemToEdit)
                    }}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-all"
                  >
                    Chỉnh sửa
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const target = selectedReviewForDetail.targetRoute || "packages"
                      setSelectedReviewForDetail(null)
                      onNavigate?.(target)
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0A2239] text-white hover:bg-[#12365A] text-xs font-semibold shadow-2xs transition-all"
                  >
                    <span>Xem dịch vụ</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
