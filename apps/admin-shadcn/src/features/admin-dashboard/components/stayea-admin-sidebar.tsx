"use client"

import Image from "next/image"
import { useRouter, usePathname } from "next/navigation"
import {
  LayoutDashboard,
  CalendarCheck,
  Building2,
  Users,
  ShieldCheck,
  Compass,
  Tag,
  CreditCard,
  Star,
  MessageSquare,
  Send,
  BarChart2,
  Settings,
  ArrowRight,
  Home,
} from "lucide-react"
import type { SidebarNavMenuItem } from "@/features/admin-dashboard/stayea-admin-mock-data"
import { ADMIN_SIDEBAR_NAV_VI } from "@/features/admin-dashboard/stayea-admin-mock-data"

interface StayeaAdminSidebarProps {
  activeTab?: string
  onSelectTab?: (tabId: string) => void
  onExplorePhuQuoc?: () => void
  promoTitle?: string
  promoSubtitle?: string
  promoButtonText?: string
}

function getSidebarIcon(iconName: string) {
  const iconClass = "w-4 h-4 shrink-0 transition-colors"
  switch (iconName) {
    case "dashboard": {
      return <LayoutDashboard className={iconClass} />
    }
    case "bookings": {
      return <CalendarCheck className={iconClass} />
    }
    case "properties": {
      return <Building2 className={iconClass} />
    }
    case "guests": {
      return <Users className={iconClass} />
    }
    case "hosts": {
      return <ShieldCheck className={iconClass} />
    }
    case "experience": {
      return <Compass className={iconClass} />
    }
    case "deals": {
      return <Tag className={iconClass} />
    }
    case "transactions": {
      return <CreditCard className={iconClass} />
    }
    case "reviews": {
      return <Star className={iconClass} />
    }
    case "messages": {
      return <MessageSquare className={iconClass} />
    }
    case "marketing": {
      return <Send className={iconClass} />
    }
    case "analytics": {
      return <BarChart2 className={iconClass} />
    }
    case "settings": {
      return <Settings className={iconClass} />
    }
    default: {
      return <LayoutDashboard className={iconClass} />
    }
  }
}

const DEFAULT_TAB_ROUTES: Record<string, string> = {
  "tong-quan": "/stayea",
  "dat-phong": "/stayea/bookings",
  "bat-dong-san": "/stayea/properties",
  "khach-hang": "/stayea/customers",
  "chu-nha-doi-tac": "/stayea/partners",
  "trai-nghiem-tour": "/stayea/experiences",
  "uu-dai-khuyen-mai": "/stayea/deals",
  "doanh-thu-thanh-toan": "/stayea/revenue",
  "danh-gia": "/stayea/reviews",
  "tin-nhan": "/stayea/messages",
  "marketing": "/stayea/marketing",
  "bao-cao": "/stayea/reports",
  "cai-dat": "/stayea/settings",
}

export function StayeaAdminSidebar({
  activeTab,
  onSelectTab,
  onExplorePhuQuoc,
  promoTitle = "Phú Quốc",
  promoSubtitle = "Chờ bạn khám phá",
  promoButtonText = "Xem ngay",
}: StayeaAdminSidebarProps) {
  const router = useRouter()
  const pathname = usePathname()

  const normalizedActiveTab = (() => {
    // If activeTab is explicitly passed and not generic "tong-quan", use it
    if (activeTab && activeTab !== "tong-quan") {
      switch (activeTab) {
        case "dashboard":
          return "tong-quan"
        case "bookings":
          return "dat-phong"
        case "properties":
          return "bat-dong-san"
        case "guests":
        case "customers":
          return "khach-hang"
        case "hosts":
          return "chu-nha-doi-tac"
        case "experience":
        case "experiences":
          return "trai-nghiem-tour"
        case "deals":
          return "uu-dai-khuyen-mai"
        case "revenue":
        case "transactions":
          return "doanh-thu-thanh-toan"
        case "reviews":
          return "danh-gia"
        case "messages":
          return "tin-nhan"
        case "marketing":
          return "marketing"
        case "analytics":
        case "reports":
          return "bao-cao"
        case "settings":
          return "cai-dat"
        default:
          return activeTab
      }
    }

    // Auto-detect from current URL pathname
    if (pathname) {
      if (pathname === "/stayea" || pathname === "/stayea/overview") return "tong-quan"
      if (pathname.startsWith("/stayea/bookings")) return "dat-phong"
      if (pathname.startsWith("/stayea/properties")) return "bat-dong-san"
      if (pathname.startsWith("/stayea/customers")) return "khach-hang"
      if (pathname.startsWith("/stayea/partners") || pathname.startsWith("/stayea/hosts") || pathname.startsWith("/hub")) return "chu-nha-doi-tac"
      if (pathname.startsWith("/stayea/experiences")) return "trai-nghiem-tour"
      if (pathname.startsWith("/stayea/deals")) return "uu-dai-khuyen-mai"
      if (pathname.startsWith("/stayea/revenue")) return "doanh-thu-thanh-toan"
      if (pathname.startsWith("/stayea/reviews")) return "danh-gia"
      if (pathname.startsWith("/stayea/messages")) return "tin-nhan"
      if (pathname.startsWith("/stayea/marketing")) return "marketing"
      if (pathname.startsWith("/stayea/reports")) return "bao-cao"
      if (pathname.startsWith("/stayea/settings")) return "cai-dat"
    }

    return activeTab || "tong-quan"
  })()

  const handleTabClick = (tabId: string) => {
    if (onSelectTab) {
      onSelectTab(tabId)
    }
    const target = DEFAULT_TAB_ROUTES[tabId]
    if (target && pathname !== target) {
      router.push(target)
    }
  }

  const handleDefaultExplore = () => {
    if (onExplorePhuQuoc) {
      onExplorePhuQuoc()
    } else {
      window.open("https://stayea.com/phu-quoc", "_blank")
    }
  }

  return (
    <aside className="w-64 shrink-0 bg-white border-r border-slate-200/80 min-h-[calc(100vh-4rem)] p-3 flex flex-col justify-between hidden lg:flex select-none">
      {/* Navigation List */}
      <nav className="space-y-1">
        {ADMIN_SIDEBAR_NAV_VI.map((item: SidebarNavMenuItem) => {
          const isActive = normalizedActiveTab === item.id
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleTabClick(item.id)}
              className={`relative overflow-hidden w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-[13px] font-medium transition-all text-left ${
                isActive
                  ? "bg-[#eef8f3] text-[#1b7a4e] font-semibold shadow-2xs border border-emerald-200/60"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent"
              }`}
            >
              {/* Left active marker pill */}
              {isActive && (
                <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-[#1b7a4e] rounded-r-full" />
              )}
              <span className={isActive ? "text-[#1b7a4e]" : "text-slate-400"}>
                {getSidebarIcon(item.icon)}
              </span>
              <span className="truncate">{item.label}</span>
            </button>
          )
        })}
      </nav>

      {/* Bottom Phú Quốc Promo Card & Version */}
      <div className="mt-6 pt-3 border-t border-slate-100 space-y-4">
        {/* Phu Quoc Promo Card */}
        <div className="relative overflow-hidden rounded-2xl aspect-[16/11] border border-slate-200/80 shadow-xs group">
          <Image
            src="/about/beach-opt-0.jpg"
            alt="Phú Quốc"
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/30 to-transparent flex flex-col justify-end p-3.5 text-white">
            <span className="text-xs font-bold leading-tight">{promoTitle}</span>
            <p className="text-[11px] text-emerald-200 font-medium leading-tight mt-0.5">
              {promoSubtitle}
            </p>
            <button
              type="button"
              onClick={handleDefaultExplore}
              className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-lg text-[11px] font-semibold w-fit transition-colors shadow-xs"
            >
              <span>{promoButtonText}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Brand & Version Info */}
        <div className="flex items-center justify-between px-1 text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <Home className="w-3.5 h-3.5 text-slate-400" />
            <span>Stayea.com</span>
          </div>
          <span>Phiên bản 1.0.0</span>
        </div>
      </div>
    </aside>
  )
}
