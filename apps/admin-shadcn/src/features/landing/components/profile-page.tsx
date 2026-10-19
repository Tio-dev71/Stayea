"use client"

import * as React from "react"
import { X, CheckCircle2, Shield, Calendar, MapPin, Users, Heart } from "lucide-react"
import { ProfileHeroBanner } from "./profile-hero-banner"
import { ProfileSidebar } from "./profile-sidebar"
import { ProfileUserCard } from "./profile-user-card"
import { ProfilePromoBanner } from "./profile-promo-banner"
import { ProfileUpcomingTrip } from "./profile-upcoming-trip"
import { ProfilePastTrips } from "./profile-past-trips"
import { ProfileFavorites } from "./profile-favorites"
import { ProfileStayaClubBanner } from "./profile-staya-club-banner"
import {
  CURRENT_USER_PROFILE,
  UPCOMING_TRIP,
  PAST_TRIPS,
  FAVORITE_DESTINATIONS,
} from "@/features/landing/data/stayea-mock-data"
import type {
  UserProfileInfo,
  UpcomingTrip,
  PastTrip,
  FavoriteDestination,
} from "@/features/landing/data/stayea-mock-data"

interface ProfilePageProps {
  readonly onNavigate?: (route: string) => void
}

export function ProfilePage({ onNavigate }: ProfilePageProps) {
  // 1. State
  const [profile, setProfile] = React.useState<UserProfileInfo>(CURRENT_USER_PROFILE)
  const [activeTab, setActiveTab] = React.useState<string>("profile")
  const [favoritesList, setFavoritesList] = React.useState<readonly FavoriteDestination[]>(FAVORITE_DESTINATIONS)
  
  // Modals
  const [isEditProfileOpen, setIsEditProfileOpen] = React.useState(false)
  const [isCoverModalOpen, setIsCoverModalOpen] = React.useState(false)
  const [isAvatarModalOpen, setIsAvatarModalOpen] = React.useState(false)
  const [selectedTripDetails, setSelectedTripDetails] = React.useState<UpcomingTrip | null>(null)
  const [selectedPastTrip, setSelectedPastTrip] = React.useState<PastTrip | null>(null)
  const [isClubModalOpen, setIsClubModalOpen] = React.useState(false)
  const [notificationMsg, setNotificationMsg] = React.useState<string | null>(null)

  // Edit form state
  const [editName, setEditName] = React.useState(profile.name)
  const [editBio, setEditBio] = React.useState(profile.bio)
  const [editPhone, setEditPhone] = React.useState(profile.phone)
  const [editEmail, setEditEmail] = React.useState(profile.email)

  function showToast(msg: string) {
    setNotificationMsg(msg)
    setTimeout(() => {
      setNotificationMsg(null)
    }, 3500)
  }

  function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault()
    setProfile((prev) => ({
      ...prev,
      name: editName,
      bio: editBio,
      phone: editPhone,
      email: editEmail,
    }))
    setIsEditProfileOpen(false)
    showToast("Hồ sơ của bạn đã được cập nhật thành công!")
  }

  function handleToggleFavorite(favId: string) {
    setFavoritesList((prev) => {
      const exists = prev.some((item) => item.id === favId)
      if (exists) {
        showToast("Đã cập nhật danh sách yêu thích!")
        return prev.filter((item) => item.id !== favId)
      }
      return prev
    })
  }

  function handleLogout() {
    showToast("Đã đăng xuất thành công!")
    setTimeout(() => {
      onNavigate?.("login")
    }, 600)
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-16">
      {/* Toast Notification */}
      {notificationMsg && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-slate-900 text-white shadow-xl text-xs font-semibold animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{notificationMsg}</span>
        </div>
      )}

      {/* 1. Hero Cover Banner */}
      <ProfileHeroBanner
        userName={profile.name}
        onEditCover={() => setIsCoverModalOpen(true)}
      />

      {/* 2. Main 2-Column Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
          {/* Left Sidebar */}
          <ProfileSidebar
            activeTab={activeTab}
            onSelectTab={(tabId) => {
              setActiveTab(tabId)
              if (tabId === "deals" || tabId === "my-deals") {
                onNavigate?.("my-deals")
              } else if (tabId === "staya-club" || tabId === "stayea-club") {
                onNavigate?.("stayea-club")
              } else if (tabId === "settings" || tabId === "cai-dat") {
                onNavigate?.("settings")
              } else if (tabId === "profile") {
                // already on profile
              } else {
                onNavigate?.(tabId)
              }
            }}
            onLogout={handleLogout}
          />

          {/* Right Main Content Area */}
          <div className="flex-1 w-full space-y-6">
            {/* 1. Profile Header Card */}
            <ProfileUserCard
              profile={profile}
              onEditProfile={() => {
                setEditName(profile.name)
                setEditBio(profile.bio)
                setEditPhone(profile.phone)
                setEditEmail(profile.email)
                setIsEditProfileOpen(true)
              }}
              onChangeAvatar={() => setIsAvatarModalOpen(true)}
            />

            {/* 2. Exclusive Promo Callout Banner */}
            <ProfilePromoBanner
              onExploreDeals={() => onNavigate?.("deals")}
            />

            {/* 3. Upcoming Trips */}
            <ProfileUpcomingTrip
              trip={UPCOMING_TRIP}
              onViewDetails={(trip) => setSelectedTripDetails(trip)}
              onManageBooking={() => onNavigate?.("bookings")}
              onViewAll={() => showToast("Đang tải danh sách toàn bộ chuyến đi sắp tới...")}
            />

            {/* 4. Past Trips */}
            <ProfilePastTrips
              trips={PAST_TRIPS}
              onSelectTrip={(trip) => setSelectedPastTrip(trip)}
              onViewAll={() => showToast("Đang tải lịch sử chuyến đi đã hoàn thành...")}
            />

            {/* 5. Favorite Destinations */}
            <ProfileFavorites
              favorites={favoritesList}
              onToggleFavorite={handleToggleFavorite}
              onSelectDestination={(dest) => {
                showToast(`Đang xem điểm đến: ${dest.title}`)
              }}
              onViewAll={() => showToast("Đang mở danh sách 28 địa điểm yêu thích...")}
            />

            {/* 6. Staya Club Loyalty Banner */}
            <ProfileStayaClubBanner
              onExploreClub={() => setIsClubModalOpen(true)}
            />
          </div>
        </div>
      </div>

      {/* MODAL 1: Edit Profile */}
      {isEditProfileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Chỉnh sửa thông tin hồ sơ</h3>
              <button
                type="button"
                onClick={() => setIsEditProfileOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4 pt-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Họ và tên</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#0A2239] focus:ring-1 focus:ring-[#0A2239]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#0A2239] focus:ring-1 focus:ring-[#0A2239]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Số điện thoại</label>
                <input
                  type="text"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#0A2239] focus:ring-1 focus:ring-[#0A2239]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Giới thiệu bản thân (Bio)</label>
                <textarea
                  rows={3}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#0A2239] focus:ring-1 focus:ring-[#0A2239]"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditProfileOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0A2239] hover:bg-[#071726] text-white font-semibold shadow-xs"
                >
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Change Cover Photo */}
      {isCoverModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Chỉnh sửa ảnh bìa</h3>
              <button
                type="button"
                onClick={() => setIsCoverModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="py-6 text-center space-y-3">
              <p className="text-xs text-slate-600">
                Bạn có thể tải lên ảnh toàn cảnh độ phân giải cao mới (khuyến nghị 1920x600px).
              </p>
              <div className="p-8 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 hover:bg-slate-100/70 transition-colors cursor-pointer">
                <p className="text-xs font-semibold text-slate-700">Kéo & thả hoặc bấm để chọn tệp</p>
                <p className="text-[11px] text-slate-400 mt-1">PNG, JPG, WEBP lên đến 10MB</p>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsCoverModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50"
              >
                Đóng
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsCoverModalOpen(false)
                  showToast("Ảnh bìa đã được cập nhật thành công!")
                }}
                className="px-4 py-2 rounded-xl bg-[#0A2239] text-white text-xs font-semibold hover:bg-[#071726]"
              >
                Cập nhật ảnh mẫu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Change Avatar */}
      {isAvatarModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Cập nhật ảnh đại diện</h3>
              <button
                type="button"
                onClick={() => setIsAvatarModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="py-6 text-center space-y-3">
              <p className="text-xs text-slate-600">
                Chọn ảnh chân dung chất lượng tốt để hồ sơ STAYEA của bạn luôn chuyên nghiệp.
              </p>
              <div className="p-8 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 hover:bg-slate-100/70 transition-colors cursor-pointer">
                <p className="text-xs font-semibold text-slate-700">Kéo & thả ảnh đại diện mới</p>
                <p className="text-[11px] text-slate-400 mt-1">Hỗ trợ JPG, PNG (tối đa 5MB)</p>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAvatarModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsAvatarModalOpen(false)
                  showToast("Ảnh đại diện đã được cập nhật thành công!")
                }}
                className="px-4 py-2 rounded-xl bg-[#0A2239] text-white text-xs font-semibold hover:bg-[#071726]"
              >
                Lưu ảnh
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: Upcoming Trip Details & Management */}
      {selectedTripDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-base">{selectedTripDetails.title}</h3>
                <p className="text-xs text-slate-500">Mã đặt chỗ: <span className="font-mono font-semibold text-slate-800">{selectedTripDetails.bookingCode}</span></p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTripDetails(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3.5 text-xs text-slate-600">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="font-medium text-slate-500">Trạng thái</span>
                <span className="px-2.5 py-0.5 rounded-full font-semibold bg-emerald-100 text-emerald-800 text-[11px]">
                  {selectedTripDetails.statusBadge}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>Thời gian: <strong className="text-slate-800">{selectedTripDetails.dates}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-slate-400" />
                  <span>Số lượng khách: <strong className="text-slate-800">{selectedTripDetails.guests}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-slate-400" />
                  <span>Phân loại: <strong className="text-slate-800">{selectedTripDetails.tripType}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span>Điểm đến: <strong className="text-slate-800">Đảo Phú Quốc, Kiên Giang</strong></span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-blue-50 border border-blue-100 text-blue-900 space-y-1">
                <div className="font-semibold flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-blue-600" />
                  <span>Hỗ trợ riêng cho thành viên STAYEA</span>
                </div>
                <p className="text-[11px] text-blue-700">
                  Xe đưa đón sân bay và quản gia riêng đã sẵn sàng phục vụ theo lịch trình.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedTripDetails(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50"
              >
                Đóng
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedTripDetails(null)
                  showToast("Đã gửi yêu cầu hỗ trợ lịch trình tới quản gia Stayea!")
                }}
                className="px-4 py-2 rounded-xl bg-[#0A2239] text-white text-xs font-semibold hover:bg-[#071726]"
              >
                Liên hệ quản gia
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: Past Trip Details */}
      {selectedPastTrip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">{selectedPastTrip.title}</h3>
              <button
                type="button"
                onClick={() => setSelectedPastTrip(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="py-4 space-y-2 text-xs text-slate-600">
              <p>Thời gian chuyến đi: <strong className="text-slate-800">{selectedPastTrip.dates}</strong></p>
              <p>Địa điểm: <strong className="text-slate-800">{selectedPastTrip.location}</strong></p>
              <p className="text-slate-500 pt-2">Chuyến đi đã hoàn thành và nhận được đánh giá 5 sao từ bạn.</p>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedPastTrip(null)}
                className="px-4 py-2 rounded-xl bg-[#0A2239] text-white text-xs font-semibold hover:bg-[#071726]"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 6: Staya Club Perks */}
      {isClubModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Đặc quyền hội viên Staya Club</h3>
              <button
                type="button"
                onClick={() => setIsClubModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="py-4 space-y-3 text-xs text-slate-700">
              <div className="p-3 rounded-xl bg-[#EEF5FC] border border-[#D8E6F8]">
                <p className="font-semibold text-slate-900">Hạng thẻ hiện tại: Thành viên Bạc (Silver)</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Tích lũy thêm 3 chuyến đi để thăng hạng Vàng (Gold).</p>
              </div>
              <ul className="space-y-2 list-disc list-inside text-slate-600">
                <li>Giảm ngay 10% cho toàn bộ villa nghỉ dưỡng tuyển chọn</li>
                <li>Tặng dịch vụ xe riêng đón/tiễn sân bay Phú Quốc</li>
                <li>Ưu tiên check-in sớm và check-out muộn 2 giờ</li>
                <li>Tặng set quà chào đón và trà chiều miễn phí</li>
              </ul>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setIsClubModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-[#0A2239] text-white text-xs font-semibold hover:bg-[#071726]"
              >
                Đã hiểu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
