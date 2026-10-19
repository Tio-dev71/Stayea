/* eslint-disable @next/next/no-img-element */
"use client"

import { MoreHorizontal } from "lucide-react"
import type { AdsCampaignRowItem } from "@/features/admin-marketing/stayea-admin-marketing-mock-data"

interface AdsCampaignsTableProps {
  items: AdsCampaignRowItem[]
  onAction?: (item: AdsCampaignRowItem, action: string) => void
  onViewAll?: () => void
}

function renderChannelIcon(channel: AdsCampaignRowItem["channel"]) {
  switch (channel) {
    case "facebook":
      return (
        <span className="w-5 h-5 rounded-full bg-[#1877F2] text-white flex items-center justify-center font-bold text-[11px] shadow-xs shrink-0">
          f
        </span>
      )
    case "google":
      return (
        <span className="w-5 h-5 rounded-full bg-white border border-slate-200 text-slate-700 flex items-center justify-center font-bold text-[10px] shadow-xs shrink-0">
          <span className="text-[#EA4335]">G</span>
        </span>
      )
    case "instagram":
      return (
        <span className="w-5 h-5 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white flex items-center justify-center font-bold text-[10px] shadow-xs shrink-0">
          📷
        </span>
      )
    case "zalo":
      return (
        <span className="w-5 h-5 rounded-full bg-[#0068FF] text-white flex items-center justify-center font-bold text-[9px] shadow-xs shrink-0">
          Z
        </span>
      )
    case "tiktok":
      return (
        <span className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center font-bold text-[10px] shadow-xs shrink-0">
          🎵
        </span>
      )
    default:
      return null
  }
}

export function AdsCampaignsTable({
  items,
  onAction,
  onViewAll,
}: AdsCampaignsTableProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between mb-3.5">
        <h2 className="text-sm font-bold text-slate-900">
          Danh sách chiến dịch quảng cáo
        </h2>
        <button
          type="button"
          onClick={onViewAll}
          className="text-xs font-semibold text-[#007a48] hover:text-[#00633b] hover:underline flex items-center gap-1 transition-colors cursor-pointer"
        >
          <span>Xem tất cả</span>
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
              <th className="py-2.5 px-2 font-semibold text-center">Kênh</th>
              <th className="py-2.5 px-3 font-semibold">Thời gian</th>
              <th className="py-2.5 px-3 font-semibold text-right">Chi phí</th>
              <th className="py-2.5 px-3 font-semibold text-right">Lượt hiển thị</th>
              <th className="py-2.5 px-3 font-semibold text-right">Lượt nhấp</th>
              <th className="py-2.5 px-3 font-semibold text-right">Chuyển đổi</th>
              <th className="py-2.5 px-2 font-semibold text-center">ROAS</th>
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

                {/* Channel Icon */}
                <td className="py-3 px-2 text-center">
                  <div className="flex justify-center">
                    {renderChannelIcon(row.channel)}
                  </div>
                </td>

                {/* Period */}
                <td className="py-3 px-3 text-slate-500 whitespace-nowrap">
                  {row.period}
                </td>

                {/* Cost */}
                <td className="py-3 px-3 text-right font-medium text-slate-800 whitespace-nowrap">
                  {row.cost}
                </td>

                {/* Impressions */}
                <td className="py-3 px-3 text-right text-slate-600">
                  {row.impressions}
                </td>

                {/* Clicks */}
                <td className="py-3 px-3 text-right text-slate-600">
                  {row.clicks}
                </td>

                {/* Conversions */}
                <td className="py-3 px-3 text-right font-semibold text-slate-800">
                  {row.conversions}
                </td>

                {/* ROAS */}
                <td className="py-3 px-2 text-center font-bold text-slate-800">
                  {row.roas}
                </td>

                {/* Status Badge */}
                <td className="py-3 px-3 text-center">
                  {row.status === "active" ? (
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 whitespace-nowrap">
                      Đang chạy
                    </span>
                  ) : (
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-700 whitespace-nowrap">
                      Tạm dừng
                    </span>
                  )}
                </td>

                {/* Action button */}
                <td className="py-3 px-2 text-center">
                  <button
                    type="button"
                    onClick={() => onAction?.(row, "view")}
                    className="w-7 h-7 inline-flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                    title="Thao tác quảng cáo"
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
