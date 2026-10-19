import Image from "next/image"
import { Eye, Edit, Trash2 } from "lucide-react"
import type { DealItem } from "@/features/admin-deals/stayea-admin-deals-mock-data"

interface DealsDataTableProps {
  deals: DealItem[]
  onAction?: (deal: DealItem, action: "view" | "edit" | "delete") => void
}

export function DealsDataTable({ deals, onAction }: DealsDataTableProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-3.5 w-10 text-center">
                <input type="checkbox" className="rounded text-emerald-600 focus:ring-emerald-500" />
              </th>
              <th className="py-3 px-3">Tên chương trình</th>
              <th className="py-3 px-3">Mã ưu đãi</th>
              <th className="py-3 px-3">Loại</th>
              <th className="py-3 px-3">Giá trị</th>
              <th className="py-3 px-3">Thời gian áp dụng</th>
              <th className="py-3 px-3 text-center">Lượt dùng</th>
              <th className="py-3 px-3">Trạng thái</th>
              <th className="py-3 px-3 w-12 text-center" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {deals.map((deal) => {
              const isActive = deal.status === "active"
              const isUpcoming = deal.status === "upcoming"

              return (
                <tr key={deal.id} className="hover:bg-slate-50/60 transition-colors group">
                  <td className="py-3 px-3.5 text-center">
                    <input type="checkbox" className="rounded text-emerald-600 focus:ring-emerald-500" />
                  </td>

                  {/* Tên chương trình */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl overflow-hidden relative shrink-0 bg-slate-100 border border-slate-100">
                        <Image
                          src={deal.image}
                          alt={deal.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <span className="font-bold text-slate-900 block truncate group-hover:text-[#1b7a4e] transition-colors">
                          {deal.name}
                        </span>
                        <span className="text-[11px] text-slate-400 block truncate mt-0.5">
                          {deal.subtitle}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Mã ưu đãi */}
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 font-mono text-[11px] font-semibold text-slate-700">
                      {deal.code}
                    </span>
                  </td>

                  {/* Loại */}
                  <td className="py-3 px-3 text-slate-600 font-medium">
                    {deal.type}
                  </td>

                  {/* Giá trị */}
                  <td className="py-3 px-3 font-bold text-[#1b7a4e]">
                    {deal.value}
                  </td>

                  {/* Thời gian áp dụng */}
                  <td className="py-3 px-3 text-slate-500 text-[11px] whitespace-nowrap">
                    {deal.startDate} - {deal.endDate}
                  </td>

                  {/* Lượt dùng */}
                  <td className="py-3 px-3 text-center font-semibold text-slate-700">
                    {deal.usedCount.toLocaleString("vi-VN")}
                  </td>

                  {/* Trạng thái */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isActive
                            ? "bg-emerald-500"
                            : isUpcoming
                            ? "bg-sky-500"
                            : "bg-slate-400"
                        }`}
                      />
                      <span
                        className={`text-xs font-medium ${
                          isActive
                            ? "text-emerald-700"
                            : isUpcoming
                            ? "text-sky-700"
                            : "text-slate-500"
                        }`}
                      >
                        {isActive
                          ? "Đang hoạt động"
                          : isUpcoming
                          ? "Sắp diễn ra"
                          : "Đã kết thúc"}
                      </span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        type="button"
                        onClick={() => onAction?.(deal, "view")}
                        className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
                        title="Xem chi tiết"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onAction?.(deal, "edit")}
                        className="p-1 text-slate-400 hover:text-[#1b7a4e] rounded-lg hover:bg-slate-100"
                        title="Chỉnh sửa"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onAction?.(deal, "delete")}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100"
                        title="Xóa"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-3 border-t border-slate-100 bg-[#fafbfa] flex items-center justify-between text-xs text-slate-500">
        <span>Hiển thị 1 - {deals.length} của 24 chương trình</span>
      </div>
    </div>
  )
}
