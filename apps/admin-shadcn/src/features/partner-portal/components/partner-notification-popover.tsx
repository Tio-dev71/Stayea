"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { toast } from "sonner"
import {
  Bell,
  Info,
  Gift,
  CreditCard,
  Package,
  ShieldAlert,
} from "lucide-react"
import { stayeaApi } from "@/lib/stayea-api-service"

interface NotificationItem {
  id: string
  recipientType: "all" | "all_partners" | "all_users" | "partner" | "user"
  recipientId?: string
  senderName: string
  title: string
  message: string
  type: "system" | "order" | "payout" | "promotion" | "announcement"
  priority: "normal" | "high" | "urgent"
  actionUrl?: string
  createdAt: string
  isRead?: boolean
}

function timeAgo(dateStr: string): string {
  try {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return "Vừa xong"
    if (mins < 60) return `${mins} phút trước`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours} giờ trước`
    const days = Math.floor(hours / 24)
    return `${days} ngày trước`
  } catch {
    return "Mới đây"
  }
}

interface PartnerNotificationPopoverProps {
  partnerId?: string
  onSelectTab?: (tab: any) => void
}

export function PartnerNotificationPopover({
  partnerId,
  onSelectTab,
}: PartnerNotificationPopoverProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const popoverRef = useRef<HTMLDivElement | null>(null)

  const readerId = partnerId || "partner"

  const fetchNotifications = useCallback(async () => {
    try {
      setIsLoading(true)
      const res = await stayeaApi.getMyNotifications(readerId, "partner", 30)
      if (res && Array.isArray(res.items)) {
        setNotifications(res.items)
        setUnreadCount(res.unreadCount || 0)
      }
    } catch {
      // Graceful fallback
    } finally {
      setIsLoading(false)
    }
  }, [readerId])

  useEffect(() => {
    fetchNotifications()
    const timer = setInterval(fetchNotifications, 45000) // Poll every 45s
    return () => clearInterval(timer)
  }, [fetchNotifications])

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isOpen])

  const handleMarkAllRead = async () => {
    try {
      await stayeaApi.markAllNotificationsRead(readerId, "partner")
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
      setUnreadCount(0)
      toast.success("Đã đánh dấu tất cả thông báo là đã đọc")
    } catch {
      toast.error("Không thể đánh dấu đã đọc")
    }
  }

  const handleItemClick = async (item: NotificationItem) => {
    if (!item.isRead) {
      try {
        await stayeaApi.markNotificationRead(item.id, readerId, "partner")
        setNotifications((prev) =>
          prev.map((n) => (n.id === item.id ? { ...n, isRead: true } : n))
        )
        setUnreadCount((prev) => Math.max(0, prev - 1))
      } catch {}
    }

    setIsOpen(false)

    if (item.actionUrl) {
      if (item.actionUrl.includes("tab=orders") && onSelectTab) {
        onSelectTab("orders")
      } else if (item.actionUrl.includes("tab=payouts") && onSelectTab) {
        onSelectTab("payouts")
      } else if (item.actionUrl.includes("tab=services") && onSelectTab) {
        onSelectTab("services")
      } else {
        window.location.href = item.actionUrl
      }
    } else if (item.type === "order" && onSelectTab) {
      onSelectTab("orders")
    } else if (item.type === "payout" && onSelectTab) {
      onSelectTab("payouts")
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "order":
        return <Package className="w-4 h-4 text-emerald-400" />
      case "payout":
        return <CreditCard className="w-4 h-4 text-amber-400" />
      case "promotion":
        return <Gift className="w-4 h-4 text-purple-400" />
      case "announcement":
        return <ShieldAlert className="w-4 h-4 text-rose-400" />
      default:
        return <Info className="w-4 h-4 text-teal-400" />
    }
  }

  return (
    <div className="relative" ref={popoverRef}>
      {/* Bell Button */}
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen)
          if (!isOpen) fetchNotifications()
        }}
        className="relative p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
        title="Thông báo đối tác"
      >
        <Bell className="w-4 h-4 text-emerald-700" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex min-w-[16px] h-4 px-1 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow animate-pulse">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-2xl bg-white border border-slate-200 shadow-xl py-3 z-50 text-slate-800 animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="px-4 pb-2.5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-bold text-slate-900">
                Thông Báo Hub Đối Tác
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  unreadCount > 0
                    ? "bg-rose-50 text-rose-600 border border-rose-200"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {unreadCount > 0 ? `${unreadCount} mới` : "0 mới"}
              </span>
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 hover:underline cursor-pointer"
              >
                Đọc tất cả
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
            {isLoading && notifications.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">
                Đang tải thông báo...
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center">
                <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-2">
                  <Bell className="w-5 h-5" />
                </div>
                <p className="text-xs font-semibold text-slate-700">Không có thông báo mới</p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Thông báo từ STAYEA và đơn hàng mới sẽ xuất hiện tại đây
                </p>
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className={`p-3.5 hover:bg-slate-50 transition-colors cursor-pointer group ${
                    !item.isRead ? "bg-emerald-50/50 border-l-2 border-emerald-600" : ""
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 mt-0.5">
                      {getTypeIcon(item.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className="text-[10px] font-semibold text-emerald-800">
                          {item.senderName}
                        </span>
                        <span className="text-[10px] text-slate-400 shrink-0">
                          {timeAgo(item.createdAt)}
                        </span>
                      </div>

                      <h4
                        className={`text-xs ${
                          !item.isRead ? "font-bold text-slate-900" : "font-medium text-slate-700"
                        }`}
                      >
                        {item.title}
                      </h4>

                      <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-relaxed">
                        {item.message}
                      </p>

                      {item.priority === "urgent" && (
                        <div className="mt-1.5 inline-block px-1.5 py-0.5 rounded bg-rose-50 border border-rose-200 text-[9px] font-bold text-rose-700">
                          Khẩn cấp từ Ban Quản Trị
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>Đồng bộ thời gian thực</span>
              <button
                type="button"
                onClick={() => fetchNotifications()}
                className="font-medium text-emerald-700 hover:underline cursor-pointer"
              >
                Làm mới
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
