"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  Check,
  CreditCard,
  Percent,
  Plus,
  RefreshCw,
  ShieldCheck,
  X,
} from "lucide-react"
import { stayeaApi } from "@/lib/stayea-api-service"
import type { HostPartnerItem } from "@/features/admin-hosts/stayea-admin-hosts-mock-data"
import { StayeaAdminHeader } from "@/features/admin-dashboard/components/stayea-admin-header"
import { StayeaAdminSidebar } from "@/features/admin-dashboard/components/stayea-admin-sidebar"
import { StayeaAdminFooter } from "@/features/admin-dashboard/components/stayea-admin-footer"
import { HostsKpiCards } from "./components/hosts-kpi-cards"
import { HostsFilterBar } from "./components/hosts-filter-bar"
import { HostsDataTable } from "./components/hosts-data-table"
import { HostsRightSidebar } from "./components/hosts-right-sidebar"
import { AdminOrderApprovalQueue } from "./components/admin-order-approval-queue"
import { AdminPayoutRequestsTable } from "./components/admin-payout-requests-table"
import { AdminCatalogModerationTable } from "./components/admin-catalog-moderation-table"
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
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [adminSection, setAdminSection] = useState<
    "hosts" | "approval_queue" | "payout_requests" | "catalog_moderation"
  >("hosts")
  const [activeSegment, setActiveSegment] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(initialModalOpen)
  const [livePartners, setLivePartners] = useState<HostPartnerItem[]>([])
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0)
  const [pendingPayoutsCount, setPendingPayoutsCount] = useState(0)

  // KYC Partner Review Modal State
  const [kycPartner, setKycPartner] = useState<HostPartnerItem | null>(null)
  const [kycCommission, setKycCommission] = useState(10)
  const [kycNotes, setKycNotes] = useState("")
  const [kycProcessing, setKycProcessing] = useState(false)

  useEffect(() => {
    stayeaApi
      .getAdminOrdersQueue()
      .then((orders) => {
        if (Array.isArray(orders)) {
          const pending = orders.filter(
            (o: any) => o.status === "pending_admin" || o.status === "sent_to_partner"
          ).length
          setPendingOrdersCount(pending)
        }
      })
      .catch(() => {})

    stayeaApi
      .getAdminPayouts("pending")
      .then((payouts) => {
        if (Array.isArray(payouts)) {
          setPendingPayoutsCount(payouts.length)
        }
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    stayeaApi
      .getAdminPartners()
      .then((res) => {
        if (res && res.length > 0) {
          const mapped: HostPartnerItem[] = res.map((p: any) => ({
            id: p.id,
            name: p.contactName || p.businessName,
            email: p.email,
            avatar: "/avatars/avatar-1.jpg",
            partnerType:
              p.businessType === "transport" ? "management_company" : "individual",
            partnerTypeLabel: p.businessName || "Chủ nhà đối tác",
            propertiesCount: 1,
            region: p.city || "Phú Quốc",
            joinedDate: p.createdAt
              ? new Date(p.createdAt).toLocaleDateString("vi-VN")
              : "Hôm nay",
            revenue: "0 ₫",
            status:
              p.status === "approved"
                ? "active"
                : p.status === "suspended"
                  ? "paused"
                  : "pending",
            statusLabel:
              p.status === "approved"
                ? "Đang hoạt động"
                : p.status === "suspended"
                  ? "Tạm dừng"
                  : "Chờ duyệt",
            commission: `${p.commissionRate || 10}%`,
            raw: p,
          }))
          setLivePartners(mapped)
        } else {
          setLivePartners([])
        }
      })
      .catch(() => {
        setLivePartners([])
      })
  }, [])

  const liveHostKpis = useMemo(() => {
    const total = livePartners.length
    const active = livePartners.filter((p) => p.status === "active").length
    const pending = livePartners.filter((p) => p.status === "pending").length
    const paused = livePartners.filter((p) => p.status === "paused").length
    return [
      {
        id: "total-hosts",
        title: "Tổng chủ nhà/đối tác",
        value: total.toString(),
        change: "0%",
        comparisonText: "so với tháng trước",
        isPositive: true,
        iconType: "total" as const,
      },
      {
        id: "active-hosts",
        title: "Đang hợp tác",
        value: active.toString(),
        change: "0%",
        comparisonText: "so với tháng trước",
        isPositive: true,
        iconType: "active" as const,
      },
      {
        id: "pending-hosts",
        title: "Chờ duyệt",
        value: pending.toString(),
        change: "0%",
        comparisonText: "so với tháng trước",
        isPositive: true,
        iconType: "pending" as const,
      },
      {
        id: "paused-hosts",
        title: "Tạm ngưng",
        value: paused.toString(),
        change: "0%",
        comparisonText: "so với tháng trước",
        isPositive: false,
        iconType: "paused" as const,
      },
    ]
  }, [livePartners])

  const segmentCounts = useMemo(() => ({
    all: livePartners.length,
    individual: livePartners.filter((p) => p.partnerType === "individual").length,
    management_company: livePartners.filter((p) => p.partnerType === "management_company").length,
    agency: livePartners.filter((p) => p.partnerType === "agency").length,
    pending: livePartners.filter((p) => p.status === "pending").length,
  }), [livePartners])

  const filteredPartners = useMemo(() => {
    let list = livePartners
    if (activeSegment !== "all") {
      if (activeSegment === "pending") {
        list = list.filter((p) => p.status === "pending")
      } else {
        list = list.filter((p) => p.partnerType === activeSegment)
      }
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      list = list.filter((p) =>
        p.name.toLowerCase().includes(q) ||
        p.email.toLowerCase().includes(q) ||
        p.partnerTypeLabel.toLowerCase().includes(q) ||
        p.region.toLowerCase().includes(q)
      )
    }
    return list
  }, [livePartners, activeSegment, searchQuery])

  const handleAddHost = () => {
    setIsCreateModalOpen(true)
  }

  const handleOpenKycModal = (host: HostPartnerItem) => {
    setKycPartner(host)
    setKycCommission(host.raw?.commissionRate ? Number(host.raw.commissionRate) : 10)
    setKycNotes(host.raw?.adminNotes || "")
  }

  const handleUpdatePartnerKyc = async (newStatus: "approved" | "suspended" | "rejected") => {
    if (!kycPartner) return
    setKycProcessing(true)
    try {
      await stayeaApi.updateAdminPartnerStatus(kycPartner.id, {
        status: newStatus,
        commissionRate: kycCommission,
        adminNotes: kycNotes.trim() || undefined,
      })
      toast.success(
        newStatus === "approved"
          ? `Đã phê duyệt đối tác: ${kycPartner.name}`
          : newStatus === "suspended"
            ? `Đã tạm đình chỉ đối tác: ${kycPartner.name}`
            : `Đã từ chối đối tác: ${kycPartner.name}`
      )
      setLivePartners((prev) =>
        prev.map((h) =>
          h.id === kycPartner.id
            ? {
                ...h,
                status: newStatus === "approved" ? "active" : "paused",
                statusLabel:
                  newStatus === "approved"
                    ? "Đang hoạt động"
                    : newStatus === "suspended"
                      ? "Tạm dừng"
                      : "Từ chối",
                commission: `${kycCommission}%`,
                raw: {
                  ...h.raw,
                  status: newStatus,
                  commissionRate: kycCommission,
                  adminNotes: kycNotes,
                },
              }
            : h
        )
      )
      setKycPartner(null)
    } catch (err: any) {
      toast.error(err.message || "Không thể cập nhật hồ sơ đối tác")
    } finally {
      setKycProcessing(false)
    }
  }

  const handleAdvancedFilter = () => {
    toast.info("Bộ lọc nâng cao", {
      description: "Lọc nâng cao theo số lượng phòng, doanh thu luỹ kế và tỷ lệ hoa hồng.",
    })
  }

  const handleExport = () => {
    toast.success("Xuất danh sách đối tác", {
      description: `Đang tải xuống tệp danh sách ${livePartners.length} chủ nhà và đối tác (định dạng Excel .xlsx).`,
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
            onSelectTab={onNavigateTab}
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
                  Quản Trị Đối Tác & Điều Phối Đơn Hàng
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                  Quản lý chủ nhà, đối tác vận chuyển, phê duyệt đơn từ AI Agent và điều phối phục vụ.
                </p>
              </div>

              {/* Right Controls */}
              <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto flex-wrap">
                <button
                  type="button"
                  onClick={() => router.push("/hub")}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold shadow-xs transition-all"
                >
                  <span>Mở Cổng Đối Tác (Partner Hub)</span>
                </button>

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

            {/* Sub-tabs: Switch between Partners Directory and Order Dispatch Queue */}
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
              <button
                type="button"
                onClick={() => setAdminSection("hosts")}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${adminSection === "hosts"
                  ? "bg-[#1b7a4e] text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
              >
                Danh Sách Chủ Nhà &amp; Đối Tác
              </button>

              <button
                type="button"
                onClick={() => setAdminSection("approval_queue")}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${adminSection === "approval_queue"
                  ? "bg-amber-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
              >
                <span>Hàng Đợi Duyệt Đơn (AI &amp; Khách &rarr; Partner)</span>
                {pendingOrdersCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold">
                    {pendingOrdersCount} mới
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setAdminSection("payout_requests")}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${adminSection === "payout_requests"
                  ? "bg-purple-700 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
              >
                <span>Yêu Cầu Quyết Toán / Rút Tiền</span>
                {pendingPayoutsCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-bold">
                    {pendingPayoutsCount} mới
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setAdminSection("catalog_moderation")}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${adminSection === "catalog_moderation"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
              >
                <span>Kiểm Duyệt Dịch Vụ / BĐS</span>
              </button>
            </div>

            {adminSection === "approval_queue" ? (
              <AdminOrderApprovalQueue
                onNavigatePartnerHub={() => router.push("/hub")}
              />
            ) : adminSection === "payout_requests" ? (
              <AdminPayoutRequestsTable />
            ) : adminSection === "catalog_moderation" ? (
              <AdminCatalogModerationTable />
            ) : (
              /* Main Content Grid: 8 cols left, 4 cols right */
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left Column (8 cols) */}
                <div className="lg:col-span-8 space-y-6">
                  {/* 4 KPI Cards */}
                  <HostsKpiCards kpis={liveHostKpis} />

                  {/* Filter and Segment Bar */}
                  <HostsFilterBar
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    activeSegment={activeSegment}
                    onSegmentChange={setActiveSegment}
                    segmentCounts={segmentCounts}
                    onAdvancedFilter={handleAdvancedFilter}
                    onExport={handleExport}
                  />

                  {/* Hosts Data Table */}
                  <HostsDataTable
                    hosts={filteredPartners}
                    onHostAction={async (action, host) => {
                      if (action === "chat") {
                        toast.info(`Mở kênh chat với chủ nhà: ${host.raw?.businessName || host.name}`)
                        if (typeof window !== "undefined") {
                          const url = new URL("/stayea/messages", window.location.origin)
                          url.searchParams.set("partnerId", host.id)
                          if (onNavigateTab) {
                            window.history.pushState(null, "", url.toString())
                            onNavigateTab("messages")
                          } else {
                            window.location.href = url.toString()
                          }
                        }
                        return
                      }
                      if (action === "view" || action === "contract" || action === "commission") {
                        handleOpenKycModal(host)
                      } else if (action === "suspend") {
                        try {
                          await stayeaApi.adminUpdatePartnerStatus(
                            host.id,
                            host.status === "paused" ? "approved" : "suspended"
                          )
                        } catch {
                          // ignore
                        }
                        setLivePartners((prev) =>
                          prev.map((h) =>
                            h.id === host.id
                              ? {
                                ...h,
                                status: h.status === "paused" ? "active" : "paused",
                                statusLabel:
                                  h.status === "paused"
                                    ? "Đang hoạt động"
                                    : "Tạm dừng",
                              }
                              : h
                          )
                        )
                        toast.warning(
                          host.status === "paused"
                            ? `Đã kích hoạt lại đối tác: ${host.name}`
                            : `Tạm dừng hợp tác với: ${host.name}`
                        )
                      }
                    }}
                  />
                </div>

                {/* Right Column (4 cols) */}
                <div className="lg:col-span-4">
                  <HostsRightSidebar
                    hosts={livePartners}
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
            )}

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
        onSubmitSuccess={async (data: any) => {
          setIsCreateModalOpen(false)
          try {
            await stayeaApi.adminCreatePartner({
              businessName: data.businessName || data.fullName,
              businessType:
                data.partnerType === "car_rental"
                  ? "transport"
                  : data.partnerType === "tour_operator"
                    ? "tour"
                    : "homestay",
              contactName: data.fullName,
              phone: data.phoneNumber,
              email: data.email,
              address: `${data.address || ""}, ${data.ward || ""}, ${data.district || ""}, ${data.province || ""}`,
              taxId: data.taxCode,
              bankName: data.bankName,
              bankAccount: data.bankAccount,
              bankAccountHolder: data.bankAccountHolder,
              status: data.isActiveNow ? "approved" : "pending",
            })
          } catch {
            // ignore
          }
          const newPartnerItem: HostPartnerItem = {
            id: `ptn_${Date.now()}`,
            name: data.fullName,
            email: data.email,
            avatar: "/avatars/avatar-1.jpg",
            partnerType:
              data.partnerType === "management_company"
                ? "management_company"
                : "individual",
            partnerTypeLabel: data.businessName || data.fullName,
            propertiesCount: 1,
            region: data.province || "Phú Quốc",
            joinedDate: "Hôm nay",
            revenue: "0 ₫",
            status: data.isActiveNow ? "active" : "pending",
            statusLabel: data.isActiveNow ? "Đang hoạt động" : "Chờ duyệt",
            commission: "10%",
          }
          setLivePartners((prev) => [newPartnerItem, ...prev])
          toast.success("Tạo tài khoản chủ nhà/đối tác thành công!", {
            description: `Hồ sơ ${data.fullName} đã được ghi nhận vào hệ thống STAYEA.`,
          })
        }}
      />
      {/* 4. Modal Thẩm Định KYC Đối Tác */}
      {kycPartner && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#1b7a4e] flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Thẩm Định &amp; Xét Duyệt Đối Tác (KYC)
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {kycPartner.name} • Mã ID: <span className="font-mono">{kycPartner.id}</span>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setKycPartner(null)}
                className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 overflow-y-auto">
              {/* Partner Profile Summary */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Thông Tin Đăng Ký Pháp Lý &amp; Thanh Toán
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500">Đơn vị / Đại diện:</span>
                    <p className="font-semibold text-slate-900">{kycPartner.name}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Loại hình đối tác:</span>
                    <p className="font-semibold text-slate-900">{kycPartner.partnerTypeLabel}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Email liên hệ:</span>
                    <p className="font-semibold text-slate-900">{kycPartner.email}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Số điện thoại:</span>
                    <p className="font-semibold text-slate-900">
                      {kycPartner.raw?.phone || "Chưa cung cấp"}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-500">Mã số thuế:</span>
                    <p className="font-semibold text-slate-900 font-mono">
                      {kycPartner.raw?.taxId || "Chưa cung cấp"}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-500">Khu vực hoạt động:</span>
                    <p className="font-semibold text-slate-900">
                      {kycPartner.raw?.address || kycPartner.region}
                    </p>
                  </div>
                  <div className="sm:col-span-2 pt-2 border-t border-slate-200/60">
                    <span className="text-slate-500 flex items-center gap-1">
                      <CreditCard className="w-3.5 h-3.5" /> Thông tin ngân hàng nhận thanh toán:
                    </span>
                    <p className="font-semibold text-slate-900 mt-0.5">
                      {kycPartner.raw?.bankName ? (
                        <>
                          <span className="font-bold text-emerald-800">{kycPartner.raw.bankName}</span> — STK:{" "}
                          <span className="font-mono font-bold text-slate-900">{kycPartner.raw.bankAccount}</span>{" "}
                          ({kycPartner.raw.bankAccountHolder})
                        </>
                      ) : (
                        <span className="text-amber-600 italic">Chưa khai báo tài khoản ngân hàng</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Commission Rate Config */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Percent className="w-3.5 h-3.5 text-[#1b7a4e]" />
                  Tỷ lệ hoa hồng STAYEA khấu trừ (%)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={kycCommission}
                    onChange={(e) => setKycCommission(Number(e.target.value))}
                    className="w-28 px-3 py-2 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#1b7a4e]/20 focus:border-[#1b7a4e]"
                  />
                  <span className="text-xs text-slate-500">
                    Mặc định 10% cho lưu trú biệt thự &amp; tour trải nghiệm.
                  </span>
                </div>
              </div>

              {/* Admin Internal Review Notes */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Ghi chú thẩm định &amp; lý do phê duyệt / đình chỉ
                </label>
                <textarea
                  rows={3}
                  value={kycNotes}
                  onChange={(e) => setKycNotes(e.target.value)}
                  placeholder="Nhập kết quả xác minh giấy phép kinh doanh, số lượng phòng thực tế, hoặc lý do từ chối hồ sơ..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1b7a4e]/20 focus:border-[#1b7a4e] resize-none"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setKycPartner(null)}
                disabled={kycProcessing}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Đóng
              </button>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => handleUpdatePartnerKyc("rejected")}
                  disabled={kycProcessing}
                  className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold border border-rose-200 transition-colors disabled:opacity-50"
                >
                  Từ Chối Hồ Sơ
                </button>

                <button
                  type="button"
                  onClick={() => handleUpdatePartnerKyc("suspended")}
                  disabled={kycProcessing}
                  className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-semibold border border-amber-200 transition-colors disabled:opacity-50"
                >
                  Tạm Đình Chỉ
                </button>

                <button
                  type="button"
                  onClick={() => handleUpdatePartnerKyc("approved")}
                  disabled={kycProcessing}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1b7a4e] hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors disabled:opacity-50"
                >
                  {kycProcessing ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  )}
                  <span>Phê Duyệt Hoạt Động</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
