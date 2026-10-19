"use client"

import * as React from "react"
import Image from "next/image"
import {
  X,
  Star,
  MapPin,
  CheckCircle2,
  Crown,
  Shield,
} from "lucide-react"
import { NewBookingHeroBanner } from "./new-booking-hero-banner"
import { ProfileSidebar } from "./profile-sidebar"
import { NewBookingHeaderAndPromo } from "./new-booking-header-and-promo"
import { NewBookingToolbar } from "./new-booking-toolbar"
import type { ServiceFilterType } from "./new-booking-toolbar"
import { NewBookingCategoryGrid } from "./new-booking-category-grid"
import { NewBookingRecommendations } from "./new-booking-recommendations"
import {
  NEW_BOOKING_CATEGORIES,
  NEW_BOOKING_RECOMMENDATIONS,
} from "@/features/landing/data/stayea-mock-data"
import type {
  NewBookingCategoryItem,
  NewBookingRecommendationItem,
} from "@/features/landing/data/stayea-mock-data"

interface NewBookingPageProps {
  readonly onNavigate?: (route: string) => void
}

export function NewBookingPage({ onNavigate }: NewBookingPageProps) {
  // 1. Filter and search state
  const [activeFilterTab, setActiveFilterTab] = React.useState<ServiceFilterType>("all")
  const [searchQuery, setSearchQuery] = React.useState<string>("")
  const [toastMessage, setToastMessage] = React.useState<string | null>(null)

  // 2. Modals state
  const [selectedRecommendation, setSelectedRecommendation] =
    React.useState<NewBookingRecommendationItem | null>(null)
  const [isClubModalOpen, setIsClubModalOpen] = React.useState<boolean>(false)

  function showToast(msg: string) {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage(null)
    }, 3200)
  }

  // 3. Filtered Categories
  const filteredCategories = React.useMemo(() => {
    return NEW_BOOKING_CATEGORIES.filter((category: NewBookingCategoryItem) => {
      // Tab filter
      if (activeFilterTab !== "all" && category.id !== activeFilterTab) {
        return false
      }
      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase()
        const matchTitle = category.title.toLowerCase().includes(query)
        const matchDesc = category.description.toLowerCase().includes(query)
        return matchTitle || matchDesc
      }
      return true
    })
  }, [activeFilterTab, searchQuery])

  // 4. Filtered Recommendations
  const filteredRecommendations = React.useMemo(() => {
    return NEW_BOOKING_RECOMMENDATIONS.filter(
      (item: NewBookingRecommendationItem) => {
        // Tab filter
        if (activeFilterTab !== "all" && item.category !== activeFilterTab) {
          return false
        }
        // Search query filter
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase()
          const matchTitle = item.title.toLowerCase().includes(query)
          const matchLoc = item.location.toLowerCase().includes(query)
          return matchTitle || matchLoc
        }
        return true
      }
    )
  }, [activeFilterTab, searchQuery])

  function handleSelectCategory(targetRoute: string, categoryId: string) {
    showToast(`Đang chuyển tới chuyên mục ${categoryId}...`)
    setTimeout(() => {
      onNavigate?.(targetRoute)
    }, 400)
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-20 right-5 z-50 flex items-center gap-2.5 px-4 py-3 bg-[#0A2239] text-white text-xs sm:text-sm font-medium rounded-xl shadow-xl animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Hero Cover Banner */}
      <NewBookingHeroBanner />

      {/* 2. Main 2-Column Responsive Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 sm:py-8">
        <div className="flex flex-col lg:flex-row items-start gap-6 xl:gap-8">
          {/* Left Sidebar (same as Bookings & Profile) */}
          <ProfileSidebar
            activeTab="bookings"
            hideBadges
            onSelectTab={(tabId) => {
              if (tabId === "deals" || tabId === "my-deals") {
                onNavigate?.("my-deals")
              } else if (tabId === "staya-club" || tabId === "stayea-club") {
                onNavigate?.("stayea-club")
              } else if (tabId === "settings" || tabId === "cai-dat") {
                onNavigate?.("settings")
              } else {
                onNavigate?.(tabId)
              }
            }}
            onLogout={() => {
              showToast("Đã đăng xuất thành công!")
              setTimeout(() => onNavigate?.("login"), 500)
            }}
          />

          {/* Right Main Content Column */}
          <main className="flex-1 w-full space-y-5">
            {/* Page Header Title + Staya Club Member Promo */}
            <NewBookingHeaderAndPromo
              onExploreClub={() => setIsClubModalOpen(true)}
            />

            {/* Category Filter Tabs & Search Input Toolbar */}
            <NewBookingToolbar
              activeTab={activeFilterTab}
              onSelectTab={setActiveFilterTab}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />

            {/* 4 Core Category Cards Grid (2x2) */}
            {filteredCategories.length > 0 ? (
              <NewBookingCategoryGrid
                categories={filteredCategories}
                onSelectCategory={handleSelectCategory}
              />
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-2">
                <p className="text-sm font-semibold text-slate-700">
                  Không tìm thấy dịch vụ phù hợp với &quot;{searchQuery}&quot;
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setActiveFilterTab("all")
                    setSearchQuery("")
                  }}
                  className="text-xs font-semibold text-[#0A2239] underline"
                >
                  Xóa bộ lọc tìm kiếm
                </button>
              </div>
            )}

            {/* Recommendations Section "Gợi ý dành cho bạn" */}
            <NewBookingRecommendations
              items={filteredRecommendations}
              onSelectRecommendation={(item) => setSelectedRecommendation(item)}
              onViewAll={() => onNavigate?.("experience")}
            />
          </main>
        </div>
      </div>

      {/* MODAL 1: Detail Preview Modal for Recommendation Items */}
      {selectedRecommendation && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setSelectedRecommendation(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Image Header */}
            <div className="relative w-full h-48 sm:h-56 bg-slate-900">
              <Image
                src={selectedRecommendation.imageUrl}
                alt={selectedRecommendation.title}
                fill
                unoptimized
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => setSelectedRecommendation(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors"
                aria-label="Đóng"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 sm:p-6 space-y-4 overflow-y-auto">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  {selectedRecommendation.title}
                </h3>
                <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                    <span className="font-semibold text-slate-800">
                      {selectedRecommendation.rating}
                    </span>
                    <span>({selectedRecommendation.reviewsCount} đánh giá)</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{selectedRecommendation.location}</span>
                  </div>
                </div>
              </div>

              {/* Price Details */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <div>
                  <p className="text-[11px] text-slate-500 font-medium">Giá ưu đãi STAYEA</p>
                  <p className="text-base sm:text-lg font-extrabold text-[#0A2239]">
                    {selectedRecommendation.priceDisplay}{" "}
                    <span className="text-xs font-normal text-slate-500">
                      / {selectedRecommendation.priceUnit}
                    </span>
                  </p>
                </div>
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 text-xs font-semibold">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Cam kết giá tốt nhất</span>
                </div>
              </div>

              {/* Service Highlights */}
              <div className="space-y-2 text-xs text-slate-600">
                <p className="font-semibold text-slate-800">Đặc quyền dịch vụ bao gồm:</p>
                <ul className="space-y-1.5 pl-4 list-disc text-slate-600">
                  <li>Xác nhận dịch vụ tức thì qua email và SMS</li>
                  <li>Hỗ trợ đổi ngày linh hoạt trước 24 giờ</li>
                  <li>Tích lũy 5% điểm thưởng Staya Club</li>
                </ul>
              </div>

              {/* Modal CTA Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedRecommendation(null)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100"
                >
                  Đóng
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const route = selectedRecommendation.targetRoute
                    setSelectedRecommendation(null)
                    showToast(`Đang đặt "${selectedRecommendation.title}"...`)
                    setTimeout(() => onNavigate?.(route), 400)
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#0A2239] hover:bg-[#071726] text-white text-xs font-semibold shadow-xs"
                >
                  Đặt ngay
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Staya Club Member Promo Modal */}
      {isClubModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setIsClubModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-amber-200 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 bg-gradient-to-br from-[#FFFBF2] to-[#FFF1D6] border-b border-amber-200/80 relative">
              <button
                type="button"
                onClick={() => setIsClubModalOpen(false)}
                className="absolute top-4 right-4 w-7 h-7 rounded-full bg-slate-900/10 hover:bg-slate-900/20 text-slate-700 flex items-center justify-center"
                aria-label="Đóng"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-2 text-amber-600 mb-2">
                <Crown className="w-6 h-6 fill-amber-500" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  Hội viên Staya Club
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Đặc quyền nghỉ dưỡng độc bản
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Tận hưởng mức giảm giá tới 20%, nâng cấp hạng phòng miễn phí và quà tặng đón tiếp tại Phú Quốc.
              </p>
            </div>

            <div className="p-6 space-y-4">
              <div className="space-y-2.5 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Ưu đãi độc quyền lên tới 1.500.000đ cho chuyến đi tiếp theo</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Xe đưa đón sân bay VIP 2 chiều miễn phí</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Hỗ trợ hotline cá nhân 24/7 suốt kỳ nghỉ</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsClubModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100"
                >
                  Để sau
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsClubModalOpen(false)
                    showToast("Đã kích hoạt ưu đãi thành viên Staya Club!")
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#0A2239] hover:bg-[#071726] text-white text-xs font-semibold shadow-xs"
                >
                  Nhận ưu đãi ngay
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
