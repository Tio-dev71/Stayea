"use client"

import { useMemo } from "react"
import Image from "next/image"
import {
  ChevronRight,
  PlusCircle,
  Ticket,
  ListFilter,
  BarChart2,
  Settings,
  Tag,
} from "lucide-react"
import type { DealItem } from "@/features/admin-deals/stayea-admin-deals-mock-data"

interface DealsRightSidebarProps {
  deals?: readonly DealItem[]
  onOpenCreateModal: () => void
  onQuickAction?: (actionId: string) => void
}

export function DealsRightSidebar({
  deals = [],
  onOpenCreateModal,
  onQuickAction,
}: DealsRightSidebarProps) {
  const totalDeals = deals.length

  const categoryStats = useMemo(() => {
    if (totalDeals === 0) return []
    const counts: Record<string, number> = {}
    deals.forEach((d) => {
      const t = d.type || "Khác"
      counts[t] = (counts[t] || 0) + 1
    })
    const palette = ["#10b981", "#059669", "#f59e0b", "#0284c7", "#8b5cf6", "#64748b"]
    return Object.entries(counts).map(([name, count], idx) => ({
      name,
      count,
      percent: Math.round((count / totalDeals) * 100),
      color: palette[idx % palette.length]!,
    }))
  }, [deals, totalDeals])

  const topDeals = useMemo(() => {
    if (totalDeals === 0) return []
    return [...deals]
      .sort((a, b) => (b.usedCount || 0) - (a.usedCount || 0))
      .slice(0, 5)
      .map((d, idx) => ({
        rank: idx + 1,
        name: d.name,
        bookings: `${d.usedCount || 0} lượt đặt`,
        image: d.image || "/experience/cano-4-islands.jpg",
      }))
  }, [deals, totalDeals])

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
              {categoryStats.map((item, idx) => {
                let offset = 0
                for (let i = 0; i < idx; i++) {
                  offset += categoryStats[i]!.percent
                }
                return (
                  <path
                    key={item.name}
                    stroke={item.color}
                    strokeDasharray={`${item.percent}, 100`}
                    strokeDashoffset={-offset}
                    strokeWidth="4"
                    strokeLinecap="round"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                )
              })}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-sm font-bold text-slate-900 leading-none">{totalDeals}</span>
              <span className="text-[9px] text-slate-400 mt-0.5">Chương trình</span>
            </div>
          </div>

          {/* Legend */}
          <div className="flex-1 space-y-1.5 text-[11px]">
            {categoryStats.length === 0 ? (
              <div className="text-slate-400 text-xs py-2">Chưa có phân loại ưu đãi.</div>
            ) : (
              categoryStats.map((item) => (
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
              ))
            )}
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
          {topDeals.length === 0 ? (
            <div className="py-4 text-center text-xs text-slate-400 flex flex-col items-center gap-1.5">
              <Tag className="w-5 h-5 text-slate-300 stroke-[1.5]" />
              <span>Chưa có chương trình nào để xếp hạng.</span>
            </div>
          ) : (
            topDeals.map((prog) => (
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
                  <h5 className="text-xs font-semibold text-slate-800 truncate">
                    {prog.name}
                  </h5>
                  <p className="text-[11px] text-slate-400">{prog.bookings}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 4. Thao tác nhanh */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs space-y-2">
        <h4 className="text-xs font-bold text-slate-900 mb-2">Thao tác nhanh</h4>

        <button
          type="button"
          onClick={onOpenCreateModal}
          className="w-full flex items-center gap-2.5 p-2 rounded-xl text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#1b7a4e] transition-colors"
        >
          <PlusCircle className="w-4 h-4 text-slate-400" />
          <span>Tạo chương trình khuyến mãi mới</span>
        </button>

        <button
          type="button"
          onClick={() => onQuickAction?.("coupons")}
          className="w-full flex items-center gap-2.5 p-2 rounded-xl text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#1b7a4e] transition-colors"
        >
          <Ticket className="w-4 h-4 text-slate-400" />
          <span>Quản lý mã giảm giá</span>
        </button>

        <button
          type="button"
          onClick={() => onQuickAction?.("list")}
          className="w-full flex items-center gap-2.5 p-2 rounded-xl text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#1b7a4e] transition-colors"
        >
          <ListFilter className="w-4 h-4 text-slate-400" />
          <span>Danh sách chương trình</span>
        </button>

        <button
          type="button"
          onClick={() => onQuickAction?.("report")}
          className="w-full flex items-center gap-2.5 p-2 rounded-xl text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#1b7a4e] transition-colors"
        >
          <BarChart2 className="w-4 h-4 text-slate-400" />
          <span>Báo cáo hiệu quả khuyến mãi</span>
        </button>

        <button
          type="button"
          onClick={() => onQuickAction?.("automation")}
          className="w-full flex items-center gap-2.5 p-2 rounded-xl text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#1b7a4e] transition-colors"
        >
          <Settings className="w-4 h-4 text-slate-400" />
          <span>Cài đặt ưu đãi tự động</span>
        </button>
      </div>
    </div>
  )
}
