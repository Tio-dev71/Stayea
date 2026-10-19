"use client"

import * as React from "react"
import { Bell, Mail, Plane, Calendar, Gift, Headphones } from "lucide-react"
import type { SettingsNotificationToggles } from "@/features/landing/data/stayea-mock-data"

export interface StayeaSettingsNotificationsPanelProps {
  readonly notifications: SettingsNotificationToggles
  readonly onToggle?: (key: keyof SettingsNotificationToggles, newValue: boolean) => void
}

export const StayeaSettingsNotificationsPanel: React.FC<
  StayeaSettingsNotificationsPanelProps
> = ({ notifications, onToggle }) => {
  const [toggles, setToggles] = React.useState<SettingsNotificationToggles>(notifications)

  function handleToggle(key: keyof SettingsNotificationToggles) {
    const updated = !toggles[key]
    setToggles((prev) => ({ ...prev, [key]: updated }))
    onToggle?.(key, updated)
  }

  const notificationItems = [
    {
      key: "promoEmails" as const,
      icon: Mail,
      label: "Email khuyến mãi",
      description: "Nhận ưu đãi đặc biệt, mã giảm giá và chương trình mới",
    },
    {
      key: "tripUpdates" as const,
      icon: Plane,
      label: "Cập nhật chuyến đi",
      description: "Thông tin đặt dịch vụ, thay đổi lịch trình, nhắc nhở quan trọng",
    },
    {
      key: "itineraryReminders" as const,
      icon: Calendar,
      label: "Nhắc lịch trình",
      description: "Nhận nhắc nhở trước chuyến đi và các mốc quan trọng",
    },
    {
      key: "clubOffers" as const,
      icon: Gift,
      label: "Ưu đãi Stayea Club",
      description: "Thông báo ưu đãi dành riêng cho thành viên Gold",
    },
    {
      key: "supportMessages" as const,
      icon: Headphones,
      label: "Tin nhắn hỗ trợ",
      description: "Nhận phản hồi và cập nhật từ đội ngũ hỗ trợ",
    },
  ]

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 space-y-4">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <Bell className="w-5 h-5 text-[#1E40AF]" />
          <h2 className="text-base sm:text-lg font-black text-[#0A2239]">
            Thông báo
          </h2>
        </div>
        <p className="text-[11px] text-slate-400 mt-0.5 ml-7">
          Tùy chọn nhận thông báo từ STAYEA
        </p>
      </div>

      {/* Rows */}
      <div className="space-y-4 divide-y divide-slate-100 pt-1">
        {notificationItems.map((item) => {
          const Icon = item.icon
          const isChecked = toggles[item.key]

          return (
            <div
              key={item.key}
              className="pt-4 first:pt-0 flex items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3 min-w-0">
                <Icon className="w-4 h-4 text-slate-500 mt-1 shrink-0" />
                <div className="min-w-0">
                  <span className="block text-xs font-bold text-slate-900 leading-tight">
                    {item.label}
                  </span>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Toggle Switch */}
              <button
                type="button"
                role="switch"
                aria-checked={isChecked}
                onClick={() => handleToggle(item.key)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:ring-offset-2 ${
                  isChecked ? "bg-[#1E40AF]" : "bg-slate-300"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    isChecked ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
