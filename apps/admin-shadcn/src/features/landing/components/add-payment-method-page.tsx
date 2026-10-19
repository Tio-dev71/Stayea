"use client"

import * as React from "react"
import { CheckCircle2, X } from "lucide-react"
import { ProfileSidebar } from "./profile-sidebar"
import { PaymentMethodsHeroBanner } from "./payment-methods-hero-banner"
import { AddPaymentMethodBreadcrumb } from "./add-payment-method-breadcrumb"
import { AddPaymentMethodSelector } from "./add-payment-method-selector"
import { AddPaymentCardForm } from "./add-payment-card-form"
import type { NewPaymentMethodPayload } from "./add-payment-card-form"
import { AddPaymentBenefitsCard } from "./add-payment-benefits-card"
import { AddPaymentAcceptedMethodsCard } from "./add-payment-accepted-methods-card"

interface AddPaymentMethodPageProps {
  readonly onNavigate?: (route: string) => void
}

export function AddPaymentMethodPage({ onNavigate }: AddPaymentMethodPageProps) {
  const [selectedType, setSelectedType] = React.useState<"card" | "bank" | "wallet">("card")
  const [toastMessage, setToastMessage] = React.useState<string | null>(null)

  function showToast(msg: string) {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage(null)
    }, 4000)
  }

  function handleCancel() {
    onNavigate?.("payment")
  }

  function handleSubmit(data: NewPaymentMethodPayload) {
    if (data.type === "card") {
      showToast(`Đã thêm thẻ ${data.cardBrand?.toUpperCase() || "mới"} thành công!`)
    } else if (data.type === "bank") {
      showToast(`Đã liên kết tài khoản ngân hàng ${data.bankName} thành công!`)
    } else {
      showToast(`Đã liên kết ví điện tử ${data.walletType} thành công!`)
    }

    setTimeout(() => {
      onNavigate?.("payment")
    }, 1200)
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
      case "logout":
      case "dang-xuat":
        onNavigate?.("logout")
        break
      default:
        onNavigate?.(tabId)
    }
  }

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
      <PaymentMethodsHeroBanner />

      {/* 2. Main Page Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Profile Sidebar (Col 3) */}
          <div className="lg:col-span-3">
            <ProfileSidebar
              activeTab="payment"
              onSelectTab={handleSidebarSelect}
              hideBadges
            />
          </div>

          {/* Right Column: Main Content (Col 9) */}
          <div className="lg:col-span-9 space-y-5">
            {/* Breadcrumb */}
            <AddPaymentMethodBreadcrumb onNavigate={onNavigate} />

            {/* Page Header */}
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#0A2239]">
                Thêm phương thức thanh toán
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Lưu phương thức thanh toán để đặt dịch vụ nhanh chóng và an toàn hơn.
              </p>
            </div>

            {/* 2-Column Split: Form (Col 8) + Benefits & Accepted Methods (Col 4) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start pt-2">
              {/* Form Stack (Col 8) */}
              <div className="lg:col-span-8 space-y-6">
                {/* Method Type Selector Cards */}
                <AddPaymentMethodSelector
                  selectedType={selectedType}
                  onSelectType={setSelectedType}
                />

                {/* Form Content (Seamless on clean white canvas) */}
                <AddPaymentCardForm
                  selectedType={selectedType}
                  onCancel={handleCancel}
                  onSubmit={handleSubmit}
                />
              </div>

              {/* Right Stack: Benefits & Accepted Methods (Col 4) */}
              <div className="lg:col-span-4 space-y-6">
                {/* Benefits Card */}
                <AddPaymentBenefitsCard />

                {/* Accepted Payment Methods Card */}
                <AddPaymentAcceptedMethodsCard />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
