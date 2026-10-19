"use client"

import { useState } from "react"
import Image from "next/image"
import {
  Star,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Eye,
  MessageSquareReply,
  EyeOff,
  Trash2,
} from "lucide-react"
import type { ReviewItem } from "@/features/admin-reviews/stayea-admin-reviews-mock-data"
import { MOCK_REVIEWS_LIST } from "@/features/admin-reviews/stayea-admin-reviews-mock-data"

interface ReviewsDataTableProps {
  reviews?: ReviewItem[]
  onActionClick?: (review: ReviewItem, action: "view" | "reply" | "hide" | "delete") => void
}

function renderStars(rating: number) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((index) => {
        const isFilled = index <= rating
        return (
          <Star
            key={index}
            className={`w-3.5 h-3.5 ${
              isFilled
                ? "fill-amber-400 text-amber-500"
                : "fill-slate-200 text-slate-300"
            }`}
          />
        )
      })}
    </div>
  )
}

function getStatusBadgeClass(status: ReviewItem["status"]) {
  switch (status) {
    case "displayed":
      return "bg-[#dcfce7] text-[#15803d]"
    case "replied":
      return "bg-[#e0f2fe] text-[#0284c7]"
    case "pending":
      return "bg-[#fef3c7] text-[#b45309]"
    default:
      return "bg-slate-100 text-slate-700"
  }
}

export function ReviewsDataTable({
  reviews = MOCK_REVIEWS_LIST,
  onActionClick,
}: ReviewsDataTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null)

  const isAllSelected = reviews.length > 0 && selectedIds.length === reviews.length

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([])
    } else {
      setSelectedIds(reviews.map((r) => r.id))
    }
  }

  const handleToggleRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
      {/* Responsive Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-500 font-medium">
              <th className="py-3 px-3.5 w-10">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={handleToggleSelectAll}
                  aria-label="Chọn tất cả đánh giá"
                  className="rounded-md border-slate-300 text-[#007a48] focus:ring-emerald-500/20 cursor-pointer"
                />
              </th>
              <th className="py-3 px-3.5 font-semibold">Khách hàng</th>
              <th className="py-3 px-3.5 font-semibold">Trải nghiệm / Tour</th>
              <th className="py-3 px-3.5 font-semibold">Đánh giá</th>
              <th className="py-3 px-3.5 font-semibold max-w-[260px]">Nội dung đánh giá</th>
              <th className="py-3 px-3.5 font-semibold">Ngày đánh giá</th>
              <th className="py-3 px-3.5 font-semibold">Trạng thái</th>
              <th className="py-3 px-3.5 font-semibold text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {reviews.map((review) => {
              const isSelected = selectedIds.includes(review.id)
              return (
                <tr
                  key={review.id}
                  className={`hover:bg-slate-50/70 transition-colors ${
                    isSelected ? "bg-emerald-50/30" : ""
                  }`}
                >
                  {/* Checkbox */}
                  <td className="py-3.5 px-3.5">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleToggleRow(review.id)}
                      aria-label={`Chọn đánh giá của ${review.customerName}`}
                      className="rounded-md border-slate-300 text-[#007a48] focus:ring-emerald-500/20 cursor-pointer"
                    />
                  </td>

                  {/* Customer info with circular avatar */}
                  <td className="py-3.5 px-3.5 whitespace-nowrap">
                    <div className="flex items-center gap-2.5">
                      <div className="relative w-7 h-7 rounded-full overflow-hidden shrink-0 border border-slate-200">
                        <Image
                          src={review.customerAvatar}
                          alt={review.customerName}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <span className="font-semibold text-slate-800">
                        {review.customerName}
                      </span>
                    </div>
                  </td>

                  {/* Tour info with square thumbnail */}
                  <td className="py-3.5 px-3.5">
                    <div className="flex items-center gap-2.5 min-w-[170px]">
                      <div className="relative w-8 h-8 rounded-lg overflow-hidden shrink-0 border border-slate-200">
                        <Image
                          src={review.tourImage}
                          alt={review.tourTitle}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-900 line-clamp-1 text-xs">
                          {review.tourTitle}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {review.tourLocation}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Star rating */}
                  <td className="py-3.5 px-3.5 whitespace-nowrap">
                    {renderStars(review.rating)}
                  </td>

                  {/* Review Content */}
                  <td className="py-3.5 px-3.5 text-slate-700 max-w-[260px]">
                    <p className="line-clamp-2 text-xs leading-relaxed">
                      {review.content}
                    </p>
                  </td>

                  {/* Review Date */}
                  <td className="py-3.5 px-3.5 text-slate-500 whitespace-nowrap text-xs">
                    {review.reviewDate}
                  </td>

                  {/* Status Badge */}
                  <td className="py-3.5 px-3.5 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold ${getStatusBadgeClass(
                        review.status
                      )}`}
                    >
                      {review.statusLabel}
                    </span>
                  </td>

                  {/* Actions Dropdown */}
                  <td className="py-3.5 px-3.5 text-center whitespace-nowrap relative">
                    <button
                      type="button"
                      aria-label="Thao tác"
                      onClick={() =>
                        setActiveMenuId(
                          activeMenuId === review.id ? null : review.id
                        )
                      }
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>

                    {/* Action popover */}
                    {activeMenuId === review.id && (
                      <div className="absolute right-4 top-10 w-44 bg-white border border-slate-200 rounded-xl shadow-lg p-1.5 z-30 text-left text-xs">
                        <button
                          type="button"
                          onClick={() => {
                            onActionClick?.(review, "view")
                            setActiveMenuId(null)
                          }}
                          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-700 hover:bg-slate-50"
                        >
                          <Eye className="w-3.5 h-3.5 text-slate-400" />
                          <span>Xem chi tiết</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            onActionClick?.(review, "reply")
                            setActiveMenuId(null)
                          }}
                          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-700 hover:bg-slate-50"
                        >
                          <MessageSquareReply className="w-3.5 h-3.5 text-slate-400" />
                          <span>Trả lời đánh giá</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            onActionClick?.(review, "hide")
                            setActiveMenuId(null)
                          }}
                          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-amber-600 hover:bg-amber-50"
                        >
                          <EyeOff className="w-3.5 h-3.5" />
                          <span>Ẩn đánh giá</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            onActionClick?.(review, "delete")
                            setActiveMenuId(null)
                          }}
                          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-rose-600 hover:bg-rose-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Xóa đánh giá</span>
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
      <div className="p-4 sm:p-5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs text-slate-500 font-medium">
        {/* Count string */}
        <div>
          <span>Hiển thị 1 - 10 của 1.248 đánh giá</span>
        </div>

        {/* Pagination buttons & per page dropdown */}
        <div className="flex flex-wrap items-center gap-3">
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
              onClick={() => setCurrentPage(125)}
              className="w-8 h-7 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              125
            </button>

            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(125, p + 1))}
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
