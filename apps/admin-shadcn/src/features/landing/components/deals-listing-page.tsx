"use client"

import * as React from "react"
import Image from "next/image"
import { X, Check, Copy } from "lucide-react"
import { DealsHero } from "./deals-hero"
import { DealsCategoryTabs } from "./deals-category-tabs"
import { DealsPromoBanner } from "./deals-promo-banner"
import { DealsFeaturedSection } from "./deals-featured-section"
import { DealsCategoriesGrid } from "./deals-categories-grid"
import { DealsValueBar } from "./deals-value-bar"
import type {
  DealsFeaturedCard,
  DealsCategoryItem,
} from "@/features/landing/data/stayea-mock-data"

export interface DealsListingPageProps {
  readonly onNavigate?: (route: string) => void
  readonly initialTab?: string
}

export function DealsListingPage({ onNavigate, initialTab }: DealsListingPageProps = {}) {
  const [activeTab, setActiveTab] = React.useState<string>(initialTab || "all")

  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab)
    }
  }, [initialTab])
  const [selectedCard, setSelectedCard] = React.useState<DealsFeaturedCard | null>(null)
  const [selectedCategory, setSelectedCategory] = React.useState<DealsCategoryItem | null>(null)
  const [showClubModal, setShowClubModal] = React.useState<boolean>(false)
  const [copiedCode, setCopiedCode] = React.useState<boolean>(false)

  function handleCopyPromoCode(code: string) {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      void navigator.clipboard.writeText(code)
      setCopiedCode(true)
      setTimeout(() => setCopiedCode(false), 2000)
    }
  }

  return (
    <div className="w-full bg-[#f8fafc] min-h-screen pb-20">
      {/* 1. Deals Hero Section */}
      <DealsHero />

      {/* 2. Main Page Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Category Tabs Bar */}
        <DealsCategoryTabs
          activeTab={activeTab}
          onTabChange={(tabId) => {
            setActiveTab(tabId)
          }}
        />

        {/* Promo Hero Banner + Staya Club Card */}
        <DealsPromoBanner
          onExploreClick={() => {
            const el = document.querySelector("#featured-deals")
            if (el) {
              el.scrollIntoView({ behavior: "smooth" })
            }
          }}
          onJoinClubClick={() => setShowClubModal(true)}
        />

        {/* Featured Deals Section */}
        <div id="featured-deals">
          <DealsFeaturedSection
            onCardSelect={(card) => setSelectedCard(card)}
            onViewAll={() => setActiveTab("all")}
          />
        </div>

        {/* Deals by Category Section */}
        <DealsCategoriesGrid
          onCategorySelect={(cat) => setSelectedCategory(cat)}
          onViewAll={() => setActiveTab("all")}
        />

        {/* Bottom 4 Trust Value Pillars */}
        <DealsValueBar />
      </div>

      {/* 1. Modal: Featured Deal Detail & Voucher Code */}
      {selectedCard && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              type="button"
              onClick={() => {
                setSelectedCard(null)
                setCopiedCode(false)
              }}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/80 backdrop-blur-xs flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-white shadow-2xs"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="aspect-16/9 w-full relative overflow-hidden">
              <Image
                src={selectedCard.imageUrl}
                alt={selectedCard.title}
                fill
                unoptimized
                className="object-cover"
              />
              <span
                className={`absolute top-4 left-4 px-2.5 py-1 rounded-md text-xs font-bold text-white shadow-xs ${selectedCard.discountColor}`}
              >
                {selectedCard.discount}
              </span>
            </div>

            <div className="p-6">
              <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-md">
                {selectedCard.category}
              </span>

              <h3 className="text-lg font-bold text-slate-900 mt-2 mb-1">
                {selectedCard.title} {selectedCard.highlight ?? ""}
              </h3>
              <p className="text-xs text-slate-500 mb-5">{selectedCard.subtitle}</p>

              {/* Voucher Box */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between mb-5">
                <div>
                  <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                    Mã ưu đãi độc quyền
                  </div>
                  <div className="text-base font-black text-slate-900 font-mono tracking-wider">
                    STAYEA{selectedCard.discount.replaceAll(/[^0-9]/g, "")}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    handleCopyPromoCode(
                      `STAYEA${selectedCard.discount.replaceAll(/[^0-9]/g, "")}`
                    )
                  }
                  className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  {copiedCode ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Đã sao chép</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Sao chép</span>
                    </>
                  )}
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  const cat = (selectedCard.category || "").toLowerCase()
                  const title = (selectedCard.title || "").toLowerCase()
                  setSelectedCard(null)
                  let targetRoute = "stay"
                  if (cat.includes("bay") || cat.includes("chuyển") || title.includes("bay")) {
                    targetRoute = "flight-booking"
                  } else if (cat.includes("tour") || cat.includes("gói") || title.includes("gói")) {
                    targetRoute = "packages"
                  } else if (cat.includes("nghiệm") || title.includes("trải nghiệm")) {
                    targetRoute = "experience"
                  }
                  if (onNavigate) {
                    onNavigate(targetRoute)
                  } else {
                    window.location.hash = targetRoute
                  }
                }}
                className="w-full h-11 rounded-xl bg-[#0A2239] hover:bg-[#071626] text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <span>Áp dụng và đặt ngay</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Modal: Category Selected Detail */}
      {selectedCategory && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in-95 duration-200 text-center">
            <button
              type="button"
              onClick={() => setSelectedCategory(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:text-slate-900"
            >
              <X className="w-4 h-4" />
            </button>

            <div
              className={`w-12 h-12 rounded-2xl mx-auto flex items-center justify-center mb-3 ${selectedCategory.bgClass} ${selectedCategory.textClass}`}
            >
              <Check className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-slate-900 mb-1">
              Ưu đãi danh mục {selectedCategory.label}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              {selectedCategory.discountText} đang được kích hoạt cho các dịch vụ được tuyển chọn bởi STAYEA.
            </p>

            <button
              type="button"
              onClick={() => setSelectedCategory(null)}
              className="w-full h-10 rounded-xl bg-[#0A2239] text-white text-xs font-semibold"
            >
              Đã hiểu
            </button>
          </div>
        </div>
      )}

      {/* 3. Modal: Staya Club Member Registration */}
      {showClubModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFF9F0] border border-[#FDE6C8] rounded-3xl max-w-md w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              type="button"
              onClick={() => setShowClubModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-600 hover:text-slate-900 shadow-2xs"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-3">
                <Check className="w-6 h-6 stroke-[3]" />
              </div>

              <h3 className="text-lg font-extrabold text-slate-900 mb-1">
                Chào mừng bạn đến với Staya Club
              </h3>
              <p className="text-xs text-slate-600 mb-5 leading-relaxed">
                Đặc quyền giảm thêm 10-15%, tích điểm nâng hạng phòng và hỗ trợ riêng 24/7 từ đội ngũ chăm sóc khách hàng STAYEA.
              </p>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowClubModal(false)}
                  className="flex-1 h-10 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors"
                >
                  Đóng
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowClubModal(false)
                    if (onNavigate) {
                      onNavigate("stayea-club")
                    } else {
                      window.location.hash = "stayea-club"
                    }
                  }}
                  className="flex-1 h-10 rounded-xl bg-[#0A2239] text-white text-xs font-semibold hover:bg-[#071626] transition-colors"
                >
                  Khám phá Club
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
