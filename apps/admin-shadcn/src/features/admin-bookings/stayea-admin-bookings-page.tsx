"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Calendar, ChevronDown, Plus } from "lucide-react"
import { StayeaAdminHeader } from "@/features/admin-dashboard/components/stayea-admin-header"
import { StayeaAdminSidebar } from "@/features/admin-dashboard/components/stayea-admin-sidebar"
import { StayeaAdminFooter } from "@/features/admin-dashboard/components/stayea-admin-footer"
import { BookingsKpiCards } from "./components/bookings-kpi-cards"
import { BookingsFilterBar } from "./components/bookings-filter-bar"
import { BookingsDataTable } from "./components/bookings-data-table"
import { BookingsRightSidebar } from "./components/bookings-right-sidebar"
import { CreateBookingModal } from "./components/create-booking-modal"

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

  const handleCreateBooking = () => {
    setIsCreateModalOpen(true)
  }

  const handleDateFilterClick = () => {
    toast.info("Khoảng thời gian thống kê", {
      description: "Dữ liệu đặt phòng đang lọc theo tuần: 21/04/2025 - 27/04/2025.",
    })
  }

  return (
    <div className="min-h-screen bg-[#f8faf9] flex flex-col font-sans text-slate-800 antialiased selection:bg-emerald-100 selection:text-emerald-900">
      {/* 1. Header (Sticky Top) */}
      <StayeaAdminHeader
        onNavigateLanding={onNavigateLanding}
        onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        onLogout={onLogout}
        onSearch={(query) => {
          if (query.trim()) {
            console.log("Tìm kiếm đặt phòng:", query)
          }
        }}
      />

      {/* 2. Main Body with Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden min-w-0">
        {/* Left Sidebar */}
        <div className={`${sidebarOpen ? "block" : "hidden"} lg:block`}>
          <StayeaAdminSidebar
            activeTab="dat-phong"
            onSelectTab={(tabId) => {
              if (onNavigateTab) {
                onNavigateTab(tabId)
              } else if (tabId === "tong-quan") {
                window.location.hash = "admin"
              } else {
                toast.info(`Điều hướng đến mục "${tabId}"`, {
                  description: "Hiển thị dữ liệu quản lý tương ứng.",
                })
              }
            }}
            onExplorePhuQuoc={() => {
              toast.info("Khám phá Phú Quốc", {
                description: "Chuyển tới cổng thông tin du lịch và trải nghiệm đảo ngọc.",
              })
            }}
          />
        </div>

        {/* Scrollable Content Container */}
        <main className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden">
          <div className="max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
            {/* Top Action & Greeting Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
              {/* Title & Subtitle */}
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  Đặt phòng
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                  Quản lý toàn bộ đơn đặt phòng, check-in, check-out và thanh toán.
                </p>
              </div>

              {/* Right Controls: Date Filter & Create Booking Button */}
              <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={handleDateFilterClick}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 shadow-xs transition-all"
                >
                  <Calendar className="w-4 h-4 text-slate-500" />
                  <span>21/04/2025 - 27/04/2025</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                <button
                  type="button"
                  onClick={handleCreateBooking}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1b7a4e] hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs sm:text-sm font-semibold shadow-xs transition-all"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>Tạo đặt phòng</span>
                </button>
              </div>
            </div>

            {/* Main Content Grid: 8 cols left, 4 cols right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column (8 cols) */}
              <div className="lg:col-span-8 space-y-6">
                {/* 4 KPI Cards */}
                <BookingsKpiCards />

                {/* Filter and Search Bar */}
                <BookingsFilterBar
                  onAdvancedFilter={() => {
                    toast.info("Bộ lọc nâng cao", {
                      description: "Lọc theo khoảng giá, số lượng phòng ngủ và tiện ích.",
                    })
                  }}
                  onExport={() => {
                    toast.success("Xuất danh sách đặt phòng", {
                      description: "Đang tải xuống tệp dữ liệu đặt phòng dạng Excel/CSV.",
                    })
                  }}
                />

                {/* Bookings Data Table */}
                <BookingsDataTable
                  onSortChange={() => {
                    toast.info("Sắp xếp", {
                      description: "Đã thay đổi thứ tự hiển thị danh sách đặt phòng.",
                    })
                  }}
                />
              </div>

              {/* Right Column (4 cols) */}
              <div className="lg:col-span-4">
                <BookingsRightSidebar
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
        onSubmitSuccess={(data) => {
          setIsCreateModalOpen(false)
          toast.success("Tạo đặt phòng thành công!", {
            description: `Đơn đặt chỗ cho ${data.fullName || "Khách hàng"} tại ${data.property || "Phú Quốc"} (${data.totalAmount}) đã được ghi nhận.`,
          })
        }}
      />
    </div>
  )
}
