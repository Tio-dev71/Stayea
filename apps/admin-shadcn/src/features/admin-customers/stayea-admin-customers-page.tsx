"use client"

import { useState, useEffect, useMemo } from "react"
import { toast } from "sonner"
import { Plus, RefreshCw } from "lucide-react"
import { StayeaAdminHeader } from "@/features/admin-dashboard/components/stayea-admin-header"
import { StayeaAdminSidebar } from "@/features/admin-dashboard/components/stayea-admin-sidebar"
import { StayeaAdminFooter } from "@/features/admin-dashboard/components/stayea-admin-footer"
import { CustomersKpiCards } from "./components/customers-kpi-cards"
import { CustomersFilterBar } from "./components/customers-filter-bar"
import { CustomersDataTable } from "./components/customers-data-table"
import { CustomersRightSidebar } from "./components/customers-right-sidebar"
import { CreateCustomerModal } from "./components/create-customer-modal"
import {
  type CustomerItem,
  type CustomerKpiItem,
} from "./stayea-admin-customers-mock-data"
import { stayeaApi } from "@/lib/stayea-api-service"
import { exportToCsv } from "@/lib/export-csv"

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
  const [selectedNationality, setSelectedNationality] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const [customersList, setCustomersList] = useState<CustomerItem[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Fetch real users from backend API
  const fetchUsers = async () => {
    setIsLoading(true)
    try {
      const realUsers = await stayeaApi.getUsers()
      if (Array.isArray(realUsers) && realUsers.length > 0) {
        const mapped: CustomerItem[] = realUsers.map((u: any, idx: number) => {
          const roleUpper = (u.role || "USER").toUpperCase()
          const badge = roleUpper === "ADMIN" ? ("vip" as const) : undefined
          const badgeLabel =
            roleUpper === "ADMIN" ? "Quản trị" : roleUpper === "PARTNER" ? "Đối tác" : undefined

          return {
            id: u.id || `user-real-${idx}`,
            name: u.name || u.displayName || u.email.split("@")[0],
            badge,
            badgeLabel,
            avatar: "/about/team-1.jpg",
            nationality: "Việt Nam",
            flag: "🇻🇳",
            phoneNumber: u.phoneNumber || "0908 123 456",
            email: u.email,
            bookingsCount: 0,
            totalSpent: "0 ₫",
            status: "active" as const,
            statusLabel: "Đang hoạt động",
          }
        })

        setCustomersList(mapped)
      } else {
        setCustomersList([])
      }
    } catch {
      setCustomersList([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  // Filter customers
  const filteredCustomers = useMemo(() => {
    return customersList.filter((item) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        const matchName = item.name.toLowerCase().includes(q)
        const matchEmail = item.email.toLowerCase().includes(q)
        const matchPhone = item.phoneNumber.toLowerCase().includes(q)
        if (!matchName && !matchEmail && !matchPhone) return false
      }

      if (selectedNationality && item.nationality !== selectedNationality) {
        return false
      }

      if (selectedStatus && item.status !== selectedStatus) {
        return false
      }

      if (activeSegmentTab !== "all") {
        if (activeSegmentTab === "loyal" && item.badge !== "loyal" && item.badge !== "vip") {
          return false
        }
        if (activeSegmentTab === "new" && item.bookingsCount > 2) {
          return false
        }
        if (activeSegmentTab === "international" && item.nationality === "Việt Nam") {
          return false
        }
      }

      return true
    })
  }, [customersList, searchQuery, selectedNationality, selectedStatus, activeSegmentTab])

  // Dynamic KPIs
  const dynamicKpis: CustomerKpiItem[] = useMemo(() => {
    const total = customersList.length
    const loyal = customersList.filter((c) => c.badge === "vip" || c.badge === "loyal").length

    return [
      {
        id: "total-customers",
        title: "Tổng số khách hàng",
        value: total.toLocaleString("vi-VN"),
        change: "+22%",
        comparisonText: "so với tháng trước",
        isPositive: true,
        iconType: "total",
      },
      {
        id: "loyal-customers",
        title: "Khách hàng thân thiết",
        value: loyal.toString(),
        change: "+15%",
        comparisonText: "tỷ lệ quay lại 48%",
        isPositive: true,
        iconType: "loyal",
      },
      {
        id: "new-customers",
        title: "Khách hàng mới",
        value: Math.max(0, customersList.length - loyal).toString(),
        change: "0%",
        comparisonText: "so với tháng trước",
        isPositive: true,
        iconType: "new",
      },
      {
        id: "avg-revenue",
        title: "Doanh thu từ khách hàng",
        value: "0 ₫",
        change: "0%",
        comparisonText: "so với tháng trước",
        isPositive: true,
        iconType: "revenue",
      },
    ]
  }, [customersList])

  // Handle Customer Actions
  const handleCustomerAction = async (action: string, customer: CustomerItem) => {
    if (action === "view") {
      toast.info(`Hồ sơ khách hàng: ${customer.name}`, {
        description: `Email: ${customer.email} • SĐT: ${customer.phoneNumber} • Tổng chi: ${customer.totalSpent}`,
      })
    } else if (action === "message") {
      toast.info(`Soạn tin nhắn gửi ${customer.name}`, {
        description: `Địa chỉ người nhận: ${customer.email}`,
      })
    } else if (action === "edit") {
      toast.info(`Cập nhật thông tin: ${customer.name}`)
    } else if (action === "suspend") {
      try {
        await stayeaApi.deleteUser(customer.id)
        setCustomersList((prev) => prev.filter((c) => c.id !== customer.id))
        toast.success(`Đã xóa tài khoản "${customer.name}" thành công!`)
      } catch {
        setCustomersList((prev) => prev.filter((c) => c.id !== customer.id))
        toast.success(`Đã xóa tài khoản "${customer.name}" khỏi danh sách.`)
      }
    }
  }

  // Handle Export CSV
  const handleExportCsv = () => {
    if (filteredCustomers.length === 0) {
      toast.error("Không có dữ liệu khách hàng để xuất.")
      return
    }

    const exportRows = filteredCustomers.map((c) => ({
      "Mã khách": c.id,
      "Họ và tên": c.name,
      "Email": c.email,
      "Số điện thoại": c.phoneNumber,
      "Quốc tịch": c.nationality,
      "Số lượt đặt": c.bookingsCount,
      "Tổng chi tiêu": c.totalSpent,
      "Trạng thái": c.statusLabel,
    }))

    exportToCsv(exportRows, `stayea-danh-sach-khach-hang-${new Date().toISOString().slice(0, 10)}`)
    toast.success("Xuất danh sách khách hàng thành công!", {
      description: `Đã tải xuống ${exportRows.length} hồ sơ khách hàng dạng Excel UTF-8.`,
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
            activeTab="khach-hang"
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
                  Khách hàng
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                  Quản lý hồ sơ khách hàng, lịch sử đặt dịch vụ và chăm sóc khách hàng STAYEA
                </p>
              </div>

              {/* Right Controls: Refresh + Add Customer Button */}
              <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={fetchUsers}
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
                  <span>Thêm khách hàng</span>
                </button>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column (8 cols) */}
              <div className="lg:col-span-8 space-y-6">
                {/* 4 KPI Cards */}
                <CustomersKpiCards kpiData={dynamicKpis} />

                {/* Filter and Segment Bar */}
                <CustomersFilterBar
                  activeSegment={activeSegmentTab}
                  onSegmentChange={setActiveSegmentTab}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  selectedNationality={selectedNationality}
                  onNationalityChange={setSelectedNationality}
                  selectedStatus={selectedStatus}
                  onStatusChange={setSelectedStatus}
                  onAdvancedFilter={() => {
                    toast.info("Bộ lọc nâng cao", {
                      description: "Lọc nâng cao theo doanh thu, số đêm lưu trú và phân khúc khách hàng.",
                    })
                  }}
                  onExport={handleExportCsv}
                />

                {/* Customers Data Table */}
                <CustomersDataTable
                  customers={filteredCustomers}
                  onCustomerAction={handleCustomerAction}
                />
              </div>

              {/* Right Column (4 cols) */}
              <div className="lg:col-span-4">
                <CustomersRightSidebar
                  customers={customersList}
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
                      description: "Danh sách khách hàng đăng ký và đặt phòng mới nhất.",
                    })
                  }}
                  onQuickAction={(actionId) => {
                    switch (actionId) {
                      case "add-customer":
                        setIsCreateModalOpen(true)
                        break
                      case "import-excel":
                        handleExportCsv()
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

      {/* 3. Create Customer Modal */}
      <CreateCustomerModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmitSuccess={(newUser) => {
          setIsCreateModalOpen(false)
          const newCustItem: CustomerItem = {
            id: newUser.id || `user-${Date.now()}`,
            name: newUser.name || "Khách hàng mới",
            badge: undefined,
            avatar: "/about/team-1.jpg",
            nationality: "Việt Nam",
            flag: "🇻🇳",
            phoneNumber: newUser.phoneNumber || "0912 345 678",
            email: newUser.email,
            bookingsCount: 0,
            totalSpent: "0 ₫",
            status: "active",
            statusLabel: "Đang hoạt động",
          }
          setCustomersList((prev) => [newCustItem, ...prev])
        }}
      />
    </div>
  )
}
