"use client"

import { useState, useEffect } from "react"
import {
  AlertTriangle,
  ArrowRight,
  Bot,
  Building,
  CheckCircle2,
  Plus,
  Sparkles,
} from "lucide-react"

import { stayeaApi } from "@/lib/stayea-api-service"
import { PartnerHeader } from "./components/partner-header"
import { PartnerInventoryCalendar } from "./components/partner-inventory-calendar"
import { PartnerKpiCards } from "./components/partner-kpi-cards"
import { PartnerOrdersManager } from "./components/partner-orders-manager"
import { PartnerPayoutSettings } from "./components/partner-payout-settings"
import { PartnerServicesManager } from "./components/partner-services-manager"
import { PartnerCreateProfileModal } from "./components/partner-create-profile-modal"
import type {
  PartnerOrderData,
  PartnerProfileData,
  PartnerServiceData,
} from "./types"

interface PartnerPortalPageProps {
  initialTab?: "overview" | "services" | "inventory" | "orders" | "settings"
  onNavigateHome?: () => void
  onNavigateAdmin?: () => void
  onLogout?: () => void
}

export function PartnerPortalPage({
  initialTab = "overview",
  onNavigateHome,
  onNavigateAdmin,
  onLogout,
}: PartnerPortalPageProps) {
  // Profiles State
  const [profiles, setProfiles] = useState<PartnerProfileData[]>([])
  const [currentProfile, setCurrentProfile] = useState<PartnerProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [isCreateProfileOpen, setIsCreateProfileOpen] = useState(false)

  // Tab State
  const [activeTab, setActiveTab] = useState<
    "overview" | "services" | "inventory" | "orders" | "settings"
  >(initialTab)

  // Services State (filtered to current partner)
  const [allServices, setAllServices] = useState<PartnerServiceData[]>([])
  const currentServices = currentProfile
    ? allServices.filter((s) => s.partnerId === currentProfile.id)
    : []

  // Orders State (filtered to current partner)
  const [allOrders, setAllOrders] = useState<PartnerOrderData[]>([])

  // 1. Load Partners
  useEffect(() => {
    let isMounted = true
    async function loadPartners() {
      try {
        const [selfPartner, adminPartners] = await Promise.all([
          stayeaApi.getPartnerProfile().catch(() => null),
          stayeaApi.getAdminPartners().catch(() => []),
        ])

        const list: any[] = Array.isArray(adminPartners) ? [...adminPartners] : []
        if (selfPartner && !list.some((p: any) => p.id === selfPartner.id)) {
          list.unshift(selfPartner)
        }

        const mapped: PartnerProfileData[] = list.map((p: any) => ({
          id: p.id,
          userId: p.userId || p.user_id || "",
          businessName: p.businessName || p.business_name || "Cơ sở đối tác",
          businessType: p.businessType || p.business_type || "homestay",
          contactName: p.contactName || p.contact_name || "Chủ cơ sở",
          phone: p.phone || "",
          email: p.email || "",
          address: p.address || "",
          city: p.city || "Phú Quốc",
          bankName: p.bankName || p.bank_name || "",
          bankAccount: p.bankAccount || p.bank_account || "",
          bankAccountHolder: p.bankAccountHolder || p.bank_account_holder || "",
          status: p.status || "approved",
          commissionRate: p.commissionRate ? String(p.commissionRate) : "10.00",
          rating: p.rating ? String(p.rating) : "0.00",
          totalOrders: Number(p.totalOrders || p.total_orders || 0),
        }))

        if (isMounted) {
          setProfiles(mapped)
          if (mapped.length > 0) {
            setCurrentProfile(mapped[0] || null)
          } else {
            setCurrentProfile(null)
          }
          setLoading(false)
        }
      } catch {
        if (isMounted) {
          setProfiles([])
          setCurrentProfile(null)
          setLoading(false)
        }
      }
    }
    loadPartners()
    return () => {
      isMounted = false
    }
  }, [])

  // 2. Load Services for current partner
  useEffect(() => {
    if (!currentProfile) {
      setAllServices([])
      return
    }
    stayeaApi
      .getCatalogServices()
      .then((raw) => {
        if (Array.isArray(raw)) {
          const mapped: PartnerServiceData[] = raw.map((s: any) => ({
            id: s.id,
            partnerId: s.partnerId || s.partner_id || currentProfile.id,
            serviceType: s.serviceType || s.service_type || "stay",
            title: s.title || "Dịch vụ",
            description: s.description || "",
            location: s.location || "Phú Quốc",
            price: String(s.price || 0),
            originalPrice: s.originalPrice ? String(s.originalPrice) : null,
            unit: s.unit || "đêm",
            images: Array.isArray(s.images) && s.images.length > 0 ? s.images : ["/about/hero-phuquoc.jpg"],
            attributes: s.attributes || {},
            status: s.status || "active",
          }))
          setAllServices(mapped)
        }
      })
      .catch(() => {
        setAllServices([])
      })
  }, [currentProfile?.id])

  // 3. Load Orders for current partner
  useEffect(() => {
    if (!currentProfile) {
      setAllOrders([])
      return
    }
    stayeaApi
      .getPartnerOrders({ partnerId: currentProfile.id })
      .then((live) => {
        if (Array.isArray(live)) {
          const mapped: PartnerOrderData[] = live.map((o: any) => ({
            id: o.id,
            orderCode: o.orderCode,
            partnerId: o.partnerId,
            serviceId: o.serviceId,
            customerName: o.customerName,
            customerPhone: o.customerPhone,
            customerEmail: o.customerEmail,
            serviceTitle: o.serviceTitle,
            serviceType: o.serviceType,
            startDate: o.startDate,
            endDate: o.endDate,
            quantity: o.quantity || 1,
            unitPrice: o.unitPrice,
            totalAmount: o.totalAmount,
            commissionAmount: o.commissionAmount || "0",
            partnerPayoutAmount:
              o.partnerPayoutAmount || String(Number(o.totalAmount || 0) * 0.9),
            status: o.status,
            adminNotes: o.adminNotes,
            partnerNotes: o.partnerNotes,
            source: o.source,
            createdAt: o.createdAt,
          }))
          setAllOrders(mapped)
        }
      })
      .catch(() => {
        setAllOrders([])
      })
  }, [currentProfile?.id])

  const currentOrders = currentProfile
    ? allOrders.filter((o) => o.partnerId === currentProfile.id)
    : []

  const pendingOrdersCount = currentOrders.filter(
    (o) => o.status === "sent_to_partner"
  ).length

  // Quick Action: Accept Order
  const handleAcceptOrder = async (orderId: string) => {
    if (!currentProfile) return
    try {
      await stayeaApi.partnerRespondOrder(
        orderId,
        "accept",
        undefined,
        currentProfile.id
      )
    } catch {
      // optimistic
    }
    setAllOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: "partner_accepted",
              partnerNotes: "Đối tác đã tiếp nhận đơn và sẵn sàng phục vụ.",
            }
          : o
      )
    )
  }

  // Quick Action: Reject Order
  const handleRejectOrder = async (orderId: string, reason: string) => {
    if (!currentProfile) return
    try {
      await stayeaApi.partnerRespondOrder(
        orderId,
        "reject",
        reason,
        currentProfile.id
      )
    } catch {
      // optimistic
    }
    setAllOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: "partner_rejected",
              rejectionReason: reason,
            }
          : o
      )
    )
  }

  // Quick Action: Add Service
  const handleAddService = (
    newServiceData: Omit<PartnerServiceData, "id" | "partnerId">
  ) => {
    if (!currentProfile) return
    const newService: PartnerServiceData = {
      ...newServiceData,
      id: `svc_${Date.now()}`,
      partnerId: currentProfile.id,
    }
    setAllServices((prev) => [newService, ...prev])
  }

  // Toggle Service Status
  const handleToggleServiceStatus = (serviceId: string) => {
    setAllServices((prev) =>
      prev.map((s) =>
        s.id === serviceId
          ? { ...s, status: s.status === "active" ? "inactive" : "active" }
          : s
      )
    )
  }

  // Delete Service
  const handleDeleteService = (serviceId: string) => {
    setAllServices((prev) => prev.filter((s) => s.id !== serviceId))
  }

  // Update Profile
  const handleUpdateProfile = (updated: Partial<PartnerProfileData>) => {
    setCurrentProfile((prev) => (prev ? { ...prev, ...updated } : null))
  }

  // Handle Partner Created
  const handlePartnerCreated = (newProfile: PartnerProfileData) => {
    setProfiles((prev) => [newProfile, ...prev])
    setCurrentProfile(newProfile)
  }

  return (
    <div className="min-h-screen bg-[#070e0d] text-slate-100 flex flex-col font-sans">
      {/* 1. Header */}
      <PartnerHeader
        currentProfile={currentProfile}
        profiles={profiles}
        onSelectProfile={setCurrentProfile}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        pendingOrdersCount={pendingOrdersCount}
        onNavigateHome={onNavigateHome}
        onNavigateAdmin={onNavigateAdmin}
        onLogout={onLogout}
        onAddPartner={() => setIsCreateProfileOpen(true)}
      />

      {/* 2. Main Portal Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-slate-400">Đang tải dữ liệu đối tác STAYEA...</p>
          </div>
        ) : !currentProfile ? (
          /* Empty State: No partners registered yet */
          <div className="max-w-2xl mx-auto py-16 text-center space-y-6">
            <div className="w-20 h-20 rounded-3xl bg-emerald-950/60 border border-emerald-800/40 flex items-center justify-center mx-auto text-emerald-400 shadow-2xl">
              <Building className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Chưa có cơ sở đối tác nào trong hệ thống
              </h2>
              <p className="text-sm text-slate-400 max-w-lg mx-auto leading-relaxed">
                Cổng điều phối Partner Hub hiện chưa ghi nhận hồ sơ đối tác nào. Bạn có thể bấm tạo đối tác mới bên dưới hoặc truy cập trang quản trị Admin để thêm cơ sở.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsCreateProfileOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-950 transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm Cơ Sở Đối Tác Mới</span>
              </button>
              {onNavigateAdmin && (
                <button
                  type="button"
                  onClick={onNavigateAdmin}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all"
                >
                  Cổng Quản Trị Admin
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* TAB 1: OVERVIEW */}
            {activeTab === "overview" && (
              <div className="space-y-8">
                {/* Greeting & Quick Action Banner */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-[#041c19] border border-emerald-800/40 p-6 sm:p-8 shadow-2xl">
                  <div className="relative z-10 max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-3">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Kênh Điều Phối Đối Tác STAYEA</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                      Xin chào, {currentProfile.contactName}!
                    </h1>
                    <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                      Cơ sở: <strong className="text-emerald-300">{currentProfile.businessName}</strong>. 
                      Hệ thống AI Agent và đội ngũ Admin STAYEA đang liên tục kết nối các yêu cầu du khách Phú Quốc tới bạn.
                    </p>

                    <div className="mt-6 flex items-center gap-3 flex-wrap">
                      <button
                        type="button"
                        onClick={() => setActiveTab("orders")}
                        className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-950 transition-all flex items-center gap-2"
                      >
                        <span>Xem Đơn Hàng</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab("services")}
                        className="px-5 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Thêm Dịch Vụ Mới</span>
                      </button>
                    </div>
                  </div>

                  {/* Decorative Glow */}
                  <div className="absolute right-0 top-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
                </div>

                {/* KPI Cards */}
                <PartnerKpiCards
                  profile={currentProfile}
                  services={currentServices}
                  orders={currentOrders}
                  onViewOrders={() => setActiveTab("orders")}
                  onViewServices={() => setActiveTab("services")}
                />

                {/* Urgent Orders Preview (If any order needs confirmation) */}
                {pendingOrdersCount > 0 && (
                  <div className="rounded-2xl bg-gradient-to-r from-rose-950/40 via-slate-900 to-slate-900 border border-rose-900/60 p-6 shadow-xl space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5 text-rose-300">
                        <AlertTriangle className="w-5 h-5 text-rose-400 animate-pulse" />
                        <h3 className="font-bold text-base text-white">
                          Đơn Hàng Mới Cần Bạn Xác Nhận Nhận Khách ({pendingOrdersCount})
                        </h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveTab("orders")}
                        className="text-xs text-rose-400 hover:underline font-semibold"
                      >
                        Xem tất cả đơn &rarr;
                      </button>
                    </div>

                    <div className="space-y-3">
                      {currentOrders
                        .filter((o) => o.status === "sent_to_partner")
                        .map((o) => (
                          <div
                            key={o.id}
                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-800/70 border border-rose-900/40"
                          >
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-xs font-bold text-white">
                                  {o.orderCode}
                                </span>
                                <span className="text-xs text-emerald-400 font-semibold">
                                  {o.serviceTitle}
                                </span>
                                {o.source === "ai_agent" && (
                                  <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1 font-semibold">
                                    <Bot className="w-3 h-3" /> AI Agent
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-slate-300 mt-1">
                                Khách: <strong>{o.customerName}</strong> ({o.customerPhone}) • Ngày: {o.startDate} {o.endDate ? `→ ${o.endDate}` : ""}
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                type="button"
                                onClick={() => handleAcceptOrder(o.id)}
                                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Xác Nhận Nhận Đơn</span>
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Active Services Quick Grid */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <span>Dịch Vụ Đang Mở Bán ({currentServices.length})</span>
                    </h3>
                    <button
                      type="button"
                      onClick={() => setActiveTab("services")}
                      className="text-xs text-emerald-400 hover:underline font-semibold"
                    >
                      Quản lý đầy đủ &rarr;
                    </button>
                  </div>

                  {currentServices.length === 0 ? (
                    <div className="text-center py-12 bg-slate-900/60 rounded-2xl border border-dashed border-slate-800">
                      <p className="text-xs text-slate-400">
                        Cơ sở này chưa có dịch vụ nào đang mở bán.
                      </p>
                      <button
                        type="button"
                        onClick={() => setActiveTab("services")}
                        className="mt-3 px-4 py-2 rounded-xl bg-emerald-600/80 hover:bg-emerald-600 text-white text-xs font-medium inline-flex items-center gap-1.5 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Thêm dịch vụ ngay</span>
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {currentServices.map((service) => (
                        <div
                          key={service.id}
                          className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden flex flex-col justify-between p-4"
                        >
                          <div className="flex gap-3">
                            <img
                              src={service.images[0]}
                              alt={service.title}
                              className="w-20 h-20 rounded-xl object-cover shrink-0"
                            />
                            <div className="flex-1 truncate">
                              <h4 className="font-bold text-white text-xs truncate">
                                {service.title}
                              </h4>
                              <p className="text-[11px] text-slate-400 truncate mt-0.5">
                                {service.location}
                              </p>
                              <div className="text-emerald-400 font-extrabold text-sm mt-2">
                                {Number.parseInt(service.price).toLocaleString("vi-VN")} ₫
                                <span className="text-[10px] text-slate-400 font-normal">
                                  /{service.unit}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: SERVICES MANAGER */}
            {activeTab === "services" && (
              <PartnerServicesManager
                profile={currentProfile}
                services={currentServices}
                onAddService={handleAddService}
                onToggleStatus={handleToggleServiceStatus}
                onDeleteService={handleDeleteService}
                onGoToInventory={() => setActiveTab("inventory")}
              />
            )}

            {/* TAB 3: INVENTORY CALENDAR */}
            {activeTab === "inventory" && (
              <PartnerInventoryCalendar services={currentServices} />
            )}

            {/* TAB 4: ORDERS MANAGER */}
            {activeTab === "orders" && (
              <PartnerOrdersManager
                orders={currentOrders}
                onAcceptOrder={handleAcceptOrder}
                onRejectOrder={handleRejectOrder}
              />
            )}

            {/* TAB 5: SETTINGS & PAYOUT */}
            {activeTab === "settings" && (
              <PartnerPayoutSettings
                profile={currentProfile}
                onUpdateProfile={handleUpdateProfile}
              />
            )}
          </>
        )}
      </main>

      {/* Modal: Create Partner Profile */}
      <PartnerCreateProfileModal
        isOpen={isCreateProfileOpen}
        onClose={() => setIsCreateProfileOpen(false)}
        onSuccess={handlePartnerCreated}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-emerald-950/60 bg-[#040e0d] py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            &copy; 2026 STAYEA Partner Hub • Hệ thống Quản lý Đối tác Du lịch Phú Quốc
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Hotline Hỗ Trợ Đối Tác: 0988 123 456</span>
            <span>•</span>
            <span>Email: partner@stayea.com</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
