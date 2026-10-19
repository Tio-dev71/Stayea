"use client"

import * as React from "react"
import { CheckCircle2, X } from "lucide-react"
import { ProfileSidebar } from "./profile-sidebar"
import { StayeaClubHeroBanner } from "./stayea-club-hero-banner"
import { StayeaClubTierCard } from "./stayea-club-tier-card"
import { StayeaClubClaimedSuccessBanner } from "./stayea-club-claimed-success-banner"
import { StayeaClubClaimedOfferHero } from "./stayea-club-claimed-offer-hero"
import { StayeaClubClaimedTermsAndGuide } from "./stayea-club-claimed-terms-and-guide"
import { StayeaClubClaimedSidebarWidgets } from "./stayea-club-claimed-sidebar-widgets"
import { StayeaClubOtherOffersSection } from "./stayea-club-other-offers-section"
import {
  STAYEA_CLUB_PROFILE,
  STAYEA_CLUB_CLAIMED_OFFER,
} from "@/features/landing/data/stayea-mock-data"
import type { StayeaClubOtherOfferItem } from "@/features/landing/data/stayea-mock-data"

export interface StayeaClubClaimedPageProps {
  readonly onNavigate?: (route: string) => void
}

export function StayeaClubClaimedPage({ onNavigate }: StayeaClubClaimedPageProps) {
  const [toastMessage, setToastMessage] = React.useState<string | null>(null)
  const [showSuccessBanner, setShowSuccessBanner] = React.useState<boolean>(true)

  function showToast(msg: string) {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage(null)
    }, 3500)
  }

  function handleCopyCode(code: string) {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(code).catch(() => {})
    }
    showToast(`Đã sao chép mã [${code}] vào bộ nhớ tạm!`)
  }

  function handleUseNow() {
    showToast("Đang mở trang đặt vé máy bay với mã STAYEA10AIR được áp dụng tự động...")
    setTimeout(() => {
      onNavigate?.("flight-booking")
    }, 800)
  }

  function handleViewFlights() {
    onNavigate?.("flight-booking")
  }

  function handleClaimOtherOffer(offer: StayeaClubOtherOfferItem) {
    showToast(`Chúc mừng! Bạn đã nhận thành công ưu đãi "${offer.title}".`)
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

          {/* Right Column: Claimed Offer View Content (Col 9) */}
          <div className="lg:col-span-9 space-y-6">
            {/* 1. Member Golden VIP Profile & Points Card */}
            <StayeaClubTierCard
              profile={STAYEA_CLUB_PROFILE}
              onViewTiers={() => onNavigate?.("stayea-club")}
            />

            {/* 2. Success Alert Banner */}
            {showSuccessBanner && (
              <StayeaClubClaimedSuccessBanner
                onClose={() => setShowSuccessBanner(false)}
              />
            )}

            {/* 3. Main Split View: Left Content (Col 8) & Right Sidebar Widgets (Col 4) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Hero Offer Card + Terms & How-to-use (Col 8) */}
              <div className="lg:col-span-8 space-y-5">
                {/* 3a. Claimed Offer Hero Card */}
                <StayeaClubClaimedOfferHero
                  offer={STAYEA_CLUB_CLAIMED_OFFER}
                  onCopyCode={handleCopyCode}
                  onUseNow={handleUseNow}
                  onViewFlights={handleViewFlights}
                  onToggleFavorite={() => showToast("Đã cập nhật trạng thái yêu thích")}
                />

                {/* 3b. Terms of Use & How-to-use Panels */}
                <StayeaClubClaimedTermsAndGuide
                  terms={STAYEA_CLUB_CLAIMED_OFFER.terms}
                  steps={STAYEA_CLUB_CLAIMED_OFFER.steps}
                />
              </div>

              {/* Right Column: Info, Available Vouchers, Support (Col 4) */}
              <div className="lg:col-span-4">
                <StayeaClubClaimedSidebarWidgets
                  offer={STAYEA_CLUB_CLAIMED_OFFER}
                  onViewWallet={() => onNavigate?.("deals")}
                  onContactSupport={() => showToast("Đang kết nối trung tâm CSKH 24/7...")}
                />
              </div>
            </div>

            {/* 4. Bottom Section: Other Member Offers */}
            <StayeaClubOtherOffersSection
              onClaimOffer={handleClaimOtherOffer}
              onViewAllOffers={() => onNavigate?.("stayea-club")}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
