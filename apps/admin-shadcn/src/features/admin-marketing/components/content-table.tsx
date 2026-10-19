/* eslint-disable @next/next/no-img-element */
"use client"

import {
  MoreHorizontal,
  Image as ImageIcon,
  Video,
  FileText,
  Layout,
  Film,
  Globe,
} from "lucide-react"
import { MOCK_FEATURED_CONTENT_TABLE } from "@/features/admin-marketing/stayea-admin-marketing-mock-data"
import type { FeaturedContentTableItem } from "@/features/admin-marketing/stayea-admin-marketing-mock-data"

interface ContentTableProps {
  items?: FeaturedContentTableItem[]
  onActionClick?: (item: FeaturedContentTableItem, action: string) => void
}

function renderFormatIcon(type: FeaturedContentTableItem["formatType"]) {
  switch (type) {
    case "image":
      return <ImageIcon className="w-3.5 h-3.5 text-sky-500 shrink-0" />
    case "video":
      return <Video className="w-3.5 h-3.5 text-rose-500 shrink-0" />
    case "blog":
      return <FileText className="w-3.5 h-3.5 text-blue-500 shrink-0" />
    case "infographic":
      return <Layout className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
    case "reels":
      return <Film className="w-3.5 h-3.5 text-amber-500 shrink-0" />
    default:
      return <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
  }
}

function renderChannelLogo(type: FeaturedContentTableItem["channelIcon"]) {
  switch (type) {
    case "facebook":
      return (
        <div className="w-4 h-4 rounded-full bg-[#1877f2] flex items-center justify-center text-white text-[9px] font-bold shrink-0">
          f
        </div>
      )
    case "video":
      return (
        <div className="w-4 h-4 rounded-full bg-[#ea4335] flex items-center justify-center text-white text-[8px] font-bold shrink-0">
          ▶
        </div>
      )
    case "website":
      return <Globe className="w-4 h-4 text-slate-500 shrink-0" />
    case "instagram":
      return (
        <div className="w-4 h-4 rounded-md bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center text-white text-[8px] font-bold shrink-0">
          IG
        </div>
      )
    case "tiktok":
      return (
        <div className="w-4 h-4 rounded-full bg-slate-900 flex items-center justify-center text-white text-[8px] shrink-0">
          ♪
        </div>
      )
    default:
      return null
  }
}

function renderStatusBadge(status: FeaturedContentTableItem["status"]) {
  if (status === "active") {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
        Đang chạy
      </span>
    )
  }
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-sky-50 text-sky-700 border border-sky-200/60">
      Đã hoàn thành
    </span>
  )
}

export function ContentTable({
  items = MOCK_FEATURED_CONTENT_TABLE,
  onActionClick,
}: ContentTableProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.05)] overflow-hidden">
      {/* Table Header / Title */}
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
          Danh sách nội dung nổi bật
        </h3>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs sm:text-[13px]">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-500 font-medium">
              <th className="py-3.5 pl-5 pr-2 w-10 text-center">#</th>
              <th className="py-3.5 px-3 min-w-[220px]">Tiêu đề</th>
              <th className="py-3.5 px-3">Định dạng</th>
              <th className="py-3.5 px-3">Kênh</th>
              <th className="py-3.5 px-3">Ngày đăng</th>
              <th className="py-3.5 px-3 text-right">Lượt xem</th>
              <th className="py-3.5 px-3 text-right">Tương tác</th>
              <th className="py-3.5 px-3 text-right">Lượt nhấp</th>
              <th className="py-3.5 px-3 text-right font-semibold text-slate-700">
                Chuyển đổi
              </th>
              <th className="py-3.5 px-3 text-center">Trạng thái</th>
              <th className="py-3.5 pr-5 pl-3 text-center w-14">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700 font-normal">
            {items.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-slate-50/80 transition-colors group"
              >
                {/* Rank */}
                <td className="py-3 pl-5 pr-2 text-center text-slate-400 font-medium">
                  {row.rank}
                </td>

                {/* Title with Thumbnail */}
                <td className="py-3 px-3">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={row.thumbnail}
                      alt={row.title}
                      className="w-9 h-9 rounded-lg object-cover shrink-0 border border-slate-200/80"
                    />
                    <span className="font-semibold text-slate-900 line-clamp-1 group-hover:text-[#007a48] transition-colors">
                      {row.title}
                    </span>
                  </div>
                </td>

                {/* Format */}
                <td className="py-3 px-3">
                  <div className="flex items-center gap-1.5 text-slate-600">
                    {renderFormatIcon(row.formatType)}
                    <span>{row.formatLabel}</span>
                  </div>
                </td>

                {/* Channel */}
                <td className="py-3 px-3">
                  <div className="flex items-center gap-1.5 text-slate-600">
                    {renderChannelLogo(row.channelIcon)}
                    <span>{row.channel}</span>
                  </div>
                </td>

                {/* Publish Date */}
                <td className="py-3 px-3 text-slate-500 whitespace-nowrap">
                  {row.publishDate}
                </td>

                {/* Views */}
                <td className="py-3 px-3 text-right text-slate-600">
                  {row.views}
                </td>

                {/* Engagement */}
                <td className="py-3 px-3 text-right text-slate-600">
                  {row.engagement}
                </td>

                {/* Clicks */}
                <td className="py-3 px-3 text-right text-slate-600">
                  {row.clicks}
                </td>

                {/* Conversions */}
                <td className="py-3 px-3 text-right font-bold text-slate-900">
                  {row.conversions}
                </td>

                {/* Status */}
                <td className="py-3 px-3 text-center whitespace-nowrap">
                  {renderStatusBadge(row.status)}
                </td>

                {/* Actions Button */}
                <td className="py-3 pr-5 pl-3 text-center">
                  <button
                    type="button"
                    onClick={() => onActionClick?.(row, "view")}
                    className="w-7 h-7 inline-flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                    title="Thao tác nội dung"
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
