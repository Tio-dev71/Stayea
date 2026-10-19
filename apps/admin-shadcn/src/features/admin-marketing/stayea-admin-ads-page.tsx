"use client"

import { useState } from "react"
import { toast } from "sonner"
import { StayeaAdminHeader } from "@/features/admin-dashboard/components/stayea-admin-header"
import { StayeaAdminSidebar } from "@/features/admin-dashboard/components/stayea-admin-sidebar"
import { StayeaAdminFooter } from "@/features/admin-dashboard/components/stayea-admin-footer"
import { AdsHeader } from "./components/ads-header"
import { AdsKpiCards } from "./components/ads-kpi-cards"
import { MarketingCategoryTabs } from "./components/marketing-category-tabs"
import { AdsCharts } from "./components/ads-charts"
import { AdsCampaignsTable } from "./components/ads-campaigns-table"
import { AdsRightSidebar } from "./components/ads-right-sidebar"
import { ExportMarketingModal } from "./components/export-marketing-modal"
import { CreateCampaignModal } from "./components/create-campaign-modal"
import { AdvancedFilterModal } from "./components/advanced-filter-modal"
import {
  MOCK_ADS_KPIS,
  MOCK_ADS_TIMELINE,
  MOCK_ADS_CHANNEL_DONUT,
  MOCK_ADS_COST_REVENUE_BARS,
  MOCK_ADS_FUNNEL_STAGES,
  MOCK_ADS_CAMPAIGNS_TABLE,
  MOCK_ADS_HIGHLIGHTS_SIDEBAR,
  MOCK_ADS_OPTIMIZE_TIPS,
  MOCK_ADS_QUICK_ACTIONS,
} from "./stayea-admin-marketing-mock-data"
import type { AdsCampaignRowItem } from "./stayea-admin-marketing-mock-data"

interface StayeaAdminAdsPageProps {
  onNavigateTab?: (tabId: string) => void
  onNavigateLanding?: () => void
  onSwitchCategoryTab?: (tabId: string) => void
}

export function StayeaAdminAdsPage({
  onNavigateTab,
  onNavigateLanding,
  onSwitchCategoryTab,
}: StayeaAdminAdsPageProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeCategoryTab, setActiveCategoryTab] = useState("quang-cao")

  // Modals
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isAdvancedFilterOpen, setIsAdvancedFilterOpen] = useState(false)

  const handleCampaignAction = (
    item: AdsCampaignRowItem,
    action: string
  ) => {
    switch (action) {
      case "view":
        toast.info(`Chi tiết chiến dịch quảng cáo "${item.campaignName}"`, {
          description: `Kênh: ${item.channelName} | ROAS: ${item.roas} | Chuyển đổi: ${item.conversions}`,
        })
        break
      default:
        toast.info(`Thao tác: ${action} trên chiến dịch ${item.campaignName}`)
    }
  }

  const handleQuickAction = (key: string) => {
    switch (key) {
      case "create-ads":
        setIsCreateModalOpen(true)
        break
      case "manage-ads":
        toast.info("Chuyển tới giao diện Quản lý quảng cáo nâng cao")
        break
      case "schedule-ads":
        toast.info("Mở lịch trình phân bổ quảng cáo")
        break
      case "export-ads":
        setIsExportModalOpen(true)
        break
      case "settings-budget":
        toast.info("Mở cài đặt giới hạn ngân sách quảng cáo")
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
    toast.success("Xuất báo cáo quảng cáo thành công!", {
      description: `Đã kết xuất báo cáo định dạng .${options.format.toUpperCase()} cho kỳ ${options.timeframe}.`,
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
              description: "Đang lọc dữ liệu báo cáo quảng cáo...",
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
                setActiveCategoryTab("quang-cao")
              } else if (onNavigateTab) {
                onNavigateTab(tabId)
              }
            }}
          />
        </div>

        {/* 3. Main Content: Báo cáo Quảng cáo */}
        <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-5 overflow-y-auto">
          <div className="max-w-[1536px] mx-auto space-y-5">
            {/* Header: Title + Date Filter + Compare Dropdown + Export Button */}
            <AdsHeader
              onDateRangeChange={(range) => {
                toast.info(`Đã chọn kỳ báo cáo: ${range}`)
              }}
              onComparisonChange={(period) => {
                toast.info(`Đã đổi mốc so sánh: ${period}`)
              }}
              onExportReport={() => setIsExportModalOpen(true)}
            />

            {/* 5 KPI Cards */}
            <AdsKpiCards items={MOCK_ADS_KPIS} />

            {/* Category Tabs: Tổng quan | Kênh marketing | Chiến dịch | Nội dung | Quảng cáo (active) | ... */}
            <MarketingCategoryTabs
              activeTab={activeCategoryTab}
              setActiveTab={(tab) => {
                setActiveCategoryTab(tab)
                if (onSwitchCategoryTab) {
                  onSwitchCategoryTab(tab)
                }
              }}
            />

            {/* 2-Column Responsive Dashboard Layout */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
              {/* Left Column (~73% on xl screens) */}
              <div className="xl:col-span-9 space-y-5">
                {/* 4 Charts Grid */}
                <AdsCharts
                  timeline={MOCK_ADS_TIMELINE}
                  channelDonut={MOCK_ADS_CHANNEL_DONUT}
                  costRevenueBars={MOCK_ADS_COST_REVENUE_BARS}
                  funnelStages={MOCK_ADS_FUNNEL_STAGES}
                />

                {/* Table: Danh sách chiến dịch quảng cáo */}
                <AdsCampaignsTable
                  items={MOCK_ADS_CAMPAIGNS_TABLE}
                  onAction={handleCampaignAction}
                  onViewAll={() => toast.info("Xem tất cả chiến dịch quảng cáo")}
                />
              </div>

              {/* Right Sidebar Column (~27% on xl screens) */}
              <div className="xl:col-span-3">
                <AdsRightSidebar
                  highlights={MOCK_ADS_HIGHLIGHTS_SIDEBAR}
                  optimizeTips={MOCK_ADS_OPTIMIZE_TIPS}
                  quickActions={MOCK_ADS_QUICK_ACTIONS}
                  onActionClick={handleQuickAction}
                  onViewAllHighlights={() =>
                    toast.info("Xem tất cả hiệu quả kênh quảng cáo")
                  }
                  onViewAllTips={() =>
                    toast.info("Xem tất cả gợi ý tối ưu quảng cáo")
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
          toast.success(`Đã tạo chiến dịch quảng cáo "${camp.title}" thành công!`)
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
