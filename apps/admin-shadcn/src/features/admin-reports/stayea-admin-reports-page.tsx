"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { StayeaAdminHeader } from "@/features/admin-dashboard/components/stayea-admin-header"
import { StayeaAdminSidebar } from "@/features/admin-dashboard/components/stayea-admin-sidebar"
import { StayeaAdminFooter } from "@/features/admin-dashboard/components/stayea-admin-footer"
import { ReportsHeader } from "./components/reports-header"
import { ReportsCategoryTabs } from "./components/reports-category-tabs"
import { ReportsKpiCards } from "./components/reports-kpi-cards"
import { ReportsCharts } from "./components/reports-charts"
import { ReportsTopToursTable } from "./components/reports-top-tours-table"
import { ReportsRightSidebar } from "./components/reports-right-sidebar"
import { ReportsBookingsKpiCards } from "./components/reports-bookings-kpi-cards"
import { ReportsBookingsCharts } from "./components/reports-bookings-charts"
import { ReportsBookingsTable } from "./components/reports-bookings-table"
import { ReportsBookingsRightSidebar } from "./components/reports-bookings-right-sidebar"
import { ReportsCustomersKpiCards } from "./components/reports-customers-kpi-cards"
import { ReportsCustomersCharts } from "./components/reports-customers-charts"
import { ReportsCustomersTable } from "./components/reports-customers-table"
import { ReportsCustomersRightSidebar } from "./components/reports-customers-right-sidebar"
import { ExportReportsModal } from "./components/export-reports-modal"
import {
  MOCK_REPORT_KPIS,
  MOCK_REPORT_REVENUE_TIMELINE,
  MOCK_REPORT_CHANNELS,
  MOCK_REPORT_TRAFFIC_CONVERSION,
  MOCK_REPORT_CUSTOMER_SOURCES,
  MOCK_REPORT_TOP_TOURS,
} from "./stayea-admin-reports-mock-data"
import {
  MOCK_BOOKING_REPORT_KPIS,
  MOCK_BOOKING_TIMELINE,
  MOCK_BOOKING_STATUS_SLICES,
  MOCK_BOOKING_PRODUCT_TYPES,
  MOCK_BOOKING_CHANNELS,
  MOCK_RECENT_BOOKINGS,
} from "./stayea-admin-reports-bookings-mock-data"
import {
  MOCK_CUSTOMER_REPORT_KPIS,
  MOCK_CUSTOMER_TIMELINE,
  MOCK_CUSTOMER_STRUCTURE,
  MOCK_CUSTOMER_CHANNELS,
  MOCK_CUSTOMER_SEGMENTS,
  MOCK_TOP_VALUED_CUSTOMERS,
} from "./stayea-admin-reports-customers-mock-data"

interface StayeaAdminReportsPageProps {
  initialTab?: string
  onNavigateLanding?: () => void
  onNavigateTab?: (tabId: string) => void
}

export function StayeaAdminReportsPage({
  initialTab = "tong-quan",
  onNavigateLanding,
  onNavigateTab,
}: StayeaAdminReportsPageProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [dateRange, setDateRange] = useState("01/06/2024 - 31/08/2024")
  const [comparisonPeriod, setComparisonPeriod] = useState("3 tháng trước")
  const [activeCategoryTab, setActiveCategoryTab] = useState<string>(initialTab)
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)

  // Listen to hash changes
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace("#", "")
      if (
        hash === "bao-cao-khach-hang" ||
        hash === "reports-customers" ||
        hash === "khach-hang"
      ) {
        setActiveCategoryTab("khach-hang")
      } else if (
        hash === "bao-cao-dat-phong" ||
        hash === "reports-bookings" ||
        hash === "dat-phong"
      ) {
        setActiveCategoryTab("dat-phong")
      } else if (
        hash === "bao-cao-tong-quan" ||
        hash === "reports-overview" ||
        hash === "bao-cao"
      ) {
        setActiveCategoryTab("tong-quan")
      }
    }
    handleHash()
    window.addEventListener("hashchange", handleHash)
    return () => window.removeEventListener("hashchange", handleHash)
  }, [])

  const handleExport = (options: {
    format: "xlsx" | "pdf" | "csv"
    timeframe: string
    includeChannels: boolean
    includeTours: boolean
    includeCustomers: boolean
  }) => {
    toast.success("Xuất báo cáo thành công!", {
      description: `Đã kết xuất báo cáo định dạng .${options.format.toUpperCase()} cho kỳ ${options.timeframe}.`,
    })
  }

  const handleQuickExport = (format: "excel" | "pdf" | "schedule") => {
    if (format === "schedule") {
      toast.info("Đã mở cài đặt lên lịch gửi báo cáo tự động qua email định kỳ.")
    } else {
      setIsExportModalOpen(true)
    }
  }

  const isCustomerTab = activeCategoryTab === "khach-hang"
  const isBookingTab = activeCategoryTab === "dat-phong"

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans">
      {/* 1. Header Admin Stayea */}
      <StayeaAdminHeader
        searchPlaceholder="Tìm kiếm tour, trải nghiệm, địa điểm, đối tác..."
        onNavigateLanding={onNavigateLanding}
        onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        onSearch={(query) => {
          if (query.trim()) {
            toast.info(`Tìm kiếm: "${query}"`, {
              description: "Đang lọc dữ liệu báo cáo và phân tích...",
            })
          }
        }}
      />

      <div className="flex-1 flex overflow-hidden min-w-0">
        {/* 2. Responsive Sidebar Drawer */}
        <div
          className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-white transition-transform duration-200 ease-in-out md:static md:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <StayeaAdminSidebar
            activeTab="bao-cao"
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

        {/* 3. Main Body */}
        <main className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden px-4 sm:px-6 lg:px-7 py-6">
          <div className="max-w-[1600px] mx-auto space-y-5">
            {/* Page Header (Title + Filters + Actions) */}
            <ReportsHeader
              dateRange={dateRange}
              setDateRange={setDateRange}
              comparisonPeriod={comparisonPeriod}
              setComparisonPeriod={setComparisonPeriod}
              onOpenExportModal={() => setIsExportModalOpen(true)}
            />

            {/* 2-Column Responsive Dashboard Layout */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
              {/* Left Column (~73% on xl screens) */}
              <div className="xl:col-span-9 space-y-5">
                {/* Dynamic KPI Cards depending on tab */}
                {isCustomerTab ? (
                  <ReportsCustomersKpiCards kpis={MOCK_CUSTOMER_REPORT_KPIS} />
                ) : isBookingTab ? (
                  <ReportsBookingsKpiCards kpis={MOCK_BOOKING_REPORT_KPIS} />
                ) : (
                  <ReportsKpiCards kpis={MOCK_REPORT_KPIS} />
                )}

                {/* 8 Category Tabs */}
                <ReportsCategoryTabs
                  activeTab={activeCategoryTab}
                  setActiveTab={(tab) => {
                    setActiveCategoryTab(tab)
                    if (tab === "khach-hang") {
                      window.location.hash = "bao-cao-khach-hang"
                      toast.info("Chuyển sang báo cáo phân hệ: Khách hàng")
                    } else if (tab === "dat-phong") {
                      window.location.hash = "bao-cao-dat-phong"
                      toast.info("Chuyển sang báo cáo phân hệ: Đặt phòng")
                    } else if (tab === "tong-quan") {
                      window.location.hash = "bao-cao"
                      toast.info("Chuyển sang báo cáo phân hệ: Tổng quan")
                    } else {
                      toast.info(`Đang cập nhật báo cáo cho phân hệ: ${tab}`)
                    }
                  }}
                />

                {/* Dynamic Charts & Table depending on tab */}
                {isCustomerTab ? (
                  <>
                    <ReportsCustomersCharts
                      timeline={MOCK_CUSTOMER_TIMELINE}
                      structureSlices={MOCK_CUSTOMER_STRUCTURE}
                      channels={MOCK_CUSTOMER_CHANNELS}
                      segments={MOCK_CUSTOMER_SEGMENTS}
                      onViewChannelDetails={() =>
                        toast.info("Xem chi tiết khách hàng mới theo kênh")
                      }
                      onViewSegmentDetails={() =>
                        toast.info("Xem chi tiết phân khúc khách hàng")
                      }
                    />

                    {/* Top High-Value Customers Table */}
                    <ReportsCustomersTable
                      customers={MOCK_TOP_VALUED_CUSTOMERS}
                      onViewCustomerDetail={(customer) =>
                        toast.info(`Hồ sơ khách hàng: ${customer.name}`, {
                          description: `Doanh số: ${customer.totalRevenue} (${customer.bookingCount} lượt đặt)`,
                        })
                      }
                    />
                  </>
                ) : isBookingTab ? (
                  <>
                    <ReportsBookingsCharts
                      timeline={MOCK_BOOKING_TIMELINE}
                      statusSlices={MOCK_BOOKING_STATUS_SLICES}
                      productTypes={MOCK_BOOKING_PRODUCT_TYPES}
                      channels={MOCK_BOOKING_CHANNELS}
                      onViewProductDetails={() =>
                        toast.info("Xem chi tiết cơ cấu đặt phòng theo loại sản phẩm")
                      }
                      onViewChannelDetails={() =>
                        toast.info("Xem chi tiết cơ cấu đặt phòng theo kênh bán")
                      }
                    />

                    {/* Recent Bookings Table */}
                    <ReportsBookingsTable
                      bookings={MOCK_RECENT_BOOKINGS}
                      onViewBookingDetails={(booking) =>
                        toast.info(`Chi tiết đặt phòng ${booking.code}`, {
                          description: `${booking.customerName} - ${booking.productName}`,
                        })
                      }
                    />
                  </>
                ) : (
                  <>
                    <ReportsCharts
                      revenueTimeline={MOCK_REPORT_REVENUE_TIMELINE}
                      channels={MOCK_REPORT_CHANNELS}
                      trafficConversion={MOCK_REPORT_TRAFFIC_CONVERSION}
                      customerSources={MOCK_REPORT_CUSTOMER_SOURCES}
                    />

                    {/* Top Best-Selling Tours Table */}
                    <ReportsTopToursTable
                      tours={MOCK_REPORT_TOP_TOURS}
                      onViewAll={() => {
                        if (onNavigateTab) {
                          onNavigateTab("trai-nghiem-tour")
                        } else {
                          toast.info("Xem toàn bộ danh sách tour & trải nghiệm")
                        }
                      }}
                    />
                  </>
                )}
              </div>

              {/* Right Column (~27% on xl screens) */}
              <div className="xl:col-span-3 space-y-5">
                {isCustomerTab ? (
                  <ReportsCustomersRightSidebar
                    onSelectTab={(tabId) => {
                      if (onNavigateTab) {
                        onNavigateTab(tabId)
                      } else {
                        setActiveCategoryTab(tabId)
                      }
                    }}
                    onExportCustomerList={() => setIsExportModalOpen(true)}
                  />
                ) : isBookingTab ? (
                  <ReportsBookingsRightSidebar
                    onSelectTab={(tabId) => {
                      if (onNavigateTab) {
                        onNavigateTab(tabId)
                      } else {
                        setActiveCategoryTab(tabId)
                      }
                    }}
                    onExportBookingReport={() => setIsExportModalOpen(true)}
                  />
                ) : (
                  <ReportsRightSidebar
                    onSelectTab={(tabId) => {
                      if (onNavigateTab) {
                        onNavigateTab(tabId)
                      } else {
                        setActiveCategoryTab(tabId)
                      }
                    }}
                    onExportFormat={handleQuickExport}
                  />
                )}
              </div>
            </div>

            {/* Footer Admin Stayea */}
            <div className="pt-4">
              <StayeaAdminFooter />
            </div>
          </div>
        </main>
      </div>

      {/* Modal Xuất Báo Cáo */}
      <ExportReportsModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={handleExport}
        currentTimeframe={dateRange}
      />
    </div>
  )
}
