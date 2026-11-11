"use client"

import { useState, useEffect, useMemo } from "react"
import { toast } from "sonner"
import { Calendar, ChevronDown, Plus, RefreshCw } from "lucide-react"
import { StayeaAdminHeader } from "@/features/admin-dashboard/components/stayea-admin-header"
import { StayeaAdminSidebar } from "@/features/admin-dashboard/components/stayea-admin-sidebar"
import { StayeaAdminFooter } from "@/features/admin-dashboard/components/stayea-admin-footer"
import { BookingsKpiCards } from "./components/bookings-kpi-cards"
import { BookingsFilterBar } from "./components/bookings-filter-bar"
import { BookingsDataTable } from "./components/bookings-data-table"
import { BookingsRightSidebar } from "./components/bookings-right-sidebar"
import { CreateBookingModal } from "./components/create-booking-modal"
import { BookingDetailModal } from "./components/booking-detail-modal"
import { type BookingRecord, type BookingKpiItem } from "./stayea-admin-bookings-mock-data"
import { stayeaApi } from "@/lib/stayea-api-service"
import { useStayeaRealtime } from "@/lib/stayea-realtime"
import { exportToCsv } from "@/lib/export-csv"

interface StayeaAdminBookingsPageProps {
  onNavigateLanding?: () => void
  onNavigateTab?: (tabId: string) => void
  initialModalOpen?: boolean
  onLogout?: () => void
}

export function StayeaAdminBookingsPage({
  onNavigateLanding,
  onNavigateTab,
  initialModalOpen = false,
  onLogout,
}: StayeaAdminBookingsPageProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(initialModalOpen)
  const [detailModalBooking, setDetailModalBooking] = useState<BookingRecord | null>(null)

  const [bookingsList, setBookingsList] = useState<BookingRecord[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Filters
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [paymentFilter, setPaymentFilter] = useState("all")
  const [serviceTypeFilter, setServiceTypeFilter] = useState("all")

  // Fetch real bookings from backend
  const fetchBookings = async () => {
    setIsLoading(true)
    try {
      const realItems = await stayeaApi.getAllBookingsForAdmin()
      if (Array.isArray(realItems) && realItems.length > 0) {
        const mapped: BookingRecord[] = realItems.map((item: any) => {
          let bookingStatus: BookingRecord["bookingStatus"] = "Chờ xác nhận"
          const st = (item.status || "").toLowerCase()
          if (st === "confirmed" || st === "đã xác nhận") bookingStatus = "Đã xác nhận"
          else if (st === "active" || st === "đang lưu trú") bookingStatus = "Đang lưu trú"
          else if (st === "completed" || st === "đã hoàn tất") bookingStatus = "Đã hoàn tất"
          else if (st === "cancelled" || st === "đã hủy") bookingStatus = "Đã hủy"

          let paymentStatus: BookingRecord["paymentStatus"] = "Chờ thanh toán"
          const pst = (item.paymentStatus || "").toLowerCase()
          if (pst === "paid" || pst === "đã thanh toán") paymentStatus = "Đã thanh toán"
          else if (pst === "partially_paid" || pst === "cọc 50%") paymentStatus = "Cọc 50%"
          else if (pst === "refunded") paymentStatus = "Hoàn tiền"

          const totalNum = Number(item.totalAmount) || 0
          const formattedTotal = new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(totalNum)

          // Intelligent service categorization
          let serviceType: BookingRecord["serviceType"] = "stay"
          const rawType = (
            item.bookingType ||
            item.booking_type ||
            item.serviceType ||
            item.details?.serviceType ||
            ""
          ).toLowerCase()
          const titleLower = (item.title || "").toLowerCase()

          if (
            rawType === "transport" ||
            rawType === "car" ||
            titleLower.includes("xe") ||
            titleLower.includes("tự lái") ||
            titleLower.includes("đưa đón") ||
            titleLower.includes("limousine")
          ) {
            serviceType = "transport"
          } else if (
            rawType === "experience" ||
            rawType === "tour" ||
            titleLower.includes("tour") ||
            titleLower.includes("cano") ||
            titleLower.includes("lặn") ||
            titleLower.includes("vé")
          ) {
            serviceType = "experience"
          } else if (
            rawType === "combo" ||
            rawType === "package" ||
            titleLower.includes("combo")
          ) {
            serviceType = "combo"
          }

          let serviceTypeLabel = "Homestay / Villa"
          let serviceDetails = "Homestay / Biệt thự nghỉ dưỡng"
          if (serviceType === "transport") {
            serviceTypeLabel = "Thuê xe / Đưa đón"
            serviceDetails =
              item.details?.vehicleType ||
              item.details?.carModel ||
              "Xe ô tô di chuyển Phú Quốc"
          } else if (serviceType === "experience") {
            serviceTypeLabel = "Tour & Canô"
            serviceDetails =
              item.details?.experienceType ||
              item.details?.tourTitle ||
              "Tour trải nghiệm đảo ngọc"
          } else if (serviceType === "combo") {
            serviceTypeLabel = "Gói Combo"
            serviceDetails = "Combo lưu trú + di chuyển"
          }

          return {
            id: item.id,
            code: item.bookingCode || item.id || "",
            serviceType,
            serviceTypeLabel,
            serviceDetails,
            guestName:
              item.details?.contactInfo?.fullName ||
              item.contactName ||
              item.metadata?.contactName ||
              "Khách hàng STAYEA",
            guestAvatar: "/about/team-1.jpg",
            guestFlag: "🇻🇳",
            guestPhone: item.details?.contactInfo?.phone || item.contactPhone || "",
            guestEmail: item.details?.contactInfo?.email || item.contactEmail || "",
            specialRequests:
              item.details?.contactInfo?.note ||
              item.details?.note ||
              item.details?.specialRequests ||
              item.customerNote ||
              "",
            paymentMethod: item.paymentMethod || "",
            propertyName: item.title || item.metadata?.propertyName || "",
            checkIn:
              item.startDate || item.checkInDate
                ? new Date(item.startDate || item.checkInDate).toLocaleDateString("vi-VN")
                : "Chưa xác định",
            checkOut:
              item.endDate || item.checkOutDate
                ? new Date(item.endDate || item.checkOutDate).toLocaleDateString("vi-VN")
                : "Chưa xác định",
            guestsCount: item.guestCount || item.guestsCount || 1,
            bookingStatus,
            paymentStatus,
            totalAmount: formattedTotal,
            channel: item.channel || "Website",
            channelType: "website",
          }
        })

        setBookingsList(mapped)
      } else {
        setBookingsList([])
      }
    } catch {
      setBookingsList([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  // Realtime zero-F5 sync for Admin Bookings
  useStayeaRealtime("admin", {
    "booking:created": (data) => {
      fetchBookings()
      toast.info(`🔔 Đơn đặt mới: ${data?.bookingCode || ""}`, {
        description: `${data?.title || "Dịch vụ"} • ${Number(data?.totalAmount || 0).toLocaleString("vi-VN")} VND`,
      })
    },
    "booking:updated": () => {
      fetchBookings()
    },
    "partner:order:updated": () => {
      fetchBookings()
    },
  })

  // Filtered Bookings
  const filteredBookings = useMemo(() => {
    return bookingsList.filter((b) => {
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        const matchCode = b.code.toLowerCase().includes(q)
        const matchGuest = b.guestName.toLowerCase().includes(q)
        const matchProperty = b.propertyName.toLowerCase().includes(q)
        if (!matchCode && !matchGuest && !matchProperty) return false
      }

      // Status filter
      if (statusFilter !== "all") {
        if (b.bookingStatus !== statusFilter) return false
      }

      // Payment filter
      if (paymentFilter !== "all") {
        if (b.paymentStatus !== paymentFilter) return false
      }

      // Service type filter (stay, transport, experience, combo)
      if (serviceTypeFilter !== "all") {
        if (b.serviceType !== serviceTypeFilter) return false
      }

      return true
    })
  }, [bookingsList, searchQuery, statusFilter, paymentFilter, serviceTypeFilter])

  // Counts by service category
  const serviceTypeCounts = useMemo(() => {
    return {
      all: bookingsList.length,
      stay: bookingsList.filter((b) => b.serviceType === "stay").length,
      transport: bookingsList.filter((b) => b.serviceType === "transport").length,
      experience: bookingsList.filter((b) => b.serviceType === "experience").length,
      combo: bookingsList.filter(
        (b) => b.serviceType === "combo" || b.serviceType === "package"
      ).length,
    }
  }, [bookingsList])

  // Dynamic KPIs
  const dynamicKpis: BookingKpiItem[] = useMemo(() => {
    const total = bookingsList.length
    const confirmed = bookingsList.filter((b) => b.bookingStatus === "Đã xác nhận").length
    const active = bookingsList.filter((b) => b.bookingStatus === "Đang lưu trú").length
    const totalRevNum = bookingsList.reduce((acc, b) => {
      const cleaned = b.totalAmount.replace(/[^\d]/g, "")
      return acc + (Number(cleaned) || 0)
    }, 0)
    const formattedRev = new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(totalRevNum)

    return [
      {
        id: "total",
        title: "Tổng đặt phòng",
        value: total.toString(),
        change: total > 0 ? "100%" : "0%",
        comparisonText: total > 0 ? "dữ liệu thời gian thực" : "chưa có dữ liệu tuần trước",
        isPositive: total > 0,
        iconType: "calendar",
      },
      {
        id: "confirmed",
        title: "Đã xác nhận",
        value: confirmed.toString(),
        change: total > 0 ? `${Math.round((confirmed / total) * 100)}%` : "0%",
        comparisonText: total > 0 ? `tỷ lệ xác nhận ${Math.round((confirmed / total) * 100)}%` : "chờ phát sinh booking",
        isPositive: confirmed > 0,
        iconType: "clock",
      },
      {
        id: "active",
        title: "Đang lưu trú",
        value: active.toString(),
        change: total > 0 ? `${Math.round((active / total) * 100)}%` : "0%",
        comparisonText: active > 0 ? `tại ${active} cơ sở lưu trú` : "chưa có khách check-in",
        isPositive: active > 0,
        iconType: "bed",
      },
      {
        id: "revenue",
        title: "Doanh thu tạm tính",
        value: formattedRev,
        change: totalRevNum > 0 ? "100%" : "0%",
        comparisonText: totalRevNum > 0 ? "doanh thu thời gian thực" : "chưa ghi nhận doanh thu",
        isPositive: totalRevNum > 0,
        iconType: "currency",
      },
    ]
  }, [bookingsList])

  // Handle status update
  const handleStatusUpdate = async (id: string, newStatus: string) => {
    let viStatus: BookingRecord["bookingStatus"] = "Chờ xác nhận"
    if (newStatus === "confirmed") viStatus = "Đã xác nhận"
    else if (newStatus === "active") viStatus = "Đang lưu trú"
    else if (newStatus === "completed") viStatus = "Đã hoàn tất"
    else if (newStatus === "cancelled") viStatus = "Đã hủy"

    try {
      const saved = await stayeaApi.updateBookingStatus(id, newStatus)
      if (!saved) throw new Error("Cập nhật trạng thái không thành công")
      setBookingsList((prev) =>
        prev.map((b) => (b.id === id ? { ...b, bookingStatus: viStatus } : b))
      )
      toast.success("Cập nhật trạng thái thành công!", {
        description: `Đơn đặt phòng đã được chuyển sang "${viStatus}".`,
      })
      // Sync fresh data from backend
      await fetchBookings()
    } catch {
      toast.error("Không thể cập nhật trạng thái đơn đặt phòng.")
    }
  }

  // Handle Export CSV
  const handleExportCsv = () => {
    if (filteredBookings.length === 0) {
      toast.error("Không có dữ liệu để xuất file.")
      return
    }

    const exportRows = filteredBookings.map((b) => ({
      "Mã đặt chỗ": b.code,
      "Tên khách hàng": b.guestName,
      "Bất động sản": b.propertyName,
      "Ngày nhận phòng": b.checkIn,
      "Ngày trả phòng": b.checkOut,
      "Số khách": b.guestsCount,
      "Trạng thái đơn": b.bookingStatus,
      "Trạng thái thanh toán": b.paymentStatus,
      "Tổng tiền": b.totalAmount,
      "Kênh đặt": b.channel,
    }))

    exportToCsv(exportRows, `stayea-danh-sach-dat-phong-${new Date().toISOString().slice(0, 10)}`)
    toast.success("Xuất danh sách đặt phòng thành công!", {
      description: `Đã tải xuống ${exportRows.length} bản ghi dạng Excel UTF-8.`,
    })
  }

  return (
    <div className="min-h-screen bg-[#f8faf9] flex flex-col font-sans text-slate-800 antialiased selection:bg-emerald-100 selection:text-emerald-900">
      {/* 1. Header (Sticky Top) */}
      <StayeaAdminHeader
        onNavigateLanding={onNavigateLanding}
        onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        onLogout={onLogout}
        onSearch={(query) => setSearchQuery(query)}
      />

      {/* 2. Main Body with Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden min-w-0">
        {/* Left Sidebar */}
        <div className={`${sidebarOpen ? "block" : "hidden"} lg:block`}>
          <StayeaAdminSidebar
            activeTab="dat-phong"
            onSelectTab={onNavigateTab}
          />
        </div>

        {/* Scrollable Content Container */}
        <main className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden">
          <div className="max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
            {/* Top Action & Greeting Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <span>Đơn đặt & Dịch vụ</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                    Đa dịch vụ
                  </span>
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                  Quản lý tập trung toàn bộ đơn đặt phòng lưu trú, xe tự lái / đưa đón sân bay và tour trải nghiệm STAYEA.
                </p>
              </div>

              {/* Right Controls: Refresh, Date Filter & Create Booking Button */}
              <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={fetchBookings}
                  disabled={isLoading}
                  title="Làm mới dữ liệu từ máy chủ"
                  className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 shadow-xs transition-all disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-emerald-600" : ""}`} />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    toast.info("Khoảng thời gian thống kê", {
                      description: "Dữ liệu đặt phòng đang hiển thị theo thời gian thực tại Phú Quốc.",
                    })
                  }}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 shadow-xs transition-all"
                >
                  <Calendar className="w-4 h-4 text-slate-500" />
                  <span>Thời gian thực (Hôm nay)</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1b7a4e] hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs sm:text-sm font-semibold shadow-xs transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>Tạo đơn đặt mới</span>
                </button>
              </div>
            </div>

            {/* Main Content Layout */}
            <div className="space-y-6">
              {/* 4 KPI Cards */}
              <BookingsKpiCards kpis={dynamicKpis} />

              {/* Filter and Search Bar with Category Tabs */}
              <BookingsFilterBar
                onSearchChange={(val) => setSearchQuery(val)}
                onStatusChange={(st) => setStatusFilter(st)}
                onPaymentChange={(pt) => setPaymentFilter(pt)}
                onServiceTypeChange={(st) => setServiceTypeFilter(st)}
                statusValue={statusFilter}
                paymentValue={paymentFilter}
                serviceTypeValue={serviceTypeFilter}
                serviceTypeCounts={serviceTypeCounts}
                onAdvancedFilter={() => {
                  toast.info("Bộ lọc nâng cao", {
                    description: "Lọc theo khoảng giá, số lượng phòng ngủ và tiện ích.",
                  })
                }}
                onExport={handleExportCsv}
              />

              {/* Bookings Data Table - Full Width with Ample Space */}
              <BookingsDataTable
                bookings={filteredBookings}
                onStatusUpdate={handleStatusUpdate}
                onViewDetail={(b) => setDetailModalBooking(b)}
                onSortChange={() => {
                  setBookingsList((prev) => [...prev].reverse())
                  toast.info("Đã thay đổi thứ tự hiển thị danh sách.")
                }}
              />

              {/* Additional Analytics & Schedule Cards (Full width 3 columns) */}
              <BookingsRightSidebar
                bookings={bookingsList}
                onBannerAction={() => {
                  toast.info("Chiến lược nâng cao công suất phòng", {
                    description: "Các giải pháp tối ưu hóa tỷ lệ lấp đầy phòng tại Phú Quốc.",
                  })
                }}
                onViewAllSchedule={() => {
                  toast.info("Lịch check-in / check-out", {
                    description: "Xem toàn bộ lịch đón tiễn khách hôm nay và tuần này.",
                  })
                }}
                onViewChannelDetails={() => {
                  toast.info("Chi tiết kênh phân phối OTA", {
                    description: "Báo cáo doanh số và tỷ lệ chuyển đổi qua các kênh Website, Airbnb, Booking, Agoda.",
                  })
                }}
              />
            </div>

            {/* Footer */}
            <StayeaAdminFooter />
          </div>
        </main>
      </div>

      {/* 3. Create Booking Modal */}
      <CreateBookingModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmitSuccess={(booking) => {
          setIsCreateModalOpen(false)
          if (booking.success) void fetchBookings()
        }}
      />

      {/* 4. Booking Detail Modal */}
      <BookingDetailModal
        booking={detailModalBooking}
        isOpen={!!detailModalBooking}
        onClose={() => setDetailModalBooking(null)}
        onUpdateStatus={handleStatusUpdate}
      />
    </div>
  )
}
