"use client"

import { useState } from "react"
import { toast } from "sonner"
import { StayeaAdminHeader } from "@/features/admin-dashboard/components/stayea-admin-header"
import { StayeaAdminSidebar } from "@/features/admin-dashboard/components/stayea-admin-sidebar"
import { StayeaAdminFooter } from "@/features/admin-dashboard/components/stayea-admin-footer"
import { ExperienceReportHeader } from "./components/experience-report-header"
import { ExperienceReportCategoryTabs } from "./components/experience-report-category-tabs"
import { ExperienceReportKpiCards } from "./components/experience-report-kpi-cards"
import { ExperienceReportCharts } from "./components/experience-report-charts"
import { ExperienceReportTopToursTable } from "./components/experience-report-top-tours-table"
import { ExperienceReportRightSidebar } from "./components/experience-report-right-sidebar"
import { CreateExperienceModal } from "./components/create-experience-modal"
import {
  MOCK_EXPERIENCE_REPORT_KPIS,
  MOCK_EXPERIENCE_TIMELINE,
  MOCK_EXPERIENCE_CATEGORIES_DONUT,
  MOCK_EXPERIENCE_CHANNEL_REVENUES,
  MOCK_TOP_SELLING_TOURS,
  MOCK_TOP_DESTINATIONS_SIDEBAR,
  MOCK_HIGHLIGHT_EXPERIENCES_SIDEBAR,
  MOCK_EXPERIENCE_QUICK_ACTIONS_SIDEBAR,
} from "./stayea-admin-experience-report-mock-data"
import type { TopSellingTourRow } from "./stayea-admin-experience-report-mock-data"

interface StayeaAdminExperienceReportPageProps {
  onNavigateTab?: (tabId: string) => void
  onNavigateLanding?: () => void
  onSwitchCategoryTab?: (tabId: string) => void
}

export function StayeaAdminExperienceReportPage({
  onNavigateTab,
  onNavigateLanding,
  onSwitchCategoryTab,
}: StayeaAdminExperienceReportPageProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeCategoryTab, setActiveCategoryTab] = useState("tong-quan")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const handleTourAction = (item: TopSellingTourRow) => {
    toast.info(`Thao tác cho tour "${item.title}"`, {
      description: `Điểm đến: ${item.destination} | Lượt đặt: ${item.bookingsCount} | Doanh thu: ${item.revenueFormatted}`,
    })
  }

  const handleQuickAction = (key: string) => {
    switch (key) {
      case "create-experience":
        setIsCreateModalOpen(true)
        break
      case "manage-experiences":
        if (onSwitchCategoryTab) {
          onSwitchCategoryTab("tour-trai-nghiem")
        } else {
          setActiveCategoryTab("tour-trai-nghiem")
        }
        break
      case "update-schedule":
        toast.info("Mở lịch trình và quản lý thời gian khởi hành")
        break
      case "view-reviews":
        toast.info("Chuyển tới trung tâm đánh giá trải nghiệm & tour")
        break
      case "export-report":
        toast.success("Đang xuất dữ liệu Báo cáo Trải nghiệm & Tour (.XLSX)")
        break
      default:
        toast.info(`Thao tác: ${key}`)
    }
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
              description: "Đang tra cứu dữ liệu tour và trải nghiệm...",
            })
          }
        }}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* 2. Responsive Sidebar Drawer (Highlights 'Trải nghiệm & Tour' with green pill as in design) */}
        <div
          className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-white transition-transform duration-200 ease-in-out md:static md:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <StayeaAdminSidebar
            activeTab="trai-nghiem-tour"
            promoTitle="Phú Quốc"
            promoSubtitle="Trải nghiệm vạn điều thú vị"
            promoButtonText="Khám phá ngay"
            onSelectTab={(tabId) => {
              if (tabId === "trai-nghiem-tour" || tabId === "experience") {
                setActiveCategoryTab("tong-quan")
              } else if (onNavigateTab) {
                onNavigateTab(tabId)
              }
            }}
          />
        </div>

        {/* 3. Main Content: Báo cáo Trải nghiệm & Tour */}
        <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-5 overflow-y-auto">
          <div className="max-w-[1536px] mx-auto space-y-5">
            {/* Header: Title + Date Filter + Compare Dropdown + Export Button */}
            <ExperienceReportHeader
              onDateRangeChange={(range) => {
                toast.info(`Đã chọn kỳ báo cáo: ${range}`)
              }}
              onComparisonChange={(period) => {
                toast.info(`Đã đổi mốc so sánh: ${period}`)
              }}
              onExportReport={() => {
                toast.success("Xuất báo cáo Trải nghiệm & Tour thành công!", {
                  description: "Đã tạo file dữ liệu Excel (.XLSX) cho giai đoạn 01/06/2024 - 31/08/2024.",
                })
              }}
            />

            {/* 5 KPI Cards */}
            <ExperienceReportKpiCards
              items={MOCK_EXPERIENCE_REPORT_KPIS}
              onKpiClick={(kpiId) => {
                toast.info(`Xem chi tiết chỉ số: ${kpiId}`)
              }}
            />

            {/* Category Tabs: Tổng quan (active) | Tour & Trải nghiệm | Điểm đến | Khách hàng | ... */}
            <ExperienceReportCategoryTabs
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
                {/* 4 Charts Grid (2x2) */}
                <ExperienceReportCharts
                  timeline={MOCK_EXPERIENCE_TIMELINE}
                  categoriesDonut={MOCK_EXPERIENCE_CATEGORIES_DONUT}
                  channelRevenues={MOCK_EXPERIENCE_CHANNEL_REVENUES}
                  onViewChannelDetail={() =>
                    toast.info("Xem chi tiết doanh thu tour theo từng kênh phân phối")
                  }
                />

                {/* Table: Top tour & trải nghiệm bán chạy */}
                <ExperienceReportTopToursTable
                  tours={MOCK_TOP_SELLING_TOURS}
                  onTourAction={handleTourAction}
                  onViewAll={() => toast.info("Xem toàn bộ danh sách tour & trải nghiệm")}
                />
              </div>

              {/* Right Sidebar Column (~27% on xl screens) */}
              <div className="xl:col-span-3">
                <ExperienceReportRightSidebar
                  topDestinations={MOCK_TOP_DESTINATIONS_SIDEBAR}
                  highlightExperiences={MOCK_HIGHLIGHT_EXPERIENCES_SIDEBAR}
                  quickActions={MOCK_EXPERIENCE_QUICK_ACTIONS_SIDEBAR}
                  onActionClick={handleQuickAction}
                  onViewAllDestinations={() =>
                    toast.info("Xem tất cả điểm đến du lịch phổ biến")
                  }
                  onViewAllExperiences={() =>
                    toast.info("Xem danh sách trải nghiệm nổi bật")
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
      <CreateExperienceModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={(tour) => {
          setIsCreateModalOpen(false)
          toast.success(`Đã tạo tour mới "${tour.name}" thành công!`)
        }}
      />
    </div>
  )
}
