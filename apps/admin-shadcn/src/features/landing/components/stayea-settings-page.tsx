"use client"

import * as React from "react"
import { CheckCircle2, X } from "lucide-react"
import { ProfileSidebar } from "./profile-sidebar"
import { StayeaSettingsHeroBanner } from "./stayea-settings-hero-banner"
import { StayeaSettingsOverviewCards } from "./stayea-settings-overview-cards"
import { StayeaSettingsSecurityPanel } from "./stayea-settings-security-panel"
import { StayeaSettingsNotificationsPanel } from "./stayea-settings-notifications-panel"
import { StayeaSettingsPreferencesPanel } from "./stayea-settings-preferences-panel"
import { StayeaSettingsPrivacyPanel } from "./stayea-settings-privacy-panel"
import { StayeaSettingsSupportBanner } from "./stayea-settings-support-banner"
import { stayeaApi } from "@/lib/stayea-api-service"
import { STAYEA_SETTINGS_DATA } from "@/features/landing/data/stayea-mock-data"

export interface StayeaSettingsPageProps {
  readonly onNavigate?: (route: string) => void
}

export function StayeaSettingsPage({ onNavigate }: StayeaSettingsPageProps) {
  const [toastMessage, setToastMessage] = React.useState<string | null>(null)
  const [securityData, setSecurityData] = React.useState(STAYEA_SETTINGS_DATA.security)

  React.useEffect(() => {
    stayeaApi.getProfile().then((u) => {
      if (u) {
        setSecurityData((prev) => ({
          ...prev,
          email: u.email || "",
          phone: u.phone || "",
        }))
      }
    }).catch(() => {})
  }, [])

  function showToast(msg: string) {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage(null)
    }, 3500)
  }

  function handleSidebarSelect(tabId: string) {
    switch (tabId) {
      case "profile":
      case "trang-ca-nhan":
        onNavigate?.("profile")
        break
      case "bookings":
      case "don-dat-dich-vu":
        onNavigate?.("bookings")
        break
      case "plans":
      case "ke-hoach":
      case "ke-hoach-cua-toi":
        onNavigate?.("plans")
        break
      case "favorites":
      case "yeu-thich":
        onNavigate?.("favorites")
        break
      case "reviews":
      case "danh-gia":
      case "danh-gia-cua-toi":
        onNavigate?.("reviews")
        break
      case "account-info":
      case "thong-tin-ca-nhan":
        onNavigate?.("account-info")
        break
      case "payment":
      case "phuong-thuc-thanh-toan":
        onNavigate?.("payment")
        break
      case "deals":
      case "uu-dai-cua-toi":
      case "my-deals":
        onNavigate?.("my-deals")
        break
      case "staya-club":
      case "stayea-club":
        onNavigate?.("stayea-club")
        break
      case "settings":
      case "cai-dat":
        // Already on this page
        break
      case "support":
      case "ho-tro":
        showToast("Đang kết nối trung tâm trợ giúp khách hàng 24/7...")
        break
      case "logout":
      case "dang-xuat":
        onNavigate?.("logout")
        break
      default:
        onNavigate?.(tabId)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50/60 pb-20">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-[#0A2239] text-white px-4 py-3 rounded-2xl shadow-xl text-xs sm:text-sm animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="p-1 hover:bg-white/10 rounded-lg text-slate-300 ml-2 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 1. Panorama Hero Banner */}
      <StayeaSettingsHeroBanner />

      {/* 2. Main Page Grid */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Profile Sidebar (Col 3) */}
          <div className="lg:col-span-3">
            <ProfileSidebar
              activeTab="settings"
              onSelectTab={handleSidebarSelect}
              hideBadges
            />
          </div>

          {/* Right Column: Settings Content (Col 9) */}
          <div className="lg:col-span-9 space-y-6">
            {/* 2a. 4 Status Overview Cards */}
            <StayeaSettingsOverviewCards
              onCardClick={(sec) => {
                showToast(`Đã chuyển đến phần thiết lập: ${sec}`)
              }}
            />

            {/* 2b. 2x2 Grid of Settings Panels */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              {/* Top-Left: Security */}
              <StayeaSettingsSecurityPanel
                security={securityData}
                onEditEmail={() => showToast("Mở hộp thoại chỉnh sửa email đăng nhập")}
                onUpdatePhone={() => showToast("Mở hộp thoại cập nhật số điện thoại")}
                onChangePassword={() => showToast("Mở hộp thoại đổi mật khẩu tài khoản")}
                onToggle2FA={() => showToast("Mở quy trình cài đặt xác thực 2 bước (2FA)")}
                onManageDevices={() => showToast("Xem danh sách thiết bị đang đăng nhập")}
              />

              {/* Top-Right: Notifications */}
              <StayeaSettingsNotificationsPanel
                notifications={STAYEA_SETTINGS_DATA.notifications}
                onToggle={(key, val) =>
                  showToast(`Đã ${val ? "bật" : "tắt"} thông báo: ${key}`)
                }
              />

              {/* Bottom-Left: Display Preferences */}
              <StayeaSettingsPreferencesPanel
                preferences={STAYEA_SETTINGS_DATA.preferences}
                onLanguageChange={(lang) => showToast(`Đã đổi ngôn ngữ sang: ${lang}`)}
                onCurrencyChange={(curr) => showToast(`Đã đổi đơn vị tiền tệ sang: ${curr}`)}
                onTimezoneChange={(tz) => showToast(`Đã cập nhật múi giờ: ${tz}`)}
                onThemeChange={(theme) => showToast(`Đã áp dụng chế độ giao diện: ${theme}`)}
              />

              {/* Bottom-Right: Privacy & Data */}
              <StayeaSettingsPrivacyPanel
                onProfilePrivacy={() => showToast("Cài đặt quyền hiển thị thông tin hồ sơ")}
                onManageCookies={() => showToast("Tùy chỉnh cookie theo dõi")}
                onDownloadData={() => showToast("Đang chuẩn bị gói dữ liệu cá nhân của bạn để tải xuống...")}
                onDeleteAccount={() => showToast("Mở bảng tùy chọn tạm dừng hoặc vô hiệu hóa tài khoản")}
              />
            </div>

            {/* 2c. Bottom Support Banner */}
            <StayeaSettingsSupportBanner
              onContactSupport={() => showToast("Đang kết nối trung tâm hỗ trợ 24/7...")}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
