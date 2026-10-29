"use client"

import { useState, useEffect } from "react"
import { Download } from "lucide-react"
import { toast } from "sonner"
import { stayeaApi } from "@/lib/stayea-api-service"
import { StayeaAdminHeader } from "@/features/admin-dashboard/components/stayea-admin-header"
import { StayeaAdminSidebar } from "@/features/admin-dashboard/components/stayea-admin-sidebar"
import { StayeaAdminFooter } from "@/features/admin-dashboard/components/stayea-admin-footer"
import {
  MOCK_REVENUE_KPIS,
  MOCK_REVENUE_TIMELINE,
  MOCK_REVENUE_CATEGORIES,
  MOCK_PAYMENT_METHODS,
  MOCK_LOCATION_REVENUES,
  MOCK_QUICK_ACTIONS,
} from "./stayea-admin-revenue-mock-data"
import type { RevenueOrderItem, RevenueKpiItem } from "./stayea-admin-revenue-mock-data"
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

  const [ordersList, setOrdersList] = useState<RevenueOrderItem[]>([])
  const [revenueKpis, setRevenueKpis] = useState<RevenueKpiItem[]>(MOCK_REVENUE_KPIS)

  useEffect(() => {
    async function fetchRevenueData() {
      try {
        const bookings = await stayeaApi.getAllBookingsForAdmin()
        if (Array.isArray(bookings) && bookings.length > 0) {
          let totalRev = 0
          let paidRev = 0
          let pendingRev = 0

          const mapped: RevenueOrderItem[] = bookings.map((b: any, idx: number) => {
            const amount = Number(b.totalAmount || b.total_price) || 0
            const pst = (b.paymentStatus || b.status || "").toLowerCase()
            const isPaid = pst === "paid" || pst === "đã thanh toán" || pst === "confirmed" || pst === "completed"
            
            totalRev += amount
            if (isPaid) {
              paidRev += amount
            } else {
              pendingRev += amount
            }

            const commission = Math.round(amount * 0.12) // 12% standard platform fee

            return {
              id: b.id || `order-${idx}`,
              orderCode: b.bookingCode || b.booking_code || `ORD-${1000 + idx}`,
              title: b.title || b.propertyName || "Dịch vụ STAYEA",
              category: b.serviceType || "Lưu trú & Nghỉ dưỡng",
              imageUrl: b.image || "/about/team-1.jpg",
              customerName: b.contactName || b.guestName || "Khách hàng",
              bookingDate: b.checkInDate ? new Date(b.checkInDate).toLocaleDateString("vi-VN") : "Hôm nay",
              totalAmount: amount,
              totalFormatted: new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount),
              status: isPaid ? "paid" : "pending",
              statusLabel: isPaid ? "Đã thanh toán" : "Chờ thanh toán",
              commissionAmount: commission,
              commissionFormatted: new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(commission),
            }
          })

          setOrdersList(mapped)

          const platformCommission = Math.round(totalRev * 0.12)
          const fmt = (val: number) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(val)

          setRevenueKpis([
            {
              id: "total-revenue",
              title: "Tổng doanh thu",
              value: fmt(totalRev),
              trendPercent: "100%",
              trendLabel: "dữ liệu thực tế",
              isPositive: true,
              icon: "wallet",
              colorTheme: "green",
            },
            {
              id: "paid-revenue",
              title: "Doanh thu đã thanh toán",
              value: fmt(paidRev),
              trendPercent: "100%",
              trendLabel: "đã đối soát",
              isPositive: true,
              icon: "paid",
              colorTheme: "blue",
            },
            {
              id: "pending-revenue",
              title: "Doanh thu chờ thanh toán",
              value: fmt(pendingRev),
              trendPercent: "0%",
              trendLabel: "cần thu",
              isPositive: true,
              icon: "pending",
              colorTheme: "orange",
            },
            {
              id: "platform-commission",
              title: "Hoa hồng nền tảng (12%)",
              value: fmt(platformCommission),
              trendPercent: "12%",
              trendLabel: "phí hệ thống",
              isPositive: true,
              icon: "commission",
              colorTheme: "purple",
            },
          ])
        } else {
          setOrdersList([])
          setRevenueKpis(MOCK_REVENUE_KPIS)
        }
      } catch (err) {
        console.error("Error fetching revenue bookings:", err)
      }
    }

    fetchRevenueData()
  }, [])

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
      <div className="flex-1 flex overflow-hidden min-w-0">
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
        <main className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden px-4 sm:px-6 lg:px-7 py-6">
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
              <RevenueKpiCards stats={revenueKpis} />

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
                orders={ordersList}
                onViewAll={() => {
                  toast.info(`Xem toàn bộ danh sách đơn hàng và đối soát (${ordersList.length} đơn)`)
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
