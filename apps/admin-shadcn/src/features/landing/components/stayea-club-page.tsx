"use client"

import * as React from "react"
import { CheckCircle2, X, Crown, Sparkles, Gift, ShieldCheck } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@workspace/ui/components/dialog"
import { stayeaApi } from "@/lib/stayea-api-service"
import { ProfileSidebar } from "./profile-sidebar"
import { StayeaClubHeroBanner } from "./stayea-club-hero-banner"
import { StayeaClubTierCard } from "./stayea-club-tier-card"
import { StayeaClubPerksBar } from "./stayea-club-perks-bar"
import { StayeaClubOffersSection } from "./stayea-club-offers-section"
import { StayeaClubPointsHistory } from "./stayea-club-points-history"
import { StayeaClubTiersComparison } from "./stayea-club-tiers-comparison"
import { StayeaClubExploreBanner } from "./stayea-club-explore-banner"
import {
  STAYEA_CLUB_TIERS,
} from "@/features/landing/data/stayea-mock-data"
import type {
  StayeaClubOfferItem,
  StayeaClubTierTierItem,
} from "@/features/landing/data/stayea-mock-data"

export interface StayeaClubPageProps {
  readonly onNavigate?: (route: string) => void
}

export function StayeaClubPage({ onNavigate }: StayeaClubPageProps) {
  const [toastMessage, setToastMessage] = React.useState<string | null>(null)
  const [selectedOffer, setSelectedOffer] = React.useState<StayeaClubOfferItem | null>(null)
  const [selectedTier, setSelectedTier] = React.useState<StayeaClubTierTierItem | null>(null)
  const [showCompareDialog, setShowCompareDialog] = React.useState<boolean>(false)

  const [clubProfile, setClubProfile] = React.useState({
    memberName: "Đang tải...",
    memberTier: "Thành viên Bạc",
    memberSince: "Mới tham gia",
    avatarUrl: "/profile/profile-avatar.jpg",
    currentPoints: 0,
    nextTier: "Vàng",
    pointsNeededForNextTier: 1000,
    nextTierThreshold: 1000,
  })

  React.useEffect(() => {
    Promise.all([
      stayeaApi.getProfile().catch(() => null),
      stayeaApi.getClubProfile().catch(() => null),
    ]).then(([user, club]) => {
      const name = user?.displayName || user?.name || "Thành viên STAYEA"
      const avatar = user?.avatar || "/profile/profile-avatar.jpg"
      const points = typeof club?.pointsBalance === "number" ? club.pointsBalance : 0
      let tierName = "Thành viên Bạc"
      let nextTier = "Vàng"
      let threshold = 1000
      if (points >= 4000) {
        tierName = "Thành viên Kim Cương"
        nextTier = "VIP Elite"
        threshold = 10000
      } else if (points >= 2000) {
        tierName = "Thành viên Bạch Kim"
        nextTier = "Kim Cương"
        threshold = 4000
      } else if (points >= 1000) {
        tierName = "Thành viên Vàng"
        nextTier = "Bạch Kim"
        threshold = 2000
      }
      const needed = Math.max(0, threshold - points)

      setClubProfile({
        memberName: name,
        memberTier: tierName,
        memberSince: club?.memberSince || "Tháng " + (new Date().getMonth() + 1) + "/" + new Date().getFullYear(),
        avatarUrl: avatar,
        currentPoints: points,
        nextTier,
        pointsNeededForNextTier: needed,
        nextTierThreshold: threshold,
      })
    })
  }, [])

  function showToast(msg: string) {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage(null)
    }, 3500)
  }

  function handleClaimOffer(offer: StayeaClubOfferItem) {
    if (offer.buttonText === "Xem chi tiết") {
      setSelectedOffer(offer)
    } else if (offer.id === "club-off-1") {
      onNavigate?.("stayea-club-claimed")
    } else {
      showToast(`Chúc mừng! Bạn đã nhận thành công ưu đãi "${offer.title}". Mã đã được lưu vào ví ưu đãi.`)
    }
  }

  function handleSelectTier(tier: StayeaClubTierTierItem) {
    setSelectedTier(tier)
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
        // already on stayea-club
        break
      case "settings":
      case "cai-dat":
        onNavigate?.("settings")
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
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-[#0a2540] text-white px-4 py-3 rounded-2xl shadow-xl text-xs sm:text-sm animate-in fade-in slide-in-from-bottom-3 duration-200">
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

      {/* 1. Panorama Hero Banner: Stayea Club */}
      <StayeaClubHeroBanner />

      {/* 2. Main Page Grid */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Profile Sidebar (Col 3) */}
          <div className="lg:col-span-3">
            <ProfileSidebar
              activeTab="staya-club"
              onSelectTab={handleSidebarSelect}
              hideBadges
            />
          </div>

          {/* Right Column: Main Stayea Club Content (Col 9) */}
          <div className="lg:col-span-9 space-y-6">
            {/* 1. Golden VIP Tier & Points Summary Card */}
            <StayeaClubTierCard
              profile={clubProfile}
              onViewTiers={() => setShowCompareDialog(true)}
            />

            {/* 2. 4 Quick Privilege Perks */}
            <StayeaClubPerksBar />

            {/* 3. Ưu đãi dành riêng cho bạn (4 Member Offer Cards) */}
            <StayeaClubOffersSection
              onClaimOffer={handleClaimOffer}
              onViewAllOffers={() => showToast("Đang hiển thị toàn bộ 12 ưu đãi thành viên Stayea Club")}
            />

            {/* 4. Two columns split: Lịch sử tích điểm (Left) & Các hạng thành viên (Right) */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-stretch">
              <div className="xl:col-span-6 flex flex-col">
                <StayeaClubPointsHistory
                  onViewAllHistory={() => showToast("Đang tải toàn bộ lịch sử điểm tích lũy...")}
                />
              </div>
              <div className="xl:col-span-6 flex flex-col">
                <StayeaClubTiersComparison
                  onSelectTier={handleSelectTier}
                  onCompareClick={() => setShowCompareDialog(true)}
                />
              </div>
            </div>

            {/* 5. Bottom Tropical Panorama Banner */}
            <StayeaClubExploreBanner
              onExploreClick={() => {
                showToast("Khám phá các hành trình tuyển chọn đặc quyền dành cho bạn tại Phú Quốc!")
                onNavigate?.("packages")
              }}
            />
          </div>
        </div>
      </div>

      {/* Offer Details Dialog */}
      <Dialog open={!!selectedOffer} onOpenChange={(open) => !open && setSelectedOffer(null)}>
        <DialogContent className="max-w-md sm:max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
          {selectedOffer && (
            <div>
              <DialogHeader>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                    {selectedOffer.badgeText}
                  </span>
                  <span className="text-xs text-slate-500">HSD: {selectedOffer.expiryDate}</span>
                </div>
                <DialogTitle className="text-lg font-bold text-[#0a2540]">
                  {selectedOffer.title}
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-600">
                  {selectedOffer.description}
                </DialogDescription>
              </DialogHeader>

              <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2.5 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Áp dụng tự động khi thanh toán dịch vụ tương ứng trên Stayea.</span>
                </div>
                <div className="flex items-center gap-2">
                  <Gift className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Không giới hạn số lần sử dụng trong thời gian hiệu lực.</span>
                </div>
                <div className="flex items-center gap-2">
                  <Crown className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Dành riêng cho hạng thành viên Vàng (Gold) trở lên.</span>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedOffer(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
                >
                  Đóng
                </button>
                <button
                  type="button"
                  onClick={() => {
                    showToast(`Đã nhận ưu đãi "${selectedOffer.title}"`)
                    setSelectedOffer(null)
                  }}
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#0a2540] text-white hover:bg-[#07192c] transition shadow-xs"
                >
                  Nhận ưu đãi ngay
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Tier Details Dialog */}
      <Dialog open={!!selectedTier} onOpenChange={(open) => !open && setSelectedTier(null)}>
        <DialogContent className="max-w-md rounded-2xl bg-white p-6 shadow-2xl">
          {selectedTier && (
            <div>
              <DialogHeader>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
                    <Crown className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-amber-900 uppercase tracking-wide">
                    {selectedTier.subtitle}
                  </span>
                </div>
                <DialogTitle className="text-lg font-bold text-[#0a2540]">
                  Hạng {selectedTier.name}
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-600">
                  {selectedTier.isCurrent
                    ? "Đây là hạng thành viên hiện tại của bạn trên Stayea Club."
                    : "Đặc quyền bạn sẽ nhận được khi nâng lên hạng này."}
                </DialogDescription>
              </DialogHeader>

              <div className="mt-4 space-y-2">
                <p className="text-xs font-bold text-slate-800">Danh sách đặc quyền:</p>
                <div className="space-y-1.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  {selectedTier.features.map((feat) => (
                    <div key={`${selectedTier.id}-${feat}`} className="flex items-center gap-2 text-xs text-slate-700">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedTier(null)}
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#0a2540] text-white hover:bg-[#07192c] transition shadow-xs"
                >
                  Đã hiểu
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Compare All Tiers Dialog */}
      <Dialog open={showCompareDialog} onOpenChange={setShowCompareDialog}>
        <DialogContent className="max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">
          <DialogHeader>
            <div className="flex items-center gap-2 text-blue-600 mb-1">
              <Crown className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">Hệ thống thành viên</span>
            </div>
            <DialogTitle className="text-xl font-bold text-[#0a2540]">
              Bảng so sánh quyền lợi các hạng Stayea Club
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-600">
              Tích lũy điểm khi lưu trú, trải nghiệm tour và sử dụng dịch vụ để thăng hạng và mở khóa các đặc quyền cao cấp.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
            {STAYEA_CLUB_TIERS.map((tier) => (
              <div
                key={tier.id}
                className={`p-4 rounded-xl border flex flex-col justify-between ${
                  tier.isCurrent
                    ? "bg-amber-50/70 border-amber-300 ring-1 ring-amber-300"
                    : "bg-slate-50/50 border-slate-200"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm text-[#0a2540]">{tier.name}</span>
                    {tier.isCurrent && (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-400 text-amber-950">
                        Hiện tại
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 mb-3">{tier.subtitle}</p>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {tier.features.map((f) => (
                      <li key={`${tier.id}-${f}`} className="flex items-start gap-1.5 text-[11px]">
                        <span className="text-amber-600 shrink-0 mt-0.5">✓</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={() => setShowCompareDialog(false)}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-[#0a2540] text-white hover:bg-[#07192c] transition shadow-xs"
            >
              Đóng bảng so sánh
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
