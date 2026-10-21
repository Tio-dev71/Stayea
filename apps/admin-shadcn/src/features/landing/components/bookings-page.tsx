"use client"

import * as React from "react"
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  X,
  Star,
  QrCode,
  Calendar,
  MapPin,
  Users,
  Shield,
  Phone,
} from "lucide-react"
import { BookingsHeroBanner } from "./bookings-hero-banner"
import { ProfileSidebar } from "./profile-sidebar"
import { BookingsTabs } from "./bookings-tabs"
import { BookingCard } from "./booking-card"
import { BookingsSupportBanner } from "./bookings-support-banner"
import { stayeaApi } from "@/lib/stayea-api-service"
import { SERVICE_BOOKINGS_DATA } from "@/features/landing/data/stayea-mock-data"
import type { ServiceBookingItem } from "@/features/landing/data/stayea-mock-data"

interface BookingsPageProps {
  readonly onNavigate?: (route: string) => void
}

export function BookingsPage({ onNavigate }: BookingsPageProps) {
  // 1. State
  const [activeFilterTab, setActiveFilterTab] = React.useState<
    "all" | "stay" | "experience" | "transport" | "cancelled"
  >("all")
  const [currentPage, setCurrentPage] = React.useState<number>(1)
  const [liveBookings, setLiveBookings] = React.useState<ServiceBookingItem[]>([])

  React.useEffect(() => {
    async function fetchBookings() {
      try {
        const raw = await stayeaApi.getUserBookings()
        if (raw && raw.length > 0) {
          const mapped: ServiceBookingItem[] = raw.map((b: any) => ({
            id: b.id,
            code: b.bookingCode || b.id,
            category: (b.category as any) || "stay",
            status: b.status === "cancelled" ? "cancelled" : "upcoming",
            statusLabel: b.status === "cancelled" ? "Đã hủy" : "Sắp diễn ra",
            title: b.title || "Dịch vụ tuyển chọn STAYEA",
            dates: b.dates || `${new Date(b.checkInDate || Date.now()).toLocaleDateString("vi-VN")} - ${new Date(b.checkOutDate || Date.now()).toLocaleDateString("vi-VN")}`,
            location: b.details?.location || "Phú Quốc, Kiên Giang",
            guests: `${b.guestCount || 2} khách`,
            detailInfo: b.details?.packageName || b.details?.roomName || "Gói tiêu chuẩn tuyển chọn",
            detailIcon: b.category === "experience" ? "sparkles" : b.category === "transport" ? "plane" : "bed",
            price: `${Number(b.finalAmount || b.totalAmount || 0).toLocaleString("vi-VN")}đ`,
            priceNum: Number(b.finalAmount || b.totalAmount || 0),
            imageUrl: b.details?.imageUrl || "/bookings/premier-residences.jpg",
            primaryActionLabel: "Quản lý đặt phòng",
            secondaryActionLabel: "Liên hệ hỗ trợ",
          }))
          setLiveBookings(mapped)
        }
      } catch {
        // Fallback gracefully
      }
    }
    fetchBookings()
  }, [])
  const [notificationMsg, setNotificationMsg] = React.useState<string | null>(null)

  // Modals
  const [selectedBookingDetail, setSelectedBookingDetail] =
    React.useState<ServiceBookingItem | null>(null)
  const [voucherModalItem, setVoucherModalItem] =
    React.useState<ServiceBookingItem | null>(null)
  const [ratingModalItem, setRatingModalItem] =
    React.useState<ServiceBookingItem | null>(null)
  const [ratingScore, setRatingScore] = React.useState<number>(5)
  const [ratingComment, setRatingComment] = React.useState<string>("")
  const [isSupportModalOpen, setIsSupportModalOpen] = React.useState(false)

  function showToast(msg: string) {
    setNotificationMsg(msg)
    setTimeout(() => {
      setNotificationMsg(null)
    }, 3500)
  }

  // Combined items (Live DB bookings prepended to standard list)
  const allBookings = React.useMemo(() => {
    return [...liveBookings, ...SERVICE_BOOKINGS_DATA]
  }, [liveBookings])

  // Filter items based on active tab
  const filteredBookings = React.useMemo(() => {
    if (activeFilterTab === "all") return allBookings
    if (activeFilterTab === "stay")
      return allBookings.filter((item) => item.category === "stay")
    if (activeFilterTab === "experience")
      return allBookings.filter((item) => item.category === "experience")
    if (activeFilterTab === "transport")
      return allBookings.filter((item) => item.category === "transport")
    if (activeFilterTab === "cancelled")
      return allBookings.filter((item) => item.status === "cancelled")
    return allBookings
  }, [activeFilterTab, allBookings])

  function handleActionClick(action: string, item: ServiceBookingItem) {
    if (action === "Xem voucher" || action === "Xem chi tiết") {
      setVoucherModalItem(item)
    } else if (action === "Đánh giá") {
      setRatingModalItem(item)
      setRatingScore(5)
      setRatingComment("")
    } else if (action === "Quản lý đặt phòng") {
      setSelectedBookingDetail(item)
    } else if (action === "Liên hệ hỗ trợ") {
      setIsSupportModalOpen(true)
    } else if (action === "Đặt lại") {
      showToast(`Đang mở đặt lại dịch vụ ${item.title}...`)
      setTimeout(() => {
        if (item.category === "stay") onNavigate?.("stay")
        else if (item.category === "experience") onNavigate?.("experience")
        else if (item.category === "transport") onNavigate?.("transport")
      }, 500)
    }
  }

  function handleSendReview(e: React.FormEvent) {
    e.preventDefault()
    setRatingModalItem(null)
    showToast("Cảm ơn bạn đã gửi đánh giá trải nghiệm 5 sao cho STAYEA!")
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-16">
      {/* Toast Notification */}
      {notificationMsg && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-slate-900 text-white shadow-xl text-xs font-semibold animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{notificationMsg}</span>
        </div>
      )}

      {/* 1. Hero Cover Banner */}
      <BookingsHeroBanner />

      {/* 2. Main 2-Column Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
          {/* Left Sidebar Menu */}
          <ProfileSidebar
            activeTab="bookings"
            onSelectTab={(tabId) => {
              if (tabId === "deals" || tabId === "my-deals") {
                onNavigate?.("my-deals")
              } else if (tabId === "staya-club" || tabId === "stayea-club") {
                onNavigate?.("stayea-club")
              } else if (tabId === "settings" || tabId === "cai-dat") {
                onNavigate?.("settings")
              } else if (tabId === "bookings") {
                // already on bookings
              } else {
                onNavigate?.(tabId)
              }
            }}
            onLogout={() => {
              showToast("Đã đăng xuất thành công!")
              setTimeout(() => onNavigate?.("login"), 600)
            }}
          />

          {/* Right Main Content Area */}
          <div className="flex-1 w-full space-y-5">
            {/* 1. Header Bar: Title + Subtitle + CTA */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  Đơn đặt dịch vụ
                </h2>
                <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
                  Tất cả các đơn đặt dịch vụ của bạn sẽ được hiển thị tại đây. Bạn có thể xem chi tiết, quản lý hoặc yêu cầu hỗ trợ.
                </p>
              </div>

              <div className="shrink-0 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => onNavigate?.("new-booking")}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0A2239] hover:bg-[#071726] text-white text-xs font-semibold shadow-xs transition-all active:scale-95"
                >
                  <span>Đặt dịch vụ mới</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* 2. Category Filter Tabs */}
            <BookingsTabs
              activeTab={activeFilterTab}
              onSelectTab={(tab) => {
                setActiveFilterTab(tab)
                setCurrentPage(1)
              }}
            />

            {/* 3. Booking Cards List */}
            <div className="space-y-4 pt-1">
              {filteredBookings.length > 0 ? (
                filteredBookings.map((booking: ServiceBookingItem) => (
                  <BookingCard
                    key={booking.id}
                    item={booking}
                    onActionClick={handleActionClick}
                    onViewDetails={(item) => setSelectedBookingDetail(item)}
                  />
                ))
              ) : (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
                  <p className="text-sm font-semibold text-slate-700">
                    Không có đơn đặt dịch vụ nào trong mục này
                  </p>
                  <p className="text-xs text-slate-500">
                    Bạn chưa có lịch trình hoặc đơn hủy nào tương ứng.
                  </p>
                </div>
              )}
            </div>

            {/* 4. Centered Pagination Row */}
            <div className="flex items-center justify-center gap-2 pt-4">
              {/* Previous Page */}
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                aria-label="Trang trước"
                className="w-8 h-8 rounded-full border border-slate-200 hover:border-slate-300 bg-white flex items-center justify-center text-slate-600 disabled:opacity-40 disabled:pointer-events-none transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Page 1 */}
              <button
                type="button"
                onClick={() => setCurrentPage(1)}
                className={`w-8 h-8 rounded-full text-xs font-semibold flex items-center justify-center transition-all ${
                  currentPage === 1
                    ? "bg-[#0A2239] text-white shadow-xs"
                    : "bg-white border border-slate-200 text-slate-700 hover:border-slate-300"
                }`}
              >
                1
              </button>

              {/* Page 2 */}
              <button
                type="button"
                onClick={() => {
                  setCurrentPage(2)
                  showToast("Bạn đang ở trang danh sách đơn đặt dịch vụ số 2")
                }}
                className={`w-8 h-8 rounded-full text-xs font-semibold flex items-center justify-center transition-all ${
                  currentPage === 2
                    ? "bg-[#0A2239] text-white shadow-xs"
                    : "bg-white border border-slate-200 text-slate-700 hover:border-slate-300"
                }`}
              >
                2
              </button>

              {/* Next Page */}
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(2, p + 1))}
                disabled={currentPage === 2}
                aria-label="Trang kế tiếp"
                className="w-8 h-8 rounded-full border border-slate-200 hover:border-slate-300 bg-white flex items-center justify-center text-slate-600 disabled:opacity-40 disabled:pointer-events-none transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* 5. Support Callout Banner */}
            <BookingsSupportBanner
              onContactSupport={() => setIsSupportModalOpen(true)}
            />
          </div>
        </div>
      </div>

      {/* MODAL 1: Detail & Room Management Modal */}
      {selectedBookingDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-base">{selectedBookingDetail.title}</h3>
                <p className="text-xs text-slate-500">
                  Mã đơn hàng: <span className="font-mono font-semibold text-slate-800">{selectedBookingDetail.code}</span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedBookingDetail(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3.5 text-xs text-slate-600">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="font-medium text-slate-500">Trạng thái đơn</span>
                <span className="px-2.5 py-0.5 rounded-full font-semibold bg-emerald-100 text-emerald-800 text-[11px]">
                  {selectedBookingDetail.statusLabel}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>Thời gian: <strong className="text-slate-800">{selectedBookingDetail.dates}</strong></span>
                </div>
                {(selectedBookingDetail.location || selectedBookingDetail.route) && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span>Địa điểm: <strong className="text-slate-800">{selectedBookingDetail.route || selectedBookingDetail.location}</strong></span>
                  </div>
                )}
                {selectedBookingDetail.guests && (
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-slate-400" />
                    <span>Số lượng khách: <strong className="text-slate-800">{selectedBookingDetail.guests}</strong></span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-slate-400" />
                  <span>Chi tiết phòng / dịch vụ: <strong className="text-slate-800">{selectedBookingDetail.detailInfo}</strong></span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#EEF5FC] border border-[#D8E6F8]">
                <span className="font-semibold text-slate-800">Tổng thanh toán:</span>
                <span className="text-base font-bold text-[#0A2239]">{selectedBookingDetail.price}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedBookingDetail(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50"
              >
                Đóng
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedBookingDetail(null)
                  showToast("Đã gửi yêu cầu hỗ trợ phòng tới bộ phận chăm sóc khách hàng!")
                }}
                className="px-4 py-2 rounded-xl bg-[#0A2239] text-white text-xs font-semibold hover:bg-[#071726]"
              >
                Yêu cầu đổi / hỗ trợ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: E-Voucher / Ticket Modal */}
      {voucherModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl animate-in zoom-in-95 duration-150 text-center">
            <div className="flex justify-between items-center pb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">E-Voucher STAYEA</span>
              <button
                type="button"
                onClick={() => setVoucherModalItem(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <h3 className="font-bold text-slate-900 text-base mt-2">{voucherModalItem.title}</h3>
            <p className="text-xs text-slate-500 mt-0.5">{voucherModalItem.detailInfo}</p>

            {/* QR Code Mockup */}
            <div className="my-5 p-5 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center">
              <QrCode className="w-32 h-32 text-slate-800" />
              <p className="font-mono text-xs font-bold text-slate-700 mt-2 tracking-widest">
                {voucherModalItem.code}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">Xuất trình mã này tại quầy tiếp đón</p>
            </div>

            <div className="text-xs text-slate-600 space-y-1 mb-4 text-left p-3 rounded-xl bg-slate-50">
              <p>Khách hàng: <strong className="text-slate-800">Nguyễn Minh</strong></p>
              <p>Thời gian: <strong className="text-slate-800">{voucherModalItem.dates}</strong></p>
            </div>

            <button
              type="button"
              onClick={() => {
                setVoucherModalItem(null)
                showToast("Đã tải voucher điện tử về máy thành công!")
              }}
              className="w-full py-2.5 rounded-xl bg-[#0A2239] hover:bg-[#071726] text-white text-xs font-semibold shadow-xs"
            >
              Tải E-Voucher về máy
            </button>
          </div>
        </div>
      )}

      {/* MODAL 3: Rating Modal */}
      {ratingModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Đánh giá trải nghiệm</h3>
              <button
                type="button"
                onClick={() => setRatingModalItem(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendReview} className="py-4 space-y-4 text-xs">
              <div>
                <p className="font-semibold text-slate-800 mb-1">{ratingModalItem.title}</p>
                <p className="text-slate-500">Mã đơn: {ratingModalItem.code}</p>
              </div>

              {/* Star Rating Selection */}
              <div>
                <label className="block font-semibold text-slate-700 mb-2">Đánh giá của bạn</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRatingScore(star)}
                      className="p-1 text-amber-400 hover:scale-125 transition-transform"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= ratingScore
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-300"
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 font-bold text-slate-800 text-sm">
                    {ratingScore} sao
                  </span>
                </div>
              </div>

              {/* Comment text */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nhận xét & cảm nhận của bạn
                </label>
                <textarea
                  rows={3}
                  value={ratingComment}
                  onChange={(e) => setRatingComment(e.target.value)}
                  placeholder="Dịch vụ chu đáo, trải nghiệm rất tuyệt vời..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#0A2239] focus:ring-1 focus:ring-[#0A2239]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRatingModalItem(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0A2239] hover:bg-[#071726] text-white font-semibold shadow-xs"
                >
                  Gửi đánh giá
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: 24/7 Support Hotline Modal */}
      {isSupportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Hỗ trợ khách hàng 24/7</h3>
              <button
                type="button"
                onClick={() => setIsSupportModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3.5 text-xs text-slate-600">
              <p>Đội ngũ cố vấn và quản gia STAYEA sẵn sàng hỗ trợ bạn:</p>
              
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-600" />
                  <span>Hotline khẩn cấp: <strong className="text-slate-900">+84 297 730 9999</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-blue-600" />
                  <span>Kênh Zalo hỗ trợ riêng cho thành viên: <strong className="text-slate-900">STAYEA Concierge</strong></span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsSupportModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-[#0A2239] text-white text-xs font-semibold hover:bg-[#071726]"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
