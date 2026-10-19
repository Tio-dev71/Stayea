/* eslint-disable @next/next/no-img-element */
"use client"

import {
  ChevronRight,
  Sparkles,
  Lightbulb,
  Search,
  RefreshCw,
  Split,
  PlusSquare,
  Sliders,
  Calendar,
  Download,
  Settings,
} from "lucide-react"
import type {
  AdsHighlightSidebarItem,
  AdsOptimizeTipItem,
  AdsQuickActionItem,
} from "@/features/admin-marketing/stayea-admin-marketing-mock-data"

interface AdsRightSidebarProps {
  highlights: AdsHighlightSidebarItem[]
  optimizeTips: AdsOptimizeTipItem[]
  quickActions: AdsQuickActionItem[]
  onActionClick?: (actionKey: string) => void
  onViewAllHighlights?: () => void
  onViewAllTips?: () => void
}

function renderSidebarChannelIcon(channel: AdsHighlightSidebarItem["channel"]) {
  switch (channel) {
    case "facebook":
      return (
        <span className="w-5 h-5 rounded-full bg-[#1877F2] text-white flex items-center justify-center font-bold text-[11px] shadow-xs shrink-0">
          f
        </span>
      )
    case "google":
      return (
        <span className="w-5 h-5 rounded-full bg-white border border-slate-200 text-slate-700 flex items-center justify-center font-bold text-[10px] shadow-xs shrink-0">
          <span className="text-[#EA4335]">G</span>
        </span>
      )
    case "instagram":
      return (
        <span className="w-5 h-5 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white flex items-center justify-center font-bold text-[10px] shadow-xs shrink-0">
          📷
        </span>
      )
    case "zalo":
      return (
        <span className="w-5 h-5 rounded-full bg-[#0068FF] text-white flex items-center justify-center font-bold text-[9px] shadow-xs shrink-0">
          Z
        </span>
      )
    case "tiktok":
      return (
        <span className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center font-bold text-[10px] shadow-xs shrink-0">
          🎵
        </span>
      )
    default:
      return null
  }
}

function renderTipIcon(iconType: AdsOptimizeTipItem["iconType"]) {
  switch (iconType) {
    case "bulb":
      return (
        <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
          <Lightbulb className="w-4 h-4" />
        </div>
      )
    case "tiktok":
      return (
        <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0 text-xs font-bold">
          🎵
        </div>
      )
    case "search":
      return (
        <div className="w-7 h-7 rounded-lg bg-emerald-50 text-[#007a48] flex items-center justify-center shrink-0">
          <Search className="w-4 h-4" />
        </div>
      )
    case "remarketing":
      return (
        <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
          <RefreshCw className="w-4 h-4" />
        </div>
      )
    case "abtest":
      return (
        <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
          <Split className="w-4 h-4" />
        </div>
      )
    default:
      return (
        <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
          <Sparkles className="w-4 h-4" />
        </div>
      )
  }
}

function renderQuickActionIcon(iconType: AdsQuickActionItem["iconType"]) {
  switch (iconType) {
    case "create":
      return <PlusSquare className="w-4 h-4 text-emerald-600" />
    case "manage":
      return <Sliders className="w-4 h-4 text-emerald-600" />
    case "schedule":
      return <Calendar className="w-4 h-4 text-emerald-600" />
    case "export":
      return <Download className="w-4 h-4 text-emerald-600" />
    case "settings":
      return <Settings className="w-4 h-4 text-emerald-600" />
    default:
      return <Sparkles className="w-4 h-4 text-emerald-600" />
  }
}

export function AdsRightSidebar({
  highlights,
  optimizeTips,
  quickActions,
  onActionClick,
  onViewAllHighlights,
  onViewAllTips,
}: AdsRightSidebarProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* 1. Tropical Promo Banner */}
      <div className="relative rounded-xl overflow-hidden shadow-xs h-[92px] group cursor-pointer">
        <img
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80"
          alt="Quảng cáo thông minh cùng Stayea"
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-sky-900/90 via-sky-800/75 to-transparent" />
        <div className="relative h-full flex items-center justify-between px-4 text-white z-10">
          <div className="max-w-[75%]">
            <h3 className="text-xs font-bold leading-tight drop-shadow-xs">
              Quảng cáo thông minh cùng Stayea
            </h3>
            <p className="text-[11px] text-white/90 mt-1 leading-snug line-clamp-1">
              Tiếp cận đúng khách hàng, tối ưu chi phí
            </p>
          </div>
          <div className="w-7 h-7 rounded-full bg-white text-slate-800 flex items-center justify-center shrink-0 shadow-sm group-hover:bg-[#007a48] group-hover:text-white transition-colors">
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* 2. Hiệu quả quảng cáo nổi bật (Top 5) */}
      <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold text-slate-900">
            Hiệu quả quảng cáo nổi bật
          </h2>
          <button
            onClick={onViewAllHighlights}
            className="text-[11px] font-semibold text-[#007a48] hover:underline flex items-center gap-0.5"
          >
            <span>Xem tất cả</span>
            <span>→</span>
          </button>
        </div>

        <div className="divide-y divide-slate-50">
          {highlights.map((item) => (
            <div
              key={item.id}
              className="py-2 flex items-center justify-between text-xs hover:bg-slate-50/60 px-1 rounded transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-4 text-slate-400 font-bold text-center text-xs">
                  {item.order}
                </span>
                {renderSidebarChannelIcon(item.channel)}
                <span className="font-semibold text-slate-800">
                  {item.channelName}
                </span>
              </div>
              <span className="font-bold text-slate-800 text-[11px]">
                {item.roas}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Gợi ý tối ưu quảng cáo (5 tips) */}
      <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold text-slate-900">
            Gợi ý tối ưu quảng cáo
          </h2>
          <button
            onClick={onViewAllTips}
            className="text-[11px] font-semibold text-[#007a48] hover:underline flex items-center gap-0.5"
          >
            <span>Xem tất cả</span>
            <span>→</span>
          </button>
        </div>

        <div className="space-y-2.5">
          {optimizeTips.map((tip) => (
            <div
              key={tip.id}
              className="flex items-center gap-2.5 p-1 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
            >
              {renderTipIcon(tip.iconType)}
              <span className="text-xs font-medium text-slate-700 leading-snug line-clamp-2">
                {tip.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Thao tác nhanh */}
      <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-xs">
        <h2 className="text-xs font-bold text-slate-900 mb-2.5">
          Thao tác nhanh
        </h2>

        <div className="divide-y divide-slate-100">
          {quickActions.map((qa) => (
            <button
              key={qa.id}
              onClick={() => onActionClick?.(qa.actionKey)}
              className="w-full py-2.5 flex items-center justify-between text-xs text-slate-700 font-medium hover:text-[#007a48] hover:bg-slate-50/80 px-1 rounded transition-colors group text-left"
            >
              <div className="flex items-center gap-2.5">
                {renderQuickActionIcon(qa.iconType)}
                <span>{qa.title}</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#007a48] group-hover:translate-x-0.5 transition-transform" />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
