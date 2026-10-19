"use client"

import Image from "next/image"
import {
  ArrowRight,
  ChevronRight,
  PlusCircle,
  FileSpreadsheet,
  Layers,
  ShieldCheck,
} from "lucide-react"
import {
  PROPERTIES_AREA_DISTRIBUTION,
  PROPERTY_TYPE_DISTRIBUTION,
} from "@/features/admin-properties/stayea-admin-properties-mock-data"

interface PropertiesRightSidebarProps {
  onBannerAction?: () => void
  onViewAreaDetails?: () => void
  onViewTypeDetails?: () => void
  onQuickAction?: (actionId: string) => void
}

export function PropertiesRightSidebar({
  onBannerAction,
  onViewAreaDetails,
  onViewTypeDetails,
  onQuickAction,
}: PropertiesRightSidebarProps) {
  return (
    <div className="space-y-6">
      {/* 1. Top Banner Card: Đăng tin dễ dàng */}
      <div className="relative overflow-hidden rounded-2xl aspect-[16/6] sm:aspect-[16/7] border border-slate-200/80 shadow-xs group cursor-pointer"
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
            {/* SVG silhouette of Phu Quoc Island */}
            <svg
              viewBox="0 0 100 160"
              className="w-full h-full p-2 drop-shadow-sm select-none"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Island Shape */}
              <path
                d="M48 10 C58 12, 65 25, 62 42 C60 52, 68 70, 60 90 C55 105, 52 125, 46 142 C40 148, 32 145, 34 135 C36 120, 30 100, 32 75 C34 50, 38 25, 48 10 Z"
                fill="#86efac"
                stroke="#22c55e"
                strokeWidth="1.5"
                opacity="0.85"
              />
              {/* Secondary island / islets */}
              <circle cx="44" cy="150" r="2.5" fill="#86efac" stroke="#22c55e" strokeWidth="1" />
              <circle cx="50" cy="148" r="2" fill="#86efac" stroke="#22c55e" strokeWidth="1" />
              <circle cx="38" cy="152" r="1.5" fill="#86efac" stroke="#22c55e" strokeWidth="1" />

              {/* Gành Dầu Pin (North - Blue) */}
              <g transform="translate(42, 22)">
                <circle cx="0" cy="0" r="4" fill="#3b82f6" />
                <circle cx="0" cy="0" r="1.5" fill="white" />
              </g>

              {/* Cửa Cạn Pin (Mid-North - Orange) */}
              <g transform="translate(38, 52)">
                <circle cx="0" cy="0" r="3.5" fill="#f97316" />
                <circle cx="0" cy="0" r="1.2" fill="white" />
              </g>

              {/* Dương Đông Pin (Central - Green) */}
              <g transform="translate(44, 76)">
                <circle cx="0" cy="0" r="5" fill="#15803d" />
                <circle cx="0" cy="0" r="2" fill="white" />
              </g>

              {/* Hàm Ninh Pin (East - Purple) */}
              <g transform="translate(58, 86)">
                <circle cx="0" cy="0" r="3.5" fill="#a855f7" />
                <circle cx="0" cy="0" r="1.2" fill="white" />
              </g>

              {/* An Thới Pin (South - Yellow) */}
              <g transform="translate(43, 134)">
                <circle cx="0" cy="0" r="4.5" fill="#eab308" />
                <circle cx="0" cy="0" r="1.5" fill="white" />
              </g>

              {/* Sea Water Marks */}
              <path d="M12 40 Q20 38 28 40" stroke="#bae6fd" strokeWidth="1.2" strokeLinecap="round" />
              <path d="M72 65 Q80 63 88 65" stroke="#bae6fd" strokeWidth="1.2" strokeLinecap="round" />
              <path d="M15 110 Q23 108 30 110" stroke="#bae6fd" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            <span className="absolute bottom-1 right-2 text-[9px] font-bold text-sky-800/60 uppercase tracking-widest pointer-events-none">
              Phú Quốc
            </span>
          </div>

          {/* Area Breakdown List */}
          <div className="col-span-7 space-y-1.5 text-xs">
            {PROPERTIES_AREA_DISTRIBUTION.map((item) => (
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
            ))}
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
              {/* Segments:
                  Biệt thự: 38% -> stroke-dasharray: 38 62
                  Căn hộ: 24% -> stroke-dasharray: 24 76, offset -38
                  Homestay: 18% -> stroke-dasharray: 18 82, offset -62
                  Khách sạn: 10% -> stroke-dasharray: 10 90, offset -80
                  Resort: 6% -> stroke-dasharray: 6 94, offset -90
                  Khác: 4% -> stroke-dasharray: 4 96, offset -96
              */}
              <circle
                cx="50"
                cy="50"
                r="36"
                fill="none"
                stroke="#10b981"
                strokeWidth="15"
                pathLength="100"
                strokeDasharray="38 62"
                strokeDashoffset="0"
              />
              <circle
                cx="50"
                cy="50"
                r="36"
                fill="none"
                stroke="#ef4444"
                strokeWidth="15"
                pathLength="100"
                strokeDasharray="24 76"
                strokeDashoffset="-38"
              />
              <circle
                cx="50"
                cy="50"
                r="36"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="15"
                pathLength="100"
                strokeDasharray="18 82"
                strokeDashoffset="-62"
              />
              <circle
                cx="50"
                cy="50"
                r="36"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="15"
                pathLength="100"
                strokeDasharray="10 90"
                strokeDashoffset="-80"
              />
              <circle
                cx="50"
                cy="50"
                r="36"
                fill="none"
                stroke="#8b5cf6"
                strokeWidth="15"
                pathLength="100"
                strokeDasharray="6 94"
                strokeDashoffset="-90"
              />
              <circle
                cx="50"
                cy="50"
                r="36"
                fill="none"
                stroke="#94a3b8"
                strokeWidth="15"
                pathLength="100"
                strokeDasharray="4 96"
                strokeDashoffset="-96"
              />
            </svg>
            {/* Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-xl font-bold text-slate-900 leading-none">
                342
              </span>
              <span className="text-[10px] text-slate-500 font-medium mt-0.5">
                Bất động sản
              </span>
            </div>
          </div>

          {/* Legend */}
          <div className="flex-1 space-y-1.5 text-xs">
            {PROPERTY_TYPE_DISTRIBUTION.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between text-slate-700"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="font-medium">{item.typeName}</span>
                </div>
                <span className="font-semibold">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Thao tác nhanh (Quick Actions) */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
        <h2 className="text-sm font-bold text-slate-900">
          Thao tác nhanh
        </h2>

        <div className="space-y-1 text-xs sm:text-sm">
          {/* Action 1 */}
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

          {/* Action 2 */}
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

          {/* Action 3 */}
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

          {/* Action 4 */}
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
