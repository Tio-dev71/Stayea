"use client"

import { useState } from "react"
import { toast } from "sonner"
import { StayeaAdminHeader } from "@/features/admin-dashboard/components/stayea-admin-header"
import { StayeaAdminSidebar } from "@/features/admin-dashboard/components/stayea-admin-sidebar"
import { StayeaAdminFooter } from "@/features/admin-dashboard/components/stayea-admin-footer"
import { SeoHeader } from "./components/seo-header"
import { SeoKpiCards } from "./components/seo-kpi-cards"
import { MarketingCategoryTabs } from "./components/marketing-category-tabs"
import { SeoCharts } from "./components/seo-charts"
import { SeoKeywordsTable } from "./components/seo-keywords-table"
import { SeoRightSidebar } from "./components/seo-right-sidebar"
import { ExportMarketingModal } from "./components/export-marketing-modal"
import { CreateCampaignModal } from "./components/create-campaign-modal"
import { AdvancedFilterModal } from "./components/advanced-filter-modal"
import {
  MOCK_SEO_KPIS,
  MOCK_SEO_TIMELINE,
  MOCK_SEO_RANK_DISTRIBUTION,
  MOCK_SEO_TOP_PAGES,
  MOCK_SEO_TOP_RANKED_KEYWORDS,
  MOCK_SEO_KEYWORDS_TABLE,
  MOCK_SEO_KEY_METRICS_SIDEBAR,
  MOCK_SEO_GROWTH_KEYWORDS_SIDEBAR,
  MOCK_SEO_RELATED_REPORTS_SIDEBAR,
} from "./stayea-admin-marketing-mock-data"
import type { SeoKeywordTableRowItem } from "./stayea-admin-marketing-mock-data"

interface StayeaAdminSeoPageProps {
  onNavigateTab?: (tabId: string) => void
  onNavigateLanding?: () => void
  onSwitchCategoryTab?: (tabId: string) => void
}

export function StayeaAdminSeoPage({
  onNavigateTab,
  onNavigateLanding,
  onSwitchCategoryTab,
}: StayeaAdminSeoPageProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeCategoryTab, setActiveCategoryTab] = useState("seo")

  // Modals
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isAdvancedFilterOpen, setIsAdvancedFilterOpen] = useState(false)

  const handleKeywordAction = (item: SeoKeywordTableRowItem) => {
    toast.info(`Thao tác cho từ khóa "${item.keyword}"`, {
      description: `Vị trí hiện tại: #${item.currentRank} | Lượt tìm kiếm: ${item.monthlySearches}/tháng | URL: ${item.rankingUrl}`,
    })
  }

  const handleQuickAction = (key: string) => {
    switch (key) {
      case "seo-keywords-report":
        toast.info("Mở báo cáo chi tiết toàn bộ từ khóa SEO")
        break
      case "seo-backlinks-report":
        toast.info("Mở báo cáo chi tiết mạng lưới Backlink chất lượng")
        break
      case "seo-technical-report":
        toast.info("Mở báo cáo kỹ thuật SEO: Tốc độ tải, Core Web Vitals, Crawl Errors")
        break
      case "seo-content-report":
        toast.info("Mở báo cáo chất lượng nội dung & chuẩn SEO On-page")
        break
      case "seo-export-data":
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
    toast.success("Xuất dữ liệu SEO thành công!", {
      description: `Đã kết xuất dữ liệu định dạng .${options.format.toUpperCase()} cho kỳ ${options.timeframe}.`,
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
              description: "Đang tra cứu từ khóa và lưu lượng SEO...",
            })
          }
        }}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* 2. Responsive Sidebar Drawer (Highlights 'Báo cáo' with green pill as in design) */}
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
              if (tabId === "marketing") {
                onSwitchCategoryTab?.("tong-quan")
              } else if (tabId === "bao-cao") {
                setActiveCategoryTab("seo")
              } else if (onNavigateTab) {
                onNavigateTab(tabId)
              }
            }}
          />
        </div>

        {/* 3. Main Content: Báo cáo SEO */}
        <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-5 overflow-y-auto">
          <div className="max-w-[1536px] mx-auto space-y-5">
            {/* Header: Title + Date Filter + Compare Dropdown + Export Button */}
            <SeoHeader
              onDateRangeChange={(range) => {
                toast.info(`Đã chọn kỳ báo cáo: ${range}`)
              }}
              onComparisonChange={(period) => {
                toast.info(`Đã đổi mốc so sánh: ${period}`)
              }}
              onExportReport={() => setIsExportModalOpen(true)}
            />

            {/* Category Tabs: Tổng quan | Kênh marketing | Chiến dịch | Quảng cáo | Nội dung | Email Marketing | SEO (active) | ... */}
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
                {/* 5 KPI Cards */}
                <SeoKpiCards
                  items={MOCK_SEO_KPIS}
                  onKpiClick={(kpiId) => {
                    toast.info(`Xem chi tiết chỉ số SEO: ${kpiId}`)
                  }}
                />

                {/* 4 Charts Grid (2x2) */}
                <SeoCharts
                  timeline={MOCK_SEO_TIMELINE}
                  rankDistribution={MOCK_SEO_RANK_DISTRIBUTION}
                  topPages={MOCK_SEO_TOP_PAGES}
                  topRankedKeywords={MOCK_SEO_TOP_RANKED_KEYWORDS}
                  onViewAllTopPages={() =>
                    toast.info("Xem chi tiết toàn bộ trang được truy cập tự nhiên")
                  }
                  onViewAllTopKeywords={() =>
                    toast.info("Xem danh sách toàn bộ từ khóa có thứ hạng cao nhất")
                  }
                />

                {/* Table: Chi tiết từ khóa chính */}
                <SeoKeywordsTable
                  keywords={MOCK_SEO_KEYWORDS_TABLE}
                  onActionClick={handleKeywordAction}
                  onViewAll={() => toast.info("Xem tất cả từ khóa SEO chi tiết")}
                />
              </div>

              {/* Right Sidebar Column (~27% on xl screens) */}
              <div className="xl:col-span-3">
                <SeoRightSidebar
                  keyMetrics={MOCK_SEO_KEY_METRICS_SIDEBAR}
                  growthKeywords={MOCK_SEO_GROWTH_KEYWORDS_SIDEBAR}
                  relatedReports={MOCK_SEO_RELATED_REPORTS_SIDEBAR}
                  onActionClick={handleQuickAction}
                  onViewAllGrowthKeywords={() =>
                    toast.info("Xem tất cả từ khóa tăng trưởng mạnh")
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
          toast.success(`Đã tạo chiến dịch SEO/Marketing "${camp.title}" thành công!`)
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
