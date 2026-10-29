"use client"

import Image from "next/image"
import { MoreHorizontal, ArrowRight } from "lucide-react"
import type { AdminRecentBooking } from "@/features/admin-dashboard/stayea-admin-mock-data"
import { ADMIN_RECENT_BOOKINGS_VI } from "@/features/admin-dashboard/stayea-admin-mock-data"

interface StayeaAdminRecentBookingsTableProps {
  bookings?: readonly AdminRecentBooking[]
  onViewAll?: () => void
}

function getBookingStatusBadge(status: AdminRecentBooking["status"]) {
  switch (status) {
    case "Đã xác nhận": {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
          Đã xác nhận
        </span>
      )
    }
    case "Chờ xác nhận": {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/60">
          Chờ xác nhận
        </span>
      )
    }
    case "Đã hoàn thành": {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200/60">
          Đã hoàn thành
        </span>
      )
    }
    case "Đã hủy": {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/60">
          Đã hủy
        </span>
      )
    }
  }
}

export function StayeaAdminRecentBookingsTable({
  bookings = ADMIN_RECENT_BOOKINGS_VI,
  onViewAll,
}: StayeaAdminRecentBookingsTableProps) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
      {/* Table Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
          Đặt phòng gần đây
        </h2>
        <button
          type="button"
          onClick={onViewAll}
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#1b7a4e] hover:text-emerald-800 hover:underline transition-colors"
        >
          <span>Xem tất cả</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto -mx-5 px-5">
        <table className="w-full text-left border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              <th className="pb-3 pr-4 font-semibold">Khách hàng</th>
              <th className="pb-3 px-4 font-semibold">Bất động sản</th>
              <th className="pb-3 px-4 font-semibold">Nhận phòng</th>
              <th className="pb-3 px-4 font-semibold">Trả phòng</th>
              <th className="pb-3 px-4 font-semibold">Trạng thái</th>
              <th className="pb-3 px-4 font-semibold">Tổng tiền</th>
              <th className="pb-3 pl-4 text-right font-semibold">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100/80">
            {bookings.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-xs text-slate-500">
                  Chưa có đơn đặt phòng nào gần đây trong hệ thống.
                </td>
              </tr>
            ) : (
              bookings.map((b) => (
                <tr
                  key={b.id}
                  className="hover:bg-slate-50/70 transition-colors group"
                >
                  {/* Khách hàng */}
                  <td className="py-3.5 pr-4 whitespace-nowrap">
                    <div className="flex items-center gap-2.5">
                      <div className="relative w-8 h-8 rounded-full overflow-hidden ring-1 ring-slate-200 shrink-0">
                        <Image
                          src={b.guestAvatar}
                          alt={b.guestName}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-slate-800 group-hover:text-emerald-800 transition-colors">
                            {b.guestName}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400 font-normal">
                          {b.guestFlag}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Bất động sản */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="font-semibold text-slate-800">{b.propertyTitle}</div>
                    <div className="text-[11px] text-slate-400">{b.propertySubtitle}</div>
                  </td>

                  {/* Nhận phòng */}
                  <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap text-xs">
                    {b.checkIn}
                  </td>

                  {/* Trả phòng */}
                  <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap text-xs">
                    {b.checkOut}
                  </td>

                  {/* Trạng thái */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {getBookingStatusBadge(b.status)}
                  </td>

                  {/* Tổng tiền */}
                  <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                    {b.totalAmount}
                  </td>

                  {/* Thao tác */}
                  <td className="py-3.5 pl-4 text-right whitespace-nowrap">
                    <button
                      type="button"
                      aria-label="Thao tác"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
