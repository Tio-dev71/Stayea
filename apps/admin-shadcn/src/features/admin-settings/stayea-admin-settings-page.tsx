"use client"

import { useState } from "react"
import { toast } from "sonner"
import {
  Save,
  Building,
  CreditCard,
  Bell,
  Shield,
  FileCheck2,
  CheckCircle2,
  RefreshCw,
  Lock,
  Server,
  HelpCircle,
} from "lucide-react"
import { StayeaAdminHeader } from "@/features/admin-dashboard/components/stayea-admin-header"
import { StayeaAdminSidebar } from "@/features/admin-dashboard/components/stayea-admin-sidebar"
import { StayeaAdminFooter } from "@/features/admin-dashboard/components/stayea-admin-footer"

interface StayeaAdminSettingsPageProps {
  readonly onNavigateLanding?: () => void
  readonly onNavigateTab?: (tabId: string) => void
}

type SettingsTab = "general" | "policies" | "payments" | "notifications" | "security"

export function StayeaAdminSettingsPage({
  onNavigateLanding,
  onNavigateTab,
}: StayeaAdminSettingsPageProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<SettingsTab>("general")
  const [isSaving, setIsSaving] = useState(false)

  // General Settings State
  const [platformName, setPlatformName] = useState("Stayea Phú Quốc")
  const [companyName, setCompanyName] = useState("Công ty Cổ phần Công nghệ Du lịch Stayea")
  const [taxId, setTaxId] = useState("0109887766")
  const [hotline, setHotline] = useState("1900 6868")
  const [supportEmail, setSupportEmail] = useState("support@stayea.com")
  const [address, setAddress] = useState("Đường Trần Hưng Đạo, Phường Dương Đông, TP. Phú Quốc, Kiên Giang")
  const [currency, setCurrency] = useState("VND")
  const [timezone, setTimezone] = useState("Asia/Ho_Chi_Minh")

  // Policies Settings State
  const [commissionRate, setCommissionRate] = useState("12")
  const [guestServiceFee, setGuestServiceFee] = useState("3")
  const [standardCheckIn, setStandardCheckIn] = useState("14:00")
  const [standardCheckOut, setStandardCheckOut] = useState("12:00")
  const [holdBookingMinutes, setHoldBookingMinutes] = useState("15")
  const [cancellationPolicy, setCancellationPolicy] = useState("flexible")

  // Payment Gateways State
  const [vnpayEnabled, setVnpayEnabled] = useState(true)
  const [momoEnabled, setMomoEnabled] = useState(true)
  const [vietqrEnabled, setVietqrEnabled] = useState(true)
  const [stripeEnabled, setStripeEnabled] = useState(true)
  const [isSandboxMode, setIsSandboxMode] = useState(false)

  // Notifications State
  const [emailBookingConfirm, setEmailBookingConfirm] = useState(true)
  const [smsOtpEnabled, setSmsOtpEnabled] = useState(true)
  const [zaloNotificationEnabled, setZaloNotificationEnabled] = useState(true)
  const [hostPushNotification, setHostPushNotification] = useState(true)
  const [marketingEmailEnabled, setMarketingEmailEnabled] = useState(false)

  // Security State
  const [require2FA, setRequire2FA] = useState(true)
  const [sessionTimeoutMinutes, setSessionTimeoutMinutes] = useState("60")
  const [ipWhitelistEnabled, setIpWhitelistEnabled] = useState(false)

  const handleSaveSettings = () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      toast.success("Cập nhật cài đặt thành công!", {
        description: "Các thông số hệ thống Stayea Admin đã được đồng bộ và áp dụng ngay lập tức.",
      })
    }, 600)
  }

  return (
    <div className="min-h-screen bg-[#f8faf9] flex flex-col font-sans text-slate-800 antialiased selection:bg-emerald-100 selection:text-emerald-900">
      {/* 1. Header (Sticky Top) */}
      <StayeaAdminHeader
        onNavigateLanding={onNavigateLanding}
        onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        onSearch={(query) => {
          if (query.trim()) {
            console.log("Tìm kiếm cài đặt:", query)
          }
        }}
      />

      {/* 2. Main Body with Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden min-w-0">
        {/* Left Sidebar */}
        <div className={`${sidebarOpen ? "block" : "hidden"} lg:block shrink-0`}>
          <StayeaAdminSidebar
            activeTab="cai-dat"
            promoTitle="Phú Quốc"
            promoSubtitle="Cài đặt hệ thống quản trị"
            promoButtonText="Xem tài liệu"
            onSelectTab={(tabId) => {
              if (onNavigateTab) {
                onNavigateTab(tabId)
              }
            }}
            onExplorePhuQuoc={() => {
              toast.info("Tài liệu hướng dẫn quản trị", {
                description: "Mở cẩm nang hướng dẫn cấu hình nền tảng Stayea.",
              })
            }}
          />
        </div>

        {/* Scrollable Content Container */}
        <main className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden">
          <div className="max-w-[1400px] mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
            {/* Top Action & Greeting Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  Cài đặt hệ thống
                </h1>
                <p className="text-xs sm:text-[13px] text-slate-500 font-medium mt-1">
                  Cấu hình nền tảng, chính sách phòng, cổng thanh toán, thông báo và bảo mật cho Stayea Phú Quốc.
                </p>
              </div>

              {/* Save Button */}
              <button
                type="button"
                onClick={handleSaveSettings}
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1b7a4e] hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs sm:text-sm font-semibold shadow-xs transition-all cursor-pointer disabled:opacity-60 self-start sm:self-auto"
              >
                {isSaving ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>Lưu thay đổi</span>
              </button>
            </div>

            {/* Tab Navigation Navigation Pills */}
            <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-x-auto select-none">
              <button
                type="button"
                onClick={() => setActiveTab("general")}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-[13px] font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === "general"
                    ? "bg-[#eef8f3] text-[#1b7a4e] shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <Building className="w-4 h-4 shrink-0" />
                <span>Cấu hình chung</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("policies")}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-[13px] font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === "policies"
                    ? "bg-[#eef8f3] text-[#1b7a4e] shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <FileCheck2 className="w-4 h-4 shrink-0" />
                <span>Chính sách & Phí</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("payments")}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-[13px] font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === "payments"
                    ? "bg-[#eef8f3] text-[#1b7a4e] shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <CreditCard className="w-4 h-4 shrink-0" />
                <span>Cổng thanh toán</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("notifications")}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-[13px] font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === "notifications"
                    ? "bg-[#eef8f3] text-[#1b7a4e] shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <Bell className="w-4 h-4 shrink-0" />
                <span>Thông báo & Email</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("security")}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-[13px] font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === "security"
                    ? "bg-[#eef8f3] text-[#1b7a4e] shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <Shield className="w-4 h-4 shrink-0" />
                <span>Bảo mật & Phân quyền</span>
              </button>
            </div>

            {/* TAB 1: CẤU HÌNH CHUNG */}
            {activeTab === "general" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  {/* Platform Brand Info Card */}
                  <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-5">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div>
                        <h2 className="text-sm sm:text-base font-bold text-slate-900">
                          Thông tin nền tảng & Doanh nghiệp
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Tên hiển thị trên website, hóa đơn VAT và các văn bản hợp đồng đối tác.
                        </p>
                      </div>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/70">
                        Đã xác minh
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-[13px]">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1.5">
                          Tên thương hiệu sàn
                        </label>
                        <input
                          type="text"
                          value={platformName}
                          onChange={(e) => setPlatformName(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1b7a4e]/20 focus:border-[#1b7a4e]"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1.5">
                          Mã số thuế doanh nghiệp
                        </label>
                        <input
                          type="text"
                          value={taxId}
                          onChange={(e) => setTaxId(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1b7a4e]/20 focus:border-[#1b7a4e]"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block font-semibold text-slate-700 mb-1.5">
                          Tên công ty pháp nhân
                        </label>
                        <input
                          type="text"
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1b7a4e]/20 focus:border-[#1b7a4e]"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1.5">
                          Hotline hỗ trợ khách hàng
                        </label>
                        <input
                          type="text"
                          value={hotline}
                          onChange={(e) => setHotline(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1b7a4e]/20 focus:border-[#1b7a4e]"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1.5">
                          Email nhận khiếu nại & CSKH
                        </label>
                        <input
                          type="email"
                          value={supportEmail}
                          onChange={(e) => setSupportEmail(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1b7a4e]/20 focus:border-[#1b7a4e]"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block font-semibold text-slate-700 mb-1.5">
                          Địa chỉ trụ sở chính tại Phú Quốc
                        </label>
                        <input
                          type="text"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1b7a4e]/20 focus:border-[#1b7a4e]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Regional & Localization */}
                  <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
                    <h2 className="text-sm sm:text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                      Định dạng vùng & Tiền tệ
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-[13px]">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1.5">
                          Đơn vị tiền tệ chính
                        </label>
                        <select
                          value={currency}
                          onChange={(e) => setCurrency(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1b7a4e]/20 focus:border-[#1b7a4e] bg-white cursor-pointer"
                        >
                          <option value="VND">VND (₫) - Đồng Việt Nam</option>
                          <option value="USD">USD ($) - Đô la Mỹ</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1.5">
                          Múi giờ hệ thống
                        </label>
                        <select
                          value={timezone}
                          onChange={(e) => setTimezone(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1b7a4e]/20 focus:border-[#1b7a4e] bg-white cursor-pointer"
                        >
                          <option value="Asia/Ho_Chi_Minh">(GMT+07:00) Bangkok, Hà Nội, Jakarta</option>
                          <option value="Asia/Singapore">(GMT+08:00) Singapore, Kuala Lumpur</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Sidebar: Quick Status Info */}
                <div className="space-y-4">
                  <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
                    <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                      <Server className="w-4 h-4 text-[#1b7a4e]" />
                      <span>Trạng thái cụm máy chủ</span>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
                        <span className="text-slate-600 font-medium">Next.js Turbopack Edge</span>
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3" />
                          Hoạt động 99.98%
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
                        <span className="text-slate-600 font-medium">PostgreSQL Database</span>
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3" />
                          Kết nối ổn định
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
                        <span className="text-slate-600 font-medium">Redis Cache Service</span>
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3" />
                          Phản hồi 4ms
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/60 text-xs text-emerald-800 space-y-2">
                    <div className="flex items-center gap-1.5 font-bold text-[#1b7a4e]">
                      <HelpCircle className="w-4 h-4 shrink-0" />
                      <span>Gợi ý vận hành</span>
                    </div>
                    <p className="leading-relaxed text-[11.5px]">
                      Mọi thay đổi tại mục Cấu hình chung sẽ tự động cập nhật đến thông tin liên hệ và các mẫu hợp đồng gửi cho chủ nhà đối tác mới.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: CHÍNH SÁCH & PHÍ */}
            {activeTab === "policies" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  {/* Commission & Fees */}
                  <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
                    <h2 className="text-sm sm:text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                      Tỷ lệ hoa hồng & Phí dịch vụ sàn
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-[13px]">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1.5">
                          Tỷ lệ hoa hồng chủ nhà mặc định (%)
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            value={commissionRate}
                            onChange={(e) => setCommissionRate(e.target.value)}
                            className="w-full px-3.5 py-2.5 pr-8 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1b7a4e]/20 focus:border-[#1b7a4e]"
                          />
                          <span className="absolute right-3 top-2.5 text-slate-400 font-semibold">%</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1">
                          Trừ trực tiếp trên tổng giá trị đặt phòng trước khi thanh toán cho chủ nhà.
                        </p>
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1.5">
                          Phí dịch vụ khách đặt (%)
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            value={guestServiceFee}
                            onChange={(e) => setGuestServiceFee(e.target.value)}
                            className="w-full px-3.5 py-2.5 pr-8 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1b7a4e]/20 focus:border-[#1b7a4e]"
                          />
                          <span className="absolute right-3 top-2.5 text-slate-400 font-semibold">%</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1">
                          Áp dụng cho khách hàng tiêu chuẩn. Miễn phí cho thành viên Stayea Club Vàng/Bạch Kim.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Standard Check-in and Checkout */}
                  <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
                    <h2 className="text-sm sm:text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                      Thời gian Check-in, Check-out & Giữ phòng
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-[13px]">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1.5">
                          Giờ nhận phòng tiêu chuẩn
                        </label>
                        <input
                          type="time"
                          value={standardCheckIn}
                          onChange={(e) => setStandardCheckIn(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1b7a4e]/20 focus:border-[#1b7a4e]"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1.5">
                          Giờ trả phòng tiêu chuẩn
                        </label>
                        <input
                          type="time"
                          value={standardCheckOut}
                          onChange={(e) => setStandardCheckOut(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1b7a4e]/20 focus:border-[#1b7a4e]"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1.5">
                          Thời gian giữ chỗ (phút)
                        </label>
                        <input
                          type="number"
                          value={holdBookingMinutes}
                          onChange={(e) => setHoldBookingMinutes(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1b7a4e]/20 focus:border-[#1b7a4e]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Cancellation Policy Standard */}
                  <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
                    <h2 className="text-sm sm:text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                      Chính sách hủy phòng sàn mặc định
                    </h2>

                    <div className="space-y-3 text-xs sm:text-[13px]">
                      {[
                        {
                          id: "flexible",
                          title: "Linh hoạt (Flexible)",
                          desc: "Hoàn tiền 100% khi khách hủy trước 24 giờ so với giờ check-in tiêu chuẩn.",
                        },
                        {
                          id: "moderate",
                          title: "Trung bình (Moderate)",
                          desc: "Hoàn tiền 100% khi hủy trước 5 ngày, hoàn 50% nếu hủy trong vòng 2-5 ngày.",
                        },
                        {
                          id: "strict",
                          title: "Nghiêm ngặt (Strict)",
                          desc: "Hoàn tiền 50% nếu hủy trước 7 ngày. Không hoàn lại tiền nếu hủy dưới 7 ngày.",
                        },
                      ].map((item) => (
                        <label
                          key={item.id}
                          className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                            cancellationPolicy === item.id
                              ? "bg-emerald-50/50 border-[#1b7a4e] text-slate-900"
                              : "border-slate-200 hover:bg-slate-50 text-slate-700"
                          }`}
                        >
                          <input
                            type="radio"
                            name="cancellation"
                            value={item.id}
                            checked={cancellationPolicy === item.id}
                            onChange={(e) => setCancellationPolicy(e.target.value)}
                            className="mt-0.5 text-[#1b7a4e] focus:ring-[#1b7a4e]"
                          />
                          <div>
                            <span className="font-bold text-slate-800 block">{item.title}</span>
                            <span className="text-[11.5px] text-slate-500 mt-0.5 block">{item.desc}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Info */}
                <div className="space-y-4">
                  <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
                    <span className="font-bold text-sm text-slate-900 block">Quy tắc áp dụng</span>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Chủ nhà có thể cài đặt chính sách riêng cho từng bất động sản đặc thù (biệt thự nguyên căn, resort). Nếu chủ nhà không chọn, hệ thống sẽ tự động áp dụng chính sách sàn mặc định ở đây.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: CỔNG THANH TOÁN */}
            {activeTab === "payments" && (
              <div className="space-y-6">
                {/* Sandbox Toggle Alert */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                  <div>
                    <span className="font-bold text-sm text-slate-900 block">
                      Môi trường thanh toán: {isSandboxMode ? "Thử nghiệm (Sandbox)" : "Sản xuất thực tế (Live Production)"}
                    </span>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {isSandboxMode
                        ? "Đang sử dụng API thẻ thử nghiệm để kiểm tra luồng thanh toán."
                        : "Giao dịch thực tế qua tài khoản ngân hàng và tài khoản cổng đối tác."}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setIsSandboxMode((prev) => !prev)
                      toast.info(`Đã chuyển sang chế độ ${isSandboxMode ? "Production" : "Sandbox"}`)
                    }}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      isSandboxMode
                        ? "bg-amber-50 text-amber-700 border-amber-300"
                        : "bg-emerald-50 text-emerald-700 border-emerald-300"
                    }`}
                  >
                    Chuyển sang {isSandboxMode ? "Chế độ Live" : "Chế độ Sandbox"}
                  </button>
                </div>

                {/* Gateways Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* VNPay */}
                  <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center font-bold text-blue-700 text-xs">
                          VNPAY
                        </div>
                        <div>
                          <span className="font-bold text-sm text-slate-900 block">VNPay QR & Thẻ ATM</span>
                          <span className="text-[11px] text-slate-400">Cổng thanh toán quốc dân</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setVnpayEnabled((prev) => !prev)}
                        className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                          vnpayEnabled ? "bg-[#1b7a4e]" : "bg-slate-200"
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                            vnpayEnabled ? "left-6.5" : "left-0.5"
                          }`}
                        />
                      </button>
                    </div>
                    <p className="text-xs text-slate-500">
                      Hỗ trợ quét mã QR qua hơn 40 ứng dụng ngân hàng và thẻ nội địa NAPAS.
                    </p>
                  </div>

                  {/* MoMo */}
                  <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-pink-50 border border-pink-200 flex items-center justify-center font-bold text-pink-700 text-xs">
                          MOMO
                        </div>
                        <div>
                          <span className="font-bold text-sm text-slate-900 block">Ví điện tử MoMo</span>
                          <span className="text-[11px] text-slate-400">Ví điện tử số 1 Việt Nam</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setMomoEnabled((prev) => !prev)}
                        className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                          momoEnabled ? "bg-[#1b7a4e]" : "bg-slate-200"
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                            momoEnabled ? "left-6.5" : "left-0.5"
                          }`}
                        />
                      </button>
                    </div>
                    <p className="text-xs text-slate-500">
                      Tích hợp thanh toán một chạm qua App MoMo và mã QR động kèm mã đơn đặt phòng.
                    </p>
                  </div>

                  {/* VietQR Chuyển khoản */}
                  <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center font-bold text-emerald-700 text-xs">
                          VietQR
                        </div>
                        <div>
                          <span className="font-bold text-sm text-slate-900 block">VietQR Tự động khớp lệnh</span>
                          <span className="text-[11px] text-slate-400">Ngân hàng MB / Vietcombank</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setVietqrEnabled((prev) => !prev)}
                        className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                          vietqrEnabled ? "bg-[#1b7a4e]" : "bg-slate-200"
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                            vietqrEnabled ? "left-6.5" : "left-0.5"
                          }`}
                        />
                      </button>
                    </div>
                    <p className="text-xs text-slate-500">
                      Tự động xác nhận đặt chỗ trong 3 giây khi nhận được chuyển khoản có cú pháp mã đặt phòng.
                    </p>
                  </div>

                  {/* Stripe / Visa / Mastercard */}
                  <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center font-bold text-indigo-700 text-xs">
                          STRIPE
                        </div>
                        <div>
                          <span className="font-bold text-sm text-slate-900 block">Thẻ Quốc Tế (Stripe)</span>
                          <span className="text-[11px] text-slate-400">Visa, Mastercard, JCB, Amex</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setStripeEnabled((prev) => !prev)}
                        className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                          stripeEnabled ? "bg-[#1b7a4e]" : "bg-slate-200"
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                            stripeEnabled ? "left-6.5" : "left-0.5"
                          }`}
                        />
                      </button>
                    </div>
                    <p className="text-xs text-slate-500">
                      Cổng thanh toán chuẩn 3D-Secure quốc tế phục vụ khách du lịch nước ngoài tại Phú Quốc.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: THÔNG BÁO & EMAIL */}
            {activeTab === "notifications" && (
              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-5">
                <h2 className="text-sm sm:text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                  Kênh gửi thông báo giao dịch & Tiếp thị
                </h2>

                <div className="space-y-4">
                  {[
                    {
                      id: "email",
                      title: "Email xác nhận đặt phòng & Voucher điện tử",
                      desc: "Tự động gửi email kèm mã QR check-in và bản đồ chỉ đường cho khách ngay khi thanh toán.",
                      state: emailBookingConfirm,
                      setter: setEmailBookingConfirm,
                    },
                    {
                      id: "sms",
                      title: "SMS Brandname gửi mã xác thực OTP",
                      desc: "Gửi SMS tin nhắn định danh STAYEA khi khách đăng ký tài khoản hoặc xác thực số điện thoại.",
                      state: smsOtpEnabled,
                      setter: setSmsOtpEnabled,
                    },
                    {
                      id: "zalo",
                      title: "Zalo ZNS Thông báo cập nhật tình trạng phòng",
                      desc: "Gửi thông báo tin nhắn chăm sóc khách hàng qua Zalo Official Account có tích vàng.",
                      state: zaloNotificationEnabled,
                      setter: setZaloNotificationEnabled,
                    },
                    {
                      id: "hostPush",
                      title: "Thông báo đẩy cho Chủ nhà / Đối tác khi có đơn mới",
                      desc: "Gửi thông báo âm thanh và push notification tới điện thoại chủ nhà khi khách đặt phòng thành công.",
                      state: hostPushNotification,
                      setter: setHostPushNotification,
                    },
                    {
                      id: "marketing",
                      title: "Email tin tức ưu đãi & Gói hành trình mới",
                      desc: "Bản tin định kỳ 2 lần/tháng cho các thành viên Stayea Club đăng ký nhận tin.",
                      state: marketingEmailEnabled,
                      setter: setMarketingEmailEnabled,
                    },
                  ].map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                    >
                      <div className="pr-4">
                        <span className="font-bold text-xs sm:text-[13px] text-slate-800 block">
                          {item.title}
                        </span>
                        <span className="text-[11px] text-slate-500 mt-0.5 block leading-relaxed">
                          {item.desc}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => item.setter((prev) => !prev)}
                        className={`w-11 h-6 rounded-full transition-colors relative shrink-0 cursor-pointer ${
                          item.state ? "bg-[#1b7a4e]" : "bg-slate-200"
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                            item.state ? "left-5.5" : "left-0.5"
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 5: BẢO MẬT & PHÂN QUYỀN */}
            {activeTab === "security" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  {/* Security Policy */}
                  <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
                    <h2 className="text-sm sm:text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                      Bảo mật tài khoản Quản trị viên
                    </h2>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 bg-slate-50/50">
                        <div>
                          <span className="font-bold text-xs sm:text-[13px] text-slate-800 block">
                            Bắt buộc xác thực 2 yếu tố (2FA) cho Admin
                          </span>
                          <span className="text-[11px] text-slate-500 mt-0.5 block">
                            Yêu cầu mã từ ứng dụng Google Authenticator hoặc SMS OTP khi đăng nhập vào hệ thống quản trị.
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => setRequire2FA((prev) => !prev)}
                          className={`w-11 h-6 rounded-full transition-colors relative shrink-0 cursor-pointer ${
                            require2FA ? "bg-[#1b7a4e]" : "bg-slate-200"
                          }`}
                        >
                          <span
                            className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                              require2FA ? "left-5.5" : "left-0.5"
                            }`}
                          />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-[13px]">
                        <div>
                          <label className="block font-semibold text-slate-700 mb-1.5">
                            Thời gian hết hạn phiên làm việc
                          </label>
                          <select
                            value={sessionTimeoutMinutes}
                            onChange={(e) => setSessionTimeoutMinutes(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1b7a4e]/20 focus:border-[#1b7a4e] bg-white cursor-pointer"
                          >
                            <option value="30">30 phút không hoạt động</option>
                            <option value="60">60 phút (Khuyến nghị)</option>
                            <option value="240">4 giờ làm việc</option>
                            <option value="480">8 giờ làm việc</option>
                          </select>
                        </div>

                        <div>
                          <label className="block font-semibold text-slate-700 mb-1.5">
                            Giới hạn IP Whitelist quản trị
                          </label>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setIpWhitelistEnabled((prev) => !prev)}
                              className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer w-full text-center ${
                                ipWhitelistEnabled
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                                  : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                              }`}
                            >
                              {ipWhitelistEnabled ? "Đang bật Whitelist" : "Đang tắt Whitelist"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Roles & Permissions List */}
                  <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div>
                        <h2 className="text-sm sm:text-base font-bold text-slate-900">
                          Nhóm quyền quản trị (Admin Roles)
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Phân bổ quyền truy cập theo trách nhiệm công việc trong công ty.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {[
                        {
                          role: "Super Admin",
                          users: 2,
                          desc: "Toàn quyền cấu hình hệ thống, quản lý doanh thu, phân quyền tài khoản.",
                          badge: "Toàn quyền",
                          color: "bg-purple-50 text-purple-700 border-purple-200",
                        },
                        {
                          role: "Operations Manager",
                          users: 4,
                          desc: "Quản lý phòng, lịch đặt, phê duyệt chủ nhà và điều phối trải nghiệm/tour.",
                          badge: "Vận hành",
                          color: "bg-blue-50 text-blue-700 border-blue-200",
                        },
                        {
                          role: "Finance & Accounting",
                          users: 2,
                          desc: "Quản lý đối soát doanh thu, duyệt lệnh rút tiền và xem báo cáo tài chính.",
                          badge: "Tài chính",
                          color: "bg-emerald-50 text-emerald-700 border-emerald-200",
                        },
                        {
                          role: "Customer Support",
                          users: 8,
                          desc: "Hỗ trợ khách hàng, trả lời tin nhắn, tiếp nhận và giải quyết khiếu nại.",
                          badge: "CSKH",
                          color: "bg-amber-50 text-amber-700 border-amber-200",
                        },
                      ].map((r) => (
                        <div
                          key={r.role}
                          className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 bg-slate-50/50"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-xs sm:text-[13px] text-slate-900">
                                {r.role}
                              </span>
                              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${r.color}`}>
                                {r.badge}
                              </span>
                            </div>
                            <span className="text-[11px] text-slate-500 mt-1 block">
                              {r.desc}
                            </span>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="text-xs font-bold text-slate-800 block">
                              {r.users} tài khoản
                            </span>
                            <span className="text-[10px] text-emerald-700 font-medium">
                              Đang hoạt động
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column: Security Audits */}
                <div className="space-y-4">
                  <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
                    <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                      <Lock className="w-4 h-4 text-[#1b7a4e]" />
                      <span>Nhật ký bảo mật gần đây</span>
                    </div>

                    <div className="space-y-2.5 text-[11px]">
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-0.5">
                        <div className="flex items-center justify-between font-bold text-slate-800">
                          <span>Đăng nhập quản trị viên</span>
                          <span className="text-[10px] text-slate-400">02:05</span>
                        </div>
                        <p className="text-slate-500">Nguyễn Minh đăng nhập từ IP 118.70.x.x (Hà Nội)</p>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-0.5">
                        <div className="flex items-center justify-between font-bold text-slate-800">
                          <span>Cập nhật chính sách hoa hồng</span>
                          <span className="text-[10px] text-slate-400">18/10</span>
                        </div>
                        <p className="text-slate-500">Thay đổi mức hoa hồng cơ sở đối tác cá nhân thành 12%</p>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-0.5">
                        <div className="flex items-center justify-between font-bold text-slate-800">
                          <span>Bật xác thực 2FA</span>
                          <span className="text-[10px] text-slate-400">15/10</span>
                        </div>
                        <p className="text-slate-500">Kích hoạt quy định bắt buộc 2FA cho toàn bộ tài khoản Admin</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <StayeaAdminFooter />
        </main>
      </div>
    </div>
  )
}
