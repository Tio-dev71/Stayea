/* eslint-disable @next/next/no-img-element */
"use client"

import { MoreHorizontal } from "lucide-react"
import type { EmailCampaignRowItem } from "@/features/admin-marketing/stayea-admin-marketing-mock-data"

interface EmailCampaignsTableProps {
  items: EmailCampaignRowItem[]
  onAction?: (item: EmailCampaignRowItem, action: string) => void
  onViewAll?: () => void
}

export function EmailCampaignsTable({
  items,
  onAction,
  onViewAll,
}: EmailCampaignsTableProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between mb-3.5">
        <h2 className="text-sm font-bold text-slate-900">
          Danh sách chiến dịch email
        </h2>
        <button
          type="button"
          onClick={onViewAll}
          className="text-xs font-semibold text-[#007a48] hover:text-[#00633b] hover:underline flex items-center gap-1 transition-colors cursor-pointer"
        >
          <span>Xem chi tiết</span>
          <span>→</span>
        </button>
      </div>

      {/* Table responsive */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="border-b border-slate-100 text-[11px] text-slate-500 font-semibold bg-slate-50/50">
              <th className="py-2.5 px-2 font-semibold">#</th>
              <th className="py-2.5 px-3 font-semibold">Tên chiến dịch</th>
              <th className="py-2.5 px-3 font-semibold">Loại email</th>
              <th className="py-2.5 px-3 font-semibold">Ngày gửi</th>
              <th className="py-2.5 px-3 font-semibold text-right">Email gửi</th>
              <th className="py-2.5 px-3 font-semibold text-right">Tỷ lệ mở</th>
              <th className="py-2.5 px-3 font-semibold text-right">Tỷ lệ nhấp</th>
              <th className="py-2.5 px-3 font-semibold text-right">Chuyển đổi</th>
              <th className="py-2.5 px-3 font-semibold text-right">Doanh thu</th>
              <th className="py-2.5 px-3 font-semibold text-center">Trạng thái</th>
              <th className="py-2.5 px-2 font-semibold text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {items.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-slate-50/80 transition-colors group"
              >
                {/* Index */}
                <td className="py-3 px-2 font-medium text-slate-500">
                  {row.order}
                </td>

                {/* Campaign name + Thumbnail */}
                <td className="py-3 px-3">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={row.thumbnail}
                      alt={row.campaignName}
                      className="w-7 h-7 rounded-md object-cover shrink-0 border border-slate-200"
                    />
                    <span className="font-semibold text-slate-800 line-clamp-1 group-hover:text-[#007a48] transition-colors">
                      {row.campaignName}
                    </span>
                  </div>
                </td>

                {/* Email Type */}
                <td className="py-3 px-3 text-slate-600 whitespace-nowrap">
                  {row.emailType}
                </td>

                {/* Sent Date */}
                <td className="py-3 px-3 text-slate-500 whitespace-nowrap">
                  {row.sentDate}
                </td>

                {/* Sent Count */}
                <td className="py-3 px-3 text-right text-slate-700 font-medium">
                  {row.sentCount}
                </td>

                {/* Open Rate */}
                <td className="py-3 px-3 text-right text-slate-700 font-medium">
                  {row.openRate}
                </td>

                {/* Click Rate */}
                <td className="py-3 px-3 text-right text-slate-700 font-medium">
                  {row.clickRate}
                </td>

                {/* Conversions */}
                <td className="py-3 px-3 text-right font-semibold text-slate-800">
                  {row.conversions}
                </td>

                {/* Revenue */}
                <td className="py-3 px-3 text-right font-bold text-slate-900 whitespace-nowrap">
                  {row.revenue}
                </td>

                {/* Status Badge */}
                <td className="py-3 px-3 text-center">
                  {row.status === "sent" ? (
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 whitespace-nowrap">
                      Đã gửi
                    </span>
                  ) : (
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-sky-50 text-sky-700 whitespace-nowrap">
                      Đang chạy
                    </span>
                  )}
                </td>

                {/* Action button */}
                <td className="py-3 px-2 text-center">
                  <button
                    type="button"
                    onClick={() => onAction?.(row, "view")}
                    className="w-7 h-7 inline-flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                    title="Thao tác chiến dịch email"
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
