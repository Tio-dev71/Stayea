"use client"

import { ArrowUp, MoreHorizontal } from "lucide-react"
import type { SeoKeywordTableRowItem } from "@/features/admin-marketing/stayea-admin-marketing-mock-data"

interface SeoKeywordsTableProps {
  keywords: SeoKeywordTableRowItem[]
  onViewAll?: () => void
  onKeywordAction?: (keyword: SeoKeywordTableRowItem) => void
  onActionClick?: (keyword: SeoKeywordTableRowItem) => void
}

export function SeoKeywordsTable({
  keywords,
  onViewAll,
  onKeywordAction,
  onActionClick,
}: SeoKeywordsTableProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold text-slate-900">
          Chi tiết từ khóa chính
        </h2>
        <button
          type="button"
          onClick={onViewAll}
          className="text-xs font-semibold text-[#007a48] hover:underline flex items-center gap-1 cursor-pointer"
        >
          <span>Xem tất cả</span>
          <span>→</span>
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="border-b border-slate-100 text-[11px] text-slate-400 font-medium">
              <th className="py-2.5 px-3 font-medium w-8">#</th>
              <th className="py-2.5 px-3 font-medium">Từ khóa</th>
              <th className="py-2.5 px-3 font-medium text-center">Vị trí hiện tại</th>
              <th className="py-2.5 px-3 font-medium text-center">Vị trí trước đó</th>
              <th className="py-2.5 px-3 font-medium text-center">Lượt tìm kiếm/tháng</th>
              <th className="py-2.5 px-3 font-medium">URL đang xếp hạng</th>
              <th className="py-2.5 px-3 font-medium text-center">Xu hướng</th>
              <th className="py-2.5 px-3 font-medium text-center w-14">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {keywords.map((kw) => (
              <tr
                key={kw.id}
                className="hover:bg-slate-50/70 transition-colors group"
              >
                {/* 1. Order */}
                <td className="py-3 px-3 text-slate-400 font-semibold">
                  {kw.order}
                </td>

                {/* 2. Keyword */}
                <td className="py-3 px-3 font-medium text-slate-900 whitespace-nowrap">
                  {kw.keyword}
                </td>

                {/* 3. Current Position */}
                <td className="py-3 px-3 text-center font-bold text-slate-900">
                  {kw.currentRank}
                </td>

                {/* 4. Previous Position */}
                <td className="py-3 px-3 text-center text-slate-500 font-medium">
                  {kw.previousRank}
                </td>

                {/* 5. Monthly Searches */}
                <td className="py-3 px-3 text-center font-medium text-slate-700">
                  {kw.monthlySearches}
                </td>

                {/* 6. Ranking URL */}
                <td className="py-3 px-3 text-slate-500 font-normal whitespace-nowrap">
                  {kw.rankingUrl}
                </td>

                {/* 7. Trend */}
                <td className="py-3 px-3 text-center">
                  <span className="inline-flex items-center text-emerald-600 font-bold">
                    <ArrowUp className="w-3.5 h-3.5 stroke-[2.5]" />
                  </span>
                </td>

                {/* 8. Action */}
                <td className="py-3 px-3 text-center">
                  <button
                    type="button"
                    onClick={() => (onActionClick || onKeywordAction)?.(kw)}
                    className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors cursor-pointer inline-flex items-center justify-center"
                    aria-label={`Thao tác cho từ khóa ${kw.keyword}`}
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
