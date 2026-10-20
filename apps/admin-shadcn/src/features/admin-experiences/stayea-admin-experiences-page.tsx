"use client"

import { useState, useMemo, useEffect } from "react"
import { toast } from "sonner"
import { Plus } from "lucide-react"
import { StayeaAdminHeader } from "@/features/admin-dashboard/components/stayea-admin-header"
import { StayeaAdminSidebar } from "@/features/admin-dashboard/components/stayea-admin-sidebar"
import { StayeaAdminFooter } from "@/features/admin-dashboard/components/stayea-admin-footer"
import { MOCK_EXPERIENCES } from "./stayea-admin-experiences-mock-data"
import type { ExperienceItem } from "./stayea-admin-experiences-mock-data"
import { ExperiencesKpiCards } from "./components/experiences-kpi-cards"
import { ExperiencesFilterBar } from "./components/experiences-filter-bar"
import { ExperiencesDataTable } from "./components/experiences-data-table"
import { ExperiencesRightSidebar } from "./components/experiences-right-sidebar"
import { CreateExperienceModal } from "./components/create-experience-modal"
import type { ExperienceModalTab } from "./components/create-experience-modal"
import { StayeaAdminExperienceReportPage } from "./stayea-admin-experience-report-page"
import { ExperienceReportCategoryTabs } from "./components/experience-report-category-tabs"

interface StayeaAdminExperiencesPageProps {
  onNavigateLanding?: () => void
  onNavigateTab?: (tabId: string) => void
  initialModalOpen?: boolean
  initialTab?: ExperienceModalTab
  initialAddDayOpen?: boolean
  initialCategoryTab?: string
}

export function StayeaAdminExperiencesPage({
  onNavigateLanding,
  onNavigateTab,
  initialModalOpen = false,
  initialTab = "basic",
  initialAddDayOpen = false,
  initialCategoryTab = "tong-quan",
}: StayeaAdminExperiencesPageProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(initialModalOpen)
  const [experiences, setExperiences] = useState<ExperienceItem[]>(MOCK_EXPERIENCES)
  
  const [categoryTab, setCategoryTab] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash.toLowerCase()
      if (
        hash.includes("danh-sach") ||
        hash.includes("list") ||
        hash.includes("manage") ||
        hash.includes("them") ||
        hash.includes("create") ||
        hash.includes("seo") ||
        hash.includes("media") ||
        hash.includes("pricing") ||
        hash.includes("itinerary")
      ) {
        return "tour-trai-nghiem"
      }
      if (hash.includes("report") || hash.includes("bao-cao") || hash.includes("tong-quan")) {
        return "tong-quan"
      }
    }
    return initialCategoryTab ?? "tong-quan"
  })

  useEffect(() => {
    setIsCreateModalOpen(initialModalOpen)
  }, [initialModalOpen])

  // Filters state
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedLocation, setSelectedLocation] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedProvider, setSelectedProvider] = useState("all")

  // Filtered experiences
  const filteredExperiences = useMemo(() => {
    return experiences.filter((item) => {
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchesName = item.name.toLowerCase().includes(q)
        const matchesLocation = item.location.toLowerCase().includes(q)
        const matchesProvider = item.provider.toLowerCase().includes(q)
        const matchesCategory = item.category.toLowerCase().includes(q)
        if (!matchesName && !matchesLocation && !matchesProvider && !matchesCategory) {
          return false
        }
      }

      // Category filter
      if (selectedCategory !== "all" && !item.category.toLowerCase().includes(selectedCategory.toLowerCase())) {
        return false
      }

      // Location filter
      if (selectedLocation !== "all" && item.location !== selectedLocation) {
        return false
      }

      // Status filter
      if (selectedStatus !== "all" && item.status !== selectedStatus) {
        return false
      }

      // Provider filter
      if (selectedProvider !== "all" && !item.provider.toLowerCase().includes(selectedProvider.toLowerCase())) {
        return false
      }

      return true
    })
  }, [
    experiences,
    searchQuery,
    selectedCategory,
    selectedLocation,
    selectedStatus,
    selectedProvider,
  ])

  const handleCreateExperience = (newExp: ExperienceItem) => {
    setExperiences((prev) => [newExp, ...prev])
    toast.success("Đã thêm trải nghiệm mới thành công!", {
      description: `${newExp.name} đã được thêm vào hệ thống.`,
    })
  }

  const handleItemAction = (item: ExperienceItem, action: string) => {
    if (action === "view") {
      toast.info(`Xem chi tiết: ${item.name}`, {
        description: `Loại hình: ${item.category} • Địa điểm: ${item.location} • Đối tác: ${item.provider}`,
      })
    } else if (action === "edit") {
      toast.info(`Chỉnh sửa: ${item.name}`, {
        description: "Mở biểu mẫu chỉnh sửa thông tin trải nghiệm.",
      })
    } else if (action === "toggle-status") {
      setExperiences((prev) =>
        prev.map((exp) => {
          if (exp.id === item.id) {
            const nextStatus =
              exp.status === "active"
                ? "paused"
                : exp.status === "paused"
                ? "active"
                : "active"
            return { ...exp, status: nextStatus }
          }
          return exp
        })
      )
      toast.success(`Đã cập nhật trạng thái của "${item.name}"`)
    } else if (action === "delete") {
      setExperiences((prev) => prev.filter((exp) => exp.id !== item.id))
      toast.error(`Đã xóa trải nghiệm: "${item.name}"`)
    }
  }

  const handleQuickAction = (actionId: string) => {
    if (actionId === "add_new") {
      setIsCreateModalOpen(true)
    } else if (actionId === "partners") {
      toast.info("Quản lý đối tác cung cấp", {
        description: "Mở danh sách đối tác cung cấp dịch vụ trải nghiệm & tour.",
      })
    } else if (actionId === "categories") {
      toast.info("Quản lý danh mục trải nghiệm", {
        description: "Thiết lập phân loại: Tour biển đảo, Tham quan, Ẩm thực, Thể thao biển...",
      })
    } else if (actionId === "pricing") {
      toast.info("Thiết lập chính sách giá", {
        description: "Cấu hình chiết khấu, giá theo mùa và phí hoa hồng đối tác.",
      })
    } else if (actionId === "export") {
      handleExport()
    }
  }

  const handleExport = () => {
    toast.success("Xuất file danh sách trải nghiệm", {
      description: `Đang tải xuống dữ liệu ${filteredExperiences.length} trải nghiệm định dạng Excel/CSV.`,
    })
  }

  // When tab is "tong-quan" (Overview), render the exact Báo cáo Trải nghiệm & Tour from user design image
  if (categoryTab === "tong-quan") {
    return (
      <StayeaAdminExperienceReportPage
        onNavigateLanding={onNavigateLanding}
        onNavigateTab={onNavigateTab}
        onSwitchCategoryTab={(tab) => {
          setCategoryTab(tab)
          if (tab === "tour-trai-nghiem") {
            window.location.hash = "experiences-list"
          }
        }}
      />
    )
  }

  return (
    <div className="min-h-screen bg-[#f8faf9] flex flex-col font-sans text-slate-800 antialiased selection:bg-emerald-100 selection:text-emerald-900">
      {/* 1. Sticky Top Header */}
      <StayeaAdminHeader
        onNavigateLanding={onNavigateLanding}
        onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        onSearch={(query) => {
          setSearchQuery(query)
        }}
      />

      {/* 2. Main Body with Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden min-w-0">
        {/* Left Sidebar */}
        <div className={`${sidebarOpen ? "block" : "hidden"} lg:block`}>
          <StayeaAdminSidebar
            activeTab="experience"
            promoTitle="Phú Quốc"
            promoSubtitle="Trải nghiệm vạn điều thú vị"
            promoButtonText="Khám phá ngay"
            onSelectTab={(tabId) => {
              if (onNavigateTab) {
                onNavigateTab(tabId)
              } else if (tabId === "tong-quan") {
                window.location.hash = "admin"
              } else if (tabId === "dat-phong") {
                window.location.hash = "admin-bookings"
              } else if (tabId === "bat-dong-san") {
                window.location.hash = "admin-properties"
              } else if (tabId === "khach-hang") {
                window.location.hash = "admin-customers"
              } else if (tabId === "chu-nha-doi-tac") {
                window.location.hash = "admin-hosts"
              } else if (tabId === "trai-nghiem-tour" || tabId === "experience") {
                setCategoryTab("tong-quan")
                window.location.hash = "experiences"
              } else {
                toast.info(`Điều hướng đến mục "${tabId}"`, {
                  description: "Hiển thị dữ liệu quản lý tương ứng.",
                })
              }
            }}
            onExplorePhuQuoc={() => {
              toast.info("Phú Quốc - Trải nghiệm vạn điều thú vị", {
                description: "Khám phá danh sách các hoạt động đặc sắc nhất tại đảo ngọc.",
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
                  Trải nghiệm & Tour
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                  Quản lý các hoạt động trải nghiệm, tour du lịch và đối tác cung cấp dịch vụ trên Stayea.
                </p>
              </div>

              {/* Right Action: Button + Thêm trải nghiệm / Tour */}
              <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#007a48] hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs sm:text-sm font-semibold shadow-xs transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>Thêm trải nghiệm / Tour</span>
                </button>
              </div>
            </div>

            {/* Category tabs to switch between Tổng quan and Tour & Trải nghiệm */}
            <ExperienceReportCategoryTabs
              activeTab={categoryTab}
              setActiveTab={(tab) => {
                setCategoryTab(tab)
                if (tab === "tong-quan") {
                  window.location.hash = "experiences"
                }
              }}
            />

            {/* Main Content Grid: 8 cols left, 4 cols right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column (8 cols) */}
              <div className="lg:col-span-8 space-y-6">
                {/* 4 KPI Cards */}
                <ExperiencesKpiCards />

                {/* Filter Bar */}
                <ExperiencesFilterBar
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                  selectedLocation={selectedLocation}
                  onLocationChange={setSelectedLocation}
                  selectedStatus={selectedStatus}
                  onStatusChange={setSelectedStatus}
                  selectedProvider={selectedProvider}
                  onProviderChange={setSelectedProvider}
                  onAdvancedFilter={() => {
                    toast.info("Bộ lọc nâng cao", {
                      description: "Lọc theo khoảng giá, đánh giá sao và đối tác xác minh.",
                    })
                  }}
                  onExport={handleExport}
                />

                {/* Experiences Data Table */}
                <ExperiencesDataTable
                  items={filteredExperiences}
                  onItemAction={handleItemAction}
                />
              </div>

              {/* Right Column (4 cols) */}
              <div className="lg:col-span-4">
                <ExperiencesRightSidebar
                  onBannerAction={() => {
                    toast.info("Khám phá trải nghiệm Phú Quốc", {
                      description: "Chương trình tour tuyển chọn từ các đối tác uy tín hàng đầu.",
                    })
                  }}
                  onViewCategoryDetails={() => {
                    toast.info("Chi tiết cơ cấu loại hình", {
                      description: "Xem báo cáo chi tiết về tỷ trọng và doanh thu từng danh mục.",
                    })
                  }}
                  onViewLocationDetails={() => {
                    toast.info("Chi tiết địa điểm trải nghiệm", {
                      description: "Xem thống kê độ phủ tour và hoạt động tại các địa phương.",
                    })
                  }}
                  onQuickAction={handleQuickAction}
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <StayeaAdminFooter />
        </main>
      </div>

      {/* Modal create experience */}
      <CreateExperienceModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateExperience}
        initialTab={initialTab}
        initialAddDayOpen={initialAddDayOpen}
      />
    </div>
  )
}
