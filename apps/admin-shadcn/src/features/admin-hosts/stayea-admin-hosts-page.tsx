"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Plus } from "lucide-react"
import { StayeaAdminHeader } from "@/features/admin-dashboard/components/stayea-admin-header"
import { StayeaAdminSidebar } from "@/features/admin-dashboard/components/stayea-admin-sidebar"
import { StayeaAdminFooter } from "@/features/admin-dashboard/components/stayea-admin-footer"
import { HostsKpiCards } from "./components/hosts-kpi-cards"
import { HostsFilterBar } from "./components/hosts-filter-bar"
import { HostsDataTable } from "./components/hosts-data-table"
import { HostsRightSidebar } from "./components/hosts-right-sidebar"
import { CreateHostModal } from "./components/create-host-modal"

import type { ModalSubTab } from "./components/create-host-modal"

interface StayeaAdminHostsPageProps {
  onNavigateLanding?: () => void
  onNavigateTab?: (tabId: string) => void
  initialModalOpen?: boolean
  initialModalTab?: ModalSubTab
}

export function StayeaAdminHostsPage({
  onNavigateLanding,
  onNavigateTab,
  initialModalOpen = false,
  initialModalTab = "basic",
}: StayeaAdminHostsPageProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeSegment, setActiveSegment] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(initialModalOpen)

  const handleAddHost = () => {
    setIsCreateModalOpen(true)
  }

  const handleAdvancedFilter = () => {
    toast.info("Bộ lọc nâng cao", {
      description: "Lọc nâng cao theo số lượng phòng, doanh thu luỹ kế và tỷ lệ hoa hồng.",
    })
  }

  const handleExport = () => {
    toast.success("Xuất danh sách đối tác", {
      description: "Đang tải xuống tệp danh sách 428 chủ nhà và đối tác (định dạng Excel .xlsx).",
    })
  }

  return (
    <div className="min-h-screen bg-[#f8faf9] flex flex-col font-sans text-slate-800 antialiased selection:bg-emerald-100 selection:text-emerald-900">
      {/* 1. Header (Sticky Top) */}
      <StayeaAdminHeader
        onNavigateLanding={onNavigateLanding}
        onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        onSearch={(query) => {
          setSearchQuery(query)
          if (query.trim()) {
            console.log("Tìm kiếm chủ nhà/đối tác:", query)
          }
        }}
      />

      {/* 2. Main Body with Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden min-w-0">
        {/* Left Sidebar */}
        <div className={`${sidebarOpen ? "block" : "hidden"} lg:block`}>
          <StayeaAdminSidebar
            activeTab="chu-nha-doi-tac"
            promoTitle="Phú Quốc"
            promoSubtitle="Cơ hội hợp tác cùng Stayea"
            promoButtonText="Trở thành đối tác"
            onSelectTab={(tabId) => {
              if (onNavigateTab) {
                onNavigateTab(tabId)
              } else if (tabId === "tong-quan") {
                window.location.hash = "admin"
              } else if (tabId === "dat-phong") {
                window.location.hash = "admin-bookings"
              } else if (tabId === "bat-dong-san") {
                window.location.hash = "properties"
              } else if (tabId === "khach-hang") {
                window.location.hash = "customers"
              } else {
                toast.info(`Điều hướng đến mục "${tabId}"`, {
                  description: "Hiển thị dữ liệu quản lý tương ứng.",
                })
              }
            }}
            onExplorePhuQuoc={() => {
              toast.info("Khám phá cơ hội hợp tác Phú Quốc", {
                description: "Chuyển tới cổng thông tin đối tác và ký gửi bất động sản du lịch.",
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
                  Chủ nhà/Đối tác
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                  Quản lý chủ nhà, đối tác, hoa hồng và hiệu suất hợp tác trên Stayea.
                </p>
              </div>

              {/* Right Controls: Add Host Button */}
              <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={handleAddHost}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1b7a4e] hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs sm:text-sm font-semibold shadow-xs transition-all"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>Thêm chủ nhà/Đối tác</span>
                </button>
              </div>
            </div>

            {/* Main Content Grid: 8 cols left, 4 cols right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column (8 cols) */}
              <div className="lg:col-span-8 space-y-6">
                {/* 4 KPI Cards */}
                <HostsKpiCards />

                {/* Filter and Segment Bar */}
                <HostsFilterBar
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  activeSegment={activeSegment}
                  onSegmentChange={setActiveSegment}
                  onAdvancedFilter={handleAdvancedFilter}
                  onExport={handleExport}
                />

                {/* Hosts Data Table */}
                <HostsDataTable
                  onHostAction={(action, host) => {
                    if (action === "view") {
                      toast.info(`Xem hồ sơ đối tác: ${host.name}`, {
                        description: `Email: ${host.email} • Khu vực: ${host.region} • BĐS: ${host.propertiesCount}`,
                      })
                    } else if (action === "contract") {
                      toast.info(`Hợp đồng hợp tác: ${host.name}`, {
                        description: `Mức hoa hồng hiện hành: ${host.commission}`,
                      })
                    } else if (action === "commission") {
                      toast.info(`Thiết lập hoa hồng: ${host.name}`)
                    } else if (action === "suspend") {
                      toast.warning(`Tạm dừng hợp tác với: ${host.name}`)
                    }
                  }}
                />
              </div>

              {/* Right Column (4 cols) */}
              <div className="lg:col-span-4">
                <HostsRightSidebar
                  onBannerAction={() => {
                    toast.info("Hành trình cùng đối tác Stayea", {
                      description: "Chương trình liên minh chia sẻ lợi nhuận và mở rộng mạng lưới lưu trú.",
                    })
                  }}
                  onViewRegionalDetails={() => {
                    toast.info("Chi tiết hiệu suất theo khu vực", {
                      description: "Thống kê mật độ đối tác tập trung tại Dương Đông, An Thới, Gành Dầu, Cửa Cạn.",
                    })
                  }}
                  onViewAllTopHosts={() => {
                    toast.info("Bảng xếp hạng đối tác xuất sắc", {
                      description: "Danh sách 20 đối tác đạt doanh thu cao nhất năm 2024.",
                    })
                  }}
                  onQuickAction={(actionId) => {
                    switch (actionId) {
                      case "add-host":
                        handleAddHost()
                        break
                      case "invite-partner":
                        toast.info("Gửi lời mời hợp tác", {
                          description: "Gửi thư ngỏ điện tử và bộ tài liệu giới thiệu giải pháp vận hành Stayea.",
                        })
                        break
                      case "manage-contracts":
                        toast.info("Quản lý hợp đồng", {
                          description: "Xem kho lưu trữ hợp đồng điện tử và phụ lục hoa hồng ký gửi.",
                        })
                        break
                      case "set-commission":
                        toast.info("Thiết lập hoa hồng", {
                          description: "Cấu hình khung chia sẻ doanh thu cho từng phân hạng đối tác.",
                        })
                        break
                      case "export-partners":
                        handleExport()
                        break
                      default:
                        break
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

      {/* 3. Modal "+ Thêm chủ nhà/đối tác" */}
      <CreateHostModal
        isOpen={isCreateModalOpen}
        initialTab={initialModalTab}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmitSuccess={(data) => {
          setIsCreateModalOpen(false)
          toast.success("Tạo tài khoản chủ nhà/đối tác thành công!", {
            description: `Hồ sơ ${data.fullName} (${data.partnerType === "management_company" ? "Công ty quản lý" : data.partnerType === "agency" ? "Đối tác đại lý" : "Chủ nhà cá nhân"}) tại ${data.ward}, ${data.district} đã được kích hoạt.`,
          })
        }}
      />
    </div>
  )
}
