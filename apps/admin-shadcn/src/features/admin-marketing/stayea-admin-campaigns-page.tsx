"use client"

import { useState } from "react"
import { toast } from "sonner"
import { StayeaAdminHeader } from "@/features/admin-dashboard/components/stayea-admin-header"
import { StayeaAdminSidebar } from "@/features/admin-dashboard/components/stayea-admin-sidebar"
import { StayeaAdminFooter } from "@/features/admin-dashboard/components/stayea-admin-footer"
import { CampaignsHeader } from "./components/campaigns-header"
import { CampaignsKpiCards } from "./components/campaigns-kpi-cards"
import { CampaignsFilterBar } from "./components/campaigns-filter-bar"
import { CampaignsCharts } from "./components/campaigns-charts"
import { CampaignsTable } from "./components/campaigns-table"
import { CampaignsRightSidebar } from "./components/campaigns-right-sidebar"
import { CreateCampaignModal } from "./components/create-campaign-modal"
import { AdvancedFilterModal } from "./components/advanced-filter-modal"
import { ExportMarketingModal } from "./components/export-marketing-modal"
import type { MarketingCampaignItem } from "./stayea-admin-marketing-mock-data"

interface StayeaAdminCampaignsPageProps {
  onNavigateTab?: (tabId: string) => void
  onNavigateLanding?: () => void
  onSwitchToOverview?: () => void
}

export function StayeaAdminCampaignsPage({
  onNavigateTab,
  onNavigateLanding,
  onSwitchToOverview,
}: StayeaAdminCampaignsPageProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isAdvancedFilterOpen, setIsAdvancedFilterOpen] = useState(false)
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)
  const [initialModalStep, setInitialModalStep] = useState(1)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleCreateCampaign = (newCamp: {
    title: string
    subtitle: string
    channel: string
    channelType: string
    startDate: string
    endDate: string
    budget: number
  }) => {
    toast.success("Tạo chiến dịch mới thành công!", {
      description: `Chiến dịch "${newCamp.title}" trên kênh ${newCamp.channel} đã được kích hoạt.`,
    })
    setIsCreateModalOpen(false)
  }

  const handleCampaignAction = (campaign: MarketingCampaignItem, action: string) => {
    switch (action) {
      case "view":
        toast.info(`Chi tiết chiến dịch "${campaign.title}"`, {
          description: `ROAS: ${campaign.roas} | Tiếp cận: ${campaign.reachFormatted} | Đặt phòng: ${campaign.ordersCount}`,
        })
        break
      case "edit":
        toast.info(`Mở trình chỉnh sửa chiến dịch "${campaign.title}"`)
        setInitialModalStep(1)
        setIsCreateModalOpen(true)
        break
      case "pause":
        toast.warning(`Đã tạm dừng chiến dịch "${campaign.title}"`)
        break
      default:
        toast.info(`Thao tác: ${action} trên chiến dịch ${campaign.title}`)
    }
  }

  const handleExport = (options: {
    format: "xlsx" | "pdf" | "csv"
    timeframe: string
    includeChannels: boolean
  }) => {
    setIsExportModalOpen(false)
    toast.success("Xuất báo cáo chiến dịch thành công!", {
      description: `Đã kết xuất báo cáo định dạng .${options.format.toUpperCase()} cho kỳ ${options.timeframe}.`,
    })
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans antialiased selection:bg-[#007a48]/20 selection:text-[#007a48]">
      {/* 1. Header Admin Stayea */}
      <StayeaAdminHeader
        searchPlaceholder="Tìm kiếm tour, trải nghiệm, địa điểm, đối tác..."
        onNavigateLanding={onNavigateLanding}
        onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        onSearch={(query) => {
          if (query.trim()) {
            toast.info(`Tìm kiếm: "${query}"`, {
              description: "Đang lọc dữ liệu báo cáo chiến dịch...",
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
              if (tabId === "marketing" && onSwitchToOverview) {
                onSwitchToOverview()
              } else if (onNavigateTab) {
                onNavigateTab(tabId)
              }
            }}
          />
        </div>

        {/* 3. Main Content: Báo cáo Chiến dịch Marketing */}
        <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-5">
          <div className="max-w-[1536px] mx-auto space-y-5">
            {/* Header: Tiêu đề + Chọn ngày + Nút "+ Tạo chiến dịch mới" */}
            <CampaignsHeader
              onCreateCampaign={() => {
                setInitialModalStep(1)
                setIsCreateModalOpen(true)
              }}
              onDateRangeChange={(range) => {
                toast.info(`Đã chọn kỳ báo cáo: ${range}`)
              }}
            />

            {/* 4 Thẻ KPI chiến dịch */}
            <CampaignsKpiCards
              onKpiClick={(id) => {
                toast.info(`Chi tiết chỉ số: ${id}`)
              }}
            />

            {/* Thanh bộ lọc (3 dropdowns + 1 date range + 2 action buttons) */}
            <CampaignsFilterBar
              onChannelChange={(ch) => {
                toast.info(ch === "all" ? "Hiển thị tất cả các kênh" : `Lọc theo kênh: ${ch}`)
              }}
              onTypeChange={(tp) => {
                toast.info(tp === "all" ? "Hiển thị tất cả loại chiến dịch" : `Lọc loại: ${tp}`)
              }}
              onStatusChange={(st) => {
                toast.info(st === "all" ? "Tất cả trạng thái" : `Trạng thái: ${st}`)
              }}
              onOpenAdvancedFilter={() => setIsAdvancedFilterOpen(true)}
              onExportReport={() => setIsExportModalOpen(true)}
            />

            {/* 2-Column Responsive Dashboard Layout */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
              {/* Left Main Column (~73% on xl screens) */}
              <div className="xl:col-span-9 space-y-5">
                {/* 4 Charts: Row 1 (Timeline & Donut loại chiến dịch) + Row 2 (Bar Chart đặt phòng theo kênh & Chi phí/ROAS) */}
                <CampaignsCharts
                  onViewChannelDetails={() => {
                    toast.info("Xem chi tiết lượt đặt phòng theo kênh")
                  }}
                  onViewCostRoasDetails={() => {
                    toast.info("Xem phân tích chi tiết Chi phí & ROAS")
                  }}
                />

                {/* Bảng Danh sách chiến dịch (24) */}
                <CampaignsTable
                  onActionClick={handleCampaignAction}
                />
              </div>

              {/* Right Sidebar Column (~27% on xl screens) */}
              <div className="xl:col-span-3">
                <CampaignsRightSidebar
                  onQuickActionClick={(actionKey) => {
                    if (actionKey === "create-campaign") {
                      setInitialModalStep(1)
                      setIsCreateModalOpen(true)
                    } else if (actionKey === "manage-campaigns") {
                      toast.info("Chuyển sang trang quản lý danh sách chiến dịch")
                    } else if (actionKey === "schedule-content") {
                      toast.info("Mở lịch xuất bản nội dung marketing")
                    } else if (actionKey === "settings-target") {
                      toast.info("Mở cài đặt mục tiêu chiến dịch")
                    }
                  }}
                  onExportReport={() => setIsExportModalOpen(true)}
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
      <CreateCampaignModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateCampaign}
        initialStep={initialModalStep}
      />

      <AdvancedFilterModal
        isOpen={isAdvancedFilterOpen}
        onClose={() => setIsAdvancedFilterOpen(false)}
        onApply={() => {
          toast.success("Đã áp dụng bộ lọc nâng cao cho chiến dịch!")
        }}
      />

      <ExportMarketingModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={handleExport}
      />
    </div>
  )
}
