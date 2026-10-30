"use client"

import { useState } from "react"
import Image from "next/image"
import { MoreHorizontal, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react"
import { toast } from "sonner"
import { MOCK_TOP_VALUED_CUSTOMERS } from "@/features/admin-reports/stayea-admin-reports-customers-mock-data"
import type { TopValuedCustomerItem } from "@/features/admin-reports/stayea-admin-reports-customers-mock-data"

function getSegmentGroupBadge(group: TopValuedCustomerItem["segmentGroup"]) {
  switch (group) {
    case "Gia đình":
      return "bg-emerald-50 text-emerald-700 border-emerald-200/80"
    case "Cặp đôi":
      return "bg-sky-50 text-sky-700 border-sky-200/80"
    case "Khách công tác":
      return "bg-purple-50 text-purple-700 border-purple-200/80"
    case "Nhóm bạn":
      return "bg-amber-50 text-amber-700 border-amber-200/80"
    default:
      return "bg-slate-50 text-slate-700 border-slate-200"
  }
}

interface ReportsCustomersTableProps {
  customers?: TopValuedCustomerItem[]
  onViewAll?: () => void
  onViewCustomerDetail?: (customer: TopValuedCustomerItem) => void
}

export function ReportsCustomersTable({
  customers = MOCK_TOP_VALUED_CUSTOMERS,
  onViewAll,
  onViewCustomerDetail,
}: ReportsCustomersTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)

  return (
    <div className="bg-white border border-slate-200/85 rounded-2xl p-4 sm:p-5 shadow-2xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 mb-2 border-b border-slate-100">
        <h3 className="text-sm sm:text-[15px] font-bold text-slate-900 tracking-tight">
          Top khách hàng giá trị cao
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

      {/* Responsive Table */}
      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <div className="inline-block min-w-full align-middle px-4 sm:px-0">
          <table className="min-w-full text-left text-xs sm:text-[13px] text-slate-600">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-medium">
                <th scope="col" className="py-2.5 pr-2 font-medium w-8 text-center">
                  #
                </th>
                <th scope="col" className="py-2.5 px-3 font-medium">
                  Khách hàng
                </th>
                <th scope="col" className="py-2.5 px-3 font-medium text-center">
                  Số lần đặt
                </th>
                <th scope="col" className="py-2.5 px-3 font-medium text-right sm:text-left">
                  Tổng doanh thu
                </th>
                <th scope="col" className="py-2.5 px-3 font-medium text-center sm:text-left">
                  Lần đặt gần nhất
                </th>
                <th scope="col" className="py-2.5 px-3 font-medium text-center">
                  Nhóm khách hàng
                </th>
                <th scope="col" className="py-2.5 pl-2 font-medium text-center w-10">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {customers.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50/70 transition-colors group"
                >
                  {/* # */}
                  <td className="py-3 pr-2 text-center font-bold text-slate-700">
                    {item.rank}
                  </td>

                  {/* Customer (Avatar + Name) */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <div className="flex items-center gap-2.5">
                      <div className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                        <Image
                          src={item.avatar}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="32px"
                        />
                      </div>
                      <span className="font-semibold text-slate-900 group-hover:text-[#007a48] transition-colors">
                        {item.name}
                      </span>
                    </div>
                  </td>

                  {/* Booking Count */}
                  <td className="py-3 px-3 text-center font-semibold text-slate-800">
                    {item.bookingCount}
                  </td>

                  {/* Total Revenue */}
                  <td className="py-3 px-3 font-bold text-slate-900 text-right sm:text-left whitespace-nowrap">
                    {item.totalRevenue}
                  </td>

                  {/* Last Booking Date */}
                  <td className="py-3 px-3 text-slate-600 text-center sm:text-left whitespace-nowrap">
                    {item.lastBookingDate}
                  </td>

                  {/* Segment Group Badge */}
                  <td className="py-3 px-3 text-center whitespace-nowrap">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-md text-[11px] font-semibold border ${getSegmentGroupBadge(
                        item.segmentGroup
                      )}`}
                    >
                      {item.segmentGroup}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-3 pl-2 text-center">
                    <button
                      type="button"
                      onClick={() =>
                        onViewCustomerDetail
                          ? onViewCustomerDetail(item)
                          : toast.info(`Xem hồ sơ khách hàng: ${item.name}`, {
                              description: `Doanh số tích lũy: ${item.totalRevenue} (${item.bookingCount} lượt đặt)`,
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

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3.5 mt-2 border-t border-slate-100 text-xs text-slate-500">
        {/* Count info */}
        <div>
          Hiển thị {customers.length === 0 ? 0 : 1} - {Math.min(pageSize, customers.length)} của {customers.length} khách hàng
        </div>

        {/* Page numbers */}
        <div className="flex items-center gap-1 self-center">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#007a48] text-white font-bold"
          >
            1
          </button>
          <button
            type="button"
            onClick={() => {
              setCurrentPage(2)
              toast.info("Chuyển sang trang 2")
            }}
            className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50 font-medium"
          >
            2
          </button>
          <button
            type="button"
            onClick={() => {
              setCurrentPage(3)
              toast.info("Chuyển sang trang 3")
            }}
            className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50 font-medium"
          >
            3
          </button>
          <button
            type="button"
            className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50 font-medium"
          >
            4
          </button>
          <button
            type="button"
            className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50 font-medium"
          >
            5
          </button>
          <span className="px-1 text-slate-400">...</span>
          <button
            type="button"
            className="w-11 h-7 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50 font-medium"
          >
            1.684
          </button>

          <button
            type="button"
            onClick={() => setCurrentPage((p) => p + 1)}
            className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Page size dropdown */}
        <div className="flex items-center gap-1.5 self-end sm:self-auto">
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value))
              toast.info(`Hiển thị ${e.target.value} mục trên mỗi trang`)
            }}
            className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 font-medium focus:outline-hidden"
          >
            <option value={5}>5 / trang</option>
            <option value={10}>10 / trang</option>
            <option value={20}>20 / trang</option>
            <option value={50}>50 / trang</option>
          </select>
        </div>
      </div>
    </div>
  )
}
