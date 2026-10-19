"use client"

import { useState } from "react"
import { Download } from "lucide-react"
import { toast } from "sonner"
import { StayeaAdminHeader } from "@/features/admin-dashboard/components/stayea-admin-header"
import { StayeaAdminSidebar } from "@/features/admin-dashboard/components/stayea-admin-sidebar"
import { StayeaAdminFooter } from "@/features/admin-dashboard/components/stayea-admin-footer"
import {
  MOCK_REVENUE_KPIS,
  MOCK_REVENUE_TIMELINE,
  MOCK_REVENUE_CATEGORIES,
  MOCK_REVENUE_ORDERS,
  MOCK_PAYMENT_METHODS,
  MOCK_LOCATION_REVENUES,
  MOCK_QUICK_ACTIONS,
} from "./stayea-admin-revenue-mock-data"
import type { RevenueOrderItem } from "./stayea-admin-revenue-mock-data"
import { RevenueKpiCards } from "./components/revenue-kpi-cards"
import { RevenueFilterBar } from "./components/revenue-filter-bar"
import { RevenueCharts } from "./components/revenue-charts"
import { RevenueOrdersTable } from "./components/revenue-orders-table"
import { RevenueRightSidebar } from "./components/revenue-right-sidebar"
import { ExportReportModal } from "./components/export-report-modal"

interface StayeaAdminRevenuePageProps {
  onNavigateLanding?: () => void
  onNavigateTab?: (tabId: string) => void
}

export function StayeaAdminRevenuePage({
  onNavigateLanding,
  onNavigateTab,
}: StayeaAdminRevenuePageProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)

  // Filters state
  const [dateRange, setDateRange] = useState("01/06/2024 - 31/08/2024")
  const [selectedCategory, setSelectedCategory] = useState("Tất cả loại hình")
  const [selectedLocation, setSelectedLocation] = useState("Tất cả địa điểm")
  const [selectedPartner, setSelectedPartner] = useState("Tất cả đối tác")

  const handleExport = (options: {
    format: "xlsx" | "pdf" | "csv"
    timeframe: string
    includePartners: boolean
  }) => {
    toast.success("Xuất báo cáo thành công!", {
      description: `Đã tạo tệp báo cáo định dạng .${options.format.toUpperCase()} cho kỳ ${options.timeframe}.`,
    })
  }

  const handleOrderAction = (order: RevenueOrderItem, action: string) => {
    if (action === "view") {
      toast.info(`Chi tiết đơn hàng: ${order.orderCode}`, {
        description: `${order.title} • Khách hàng: ${order.customerName} • Tổng tiền: ${order.totalFormatted}`,
      })
    } else if (action === "invoice") {
      toast.success(`Đã xuất phiếu đối soát cho đơn ${order.orderCode}`)
    } else if (action === "refund") {
      toast.warning(`Đã tạo yêu cầu hoàn tiền cho đơn ${order.orderCode}`)
    }
  }

  const handleQuickAction = (actionId: string) => {
    if (actionId === "action-export") {
      setIsExportModalOpen(true)
    } else if (actionId === "action-reconcile") {
      toast.info("Đối soát với đối tác", {
        description: "Mở bảng đối soát hoa hồng và công nợ với các đơn vị tour/trải nghiệm.",
      })
    } else if (actionId === "action-refund") {
      toast.info("Quản lý hoàn tiền / hủy đơn", {
        description: "Xem danh sách các yêu cầu hoàn hủy đang chờ duyệt.",
      })
    } else if (actionId === "action-payment-settings") {
      toast.info("Cài đặt phương thức thanh toán", {
        description: "Cấu hình cổng thanh toán Ví Stayea, Thẻ tín dụng và QR MoMo/ZaloPay.",
      })
    } else if (actionId === "action-schedule") {
      toast.info("Lịch thanh toán định kỳ", {
        description: "Kỳ thanh toán tiếp theo vào ngày 25/08/2024 cho các đối tác hạng Kim Cương.",
      })
    }
  }

  return (
    <div className="min-h-screen bg-[#f8faf9] flex flex-col font-sans text-slate-800 antialiased selection:bg-emerald-100 selection:text-emerald-900">
      {/* 1. Header with exact search placeholder */}
      <StayeaAdminHeader
        searchPlaceholder="Tìm kiếm tour, trải nghiệm, địa điểm, đối tác..."
        onNavigateLanding={onNavigateLanding}
        onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        onSearch={(query) => {
          if (query.trim()) {
            toast.info(`Tìm kiếm: "${query}"`, {
              description: "Đang lọc dữ liệu giao dịch và đơn hàng...",
            })
          }
        }}
      />

      {/* 2. Main Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <div className={`${sidebarOpen ? "block" : "hidden"} lg:block`}>
          <StayeaAdminSidebar
            activeTab="doanh-thu-thanh-toan"
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

        {/* Scrollable Main Content */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-7 py-6">
          {/* Main 2-column Grid: Left Main (8.5 cols / ~72%) + Right Sidebar (3.5 cols / ~28%) */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
            {/* Left Column: Title Row + Filter Bar + 4 KPI Cards + Dual Charts + Table */}
            <div className="xl:col-span-9 space-y-4 sm:space-y-5">
              {/* Top Page Header Title & Action Button */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                    Doanh thu & Thanh toán
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    Theo dõi doanh thu, quản lý thanh toán và đối soát với đối tác cho các trải nghiệm và tour.
                  </p>
                </div>

                {/* Primary Action Button: Xuất báo cáo */}
                <button
                  type="button"
                  onClick={() => setIsExportModalOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#007a48] hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer w-fit shrink-0"
                >
                  <Download className="w-4 h-4 stroke-[2.2]" />
                  <span>Xuất báo cáo</span>
                </button>
              </div>

              {/* Filter Bar */}
              <RevenueFilterBar
                dateRange={dateRange}
                selectedCategory={selectedCategory}
                selectedLocation={selectedLocation}
                selectedPartner={selectedPartner}
                onDateRangeChange={setDateRange}
                onCategoryChange={setSelectedCategory}
                onLocationChange={setSelectedLocation}
                onPartnerChange={setSelectedPartner}
                onOpenAdvancedFilter={() => {
                  toast.info("Bộ lọc nâng cao", {
                    description: "Mở tùy chọn lọc theo cổng thanh toán, biên độ hoa hồng và trạng thái đối soát.",
                  })
                }}
              />

              {/* KPI Cards Row (4 cards in a row) */}
              <RevenueKpiCards stats={MOCK_REVENUE_KPIS} />

              {/* Dual Charts (Revenue over time + Revenue by category) */}
              <RevenueCharts
                timelineData={MOCK_REVENUE_TIMELINE}
                categoryData={MOCK_REVENUE_CATEGORIES}
                onViewCategoryDetails={() => {
                  toast.info("Chi tiết doanh thu theo loại hình", {
                    description: "Tour biển đảo hiện đang dẫn đầu với 38% tổng doanh số.",
                  })
                }}
              />

              {/* Orders & Settlement Data Table */}
              <RevenueOrdersTable
                orders={MOCK_REVENUE_ORDERS}
                onViewAll={() => {
                  toast.info("Xem toàn bộ danh sách đơn hàng và đối soát (1.248 đơn)")
                }}
                onActionClick={handleOrderAction}
              />
            </div>

            {/* Right Column (Right Sidebar): Promo Banner + Payment Methods + Locations + Quick Actions */}
            <div className="xl:col-span-3">
              <RevenueRightSidebar
                paymentMethods={MOCK_PAYMENT_METHODS}
                locations={MOCK_LOCATION_REVENUES}
                quickActions={MOCK_QUICK_ACTIONS}
                onViewPaymentDetails={() => {
                  toast.info("Chi tiết phương thức thanh toán", {
                    description: "Ví Stayea chiếm tỷ trọng cao nhất 42% nhờ ưu đãi điểm thưởng.",
                  })
                }}
                onViewLocationDetails={() => {
                  toast.info("Chi tiết doanh thu theo địa phương", {
                    description: "Phú Quốc đang đứng đầu với 162.5M doanh thu (38%).",
                  })
                }}
                onQuickAction={handleQuickAction}
                onPromoClick={() => {
                  toast.info("Chương trình Tăng doanh thu với trải nghiệm đặc sắc")
                }}
              />
            </div>
          </div>

          {/* Footer */}
          <StayeaAdminFooter />
        </main>
      </div>

      {/* Export Report Modal */}
      <ExportReportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={handleExport}
      />
    </div>
  )
}
