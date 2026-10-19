"use client"

import { useState } from "react"
import Image from "next/image"
import { MoreHorizontal, Mail } from "lucide-react"
import { toast } from "sonner"
import type {
  MarketingCampaignItem,
  CampaignStatus,
} from "@/features/admin-marketing/stayea-admin-marketing-mock-data"
import { MOCK_CAMPAIGN_FULL_LIST } from "@/features/admin-marketing/stayea-admin-marketing-mock-data"

interface CampaignsTableProps {
  campaigns?: MarketingCampaignItem[]
  onActionClick?: (campaign: MarketingCampaignItem, action: string) => void
}

function renderChannelIcon(channel: MarketingCampaignItem["channel"]) {
  switch (channel) {
    case "Facebook":
      return (
        <div className="w-6 h-6 rounded-full bg-[#1877f2] flex items-center justify-center text-white text-[10px] font-extrabold shadow-2xs">
          f
        </div>
      )
    case "Google":
      return (
        <div className="w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-700 shadow-2xs">
          G
        </div>
      )
    case "Instagram":
      return (
        <div className="w-6 h-6 rounded-full bg-linear-to-tr from-[#f58529] via-[#dd2a7b] to-[#8134af] flex items-center justify-center text-white shadow-2xs">
          <svg
            className="w-3.5 h-3.5 text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.5" cy="6.5" r="1.5" />
          </svg>
        </div>
      )
    case "Zalo":
      return (
        <div className="w-6 h-6 rounded-full bg-[#0068ff] flex items-center justify-center text-white text-[7.5px] font-extrabold shadow-2xs">
          Zalo
        </div>
      )
    case "Email Marketing":
      return (
        <div className="w-6 h-6 rounded-full bg-[#10b981] flex items-center justify-center text-white shadow-2xs">
          <Mail className="w-3 h-3" />
        </div>
      )
    default:
      return (
        <div className="w-6 h-6 rounded-full bg-slate-500 flex items-center justify-center text-white text-[9px] font-bold">
          M
        </div>
      )
  }
}

function renderStatusBadge(status: CampaignStatus) {
  if (status === "completed") {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-sky-50 text-sky-700 border border-sky-200/80">
        Đã hoàn thành
      </span>
    )
  }
  if (status === "paused") {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200/80">
        Tạm dừng
      </span>
    )
  }
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
      Đang chạy
    </span>
  )
}

export function CampaignsTable({
  campaigns = MOCK_CAMPAIGN_FULL_LIST,
  onActionClick,
}: CampaignsTableProps) {
  const [activeTab, setActiveTab] = useState<"all" | "running" | "completed" | "paused">("all")
  const [selectedIds, setSelectedIds] = useState<string[]>(["camp-1"])

  const filteredCampaigns = campaigns.filter((c) => {
    if (activeTab === "all") return true
    return c.status === activeTab
  })

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredCampaigns.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(filteredCampaigns.map((c) => c.id))
    }
  }

  const toggleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id))
    } else {
      setSelectedIds([...selectedIds, id])
    }
  }

  return (
    <div className="bg-white border border-slate-200/85 rounded-2xl p-4 sm:p-5 shadow-2xs">
      {/* Header: Title + Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <h3 className="text-sm sm:text-[15px] font-bold text-slate-900 tracking-tight">
            Danh sách chiến dịch (24)
          </h3>
        </div>

        {/* Tabs: Tất cả (24) | Đang chạy (8) | Đã hoàn thành (12) | Tạm dừng (4) */}
        <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200/80 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              activeTab === "all"
                ? "bg-white text-[#007a48] shadow-2xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Tất cả (24)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("running")}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              activeTab === "running"
                ? "bg-white text-[#007a48] shadow-2xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Đang chạy (8)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("completed")}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              activeTab === "completed"
                ? "bg-white text-[#007a48] shadow-2xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Đã hoàn thành (12)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("paused")}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              activeTab === "paused"
                ? "bg-white text-[#007a48] shadow-2xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Tạm dừng (4)
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-[11px] xl:text-[11.5px] 2xl:text-xs">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 font-medium">
              <th scope="col" className="py-2.5 px-2 font-medium w-8 text-center">
                <input
                  type="checkbox"
                  aria-label="Chọn tất cả"
                  checked={
                    filteredCampaigns.length > 0 &&
                    selectedIds.length === filteredCampaigns.length
                  }
                  onChange={toggleSelectAll}
                  className="rounded border-slate-300 text-[#007a48] focus:ring-[#007a48] cursor-pointer"
                />
              </th>
              <th scope="col" className="py-2 px-1.5 font-medium min-w-[140px]">
                Tên chiến dịch
              </th>
              <th scope="col" className="py-2.5 px-1.5 font-medium text-center w-10">
                Kênh
              </th>
              <th scope="col" className="py-2 px-1.5 font-medium whitespace-nowrap">
                Loại chiến dịch
              </th>
              <th scope="col" className="py-2 px-1.5 font-medium whitespace-nowrap">
                Thời gian
              </th>
              <th scope="col" className="py-2 px-1.5 font-medium text-right sm:text-left whitespace-nowrap">
                Chi phí
              </th>
              <th scope="col" className="py-2 px-1.5 font-medium text-center whitespace-nowrap">
                Lượt tiếp cận
              </th>
              <th scope="col" className="py-2 px-1.5 font-medium text-center whitespace-nowrap">
                Đặt phòng
              </th>
              <th scope="col" className="py-2 px-1.5 font-medium text-center whitespace-nowrap">
                ROAS
              </th>
              <th scope="col" className="py-2 px-1.5 font-medium text-center whitespace-nowrap">
                Trạng thái
              </th>
              <th scope="col" className="py-2.5 pl-2 font-medium text-center w-10">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredCampaigns.map((item) => {
              const isSelected = selectedIds.includes(item.id)
              return (
                <tr
                  key={item.id}
                  className={`transition-colors group ${
                    isSelected ? "bg-emerald-50/30" : "hover:bg-slate-50/70"
                  }`}
                >
                  {/* Checkbox */}
                  <td className="py-2.5 px-2 text-center">
                    <input
                      type="checkbox"
                      aria-label={`Chọn ${item.title}`}
                      checked={isSelected}
                      onChange={() => toggleSelectOne(item.id)}
                      className="rounded border-slate-300 text-[#007a48] focus:ring-[#007a48] cursor-pointer"
                    />
                  </td>

                  {/* Campaign Image + Title */}
                  <td className="py-2.5 px-1.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover"
                          sizes="32px"
                        />
                      </div>
                      <span className="font-semibold text-slate-900 group-hover:text-[#007a48] transition-colors truncate max-w-[140px] 2xl:max-w-[190px]">
                        {item.title}
                      </span>
                    </div>
                  </td>

                  {/* Channel Icon */}
                  <td className="py-2.5 px-1.5 text-center">
                    <div className="flex justify-center">
                      {renderChannelIcon(item.channel)}
                    </div>
                  </td>

                  {/* Channel Type */}
                  <td className="py-2.5 px-1.5 text-slate-600 whitespace-nowrap font-medium">
                    {item.channelType}
                  </td>

                  {/* Date Range */}
                  <td className="py-2.5 px-1.5 text-slate-500 whitespace-nowrap">
                    {item.dateRange}
                  </td>

                  {/* Cost */}
                  <td className="py-2.5 px-1.5 font-medium text-slate-800 text-right sm:text-left whitespace-nowrap">
                    {item.costFormatted}
                  </td>

                  {/* Reach */}
                  <td className="py-2.5 px-1.5 text-center font-medium text-slate-800 whitespace-nowrap">
                    {item.reachFormatted}
                  </td>

                  {/* Bookings */}
                  <td className="py-2.5 px-1.5 text-center font-bold text-slate-900 whitespace-nowrap">
                    {item.ordersCount}
                  </td>

                  {/* ROAS */}
                  <td className="py-2.5 px-1.5 text-center font-bold text-slate-800 whitespace-nowrap">
                    {item.roas}
                  </td>

                  {/* Status Badge */}
                  <td className="py-2.5 px-1.5 text-center whitespace-nowrap">
                    {renderStatusBadge(item.status)}
                  </td>

                  {/* Actions */}
                  <td className="py-2.5 pl-2 text-center">
                    <button
                      type="button"
                      onClick={() =>
                        onActionClick
                          ? onActionClick(item, "view")
                          : toast.info(`Chi tiết chiến dịch: ${item.title}`, {
                              description: `ROAS: ${item.roas} | Doanh số: ${item.ordersCount} đặt phòng`,
                            })
                      }
                      className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                      title="Thao tác"
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
