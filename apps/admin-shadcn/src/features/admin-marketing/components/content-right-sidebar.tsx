/* eslint-disable @next/next/no-img-element */
"use client"

import {
  ChevronRight,
  Eye,
  Heart,
  Feather,
  Video,
  Layout,
  MessageSquare,
  Film,
  PlusSquare,
  Calendar,
  FolderOpen,
  Download,
  Settings,
} from "lucide-react"
import {
  MOCK_CONTENT_HIGHLIGHTS_SIDEBAR,
  MOCK_CONTENT_IDEAS_TIPS,
  MOCK_CONTENT_QUICK_ACTIONS,
} from "@/features/admin-marketing/stayea-admin-marketing-mock-data"
import type {
  ContentHighlightSidebarItem,
  ContentIdeaTipItem,
  ContentQuickActionItem,
} from "@/features/admin-marketing/stayea-admin-marketing-mock-data"

interface ContentRightSidebarProps {
  highlights?: ContentHighlightSidebarItem[]
  ideas?: ContentIdeaTipItem[]
  quickActions?: ContentQuickActionItem[]
  onHighlightClick?: (item: ContentHighlightSidebarItem) => void
  onIdeaClick?: (idea: ContentIdeaTipItem) => void
  onQuickActionClick?: (actionKey: string) => void
  onViewAllHighlights?: () => void
  onViewAllIdeas?: () => void
}

function renderIdeaIcon(type: ContentIdeaTipItem["iconType"]) {
  switch (type) {
    case "feather":
      return (
        <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
          <Feather className="w-3.5 h-3.5" />
        </div>
      )
    case "video":
      return (
        <div className="w-7 h-7 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
          <Video className="w-3.5 h-3.5" />
        </div>
      )
    case "infographic":
      return (
        <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-500 flex items-center justify-center shrink-0">
          <Layout className="w-3.5 h-3.5" />
        </div>
      )
    case "chat":
      return (
        <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
          <MessageSquare className="w-3.5 h-3.5" />
        </div>
      )
    case "reel":
      return (
        <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
          <Film className="w-3.5 h-3.5" />
        </div>
      )
    default:
      return null
  }
}

function renderQuickActionIcon(key: string) {
  switch (key) {
    case "create-content":
      return <PlusSquare className="w-4 h-4 text-emerald-600" />
    case "schedule-post":
      return <Calendar className="w-4 h-4 text-emerald-600" />
    case "manage-library":
      return <FolderOpen className="w-4 h-4 text-emerald-600" />
    case "export-report":
      return <Download className="w-4 h-4 text-emerald-600" />
    case "settings-content":
      return <Settings className="w-4 h-4 text-emerald-600" />
    default:
      return <PlusSquare className="w-4 h-4 text-emerald-600" />
  }
}

export function ContentRightSidebar({
  highlights = MOCK_CONTENT_HIGHLIGHTS_SIDEBAR,
  ideas = MOCK_CONTENT_IDEAS_TIPS,
  quickActions = MOCK_CONTENT_QUICK_ACTIONS,
  onHighlightClick,
  onIdeaClick,
  onQuickActionClick,
  onViewAllHighlights,
  onViewAllIdeas,
}: ContentRightSidebarProps) {
  return (
    <div className="space-y-4">
      {/* 1. TOP BANNER: Nội dung hấp dẫn, khách hàng gần hơn */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-sky-600 via-teal-600 to-emerald-600 p-4 text-white shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
        {/* Background Graphic Overlay */}
        <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-white/10 blur-xl pointer-events-none" />
        <div className="relative z-10 flex items-center justify-between gap-3">
          <div className="space-y-0.5">
            <h4 className="text-xs sm:text-[13px] font-bold leading-snug drop-shadow-xs">
              Nội dung hấp dẫn,<br />khách hàng gần hơn
            </h4>
            <p className="text-[11px] text-white/85 font-light">
              Kể câu chuyện du lịch cùng Stayea
            </p>
          </div>
          <button
            type="button"
            onClick={onViewAllHighlights}
            className="w-7 h-7 rounded-full bg-white text-slate-800 flex items-center justify-center shadow-sm hover:scale-105 active:scale-95 transition-all shrink-0 cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. CARD: Nội dung nổi bật */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs sm:text-[13px] font-bold text-slate-900 tracking-tight">
            Nội dung nổi bật
          </h4>
          <button
            type="button"
            onClick={onViewAllHighlights}
            className="text-[11px] font-semibold text-[#007a48] hover:text-[#00653b] hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            <span>Xem tất cả</span>
            <span>→</span>
          </button>
        </div>

        <div className="space-y-2.5">
          {highlights.map((item) => (
            <div
              key={item.id}
              onClick={() => onHighlightClick?.(item)}
              className="flex items-center gap-2.5 p-1 -mx-1 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group"
            >
              {/* Rank */}
              <span className="w-4 text-center text-xs font-bold text-slate-500 shrink-0 flex items-center justify-center">
                {item.rank === 3 ? (
                  <span className="text-amber-500">3★</span>
                ) : (
                  item.rank
                )}
              </span>

              {/* Thumbnail */}
              <img
                src={item.thumbnail}
                alt={item.title}
                className="w-9 h-9 rounded-lg object-cover shrink-0 border border-slate-200/80"
              />

              {/* Title & Stats */}
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-slate-900 group-hover:text-[#007a48] transition-colors truncate">
                  {item.title}
                </p>
                <div className="flex items-center gap-3 mt-0.5 text-[11px] text-slate-500">
                  <div className="flex items-center gap-1">
                    <Eye className="w-3 h-3 text-slate-400" />
                    <span>{item.views}</span>
                  </div>
                  <div className="flex items-center gap-1 text-rose-500">
                    <Heart className="w-3 h-3 fill-rose-500" />
                    <span>{item.likes}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. CARD: Gợi ý nội dung */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs sm:text-[13px] font-bold text-slate-900 tracking-tight">
            Gợi ý nội dung
          </h4>
          <button
            type="button"
            onClick={onViewAllIdeas}
            className="text-[11px] font-semibold text-[#007a48] hover:text-[#00653b] hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            <span>Xem tất cả</span>
            <span>→</span>
          </button>
        </div>

        <div className="space-y-2.5">
          {ideas.map((tip) => (
            <div
              key={tip.id}
              onClick={() => onIdeaClick?.(tip)}
              className="flex items-center gap-2.5 p-1 -mx-1 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group"
            >
              {renderIdeaIcon(tip.iconType)}
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-slate-800 group-hover:text-[#007a48] transition-colors leading-snug line-clamp-1">
                  {tip.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. CARD: Thao tác nhanh */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
        <h4 className="text-xs sm:text-[13px] font-bold text-slate-900 tracking-tight mb-3">
          Thao tác nhanh
        </h4>

        <div className="space-y-1">
          {quickActions.map((action) => (
            <button
              key={action.id}
              type="button"
              onClick={() => onQuickActionClick?.(action.actionKey)}
              className="w-full flex items-center justify-between p-2 rounded-xl text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                {renderQuickActionIcon(action.actionKey)}
                <span>{action.title}</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
