"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { stayeaApi } from "@/lib/stayea-api-service"
import { StayeaAdminHeader } from "./components/stayea-admin-header"
import { StayeaAdminSidebar } from "./components/stayea-admin-sidebar"
import { StayeaAdminGreetingBar } from "./components/stayea-admin-greeting-bar"
import { StayeaAdminKpiCards } from "./components/stayea-admin-kpi-cards"
import { StayeaAdminRevenueChart } from "./components/stayea-admin-revenue-chart"
import { StayeaAdminBookingStatusChart } from "./components/stayea-admin-booking-status-chart"
import { StayeaAdminRecentBookingsTable } from "./components/stayea-admin-recent-bookings-table"
import { StayeaAdminRightSidebar } from "./components/stayea-admin-right-sidebar"
import { StayeaAdminFooter } from "./components/stayea-admin-footer"
import {
  ADMIN_KPIS_VI,
  BOOKING_STATUS_DATA_VI,
  ADMIN_RECENT_BOOKINGS_VI,
} from "./stayea-admin-mock-data"
import type {
  AdminKpiItem,
  BookingStatusSlice,
  AdminRecentBooking,
} from "./stayea-admin-mock-data"

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
  const [liveKpis, setLiveKpis] = useState<readonly AdminKpiItem[]>(ADMIN_KPIS_VI)
  const [liveStatusData, setLiveStatusData] = useState<readonly BookingStatusSlice[]>(BOOKING_STATUS_DATA_VI)
  const [liveRecentBookings, setLiveRecentBookings] = useState<readonly AdminRecentBooking[]>(ADMIN_RECENT_BOOKINGS_VI)

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [rawBookings, rawAccommodations, rawUsers] = await Promise.all([
          stayeaApi.getAllBookingsForAdmin().catch(() => []),
          stayeaApi.getAccommodations().catch(() => []),
          stayeaApi.getUsers().catch(() => []),
        ])

        const bookings = Array.isArray(rawBookings) ? rawBookings : []
        const accommodations = Array.isArray(rawAccommodations) ? rawAccommodations : []
        const users = Array.isArray(rawUsers) ? rawUsers : []

        // 1. Calculate Revenue
        const totalRev = bookings.reduce((sum: number, b: any) => {
          const amt = Number(b.finalAmount || b.totalAmount || 0)
          return sum + (isNaN(amt) ? 0 : amt)
        }, 0)

        const formattedRev = new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(totalRev)

        // 2. Set live KPIs
        setLiveKpis([
          {
            id: "total-bookings",
            title: "Tổng số đặt phòng",
            value: bookings.length.toString(),
            change: "0%",
            comparisonText: "so với tuần trước",
            isPositive: true,
            iconName: "calendar",
          },
          {
            id: "total-revenue",
            title: "Doanh thu",
            value: formattedRev,
            change: "0%",
            comparisonText: "so với tuần trước",
            isPositive: true,
            iconName: "currency",
          },
          {
            id: "active-properties",
            title: "Bất động sản đang hoạt động",
            value: accommodations.length.toString(),
            change: "0%",
            comparisonText: "so với tuần trước",
            isPositive: true,
            iconName: "home",
          },
          {
            id: "total-guests",
            title: "Tổng số khách",
            value: users.length.toString(),
            change: "0%",
            comparisonText: "so với tuần trước",
            isPositive: true,
            iconName: "users",
          },
        ])

        // 3. Status Breakdown
        const confirmedCount = bookings.filter((b: any) => (b.status || "").toLowerCase().includes("confirm")).length
        const pendingCount = bookings.filter((b: any) => (b.status || "").toLowerCase().includes("pending")).length
        const cancelledCount = bookings.filter((b: any) => (b.status || "").toLowerCase().includes("cancel")).length
        const completedCount = bookings.filter((b: any) => (b.status || "").toLowerCase().includes("complet")).length
        const total = bookings.length || 1

        setLiveStatusData([
          { status: "Đã xác nhận", percentage: bookings.length > 0 ? Math.round((confirmedCount / total) * 100) : 0, count: confirmedCount, color: "#166534" },
          { status: "Chờ xác nhận", percentage: bookings.length > 0 ? Math.round((pendingCount / total) * 100) : 0, count: pendingCount, color: "#eab308" },
          { status: "Đã hủy", percentage: bookings.length > 0 ? Math.round((cancelledCount / total) * 100) : 0, count: cancelledCount, color: "#ef4444" },
          { status: "Đã hoàn thành", percentage: bookings.length > 0 ? Math.round((completedCount / total) * 100) : 0, count: completedCount, color: "#94a3b8" },
        ])

        // 4. Recent Bookings Table
        const recent: AdminRecentBooking[] = bookings.slice(0, 5).map((b: any, idx: number) => {
          let viStatus: AdminRecentBooking["status"] = "Chờ xác nhận"
          const st = (b.status || "").toLowerCase()
          if (st.includes("confirm")) viStatus = "Đã xác nhận"
          else if (st.includes("complet")) viStatus = "Đã hoàn thành"
          else if (st.includes("cancel")) viStatus = "Đã hủy"

          const totalNum = Number(b.finalAmount || b.totalAmount || 0)
          const formatted = new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(totalNum)

          return {
            id: b.id || `bk-real-${idx}`,
            guestName: b.contactName || b.metadata?.contactName || "Khách hàng",
            guestAvatar: "/about/team-1.jpg",
            guestCountry: "Việt Nam",
            guestFlag: "🇻🇳",
            propertyTitle: b.title || b.metadata?.propertyName || "Dịch vụ STAYEA",
            propertySubtitle: b.details?.location || "Phú Quốc",
            checkIn: b.checkInDate ? new Date(b.checkInDate).toLocaleDateString("vi-VN") : "Hôm nay",
            checkOut: b.checkOutDate ? new Date(b.checkOutDate).toLocaleDateString("vi-VN") : "Hôm nay",
            status: viStatus,
            totalAmount: formatted,
          }
        })
        setLiveRecentBookings(recent)
      } catch {
        // fallback
      }
    }
    loadDashboardData()
  }, [])

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
                <StayeaAdminKpiCards kpis={liveKpis} />

                {/* Middle Charts Row (Doanh thu theo thời gian + Tình trạng đặt phòng) */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
                  <div className="md:col-span-7">
                    <StayeaAdminRevenueChart />
                  </div>
                  <div className="md:col-span-5">
                    <StayeaAdminBookingStatusChart
                      data={liveStatusData}
                      onViewDetails={() => {
                        router.push("/stayea/bookings")
                      }}
                    />
                  </div>
                </div>

                {/* Recent Bookings Table (Đặt phòng gần đây) */}
                <StayeaAdminRecentBookingsTable
                  bookings={liveRecentBookings}
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
