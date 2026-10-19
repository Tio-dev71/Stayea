"use client"

import { useState, useMemo, useEffect } from "react"
import { toast } from "sonner"
import { Plus } from "lucide-react"
import { StayeaAdminHeader } from "@/features/admin-dashboard/components/stayea-admin-header"
import { StayeaAdminSidebar } from "@/features/admin-dashboard/components/stayea-admin-sidebar"
import { StayeaAdminFooter } from "@/features/admin-dashboard/components/stayea-admin-footer"
import {
  MOCK_DEAL_KPIS,
  MOCK_DEALS,
} from "./stayea-admin-deals-mock-data"
import type { DealItem } from "./stayea-admin-deals-mock-data"
import { DealsKpiCards } from "./components/deals-kpi-cards"
import { DealsFilterBar } from "./components/deals-filter-bar"
import { DealsDataTable } from "./components/deals-data-table"
import { DealsRightSidebar } from "./components/deals-right-sidebar"
import { CreateDealModal } from "./components/create-deal-modal"
import type { DealModalTab } from "./components/create-deal-modal"

interface StayeaAdminDealsPageProps {
  onNavigateLanding?: () => void
  onNavigateTab?: (tabId: string) => void
  initialModalOpen?: boolean
  initialTab?: DealModalTab
}

export function StayeaAdminDealsPage({
  onNavigateLanding,
  onNavigateTab,
  initialModalOpen = false,
  initialTab = "basic",
}: StayeaAdminDealsPageProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(initialModalOpen)
  const [deals, setDeals] = useState<DealItem[]>(MOCK_DEALS)

  useEffect(() => {
    setIsCreateModalOpen(initialModalOpen)
  }, [initialModalOpen])

  // Filters state
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatusTab, setSelectedStatusTab] = useState("all")

  // Filtered deals
  const filteredDeals = useMemo(() => {
    return deals.filter((item) => {
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchesName = item.name.toLowerCase().includes(q)
        const matchesCode = item.code.toLowerCase().includes(q)
        const matchesType = item.type.toLowerCase().includes(q)
        if (!matchesName && !matchesCode && !matchesType) {
          return false
        }
      }

      // Status tab filter
      if (selectedStatusTab !== "all" && item.status !== selectedStatusTab) {
        return false
      }

      return true
    })
  }, [deals, searchQuery, selectedStatusTab])

  const handleCreateDeal = (newDeal: DealItem) => {
    setDeals((prev) => [newDeal, ...prev])
    toast.success("Tạo chương trình khuyến mãi thành công!", {
      description: `${newDeal.name} (${newDeal.code}) đã được kích hoạt.`,
    })
  }

  const handleAction = (deal: DealItem, action: "view" | "edit" | "delete") => {
    if (action === "view") {
      toast.info(`Xem chi tiết: ${deal.name}`, {
        description: `Mã: ${deal.code} • Loại: ${deal.type} • Giá trị: ${deal.value}`,
      })
    } else if (action === "edit") {
      toast.info(`Chỉnh sửa: ${deal.name}`, {
        description: "Mở biểu mẫu chỉnh sửa chương trình khuyến mãi.",
      })
    } else if (action === "delete") {
      setDeals((prev) => prev.filter((d) => d.id !== deal.id))
      toast.error(`Đã xóa chương trình: "${deal.name}"`)
    }
  }

  const handleQuickAction = (actionId: string) => {
    if (actionId === "coupons") {
      toast.info("Quản lý mã giảm giá", {
        description: "Mở danh sách mã coupon và voucher cá nhân.",
      })
    } else if (actionId === "list") {
      toast.info("Danh sách chương trình", {
        description: `Hiện có ${deals.length} chương trình trong hệ thống.`,
      })
    } else if (actionId === "report") {
      toast.info("Báo cáo hiệu quả khuyến mãi", {
        description: "Tải báo cáo phân tích ROI và tỷ lệ chuyển đổi khuyến mãi.",
      })
    } else if (actionId === "auto_rules") {
      toast.info("Cài đặt ưu đãi tự động", {
        description: "Thiết lập quy tắc áp dụng ưu đãi tự động theo giá trị giỏ hàng.",
      })
    }
  }

  const activeCount = useMemo(() => deals.filter((d) => d.status === "active").length, [deals])
  const upcomingCount = useMemo(() => deals.filter((d) => d.status === "upcoming").length, [deals])
  const expiredCount = useMemo(() => deals.filter((d) => d.status === "expired").length, [deals])

  return (
    <div className="min-h-screen bg-[#f8faf9] flex flex-col font-sans text-slate-800 antialiased selection:bg-emerald-100 selection:text-emerald-900">
      {/* 1. Header */}
      <StayeaAdminHeader
        onNavigateLanding={onNavigateLanding}
        onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        onSearch={(query) => setSearchQuery(query)}
      />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <div className={`${sidebarOpen ? "block" : "hidden"} lg:block`}>
          <StayeaAdminSidebar
            activeTab="uu-dai-khuyen-mai"
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

        {/* Center & Right Scrollable Area */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          {/* Top Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Ưu đãi & Khuyến mãi
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Tạo và quản lý các chương trình ưu đãi, khuyến mãi cho trải nghiệm và tour.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1b7a4e] hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer w-fit"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Tạo chương trình khuyến mãi</span>
            </button>
          </div>

          {/* KPI Cards */}
          <DealsKpiCards stats={MOCK_DEAL_KPIS} />

          {/* Grid Layout: Main Table (8/12) + Right Sidebar (4/12) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left 8 cols: Filter + Table */}
            <div className="lg:col-span-8 space-y-4">
              <DealsFilterBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                activeStatusTab={selectedStatusTab}
                onSelectStatusTab={setSelectedStatusTab}
                onOpenCreateModal={() => setIsCreateModalOpen(true)}
                totalCount={deals.length}
                activeCount={activeCount}
                upcomingCount={upcomingCount}
                expiredCount={expiredCount}
              />

              <DealsDataTable deals={filteredDeals} onAction={handleAction} />
            </div>

            {/* Right 4 cols: Analytics, Top Deals & Quick Actions */}
            <div className="lg:col-span-4">
              <DealsRightSidebar
                onOpenCreateModal={() => setIsCreateModalOpen(true)}
                onQuickAction={handleQuickAction}
              />
            </div>
          </div>

          {/* Footer */}
          <StayeaAdminFooter />
        </main>
      </div>

      {/* Modal tạo khuyến mãi */}
      <CreateDealModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateDeal}
        initialTab={initialTab}
      />
    </div>
  )
}
