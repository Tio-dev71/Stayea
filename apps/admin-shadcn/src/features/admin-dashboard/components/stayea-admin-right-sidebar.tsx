"use client"

import Image from "next/image"
import {
  ArrowRight,
  Home,
  Tag,
  Palmtree,
  Send,
  BarChart2,
  CalendarCheck,
  Star,
  CreditCard,
  UserCheck,
  Leaf,
} from "lucide-react"
import type { AdminActivityItem } from "@/features/admin-dashboard/stayea-admin-mock-data"
import { ADMIN_RECENT_ACTIVITIES_VI } from "@/features/admin-dashboard/stayea-admin-mock-data"

interface StayeaAdminRightSidebarProps {
  activities?: readonly AdminActivityItem[]
  onQuickAction?: (actionKey: string) => void
  onViewAllActivities?: () => void
}

function getActivityIcon(type: AdminActivityItem["type"]) {
  switch (type) {
    case "booking": {
      return (
        <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
          <CalendarCheck className="w-4 h-4" />
        </div>
      )
    }
    case "property": {
      return (
        <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
          <Home className="w-4 h-4" />
        </div>
      )
    }
    case "review": {
      return (
        <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
          <Star className="w-4 h-4 fill-amber-400" />
        </div>
      )
    }
    case "payment": {
      return (
        <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
          <CreditCard className="w-4 h-4" />
        </div>
      )
    }
    case "partner": {
      return (
        <div className="w-8 h-8 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
          <UserCheck className="w-4 h-4" />
        </div>
      )
    }
  }
}

export function StayeaAdminRightSidebar({
  activities = ADMIN_RECENT_ACTIVITIES_VI,
  onQuickAction,
  onViewAllActivities,
}: StayeaAdminRightSidebarProps) {
  return (
    <div className="flex flex-col gap-5">
      {/* 1. Top Banner: Nhiều hơn một nơi lưu trú */}
      <div className="relative overflow-hidden rounded-2xl aspect-[16/6] border border-slate-200/80 shadow-xs group">
        <Image
          src="/about/story-beach.jpg"
          alt="Phú Quốc"
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/70 via-slate-900/40 to-transparent flex items-center justify-between p-4 sm:p-5 text-white">
          <div className="space-y-0.5">
            <h3 className="text-xs sm:text-sm font-bold tracking-tight">
              Nhiều hơn một nơi lưu trú
            </h3>
            <p className="text-[11px] text-emerald-100/90 font-medium">
              Một hành trình hạnh phúc
            </p>
          </div>
          <button
            type="button"
            aria-label="Khám phá"
            onClick={() => onQuickAction?.("banner-action")}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white text-slate-800 flex items-center justify-center shrink-0 shadow-md hover:scale-105 active:scale-95 transition-transform"
          >
            <ArrowRight className="w-4 h-4 text-emerald-700" />
          </button>
        </div>
      </div>

      {/* 2. Thao tác nhanh */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
        <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight mb-3">
          Thao tác nhanh
        </h3>
        <div className="space-y-2">
          {/* Action 1 */}
          <button
            type="button"
            onClick={() => onQuickAction?.("add-property")}
            className="w-full flex items-center gap-3 p-2.5 rounded-xl border border-slate-200/80 hover:border-emerald-300 hover:bg-emerald-50/40 text-left transition-all group"
          >
            <Home className="w-4 h-4 text-slate-600 group-hover:text-emerald-700 transition-colors shrink-0" />
            <span className="text-xs font-semibold text-slate-700 group-hover:text-emerald-900">
              Thêm bất động sản mới
            </span>
          </button>

          {/* Action 2 */}
          <button
            type="button"
            onClick={() => onQuickAction?.("create-promotion")}
            className="w-full flex items-center gap-3 p-2.5 rounded-xl border border-slate-200/80 hover:border-emerald-300 hover:bg-emerald-50/40 text-left transition-all group"
          >
            <Tag className="w-4 h-4 text-slate-600 group-hover:text-emerald-700 transition-colors shrink-0" />
            <span className="text-xs font-semibold text-slate-700 group-hover:text-emerald-900">
              Tạo chương trình khuyến mãi
            </span>
          </button>

          {/* Action 3 */}
          <button
            type="button"
            onClick={() => onQuickAction?.("create-experience")}
            className="w-full flex items-center gap-3 p-2.5 rounded-xl border border-slate-200/80 hover:border-emerald-300 hover:bg-emerald-50/40 text-left transition-all group"
          >
            <Palmtree className="w-4 h-4 text-slate-600 group-hover:text-emerald-700 transition-colors shrink-0" />
            <span className="text-xs font-semibold text-slate-700 group-hover:text-emerald-900">
              Tạo tour/trải nghiệm
            </span>
          </button>

          {/* Action 4 */}
          <button
            type="button"
            onClick={() => onQuickAction?.("send-announcement")}
            className="w-full flex items-center gap-3 p-2.5 rounded-xl border border-slate-200/80 hover:border-emerald-300 hover:bg-emerald-50/40 text-left transition-all group"
          >
            <Send className="w-4 h-4 text-slate-600 group-hover:text-emerald-700 transition-colors shrink-0" />
            <span className="text-xs font-semibold text-slate-700 group-hover:text-emerald-900">
              Gửi thông báo
            </span>
          </button>

          {/* Action 5 */}
          <button
            type="button"
            onClick={() => onQuickAction?.("view-reports")}
            className="w-full flex items-center gap-3 p-2.5 rounded-xl border border-slate-200/80 hover:border-emerald-300 hover:bg-emerald-50/40 text-left transition-all group"
          >
            <BarChart2 className="w-4 h-4 text-slate-600 group-hover:text-emerald-700 transition-colors shrink-0" />
            <span className="text-xs font-semibold text-slate-700 group-hover:text-emerald-900">
              Xem báo cáo
            </span>
          </button>
        </div>
      </div>

      {/* 3. Hoạt động gần đây */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
            Hoạt động gần đây
          </h3>
          <button
            type="button"
            onClick={onViewAllActivities}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#1b7a4e] hover:text-emerald-800 hover:underline transition-colors"
          >
            <span>Xem tất cả</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="space-y-3.5">
          {activities.map((act) => (
            <div key={act.id} className="flex items-center gap-3">
              {getActivityIcon(act.type)}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-800 truncate">
                  {act.title}
                </p>
                <p className="text-[11px] text-slate-400 font-medium">
                  {act.timeAgo}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Du lịch bền vững Phú Quốc */}
      <div className="relative overflow-hidden rounded-2xl bg-[#eef8f3] border border-emerald-100 p-4 shadow-xs">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-100/80 text-emerald-800 flex items-center justify-center shrink-0">
              <Leaf className="w-4 h-4 fill-emerald-600 text-emerald-700" />
            </div>
            <p className="text-xs font-semibold text-slate-800 leading-snug">
              Cùng Stayea phát triển du lịch bền vững tại Phú Quốc
            </p>
          </div>
          <button
            type="button"
            aria-label="Tìm hiểu thêm"
            onClick={() => onQuickAction?.("sustainable-tourism")}
            className="w-8 h-8 rounded-full bg-white text-emerald-800 flex items-center justify-center shrink-0 shadow-sm hover:scale-105 active:scale-95 transition-transform"
          >
            <ArrowRight className="w-4 h-4 text-emerald-700" />
          </button>
        </div>
      </div>
    </div>
  )
}
