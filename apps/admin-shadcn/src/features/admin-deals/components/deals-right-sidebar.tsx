import Image from "next/image"
import {
  ChevronRight,
  PlusCircle,
  Ticket,
  ListFilter,
  BarChart2,
  Settings,
} from "lucide-react"
import {
  DEAL_CATEGORY_STATS,
  TOP_DEAL_PROGRAMS,
} from "@/features/admin-deals/stayea-admin-deals-mock-data"

interface DealsRightSidebarProps {
  onOpenCreateModal: () => void
  onQuickAction?: (actionId: string) => void
}

export function DealsRightSidebar({
  onOpenCreateModal,
  onQuickAction,
}: DealsRightSidebarProps) {
  return (
    <div className="space-y-4">
      {/* 1. Top Promo Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-900 to-teal-800 p-4 text-white shadow-xs">
        <div className="relative z-10">
          <span className="text-[11px] font-semibold text-emerald-200 uppercase tracking-wider block">
            Ưu đãi hấp dẫn
          </span>
          <h4 className="text-sm font-bold mt-1 text-white leading-tight">
            Khám phá thế giới cùng Stayea
          </h4>
        </div>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center cursor-pointer transition-colors">
          <ChevronRight className="w-4 h-4 text-white" />
        </div>
      </div>

      {/* 2. Donut Chart: Hiệu quả ưu đãi */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-bold text-slate-900">Hiệu quả ưu đãi</h4>
          <button
            type="button"
            onClick={() => onQuickAction?.("report")}
            className="text-[11px] font-semibold text-[#1b7a4e] hover:underline"
          >
            Xem chi tiết →
          </button>
        </div>

        <div className="flex items-center gap-4">
          {/* Donut representation */}
          <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              {/* Background circle */}
              <path
                className="text-slate-100"
                strokeWidth="4"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              {/* Segment 1: Giảm giá (46%) */}
              <path
                className="text-emerald-500"
                strokeDasharray="46, 100"
                strokeWidth="4"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              {/* Segment 2: Mã giảm giá (25%) */}
              <path
                className="text-teal-600"
                strokeDasharray="25, 100"
                strokeDashoffset="-46"
                strokeWidth="4"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              {/* Segment 3: Combo (13%) */}
              <path
                className="text-amber-500"
                strokeDasharray="13, 100"
                strokeDashoffset="-71"
                strokeWidth="4"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-sm font-bold text-slate-900 leading-none">24</span>
              <span className="text-[9px] text-slate-400 mt-0.5">Chương trình</span>
            </div>
          </div>

          {/* Legend */}
          <div className="flex-1 space-y-1.5 text-[11px]">
            {DEAL_CATEGORY_STATS.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-slate-600">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="truncate">{item.name}</span>
                </div>
                <span className="font-semibold text-slate-800 ml-2">
                  {item.percent}% ({item.count})
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Top chương trình hiệu quả */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-bold text-slate-900">Top chương trình hiệu quả</h4>
          <button
            type="button"
            onClick={() => onQuickAction?.("list")}
            className="text-[11px] font-semibold text-[#1b7a4e] hover:underline"
          >
            Xem tất cả →
          </button>
        </div>

        <div className="space-y-2.5">
          {TOP_DEAL_PROGRAMS.map((prog) => (
            <div key={prog.name} className="flex items-center gap-3">
              <span className="w-5 text-center text-xs font-bold text-slate-400">
                {prog.rank}
              </span>
              <div className="w-8 h-8 rounded-lg overflow-hidden relative shrink-0 bg-slate-100">
                <Image
                  src={prog.image}
                  alt={prog.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-xs font-semibold text-slate-800 truncate block">
                  {prog.name}
                </span>
                <span className="text-[10px] text-slate-400 block">
                  {prog.bookings}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Thao tác nhanh */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs">
        <h4 className="text-xs font-bold text-slate-900 mb-3">Thao tác nhanh</h4>

        <div className="space-y-1 text-xs">
          <button
            type="button"
            onClick={onOpenCreateModal}
            className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors text-left group"
          >
            <div className="flex items-center gap-2.5 text-slate-700 group-hover:text-[#1b7a4e]">
              <PlusCircle className="w-4 h-4 text-emerald-600" />
              <span className="font-medium">Tạo chương trình khuyến mãi mới</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </button>

          <button
            type="button"
            onClick={() => onQuickAction?.("coupons")}
            className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors text-left group"
          >
            <div className="flex items-center gap-2.5 text-slate-700 group-hover:text-[#1b7a4e]">
              <Ticket className="w-4 h-4 text-emerald-600" />
              <span className="font-medium">Quản lý mã giảm giá</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </button>

          <button
            type="button"
            onClick={() => onQuickAction?.("list")}
            className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors text-left group"
          >
            <div className="flex items-center gap-2.5 text-slate-700 group-hover:text-[#1b7a4e]">
              <ListFilter className="w-4 h-4 text-emerald-600" />
              <span className="font-medium">Danh sách chương trình</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </button>

          <button
            type="button"
            onClick={() => onQuickAction?.("report")}
            className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors text-left group"
          >
            <div className="flex items-center gap-2.5 text-slate-700 group-hover:text-[#1b7a4e]">
              <BarChart2 className="w-4 h-4 text-emerald-600" />
              <span className="font-medium">Báo cáo hiệu quả khuyến mãi</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </button>

          <button
            type="button"
            onClick={() => onQuickAction?.("auto_rules")}
            className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors text-left group"
          >
            <div className="flex items-center gap-2.5 text-slate-700 group-hover:text-[#1b7a4e]">
              <Settings className="w-4 h-4 text-emerald-600" />
              <span className="font-medium">Cài đặt ưu đãi tự động</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>
      </div>
    </div>
  )
}
