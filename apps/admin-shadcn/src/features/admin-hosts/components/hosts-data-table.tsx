"use client"

import { useState } from "react"
import Image from "next/image"
import {
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Eye,
  FileText,
  Percent,
  UserX,
} from "lucide-react"
import type { HostPartnerItem, PartnerType, PartnerStatus } from "@/features/admin-hosts/stayea-admin-hosts-mock-data"
import { HOSTS_MOCK_LIST } from "@/features/admin-hosts/stayea-admin-hosts-mock-data"

interface HostsDataTableProps {
  hosts?: readonly HostPartnerItem[]
  onHostAction?: (action: string, host: HostPartnerItem) => void
}

function renderPartnerTypeBadge(type: PartnerType, label: string) {
  switch (type) {
    case "individual":
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-sky-50 text-sky-700 border border-sky-200/60 whitespace-nowrap">
          {label}
        </span>
      )
    case "management_company":
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60 whitespace-nowrap">
          {label}
        </span>
      )
    case "agency":
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-purple-50 text-purple-700 border border-purple-200/60 whitespace-nowrap">
          {label}
        </span>
      )
  }
}

function renderHostStatusBadge(status: PartnerStatus, label: string) {
  switch (status) {
    case "active":
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/70 whitespace-nowrap">
          {label}
        </span>
      )
    case "pending":
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/70 whitespace-nowrap">
          {label}
        </span>
      )
    case "paused":
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/70 whitespace-nowrap">
          {label}
        </span>
      )
  }
}

export function HostsDataTable({
  hosts = HOSTS_MOCK_LIST,
  onHostAction,
}: HostsDataTableProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  const pageSize = 10
  const totalCount = hosts.length
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = Math.min(startIndex + pageSize, totalCount)
  const paginatedHosts = hosts.slice(startIndex, endIndex)

  const isAllSelected = hosts.length > 0 && selectedIds.length === hosts.length

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([])
    } else {
      setSelectedIds(hosts.map((h) => h.id))
    }
  }

  const handleToggleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500 font-semibold select-none">
              <th className="py-3.5 pl-4 pr-2 w-10">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={handleToggleSelectAll}
                  aria-label="Chọn tất cả"
                  className="rounded border-slate-300 text-[#1b7a4e] focus:ring-[#1b7a4e] cursor-pointer"
                />
              </th>
              <th className="py-3.5 px-3 min-w-[200px]">Chủ nhà / Đối tác</th>
              <th className="py-3.5 px-3 whitespace-nowrap">Loại đối tác</th>
              <th className="py-3.5 px-3 text-center whitespace-nowrap">Số BĐS</th>
              <th className="py-3.5 px-3 whitespace-nowrap">Khu vực</th>
              <th className="py-3.5 px-3 whitespace-nowrap">Ngày tham gia</th>
              <th className="py-3.5 px-3 whitespace-nowrap">Doanh thu tạo ra</th>
              <th className="py-3.5 px-3 text-center whitespace-nowrap">Hoa hồng</th>
              <th className="py-3.5 px-3 whitespace-nowrap">Trạng thái</th>
              <th className="py-3.5 pr-4 pl-3 text-center whitespace-nowrap">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedHosts.length > 0 ? (
              paginatedHosts.map((host) => {
              const isSelected = selectedIds.includes(host.id)
              const isMenuOpen = activeMenuId === host.id

              return (
                <tr
                  key={host.id}
                  className={`hover:bg-slate-50/80 transition-colors ${
                    isSelected ? "bg-emerald-50/30" : ""
                  }`}
                >
                  {/* Row Checkbox */}
                  <td className="py-3 pl-4 pr-2">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleToggleSelectRow(host.id)}
                      aria-label={`Chọn ${host.name}`}
                      className="rounded border-slate-300 text-[#1b7a4e] focus:ring-[#1b7a4e] cursor-pointer"
                    />
                  </td>

                  {/* Host Name + Avatar + Email */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-8 h-8 rounded-full overflow-hidden bg-slate-100 shrink-0 ring-1 ring-slate-200/70">
                        <Image
                          src={host.avatar}
                          alt={host.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <span className="font-semibold text-slate-800 hover:text-emerald-700 cursor-pointer block truncate text-xs">
                          {host.name}
                        </span>
                        <span className="text-[11px] text-slate-400 block truncate">
                          {host.email}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Partner Type Badge */}
                  <td className="py-3 px-3">
                    {renderPartnerTypeBadge(host.partnerType, host.partnerTypeLabel)}
                  </td>

                  {/* Properties Count */}
                  <td className="py-3 px-3 text-center text-slate-700 font-semibold">
                    {host.propertiesCount}
                  </td>

                  {/* Region */}
                  <td className="py-3 px-3 font-medium text-slate-700 whitespace-nowrap">
                    {host.region}
                  </td>

                  {/* Joined Date */}
                  <td className="py-3 px-3 text-slate-500 whitespace-nowrap">
                    {host.joinedDate}
                  </td>

                  {/* Revenue */}
                  <td className="py-3 px-3 font-bold text-slate-900 whitespace-nowrap">
                    {host.revenue}
                  </td>

                  {/* Commission */}
                  <td className="py-3 px-3 text-center font-semibold text-slate-700 whitespace-nowrap">
                    {host.commission}
                  </td>

                  {/* Status Badge */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    {renderHostStatusBadge(host.status, host.statusLabel)}
                  </td>

                  {/* Action Button */}
                  <td className="py-3 pr-4 pl-3 text-center relative">
                    <button
                      type="button"
                      aria-label="Thao tác"
                      onClick={() => setActiveMenuId(isMenuOpen ? null : host.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>

                    {isMenuOpen && (
                      <div className="absolute right-4 top-10 w-48 bg-white rounded-xl shadow-lg border border-slate-200/80 py-1.5 z-20 text-left text-xs animate-in fade-in zoom-in-95 duration-150">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveMenuId(null)
                            onHostAction?.("view", host)
                          }}
                          className="w-full px-3 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                        >
                          <Eye className="w-3.5 h-3.5 text-slate-400" />
                          <span>Xem hồ sơ đối tác</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveMenuId(null)
                            onHostAction?.("contract", host)
                          }}
                          className="w-full px-3 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                        >
                          <FileText className="w-3.5 h-3.5 text-slate-400" />
                          <span>Quản lý hợp đồng</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveMenuId(null)
                            onHostAction?.("commission", host)
                          }}
                          className="w-full px-3 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                        >
                          <Percent className="w-3.5 h-3.5 text-slate-400" />
                          <span>Thiết lập hoa hồng</span>
                        </button>
                        <div className="my-1 border-t border-slate-100" />
                        <button
                          type="button"
                          onClick={() => {
                            setActiveMenuId(null)
                            onHostAction?.("suspend", host)
                          }}
                          className="w-full px-3 py-2 text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                        >
                          <UserX className="w-3.5 h-3.5 text-rose-500" />
                          <span>Tạm dừng hợp tác</span>
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              )
            })
          ) : (
              <tr>
                <td colSpan={10} className="py-12 text-center text-slate-400">
                  Chưa có chủ nhà hoặc đối tác nào trong danh mục này.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-3 sm:p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <span className="font-medium text-slate-600">
          Hiển thị {totalCount === 0 ? 0 : startIndex + 1} - {endIndex} của {totalCount} chủ nhà/đối tác
        </span>

        {totalPages > 1 && (
          <div className="flex items-center gap-2">
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
        )}
      </div>
    </div>
  )
}
