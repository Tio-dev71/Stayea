"use client"

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
  Shield,
  Sparkles,
  User,
} from "lucide-react"
import type { PartnerProfileData } from "../types"

interface PartnerHeaderProps {
  currentProfile: PartnerProfileData
  profiles: PartnerProfileData[]
  onSelectProfile: (profile: PartnerProfileData) => void
  activeTab: "overview" | "services" | "inventory" | "orders" | "settings"
  onSelectTab: (tab: "overview" | "services" | "inventory" | "orders" | "settings") => void
  pendingOrdersCount?: number
  onNavigateHome?: () => void
  onNavigateAdmin?: () => void
  onLogout?: () => void
}

export function PartnerHeader({
  currentProfile,
  profiles,
  onSelectProfile,
  activeTab,
  onSelectTab,
  pendingOrdersCount = 0,
  onNavigateHome,
  onNavigateAdmin,
  onLogout,
}: PartnerHeaderProps) {
  const getServiceTypeIcon = (type: string) => {
    switch (type) {
      case "homestay":
        return <Building className="w-4 h-4 text-emerald-600" />
      case "transport":
        return <Car className="w-4 h-4 text-blue-600" />
      case "tour":
        return <Compass className="w-4 h-4 text-amber-600" />
      default:
        return <Layers className="w-4 h-4 text-teal-600" />
    }
  }

  const getServiceTypeBadge = (type: string) => {
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
              onClick={onNavigateHome}
              className="flex items-center gap-2 group transition-transform hover:scale-105"
            >
              <span className="font-serif text-2xl font-bold tracking-widest text-emerald-400">
                STAYEA
              </span>
              <span className="px-2 py-0.5 text-xs font-semibold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/30">
                PARTNER HUB
              </span>
            </button>

            {/* Quick Profile Switcher (Demo selector) */}
            <div className="relative group hidden sm:block">
              <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-800/40 hover:border-emerald-500/50 text-xs text-slate-200 transition-all">
                {getServiceTypeIcon(currentProfile.businessType)}
                <span className="font-medium max-w-[200px] truncate">
                  {currentProfile.businessName}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-emerald-400 group-hover:rotate-180 transition-transform" />
              </button>

              {/* Dropdown Menu */}
              <div className="absolute left-0 mt-1 w-72 bg-slate-900 border border-slate-700/80 rounded-xl shadow-xl py-2 hidden group-hover:block z-50">
                <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Chuyển nhanh mô hình đối tác:
                </div>
                {profiles.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => onSelectProfile(p)}
                    className={`w-full text-left px-3 py-2 flex items-start gap-2.5 text-xs hover:bg-emerald-950/80 transition-colors ${
                      p.id === currentProfile.id ? "bg-emerald-900/40 text-emerald-300 font-semibold" : "text-slate-300"
                    }`}
                  >
                    <span className="mt-0.5">{getServiceTypeIcon(p.businessType)}</span>
                    <div className="flex-1 truncate">
                      <div className="truncate">{p.businessName}</div>
                      <div className="text-[10px] text-slate-400">{getServiceTypeBadge(p.businessType)}</div>
                    </div>
                    {p.id === currentProfile.id && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Area: Status Badge & Actions */}
          <div className="flex items-center gap-3">
            {/* Status Pill */}
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Đối tác đã xác thực</span>
            </div>

            {/* Notification Bell with Badge */}
            <button
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

            {/* Jump to Admin Portal */}
            {onNavigateAdmin && (
              <button
                onClick={onNavigateAdmin}
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-xs text-slate-200 border border-slate-700 transition-colors"
              >
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                <span>Cổng Quản Trị Admin</span>
              </button>
            )}

            {/* Jump to Customer View */}
            {onNavigateHome && (
              <button
                onClick={onNavigateHome}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-900/30 hover:bg-emerald-900/60 text-xs text-emerald-300 border border-emerald-800/40 transition-colors"
              >
                <span>Xem Trang Khách</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            )}

            {/* Logout / Exit */}
            {onLogout && (
              <button
                onClick={onLogout}
                className="p-2 rounded-lg bg-slate-800/60 hover:bg-rose-950/50 hover:text-rose-400 text-slate-400 border border-slate-700/50 transition-colors"
                title="Đăng xuất"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs Bar */}
      <div className="bg-[#040e0d] border-t border-emerald-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1 sm:space-x-4 overflow-x-auto py-2 no-scrollbar">
            <button
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
              onClick={() => onSelectTab("services")}
              className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${
                activeTab === "services"
                  ? "bg-emerald-600/30 text-emerald-300 border border-emerald-500/40"
                  : "text-slate-400 hover:text-slate-200 hover:bg-emerald-950/30"
              }`}
            >
              {getServiceTypeIcon(currentProfile.businessType)}
              <span>Quản lý Dịch vụ</span>
            </button>

            <button
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
