"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import {
  Headphones,
  Phone,
  RefreshCw,
  Send,
  ShieldCheck,
} from "lucide-react"
import { toast } from "sonner"
import { stayeaApi } from "@/lib/stayea-api-service"
import type { PartnerProfileData } from "../types"

interface PartnerAdminChatProps {
  profile: PartnerProfileData
}

interface ChatMessageItem {
  id: string
  senderType: "partner" | "admin"
  senderName: string
  content: string
  time: string
}

const QUICK_TOPICS = [
  "Khách yêu cầu nhận phòng sớm",
  "Báo hết phòng ngày cuối tuần",
  "Hỏi về lịch quyết toán doanh thu",
  "Cần hỗ trợ cập nhật dịch vụ",
]

export function PartnerAdminChat({ profile }: PartnerAdminChatProps) {
  const [messages, setMessages] = useState<ChatMessageItem[]>([])
  const [inputText, setInputText] = useState("")
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const fetchChat = useCallback(async (isInitial = false) => {
    try {
      if (isInitial) setLoading(true)
      const res = await stayeaApi.getPartnerChat(profile.id)
      if (res?.messages && Array.isArray(res.messages)) {
        const mapped: ChatMessageItem[] = res.messages.map((m: any) => ({
          id: m.id,
          senderType: m.senderType === "admin" ? "admin" : "partner",
          senderName: m.senderName || (m.senderType === "admin" ? "STAYEA Admin" : profile.contactName),
          content: m.content,
          time: m.createdAt
            ? new Date(m.createdAt).toLocaleTimeString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "Vừa xong",
        }))
        setMessages(mapped)
      }
    } catch {
      // ignore
    } finally {
      if (isInitial) setLoading(false)
    }
  }, [profile.id, profile.contactName])

  useEffect(() => {
    fetchChat(true)
    const interval = setInterval(() => {
      fetchChat(false)
    }, 3500)
    return () => clearInterval(interval)
  }, [fetchChat])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim()
    if (!text || sending) return

    setInputText("")
    setSending(true)

    const tempMsg: ChatMessageItem = {
      id: `temp-${Date.now()}`,
      senderType: "partner",
      senderName: profile.contactName || profile.businessName,
      content: text,
      time: "Vừa xong",
    }
    setMessages((prev) => [...prev, tempMsg])

    try {
      await stayeaApi.sendPartnerChatMessage(profile.id, {
        content: text,
        senderType: "partner",
        senderName: `${profile.contactName} (${profile.businessName})`,
      })
      await fetchChat(false)
    } catch (err: any) {
      toast.error(err?.message || "Không thể gửi tin nhắn. Vui lòng thử lại.")
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="rounded-3xl bg-[#081716] border border-emerald-900/40 shadow-2xl overflow-hidden flex flex-col h-[740px]">
      {/* 1. Header */}
      <div className="px-6 py-4 bg-gradient-to-r from-[#0a2321] via-[#091f1e] to-[#0a2321] border-b border-emerald-800/40 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 shadow-md">
            <Headphones className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white tracking-tight">
                Kênh Hỗ Trợ & Trao Đổi Admin STAYEA
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-400/20 text-emerald-300 border border-emerald-400/40">
                Trực tuyến 24/7
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Cơ sở: <strong className="text-emerald-300">{profile.businessName}</strong> • Người liên hệ: {profile.contactName} ({profile.phone})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <a
            href="tel:0921724444"
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium flex items-center gap-1.5 transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-emerald-400" />
            <span>Hotline: 0921 724 444</span>
          </a>
          <button
            type="button"
            onClick={() => fetchChat(true)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Tải lại tin nhắn"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Quick Topic Chips */}
      <div className="px-6 py-2.5 bg-[#051110] border-b border-emerald-950/80 flex items-center gap-2 overflow-x-auto scrollbar-none">
        <span className="text-[11px] text-slate-400 shrink-0 font-medium">Chủ đề nhanh:</span>
        {QUICK_TOPICS.map((topic, idx) => (
          <button
            key={idx}
            type="button"
            disabled={sending}
            onClick={() => handleSend(topic)}
            className="whitespace-nowrap px-3 py-1 rounded-full text-xs font-medium bg-emerald-950/70 hover:bg-emerald-900/60 text-emerald-200 border border-emerald-800/40 transition-colors shrink-0 disabled:opacity-50"
          >
            {topic}
          </button>
        ))}
      </div>

      {/* 3. Messages Container */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-[#081716] to-[#040e0d]">
        {loading ? (
          <div className="py-24 text-center space-y-3">
            <div className="w-7 h-7 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-slate-400">Đang tải cuộc trao đổi với Ban Quản trị...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="py-24 text-center max-w-sm mx-auto space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-emerald-950/60 border border-emerald-800/40 flex items-center justify-center mx-auto text-emerald-400">
              <Headphones className="w-7 h-7" />
            </div>
            <h4 className="text-sm font-bold text-white">Chưa có tin nhắn nào</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Hãy gửi tin nhắn đầu tiên để liên hệ với Ban Quản trị STAYEA về tình trạng phòng, đơn hàng hoặc bất kỳ thắc mắc nào.
            </p>
          </div>
        ) : (
          messages.map((m) => {
            const isPartner = m.senderType === "partner"

            return (
              <div
                key={m.id}
                className={`flex flex-col ${isPartner ? "items-end" : "items-start"}`}
              >
                {!isPartner && (
                  <div className="flex items-center gap-1.5 mb-1 px-1 text-[11px] font-bold text-amber-300">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{m.senderName || "STAYEA Admin"}</span>
                  </div>
                )}

                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-md ${
                    isPartner
                      ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-br-sm"
                      : "bg-[#0c2f33] border border-emerald-500/30 text-slate-100 rounded-bl-sm"
                  }`}
                >
                  <div className="whitespace-pre-line">{m.content}</div>
                </div>

                <span className="text-[10px] text-slate-400 mt-1 px-1">
                  {m.time}
                </span>
              </div>
            )
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 4. Input Area */}
      <div className="p-4 bg-[#051110] border-t border-emerald-900/40">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSend()
          }}
          className="flex items-center gap-3"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Nhập nội dung trao đổi với Admin STAYEA..."
            disabled={sending}
            className="flex-1 bg-[#091b1a] border border-emerald-700/40 rounded-2xl px-4 py-3 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400 transition-colors disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || sending}
            className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-950 transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Gửi Tin</span>
          </button>
        </form>
        <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2.5 px-2">
          <span>Tin nhắn được gửi trực tiếp đến màn hình điều phối của Admin STAYEA</span>
          <span className="text-emerald-400 font-medium">Bảo mật nội bộ STAYEA Partner Network</span>
        </div>
      </div>
    </div>
  )
}
