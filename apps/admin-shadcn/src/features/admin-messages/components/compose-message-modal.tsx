"use client"

import { useState } from "react"
import { X, Send, User, MessageSquarePlus } from "lucide-react"
import type { ConversationItem } from "@/features/admin-messages/stayea-admin-messages-mock-data"

interface ComposeMessageModalProps {
  isOpen: boolean
  onClose: () => void
  contacts: readonly ConversationItem[]
  onSendMessage: (contactId: string, message: string) => void
}

export function ComposeMessageModal({
  isOpen,
  onClose,
  contacts,
  onSendMessage,
}: ComposeMessageModalProps) {
  const [selectedContactId, setSelectedContactId] = useState(contacts[0]?.id || "")
  const [message, setMessage] = useState("")
  const [isSending, setIsSending] = useState(false)

  if (!isOpen) return null

  const handleSend = () => {
    if (!message.trim() || !selectedContactId) return
    setIsSending(true)
    setTimeout(() => {
      setIsSending(false)
      onSendMessage(selectedContactId, message.trim())
      setMessage("")
      onClose()
    }, 400)
  }

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
            aria-label="Đóng"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 text-xs sm:text-sm">
          {/* Select Contact */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 flex items-center gap-1.5">
              <User className="w-4 h-4 text-slate-400" />
              <span>Người nhận</span>
            </label>
            <select
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

          {/* Message Content */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 block">
              Nội dung tin nhắn
            </label>
            <textarea
              rows={4}
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
            disabled={isSending || !message.trim()}
            onClick={handleSend}
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
