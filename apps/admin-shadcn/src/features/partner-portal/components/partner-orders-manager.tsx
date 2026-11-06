"use client"

import { useState } from "react"
import {
  AlertCircle,
  BedDouble,
  Building,
  Calendar,
  CheckCircle2,
  Clock,
  MapPin,
  MessageSquare,
  Phone,
  Search,
  User,
  Users,
  XCircle,
} from "lucide-react"
import type { PartnerOrderData } from "../types"

interface PartnerOrdersManagerProps {
  orders: PartnerOrderData[]
  onAcceptOrder: (orderId: string) => void
  onRejectOrder: (orderId: string, reason: string) => void
}

export function PartnerOrdersManager({
  orders,
  onAcceptOrder,
  onRejectOrder,
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
    </div>
  )
}
