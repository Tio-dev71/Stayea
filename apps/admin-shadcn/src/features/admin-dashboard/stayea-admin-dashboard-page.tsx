"use client"

import { useState } from "react"
import { toast } from "sonner"
import { StayeaAdminHeader } from "./components/stayea-admin-header"
import { StayeaAdminSidebar } from "./components/stayea-admin-sidebar"
import { StayeaAdminGreetingBar } from "./components/stayea-admin-greeting-bar"
import { StayeaAdminKpiCards } from "./components/stayea-admin-kpi-cards"
import { StayeaAdminRevenueChart } from "./components/stayea-admin-revenue-chart"
import { StayeaAdminBookingStatusChart } from "./components/stayea-admin-booking-status-chart"
import { StayeaAdminRecentBookingsTable } from "./components/stayea-admin-recent-bookings-table"
import { StayeaAdminRightSidebar } from "./components/stayea-admin-right-sidebar"
import { StayeaAdminFooter } from "./components/stayea-admin-footer"
import { StayeaAdminBookingsPage } from "@/features/admin-bookings"

interface StayeaAdminDashboardPageProps {
  onNavigateLanding?: () => void
  onNavigateTab?: (tabId: string) => void
  onLogout?: () => void
}

export function StayeaAdminDashboardPage({
  onNavigateLanding,
  onNavigateTab,
  onLogout,
}: StayeaAdminDashboardPageProps) {
  const [activeTab, setActiveTab] = useState("tong-quan")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleQuickAction = (actionKey: string) => {
    switch (actionKey) {
      case "banner-action":
        toast.info("Hành trình hạnh phúc tại Phú Quốc", {
          description: "Mở danh sách các trải nghiệm và dịch vụ cao cấp tuyển chọn.",
        })
        break
      case "add-property":
        toast.success("Thêm bất động sản mới", {
          description: "Mở biểu mẫu đăng ký biệt thự, căn hộ hoặc homestay mới tại Phú Quốc.",
        })
        break
      case "create-promotion":
        toast.success("Tạo chương trình khuyến mãi", {
          description: "Mở trình thiết lập mã giảm giá và ưu đãi đặc quyền cho khách hàng.",
        })
        break
      case "create-experience":
        toast.success("Tạo tour/trải nghiệm mới", {
          description: "Thêm gói tour khám phá biển đảo, lặn ngắm san hô hoặc ẩm thực.",
        })
        break
      case "send-announcement":
        toast.info("Gửi thông báo hệ thống", {
          description: "Soạn và gửi thông báo tới toàn bộ đối tác hoặc khách hàng.",
        })
        break
      case "view-reports":
        toast.info("Xem báo cáo chi tiết", {
          description: "Đang tổng hợp báo cáo tài chính và hiệu suất vận hành tuần này.",
        })
        break
      case "sustainable-tourism":
        toast.info("Du lịch bền vững tại Phú Quốc", {
          description: "Chiến dịch bảo tồn hệ sinh thái biển và phát triển cộng đồng địa phương.",
        })
        break
      default:
        break
    }
  }

  const handleDateRangeClick = () => {
    toast.info("Khoảng thời gian thống kê", {
      description: "Dữ liệu đang lọc theo tuần: 21/04/2025 - 27/04/2025.",
    })
  }

  const handleCreateNew = () => {
    toast.success("Tạo mới", {
      description: "Chọn tạo Đặt phòng mới, Thêm chỗ nghỉ, hoặc Tạo ưu đãi du lịch.",
    })
  }

  if (activeTab === "dat-phong") {
    return (
      <StayeaAdminBookingsPage
        onNavigateLanding={onNavigateLanding}
        onNavigateTab={(tabId) => {
          setActiveTab(tabId)
          if (tabId === "tong-quan" || tabId === "dashboard") {
            window.location.hash = "admin"
          }
        }}
      />
    )
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
            console.log("Tìm kiếm:", query)
          }
        }}
      />

      {/* 2. Main Body with Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden min-w-0">
        {/* Left Sidebar */}
        <div className={`${sidebarOpen ? "block" : "hidden"} lg:block`}>
          <StayeaAdminSidebar
            activeTab={activeTab}
            onSelectTab={(tabId) => {
              if (onNavigateTab) {
                onNavigateTab(tabId)
                return
              }
              setActiveTab(tabId)
              if (tabId === "dat-phong" || tabId === "bookings") {
                window.location.hash = "admin-bookings"
                return
              }
              if (tabId === "bat-dong-san" || tabId === "properties") {
                window.location.hash = "properties"
                return
              }
              if (tabId === "khach-hang" || tabId === "guests") {
                window.location.hash = "customers"
                return
              }
              if (tabId === "chu-nha-doi-tac" || tabId === "hosts") {
                window.location.hash = "hosts"
                return
              }
              if (tabId !== "tong-quan") {
                toast.info(`Điều hướng đến mục "${tabId}"`, {
                  description: "Hiển thị dữ liệu quản trị từ hệ sinh thái Stayea.",
                })
              }
            }}
            onExplorePhuQuoc={() => {
              toast.info("Khám phá Phú Quốc", {
                description: "Chuyển tới cổng thông tin du lịch và danh sách trải nghiệm đảo ngọc.",
              })
            }}
          />
        </div>

        {/* Scrollable Content Container */}
        <main className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden">
          <div className="max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
            {/* Greeting & Date Picker Bar */}
            <StayeaAdminGreetingBar
              adminName="Nguyễn Minh"
              dateRange="21/04/2025 - 27/04/2025"
              onDateRangeClick={handleDateRangeClick}
              onCreateNew={handleCreateNew}
            />

            {/* Dashboard Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left/Center Column (8 cols on large screens) */}
              <div className="lg:col-span-8 space-y-6">
                {/* 4 KPI Cards */}
                <StayeaAdminKpiCards />

                {/* Middle Charts Row (Doanh thu theo thời gian + Tình trạng đặt phòng) */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
                  <div className="md:col-span-7">
                    <StayeaAdminRevenueChart />
                  </div>
                  <div className="md:col-span-5">
                    <StayeaAdminBookingStatusChart
                      onViewDetails={() => {
                        toast.info("Chi tiết tình trạng đặt phòng", {
                          description: "Xem phân bổ theo loại phòng, thời gian và trạng thái thanh toán.",
                        })
                      }}
                    />
                  </div>
                </div>

                {/* Recent Bookings Table (Đặt phòng gần đây) */}
                <StayeaAdminRecentBookingsTable
                  onViewAll={() => {
                    toast.info("Toàn bộ danh sách đặt phòng", {
                      description: "Hiển thị tất cả 1.284 lượt đặt chỗ nghỉ tại Phú Quốc.",
                    })
                  }}
                />
              </div>

              {/* Right Column (4 cols on large screens) */}
              <div className="lg:col-span-4">
                <StayeaAdminRightSidebar
                  onQuickAction={handleQuickAction}
                  onViewAllActivities={() => {
                    toast.info("Nhật ký hoạt động gần đây", {
                      description: "Xem đầy đủ lịch sử giao dịch và biến động hệ thống.",
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
    </div>
  )
}
