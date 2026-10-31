"use client"

import { useState, useMemo, useEffect } from "react"
import { toast } from "sonner"
import { Plus } from "lucide-react"
import { StayeaAdminHeader } from "@/features/admin-dashboard/components/stayea-admin-header"
import { StayeaAdminSidebar } from "@/features/admin-dashboard/components/stayea-admin-sidebar"
import { StayeaAdminFooter } from "@/features/admin-dashboard/components/stayea-admin-footer"
import type { DealItem } from "./stayea-admin-deals-mock-data"
import { DealsKpiCards } from "./components/deals-kpi-cards"
import { DealsFilterBar } from "./components/deals-filter-bar"
import { DealsDataTable } from "./components/deals-data-table"
import { DealsRightSidebar } from "./components/deals-right-sidebar"
import { CreateDealModal } from "./components/create-deal-modal"
import type { DealModalTab } from "./components/create-deal-modal"
import { stayeaApi } from "@/lib/stayea-api-service"

function mapPromotion(promotion: any): DealItem {
  const start = promotion.startDate ? new Date(promotion.startDate) : null
  const end = promotion.endDate ? new Date(promotion.endDate) : null
  const now = new Date()
  const status: DealItem["status"] = end && end < now
    ? "expired"
    : start && start > now
      ? "upcoming"
      : promotion.isActive ? "active" : "paused"
  const displayDate = (date: Date | null) => date && !Number.isNaN(date.getTime()) ? date.toLocaleDateString("vi-VN") : ""
  const discountValue = Number(promotion.discountValue || 0)
  return {
    id: promotion.id,
    name: promotion.title,
    subtitle: promotion.description || "",
    code: promotion.code,
    type: promotion.discountType === "percentage" ? "Mã giảm giá" : "Giảm giá trực tiếp",
    value: promotion.discountType === "percentage" ? `${discountValue}%` : `${discountValue.toLocaleString("vi-VN")} đ`,
    startDate: displayDate(start),
    endDate: displayDate(end),
    usedCount: Number(promotion.usedCount || 0),
    status,
    image: promotion.imageUrl || "",
    category: promotion.category || "all",
    featured: Boolean(promotion.badge),
    sortOrder: 0,
  }
}

function parsePromotionDate(value: string) {
  const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
  if (!match) return undefined
  const [, day, month, year] = match
  return new Date(Number(year), Number(month) - 1, Number(day)).toISOString()
}

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
  const [deals, setDeals] = useState<DealItem[]>([])
  const [editingDeal, setEditingDeal] = useState<DealItem | null>(null)

  useEffect(() => {
    setIsCreateModalOpen(initialModalOpen)
  }, [initialModalOpen])

  useEffect(() => {
    let isMounted = true
    stayeaApi.getAdminPromotions().then((items) => {
      if (isMounted) setDeals(items.map(mapPromotion))
    })
    return () => { isMounted = false }
  }, [])

  // Filters state
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatusTab, setSelectedStatusTab] = useState("all")

  const activeCount = useMemo(() => deals.filter((d) => d.status === "active").length, [deals])
  const upcomingCount = useMemo(() => deals.filter((d) => d.status === "upcoming").length, [deals])
  const expiredCount = useMemo(() => deals.filter((d) => d.status === "expired").length, [deals])

  const dynamicKpis = useMemo(() => [
    {
      id: "total",
      title: "Tổng chương trình",
      value: String(deals.length),
      change: "0%",
      trend: "up" as const,
      subtext: "dữ liệu thời gian thực",
      icon: "tag" as const,
    },
    {
      id: "active",
      title: "Đang hoạt động",
      value: String(activeCount),
      change: "0%",
      trend: "up" as const,
      subtext: "đang mang lại doanh thu",
      icon: "percent" as const,
    },
    {
      id: "upcoming",
      title: "Sắp diễn ra",
      value: String(upcomingCount),
      change: "0%",
      trend: "up" as const,
      subtext: "đã lên lịch sẵn",
      icon: "clock" as const,
    },
    {
      id: "conversion",
      title: "Tỷ lệ sử dụng",
      value: "—",
      change: "0%",
      trend: "up" as const,
      subtext: "trên tổng số booking",
      icon: "check-circle" as const,
    },
  ], [deals.length, activeCount, upcomingCount])

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

  const handleCreateDeal = async (newDeal: DealItem): Promise<boolean> => {
    const payload = {
      code: newDeal.code,
      title: newDeal.name,
      description: newDeal.subtitle,
      discountType: newDeal.value.endsWith("%") ? "percentage" : "fixed",
      discountValue: Number(newDeal.value.replace(/[^\d.]/g, "")),
      category: newDeal.category === "Tất cả" ? "all" : newDeal.category,
      badge: newDeal.featured ? "Nổi bật" : undefined,
      imageUrl: undefined,
      startDate: parsePromotionDate(newDeal.startDate),
      endDate: parsePromotionDate(newDeal.endDate),
      isActive: newDeal.status === "active" || newDeal.status === "upcoming",
    }
    const saved = editingDeal
      ? await stayeaApi.updateAdminPromotion(editingDeal.id, payload)
      : await stayeaApi.createAdminPromotion(payload)
    if (!saved) {
      toast.error("Không thể lưu chương trình ưu đãi. Vui lòng kiểm tra dữ liệu và thử lại.")
      return false
    }
    if (typeof saved === "object") {
      setDeals((prev) => [mapPromotion(saved), ...prev.filter((deal) => deal.id !== saved.id)])
    } else {
      const items = await stayeaApi.getAdminPromotions()
      setDeals(items.map(mapPromotion))
    }
    setEditingDeal(null)
    toast.success(editingDeal ? "Đã cập nhật chương trình ưu đãi." : "Đã tạo chương trình ưu đãi.")
    return true
  }

  const handleAction = (deal: DealItem, action: "view" | "edit" | "delete") => {
    if (action === "view") {
      toast.info(`Xem chi tiết: ${deal.name}`, {
        description: `Mã: ${deal.code} • Loại: ${deal.type} • Giá trị: ${deal.value}`,
      })
    } else if (action === "edit") {
      setEditingDeal(deal)
      setIsCreateModalOpen(true)
    } else if (action === "delete") {
      void stayeaApi.updateAdminPromotion(deal.id, { isActive: false }).then((saved) => {
        if (!saved) {
          toast.error("Không thể tạm dừng chương trình ưu đãi.")
          return
        }
        setDeals((prev) => prev.map((item) => item.id === deal.id ? { ...item, status: "paused" } : item))
        toast.success(`Đã tạm dừng chương trình: ${deal.name}`)
      })
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

  return (
    <div className="min-h-screen bg-[#f8faf9] flex flex-col font-sans text-slate-800 antialiased selection:bg-emerald-100 selection:text-emerald-900">
      {/* 1. Header */}
      <StayeaAdminHeader
        onNavigateLanding={onNavigateLanding}
        onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        onSearch={(query) => setSearchQuery(query)}
      />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex overflow-hidden min-w-0">
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
        <main className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden px-4 sm:px-6 lg:px-8 py-6 space-y-6">
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
          <DealsKpiCards stats={dynamicKpis} />

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
                deals={deals}
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
        onClose={() => {
          setIsCreateModalOpen(false)
          setEditingDeal(null)
        }}
        onSubmit={handleCreateDeal}
        initialTab={initialTab}
        initialDeal={editingDeal}
      />
    </div>
  )
}
