"use client"

import { useState } from "react"
import { toast } from "sonner"
import { StayeaAdminHeader } from "@/features/admin-dashboard/components/stayea-admin-header"
import { StayeaAdminSidebar } from "@/features/admin-dashboard/components/stayea-admin-sidebar"
import { StayeaAdminFooter } from "@/features/admin-dashboard/components/stayea-admin-footer"
import { ChannelsHeader } from "./components/channels-header"
import { ChannelsKpiCards } from "./components/channels-kpi-cards"
import { MarketingCategoryTabs } from "./components/marketing-category-tabs"
import { ChannelsCharts } from "./components/channels-charts"
import { ChannelsTable } from "./components/channels-table"
import { ChannelsRightSidebar } from "./components/channels-right-sidebar"
import { ExportMarketingModal } from "./components/export-marketing-modal"
import { CreateCampaignModal } from "./components/create-campaign-modal"
import { AdvancedFilterModal } from "./components/advanced-filter-modal"
import type { ChannelPerformanceTableItem } from "./stayea-admin-marketing-mock-data"

interface StayeaAdminChannelsPageProps {
  onNavigateTab?: (tabId: string) => void
  onNavigateLanding?: () => void
  onSwitchCategoryTab?: (tabId: string) => void
}

export function StayeaAdminChannelsPage({
  onNavigateTab,
  onNavigateLanding,
  onSwitchCategoryTab,
}: StayeaAdminChannelsPageProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeCategoryTab, setActiveCategoryTab] = useState("kenh-marketing")

  // Modals
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isAdvancedFilterOpen, setIsAdvancedFilterOpen] = useState(false)

  const handleChannelAction = (
    channel: ChannelPerformanceTableItem,
    action: string
  ) => {
    switch (action) {
      case "view":
        toast.info(`Chi tiết kênh "${channel.name}"`, {
          description: `Doanh thu: ${channel.revenue} | ROAS: ${channel.roas} | Đặt phòng: ${channel.bookings}`,
        })
        break
      case "budget":
        toast.info(`Điều chỉnh ngân sách cho kênh "${channel.name}"`)
        break
      case "create_campaign":
        toast.info(`Tạo chiến dịch mới trên kênh "${channel.name}"`)
        setIsCreateModalOpen(true)
        break
      case "pause":
        toast.warning(`Tạm dừng chi tiêu cho kênh "${channel.name}"`)
        break
      default:
        toast.info(`Thao tác: ${action} trên kênh ${channel.name}`)
    }
  }

  const handleExport = (options: {
    format: "xlsx" | "pdf" | "csv"
    timeframe: string
    includeChannels: boolean
  }) => {
    setIsExportModalOpen(false)
    toast.success("Xuất báo cáo kênh marketing thành công!", {
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
              description: "Đang lọc dữ liệu báo cáo kênh marketing...",
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
                setActiveCategoryTab("kenh-marketing")
              } else if (onNavigateTab) {
                onNavigateTab(tabId)
              }
            }}
          />
        </div>

        {/* 3. Main Content: Báo cáo Kênh marketing */}
        <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-5 overflow-y-auto">
          <div className="max-w-[1536px] mx-auto space-y-5">
            {/* Header: Title + Date Filter + Compare Dropdown + Export Button */}
            <ChannelsHeader
              onDateRangeChange={(range) => {
                toast.info(`Đã chọn kỳ báo cáo: ${range}`)
              }}
              onComparisonChange={(period) => {
                toast.info(`Đã đổi mốc so sánh: ${period}`)
              }}
              onExportReport={() => setIsExportModalOpen(true)}
            />

            {/* 5 KPI Cards */}
            <ChannelsKpiCards
              onKpiClick={(id) => {
                toast.info(`Chi tiết chỉ số: ${id}`)
              }}
            />

            {/* Category Tabs: Tổng quan | Kênh marketing (active) | Chiến dịch | ... */}
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
                <ChannelsCharts />

                {/* Table: Hiệu quả chi tiết theo kênh */}
                <ChannelsTable onActionClick={handleChannelAction} />
              </div>

              {/* Right Sidebar Column (~27% on xl screens) */}
              <div className="xl:col-span-3">
                <ChannelsRightSidebar
                  onHighlightClick={(item) => {
                    toast.info(`Xem phân tích hiệu quả kênh: ${item.channelName}`)
                  }}
                  onTipClick={(tip) => {
                    toast.info(`Gợi ý: ${tip.title}`, {
                      description: tip.subtitle,
                    })
                  }}
                  onViewAllTips={() => {
                    toast.info("Xem toàn bộ danh sách gợi ý tối ưu marketing")
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
          toast.success(`Đã tạo chiến dịch "${camp.title}" thành công!`)
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
