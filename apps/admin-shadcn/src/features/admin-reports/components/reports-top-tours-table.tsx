"use client"

import Image from "next/image"
import { ArrowRight, Star } from "lucide-react"
import { MOCK_REPORT_TOP_TOURS } from "@/features/admin-reports/stayea-admin-reports-mock-data"
import type { ReportTopTourItem } from "@/features/admin-reports/stayea-admin-reports-mock-data"

interface ReportsTopToursTableProps {
  tours?: ReportTopTourItem[]
  onViewAll?: () => void
}

const STAR_INDICES = [1, 2, 3, 4, 5]

export function ReportsTopToursTable({
  tours = MOCK_REPORT_TOP_TOURS,
  onViewAll,
}: ReportsTopToursTableProps) {
  return (
    <div className="bg-white border border-slate-200/85 rounded-2xl p-4 sm:p-5 shadow-2xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 mb-2 border-b border-slate-100">
        <h3 className="text-sm sm:text-[15px] font-bold text-slate-900 tracking-tight">
          Top tour & trải nghiệm bán chạy
        </h3>
        <button
          type="button"
          onClick={onViewAll}
          className="text-xs sm:text-[13px] font-semibold text-[#007a48] hover:text-[#00683d] flex items-center gap-1 transition-colors hover:underline cursor-pointer"
        >
          <span>Xem tất cả</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Table container with responsive horizontal scroll */}
      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <div className="inline-block min-w-full align-middle px-4 sm:px-0">
          <table className="min-w-full text-left text-xs sm:text-[13px] text-slate-600">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-medium">
                <th scope="col" className="py-2.5 pr-2 font-medium w-8 text-center">
                  #
                </th>
                <th scope="col" className="py-2.5 px-3 font-medium">
                  Tên tour/trải nghiệm
                </th>
                <th scope="col" className="py-2.5 px-3 font-medium text-right sm:text-left">
                  Lượt đặt
                </th>
                <th scope="col" className="py-2.5 px-3 font-medium text-right sm:text-left">
                  Doanh thu
                </th>
                <th scope="col" className="py-2.5 px-3 font-medium text-right sm:text-left">
                  Tỷ lệ chuyển đổi
                </th>
                <th scope="col" className="py-2.5 pl-3 font-medium text-right sm:text-left">
                  Đánh giá trung bình
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tours.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50/70 transition-colors group"
                >
                  {/* Rank */}
                  <td className="py-3 pr-2 text-center font-bold text-slate-700">
                    {item.rank}
                  </td>

                  {/* Name & Thumbnail */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2.5">
                      <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-lg overflow-hidden bg-slate-100 border border-slate-200/60 shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="36px"
                        />
                      </div>
                      <span className="font-semibold text-slate-900 line-clamp-1 group-hover:text-[#007a48] transition-colors">
                        {item.name}
                      </span>
                    </div>
                  </td>

                  {/* Booking count */}
                  <td className="py-3 px-3 font-medium text-slate-700 text-right sm:text-left whitespace-nowrap">
                    {item.bookingCount.toLocaleString("vi-VN")}
                  </td>

                  {/* Revenue */}
                  <td className="py-3 px-3 font-medium text-slate-800 text-right sm:text-left whitespace-nowrap">
                    {item.revenue}
                  </td>

                  {/* Conversion rate */}
                  <td className="py-3 px-3 font-medium text-slate-700 text-right sm:text-left whitespace-nowrap">
                    {item.conversionRate}
                  </td>

                  {/* Rating */}
                  <td className="py-3 pl-3 text-right sm:text-left whitespace-nowrap">
                    <div className="inline-flex items-center gap-1.5 justify-end sm:justify-start">
                      <div className="flex items-center text-amber-400 gap-0.5">
                        {STAR_INDICES.map((starIndex) => (
                          <Star
                            key={`star-${item.id}-${starIndex}`}
                            className="w-3.5 h-3.5 fill-amber-400 text-amber-400"
                          />
                        ))}
                      </div>
                      <span className="font-bold text-slate-800 text-xs ml-0.5">
                        {item.rating}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
