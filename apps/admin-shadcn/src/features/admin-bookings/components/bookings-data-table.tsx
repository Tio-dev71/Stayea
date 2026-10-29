"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import {
  MoreHorizontal,
  ArrowUpDown,
  Home,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Globe,
  Eye,
  CheckCircle2,
  Clock,
  CheckCheck,
  XCircle,
} from "lucide-react"
import type { BookingRecord } from "@/features/admin-bookings/stayea-admin-bookings-mock-data"
import { BOOKINGS_DATA } from "@/features/admin-bookings/stayea-admin-bookings-mock-data"

interface BookingsDataTableProps {
  bookings?: readonly BookingRecord[]
  onSelectBooking?: (booking: BookingRecord) => void
  onSortChange?: () => void
  onStatusUpdate?: (bookingId: string, newStatus: string) => void
  onViewDetail?: (booking: BookingRecord) => void
}

function getBookingStatusBadge(status: BookingRecord["bookingStatus"]) {
  switch (status) {
    case "Đang lưu trú": {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200/60">
          Đang lưu trú
        </span>
      )
    }
    case "Đã xác nhận": {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
          Đã xác nhận
        </span>
      )
    }
    case "Đã hoàn tất": {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200/60">
          Đã hoàn tất
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
    case "Đã hủy": {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/60">
          Đã hủy
        </span>
      )
    }
  }
}

function getPaymentStatusBadge(status: BookingRecord["paymentStatus"]) {
  switch (status) {
    case "Đã thanh toán": {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
          Đã thanh toán
        </span>
      )
    }
    case "Cọc 50%": {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/60">
          Cọc 50%
        </span>
      )
    }
    case "Hoàn tiền": {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200/60">
          Hoàn tiền
        </span>
      )
    }
    case "Chờ thanh toán": {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/60">
          Chờ thanh toán
        </span>
      )
    }
  }
}

function renderChannelBadge(channel: BookingRecord["channel"], channelType: BookingRecord["channelType"]) {
  switch (channelType) {
    case "website": {
      return (
        <div className="flex items-center gap-1.5 text-slate-700 font-medium">
          <div className="w-5 h-5 rounded-md bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <Home className="w-3 h-3" />
          </div>
          <span>{channel}</span>
        </div>
      )
    }
    case "booking": {
      return (
        <div className="flex items-center gap-1.5 text-slate-700 font-medium">
          <div className="w-5 h-5 rounded-md bg-blue-900 text-white flex items-center justify-center font-bold text-[10px] shrink-0">
            B.
          </div>
          <span>{channel}</span>
        </div>
      )
    }
    case "airbnb": {
      return (
        <div className="flex items-center gap-1.5 text-slate-700 font-medium">
          <div className="w-5 h-5 rounded-md bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <Globe className="w-3 h-3 text-rose-500" />
          </div>
          <span>{channel}</span>
        </div>
      )
    }
    case "agoda": {
      return (
        <div className="flex items-center gap-1.5 text-slate-700 font-medium">
          <div className="w-5 h-5 rounded-md bg-orange-50 text-orange-600 flex items-center justify-center font-bold text-[10px] shrink-0">
            A
          </div>
          <span>{channel}</span>
        </div>
      )
    }
    case "traveloka": {
      return (
        <div className="flex items-center gap-1.5 text-slate-700 font-medium">
          <div className="w-5 h-5 rounded-md bg-sky-50 text-sky-600 flex items-center justify-center font-bold text-[10px] shrink-0">
            T
          </div>
          <span>{channel}</span>
        </div>
      )
    }
    case "expedia": {
      return (
        <div className="flex items-center gap-1.5 text-slate-700 font-medium">
          <div className="w-5 h-5 rounded-md bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-[10px] shrink-0">
            E
          </div>
          <span>{channel}</span>
        </div>
      )
    }
  }
}

export function BookingsDataTable({
  bookings = BOOKINGS_DATA,
  onSortChange,
  onStatusUpdate,
  onViewDetail,
}: BookingsDataTableProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const menuContainerRef = useRef<HTMLDivElement>(null)

  const pageSize = 10
  const totalCount = bookings.length
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))

  useEffect(() => {
    // Reset to page 1 if list length shrinks
    if (currentPage > totalPages) {
      setCurrentPage(1)
    }
  }, [totalPages, currentPage])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuContainerRef.current && !menuContainerRef.current.contains(e.target as Node)) {
        setOpenMenuId(null)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const startIndex = (currentPage - 1) * pageSize
  const endIndex = Math.min(startIndex + pageSize, totalCount)
  const displayedBookings = bookings.slice(startIndex, endIndex)

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(bookings.map((b) => b.id))
    } else {
      setSelectedIds([])
    }
  }

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  return (
    <div
      className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-4"
      ref={menuContainerRef}
    >
      {/* 1. Header with Title & Sort */}
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
          Danh sách đặt phòng ({totalCount})
        </h2>

        <button
          type="button"
          onClick={onSortChange}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 shadow-2xs transition-colors"
        >
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
          <span>Sắp xếp: Mới nhất</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </button>
      </div>

      {/* 2. Responsive Table */}
      <div className="overflow-x-auto -mx-5 px-5">
        <table className="w-full text-left border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              <th className="pb-3 pr-2 w-8">
                <input
                  type="checkbox"
                  aria-label="Chọn tất cả"
                  checked={selectedIds.length === bookings.length && bookings.length > 0}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
              </th>
              <th className="pb-3 px-3 font-semibold">Mã đặt chỗ</th>
              <th className="pb-3 px-3 font-semibold">Khách hàng</th>
              <th className="pb-3 px-3 font-semibold">Bất động sản</th>
              <th className="pb-3 px-3 font-semibold">Nhận phòng</th>
              <th className="pb-3 px-3 font-semibold">Trả phòng</th>
              <th className="pb-3 px-3 font-semibold text-center">Số khách</th>
              <th className="pb-3 px-3 font-semibold">Trạng thái</th>
              <th className="pb-3 px-3 font-semibold">Thanh toán</th>
              <th className="pb-3 px-3 font-semibold">Tổng tiền</th>
              <th className="pb-3 px-3 font-semibold">Kênh</th>
              <th className="pb-3 pl-3 text-right font-semibold">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100/80">
            {displayedBookings.length === 0 ? (
              <tr>
                <td colSpan={12} className="py-8 text-center text-xs text-slate-500">
                  Không tìm thấy đơn đặt phòng nào phù hợp với bộ lọc.
                </td>
              </tr>
            ) : (
              displayedBookings.map((b) => {
                const isSelected = selectedIds.includes(b.id)
                const isMenuOpen = openMenuId === b.id

                return (
                  <tr
                    key={b.id}
                    className={`hover:bg-slate-50/70 transition-colors group ${
                      isSelected ? "bg-emerald-50/30" : ""
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="py-3.5 pr-2 whitespace-nowrap">
                      <input
                        type="checkbox"
                        aria-label={`Chọn đặt phòng ${b.code}`}
                        checked={isSelected}
                        onChange={() => handleToggleSelect(b.id)}
                        className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                      />
                    </td>

                    {/* Mã đặt chỗ */}
                    <td className="py-3.5 px-3 font-semibold text-slate-700 whitespace-nowrap text-xs">
                      {b.code}
                    </td>

                    {/* Khách hàng */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="relative w-7 h-7 rounded-full overflow-hidden ring-1 ring-slate-200 shrink-0">
                          <Image
                            src={b.guestAvatar || "/about/team-1.jpg"}
                            alt={b.guestName}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span className="font-semibold text-slate-800 group-hover:text-emerald-800 transition-colors">
                          {b.guestName}
                        </span>
                        <span className="text-xs">{b.guestFlag || "🇻🇳"}</span>
                      </div>
                    </td>

                    {/* Bất động sản */}
                    <td className="py-3.5 px-3 text-slate-600 font-medium whitespace-nowrap text-xs">
                      {b.propertyName}
                    </td>

                    {/* Nhận phòng */}
                    <td className="py-3.5 px-3 text-slate-500 whitespace-nowrap text-xs">
                      {b.checkIn}
                    </td>

                    {/* Trả phòng */}
                    <td className="py-3.5 px-3 text-slate-500 whitespace-nowrap text-xs">
                      {b.checkOut}
                    </td>

                    {/* Số khách */}
                    <td className="py-3.5 px-3 text-slate-700 text-center font-medium whitespace-nowrap text-xs">
                      {b.guestsCount}
                    </td>

                    {/* Trạng thái */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      {getBookingStatusBadge(b.bookingStatus)}
                    </td>

                    {/* Thanh toán */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      {getPaymentStatusBadge(b.paymentStatus)}
                    </td>

                    {/* Tổng tiền */}
                    <td className="py-3.5 px-3 font-bold text-slate-900 whitespace-nowrap text-xs">
                      {b.totalAmount}
                    </td>

                    {/* Kênh */}
                    <td className="py-3.5 px-3 whitespace-nowrap text-xs">
                      {renderChannelBadge(b.channel, b.channelType)}
                    </td>

                    {/* Thao tác */}
                    <td className="py-3.5 pl-3 text-right whitespace-nowrap relative">
                      <button
                        type="button"
                        aria-label="Thao tác"
                        onClick={() => setOpenMenuId(isMenuOpen ? null : b.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>

                      {isMenuOpen && (
                        <div className="absolute right-2 top-10 w-52 bg-white rounded-xl shadow-xl border border-slate-200/80 py-1.5 z-50 text-left text-xs animate-in fade-in duration-100">
                          <button
                            type="button"
                            onClick={() => {
                              setOpenMenuId(null)
                              onViewDetail?.(b)
                            }}
                            className="w-full px-3 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5 text-slate-500" />
                            <span>Xem chi tiết đơn</span>
                          </button>

                          <div className="my-1 border-t border-slate-100" />

                          <button
                            type="button"
                            onClick={() => {
                              setOpenMenuId(null)
                              onStatusUpdate?.(b.id, "confirmed")
                            }}
                            className="w-full px-3 py-2 text-emerald-700 hover:bg-emerald-50 flex items-center gap-2 transition-colors font-medium"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Xác nhận đặt phòng</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setOpenMenuId(null)
                              onStatusUpdate?.(b.id, "active")
                            }}
                            className="w-full px-3 py-2 text-sky-700 hover:bg-sky-50 flex items-center gap-2 transition-colors font-medium"
                          >
                            <Clock className="w-3.5 h-3.5 text-sky-600" />
                            <span>Khách nhận phòng</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setOpenMenuId(null)
                              onStatusUpdate?.(b.id, "completed")
                            }}
                            className="w-full px-3 py-2 text-teal-700 hover:bg-teal-50 flex items-center gap-2 transition-colors font-medium"
                          >
                            <CheckCheck className="w-3.5 h-3.5 text-teal-600" />
                            <span>Hoàn tất trả phòng</span>
                          </button>

                          <div className="my-1 border-t border-slate-100" />

                          <button
                            type="button"
                            onClick={() => {
                              setOpenMenuId(null)
                              onStatusUpdate?.(b.id, "cancelled")
                            }}
                            className="w-full px-3 py-2 text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors font-medium"
                          >
                            <XCircle className="w-3.5 h-3.5 text-rose-500" />
                            <span>Hủy đơn đặt</span>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* 3. Pagination Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100 text-xs text-slate-500">
        <div>
          Hiển thị{" "}
          <span className="font-bold text-slate-800">
            {totalCount === 0 ? 0 : startIndex + 1} - {endIndex}
          </span>{" "}
          của <span className="font-bold text-slate-800">{totalCount}</span> đặt phòng
        </div>

        <div className="flex items-center gap-1.5">
          {/* Previous Page */}
          <button
            type="button"
            aria-label="Trang trước"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Page numbers */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              type="button"
              onClick={() => setCurrentPage(pageNum)}
              className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all ${
                currentPage === pageNum
                  ? "bg-[#1b7a4e] text-white shadow-xs"
                  : "border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {pageNum}
            </button>
          ))}

          {/* Next Page */}
          <button
            type="button"
            aria-label="Trang kế tiếp"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
