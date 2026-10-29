"use client"

import { useState } from "react"
import { toast } from "sonner"
import { StayeaAdminHeader } from "@/features/admin-dashboard/components/stayea-admin-header"
import { StayeaAdminSidebar } from "@/features/admin-dashboard/components/stayea-admin-sidebar"
import { StayeaAdminFooter } from "@/features/admin-dashboard/components/stayea-admin-footer"
import { EmailHeader } from "./components/email-header"
import { MarketingCategoryTabs } from "./components/marketing-category-tabs"
import { EmailKpiCards } from "./components/email-kpi-cards"
import { EmailSubTabs } from "./components/email-sub-tabs"
import { EmailCharts } from "./components/email-charts"
import { EmailCampaignsTable } from "./components/email-campaigns-table"
import { EmailRightSidebar } from "./components/email-right-sidebar"
import { ExportMarketingModal } from "./components/export-marketing-modal"
import { CreateCampaignModal } from "./components/create-campaign-modal"
import { AdvancedFilterModal } from "./components/advanced-filter-modal"
import {
  MOCK_EMAIL_KPIS,
  MOCK_EMAIL_TIMELINE,
  MOCK_EMAIL_TYPES_DONUT,
  MOCK_EMAIL_DEVICE_BARS,
  MOCK_EMAIL_SEGMENTS,
  MOCK_EMAIL_CAMPAIGNS_TABLE,
  MOCK_EMAIL_TOP_CAMPAIGNS_SIDEBAR,
  MOCK_EMAIL_OPTIMIZE_TIPS,
  MOCK_EMAIL_QUICK_ACTIONS,
} from "./stayea-admin-marketing-mock-data"
import type { EmailCampaignRowItem } from "./stayea-admin-marketing-mock-data"

interface StayeaAdminEmailPageProps {
  onNavigateTab?: (tabId: string) => void
  onNavigateLanding?: () => void
  onSwitchCategoryTab?: (tabId: string) => void
}

export function StayeaAdminEmailPage({
  onNavigateTab,
  onNavigateLanding,
  onSwitchCategoryTab,
}: StayeaAdminEmailPageProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeSubTab, setActiveSubTab] = useState("tong-quan")

  // Modals
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isAdvancedFilterOpen, setIsAdvancedFilterOpen] = useState(false)

  const handleCampaignAction = (
    item: EmailCampaignRowItem,
    action: string
  ) => {
    switch (action) {
      case "view":
        toast.info(`Chi tiết chiến dịch email "${item.campaignName}"`, {
          description: `Loại: ${item.emailType} | Tỷ lệ mở: ${item.openRate} | Chuyển đổi: ${item.conversions}`,
        })
        break
      default:
        toast.info(`Thao tác: ${action} trên chiến dịch ${item.campaignName}`)
    }
  }

  const handleQuickAction = (key: string) => {
    switch (key) {
      case "create-email":
        setIsCreateModalOpen(true)
        break
      case "manage-subscribers":
        toast.info("Chuyển tới giao diện Quản lý danh sách email người đăng ký")
        break
      case "create-template":
        toast.info("Mở trình tạo mẫu email kéo thả Stayea")
        break
      case "setup-automation":
        toast.info("Mở sơ đồ thiết lập kịch bản tự động hóa (Automation Flow)")
        break
      case "export-email":
        setIsExportModalOpen(true)
        break
      default:
        toast.info(`Thao tác: ${key}`)
    }
  }

  const handleExport = (options: {
    format: "xlsx" | "pdf" | "csv"
    timeframe: string
    includeChannels: boolean
  }) => {
    setIsExportModalOpen(false)
    toast.success("Xuất báo cáo email marketing thành công!", {
      description: `Định dạng: ${options.format.toUpperCase()} | Kỳ: ${options.timeframe}.`,
    })
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans antialiased selection:bg-[#007a48]/20 selection:text-[#007a48]">
      {/* 1. Top Admin Header */}
      <StayeaAdminHeader
        searchPlaceholder="Tìm kiếm tour, trải nghiệm, địa điểm, đối tác..."
        onNavigateLanding={onNavigateLanding}
        onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        onSearch={(query) => {
          if (query.trim()) {
            toast.info(`Tìm kiếm: "${query}"`, {
              description: "Đang lọc dữ liệu báo cáo email...",
            })
          }
        }}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* 2. Responsive Sidebar Drawer */}
        <div
          className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-white transition-transform duration-200 ease-in-out md:static md:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <StayeaAdminSidebar
            activeTab="marketing"
            promoTitle="Phú Quốc"
            promoSubtitle="Trải nghiệm vạn điều thú vị"
            promoButtonText="Khám phá ngay"
            onSelectTab={(tabId) => {
              if (tabId === "marketing") {
                if (onSwitchCategoryTab) {
                  onSwitchCategoryTab("email-marketing")
                }
              } else if (onNavigateTab) {
                onNavigateTab(tabId)
              }
            }}
          />
        </div>

        {/* 3. Main Content: Báo cáo Email Marketing */}
        <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-5 overflow-y-auto">
          <div className="max-w-[1536px] mx-auto space-y-4">
            {/* Header: Title + Date Filter + Compare Dropdown + Export Button */}
            <EmailHeader
              onDateRangeChange={(range) => {
                toast.info(`Đã chọn kỳ báo cáo: ${range}`)
              }}
              onComparisonChange={(period) => {
                toast.info(`Đã đổi mốc so sánh: ${period}`)
              }}
              onExportReport={() => setIsExportModalOpen(true)}
            />

            {/* Category Tabs */}
            <MarketingCategoryTabs
              activeTab="email-marketing"
              setActiveTab={(tab) => {
                onSwitchCategoryTab?.(tab)
              }}
            />

            {/* 5 KPI Cards: Đặt ngay bên dưới Header theo chuẩn thiết kế */}
            <EmailKpiCards
              items={MOCK_EMAIL_KPIS}
              onKpiClick={(id) => {
                toast.info(`Chi tiết chỉ số: ${id}`)
              }}
            />

            {/* Sub-tabs: Tổng quan (active) | Chiến dịch | Danh sách email | Nội dung | Tự động hóa | A/B Testing | Phân khúc | Báo cáo chi tiết */}
            <EmailSubTabs
              activeTab={activeSubTab}
              onTabChange={(tabId) => {
                setActiveSubTab(tabId)
                toast.info(`Chuyển phân mục: ${tabId}`)
              }}
            />

            {/* 2-Column Responsive Dashboard Layout */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
              {/* Left Column (~73% on xl screens) */}
              <div className="xl:col-span-9 space-y-5">
                {/* 4 Charts Grid */}
                <EmailCharts
                  timeline={MOCK_EMAIL_TIMELINE}
                  emailTypes={MOCK_EMAIL_TYPES_DONUT}
                  deviceBars={MOCK_EMAIL_DEVICE_BARS}
                  segments={MOCK_EMAIL_SEGMENTS}
                  onViewTypeDetails={() => {
                    toast.info("Xem chi tiết phân loại email gửi")
                  }}
                  onViewSegmentDetails={() => {
                    toast.info("Xem chi tiết phân khúc người nhận")
                  }}
                />

                {/* Table: Danh sách chiến dịch email */}
                <EmailCampaignsTable
                  items={MOCK_EMAIL_CAMPAIGNS_TABLE}
                  onAction={handleCampaignAction}
                  onViewAll={() => toast.info("Xem tất cả chiến dịch email")}
                />
              </div>

              {/* Right Sidebar Column (~27% on xl screens) */}
              <div className="xl:col-span-3">
                <EmailRightSidebar
                  topCampaigns={MOCK_EMAIL_TOP_CAMPAIGNS_SIDEBAR}
                  optimizeTips={MOCK_EMAIL_OPTIMIZE_TIPS}
                  quickActions={MOCK_EMAIL_QUICK_ACTIONS}
                  onActionClick={handleQuickAction}
                  onViewAllTop={() =>
                    toast.info("Xem tất cả top chiến dịch email")
                  }
                  onViewAllTips={() =>
                    toast.info("Xem tất cả gợi ý tối ưu email")
                  }
                />
              </div>
            </div>

            {/* Footer Admin Stayea */}
            <div className="pt-4">
              <StayeaAdminFooter />
            </div>
          </div>
        </main>
      </div>

      {/* 4. Modals */}
      <ExportMarketingModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={handleExport}
      />

      <CreateCampaignModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={(camp) => {
          setIsCreateModalOpen(false)
          toast.success(`Đã tạo chiến dịch email "${camp.title}" thành công!`)
        }}
      />

      <AdvancedFilterModal
        isOpen={isAdvancedFilterOpen}
        onClose={() => setIsAdvancedFilterOpen(false)}
        onApply={() => {
          toast.success("Đã áp dụng bộ lọc nâng cao!")
        }}
      />
    </div>
  )
}
