"use client"

import Image from "next/image"
import {
  ArrowRight,
  ChevronRight,
  UserPlus,
  Handshake,
  FolderTree,
  Coins,
  FileSpreadsheet,
} from "lucide-react"
import {
  EXPERIENCE_CATEGORY_DISTRIBUTION,
  POPULAR_LOCATIONS,
  QUICK_ACTIONS,
} from "@/features/admin-experiences/stayea-admin-experiences-mock-data"
import type { QuickActionItem } from "@/features/admin-experiences/stayea-admin-experiences-mock-data"

interface ExperiencesRightSidebarProps {
  onBannerAction?: () => void
  onViewCategoryDetails?: () => void
  onViewLocationDetails?: () => void
  onQuickAction?: (actionId: string) => void
}

// Calculate SVG donut segments
function calculateDonutSegments() {
  const radius = 54
  const circumference = 2 * Math.PI * radius
  let accumulatedPercent = 0

  return EXPERIENCE_CATEGORY_DISTRIBUTION.map((item) => {
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

const DONUT_SEGMENTS = calculateDonutSegments()

function renderRankBadge(rank: number) {
  if (rank === 1) {
    return (
      <div className="w-5 h-5 rounded-md bg-amber-500 text-white flex items-center justify-center shrink-0 text-[10px] font-bold shadow-xs">
        1
      </div>
    )
  }
  return (
    <div className="w-5 h-5 rounded-md bg-slate-300 text-white flex items-center justify-center shrink-0 text-[10px] font-bold">
      {rank}
    </div>
  )
}

function renderQuickActionIcon(icon: QuickActionItem["icon"]) {
  const iconClass = "w-4 h-4 text-emerald-600"
  switch (icon) {
    case "user-plus":
      return <UserPlus className={iconClass} />
    case "handshake":
      return <Handshake className={iconClass} />
    case "folder":
      return <FolderTree className={iconClass} />
    case "settings":
      return <Coins className={iconClass} />
    case "download":
      return <FileSpreadsheet className={iconClass} />
    default:
      return <UserPlus className={iconClass} />
  }
}

export function ExperiencesRightSidebar({
  onBannerAction,
  onViewCategoryDetails,
  onViewLocationDetails,
  onQuickAction,
}: ExperiencesRightSidebarProps) {
  return (
    <div className="flex flex-col gap-5">
      {/* 1. Top Promo Banner: Trải nghiệm trọn vẹn khám phá muôn nơi */}
      <div
        className="relative overflow-hidden rounded-2xl aspect-[16/6] border border-sky-100 shadow-xs group cursor-pointer"
        onClick={onBannerAction}
      >
        <Image
          src="/explore/phu-quoc.jpg"
          alt="Trải nghiệm trọn vẹn khám phá muôn nơi"
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 1024px) 100vw, 360px"
        />
        {/* Subtle light/dark gradient for high contrast readability matching design */}
        <div className="absolute inset-0 bg-gradient-to-r from-sky-900/60 via-sky-800/40 to-transparent flex items-center justify-between p-4 text-white">
          <div className="max-w-[200px]">
            <h2 className="text-sm font-bold text-white leading-snug drop-shadow-xs">
              Trải nghiệm trọn vẹn
            </h2>
            <p className="text-xs text-sky-100 font-semibold leading-snug mt-0.5 drop-shadow-xs">
              khám phá muôn nơi
            </p>
          </div>
          <button
            type="button"
            aria-label="Khám phá ngay"
            className="w-8 h-8 rounded-full bg-white text-slate-800 flex items-center justify-center shadow-md hover:bg-emerald-50 transition-colors shrink-0 group-hover:translate-x-0.5"
          >
            <ArrowRight className="w-4 h-4 text-slate-800" />
          </button>
        </div>
      </div>

      {/* 2. Donut Chart Card: Trải nghiệm theo loại hình */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h2 className="text-sm font-bold text-slate-800">
            Trải nghiệm theo loại hình
          </h2>
          <button
            type="button"
            onClick={onViewCategoryDetails}
            className="text-xs text-emerald-600 hover:text-emerald-700 font-medium inline-flex items-center gap-0.5 transition-colors"
          >
            Xem chi tiết
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="pt-3 flex items-center gap-3">
          {/* Donut Chart SVG */}
          <div className="relative w-[116px] h-[116px] shrink-0">
            <svg
              className="w-full h-full -rotate-90"
              viewBox="0 0 140 140"
              aria-label="Biểu đồ tròn phân bổ loại hình trải nghiệm"
            >
              {/* Background circle track */}
              <circle
                cx="70"
                cy="70"
                r="54"
                fill="none"
                stroke="#f1f5f9"
                strokeWidth="18"
              />

              {/* Slices */}
              {DONUT_SEGMENTS.map((seg) => (
                <circle
                  key={seg.name}
                  cx="70"
                  cy="70"
                  r="54"
                  fill="none"
                  stroke={seg.color}
                  strokeWidth="18"
                  strokeDasharray={seg.strokeDasharray}
                  strokeDashoffset={seg.strokeDashoffset}
                  className="transition-all duration-300"
                />
              ))}
            </svg>

            {/* Donut Center text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
              <span className="text-lg font-bold text-slate-900 tracking-tight leading-none">
                156
              </span>
              <span className="text-[10px] text-slate-500 font-medium mt-0.5">
                Trải nghiệm
              </span>
            </div>
          </div>

          {/* Legend */}
          <div className="flex-1 space-y-1 text-xs">
            {EXPERIENCE_CATEGORY_DISTRIBUTION.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between text-slate-600 hover:text-slate-900 py-0.5 transition-colors"
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-[11px] font-medium text-slate-600 truncate">
                    {item.name}
                  </span>
                </div>
                <div className="text-[11px] font-medium text-slate-700 shrink-0 ml-1">
                  <span>{item.percentage}%</span>
                  <span className="text-slate-400 font-normal ml-0.5">
                    ({item.count})
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Popular Locations Card: Địa điểm phổ biến */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h2 className="text-sm font-bold text-slate-800">
            Địa điểm phổ biến
          </h2>
          <button
            type="button"
            onClick={onViewLocationDetails}
            className="text-xs text-emerald-600 hover:text-emerald-700 font-medium inline-flex items-center gap-0.5 transition-colors"
          >
            Xem chi tiết
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="divide-y divide-slate-50 pt-1">
          {POPULAR_LOCATIONS.map((item) => (
            <div
              key={item.rank}
              className="py-2.5 first:pt-2 last:pb-1 flex items-center justify-between gap-3 group cursor-pointer"
              onClick={onViewLocationDetails}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {renderRankBadge(item.rank)}
                <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200/60">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                    sizes="32px"
                  />
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-semibold text-slate-800 truncate block group-hover:text-emerald-700 transition-colors">
                    {item.name}
                  </span>
                  <span className="text-[11px] text-slate-400 block">
                    {item.count} trải nghiệm
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Quick Actions Card: Thao tác nhanh */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs">
        <h2 className="text-sm font-bold text-slate-800 pb-2 border-b border-slate-100">
          Thao tác nhanh
        </h2>

        <div className="divide-y divide-slate-100/70 pt-1">
          {QUICK_ACTIONS.map((action) => (
            <button
              key={action.id}
              type="button"
              onClick={() => onQuickAction?.(action.id)}
              className="w-full py-2.5 flex items-center justify-between gap-2.5 hover:bg-slate-50/80 px-1 -mx-1 rounded-lg transition-colors text-left group"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0 border border-emerald-100/60 group-hover:bg-emerald-100/80 transition-colors">
                  {renderQuickActionIcon(action.icon)}
                </div>
                <span className="text-xs font-medium text-slate-700 group-hover:text-emerald-800 transition-colors truncate">
                  {action.label}
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all shrink-0" />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
