"use client"

import { useMemo } from "react"
import Image from "next/image"
import {
  ArrowRight,
  FileSpreadsheet,
  Gift,
  Mail,
  MoreHorizontal,
  UserPlus,
  Users,
} from "lucide-react"
import type { CustomerItem } from "@/features/admin-customers/stayea-admin-customers-mock-data"

interface CustomersRightSidebarProps {
  customers?: readonly CustomerItem[]
  onBannerAction?: () => void
  onViewNationalityDetails?: () => void
  onViewAllRecentCustomers?: () => void
  onQuickAction?: (actionId: string) => void
}

export function CustomersRightSidebar({
  customers = [],
  onBannerAction,
  onViewNationalityDetails,
  onViewAllRecentCustomers,
  onQuickAction,
}: CustomersRightSidebarProps) {
  const totalCustomers = customers.length

  const nationalityDistribution = useMemo(() => {
    if (totalCustomers === 0) return []
    const counts: Record<string, number> = {}
    customers.forEach((c) => {
      const nat = c.nationality || "Việt Nam"
      counts[nat] = (counts[nat] || 0) + 1
    })
    const palette = ["#10b981", "#ef4444", "#f59e0b", "#3b82f6", "#8b5cf6", "#06b6d4", "#94a3b8"]
    return Object.entries(counts).map(([country, count], idx) => ({
      id: `nat-${idx}`,
      country,
      percentage: Math.round((count / totalCustomers) * 100),
      color: palette[idx % palette.length]!,
    }))
  }, [customers, totalCustomers])

  const donutSegments = useMemo(() => {
    const radius = 54
    const circumference = 2 * Math.PI * radius
    let accumulatedPercent = 0

    return nationalityDistribution.map((item) => {
      const strokeDasharray = `${(item.percentage / 100) * circumference} ${circumference}`
      const strokeDashoffset = -((accumulatedPercent / 100) * circumference)
      accumulatedPercent += item.percentage

      return {
        ...item,
        strokeDasharray,
        strokeDashoffset,
      }
    })
  }, [nationalityDistribution])

  const recentCustomers = useMemo(() => {
    return customers.slice(0, 5)
  }, [customers])

  return (
    <div className="flex flex-col gap-5">
      {/* 1. Top Promo Banner: Khách hàng hạnh phúc là hành trình bền vững */}
      <div className="relative overflow-hidden rounded-2xl aspect-[16/6] border border-slate-200/80 shadow-xs group">
        <Image
          src="/about/beach-opt-1.jpg"
          alt="Khách hàng hạnh phúc là hành trình bền vững"
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-sky-950/70 via-sky-900/35 to-transparent flex items-center justify-between p-4 sm:p-5 text-white">
          <div className="space-y-0.5">
            <h3 className="text-xs sm:text-sm font-bold tracking-tight leading-snug">
              Khách hàng hạnh phúc
            </h3>
            <p className="text-[11px] text-emerald-100 font-medium">
              là hành trình bền vững
            </p>
          </div>
          <button
            type="button"
            aria-label="Khám phá hành trình khách hàng"
            onClick={onBannerAction}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white text-slate-800 flex items-center justify-center shrink-0 shadow-md hover:scale-105 active:scale-95 transition-transform"
          >
            <ArrowRight className="w-4 h-4 text-emerald-700" />
          </button>
        </div>
      </div>

      {/* 2. Cơ cấu khách hàng theo quốc tịch */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xs sm:text-sm font-bold text-slate-800">
            Cơ cấu khách hàng theo quốc tịch
          </h2>
          <button
            type="button"
            onClick={onViewNationalityDetails}
            className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-0.5"
          >
            <span>Xem chi tiết</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Donut Chart + Legend */}
        <div className="flex items-center gap-4 pt-1">
          {/* Donut Chart Graphic */}
          <div className="relative w-32 h-32 shrink-0 flex items-center justify-center">
            <svg
              className="w-full h-full -rotate-90 transform"
              viewBox="0 0 140 140"
              aria-label="Biểu đồ tỷ lệ quốc tịch"
            >
              {/* Background circle track */}
              <circle
                cx="70"
                cy="70"
                r="54"
                fill="none"
                stroke="#f1f5f9"
                strokeWidth="20"
              />

              {/* Segments */}
              {donutSegments.map((seg) => (
                <circle
                  key={seg.id}
                  cx="70"
                  cy="70"
                  r="54"
                  fill="none"
                  stroke={seg.color}
                  strokeWidth="20"
                  strokeDasharray={seg.strokeDasharray}
                  strokeDashoffset={seg.strokeDashoffset}
                  className="transition-all duration-300"
                />
              ))}
            </svg>

            {/* Center label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
              <span className="text-base font-bold text-slate-900 tracking-tight leading-none">
                {totalCustomers}
              </span>
              <span className="text-[10px] text-slate-500 font-medium mt-0.5">
                Khách hàng
              </span>
            </div>
          </div>

          {/* Legend */}
          <div className="flex-1 space-y-1.5 text-xs">
            {nationalityDistribution.length === 0 ? (
              <div className="text-xs text-slate-400 py-2">Chưa có dữ liệu quốc tịch.</div>
            ) : (
              nationalityDistribution.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between text-slate-600 hover:text-slate-900"
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-[11px] font-medium truncate">
                      {item.country}
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-800 ml-2">
                    {item.percentage}%
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* 3. Khách hàng mới gần đây */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xs sm:text-sm font-bold text-slate-800">
            Khách hàng mới gần đây
          </h2>
          <button
            type="button"
            onClick={onViewAllRecentCustomers}
            className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-0.5"
          >
            <span>Xem tất cả</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* List of Recent Customers */}
        <div className="divide-y divide-slate-100">
          {recentCustomers.length === 0 ? (
            <div className="py-6 text-center text-xs text-slate-400 flex flex-col items-center gap-1.5">
              <Users className="w-5 h-5 text-slate-300 stroke-[1.5]" />
              <span>Chưa có khách hàng nào trong hệ thống.</span>
            </div>
          ) : (
            recentCustomers.map((customer) => (
              <div
                key={customer.id}
                className="py-2.5 first:pt-1 last:pb-1 flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="relative w-8 h-8 rounded-full overflow-hidden bg-slate-100 shrink-0 ring-1 ring-slate-200/70">
                    <Image
                      src={customer.avatar}
                      alt={customer.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-xs font-semibold text-slate-800 truncate group-hover:text-emerald-700 transition-colors">
                      {customer.name}
                    </span>
                    <span className="text-xs shrink-0">{customer.flag}</span>
                  </div>
                </div>

                <button
                  type="button"
                  aria-label={`Tùy chọn cho ${customer.name}`}
                  onClick={() => onQuickAction?.(`view-recent-${customer.id}`)}
                  className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 4. Thao tác nhanh */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs space-y-2">
        <h2 className="text-xs sm:text-sm font-bold text-slate-800 mb-2">
          Thao tác nhanh
        </h2>

        <button
          type="button"
          onClick={() => onQuickAction?.("add-customer")}
          className="w-full flex items-center gap-2.5 p-2 rounded-xl text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-emerald-700 transition-colors"
        >
          <UserPlus className="w-4 h-4 text-slate-400" />
          <span>Thêm khách hàng mới</span>
        </button>

        <button
          type="button"
          onClick={() => onQuickAction?.("import-excel")}
          className="w-full flex items-center gap-2.5 p-2 rounded-xl text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-emerald-700 transition-colors"
        >
          <FileSpreadsheet className="w-4 h-4 text-slate-400" />
          <span>Xuất tệp khách hàng</span>
        </button>

        <button
          type="button"
          onClick={() => onQuickAction?.("bulk-messages")}
          className="w-full flex items-center gap-2.5 p-2 rounded-xl text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-emerald-700 transition-colors"
        >
          <Mail className="w-4 h-4 text-slate-400" />
          <span>Gửi email/SMS hàng loạt</span>
        </button>

        <button
          type="button"
          onClick={() => onQuickAction?.("loyalty-program")}
          className="w-full flex items-center gap-2.5 p-2 rounded-xl text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-emerald-700 transition-colors"
        >
          <Gift className="w-4 h-4 text-slate-400" />
          <span>Tạo chương trình tri ân</span>
        </button>

        <button
          type="button"
          onClick={() => onQuickAction?.("segmentation")}
          className="w-full flex items-center gap-2.5 p-2 rounded-xl text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-emerald-700 transition-colors"
        >
          <Users className="w-4 h-4 text-slate-400" />
          <span>Phân nhóm khách hàng</span>
        </button>
      </div>
    </div>
  )
}
