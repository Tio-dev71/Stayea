"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Plus } from "lucide-react"
import { StayeaAdminHeader } from "@/features/admin-dashboard/components/stayea-admin-header"
import { StayeaAdminSidebar } from "@/features/admin-dashboard/components/stayea-admin-sidebar"
import { StayeaAdminFooter } from "@/features/admin-dashboard/components/stayea-admin-footer"
import { CustomersKpiCards } from "./components/customers-kpi-cards"
import { CustomersFilterBar } from "./components/customers-filter-bar"
import { CustomersDataTable } from "./components/customers-data-table"
import { CustomersRightSidebar } from "./components/customers-right-sidebar"

interface StayeaAdminCustomersPageProps {
  onNavigateLanding?: () => void
  onNavigateTab?: (tabId: string) => void
}

export function StayeaAdminCustomersPage({
  onNavigateLanding,
  onNavigateTab,
}: StayeaAdminCustomersPageProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeSegmentTab, setActiveSegmentTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  const handleAddCustomer = () => {
    toast.info("Thêm khách hàng mới", {
      description: "Mở biểu mẫu tạo hồ sơ khách hàng và lưu trữ thông tin liên hệ.",
    })
  }

  const handleAdvancedFilter = () => {
    toast.info("Bộ lọc nâng cao", {
      description: "Lọc nâng cao theo doanh thu, số đêm lưu trú và phân khúc khách hàng.",
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
            console.log("Tìm kiếm khách hàng:", query)
          }
        }}
      />

      {/* 2. Main Body with Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <div className={`${sidebarOpen ? "block" : "hidden"} lg:block`}>
          <StayeaAdminSidebar
            activeTab="khach-hang"
            onSelectTab={(tabId) => {
              if (onNavigateTab) {
                onNavigateTab(tabId)
              } else if (tabId === "tong-quan") {
                window.location.hash = "admin"
              } else if (tabId === "dat-phong") {
                window.location.hash = "admin-bookings"
              } else if (tabId === "bat-dong-san") {
                window.location.hash = "properties"
              } else if (tabId === "chu-nha-doi-tac" || tabId === "hosts") {
                window.location.hash = "hosts"
              } else {
                toast.info(`Điều hướng đến mục "${tabId}"`, {
                  description: "Hiển thị dữ liệu quản lý tương ứng.",
                })
              }
            }}
            onExplorePhuQuoc={() => {
              toast.info("Khám phá Phú Quốc", {
                description: "Chuyển tới cổng thông tin du lịch và trải nghiệm đảo ngọc.",
              })
            }}
          />
        </div>

        {/* Scrollable Content Container */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
            {/* Top Action & Greeting Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
              {/* Title & Subtitle */}
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  Khách hàng
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                  Quản lý thông tin khách hàng, lịch sử đặt phòng và chăm sóc khách hàng.
                </p>
              </div>

              {/* Right Controls: Add Customer Button */}
              <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={handleAddCustomer}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1b7a4e] hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs sm:text-sm font-semibold shadow-xs transition-all"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>Thêm khách hàng</span>
                </button>
              </div>
            </div>

            {/* Main Content Grid: 8 cols left, 4 cols right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column (8 cols) */}
              <div className="lg:col-span-8 space-y-6">
                {/* 4 KPI Cards */}
                <CustomersKpiCards />

                {/* Filter and Segment Bar */}
                <CustomersFilterBar
                  activeSegment={activeSegmentTab}
                  onSegmentChange={setActiveSegmentTab}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  onAdvancedFilter={handleAdvancedFilter}
                />

                {/* Customers Data Table */}
                <CustomersDataTable
                  onCustomerAction={(action, customer) => {
                    if (action === "view") {
                      toast.info(`Xem hồ sơ khách hàng: ${customer.name}`, {
                        description: `SĐT: ${customer.phoneNumber} • Tổng chi: ${customer.totalSpent}`,
                      })
                    } else if (action === "message") {
                      toast.info(`Soạn tin nhắn gửi ${customer.name}`, {
                        description: `Gửi đến: ${customer.email}`,
                      })
                    } else if (action === "edit") {
                      toast.info(`Chỉnh sửa thông tin: ${customer.name}`)
                    } else if (action === "suspend") {
                      toast.warning(`Tạm khóa tài khoản: ${customer.name}`)
                    }
                  }}
                />
              </div>

              {/* Right Column (4 cols) */}
              <div className="lg:col-span-4">
                <CustomersRightSidebar
                  onBannerAction={() => {
                    toast.info("Hành trình khách hàng hạnh phúc", {
                      description: "Quy chuẩn dịch vụ 5 sao nâng tầm trải nghiệm lưu trú.",
                    })
                  }}
                  onViewNationalityDetails={() => {
                    toast.info("Chi tiết cơ cấu quốc tịch", {
                      description: "Thống kê phân bổ nguồn khách nội địa & quốc tế tại Phú Quốc.",
                    })
                  }}
                  onViewAllRecentCustomers={() => {
                    toast.info("Toàn bộ khách hàng mới gần đây", {
                      description: "Danh sách 50 khách hàng đăng ký và đặt phòng mới nhất.",
                    })
                  }}
                  onQuickAction={(actionId) => {
                    switch (actionId) {
                      case "add-customer":
                        handleAddCustomer()
                        break
                      case "import-excel":
                        toast.info("Nhập danh sách từ Excel", {
                          description: "Tải lên tệp .xlsx hoặc .csv để nhập hàng loạt dữ liệu khách hàng.",
                        })
                        break
                      case "bulk-messages":
                        toast.info("Gửi email/SMS hàng loạt", {
                          description: "Chiến dịch gửi thông báo ưu đãi và chúc mừng tới tệp khách hàng.",
                        })
                        break
                      case "loyalty-program":
                        toast.info("Tạo chương trình khách hàng thân thiết", {
                          description: "Thiết lập bậc hạng thành viên Stayea Club và tích lũy dặm thưởng.",
                        })
                        break
                      case "segmentation":
                        toast.info("Phân nhóm khách hàng", {
                          description: "Tạo nhóm khách hàng VIP, khách doanh nghiệp và khách quốc tế.",
                        })
                        break
                      default:
                        if (actionId.startsWith("view-recent-")) {
                          toast.info("Tùy chọn khách hàng", {
                            description: "Xem hồ sơ hoặc liên hệ trực tiếp.",
                          })
                        }
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
