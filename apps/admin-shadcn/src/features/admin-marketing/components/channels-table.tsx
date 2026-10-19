"use client"

import { TrendingUp, MoreHorizontal } from "lucide-react"
import { MOCK_CHANNEL_PERFORMANCE_TABLE } from "@/features/admin-marketing/stayea-admin-marketing-mock-data"
import type { ChannelPerformanceTableItem } from "@/features/admin-marketing/stayea-admin-marketing-mock-data"

interface ChannelsTableProps {
  items?: ChannelPerformanceTableItem[]
  onActionClick?: (channel: ChannelPerformanceTableItem, action: string) => void
}

function renderChannelLogo(type: ChannelPerformanceTableItem["iconType"]) {
  switch (type) {
    case "facebook":
      return (
        <div className="w-6 h-6 rounded-full bg-[#1877f2] flex items-center justify-center text-white text-[11px] font-bold shrink-0">
          f
        </div>
      )
    case "google":
      return (
        <div className="w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center text-[11px] font-bold text-[#ea4335] shrink-0">
          G
        </div>
      )
    case "instagram":
      return (
        <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center text-white text-[10px] font-bold shrink-0 shadow-xs">
          IG
        </div>
      )
    case "zalo":
      return (
        <div className="w-6 h-6 rounded-full bg-[#0068ff] flex items-center justify-center text-white text-[8px] font-bold shrink-0">
          Zalo
        </div>
      )
    case "email":
      return (
        <div className="w-6 h-6 rounded-full bg-[#10b981] flex items-center justify-center text-white text-[10px] shrink-0">
          ✉
        </div>
      )
    case "tiktok":
      return (
        <div className="w-6 h-6 rounded-full bg-slate-900 flex items-center justify-center text-white text-[10px] shrink-0">
          ♪
        </div>
      )
    default:
      return (
        <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 text-xs flex items-center justify-center shrink-0">
          #
        </div>
      )
  }
}

export function ChannelsTable({
  items = MOCK_CHANNEL_PERFORMANCE_TABLE,
  onActionClick,
}: ChannelsTableProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.05)] overflow-hidden">
      {/* Table Header / Title */}
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
          Hiệu quả chi tiết theo kênh
        </h3>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs sm:text-[13px]">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-500 font-medium">
              <th className="py-3.5 pl-5 pr-2 w-10 text-center">#</th>
              <th className="py-3.5 px-3 min-w-[140px]">Kênh</th>
              <th className="py-3.5 px-3 text-right">Lượt tiếp cận</th>
              <th className="py-3.5 px-3 text-right">Lượt tương tác</th>
              <th className="py-3.5 px-3 text-right font-semibold text-slate-700">
                Lượt đặt phòng
              </th>
              <th className="py-3.5 px-3 text-right">Chi phí</th>
              <th className="py-3.5 px-3 text-right">Doanh thu</th>
              <th className="py-3.5 px-3 text-right font-semibold">ROAS</th>
              <th className="py-3.5 px-3 text-right">Tỷ lệ chuyển đổi</th>
              <th className="py-3.5 px-3 text-right">Xu hướng</th>
              <th className="py-3.5 pr-5 pl-3 text-center w-16">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700 font-normal">
            {items.map((row) => {
              const isRoasHigh = row.roas >= 4

              return (
                <tr
                  key={row.id}
                  className="hover:bg-slate-50/80 transition-colors group"
                >
                  {/* Rank */}
                  <td className="py-3 pl-5 pr-2 text-center text-slate-400 font-medium">
                    {row.rank}
                  </td>

                  {/* Channel with Icon */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2.5">
                      {renderChannelLogo(row.iconType)}
                      <span className="font-medium text-slate-900">
                        {row.name}
                      </span>
                    </div>
                  </td>

                  {/* Reach */}
                  <td className="py-3 px-3 text-right text-slate-600">
                    {row.reach}
                  </td>

                  {/* Engagement */}
                  <td className="py-3 px-3 text-right text-slate-600">
                    {row.engagement}
                  </td>

                  {/* Bookings */}
                  <td className="py-3 px-3 text-right font-bold text-slate-900">
                    {row.bookings}
                  </td>

                  {/* Cost */}
                  <td className="py-3 px-3 text-right text-slate-600">
                    {row.cost}
                  </td>

                  {/* Revenue */}
                  <td className="py-3 px-3 text-right font-medium text-slate-900">
                    {row.revenue}
                  </td>

                  {/* ROAS */}
                  <td className="py-3 px-3 text-right">
                    <span
                      className={`font-bold ${
                        isRoasHigh ? "text-emerald-600" : "text-slate-800"
                      }`}
                    >
                      {row.roas}
                    </span>
                  </td>

                  {/* Conversion Rate */}
                  <td className="py-3 px-3 text-right text-slate-600">
                    {row.conversionRate}
                  </td>

                  {/* Trend */}
                  <td className="py-3 px-3 text-right">
                    <div className="inline-flex items-center gap-0.5 text-emerald-600 font-semibold">
                      <TrendingUp className="w-3 h-3" />
                      <span>{row.trend}</span>
                    </div>
                  </td>

                  {/* Actions Button */}
                  <td className="py-3 pr-5 pl-3 text-center">
                    <button
                      type="button"
                      onClick={() => onActionClick?.(row, "view")}
                      className="w-7 h-7 inline-flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                      title="Thao tác kênh"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
