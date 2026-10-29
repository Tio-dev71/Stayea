"use client"

import {
  User,
  Calendar,
  ClipboardList,
  Heart,
  Star,
  UserCheck,
  CreditCard,
  Gift,
  Crown,
  Settings,
  Headphones,
  LogOut,
} from "lucide-react"
import { PROFILE_SIDEBAR_ITEMS } from "@/features/landing/data/stayea-mock-data"
import type { ProfileSidebarItem } from "@/features/landing/data/stayea-mock-data"

interface ProfileSidebarProps {
  readonly activeTab: string
  readonly onSelectTab: (tabId: string) => void
  readonly onLogout?: () => void
  readonly hideBadges?: boolean
  readonly favoritesCount?: number
  readonly reviewsCount?: number
  readonly bookingsCount?: number
}

function renderSidebarIcon(iconName: string, className: string) {
  switch (iconName) {
    case "user":
      return <User className={className} />
    case "calendar":
      return <Calendar className={className} />
    case "clipboard-list":
      return <ClipboardList className={className} />
    case "heart":
      return <Heart className={className} />
    case "star":
      return <Star className={className} />
    case "user-check":
      return <UserCheck className={className} />
    case "credit-card":
      return <CreditCard className={className} />
    case "gift":
      return <Gift className={className} />
    case "crown":
      return <Crown className={className} />
    case "settings":
      return <Settings className={className} />
    case "headphones":
      return <Headphones className={className} />
    case "log-out":
      return <LogOut className={className} />
    default:
      return <User className={className} />
  }
}

export function ProfileSidebar({
  activeTab,
  onSelectTab,
  onLogout,
  hideBadges = false,
  favoritesCount,
  reviewsCount,
  bookingsCount,
}: ProfileSidebarProps) {
  return (
    <aside className="w-full lg:w-64 xl:w-72 shrink-0">
      <div className="bg-white rounded-2xl border border-slate-200/80 p-2.5 sm:p-3 shadow-xs space-y-1">
        {PROFILE_SIDEBAR_ITEMS.map((item: ProfileSidebarItem) => {
          let itemBadge = item.badge
          if (item.id === "favorites") {
            itemBadge = favoritesCount !== undefined ? (favoritesCount > 0 ? String(favoritesCount) : undefined) : item.badge
          } else if (item.id === "reviews") {
            itemBadge = reviewsCount !== undefined ? (reviewsCount > 0 ? String(reviewsCount) : undefined) : item.badge
          } else if (item.id === "bookings") {
            itemBadge = bookingsCount !== undefined ? (bookingsCount > 0 ? String(bookingsCount) : undefined) : item.badge
          }
          const isStayeaClubMatch =
            item.id === "staya-club" &&
            (activeTab === "staya-club" || activeTab === "stayea-club" || activeTab === "stayea-club-claimed");
          const isDealsMatch =
            item.id === "deals" &&
            (activeTab === "deals" || activeTab === "my-deals");
          const isPaymentMatch =
            item.id === "payment" &&
            (activeTab === "payment" || activeTab === "add-payment");
          const isBookingsMatch =
            item.id === "bookings" &&
            (activeTab === "bookings" || activeTab === "new-booking");
          const isSettingsMatch =
            item.id === "settings" &&
            (activeTab === "settings" || activeTab === "cai-dat");

          const isActive =
            activeTab === item.id ||
            isStayeaClubMatch ||
            isDealsMatch ||
            isPaymentMatch ||
            isBookingsMatch ||
            isSettingsMatch;

          const isLogout = item.id === "logout";

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                if (isLogout && onLogout) {
                  onLogout()
                } else if (item.id === "deals") {
                  onSelectTab("my-deals")
                } else if (item.id === "staya-club") {
                  onSelectTab("stayea-club")
                } else {
                  onSelectTab(item.id)
                }
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all text-left ${
                isActive
                  ? "bg-[#EBF3FC] text-[#0A2239] font-semibold shadow-2xs"
                  : isLogout
                  ? "text-slate-600 hover:text-rose-600 hover:bg-rose-50/60"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className={`shrink-0 ${
                    isActive
                      ? "text-[#0A2239]"
                      : isLogout
                      ? "text-slate-500 group-hover:text-rose-600"
                      : "text-slate-500"
                  }`}
                >
                  {renderSidebarIcon(item.iconName, "w-4 h-4")}
                </span>
                <span className="truncate">{item.label}</span>
              </div>

              {!hideBadges && itemBadge && (
                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                    isActive
                      ? "bg-[#0A2239] text-white"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {itemBadge}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </aside>
  )
}
