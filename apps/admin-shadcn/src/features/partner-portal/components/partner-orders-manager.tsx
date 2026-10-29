"use client"

import { useState } from "react"
import {
  AlertCircle,
  Bot,
  Calendar,
  CheckCircle2,
  Clock,
  MessageSquare,
  Phone,
  Search,
  User,
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
  const [activeTab, setActiveTab] = useState<
    "all" | "sent_to_partner" | "partner_accepted" | "completed" | "rejected"
  >("sent_to_partner")

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
    if (activeTab === "sent_to_partner") return o.status === "sent_to_partner"
    if (activeTab === "partner_accepted")
      return o.status === "partner_accepted" || o.status === "in_progress"
    if (activeTab === "completed") return o.status === "completed"
    if (activeTab === "rejected")
      return o.status === "partner_rejected" || o.status === "cancelled"

    return true
  })

  const pendingCount = orders.filter((o) => o.status === "sent_to_partner").length

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
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>Tiếp Nhận & Xử Lý Đơn Hàng</span>
            {pendingCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full bg-rose-500 text-white text-xs font-bold animate-bounce">
                {pendingCount} đơn mới
              </span>
            )}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Các đơn hàng do AI Agent tư vấn hoặc khách đặt đã được Admin thẩm định và điều phối tới bạn.
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
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex space-x-2 border-b border-slate-800 pb-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab("sent_to_partner")}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeTab === "sent_to_partner"
              ? "bg-rose-950/80 text-rose-300 border border-rose-800/60 font-semibold"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <span>Chờ xác nhận</span>
          {pendingCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px]">
              {pendingCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("partner_accepted")}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
            activeTab === "partner_accepted"
              ? "bg-blue-950/80 text-blue-300 border border-blue-800/60 font-semibold"
              : "text-slate-400 hover:text-white"
          }`}
        >
          Đang phục vụ
        </button>

        <button
          onClick={() => setActiveTab("completed")}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
            activeTab === "completed"
              ? "bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 font-semibold"
              : "text-slate-400 hover:text-white"
          }`}
        >
          Đã hoàn thành
        </button>

        <button
          onClick={() => setActiveTab("rejected")}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
            activeTab === "rejected"
              ? "bg-slate-800 text-slate-300 border border-slate-700 font-semibold"
              : "text-slate-400 hover:text-white"
          }`}
        >
          Đã từ chối / Hủy
        </button>

        <button
          onClick={() => setActiveTab("all")}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
            activeTab === "all"
              ? "bg-slate-800 text-white font-semibold"
              : "text-slate-400 hover:text-white"
          }`}
        >
          Tất cả ({orders.length})
        </button>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/60 rounded-2xl border border-dashed border-slate-800">
          <Clock className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-300">Không có đơn hàng nào trong mục này</h3>
          <p className="text-xs text-slate-500 mt-1">
            Khi Admin duyệt đơn mới của khách, đơn sẽ lập tức xuất hiện tại đây để bạn xác nhận.
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
                className={`relative overflow-hidden rounded-2xl bg-slate-900 border transition-all p-5 ${
                  isPendingAction
                    ? "border-rose-800/80 shadow-lg shadow-rose-950/20 bg-gradient-to-r from-slate-900 via-slate-900 to-rose-950/10"
                    : "border-slate-800 hover:border-slate-700"
                }`}
              >
                {/* Header Row: Order Code, Badges, Payout */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-mono text-sm font-bold text-white tracking-wide">
                      {order.orderCode}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-md text-[11px] font-medium border ${badge.color}`}
                    >
                      {badge.label}
                    </span>
                    {order.source === "ai_agent" && (
                      <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[11px] font-semibold flex items-center gap-1">
                        <Bot className="w-3.5 h-3.5" />
                        <span>AI Agent Chốt Đơn</span>
                      </span>
                    )}
                  </div>

                  {/* Partner Payout Amount */}
                  <div className="text-left sm:text-right">
                    <div className="text-xs text-slate-400">Tiền thực nhận đối tác:</div>
                    <div className="text-lg font-bold text-emerald-400">
                      {Number.parseInt(order.partnerPayoutAmount).toLocaleString("vi-VN")} ₫
                      <span className="text-xs font-normal text-slate-400 ml-1">
                        (Giá gốc: {Number.parseInt(order.totalAmount).toLocaleString("vi-VN")} ₫)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Main Content Grid: Customer & Service Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-xs">
                  {/* Col 1: Service & Timing */}
                  <div>
                    <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400">
                      Dịch vụ yêu cầu
                    </span>
                    <div className="font-bold text-white text-sm mt-1">
                      {order.serviceTitle}
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-300 mt-1.5">
                      <Calendar className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>
                        {order.startDate}
                        {order.endDate ? ` → ${order.endDate}` : ""}
                      </span>
                    </div>
                    <div className="text-slate-400 mt-1">
                      Số lượng: <span className="text-white font-semibold">{order.quantity}</span>
                    </div>
                  </div>

                  {/* Col 2: Customer Contact */}
                  <div>
                    <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400">
                      Khách hàng liên hệ
                    </span>
                    <div className="font-semibold text-white mt-1 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>{order.customerName}</span>
                    </div>
                    <div className="text-emerald-400 font-mono mt-1 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-emerald-400" />
                      <a href={`tel:${order.customerPhone}`} className="hover:underline">
                        {order.customerPhone}
                      </a>
                    </div>
                    {order.customerEmail && (
                      <div className="text-slate-400 mt-1">{order.customerEmail}</div>
                    )}
                  </div>

                  {/* Col 3: Admin & Special Notes */}
                  <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                    <span className="text-[11px] uppercase tracking-wider font-semibold text-amber-400 flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Ghi chú từ Admin</span>
                    </span>
                    <p className="text-slate-300 mt-1 text-[11px] leading-relaxed">
                      {order.adminNotes || "Không có ghi chú thêm từ Admin."}
                    </p>
                    {order.partnerNotes && (
                      <div className="mt-2 pt-2 border-t border-slate-700 text-emerald-300 text-[11px]">
                        <strong>Ghi chú của bạn:</strong> {order.partnerNotes}
                      </div>
                    )}
                    {order.rejectionReason && (
                      <div className="mt-2 pt-2 border-t border-slate-700 text-rose-300 text-[11px]">
                        <strong>Lý do từ chối:</strong> {order.rejectionReason}
                      </div>
                    )}
                  </div>
                </div>

                {/* Urgent Action Row for Pending Dispatch */}
                {isPendingAction && (
                  <div className="mt-5 pt-4 border-t border-rose-900/40 flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-2 text-rose-300 text-xs">
                      <AlertCircle className="w-4 h-4 text-rose-400 animate-pulse" />
                      <span>
                        Admin đã kiểm tra cọc và chuyển đơn. Vui lòng xác nhận để giữ phòng/xe!
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleOpenReject(order.id)}
                        className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-rose-950/80 hover:text-rose-300 border border-slate-700 hover:border-rose-800 text-xs font-semibold text-slate-300 transition-colors flex items-center gap-1.5"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Từ chối đơn</span>
                      </button>

                      <button
                        onClick={() => onAcceptOrder(order.id)}
                        className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-950 transition-all flex items-center gap-1.5"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl text-white">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <XCircle className="w-5 h-5 text-rose-400" />
              <span>Xác Nhận Từ Chối Đơn</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Vui lòng cho biết lý do từ chối để Admin hỗ trợ điều phối sang đối tác khác cho khách:
            </p>

            <textarea
              rows={3}
              placeholder="Ví dụ: Xe đang bảo dưỡng đột xuất, ngày này đã kín phòng offline..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full mt-3 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
            />

            <div className="mt-4 flex items-center justify-end gap-3">
              <button
                onClick={() => setRejectionModalOrderId(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800"
              >
                Quay lại
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500"
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
