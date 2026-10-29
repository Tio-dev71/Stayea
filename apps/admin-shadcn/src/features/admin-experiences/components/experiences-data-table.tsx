"use client"

import { useState } from "react"
import Image from "next/image"
import {
  ArrowUpDown,
  MoreHorizontal,
  Star,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from "lucide-react"
import type { ExperienceItem } from "@/features/admin-experiences/stayea-admin-experiences-mock-data"

interface ExperiencesDataTableProps {
  items: ExperienceItem[]
  onItemAction?: (item: ExperienceItem, action: string) => void
}

function formatVND(amount: number) {
  return new Intl.NumberFormat("vi-VN").format(amount) + " đ"
}


function renderTagBadge(tag?: ExperienceItem["tag"]) {
  if (!tag) return null
  const variantStyles = {
    rose: "bg-rose-50 text-rose-700 border-rose-200/60",
    sky: "bg-sky-50 text-sky-700 border-sky-200/60",
    teal: "bg-teal-50 text-teal-700 border-teal-200/60",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
    purple: "bg-purple-50 text-purple-700 border-purple-200/60",
  }
  return (
    <span
      className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full border ${variantStyles[tag.variant]}`}
    >
      {tag.label}
    </span>
  )
}

function renderStatusBadge(status: ExperienceItem["status"]) {
  switch (status) {
    case "active":
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
          Đang hoạt động
        </span>
      )
    case "pending":
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200/60">
          Chờ duyệt
        </span>
      )
    case "paused":
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-rose-50 text-rose-700 border border-rose-200/60">
          Tạm ngưng
        </span>
      )
    default:
      return null
  }
}

export function ExperiencesDataTable({
  items,
  onItemAction,
}: ExperiencesDataTableProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [sortBy, setSortBy] = useState<string>("newest")
  const [pageSize, setPageSize] = useState<number>(10)

  const isAllSelected = items.length > 0 && selectedIds.length === items.length

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([])
    } else {
      setSelectedIds(items.map((i) => i.id))
    }
  }

  const handleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden flex flex-col">
      {/* Table Header Bar */}
      <div className="p-4 sm:px-5 sm:py-4 border-b border-slate-100 flex items-center justify-between gap-3">
        <h3 className="font-bold text-sm sm:text-base text-slate-900 tracking-tight">
          Danh sách trải nghiệm & Tour ({items.length})
        </h3>

        {/* Sort select */}
        <div className="relative">
          <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium cursor-pointer">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <span>Sắp xếp:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none pr-5 font-semibold text-slate-800 bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="newest">Mới nhất</option>
              <option value="popular">Phổ biến nhất</option>
              <option value="price_asc">Giá tăng dần</option>
              <option value="price_desc">Giá giảm dần</option>
              <option value="rating">Đánh giá cao</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-0 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              <th className="py-3 pl-4 pr-2 w-10">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={handleSelectAll}
                  aria-label="Chọn tất cả"
                  className="w-4 h-4 rounded border-slate-300 text-[#1b7a4e] focus:ring-[#1b7a4e] cursor-pointer"
                />
              </th>
              <th className="py-3 px-3 w-16">Hình ảnh</th>
              <th className="py-3 px-3 min-w-[200px]">Tên trải nghiệm / Tour</th>
              <th className="py-3 px-3 min-w-[110px]">Loại hình</th>
              <th className="py-3 px-3 min-w-[90px]">Địa điểm</th>
              <th className="py-3 px-3 min-w-[120px]">Đối tác cung cấp</th>
              <th className="py-3 px-3 min-w-[100px]">Giá từ</th>
              <th className="py-3 px-3 min-w-[110px]">Trạng thái</th>
              <th className="py-3 px-3 min-w-[100px]">Đánh giá</th>
              <th className="py-3 pr-4 pl-2 text-right w-16">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-12 text-center text-sm text-slate-500">
                  Chưa có trải nghiệm hoặc tour nào trong hệ thống.
                </td>
              </tr>
            ) : (
              items.map((item) => {
                const isSelected = selectedIds.includes(item.id)
                return (
                  <tr
                    key={item.id}
                    className={`hover:bg-slate-50/70 transition-colors ${
                      isSelected ? "bg-emerald-50/30" : ""
                    }`}
                  >
                  {/* Checkbox */}
                  <td className="py-3.5 pl-4 pr-2">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleSelectOne(item.id)}
                      aria-label={`Chọn ${item.name}`}
                      className="w-4 h-4 rounded border-slate-300 text-[#1b7a4e] focus:ring-[#1b7a4e] cursor-pointer"
                    />
                  </td>

                  {/* Thumbnail */}
                  <td className="py-3.5 px-3">
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200/60 shadow-2xs">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </td>

                  {/* Tên trải nghiệm / Tour & Tag */}
                  <td className="py-3.5 px-3">
                    <div className="flex flex-col">
                      <span className="font-bold text-xs sm:text-sm text-slate-900 line-clamp-1 hover:text-[#1b7a4e] transition-colors cursor-pointer">
                        {item.name}
                      </span>
                      {renderTagBadge(item.tag)}
                    </div>
                  </td>

                  {/* Loại hình */}
                  <td className="py-3.5 px-3 font-medium text-slate-700">
                    {item.category}
                  </td>

                  {/* Địa điểm */}
                  <td className="py-3.5 px-3 font-medium text-slate-700">
                    {item.location}
                  </td>

                  {/* Đối tác cung cấp */}
                  <td className="py-3.5 px-3 font-medium text-slate-700">
                    {item.provider}
                  </td>

                  {/* Giá từ */}
                  <td className="py-3.5 px-3 font-bold text-xs sm:text-sm text-slate-900 whitespace-nowrap">
                    {formatVND(item.price)}
                  </td>

                  {/* Trạng thái */}
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    {renderStatusBadge(item.status)}
                  </td>

                  {/* Đánh giá */}
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-500 shrink-0" />
                      <span className="font-bold text-slate-900">
                        {item.rating.toFixed(1)}
                      </span>
                      <span className="text-[11px] text-slate-400 font-normal">
                        ({item.reviewsCount})
                      </span>
                    </div>
                  </td>

                  {/* Thao tác */}
                  <td className="py-3.5 pr-4 pl-2 text-right">
                    <button
                      type="button"
                      onClick={() => onItemAction?.(item, "more")}
                      aria-label="Thao tác"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              )
            }))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {items.length > 0 && (
        <div className="p-4 sm:px-5 sm:py-3.5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            Hiển thị 1 - {Math.min(pageSize, items.length)} của {items.length} trải nghiệm &amp; tour
          </div>

          {/* Page buttons */}
          <div className="flex items-center gap-1 font-medium">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              className="w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center bg-[#1b7a4e] text-white shadow-2xs"
            >
              1
            </button>

            <button
              type="button"
              disabled
              className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-colors"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Page size select */}
          <div className="relative">
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="appearance-none pl-3 pr-7 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 focus:outline-none cursor-pointer"
            >
              <option value={10}>10 / trang</option>
              <option value={20}>20 / trang</option>
              <option value={50}>50 / trang</option>
            </select>
            <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      )}
    </div>
  )
}
