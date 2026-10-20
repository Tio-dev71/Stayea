"use client"

import * as React from "react"
import { StayeaHeader } from "./components/stayea-header"
import { StayeaHero } from "./components/stayea-hero"
import { AboutHero } from "./components/about-hero"
import { AboutStory } from "./components/about-story"
import { AboutPrinciples } from "./components/about-principles"
import { AboutTeam } from "./components/about-team"
import { AboutConversion } from "./components/about-conversion"
import { HostHero } from "./components/host-hero"
import { HostBenefits } from "./components/host-benefits"
import { HostProcess } from "./components/host-process"
import { HostPartnershipAndForm } from "./components/host-partnership-and-form"
import { HostFaq } from "./components/host-faq"
import { PartnerHero } from "./components/partner-hero"
import { PartnerBenefits } from "./components/partner-benefits"
import { PartnerCategories } from "./components/partner-categories"
import { PartnerProcess } from "./components/partner-process"
import { PartnerTransparencyAndForm } from "./components/partner-transparency-and-form"
import { StayListingPage } from "./components/stay-listing-page"
import { ExperienceListingPage } from "./components/experience-listing-page"
import { PackageListingPage } from "./components/package-listing-page"
import { PhuQuocListingPage } from "./components/phu-quoc-listing-page"
import { TransportListingPage } from "./components/transport-listing-page"
import { DealsListingPage } from "./components/deals-listing-page"
import { AuthPage } from "./components/auth-page"
import { ProfilePage } from "./components/profile-page"
import { BookingsPage } from "./components/bookings-page"
import { NewBookingPage } from "./components/new-booking-page"
import { MyPlansPage } from "./components/my-plans-page"
import { FavoritesPage } from "./components/favorites-page"
import { MyReviewsPage } from "./components/my-reviews-page"
import { AccountInfoPage } from "./components/account-info-page"
import { PaymentMethodsPage } from "./components/payment-methods-page"
import { AddPaymentMethodPage } from "./components/add-payment-method-page"
import { MyDealsPage } from "./components/my-deals-page"
import { StayeaClubPage } from "./components/stayea-club-page"
import { StayeaClubClaimedPage } from "./components/stayea-club-claimed-page"
import { StayeaFlightBookingPage } from "./components/stayea-flight-booking-page"
import { StayeaSettingsPage } from "./components/stayea-settings-page"
import { StayeaAdminDashboardPage } from "@/features/admin-dashboard"
import { StayeaAdminBookingsPage } from "@/features/admin-bookings"
import { StayeaAdminPropertiesPage } from "@/features/admin-properties"
import { StayeaAdminCustomersPage } from "@/features/admin-customers"
import { StayeaAdminHostsPage } from "@/features/admin-hosts"
import { StayeaAdminExperiencesPage } from "@/features/admin-experiences"
import { StayeaAdminDealsPage } from "@/features/admin-deals"
import type { DealModalTab } from "@/features/admin-deals"
import { StayeaAdminRevenuePage } from "@/features/admin-revenue"
import { StayeaAdminReviewsPage } from "@/features/admin-reviews"
import { StayeaAdminMessagesPage } from "@/features/admin-messages"
import { StayeaAdminMarketingPage } from "@/features/admin-marketing"
import { StayeaAdminReportsPage } from "@/features/admin-reports"
import { AccommodationSection } from "./components/accommodation-section"
import { ExperiencesAndPackagesSection } from "./components/experiences-and-packages-section"
import { ExploreSection } from "./components/explore-section"
import { TransportationSection } from "./components/transportation-section"
import { PromosAndPartnersSection } from "./components/promos-and-partners-section"
import { StayeaFooter } from "./components/stayea-footer"

export type StayeaPageType =
    | "about" | "account-info" | "add-payment" | "admin" | "admin-bookings" | "admin-customers"
    | "admin-deals" | "admin-experiences" | "admin-hosts" | "admin-properties" | "admin-revenue"
    | "admin-reviews" | "admin-messages" | "admin-marketing" | "admin-reports" | "bookings"
    | "dashboard" | "deals" | "experience" | "favorites" | "flight-booking" | "home" | "host"
    | "login" | "my-deals" | "new-booking" | "packages" | "partner" | "payment" | "phu-quoc"
    | "plans" | "profile" | "register" | "reviews" | "settings" | "stay" | "stayea-club"
    | "stayea-club-claimed" | "transport"

export interface StayeaLandingPageProps {
  readonly initialPage?: StayeaPageType
}

export function StayeaLandingPage({ initialPage }: StayeaLandingPageProps = {}) {
  type PageType = StayeaPageType
    | "about" | "account-info" | "add-payment" | "admin" | "admin-bookings" | "admin-customers"
    | "admin-deals" | "admin-experiences" | "admin-hosts" | "admin-properties" | "admin-revenue"
    | "admin-reviews" | "admin-messages" | "admin-marketing" | "admin-reports" | "bookings"
    | "dashboard" | "deals" | "experience" | "favorites" | "flight-booking" | "home" | "host"
    | "login" | "my-deals" | "new-booking" | "packages" | "partner" | "payment" | "phu-quoc"
    | "plans" | "profile" | "register" | "reviews" | "settings" | "stay" | "stayea-club"
    | "stayea-club-claimed" | "transport"

  const [pageState, setPageState] = React.useState<PageType>(() => {
    if (initialPage) return initialPage
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      const pageParam = params.get("page")
      if (pageParam) return pageParam as PageType
      const hash = window.location.hash.replace("#", "").toLowerCase()
      if (hash === "host" || hash === "chu-nha") return "host"
      if (hash === "partner" || hash === "doi-tac") return "partner"
      if (hash === "about" || hash === "ve-stayea") return "about"
      if (hash === "club" || hash === "stayea-club") return "stayea-club"
      if (hash === "stay" || hash === "luu-tru") return "stay"
      if (hash === "experience" || hash === "trai-nghiem") return "experience"
      if (hash === "packages" || hash === "goi") return "packages"
      if (hash === "transport" || hash === "di-chuyen") return "transport"
      if (hash === "deals" || hash === "uu-dai") return "deals"
    }
    return "home"
  })
  const currentPage = pageState

  const setCurrentPage = React.useCallback(
    (pageOrUpdater: PageType | ((prev: PageType) => PageType)) => {
      setPageState(pageOrUpdater)
    },
    []
  )

  // Synchronize URL search params smoothly on pageState change without triggering React render conflicts
  React.useEffect(() => {
    if (typeof window === "undefined") return
    try {
      const url = new URL(window.location.href)
      const currentUrlPage = url.searchParams.get("page")
      if (pageState === "home") {
        if (currentUrlPage) {
          url.searchParams.delete("page")
          window.history.replaceState(null, "", url.toString())
        }
      } else if (currentUrlPage !== pageState) {
        url.searchParams.set("page", pageState)
        window.history.pushState(null, "", url.toString())
      }
    } catch {
      // Safe fallback
    }
  }, [pageState])
  const [isLoggedIn, setIsLoggedIn] = React.useState<boolean>(true)
  const [activeItem, setActiveItem] = React.useState<string>("Stayea Club")
  const [activeDropdown, setActiveDropdown] = React.useState<string | null>(null)
  const [currentHash, setCurrentHash] = React.useState<string>("")
  const closeTimerRef = React.useRef<NodeJS.Timeout | null>(null)

  // Smooth hover open/close with debounce grace period
  const handleDropdownEnter = React.useCallback((dropdown: string) => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
    setActiveDropdown(dropdown)
  }, [])

  const handleDropdownLeave = React.useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
    }
    closeTimerRef.current = setTimeout(() => {
      setActiveDropdown(null)
    }, 300)
  }, [])

  React.useEffect(() => {
    function parseRoute() {
      if (typeof window === "undefined") return
      const params = new URLSearchParams(window.location.search)
      const page = params.get("page")
      const hash = window.location.hash.replace("#", "")
      setCurrentHash(window.location.hash)

      const target = (page || hash).toLowerCase()

      if (
        target === "admin-bookings" ||
        target === "dat-phong" ||
        target === "quan-ly-dat-phong" ||
        target === "create-booking" ||
        target === "tao-dat-phong"
      ) {
        setCurrentPage("admin-bookings")
        setIsLoggedIn(true)
        setActiveItem("Đặt phòng")
      } else if (
        target === "customers" ||
        target === "khach-hang" ||
        target === "guests" ||
        target === "admin-customers"
      ) {
        setCurrentPage("admin-customers")
        setIsLoggedIn(true)
        setActiveItem("Khách hàng")
      } else if (
        target === "hosts" ||
        target === "chu-nha-doi-tac" ||
        target === "doi-tac" ||
        target === "admin-hosts" ||
        target === "hosts-payment" ||
        target === "hosts-thanh-toan" ||
        target === "admin-hosts-payment" ||
        target === "hosts-notes" ||
        target === "hosts-settings" ||
        target === "hosts-ghi-chu" ||
        target === "hosts-cai-dat" ||
        target.startsWith("hosts-") ||
        target.startsWith("chu-nha-")
      ) {
        setCurrentPage("admin-hosts")
        setIsLoggedIn(true)
        setActiveItem("Chủ nhà/Đối tác")
      } else if (
        target === "properties" ||
        target === "admin-deals" ||
        target === "admin-promotions" ||
        target === "uu-dai-khuyen-mai" ||
        target === "quan-ly-khuyen-mai" ||
        target === "tao-khuyen-mai" ||
        target === "create-deal" ||
        target === "create-promotion" ||
        target === "dieu-kien-ap-dung" ||
        target === "deals-conditions" ||
        target === "uu-dai-dieu-kien" ||
        target === "qua-tang-loi-ich" ||
        target === "deals-gifts" ||
        target === "gifts" ||
        target === "hinh-anh-truyen-thong" ||
        target === "deals-media" ||
        target === "media" ||
        target === "xem-truoc-xuat-ban" ||
        target === "deals-preview" ||
        target === "preview" ||
        target === "deal"
      ) {
        setCurrentPage("admin-deals")
        setIsLoggedIn(true)
        setActiveItem("Ưu đãi & Khuyến mãi")
      } else if (
        target === "admin-experiences" ||
        target === "experiences" ||
        target === "experiences-report" ||
        target === "bao-cao-tour" ||
        target === "bao-cao-trai-nghiem" ||
        target === "trai-nghiem-tour" ||
        target === "admin-tours" ||
        target === "create-experience" ||
        target === "them-trai-nghiem" ||
        target === "experiences-create" ||
        target === "experiences-itinerary" ||
        target === "tour-itinerary" ||
        target === "lich-trinh" ||
        target === "dich-vu" ||
        target === "them-ngay" ||
        target === "experiences-add-day" ||
        target === "tour-add-day" ||
        target === "gia-chinh-sach" ||
        target === "experiences-pricing" ||
        target === "tour-pricing" ||
        target === "experiences-media" ||
        target === "tour-media" ||
        target === "hinh-anh-video" ||
        target === "media" ||
        target === "experiences-seo" ||
        target === "tour-seo" ||
        target === "seo-hien-thi"
      ) {
        setCurrentPage("admin-experiences")
        setIsLoggedIn(true)
        setActiveItem("Trải nghiệm & Tour")
      } else if (
        target === "bat-dong-san" ||
        target === "admin-properties"
      ) {
        setCurrentPage("admin-properties")
        setIsLoggedIn(true)
        setActiveItem("Bất động sản")
      } else if (
        target === "admin-revenue" ||
        target === "doanh-thu-thanh-toan" ||
        target === "doanh-thu" ||
        target === "thanh-toan" ||
        target === "transactions" ||
        target === "revenue" ||
        target === "bao-cao-doanh-thu"
      ) {
        setCurrentPage("admin-revenue")
        setIsLoggedIn(true)
        setActiveItem("Doanh thu & Thanh toán")
      } else if (
        target === "admin-reviews" ||
        target === "danh-gia" ||
        target === "admin-danh-gia" ||
        target === "quan-ly-danh-gia"
      ) {
        setCurrentPage("admin-reviews")
        setIsLoggedIn(true)
        setActiveItem("Đánh giá")
      } else if (
        target === "admin-reports" ||
        target === "bao-cao" ||
        target === "reports" ||
        target === "analytics" ||
        target === "quan-ly-bao-cao" ||
        target === "bao-cao-dat-phong" ||
        target === "reports-bookings" ||
        target === "bao-cao-khach-hang" ||
        target === "reports-customers" ||
        target === "khach-hang"
      ) {
        setCurrentPage("admin-reports")
        setIsLoggedIn(true)
        setActiveItem("Báo cáo")
      } else if (
        target === "admin-marketing" ||
        target === "marketing" ||
        target === "seo" ||
        target === "bao-cao-seo" ||
        target === "admin-seo" ||
        target === "chien-dich" ||
        target === "kenh-marketing" ||
        target === "channels" ||
        target === "noi-dung" ||
        target === "content" ||
        target === "quang-cao" ||
        target === "ads" ||
        target === "email-marketing" ||
        target === "email" ||
        target === "quan-ly-marketing" || target === "marketing-create" || target === "tao-chien-dich" || target === "create-campaign" || target === "marketing-step2" || target === "step2" || target === "noi-dung-kenh" || target === "marketing-step3" || target === "step3" || target === "doi-tuong-ngan-sach" || target === "marketing-step4" || target === "step4" || target === "marketing-lich-trinh" || target === "marketing-step5" || target === "step5" || target === "marketing-xuat-ban"
      ) {
        setCurrentPage("admin-marketing")
        setIsLoggedIn(true)
        setActiveItem("Marketing")
      } else if (
        target === "admin-messages" ||
        target === "tin-nhan" ||
        target === "messages" ||
        target === "chat" ||
        target === "quan-ly-tin-nhan"
      ) {
        setCurrentPage("admin-messages")
        setIsLoggedIn(true)
        setActiveItem("Tin nhắn")
      } else if (
        target === "dashboard" ||
        target === "admin" ||
        target === "admin-dashboard" ||
        target === "quan-tri"
      ) {
        setCurrentPage("dashboard")
        setIsLoggedIn(true)
        setActiveItem("Dashboard")
      } else if (
        target === "settings" ||
        target === "cai-dat"
      ) {
        setCurrentPage("settings")
        setIsLoggedIn(true)
        setActiveItem("Cài đặt")
      } else if (
        target === "flight-booking" ||
        target === "dat-ve-may-bay" ||
        target === "may-bay" ||
        target === "flight"
      ) {
        setCurrentPage("flight-booking")
        setIsLoggedIn(true)
        setActiveItem("Di chuyển")
      } else if (
        target === "stayea-club-claimed" ||
        target === "club-claimed" ||
        target === "nhan-uu-dai" ||
        target === "nhan-uu-dai-club"
      ) {
        setCurrentPage("stayea-club-claimed")
        setIsLoggedIn(true)
        setActiveItem("Stayea Club")
      } else if (
        target === "stayea-club" ||
        target === "staya-club" ||
        target === "club"
      ) {
        setCurrentPage("stayea-club")
        setIsLoggedIn(true)
        setActiveItem("Stayea Club")
      } else if (
        target === "my-deals" ||
        target === "uu-dai-cua-toi" ||
        target === "my-vouchers" ||
        target === "voucher-cua-toi"
      ) {
        setCurrentPage("my-deals")
        setIsLoggedIn(true)
        setActiveItem("Ưu đãi của tôi")
      } else if (
        target === "add-payment" ||
        target === "them-phuong-thuc" ||
        target === "them-phuong-thuc-thanh-toan" ||
        target === "add-card"
      ) {
        setCurrentPage("add-payment")
        setIsLoggedIn(true)
        setActiveItem("Phương thức thanh toán")
      } else if (
        target === "payment" ||
        target === "thanh-toan" ||
        target === "phuong-thuc-thanh-toan" ||
        target === "billing"
      ) {
        setCurrentPage("payment")
        setIsLoggedIn(true)
        setActiveItem("Phương thức thanh toán")
      } else if (
        target === "account-info" ||
        target === "thong-tin-ca-nhan" ||
        target === "profile-info" ||
        target === "personal-info" ||
        target === "info"
      ) {
        setCurrentPage("account-info")
        setIsLoggedIn(true)
        setActiveItem("Thông tin cá nhân")
      } else if (
        target === "reviews" ||
        target === "danh-gia-cua-toi" ||
        target === "my-reviews"
      ) {
        setCurrentPage("reviews")
        setIsLoggedIn(true)
        setActiveItem("Đánh giá của tôi")
      } else if (
        target === "favorites" ||
        target === "yeu-thich" ||
        target === "wishlist" ||
        target === "saved"
      ) {
        setCurrentPage("favorites")
        setIsLoggedIn(true)
        setActiveItem("Yêu thích")
      } else if (
        target === "plans" ||
        target === "ke-hoach" ||
        target === "ke-hoach-cua-toi" ||
        target === "my-plans"
      ) {
        setCurrentPage("plans")
        setIsLoggedIn(true)
        setActiveItem("Kế hoạch của tôi")
      } else if (
        target === "new-booking" ||
        target === "dat-dich-vu-moi" ||
        target === "dat-dich-vu"
      ) {
        setCurrentPage("new-booking")
        setIsLoggedIn(true)
        setActiveItem("Đơn đặt dịch vụ")
      } else if (
        target === "bookings" ||
        target === "don-dat-dich-vu" ||
        target === "don-hang" ||
        target === "orders"
      ) {
        setCurrentPage("bookings")
        setIsLoggedIn(true)
        setActiveItem("Đơn đặt dịch vụ")
      } else if (
        target === "profile" ||
        target === "trang-ca-nhan" ||
        target === "tai-khoan" ||
        target === "account"
      ) {
        setCurrentPage("profile")
        setIsLoggedIn(true)
        setActiveItem("Trang cá nhân")
      } else if (target === "login" || target === "dang-nhap" || target === "auth") {
        setCurrentPage("login")
        setActiveItem("Đăng nhập")
      } else if (target === "register" || target === "dang-ky") {
        setCurrentPage("register")
        setActiveItem("Đăng nhập")
      } else if (target === "home") {
        setCurrentPage("home")
        setActiveItem("Trang chủ")
      } else if (target === "about") {
        setCurrentPage("about")
        setActiveItem("Về Stayea")
      } else if (target === "host") {
        setCurrentPage("host")
        setActiveItem("Trở thành chủ nhà")
      } else if (target === "partner") {
        setCurrentPage("partner")
        setActiveItem("Hợp tác cùng STAYEA")
      } else if (
        target === "stay" ||
        target === "villas" ||
        target === "villa" ||
        target === "accommodations" ||
        target === "luu-tru"
      ) {
        setCurrentPage("stay")
        setActiveItem("Lưu trú")
      } else if (
        target === "experience" ||
        target === "experiences" ||
        target === "trai-nghiem"
      ) {
        setCurrentPage("experience")
        setActiveItem("Trải nghiệm")
      } else if (
        target === "packages" ||
        target === "package" ||
        target === "tours" ||
        target === "tour" ||
        target === "goi"
      ) {
        setCurrentPage("packages")
        setActiveItem("Gói")
      } else if (
        target === "deals" ||
        target === "deal" ||
        target === "uu-dai" ||
        target === "uudai" ||
        target === "khuyen-mai"
      ) {
        setCurrentPage("deals")
        setActiveItem("Ưu đãi")
      } else if (
        target === "transport" ||
        target === "transportation" ||
        target === "di-chuyen" ||
        target === "dichuyen" ||
        target === "xe"
      ) {
        setCurrentPage("transport")
        setActiveItem("Di chuyển")
      } else if (
        target === "phu-quoc" ||
        target === "phuquoc" ||
        target === "kham-pha" ||
        target === "kham-pha-phu-quoc" ||
        target === "explore"
      ) {
        setCurrentPage("phu-quoc")
        setActiveItem("Khám phá")
      } else if (!target) {
        if (initialPage) {
          setCurrentPage(initialPage)
        } else {
          setCurrentPage("home")
          setActiveItem("Trang chủ")
        }
      }
    }

    parseRoute()
    window.addEventListener("hashchange", parseRoute)
    window.addEventListener("popstate", parseRoute)
    return () => {
      window.removeEventListener("hashchange", parseRoute)
      window.removeEventListener("popstate", parseRoute)
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current)
      }
    }
  }, [setCurrentPage, initialPage])

  function handleNavigate(item: string) {
    if (
      item === "bao-cao" ||
      item === "Báo cáo" ||
      item === "admin-reports" ||
      item === "reports" ||
      item === "analytics"
    ) {
      setCurrentPage("admin-reports")
      setIsLoggedIn(true)
      setActiveItem("Báo cáo")
      window.location.hash = "bao-cao"
      return
    }
    if (
      item === "marketing" ||
      item === "Marketing" ||
      item === "admin-marketing"
    ) {
      setCurrentPage("admin-marketing")
      setIsLoggedIn(true)
      setActiveItem("Marketing")
      window.location.hash = "marketing"
      return
    }
    if (
      item === "admin-bookings" ||
      item === "dat-phong" ||
      item === "Quản lý đặt phòng"
    ) {
      setCurrentPage("admin-bookings")
      setIsLoggedIn(true)
      setActiveItem("Đặt phòng")
      setActiveDropdown(null)
      window.location.hash = "admin-bookings"
      window.scrollTo({ top: 0, behavior: "smooth" })
    } else if (
      item === "admin-customers" ||
      item === "khach-hang" ||
      item === "Khách hàng" ||
      item === "customers"
    ) {
      setCurrentPage("admin-customers")
      setIsLoggedIn(true)
      setActiveItem("Khách hàng")
      setActiveDropdown(null)
      window.location.hash = "customers"
      window.scrollTo({ top: 0, behavior: "smooth" })
    } else if (
      item === "admin-experiences" ||
      item === "trai-nghiem-tour" ||
      item === "Trải nghiệm & Tour" ||
      item === "experiences"
    ) {
      setCurrentPage("admin-experiences")
      setIsLoggedIn(true)
      setActiveItem("Trải nghiệm & Tour")
      setActiveDropdown(null)
      window.location.hash = "experiences"
      window.scrollTo({ top: 0, behavior: "smooth" })
    } else if (
      item === "admin-hosts" ||
      item === "chu-nha-doi-tac" ||
      item === "Chủ nhà/Đối tác" ||
      item === "hosts" ||
      item === "doi-tac"
    ) {
      setCurrentPage("admin-hosts")
      setIsLoggedIn(true)
      setActiveItem("Chủ nhà/Đối tác")
      setActiveDropdown(null)
      window.location.hash = "hosts"
      window.scrollTo({ top: 0, behavior: "smooth" })
    } else if (
      item === "dashboard" ||
      item === "admin" ||
      item === "admin-dashboard" ||
      item === "Dashboard" ||
      item === "Quản trị"
    ) {
      setCurrentPage("dashboard")
      setIsLoggedIn(true)
      setActiveItem("Dashboard")
      setActiveDropdown(null)
      window.location.hash = "dashboard"
      window.scrollTo({ top: 0, behavior: "smooth" })
    } else if (
      item === "settings" ||
      item === "cai-dat" ||
      item === "Cài đặt"
    ) {
      setCurrentPage("settings")
      setIsLoggedIn(true)
      setActiveItem("Cài đặt")
      setActiveDropdown(null)
      window.location.hash = "settings"
      window.scrollTo({ top: 0, behavior: "smooth" })
    } else if (
      item === "flight-booking" ||
      item === "dat-ve-may-bay" ||
      item === "may-bay" ||
      item === "flight"
    ) {
      setCurrentPage("flight-booking")
      setIsLoggedIn(true)
      setActiveItem("Di chuyển")
      setActiveDropdown(null)
      window.location.hash = "flight-booking"
      window.scrollTo({ top: 0, behavior: "smooth" })
    } else if (
      item === "stayea-club-claimed" ||
      item === "club-claimed" ||
      item === "nhan-uu-dai"
    ) {
      setCurrentPage("stayea-club-claimed")
      setIsLoggedIn(true)
      setActiveItem("Stayea Club")
      setActiveDropdown(null)
      window.location.hash = "stayea-club-claimed"
      window.scrollTo({ top: 0, behavior: "smooth" })
    } else if (
      item === "stayea-club" ||
      item === "staya-club" ||
      item === "Stayea Club" ||
      item === "Staya Club" ||
      item === "club"
    ) {
      setCurrentPage("stayea-club")
      setIsLoggedIn(true)
      setActiveItem("Stayea Club")
      setActiveDropdown(null)
      window.location.hash = "stayea-club"
      window.scrollTo({ top: 0, behavior: "smooth" })
    } else if (
      item === "my-deals" ||
      item === "uu-dai-cua-toi" ||
      item === "Ưu đãi của tôi" ||
      item === "my-vouchers" ||
      item === "vi-uu-dai"
    ) {
      setCurrentPage("my-deals")
      setIsLoggedIn(true)
      setActiveItem("Ưu đãi của tôi")
      setActiveDropdown(null)
      window.location.hash = "my-deals"
      window.scrollTo({ top: 0, behavior: "smooth" })
    } else if (
      item === "add-payment" ||
      item === "them-phuong-thuc" ||
      item === "Thêm phương thức" ||
      item === "them-phuong-thuc-thanh-toan"
    ) {
      setCurrentPage("add-payment")
      setIsLoggedIn(true)
      setActiveItem("Phương thức thanh toán")
      setActiveDropdown(null)
      window.location.hash = "add-payment"
      window.scrollTo({ top: 0, behavior: "smooth" })
    } else if (
      item === "payment" ||
      item === "thanh-toan" ||
      item === "Phương thức thanh toán" ||
      item === "phuong-thuc-thanh-toan" ||
      item === "billing"
    ) {
      setCurrentPage("payment")
      setIsLoggedIn(true)
      setActiveItem("Phương thức thanh toán")
      setActiveDropdown(null)
      window.location.hash = "payment"
      window.scrollTo({ top: 0, behavior: "smooth" })
    } else if (
      item === "account-info" ||
      item === "thong-tin-ca-nhan" ||
      item === "Thông tin cá nhân" ||
      item === "profile-info" ||
      item === "personal-info" ||
      item === "info"
    ) {
      setCurrentPage("account-info")
      setIsLoggedIn(true)
      setActiveItem("Thông tin cá nhân")
      setActiveDropdown(null)
      window.location.hash = "account-info"
      window.scrollTo({ top: 0, behavior: "smooth" })
    } else if (
      item === "reviews" ||
      item === "danh-gia" ||
      item === "danh-gia-cua-toi" ||
      item === "Đánh giá của tôi" ||
      item === "my-reviews"
    ) {
      setCurrentPage("reviews")
      setIsLoggedIn(true)
      setActiveItem("Đánh giá của tôi")
      setActiveDropdown(null)
      window.location.hash = "reviews"
      window.scrollTo({ top: 0, behavior: "smooth" })
    } else if (
      item === "favorites" ||
      item === "yeu-thich" ||
      item === "Yêu thích" ||
      item === "wishlist"
    ) {
      setCurrentPage("favorites")
      setIsLoggedIn(true)
      setActiveItem("Yêu thích")
      setActiveDropdown(null)
      window.location.hash = "favorites"
      window.scrollTo({ top: 0, behavior: "smooth" })
    } else if (
      item === "plans" ||
      item === "ke-hoach" ||
      item === "ke-hoach-cua-toi" ||
      item === "Kế hoạch của tôi" ||
      item === "my-plans"
    ) {
      setCurrentPage("plans")
      setIsLoggedIn(true)
      setActiveItem("Kế hoạch của tôi")
      setActiveDropdown(null)
      window.location.hash = "plans"
      window.scrollTo({ top: 0, behavior: "smooth" })
    } else if (
      item === "new-booking" ||
      item === "dat-dich-vu-moi" ||
      item === "Đặt dịch vụ mới"
    ) {
      setCurrentPage("new-booking")
      setIsLoggedIn(true)
      setActiveItem("Đơn đặt dịch vụ")
      setActiveDropdown(null)
      window.location.hash = "new-booking"
      window.scrollTo({ top: 0, behavior: "smooth" })
    } else if (
      item === "bookings" ||
      item === "Đơn đặt dịch vụ" ||
      item === "don-dat-dich-vu" ||
      item === "don-hang"
    ) {
      setCurrentPage("bookings")
      setIsLoggedIn(true)
      setActiveItem("Đơn đặt dịch vụ")
      setActiveDropdown(null)
      window.location.hash = "bookings"
      window.scrollTo({ top: 0, behavior: "smooth" })
    } else if (
      item === "profile" ||
      item === "Trang cá nhân" ||
      item === "trang-ca-nhan" ||
      item === "tai-khoan"
    ) {
      setCurrentPage("profile")
      setIsLoggedIn(true)
      setActiveItem("Trang cá nhân")
      setActiveDropdown(null)
      window.location.hash = "profile"
      window.scrollTo({ top: 0, behavior: "smooth" })
    } else if (item === "logout" || item === "Đăng xuất") {
      setIsLoggedIn(false)
      setCurrentPage("login")
      setActiveItem("Đăng nhập")
      setActiveDropdown(null)
      window.location.hash = "login"
      window.scrollTo({ top: 0, behavior: "smooth" })
    } else if (item === "login" || item === "Đăng nhập" || item === "dang-nhap") {
      setCurrentPage("login")
      setActiveItem("Đăng nhập")
      setActiveDropdown(null)
      window.location.hash = "login"
      window.scrollTo({ top: 0, behavior: "smooth" })
    } else if (item === "register" || item === "Đăng ký" || item === "dang-ky") {
      setCurrentPage("register")
      setActiveItem("Đăng nhập")
      setActiveDropdown(null)
      window.location.hash = "register"
      window.scrollTo({ top: 0, behavior: "smooth" })
    } else if (item === "Trang chủ") {
      setCurrentPage("home")
      setActiveItem("Trang chủ")
      setActiveDropdown(null)
      window.location.hash = "home"
      window.scrollTo({ top: 0, behavior: "smooth" })
    } else if (
      item === "Ưu đãi" ||
      item === "deals" ||
      item === "deal" ||
      item === "uu-dai" ||
      item === "uudai" ||
      item === "khuyen-mai"
    ) {
      setCurrentPage("deals")
      setActiveItem("Ưu đãi")
      setActiveDropdown(null)
      window.location.hash = "deals"
      window.scrollTo({ top: 0, behavior: "smooth" })
    } else if (
      item === "Di chuyển" ||
      item === "transport" ||
      item === "transportation" ||
      item === "di-chuyen" ||
      item === "dichuyen"
    ) {
      setCurrentPage("transport")
      setActiveItem("Di chuyển")
      setActiveDropdown(null)
      window.location.hash = "transport"
      window.scrollTo({ top: 0, behavior: "smooth" })
    } else if (
      item === "Khám phá" ||
      item === "Khám phá Phú Quốc" ||
      item === "phu-quoc" ||
      item === "phuquoc" ||
      item === "explore"
    ) {
      setCurrentPage("phu-quoc")
      setActiveItem("Khám phá")
      setActiveDropdown(null)
      window.location.hash = "phu-quoc"
      window.scrollTo({ top: 0, behavior: "smooth" })
    } else if (
      item === "Gói" ||
      item === "Tour" ||
      item === "packages" ||
      item === "package" ||
      item === "tours" ||
      item === "goi"
    ) {
      setCurrentPage("packages")
      setActiveItem("Gói")
      setActiveDropdown(null)
      window.location.hash = "packages"
      window.scrollTo({ top: 0, behavior: "smooth" })
    } else if (
      item === "Trải nghiệm" ||
      item === "experience" ||
      item === "experiences" ||
      item === "trai-nghiem"
    ) {
      setCurrentPage("experience")
      setActiveItem("Trải nghiệm")
      setActiveDropdown(null)
      window.location.hash = "experience"
      window.scrollTo({ top: 0, behavior: "smooth" })
    } else if (
      item === "Lưu trú" ||
      item === "stay" ||
      item === "villas" ||
      item === "Biệt thự" ||
      item === "accommodations"
    ) {
      setCurrentPage("stay")
      setActiveItem("Lưu trú")
      setActiveDropdown(null)
      window.location.hash = "stay"
      window.scrollTo({ top: 0, behavior: "smooth" })
    } else if (item === "Về Stayea") {
      setCurrentPage("about")
      setActiveItem("Về Stayea")
      setActiveDropdown(null)
      window.location.hash = "about"
      window.scrollTo({ top: 0, behavior: "smooth" })
    } else if (
      item === "support" ||
      item === "ho-tro" ||
      item === "Trung tâm hỗ trợ" ||
      item === "Câu hỏi thường gặp"
    ) {
      setActiveDropdown(null)
      alert("Đang kết nối trung tâm hỗ trợ khách hàng STAYEA 24/7 (Hotline: +84 297 730 9999)...")
    } else if (item === "Trở thành chủ nhà" || item === "host") {
      setCurrentPage("host")
      setActiveItem("Trở thành chủ nhà")
      setActiveDropdown(null)
      window.location.hash = "host"
      window.scrollTo({ top: 0, behavior: "smooth" })
    } else if (item === "Hợp tác cùng STAYEA" || item === "Hợp tác cùng Stayea" || item === "partner") {
      setCurrentPage("partner")
      setActiveItem("Hợp tác cùng STAYEA")
      setActiveDropdown(null)
      window.location.hash = "partner"
      window.scrollTo({ top: 0, behavior: "smooth" })
    } else {
      setActiveItem(item)
      if (currentPage !== "home") {
        setCurrentPage("home")
        window.location.hash = "home"
      }
    }
  }

  if (currentPage === "admin-reports") {
    return (
      <StayeaAdminReportsPage
        onNavigateLanding={() => {
          window.location.hash = "home"
          setCurrentPage("home")
          window.scrollTo({ top: 0, behavior: "smooth" })
        }}
        onNavigateTab={(tabId) => {
          if (tabId === "tong-quan" || tabId === "dashboard") {
            window.location.hash = "admin"
            setCurrentPage("dashboard")
          } else if (tabId === "dat-phong" || tabId === "bookings") {
            window.location.hash = "admin-bookings"
            setCurrentPage("admin-bookings")
          } else if (tabId === "bat-dong-san" || tabId === "properties") {
            window.location.hash = "properties"
            setCurrentPage("admin-properties")
          } else if (tabId === "uu-dai-khuyen-mai" || tabId === "deals") {
            window.location.hash = "admin-deals"
            setCurrentPage("admin-deals")
          } else if (tabId === "khach-hang" || tabId === "guests") {
            window.location.hash = "guests"
            setCurrentPage("admin-customers")
          } else if (tabId === "chu-nha-doi-tac" || tabId === "hosts") {
            window.location.hash = "hosts"
            setCurrentPage("admin-hosts")
          } else if (tabId === "trai-nghiem-tour" || tabId === "experience") {
            window.location.hash = "experiences"
            setCurrentPage("admin-experiences")
          } else if (tabId === "doanh-thu-thanh-toan" || tabId === "transactions" || tabId === "revenue") {
            window.location.hash = "doanh-thu-thanh-toan"
            setCurrentPage("admin-revenue")
          } else if (tabId === "danh-gia" || tabId === "reviews" || tabId === "admin-reviews") {
            window.location.hash = "danh-gia"
            setCurrentPage("admin-reviews")
          } else if (tabId === "tin-nhan" || tabId === "messages" || tabId === "admin-messages") {
            window.location.hash = "tin-nhan"
            setCurrentPage("admin-messages")
          } else if (tabId === "marketing" || tabId === "admin-marketing") {
            window.location.hash = "marketing"
            setCurrentPage("admin-marketing")
          } else if (tabId === "bao-cao" || tabId === "reports" || tabId === "admin-reports" || tabId === "analytics") {
            window.location.hash = "bao-cao"
            setCurrentPage("admin-reports")
          } else if (tabId === "cai-dat" || tabId === "settings") {
            window.location.hash = "cai-dat"
            setCurrentPage("settings")
          }
        }}
      />
    )
  }

  if (currentPage === "admin-marketing") {
    return (
      <StayeaAdminMarketingPage
        onNavigateLanding={() => {
          window.location.hash = "home"
          setCurrentPage("home")
          window.scrollTo({ top: 0, behavior: "smooth" })
        }}
        onNavigateTab={(tabId) => {
          if (tabId === "tong-quan" || tabId === "dashboard") {
            window.location.hash = "admin"
            setCurrentPage("dashboard")
          } else if (tabId === "dat-phong" || tabId === "bookings") {
            window.location.hash = "admin-bookings"
            setCurrentPage("admin-bookings")
          } else if (tabId === "bat-dong-san" || tabId === "properties") {
            window.location.hash = "properties"
            setCurrentPage("admin-properties")
          } else if (tabId === "uu-dai-khuyen-mai" || tabId === "deals") {
            window.location.hash = "admin-deals"
            setCurrentPage("admin-deals")
          } else if (tabId === "khach-hang" || tabId === "guests") {
            window.location.hash = "guests"
            setCurrentPage("admin-customers")
          } else if (tabId === "chu-nha-doi-tac" || tabId === "hosts") {
            window.location.hash = "hosts"
            setCurrentPage("admin-hosts")
          } else if (tabId === "trai-nghiem-tour" || tabId === "experience") {
            window.location.hash = "experiences"
            setCurrentPage("admin-experiences")
          } else if (tabId === "doanh-thu-thanh-toan" || tabId === "transactions" || tabId === "revenue") {
            window.location.hash = "doanh-thu-thanh-toan"
            setCurrentPage("admin-revenue")
          } else if (tabId === "danh-gia" || tabId === "reviews" || tabId === "admin-reviews") {
            window.location.hash = "danh-gia"
            setCurrentPage("admin-reviews")
          } else if (tabId === "tin-nhan" || tabId === "messages" || tabId === "admin-messages") {
            window.location.hash = "tin-nhan"
            setCurrentPage("admin-messages")
          } else if (tabId === "marketing" || tabId === "admin-marketing") {
            window.location.hash = "marketing"
            setCurrentPage("admin-marketing")
          } else if (tabId === "bao-cao" || tabId === "reports" || tabId === "admin-reports" || tabId === "analytics") {
            window.location.hash = "bao-cao"
            setCurrentPage("admin-reports")
          } else if (tabId === "cai-dat" || tabId === "settings") {
            window.location.hash = "cai-dat"
            setCurrentPage("settings")
          }
        }}
      />
    )
  }

  if (currentPage === "admin-messages") {
    return (
      <StayeaAdminMessagesPage
        onNavigateLanding={() => {
          window.location.hash = "home"
          setCurrentPage("home")
          window.scrollTo({ top: 0, behavior: "smooth" })
        }}
        onNavigateTab={(tabId) => {
          if (tabId === "tong-quan" || tabId === "dashboard") {
            window.location.hash = "admin"
            setCurrentPage("dashboard")
          } else if (tabId === "dat-phong" || tabId === "bookings") {
            window.location.hash = "admin-bookings"
            setCurrentPage("admin-bookings")
          } else if (tabId === "bat-dong-san" || tabId === "properties") {
            window.location.hash = "properties"
            setCurrentPage("admin-properties")
          } else if (tabId === "uu-dai-khuyen-mai" || tabId === "deals") {
            window.location.hash = "admin-deals"
            setCurrentPage("admin-deals")
          } else if (tabId === "khach-hang" || tabId === "guests") {
            window.location.hash = "guests"
            setCurrentPage("admin-customers")
          } else if (tabId === "chu-nha-doi-tac" || tabId === "hosts") {
            window.location.hash = "hosts"
            setCurrentPage("admin-hosts")
          } else if (tabId === "trai-nghiem-tour" || tabId === "experience") {
            window.location.hash = "experiences"
            setCurrentPage("admin-experiences")
          } else if (tabId === "doanh-thu-thanh-toan" || tabId === "transactions" || tabId === "revenue") {
            window.location.hash = "doanh-thu-thanh-toan"
            setCurrentPage("admin-revenue")
          } else if (tabId === "danh-gia" || tabId === "reviews" || tabId === "admin-reviews") {
            window.location.hash = "danh-gia"
            setCurrentPage("admin-reviews")
          } else if (tabId === "tin-nhan" || tabId === "messages" || tabId === "admin-messages") {
            window.location.hash = "tin-nhan"
            setCurrentPage("admin-messages")
          } else if (tabId === "marketing" || tabId === "admin-marketing") {
            window.location.hash = "marketing"
            setCurrentPage("admin-marketing")
          } else if (tabId === "bao-cao" || tabId === "reports" || tabId === "admin-reports" || tabId === "analytics") {
            window.location.hash = "bao-cao"
            setCurrentPage("admin-reports")
          } else if (tabId === "cai-dat" || tabId === "settings") {
            window.location.hash = "cai-dat"
            setCurrentPage("settings")
          }
        }}
      />
    )
  }

  if (currentPage === "admin-reviews") {
    return (
      <StayeaAdminReviewsPage
        onNavigateLanding={() => {
          window.location.hash = "home"
          setCurrentPage("home")
          window.scrollTo({ top: 0, behavior: "smooth" })
        }}
        onNavigateTab={(tabId) => {
          if (tabId === "tong-quan" || tabId === "dashboard") {
            window.location.hash = "admin"
            setCurrentPage("dashboard")
          } else if (tabId === "dat-phong" || tabId === "bookings") {
            window.location.hash = "admin-bookings"
            setCurrentPage("admin-bookings")
          } else if (tabId === "bat-dong-san" || tabId === "properties") {
            window.location.hash = "properties"
            setCurrentPage("admin-properties")
          } else if (tabId === "uu-dai-khuyen-mai" || tabId === "deals") {
            window.location.hash = "admin-deals"
            setCurrentPage("admin-deals")
          } else if (tabId === "khach-hang" || tabId === "guests") {
            window.location.hash = "guests"
            setCurrentPage("admin-customers")
          } else if (tabId === "chu-nha-doi-tac" || tabId === "hosts") {
            window.location.hash = "hosts"
            setCurrentPage("admin-hosts")
          } else if (tabId === "trai-nghiem-tour" || tabId === "experience") {
            window.location.hash = "experiences"
            setCurrentPage("admin-experiences")
          } else if (tabId === "doanh-thu-thanh-toan" || tabId === "transactions" || tabId === "revenue") {
            window.location.hash = "doanh-thu-thanh-toan"
            setCurrentPage("admin-revenue")
          } else if (tabId === "danh-gia" || tabId === "reviews" || tabId === "admin-reviews") {
            window.location.hash = "danh-gia"
            setCurrentPage("admin-reviews")
          } else if (tabId === "tin-nhan" || tabId === "messages" || tabId === "admin-messages") {
            window.location.hash = "tin-nhan"
            setCurrentPage("admin-messages")
          } else if (tabId === "marketing" || tabId === "admin-marketing") {
            window.location.hash = "marketing"
            setCurrentPage("admin-marketing")
          } else if (tabId === "bao-cao" || tabId === "reports" || tabId === "admin-reports" || tabId === "analytics") {
            window.location.hash = "bao-cao"
            setCurrentPage("admin-reports")
          } else if (tabId === "cai-dat" || tabId === "settings") {
            window.location.hash = "cai-dat"
            setCurrentPage("settings")
          }
        }}
      />
    )
  }

  if (currentPage === "admin-revenue") {
    return (
      <StayeaAdminRevenuePage
        onNavigateLanding={() => {
          window.location.hash = "home"
          setCurrentPage("home")
          window.scrollTo({ top: 0, behavior: "smooth" })
        }}
        onNavigateTab={(tabId) => {
          if (tabId === "tong-quan" || tabId === "dashboard") {
            window.location.hash = "admin"
            setCurrentPage("dashboard")
          } else if (tabId === "dat-phong" || tabId === "bookings") {
            window.location.hash = "admin-bookings"
            setCurrentPage("admin-bookings")
          } else if (tabId === "bat-dong-san" || tabId === "properties") {
            window.location.hash = "properties"
            setCurrentPage("admin-properties")
          } else if (tabId === "uu-dai-khuyen-mai" || tabId === "deals") {
            window.location.hash = "admin-deals"
            setCurrentPage("admin-deals")
          } else if (tabId === "khach-hang" || tabId === "guests") {
            window.location.hash = "guests"
            setCurrentPage("admin-customers")
          } else if (tabId === "chu-nha-doi-tac" || tabId === "hosts") {
            window.location.hash = "hosts"
            setCurrentPage("admin-hosts")
          } else if (tabId === "trai-nghiem-tour" || tabId === "experience") {
            window.location.hash = "experiences"
            setCurrentPage("admin-experiences")
          } else if (tabId === "doanh-thu-thanh-toan" || tabId === "transactions" || tabId === "revenue") {
            window.location.hash = "doanh-thu-thanh-toan"
            setCurrentPage("admin-revenue")
          } else if (tabId === "danh-gia" || tabId === "reviews" || tabId === "admin-reviews") {
            window.location.hash = "danh-gia"
            setCurrentPage("admin-reviews")
          } else if (tabId === "tin-nhan" || tabId === "messages" || tabId === "admin-messages") {
            window.location.hash = "tin-nhan"
            setCurrentPage("admin-messages")
          } else if (tabId === "marketing" || tabId === "admin-marketing") {
            window.location.hash = "marketing"
            setCurrentPage("admin-marketing")
          } else if (tabId === "bao-cao" || tabId === "reports" || tabId === "admin-reports" || tabId === "analytics") {
            window.location.hash = "bao-cao"
            setCurrentPage("admin-reports")
          } else if (tabId === "cai-dat" || tabId === "settings") {
            window.location.hash = "cai-dat"
            setCurrentPage("settings")
          }
        }}
      />
    )
  }

  if (currentPage === "admin-deals") {
    const activeHash = currentHash || (typeof window === "undefined" ? "" : window.location.hash)
    const isPreview =
      activeHash.includes("xem-truoc") ||
      activeHash.includes("xuat-ban") ||
      activeHash.includes("preview")
    const isMedia =
      activeHash.includes("hinh-anh") ||
      activeHash.includes("truyen-thong") ||
      activeHash.includes("media")
    const isGifts =
      activeHash.includes("qua-tang") ||
      activeHash.includes("gifts")
    const isConditions =
      activeHash.includes("dieu-kien") ||
      activeHash.includes("conditions")
    const isCreateOpen =
      isPreview ||
      isMedia ||
      isGifts ||
      isConditions ||
      activeHash.includes("tao") ||
      activeHash.includes("create") ||
      activeHash.includes("admin-deals") ||
      activeHash.includes("uu-dai-khuyen-mai") ||
      activeHash.includes("khuyen-mai") ||
      activeHash.includes("deal")

    const initialTab: DealModalTab = isPreview
      ? "preview"
      : isMedia
        ? "media"
        : isGifts
          ? "gifts"
          : isConditions
            ? "conditions"
            : "basic"

    return (
      <StayeaAdminDealsPage
        initialModalOpen={isCreateOpen}
        initialTab={initialTab}
        onNavigateLanding={() => {
          window.location.hash = "home"
          setCurrentPage("home")
          window.scrollTo({ top: 0, behavior: "smooth" })
        }}
        onNavigateTab={(tabId) => {
          if (tabId === "tong-quan" || tabId === "dashboard") {
            window.location.hash = "admin"
            setCurrentPage("dashboard")
          } else if (tabId === "dat-phong" || tabId === "bookings") {
            window.location.hash = "admin-bookings"
            setCurrentPage("admin-bookings")
          } else if (tabId === "bat-dong-san" || tabId === "properties") {
            window.location.hash = "properties"
            setCurrentPage("admin-properties")
          } else if (tabId === "uu-dai-khuyen-mai" || tabId === "deals") {
            window.location.hash = "admin-deals"
            setCurrentPage("admin-deals")
          } else if (tabId === "khach-hang" || tabId === "guests") {
            window.location.hash = "guests"
            setCurrentPage("admin-customers")
          } else if (tabId === "chu-nha-doi-tac" || tabId === "hosts") {
            window.location.hash = "hosts"
            setCurrentPage("admin-hosts")
          } else if (tabId === "trai-nghiem-tour" || tabId === "experience") {
            window.location.hash = "experiences"
            setCurrentPage("admin-experiences")
          } else if (tabId === "doanh-thu-thanh-toan" || tabId === "transactions" || tabId === "revenue") {
            window.location.hash = "doanh-thu-thanh-toan"
            setCurrentPage("admin-revenue")
          } else if (tabId === "danh-gia" || tabId === "reviews" || tabId === "admin-reviews") {
            window.location.hash = "danh-gia"
            setCurrentPage("admin-reviews")
          } else if (tabId === "tin-nhan" || tabId === "messages" || tabId === "admin-messages") {
            window.location.hash = "tin-nhan"
            setCurrentPage("admin-messages")
          } else if (tabId === "marketing" || tabId === "admin-marketing") {
            window.location.hash = "marketing"
            setCurrentPage("admin-marketing")
          } else if (tabId === "bao-cao" || tabId === "reports" || tabId === "admin-reports" || tabId === "analytics") {
            window.location.hash = "bao-cao"
            setCurrentPage("admin-reports")
          } else if (tabId === "cai-dat" || tabId === "settings") {
            window.location.hash = "cai-dat"
            setCurrentPage("settings")
          }
        }}
      />
    )
  }

  if (currentPage === "admin-experiences") {
    const activeHash = currentHash || (typeof window === "undefined" ? "" : window.location.hash)
    const isSeoTab =
      activeHash.includes("experiences-seo") ||
      activeHash.includes("tour-seo") ||
      activeHash.includes("seo-hien-thi")

    const isMediaTab =
      activeHash.includes("media") ||
      activeHash.includes("hinh-anh") ||
      activeHash.includes("video")

    const isPricingTab =
      activeHash.includes("pricing") ||
      activeHash.includes("gia-chinh-sach")

    const isItineraryTab =
      activeHash.includes("itinerary") ||
      activeHash.includes("lich-trinh") ||
      activeHash.includes("dich-vu") ||
      activeHash.includes("them-ngay") ||
      activeHash.includes("add-day")

    const isAddDayOpen =
      activeHash.includes("them-ngay") ||
      activeHash.includes("add-day")

    const isModalDefaultOpen =
      activeHash.includes("create") ||
      activeHash.includes("them") ||
      activeHash.includes("new") ||
      isItineraryTab ||
      isPricingTab ||
      isMediaTab ||
      isSeoTab

    const initialModalTab = isSeoTab
      ? "seo"
      : isMediaTab
        ? "media"
        : isPricingTab
          ? "pricing"
          : isItineraryTab
            ? "itinerary"
            : "basic"

    const isListOrManage =
      activeHash.includes("danh-sach") ||
      activeHash.includes("list") ||
      activeHash.includes("manage") ||
      isModalDefaultOpen

    const initialCategoryTab = isListOrManage ? "tour-trai-nghiem" : "tong-quan"

    return (
      <StayeaAdminExperiencesPage
        initialModalOpen={isModalDefaultOpen}
        initialTab={initialModalTab}
        initialAddDayOpen={isAddDayOpen}
        initialCategoryTab={initialCategoryTab}
        onNavigateLanding={() => {
          window.location.hash = "home"
          setCurrentPage("home")
          window.scrollTo({ top: 0, behavior: "smooth" })
        }}
        onNavigateTab={(tabId) => {
          if (tabId === "tong-quan" || tabId === "dashboard") {
            window.location.hash = "admin"
            setCurrentPage("dashboard")
          } else if (tabId === "dat-phong" || tabId === "bookings") {
            window.location.hash = "admin-bookings"
            setCurrentPage("admin-bookings")
          } else if (tabId === "bat-dong-san" || tabId === "properties") {
            window.location.hash = "properties"
            setCurrentPage("admin-properties")
          } else if (tabId === "khach-hang" || tabId === "guests") {
            window.location.hash = "customers"
            setCurrentPage("admin-customers")
          } else if (tabId === "chu-nha-doi-tac" || tabId === "hosts") {
            window.location.hash = "hosts"
            setCurrentPage("admin-hosts")
          } else if (tabId === "trai-nghiem-tour") {
            window.location.hash = "experiences"
            setCurrentPage("admin-experiences")
          } else if (tabId === "danh-gia" || tabId === "reviews" || tabId === "admin-reviews") {
            window.location.hash = "danh-gia"
            setCurrentPage("admin-reviews")
          } else if (tabId === "tin-nhan" || tabId === "messages" || tabId === "admin-messages") {
            window.location.hash = "tin-nhan"
            setCurrentPage("admin-messages")
          } else if (tabId === "marketing" || tabId === "admin-marketing") {
            window.location.hash = "marketing"
            setCurrentPage("admin-marketing")
          } else if (tabId === "bao-cao" || tabId === "reports" || tabId === "admin-reports" || tabId === "analytics") {
            window.location.hash = "bao-cao"
            setCurrentPage("admin-reports")
          }
        }}
      />
    )
  }

  if (currentPage === "admin-properties") {
    return (
      <StayeaAdminPropertiesPage
        onNavigateLanding={() => {
          window.location.hash = "home"
          setCurrentPage("home")
          window.scrollTo({ top: 0, behavior: "smooth" })
        }}
        onNavigateTab={(tabId) => {
          if (tabId === "tong-quan" || tabId === "dashboard") {
            window.location.hash = "admin"
            setCurrentPage("dashboard")
          } else if (tabId === "dat-phong") {
            window.location.hash = "admin-bookings"
            setCurrentPage("admin-bookings")
          } else if (tabId === "khach-hang" || tabId === "guests") {
            window.location.hash = "customers"
            setCurrentPage("admin-customers")
          } else if (tabId === "chu-nha-doi-tac" || tabId === "hosts") {
            window.location.hash = "hosts"
            setCurrentPage("admin-hosts")
          } else if (tabId === "trai-nghiem-tour" || tabId === "experience" || tabId === "experiences") {
            window.location.hash = "experiences"
            setCurrentPage("admin-experiences")
          } else if (tabId === "danh-gia" || tabId === "reviews" || tabId === "admin-reviews") {
            window.location.hash = "danh-gia"
            setCurrentPage("admin-reviews")
          } else if (tabId === "tin-nhan" || tabId === "messages" || tabId === "admin-messages") {
            window.location.hash = "tin-nhan"
            setCurrentPage("admin-messages")
          } else if (tabId === "marketing" || tabId === "admin-marketing") {
            window.location.hash = "marketing"
            setCurrentPage("admin-marketing")
          } else if (tabId === "bao-cao" || tabId === "reports" || tabId === "admin-reports" || tabId === "analytics") {
            window.location.hash = "bao-cao"
            setCurrentPage("admin-reports")
          }
        }}
      />
    )
  }

  if (currentPage === "admin-bookings") {
    const isModalDefaultOpen = typeof window !== "undefined" && (window.location.hash.includes("create") || window.location.hash.includes("tao"))
    return (
      <StayeaAdminBookingsPage
        initialModalOpen={isModalDefaultOpen}
        onNavigateLanding={() => {
          window.location.hash = "home"
          setCurrentPage("home")
          window.scrollTo({ top: 0, behavior: "smooth" })
        }}
        onNavigateTab={(tabId) => {
          if (tabId === "tong-quan" || tabId === "dashboard") {
            window.location.hash = "admin"
            setCurrentPage("dashboard")
          } else if (tabId === "bat-dong-san") {
            window.location.hash = "properties"
            setCurrentPage("admin-properties")
          } else if (tabId === "khach-hang" || tabId === "guests") {
            window.location.hash = "customers"
            setCurrentPage("admin-customers")
          } else if (tabId === "chu-nha-doi-tac" || tabId === "hosts") {
            window.location.hash = "hosts"
            setCurrentPage("admin-hosts")
          } else if (tabId === "trai-nghiem-tour" || tabId === "experience" || tabId === "experiences") {
            window.location.hash = "experiences"
            setCurrentPage("admin-experiences")
          } else if (tabId === "danh-gia" || tabId === "reviews" || tabId === "admin-reviews") {
            window.location.hash = "danh-gia"
            setCurrentPage("admin-reviews")
          } else if (tabId === "tin-nhan" || tabId === "messages" || tabId === "admin-messages") {
            window.location.hash = "tin-nhan"
            setCurrentPage("admin-messages")
          } else if (tabId === "marketing" || tabId === "admin-marketing") {
            window.location.hash = "marketing"
            setCurrentPage("admin-marketing")
          } else if (tabId === "bao-cao" || tabId === "reports" || tabId === "admin-reports" || tabId === "analytics") {
            window.location.hash = "bao-cao"
            setCurrentPage("admin-reports")
          }
        }}
      />
    )
  }

  if (currentPage === "admin-customers") {
    return (
      <StayeaAdminCustomersPage
        onNavigateLanding={() => {
          window.location.hash = "home"
          setCurrentPage("home")
          window.scrollTo({ top: 0, behavior: "smooth" })
        }}
        onNavigateTab={(tabId) => {
          if (tabId === "tong-quan" || tabId === "dashboard") {
            window.location.hash = "admin"
            setCurrentPage("dashboard")
          } else if (tabId === "dat-phong") {
            window.location.hash = "admin-bookings"
            setCurrentPage("admin-bookings")
          } else if (tabId === "bat-dong-san") {
            window.location.hash = "properties"
            setCurrentPage("admin-properties")
          } else if (tabId === "chu-nha-doi-tac" || tabId === "hosts") {
            window.location.hash = "hosts"
            setCurrentPage("admin-hosts")
          } else if (tabId === "trai-nghiem-tour" || tabId === "experience" || tabId === "experiences") {
            window.location.hash = "experiences"
            setCurrentPage("admin-experiences")
          } else if (tabId === "danh-gia" || tabId === "reviews" || tabId === "admin-reviews") {
            window.location.hash = "danh-gia"
            setCurrentPage("admin-reviews")
          } else if (tabId === "tin-nhan" || tabId === "messages" || tabId === "admin-messages") {
            window.location.hash = "tin-nhan"
            setCurrentPage("admin-messages")
          } else if (tabId === "marketing" || tabId === "admin-marketing") {
            window.location.hash = "marketing"
            setCurrentPage("admin-marketing")
          } else if (tabId === "bao-cao" || tabId === "reports" || tabId === "admin-reports" || tabId === "analytics") {
            window.location.hash = "bao-cao"
            setCurrentPage("admin-reports")
          }
        }}
      />
    )
  }

  if (currentPage === "admin-hosts") {
    const isModalDefaultOpen =
      typeof window !== "undefined" &&
      (window.location.hash.includes("create") ||
        window.location.hash.includes("them") ||
        window.location.hash.includes("new") ||
        window.location.hash.includes("business") ||
        window.location.hash.includes("doanh-nghiep") ||
        window.location.hash.includes("payment") ||
        window.location.hash.includes("thanh-toan") ||
        window.location.hash.includes("notes") ||
        window.location.hash.includes("settings") ||
        window.location.hash.includes("ghi-chu") ||
        window.location.hash.includes("cai-dat"))
    const initialModalTab =
      typeof window !== "undefined" &&
      (window.location.hash.includes("notes") ||
        window.location.hash.includes("settings") ||
        window.location.hash.includes("ghi-chu") ||
        window.location.hash.includes("cai-dat"))
        ? "notes"
        : typeof window !== "undefined" &&
          (window.location.hash.includes("payment") || window.location.hash.includes("thanh-toan"))
        ? "payment"
        : typeof window !== "undefined" &&
          (window.location.hash.includes("business") || window.location.hash.includes("doanh-nghiep"))
        ? "business"
        : "basic"
    return (
      <StayeaAdminHostsPage
        initialModalOpen={isModalDefaultOpen}
        initialModalTab={initialModalTab}
        onNavigateLanding={() => {
          window.location.hash = "home"
          setCurrentPage("home")
          window.scrollTo({ top: 0, behavior: "smooth" })
        }}
        onNavigateTab={(tabId) => {
          if (tabId === "tong-quan" || tabId === "dashboard") {
            window.location.hash = "admin"
            setCurrentPage("dashboard")
          } else if (tabId === "dat-phong" || tabId === "bookings") {
            window.location.hash = "admin-bookings"
            setCurrentPage("admin-bookings")
          } else if (tabId === "bat-dong-san" || tabId === "properties") {
            window.location.hash = "properties"
            setCurrentPage("admin-properties")
          } else if (tabId === "khach-hang" || tabId === "guests") {
            window.location.hash = "customers"
            setCurrentPage("admin-customers")
          }
        }}
      />
    )
  }

  if (currentPage === "dashboard" || currentPage === "admin") {
    return (
      <StayeaAdminDashboardPage
        onNavigateLanding={() => {
          window.location.hash = "home"
          setCurrentPage("home")
          window.scrollTo({ top: 0, behavior: "smooth" })
        }}
        onNavigateTab={(tabId) => {
          if (tabId === "tong-quan" || tabId === "dashboard") {
            window.location.hash = "admin"
            setCurrentPage("dashboard")
          } else if (tabId === "dat-phong" || tabId === "bookings") {
            window.location.hash = "admin-bookings"
            setCurrentPage("admin-bookings")
          } else if (tabId === "bat-dong-san" || tabId === "properties") {
            window.location.hash = "properties"
            setCurrentPage("admin-properties")
          } else if (tabId === "khach-hang" || tabId === "guests") {
            window.location.hash = "customers"
            setCurrentPage("admin-customers")
          } else if (tabId === "chu-nha-doi-tac" || tabId === "hosts") {
            window.location.hash = "hosts"
            setCurrentPage("admin-hosts")
          } else if (tabId === "trai-nghiem-tour" || tabId === "experience" || tabId === "experiences") {
            window.location.hash = "experiences"
            setCurrentPage("admin-experiences")
          } else if (tabId === "danh-gia" || tabId === "reviews" || tabId === "admin-reviews") {
            window.location.hash = "danh-gia"
            setCurrentPage("admin-reviews")
          } else if (tabId === "tin-nhan" || tabId === "messages" || tabId === "admin-messages") {
            window.location.hash = "tin-nhan"
            setCurrentPage("admin-messages")
          } else if (tabId === "marketing" || tabId === "admin-marketing") {
            window.location.hash = "marketing"
            setCurrentPage("admin-marketing")
          } else if (tabId === "bao-cao" || tabId === "reports" || tabId === "admin-reports" || tabId === "analytics") {
            window.location.hash = "bao-cao"
            setCurrentPage("admin-reports")
          }
        }}
      />
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-800 antialiased selection:bg-teal-100 selection:text-teal-900">
      {/* 1. Header & Navigation with floating overlay mega menu (0px layout shift) */}
      <StayeaHeader
        activeDropdown={activeDropdown}
        onSelectDropdown={setActiveDropdown}
        onDropdownEnter={handleDropdownEnter}
        onDropdownLeave={handleDropdownLeave}
        activeItem={activeItem}
        onNavigate={handleNavigate}
        isLoggedIn={currentPage === "profile" || isLoggedIn}
      />

      {/* Main Page Content */}
      <main id="main-content" className="flex-grow">
        {currentPage === "settings" ? (
          /* Settings Screen: Cài đặt */
          <StayeaSettingsPage onNavigate={handleNavigate} />
        ) : currentPage === "flight-booking" ? (
          /* Flight Booking Screen: Đặt vé máy bay đến Phú Quốc */
          <StayeaFlightBookingPage onNavigate={handleNavigate} />
        ) : currentPage === "stayea-club-claimed" ? (
          /* Stayea Club Claimed Offer Screen */
          <StayeaClubClaimedPage onNavigate={handleNavigate} />
        ) : currentPage === "stayea-club" ? (
          /* Stayea Club Screen */
          <StayeaClubPage onNavigate={handleNavigate} />
        ) : currentPage === "my-deals" ? (
          /* My Deals Screen */
          <MyDealsPage onNavigate={handleNavigate} />
        ) : currentPage === "add-payment" ? (
          /* Add Payment Method Screen */
          <AddPaymentMethodPage onNavigate={handleNavigate} />
        ) : currentPage === "payment" ? (
          /* Payment Methods & Billing Screen */
          <PaymentMethodsPage onNavigate={handleNavigate} />
        ) : currentPage === "account-info" ? (
          /* Account Info / Personal Information Screen */
          <AccountInfoPage onNavigate={handleNavigate} />
        ) : currentPage === "reviews" ? (
          /* Reviews Screen */
          <MyReviewsPage onNavigate={handleNavigate} />
        ) : currentPage === "favorites" ? (
          /* Favorites Screen */
          <FavoritesPage onNavigate={handleNavigate} />
        ) : currentPage === "plans" ? (
          /* My Plans & Itinerary Screen */
          <MyPlansPage onNavigate={handleNavigate} />
        ) : currentPage === "new-booking" ? (
          /* New Service Booking Screen */
          <NewBookingPage onNavigate={handleNavigate} />
        ) : currentPage === "bookings" ? (
          /* Service Bookings Management Screen */
          <BookingsPage onNavigate={handleNavigate} />
        ) : currentPage === "profile" ? (
          /* User Profile & Account Dashboard Screen */
          <ProfilePage onNavigate={handleNavigate} />
        ) : currentPage === "login" ? (
          /* Authentication Screen - Login Mode */
          <AuthPage initialMode="login" onNavigate={handleNavigate} />
        ) : currentPage === "register" ? (
          /* Authentication Screen - Register Mode */
          <AuthPage initialMode="register" onNavigate={handleNavigate} />
        ) : currentPage === "deals" ? (
          /* Deals & Promotions Listing Screen */
          <DealsListingPage onNavigate={handleNavigate} />
        ) : currentPage === "transport" ? (
          /* Transportation Listing Screen */
          <TransportListingPage onNavigate={handleNavigate} />
        ) : currentPage === "phu-quoc" ? (
          /* Khám phá Phú Quốc Listing Screen */
          <PhuQuocListingPage onNavigate={handleNavigate} />
        ) : currentPage === "packages" ? (
          /* Packages & Tours Listing Screen */
          <PackageListingPage onNavigate={handleNavigate} />
        ) : currentPage === "experience" ? (
          /* Experience Listing Screen */
          <ExperienceListingPage onNavigate={handleNavigate} />
        ) : currentPage === "stay" ? (
          /* Villa & Accommodations Listing Screen */
          <StayListingPage onNavigate={handleNavigate} />
        ) : currentPage === "partner" ? (
          <>
            {/* 1. Hero Section: "Hợp tác cùng STAYEA" */}
            <PartnerHero />

            {/* 2. Benefits: 8-card grid */}
            <PartnerBenefits />

            {/* 3. Partner Categories: 6 categories */}
            <PartnerCategories />

            {/* 4. Process: 4-step journey */}
            <PartnerProcess />

            {/* 5. Values, Transparency & FAQ + Registration Form */}
            <PartnerTransparencyAndForm />
          </>
        ) : currentPage === "host" ? (
          <>
            {/* 1. Host Hero: Luxury Infinity Pool Banner + 4 Pillars */}
            <HostHero />

            {/* 2. Host Benefits: 8 Benefits Grid */}
            <HostBenefits />

            {/* 3. Host Process: 4-Step Process */}
            <HostProcess />

            {/* 4. Host Values, Accommodations, Transparency + Register Form */}
            <HostPartnershipAndForm />

            {/* 5. Host FAQs: 4 Accordion Cards */}
            <HostFaq />
          </>
        ) : currentPage === "about" ? (
          <>
            {/* 2. Hero Section: "STAYEA – Hơn cả một nơi lưu trú..." */}
            <AboutHero />

            {/* 3. Story Section: "Từ tình yêu Phú Quốc đến một hành trình ý nghĩa" */}
            <AboutStory />

            {/* 4. Principles Section: "Tầm nhìn – Sứ mệnh – Giá trị cốt lõi" */}
            <AboutPrinciples />

            {/* 5. Team Section: "Đội ngũ của chúng tôi" */}
            <AboutTeam />

            {/* 6. Conversion Section: 3 cards (Club, Host, Partner) */}
            <AboutConversion onNavigate={handleNavigate} />
          </>
        ) : (
          <>
            {/* Home Screen: Redesigned Balanced Banner */}
            <StayeaHero onNavigate={handleNavigate} />
            <AccommodationSection onNavigate={handleNavigate} />
            <ExperiencesAndPackagesSection onNavigate={handleNavigate} />
            <ExploreSection onNavigate={handleNavigate} />
            <TransportationSection onNavigate={handleNavigate} />
            <PromosAndPartnersSection onNavigate={handleNavigate} />
          </>
        )}
      </main>

      {/* Luxury Dark Footer */}
      <StayeaFooter
        variant={currentPage === "home" ? "default" : "about"}
        onNavigate={handleNavigate}
      />
    </div>
  )
}
