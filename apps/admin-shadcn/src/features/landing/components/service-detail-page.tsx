"use client"

import * as React from "react"
import Image from "next/image"
import {
  ArrowLeft,
  Share2,
  Heart,
  Star,
  MapPin,
  ShieldCheck,
  Crown,
  Calendar,
  Users,
  Clock,
  Sparkles,
  CheckCircle2,
  PhoneCall,
  MessageSquare,
  Waves,
  Utensils,
  Coffee,
  Laptop,
  Check,
  ChevronRight,
  ChevronLeft,
  X,
  CreditCard,
  Building2,
  Car,
  Compass,
  FileCheck,
  ThumbsUp,
} from "lucide-react"

import { stayeaApi } from "@/lib/stayea-api-service"
import {
  STAY_ACCOMMODATION_LISTINGS,
  EXPERIENCE_LISTINGS,
  PACKAGE_LISTINGS,
  TRANSPORT_ITEMS,
} from "@/features/landing/data/stayea-mock-data"

export type ServiceType = "stay" | "experience" | "package" | "transport"

export interface ServiceDetailPayload {
  readonly type: ServiceType
  readonly item: any
}

interface ServiceDetailPageProps {
  readonly type?: ServiceType
  readonly item?: any
  readonly onBack?: () => void
  readonly onNavigate?: (item: string, subCategory?: string, itemData?: any) => void
}

// Fallback high-res photos catalog for luxury gallery
const LUXURY_GALLERY_PHOTOS: Record<ServiceType, string[]> = {
  stay: [
    "/stay/the-shell-resort.jpg",
    "/stay/ocean-bliss-villa.jpg",
    "/stay/salinda-resort.jpg",
    "/stay/seashell-boutique.jpg",
    "/stay/famiana-resort.jpg",
    "/stay/lahana-villa.jpg",
    "/stay/the-leaf-villa.jpg",
  ],
  experience: [
    "/experience/scuba-diving.jpg",
    "/experience/snorkeling-nam-dao.jpg",
    "/experience/sunset-cruise.jpg",
    "/experience/tour-3-dao.jpg",
    "/experience/cano-4-islands.jpg",
    "/experience/kayak-rach-vem.jpg",
    "/experience/cooking-class.jpg",
  ],
  package: [
    "/packages/tour-3-dao.jpg",
    "/packages/lan-ngam-san-ho.jpg",
    "/packages/sunset-cruise.jpg",
    "/packages/hon-thom-cap-treo.jpg",
    "/packages/kham-pha-4-dao.jpg",
    "/packages/tour-am-thuc.jpg",
    "/packages/family-fun.jpg",
  ],
  transport: [
    "/transport/airport-premium-transfer.jpg",
    "/transport/sunset-car-rental.jpg",
    "/transport/family-airport-van.jpg",
    "/transport/private-driver-elite.jpg",
    "/transport/beach-road-suv-rental.jpg",
    "/transport/flexible-scooter-daily.jpg",
    "/transport/island-motorbike-rental.jpg",
  ],
}

// Category names in Vietnamese
const CATEGORY_TITLES: Record<ServiceType, { label: string; route: string }> = {
  stay: { label: "Lưu trú", route: "stay" },
  experience: { label: "Trải nghiệm", route: "experience" },
  package: { label: "Gói hành trình", route: "packages" },
  transport: { label: "Di chuyển", route: "transport" },
}

function formatCurrency(val: number): string {
  return new Intl.NumberFormat("vi-VN").format(val) + " đ"
}

export function ServiceDetailPage({
  type = "stay",
  item,
  onBack,
  onNavigate,
}: ServiceDetailPageProps) {
  // Resolve item fallback if none provided
  const activeItem = React.useMemo(() => {
    if (item) return item
    if (type === "stay") return STAY_ACCOMMODATION_LISTINGS[1] || STAY_ACCOMMODATION_LISTINGS[0]
    if (type === "experience") return EXPERIENCE_LISTINGS[0]
    if (type === "package") return PACKAGE_LISTINGS[0]
    if (type === "transport") return TRANSPORT_ITEMS[0]
    return STAY_ACCOMMODATION_LISTINGS[0]
  }, [item, type])

  // Gallery images array
  const galleryImages = React.useMemo(() => {
    if (Array.isArray(activeItem.gallery) && activeItem.gallery.length > 0) {
      return activeItem.gallery.slice(0, 5)
    }
    const defaultPhotos = LUXURY_GALLERY_PHOTOS[type] || LUXURY_GALLERY_PHOTOS.stay
    const mainPhoto = activeItem.imageUrl || defaultPhotos[0]
    const otherPhotos = defaultPhotos.filter((p: string) => p !== mainPhoto)
    return [mainPhoto, ...otherPhotos].slice(0, 5)
  }, [activeItem.imageUrl, activeItem.gallery, type])

  // UI state
  const [isWishlisted, setIsWishlisted] = React.useState(false)
  const [copiedLink, setCopiedLink] = React.useState(false)
  const [galleryModalOpen, setGalleryModalOpen] = React.useState(false)
  const [currentGalleryIndex, setCurrentGalleryIndex] = React.useState(0)
  const [isDescriptionExpanded, setIsDescriptionExpanded] = React.useState(false)
  const [selectedVariantIndex, setSelectedVariantIndex] = React.useState(0)

  // Booking calculations
  const [checkInDate, setCheckInDate] = React.useState("2026-10-25")
  const [checkOutDate, setCheckOutDate] = React.useState("2026-10-28")
  const [guestCount, setGuestCount] = React.useState(2)

  // Booking Modal
  const [bookingModalOpen, setBookingModalOpen] = React.useState(false)
  const [bookingSuccess, setBookingSuccess] = React.useState(false)
  const [bookingCode, setBookingCode] = React.useState("")
  const [customerName, setCustomerName] = React.useState("")
  const [customerPhone, setCustomerPhone] = React.useState("")
  const [customerEmail, setCustomerEmail] = React.useState("")

  // Auto fill customer information if user is authenticated
  React.useEffect(() => {
    stayeaApi.getProfile().then((u) => {
      if (u) {
        if (u.displayName || u.name) setCustomerName(u.displayName || u.name)
        if (u.phone) setCustomerPhone(u.phone)
        if (u.email) setCustomerEmail(u.email)
      }
    }).catch(() => {})
  }, [])
  const [customerNotes, setCustomerNotes] = React.useState("")
  const [paymentMethod, setPaymentMethod] = React.useState("vietqr")

  // Copy share link with deep-link query params
  const handleShare = () => {
    if (typeof window !== "undefined") {
      const shareUrl = `${window.location.origin}/service-detail?type=${type}&id=${encodeURIComponent(activeItem.id || "")}`
      navigator.clipboard?.writeText(shareUrl)
      setCopiedLink(true)
      setTimeout(() => setCopiedLink(false), 2500)
    }
  }

  // Update document title for SEO & browser tab consistency
  React.useEffect(() => {
    if (typeof document === "undefined" || !activeItem?.title) return
    const originalTitle = document.title
    document.title = `${activeItem.title} | STAYEA Phú Quốc`
    return () => {
      document.title = originalTitle
    }
  }, [activeItem?.title])

  // Calculate nights
  const numberOfNights = React.useMemo(() => {
    try {
      const d1 = new Date(checkInDate).getTime()
      const d2 = new Date(checkOutDate).getTime()
      const diffDays = Math.ceil((d2 - d1) / (1000 * 3600 * 24))
      return diffDays > 0 ? diffDays : 1
    } catch {
      return 3
    }
  }, [checkInDate, checkOutDate])

  // Unit price extraction
  const baseUnitPrice = React.useMemo(() => {
    if (activeItem.pricePerNight) return activeItem.pricePerNight
    if (activeItem.price) return activeItem.price
    return 3_200_000
  }, [activeItem])

  // Variants options with different price tiers
  const roomVariants = React.useMemo(() => {
    if (type === "stay") {
      return [
        {
          name: "Phòng Deluxe View Biển (Tiêu chuẩn)",
          desc: "Diện tích 55m², giường King size, bồn tắm nằm view vườn",
          multiplier: 1,
          specs: "2 khách · 1 giường lớn · Ban công riêng",
        },
        {
          name: "Villa Biển Hướng Hoàng Hôn (Stayea Select)",
          desc: "Diện tích 120m², hồ bơi riêng, trực diện biển, quản gia riêng",
          multiplier: 1.45,
          specs: "4 khách · 2 phòng ngủ · Hồ bơi riêng",
        },
        {
          name: "Presidential Sunset Beach Villa (Cao cấp nhất)",
          desc: "Diện tích 280m², 3 phòng ngủ, bãi biển riêng tư, xe đưa đón riêng",
          multiplier: 2.2,
          specs: "6-8 khách · 3 phòng ngủ · Sân vườn riêng",
        },
      ]
    }
    if (type === "experience") {
      return [
        {
          name: "Tour Tiêu Chuẩn (Nhóm tối đa 12 khách)",
          desc: "Đã bao gồm trang thiết bị, cano cao tốc, đồ ăn nhẹ & nước uống",
          multiplier: 1,
          specs: "Trọn gói cơ bản · Đón tại khách sạn",
        },
        {
          name: "Tour VIP Riêng Tư (Cano riêng & Quay Flycam)",
          desc: "Cano riêng cho gia đình/cặp đôi, tặng kèm video flycam 4K chuyên nghiệp",
          multiplier: 1.8,
          specs: "Riêng tư 100% · Flycam 4K · Set hải sản",
        },
      ]
    }
    if (type === "package") {
      return [
        {
          name: "Gói Kỳ Nghỉ Cơ Bản (Resort 4* + Tour Đảo)",
          desc: "3N2Đ tại Resort 4*, xe đưa đón sân bay, 01 bữa tối lãng mạn",
          multiplier: 1,
          specs: "3N2Đ · Đưa đón sân bay · Bữa sáng hàng ngày",
        },
        {
          name: "Gói Nghỉ Dưỡng Thượng Lưu (Resort 5* + Sunset Cruise)",
          desc: "3N2Đ tại Villa 5*, du thuyền ngắm hoàng hôn, spa trị liệu 60 phút",
          multiplier: 1.55,
          specs: "3N2Đ · Sunset Cruise · Spa 60 phút · Concierge",
        },
      ]
    }
    return [
      {
        name: "Dịch Vụ Tiêu Chuẩn",
        desc: "Đưa đón đúng giờ, xe sạch sẽ, nước uống & khăn lạnh miễn phí",
        multiplier: 1,
        specs: "Xe đời mới · Tài xế kinh nghiệm · Bảo hiểm",
      },
      {
        name: "Dịch Vụ VIP Chuyên Biệt",
        desc: "Xe Mercedes/Sedona cao cấp, phục vụ nước ngọt & trái cây, linh hoạt giờ đón",
        multiplier: 1.5,
        specs: "Xe hạng sang VIP · Nước ngọt & Trái cây · Biển đón tên",
      },
    ]
  }, [type])

  const currentMultiplier = roomVariants[selectedVariantIndex]?.multiplier || 1
  const adjustedUnitPrice = Math.round(baseUnitPrice * currentMultiplier)

  // Calculations
  const unitsCount = type === "stay" ? numberOfNights : type === "experience" ? guestCount : 1
  const subtotal = adjustedUnitPrice * unitsCount
  const clubDiscount = Math.round(subtotal * 0.1) // 10% Stayea Club discount
  const serviceFee = 0 // Free Stayea service fee
  const totalAmount = subtotal - clubDiscount + serviceFee



  // Handle open booking modal
  const handleOpenBooking = () => {
    setBookingCode("STAY-PQ-" + Math.floor(1000 + Math.random() * 9000))
    setBookingSuccess(false)
    setBookingModalOpen(true)
  }

  const [isSubmittingBooking, setIsSubmittingBooking] = React.useState(false)
  const [bookingSuccessMessage, setBookingSuccessMessage] = React.useState("")

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmittingBooking(true)
    try {
      const result = await stayeaApi.createBooking({
        bookingType: type,
        title: activeItem.title,
        destination: activeItem.location || activeItem.area || "Phú Quốc",
        startDate: checkInDate,
        endDate: checkOutDate,
        guestCount: guestCount,
        totalAmount: totalAmount,
        paymentMethod: paymentMethod,
        details: {
          stayId: type === "stay" ? activeItem.id : undefined,
          experienceId: type === "experience" ? activeItem.id : undefined,
          packageId: type === "package" ? activeItem.id : undefined,
          roomType: roomVariants[selectedVariantIndex]?.name,
          nightCount: numberOfNights,
          contactInfo: {
            fullName: customerName,
            email: customerEmail,
            phone: customerPhone,
            note: customerNotes,
          },
        },
      })

      if (result.success) {
        setBookingCode(result.bookingCode)
        setBookingSuccessMessage(result.message || "Đặt dịch vụ thành công!")
        setBookingSuccess(true)
      } else {
        alert(result.message || "Không thể khởi tạo đặt chỗ. Vui lòng thử lại.")
      }
    } catch (err: any) {
      alert("Đã xảy ra lỗi khi gửi yêu cầu đặt dịch vụ: " + (err?.message || "Vui lòng thử lại sau."))
    } finally {
      setIsSubmittingBooking(false)
    }
  }

  // Related items list
  const relatedItems = React.useMemo(() => {
    if (type === "stay") {
      return STAY_ACCOMMODATION_LISTINGS.filter((s) => s.id !== activeItem.id).slice(0, 4)
    }
    if (type === "experience") {
      return EXPERIENCE_LISTINGS.filter((e) => e.id !== activeItem.id).slice(0, 4)
    }
    if (type === "package") {
      return PACKAGE_LISTINGS.filter((p) => p.id !== activeItem.id).slice(0, 4)
    }
    return TRANSPORT_ITEMS.filter((t) => t.id !== activeItem.id).slice(0, 4)
  }, [activeItem.id, type])

  return (
    <div className="min-h-screen bg-[#FBFBFA] text-slate-800 pb-20">
      {/* 1. Breadcrumbs & Top Navigation Bar */}
      <div className="bg-white border-b border-slate-200/80 sticky top-0 z-30 backdrop-blur-md bg-white/95">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 overflow-hidden">
            <button
              type="button"
              onClick={onBack || (() => onNavigate?.(CATEGORY_TITLES[type].route))}
              className="inline-flex items-center gap-1.5 font-semibold text-slate-700 hover:text-[#0c3b40] transition-colors p-1 rounded-md hover:bg-slate-100 shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Quay lại</span>
            </button>
            <span className="text-slate-300">/</span>
            <button
              type="button"
              onClick={() => onNavigate?.("home")}
              className="hover:text-slate-900 transition-colors shrink-0"
            >
              Trang chủ
            </button>
            <span className="text-slate-300">/</span>
            <button
              type="button"
              onClick={() => onNavigate?.(CATEGORY_TITLES[type].route)}
              className="hover:text-slate-900 transition-colors shrink-0"
            >
              {CATEGORY_TITLES[type].label}
            </button>
            <span className="text-slate-300">/</span>
            <span className="font-semibold text-slate-900 truncate max-w-[180px] sm:max-w-[280px]">
              {activeItem.title}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleShare}
              className="relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Chia sẻ</span>
              {copiedLink && (
                <span className="absolute -bottom-8 right-0 bg-slate-900 text-white text-[10px] px-2 py-0.5 rounded shadow-md whitespace-nowrap animate-in fade-in">
                  Đã sao chép liên kết!
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setIsWishlisted(!isWishlisted)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all ${
                isWishlisted
                  ? "border-rose-200 bg-rose-50 text-rose-600"
                  : "border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isWishlisted ? "fill-rose-500 text-rose-500" : "text-slate-500"}`} />
              <span className="hidden sm:inline">{isWishlisted ? "Đã lưu" : "Lưu"}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* 2. Header Title & Badges */}
        <div className="mb-5">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#0c3b40]/10 text-[#0c3b40] border border-[#0c3b40]/20">
              <Crown className="w-3 h-3 text-amber-500" />
              <span>Stayea Select</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-700 border border-amber-500/20">
              <ShieldCheck className="w-3 h-3 text-amber-500" />
              <span>Đã kiểm định 36 tiêu chuẩn</span>
            </span>
            {activeItem.badge && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-700 border border-emerald-500/20">
                <Sparkles className="w-3 h-3 text-emerald-500" />
                <span>{activeItem.badge.text || "Được yêu thích nhất"}</span>
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {activeItem.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 mt-2.5 text-xs sm:text-sm text-slate-600">
            <div className="flex items-center gap-1 font-bold text-slate-900">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{(activeItem.rating || 4.9).toFixed(1)}</span>
              <span className="text-slate-500 font-normal underline cursor-pointer ml-0.5">
                ({activeItem.reviewsCount || 96} đánh giá thực tế)
              </span>
            </div>
            <span className="text-slate-300">·</span>
            <div className="flex items-center gap-1 text-slate-600">
              <MapPin className="w-4 h-4 text-[#0c3b40] shrink-0" />
              <span>{activeItem.location || activeItem.area || "Bãi Trường, Dương Tơ, Phú Quốc"}</span>
              <span className="text-[#0c3b40] underline font-medium cursor-pointer ml-1">Xem vị trí</span>
            </div>
          </div>
        </div>

        {/* 3. Luxury 5-Photo Gallery */}
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-100 shadow-xs border border-slate-200/80 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 h-[340px] sm:h-[420px] lg:h-[480px]">
            {/* Main Hero Photo (Takes 2 cols on medium+) */}
            <div
              className="relative md:col-span-2 h-full cursor-pointer group overflow-hidden"
              onClick={() => {
                setCurrentGalleryIndex(0)
                setGalleryModalOpen(true)
              }}
            >
              <Image
                src={galleryImages[0]}
                alt={activeItem.title}
                fill
                priority
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* 4 Supporting Photos in 2x2 grid */}
            <div className="hidden md:grid md:col-span-2 grid-cols-2 gap-2 h-full">
              {galleryImages.slice(1, 5).map((img: string, idx: number) => (
                <div
                  key={`grid-photo-${img}`}
                  className="relative h-full cursor-pointer group overflow-hidden bg-slate-100"
                  onClick={() => {
                    setCurrentGalleryIndex(idx + 1)
                    setGalleryModalOpen(true)
                  }}
                >
                  <Image
                    src={img}
                    alt={`${activeItem.title} ảnh ${idx + 2}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    sizes="25vw"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                </div>
              ))}
            </div>
          </div>

          {/* Floating 'View All Photos' Button */}
          <button
            type="button"
            onClick={() => {
              setCurrentGalleryIndex(0)
              setGalleryModalOpen(true)
            }}
            className="absolute bottom-4 right-4 z-10 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/90 hover:bg-white text-slate-900 font-semibold text-xs shadow-md backdrop-blur-md transition-all active:scale-95 border border-slate-200/80"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#0c3b40]" />
            <span>Xem tất cả ảnh (18+ ảnh)</span>
          </button>
        </div>

        {/* 4. Main 2-Column Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12 items-start">
          {/* LEFT COLUMN: Narrative, Specs, Amenities, Variants, Host, Reviews (8 cols) */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-8">
            {/* A. Key Specifications Ribbon */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                Thông số dịch vụ nổi bật
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {type === "stay" ? (
                  <>
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-teal-50 text-[#0c3b40] flex items-center justify-center shrink-0">
                        <Users className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-[11px] text-slate-400">Sức chứa</div>
                        <div className="text-xs font-bold text-slate-800">4 - 8 khách</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-[11px] text-slate-400">Phòng ngủ</div>
                        <div className="text-xs font-bold text-slate-800">3 phòng ngủ lớn</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                        <Waves className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-[11px] text-slate-400">Diện tích</div>
                        <div className="text-xs font-bold text-slate-800">220m² · View biển</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-[11px] text-slate-400">Hủy phòng</div>
                        <div className="text-xs font-bold text-emerald-600">Miễn phí 48h</div>
                      </div>
                    </div>
                  </>
                ) : type === "experience" ? (
                  <>
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-teal-50 text-[#0c3b40] flex items-center justify-center shrink-0">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-[11px] text-slate-400">Thời lượng</div>
                        <div className="text-xs font-bold text-slate-800">{activeItem.duration || "1 ngày trọn gói"}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                        <Users className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-[11px] text-slate-400">Quy mô nhóm</div>
                        <div className="text-xs font-bold text-slate-800">Tối đa 12 người</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                        <Compass className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-[11px] text-slate-400">Điểm đón</div>
                        <div className="text-xs font-bold text-slate-800">Tận nơi trung tâm</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-[11px] text-slate-400">Bảo hiểm</div>
                        <div className="text-xs font-bold text-emerald-600">Đã bao gồm 100%</div>
                      </div>
                    </div>
                  </>
                ) : type === "package" ? (
                  <>
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-teal-50 text-[#0c3b40] flex items-center justify-center shrink-0">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-[11px] text-slate-400">Thời gian</div>
                        <div className="text-xs font-bold text-slate-800">{activeItem.duration || "3 Ngày 2 Đêm"}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-[11px] text-slate-400">Lưu trú</div>
                        <div className="text-xs font-bold text-slate-800">Resort 5 sao biển</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                        <Utensils className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-[11px] text-slate-400">Ẩm thực</div>
                        <div className="text-xs font-bold text-slate-800">Buffet + Tiệc nướng</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                        <Car className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-[11px] text-slate-400">Di chuyển</div>
                        <div className="text-xs font-bold text-emerald-600">Xe riêng đưa đón</div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-teal-50 text-[#0c3b40] flex items-center justify-center shrink-0">
                        <Car className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-[11px] text-slate-400">Dòng xe</div>
                        <div className="text-xs font-bold text-slate-800">Sedan / SUV 7 chỗ</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-[11px] text-slate-400">Thời gian</div>
                        <div className="text-xs font-bold text-slate-800">Đón đúng giờ 24/7</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-[11px] text-slate-400">Phạm vi</div>
                        <div className="text-xs font-bold text-slate-800">Toàn đảo Phú Quốc</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-[11px] text-slate-400">Bảo hiểm</div>
                        <div className="text-xs font-bold text-emerald-600">Bảo hiểm trọn chuyến</div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* B. Stayea Signature Highlights */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#0c3b40]" />
                <span>Đặc quyền kỳ nghỉ tại {activeItem.title}</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="w-8 h-8 rounded-lg bg-teal-100 text-[#0c3b40] flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xs text-slate-900">Vị trí trực diện biển đắc địa</h3>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                      Chỉ vài bước chân chạm cát mịn, tận hưởng trọn vẹn cảnh sắc hoàng hôn lộng lẫy nhất Phú Quốc.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Crown className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xs text-slate-900">Dịch vụ quản gia & Concierge 24/7</h3>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                      Hỗ trợ đặt bàn nhà hàng riêng, cano ngắm san hô và hỗ trợ mọi nhu cầu cá nhân hóa suốt hành trình.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xs text-slate-900">Cam kết tiêu chuẩn Stayea Verified</h3>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                      Đã qua kiểm định thực tế về độ sạch sẽ, tiện nghi đẳng cấp và pháp lý rõ ràng.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Coffee className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xs text-slate-900">Bữa sáng thượng hạng & Trà chiều</h3>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                      Thưởng thức menu fusion Á-Âu được chuẩn bị bởi đầu bếp danh tiếng từ nguồn nguyên liệu địa phương tươi mới.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* C. Descriptive Story Narrative */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
              <h2 className="text-base font-bold text-slate-900 mb-3">Về không gian & trải nghiệm</h2>
              <div className="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-3">
                <p>
                  Tọa lạc tại vị trí đắc địa của đảo ngọc Phú Quốc, <strong>{activeItem.title}</strong> được kiến tạo như một thiên đường nghỉ dưỡng biệt lập, nơi vẻ đẹp hoang sơ của biển xanh giao hòa cùng lối kiến trúc đương đại tinh xảo. Từng chi tiết tại đây đều được chăm chút kỹ lưỡng để mang lại cảm giác thư thái và riêng tư tuyệt đối cho kỳ nghỉ của bạn.
                </p>
                <p>
                  Không gian mở thoáng đãng với trần cao và hệ cửa kính panorama lớn đón trọn làn gió biển trong lành cùng ánh sáng tự nhiên ngập tràn. Bạn có thể thả mình trên ghế tắm nắng cạnh hồ bơi riêng, lắng nghe tiếng sóng vỗ rì rào và nhâm nhi một ly cocktail nhiệt đới mát lạnh vào lúc hoàng hôn buông xuống chân trời.
                </p>
                {isDescriptionExpanded && (
                  <>
                    <p>
                      Mỗi phòng nghỉ đều trang bị nệm cao cấp chuẩn khách sạn quốc tế, ga trải giường cotton Ai Cập mềm mại và menu gối tự chọn giúp bạn có giấc ngủ sâu trọn vẹn. Phòng tắm phong cách spa với bồn tắm ngâm sâu hướng vườn hoa nhiệt đới cùng bộ sản phẩm tắm gội hữu cơ cao cấp.
                    </p>
                    <p>
                      Đội ngũ nhân viên và quản gia Stayea luôn sẵn sàng đồng hành với sự hiếu khách nồng hậu, sẵn sàng sắp đặt các bữa tiệc BBQ hải sản riêng tư bên bờ biển hay chuyến tham quan đảo ngọc theo lịch trình độc bản của riêng bạn.
                    </p>
                  </>
                )}
              </div>

              <button
                type="button"
                onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                className="mt-3 text-xs font-semibold text-[#0c3b40] hover:underline inline-flex items-center gap-1"
              >
                <span>{isDescriptionExpanded ? "Thu gọn nội dung" : "Đọc thêm toàn bộ mô tả"}</span>
                <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isDescriptionExpanded ? "rotate-90" : ""}`} />
              </button>
            </div>

            {/* D. Selectable Room / Package / Service Variants */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-900">
                  Lựa chọn hạng phòng & Tùy chọn dịch vụ
                </h2>
                <span className="text-[11px] text-slate-500 font-medium">Giá cập nhật trực tiếp vào bảng tính</span>
              </div>

              <div className="space-y-3">
                {roomVariants.map((variant, idx) => {
                  const isSelected = selectedVariantIndex === idx
                  const variantPrice = Math.round(baseUnitPrice * variant.multiplier)
                  return (
                    <div
                      key={variant.name}
                      role="button"
                      tabIndex={0}
                      onClick={() => setSelectedVariantIndex(idx)}
                      onKeyDown={(e) => { if (e.key === 'Enter') setSelectedVariantIndex(idx) }}
                      className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                        isSelected
                          ? "border-[#0c3b40] bg-[#0c3b40]/5 ring-1 ring-[#0c3b40]"
                          : "border-slate-200 hover:border-slate-300 bg-white"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-5 h-5 rounded-full border mt-0.5 flex items-center justify-center shrink-0 ${
                              isSelected ? "border-[#0c3b40] bg-[#0c3b40] text-white" : "border-slate-300"
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-xs sm:text-sm text-slate-900">{variant.name}</h3>
                              {idx === 0 && (
                                <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">
                                  Phổ biến nhất
                                </span>
                              )}
                              {idx === 1 && (
                                <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-medium">
                                  Được đề xuất
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-500 mt-1">{variant.desc}</p>
                            <div className="text-[11px] text-slate-400 mt-1 font-medium">{variant.specs}</div>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <div className="font-extrabold text-sm sm:text-base text-[#0c3b40]">
                            {formatCurrency(variantPrice)}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {type === "stay" ? "/ đêm" : type === "experience" ? "/ khách" : "/ gói"}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* E. Categorized Amenities Grid */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-5">
              <h2 className="text-base font-bold text-slate-900">
                Tiện nghi & Dịch vụ đi kèm cao cấp
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-1">
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Waves className="w-3.5 h-3.5 text-teal-600" />
                    <span>Không gian & Thư giãn</span>
                  </h3>
                  <ul className="space-y-2 text-xs text-slate-700">
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Hồ bơi vô cực ngoài trời view hoàng hôn</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Bãi biển riêng với ghế nằm và chòi nghỉ</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Sân vườn nhiệt đới nhiều cây xanh mát</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Khu vực spa & massage trị liệu thư giãn</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Utensils className="w-3.5 h-3.5 text-amber-600" />
                    <span>Ẩm thực & Đồ uống</span>
                  </h3>
                  <ul className="space-y-2 text-xs text-slate-700">
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Bữa sáng buffet thượng hạng Á - Âu hàng ngày</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Quầy bar phục vụ cocktail bên hồ bơi</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Dịch vụ BBQ hải sản tươi sống tại phòng</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Minibar miễn phí đồ uống không cồn & trà thảo mộc</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Laptop className="w-3.5 h-3.5 text-blue-600" />
                    <span>Tiện ích công nghệ & Phòng ngủ</span>
                  </h3>
                  <ul className="space-y-2 text-xs text-slate-700">
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Wi-Fi cáp quang tốc độ cao 500Mbps toàn khuôn viên</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Smart TV 65" 4K với Netflix, Youtube Premium</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Bồn tắm nằm view kính & vòi hoa sen mưa</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Bàn làm việc yên tĩnh phù hợp workation</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Dịch vụ & An ninh 24/7</span>
                  </h3>
                  <ul className="space-y-2 text-xs text-slate-700">
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Xe đưa đón sân bay Phú Quốc 2 chiều miễn phí</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Dọn phòng tiêu chuẩn khách sạn 2 lần/ngày</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Bảo vệ an ninh 24/7 & camera an ninh ngoài trời</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Két sắt điện tử bảo mật tại phòng</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* F. Host / Guide / Operator Info */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-slate-200 shrink-0 border border-slate-200">
                    <Image
                      src="/avatar.png"
                      alt="Host Avatar"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-slate-900">Quản lý bởi Stayea Premier Host</h3>
                      <span className="text-[10px] bg-[#0c3b40] text-white px-2 py-0.5 rounded-full font-semibold">
                        Chủ nhà siêu cấp
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Đã phục vụ hơn 1.200 lượt khách quốc tế & Việt Nam · Tỷ lệ đánh giá 4.9/5
                    </p>
                    <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1.5">
                      <span>Thời gian phản hồi: <strong>Dưới 15 phút</strong></span>
                      <span>·</span>
                      <span>Tỉ lệ phản hồi: <strong>100%</strong></span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => alert("Concierge Stayea đang kết nối! Vui lòng gọi hotline 1900 6868 hoặc chat trực tiếp.")}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors inline-flex items-center gap-1.5 shrink-0"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-[#0c3b40]" />
                  <span>Liên hệ chủ nhà</span>
                </button>
              </div>
            </div>

            {/* G. Customer Reviews Breakdown */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-xl font-extrabold text-slate-900">
                    <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                    <span>{(activeItem.rating || 4.9).toFixed(1)}</span>
                  </div>
                  <span className="text-slate-400">/ 5.0</span>
                  <span className="text-xs text-slate-500 font-medium ml-2">
                    Dựa trên {activeItem.reviewsCount || 96} đánh giá khách hàng đã xác thực
                  </span>
                </div>
                <div className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                  98% khách hài lòng tuyệt đối
                </div>
              </div>

              {/* Rating criteria breakdown */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <div className="flex justify-between text-slate-600 mb-1">
                    <span>Độ sạch sẽ</span>
                    <span className="font-bold text-slate-900">4.9</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#0c3b40] rounded-full w-[98%]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-slate-600 mb-1">
                    <span>Vị trí & Cảnh quan</span>
                    <span className="font-bold text-slate-900">5.0</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#0c3b40] rounded-full w-[100%]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-slate-600 mb-1">
                    <span>Dịch vụ & Nhân viên</span>
                    <span className="font-bold text-slate-900">4.9</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#0c3b40] rounded-full w-[98%]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-slate-600 mb-1">
                    <span>Tiện nghi cao cấp</span>
                    <span className="font-bold text-slate-900">4.8</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#0c3b40] rounded-full w-[96%]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-slate-600 mb-1">
                    <span>Độ chính xác hình ảnh</span>
                    <span className="font-bold text-slate-900">5.0</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#0c3b40] rounded-full w-[100%]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-slate-600 mb-1">
                    <span>Giá trị tương xứng</span>
                    <span className="font-bold text-slate-900">4.8</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#0c3b40] rounded-full w-[96%]" />
                  </div>
                </div>
              </div>

              {/* Sample Detailed Reviews */}
              <div className="space-y-4 pt-2">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-teal-600 text-white font-bold text-xs flex items-center justify-center">
                        HL
                      </div>
                      <div>
                        <div className="font-bold text-xs text-slate-900">Hoàng Linh (Hà Nội)</div>
                        <div className="text-[10px] text-slate-400">Kỳ nghỉ gia đình · Tháng 9, 2026</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-amber-400">
                      {[1, 2, 3, 4, 5].map((starIdx) => (
                        <Star key={`review-star-1-${starIdx}`} className="w-3 h-3 fill-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    "Kỳ nghỉ tuyệt vời nhất của gia đình mình tại Phú Quốc! Biệt thự thực sự đẹp hơn trong ảnh, hồ bơi riêng sạch sẽ và bãi biển cát trắng mịn màng. Quản gia Stayea hỗ trợ nhiệt tình từ lúc đón sân bay đến chuẩn bị tiệc BBQ nướng bên bờ biển. Chắc chắn sẽ quay lại!"
                  </p>
                  <div className="flex items-center gap-1 text-[11px] text-slate-400 pt-1">
                    <ThumbsUp className="w-3 h-3" />
                    <span>24 người thấy đánh giá này hữu ích</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-amber-600 text-white font-bold text-xs flex items-center justify-center">
                        TA
                      </div>
                      <div>
                        <div className="font-bold text-xs text-slate-900">Tuấn Anh & Mai Phương (TP. HCM)</div>
                        <div className="text-[10px] text-slate-400">Cặp đôi kỷ niệm ngày cưới · Tháng 10, 2026</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-amber-400">
                      {[1, 2, 3, 4, 5].map((starIdx) => (
                        <Star key={`review-star-1-${starIdx}`} className="w-3 h-3 fill-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    "Không gian vô cùng lãng mạn và riêng tư. Bữa sáng phục vụ tại hồ bơi rất ngon và đẹp mắt. Hoàng hôn ngắm từ ban công phòng ngủ thực sự ngoạn mục. Rất đáng từng đồng chi phí!"
                  </p>
                  <div className="flex items-center gap-1 text-[11px] text-slate-400 pt-1">
                    <ThumbsUp className="w-3 h-3" />
                    <span>18 người thấy đánh giá này hữu ích</span>
                  </div>
                </div>
              </div>
            </div>

            {/* H. Policies & Check-in Details */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-[#0c3b40]" />
                <span>Quy định & Chính sách lưu trú</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600">
                <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="font-bold text-slate-900">Thời gian nhận & trả phòng</div>
                  <p>Nhận phòng (Check-in): Từ 14:00</p>
                  <p>Trả phòng (Check-out): Trước 12:00 trưa</p>
                  <p className="text-[11px] text-slate-400">Hỗ trợ nhận phòng sớm / trả phòng muộn tùy tình trạng phòng.</p>
                </div>

                <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="font-bold text-slate-900">Chính sách hủy phòng</div>
                  <p className="text-emerald-600 font-semibold">Miễn phí hủy trong vòng 48h trước giờ nhận phòng</p>
                  <p>Hủy sau 48h: Phí bằng 50% tổng đêm lưu trú đầu tiên.</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Sticky Booking Calculation Sidebar (4 cols) */}
          <div className="lg:col-span-5 xl:col-span-4 sticky top-20">
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-5">
              {/* Price Header */}
              <div className="border-b border-slate-100 pb-4">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-2xl sm:text-3xl font-extrabold text-[#0c3b40]">
                      {formatCurrency(adjustedUnitPrice)}
                    </span>
                    <span className="text-xs text-slate-500 font-normal ml-1">
                      {type === "stay" ? "/ đêm" : type === "experience" ? "/ người" : "/ trọn gói"}
                    </span>
                  </div>
                  <span className="text-xs line-through text-slate-400">
                    {formatCurrency(Math.round(adjustedUnitPrice * 1.15))}
                  </span>
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                    <Crown className="w-3 h-3 text-amber-500" />
                    <span>Giảm 10% cho hội viên Stayea Club</span>
                  </span>
                </div>
              </div>

              {/* Date & Guest Pickers */}
              <div className="space-y-3">
                <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                    {type === "stay" ? "Lịch nhận & trả phòng" : "Ngày tham gia"}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-0.5">Nhận phòng</label>
                      <input
                        type="date"
                        value={checkInDate}
                        onChange={(e) => setCheckInDate(e.target.value)}
                        className="w-full text-xs font-semibold text-slate-800 bg-white border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-hidden focus:ring-1 focus:ring-[#0c3b40]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-0.5">Trả phòng</label>
                      <input
                        type="date"
                        value={checkOutDate}
                        onChange={(e) => setCheckOutDate(e.target.value)}
                        className="w-full text-xs font-semibold text-slate-800 bg-white border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-hidden focus:ring-1 focus:ring-[#0c3b40]"
                      />
                    </div>
                  </div>
                </div>

                {/* Guest counter */}
                <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between">
                  <div>
                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Số lượng khách</div>
                    <div className="text-xs text-slate-800 font-semibold mt-0.5">
                      {guestCount} khách (Người lớn)
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={guestCount <= 1}
                      onClick={() => setGuestCount((g) => Math.max(1, g - 1))}
                      className="w-7 h-7 rounded-lg border border-slate-200 bg-white text-slate-700 font-bold hover:bg-slate-100 disabled:opacity-40 flex items-center justify-center transition-colors text-sm"
                    >
                      -
                    </button>
                    <span className="w-5 text-center text-xs font-bold text-slate-900">{guestCount}</span>
                    <button
                      type="button"
                      disabled={guestCount >= 10}
                      onClick={() => setGuestCount((g) => Math.min(10, g + 1))}
                      className="w-7 h-7 rounded-lg border border-slate-200 bg-white text-slate-700 font-bold hover:bg-slate-100 disabled:opacity-40 flex items-center justify-center transition-colors text-sm"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Detailed Cost Breakdown */}
              <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>
                    {formatCurrency(adjustedUnitPrice)} × {unitsCount} {type === "stay" ? "đêm" : "khách"}
                  </span>
                  <span className="font-semibold text-slate-800">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span className="flex items-center gap-1">
                    <Crown className="w-3 h-3 text-amber-500" />
                    <span>Ưu đãi Stayea Club (-10%)</span>
                  </span>
                  <span>-{formatCurrency(clubDiscount)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Phí dịch vụ bảo chứng Stayea</span>
                  <span className="text-emerald-600 font-semibold">Miễn phí</span>
                </div>
                <div className="flex justify-between text-slate-400 text-[11px]">
                  <span>Thuế VAT và phí môi trường</span>
                  <span>Đã bao gồm</span>
                </div>

                <div className="flex justify-between items-baseline pt-3 border-t border-slate-200 text-slate-900">
                  <div>
                    <div className="font-extrabold text-sm sm:text-base">Tổng thanh toán tạm tính</div>
                    <div className="text-[10px] text-slate-400 font-normal">Chưa trừ điểm tích lũy Stayea Point</div>
                  </div>
                  <span className="font-extrabold text-lg sm:text-xl text-[#0c3b40]">
                    {formatCurrency(totalAmount)}
                  </span>
                </div>
              </div>

              {/* Main Action Buttons */}
              <div className="space-y-2.5 pt-2">
                <button
                  type="button"
                  onClick={handleOpenBooking}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#0c3b40] hover:bg-[#072528] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Đặt ngay kỳ nghỉ này</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <a
                    href="tel:19006868"
                    className="py-2.5 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-teal-600" />
                    <span>Hotline 24/7</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => alert("Trợ lý Concierge Stayea đang sẵn sàng hỗ trợ bạn qua hotline 1900 6868.")}
                    className="py-2.5 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-teal-600" />
                    <span>Tư vấn riêng</span>
                  </button>
                </div>
              </div>

              {/* Guarantees */}
              <div className="pt-3 border-t border-slate-100 space-y-1.5 text-[11px] text-slate-500">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Bảo chứng kỳ nghỉ 100% không phát sinh phụ phí ẩn</span>
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-sky-600 shrink-0" />
                  <span>Bảo mật giao dịch chuẩn mã hóa SSL 256-bit</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 5. Related Services Recommendations */}
        <div className="mt-16 pt-10 border-t border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Dịch vụ tương tự bạn có thể yêu thích
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Tuyển chọn những điểm đến và trải nghiệm chất lượng tương đương tại Phú Quốc
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate?.(CATEGORY_TITLES[type].route)}
              className="text-xs font-semibold text-[#0c3b40] hover:underline hidden sm:inline-flex items-center gap-1"
            >
              <span>Xem tất cả danh mục</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {relatedItems.map((relItem: any) => (
              <div
                key={relItem.id}
                role="button"
                tabIndex={0}
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: "smooth" })
                  onNavigate?.("service-detail", undefined, { type, item: relItem })
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    window.scrollTo({ top: 0, behavior: "smooth" })
                    onNavigate?.("service-detail", undefined, { type, item: relItem })
                  }
                }}
                className="group cursor-pointer rounded-2xl overflow-hidden bg-white border border-slate-200/80 shadow-xs hover:shadow-lg hover:border-[#0c3b40]/30 transition-all duration-300"
              >
                <div className="relative aspect-[16/11] w-full overflow-hidden bg-slate-100">
                  <Image
                    src={relItem.imageUrl}
                    alt={relItem.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, 25vw"
                  />
                  <div className="absolute top-2.5 left-2.5 z-10 px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/60 text-white backdrop-blur-xs flex items-center gap-1">
                    <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                    <span>{(relItem.rating || 4.8).toFixed(1)}</span>
                  </div>
                </div>

                <div className="p-3.5">
                  <h3 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-[#0c3b40] transition-colors truncate">
                    {relItem.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                    {relItem.location || relItem.area || relItem.category || "Phú Quốc, Việt Nam"}
                  </p>
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100">
                    <div className="font-extrabold text-xs text-[#0c3b40]">
                      {relItem.formattedPrice || formatCurrency(relItem.pricePerNight || relItem.price || 1_500_000)}
                    </div>
                    <span className="text-[11px] font-semibold text-slate-600 group-hover:text-[#0c3b40] transition-colors flex items-center gap-0.5">
                      <span>Xem</span>
                      <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 6. Lightbox Fullscreen Gallery Modal */}
      {galleryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-between p-4 sm:p-6 backdrop-blur-md">
          {/* Top header */}
          <div className="w-full max-w-6xl flex items-center justify-between text-white">
            <div className="text-sm font-semibold">
              Ảnh {currentGalleryIndex + 1} / {galleryImages.length} · {activeItem.title}
            </div>
            <button
              type="button"
              onClick={() => setGalleryModalOpen(false)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Đóng thư viện ảnh"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Main Photo with Controls */}
          <div className="relative w-full max-w-4xl h-[55vh] sm:h-[65vh] my-auto flex items-center justify-center">
            <button
              type="button"
              onClick={() => setCurrentGalleryIndex((prev) => (prev > 0 ? prev - 1 : galleryImages.length - 1))}
              className="absolute left-2 sm:-left-12 z-10 p-2.5 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-xs transition-colors"
              aria-label="Ảnh trước"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={galleryImages[currentGalleryIndex]}
                alt={`${activeItem.title} ảnh toàn cảnh`}
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 100vw, 1024px"
              />
            </div>

            <button
              type="button"
              onClick={() => setCurrentGalleryIndex((prev) => (prev < galleryImages.length - 1 ? prev + 1 : 0))}
              className="absolute right-2 sm:-right-12 z-10 p-2.5 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-xs transition-colors"
              aria-label="Ảnh tiếp theo"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Thumbnails strip */}
          <div className="w-full max-w-4xl flex items-center justify-center gap-2 overflow-x-auto py-2">
            {galleryImages.map((img: string, idx: number) => (
              <button
                key={`grid-photo-${img}`}
                type="button"
                onClick={() => setCurrentGalleryIndex(idx)}
                className={`relative w-16 h-12 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                  currentGalleryIndex === idx ? "border-amber-400 scale-105" : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <Image src={img} alt="Thumbnail" fill className="object-cover" sizes="64px" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 7. Booking Confirmation Modal */}
      {bookingModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            {bookingSuccess ? (
              <div className="p-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  Đặt chỗ thành công!
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-sm mx-auto">
                  {bookingSuccessMessage || `Chúc mừng bạn! Kỳ nghỉ tại ${activeItem.title} đã được xác nhận. Concierge Stayea sẽ liên hệ bạn trong vòng 15 phút.`}
                </p>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-left space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Mã đặt phòng:</span>
                    <span className="font-mono font-bold text-slate-900">{bookingCode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Khách hàng:</span>
                    <span className="font-semibold text-slate-900">{customerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Thời gian:</span>
                    <span className="font-semibold text-slate-900">
                      {checkInDate} đến {checkOutDate} ({numberOfNights} đêm)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Tổng thanh toán:</span>
                    <span className="font-extrabold text-[#0c3b40]">{formatCurrency(totalAmount)}</span>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setBookingModalOpen(false)
                      onNavigate?.("bookings")
                    }}
                    className="flex-1 py-3 px-4 rounded-xl bg-[#0c3b40] hover:bg-[#072528] text-white font-bold text-xs shadow-md transition-all"
                  >
                    Xem đơn đặt dịch vụ
                  </button>
                  <button
                    type="button"
                    onClick={() => setBookingModalOpen(false)}
                    className="py-3 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors"
                  >
                    Tiếp tục khám phá
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleConfirmBooking}>
                <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-bold text-slate-900">Xác nhận đặt dịch vụ</h2>
                    <p className="text-xs text-slate-500">{activeItem.title}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setBookingModalOpen(false)}
                    className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                  {/* Summary Box */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-slate-900">
                        {roomVariants[selectedVariantIndex]?.name}
                      </div>
                      <div className="text-slate-500 mt-0.5">
                        {checkInDate} → {checkOutDate} · {guestCount} khách
                      </div>
                    </div>
                    <div className="font-extrabold text-[#0c3b40] text-sm">
                      {formatCurrency(totalAmount)}
                    </div>
                  </div>

                  {/* Customer Information Inputs */}
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Họ và tên người đặt *
                      </label>
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full text-xs text-slate-900 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-hidden focus:ring-1 focus:ring-[#0c3b40]"
                        placeholder="Ví dụ: Nguyễn Văn An"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Số điện thoại *
                        </label>
                        <input
                          type="tel"
                          required
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          className="w-full text-xs text-slate-900 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-hidden focus:ring-1 focus:ring-[#0c3b40]"
                          placeholder="0912..."
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Email nhận xác nhận *
                        </label>
                        <input
                          type="email"
                          required
                          value={customerEmail}
                          onChange={(e) => setCustomerEmail(e.target.value)}
                          className="w-full text-xs text-slate-900 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-hidden focus:ring-1 focus:ring-[#0c3b40]"
                          placeholder="email@example.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Yêu cầu đặc biệt (tùy chọn)
                      </label>
                      <textarea
                        rows={2}
                        value={customerNotes}
                        onChange={(e) => setCustomerNotes(e.target.value)}
                        className="w-full text-xs text-slate-900 border border-slate-200 rounded-xl px-3 py-2 focus:outline-hidden focus:ring-1 focus:ring-[#0c3b40]"
                        placeholder="Ví dụ: Cần xe đón lúc 10h sáng, phòng tầng cao yên tĩnh..."
                      />
                    </div>
                  </div>

                  {/* Payment Method Selector */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <label className="block text-xs font-semibold text-slate-700">
                      Phương thức thanh toán
                    </label>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={() => setPaymentMethod("vietqr")}
                        onKeyDown={(e) => { if (e.key === 'Enter') setPaymentMethod("vietqr") }}
                        className={`p-3 rounded-xl border cursor-pointer transition-all ${
                          paymentMethod === "vietqr"
                            ? "border-[#0c3b40] bg-[#0c3b40]/5 font-bold text-[#0c3b40]"
                            : "border-slate-200 text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        Chuyển khoản VietQR 24/7
                      </div>
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={() => setPaymentMethod("card")}
                        onKeyDown={(e) => { if (e.key === 'Enter') setPaymentMethod("card") }}
                        className={`p-3 rounded-xl border cursor-pointer transition-all ${
                          paymentMethod === "card"
                            ? "border-[#0c3b40] bg-[#0c3b40]/5 font-bold text-[#0c3b40]"
                            : "border-slate-200 text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        Thẻ tín dụng / Ghi nợ
                      </div>
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={() => setPaymentMethod("momo")}
                        onKeyDown={(e) => { if (e.key === 'Enter') setPaymentMethod("momo") }}
                        className={`p-3 rounded-xl border cursor-pointer transition-all ${
                          paymentMethod === "momo"
                            ? "border-[#0c3b40] bg-[#0c3b40]/5 font-bold text-[#0c3b40]"
                            : "border-slate-200 text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        Ví MoMo / ZaloPay
                      </div>
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={() => setPaymentMethod("checkin")}
                        onKeyDown={(e) => { if (e.key === 'Enter') setPaymentMethod("checkin") }}
                        className={`p-3 rounded-xl border cursor-pointer transition-all ${
                          paymentMethod === "checkin"
                            ? "border-[#0c3b40] bg-[#0c3b40]/5 font-bold text-[#0c3b40]"
                            : "border-slate-200 text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        Thanh toán khi nhận phòng
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-slate-400">Tổng thanh toán:</div>
                    <div className="text-base font-extrabold text-[#0c3b40]">{formatCurrency(totalAmount)}</div>
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmittingBooking}
                    className="py-3 px-6 rounded-xl bg-[#0c3b40] hover:bg-[#072528] text-white font-bold text-xs shadow-md transition-all active:scale-95 disabled:opacity-75 flex items-center gap-2"
                  >
                    {isSubmittingBooking && <Clock className="w-3.5 h-3.5 animate-spin" />}
                    <span>{isSubmittingBooking ? "Đang xử lý..." : "Xác nhận đặt chỗ"}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
