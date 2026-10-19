"use client"

import { useState } from "react"
import { toast } from "sonner"
import { StayeaAdminHeader } from "@/features/admin-dashboard/components/stayea-admin-header"
import { StayeaAdminSidebar } from "@/features/admin-dashboard/components/stayea-admin-sidebar"
import { StayeaAdminFooter } from "@/features/admin-dashboard/components/stayea-admin-footer"
import { ContentHeader } from "./components/content-header"
import { ContentKpiCards } from "./components/content-kpi-cards"
import { MarketingCategoryTabs } from "./components/marketing-category-tabs"
import { ContentCharts } from "./components/content-charts"
import { ContentTable } from "./components/content-table"
import { ContentRightSidebar } from "./components/content-right-sidebar"
import { ExportMarketingModal } from "./components/export-marketing-modal"
import { CreateCampaignModal } from "./components/create-campaign-modal"
import { AdvancedFilterModal } from "./components/advanced-filter-modal"
import type { FeaturedContentTableItem } from "./stayea-admin-marketing-mock-data"

interface StayeaAdminContentPageProps {
  onNavigateTab?: (tabId: string) => void
  onNavigateLanding?: () => void
  onSwitchCategoryTab?: (tabId: string) => void
}

export function StayeaAdminContentPage({
  onNavigateTab,
  onNavigateLanding,
  onSwitchCategoryTab,
}: StayeaAdminContentPageProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeCategoryTab, setActiveCategoryTab] = useState("noi-dung")

  // Modals
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isAdvancedFilterOpen, setIsAdvancedFilterOpen] = useState(false)

  const handleContentAction = (
    item: FeaturedContentTableItem,
    action: string
  ) => {
    switch (action) {
      case "view":
        toast.info(`Chi tiết nội dung "${item.title}"`, {
          description: `Lượt xem: ${item.views} | Tương tác: ${item.engagement} | Chuyển đổi: ${item.conversions}`,
        })
        break
      default:
        toast.info(`Thao tác: ${action} trên nội dung ${item.title}`)
    }
  }

  const handleExport = (options: {
    format: "xlsx" | "pdf" | "csv"
    timeframe: string
    includeChannels: boolean
  }) => {
    setIsExportModalOpen(false)
    toast.success("Xuất báo cáo nội dung thành công!", {
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
              description: "Đang lọc dữ liệu báo cáo nội dung...",
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
                setActiveCategoryTab("noi-dung")
              } else if (onNavigateTab) {
                onNavigateTab(tabId)
              }
            }}
          />
        </div>

        {/* 3. Main Content: Báo cáo Nội dung */}
        <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-5 overflow-y-auto">
          <div className="max-w-[1536px] mx-auto space-y-5">
            {/* Header: Title + Date Filter + Compare Dropdown + Export Button */}
            <ContentHeader
              onDateRangeChange={(range) => {
                toast.info(`Đã chọn kỳ báo cáo: ${range}`)
              }}
              onComparisonChange={(period) => {
                toast.info(`Đã đổi mốc so sánh: ${period}`)
              }}
              onExportReport={() => setIsExportModalOpen(true)}
            />

            {/* 5 KPI Cards */}
            <ContentKpiCards
              onKpiClick={(id) => {
                toast.info(`Chi tiết chỉ số: ${id}`)
              }}
            />

            {/* Category Tabs: Tổng quan | Kênh marketing | Chiến dịch | Nội dung (active) | ... */}
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
                <ContentCharts
                  onViewAllTopics={() => {
                    toast.info("Xem toàn bộ danh sách chủ đề nội dung")
                  }}
                />

                {/* Table: Danh sách nội dung nổi bật */}
                <ContentTable onActionClick={handleContentAction} />
              </div>

              {/* Right Sidebar Column (~27% on xl screens) */}
              <div className="xl:col-span-3">
                <ContentRightSidebar
                  onHighlightClick={(item) => {
                    toast.info(`Xem chi tiết bài viết: ${item.title}`)
                  }}
                  onIdeaClick={(idea) => {
                    toast.info(`Ý tưởng: ${idea.title}`)
                  }}
                  onQuickActionClick={(actionKey) => {
                    if (actionKey === "create-content") {
                      setIsCreateModalOpen(true)
                    } else if (actionKey === "export-report") {
                      setIsExportModalOpen(true)
                    } else {
                      toast.info(`Thao tác: ${actionKey}`)
                    }
                  }}
                  onViewAllHighlights={() => {
                    toast.info("Xem toàn bộ danh sách nội dung nổi bật")
                  }}
                  onViewAllIdeas={() => {
                    toast.info("Xem toàn bộ danh sách gợi ý nội dung")
                  }}
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
          toast.success(`Đã tạo nội dung/chiến dịch "${camp.title}" thành công!`)
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
