"use client"

import { useState } from "react"
import Image from "next/image"
import {
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ArrowRight,
  Eye,
  FileCheck,
  RotateCcw,
} from "lucide-react"
import type { RevenueOrderItem } from "@/features/admin-revenue/stayea-admin-revenue-mock-data"
import { MOCK_REVENUE_ORDERS } from "@/features/admin-revenue/stayea-admin-revenue-mock-data"

interface RevenueOrdersTableProps {
  orders?: RevenueOrderItem[]
  onViewAll?: () => void
  onActionClick?: (order: RevenueOrderItem, action: string) => void
}

type TabType = "recent-orders" | "partner-payouts" | "refunds" | "reconciliation"

const TABS: { id: TabType; label: string }[] = [
  { id: "recent-orders", label: "Đơn hàng gần đây" },
  { id: "partner-payouts", label: "Thanh toán đối tác" },
  { id: "refunds", label: "Hoàn tiền/ Hủy đơn" },
  { id: "reconciliation", label: "Đối soát doanh thu" },
]

export function RevenueOrdersTable({
  orders = MOCK_REVENUE_ORDERS,
  onViewAll,
  onActionClick,
}: RevenueOrdersTableProps) {
  const [activeTab, setActiveTab] = useState<TabType>("recent-orders")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [activeActionMenu, setActiveActionMenu] = useState<string | null>(null)

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
      {/* 1. Header Tabs Bar */}
      <div className="p-4 sm:p-5 pb-3 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#e8f7ee] text-[#007a48] shadow-2xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                {tab.label}
              </button>
            )
          })}
        </div>

        <button
          type="button"
          onClick={onViewAll}
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#007a48] hover:text-emerald-800 hover:underline transition-colors cursor-pointer self-start sm:self-auto"
        >
          <span>Xem tất cả</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 2. Responsive Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-500 font-medium">
              <th className="py-3 px-4 font-semibold">Mã đơn hàng</th>
              <th className="py-3 px-4 font-semibold">Trải nghiệm / Tour</th>
              <th className="py-3 px-4 font-semibold">Khách hàng</th>
              <th className="py-3 px-4 font-semibold">Ngày đặt</th>
              <th className="py-3 px-4 font-semibold">Tổng tiền</th>
              <th className="py-3 px-4 font-semibold">Trạng thái thanh toán</th>
              <th className="py-3 px-4 font-semibold">Hoa hồng</th>
              <th className="py-3 px-4 font-semibold text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {orders.map((order) => {
              const isPaid = order.status === "paid"
              return (
                <tr
                  key={order.id}
                  className="hover:bg-slate-50/70 transition-colors"
                >
                  {/* Order Code */}
                  <td className="py-3.5 px-4 font-medium text-slate-600 whitespace-nowrap">
                    {order.orderCode}
                  </td>

                  {/* Experience / Tour info with thumbnail */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3 min-w-[200px]">
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-slate-200">
                        <Image
                          src={order.imageUrl}
                          alt={order.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-900 line-clamp-1">
                          {order.title}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {order.category}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Customer Name */}
                  <td className="py-3.5 px-4 text-slate-800 font-medium whitespace-nowrap">
                    {order.customerName}
                  </td>

                  {/* Booking Date */}
                  <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                    {order.bookingDate}
                  </td>

                  {/* Total Amount */}
                  <td className="py-3.5 px-4 font-semibold text-slate-900 whitespace-nowrap">
                    {order.totalFormatted}
                  </td>

                  {/* Payment Status Badge */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold ${
                        isPaid
                          ? "bg-[#dcfce7] text-[#15803d]"
                          : "bg-[#fef3c7] text-[#b45309]"
                      }`}
                    >
                      {order.statusLabel}
                    </span>
                  </td>

                  {/* Commission */}
                  <td className="py-3.5 px-4 font-medium text-slate-700 whitespace-nowrap">
                    {order.commissionFormatted}
                  </td>

                  {/* Actions Button */}
                  <td className="py-3.5 px-4 text-center whitespace-nowrap relative">
                    <button
                      type="button"
                      aria-label="Thao tác"
                      onClick={() =>
                        setActiveActionMenu(
                          activeActionMenu === order.id ? null : order.id
                        )
                      }
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>

                    {/* Popover Action Menu */}
                    {activeActionMenu === order.id && (
                      <div className="absolute right-4 top-10 w-44 bg-white border border-slate-200 rounded-xl shadow-lg p-1.5 z-30 text-left text-xs">
                        <button
                          type="button"
                          onClick={() => {
                            onActionClick?.(order, "view")
                            setActiveActionMenu(null)
                          }}
                          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-700 hover:bg-slate-50"
                        >
                          <Eye className="w-3.5 h-3.5 text-slate-400" />
                          <span>Chi tiết đơn hàng</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            onActionClick?.(order, "invoice")
                            setActiveActionMenu(null)
                          }}
                          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-700 hover:bg-slate-50"
                        >
                          <FileCheck className="w-3.5 h-3.5 text-slate-400" />
                          <span>Xuất phiếu đối soát</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            onActionClick?.(order, "refund")
                            setActiveActionMenu(null)
                          }}
                          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-rose-600 hover:bg-rose-50"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Yêu cầu hoàn tiền</span>
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

      {/* 3. Table Footer with Pagination */}
      <div className="p-4 sm:p-5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs text-slate-500 font-medium">
        {/* Count string */}
        <div>
          <span>Hiển thị 1 - 5 của 1.248 đơn hàng</span>
        </div>

        {/* Pagination & Per Page Dropdown */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Page buttons */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              aria-label="Trang trước"
              className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-40 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {[1, 2, 3, 4, 5].map((page) => {
              const isCurrent = currentPage === page
              return (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`w-7 h-7 rounded-lg text-xs font-semibold flex items-center justify-center transition-colors ${
                    isCurrent
                      ? "bg-[#007a48] text-white"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {page}
                </button>
              )
            })}

            <span className="px-1 text-slate-400">...</span>

            <button
              type="button"
              onClick={() => setCurrentPage(250)}
              className="w-8 h-7 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              250
            </button>

            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(250, p + 1))}
              aria-label="Trang sau"
              className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Per Page Select */}
          <div className="relative">
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="appearance-none bg-white hover:bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 pr-7 text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer shadow-2xs"
            >
              <option value={5}>5 / trang</option>
              <option value={10}>10 / trang</option>
              <option value={20}>20 / trang</option>
              <option value={50}>50 / trang</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  )
}
