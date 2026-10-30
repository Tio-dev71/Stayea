"use client"

import * as React from "react"
import Image from "next/image"
import {
  X,
  CheckCircle2,
  MapPin,
  Copy,
  Map,
  Clock,
} from "lucide-react"
import { MyPlansHeroBanner } from "./my-plans-hero-banner"
import { ProfileSidebar } from "./profile-sidebar"
import { MyPlansHeaderAndTabs } from "./my-plans-header-and-tabs"
import type { PlanFilterTab } from "./my-plans-header-and-tabs"
import { MyPlansTripCards } from "./my-plans-trip-cards"
import { MyPlansActiveItinerary } from "./my-plans-active-itinerary"
import { MyPlansBookedServices } from "./my-plans-booked-services"
import { MyPlansRecommendedAddons } from "./my-plans-recommended-addons"
import { stayeaApi } from "@/lib/stayea-api-service"
import {
  ACTIVE_PLAN_ITINERARY_DAYS,
  ACTIVE_PLAN_BOOKED_SERVICES,
  PLAN_RECOMMENDED_ADDONS,
} from "@/features/landing/data/stayea-mock-data"
import type {
  MyPlanTripCard,
  ItineraryDayItem,
  PlanBookedServiceItem,
  PlanRecommendedAddonItem,
} from "@/features/landing/data/stayea-mock-data"

interface MyPlansPageProps {
  readonly onNavigate?: (route: string) => void
}

export function MyPlansPage({ onNavigate }: MyPlansPageProps) {
  // 1. States
  const [activeStatusTab, setActiveStatusTab] = React.useState<PlanFilterTab>("upcoming")
  const [plansList, setPlansList] = React.useState<readonly MyPlanTripCard[]>([])
  const [selectedTripId, setSelectedTripId] = React.useState<string>("")
  const [toastMessage, setToastMessage] = React.useState<string | null>(null)

  // 2. Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState<boolean>(false)
  const [isMapModalOpen, setIsMapModalOpen] = React.useState<boolean>(false)
  const [isShareModalOpen, setIsShareModalOpen] = React.useState<boolean>(false)
  const [selectedDayDetail, setSelectedDayDetail] = React.useState<ItineraryDayItem | null>(null)
  const [selectedBookedService, setSelectedBookedService] = React.useState<PlanBookedServiceItem | null>(null)

  // Create Plan Form state
  const [newPlanTitle, setNewPlanTitle] = React.useState<string>("")
  const [newPlanDates, setNewPlanDates] = React.useState<string>("")
  const [newPlanGuests, setNewPlanGuests] = React.useState<string>("2 người")

  // Load real plans from backend
  React.useEffect(() => {
    async function loadPlans() {
      try {
        const raw = await stayeaApi.getUserPlans()
        if (Array.isArray(raw) && raw.length > 0) {
          const mapped: MyPlanTripCard[] = raw.map((p: any) => ({
            id: p.id,
            status: "upcoming" as const,
            statusLabel: "Sắp diễn ra",
            statusVariant: "emerald" as const,
            title: p.title || "Kế hoạch Phú Quốc",
            dates: p.dates || (p.startDate ? `${new Date(p.startDate).toLocaleDateString("vi-VN")} - ${new Date(p.endDate).toLocaleDateString("vi-VN")}` : "Thời gian linh hoạt"),
            location: p.destination || "Phú Quốc (PQC)",
            guests: p.companions || "2 người",
            imageUrl: "/profile/bai-sao.jpg",
            actionLabel: "Xem chi tiết",
          }))
          setPlansList(mapped)
          if (mapped[0]) setSelectedTripId(mapped[0].id)
        }
      } catch {
        // fallback
      }
    }
    loadPlans()
  }, [])

  function showToast(msg: string) {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage(null)
    }, 3200)
  }

  async function handleCreatePlan(e: React.FormEvent) {
    e.preventDefault()
    if (!newPlanTitle.trim()) {
      showToast("Vui lòng nhập tên chuyến đi!")
      return
    }

    const createdPlan: MyPlanTripCard = {
      id: `plan-${Date.now()}`,
      status: "upcoming",
      statusLabel: "Sắp diễn ra",
      statusVariant: "emerald",
      title: newPlanTitle.trim(),
      dates: newPlanDates.trim() || "Thời gian linh hoạt",
      location: "Phú Quốc (PQC)",
      guests: newPlanGuests,
      imageUrl: "/profile/bai-sao.jpg",
      actionLabel: "Xem chi tiết",
    }

    setPlansList((prev) => [createdPlan, ...prev])
    setSelectedTripId(createdPlan.id)

    try {
      await stayeaApi.createPlan({
        title: newPlanTitle.trim(),
        destination: "Phú Quốc (PQC)",
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 3 * 86400000).toISOString(),
        companions: newPlanGuests,
        note: newPlanDates.trim(),
      })
    } catch {
      // fallback
    }

    setIsCreateModalOpen(false)
    showToast(`Đã tạo kế hoạch "${newPlanTitle}" thành công!`)
    setNewPlanTitle("")
    setNewPlanDates("")
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
      <MyPlansHeroBanner />

      {/* 2. Main 2-Column Responsive Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 sm:py-8">
        <div className="flex flex-col lg:flex-row items-start gap-6 xl:gap-8">
          {/* Left Sidebar (same as Bookings & Profile) with activeTab="plans" */}
          <ProfileSidebar
            activeTab="plans"
            hideBadges
            onSelectTab={(tabId) => {
              if (tabId === "deals" || tabId === "my-deals") {
                onNavigate?.("my-deals")
              } else if (tabId === "staya-club" || tabId === "stayea-club") {
                onNavigate?.("stayea-club")
              } else if (tabId === "settings" || tabId === "cai-dat") {
                onNavigate?.("settings")
              } else if (tabId === "plans") {
                // already on plans
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
          <main className="flex-1 w-full space-y-6">
            {/* Page Header Title + "Tạo kế hoạch mới +" Button + Status Tabs */}
            <MyPlansHeaderAndTabs
              activeTab={activeStatusTab}
              onSelectTab={(tab) => {
                setActiveStatusTab(tab)
                showToast(`Đang hiển thị mục: ${tab}`)
              }}
              onCreateNewPlan={() => setIsCreateModalOpen(true)}
            />

            {/* Trip Cards */}
            <MyPlansTripCards
              trips={plansList}
              selectedTripId={selectedTripId}
              onSelectTrip={(trip: MyPlanTripCard) => {
                setSelectedTripId(trip.id)
                showToast(`Đang xem lịch trình: ${trip.title}`)
              }}
              onTripActionMenu={(trip: MyPlanTripCard) => {
                showToast(`Tùy chọn cho chuyến đi: ${trip.title}`)
              }}
            />

            {/* Active Plan Itinerary Section (only if plans exist) */}
            {plansList.length > 0 && (() => {
              const activeTrip = plansList.find((p) => p.id === selectedTripId) || plansList[0]
              return (
                <>
                  <MyPlansActiveItinerary
                    title={activeTrip?.title || "Kế hoạch chuyến đi"}
                    dates={activeTrip?.dates || "Thời gian linh hoạt"}
                    itineraryDays={ACTIVE_PLAN_ITINERARY_DAYS}
                    onShare={() => setIsShareModalOpen(true)}
                    onDownloadPdf={() => showToast("Đang chuẩn bị và tải file PDF lịch trình...")}
                    onEditPlan={() => showToast("Mở giao diện chỉnh sửa lịch trình...")}
                    onViewMap={() => setIsMapModalOpen(true)}
                    onViewDayDetail={(day: ItineraryDayItem) => setSelectedDayDetail(day)}
                  />

                  {/* Booked Services Section */}
                  <MyPlansBookedServices
                    services={ACTIVE_PLAN_BOOKED_SERVICES}
                    onSelectService={(service: PlanBookedServiceItem) => setSelectedBookedService(service)}
                    onViewAll={() => onNavigate?.("bookings")}
                  />
                </>
              )
            })()}

            {/* Recommended Addons Section ("Gợi ý bổ sung cho chuyến đi của bạn") */}
            <MyPlansRecommendedAddons
              items={PLAN_RECOMMENDED_ADDONS}
              onAddAddonToPlan={(addon: PlanRecommendedAddonItem) => {
                showToast(`Đã thêm "${addon.title}" vào lịch trình chuyến đi!`)
              }}
              onNextSlide={() => showToast("Đang chuyển trang gợi ý tiếp theo...")}
            />
          </main>
        </div>
      </div>

      {/* MODAL 1: Tạo kế hoạch mới Modal */}
      {isCreateModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setIsCreateModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                Tạo kế hoạch chuyến đi mới
              </h3>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePlan} className="p-5 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Tên chuyến đi
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Phú Quốc hè rực rỡ 2025"
                  value={newPlanTitle}
                  onChange={(e) => setNewPlanTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#0A2239]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Thời gian dự kiến
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: 20/07/2025 - 24/07/2025"
                  value={newPlanDates}
                  onChange={(e) => setNewPlanDates(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#0A2239]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Số lượng khách
                </label>
                <select
                  value={newPlanGuests}
                  onChange={(e) => setNewPlanGuests(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#0A2239]"
                >
                  <option value="1 người">1 người (Đi một mình)</option>
                  <option value="2 người">2 người (Cặp đôi / Bạn bè)</option>
                  <option value="4 người">4 người (Gia đình nhỏ)</option>
                  <option value="6+ người">6+ người (Nhóm bạn đông)</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0A2239] hover:bg-[#071726] text-white text-xs font-semibold shadow-xs"
                >
                  Tạo kế hoạch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Bản đồ hành trình Modal */}
      {isMapModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setIsMapModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Map className="w-5 h-5 text-[#0A2239]" />
                <h3 className="text-base font-bold text-slate-900">
                  Bản đồ lộ trình: Phú Quốc – Biển xanh, nắng vàng
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsMapModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative w-full h-80 bg-slate-900 overflow-hidden">
              <Image
                src="/explore/phu-quoc.jpg"
                alt="Bản đồ lộ trình Phú Quốc"
                fill
                unoptimized
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/30 pointer-events-none" />

              {/* Waypoint badges */}
              <div className="absolute top-8 left-1/4 px-2.5 py-1 rounded-lg bg-white/95 text-slate-900 text-[11px] font-bold shadow-md flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                <span>Bãi Khem (Resort)</span>
              </div>
              <div className="absolute bottom-16 right-1/3 px-2.5 py-1 rounded-lg bg-white/95 text-slate-900 text-[11px] font-bold shadow-md flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-blue-500" />
                <span>Hòn Thơm</span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
              <span>Tổng chiều dài di chuyển ước tính: 48 km</span>
              <button
                type="button"
                onClick={() => setIsMapModalOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-[#0A2239] text-white font-semibold"
              >
                Đóng bản đồ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Chi tiết ngày trong lịch trình */}
      {selectedDayDetail && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setSelectedDayDetail(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 bg-gradient-to-r from-[#EBF3FC] to-white border-b border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-[#0A2239] uppercase tracking-wider">
                  {selectedDayDetail.dayLabel} ({selectedDayDetail.date})
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">
                  {selectedDayDetail.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDayDetail(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3.5 text-xs text-slate-600">
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-800">Hoạt động chính:</p>
                  <p className="text-slate-600 mt-0.5">{selectedDayDetail.description}</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <p className="font-semibold text-slate-800">Khuyến nghị từ chuyên gia STAYEA:</p>
                <ul className="space-y-1 list-disc pl-4 text-slate-600">
                  <li>Mang theo kem chống nắng, mũ rộng vành và đồ bơi</li>
                  <li>Xe đưa đón sẽ đón trước giờ khởi hành 15 phút</li>
                  <li>Có sẵn nước suối và khăn lạnh trên xe</li>
                </ul>
              </div>

              <div className="pt-2 flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedDayDetail(null)}
                  className="px-5 py-2 rounded-xl bg-[#0A2239] text-white text-xs font-semibold"
                >
                  Đã hiểu
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: Chia sẻ kế hoạch Modal */}
      {isShareModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setIsShareModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                Chia sẻ lịch trình chuyến đi
              </h3>
              <button
                type="button"
                onClick={() => setIsShareModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <p className="text-xs text-slate-600">
                Bất kỳ ai có đường liên kết này đều có thể xem lịch trình và dịch vụ đã đặt của chuyến đi:
              </p>

              <div className="flex items-center gap-2 p-2 rounded-xl border border-slate-200 bg-slate-50 text-xs">
                <span className="flex-1 truncate text-slate-600 font-mono">
                  https://stayea.vn/plan/phu-quoc-bien-xanh-2025
                </span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard?.writeText("https://stayea.vn/plan/phu-quoc-bien-xanh-2025")
                    showToast("Đã sao chép liên kết chia sẻ vào bộ nhớ tạm!")
                    setIsShareModalOpen(false)
                  }}
                  className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                  aria-label="Sao chép"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="pt-1 flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => setIsShareModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#0A2239] text-white text-xs font-semibold"
                >
                  Xong
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: Chi tiết dịch vụ đã đặt Modal */}
      {selectedBookedService && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setSelectedBookedService(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-40 bg-slate-900">
              <Image
                src={selectedBookedService.imageUrl}
                alt={selectedBookedService.title}
                fill
                unoptimized
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => setSelectedBookedService(null)}
                className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/50 text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3">
              <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-semibold w-fit border border-emerald-200">
                <CheckCircle2 className="w-3 h-3" />
                <span>{selectedBookedService.statusLabel}</span>
              </div>
              <h4 className="text-sm font-bold text-slate-900">
                {selectedBookedService.title}
              </h4>
              <div className="space-y-1 text-xs text-slate-500">
                <p>Loại dịch vụ: {selectedBookedService.typeLabel}</p>
                <p>Thời gian: {selectedBookedService.dates}</p>
                {selectedBookedService.route && <p>Chặng bay: {selectedBookedService.route}</p>}
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedBookedService(null)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100"
                >
                  Đóng
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedBookedService(null)
                    onNavigate?.("bookings")
                  }}
                  className="px-4 py-2 rounded-xl bg-[#0A2239] text-white text-xs font-semibold"
                >
                  Xem tại Đơn đặt dịch vụ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
