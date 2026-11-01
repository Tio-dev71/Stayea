"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import {
  Check,
  Clock,
  RefreshCw,
  Search,
  X,
} from "lucide-react"
import { stayeaApi } from "@/lib/stayea-api-service"

export function AdminCatalogModerationTable() {
  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [search, setSearch] = useState("")

  // Moderation Action State
  const [selectedService, setSelectedService] = useState<any | null>(null)
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(null)
  const [moderationReason, setModerationReason] = useState("")
  const [processing, setProcessing] = useState(false)

  const loadServices = async () => {
    setLoading(true)
    try {
      const data = await stayeaApi.getAdminServices({
        status: filterStatus === "all" ? undefined : filterStatus,
      })
      setServices(data)
    } catch {
      toast.error("Không thể tải danh sách dịch vụ đối tác")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadServices()
  }, [filterStatus])

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedService || !actionType) return

    setProcessing(true)
    try {
      const newStatus = actionType === "approve" ? "active" : "inactive"
      await stayeaApi.updateAdminServiceStatus(
        selectedService.id,
        newStatus,
        moderationReason.trim() || undefined
      )

      toast.success(
        actionType === "approve"
          ? `Đã phê duyệt mở bán dịch vụ "${selectedService.title}"`
          : `Đã tạm ẩn/từ chối dịch vụ "${selectedService.title}"`
      )
      setSelectedService(null)
      setActionType(null)
      setModerationReason("")
      await loadServices()
    } catch (err: any) {
      toast.error(err.message || "Không thể cập nhật trạng thái dịch vụ")
    } finally {
      setProcessing(false)
    }
  }

  const filteredServices = services.filter((s) => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return (
      (s.title || "").toLowerCase().includes(q) ||
      (s.location || "").toLowerCase().includes(q) ||
      (s.partnerBusinessName || "").toLowerCase().includes(q)
    )
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending_approval":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3" /> Chờ kiểm duyệt
          </span>
        )
      case "active":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Check className="w-3 h-3" /> Đang mở bán
          </span>
        )
      case "inactive":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
            Tạm ẩn
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
            {status}
          </span>
        )
    }
  }

  const getServiceTypeBadge = (type: string) => {
    switch (type) {
      case "stay":
        return "Homestay / Villa"
      case "transport":
        return "Thuê xe / Đội xe"
      case "experience":
      case "tour":
        return "Tour / Cano"
      case "combo":
        return "Gói Combo"
      default:
        return type
    }
  }

  return (
    <div className="space-y-6">
      {/* Controls & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên dịch vụ, cơ sở, địa điểm..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#1b7a4e]"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {[
            { id: "all", label: "Tất cả" },
            { id: "pending_approval", label: "Chờ kiểm duyệt" },
            { id: "active", label: "Đang mở bán" },
            { id: "inactive", label: "Tạm ẩn" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                filterStatus === tab.id
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}

          <button
            type="button"
            onClick={loadServices}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all ml-1"
            title="Làm mới"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#1b7a4e]" />
            Đang tải danh sách dịch vụ đối tác...
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            Không tìm thấy dịch vụ nào phù hợp.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                <tr>
                  <th className="py-3 px-4">Dịch Vụ & Hình Ảnh</th>
                  <th className="py-3 px-4">Loại Hình</th>
                  <th className="py-3 px-4">Chủ Cơ Sở / Đối Tác</th>
                  <th className="py-3 px-4">Giá Niêm Yết</th>
                  <th className="py-3 px-4">Địa Chỉ</th>
                  <th className="py-3 px-4">Trạng Thái</th>
                  <th className="py-3 px-4 text-right">Thao Tác Duyệt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredServices.map((svc) => (
                  <tr key={svc.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            Array.isArray(svc.images) && svc.images.length > 0
                              ? svc.images[0]
                              : "/about/hero-phuquoc.jpg"
                          }
                          alt={svc.title}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                        />
                        <div className="min-w-0 max-w-xs">
                          <div className="font-bold text-slate-900 truncate">
                            {svc.title}
                          </div>
                          <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                            {svc.description || "Chưa có mô tả chi tiết"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium text-[11px]">
                        {getServiceTypeBadge(svc.serviceType)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">
                        {svc.partnerBusinessName || "Chưa gán cơ sở"}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {svc.partnerContactName} • {svc.partnerPhone}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-emerald-700">
                      {Number.parseInt(svc.price).toLocaleString("vi-VN")} ₫
                      <span className="text-[10px] text-slate-400 font-normal">
                        /{svc.unit}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500 max-w-xs truncate">
                      {svc.location}
                    </td>
                    <td className="py-3 px-4">{getStatusBadge(svc.status)}</td>
                    <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                      {svc.status !== "active" && (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedService(svc)
                            setActionType("approve")
                          }}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] shadow-xs transition-all"
                        >
                          Duyệt Mở Bán
                        </button>
                      )}
                      {svc.status !== "inactive" && (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedService(svc)
                            setActionType("reject")
                          }}
                          className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-[11px] transition-all"
                        >
                          Tạm Ẩn
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Moderation Confirmation Modal */}
      {selectedService && actionType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                {actionType === "approve"
                  ? "Xác Nhận Phê Duyệt Dịch Vụ Mở Bán"
                  : "Tạm Ẩn / Ngừng Mở Bán Dịch Vụ"}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setSelectedService(null)
                  setActionType(null)
                }}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateStatus} className="space-y-4">
              <div className="flex gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <img
                  src={
                    Array.isArray(selectedService.images) && selectedService.images.length > 0
                      ? selectedService.images[0]
                      : "/about/hero-phuquoc.jpg"
                  }
                  alt={selectedService.title}
                  className="w-14 h-14 rounded-lg object-cover"
                />
                <div className="text-xs">
                  <div className="font-bold text-slate-900">{selectedService.title}</div>
                  <div className="text-slate-500 mt-0.5">{selectedService.location}</div>
                  <div className="text-emerald-700 font-bold font-mono mt-1">
                    {Number.parseInt(selectedService.price).toLocaleString("vi-VN")} ₫ / {selectedService.unit}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {actionType === "reject" ? "Lý do tạm ẩn / từ chối (bắt buộc)" : "Ghi chú kiểm duyệt (không bắt buộc)"}
                </label>
                <textarea
                  rows={2}
                  required={actionType === "reject"}
                  value={moderationReason}
                  onChange={(e) => setModerationReason(e.target.value)}
                  placeholder={
                    actionType === "reject"
                      ? "VD: Hình ảnh không rõ ràng hoặc thông tin phòng không chính xác"
                      : "Ghi chú duyệt..."
                  }
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-[#1b7a4e]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedService(null)
                    setActionType(null)
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-600"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={processing}
                  className={`px-4 py-2 rounded-xl text-xs font-bold text-white shadow-xs flex items-center gap-1.5 ${
                    actionType === "reject"
                      ? "bg-rose-600 hover:bg-rose-700"
                      : "bg-emerald-600 hover:bg-emerald-700"
                  }`}
                >
                  {processing ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Đang xử lý...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Xác Nhận</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
