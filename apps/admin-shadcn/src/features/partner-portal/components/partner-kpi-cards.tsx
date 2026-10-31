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
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-900/50 p-5 shadow-lg">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-emerald-400 uppercase tracking-wider">
            Doanh thu đối tác
          </span>
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Coins className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold text-white tracking-tight">
            {totalPayout.toLocaleString("vi-VN")} ₫
          </div>
          <div className="flex items-center gap-1.5 mt-1.5 text-xs text-slate-400">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Chờ đối soát: </span>
            <span className="font-semibold text-amber-300">
              {pendingPayout.toLocaleString("vi-VN")} ₫
            </span>
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-emerald-400/80 flex items-center justify-between">
          <span>Chiết khấu STAYEA: {profile.commissionRate}%</span>
          <span className="text-slate-500">Quyết toán hằng tuần</span>
        </div>
      </div>

      {/* 2. Pending Orders Card (Urgent action needed) */}
      <div
        onClick={onViewOrders}
        className={`cursor-pointer group relative overflow-hidden rounded-2xl border p-5 shadow-lg transition-all hover:scale-[1.01] ${
          pendingOrders.length > 0
            ? "bg-gradient-to-br from-rose-950/40 via-slate-900 to-slate-900 border-rose-900/60 hover:border-rose-500/60"
            : "bg-slate-900 border-slate-800 hover:border-slate-700"
        }`}
      >
        <div className="flex items-center justify-between">
          <span
            className={`text-xs font-medium uppercase tracking-wider ${
              pendingOrders.length > 0 ? "text-rose-400 font-semibold" : "text-slate-400"
            }`}
          >
            Đơn mới cần xử lý
          </span>
          <div
            className={`w-9 h-9 rounded-xl border flex items-center justify-center ${
              pendingOrders.length > 0
                ? "bg-rose-500/20 border-rose-500/40 text-rose-400 animate-pulse"
                : "bg-slate-800 border-slate-700 text-slate-400"
            }`}
          >
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline justify-between">
          <div className="text-3xl font-extrabold text-white">
            {pendingOrders.length}
          </div>
          <span className="text-xs text-slate-400 group-hover:text-emerald-400 transition-colors flex items-center gap-1">
            Xem ngay <ArrowUpRight className="w-3 h-3" />
          </span>
        </div>
        <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center gap-1.5">
          {pendingOrders.length > 0 ? (
            <span className="text-rose-300 font-medium">
              ⚠️ Có đơn từ Admin cần bạn bấm Xác Nhận!
            </span>
          ) : (
            <span className="text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Tất cả đơn đã được xử lý
            </span>
          )}
        </div>
      </div>

      {/* 3. Active Services Card */}
      <div
        onClick={onViewServices}
        className="cursor-pointer group relative overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-800/60 p-5 shadow-lg transition-all hover:scale-[1.01]"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            Dịch vụ mở bán
          </span>
          <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Package className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline justify-between">
          <div className="text-3xl font-extrabold text-white">
            {activeServicesCount}
            <span className="text-sm font-normal text-slate-500 ml-1.5">
              / {services.length} mục
            </span>
          </div>
          <span className="text-xs text-slate-400 group-hover:text-emerald-400 transition-colors flex items-center gap-1">
            Quản lý <ArrowUpRight className="w-3 h-3" />
          </span>
        </div>
        <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400">
          Loại: {profile.businessType === "homestay" ? "Villa & Bungalow" : profile.businessType === "transport" ? "Đội Xe Phú Quốc" : "Tour Đảo & Canô"}
        </div>
      </div>

      {/* 4. Rating & Fulfillment Card */}
      <div className="relative overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-lg">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-amber-400 uppercase tracking-wider">
            Uy tín & Đánh giá
          </span>
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Star className="w-5 h-5 fill-amber-400" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          {Number(profile.totalOrders) > 0 && Number(profile.rating || 0) > 0 ? (
            <>
              <div className="text-3xl font-extrabold text-white">
                {profile.rating}
              </div>
              <span className="text-xs text-amber-300 font-medium">/ 5.0 sao</span>
            </>
          ) : (
            <div className="text-lg font-bold text-slate-400">
              Chưa có đánh giá
            </div>
          )}
        </div>
        <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
          <span>Tổng đơn phục vụ:</span>
          <span className="font-semibold text-emerald-400">{profile.totalOrders} đơn</span>
        </div>
      </div>
    </div>
  )
}
