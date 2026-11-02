"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import {
  Bell,
  Building,
  Car,
  CheckCircle2,
  ChevronDown,
  Compass,
  ExternalLink,
  Layers,
  LogOut,
  Plus,
  Shield,
  Sparkles,
  User,
} from "lucide-react"
import { getUser, clearAllAuth, type StoredUser } from "@/lib/token"
import { stayeaApi } from "@/lib/stayea-api-service"
import type { PartnerProfileData } from "../types"

interface PartnerHeaderProps {
  currentProfile: PartnerProfileData | null
  profiles: PartnerProfileData[]
  onSelectProfile: (profile: PartnerProfileData) => void
  activeTab: "overview" | "services" | "inventory" | "orders" | "settings"
  onSelectTab: (tab: "overview" | "services" | "inventory" | "orders" | "settings") => void
  pendingOrdersCount?: number
  onNavigateHome?: () => void
  onLogout?: () => void
  onAddPartner?: () => void
}

export function PartnerHeader({
  currentProfile,
  profiles,
  onSelectProfile,
  activeTab,
  onSelectTab,
  pendingOrdersCount = 0,
  onNavigateHome,
  onLogout,
  onAddPartner,
}: PartnerHeaderProps) {
  const [currentUser, setCurrentUser] = useState<StoredUser | null>(null)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isBranchMenuOpen, setIsBranchMenuOpen] = useState(false)

  useEffect(() => {
    setCurrentUser(getUser())
  }, [])

  const handleInternalLogout = async () => {
    if (onLogout) {
      onLogout()
      return
    }
    try {
      await stayeaApi.logout()
    } catch {}
    clearAllAuth()
    window.location.href = "/login"
  }

  const displayName =
    currentUser?.displayName ||
    currentUser?.name ||
    (currentUser?.email ? currentUser.email.split("@")[0] : null) ||
    currentProfile?.contactName ||
    "Đối tác STAYEA"

  const displayEmail = currentUser?.email || currentProfile?.email || ""
  const getServiceTypeIcon = (type?: string) => {
    switch (type) {
      case "homestay":
        return <Building className="w-4 h-4 text-emerald-400" />
      case "transport":
        return <Car className="w-4 h-4 text-blue-400" />
      case "tour":
        return <Compass className="w-4 h-4 text-amber-400" />
      default:
        return <Layers className="w-4 h-4 text-teal-400" />
    }
  }

  const getServiceTypeBadge = (type?: string) => {
    switch (type) {
      case "homestay":
        return "Homestay & Villa Nghỉ Dưỡng"
      case "transport":
        return "Đội Xe Tự Lái & Đưa Đón"
      case "tour":
        return "Tour Trải Nghiệm & Canô"
      default:
        return "Đối Tác Đa Dịch Vụ"
    }
  }

  return (
    <header className="sticky top-0 z-40 bg-[#061816]/95 backdrop-blur-md border-b border-emerald-900/40 text-white">
      {/* Top Bar: Brand, Partner Switcher & Quick Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Portal Name */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onNavigateHome}
              className="flex items-center gap-2.5 group transition-transform hover:scale-105"
            >
              <Image
                src="/stayea.png"
                alt="STAYEA Logo"
                width={32}
                height={32}
                className="w-8 h-8 rounded-lg object-contain shadow-xs"
              />
              <span className="font-serif text-2xl font-bold tracking-widest text-emerald-400">
                STAYEA
              </span>
              <span className="px-2 py-0.5 text-xs font-semibold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/30">
                PARTNER HUB
              </span>
            </button>

            {/* Profile Switcher or Add Partner Button */}
            {currentProfile ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsBranchMenuOpen(!isBranchMenuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-800/40 hover:border-emerald-500/50 text-xs text-slate-200 transition-all cursor-pointer"
                  title="Chuyển đổi hoặc thêm chi nhánh"
                >
                  {getServiceTypeIcon(currentProfile.businessType)}
                  <span className="font-medium max-w-[140px] sm:max-w-[220px] truncate">
                    {currentProfile.businessName}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-emerald-400 transition-transform ${isBranchMenuOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Dropdown Menu */}
                {isBranchMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsBranchMenuOpen(false)}
                    />
                    <div className="absolute left-0 mt-1.5 w-72 sm:w-80 bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl py-2 z-50">
                      <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between border-b border-slate-800/80 mb-1">
                        <span>Cơ sở đối tác ({profiles.length})</span>
                        <span className="text-emerald-400 font-normal">Đang hoạt động</span>
                      </div>
                      <div className="max-h-60 overflow-y-auto">
                        {profiles.map((p) => (
                          <button
                            type="button"
                            key={p.id}
                            onClick={() => {
                              onSelectProfile(p)
                              setIsBranchMenuOpen(false)
                            }}
                            className={`w-full text-left px-3 py-2.5 flex items-start gap-2.5 text-xs hover:bg-emerald-950/80 transition-colors ${
                              p.id === currentProfile.id
                                ? "bg-emerald-900/40 text-emerald-300 font-semibold"
                                : "text-slate-300"
                            }`}
                          >
                            <span className="mt-0.5">{getServiceTypeIcon(p.businessType)}</span>
                            <div className="flex-1 truncate">
                              <div className="truncate text-xs">{p.businessName}</div>
                              <div className="text-[10px] text-slate-400 mt-0.5">
                                {getServiceTypeBadge(p.businessType)}
                              </div>
                            </div>
                            {p.id === currentProfile.id && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                            )}
                          </button>
                        ))}
                      </div>

                      {/* Add Branch Button inside Dropdown */}
                      <div className="pt-2 mt-1 border-t border-slate-800/80 px-2">
                        <button
                          type="button"
                          onClick={() => {
                            setIsBranchMenuOpen(false)
                            if (onAddPartner) onAddPartner()
                          }}
                          className="w-full text-left px-3 py-2 flex items-center gap-2 text-xs text-emerald-400 hover:bg-emerald-950/60 rounded-lg transition-colors font-medium border border-dashed border-emerald-800/60 hover:border-emerald-500/60"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>+ Thêm cơ sở / chi nhánh mới</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={onAddPartner}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-800/40 text-xs text-emerald-300 hover:bg-emerald-900/60 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Đăng ký cơ sở đối tác</span>
              </button>
            )}
          </div>

          {/* Right Area: Status Badge & Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Status Pill */}
            {currentProfile ? (
              <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>
                  {currentProfile.status === "approved"
                    ? "Đối tác đã xác thực"
                    : currentProfile.status === "pending"
                    ? "Chờ duyệt"
                    : "Tạm dừng"}
                </span>
              </div>
            ) : (
              <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-400 text-xs">
                <span>Chưa có cơ sở</span>
              </div>
            )}

            {/* Notification Bell */}
            <button
              type="button"
              onClick={() => onSelectTab("orders")}
              className="relative p-2 rounded-lg bg-emerald-950/50 border border-emerald-800/40 hover:bg-emerald-900/40 text-slate-300 transition-colors"
              title="Đơn hàng chờ xử lý"
            >
              <Bell className="w-4 h-4 text-emerald-300" />
              {pendingOrdersCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow">
                  {pendingOrdersCount}
                </span>
              )}
            </button>

            {/* Jump to Customer View */}
            <button
              type="button"
              onClick={onNavigateHome || (() => window.open("https://stayea.com", "_blank"))}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-900/30 hover:bg-emerald-900/60 text-xs text-emerald-300 border border-emerald-800/40 transition-colors"
              title="Xem trang khách hàng Stayea.com"
            >
              <span>Xem Trang Khách</span>
              <ExternalLink className="w-3 h-3" />
            </button>

            {/* User Profile Pill & Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1 rounded-lg bg-slate-800/70 hover:bg-slate-700/80 border border-slate-700/60 text-xs text-slate-200 transition-colors"
                title="Menu tài khoản"
              >
                <div className="w-6 h-6 rounded-full bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center text-emerald-300 font-bold text-xs overflow-hidden shrink-0">
                  {currentUser?.avatarUrl ? (
                    <Image
                      src={currentUser.avatarUrl}
                      alt={displayName}
                      width={24}
                      height={24}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{displayName.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <div className="hidden sm:flex flex-col text-left max-w-[120px]">
                  <span className="font-semibold text-slate-200 text-xs leading-none truncate">
                    {displayName}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-medium leading-tight mt-0.5 truncate">
                    Đối tác
                  </span>
                </div>
                <ChevronDown className="w-3 h-3 text-slate-400 hidden sm:block" />
              </button>

              {/* Profile Dropdown */}
              {isUserMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsUserMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="p-3 bg-slate-800/60 rounded-lg mb-1.5 border border-slate-700/40">
                      <p className="text-xs font-bold text-white leading-tight truncate">
                        {displayName}
                      </p>
                      <p className="text-[11px] text-slate-400 font-medium truncate mt-0.5">
                        {displayEmail}
                      </p>
                      <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-950 text-emerald-400 text-[10px] font-bold rounded border border-emerald-800/40">
                        <Shield className="w-3 h-3 text-emerald-400" />
                        <span>Tài khoản Đối tác</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setIsUserMenuOpen(false)
                        onSelectTab("settings")
                      }}
                      className="w-full px-3 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg flex items-center gap-2 transition-colors text-left"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      <span>Thông tin & Cài đặt đối tác</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsUserMenuOpen(false)
                        if (onNavigateHome) onNavigateHome()
                        else window.open("https://stayea.com", "_blank")
                      }}
                      className="w-full px-3 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg flex items-center gap-2 transition-colors text-left"
                    >
                      <ExternalLink className="w-4 h-4 text-emerald-400" />
                      <span>Xem trang khách StayEA</span>
                    </button>

                    <div className="my-1.5 border-t border-slate-800" />

                    <button
                      type="button"
                      onClick={() => {
                        setIsUserMenuOpen(false)
                        handleInternalLogout()
                      }}
                      className="w-full px-3 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-950/50 hover:text-rose-300 rounded-lg flex items-center gap-2 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4 text-rose-400" />
                      <span>Đăng xuất tài khoản</span>
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Standalone Quick Logout Button */}
            <button
              type="button"
              onClick={handleInternalLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 hover:text-white border border-rose-800/50 text-xs font-semibold transition-all shadow-xs cursor-pointer"
              title="Đăng xuất khỏi hệ thống"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-400" />
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs Bar */}
      <div className="bg-[#040e0d] border-t border-emerald-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1 sm:space-x-4 overflow-x-auto py-2 no-scrollbar">
            <button
              type="button"
              onClick={() => onSelectTab("overview")}
              className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${
                activeTab === "overview"
                  ? "bg-emerald-600/30 text-emerald-300 border border-emerald-500/40"
                  : "text-slate-400 hover:text-slate-200 hover:bg-emerald-950/30"
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Tổng quan</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectTab("services")}
              className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${
                activeTab === "services"
                  ? "bg-emerald-600/30 text-emerald-300 border border-emerald-500/40"
                  : "text-slate-400 hover:text-slate-200 hover:bg-emerald-950/30"
              }`}
            >
              {getServiceTypeIcon(currentProfile?.businessType)}
              <span>Quản lý Dịch vụ</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectTab("inventory")}
              className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${
                activeTab === "inventory"
                  ? "bg-emerald-600/30 text-emerald-300 border border-emerald-500/40"
                  : "text-slate-400 hover:text-slate-200 hover:bg-emerald-950/30"
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Lịch & Tồn kho</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectTab("orders")}
              className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-2 relative ${
                activeTab === "orders"
                  ? "bg-emerald-600/30 text-emerald-300 border border-emerald-500/40"
                  : "text-slate-400 hover:text-slate-200 hover:bg-emerald-950/30"
              }`}
            >
              <Bell className="w-4 h-4" />
              <span>Tiếp nhận Đơn hàng</span>
              {pendingOrdersCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-rose-500 text-[10px] font-bold text-white">
                  {pendingOrdersCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => onSelectTab("settings")}
              className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${
                activeTab === "settings"
                  ? "bg-emerald-600/30 text-emerald-300 border border-emerald-500/40"
                  : "text-slate-400 hover:text-slate-200 hover:bg-emerald-950/30"
              }`}
            >
              <User className="w-4 h-4" />
              <span>Quyết toán & Cài đặt</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  )
}
