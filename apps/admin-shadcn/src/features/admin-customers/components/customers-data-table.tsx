"use client"

import { useState } from "react"
import Image from "next/image"
import {
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Eye,
  Mail,
  Edit,
  UserX,
  Crown,
} from "lucide-react"
import type { CustomerItem } from "@/features/admin-customers/stayea-admin-customers-mock-data"
import { CUSTOMERS_MOCK_LIST } from "@/features/admin-customers/stayea-admin-customers-mock-data"

interface CustomersDataTableProps {
  onCustomerAction?: (action: string, customer: CustomerItem) => void
}

function renderCustomerStatusBadge(status: CustomerItem["status"], label: string) {
  switch (status) {
    case "active": {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
          {label}
        </span>
      )
    }
    case "paused": {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200/60">
          {label}
        </span>
      )
    }
    case "pending": {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200/60">
          {label}
        </span>
      )
    }
  }
}

export function CustomersDataTable({
  onCustomerAction,
}: CustomersDataTableProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  const isAllSelected =
    CUSTOMERS_MOCK_LIST.length > 0 &&
    selectedIds.length === CUSTOMERS_MOCK_LIST.length

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([])
    } else {
      setSelectedIds(CUSTOMERS_MOCK_LIST.map((item) => item.id))
    }
  }

  const handleToggleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col">
      {/* Scrollable table container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-slate-200/80 bg-slate-50/70 text-slate-500 font-semibold text-xs select-none">
              <th className="py-3.5 pl-4 pr-2 w-10">
                <input
                  type="checkbox"
                  aria-label="Chọn tất cả khách hàng"
                  checked={isAllSelected}
                  onChange={handleToggleSelectAll}
                  className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer accent-[#1b7a4e]"
                />
              </th>
              <th className="py-3.5 px-3">Khách hàng</th>
              <th className="py-3.5 px-3 text-center">Quốc tịch</th>
              <th className="py-3.5 px-3">Số điện thoại</th>
              <th className="py-3.5 px-3">Email</th>
              <th className="py-3.5 px-3 text-center">Số lần đặt</th>
              <th className="py-3.5 px-3 font-semibold text-slate-700">Tổng chi tiêu</th>
              <th className="py-3.5 px-3">Trạng thái</th>
              <th className="py-3.5 pr-4 pl-3 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {CUSTOMERS_MOCK_LIST.map((cust) => {
              const isSelected = selectedIds.includes(cust.id)
              const isMenuOpen = activeMenuId === cust.id

              return (
                <tr
                  key={cust.id}
                  className={`hover:bg-slate-50/70 transition-colors ${
                    isSelected ? "bg-emerald-50/30" : ""
                  }`}
                >
                  {/* Checkbox */}
                  <td className="py-3 pl-4 pr-2">
                    <input
                      type="checkbox"
                      aria-label={`Chọn khách hàng ${cust.name}`}
                      checked={isSelected}
                      onChange={() => handleToggleSelectRow(cust.id)}
                      className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer accent-[#1b7a4e]"
                    />
                  </td>

                  {/* Customer Avatar & Name & Badge */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-8 h-8 rounded-full overflow-hidden bg-slate-100 ring-1 ring-slate-200/80 shrink-0">
                        <Image
                          src={cust.avatar}
                          alt={cust.name}
                          fill
                          className="object-cover"
                          sizes="32px"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-900 leading-tight">
                          {cust.name}
                        </span>
                        {cust.badgeLabel && (
                          <span className="inline-flex items-center gap-1 mt-0.5 text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200/60 px-1.5 py-0.5 rounded w-fit">
                            <Crown className="w-2.5 h-2.5" />
                            <span>{cust.badgeLabel}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Nationality Flag */}
                  <td className="py-3 px-3 text-center text-base">
                    <span title={cust.nationality}>{cust.flag}</span>
                  </td>

                  {/* Phone Number */}
                  <td className="py-3 px-3 font-medium text-slate-700 whitespace-nowrap">
                    {cust.phoneNumber}
                  </td>

                  {/* Email */}
                  <td className="py-3 px-3 text-slate-600 whitespace-nowrap">
                    {cust.email}
                  </td>

                  {/* Bookings Count */}
                  <td className="py-3 px-3 text-center text-slate-700 font-semibold">
                    {cust.bookingsCount}
                  </td>

                  {/* Total Spent */}
                  <td className="py-3 px-3 font-bold text-slate-900 whitespace-nowrap">
                    {cust.totalSpent}
                  </td>

                  {/* Status */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    {renderCustomerStatusBadge(cust.status, cust.statusLabel)}
                  </td>

                  {/* Actions Dropdown */}
                  <td className="py-3 pr-4 pl-3 text-center relative">
                    <button
                      type="button"
                      aria-label="Thao tác"
                      onClick={() =>
                        setActiveMenuId(isMenuOpen ? null : cust.id)
                      }
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>

                    {isMenuOpen && (
                      <div className="absolute right-4 top-10 w-44 bg-white rounded-xl shadow-lg border border-slate-200/80 py-1.5 z-20 text-left text-xs animate-in fade-in zoom-in-95 duration-150">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveMenuId(null)
                            onCustomerAction?.("view", cust)
                          }}
                          className="w-full px-3 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                        >
                          <Eye className="w-3.5 h-3.5 text-slate-400" />
                          <span>Xem hồ sơ</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveMenuId(null)
                            onCustomerAction?.("message", cust)
                          }}
                          className="w-full px-3 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                        >
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          <span>Gửi email / SMS</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveMenuId(null)
                            onCustomerAction?.("edit", cust)
                          }}
                          className="w-full px-3 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                        >
                          <Edit className="w-3.5 h-3.5 text-slate-400" />
                          <span>Chỉnh sửa thông tin</span>
                        </button>
                        <div className="my-1 border-t border-slate-100" />
                        <button
                          type="button"
                          onClick={() => {
                            setActiveMenuId(null)
                            onCustomerAction?.("suspend", cust)
                          }}
                          className="w-full px-3 py-2 text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                        >
                          <UserX className="w-3.5 h-3.5 text-rose-500" />
                          <span>Tạm khóa tài khoản</span>
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-3 sm:p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <span className="font-medium text-slate-600">
          Hiển thị 1 - 10 của 2.716 khách hàng
        </span>

        <div className="flex items-center gap-2">
          {/* Pagination numbers */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => setCurrentPage(1)}
              className="w-7 h-7 rounded-lg bg-[#1b7a4e] text-white font-semibold flex items-center justify-center shadow-xs"
            >
              1
            </button>

            {[2, 3, 4, 5].map((pageNum) => (
              <button
                key={pageNum}
                type="button"
                onClick={() => setCurrentPage(pageNum)}
                className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-50 font-medium"
              >
                {pageNum}
              </button>
            ))}

            <span className="px-1 text-slate-400">...</span>

            <button
              type="button"
              onClick={() => setCurrentPage(272)}
              className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-50 font-medium"
            >
              272
            </button>

            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(272, p + 1))}
              className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Page size dropdown */}
          <div className="relative ml-2">
            <select
              defaultValue="10"
              className="appearance-none pl-2.5 pr-6 py-1 rounded-lg border border-slate-200 bg-white text-slate-700 font-medium cursor-pointer focus:outline-none text-xs"
            >
              <option value="10">10 / trang</option>
              <option value="20">20 / trang</option>
              <option value="50">50 / trang</option>
            </select>
            <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  )
}
