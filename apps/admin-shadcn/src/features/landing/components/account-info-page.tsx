"use client"

import * as React from "react"
import Image from "next/image"
import {
  Key,
  CheckCircle2,
  X,
  Upload,
  Lock,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@workspace/ui/components/dialog"
import { stayeaApi } from "@/lib/stayea-api-service"
import { ProfileSidebar } from "./profile-sidebar"
import { AccountInfoHeroBanner } from "./account-info-hero-banner"
import { AccountInfoHeaderCards } from "./account-info-header-cards"
import { AccountInfoForm } from "./account-info-form"
import type {
  UserProfileInfo,
  UserAccountFormDetails,
} from "@/features/landing/data/stayea-mock-data"
import {
  CURRENT_USER_PROFILE,
  USER_ACCOUNT_FORM_DEFAULT,
  STAYEA_PROFILE_TIPS,
} from "@/features/landing/data/stayea-mock-data"

interface AccountInfoPageProps {
  readonly onNavigate?: (route: string) => void
}

const AVATAR_PRESETS = [
  { id: "av-1", url: "/profile/profile-avatar.jpg", label: "Ảnh hiện tại" },
  { id: "av-2", url: "/experience/snorkeling-nam-dao.jpg", label: "Lặn biển Phú Quốc" },
  { id: "av-3", url: "/profile/sunset-sanato.jpg", label: "Sunset Sanato" },
  { id: "av-4", url: "/stay/salinda-resort.jpg", label: "Resort sang trọng" },
]

export function AccountInfoPage({ onNavigate }: AccountInfoPageProps) {
  // 1. Core Profile & Form States
  const [profile, setProfile] = React.useState<UserProfileInfo>(CURRENT_USER_PROFILE)
  const [formData, setFormData] = React.useState<UserAccountFormDetails>(
    USER_ACCOUNT_FORM_DEFAULT
  )

  // 2. Modals state
  const [isPasswordModalOpen, setIsPasswordModalOpen] = React.useState<boolean>(false)
  const [isAvatarModalOpen, setIsAvatarModalOpen] = React.useState<boolean>(false)

  // 3. Password modal fields
  const [currentPassword, setCurrentPassword] = React.useState<string>("")
  const [newPassword, setNewPassword] = React.useState<string>("")
  const [confirmPassword, setConfirmPassword] = React.useState<string>("")
  const [passwordError, setPasswordError] = React.useState<string | null>(null)

  // 4. Avatar selection temp state
  const [selectedAvatarUrl, setSelectedAvatarUrl] = React.useState<string>(profile.avatarUrl)

  // 5. Toast notification state
  const [toastMessage, setToastMessage] = React.useState<string | null>(null)

  // Load real user profile from NestJS
  React.useEffect(() => {
    async function loadUser() {
      try {
        const u = await stayeaApi.getProfile()
        if (u) {
          const name = u.displayName || u.name || u.email?.split("@")[0] || "Thành viên STAYEA"
          setProfile((prev) => ({
            ...prev,
            id: u.id || prev.id,
            name,
            email: u.email || prev.email,
            phone: u.phone || prev.phone,
            bio: u.bio || prev.bio,
            avatarUrl: u.avatarUrl || prev.avatarUrl,
          }))
          setFormData((prev) => ({
            ...prev,
            fullName: name,
            email: u.email || prev.email,
            phone: u.phone || prev.phone,
          }))
        }
      } catch {
        // fallback
      }
    }
    loadUser()
  }, [])

  function showToast(msg: string) {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev))
    }, 4000)
  }

  // Handle Form Save
  function handleSaveForm(data: UserAccountFormDetails) {
    setFormData(data)
    setProfile((prev) => ({
      ...prev,
      name: data.fullName,
      email: data.email,
      phone: data.phone,
    }))
    showToast("Cập nhật thông tin cá nhân thành công!")
  }

  // Handle Form Reset
  function handleResetForm() {
    setFormData(USER_ACCOUNT_FORM_DEFAULT)
    showToast("Đã khôi phục thông tin cá nhân về mặc định ban đầu.")
  }

  // Handle Change Password Submit
  function handleChangePasswordSubmit(e: React.FormEvent) {
    e.preventDefault()
    setPasswordError(null)

    if (!currentPassword) {
      setPasswordError("Vui lòng nhập mật khẩu hiện tại.")
      return
    }
    if (newPassword.length < 6) {
      setPasswordError("Mật khẩu mới phải có ít nhất 6 ký tự.")
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Mật khẩu xác nhận không trùng khớp.")
      return
    }

    // Success
    setIsPasswordModalOpen(false)
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
    showToast("Đổi mật khẩu thành công! Tài khoản của bạn đã được bảo vệ.")
  }

  // Handle Avatar Change Submit
  function handleAvatarSave() {
    setProfile((prev) => ({
      ...prev,
      avatarUrl: selectedAvatarUrl,
    }))
    setIsAvatarModalOpen(false)
    showToast("Cập nhật ảnh đại diện thành công!")
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-[#0A2239] text-white px-4 py-3 rounded-2xl shadow-xl text-xs sm:text-sm animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="p-1 hover:bg-white/10 rounded-lg text-slate-300 ml-2"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 1. Hero Panorama Banner */}
      <AccountInfoHeroBanner />

      {/* 2. Main Body Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8 relative z-20">
        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 items-start">
          {/* Left Sidebar */}
          <ProfileSidebar
            activeTab="account-info"
            hideBadges
            onSelectTab={(tabId) => onNavigate?.(tabId)}
            onLogout={() => onNavigate?.("home")}
          />

          {/* Right Main Content Area */}
          <main className="flex-1 w-full min-w-0 space-y-6">
            {/* Top Row: User Summary Card + Tips Card */}
            <AccountInfoHeaderCards
              profile={profile}
              tips={STAYEA_PROFILE_TIPS}
              onChangeAvatar={() => {
                setSelectedAvatarUrl(profile.avatarUrl)
                setIsAvatarModalOpen(true)
              }}
            />

            {/* Core Form Card: 4 Sections & Actions */}
            <AccountInfoForm
              initialData={formData}
              onSave={handleSaveForm}
              onReset={handleResetForm}
              onChangePassword={() => {
                setPasswordError(null)
                setCurrentPassword("")
                setNewPassword("")
                setConfirmPassword("")
                setIsPasswordModalOpen(true)
              }}
            />
          </main>
        </div>
      </div>

      {/* =========================================================================
          MODAL 1: ĐỔI MẬT KHẨU
      ========================================================================= */}
      <Dialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg font-bold text-slate-900">
              <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                <Lock className="w-4 h-4" />
              </div>
              <span>Đổi mật khẩu tài khoản</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Mật khẩu mới cần tối thiểu 6 ký tự để đảm bảo an toàn cho tài khoản STAYEA của bạn.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleChangePasswordSubmit} className="space-y-4 pt-2">
            {passwordError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs">
                {passwordError}
              </div>
            )}

            {/* Mật khẩu hiện tại */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Mật khẩu hiện tại <span className="text-rose-500">*</span>
              </label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Nhập mật khẩu đang dùng"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-blue-500"
              />
            </div>

            {/* Mật khẩu mới */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Mật khẩu mới <span className="text-rose-500">*</span>
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Tối thiểu 6 ký tự"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-blue-500"
              />
            </div>

            {/* Xác nhận mật khẩu mới */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Xác nhận mật khẩu mới <span className="text-rose-500">*</span>
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Nhập lại mật khẩu mới"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-blue-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsPasswordModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-all cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0A2239] hover:bg-[#071726] text-white text-xs font-semibold shadow-2xs transition-all cursor-pointer"
              >
                <Key className="w-3.5 h-3.5" />
                <span>Cập nhật mật khẩu</span>
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* =========================================================================
          MODAL 2: CHỈNH SỬA ẢNH ĐẠI DIỆN
      ========================================================================= */}
      <Dialog open={isAvatarModalOpen} onOpenChange={setIsAvatarModalOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900">
              Thay đổi ảnh đại diện
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Chọn ảnh đại diện từ thư viện ảnh kỷ niệm Phú Quốc hoặc tải ảnh của bạn lên.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Current Selected Preview */}
            <div className="flex flex-col items-center justify-center gap-2 py-3 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="relative w-24 h-24 rounded-full overflow-hidden border-3 border-white shadow-md ring-2 ring-blue-500">
                <Image
                  src={selectedAvatarUrl}
                  alt="Avatar Preview"
                  fill
                  unoptimized
                  className="object-cover object-top"
                />
              </div>
              <p className="text-xs text-slate-500 font-medium">Xem trước ảnh đại diện</p>
            </div>

            {/* Presets List */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700">
                Chọn ảnh có sẵn
              </label>
              <div className="grid grid-cols-4 gap-2.5">
                {AVATAR_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setSelectedAvatarUrl(preset.url)}
                    className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                      selectedAvatarUrl === preset.url
                        ? "border-[#2563EB] ring-2 ring-blue-100 scale-105"
                        : "border-slate-200 hover:border-slate-300 opacity-80 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={preset.url}
                      alt={preset.label}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Custom File Upload Option */}
            <div className="space-y-1.5 pt-1">
              <label className="text-xs font-semibold text-slate-700">
                Hoặc tải ảnh từ thiết bị
              </label>
              <label className="flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-slate-300 hover:border-blue-500 bg-slate-50/50 hover:bg-blue-50/30 transition-all cursor-pointer text-xs font-medium text-slate-600">
                <Upload className="w-4 h-4 text-slate-400" />
                <span>Nhấn để chọn tệp ảnh mới (JPG, PNG)</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      const tempUrl = URL.createObjectURL(file)
                      setSelectedAvatarUrl(tempUrl)
                    }
                  }}
                />
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAvatarModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-all cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleAvatarSave}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0A2239] hover:bg-[#071726] text-white text-xs font-semibold shadow-2xs transition-all cursor-pointer"
            >
              <span>Lưu ảnh đại diện</span>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
