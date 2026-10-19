/* eslint-disable @next/next/no-img-element */
"use client"

import {
  ChevronRight,
  Mail,
  User,
  Split,
  Clock,
  Heart,
  PlusSquare,
  Users,
  FileText,
  Sliders,
  Download,
} from "lucide-react"
import type {
  EmailTopCampaignSidebarItem,
  EmailOptimizeTipItem,
  EmailQuickActionItem,
} from "@/features/admin-marketing/stayea-admin-marketing-mock-data"

interface EmailRightSidebarProps {
  topCampaigns: EmailTopCampaignSidebarItem[]
  optimizeTips: EmailOptimizeTipItem[]
  quickActions: EmailQuickActionItem[]
  onActionClick?: (actionKey: string) => void
  onViewAllTop?: () => void
  onViewAllTips?: () => void
}

function renderTipIcon(iconType: EmailOptimizeTipItem["iconType"]) {
  switch (iconType) {
    case "mail":
      return (
        <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
          <Mail className="w-4 h-4" />
        </div>
      )
    case "user":
      return (
        <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
          <User className="w-4 h-4" />
        </div>
      )
    case "abtest":
      return (
        <div className="w-7 h-7 rounded-lg bg-emerald-50 text-[#007a48] flex items-center justify-center shrink-0">
          <Split className="w-4 h-4" />
        </div>
      )
    case "clock":
      return (
        <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
          <Clock className="w-4 h-4" />
        </div>
      )
    case "heart":
      return (
        <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
          <Heart className="w-4 h-4" />
        </div>
      )
    default:
      return null
  }
}

function renderQuickActionIcon(iconType: EmailQuickActionItem["iconType"]) {
  switch (iconType) {
    case "create":
      return <PlusSquare className="w-4 h-4 text-emerald-600" />
    case "subscribers":
      return <Users className="w-4 h-4 text-emerald-600" />
    case "template":
      return <FileText className="w-4 h-4 text-emerald-600" />
    case "automation":
      return <Sliders className="w-4 h-4 text-emerald-600" />
    case "export":
      return <Download className="w-4 h-4 text-emerald-600" />
    default:
      return null
  }
}

export function EmailRightSidebar({
  topCampaigns,
  optimizeTips,
  quickActions,
  onActionClick,
  onViewAllTop,
  onViewAllTips,
}: EmailRightSidebarProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* 1. Tropical Promo Banner */}
      <div className="relative rounded-xl overflow-hidden shadow-xs h-[92px] group cursor-pointer">
        <img
          src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&auto=format&fit=crop&q=80"
          alt="Email chạm đúng khách cùng Stayea"
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-sky-900/90 via-sky-800/75 to-transparent" />
        <div className="relative h-full flex items-center justify-between px-4 text-white z-10">
          <div className="max-w-[75%]">
            <h3 className="text-xs font-bold leading-tight drop-shadow-xs">
              Email chạm đúng khách cùng Stayea
            </h3>
            <p className="text-[11px] text-white/90 mt-1 leading-snug line-clamp-1">
              Kết nối gần hơn, gia tăng đặt phòng
            </p>
          </div>
          <div className="w-7 h-7 rounded-full bg-white text-slate-800 flex items-center justify-center shrink-0 shadow-sm group-hover:bg-[#007a48] group-hover:text-white transition-colors">
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* 2. Top chiến dịch email */}
      <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold text-slate-900">
            Top chiến dịch email
          </h2>
          <button
            type="button"
            onClick={onViewAllTop}
            className="text-[11px] font-semibold text-[#007a48] hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            <span>Xem tất cả</span>
            <span>→</span>
          </button>
        </div>

        <div className="divide-y divide-slate-50">
          {topCampaigns.map((item) => (
            <div
              key={item.id}
              className="py-2 flex items-center justify-between text-xs hover:bg-slate-50/60 px-1 rounded transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-4 text-slate-400 font-bold text-center text-xs">
                  {item.order}
                </span>
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-6 h-6 rounded-md object-cover border border-slate-200"
                />
                <span className="font-semibold text-slate-800 line-clamp-1">
                  {item.title}
                </span>
              </div>
              <span className="font-bold text-slate-800 text-[11px] shrink-0 ml-2">
                {item.openRate}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Gợi ý tối ưu email (5 tips) */}
      <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold text-slate-900">
            Gợi ý tối ưu email
          </h2>
          <button
            type="button"
            onClick={onViewAllTips}
            className="text-[11px] font-semibold text-[#007a48] hover:underline flex items-center gap-0.5 cursor-pointer"
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
              type="button"
              onClick={() => onActionClick?.(qa.actionKey)}
              className="w-full py-2.5 flex items-center justify-between text-xs text-slate-700 font-medium hover:text-[#007a48] hover:bg-slate-50/80 px-1 rounded transition-colors group text-left cursor-pointer"
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
