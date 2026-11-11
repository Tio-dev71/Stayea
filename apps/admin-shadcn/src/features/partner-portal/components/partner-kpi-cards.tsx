"use client"

import {
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Coins,
  Package,
  Star,
} from "lucide-react"
import type { PartnerOrderData, PartnerProfileData, PartnerServiceData } from "../types"

interface PartnerKpiCardsProps {
  profile: PartnerProfileData
  services: PartnerServiceData[]
  orders: PartnerOrderData[]
  onViewOrders: () => void
  onViewServices: () => void
}

export function PartnerKpiCards({
  profile,
  services,
  orders,
  onViewOrders,
  onViewServices,
}: PartnerKpiCardsProps) {
  // Calculations
  const pendingOrders = orders.filter((o) => o.status === "sent_to_partner")
  const inProgressOrders = orders.filter(
    (o) => o.status === "partner_accepted" || o.status === "in_progress"
  )
  const completedOrders = orders.filter((o) => o.status === "completed")

  const totalPayout = completedOrders.reduce(
    (sum, o) => sum + Number.parseFloat(o.partnerPayoutAmount || "0"),
    0
  )
  const pendingPayout = inProgressOrders.reduce(
    (sum, o) => sum + Number.parseFloat(o.partnerPayoutAmount || "0"),
    0
  )

  const activeServicesCount = services.filter((s) => s.status === "active").length

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Revenue Card */}
      <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200/90 p-5 shadow-xs hover:shadow-md transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Doanh thu đối tác
          </span>
          <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
            <Coins className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold text-slate-900 tracking-tight">
            {totalPayout.toLocaleString("vi-VN")} ₫
          </div>
          <div className="flex items-center gap-1.5 mt-1.5 text-xs text-slate-500">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>Chờ đối soát: </span>
            <span className="font-semibold text-amber-700">
              {pendingPayout.toLocaleString("vi-VN")} ₫
            </span>
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
          <span>Chiết khấu STAYEA: <strong className="text-slate-700 font-semibold">{profile.commissionRate}%</strong></span>
          <span className="text-slate-400">Quyết toán hằng tuần</span>
        </div>
      </div>

      {/* 2. Pending Orders Card (Urgent action needed) */}
      <div
        onClick={onViewOrders}
        className={`cursor-pointer group relative overflow-hidden rounded-2xl border p-5 shadow-xs transition-all hover:scale-[1.01] ${pendingOrders.length > 0
          ? "bg-rose-50/70 border-rose-200 hover:border-rose-300 hover:shadow-md"
          : "bg-white border-slate-200/90 hover:border-slate-300 hover:shadow-md"
          }`}
      >
        <div className="flex items-center justify-between">
          <span
            className={`text-xs font-semibold uppercase tracking-wider ${pendingOrders.length > 0 ? "text-rose-700 font-bold" : "text-slate-500"
              }`}
          >
            Đơn mới cần xử lý
          </span>
          <div
            className={`w-9 h-9 rounded-xl border flex items-center justify-center ${pendingOrders.length > 0
              ? "bg-rose-100 border-rose-300 text-rose-700 animate-pulse"
              : "bg-slate-50 border-slate-200 text-slate-500"
              }`}
          >
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline justify-between">
          <div className={`text-3xl font-extrabold ${pendingOrders.length > 0 ? "text-rose-950" : "text-slate-900"}`}>
            {pendingOrders.length}
          </div>
          <span className="text-xs text-slate-500 group-hover:text-emerald-700 transition-colors flex items-center gap-1 font-medium">
            Xem ngay <ArrowUpRight className="w-3 h-3" />
          </span>
        </div>
        <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center gap-1.5">
          {pendingOrders.length > 0 ? (
            <span className="text-rose-700 font-semibold">
              ⚠️ Có đơn đặt từ khách cần bạn bấm Xác Nhận!
            </span>
          ) : (
            <span className="text-emerald-700 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Tất cả đơn đã được xử lý
            </span>
          )}
        </div>
      </div>

      {/* 3. Active Services Card */}
      <div
        onClick={onViewServices}
        className="cursor-pointer group relative overflow-hidden rounded-2xl bg-white border border-slate-200/90 hover:border-slate-300 p-5 shadow-xs hover:shadow-md transition-all hover:scale-[1.01]"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Dịch vụ mở bán
          </span>
          <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
            <Package className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline justify-between">
          <div className="text-3xl font-extrabold text-slate-900">
            {activeServicesCount}
            <span className="text-sm font-normal text-slate-400 ml-1.5">
              / {services.length} mục
            </span>
          </div>
          <span className="text-xs text-slate-500 group-hover:text-emerald-700 transition-colors flex items-center gap-1 font-medium">
            Quản lý <ArrowUpRight className="w-3 h-3" />
          </span>
        </div>
        <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
          Loại: {profile.businessType === "homestay" ? "Villa & Homestay" : profile.businessType === "transport" ? "Đội Xe Phú Quốc" : "Tour Đảo & Canô"}
        </div>
      </div>

      {/* 4. Rating & Fulfillment Card */}
      <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200/90 p-5 shadow-xs hover:shadow-md transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Uy tín & Đánh giá
          </span>
          <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
            <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          {Number(profile.totalOrders) > 0 && Number(profile.rating || 0) > 0 ? (
            <>
              <div className="text-3xl font-extrabold text-slate-900">
                {profile.rating}
              </div>
              <span className="text-xs text-amber-700 font-semibold">/ 5.0 sao</span>
            </>
          ) : (
            <div className="text-lg font-bold text-slate-400">
              Chưa có đánh giá
            </div>
          )}
        </div>
        <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
          <span>Tổng đơn phục vụ:</span>
          <span className="font-semibold text-emerald-700">{profile.totalOrders} đơn</span>
        </div>
      </div>
    </div>
  )
}
