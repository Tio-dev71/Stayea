"use client"

import Image from "next/image"
import {
  ArrowRight,
  ChevronRight,
  Crown,
  FileSpreadsheet,
  FileText,
  Mail,
  Percent,
  UserPlus,
} from "lucide-react"
import {
  HOST_REGIONAL_DISTRIBUTION,
  TOP_PERFORMING_HOSTS,
} from "@/features/admin-hosts/stayea-admin-hosts-mock-data"

interface HostsRightSidebarProps {
  onBannerAction?: () => void
  onViewRegionalDetails?: () => void
  onViewAllTopHosts?: () => void
  onQuickAction?: (actionId: string) => void
}

// Calculate SVG donut segments for regional distribution
function calculateRegionalDonutSegments() {
  const radius = 54
  const circumference = 2 * Math.PI * radius
  let accumulatedPercent = 0

  return HOST_REGIONAL_DISTRIBUTION.map((item) => {
    const strokeDasharray = `${(item.percentage / 100) * circumference} ${circumference}`
    const strokeDashoffset = -((accumulatedPercent / 100) * circumference)
    accumulatedPercent += item.percentage

    return {
      ...item,
      strokeDasharray,
      strokeDashoffset,
    }
  })
}

const REGIONAL_DONUT_SEGMENTS = calculateRegionalDonutSegments()

function renderRankBadge(rank: number) {
  if (rank === 1) {
    return (
      <div className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
        <Crown className="w-3 h-3 text-amber-600" />
      </div>
    )
  }
  if (rank === 2) {
    return (
      <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 text-[10px] font-bold">
        2
      </div>
    )
  }
  if (rank === 3) {
    return (
      <div className="w-5 h-5 rounded-full bg-amber-50 text-amber-800 border border-amber-200/60 flex items-center justify-center shrink-0 text-[10px] font-bold">
        3
      </div>
    )
  }
  return (
    <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center shrink-0 text-[10px] font-medium">
      {rank}
    </div>
  )
}

export function HostsRightSidebar({
  onBannerAction,
  onViewRegionalDetails,
  onViewAllTopHosts,
  onQuickAction,
}: HostsRightSidebarProps) {
  return (
    <div className="flex flex-col gap-5">
      {/* 1. Top Promo Banner: Cùng chủ nhà kiến tạo những hành trình đáng nhớ */}
      <div className="relative overflow-hidden rounded-2xl aspect-[16/6] border border-slate-200/80 shadow-xs group">
        <Image
          src="/about/beach-opt-2.jpg"
          alt="Cùng chủ nhà kiến tạo những hành trình đáng nhớ"
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-sky-950/70 via-sky-900/35 to-transparent flex items-center justify-between p-4 sm:p-5 text-white">
          <div className="space-y-0.5">
            <h3 className="text-xs sm:text-sm font-bold tracking-tight leading-snug">
              Cùng chủ nhà kiến tạo
            </h3>
            <p className="text-[11px] text-emerald-100 font-medium">
              những hành trình đáng nhớ
            </p>
          </div>
          <button
            type="button"
            aria-label="Khám phá hợp tác"
            onClick={onBannerAction}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white text-slate-800 flex items-center justify-center shrink-0 shadow-md hover:scale-105 active:scale-95 transition-transform"
          >
            <ArrowRight className="w-4 h-4 text-emerald-700" />
          </button>
        </div>
      </div>

      {/* 2. Hiệu suất theo khu vực (Donut Chart) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xs sm:text-sm font-bold text-slate-800">
            Hiệu suất theo khu vực
          </h2>
          <button
            type="button"
            onClick={onViewRegionalDetails}
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
              aria-label="Biểu đồ hiệu suất khu vực"
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
              {REGIONAL_DONUT_SEGMENTS.map((seg) => (
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
                428
              </span>
              <span className="text-[10px] text-slate-500 font-medium mt-0.5">
                Chủ nhà/Đối tác
              </span>
            </div>
          </div>

          {/* Legend */}
          <div className="flex-1 space-y-1.5 text-xs">
            {HOST_REGIONAL_DISTRIBUTION.map((item) => (
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
                    {item.region}
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-slate-800 ml-2 whitespace-nowrap">
                  {item.percentage}% ({item.count})
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Top chủ nhà/đối tác xuất sắc */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xs sm:text-sm font-bold text-slate-800">
            Top chủ nhà/đối tác xuất sắc
          </h2>
          <button
            type="button"
            onClick={onViewAllTopHosts}
            className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-0.5"
          >
            <span>Xem tất cả</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* List of 5 Top Performing Hosts */}
        <div className="divide-y divide-slate-100">
          {TOP_PERFORMING_HOSTS.map((item) => (
            <div
              key={item.id}
              className="py-2.5 first:pt-1 last:pb-1 flex items-center justify-between gap-3 group"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {renderRankBadge(item.rank)}
                <div className="relative w-8 h-8 rounded-full overflow-hidden bg-slate-100 shrink-0 ring-1 ring-slate-200/70">
                  <Image
                    src={item.avatar}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-semibold text-slate-800 truncate block group-hover:text-emerald-700 transition-colors">
                    {item.name}
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium block">
                    {item.revenue}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Thao tác nhanh */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs space-y-3">
        <h2 className="text-xs sm:text-sm font-bold text-slate-800">
          Thao tác nhanh
        </h2>

        <div className="space-y-1.5">
          <button
            type="button"
            onClick={() => onQuickAction?.("add-host")}
            className="w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 group-hover:bg-emerald-100 transition-colors">
                <UserPlus className="w-3.5 h-3.5" />
              </div>
              <span>Thêm chủ nhà/đối tác mới</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <button
            type="button"
            onClick={() => onQuickAction?.("invite-partner")}
            className="w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 group-hover:bg-emerald-100 transition-colors">
                <Mail className="w-3.5 h-3.5" />
              </div>
              <span>Gửi lời mời hợp tác</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <button
            type="button"
            onClick={() => onQuickAction?.("manage-contracts")}
            className="w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 group-hover:bg-emerald-100 transition-colors">
                <FileText className="w-3.5 h-3.5" />
              </div>
              <span>Quản lý hợp đồng</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <button
            type="button"
            onClick={() => onQuickAction?.("set-commission")}
            className="w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 group-hover:bg-emerald-100 transition-colors">
                <Percent className="w-3.5 h-3.5" />
              </div>
              <span>Thiết lập hoa hồng</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <button
            type="button"
            onClick={() => onQuickAction?.("export-partners")}
            className="w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 group-hover:bg-emerald-100 transition-colors">
                <FileSpreadsheet className="w-3.5 h-3.5" />
              </div>
              <span>Xuất danh sách đối tác</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  )
}
