/* eslint-disable @next/next/no-img-element */
"use client"

import {
  ChevronRight,
  ArrowUp,
  ArrowDown,
  FileEdit,
  Link2,
  Gauge,
  FileText,
  FileDown,
} from "lucide-react"
import type {
  SeoKeyMetricSidebarItem,
  SeoGrowthKeywordItem,
  SeoRelatedReportItem,
} from "@/features/admin-marketing/stayea-admin-marketing-mock-data"

interface SeoRightSidebarProps {
  keyMetrics: SeoKeyMetricSidebarItem[]
  growthKeywords: SeoGrowthKeywordItem[]
  relatedReports: SeoRelatedReportItem[]
  onActionClick?: (actionKey: string) => void
  onViewAllGrowthKeywords?: () => void
}

function renderRelatedReportIcon(iconType: SeoRelatedReportItem["iconType"]) {
  switch (iconType) {
    case "keywords":
      return <FileEdit className="w-4 h-4 text-emerald-600" />
    case "backlinks":
      return <Link2 className="w-4 h-4 text-sky-600" />
    case "technical":
      return <Gauge className="w-4 h-4 text-teal-600" />
    case "content":
      return <FileText className="w-4 h-4 text-blue-600" />
    case "export":
      return <FileDown className="w-4 h-4 text-emerald-600" />
    default:
      return <FileText className="w-4 h-4 text-slate-500" />
  }
}

export function SeoRightSidebar({
  keyMetrics,
  growthKeywords,
  relatedReports,
  onActionClick,
  onViewAllGrowthKeywords,
}: SeoRightSidebarProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* 1. Tropical SEO Promo Banner */}
      <div className="relative rounded-xl overflow-hidden shadow-xs h-[92px] group cursor-pointer">
        <img
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80"
          alt="SEO đưa Stayea đến gần khách hàng hơn"
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-sky-900/90 via-sky-800/75 to-transparent" />
        <div className="relative h-full flex items-center justify-between px-4 text-white z-10">
          <div className="max-w-[75%]">
            <h3 className="text-xs font-bold leading-tight drop-shadow-xs">
              SEO đưa Stayea đến gần khách hàng hơn
            </h3>
            <p className="text-[11px] text-white/90 mt-1 leading-snug line-clamp-1">
              Tăng hiển thị, tăng đặt phòng
            </p>
          </div>
          <div className="w-7 h-7 rounded-full bg-white text-slate-800 flex items-center justify-center shrink-0 shadow-sm group-hover:bg-[#007a48] group-hover:text-white transition-colors">
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* 2. Chỉ số SEO quan trọng */}
      <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-xs">
        <h2 className="text-xs font-bold text-slate-900 mb-3">
          Chỉ số SEO quan trọng
        </h2>

        <div className="divide-y divide-slate-50">
          {keyMetrics.map((item) => (
            <div
              key={item.id}
              className="py-2.5 flex items-center justify-between text-xs hover:bg-slate-50/60 px-1 rounded transition-colors"
            >
              <span className="text-slate-600 font-medium">{item.label}</span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900">{item.value}</span>
                <span
                  className={`inline-flex items-center gap-0.5 text-[11px] font-bold ${
                    item.trendDirection === "up"
                      ? "text-emerald-600"
                      : "text-rose-500"
                  }`}
                >
                  {item.trendDirection === "up" ? (
                    <ArrowUp className="w-3 h-3 stroke-[2.5]" />
                  ) : (
                    <ArrowDown className="w-3 h-3 stroke-[2.5]" />
                  )}
                  {item.trendPercent}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Từ khóa tăng trưởng mạnh */}
      <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold text-slate-900">
            Từ khóa tăng trưởng mạnh
          </h2>
          <button
            type="button"
            onClick={onViewAllGrowthKeywords}
            className="text-[11px] font-semibold text-[#007a48] hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            <span>Xem tất cả</span>
            <span>→</span>
          </button>
        </div>

        <div className="divide-y divide-slate-50">
          {growthKeywords.map((item) => (
            <div
              key={item.id}
              className="py-2.5 flex items-center justify-between text-xs hover:bg-slate-50/60 px-1 rounded transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="w-3 text-slate-400 font-bold text-xs text-center">
                  {item.order}
                </span>
                <span className="font-medium text-slate-800">
                  {item.keyword}
                </span>
              </div>
              <span className="inline-flex items-center gap-0.5 text-emerald-600 font-bold text-[11px]">
                <ArrowUp className="w-3 h-3 stroke-[2.5]" />
                {item.growthPercent}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Báo cáo liên quan */}
      <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-xs">
        <h2 className="text-xs font-bold text-slate-900 mb-2.5">
          Báo cáo liên quan
        </h2>

        <div className="divide-y divide-slate-100">
          {relatedReports.map((report) => (
            <button
              key={report.id}
              type="button"
              onClick={() => onActionClick?.(report.actionKey)}
              className="w-full py-2.5 flex items-center justify-between text-xs text-slate-700 font-medium hover:text-[#007a48] hover:bg-slate-50/80 px-1 rounded transition-colors group text-left cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                {renderRelatedReportIcon(report.iconType)}
                <span>{report.title}</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#007a48] group-hover:translate-x-0.5 transition-transform" />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
