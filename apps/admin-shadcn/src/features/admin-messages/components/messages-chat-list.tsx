"use client"

import Image from "next/image"
import { Search, SlidersHorizontal } from "lucide-react"
import type {
  ConversationItem,
  ConversationTabType,
} from "@/features/admin-messages/stayea-admin-messages-mock-data"
import { CONVERSATION_TABS } from "@/features/admin-messages/stayea-admin-messages-mock-data"

interface MessagesChatListProps {
  conversations: readonly ConversationItem[]
  activeConversationId: string
  onSelectConversation: (id: string) => void
  activeTab: ConversationTabType
  onSelectTab: (tab: ConversationTabType) => void
  searchQuery: string
  onSearchChange: (query: string) => void
  onToggleFilter?: () => void
}

export function MessagesChatList({
  conversations,
  activeConversationId,
  onSelectConversation,
  activeTab,
  onSelectTab,
  searchQuery,
  onSearchChange,
  onToggleFilter,
}: MessagesChatListProps) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs flex flex-col h-[760px] overflow-hidden">
      {/* 1. Header Tabs */}
      <div className="p-3 border-b border-slate-100 space-y-2.5">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {CONVERSATION_TABS.map((tab) => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onSelectTab(tab.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1 shrink-0 ${
                  isActive
                    ? "bg-[#007a48] text-white shadow-2xs"
                    : "bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200/60"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[11px] ${
                    isActive ? "text-emerald-100" : "text-slate-400"
                  }`}
                >
                  ({tab.count})
                </span>
              </button>
            )
          })}
        </div>

        {/* Search & Filter Bar */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Tìm kiếm tin nhắn..."
              className="w-full bg-slate-50 hover:bg-white focus:bg-white text-xs text-slate-800 placeholder:text-slate-400 rounded-xl pl-9 pr-3 py-2 border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all shadow-2xs"
            />
          </div>
          <button
            type="button"
            onClick={onToggleFilter}
            aria-label="Lọc tin nhắn"
            className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors cursor-pointer shrink-0"
          >
            <SlidersHorizontal className="w-4 h-4 stroke-[2]" />
          </button>
        </div>
      </div>

      {/* 2. Conversations Scroll List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100/80">
        {conversations.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">
            Không tìm thấy hội thoại phù hợp
          </div>
        ) : (
          conversations.map((item) => {
            const isSelected = item.id === activeConversationId
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectConversation(item.id)}
                className={`relative w-full p-3 sm:p-3.5 flex items-start gap-3 text-left transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#e8f7ee]/70 text-slate-900"
                    : "hover:bg-slate-50/80 text-slate-700 bg-white"
                }`}
              >
                {/* Active left border indicator */}
                {isSelected && (
                  <span className="absolute left-0 top-0 bottom-0 w-1 bg-[#007a48] rounded-r-md" />
                )}

                {/* Avatar with optional online indicator */}
                <div className="relative shrink-0">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 shadow-2xs relative">
                    <Image
                      src={item.avatar}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                  </div>
                  {item.isOnline && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
                  )}
                </div>

                {/* Info & Last message */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs sm:text-[13px] font-bold truncate text-slate-900">
                      {item.name}
                    </span>
                    <span
                      className={`text-[11px] font-medium shrink-0 ${
                        isSelected || item.unreadCount
                          ? "text-[#007a48] font-semibold"
                          : "text-slate-400"
                      }`}
                    >
                      {item.lastTime}
                    </span>
                  </div>

                  <div className="mt-1 flex items-center justify-between gap-2">
                    <p className="text-xs text-slate-500 truncate leading-snug">
                      {item.lastMessage}
                    </p>
                    {Boolean(item.unreadCount) && (
                      <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                        {item.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            )
          })
        )}
      </div>
    </div>
  )
}
