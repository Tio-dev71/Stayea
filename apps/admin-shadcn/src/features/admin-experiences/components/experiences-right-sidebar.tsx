"use client"

import { useMemo } from "react"
import Image from "next/image"
import {
  ArrowRight,
  ChevronRight,
  UserPlus,
  Handshake,
  FolderTree,
  Coins,
  FileSpreadsheet,
  Compass,
} from "lucide-react"
import type { ExperienceItem } from "@/features/admin-experiences/stayea-admin-experiences-mock-data"

interface ExperiencesRightSidebarProps {
  experiences?: readonly ExperienceItem[]
  onBannerAction?: () => void
  onViewCategoryDetails?: () => void
  onViewLocationDetails?: () => void
  onQuickAction?: (actionId: string) => void
}

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

export function ExperiencesRightSidebar({
  experiences = [],
  onBannerAction,
  onViewCategoryDetails,
  onViewLocationDetails,
  onQuickAction,
}: ExperiencesRightSidebarProps) {
  const totalCount = experiences.length

  const categoryDistribution = useMemo(() => {
    if (totalCount === 0) return []
    const counts: Record<string, number> = {}
    experiences.forEach((exp) => {
      const cat = exp.category || "Tour trải nghiệm"
      counts[cat] = (counts[cat] || 0) + 1
    })
    const palette = ["#10b981", "#059669", "#047857", "#065f46", "#34d399", "#6ee7b7"]
    return Object.entries(counts).map(([name, count], idx) => ({
      name,
      count,
      percentage: Math.round((count / totalCount) * 100),
      color: palette[idx % palette.length]!,
    }))
  }, [experiences, totalCount])

  const donutSegments = useMemo(() => {
    const radius = 54
    const circumference = 2 * Math.PI * radius
    let accumulatedPercent = 0

    return categoryDistribution.map((item) => {
      const strokeDasharray = `${(item.percentage / 100) * circumference} ${circumference}`
      const strokeDashoffset = -((accumulatedPercent / 100) * circumference)
      accumulatedPercent += item.percentage

      return {
        ...item,
        strokeDasharray,
        strokeDashoffset,
      }
    })
  }, [categoryDistribution])

  const popularLocations = useMemo(() => {
    if (totalCount === 0) return []
    const counts: Record<string, number> = {}
    experiences.forEach((exp) => {
      const loc = exp.location || "Phú Quốc"
      counts[loc] = (counts[loc] || 0) + 1
    })
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count], idx) => ({
        rank: idx + 1,
        name,
        count,
        image: "/experience/cano-4-islands.jpg",
      }))
  }, [experiences, totalCount])

  return (
    <div className="flex flex-col gap-5">
      {/* 1. Top Banner Card */}
      <div className="relative overflow-hidden rounded-2xl aspect-[16/7] border border-slate-200/80 shadow-xs group">
        <Image
          src="/experience/cano-4-islands.jpg"
          alt="Trải nghiệm độc bản"
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 1024px) 100vw, 360px"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/85 via-emerald-900/50 to-transparent flex items-center justify-between p-4 sm:p-5 text-white">
          <div className="space-y-1">
            <h3 className="text-xs sm:text-sm font-bold tracking-tight leading-snug">
              Trải nghiệm độc bản
            </h3>
            <p className="text-[11px] text-emerald-100 font-medium">
              Khám phá trọn vẹn đảo ngọc
            </p>
          </div>
          <button
            type="button"
            aria-label="Khám phá trải nghiệm"
            onClick={onBannerAction}
            className="w-8 h-8 rounded-full bg-white text-slate-800 flex items-center justify-center shrink-0 shadow-md hover:scale-105 active:scale-95 transition-transform"
          >
            <ArrowRight className="w-4 h-4 text-emerald-700" />
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
              <circle
                cx="70"
                cy="70"
                r="54"
                fill="none"
                stroke="#f1f5f9"
                strokeWidth="18"
              />

              {donutSegments.map((seg) => (
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

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
              <span className="text-lg font-bold text-slate-900 tracking-tight leading-none">
                {totalCount}
              </span>
              <span className="text-[10px] text-slate-500 font-medium mt-0.5">
                Trải nghiệm
              </span>
            </div>
          </div>

          {/* Legend */}
          <div className="flex-1 space-y-1 text-xs">
            {categoryDistribution.length === 0 ? (
              <div className="text-xs text-slate-400 py-2">Chưa có loại hình trải nghiệm.</div>
            ) : (
              categoryDistribution.map((item) => (
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
              ))
            )}
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
          {popularLocations.length === 0 ? (
            <div className="py-6 text-center text-xs text-slate-400 flex flex-col items-center gap-1.5">
              <Compass className="w-5 h-5 text-slate-300 stroke-[1.5]" />
              <span>Chưa có địa điểm tour nào được ghi nhận.</span>
            </div>
          ) : (
            popularLocations.map((item) => (
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
            ))
          )}
        </div>
      </div>

      {/* 4. Quick Actions Card: Thao tác nhanh */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs">
        <h2 className="text-sm font-bold text-slate-800 pb-2 border-b border-slate-100">
          Thao tác nhanh
        </h2>

        <div className="divide-y divide-slate-100/70 pt-1">
          <button
            type="button"
            onClick={() => onQuickAction?.("add_new")}
            className="w-full py-2.5 flex items-center justify-between gap-2.5 hover:bg-slate-50/80 px-1 -mx-1 rounded-lg transition-colors text-left group"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0 border border-emerald-100/60 group-hover:bg-emerald-100/80 transition-colors">
                <UserPlus className="w-4 h-4 text-emerald-600" />
              </div>
              <span className="text-xs font-medium text-slate-700 group-hover:text-emerald-800 transition-colors truncate">
                Thêm trải nghiệm mới
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all shrink-0" />
          </button>

          <button
            type="button"
            onClick={() => onQuickAction?.("partners")}
            className="w-full py-2.5 flex items-center justify-between gap-2.5 hover:bg-slate-50/80 px-1 -mx-1 rounded-lg transition-colors text-left group"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0 border border-emerald-100/60 group-hover:bg-emerald-100/80 transition-colors">
                <Handshake className="w-4 h-4 text-emerald-600" />
              </div>
              <span className="text-xs font-medium text-slate-700 group-hover:text-emerald-800 transition-colors truncate">
                Đối tác cung cấp
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all shrink-0" />
          </button>

          <button
            type="button"
            onClick={() => onQuickAction?.("categories")}
            className="w-full py-2.5 flex items-center justify-between gap-2.5 hover:bg-slate-50/80 px-1 -mx-1 rounded-lg transition-colors text-left group"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0 border border-emerald-100/60 group-hover:bg-emerald-100/80 transition-colors">
                <FolderTree className="w-4 h-4 text-emerald-600" />
              </div>
              <span className="text-xs font-medium text-slate-700 group-hover:text-emerald-800 transition-colors truncate">
                Quản lý danh mục
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all shrink-0" />
          </button>

          <button
            type="button"
            onClick={() => onQuickAction?.("pricing")}
            className="w-full py-2.5 flex items-center justify-between gap-2.5 hover:bg-slate-50/80 px-1 -mx-1 rounded-lg transition-colors text-left group"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0 border border-emerald-100/60 group-hover:bg-emerald-100/80 transition-colors">
                <Coins className="w-4 h-4 text-emerald-600" />
              </div>
              <span className="text-xs font-medium text-slate-700 group-hover:text-emerald-800 transition-colors truncate">
                Chính sách giá & chiết khấu
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all shrink-0" />
          </button>

          <button
            type="button"
            onClick={() => onQuickAction?.("export")}
            className="w-full py-2.5 flex items-center justify-between gap-2.5 hover:bg-slate-50/80 px-1 -mx-1 rounded-lg transition-colors text-left group"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0 border border-emerald-100/60 group-hover:bg-emerald-100/80 transition-colors">
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              </div>
              <span className="text-xs font-medium text-slate-700 group-hover:text-emerald-800 transition-colors truncate">
                Xuất file Excel/CSV
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all shrink-0" />
          </button>
        </div>
      </div>
    </div>
  )
}
