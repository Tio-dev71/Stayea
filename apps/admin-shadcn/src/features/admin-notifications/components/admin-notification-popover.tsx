"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { toast } from "sonner"
import {
  Bell,
  Plus,
  Trash2,
  ExternalLink,
  Users,
  Building2,
  Globe,
} from "lucide-react"
import { stayeaApi } from "@/lib/stayea-api-service"
import { CreateNotificationModal } from "./create-notification-modal"

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

export function AdminNotificationPopover() {
  const [isOpen, setIsOpen] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const popoverRef = useRef<HTMLDivElement | null>(null)

  const fetchNotifications = useCallback(async () => {
    try {
      setIsLoading(true)
      const res = await stayeaApi.getMyNotifications("admin", "admin", 30)
      if (res && Array.isArray(res.items)) {
        setNotifications(res.items)
        setUnreadCount(res.unreadCount || 0)
      }
    } catch {
      // Graceful fallback
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchNotifications()
    const timer = setInterval(fetchNotifications, 60000) // Poll every 1 min
    return () => clearInterval(timer)
  }, [fetchNotifications])

  // Click outside to close
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
      await stayeaApi.markAllNotificationsRead("admin", "admin")
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
      setUnreadCount(0)
      toast.success("Đã đánh dấu tất cả thông báo là đã đọc")
    } catch {
      toast.error("Không thể đánh dấu đã đọc")
    }
  }

  const handleDeleteNotification = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await stayeaApi.deleteNotification(id)
      setNotifications((prev) => prev.filter((n) => n.id !== id))
      toast.success("Đã xóa thông báo thành công")
    } catch {
      toast.error("Không thể xóa thông báo")
    }
  }

  const getTargetBadge = (item: NotificationItem) => {
    switch (item.recipientType) {
      case "all_partners":
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-semibold">
            <Building2 className="w-2.5 h-2.5" /> Đối tác Hub
          </span>
        )
      case "all_users":
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-blue-100 text-blue-800 text-[10px] font-semibold">
            <Users className="w-2.5 h-2.5" /> Khách hàng
          </span>
        )
      case "all":
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-purple-100 text-purple-800 text-[10px] font-semibold">
            <Globe className="w-2.5 h-2.5" /> Toàn hệ thống
          </span>
        )
      case "partner":
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-semibold">
            <Building2 className="w-2.5 h-2.5" /> Cơ sở cụ thể
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-800 text-[10px] font-semibold">
            Cá nhân
          </span>
        )
    }
  }

  return (
    <>
      <div className="relative" ref={popoverRef}>
        {/* Bell Trigger */}
        <button
          type="button"
          aria-label="Thông báo hệ thống"
          onClick={() => {
            setIsOpen(!isOpen)
            if (!isOpen) fetchNotifications()
          }}
          className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 px-1 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none shadow-xs animate-pulse">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </button>

        {/* Dropdown Popover */}
        {isOpen && (
          <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-2xl bg-white shadow-2xl border border-slate-100 py-3 z-50 animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="px-4 pb-3 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-bold text-slate-900">
                  Thông Báo & Phát Sóng
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    unreadCount > 0
                      ? "bg-rose-100 text-rose-700"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {unreadCount > 0 ? `${unreadCount} mới` : "0 mới"}
                </span>
              </div>

              {/* Create Broadcast Button */}
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false)
                  setIsCreateModalOpen(true)
                }}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition-colors shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tạo Thông Báo</span>
              </button>
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
                  <p className="text-xs font-medium text-slate-600">Chưa có thông báo nào</p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Bấm &quot;Tạo Thông Báo&quot; để gửi tin tới Hub hoặc Khách hàng
                  </p>
                </div>
              ) : (
                notifications.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      if (item.actionUrl) {
                        window.location.href = item.actionUrl
                      }
                    }}
                    className={`p-3.5 hover:bg-slate-50/80 transition-colors cursor-pointer group ${
                      !item.isRead ? "bg-emerald-50/20" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {getTargetBadge(item)}
                        {item.priority === "urgent" && (
                          <span className="px-1.5 py-0.5 rounded-md bg-rose-100 text-rose-800 text-[9px] font-bold">
                            Khẩn cấp
                          </span>
                        )}
                        {item.priority === "high" && (
                          <span className="px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[9px] font-bold">
                            Ưu tiên cao
                          </span>
                        )}
                      </div>
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

                    <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                      {item.message}
                    </p>

                    <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-100/60">
                      <span>Người gửi: {item.senderName}</span>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {item.actionUrl && (
                          <span className="text-emerald-600 flex items-center gap-0.5 hover:underline">
                            Xem <ExternalLink className="w-2.5 h-2.5" />
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={(e) => handleDeleteNotification(item.id, e)}
                          className="text-slate-400 hover:text-rose-600 p-1"
                          title="Xóa thông báo"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="px-4 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <button
                  type="button"
                  onClick={handleMarkAllRead}
                  className="text-emerald-700 hover:text-emerald-800 font-medium hover:underline cursor-pointer"
                >
                  Đánh dấu tất cả đã đọc
                </button>
                <button
                  type="button"
                  onClick={() => fetchNotifications()}
                  className="text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  Làm mới
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal create notification */}
      <CreateNotificationModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={fetchNotifications}
      />
    </>
  )
}
