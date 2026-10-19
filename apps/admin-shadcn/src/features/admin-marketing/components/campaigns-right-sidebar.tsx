"use client"

import Image from "next/image"
import {
  ChevronRight,
  ClipboardList,
  Video,
  Megaphone,
  FlaskConical,
  UserCheck,
  PlusCircle,
  Sliders,
  Calendar,
  FileSpreadsheet,
  Target,
  ArrowRight,
} from "lucide-react"
import { toast } from "sonner"
import type {
  CampaignTopBookedItem,
  CampaignOptimizationSuggestion,
  CampaignQuickActionItem,
} from "@/features/admin-marketing/stayea-admin-marketing-mock-data"
import {
  MOCK_CAMPAIGN_TOP_BOOKINGS_SIDEBAR,
  MOCK_CAMPAIGN_OPTIMIZATION_SUGGESTIONS,
  MOCK_CAMPAIGN_PAGE_QUICK_ACTIONS,
} from "@/features/admin-marketing/stayea-admin-marketing-mock-data"

interface CampaignsRightSidebarProps {
  topBookedCampaigns?: CampaignTopBookedItem[]
  suggestions?: CampaignOptimizationSuggestion[]
  quickActions?: CampaignQuickActionItem[]
  onQuickActionClick?: (actionKey: string) => void
  onExportReport?: () => void
}

function renderSuggestionIcon(type: CampaignOptimizationSuggestion["iconType"]) {
  switch (type) {
    case "clipboard":
      return (
        <div className="w-7 h-7 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
          <ClipboardList className="w-4 h-4 text-amber-600" />
        </div>
      )
    case "video":
      return (
        <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
          <Video className="w-4 h-4 text-emerald-600" />
        </div>
      )
    case "megaphone":
      return (
        <div className="w-7 h-7 rounded-lg bg-sky-50 border border-sky-100 flex items-center justify-center shrink-0">
          <Megaphone className="w-4 h-4 text-sky-600" />
        </div>
      )
    case "ab-test":
      return (
        <div className="w-7 h-7 rounded-lg bg-purple-50 border border-purple-100 flex items-center justify-center shrink-0">
          <FlaskConical className="w-4 h-4 text-purple-600" />
        </div>
      )
    case "influencer":
      return (
        <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
          <UserCheck className="w-4 h-4 text-indigo-600" />
        </div>
      )
  }
}

function renderQuickActionIcon(type: CampaignQuickActionItem["iconType"]) {
  switch (type) {
    case "create":
      return (
        <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
          <PlusCircle className="w-4 h-4 text-emerald-600" />
        </div>
      )
    case "manage":
      return (
        <div className="w-7 h-7 rounded-lg bg-sky-50 border border-sky-100 flex items-center justify-center shrink-0">
          <Sliders className="w-4 h-4 text-sky-600" />
        </div>
      )
    case "calendar":
      return (
        <div className="w-7 h-7 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
          <Calendar className="w-4 h-4 text-amber-600" />
        </div>
      )
    case "export":
      return (
        <div className="w-7 h-7 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center shrink-0">
          <FileSpreadsheet className="w-4 h-4 text-teal-600" />
        </div>
      )
    case "target":
      return (
        <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
          <Target className="w-4 h-4 text-emerald-600" />
        </div>
      )
  }
}

export function CampaignsRightSidebar({
  topBookedCampaigns = MOCK_CAMPAIGN_TOP_BOOKINGS_SIDEBAR,
  suggestions = MOCK_CAMPAIGN_OPTIMIZATION_SUGGESTIONS,
  quickActions = MOCK_CAMPAIGN_PAGE_QUICK_ACTIONS,
  onQuickActionClick,
  onExportReport,
}: CampaignsRightSidebarProps) {
  return (
    <div className="space-y-4">
      {/* 1. Promo Card Phú Quốc */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-sky-400 via-teal-500 to-emerald-600 text-white p-5 shadow-xs">
        <div className="absolute inset-0 opacity-40 mix-blend-overlay">
          <Image
            src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=600&auto=format&fit=crop"
            alt="Phú Quốc Background"
            fill
            className="object-cover"
          />
        </div>
        <div className="relative z-10 flex items-start justify-between gap-3">
          <div className="space-y-1">
            <h4 className="font-bold text-sm sm:text-base leading-snug">
              Chiến dịch hiệu quả cùng Stayea
            </h4>
            <p className="text-xs text-white/90">
              Kết nối đúng khách hàng, tăng doanh thu
            </p>
          </div>
          <button
            type="button"
            onClick={() => toast.info("Xem chi tiết chương trình tăng trưởng")}
            className="w-8 h-8 rounded-full bg-white/95 text-slate-700 shadow-xs flex items-center justify-center hover:bg-white hover:scale-105 transition-all shrink-0 cursor-pointer"
            aria-label="Xem chi tiết"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Card "Top chiến dịch theo lượt đặt phòng" */}
      <div className="bg-white border border-slate-200/85 rounded-2xl p-4 sm:p-5 shadow-2xs">
        <h4 className="text-sm sm:text-[15px] font-bold text-slate-900 tracking-tight pb-3 border-b border-slate-100">
          Top chiến dịch theo lượt đặt phòng
        </h4>

        <div className="divide-y divide-slate-100 text-xs sm:text-[13px] pt-1">
          {topBookedCampaigns.map((camp) => (
            <div
              key={camp.rank}
              className="py-2.5 flex items-center justify-between gap-2.5 hover:bg-slate-50/60 transition-colors rounded-md px-1"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="w-4 text-center font-bold text-slate-500 text-xs shrink-0">
                  {camp.rank}
                </span>
                <div className="relative w-7 h-7 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                  <Image
                    src={camp.image}
                    alt={camp.title}
                    fill
                    className="object-cover"
                    sizes="28px"
                  />
                </div>
                <span className="text-slate-800 font-semibold truncate text-xs">
                  {camp.title}
                </span>
              </div>
              <span className="font-bold text-slate-900 shrink-0 text-xs">
                {camp.bookingsFormatted}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Card "Gợi ý tối ưu chiến dịch" */}
      <div className="bg-white border border-slate-200/85 rounded-2xl p-4 sm:p-5 shadow-2xs">
        <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <h4 className="text-sm sm:text-[15px] font-bold text-slate-900 tracking-tight">
            Gợi ý tối ưu chiến dịch
          </h4>
          <button
            type="button"
            onClick={() => toast.info("Xem tất cả gợi ý tối ưu")}
            className="text-xs font-semibold text-[#007a48] hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            <span>Xem tất cả</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2 pt-2">
          {suggestions.map((sug) => (
            <div
              key={sug.id}
              className="flex items-start gap-2.5 p-1.5 rounded-xl hover:bg-slate-50 transition-colors"
            >
              {renderSuggestionIcon(sug.iconType)}
              <span className="text-xs text-slate-700 font-medium leading-relaxed">
                {sug.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Card "Thao tác nhanh" */}
      <div className="bg-white border border-slate-200/85 rounded-2xl p-4 sm:p-5 shadow-2xs">
        <h4 className="text-sm sm:text-[15px] font-bold text-slate-900 tracking-tight pb-3 border-b border-slate-100">
          Thao tác nhanh
        </h4>

        <div className="space-y-1.5 pt-1.5">
          {quickActions.map((action) => (
            <button
              key={action.id}
              type="button"
              onClick={() => {
                if (action.actionKey === "export-campaigns") {
                  if (onExportReport) {
                    onExportReport()
                  } else {
                    toast.success("Đang tạo tệp báo cáo chiến dịch...")
                  }
                } else if (onQuickActionClick) {
                  onQuickActionClick(action.actionKey)
                } else {
                  toast.info(`Đã mở ${action.label}`)
                }
              }}
              className="w-full flex items-center justify-between p-2 rounded-xl text-xs sm:text-[13px] text-slate-700 hover:text-slate-900 hover:bg-slate-50/90 transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                {renderQuickActionIcon(action.iconType)}
                <span className="font-medium">{action.label}</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all shrink-0" />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
