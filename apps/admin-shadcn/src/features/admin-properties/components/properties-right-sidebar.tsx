"use client"

import { useMemo } from "react"
import Image from "next/image"
import {
  ArrowRight,
  ChevronRight,
  PlusCircle,
  FileSpreadsheet,
  Layers,
  ShieldCheck,
} from "lucide-react"
import type { PropertyItem } from "@/features/admin-properties/stayea-admin-properties-mock-data"

interface PropertiesRightSidebarProps {
  properties?: readonly PropertyItem[]
  onBannerAction?: () => void
  onViewAreaDetails?: () => void
  onViewTypeDetails?: () => void
  onQuickAction?: (actionId: string) => void
}

export function PropertiesRightSidebar({
  properties = [],
  onBannerAction,
  onViewAreaDetails,
  onViewTypeDetails,
  onQuickAction,
}: PropertiesRightSidebarProps) {
  const totalProperties = properties.length

  const areaDistribution = useMemo(() => {
    if (totalProperties === 0) return []
    const counts: Record<string, number> = {}
    properties.forEach((p) => {
      const area = p.location || "Phú Quốc"
      counts[area] = (counts[area] || 0) + 1
    })
    const palette = ["#10b981", "#eab308", "#3b82f6", "#f97316", "#06b6d4", "#a855f7", "#22c55e"]
    return Object.entries(counts).map(([area, count], idx) => ({
      id: `area-${idx}`,
      area,
      count,
      percentage: Math.round((count / totalProperties) * 100),
      color: palette[idx % palette.length]!,
    }))
  }, [properties, totalProperties])

  const typeDistribution = useMemo(() => {
    if (totalProperties === 0) return []
    const counts: Record<string, number> = {}
    properties.forEach((p) => {
      const t = p.propertyType || "Khác"
      counts[t] = (counts[t] || 0) + 1
    })
    const palette = ["#10b981", "#ef4444", "#f59e0b", "#3b82f6", "#8b5cf6", "#94a3b8"]
    return Object.entries(counts).map(([typeName, count], idx) => ({
      id: `type-${idx}`,
      typeName,
      count,
      percentage: Math.round((count / totalProperties) * 100),
      color: palette[idx % palette.length]!,
    }))
  }, [properties, totalProperties])

  return (
    <div className="space-y-6">
      {/* 1. Top Banner Card: Đăng tin dễ dàng */}
      <div
        className="relative overflow-hidden rounded-2xl aspect-[16/6] sm:aspect-[16/7] border border-slate-200/80 shadow-xs group cursor-pointer"
        onClick={onBannerAction}
      >
        <Image
          src="/about/beach-opt-0.jpg"
          alt="Đăng tin dễ dàng"
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, 400px"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-900/60 to-transparent flex items-center justify-between p-5 text-white">
          <div className="space-y-1">
            <h2 className="text-base sm:text-lg font-bold leading-tight">
              Đăng tin dễ dàng
            </h2>
            <p className="text-xs sm:text-sm text-emerald-200 font-medium leading-tight">
              Tiếp cận hàng triệu du khách
            </p>
          </div>
          <button
            type="button"
            aria-label="Khám phá đăng tin"
            className="w-8 h-8 rounded-full bg-white text-slate-800 flex items-center justify-center shadow-md hover:bg-emerald-50 transition-colors shrink-0"
          >
            <ArrowRight className="w-4 h-4 text-emerald-700" />
          </button>
        </div>
      </div>

      {/* 2. Bất động sản theo khu vực */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">
            Bất động sản theo khu vực
          </h2>
          <button
            type="button"
            onClick={onViewAreaDetails}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline inline-flex items-center gap-1 transition-colors"
          >
            <span>Xem chi tiết</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-12 gap-3 items-center">
          {/* Mini Phu Quoc Island Map Graphic */}
          <div className="col-span-5 relative h-44 rounded-xl bg-gradient-to-b from-sky-50 to-emerald-50/40 border border-sky-100 flex items-center justify-center overflow-hidden">
            <svg
              viewBox="0 0 100 160"
              className="w-full h-full p-2 drop-shadow-sm select-none"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M48 10 C58 12, 65 25, 62 42 C60 52, 68 70, 60 90 C55 105, 52 125, 46 142 C40 148, 32 145, 34 135 C36 120, 30 100, 32 75 C34 50, 38 25, 48 10 Z"
                fill="#86efac"
                stroke="#22c55e"
                strokeWidth="1.5"
                opacity="0.85"
              />
              <circle cx="44" cy="150" r="2.5" fill="#86efac" stroke="#22c55e" strokeWidth="1" />
              <circle cx="50" cy="148" r="2" fill="#86efac" stroke="#22c55e" strokeWidth="1" />
              <circle cx="38" cy="152" r="1.5" fill="#86efac" stroke="#22c55e" strokeWidth="1" />
            </svg>
            <span className="absolute bottom-1 right-2 text-[9px] font-bold text-sky-800/60 uppercase tracking-widest pointer-events-none">
              Phú Quốc
            </span>
          </div>

          {/* Area Breakdown List */}
          <div className="col-span-7 space-y-1.5 text-xs">
            {areaDistribution.length === 0 ? (
              <div className="text-slate-400 text-xs py-4 text-center">
                Chưa có dữ liệu khu vực.
              </div>
            ) : (
              areaDistribution.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between text-slate-700 hover:text-slate-900 transition-colors"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="truncate font-medium">{item.area}</span>
                  </div>
                  <div className="flex items-center gap-1 font-semibold shrink-0">
                    <span>{item.percentage}%</span>
                    <span className="text-slate-400 font-normal">({item.count})</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* 3. Loại hình bất động sản (Donut Chart) */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">
            Loại hình bất động sản
          </h2>
          <button
            type="button"
            onClick={onViewTypeDetails}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline inline-flex items-center gap-1 transition-colors"
          >
            <span>Xem chi tiết</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-5">
          {/* SVG Donut Chart */}
          <div className="relative w-32 h-32 shrink-0">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle
                cx="50"
                cy="50"
                r="36"
                fill="none"
                stroke="#f1f5f9"
                strokeWidth="15"
              />
              {typeDistribution.map((item, idx) => {
                let offset = 0
                for (let i = 0; i < idx; i++) {
                  offset += typeDistribution[i]!.percentage
                }
                return (
                  <circle
                    key={item.id}
                    cx="50"
                    cy="50"
                    r="36"
                    fill="none"
                    stroke={item.color}
                    strokeWidth="15"
                    pathLength="100"
                    strokeDasharray={`${item.percentage} ${100 - item.percentage}`}
                    strokeDashoffset={-offset}
                  />
                )
              })}
            </svg>
            {/* Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-xl font-bold text-slate-900 leading-none">
                {totalProperties}
              </span>
              <span className="text-[10px] text-slate-500 font-medium mt-0.5">
                Bất động sản
              </span>
            </div>
          </div>

          {/* Legend */}
          <div className="flex-1 space-y-1.5 text-xs">
            {typeDistribution.length === 0 ? (
              <div className="text-slate-400 text-xs py-2">Chưa có loại hình lưu trú.</div>
            ) : (
              typeDistribution.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between text-slate-700"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="font-medium text-slate-700">{item.typeName}</span>
                  </div>
                  <span className="font-bold text-slate-900">{item.percentage}%</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* 4. Thao tác nhanh */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900">
          Thao tác nhanh
        </h2>

        <div className="space-y-2 text-xs">
          <button
            type="button"
            onClick={() => onQuickAction?.("create")}
            className="w-full flex items-center justify-between p-2.5 rounded-xl text-slate-700 hover:text-emerald-800 hover:bg-slate-50 transition-colors group text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:bg-emerald-100 transition-colors">
                <PlusCircle className="w-4 h-4" />
              </div>
              <span className="font-medium text-slate-800">
                Thêm bất động sản mới
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 transition-colors" />
          </button>

          <button
            type="button"
            onClick={() => onQuickAction?.("import-excel")}
            className="w-full flex items-center justify-between p-2.5 rounded-xl text-slate-700 hover:text-emerald-800 hover:bg-slate-50 transition-colors group text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:bg-emerald-100 transition-colors">
                <FileSpreadsheet className="w-4 h-4" />
              </div>
              <span className="font-medium text-slate-800">
                Nhập danh sách từ Excel
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 transition-colors" />
          </button>

          <button
            type="button"
            onClick={() => onQuickAction?.("amenities")}
            className="w-full flex items-center justify-between p-2.5 rounded-xl text-slate-700 hover:text-emerald-800 hover:bg-slate-50 transition-colors group text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:bg-emerald-100 transition-colors">
                <Layers className="w-4 h-4" />
              </div>
              <span className="font-medium text-slate-800">
                Quản lý tiện ích &amp; dịch vụ
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 transition-colors" />
          </button>

          <button
            type="button"
            onClick={() => onQuickAction?.("audit")}
            className="w-full flex items-center justify-between p-2.5 rounded-xl text-slate-700 hover:text-emerald-800 hover:bg-slate-50 transition-colors group text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:bg-emerald-100 transition-colors">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="font-medium text-slate-800">
                Kiểm duyệt bất động sản
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 transition-colors" />
          </button>
        </div>
      </div>
    </div>
  )
}
