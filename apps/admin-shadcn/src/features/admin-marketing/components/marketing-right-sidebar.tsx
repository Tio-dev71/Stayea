"use client"

import Image from "next/image"
import {
  ChevronRight,
  TrendingUp,
  TrendingDown,
  FileText,
  Send,
  MessageSquare,
  Mail,
  Megaphone,
  Tag,
  PlusCircle,
  Sliders,
  Calendar,
  FileSpreadsheet,
} from "lucide-react"
import { toast } from "sonner"
import type {
  MarketingRelatedReportItem,
  MarketingQuickActionItem,
  MarketingRankedChannel,
  MarketingSuggestionItem,
} from "@/features/admin-marketing/stayea-admin-marketing-mock-data"
import {
  MOCK_MARKETING_KEY_METRICS,
  MOCK_MARKETING_RELATED_REPORTS,
  MOCK_MARKETING_QUICK_ACTIONS,
} from "@/features/admin-marketing/stayea-admin-marketing-mock-data"

interface MarketingRightSidebarProps {
  onSelectReport?: (reportId: string) => void
  onQuickActionClick?: (actionKey: string) => void
  onExportReport?: () => void
  // Backwards compatibility props
  rankedChannels?: MarketingRankedChannel[]
  suggestions?: MarketingSuggestionItem[]
  quickActions?: MarketingQuickActionItem[]
  onSuggestionClick?: (sug: MarketingSuggestionItem) => void
  onViewChannelDetails?: () => void
  onViewAllSuggestions?: () => void
}

function getRelatedReportIcon(type: MarketingRelatedReportItem["iconType"]) {
  switch (type) {
    case "campaign":
      return <FileText className="w-4 h-4 text-sky-600" />
    case "channel":
      return <Send className="w-4 h-4 text-blue-600" />
    case "content":
      return <MessageSquare className="w-4 h-4 text-amber-500" />
    case "email":
      return <Mail className="w-4 h-4 text-sky-500" />
    case "social":
      return <Megaphone className="w-4 h-4 text-emerald-600" />
    case "promotion":
      return <Tag className="w-4 h-4 text-purple-600" />
    default:
      return <FileText className="w-4 h-4 text-slate-500" />
  }
}

function getQuickActionIcon(type: MarketingQuickActionItem["iconType"]) {
  switch (type) {
    case "create":
      return (
        <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
          <PlusCircle className="w-4 h-4 text-emerald-600" />
        </div>
      )
    case "ads":
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
  }
}

export function MarketingRightSidebar({
  onSelectReport,
  onQuickActionClick,
  onExportReport,
  quickActions,
}: MarketingRightSidebarProps) {
  const actionsList = quickActions ?? MOCK_MARKETING_QUICK_ACTIONS

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
              Tăng hiệu quả marketing cùng Stayea
            </h4>
            <p className="text-xs text-white/90">
              Đưa Việt Nam đến gần hơn
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

      {/* 2. Card "Chỉ số marketing quan trọng" */}
      <div className="bg-white border border-slate-200/85 rounded-2xl p-4 sm:p-5 shadow-2xs">
        <h4 className="text-sm sm:text-[15px] font-bold text-slate-900 tracking-tight pb-3 border-b border-slate-100">
          Chỉ số marketing quan trọng
        </h4>

        <div className="divide-y divide-slate-100 text-xs sm:text-[13px] pt-1">
          {MOCK_MARKETING_KEY_METRICS.map((metric) => (
            <div
              key={metric.id}
              className="py-2.5 flex items-center justify-between gap-2 hover:bg-slate-50/60 transition-colors rounded-md px-1"
            >
              <span className="text-slate-600 font-medium truncate pr-1">
                {metric.label}
              </span>
              <div className="flex items-center gap-2 shrink-0">
                <span className="font-bold text-slate-900">{metric.value}</span>
                <span className="text-[11px] font-semibold flex items-center gap-0.5 text-emerald-600">
                  {metric.trendDirection === "down" ? (
                    <TrendingDown className="w-3 h-3" />
                  ) : (
                    <TrendingUp className="w-3 h-3" />
                  )}
                  {metric.trend.replaceAll(/[↑↓]/g, "").trim()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Card "Báo cáo liên quan" */}
      <div className="bg-white border border-slate-200/85 rounded-2xl p-4 sm:p-5 shadow-2xs">
        <h4 className="text-sm sm:text-[15px] font-bold text-slate-900 tracking-tight pb-3 border-b border-slate-100">
          Báo cáo liên quan
        </h4>

        <div className="space-y-1 pt-1.5">
          {MOCK_MARKETING_RELATED_REPORTS.map((link) => (
            <button
              key={link.id}
              type="button"
              onClick={() => {
                if (onSelectReport) {
                  onSelectReport(link.id)
                } else {
                  toast.success(`Đã mở ${link.label}`)
                }
              }}
              className="w-full flex items-center justify-between p-2 rounded-xl text-xs sm:text-[13px] text-slate-700 hover:text-slate-900 hover:bg-slate-50/90 transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-2.5 min-w-0 pr-1">
                <div className="w-7 h-7 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 group-hover:bg-white group-hover:border-slate-200 transition-colors">
                  {getRelatedReportIcon(link.iconType)}
                </div>
                <span className="font-medium truncate">{link.label}</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all shrink-0" />
            </button>
          ))}
        </div>
      </div>

      {/* 4. Card "Thao tác nhanh" */}
      <div className="bg-white border border-slate-200/85 rounded-2xl p-4 sm:p-5 shadow-2xs">
        <h4 className="text-sm sm:text-[15px] font-bold text-slate-900 tracking-tight pb-3 border-b border-slate-100">
          Thao tác nhanh
        </h4>

        <div className="space-y-1.5 pt-1.5">
          {actionsList.map((action) => (
            <button
              key={action.id}
              type="button"
              onClick={() => {
                if (action.actionKey === "export-report") {
                  if (onExportReport) {
                    onExportReport()
                  } else {
                    toast.success("Đang tạo tệp báo cáo marketing...")
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
                {getQuickActionIcon(action.iconType)}
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
