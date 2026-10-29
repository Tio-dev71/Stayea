"use client"

import { useState, useEffect, useMemo } from "react"
import { toast } from "sonner"
import { Plus, RefreshCw } from "lucide-react"
import { StayeaAdminHeader } from "@/features/admin-dashboard/components/stayea-admin-header"
import { StayeaAdminSidebar } from "@/features/admin-dashboard/components/stayea-admin-sidebar"
import { StayeaAdminFooter } from "@/features/admin-dashboard/components/stayea-admin-footer"
import { PropertiesKpiCards } from "./components/properties-kpi-cards"
import { PropertiesFilterBar } from "./components/properties-filter-bar"
import { PropertiesDataTable } from "./components/properties-data-table"
import { PropertiesRightSidebar } from "./components/properties-right-sidebar"
import { CreatePropertyModal } from "./components/create-property-modal"
import {
  PROPERTIES_MOCK_LIST,
  type PropertyItem,
  type PropertyKpiItem,
} from "./stayea-admin-properties-mock-data"
import { stayeaApi } from "@/lib/stayea-api-service"
import { exportToCsv } from "@/lib/export-csv"

interface StayeaAdminPropertiesPageProps {
  onNavigateLanding?: () => void
  onNavigateTab?: (tabId: string) => void
}

export function StayeaAdminPropertiesPage({
  onNavigateLanding,
  onNavigateTab,
}: StayeaAdminPropertiesPageProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [viewMode, setViewMode] = useState<"list" | "map">("list")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const [propertiesList, setPropertiesList] = useState<PropertyItem[]>(
    PROPERTIES_MOCK_LIST as PropertyItem[]
  )
  const [isLoading, setIsLoading] = useState(false)

  // Filters
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState("")
  const [selectedArea, setSelectedArea] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("")

  // Fetch real accommodations from database via API
  const fetchAccommodations = async () => {
    setIsLoading(true)
    try {
      const realItems = await stayeaApi.getAccommodations()
      if (Array.isArray(realItems) && realItems.length > 0) {
        const mapped: PropertyItem[] = realItems.map((item: any, idx: number) => {
          let propType: PropertyItem["propertyType"] = "Biệt thự"
          const cat = (item.category || "").toLowerCase()
          if (cat === "apartment" || cat === "căn hộ") propType = "Căn hộ"
          else if (cat === "homestay") propType = "Homestay"
          else if (cat === "resort") propType = "Resort"
          else if (cat === "hotel" || cat === "khách sạn") propType = "Khách sạn"

          const priceNum = Number(item.pricePerNight) || 4500000
          const formattedPrice = new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(priceNum)

          const isPaused = item.status === "inactive" || item.status === "paused"

          return {
            id: item.id || `prop-real-${idx}`,
            name: item.title || "Villa Phú Quốc",
            badge: "verified" as const,
            propertyType: propType,
            location: item.address || "Dương Tơ, Phú Quốc",
            roomsCount: item.bedrooms || 3,
            priceFrom: formattedPrice,
            status: isPaused ? ("paused" as const) : ("active" as const),
            statusLabel: isPaused ? "Tạm dừng" : "Đang hoạt động",
            views: `${(4.5 + (idx % 5) * 1.2).toFixed(1)}K`,
            bookingsCount: 30 + idx * 8,
            imageUrl: item.heroImage || "/stay/tropical-garden.jpg",
          }
        })

        // Prepend real items to list
        setPropertiesList([...mapped, ...(PROPERTIES_MOCK_LIST as PropertyItem[])])
      }
    } catch {
      // Fallback to initial mock list
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAccommodations()
  }, [])

  // Filter properties
  const filteredProperties = useMemo(() => {
    return propertiesList.filter((item) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        const matchName = item.name.toLowerCase().includes(q)
        const matchLoc = item.location.toLowerCase().includes(q)
        const matchType = item.propertyType.toLowerCase().includes(q)
        if (!matchName && !matchLoc && !matchType) return false
      }

      if (selectedType && item.propertyType !== selectedType) {
        return false
      }

      if (selectedArea && !item.location.toLowerCase().includes(selectedArea.toLowerCase())) {
        return false
      }

      if (selectedStatus && item.status !== selectedStatus) {
        return false
      }

      return true
    })
  }, [propertiesList, searchQuery, selectedType, selectedArea, selectedStatus])

  // Dynamic KPIs
  const dynamicKpis: PropertyKpiItem[] = useMemo(() => {
    const total = propertiesList.length
    const active = propertiesList.filter((p) => p.status === "active").length
    const paused = propertiesList.filter((p) => p.status === "paused").length
    const pending = propertiesList.filter((p) => p.status === "pending").length

    return [
      {
        id: "total-properties",
        title: "Tổng bất động sản",
        value: total.toString(),
        change: "+12%",
        comparisonText: "so với tháng trước",
        isPositive: true,
        iconType: "total",
      },
      {
        id: "active-properties",
        title: "Đang hoạt động",
        value: active.toString(),
        change: "+8%",
        comparisonText: "sẵn sàng đón khách",
        isPositive: true,
        iconType: "active",
      },
      {
        id: "paused-properties",
        title: "Tạm dừng",
        value: paused.toString(),
        change: "-2%",
        comparisonText: "bảo dưỡng & nâng cấp",
        isPositive: false,
        iconType: "paused",
      },
      {
        id: "pending-properties",
        title: "Cần kiểm duyệt",
        value: pending.toString(),
        change: "+5",
        comparisonText: "hồ sơ chủ nhà mới",
        isPositive: true,
        iconType: "pending",
      },
    ]
  }, [propertiesList])

  // Handle Property Action
  const handlePropertyAction = async (action: string, prop: PropertyItem) => {
    if (action === "view") {
      toast.info(`Chi tiết bất động sản: ${prop.name}`, {
        description: `Loại hình: ${prop.propertyType} | Vị trí: ${prop.location} | Giá: ${prop.priceFrom}`,
      })
    } else if (action === "edit") {
      toast.info(`Chỉnh sửa: ${prop.name}`, {
        description: "Giao diện cập nhật thông tin phòng, tiện nghi và hình ảnh.",
      })
    } else if (action === "toggle-status") {
      const nextStatus = prop.status === "active" ? "paused" : "active"
      const nextLabel = nextStatus === "active" ? "Đang hoạt động" : "Tạm dừng"
      setPropertiesList((prev) =>
        prev.map((p) =>
          p.id === prop.id ? { ...p, status: nextStatus, statusLabel: nextLabel } : p
        )
      )
      toast.success(`Đã cập nhật trạng thái: ${nextLabel}`, {
        description: `${prop.name} hiện đang ở trạng thái ${nextLabel}.`,
      })
    } else if (action === "delete") {
      try {
        await stayeaApi.deleteAccommodation(prop.id)
        setPropertiesList((prev) => prev.filter((p) => p.id !== prop.id))
        toast.success(`Đã xóa bất động sản "${prop.name}" thành công!`)
      } catch {
        setPropertiesList((prev) => prev.filter((p) => p.id !== prop.id))
        toast.success(`Đã xóa bất động sản "${prop.name}" khỏi danh sách.`)
      }
    }
  }

  // Handle Export CSV
  const handleExportCsv = () => {
    if (filteredProperties.length === 0) {
      toast.error("Không có bất động sản nào để xuất.")
      return
    }

    const exportRows = filteredProperties.map((p) => ({
      "Mã BĐS": p.id,
      "Tên bất động sản": p.name,
      "Loại hình": p.propertyType,
      "Địa điểm": p.location,
      "Số phòng ngủ": p.roomsCount,
      "Giá từ": p.priceFrom,
      "Trạng thái": p.statusLabel,
      "Lượt xem": p.views,
      "Số lượt đặt": p.bookingsCount,
    }))

    exportToCsv(exportRows, `stayea-danh-sach-bat-dong-san-${new Date().toISOString().slice(0, 10)}`)
    toast.success("Xuất danh sách bất động sản thành công!", {
      description: `Đã tải xuống ${exportRows.length} bất động sản dạng Excel UTF-8.`,
    })
  }

  return (
    <div className="min-h-screen bg-[#f8faf9] flex flex-col font-sans text-slate-800 antialiased selection:bg-emerald-100 selection:text-emerald-900">
      {/* 1. Header (Sticky Top) */}
      <StayeaAdminHeader
        onNavigateLanding={onNavigateLanding}
        onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        onSearch={(query) => setSearchQuery(query)}
      />

      {/* 2. Main Body with Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden min-w-0">
        {/* Left Sidebar */}
        <div className={`${sidebarOpen ? "block" : "hidden"} lg:block`}>
          <StayeaAdminSidebar
            activeTab="bat-dong-san"
            onSelectTab={onNavigateTab}
          />
        </div>

        {/* Scrollable Content Container */}
        <main className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden">
          <div className="max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
            {/* Top Action & Greeting Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  Bất động sản
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                  Quản lý danh mục villa, căn hộ, homestay, khách sạn... trên nền tảng STAYEA Phú Quốc
                </p>
              </div>

              {/* Right Action: Refresh + Thêm bất động sản */}
              <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={fetchAccommodations}
                  disabled={isLoading}
                  title="Làm mới dữ liệu từ máy chủ"
                  className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 shadow-xs transition-all disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-emerald-600" : ""}`} />
                </button>

                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#1b7a4e] hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs sm:text-sm font-semibold shadow-xs transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>Thêm bất động sản</span>
                </button>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column (8 cols) */}
              <div className="lg:col-span-8 space-y-6">
                {/* 4 KPI Cards */}
                <PropertiesKpiCards kpiData={dynamicKpis} />

                {/* Filter and View Bar */}
                <PropertiesFilterBar
                  viewMode={viewMode}
                  onViewModeChange={(mode) => setViewMode(mode)}
                  searchQuery={searchQuery}
                  onSearchChange={(q) => setSearchQuery(q)}
                  selectedType={selectedType}
                  onTypeChange={(t) => setSelectedType(t)}
                  selectedArea={selectedArea}
                  onAreaChange={(a) => setSelectedArea(a)}
                  selectedStatus={selectedStatus}
                  onStatusChange={(s) => setSelectedStatus(s)}
                  onAdvancedFilter={() => {
                    toast.info("Bộ lọc nâng cao", {
                      description: "Lọc theo khoảng giá, số lượng phòng ngủ và tiện ích.",
                    })
                  }}
                  onExport={handleExportCsv}
                />

                {/* Properties Data Table */}
                <PropertiesDataTable
                  properties={filteredProperties}
                  onPropertyAction={handlePropertyAction}
                />
              </div>

              {/* Right Column (4 cols) */}
              <div className="lg:col-span-4">
                <PropertiesRightSidebar
                  onBannerAction={() => {
                    toast.info("Cổng tiếp thị chủ nhà", {
                      description: "Hướng dẫn tối ưu hóa hình ảnh và đăng bài tiếp cận triệu khách.",
                    })
                  }}
                  onViewAreaDetails={() => {
                    toast.info("Bản đồ mật độ bất động sản", {
                      description: "Xem chi tiết phân bố theo các phường xã tại Phú Quốc.",
                    })
                  }}
                  onViewTypeDetails={() => {
                    toast.info("Phân tích cơ cấu loại hình", {
                      description: "Xem tỷ trọng doanh thu giữa Biệt thự, Căn hộ và Homestay.",
                    })
                  }}
                  onQuickAction={(actionId) => {
                    if (actionId === "create") {
                      setIsCreateModalOpen(true)
                    } else if (actionId === "import-excel") {
                      handleExportCsv()
                    } else if (actionId === "amenities") {
                      toast.info("Quản lý tiện ích & dịch vụ", {
                        description: "Cấu hình danh mục tiện ích: bể bơi, BBQ, đưa đón sân bay...",
                      })
                    } else if (actionId === "audit") {
                      toast.info("Kiểm duyệt bất động sản", {
                        description: "Danh sách bất động sản đang chờ phê duyệt thông tin.",
                      })
                    }
                  }}
                />
              </div>
            </div>

            {/* Footer */}
            <StayeaAdminFooter />
          </div>
        </main>
      </div>

      {/* 3. Create Property Modal */}
      <CreatePropertyModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmitSuccess={(newAccom) => {
          setIsCreateModalOpen(false)
          const newPropItem: PropertyItem = {
            id: newAccom.id || `prop-${Date.now()}`,
            name: newAccom.title || "Villa mới",
            badge: "verified",
            propertyType:
              newAccom.category === "apartment"
                ? "Căn hộ"
                : newAccom.category === "homestay"
                ? "Homestay"
                : "Biệt thự",
            location: newAccom.address || "Phú Quốc",
            roomsCount: newAccom.bedrooms || 3,
            priceFrom: new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(Number(newAccom.pricePerNight) || 4000000),
            status: "active",
            statusLabel: "Đang hoạt động",
            views: "1.0K",
            bookingsCount: 0,
            imageUrl: newAccom.heroImage || "/stay/tropical-garden.jpg",
          }
          setPropertiesList((prev) => [newPropItem, ...prev])
        }}
      />
    </div>
  )
}
