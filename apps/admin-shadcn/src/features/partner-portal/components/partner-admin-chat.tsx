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
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const prevMsgCountRef = useRef(0)

  const scrollToBottom = (smooth = true) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: smooth ? "smooth" : "auto",
      })
    }
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
        setMessages((prev) => {
          if (prev.length === mapped.length) {
            const lastPrev = prev[prev.length - 1]
            const lastMapped = mapped[mapped.length - 1]
            if (lastPrev?.id === lastMapped?.id && lastPrev?.content === lastMapped?.content) {
              return prev
            }
          }
          return mapped
        })
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
    if (messages.length > prevMsgCountRef.current) {
      scrollToBottom(prevMsgCountRef.current > 0)
    }
    prevMsgCountRef.current = messages.length
  }, [messages.length])

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
      const saved = await stayeaApi.sendPartnerChatMessage(profile.id, {
        content: text,
        senderType: "partner",
        senderName: `${profile.contactName} (${profile.businessName})`,
      })
      if (saved?.id) {
        setMessages((prev) =>
          prev.map((m) => (m.id === tempMsg.id ? { ...m, id: saved.id } : m))
        )
      }
      await fetchChat(false)
    } catch (err: any) {
      toast.error(err?.message || "Không thể gửi tin nhắn. Vui lòng thử lại.")
      setMessages((prev) => prev.filter((m) => m.id !== tempMsg.id))
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="rounded-3xl bg-white border border-slate-200/90 shadow-xs overflow-hidden flex flex-col h-[740px]">
      {/* 1. Header */}
      <div className="px-6 py-4 bg-white border-b border-slate-100 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shadow-xs">
            <Headphones className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Kênh Hỗ Trợ & Trao Đổi Admin STAYEA
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                Trực tuyến 24/7
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Cơ sở: <strong className="text-slate-800">{profile.businessName}</strong> • Người liên hệ: {profile.contactName} ({profile.phone})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <a
            href="tel:0921724444"
            className="px-3.5 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 font-medium flex items-center gap-1.5 transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-emerald-700" />
            <span>Hotline: 0921 724 444</span>
          </a>
          <button
            type="button"
            onClick={() => fetchChat(true)}
            className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer border border-slate-200"
            title="Tải lại tin nhắn"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Quick Topic Chips */}
      <div className="px-6 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center gap-2 overflow-x-auto scrollbar-none">
        <span className="text-[11px] text-slate-500 shrink-0 font-medium">Chủ đề nhanh:</span>
        {QUICK_TOPICS.map((topic, idx) => (
          <button
            key={idx}
            type="button"
            disabled={sending}
            onClick={() => handleSend(topic)}
            className="whitespace-nowrap px-3 py-1 rounded-full text-xs font-medium bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 transition-colors shrink-0 disabled:opacity-50 cursor-pointer shadow-xs"
          >
            {topic}
          </button>
        ))}
      </div>

      {/* 3. Messages Container */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50"
      >
        {loading ? (
          <div className="py-24 text-center space-y-3">
            <div className="w-7 h-7 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-slate-500 font-medium">Đang tải cuộc trao đổi với Ban Quản trị...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="py-24 text-center max-w-sm mx-auto space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-700">
              <Headphones className="w-7 h-7" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">Chưa có tin nhắn nào</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
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
                  <div className="flex items-center gap-1.5 mb-1 px-1 text-[11px] font-bold text-emerald-800">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{m.senderName || "STAYEA Admin"}</span>
                  </div>
                )}

                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-xs ${
                    isPartner
                      ? "bg-emerald-600 text-white rounded-br-xs"
                      : "bg-white border border-slate-200 text-slate-800 rounded-bl-xs"
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
      </div>

      {/* 4. Input Area */}
      <div className="p-4 bg-white border-t border-slate-100">
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
            className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white transition-colors disabled:opacity-60 shadow-xs"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || sending}
            className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Gửi Tin</span>
          </button>
        </form>
        <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2.5 px-2">
          <span>Tin nhắn được gửi trực tiếp đến màn hình điều phối của Admin STAYEA</span>
          <span className="text-emerald-700 font-semibold">Bảo mật nội bộ STAYEA Partner Network</span>
        </div>
      </div>
    </div>
  )
}
