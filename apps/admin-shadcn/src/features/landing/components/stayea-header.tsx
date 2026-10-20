"use client"

import * as React from "react"
import Link from "next/link"
import { LayoutDashboard, ChevronDown, ArrowRight, Menu, X, Search, Bell, User, LogOut, Settings, Heart, Calendar, Gift, Crown, CreditCard, CheckCircle2, Clock } from "lucide-react"
import Image from "next/image"
import { NAV_ITEMS } from "@/features/landing/data/stayea-mock-data"
import { StayMegaMenu } from "./stay-mega-menu"
import { ExperienceMegaMenu } from "./experience-mega-menu"
import { TransportMegaMenu } from "./transport-mega-menu"
import { ExploreMegaMenu } from "./explore-mega-menu"
import { DealsMegaMenu } from "./deals-mega-menu"
import { PackageMegaMenu } from "./package-mega-menu"

interface StayeaHeaderProps {
  readonly activeDropdown?: string | null
  readonly onSelectDropdown?: (dropdown: string | null) => void
  readonly activeItem?: string
  readonly onNavigate?: (item: string) => void
  readonly onDropdownEnter?: (dropdown: string) => void
  readonly onDropdownLeave?: () => void
  readonly isLoggedIn?: boolean
  readonly currentUser?: {
    readonly name: string
    readonly email?: string
    readonly avatarUrl: string
    readonly notificationsCount?: number
  }
}

export function StayeaHeader({
  activeDropdown: externalActiveDropdown,
  onSelectDropdown,
  activeItem = "Trang chủ",
  onNavigate,
  onDropdownEnter,
  onDropdownLeave,
  isLoggedIn = false,
  currentUser = {
    name: "Nguyễn Minh",
    email: "nguyenminh@gmail.com",
    avatarUrl: "/profile/profile-avatar.jpg",
    notificationsCount: 3,
  },
}: StayeaHeaderProps = {}) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const [userDropdownOpen, setUserDropdownOpen] = React.useState(false)
  const [notificationOpen, setNotificationOpen] = React.useState(false)
  const userMenuRef = React.useRef<HTMLDivElement | null>(null)
  const notifMenuRef = React.useRef<HTMLDivElement | null>(null)

  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false)
      }
      if (notifMenuRef.current && !notifMenuRef.current.contains(e.target as Node)) {
        setNotificationOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])
  const [internalActiveDropdown, setInternalActiveDropdown] = React.useState<string | null>(null)
  const internalTimerRef = React.useRef<NodeJS.Timeout | null>(null)

  const activeDropdown = externalActiveDropdown === undefined ? internalActiveDropdown : externalActiveDropdown
  const setActiveDropdown = onSelectDropdown ?? setInternalActiveDropdown

  const headerRef = React.useRef<HTMLElement>(null)

  const handleDropdownHover = React.useCallback(
    (label: string) => {
      if (internalTimerRef.current) {
        clearTimeout(internalTimerRef.current)
        internalTimerRef.current = null
      }
      if (onDropdownEnter) {
        onDropdownEnter(label)
      } else {
        setActiveDropdown(label)
      }
    },
    [onDropdownEnter, setActiveDropdown]
  )

  const handleHeaderLeave = React.useCallback(() => {
    if (onDropdownLeave) {
      onDropdownLeave()
    } else {
      if (internalTimerRef.current) {
        clearTimeout(internalTimerRef.current)
      }
      internalTimerRef.current = setTimeout(() => {
        setActiveDropdown(null)
      }, 300)
    }
  }, [onDropdownLeave, setActiveDropdown])

  const handleNonDropdownHover = React.useCallback(() => {
    if (onDropdownLeave) {
      onDropdownLeave()
    } else {
      setActiveDropdown(null)
    }
  }, [onDropdownLeave, setActiveDropdown])

  const handleCancelClose = React.useCallback(() => {
    if (internalTimerRef.current) {
      clearTimeout(internalTimerRef.current)
      internalTimerRef.current = null
    }
  }, [])

  // Close dropdown on Escape key
  React.useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActiveDropdown(null)
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      if (internalTimerRef.current) {
        clearTimeout(internalTimerRef.current)
      }
    }
  }, [setActiveDropdown])

  return (
    <header
      ref={headerRef}
      onMouseLeave={handleHeaderLeave}
      className="sticky top-0 z-50 w-full bg-white/98 backdrop-blur-md border-b border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.05)]"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-[70px] flex items-center justify-between gap-2 xl:gap-3 relative">
        {/* Brand Logo */}
        <Link
          href="/"
          onClick={(e) => {
            if (onNavigate) {
              e.preventDefault()
              onNavigate("Trang chủ")
            }
          }}
          className="flex flex-col items-start select-none group shrink-0"
        >
          <span className="font-brand text-xl sm:text-2xl font-bold tracking-[0.2em] text-[#0c3b40] group-hover:text-[#072528] transition-colors">
            STAYEA
          </span>
          <span className="text-[7px] uppercase tracking-[0.24em] font-semibold text-slate-500 -mt-0.5">
            MORE THAN A STAY
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 text-[12px] text-slate-700 whitespace-nowrap">
          {NAV_ITEMS.map((item) => {
            const isOpen = activeDropdown === item.label
            const isActive = activeItem === item.label

            // Constant dimensions across all states to guarantee 0px layout shift
            const baseBtnClasses =
              "h-8 px-2.5 flex items-center justify-center rounded-lg border text-[12px] font-medium transition-colors select-none shrink-0"

            const stateClasses = isActive
              ? "bg-slate-100 text-slate-900 border-slate-300"
              : isOpen
                ? "bg-slate-50 text-[#0c3b40] border-slate-200"
                : "bg-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50 border-transparent"

            if (item.hasDropdown) {
              return (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => handleDropdownHover(item.label)}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setActiveDropdown(null)
                      onNavigate?.(item.label)
                    }}
                    className={`${baseBtnClasses} gap-1 ${stateClasses}`}
                  >
                    <span>{item.label}</span>
                    <ChevronDown
                      className={`w-3 h-3 shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-[#0c3b40]" : "text-slate-400"
                      }`}
                    />
                  </button>
                </div>
              )
            }

            return (
              <button
                key={item.label}
                type="button"
                onMouseEnter={handleNonDropdownHover}
                onClick={() => {
                  setActiveDropdown(null)
                  onNavigate?.(item.label)
                }}
                className={`${baseBtnClasses} ${stateClasses}`}
              >
                {item.label}
              </button>
            )
          })}
        </nav>

        {/* Header Right Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Search Button */}
          <button
            type="button"
            aria-label="Tìm kiếm"
            className="p-1.5 text-slate-600 hover:text-[#0c3b40] hover:bg-slate-50 rounded-lg transition-colors"
          >
            <Search className="w-4 h-4" />
          </button>

          {isLoggedIn ? (
            <>
              {/* Notification Bell with Popover */}
              <div className="relative" ref={notifMenuRef}>
                <button
                  type="button"
                  aria-label="Thông báo"
                  onClick={() => {
                    setNotificationOpen(!notificationOpen)
                    setUserDropdownOpen(false)
                  }}
                  className="relative p-1.5 text-slate-600 hover:text-[#0c3b40] hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
                >
                  <Bell className="w-4 h-4" />
                  {Boolean(currentUser.notificationsCount) && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                      {currentUser.notificationsCount}
                    </span>
                  )}
                </button>

                {/* Notification Dropdown Popover */}
                {notificationOpen && (
                  <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-2xl bg-white shadow-xl border border-slate-100 py-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 pb-2.5 border-b border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-bold text-slate-900">Thông báo</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700">
                          {currentUser.notificationsCount} mới
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setNotificationOpen(false)}
                        className="text-[11px] text-blue-600 hover:underline cursor-pointer"
                      >
                        Đánh dấu đã đọc
                      </button>
                    </div>

                    <div className="py-1 divide-y divide-slate-50 max-h-72 overflow-y-auto">
                      <div
                        onClick={() => {
                          setNotificationOpen(false)
                          onNavigate?.("stayea-club-claimed")
                        }}
                        className="p-3 hover:bg-slate-50 cursor-pointer transition-colors space-y-1"
                      >
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-xs font-bold text-slate-800">Bạn đã nhận ưu đãi thành công</span>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-snug">
                          Ưu đãi Giảm 10% vé máy bay (STAYEA10AIR) đã được lưu vào ví và sẵn sàng sử dụng.
                        </p>
                        <span className="text-[10px] text-slate-400 block pt-0.5">10 phút trước</span>
                      </div>

                      <div
                        onClick={() => {
                          setNotificationOpen(false)
                          onNavigate?.("stayea-club")
                        }}
                        className="p-3 hover:bg-slate-50 cursor-pointer transition-colors space-y-1"
                      >
                        <div className="flex items-center gap-1.5">
                          <Crown className="w-3.5 h-3.5 text-amber-500" />
                          <span className="text-xs font-bold text-slate-800">Điểm thưởng Stayea Club +150</span>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-snug">
                          Bạn vừa tích lũy điểm thưởng từ đơn đặt dịch vụ thành công.
                        </p>
                        <span className="text-[10px] text-slate-400 block pt-0.5">Hôm qua</span>
                      </div>

                      <div
                        onClick={() => {
                          setNotificationOpen(false)
                          onNavigate?.("plans")
                        }}
                        className="p-3 hover:bg-slate-50 cursor-pointer transition-colors space-y-1"
                      >
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-blue-600" />
                          <span className="text-xs font-bold text-slate-800">Nhắc nhở lịch trình</span>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-snug">
                          Kỳ nghỉ Phú Quốc (19/06 - 22/06) đã sẵn sàng các thông tin dịch vụ.
                        </p>
                        <span className="text-[10px] text-slate-400 block pt-0.5">2 ngày trước</span>
                      </div>
                    </div>

                    <div className="pt-2 px-3 border-t border-slate-100 text-center">
                      <button
                        type="button"
                        onClick={() => {
                          setNotificationOpen(false)
                          onNavigate?.("settings")
                        }}
                        className="text-xs font-semibold text-blue-700 hover:underline cursor-pointer"
                      >
                        Tùy chỉnh thông báo trong Cài đặt →
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* User Avatar + Name + Dropdown */}
              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-full hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-all"
                >
                  <div className="relative w-8 h-8 rounded-full overflow-hidden bg-slate-200 border border-slate-300 shrink-0">
                    <Image
                      src={currentUser.avatarUrl}
                      alt={currentUser.name}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                  <span className="text-xs font-semibold text-slate-800 hidden md:inline-block">
                    {currentUser.name}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl bg-white shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900">{currentUser.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{currentUser.email || "nguyenminh@gmail.com"}</p>
                    </div>

                    <div className="py-1 text-xs">
                      <button
                        type="button"
                        onClick={() => {
                          setUserDropdownOpen(false)
                          onNavigate?.("profile")
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-slate-700 hover:bg-slate-50 hover:text-[#0A2239] font-medium cursor-pointer"
                      >
                        <User className="w-4 h-4 text-slate-400" />
                        <span>Trang cá nhân</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setUserDropdownOpen(false)
                          onNavigate?.("bookings")
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-slate-700 hover:bg-slate-50 hover:text-[#0A2239] font-medium cursor-pointer"
                      >
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span>Đơn đặt dịch vụ</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setUserDropdownOpen(false)
                          onNavigate?.("plans")
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-slate-700 hover:bg-slate-50 hover:text-[#0A2239] font-medium cursor-pointer"
                      >
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span>Kế hoạch của tôi</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setUserDropdownOpen(false)
                          onNavigate?.("favorites")
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-slate-700 hover:bg-slate-50 hover:text-[#0A2239] font-medium cursor-pointer"
                      >
                        <Heart className="w-4 h-4 text-slate-400" />
                        <span>Địa điểm yêu thích</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setUserDropdownOpen(false)
                          onNavigate?.("my-deals")
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-slate-700 hover:bg-slate-50 hover:text-[#0A2239] font-medium cursor-pointer"
                      >
                        <Gift className="w-4 h-4 text-slate-400" />
                        <span>Ví ưu đãi của tôi</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setUserDropdownOpen(false)
                          onNavigate?.("stayea-club")
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-slate-700 hover:bg-slate-50 hover:text-[#0A2239] font-medium cursor-pointer"
                      >
                        <Crown className="w-4 h-4 text-amber-500" />
                        <span>Stayea Club</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setUserDropdownOpen(false)
                          onNavigate?.("payment")
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-slate-700 hover:bg-slate-50 hover:text-[#0A2239] font-medium cursor-pointer"
                      >
                        <CreditCard className="w-4 h-4 text-slate-400" />
                        <span>Phương thức thanh toán</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setUserDropdownOpen(false)
                          onNavigate?.("dashboard")
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-emerald-800 hover:bg-emerald-50/70 font-semibold cursor-pointer"
                      >
                        <LayoutDashboard className="w-4 h-4 text-emerald-600" />
                        <span>Admin Dashboard</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setUserDropdownOpen(false)
                          onNavigate?.("settings")
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-slate-700 hover:bg-slate-50 hover:text-[#0A2239] font-medium cursor-pointer"
                      >
                        <Settings className="w-4 h-4 text-slate-400" />
                        <span>Cài đặt</span>
                      </button>
                    </div>

                    <div className="border-t border-slate-100 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setUserDropdownOpen(false)
                          onNavigate?.("logout")
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-rose-600 hover:bg-rose-50 text-xs font-medium"
                      >
                        <LogOut className="w-4 h-4 text-rose-500" />
                        <span>Đăng xuất</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Đăng nhập (Login) */}
              <Link
                href="#login"
                onClick={() => onNavigate?.("login")}
                className="hidden sm:inline-flex items-center justify-center px-4 py-2 rounded-lg border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-xs font-medium text-slate-800 transition-all shadow-xs"
              >
                Đăng nhập
              </Link>

              {/* Đặt ngay CTA */}
              <Link
                href="/stay"
                onClick={(e) => {
                  if (onNavigate) {
                    e.preventDefault()
                    onNavigate("stay")
                  }
                }}
                className="inline-flex items-center justify-center gap-1 px-4 py-2 rounded-lg bg-[#0c3b40] hover:bg-[#072528] text-white text-xs font-medium shadow-xs transition-all hover:shadow active:scale-95"
              >
                <span>Đặt ngay</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 rounded-md text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Floating Overlay Mega Menu: Positioned absolute directly below the header */}
      {activeDropdown && (
        <>
          {/* Subtle Dim Backdrop for luxury depth */}
          <div
            className="hidden lg:block fixed inset-0 top-[70px] bg-black/25 backdrop-blur-[1.5px] z-40 pointer-events-none animate-in fade-in-0 duration-150"
            aria-hidden="true"
          />

          <div
            onMouseEnter={handleCancelClose}
            onMouseLeave={handleHeaderLeave}
            className="hidden lg:block absolute top-full left-0 right-0 z-50 pointer-events-auto px-4 sm:px-6 lg:px-8 pt-3 pb-6"
          >
            <div className="max-w-[1440px] mx-auto animate-in fade-in-0 zoom-in-95 duration-150">
              {activeDropdown === "Ưu đãi" && <DealsMegaMenu onClose={() => setActiveDropdown(null)} onNavigate={onNavigate} />}
              {activeDropdown === "Khám phá" && <ExploreMegaMenu onClose={() => setActiveDropdown(null)} onNavigate={onNavigate} />}
              {activeDropdown === "Di chuyển" && <TransportMegaMenu onClose={() => setActiveDropdown(null)} onNavigate={onNavigate} />}
              {activeDropdown === "Lưu trú" && <StayMegaMenu onClose={() => setActiveDropdown(null)} onNavigate={onNavigate} />}
                            {activeDropdown === "Trải nghiệm" && <ExperienceMegaMenu onClose={() => setActiveDropdown(null)} onNavigate={onNavigate} />}
              {(activeDropdown === "Gói" || activeDropdown === "Tour") && (
                <PackageMegaMenu onClose={() => setActiveDropdown(null)} onNavigate={onNavigate} />
              )}
            </div>
          </div>
        </>
      )}

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white px-4 py-6 shadow-xl animate-in slide-in-from-top-2">
          <div className="flex flex-col gap-1.5">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.label}
                type="button"
                className={`text-left px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeItem === item.label
                    ? "bg-slate-100 text-[#0c3b40] font-medium border border-slate-200"
                    : "text-slate-800 hover:text-[#0c3b40] hover:bg-slate-50 border border-transparent"
                }`}
                onClick={() => {
                  onNavigate?.(item.label)
                  setMobileMenuOpen(false)
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
