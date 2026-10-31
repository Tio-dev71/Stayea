"use client"

import { useState } from "react"
import { X, Send, User, MessageSquarePlus, Phone, Mail } from "lucide-react"
import type { ConversationItem } from "@/features/admin-messages/stayea-admin-messages-mock-data"

interface ComposeMessageModalProps {
  isOpen: boolean
  onClose: () => void
  contacts: readonly ConversationItem[]
  onSendMessage: (
    contactId: string,
    message: string,
    newContact?: { name: string; phone: string; email: string }
  ) => void
}

export function ComposeMessageModal({
  isOpen,
  onClose,
  contacts,
  onSendMessage,
}: ComposeMessageModalProps) {
  const [isManualRecipient, setIsManualRecipient] = useState(contacts.length === 0)
  const [selectedContactId, setSelectedContactId] = useState(contacts[0]?.id || "")
  const [recipientName, setRecipientName] = useState("")
  const [recipientPhone, setRecipientPhone] = useState("")
  const [recipientEmail, setRecipientEmail] = useState("")
  const [message, setMessage] = useState("")
  const [isSending, setIsSending] = useState(false)

  if (!isOpen) return null

  const handleSend = () => {
    if (!message.trim()) return

    if (isManualRecipient || contacts.length === 0) {
      if (!recipientName.trim()) return
      const newContactId = `conv-${Date.now()}`
      setIsSending(true)
      setTimeout(() => {
        setIsSending(false)
        onSendMessage(newContactId, message.trim(), {
          name: recipientName.trim(),
          phone: recipientPhone.trim() || "+84 900 000 000",
          email: recipientEmail.trim() || `${recipientName.toLowerCase().replace(/\s+/g, "")}@example.com`,
        })
        setMessage("")
        setRecipientName("")
        setRecipientPhone("")
        setRecipientEmail("")
        onClose()
      }, 400)
    } else {
      if (!selectedContactId) return
      setIsSending(true)
      setTimeout(() => {
        setIsSending(false)
        onSendMessage(selectedContactId, message.trim())
        setMessage("")
        onClose()
      }, 400)
    }
  }

  const canSend =
    message.trim().length > 0 &&
    (isManualRecipient || contacts.length === 0
      ? recipientName.trim().length > 0
      : Boolean(selectedContactId))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full shadow-2xl overflow-hidden text-slate-800">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#e8f7ee] text-[#007a48] flex items-center justify-center">
              <MessageSquarePlus className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 leading-tight">
                Tạo tin nhắn mới
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Bắt đầu cuộc trò chuyện với khách hàng hoặc đối tác
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng hộp thoại"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 text-xs sm:text-sm">
          {/* Recipient Selection Mode */}
          {contacts.length > 0 && (
            <div className="flex items-center justify-between pb-1 border-b border-slate-100">
              <span className="text-xs text-slate-500 font-medium">Người nhận</span>
              <button
                type="button"
                onClick={() => setIsManualRecipient((prev) => !prev)}
                className="text-xs font-semibold text-[#007a48] hover:underline"
              >
                {isManualRecipient ? "Chọn từ danh bạ" : "+ Nhập người nhận mới"}
              </button>
            </div>
          )}

          {contacts.length > 0 && !isManualRecipient ? (
            <div className="space-y-1.5">
              <label htmlFor="recipient-select" className="font-semibold text-slate-700 flex items-center gap-1.5">
                <User className="w-4 h-4 text-slate-400" />
                <span>Chọn liên hệ</span>
              </label>
              <select
                id="recipient-select"
                value={selectedContactId}
                onChange={(e) => setSelectedContactId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              >
                {contacts.map((contact) => (
                  <option key={contact.id} value={contact.id}>
                    {contact.name} ({contact.roleBadge} - {contact.phone})
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label htmlFor="manual-recipient-name" className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-slate-400" />
                  <span>Tên người nhận <span aria-hidden="true" className="text-rose-500">*</span></span>
                </label>
                <input
                  id="manual-recipient-name"
                  type="text"
                  required
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Văn A"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="space-y-1.5">
                  <label htmlFor="manual-recipient-phone" className="font-medium text-slate-600 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>Số điện thoại</span>
                  </label>
                  <input
                    id="manual-recipient-phone"
                    type="tel"
                    value={recipientPhone}
                    onChange={(e) => setRecipientPhone(e.target.value)}
                    placeholder="0912..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="manual-recipient-email" className="font-medium text-slate-600 flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>Email</span>
                  </label>
                  <input
                    id="manual-recipient-email"
                    type="email"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    placeholder="name@email.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Message Content */}
          <div className="space-y-1.5">
            <label htmlFor="compose-message-textarea" className="font-semibold text-slate-700 block">
              Nội dung tin nhắn <span aria-hidden="true" className="text-rose-500">*</span>
            </label>
            <textarea
              id="compose-message-textarea"
              rows={4}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Nhập nội dung trao đổi..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            Hủy
          </button>
          <button
            type="button"
            disabled={isSending || !canSend}
            onClick={handleSend}
            aria-label="Xác nhận gửi tin nhắn"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#007a48] hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSending ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Đang gửi...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Gửi tin nhắn</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
