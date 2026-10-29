"use client"

import { useState } from "react"
import {
  AlertTriangle,
  Bot,
  Calendar,
  Clock,
  ExternalLink,
  MessageSquare,
  Phone,
  Send,
  User,
  XCircle,
} from "lucide-react"
import { toast } from "sonner"
import { DEMO_PARTNER_ORDERS } from "@/features/partner-portal/mock-partners"
import type { PartnerOrderData } from "@/features/partner-portal/types"

interface AdminOrderApprovalQueueProps {
  onNavigatePartnerHub?: () => void
}

export function AdminOrderApprovalQueue({
  onNavigatePartnerHub,
}: AdminOrderApprovalQueueProps) {
  const [orders, setOrders] = useState<PartnerOrderData[]>(DEMO_PARTNER_ORDERS)
  const [filterStatus, setFilterStatus] = useState<
    "all" | "pending_admin" | "sent_to_partner" | "partner_accepted" | "completed"
  >("pending_admin")

  const pendingAdminCount = orders.filter((o) => o.status === "pending_admin").length

  const handleApproveAndDispatch = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: "sent_to_partner",
              adminNotes:
                o.adminNotes ||
                "Admin đã kiểm tra thông tin cọc và duyệt điều phối đơn tới đối tác.",
            }
          : o
      )
    )
    toast.success("Đã phê duyệt & điều phối đơn thành công!", {
      description: "Đơn hàng đã được chuyển sang Cổng Đối tác để nhà xe/chủ homestay bấm xác nhận đón khách.",
    })
  }

  const handleRejectOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: "cancelled",
              adminNotes: "Admin đã từ chối duyệt đơn do không đủ điều kiện.",
            }
          : o
      )
    )
    toast.error("Đã hủy đơn hàng")
  }

  const filtered = orders.filter((o) => {
    if (filterStatus === "all") return true
    if (filterStatus === "pending_admin") return o.status === "pending_admin"
    if (filterStatus === "sent_to_partner") return o.status === "sent_to_partner"
    if (filterStatus === "partner_accepted")
      return o.status === "partner_accepted" || o.status === "in_progress"
    if (filterStatus === "completed") return o.status === "completed"
    return true
  })

  return (
    <div className="space-y-6">
      {/* Intro & Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-[#062420] border border-emerald-800/40 p-6 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold mb-2">
              <Bot className="w-3.5 h-3.5" />
              <span>Quy trình Kiểm Duyệt & Điều Phối Đơn Hàng</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight">
              Hàng Đợi Duyệt Đơn (AI Agent / Khách &rarr; Admin &rarr; Partner)
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Mọi đơn hàng do <strong>AI Agent</strong> tư vấn tự động hoặc khách đặt sẽ được tập hợp tại đây ở trạng thái <em>Chờ duyệt</em>. Admin kiểm tra tính hợp lệ trước khi bấm &quot;Duyệt &amp; Điều phối tới Đối tác&quot;.
            </p>
          </div>

          {onNavigatePartnerHub && (
            <button
              onClick={onNavigatePartnerHub}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-950 flex items-center gap-2 shrink-0 transition-all"
            >
              <span>Mở Cổng Đối Tác (Partner Hub)</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-3 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setFilterStatus("pending_admin")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              filterStatus === "pending_admin"
                ? "bg-amber-600 text-white shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Chờ Admin Phê Duyệt</span>
            {pendingAdminCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-white text-amber-700 text-[10px] font-bold">
                {pendingAdminCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setFilterStatus("sent_to_partner")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filterStatus === "sent_to_partner"
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Đã chuyển đối tác
          </button>

          <button
            onClick={() => setFilterStatus("partner_accepted")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filterStatus === "partner_accepted"
                ? "bg-emerald-600 text-white shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Đối tác đã nhận
          </button>

          <button
            onClick={() => setFilterStatus("completed")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filterStatus === "completed"
                ? "bg-teal-700 text-white shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Đã hoàn thành
          </button>

          <button
            onClick={() => setFilterStatus("all")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filterStatus === "all"
                ? "bg-slate-800 text-white shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Tất cả ({orders.length})
          </button>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filtered.map((order) => {
          const isPendingAdmin = order.status === "pending_admin"

          return (
            <div
              key={order.id}
              className={`rounded-2xl border p-5 transition-all bg-white ${
                isPendingAdmin
                  ? "border-amber-300 shadow-md ring-2 ring-amber-400/20"
                  : "border-slate-200/80 shadow-xs hover:border-slate-300"
              }`}
            >
              {/* Row 1: Code, Source & Status */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-mono text-sm font-bold text-slate-900">
                    {order.orderCode}
                  </span>

                  {order.source === "ai_agent" && (
                    <span className="px-2.5 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200 text-xs font-semibold flex items-center gap-1">
                      <Bot className="w-3.5 h-3.5 text-purple-600" />
                      <span>AI Agent Tư Vấn &amp; Tạo Đơn</span>
                    </span>
                  )}

                  {isPendingAdmin ? (
                    <span className="px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Chờ Admin Thẩm Định</span>
                    </span>
                  ) : order.status === "sent_to_partner" ? (
                    <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold">
                      Đã điều phối tới Đối tác
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
                      {order.status}
                    </span>
                  )}
                </div>

                {/* Amount breakdown */}
                <div className="text-left sm:text-right">
                  <div className="text-xs text-slate-500">Khách thanh toán:</div>
                  <div className="text-base font-bold text-slate-900">
                    {Number.parseInt(order.totalAmount).toLocaleString("vi-VN")} ₫
                    <span className="text-xs font-normal text-emerald-600 ml-1.5">
                      (Hoa hồng STAYEA: {Number.parseInt(order.commissionAmount).toLocaleString("vi-VN")} ₫)
                    </span>
                  </div>
                </div>
              </div>

              {/* Row 2: Customer & Service details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-xs">
                <div>
                  <div className="font-semibold text-slate-400 uppercase tracking-wider text-[11px]">
                    Dịch vụ yêu cầu
                  </div>
                  <div className="font-bold text-slate-900 text-sm mt-1">
                    {order.serviceTitle}
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600 mt-1">
                    <Calendar className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>
                      {order.startDate} {order.endDate ? `→ ${order.endDate}` : ""}
                    </span>
                  </div>
                  <div className="text-slate-500 mt-0.5">
                    Số lượng: <strong className="text-slate-800">{order.quantity}</strong>
                  </div>
                </div>

                <div>
                  <div className="font-semibold text-slate-400 uppercase tracking-wider text-[11px]">
                    Thông tin khách hàng
                  </div>
                  <div className="font-bold text-slate-900 mt-1 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>{order.customerName}</span>
                  </div>
                  <div className="text-emerald-700 font-mono mt-0.5 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    <a href={`tel:${order.customerPhone}`} className="hover:underline">
                      {order.customerPhone}
                    </a>
                  </div>
                  {order.customerEmail && (
                    <div className="text-slate-500 mt-0.5">{order.customerEmail}</div>
                  )}
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="font-semibold text-slate-700 flex items-center gap-1 text-[11px]">
                    <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
                    <span>Ghi chú yêu cầu</span>
                  </div>
                  <p className="text-slate-600 mt-1 leading-relaxed text-[11px]">
                    {order.adminNotes || "Khách đặt dịch vụ tiêu chuẩn."}
                  </p>
                  <div className="mt-2 pt-2 border-t border-slate-200 text-emerald-700 font-semibold text-[11px]">
                    Tiền thanh toán cho Đối tác (Payout): {Number.parseInt(order.partnerPayoutAmount).toLocaleString("vi-VN")} ₫
                  </div>
                </div>
              </div>

              {/* Action Bar for Pending Admin */}
              {isPendingAdmin && (
                <div className="mt-5 pt-4 border-t border-amber-200 flex items-center justify-between flex-wrap gap-3 bg-amber-50/50 -mx-5 -mb-5 p-4 rounded-b-2xl">
                  <div className="text-xs text-amber-800 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>
                      Đơn chờ Admin duyệt để gửi cho Đối tác (Nhà xe / Homestay).
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleRejectOrder(order.id)}
                      className="px-3 py-1.5 rounded-xl border border-rose-300 text-rose-700 bg-white hover:bg-rose-50 text-xs font-semibold transition-colors flex items-center gap-1"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Từ chối</span>
                    </button>

                    <button
                      onClick={() => handleApproveAndDispatch(order.id)}
                      className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Duyệt &amp; Điều Phối Tới Đối Tác</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
