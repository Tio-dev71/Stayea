"use client"

import {
  ChevronRight,
  Megaphone,
  Video,
  Target,
  MessageCircle,
  Mail,
  Lightbulb,
} from "lucide-react"
import {
  MOCK_CHANNEL_HIGHLIGHTS,
  MOCK_CHANNEL_OPTIMIZATION_TIPS,
} from "@/features/admin-marketing/stayea-admin-marketing-mock-data"
import type {
  ChannelHighlightItem,
  ChannelOptimizationTip,
} from "@/features/admin-marketing/stayea-admin-marketing-mock-data"

interface ChannelsRightSidebarProps {
  highlights?: ChannelHighlightItem[]
  optimizationTips?: ChannelOptimizationTip[]
  onHighlightClick?: (item: ChannelHighlightItem) => void
  onTipClick?: (tip: ChannelOptimizationTip) => void
  onViewAllTips?: () => void
}

function renderChannelLogo(type: ChannelHighlightItem["iconType"]) {
  switch (type) {
    case "facebook":
      return (
        <div className="w-7 h-7 rounded-full bg-[#1877f2] flex items-center justify-center text-white text-xs font-bold shrink-0">
          f
        </div>
      )
    case "google":
      return (
        <div className="w-7 h-7 rounded-full bg-white border border-slate-200 flex items-center justify-center text-xs font-bold text-[#ea4335] shrink-0">
          G
        </div>
      )
    case "instagram":
      return (
        <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center text-white text-[11px] font-bold shrink-0 shadow-xs">
          IG
        </div>
      )
    case "zalo":
      return (
        <div className="w-7 h-7 rounded-full bg-[#0068ff] flex items-center justify-center text-white text-[9px] font-bold shrink-0">
          Zalo
        </div>
      )
    case "email":
      return (
        <div className="w-7 h-7 rounded-full bg-[#10b981] flex items-center justify-center text-white text-xs shrink-0">
          ✉
        </div>
      )
    default:
      return (
        <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 text-xs flex items-center justify-center shrink-0">
          #
        </div>
      )
  }
}

function renderTipIcon(type: ChannelOptimizationTip["iconType"]) {
  switch (type) {
    case "megaphone":
      return (
        <div className="w-7 h-7 rounded-lg bg-sky-50 text-[#1877f2] flex items-center justify-center shrink-0">
          <Megaphone className="w-3.5 h-3.5" />
        </div>
      )
    case "video":
      return (
        <div className="w-7 h-7 rounded-lg bg-purple-50 text-[#bc1888] flex items-center justify-center shrink-0">
          <Video className="w-3.5 h-3.5" />
        </div>
      )
    case "google":
      return (
        <div className="w-7 h-7 rounded-lg bg-red-50 text-[#ea4335] flex items-center justify-center shrink-0">
          <Target className="w-3.5 h-3.5" />
        </div>
      )
    case "zalo":
      return (
        <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#0068ff] flex items-center justify-center shrink-0">
          <MessageCircle className="w-3.5 h-3.5" />
        </div>
      )
    case "email":
      return (
        <div className="w-7 h-7 rounded-lg bg-emerald-50 text-[#10b981] flex items-center justify-center shrink-0">
          <Mail className="w-3.5 h-3.5" />
        </div>
      )
    default:
      return (
        <div className="w-7 h-7 rounded-lg bg-slate-50 text-slate-600 flex items-center justify-center shrink-0">
          <Lightbulb className="w-3.5 h-3.5" />
        </div>
      )
  }
}

export function ChannelsRightSidebar({
  highlights = MOCK_CHANNEL_HIGHLIGHTS,
  optimizationTips = MOCK_CHANNEL_OPTIMIZATION_TIPS,
  onHighlightClick,
  onTipClick,
  onViewAllTips,
}: ChannelsRightSidebarProps) {
  return (
    <div className="space-y-4">
      {/* 1. TOP BANNER: Tối ưu kênh marketing cùng Stayea */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-sky-600 via-teal-600 to-emerald-600 p-4 text-white shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
        {/* Background Graphic Overlay */}
        <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-white/10 blur-xl pointer-events-none" />
        <div className="relative z-10 flex items-center justify-between gap-3">
          <div className="space-y-0.5">
            <h4 className="text-xs sm:text-[13px] font-bold leading-snug drop-shadow-xs">
              Tối ưu kênh marketing<br />cùng Stayea
            </h4>
            <p className="text-[11px] text-white/85 font-light">
              Đưa Việt Nam đến gần hơn
            </p>
          </div>
          <button
            type="button"
            onClick={onViewAllTips}
            className="w-7 h-7 rounded-full bg-white text-slate-800 flex items-center justify-center shadow-sm hover:scale-105 active:scale-95 transition-all shrink-0 cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. CARD: Hiệu quả nổi bật */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
        <div className="flex items-center gap-1.5 mb-3">
          <span className="text-amber-500 text-sm">🏆</span>
          <h4 className="text-xs sm:text-[13px] font-bold text-slate-900 tracking-tight">
            Hiệu quả nổi bật
          </h4>
        </div>

        <div className="space-y-2.5">
          {highlights.map((item) => (
            <div
              key={item.id}
              onClick={() => onHighlightClick?.(item)}
              className="flex items-center justify-between gap-2 p-1.5 -mx-1.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {renderChannelLogo(item.iconType)}
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-900 group-hover:text-[#007a48] transition-colors truncate">
                    {item.channelName}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">
                    {item.note}
                  </p>
                </div>
              </div>

              {/* Right Value Badge */}
              <div className="shrink-0 text-right">
                {item.badgeType === "link" ? (
                  <span className="text-xs font-bold text-[#1877f2] flex items-center gap-0.5 group-hover:underline">
                    {item.badgeValue}
                  </span>
                ) : item.badgeType === "percentage" ? (
                  <span className="text-xs font-bold text-emerald-600">
                    {item.badgeValue}
                  </span>
                ) : item.badgeType === "arrow" ? (
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-colors" />
                ) : (
                  <span className="text-xs font-bold text-slate-900">
                    {item.badgeValue}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. CARD: Gợi ý tối ưu */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <span className="text-amber-500 text-sm">💡</span>
            <h4 className="text-xs sm:text-[13px] font-bold text-slate-900 tracking-tight">
              Gợi ý tối ưu
            </h4>
          </div>
          <button
            type="button"
            onClick={onViewAllTips}
            className="text-[11px] font-semibold text-[#007a48] hover:text-[#00653b] hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            <span>Xem tất cả</span>
            <span>→</span>
          </button>
        </div>

        <div className="space-y-2.5">
          {optimizationTips.map((tip) => (
            <div
              key={tip.id}
              onClick={() => onTipClick?.(tip)}
              className="flex items-start gap-2.5 p-1.5 -mx-1.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group"
            >
              {renderTipIcon(tip.iconType)}
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-slate-900 group-hover:text-[#007a48] transition-colors leading-snug">
                  {tip.title}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                  {tip.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
