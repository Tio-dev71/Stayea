"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import {
  Phone,
  Video,
  MoreHorizontal,
  Paperclip,
  Image as ImageIcon,
  Smile,
  Send,
  CheckCheck,
  Check,
  MapPin,
} from "lucide-react"
import type {
  ChatMessage,
  ConversationItem,
} from "@/features/admin-messages/stayea-admin-messages-mock-data"

interface MessagesChatConversationProps {
  conversation: ConversationItem
  messages: readonly ChatMessage[]
  onSendMessage: (text: string) => void
  onCallPhone?: () => void
  onVideoCall?: () => void
  onMoreOptions?: () => void
  onViewProductDetails?: (productId: string) => void
  onAttachFile?: () => void
  onAttachImage?: () => void
  onOpenEmoji?: () => void
}

export function MessagesChatConversation({
  conversation,
  messages,
  onSendMessage,
  onCallPhone,
  onVideoCall,
  onMoreOptions,
  onViewProductDetails,
  onAttachFile,
  onAttachImage,
  onOpenEmoji,
}: MessagesChatConversationProps) {
  const [inputText, setInputText] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = () => {
    if (!inputText.trim()) return
    onSendMessage(inputText.trim())
    setInputText("")
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs flex flex-col h-[760px] overflow-hidden">
      {/* 1. Chat Header */}
      <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between gap-3 bg-white">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 relative shrink-0">
            <Image
              src={conversation.avatar}
              alt={conversation.name}
              fill
              className="object-cover"
              sizes="40px"
            />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900 truncate">
                {conversation.name}
              </h2>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#e8f7ee] text-[#007a48]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#007a48]" />
                <span>{conversation.roleBadge}</span>
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
              <MapPin className="w-3 h-3 text-slate-400" />
              <span className="truncate">{conversation.location}</span>
            </div>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={onCallPhone}
            aria-label="Gọi thoại"
            className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <Phone className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onVideoCall}
            aria-label="Gọi video"
            className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <Video className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onMoreOptions}
            aria-label="Tùy chọn khác"
            className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Messages Scroll Body */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-[#f8fafc]/50">
        {messages.map((msg) => {
          const isCustomer = msg.senderId === "customer"

          if (isCustomer) {
            return (
              <div key={msg.id} className="flex items-start gap-3 max-w-[85%] sm:max-w-[75%]">
                <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-200 relative shrink-0 mt-0.5">
                  <Image
                    src={msg.senderAvatar}
                    alt={msg.senderName}
                    fill
                    className="object-cover"
                    sizes="32px"
                  />
                </div>
                <div>
                  <div className="bg-white border border-slate-200/90 rounded-2xl rounded-tl-xs px-4 py-3 text-xs sm:text-sm text-slate-800 shadow-2xs leading-relaxed whitespace-pre-line">
                    {msg.content}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 ml-1 block">
                    {msg.time}
                  </span>
                </div>
              </div>
            )
          }

          // Admin message (Right aligned)
          return (
            <div key={msg.id} className="flex flex-col items-end max-w-[85%] sm:max-w-[75%] ml-auto">
              {msg.content && (
                <div className="bg-[#e8f7ee] text-slate-900 border border-emerald-200/50 rounded-2xl rounded-tr-xs px-4 py-3 text-xs sm:text-sm shadow-2xs leading-relaxed whitespace-pre-line">
                  {msg.content}
                </div>
              )}

              {/* Shared Tour Rich Card */}
              {msg.productCard && (
                <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-xs w-full max-w-sm mt-1.5 overflow-hidden">
                  <div className="flex gap-3">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden relative shrink-0 border border-slate-100">
                      <Image
                        src={msg.productCard.imageUrl}
                        alt={msg.productCard.title}
                        fill
                        className="object-cover"
                        sizes="112px"
                      />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                          {msg.productCard.title}
                        </h4>
                        <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#e0f2fe] text-[#0284c7] mt-1">
                          {msg.productCard.category}
                        </span>
                        <ul className="mt-2 space-y-1">
                          {msg.productCard.highlights.map((point) => (
                            <li
                              key={point}
                              className="text-[11px] text-slate-600 flex items-start gap-1 leading-tight"
                            >
                              <span className="text-[#007a48] font-bold">✓</span>
                              <span className="truncate">{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-slate-900">
                          {msg.productCard.priceFormatted}
                        </span>
                        <button
                          type="button"
                          onClick={() => onViewProductDetails?.(msg.productCard?.id || "")}
                          className="text-[11px] font-semibold text-[#007a48] hover:underline cursor-pointer"
                        >
                          {msg.productCard.linkText}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Message metadata / time / seen tick */}
              <div className="flex items-center gap-1 mt-1 mr-1 text-[10px] text-slate-400">
                <span>{msg.time}</span>
                {msg.status === "seen" ? (
                  <CheckCheck className="w-3.5 h-3.5 text-[#007a48]" />
                ) : (
                  <Check className="w-3.5 h-3.5 text-slate-400" />
                )}
              </div>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* 3. Bottom Chat Input Bar */}
      <div className="p-3 border-t border-slate-100 bg-white">
        <div className="flex items-center gap-2">
          {/* Attachment buttons */}
          <div className="flex items-center gap-1 shrink-0 text-slate-400">
            <button
              type="button"
              onClick={onAttachFile}
              aria-label="Đính kèm tệp"
              className="p-2 rounded-xl hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <Paperclip className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onAttachImage}
              aria-label="Gửi hình ảnh"
              className="p-2 rounded-xl hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <ImageIcon className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onOpenEmoji}
              aria-label="Chọn biểu tượng cảm xúc"
              className="p-2 rounded-xl hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <Smile className="w-4 h-4" />
            </button>
          </div>

          {/* Text Input */}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Nhập tin nhắn..."
            className="flex-1 bg-slate-50 hover:bg-white focus:bg-white text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 rounded-xl px-3.5 py-2.5 border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all shadow-2xs"
          />

          {/* Send Button */}
          <button
            type="button"
            onClick={handleSend}
            disabled={!inputText.trim()}
            aria-label="Gửi tin nhắn"
            className={`p-2.5 rounded-xl transition-all flex items-center justify-center shrink-0 cursor-pointer ${
              inputText.trim()
                ? "bg-[#007a48] hover:bg-emerald-700 text-white shadow-xs"
                : "bg-slate-100 text-slate-400 cursor-not-allowed"
            }`}
          >
            <Send className="w-4 h-4 stroke-[2]" />
          </button>
        </div>
      </div>
    </div>
  )
}
