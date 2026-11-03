"use client"

import * as React from "react"
import {
  AlertCircle,
  Bot,
  Calendar,
  Car,
  Clock,
  Headphones,
  Home,
  Maximize2,
  Minimize2,
  RotateCcw,
  Send,
  ShieldCheck,
  Ship,
  Sparkles,
  User,
  X,
} from "lucide-react"
import { stayeaApi } from "@/lib/stayea-api-service"
import { toast } from "sonner"

export interface BookingCardData {
  orderCode: string
  serviceTitle: string
  serviceType: string
  customerName: string
  customerPhone: string
  startDate: string
  endDate?: string | null
  quantity: number
  totalAmount: number
  status: "pending_admin"
  note?: string
}

export interface ChatMessage {
  id: string
  role: "user" | "assistant" | "admin"
  content: string
  timestamp: string
  bookingCard?: BookingCardData | null
  senderName?: string
  senderAvatar?: string
}

const QUICK_PROMPTS = [
  { label: "🏡 Villa hồ bơi 3 phòng ngủ", query: "Tôi muốn tìm một căn biệt thự 3 phòng ngủ có hồ bơi riêng tại Phú Quốc cho gia đình." },
  { label: "🚗 Xe 7 chỗ tự lái ngày mai", query: "Tôi cần thuê 1 chiếc xe 7 chỗ tự lái tại Phú Quốc, tư vấn cho tôi các dòng xe sẵn có." },
  { label: "🚤 Tour cano 4 đảo ngắm hoàng hôn", query: "Tư vấn cho tôi tour cano đi 4 đảo và lặn ngắm san hô độc bản tại Phú Quốc." },
  { label: "✨ Đặt giữ chỗ xe Xpander", query: "Tôi muốn đặt xe 7 chỗ Mitsubishi Xpander từ ngày mai. Tên tôi là Nguyễn Văn Tuấn, SĐT 0987654321." },
]

const CHAT_STORAGE_KEY = "stayea_ai_chat_history"
const CONSULTANT_CONV_KEY = "stayea_consultant_conv_id"
const CUSTOMER_CONTACT_KEY = "stayea_chat_customer_contact"

const DEFAULT_WELCOME_MESSAGE: ChatMessage = {
  id: "welcome-1",
  role: "assistant",
  content:
    "Dạ em chào Quý khách! Em là STAYEA Luxury Concierge — Cố vấn kỳ nghỉ và trải nghiệm độc bản tại Đảo Ngọc Phú Quốc.\n\nEm có thể giúp Quý khách:\n• 🏡 Tra cứu biệt thự nghỉ dưỡng, homestay ven biển còn phòng\n• 🚗 Đặt thuê xe tự lái hoặc có tài xế riêng\n• 🚤 Tư vấn tour cano ngắm hoàng hôn & lặn san hô\n• 📋 Tạo phiếu đặt giữ chỗ chuyển Admin STAYEA duyệt điều phối ngay\n\nQuý khách đang quan tâm dịch vụ nào cho chuyến đi sắp tới ạ?",
  timestamp: "Vừa xong",
}

export function AiConciergeWidget() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [isExpanded, setIsExpanded] = React.useState(false)
  const [chatMode, setChatMode] = React.useState<"ai" | "consultant">("ai")
  const [inputMessage, setInputMessage] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)

  // AI Chat Messages
  const [messages, setMessages] = React.useState<ChatMessage[]>([DEFAULT_WELCOME_MESSAGE])

  // Human Consultant Messages
  const [consultantConvId, setConsultantConvId] = React.useState<string | null>(null)
  const [consultantMessages, setConsultantMessages] = React.useState<ChatMessage[]>([
    {
      id: "consultant-welcome",
      role: "admin",
      senderName: "Chuyên viên STAYEA VIP",
      content:
        "Xin chào Quý khách! Em là chuyên viên điều phối trực tiếp của Ban Quản trị STAYEA Phú Quốc.\n\nAnh/Chị cần hỗ trợ đặt phòng riêng, liên hệ chủ nhà, kiểm tra lịch xe hoặc các yêu cầu đặc biệt, xin vui lòng nhắn tại đây — đội ngũ tư vấn sẽ phản hồi Quý khách ngay!",
      timestamp: "Vừa xong",
    },
  ])

  // Customer Contact Info for Consultant Chat
  const [customerName, setCustomerName] = React.useState("")
  const [customerPhone, setCustomerPhone] = React.useState("")
  const [showContactForm, setShowContactForm] = React.useState(false)

  // Hydrate from Storage once mounted
  React.useEffect(() => {
    try {
      const stored = window.sessionStorage.getItem(CHAT_STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed)
        }
      }

      const savedConv = window.localStorage.getItem(CONSULTANT_CONV_KEY)
      if (savedConv) {
        setConsultantConvId(savedConv)
      }

      const savedContact = window.localStorage.getItem(CUSTOMER_CONTACT_KEY)
      if (savedContact) {
        const parsed = JSON.parse(savedContact)
        setCustomerName(parsed.name || "")
        setCustomerPhone(parsed.phone || "")
      }
    } catch {
      // ignore
    }
  }, [])

  // Sync AI messages to sessionStorage
  React.useEffect(() => {
    try {
      if (messages.length > 0) {
        window.sessionStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages))
      }
    } catch {
      // ignore
    }
  }, [messages])

  // Poll Consultant Messages when in consultant mode
  const fetchConsultantMessages = React.useCallback(async (convId: string) => {
    try {
      const res = await stayeaApi.getChatMessages(convId, "participant")
      if (res?.messages && Array.isArray(res.messages) && res.messages.length > 0) {
        const mapped: ChatMessage[] = res.messages.map((m: any) => ({
          id: m.id,
          role: m.senderType === "admin" ? "admin" : "user",
          senderName: m.senderName || (m.senderType === "admin" ? "STAYEA CSKH VIP" : "Quý khách"),
          content: m.content,
          timestamp: m.createdAt
            ? new Date(m.createdAt).toLocaleTimeString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "Vừa xong",
        }))
        setConsultantMessages(mapped)
      }
    } catch {
      // ignore
    }
  }, [])

  React.useEffect(() => {
    if (chatMode === "consultant" && consultantConvId && isOpen) {
      fetchConsultantMessages(consultantConvId)
      const interval = setInterval(() => {
        fetchConsultantMessages(consultantConvId)
      }, 3500)
      return () => clearInterval(interval)
    }
    return undefined
  }, [chatMode, consultantConvId, isOpen, fetchConsultantMessages])

  const handleResetChat = () => {
    try {
      window.sessionStorage.removeItem(CHAT_STORAGE_KEY)
    } catch {
      // ignore
    }
    setMessages([
      {
        ...DEFAULT_WELCOME_MESSAGE,
        id: `welcome-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ])
  }

  const scrollContainerRef = React.useRef<HTMLDivElement>(null)
  const prevMsgCountRef = React.useRef(0)

  const scrollToBottom = (smooth = true) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: smooth ? "smooth" : "auto",
      })
    }
  }

  React.useEffect(() => {
    const totalCount = (chatMode === "ai" ? messages : consultantMessages).length
    if (isOpen && totalCount > prevMsgCountRef.current) {
      scrollToBottom(prevMsgCountRef.current > 0)
    }
    prevMsgCountRef.current = totalCount
  }, [messages.length, consultantMessages.length, isOpen, chatMode])

  // 1. Send Message to AI
  const handleSendAiMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim()
    if (!text || isLoading) return

    const userMsgId = `usr-${Date.now()}`
    const userMsg: ChatMessage = {
      id: userMsgId,
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    }

    setMessages((prev) => [...prev, userMsg])
    setInputMessage("")
    setIsLoading(true)

    try {
      const payloadMessages = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }))

      const res = await fetch("/api/stayea/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: payloadMessages,
        }),
      })

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`)
      }

      const data = await res.json()

      const assistantMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content: data.reply || "Dạ em đã ghi nhận yêu cầu của Quý khách ạ!",
        timestamp: new Date().toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        bookingCard: data.bookingCreated || null,
      }

      setMessages((prev) => [...prev, assistantMsg])
    } catch {
      const fallbackMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content:
          "Dạ hệ thống AI đang cập nhật dữ liệu. Quý khách vui lòng chuyển sang tab 'Chuyên viên tư vấn' hoặc gọi Hotline 0921.724.444 để chuyên viên STAYEA hỗ trợ ngay nhé!",
        timestamp: new Date().toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      }
      setMessages((prev) => [...prev, fallbackMsg])
    } finally {
      setIsLoading(false)
    }
  }

  // 2. Send Message to Human Consultant
  const handleSendConsultantMessage = async () => {
    const text = inputMessage.trim()
    if (!text || isLoading) return

    setInputMessage("")
    setIsLoading(true)

    const tempMsg: ChatMessage = {
      id: `usr-c-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    }
    setConsultantMessages((prev) => [...prev, tempMsg])

    try {
      if (!consultantConvId) {
        // Start new conversation
        const contact = {
          name: customerName.trim() || "Khách hàng STAYEA",
          phone: customerPhone.trim() || undefined,
        }
        try {
          window.localStorage.setItem(CUSTOMER_CONTACT_KEY, JSON.stringify(contact))
        } catch {}

        const res = await stayeaApi.startCustomerChat({
          customerName: contact.name,
          customerPhone: contact.phone,
          initialMessage: text,
          metadata: { source: "website_ai_widget" },
        })

        if (res?.conversation) {
          setConsultantConvId(res.conversation.id)
          try {
            window.localStorage.setItem(CONSULTANT_CONV_KEY, res.conversation.id)
          } catch {}
          await fetchConsultantMessages(res.conversation.id)
        }
      } else {
        await stayeaApi.sendChatMessage(consultantConvId, {
          content: text,
          senderType: "customer",
          senderName: customerName.trim() || "Khách hàng",
        })
        await fetchConsultantMessages(consultantConvId)
      }
    } catch (err: any) {
      toast.error(err?.message || "Không thể gửi tin nhắn đến chuyên viên.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGeneralSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (chatMode === "ai") {
      handleSendAiMessage()
    } else {
      handleSendConsultantMessage()
    }
  }

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-[#0c3b40] to-[#14535a] hover:from-[#14535a] hover:to-[#0c3b40] text-white rounded-full shadow-2xl border border-emerald-400/40 hover:scale-105 active:scale-95 transition-all group duration-300"
          aria-label="Mở Trợ lý AI Concierge"
        >
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-300/40 flex items-center justify-center">
              <Bot className="w-5 h-5 text-emerald-300 group-hover:rotate-12 transition-transform duration-300" />
            </div>
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-[#0c3b40] animate-pulse" />
          </div>
          <div className="text-left pr-1 hidden sm:block">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold tracking-wide uppercase text-emerald-200">
                STAYEA AI
              </span>
              <Sparkles className="w-3 h-3 text-amber-300" />
            </div>
            <p className="text-[11px] text-slate-300 font-medium">Cố Vấn Du Lịch Phú Quốc</p>
          </div>
        </button>
      )}

      {/* Floating Chat Modal */}
      {isOpen && (
        <div
          className={`fixed z-50 bg-[#082226] border border-emerald-600/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${
            isExpanded
              ? "bottom-4 right-4 left-4 top-4 sm:left-auto sm:top-auto sm:w-[580px] sm:h-[720px]"
              : "bottom-6 right-6 w-[92vw] sm:w-[430px] h-[620px] max-h-[85vh]"
          }`}
        >
          {/* Header */}
          <div className="px-4 py-3 bg-gradient-to-r from-[#0c3b40] to-[#08282b] border-b border-emerald-500/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center">
                  {chatMode === "ai" ? (
                    <Bot className="w-5 h-5 text-emerald-300" />
                  ) : (
                    <Headphones className="w-5 h-5 text-amber-300" />
                  )}
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border border-[#082226]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-white tracking-tight">
                    {chatMode === "ai" ? "STAYEA AI Concierge" : "Chuyên Viên Tư Vấn STAYEA"}
                  </h3>
                  <span
                    className={`px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded border ${
                      chatMode === "ai"
                        ? "bg-amber-400/20 text-amber-300 border-amber-400/30"
                        : "bg-emerald-400/20 text-emerald-300 border-emerald-400/30"
                    }`}
                  >
                    {chatMode === "ai" ? "AI Bot" : "Admin Trực"}
                  </span>
                </div>
                <p className="text-[11px] text-emerald-300/80">
                  {chatMode === "ai"
                    ? "Cố vấn & Tạo đơn điều phối đối tác"
                    : "Hỗ trợ đặt phòng & Kết nối chủ nhà"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-slate-400">
              {chatMode === "ai" && (
                <button
                  onClick={handleResetChat}
                  className="p-1.5 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  title="Làm mới cuộc trò chuyện"
                  aria-label="Làm mới cuộc trò chuyện"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 hover:text-white hover:bg-white/10 rounded-lg transition-colors hidden sm:block"
                title={isExpanded ? "Thu nhỏ" : "Mở rộng"}
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                title="Đóng chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Mode Switcher Tabs: AI Concierge vs Chuyên viên tư vấn */}
          <div className="px-3 py-2 bg-[#06181b] border-b border-emerald-900/50 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setChatMode("ai")}
              className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                chatMode === "ai"
                  ? "bg-emerald-700/80 text-white shadow-sm border border-emerald-500/40"
                  : "bg-emerald-950/40 text-emerald-300/70 hover:text-white hover:bg-emerald-900/40"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>STAYEA AI</span>
            </button>
            <button
              type="button"
              onClick={() => setChatMode("consultant")}
              className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all relative ${
                chatMode === "consultant"
                  ? "bg-emerald-700/80 text-white shadow-sm border border-emerald-500/40"
                  : "bg-emerald-950/40 text-emerald-300/70 hover:text-white hover:bg-emerald-900/40"
              }`}
            >
              <Headphones className="w-3.5 h-3.5 text-amber-300" />
              <span>Chat Chuyên Viên</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </button>
          </div>

          {/* Quick Filter Prompts (AI Mode Only) */}
          {chatMode === "ai" && (
            <div className="px-3 py-2 bg-[#061c1f]/80 border-b border-emerald-500/10 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
              {QUICK_PROMPTS.map((qp, idx) => (
                <button
                  key={idx}
                  disabled={isLoading}
                  onClick={() => handleSendAiMessage(qp.query)}
                  className="whitespace-nowrap px-2.5 py-1 text-[11px] font-medium bg-emerald-950/60 hover:bg-emerald-800/50 text-emerald-200 border border-emerald-700/40 rounded-full transition-all shrink-0 hover:border-emerald-400/50 disabled:opacity-50"
                >
                  {qp.label}
                </button>
              ))}
            </div>
          )}

          {/* Consultant Mode Top Helper Banner */}
          {chatMode === "consultant" && (
            <div className="px-3 py-2 bg-gradient-to-r from-emerald-950/60 via-teal-950/40 to-emerald-950/60 border-b border-emerald-800/40 flex items-center justify-between text-[11px] text-emerald-200">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Kênh kết nối trực tiếp Quản trị STAYEA</span>
              </div>
              <button
                type="button"
                onClick={() => setShowContactForm(!showContactForm)}
                className="text-amber-300 hover:underline font-semibold text-[10px]"
              >
                {customerPhone ? `SĐT: ${customerPhone}` : "+ Thêm thông tin liên hệ"}
              </button>
            </div>
          )}

          {/* Optional Contact Form in Consultant Mode */}
          {chatMode === "consultant" && showContactForm && (
            <div className="p-3 bg-[#051a1d] border-b border-emerald-700/40 space-y-2 animate-in fade-in">
              <div className="text-[11px] font-semibold text-emerald-200">
                Thông tin để chuyên viên gọi điện hoặc gửi phòng sớm nhất:
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Họ và tên..."
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg bg-[#082226] border border-emerald-700/40 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400"
                />
                <input
                  type="tel"
                  placeholder="Số điện thoại..."
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg bg-[#082226] border border-emerald-700/40 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowContactForm(false)}
                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[11px] font-semibold"
                >
                  Lưu thông tin
                </button>
              </div>
            </div>
          )}

          {/* Messages Area */}
          <div
            ref={scrollContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-[#082226] to-[#05181a]"
          >
            {(chatMode === "ai" ? messages : consultantMessages).map((m) => {
              const isUser = m.role === "user"
              const isAdmin = m.role === "admin"

              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
                >
                  {isAdmin && (
                    <div className="flex items-center gap-1.5 mb-1 px-1">
                      <span className="text-[10px] font-bold text-amber-300">
                        {m.senderName || "STAYEA CSKH"}
                      </span>
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                      isUser
                        ? "bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-br-sm shadow-md"
                        : isAdmin
                          ? "bg-gradient-to-br from-[#0e3b40] to-[#082b2f] border border-amber-400/40 text-slate-100 rounded-bl-sm shadow"
                          : "bg-[#0c2f33] border border-emerald-500/20 text-slate-100 rounded-bl-sm shadow"
                    }`}
                  >
                    <div className="whitespace-pre-line">{m.content}</div>

                    {/* Booking Preview Card inside Chat */}
                    {m.bookingCard && (
                      <div className="mt-3 pt-3 border-t border-emerald-500/30 bg-[#061d20]/80 rounded-xl p-3 border">
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded text-[10px] font-bold uppercase tracking-wider">
                            <Clock className="w-3 h-3" /> Chờ Admin Duyệt
                          </span>
                          <span className="text-[10px] font-mono text-emerald-300 font-semibold">
                            {m.bookingCard.orderCode}
                          </span>
                        </div>

                        <div className="text-sm font-bold text-white mb-1 flex items-center gap-1.5">
                          {m.bookingCard.serviceType === "transport" ? (
                            <Car className="w-4 h-4 text-emerald-400 shrink-0" />
                          ) : m.bookingCard.serviceType === "tour" ? (
                            <Ship className="w-4 h-4 text-emerald-400 shrink-0" />
                          ) : (
                            <Home className="w-4 h-4 text-emerald-400 shrink-0" />
                          )}
                          <span className="truncate">{m.bookingCard.serviceTitle}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300 my-2">
                          <div className="flex items-center gap-1 text-slate-300">
                            <User className="w-3 h-3 text-slate-400" />
                            <span className="truncate">{m.bookingCard.customerName}</span>
                          </div>
                          <div className="flex items-center gap-1 text-slate-300">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            <span>{m.bookingCard.startDate}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-emerald-900/60 text-xs">
                          <span className="text-slate-400">Tổng thanh toán dự kiến:</span>
                          <span className="font-bold text-emerald-300 text-sm">
                            {Number(m.bookingCard.totalAmount).toLocaleString("vi-VN")}đ
                          </span>
                        </div>

                        <div className="mt-2.5 p-2 bg-emerald-950/40 rounded border border-emerald-800/40 text-[10px] text-emerald-300 flex items-start gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                          <span>
                            Đơn đã được đẩy vào <strong>Admin Approval Queue</strong>. Admin STAYEA sẽ kiểm tra thông tin và điều phối đối tác đón tiếp Quý khách ngay!
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 px-1">
                    {m.timestamp}
                  </span>
                </div>
              )
            })}

            {isLoading && (
              <div className="flex items-center gap-2 text-emerald-300/80 text-xs bg-[#0c2f33] border border-emerald-500/20 px-3.5 py-2.5 rounded-2xl w-fit">
                <Sparkles className="w-3.5 h-3.5 animate-spin text-amber-300" />
                <span>
                  {chatMode === "ai"
                    ? "STAYEA AI đang tra cứu lịch dịch vụ và tạo thông tin..."
                    : "Đang gửi tin nhắn đến chuyên viên STAYEA..."}
                </span>
              </div>
            )}
          </div>

          {/* Footer Input */}
          <div className="p-3 bg-[#082226] border-t border-emerald-500/20">
            <form onSubmit={handleGeneralSubmit} className="flex items-center gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={
                  chatMode === "ai"
                    ? "Nhập yêu cầu (ví dụ: Tìm villa 3PN, Thuê xe 7 chỗ...)"
                    : "Nhắn tin trao đổi với chuyên viên tư vấn STAYEA..."
                }
                disabled={isLoading}
                className="flex-1 bg-[#051719] border border-emerald-700/40 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400 transition-colors disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isLoading}
                className="p-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 px-1">
              <span>Hotline 24/7: 0921 724 444</span>
              <span className="inline-flex items-center gap-1.5 text-emerald-400 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>{chatMode === "ai" ? "Trực tuyến 24/7" : "Chuyên viên sẵn sàng"}</span>
              </span>
            </div>
            <div className="mt-1.5 pt-1.5 border-t border-emerald-900/60 text-[9.5px] text-slate-400 leading-tight">
              <span>
                * Thông tin tư vấn & báo giá mang tính chất tham khảo sơ bộ. Đơn giữ chỗ sẽ được Admin thẩm định xác nhận chính thức với Đối tác theo{" "}
                <a href="/terms" target="_blank" className="text-emerald-400 underline hover:text-emerald-300">
                  Điều khoản & Quy chế sàn
                </a>.
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
