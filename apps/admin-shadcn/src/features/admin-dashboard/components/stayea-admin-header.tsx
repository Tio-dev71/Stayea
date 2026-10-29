"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import {
  Search,
  Bell,
  MessageSquare,
  Menu,
  LogOut,
  Settings,
  ChevronDown,
  User,
  Shield,
} from "lucide-react"
import { getUser, removeToken, removeUser } from "@/lib/token"
import { stayeaApi } from "@/lib/stayea-api-service"

interface StayeaAdminHeaderProps {
  searchPlaceholder?: string
  onSearch?: (query: string) => void
  onNavigateLanding?: () => void
  onToggleSidebar?: () => void
  onLogout?: () => void
  userName?: string
  userRole?: string
}

export function StayeaAdminHeader({
  searchPlaceholder = "Tìm kiếm đặt phòng, khách hàng, bất động sản, đối tác...",
  onSearch,
  onNavigateLanding,
  onToggleSidebar,
  onLogout,
  userName = "Quản trị viên",
  userRole = "Administrator",
}: StayeaAdminHeaderProps) {
  const [searchVal, setSearchVal] = useState("")
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [currentAdminUser, setCurrentAdminUser] = useState<{
    name: string
    email: string
  }>({
    name: userName,
    email: "admin@example.com",
  })

  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const u = getUser()
    if (u) {
      setCurrentAdminUser({
        name: (u as any).name || (u as any).displayName || u.email.split("@")[0],
        email: u.email,
      })
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsProfileMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleDefaultLogout = () => {
    if (onLogout) {
      onLogout()
      return
    }
    stayeaApi.logout()
    removeToken()
    removeUser()
    window.location.href = "/login"
  }

  return (
    <header className="sticky top-0 z-40 w-full h-16 bg-white border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* 1. Left: Hamburger Menu & Brand Logo */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label="Toggle menu"
          className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={
            onNavigateLanding ||
            (() => {
              window.open("https://stayea.com", "_blank")
            })
          }
          className="flex items-center gap-2.5 text-left group"
          title="Về trang chủ Stayea (Tab mới)"
        >
          {/* Custom Green House Icon */}
          <div className="w-9 h-9 rounded-xl bg-[#1b7a4e] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-sans text-lg font-bold text-slate-900 leading-tight tracking-tight">
              Stayea<span className="text-slate-500 font-normal">.com</span>
            </span>
            <span className="text-[10px] text-emerald-700 font-semibold leading-none">
              Quản trị viên
            </span>
          </div>
        </button>
      </div>

      {/* 2. Middle: Large Search Input */}
      <div className="flex-1 max-w-xl mx-4 hidden md:block">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            value={searchVal}
            onChange={(e) => {
              setSearchVal(e.target.value)
              onSearch?.(e.target.value)
            }}
            placeholder={searchPlaceholder}
            className="w-full bg-slate-100/70 hover:bg-slate-100 focus:bg-white text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 rounded-xl pl-9 pr-4 py-2 border border-transparent focus:border-emerald-300 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all shadow-xs"
          />
        </div>
      </div>

      {/* 3. Right: Notifications, Messages & Profile */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Notification Bell with Badge */}
        <button
          type="button"
          aria-label="Thông báo"
          onClick={() => {
            window.location.href = "/stayea/bookings"
          }}
          className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-emerald-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none shadow-xs">
            2
          </span>
        </button>

        {/* Message Bubble Icon */}
        <button
          type="button"
          aria-label="Tin nhắn"
          onClick={() => {
            window.location.href = "/stayea/messages"
          }}
          className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
        >
          <MessageSquare className="w-5 h-5" />
        </button>

        {/* User Profile Pill & Dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setIsProfileMenuOpen((prev) => !prev)}
            className="flex items-center gap-2.5 pl-2 py-1 pr-1.5 rounded-xl border-l border-slate-200 hover:bg-slate-50 transition-colors"
          >
            <div className="relative w-9 h-9 rounded-full overflow-hidden ring-1 ring-slate-200 shrink-0">
              <Image
                src="/about/team-1.jpg"
                alt={currentAdminUser.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold text-slate-800 leading-tight">
                {currentAdminUser.name}
              </span>
              <span className="text-[10px] text-emerald-600 font-semibold leading-none">
                {userRole}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* Profile Dropdown Menu */}
          {isProfileMenuOpen && (
            <div className="absolute right-0 top-12 w-64 bg-white rounded-2xl shadow-xl border border-slate-200/80 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="p-3 bg-slate-50 rounded-xl mb-1.5">
                <p className="text-xs font-bold text-slate-900 leading-tight">
                  {currentAdminUser.name}
                </p>
                <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                  {currentAdminUser.email}
                </p>
                <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-[#1b7a4e] text-[10px] font-bold rounded-md">
                  <Shield className="w-3 h-3" />
                  <span>Quyền Quản trị viên (ADMIN)</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsProfileMenuOpen(false)
                  window.location.href = "/settings"
                }}
                className="w-full px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-xl flex items-center gap-2 transition-colors"
              >
                <Settings className="w-4 h-4 text-slate-500" />
                <span>Cài đặt hệ thống</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsProfileMenuOpen(false)
                  window.location.href = "/hub"
                }}
                className="w-full px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-xl flex items-center gap-2 transition-colors"
              >
                <User className="w-4 h-4 text-slate-500" />
                <span>Cổng đối tác & Chủ nhà (Hub)</span>
              </button>

              <div className="my-1.5 border-t border-slate-100" />

              <button
                type="button"
                onClick={handleDefaultLogout}
                className="w-full px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl flex items-center gap-2 transition-colors"
              >
                <LogOut className="w-4 h-4 text-rose-500" />
                <span>Đăng xuất hệ thống</span>
              </button>
            </div>
          )}
        </div>

        {/* Quick Logout Button */}
        <button
          type="button"
          onClick={handleDefaultLogout}
          title="Đăng xuất khỏi hệ thống"
          className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
          aria-label="Đăng xuất"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  )
}

