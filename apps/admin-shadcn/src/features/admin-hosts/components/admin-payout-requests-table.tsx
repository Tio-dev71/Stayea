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

export function AdminPayoutRequestsTable() {
  const [payouts, setPayouts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [search, setSearch] = useState("")

  // Action Modal State
  const [selectedPayout, setSelectedPayout] = useState<any | null>(null)
  const [actionType, setActionType] = useState<"approve" | "paid" | "reject" | null>(null)
  const [adminNotes, setAdminNotes] = useState("")
  const [transactionRef, setTransactionRef] = useState("")
  const [processing, setProcessing] = useState(false)

  const loadPayouts = async () => {
    setLoading(true)
    try {
      const data = await stayeaApi.getAdminPayouts(filterStatus === "all" ? undefined : filterStatus)
      setPayouts(data)
    } catch {
      toast.error("Không thể tải danh sách quyết toán")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPayouts()
  }, [filterStatus])

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedPayout || !actionType) return

    setProcessing(true)
    try {
      const newStatus = actionType === "approve" ? "approved" : actionType === "paid" ? "paid" : "rejected"
      await stayeaApi.updateAdminPayoutStatus(selectedPayout.id, {
        status: newStatus,
        adminNotes: adminNotes.trim() || undefined,
        transactionRef: transactionRef.trim() || undefined,
      })

      toast.success(
        actionType === "approve"
          ? "Đã phê duyệt yêu cầu quyết toán"
          : actionType === "paid"
            ? "Đã xác nhận giải ngân thành công"
            : "Đã từ chối yêu cầu quyết toán"
      )
      setSelectedPayout(null)
      setActionType(null)
      setAdminNotes("")
      setTransactionRef("")
      await loadPayouts()
    } catch (err: any) {
      toast.error(err.message || "Không thể cập nhật trạng thái")
    } finally {
      setProcessing(false)
    }
  }

  const filteredPayouts = payouts.filter((p) => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return (
      (p.payoutCode || "").toLowerCase().includes(q) ||
      (p.partnerBusinessName || "").toLowerCase().includes(q) ||
      (p.bankAccountHolder || "").toLowerCase().includes(q) ||
      (p.bankAccount || "").toLowerCase().includes(q)
    )
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3" /> Chờ xét duyệt
          </span>
        )
      case "approved":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <Check className="w-3 h-3" /> Đã phê duyệt
          </span>
        )
      case "processing":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
            <RefreshCw className="w-3 h-3 animate-spin" /> Đang chuyển khoản
          </span>
        )
      case "paid":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Check className="w-3 h-3" /> Đã giải ngân
          </span>
        )
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            Từ chối
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
            placeholder="Tìm theo mã lệnh, đối tác, số TK..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#1b7a4e]"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {[
            { id: "all", label: "Tất cả" },
            { id: "pending", label: "Chờ duyệt" },
            { id: "approved", label: "Đã duyệt" },
            { id: "paid", label: "Đã giải ngân" },
            { id: "rejected", label: "Từ chối" },
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
            onClick={loadPayouts}
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
            Đang tải dữ liệu quyết toán...
          </div>
        ) : filteredPayouts.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            Không tìm thấy yêu cầu quyết toán nào.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                <tr>
                  <th className="py-3 px-4">Mã Quyết Toán</th>
                  <th className="py-3 px-4">Đối Tác / Cơ Sở</th>
                  <th className="py-3 px-4">Số Tiền Rút</th>
                  <th className="py-3 px-4">Tài Khoản Thụ Hưởng</th>
                  <th className="py-3 px-4">Thời Gian Yêu Cầu</th>
                  <th className="py-3 px-4">Trạng Thái</th>
                  <th className="py-3 px-4 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredPayouts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      {p.payoutCode}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">
                        {p.partnerBusinessName || "Chủ cơ sở"}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {p.partnerContactName} • {p.partnerPhone}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-bold text-emerald-700 font-mono text-sm">
                      {Number.parseInt(p.amount).toLocaleString("vi-VN")} ₫
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800">{p.bankName}</div>
                      <div className="font-mono text-slate-500 text-[11px]">{p.bankAccount}</div>
                      <div className="font-mono uppercase text-slate-400 text-[10px]">
                        {p.bankAccountHolder}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {new Date(p.createdAt).toLocaleString("vi-VN")}
                    </td>
                    <td className="py-3 px-4">{getStatusBadge(p.status)}</td>
                    <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                      {p.status === "pending" && (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedPayout(p)
                              setActionType("approve")
                            }}
                            className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-[11px] transition-all"
                          >
                            Phê Duyệt
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedPayout(p)
                              setActionType("reject")
                            }}
                            className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-[11px] transition-all"
                          >
                            Từ Chối
                          </button>
                        </>
                      )}
                      {(p.status === "approved" || p.status === "processing") && (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedPayout(p)
                            setActionType("paid")
                          }}
                          className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] shadow-xs transition-all"
                        >
                          Xác Nhận Đã Chuyển Tiền
                        </button>
                      )}
                      {p.status === "paid" && (
                        <span className="text-[11px] text-emerald-600 font-medium">
                          {p.transactionRef ? `Ref: ${p.transactionRef}` : "Hoàn tất"}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Action Dialog Modal */}
      {selectedPayout && actionType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                {actionType === "approve"
                  ? "Phê Duyệt Yêu Cầu Quyết Toán"
                  : actionType === "paid"
                    ? "Xác Nhận Đã Giải Ngân Chuyển Khoản"
                    : "Từ Chối Yêu Cầu Quyết Toán"}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setSelectedPayout(null)
                  setActionType(null)
                }}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateStatus} className="space-y-4">
              <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-200 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Mã lệnh:</span>
                  <span className="font-mono font-bold text-slate-900">{selectedPayout.payoutCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Đối tác:</span>
                  <span className="font-semibold text-slate-900">{selectedPayout.partnerBusinessName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Số tiền:</span>
                  <span className="font-mono font-bold text-emerald-700">
                    {Number.parseInt(selectedPayout.amount).toLocaleString("vi-VN")} ₫
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Ngân hàng:</span>
                  <span className="font-mono text-slate-800">
                    {selectedPayout.bankName} - {selectedPayout.bankAccount}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Chủ TK:</span>
                  <span className="font-mono uppercase text-slate-800">{selectedPayout.bankAccountHolder}</span>
                </div>
              </div>

              {actionType === "paid" && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mã Giao Dịch Chuyển Khoản (Transaction Ref)
                  </label>
                  <input
                    type="text"
                    required
                    value={transactionRef}
                    onChange={(e) => setTransactionRef(e.target.value)}
                    placeholder="VD: FT261102983719 hoặc mã UNC"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-mono text-slate-900 focus:outline-none focus:border-[#1b7a4e]"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {actionType === "reject" ? "Lý do từ chối (bắt buộc)" : "Ghi chú nội bộ"}
                </label>
                <textarea
                  rows={2}
                  required={actionType === "reject"}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder={
                    actionType === "reject"
                      ? "VD: Thông tin STK không trùng tên chủ hộ kinh doanh"
                      : "Ghi chú về đợt quyết toán..."
                  }
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-[#1b7a4e]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPayout(null)
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
                      : actionType === "approve"
                        ? "bg-blue-600 hover:bg-blue-700"
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
