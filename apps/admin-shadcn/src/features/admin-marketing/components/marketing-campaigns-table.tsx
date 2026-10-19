"use client"

import Image from "next/image"
import { MoreHorizontal, ArrowRight, Mail } from "lucide-react"
import { toast } from "sonner"
import type {
  MarketingCampaignItem,
  CampaignStatus,
} from "@/features/admin-marketing/stayea-admin-marketing-mock-data"
import { MOCK_TOP_MARKETING_CAMPAIGNS } from "@/features/admin-marketing/stayea-admin-marketing-mock-data"

interface MarketingCampaignsTableProps {
  campaigns?: MarketingCampaignItem[]
  onViewAll?: () => void
  onActionClick?: (campaign: MarketingCampaignItem, action: string) => void
}

function renderChannelIcon(channel: MarketingCampaignItem["channel"]) {
  switch (channel) {
    case "Facebook":
      return (
        <div className="w-6 h-6 rounded-full bg-[#1877f2] flex items-center justify-center text-white font-bold text-[11px] shadow-2xs">
          f
        </div>
      )
    case "Google":
      return (
        <div className="w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center font-bold text-[11px] shadow-2xs">
          <span className="text-[#4285f4]">G</span>
        </div>
      )
    case "Instagram":
      return (
        <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-[#f58529] via-[#dd2a7b] to-[#8134af] flex items-center justify-center text-white shadow-2xs">
          <svg
            className="w-3.5 h-3.5 fill-current"
            viewBox="0 0 24 24"
            aria-label="Instagram"
          >
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="currentColor" strokeWidth="2" />
            <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
            <circle cx="17.5" cy="6.5" r="1.5" />
          </svg>
        </div>
      )
    case "Zalo":
      return (
        <div className="w-6 h-6 rounded-md bg-[#0068ff] flex items-center justify-center text-white text-[8px] font-extrabold shadow-2xs">
          Zalo
        </div>
      )
    case "Email Marketing":
      return (
        <div className="w-6 h-6 rounded-md bg-[#10b981] flex items-center justify-center text-white shadow-2xs">
          <Mail className="w-3.5 h-3.5" />
        </div>
      )
    default:
      return (
        <div className="w-6 h-6 rounded-md bg-slate-500 flex items-center justify-center text-white text-[10px] font-bold">
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
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
      Đang chạy
    </span>
  )
}

export function MarketingCampaignsTable({
  campaigns = MOCK_TOP_MARKETING_CAMPAIGNS,
  onViewAll,
  onActionClick,
}: MarketingCampaignsTableProps) {
  return (
    <div className="bg-white border border-slate-200/85 rounded-2xl p-4 sm:p-5 shadow-2xs">
      {/* Table Header */}
      <div className="flex items-center justify-between gap-2 mb-3.5">
        <h3 className="text-sm sm:text-[15px] font-bold text-slate-900 tracking-tight">
          Top chiến dịch marketing
        </h3>
        <button
          type="button"
          onClick={
            onViewAll ??
            (() => toast.info("Xem tất cả 24 chiến dịch marketing đang hoạt động"))
          }
          className="text-[11px] xl:text-[11.5px] 2xl:text-xs sm:text-[12px] font-semibold text-[#007a48] hover:text-[#00683d] flex items-center gap-1 transition-colors hover:underline cursor-pointer"
        >
          <span>Xem tất cả</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs ">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 font-medium">
              <th scope="col" className="py-2.5 pr-2 font-medium w-7 text-center">
                #
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
            {campaigns.map((item, index) => (
              <tr
                key={item.id}
                className="hover:bg-slate-50/70 transition-colors group"
              >
                {/* # */}
                <td className="py-3 pr-2 text-center font-bold text-slate-700">
                  {item.rank ?? index + 1}
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
                <td className="py-2 px-1.5 font-medium text-slate-800 text-right sm:text-left whitespace-nowrap">
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
                <td className="py-3 pl-2 text-center">
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
