"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Plus } from "lucide-react"
import { StayeaAdminHeader } from "@/features/admin-dashboard/components/stayea-admin-header"
import { StayeaAdminSidebar } from "@/features/admin-dashboard/components/stayea-admin-sidebar"
import { StayeaAdminFooter } from "@/features/admin-dashboard/components/stayea-admin-footer"
import { PropertiesKpiCards } from "./components/properties-kpi-cards"
import { PropertiesFilterBar } from "./components/properties-filter-bar"
import { PropertiesDataTable } from "./components/properties-data-table"
import { PropertiesRightSidebar } from "./components/properties-right-sidebar"

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

  const handleCreateProperty = () => {
    toast.info("Thêm bất động sản mới", {
      description: "Mở biểu mẫu đăng ký villa, căn hộ hoặc homestay mới vào hệ thống.",
    })
  }

  return (
    <div className="min-h-screen bg-[#f8faf9] flex flex-col font-sans text-slate-800 antialiased selection:bg-emerald-100 selection:text-emerald-900">
      {/* 1. Header (Sticky Top) */}
      <StayeaAdminHeader
        onNavigateLanding={onNavigateLanding}
        onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        onSearch={(query) => {
          if (query.trim()) {
            console.log("Tìm kiếm bất động sản:", query)
          }
        }}
      />

      {/* 2. Main Body with Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden min-w-0">
        {/* Left Sidebar */}
        <div className={`${sidebarOpen ? "block" : "hidden"} lg:block`}>
          <StayeaAdminSidebar
            activeTab="bat-dong-san"
            promoTitle="Phú Quốc"
            promoSubtitle="Cơ hội đầu tư cùng Stayea"
            promoButtonText="Tìm hiểu ngay"
            onSelectTab={(tabId) => {
              if (onNavigateTab) {
                onNavigateTab(tabId)
              } else if (tabId === "tong-quan") {
                window.location.hash = "admin"
              } else if (tabId === "dat-phong") {
                window.location.hash = "admin-bookings"
              } else {
                toast.info(`Điều hướng đến mục "${tabId}"`, {
                  description: "Hiển thị dữ liệu quản lý tương ứng.",
                })
              }
            }}
            onExplorePhuQuoc={() => {
              toast.info("Đầu tư cùng Stayea tại Phú Quốc", {
                description: "Chương trình liên kết khai thác bất động sản và nhượng quyền Stayea.",
              })
            }}
          />
        </div>

        {/* Scrollable Content Container */}
        <main className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden">
          <div className="max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
            {/* Top Action & Greeting Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
              {/* Title & Subtitle */}
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  Bất động sản
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                  Quản lý danh mục villa, căn hộ, homestay, khách sạn... trên Stayea
                </p>
              </div>

              {/* Right Action: Button + Thêm bất động sản */}
              <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={handleCreateProperty}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#1b7a4e] hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs sm:text-sm font-semibold shadow-xs transition-all"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>Thêm bất động sản</span>
                </button>
              </div>
            </div>

            {/* Main Content Grid: 8 cols left, 4 cols right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column (8 cols) */}
              <div className="lg:col-span-8 space-y-6">
                {/* 4 KPI Cards */}
                <PropertiesKpiCards />

                {/* Filter and View Bar */}
                <PropertiesFilterBar
                  viewMode={viewMode}
                  onViewModeChange={(mode) => setViewMode(mode)}
                  onAdvancedFilter={() => {
                    toast.info("Bộ lọc nâng cao", {
                      description: "Lọc theo khoảng giá, số lượng phòng ngủ và tiện ích.",
                    })
                  }}
                  onSearchChange={(q) => {
                    if (q) console.log("Lọc theo:", q)
                  }}
                />

                {/* Properties Data Table */}
                <PropertiesDataTable
                  onPropertyAction={(action, prop) => {
                    if (action === "view") {
                      toast.info(`Xem chi tiết: ${prop.name}`, {
                        description: `Vị trí: ${prop.location} - Giá: ${prop.priceFrom}`,
                      })
                    } else if (action === "edit") {
                      toast.info(`Chỉnh sửa: ${prop.name}`, {
                        description: "Mở giao diện cập nhật tiện nghi và hình ảnh.",
                      })
                    } else if (action === "toggle-status") {
                      toast.success(`Đã cập nhật trạng thái của ${prop.name}`)
                    } else if (action === "delete") {
                      toast.error(`Yêu cầu gỡ bỏ bất động sản: ${prop.name}`)
                    }
                  }}
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
                      handleCreateProperty()
                    } else if (actionId === "import-excel") {
                      toast.success("Nhập danh sách từ Excel", {
                        description: "Tải lên tệp Excel/CSV chứa danh mục bất động sản.",
                      })
                    } else if (actionId === "amenities") {
                      toast.info("Quản lý tiện ích & dịch vụ", {
                        description: "Cấu hình danh mục tiện ích: bể bơi, BBQ, đưa đón sân bay...",
                      })
                    } else if (actionId === "audit") {
                      toast.info("Kiểm duyệt bất động sản", {
                        description: "Danh sách 16 bất động sản đang chờ phê duyệt thông tin.",
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
    </div>
  )
}
