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
  User,
  CalendarX2,
  FileQuestion,
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
  conversation?: ConversationItem | null
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
  if (!conversation) {
    return (
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs flex flex-col items-center justify-center h-[760px] p-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mb-3 border border-slate-200/80">
          <User className="w-7 h-7 stroke-[1.8]" />
        </div>
        <h3 className="text-sm sm:text-base font-bold text-slate-800">
          Chưa chọn người liên hệ
        </h3>
        <p className="text-xs text-slate-400 mt-1 max-w-[200px] leading-relaxed">
          Thông tin chi tiết, liên hệ, lịch sử đặt chỗ và ghi chú sẽ hiển thị tại đây khi bạn chọn cuộc hội thoại.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs flex flex-col h-[760px] overflow-hidden">
      {/* Scrollable Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* 1. Profile Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden border border-slate-200 relative shrink-0 shadow-2xs">
              <Image
                src={conversation.avatar || "/profile/profile-avatar.jpg"}
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
              {conversation.roleBadge && (
                <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#e8f7ee] text-[#007a48] mt-1">
                  {conversation.roleBadge}
                </span>
              )}
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
            {conversation.phone && (
              <div className="flex items-center gap-2.5">
                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="font-medium text-slate-800">{conversation.phone}</span>
              </div>
            )}
            {conversation.email && (
              <div className="flex items-center gap-2.5">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{conversation.email}</span>
              </div>
            )}
            {conversation.location && (
              <div className="flex items-center gap-2.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{conversation.location}</span>
              </div>
            )}
            {conversation.joinDate && (
              <div className="flex items-center gap-2.5">
                <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>Khách hàng từ {conversation.joinDate}</span>
              </div>
            )}
          </div>
        </div>

        {/* 3. Booking History */}
        <div className="space-y-2.5 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Lịch sử đặt chỗ ({bookingHistory.length})
            </h4>
            {bookingHistory.length > 0 && (
              <button
                type="button"
                onClick={onViewAllBookings}
                className="text-[11px] font-semibold text-[#007a48] hover:underline cursor-pointer"
              >
                Xem tất cả →
              </button>
            )}
          </div>

          <div className="space-y-2">
            {bookingHistory.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-center">
                <CalendarX2 className="w-5 h-5 text-slate-300 mx-auto mb-1.5" />
                <p className="text-xs text-slate-500 font-medium">Chưa có lịch sử đặt chỗ</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Khách hàng chưa phát sinh đơn đặt phòng nào.</p>
              </div>
            ) : (
              bookingHistory.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 border border-slate-100 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg overflow-hidden relative shrink-0">
                    <Image
                      src={item.imageUrl}
                      alt={item.tourTitle}
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="text-xs font-bold text-slate-900 truncate">
                      {item.tourTitle}
                    </h5>
                    <span className="text-[11px] text-slate-400 block">{item.date}</span>
                  </div>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-md shrink-0 ${getBookingStatusBadge(
                      item.status
                    )}`}
                  >
                    {item.statusLabel}
                  </span>
                </div>
              ))
            )}
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
              className="text-[11px] font-semibold text-[#007a48] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3 h-3 stroke-[2.5]" />
              <span>Thêm ghi chú</span>
            </button>
          </div>

          <div className="space-y-2">
            {notes.length === 0 ? (
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-center">
                <FileQuestion className="w-5 h-5 text-slate-300 mx-auto mb-1" />
                <p className="text-xs text-slate-500 font-medium">Chưa có ghi chú nào</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Thêm ghi chú để lưu ý về sở thích của khách.</p>
              </div>
            ) : (
              notes.map((note) => (
                <div
                  key={note.id}
                  className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/60 text-xs text-amber-950 space-y-1"
                >
                  <p className="leading-snug">{note.content}</p>
                  <div className="text-[10px] text-amber-800/80 font-medium">
                    — {note.author} • {note.date}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 5. Quick Actions */}
        <div className="space-y-2.5 pt-2 border-t border-slate-100">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Thao tác nhanh
          </h4>
          <div className="space-y-1.5">
            {quickActions.map((action) => (
              <button
                key={action.id}
                type="button"
                onClick={() => onQuickAction?.(action.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                  action.isDestructive
                    ? "border-rose-200 text-rose-600 hover:bg-rose-50/70"
                    : "border-slate-200/80 text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center gap-2">
                  {getQuickActionIcon(action.icon)}
                  <span>{action.label}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
