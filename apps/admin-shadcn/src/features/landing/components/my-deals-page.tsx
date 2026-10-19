"use client"

import * as React from "react"
import { CheckCircle2, X, Copy, Calendar, ShieldCheck, Ticket } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@workspace/ui/components/dialog"
import { ProfileSidebar } from "./profile-sidebar"
import { MyDealsHeroBanner } from "./my-deals-hero-banner"
import { MyDealsMetricsBar } from "./my-deals-metrics-bar"
import { MyDealsFeaturedBanner } from "./my-deals-featured-banner"
import { MyDealsFilterTabs } from "./my-deals-filter-tabs"
import type { DealCategoryFilter } from "./my-deals-filter-tabs"
import { MyDealVoucherCard } from "./my-deal-voucher-card"
import { MyDealsRecommendedSection } from "./my-deals-recommended-section"
import { MyDealsSupportBanner } from "./my-deals-support-banner"
import {
  MY_DEALS_METRICS,
  MY_VOUCHERS_LIST,
} from "@/features/landing/data/stayea-mock-data"
import type {
  MyVoucherItem,
  RecommendedDealItem,
} from "@/features/landing/data/stayea-mock-data"

interface MyDealsPageProps {
  readonly onNavigate?: (route: string) => void
}

export function MyDealsPage({ onNavigate }: MyDealsPageProps) {
  const [activeCategory, setActiveCategory] = React.useState<DealCategoryFilter>("all")
  const [searchQuery, setSearchQuery] = React.useState<string>("")
  const [selectedVoucher, setSelectedVoucher] = React.useState<MyVoucherItem | null>(null)
  const [toastMessage, setToastMessage] = React.useState<string | null>(null)

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

  function handleSaveRecommendedDeal(_id: string, title: string) {
    showToast(`Đã lưu ưu đãi "${title}" vào danh sách!`)
  }

  function handleViewRecommendedDeal(deal: RecommendedDealItem) {
    showToast(`Xem chi tiết ưu đãi: ${deal.title}`)
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
        // already here
        break
      case "staya-club":
      case "stayea-club":
        onNavigate?.("stayea-club")
        break
      case "settings":
      case "cai-dat":
        onNavigate?.("settings")
        break
      case "logout":
      case "dang-xuat":
        onNavigate?.("logout")
        break
      default:
        onNavigate?.(tabId)
    }
  }

  // Compute category counts
  const counts = React.useMemo(() => {
    return {
      all: 8,
      voucher: 3,
      discount: 2,
      member: 3,
      expired: 1,
    }
  }, [])

  // Filter vouchers list
  const filteredVouchers = React.useMemo(() => {
    return MY_VOUCHERS_LIST.filter((v) => {
      // 1. Filter by category
      if (activeCategory !== "all" && v.category !== activeCategory) {
        return false
      }
      // 2. Filter by search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim()
        const matchesTitle = v.title.toLowerCase().includes(query)
        const matchesCode = v.code.toLowerCase().includes(query)
        const matchesDesc = v.description.toLowerCase().includes(query)
        if (!matchesTitle && !matchesCode && !matchesDesc) {
          return false
        }
      }
      return true
    })
  }, [activeCategory, searchQuery])

  return (
    <div className="min-h-screen bg-white pb-16">
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

      {/* 1. Hero Panorama Banner */}
      <MyDealsHeroBanner />

      {/* 2. Main Page Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Profile Sidebar (Col 3) */}
          <div className="lg:col-span-3">
            <ProfileSidebar
              activeTab="deals"
              onSelectTab={handleSidebarSelect}
              hideBadges
            />
          </div>

          {/* Right Column: Main Content (Col 9) */}
          <div className="lg:col-span-9 space-y-6">
            {/* 1. 4 Metrics Cards */}
            <MyDealsMetricsBar
              metrics={MY_DEALS_METRICS}
              onNavigateToClub={() => onNavigate?.("stayea-club")}
            />

            {/* 2. Staya Club Featured Promo Banner */}
            <MyDealsFeaturedBanner
              onExploreClick={() => onNavigate?.("stayea-club")}
            />

            {/* 3. Filter Tabs & Search Bar */}
            <MyDealsFilterTabs
              activeCategory={activeCategory}
              onSelectCategory={setActiveCategory}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              counts={counts}
            />

            {/* 4. Voucher Cards Grid (5-column layout on desktop) */}
            {filteredVouchers.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3.5">
                {filteredVouchers.map((voucher) => (
                  <MyDealVoucherCard
                    key={voucher.id}
                    voucher={voucher}
                    onCopyCode={handleCopyCode}
                    onViewDetails={setSelectedVoucher}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-slate-50 border border-slate-200 rounded-2xl p-6">
                <Ticket className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-700">
                  Không tìm thấy ưu đãi phù hợp
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Vui lòng thử lại với từ khóa khác hoặc chuyển sang mục Tất cả.
                </p>
              </div>
            )}

            {/* 5. Gợi ý ưu đãi khác */}
            <MyDealsRecommendedSection
              onSaveDeal={handleSaveRecommendedDeal}
              onViewDeal={handleViewRecommendedDeal}
            />

            {/* 6. Support Banner */}
            <MyDealsSupportBanner
              onContactSupport={() => showToast("Đang kết nối tới tổng đài hỗ trợ STAYEA...")}
            />
          </div>
        </div>
      </div>

      {/* =========================================================================
          DIALOG MODAL: CHI TIẾT ƯU ĐÃI
      ========================================================================= */}
      <Dialog open={!!selectedVoucher} onOpenChange={(open) => !open && setSelectedVoucher(null)}>
        {selectedVoucher && (
          <DialogContent className="sm:max-w-md rounded-2xl p-6">
            <DialogHeader>
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                  {selectedVoucher.badgeText}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> HSD: {selectedVoucher.expiryDate}
                </span>
              </div>
              <DialogTitle className="text-base sm:text-lg font-bold text-[#0A2239]">
                {selectedVoucher.title}
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                {selectedVoucher.description}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 my-2">
              {/* Promo Code Box */}
              <div className="p-3.5 bg-slate-50 border border-dashed border-slate-300 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-500 block">Mã ưu đãi của bạn</span>
                  <span className="text-base font-mono font-black text-[#0A2239] tracking-wider">
                    {selectedVoucher.code}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyCode(selectedVoucher.code)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0A2239] hover:bg-[#071726] text-white text-xs font-semibold rounded-lg transition-all active:scale-95 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Sao chép</span>
                </button>
              </div>

              {/* Conditions / Terms */}
              <div className="space-y-2 text-xs">
                <div className="flex items-start gap-2 text-slate-700">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-800">Điều kiện áp dụng: </span>
                    <span className="text-slate-600">{selectedVoucher.terms}</span>
                  </div>
                </div>
                {selectedVoucher.minSpend && (
                  <div className="pl-6 text-[11px] text-slate-500">
                    • Giá trị tối thiểu: {selectedVoucher.minSpend}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedVoucher(null)}
                className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer"
              >
                Đóng
              </button>
              <button
                type="button"
                onClick={() => {
                  const code = (selectedVoucher.code || "").toUpperCase()
                  const title = (selectedVoucher.title || "").toLowerCase()
                  setSelectedVoucher(null)
                  if (code.includes("AIR") || code.includes("FLIGHT") || title.includes("máy bay") || title.includes("vé")) {
                    onNavigate?.("flight-booking")
                  } else if (code.includes("TOUR") || title.includes("tour") || title.includes("gói")) {
                    onNavigate?.("packages")
                  } else if (code.includes("EXP") || title.includes("trải nghiệm") || title.includes("lặn") || title.includes("câu cá")) {
                    onNavigate?.("experience")
                  } else {
                    onNavigate?.("stay")
                  }
                }}
                className="px-5 py-2 bg-[#0A2239] hover:bg-[#071726] text-white text-xs font-semibold rounded-xl shadow-xs transition-all cursor-pointer"
              >
                Sử dụng ngay
              </button>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
}
