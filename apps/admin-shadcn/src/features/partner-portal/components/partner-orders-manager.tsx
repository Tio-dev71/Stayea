"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import {
  AlertCircle,
  BedDouble,
  Building,
  Calendar,
  CheckCircle2,
  Clock,
  Coffee,
  ExternalLink,
  FileText,
  MapPin,
  MessageSquare,
  Phone,
  Plus,
  Receipt,
  Search,
  Trash2,
  User,
  Users,
  X,
  XCircle,
} from "lucide-react"
import { stayeaApi, type PmsFolioDetails, type PmsServiceItem } from "@/lib/stayea-api-service"
import type { PartnerOrderData } from "../types"

interface PartnerOrdersManagerProps {
  orders: PartnerOrderData[]
  partnerId?: string
  onAcceptOrder: (orderId: string) => void
  onRejectOrder: (orderId: string, reason: string) => void
  onNavigateToPms?: () => void
}

function formatCurrency(val: number | string): string {
  const num = typeof val === "string" ? Number(val) : val
  return new Intl.NumberFormat("vi-VN").format(isNaN(num) ? 0 : num) + " ₫"
}

const DEFAULT_PRESETS = [
  { name: "Đĩa trái cây tươi nhiệt đới", price: 150000, type: "fnb" as const },
  { name: "Nước khoáng Aquafina 500ml", price: 15000, type: "minibar" as const },
  { name: "Lon nước ngọt Coca / Sprite", price: 20000, type: "minibar" as const },
  { name: "Bia lon Bivina Phú Quốc", price: 25000, type: "minibar" as const },
  { name: "Giặt ủi quần áo lấy nhanh (kg)", price: 40000, type: "laundry" as const },
  { name: "Set ăn sáng phát sinh (khách)", price: 150000, type: "fnb" as const },
]

export function PartnerOrdersManager({
  orders,
  partnerId,
  onAcceptOrder,
  onRejectOrder,
  onNavigateToPms,
}: PartnerOrdersManagerProps) {
  const [activeTab, setActiveTabState] = useState<
    "all" | "sent_to_partner" | "partner_accepted" | "completed" | "rejected"
  >(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search)
      const orderSub = urlParams.get("orderTab") as any
      if (
        ["all", "sent_to_partner", "partner_accepted", "completed", "rejected"].includes(
          orderSub
        )
      ) {
        return orderSub
      }
      const saved = localStorage.getItem("stayea_hub_order_subtab") as any
      if (
        ["all", "sent_to_partner", "partner_accepted", "completed", "rejected"].includes(
          saved
        )
      ) {
        return saved
      }
    }
    return "sent_to_partner"
  })

  const setActiveTab = (
    tab: "all" | "sent_to_partner" | "partner_accepted" | "completed" | "rejected"
  ) => {
    setActiveTabState(tab)
    if (typeof window !== "undefined") {
      localStorage.setItem("stayea_hub_order_subtab", tab)
      const url = new URL(window.location.href)
      url.searchParams.set("orderTab", tab)
      window.history.replaceState(null, "", url.toString())
    }
  }

  const [searchTerm, setSearchTerm] = useState("")
  const [rejectionModalOrderId, setRejectionModalOrderId] = useState<string | null>(null)
  const [rejectionReason, setRejectionReason] = useState("")

  // Incidental Services & Folio states
  const [selectedOrderForService, setSelectedOrderForService] = useState<PartnerOrderData | null>(null)
  const [selectedOrderForFolio, setSelectedOrderForFolio] = useState<PartnerOrderData | null>(null)
  const [serviceItems, setServiceItems] = useState<PmsServiceItem[]>([])

  // Add service form
  const [selectedPresetIndex, setSelectedPresetIndex] = useState<number>(0)
  const [serviceDescription, setServiceDescription] = useState<string>(DEFAULT_PRESETS[0]?.name || "")
  const [serviceQuantity, setServiceQuantity] = useState<number>(1)
  const [serviceUnitPrice, setServiceUnitPrice] = useState<number>(DEFAULT_PRESETS[0]?.price || 150000)
  const [serviceItemType, setServiceItemType] = useState<"minibar" | "fnb" | "laundry" | "spa" | "surcharge" | "custom">("fnb")
  const [serviceNote, setServiceNote] = useState<string>("")
  const [isSubmittingService, setIsSubmittingService] = useState<boolean>(false)

  // Folio details state
  const [folioDetails, setFolioDetails] = useState<PmsFolioDetails | null>(null)
  const [isLoadingFolio, setIsLoadingFolio] = useState<boolean>(false)
  const [cancellingItemId, setCancellingItemId] = useState<string | null>(null)
  const [cancelReason, setCancelReason] = useState<string>("")

  // Load catalog service items from PMS
  useEffect(() => {
    if (partnerId) {
      stayeaApi
        .getPmsServiceItems(partnerId)
        .then((items) => {
          if (Array.isArray(items)) setServiceItems(items)
        })
        .catch(() => {})
    }
  }, [partnerId])

  // Presets combined with custom catalog items from PMS
  const availablePresets: Array<{ name: string; price: number; type: "fnb" | "minibar" | "laundry" | "spa" | "surcharge" | "custom" }> = serviceItems.length > 0
    ? serviceItems.map((si) => {
        const type: "fnb" | "minibar" | "laundry" | "spa" | "surcharge" | "custom" =
          si.category?.startsWith("minibar")
            ? "minibar"
            : si.category === "laundry"
              ? "laundry"
              : si.category === "spa"
                ? "spa"
                : "fnb"
        return {
          name: si.name,
          price: Number(si.sellingPrice),
          type,
        }
      })
    : DEFAULT_PRESETS

  const handleOpenAddService = (order: PartnerOrderData) => {
    setSelectedOrderForService(order)
    setSelectedPresetIndex(0)
    setServiceDescription(availablePresets[0]?.name || "Đĩa trái cây tươi nhiệt đới")
    setServiceUnitPrice(availablePresets[0]?.price || 150000)
    setServiceItemType(availablePresets[0]?.type || "fnb")
    setServiceQuantity(1)
    setServiceNote("")
  }

  const handleSelectPreset = (idx: number) => {
    setSelectedPresetIndex(idx)
    if (idx < availablePresets.length && availablePresets[idx]) {
      const preset = availablePresets[idx]!
      setServiceDescription(preset.name)
      setServiceUnitPrice(preset.price)
      setServiceItemType(preset.type)
    } else {
      setServiceDescription("")
      setServiceUnitPrice(0)
      setServiceItemType("custom")
    }
  }

  const handleSubmitService = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedOrderForService) return
    if (!serviceDescription.trim()) {
      toast.error("Vui lòng nhập tên dịch vụ / món")
      return
    }
    if (serviceQuantity <= 0) {
      toast.error("Số lượng phải lớn hơn 0")
      return
    }

    setIsSubmittingService(true)
    try {
      await stayeaApi.postPmsOrderFolioItem(
        selectedOrderForService.id,
        {
          description: serviceDescription.trim(),
          quantity: Number(serviceQuantity),
          unitPrice: Number(serviceUnitPrice),
          itemType: serviceItemType,
          note: serviceNote.trim() || undefined,
        },
        partnerId
      )

      toast.success(
        `Đã thêm ${serviceQuantity}x ${serviceDescription} (${formatCurrency(serviceQuantity * serviceUnitPrice)}) vào hóa đơn phòng!`
      )
      const currentOrder = selectedOrderForService
      setSelectedOrderForService(null)
      handleOpenOrderFolio(currentOrder)
    } catch (err: any) {
      toast.error(err.message || "Không thể ghi nhận dịch vụ vào phòng")
    } finally {
      setIsSubmittingService(false)
    }
  }

  const handleOpenOrderFolio = async (order: PartnerOrderData) => {
    setSelectedOrderForFolio(order)
    setIsLoadingFolio(true)
    try {
      const data = await stayeaApi.getPmsOrderFolio(order.id, partnerId)
      setFolioDetails(data)
    } catch (err: any) {
      toast.error(err.message || "Không thể tải chi tiết hóa đơn phòng")
    } finally {
      setIsLoadingFolio(false)
    }
  }

  const handleCancelFolioItem = async (folioItemId: string) => {
    if (!cancelReason.trim()) {
      toast.error("Vui lòng nhập lý do hủy dòng phí")
      return
    }
    try {
      await stayeaApi.cancelPmsFolioItem(folioItemId, cancelReason.trim(), partnerId)
      toast.success("Đã hủy dòng phí thành công!")
      setCancellingItemId(null)
      setCancelReason("")
      if (selectedOrderForFolio) {
        handleOpenOrderFolio(selectedOrderForFolio)
      }
    } catch (err: any) {
      toast.error(err.message || "Không thể hủy dòng phí")
    }
  }

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.orderCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerPhone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.serviceTitle.toLowerCase().includes(searchTerm.toLowerCase())

    if (!matchesSearch) return false

    if (activeTab === "all") return true
    if (activeTab === "sent_to_partner")
      return o.status === "sent_to_partner" || o.status === "pending_admin"
    if (activeTab === "partner_accepted")
      return o.status === "partner_accepted" || o.status === "in_progress"
    if (activeTab === "completed") return o.status === "completed"
    if (activeTab === "rejected")
      return o.status === "partner_rejected" || o.status === "cancelled"

    return true
  })

  const pendingCount = orders.filter(
    (o) => o.status === "sent_to_partner" || o.status === "pending_admin"
  ).length

  const inProgressCount = orders.filter(
    (o) => o.status === "partner_accepted" || o.status === "in_progress"
  ).length

  const completedCount = orders.filter(
    (o) => o.status === "completed"
  ).length

  const rejectedCount = orders.filter(
    (o) => o.status === "partner_rejected" || o.status === "cancelled"
  ).length

  const handleOpenReject = (orderId: string) => {
    setRejectionModalOrderId(orderId)
    setRejectionReason("")
  }

  const handleConfirmReject = () => {
    if (rejectionModalOrderId) {
      onRejectOrder(
        rejectionModalOrderId,
        rejectionReason || "Đối tác tạm thời kín phòng / kín xe trong thời gian này"
      )
      setRejectionModalOrderId(null)
    }
  }

  const getStatusBadge = (status: PartnerOrderData["status"]) => {
    switch (status) {
      case "pending_admin":
        return {
          label: "Chờ Admin duyệt",
          color: "bg-amber-500/20 text-amber-300 border-amber-500/30",
        }
      case "sent_to_partner":
        return {
          label: "Đơn Mới Cần Xác Nhận",
          color: "bg-rose-500/20 text-rose-300 border-rose-500/30 font-bold animate-pulse",
        }
      case "partner_accepted":
      case "in_progress":
        return {
          label: "Đã Tiếp Nhận / Đang Phục Vụ",
          color: "bg-blue-500/20 text-blue-300 border-blue-500/30",
        }
      case "completed":
        return {
          label: "Hoàn Thành / Sẵn Sàng Quyết Toán",
          color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
        }
      case "partner_rejected":
        return {
          label: "Đối tác đã từ chối",
          color: "bg-slate-700/50 text-slate-400 border-slate-600",
        }
      case "cancelled":
        return {
          label: "Đã hủy",
          color: "bg-rose-950/40 text-rose-400 border-rose-900",
        }
      default:
        return {
          label: status,
          color: "bg-slate-800 text-slate-300 border-slate-700",
        }
    }
  }

  return (
    <div className="space-y-6">
      {/* Header and Filter Tabs */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span>Tiếp Nhận & Xử Lý Đơn Hàng</span>
            {pendingCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full bg-rose-500 text-white text-xs font-bold animate-bounce">
                {pendingCount} đơn mới
              </span>
            )}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Các đơn đặt phòng & dịch vụ từ du khách được đồng bộ tự động để bạn xác nhận và chuẩn bị đón tiếp.
          </p>
        </div>

        {/* Search */}
        <div className="relative sm:w-64">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo mã đơn, khách, sđt..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 shadow-xs"
          />
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex space-x-2 border-b border-slate-200 pb-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab("sent_to_partner")}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeTab === "sent_to_partner"
              ? "bg-rose-50 text-rose-700 border border-rose-200 font-bold shadow-xs"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
          }`}
        >
          <span>Chờ xác nhận</span>
          {pendingCount > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold">
              {pendingCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("partner_accepted")}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeTab === "partner_accepted"
              ? "bg-blue-50 text-blue-700 border border-blue-200 font-bold shadow-xs"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
          }`}
        >
          <span>Đang phục vụ</span>
          {inProgressCount > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-blue-500 text-white text-[10px] font-bold">
              {inProgressCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("completed")}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeTab === "completed"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold shadow-xs"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
          }`}
        >
          <span>Đã hoàn thành</span>
          {completedCount > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold">
              {completedCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("rejected")}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeTab === "rejected"
              ? "bg-slate-100 text-slate-800 border border-slate-200 font-bold shadow-xs"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
          }`}
        >
          <span>Đã từ chối / Hủy</span>
          {rejectedCount > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-slate-500 text-white text-[10px] font-bold">
              {rejectedCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("all")}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeTab === "all"
              ? "bg-slate-800 text-white font-bold shadow-xs"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
          }`}
        >
          <span>Tất cả</span>
          <span className="px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-bold">
            {orders.length}
          </span>
        </button>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-200 shadow-xs">
          <Clock className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-700">Không có đơn hàng nào trong mục này</h3>
          <p className="text-xs text-slate-500 mt-1">
            Khi khách đặt dịch vụ hoặc phòng mới, đơn sẽ lập tức xuất hiện tại đây để bạn xác nhận.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const badge = getStatusBadge(order.status)
            const isPendingAction = order.status === "sent_to_partner"

            return (
              <div
                key={order.id}
                className={`relative overflow-hidden rounded-2xl bg-white border transition-all p-5 shadow-xs hover:shadow-md ${
                  isPendingAction
                    ? "border-rose-200 bg-rose-50/20"
                    : "border-slate-200/90 hover:border-slate-300"
                }`}
              >
                {/* Header Row: Order Code, Badges, Payout */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-mono text-sm font-bold text-slate-900 tracking-wide">
                      {order.orderCode}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-md text-[11px] font-medium border ${badge.color}`}
                    >
                      {badge.label}
                    </span>
                    {order.source === "ai_agent" && (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-semibold flex items-center gap-1">
                        <span>Đặt trực tuyến</span>
                      </span>
                    )}
                  </div>

                  {/* Partner Payout Amount */}
                  <div className="text-left sm:text-right">
                    <div className="text-xs text-slate-500">Tiền thực nhận đối tác:</div>
                    <div className="text-lg font-bold text-emerald-700">
                      {Number.parseInt(order.partnerPayoutAmount).toLocaleString("vi-VN")} ₫
                      <span className="text-xs font-normal text-slate-400 ml-1">
                        (Giá gốc: {Number.parseInt(order.totalAmount).toLocaleString("vi-VN")} ₫)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Main Content Grid: Customer & Service Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-xs">
                  {/* Col 1: Service, Room & Property Info */}
                  <div className="space-y-2">
                    <div>
                      <span className="text-[11px] uppercase tracking-wider font-semibold text-emerald-800 flex items-center gap-1">
                        <Building className="w-3 h-3" />
                        Cơ sở & Hạng phòng
                      </span>
                      <div className="font-bold text-slate-900 text-sm mt-0.5">
                        {order.propertyName || order.serviceTitle}
                      </div>
                      <div className="text-emerald-800 font-medium text-xs mt-1 flex items-center gap-1">
                        <BedDouble className="w-3.5 h-3.5 shrink-0 text-emerald-700" />
                        <span>Hạng phòng: <span className="text-slate-900 font-semibold">{order.roomType || order.serviceTitle}</span></span>
                      </div>
                      {order.propertyLocation && (
                        <div className="flex items-center gap-1 text-slate-500 text-[11px] mt-1">
                          <MapPin className="w-3 h-3 shrink-0 text-slate-400" />
                          <span>{order.propertyLocation}</span>
                        </div>
                      )}
                    </div>

                    <div className="pt-2 border-t border-slate-100 space-y-1">
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <Calendar className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                        <span className="font-medium">
                          {order.startDate}
                          {order.endDate ? ` → ${order.endDate}` : ""}
                        </span>
                        {order.nightCount && (
                          <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                            {order.nightCount} đêm
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-slate-600 flex-wrap">
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3 text-slate-400" />
                          <span>Khách: <strong className="text-slate-900">{order.guestCount || order.quantity}</strong></span>
                        </span>
                        {order.roomAttributes?.bedrooms && (
                          <span className="text-slate-500 text-[11px]">
                            · {order.roomAttributes.bedrooms} phòng ngủ (Tối đa {order.roomAttributes.maxGuests || 4} khách)
                          </span>
                        )}
                      </div>

                      {order.roomAttributes?.amenities && order.roomAttributes.amenities.length > 0 && (
                        <div className="flex items-center gap-1 flex-wrap pt-1">
                          {order.roomAttributes.amenities.slice(0, 3).map((a, idx) => (
                            <span
                              key={idx}
                              className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 text-[10px]"
                            >
                              {a}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Col 2: Customer Contact */}
                  <div>
                    <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">
                      Khách hàng liên hệ
                    </span>
                    <div className="font-semibold text-slate-900 mt-1 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>{order.customerName}</span>
                    </div>
                    <div className="text-emerald-700 font-mono mt-1 flex items-center gap-1.5 font-bold">
                      <Phone className="w-3.5 h-3.5 text-emerald-600" />
                      <a href={`tel:${order.customerPhone}`} className="hover:underline">
                        {order.customerPhone}
                      </a>
                    </div>
                    {order.customerEmail && (
                      <div className="text-slate-500 mt-1">{order.customerEmail}</div>
                    )}
                  </div>

                  {/* Col 3: Admin & Special Notes */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[11px] uppercase tracking-wider font-semibold text-amber-800 flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5 text-amber-600" />
                      <span>Ghi chú từ Hệ thống</span>
                    </span>
                    <p className="text-slate-600 mt-1 text-[11px] leading-relaxed">
                      {order.adminNotes || "Không có ghi chú thêm."}
                    </p>
                    {order.customerNote && (
                      <div className="mt-2.5 p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-[11px] leading-relaxed">
                        <strong className="text-amber-800 flex items-center gap-1 mb-1">
                          <MessageSquare className="w-3.5 h-3.5 text-amber-600" />
                          Yêu cầu của khách:
                        </strong>
                        <span className="italic font-medium">"{order.customerNote}"</span>
                      </div>
                    )}
                    {order.partnerNotes && (
                      <div className="mt-2 pt-2 border-t border-slate-200 text-emerald-800 text-[11px]">
                        <strong>Ghi chú của bạn:</strong> {order.partnerNotes}
                      </div>
                    )}
                    {order.rejectionReason && (
                      <div className="mt-2 pt-2 border-t border-slate-200 text-rose-700 text-[11px]">
                        <strong>Lý do từ chối:</strong> {order.rejectionReason}
                      </div>
                    )}
                  </div>
                </div>

                {/* Urgent Action Row for Pending Dispatch */}
                {isPendingAction && (
                  <div className="mt-5 pt-4 border-t border-rose-100 flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-2 text-rose-700 text-xs">
                      <AlertCircle className="w-4 h-4 text-rose-500 animate-pulse" />
                      <span className="font-medium">
                        Đơn mới đang chờ bạn xác nhận để hoàn tất giữ phòng/xe cho khách!
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleOpenReject(order.id)}
                        className="px-4 py-2 rounded-xl bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Từ chối đơn</span>
                      </button>

                      <button
                        onClick={() => onAcceptOrder(order.id)}
                        className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Xác Nhận Nhận Khách</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* In-Service Action Row for In-House Guests (Minibar, Fruit, Drinks, Incidental Services) */}
                {(order.status === "partner_accepted" || order.status === "in_progress") && (
                  <div className="mt-5 pt-3.5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-emerald-50/50 -mx-5 -mb-5 p-4 rounded-b-2xl border-t border-emerald-100/80">
                    <div className="flex items-center gap-2.5 text-xs text-slate-700">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                      <div>
                        <span className="font-bold text-emerald-950">Khách đang lưu trú / phục vụ:</span>{" "}
                        <span className="text-slate-600 text-[11px]">
                          Quản lý tiêu dùng trái cây, nước uống, minibar và tất toán tại quầy
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap shrink-0">
                      <button
                        type="button"
                        onClick={() => handleOpenAddService(order)}
                        className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                      >
                        <Coffee className="w-3.5 h-3.5 text-amber-300" />
                        <span>+ Thêm Dịch Vụ / Minibar</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenOrderFolio(order)}
                        className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <Receipt className="w-3.5 h-3.5 text-slate-600" />
                        <span>Xem Hóa Đơn (Folio)</span>
                      </button>

                      {onNavigateToPms && (
                        <button
                          type="button"
                          onClick={onNavigateToPms}
                          className="px-2.5 py-2 rounded-xl text-slate-500 hover:text-emerald-800 hover:bg-emerald-50 text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer"
                          title="Chuyển đến màn hình quản lý PMS"
                        >
                          <span>PMS</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Modal Rejection Reason */}
      {rejectionModalOrderId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl text-slate-900">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <XCircle className="w-5 h-5 text-rose-600" />
              <span>Xác Nhận Từ Chối Đơn</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Vui lòng cho biết lý do từ chối để hỗ trợ điều phối sang cơ sở khác cho khách:
            </p>

            <textarea
              rows={3}
              placeholder="Ví dụ: Xe đang bảo dưỡng đột xuất, ngày này đã kín phòng offline..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full mt-3 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-rose-500"
            />

            <div className="mt-4 flex items-center justify-end gap-3">
              <button
                onClick={() => setRejectionModalOrderId(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 cursor-pointer"
              >
                Quay lại
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 cursor-pointer shadow-xs"
              >
                Gửi lý do từ chối
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Add Incidental Service / Minibar */}
      {selectedOrderForService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl text-slate-900 animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100/80 text-emerald-800 flex items-center justify-center shrink-0">
                  <Coffee className="w-5 h-5 text-emerald-700" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Ghi Nhận Dịch Vụ / Minibar
                  </h3>
                  <p className="text-xs text-slate-500">
                    Đơn #{selectedOrderForService.orderCode} · Khách:{" "}
                    <strong>{selectedOrderForService.customerName}</strong>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrderForService(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitService} className="mt-4 space-y-4">
              {/* Quick Presets Selection */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
                  Chọn nhanh mặt hàng phổ biến:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {availablePresets.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectPreset(idx)}
                      className={`p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                        selectedPresetIndex === idx
                          ? "border-emerald-600 bg-emerald-50/50 font-bold text-emerald-950 ring-1 ring-emerald-600"
                          : "border-slate-200 hover:border-slate-300 bg-white text-slate-700"
                      }`}
                    >
                      <div className="truncate font-semibold">{preset.name}</div>
                      <div className="text-[11px] text-emerald-700 font-extrabold mt-0.5">
                        {formatCurrency(preset.price)}
                      </div>
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => handleSelectPreset(availablePresets.length)}
                    className={`p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                      selectedPresetIndex === availablePresets.length
                        ? "border-emerald-600 bg-emerald-50/50 font-bold text-emerald-950 ring-1 ring-emerald-600"
                        : "border-slate-200 hover:border-slate-300 bg-white text-slate-700"
                    }`}
                  >
                    <div className="truncate font-semibold">✍️ Dịch vụ khác</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">Tự nhập đơn giá</div>
                  </button>
                </div>
              </div>

              {/* Service Details Inputs */}
              <div className="space-y-3 pt-1 border-t border-slate-100">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tên món / Dịch vụ *
                  </label>
                  <input
                    type="text"
                    required
                    value={serviceDescription}
                    onChange={(e) => setServiceDescription(e.target.value)}
                    placeholder="Ví dụ: Đĩa hoa quả nhiệt đới, 2 lon bia..."
                    className="w-full text-xs text-slate-900 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-emerald-700 bg-slate-50/50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Số lượng *
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={serviceQuantity <= 1}
                        onClick={() => setServiceQuantity((q) => Math.max(1, q - 1))}
                        className="w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-700 font-bold hover:bg-slate-100 disabled:opacity-40 flex items-center justify-center transition-colors text-sm"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="1"
                        required
                        value={serviceQuantity}
                        onChange={(e) => setServiceQuantity(Math.max(1, Number(e.target.value)))}
                        className="w-14 text-center text-xs font-bold text-slate-900 border border-slate-200 rounded-lg py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                      />
                      <button
                        type="button"
                        onClick={() => setServiceQuantity((q) => q + 1)}
                        className="w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-700 font-bold hover:bg-slate-100 flex items-center justify-center transition-colors text-sm"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Đơn giá (₫) *
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="1000"
                      required
                      value={serviceUnitPrice}
                      onChange={(e) => setServiceUnitPrice(Number(e.target.value))}
                      className="w-full text-xs font-bold text-emerald-800 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-700 bg-slate-50/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Ghi chú phục vụ (tùy chọn)
                  </label>
                  <input
                    type="text"
                    value={serviceNote}
                    onChange={(e) => setServiceNote(e.target.value)}
                    placeholder="Ví dụ: Giao lên phòng lúc 21h, khách yêu cầu thêm đá..."
                    className="w-full text-xs text-slate-900 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-700 bg-slate-50/50"
                  />
                </div>
              </div>

              {/* Total Calculation Banner */}
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-emerald-800 block">
                    Thành tiền phát sinh:
                  </span>
                  <span className="text-[10px] text-emerald-600">
                    {serviceQuantity} × {formatCurrency(serviceUnitPrice)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-base font-extrabold text-emerald-800">
                    {formatCurrency(serviceQuantity * serviceUnitPrice)}
                  </span>
                  <span className="block text-[10px] text-slate-500">
                    Cộng vào hóa đơn phòng (Folio)
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 italic leading-relaxed">
                💡 <strong>Lưu ý:</strong> Khoản phí này được hạch toán trực tiếp vào hóa đơn phòng của khách và sẽ được đối tác thu tại quầy khi khách làm thủ tục Check-out.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-slate-100">
                <button
                  type="button"
                  disabled={isSubmittingService}
                  onClick={() => setSelectedOrderForService(null)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingService}
                  className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition-all active:scale-95 disabled:opacity-70 flex items-center gap-1.5 cursor-pointer"
                >
                  {isSubmittingService && <Clock className="w-3.5 h-3.5 animate-spin" />}
                  <span>{isSubmittingService ? "Đang ghi nhận..." : "Ghi Nhận Vào Hóa Đơn"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal View Folio & Billing Details */}
      {selectedOrderForFolio && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl text-slate-900 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-800 flex items-center justify-center shrink-0">
                  <Receipt className="w-5 h-5 text-emerald-800" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Bảng Kê Hóa Đơn Phòng (Room Folio)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Mã đơn: <span className="font-mono font-bold text-slate-800">#{selectedOrderForFolio.orderCode}</span> · Khách:{" "}
                    <strong>{selectedOrderForFolio.customerName}</strong> ({selectedOrderForFolio.customerPhone})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedOrderForFolio(null)
                  setFolioDetails(null)
                }}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="my-4 overflow-y-auto space-y-4 pr-1 flex-1">
              {isLoadingFolio ? (
                <div className="py-16 text-center text-slate-400">
                  <Clock className="w-8 h-8 animate-spin mx-auto mb-2 text-emerald-600" />
                  <p className="text-xs">Đang tải chi tiết hóa đơn phòng...</p>
                </div>
              ) : folioDetails ? (
                <>
                  {/* Room Charge Card - Paid via Marketplace */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <BedDouble className="w-4 h-4 text-emerald-700" />
                        <span>{selectedOrderForFolio.propertyName || selectedOrderForFolio.serviceTitle}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Hạng phòng: {selectedOrderForFolio.roomType || selectedOrderForFolio.serviceTitle} · {selectedOrderForFolio.startDate} → {selectedOrderForFolio.endDate || "Kết thúc"}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-extrabold text-slate-900 text-sm">
                        {formatCurrency(selectedOrderForFolio.totalAmount)}
                      </div>
                      <span className="inline-block mt-0.5 px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                        ✓ Đã bảo chứng qua STAYEA
                      </span>
                    </div>
                  </div>

                  {/* Incidental Line Items Section */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <Coffee className="w-3.5 h-3.5 text-amber-600" />
                        <span>Dịch vụ & Tiêu dùng phát sinh trong kỳ nghỉ</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const order = selectedOrderForFolio
                          setSelectedOrderForFolio(null)
                          handleOpenAddService(order)
                        }}
                        className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>+ Ghi thêm món</span>
                      </button>
                    </div>

                    {/* Filter out room_charge to show only incidentals */}
                    {folioDetails.items.filter((i) => i.itemType !== "room_charge" && !i.isCancelled).length === 0 ? (
                      <div className="py-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                        <Coffee className="w-8 h-8 text-slate-300 mx-auto mb-1.5" />
                        <p className="text-xs text-slate-500">
                          Khách chưa gọi thêm dịch vụ phát sinh nào (trái cây, nước uống, minibar...).
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            const order = selectedOrderForFolio
                            setSelectedOrderForFolio(null)
                            handleOpenAddService(order)
                          }}
                          className="mt-2.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold border border-emerald-200 cursor-pointer inline-flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" />
                          <span>+ Ghi nhận dịch vụ đầu tiên</span>
                        </button>
                      </div>
                    ) : (
                      <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100 text-xs bg-white">
                        {folioDetails.items
                          .filter((i) => i.itemType !== "room_charge" && !i.isCancelled)
                          .map((item) => (
                            <div
                              key={item.id}
                              className="p-3 flex items-center justify-between hover:bg-slate-50/50 transition-colors"
                            >
                              <div>
                                <div className="font-semibold text-slate-900 flex items-center gap-2">
                                  <span>{item.description}</span>
                                  <span className="text-[10px] font-normal text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                                    {item.itemType}
                                  </span>
                                </div>
                                <div className="text-[11px] text-slate-400 mt-0.5">
                                  {item.quantity} × {formatCurrency(item.unitPrice)} · Ghi bởi: {item.recordedBy}
                                  {item.note ? ` · "${item.note}"` : ""}
                                </div>
                              </div>

                              <div className="flex items-center gap-3">
                                <span className="font-extrabold text-slate-900 text-xs">
                                  +{formatCurrency(item.amount)}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => setCancellingItemId(item.id)}
                                  className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                                  title="Hủy dòng phí này"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>

                  {/* Cancel item prompt */}
                  {cancellingItemId && (
                    <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs space-y-2">
                      <div className="font-bold text-rose-900">Xác nhận hủy dòng phí phát sinh:</div>
                      <input
                        type="text"
                        value={cancelReason}
                        onChange={(e) => setCancelReason(e.target.value)}
                        placeholder="Nhập lý do hủy (VD: Nhập nhầm số lượng, khách trả lại nguyên vẹn...)"
                        className="w-full text-xs px-3 py-1.5 rounded-lg border border-rose-200 bg-white focus:outline-none"
                      />
                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setCancellingItemId(null)
                            setCancelReason("")
                          }}
                          className="px-3 py-1 rounded-md bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 text-[11px] font-medium"
                        >
                          Bỏ qua
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCancelFolioItem(cancellingItemId)}
                          className="px-3 py-1 rounded-md bg-rose-600 text-white hover:bg-rose-700 text-[11px] font-bold"
                        >
                          Xác nhận hủy
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Billing Financial Summary */}
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-emerald-50/30 border border-slate-200 text-xs space-y-2">
                    <div className="flex justify-between text-slate-600">
                      <span>Tiền phòng gốc:</span>
                      <span className="font-semibold text-slate-800">{formatCurrency(folioDetails.folio.roomCharges)}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Tổng phí dịch vụ phát sinh (trái cây, minibar...):</span>
                      <span className="font-semibold text-emerald-800">+{formatCurrency(folioDetails.folio.serviceCharges)}</span>
                    </div>
                    <div className="flex justify-between text-slate-600 border-b border-slate-200/80 pb-2">
                      <span>Đã thanh toán qua sàn STAYEA:</span>
                      <span className="font-semibold text-slate-800">-{formatCurrency(folioDetails.folio.paidAmount)}</span>
                    </div>
                    <div className="flex justify-between items-baseline pt-1">
                      <div>
                        <div className="font-extrabold text-sm text-slate-900">
                          SỐ TIỀN CẦN THU TẠI QUẦY (Check-out):
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Thu trực tiếp bằng Tiền mặt, Quẹt thẻ POS hoặc VietQR khách sạn
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-extrabold text-xl text-emerald-800">
                          {formatCurrency(folioDetails.folio.remainingBalance)}
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              ) : null}
            </div>

            {/* Footer Buttons */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between shrink-0">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-slate-500" />
                <span>In / Xuất Bảng Kê</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const order = selectedOrderForFolio
                    setSelectedOrderForFolio(null)
                    if (order) handleOpenAddService(order)
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Thêm Dịch Vụ</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedOrderForFolio(null)
                    setFolioDetails(null)
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
