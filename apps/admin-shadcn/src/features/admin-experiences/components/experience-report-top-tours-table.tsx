/* eslint-disable @next/next/no-img-element */
"use client"

import { ArrowUp, MoreHorizontal, Star } from "lucide-react"
import type { TopSellingTourRow } from "@/features/admin-experiences/stayea-admin-experience-report-mock-data"

interface ExperienceReportTopToursTableProps {
  tours: TopSellingTourRow[]
  onViewAll?: () => void
  onTourAction?: (tour: TopSellingTourRow) => void
}

export function ExperienceReportTopToursTable({
  tours,
  onViewAll,
  onTourAction,
}: ExperienceReportTopToursTableProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold text-slate-900">
          Top tour & trải nghiệm bán chạy
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
              <th className="py-2.5 px-3 font-medium">Tên tour/trải nghiệm</th>
              <th className="py-2.5 px-3 font-medium">Điểm đến</th>
              <th className="py-2.5 px-3 font-medium text-center">Lượt đặt</th>
              <th className="py-2.5 px-3 font-medium text-right">Doanh thu</th>
              <th className="py-2.5 px-3 font-medium text-center">Đánh giá</th>
              <th className="py-2.5 px-3 font-medium text-center">Xu hướng</th>
              <th className="py-2.5 px-3 font-medium text-center">Trạng thái</th>
              <th className="py-2.5 px-3 font-medium text-center w-14">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {tours.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-slate-50/70 transition-colors group"
              >
                {/* 1. Order */}
                <td className="py-3 px-3 text-slate-400 font-semibold">
                  {item.order}
                </td>

                {/* 2. Tour Name + Thumbnail */}
                <td className="py-3 px-3 font-medium text-slate-900 whitespace-nowrap">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-7 h-7 rounded-md object-cover border border-slate-200 shrink-0"
                    />
                    <span className="font-semibold text-slate-800">
                      {item.title}
                    </span>
                  </div>
                </td>

                {/* 3. Destination */}
                <td className="py-3 px-3 text-slate-600 font-medium whitespace-nowrap">
                  {item.destination}
                </td>

                {/* 4. Bookings */}
                <td className="py-3 px-3 text-center font-bold text-slate-900">
                  {item.bookingsCount}
                </td>

                {/* 5. Revenue */}
                <td className="py-3 px-3 text-right font-medium text-slate-800 whitespace-nowrap">
                  {item.revenueFormatted}
                </td>

                {/* 6. Rating */}
                <td className="py-3 px-3 text-center whitespace-nowrap">
                  <div className="inline-flex items-center gap-1 font-semibold text-slate-800">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{item.rating}</span>
                  </div>
                </td>

                {/* 7. Trend */}
                <td className="py-3 px-3 text-center whitespace-nowrap">
                  <span className="inline-flex items-center gap-0.5 text-emerald-600 font-bold text-[11px]">
                    <ArrowUp className="w-3.5 h-3.5 stroke-[2.5]" />
                    {item.trendPercent}
                  </span>
                </td>

                {/* 8. Status */}
                <td className="py-3 px-3 text-center whitespace-nowrap">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                    {item.status}
                  </span>
                </td>

                {/* 9. Action */}
                <td className="py-3 px-3 text-center">
                  <button
                    type="button"
                    onClick={() => onTourAction?.(item)}
                    className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors cursor-pointer inline-flex items-center justify-center"
                    aria-label={`Thao tác cho tour ${item.title}`}
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
