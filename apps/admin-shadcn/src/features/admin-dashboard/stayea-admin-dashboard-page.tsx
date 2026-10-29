"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
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
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleQuickAction = (actionKey: string) => {
    switch (actionKey) {
      case "banner-action":
        router.push("/stayea/experiences")
        break
      case "add-property":
        router.push("/stayea/properties")
        break
      case "create-promotion":
        router.push("/stayea/deals")
        break
      case "create-experience":
        router.push("/stayea/experiences")
        break
      case "send-announcement":
        router.push("/stayea/messages")
        break
      case "view-reports":
        router.push("/stayea/reports")
        break
      case "sustainable-tourism":
        router.push("/stayea/experiences")
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
    router.push("/stayea/bookings")
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
            activeTab="tong-quan"
            onSelectTab={onNavigateTab}
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
              adminName="Quản trị viên"
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
                        router.push("/stayea/bookings")
                      }}
                    />
                  </div>
                </div>

                {/* Recent Bookings Table (Đặt phòng gần đây) */}
                <StayeaAdminRecentBookingsTable
                  onViewAll={() => {
                    router.push("/stayea/bookings")
                  }}
                />
              </div>

              {/* Right Column (4 cols on large screens) */}
              <div className="lg:col-span-4">
                <StayeaAdminRightSidebar
                  onQuickAction={handleQuickAction}
                  onViewAllActivities={() => {
                    router.push("/stayea/revenue")
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
