"use client"

import Image from "next/image"
import {
  Send,
  Crown,
  Target,
  MapPin,
  Globe,
  FileSpreadsheet,
  ChevronRight,
  UserPlus,
  Mail,
  Settings,
  TrendingUp,
} from "lucide-react"
import { toast } from "sonner"
import {
  MOCK_CUSTOMER_KEY_METRICS,
  MOCK_CUSTOMER_RELATED_REPORTS,
} from "@/features/admin-reports/stayea-admin-reports-customers-mock-data"

function getRelatedCustomerIcon(icon: string) {
  switch (icon) {
    case "detail":
      return <Send className="w-4 h-4 text-sky-600" />
    case "loyalty":
      return <Crown className="w-4 h-4 text-amber-500" />
    case "segment":
      return <Target className="w-4 h-4 text-emerald-600" />
    case "region":
      return <MapPin className="w-4 h-4 text-blue-500" />
    case "channel":
      return <Globe className="w-4 h-4 text-cyan-600" />
    case "export":
      return <FileSpreadsheet className="w-4 h-4 text-teal-600" />
    default:
      return <Send className="w-4 h-4 text-slate-500" />
  }
}

interface ReportsCustomersRightSidebarProps {
  onSelectTab?: (tabId: string) => void
  onExportCustomerList?: () => void
}

export function ReportsCustomersRightSidebar({
  onSelectTab,
  onExportCustomerList,
}: ReportsCustomersRightSidebarProps) {
  return (
    <div className="space-y-4">
      {/* 1. Banner "Gia tăng khách hàng cùng Stayea" */}
      <div className="relative overflow-hidden rounded-2xl border border-sky-200/80 p-4 sm:p-5 shadow-2xs group">
        {/* Background Island Graphic */}
        <div className="absolute inset-0 pointer-events-none">
          <Image
            src="/partner/phu-quoc-aerial.jpg"
            alt="Stayea Island"
            fill
            className="object-cover object-center"
            sizes="(max-width: 1280px) 100vw, 380px"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-sky-100/95 via-sky-50/80 to-transparent" />
        </div>

        <div className="relative z-10 flex items-start justify-between gap-3">
          <div>
            <h4 className="text-sm sm:text-[15px] font-bold text-slate-900 tracking-tight">
              Gia tăng khách hàng cùng Stayea
            </h4>
            <p className="text-xs text-slate-600 mt-1 max-w-[200px] leading-relaxed">
              Kết nối nhiều trải nghiệm hơn
            </p>
          </div>
          <button
            type="button"
            onClick={() => toast.info("Xem giải pháp phát triển tệp khách hàng Stayea")}
            className="w-8 h-8 rounded-full bg-white/95 text-slate-700 shadow-xs flex items-center justify-center hover:bg-white hover:scale-105 transition-all shrink-0 cursor-pointer"
            aria-label="Xem chi tiết"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Card "Chỉ số khách hàng quan trọng" */}
      <div className="bg-white border border-slate-200/85 rounded-2xl p-4 sm:p-5 shadow-2xs">
        <h4 className="text-sm sm:text-[15px] font-bold text-slate-900 tracking-tight pb-3 border-b border-slate-100">
          Chỉ số khách hàng quan trọng
        </h4>

        <div className="divide-y divide-slate-100 text-xs sm:text-[13px] pt-1">
          {MOCK_CUSTOMER_KEY_METRICS.map((metric) => (
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
                  <TrendingUp className="w-3 h-3" />
                  {metric.changePercent.replaceAll(/[↑↓]/g, "").trim()}
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
          {MOCK_CUSTOMER_RELATED_REPORTS.map((link) => (
            <button
              key={link.id}
              type="button"
              onClick={() => {
                if (link.id === "rel-export-list") {
                  onExportCustomerList?.()
                } else {
                  toast.success(`Đã mở ${link.label}`)
                }
              }}
              className="w-full flex items-center justify-between p-2 rounded-xl text-xs sm:text-[13px] text-slate-700 hover:text-slate-900 hover:bg-slate-50/90 transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-2.5 min-w-0 pr-1">
                <div className="w-7 h-7 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 group-hover:bg-white group-hover:border-slate-200 transition-colors">
                  {getRelatedCustomerIcon(link.icon)}
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
          {/* Create Campaign */}
          <button
            type="button"
            onClick={() => {
              if (onSelectTab) {
                onSelectTab("marketing")
              }
              toast.info("Chuyển đến tạo chiến dịch mới cho khách hàng")
            }}
            className="w-full flex items-center justify-between p-2 rounded-xl text-xs sm:text-[13px] text-slate-700 hover:text-slate-900 hover:bg-slate-50/90 transition-all group cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                <UserPlus className="w-4 h-4 text-emerald-600" />
              </div>
              <span className="font-medium">Tạo chiến dịch khách hàng mới</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all shrink-0" />
          </button>

          {/* Send Email */}
          <button
            type="button"
            onClick={() => toast.info("Đã mở trình soạn thảo email chăm sóc khách hàng")}
            className="w-full flex items-center justify-between p-2 rounded-xl text-xs sm:text-[13px] text-slate-700 hover:text-slate-900 hover:bg-slate-50/90 transition-all group cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-sky-50 border border-sky-100 flex items-center justify-center shrink-0">
                <Mail className="w-4 h-4 text-sky-600" />
              </div>
              <span className="font-medium">Gửi email chăm sóc khách hàng</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all shrink-0" />
          </button>

          {/* Manage Loyalty */}
          <button
            type="button"
            onClick={() => toast.info("Đã mở trang cấu hình chương trình Loyalty")}
            className="w-full flex items-center justify-between p-2 rounded-xl text-xs sm:text-[13px] text-slate-700 hover:text-slate-900 hover:bg-slate-50/90 transition-all group cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
                <Settings className="w-4 h-4 text-amber-600" />
              </div>
              <span className="font-medium">Quản lý chương trình Loyalty</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all shrink-0" />
          </button>

          {/* Export list */}
          <button
            type="button"
            onClick={() =>
              onExportCustomerList
                ? onExportCustomerList()
                : toast.success("Đang tạo tệp danh sách khách hàng...")
            }
            className="w-full flex items-center justify-between p-2 rounded-xl text-xs sm:text-[13px] text-slate-700 hover:text-slate-900 hover:bg-slate-50/90 transition-all group cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center shrink-0">
                <FileSpreadsheet className="w-4 h-4 text-teal-600" />
              </div>
              <span className="font-medium">Xuất danh sách khách hàng</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all shrink-0" />
          </button>
        </div>
      </div>
    </div>
  )
}
