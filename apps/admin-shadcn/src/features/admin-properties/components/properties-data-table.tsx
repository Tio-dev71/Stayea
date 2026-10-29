"use client"

import { useState } from "react"
import Image from "next/image"
import {
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Check,
  Eye,
  Edit,
  Trash2,
  ShieldCheck,
  Award,
} from "lucide-react"
import type { PropertyItem } from "@/features/admin-properties/stayea-admin-properties-mock-data"
import { PROPERTIES_MOCK_LIST } from "@/features/admin-properties/stayea-admin-properties-mock-data"

interface PropertiesDataTableProps {
  properties?: readonly PropertyItem[]
  onPropertyAction?: (action: string, property: PropertyItem) => void
}

function renderStatusBadge(status: PropertyItem["status"], label: string) {
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
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200/60">
          {label}
        </span>
      )
    }
    case "pending": {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200/60">
          {label}
        </span>
      )
    }
  }
}

export function PropertiesDataTable({
  properties = PROPERTIES_MOCK_LIST,
  onPropertyAction,
}: PropertiesDataTableProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10

  const totalCount = properties.length
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))

  const isAllSelected =
    totalCount > 0 && selectedIds.length === totalCount

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([])
    } else {
      setSelectedIds(properties.map((item) => item.id))
    }
  }

  const handleToggleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const startIndex = (currentPage - 1) * pageSize
  const endIndex = Math.min(startIndex + pageSize, totalCount)
  const displayedProperties = properties.slice(startIndex, endIndex)

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
                  aria-label="Chọn tất cả bất động sản"
                  checked={isAllSelected}
                  onChange={handleToggleSelectAll}
                  className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer accent-[#1b7a4e]"
                />
              </th>
              <th className="py-3.5 px-3">Hình ảnh</th>
              <th className="py-3.5 px-3">Tên bất động sản</th>
              <th className="py-3.5 px-3">Loại hình</th>
              <th className="py-3.5 px-3">Địa điểm</th>
              <th className="py-3.5 px-3 text-center">Phòng</th>
              <th className="py-3.5 px-3 font-semibold text-slate-700">Giá từ</th>
              <th className="py-3.5 px-3">Trạng thái</th>
              <th className="py-3.5 px-3 text-right">Lượt xem</th>
              <th className="py-3.5 px-3 text-right">Đặt phòng</th>
              <th className="py-3.5 pr-4 pl-3 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {displayedProperties.length === 0 ? (
              <tr>
                <td colSpan={11} className="py-8 text-center text-xs text-slate-500">
                  Không tìm thấy bất động sản nào phù hợp.
                </td>
              </tr>
            ) : (
              displayedProperties.map((item) => {
                const isSelected = selectedIds.includes(item.id)
                const isMenuOpen = activeMenuId === item.id

              return (
                <tr
                  key={item.id}
                  className={`hover:bg-slate-50/70 transition-colors ${
                    isSelected ? "bg-emerald-50/30" : ""
                  }`}
                >
                  {/* Checkbox */}
                  <td className="py-3 pl-4 pr-2">
                    <input
                      type="checkbox"
                      aria-label={`Chọn bất động sản ${item.name}`}
                      checked={isSelected}
                      onChange={() => handleToggleSelectRow(item.id)}
                      className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer accent-[#1b7a4e]"
                    />
                  </td>

                  {/* Thumbnail Image */}
                  <td className="py-3 px-3">
                    <div className="relative w-12 h-10 sm:w-14 sm:h-11 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200/60 shadow-2xs">
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="60px"
                      />
                    </div>
                  </td>

                  {/* Property Name & Badges */}
                  <td className="py-3 px-3">
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-900 leading-tight">
                        {item.name}
                      </span>
                      {item.badge === "verified" && (
                        <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-semibold text-blue-600 bg-blue-50 border border-blue-200/60 px-1.5 py-0.5 rounded w-fit">
                          <ShieldCheck className="w-2.5 h-2.5" />
                          <span>Stayea Verified</span>
                        </span>
                      )}
                      {item.badge === "select" && (
                        <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200/60 px-1.5 py-0.5 rounded w-fit">
                          <Award className="w-2.5 h-2.5" />
                          <span>Stayea Select</span>
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Property Type */}
                  <td className="py-3 px-3 text-slate-600">
                    {item.propertyType}
                  </td>

                  {/* Location */}
                  <td className="py-3 px-3 text-slate-600 max-w-[150px] truncate">
                    {item.location}
                  </td>

                  {/* Rooms Count */}
                  <td className="py-3 px-3 text-center text-slate-700 font-medium">
                    {item.roomsCount}
                  </td>

                  {/* Price From */}
                  <td className="py-3 px-3 font-semibold text-slate-900 whitespace-nowrap">
                    {item.priceFrom}
                  </td>

                  {/* Status */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    {renderStatusBadge(item.status, item.statusLabel)}
                  </td>

                  {/* Views */}
                  <td className="py-3 px-3 text-right text-slate-600 font-medium whitespace-nowrap">
                    {item.views}
                  </td>

                  {/* Bookings Count */}
                  <td className="py-3 px-3 text-right text-slate-900 font-semibold whitespace-nowrap">
                    {item.bookingsCount}
                  </td>

                  {/* Actions Dropdown */}
                  <td className="py-3 pr-4 pl-3 text-center relative">
                    <button
                      type="button"
                      aria-label="Thao tác"
                      onClick={() =>
                        setActiveMenuId(isMenuOpen ? null : item.id)
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
                            onPropertyAction?.("view", item)
                          }}
                          className="w-full px-3 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                        >
                          <Eye className="w-3.5 h-3.5 text-slate-400" />
                          <span>Xem chi tiết</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveMenuId(null)
                            onPropertyAction?.("edit", item)
                          }}
                          className="w-full px-3 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                        >
                          <Edit className="w-3.5 h-3.5 text-slate-400" />
                          <span>Chỉnh sửa thông tin</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveMenuId(null)
                            onPropertyAction?.("toggle-status", item)
                          }}
                          className="w-full px-3 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                        >
                          <Check className="w-3.5 h-3.5 text-slate-400" />
                          <span>
                            {item.status === "active" ? "Tạm dừng" : "Kích hoạt"}
                          </span>
                        </button>
                        <div className="my-1 border-t border-slate-100" />
                        <button
                          type="button"
                          onClick={() => {
                            setActiveMenuId(null)
                            onPropertyAction?.("delete", item)
                          }}
                          className="w-full px-3 py-2 text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                          <span>Xóa bất động sản</span>
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              )
            }))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-3 sm:p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <span className="font-medium text-slate-600">
          Hiển thị {totalCount === 0 ? 0 : startIndex + 1} - {endIndex} của {totalCount} bất động sản
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

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                type="button"
                onClick={() => setCurrentPage(pageNum)}
                className={`w-7 h-7 rounded-lg font-semibold flex items-center justify-center transition-all ${
                  currentPage === pageNum
                    ? "bg-[#1b7a4e] text-white shadow-xs"
                    : "border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium"
                }`}
              >
                {pageNum}
              </button>
            ))}

            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
