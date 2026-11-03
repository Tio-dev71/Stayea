"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import {
  Bell,
  X,
  Send,
  Users,
  Building2,
  Globe,
  Link as LinkIcon,
} from "lucide-react"
import { stayeaApi } from "@/lib/stayea-api-service"

interface PartnerOption {
  id: string
  businessName: string
  contactName: string
  businessType: string
  email: string
}

interface CreateNotificationModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export function CreateNotificationModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateNotificationModalProps) {
  const [recipientType, setRecipientType] = useState<
    "all" | "all_partners" | "all_users" | "partner" | "user"
  >("all_partners")
  const [recipientId, setRecipientId] = useState("")
  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")
  const [type, setType] = useState<
    "system" | "order" | "payout" | "promotion" | "announcement"
  >("announcement")
  const [priority, setPriority] = useState<"normal" | "high" | "urgent">("normal")
  const [actionUrl, setActionUrl] = useState("")
  const [senderName, setSenderName] = useState("Ban Quản Trị STAYEA")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Partner list for dropdown
  const [partners, setPartners] = useState<PartnerOption[]>([])
  const [isLoadingPartners, setIsLoadingPartners] = useState(false)

  useEffect(() => {
    if (isOpen && recipientType === "partner" && partners.length === 0) {
      setIsLoadingPartners(true)
      stayeaApi
        .getAdminPartners()
        .then((res: any[]) => {
          if (Array.isArray(res)) {
            setPartners(res)
            if (res.length > 0 && !recipientId) {
              setRecipientId(res[0].id)
            }
          }
        })
        .catch(() => {})
        .finally(() => setIsLoadingPartners(false))
    }
  }, [isOpen, recipientType, partners.length, recipientId])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      toast.error("Vui lòng nhập tiêu đề thông báo")
      return
    }
    if (!message.trim()) {
      toast.error("Vui lòng nhập nội dung thông báo")
      return
    }
    if (recipientType === "partner" && !recipientId) {
      toast.error("Vui lòng chọn đối tác nhận thông báo")
      return
    }
    if (recipientType === "user" && !recipientId.trim()) {
      toast.error("Vui lòng nhập Email hoặc ID khách hàng nhận thông báo")
      return
    }

    try {
      setIsSubmitting(true)
      await stayeaApi.broadcastNotification({
        recipientType,
        recipientId:
          recipientType === "partner" || recipientType === "user"
            ? recipientId.trim()
            : undefined,
        senderName: senderName.trim() || "Ban Quản Trị STAYEA",
        title: title.trim(),
        message: message.trim(),
        type,
        priority,
        actionUrl: actionUrl.trim() || undefined,
      })

      toast.success("Đã phát thông báo thành công tới đối tượng mục tiêu!")
      // Reset form
      setTitle("")
      setMessage("")
      setActionUrl("")
      onSuccess?.()
      onClose()
    } catch (err: any) {
      toast.error(err.message || "Không thể gửi thông báo. Vui lòng thử lại!")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
              <Bell className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold">Tạo & Phát Thông Báo Hệ Thống</h2>
              <p className="text-xs text-emerald-200/80">
                Gửi thông báo đẩy tức thời tới Đối tác Hub hoặc Du khách
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* 1. Đối tượng nhận */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Đối tượng nhận thông báo
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setRecipientType("all_partners")}
                className={`flex items-center gap-2 p-3 rounded-xl border text-left text-xs font-medium transition-all ${
                  recipientType === "all_partners"
                    ? "border-emerald-600 bg-emerald-50/70 text-emerald-900 font-bold ring-2 ring-emerald-500/20"
                    : "border-slate-200 hover:border-slate-300 text-slate-700"
                }`}
              >
                <Building2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <div className="font-semibold">Tất cả Đối tác</div>
                  <div className="text-[10px] text-slate-500 font-normal">Cổng Partner Hub</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setRecipientType("all_users")}
                className={`flex items-center gap-2 p-3 rounded-xl border text-left text-xs font-medium transition-all ${
                  recipientType === "all_users"
                    ? "border-emerald-600 bg-emerald-50/70 text-emerald-900 font-bold ring-2 ring-emerald-500/20"
                    : "border-slate-200 hover:border-slate-300 text-slate-700"
                }`}
              >
                <Users className="w-4 h-4 text-teal-600 shrink-0" />
                <div>
                  <div className="font-semibold">Tất cả Khách hàng</div>
                  <div className="text-[10px] text-slate-500 font-normal">Trang Stayea.com</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setRecipientType("all")}
                className={`flex items-center gap-2 p-3 rounded-xl border text-left text-xs font-medium transition-all ${
                  recipientType === "all"
                    ? "border-emerald-600 bg-emerald-50/70 text-emerald-900 font-bold ring-2 ring-emerald-500/20"
                    : "border-slate-200 hover:border-slate-300 text-slate-700"
                }`}
              >
                <Globe className="w-4 h-4 text-blue-600 shrink-0" />
                <div>
                  <div className="font-semibold">Toàn bộ Hệ thống</div>
                  <div className="text-[10px] text-slate-500 font-normal">Hub & Khách hàng</div>
                </div>
              </button>
            </div>

            {/* Direct Target Options */}
            <div className="flex gap-4 mt-2 text-xs">
              <button
                type="button"
                onClick={() => setRecipientType("partner")}
                className={`underline hover:text-emerald-700 font-medium ${
                  recipientType === "partner" ? "text-emerald-700 font-bold" : "text-slate-500"
                }`}
              >
                + Chọn 1 đối tác cụ thể
              </button>
              <button
                type="button"
                onClick={() => setRecipientType("user")}
                className={`underline hover:text-emerald-700 font-medium ${
                  recipientType === "user" ? "text-emerald-700 font-bold" : "text-slate-500"
                }`}
              >
                + Gửi 1 khách hàng cụ thể
              </button>
            </div>

            {/* Sub-inputs if direct partner or user */}
            {recipientType === "partner" && (
              <div className="mt-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Chọn cơ sở đối tác:
                </label>
                {isLoadingPartners ? (
                  <p className="text-xs text-slate-500">Đang tải danh sách đối tác...</p>
                ) : (
                  <select
                    value={recipientId}
                    onChange={(e) => setRecipientId(e.target.value)}
                    className="w-full text-xs bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  >
                    {partners.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.businessName} ({p.contactName} - {p.businessType})
                      </option>
                    ))}
                  </select>
                )}
              </div>
            )}

            {recipientType === "user" && (
              <div className="mt-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nhập Email hoặc User ID khách hàng:
                </label>
                <input
                  type="text"
                  value={recipientId}
                  onChange={(e) => setRecipientId(e.target.value)}
                  placeholder="Ví dụ: khachhang@gmail.com"
                  className="w-full text-xs bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                />
              </div>
            )}
          </div>

          {/* 2. Loại & Mức độ ưu tiên */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Phân loại thông báo
              </label>
              <select
                value={type}
                onChange={(e: any) => setType(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              >
                <option value="announcement">📢 Thông báo Quan trọng / Khẩn</option>
                <option value="system">⚙️ Vận hành / Hệ thống</option>
                <option value="promotion">🎁 Khuyến mãi / Ưu đãi</option>
                <option value="order">📦 Đơn hàng & Dịch vụ</option>
                <option value="payout">💰 Chính sách / Thanh toán</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Mức độ ưu tiên
              </label>
              <select
                value={priority}
                onChange={(e: any) => setPriority(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              >
                <option value="normal">Bình thường (Tiêu chuẩn)</option>
                <option value="high">Ưu tiên cao (Màu vàng/cam)</option>
                <option value="urgent">Khẩn cấp (Màu đỏ/cảnh báo)</option>
              </select>
            </div>
          </div>

          {/* 3. Tiêu đề */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Tiêu đề thông báo <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="VD: Cập nhật chính sách hoàn hủy mùa cao điểm 2026"
              className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            />
          </div>

          {/* 4. Nội dung */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Nội dung chi tiết <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Nhập nội dung thông báo gửi tới đối tác hoặc khách hàng..."
              className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 resize-none"
            />
          </div>

          {/* 5. Liên kết Action URL (tùy chọn) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Đường dẫn liên kết (Action URL - Tùy chọn)
              </label>
              <div className="relative">
                <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="text"
                  value={actionUrl}
                  onChange={(e) => setActionUrl(e.target.value)}
                  placeholder="VD: /hub?tab=orders hoặc /stay"
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3.5 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Tên đơn vị phát thông báo
              </label>
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="Ban Quản Trị STAYEA"
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              />
            </div>
          </div>
        </form>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/70">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 transition-colors"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-semibold shadow-md shadow-emerald-600/20 disabled:opacity-50 transition-all cursor-pointer"
          >
            {isSubmitting ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            <span>Phát Thông Báo Ngay</span>
          </button>
        </div>
      </div>
    </div>
  )
}
