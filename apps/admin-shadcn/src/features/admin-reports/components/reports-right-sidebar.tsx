"use client"

import Image from "next/image"
import {
  BarChart3,
  Send,
  Users,
  Compass,
  Handshake,
  CalendarCheck,
  ChevronRight,
  FileSpreadsheet,
  FileText,
  CalendarClock,
  Headphones,
  TrendingUp,
  TrendingDown,
} from "lucide-react"
import { toast } from "sonner"
import {
  MOCK_REPORT_KEY_METRICS,
  MOCK_REPORT_QUICK_LINKS,
} from "@/features/admin-reports/stayea-admin-reports-mock-data"
import type { ReportQuickReportLink } from "@/features/admin-reports/stayea-admin-reports-mock-data"

function getQuickIcon(icon: ReportQuickReportLink["icon"]) {
  switch (icon) {
    case "revenue":
      return <BarChart3 className="w-4 h-4 text-sky-600" />
    case "marketing":
      return <Send className="w-4 h-4 text-blue-500" />
    case "customers":
      return <Users className="w-4 h-4 text-indigo-500" />
    case "experiences":
      return <Compass className="w-4 h-4 text-emerald-600" />
    case "partners":
      return <Handshake className="w-4 h-4 text-teal-600" />
    case "payments":
      return <CalendarCheck className="w-4 h-4 text-cyan-600" />
    default:
      return <BarChart3 className="w-4 h-4 text-slate-500" />
  }
}

interface ReportsRightSidebarProps {
  onSelectTab?: (tabId: string) => void
  onExportFormat?: (format: "excel" | "pdf" | "schedule") => void
}

export function ReportsRightSidebar({
  onSelectTab,
  onExportFormat,
}: ReportsRightSidebarProps) {
  return (
    <div className="space-y-4">
      {/* 1. Banner "Báo cáo chi tiết" */}
      <div className="relative overflow-hidden rounded-2xl border border-sky-200/80 bg-gradient-to-br from-sky-100 via-sky-50 to-emerald-50 p-4 sm:p-5 shadow-2xs">
        {/* Background Island Graphic */}
        <div className="absolute right-0 bottom-0 top-0 w-32 opacity-25 pointer-events-none">
          <Image
            src="/phu-quoc/hero-phu-quoc.jpg"
            alt="Stayea Island"
            fill
            className="object-cover object-right"
            sizes="128px"
          />
        </div>

        <div className="relative z-10 flex items-start justify-between gap-3">
          <div>
            <h4 className="text-sm sm:text-[15px] font-bold text-slate-900 tracking-tight">
              Báo cáo chi tiết
            </h4>
            <p className="text-xs text-slate-600 mt-1 max-w-[190px] leading-relaxed">
              Hiểu rõ hiệu quả kinh doanh cùng Stayea
            </p>
          </div>
          <button
            type="button"
            onClick={() => toast.info("Xem tài liệu hướng dẫn báo cáo chuyên sâu Stayea")}
            className="w-8 h-8 rounded-full bg-white/95 text-slate-700 shadow-xs flex items-center justify-center hover:bg-white hover:scale-105 transition-all shrink-0 cursor-pointer"
            aria-label="Xem chi tiết"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Card "Chỉ số quan trọng" */}
      <div className="bg-white border border-slate-200/85 rounded-2xl p-4 sm:p-5 shadow-2xs">
        <h4 className="text-sm sm:text-[15px] font-bold text-slate-900 tracking-tight pb-3 border-b border-slate-100">
          Chỉ số quan trọng
        </h4>

        <div className="divide-y divide-slate-100 text-xs sm:text-[13px] pt-1">
          {MOCK_REPORT_KEY_METRICS.map((metric) => (
            <div
              key={metric.id}
              className="py-2.5 flex items-center justify-between gap-2 hover:bg-slate-50/60 transition-colors rounded-md px-1"
            >
              <span className="text-slate-600 font-medium truncate pr-1">
                {metric.label}
              </span>
              <div className="flex items-center gap-2 shrink-0">
                <span className="font-bold text-slate-900">{metric.value}</span>
                <span
                  className={`text-[11px] font-semibold flex items-center gap-0.5 ${
                    metric.isPositive ? "text-emerald-600" : "text-rose-500"
                  }`}
                >
                  {metric.isPositive ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  {metric.changePercent.replaceAll(/[↑↓]/g, "").trim()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Card "Báo cáo nhanh" */}
      <div className="bg-white border border-slate-200/85 rounded-2xl p-4 sm:p-5 shadow-2xs">
        <h4 className="text-sm sm:text-[15px] font-bold text-slate-900 tracking-tight pb-3 border-b border-slate-100">
          Báo cáo nhanh
        </h4>

        <div className="space-y-1 pt-1.5">
          {MOCK_REPORT_QUICK_LINKS.map((link) => (
            <button
              key={link.id}
              type="button"
              onClick={() => {
                if (link.targetTab && onSelectTab) {
                  onSelectTab(link.targetTab)
                  toast.success(`Đã mở ${link.label}`)
                }
              }}
              className="w-full flex items-center justify-between p-2 rounded-xl text-xs sm:text-[13px] text-slate-700 hover:text-slate-900 hover:bg-slate-50/90 transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-2.5 min-w-0 pr-1">
                <div className="w-7 h-7 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 group-hover:bg-white group-hover:border-slate-200 transition-colors">
                  {getQuickIcon(link.icon)}
                </div>
                <span className="font-medium truncate">{link.label}</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all shrink-0" />
            </button>
          ))}
        </div>
      </div>

      {/* 4. Card "Xuất báo cáo" */}
      <div className="bg-white border border-slate-200/85 rounded-2xl p-4 sm:p-5 shadow-2xs">
        <h4 className="text-sm sm:text-[15px] font-bold text-slate-900 tracking-tight pb-3 border-b border-slate-100">
          Xuất báo cáo
        </h4>

        <div className="space-y-1.5 pt-1.5">
          {/* Excel */}
          <button
            type="button"
            onClick={() =>
              onExportFormat ? onExportFormat("excel") : toast.success("Đang tạo tệp Excel...")
            }
            className="w-full flex items-center justify-between p-2 rounded-xl text-xs sm:text-[13px] text-slate-700 hover:text-slate-900 hover:bg-slate-50/90 transition-all group cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              </div>
              <span className="font-medium">Xuất file Excel</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all shrink-0" />
          </button>

          {/* PDF */}
          <button
            type="button"
            onClick={() =>
              onExportFormat ? onExportFormat("pdf") : toast.success("Đang tạo tệp PDF...")
            }
            className="w-full flex items-center justify-between p-2 rounded-xl text-xs sm:text-[13px] text-slate-700 hover:text-slate-900 hover:bg-slate-50/90 transition-all group cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4 text-rose-600" />
              </div>
              <span className="font-medium">Xuất file PDF</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all shrink-0" />
          </button>

          {/* Schedule */}
          <button
            type="button"
            onClick={() =>
              onExportFormat ? onExportFormat("schedule") : toast.info("Đã mở cài đặt lên lịch gửi báo cáo")
            }
            className="w-full flex items-center justify-between p-2 rounded-xl text-xs sm:text-[13px] text-slate-700 hover:text-slate-900 hover:bg-slate-50/90 transition-all group cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center shrink-0">
                <CalendarClock className="w-4 h-4 text-teal-600" />
              </div>
              <span className="font-medium">Lên lịch gửi báo cáo</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all shrink-0" />
          </button>
        </div>
      </div>

      {/* 5. Card "Cần hỗ trợ?" */}
      <div className="bg-white border border-slate-200/85 rounded-2xl p-4 sm:p-5 shadow-2xs">
        <h4 className="text-sm sm:text-[15px] font-bold text-slate-900 tracking-tight mb-2">
          Cần hỗ trợ?
        </h4>

        <div className="flex items-start gap-2.5 text-xs text-slate-600 leading-relaxed">
          <Headphones className="w-4 h-4 text-slate-700 shrink-0 mt-0.5" />
          <p>
            Liên hệ đội ngũ Stayea để được tư vấn báo cáo tùy chỉnh.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            toast.info("Đội ngũ chuyên viên tư vấn Stayea đang kết nối cùng bạn...", {
              description: "Hotline hỗ trợ đối tác & quản trị: 1900 6868",
            })
          }
          className="mt-3.5 w-full py-2 px-3 text-xs sm:text-[13px] font-semibold text-blue-600 hover:text-blue-700 bg-sky-50/60 hover:bg-sky-50 border border-sky-100 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
        >
          <span>Liên hệ ngay</span>
          <span>→</span>
        </button>
      </div>
    </div>
  )
}
