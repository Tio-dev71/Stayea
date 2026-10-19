"use client"

import Image from "next/image"
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ChevronRight,
  MoreVertical,
  Plus,
  CalendarCheck,
  Tag,
  Users,
  Ban,
} from "lucide-react"
import type {
  ConversationItem,
  CustomerBookingHistoryItem,
  CustomerNoteItem,
  MessageQuickActionItem,
} from "@/features/admin-messages/stayea-admin-messages-mock-data"
import {
  MOCK_BOOKING_HISTORY,
  MOCK_CUSTOMER_NOTES,
  MOCK_MESSAGE_QUICK_ACTIONS,
} from "@/features/admin-messages/stayea-admin-messages-mock-data"

interface MessagesCustomerProfileProps {
  conversation: ConversationItem
  bookingHistory?: readonly CustomerBookingHistoryItem[]
  notes?: readonly CustomerNoteItem[]
  quickActions?: readonly MessageQuickActionItem[]
  onViewAllBookings?: () => void
  onAddNote?: () => void
  onQuickAction?: (actionId: string) => void
  onMoreProfileOptions?: () => void
}

function getQuickActionIcon(icon: MessageQuickActionItem["icon"]) {
  const iconClass = "w-4 h-4 stroke-[2]"
  switch (icon) {
    case "create_booking":
      return <CalendarCheck className={iconClass} />
    case "send_offer":
      return <Tag className={iconClass} />
    case "send_email":
      return <Mail className={iconClass} />
    case "add_group":
      return <Users className={iconClass} />
    case "block_user":
      return <Ban className={iconClass} />
    default:
      return <CalendarCheck className={iconClass} />
  }
}

function getBookingStatusBadge(status: CustomerBookingHistoryItem["status"]) {
  switch (status) {
    case "pending_payment":
      return "bg-[#fef3c7] text-[#d97706]"
    case "completed":
      return "bg-[#dcfce7] text-[#15803d]"
    case "cancelled":
      return "bg-[#fee2e2] text-[#dc2626]"
    default:
      return "bg-slate-100 text-slate-600"
  }
}

export function MessagesCustomerProfile({
  conversation,
  bookingHistory = MOCK_BOOKING_HISTORY,
  notes = MOCK_CUSTOMER_NOTES,
  quickActions = MOCK_MESSAGE_QUICK_ACTIONS,
  onViewAllBookings,
  onAddNote,
  onQuickAction,
  onMoreProfileOptions,
}: MessagesCustomerProfileProps) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs flex flex-col h-[760px] overflow-hidden">
      {/* Scrollable Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* 1. Profile Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden border border-slate-200 relative shrink-0 shadow-2xs">
              <Image
                src={conversation.avatar}
                alt={conversation.name}
                fill
                className="object-cover"
                sizes="48px"
              />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 leading-tight">
                {conversation.name}
              </h3>
              <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#e8f7ee] text-[#007a48] mt-1">
                {conversation.roleBadge}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onMoreProfileOptions}
            aria-label="Tùy chọn hồ sơ"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>

        {/* 2. Customer Contact Info */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Thông tin khách hàng
          </h4>
          <div className="space-y-2 text-xs text-slate-600">
            <div className="flex items-center gap-2.5">
              <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="font-medium text-slate-800">{conversation.phone}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{conversation.email}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{conversation.location}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>Khách hàng từ {conversation.joinDate}</span>
            </div>
          </div>
        </div>

        {/* 3. Booking History */}
        <div className="space-y-2.5 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Lịch sử đặt chỗ ({bookingHistory.length})
            </h4>
            <button
              type="button"
              onClick={onViewAllBookings}
              className="text-[11px] font-medium text-emerald-700 hover:underline cursor-pointer"
            >
              Xem tất cả →
            </button>
          </div>

          <div className="space-y-2">
            {bookingHistory.map((book) => (
              <div
                key={book.id}
                className="flex items-center justify-between p-2 rounded-xl bg-slate-50/70 hover:bg-slate-50 border border-slate-100 transition-colors gap-2"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-lg overflow-hidden relative shrink-0 border border-slate-200">
                    <Image
                      src={book.imageUrl}
                      alt={book.tourTitle}
                      fill
                      className="object-cover"
                      sizes="36px"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-slate-800 truncate">
                      {book.tourTitle}
                    </div>
                    <div className="text-[10px] text-slate-400">{book.date}</div>
                  </div>
                </div>

                <span
                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold shrink-0 ${getBookingStatusBadge(
                    book.status
                  )}`}
                >
                  {book.statusLabel}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Notes Section */}
        <div className="space-y-2.5 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Ghi chú
            </h4>
            <button
              type="button"
              onClick={onAddNote}
              className="inline-flex items-center gap-0.5 text-[11px] font-medium text-emerald-700 hover:underline cursor-pointer"
            >
              <Plus className="w-3 h-3" />
              <span>Thêm ghi chú →</span>
            </button>
          </div>

          {notes.map((note) => (
            <div
              key={note.id}
              className="p-3 rounded-xl bg-[#fffbeb] border border-[#fef08a] text-xs space-y-1.5"
            >
              <p className="text-amber-950 leading-relaxed font-normal">
                {note.content}
              </p>
              <div className="text-[10px] text-amber-700/80 font-medium">
                — {note.author} • {note.date}
              </div>
            </div>
          ))}
        </div>

        {/* 5. Quick Actions */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Thao tác nhanh
          </h4>
          <div className="space-y-1">
            {quickActions.map((action) => {
              const isDestructive = action.isDestructive
              return (
                <button
                  key={action.id}
                  type="button"
                  onClick={() => onQuickAction?.(action.id)}
                  className={`w-full flex items-center justify-between p-2 rounded-xl text-xs font-medium transition-colors cursor-pointer text-left ${
                    isDestructive
                      ? "text-rose-600 hover:bg-rose-50"
                      : "text-slate-700 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`p-1.5 rounded-lg ${
                        isDestructive
                          ? "bg-rose-50 text-rose-600"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {getQuickActionIcon(action.icon)}
                    </span>
                    <span>{action.label}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
