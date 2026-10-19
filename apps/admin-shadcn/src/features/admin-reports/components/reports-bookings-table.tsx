"use client"

import { useState } from "react"
import Image from "next/image"
import { MoreHorizontal, ChevronLeft, ChevronRight } from "lucide-react"
import { toast } from "sonner"
import { MOCK_RECENT_BOOKINGS } from "@/features/admin-reports/stayea-admin-reports-bookings-mock-data"
import type { RecentBookingItem } from "@/features/admin-reports/stayea-admin-reports-bookings-mock-data"

function getStatusBadge(status: RecentBookingItem["status"]) {
  switch (status) {
    case "Thành công":
      return "bg-emerald-50 text-emerald-700 border-emerald-200/80"
    case "Đang xử lý":
      return "bg-sky-50 text-sky-700 border-sky-200/80"
    case "Đã hủy":
      return "bg-rose-50 text-rose-700 border-rose-200/80"
    default:
      return "bg-slate-50 text-slate-700 border-slate-200"
  }
}

interface ReportsBookingsTableProps {
  bookings?: RecentBookingItem[]
  onViewBookingDetails?: (booking: RecentBookingItem) => void
}

export function ReportsBookingsTable({
  bookings = MOCK_RECENT_BOOKINGS,
  onViewBookingDetails,
}: ReportsBookingsTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)

  return (
    <div className="bg-white border border-slate-200/85 rounded-2xl p-4 sm:p-5 shadow-2xs">
      {/* Title */}
      <div className="pb-3.5 mb-2 border-b border-slate-100">
        <h3 className="text-sm sm:text-[15px] font-bold text-slate-900 tracking-tight">
          Danh sách đặt phòng gần đây
        </h3>
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
                  Mã đặt phòng
                </th>
                <th scope="col" className="py-2.5 px-3 font-medium">
                  Khách hàng
                </th>
                <th scope="col" className="py-2.5 px-3 font-medium">
                  Sản phẩm
                </th>
                <th scope="col" className="py-2.5 px-3 font-medium">
                  Ngày đặt
                </th>
                <th scope="col" className="py-2.5 px-3 font-medium">
                  Ngày nhận phòng
                </th>
                <th scope="col" className="py-2.5 px-2 font-medium text-center">
                  Số đêm
                </th>
                <th scope="col" className="py-2.5 px-3 font-medium text-right sm:text-left">
                  Tổng tiền
                </th>
                <th scope="col" className="py-2.5 px-3 font-medium text-center">
                  Trạng thái
                </th>
                <th scope="col" className="py-2.5 pl-2 font-medium text-center w-10">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bookings.map((item, index) => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50/70 transition-colors group"
                >
                  {/* # */}
                  <td className="py-3 pr-2 text-center font-bold text-slate-700">
                    {index + 1}
                  </td>

                  {/* Code */}
                  <td className="py-3 px-3 font-semibold text-slate-900 whitespace-nowrap">
                    {item.code}
                  </td>

                  {/* Customer */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="relative w-6 h-6 rounded-full overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                        <Image
                          src={item.customerAvatar}
                          alt={item.customerName}
                          fill
                          className="object-cover"
                          sizes="24px"
                        />
                      </div>
                      <span className="font-medium text-slate-900">
                        {item.customerName}
                      </span>
                    </div>
                  </td>

                  {/* Product */}
                  <td className="py-3 px-3 font-medium text-slate-800 line-clamp-1 max-w-[190px] pt-4">
                    {item.productName}
                  </td>

                  {/* Booking Date */}
                  <td className="py-3 px-3 text-slate-600 whitespace-nowrap">
                    {item.bookingDate}
                  </td>

                  {/* Check-in Date */}
                  <td className="py-3 px-3 text-slate-600 whitespace-nowrap">
                    {item.checkInDate}
                  </td>

                  {/* Nights */}
                  <td className="py-3 px-2 text-center font-medium text-slate-700">
                    {item.nights}
                  </td>

                  {/* Total Amount */}
                  <td className="py-3 px-3 font-bold text-slate-900 text-right sm:text-left whitespace-nowrap">
                    {item.totalAmount}
                  </td>

                  {/* Status Badge */}
                  <td className="py-3 px-3 text-center whitespace-nowrap">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-md text-[11px] font-semibold border ${getStatusBadge(
                        item.status
                      )}`}
                    >
                      {item.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-3 pl-2 text-center">
                    <button
                      type="button"
                      onClick={() =>
                        onViewBookingDetails
                          ? onViewBookingDetails(item)
                          : toast.info(`Xem chi tiết đơn ${item.code}`, {
                              description: `Khách: ${item.customerName} - ${item.productName}`,
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
          Hiển thị 1 - 5 của 1.248 đặt phòng
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
            className="w-8 h-7 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50 font-medium"
          >
            250
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
