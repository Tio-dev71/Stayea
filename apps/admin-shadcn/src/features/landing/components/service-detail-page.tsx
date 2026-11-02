"use client"

import * as React from "react"
import { toast } from "sonner"
import Image from "next/image"
import {
  ArrowLeft,
  Share2,
  Heart,
  Star,
  MapPin,
  Clock,
  Sparkles,
  CheckCircle2,
  Check,
  ChevronRight,
  ChevronLeft,
  X,
  FileCheck,
} from "lucide-react"

import { stayeaApi } from "@/lib/stayea-api-service"

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
  // Keep a neutral shape while an item is loaded from its catalog ID.
  const fallbackEmptyItem = React.useMemo(() => ({
    id: "",
    title: "",
    type: "Lưu trú",
    location: "",
    rating: 0,
    reviewsCount: 0,
    pricePerNight: 0,
    price: 0,
    formattedPrice: "0 đ",
    imageUrl: "",
    amenities: [],
    categoryId: "all",
    area: "Phú Quốc",
  }), [])

  // Resolve item fallback if none provided
  const activeItem = React.useMemo(() => {
    if (item) return item
    return fallbackEmptyItem
  }, [item, type, fallbackEmptyItem])

  // Gallery images array
  const galleryImages = React.useMemo(() => {
    if (!activeItem) return []
    if (Array.isArray(activeItem.gallery) && activeItem.gallery.length > 0) {
      return activeItem.gallery.slice(0, 5)
    }
    const mainPhoto = activeItem.imageUrl
    return [mainPhoto, ...(Array.isArray(activeItem.gallery) ? activeItem.gallery : [])]
      .filter((photo: unknown): photo is string => typeof photo === "string" && photo.length > 0)
      .slice(0, 5)
  }, [activeItem?.imageUrl, activeItem?.gallery, type])

  // UI state
  const [isWishlisted, setIsWishlisted] = React.useState(false)
  const [relatedItems, setRelatedItems] = React.useState<any[]>([])
  React.useEffect(() => {
    let isMounted = true
    stayeaApi.getUserFavorites().then((items) => {
      if (isMounted) setIsWishlisted(items.some((favorite: any) => favorite.itemId === activeItem.id))
    })
    return () => { isMounted = false }
  }, [activeItem.id])

  const handleToggleFavorite = async () => {
    if (isWishlisted) {
      const removed = await stayeaApi.removeFavorite(activeItem.id)
      if (!removed) {
        toast.error("Không thể bỏ lưu dịch vụ.")
        return
      }
      setIsWishlisted(false)
      return
    }
    const saved = await stayeaApi.addFavorite({
      itemId: activeItem.id,
      itemType: type,
      title: activeItem.title,
      imageUrl: activeItem.imageUrl,
      price: baseUnitPrice,
      location: activeItem.location,
      rating: activeItem.rating,
    })
    if (!saved) {
      toast.error("Vui lòng đăng nhập để lưu dịch vụ.")
      return
    }
    setIsWishlisted(true)
  }
  const [copiedLink, setCopiedLink] = React.useState(false)
  const [galleryModalOpen, setGalleryModalOpen] = React.useState(false)
  const [currentGalleryIndex, setCurrentGalleryIndex] = React.useState(0)
  const [selectedVariantIndex, setSelectedVariantIndex] = React.useState(0)

  // Booking calculations
  const [checkInDate, setCheckInDate] = React.useState(() => {
    const date = new Date()
    date.setDate(date.getDate() + 1)
    return date.toISOString().slice(0, 10)
  })
  const [checkOutDate, setCheckOutDate] = React.useState(() => {
    const date = new Date()
    date.setDate(date.getDate() + 4)
    return date.toISOString().slice(0, 10)
  })
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
    return 0
  }, [activeItem])

  // Only show the price and option stored for this catalog record.
  const roomVariants = React.useMemo(() => {
    const attributes = activeItem.attributes || activeItem
    return [
      {
        name: activeItem.title,
        desc: activeItem.description || "",
        multiplier: 1,
        specs: [attributes.maxGuests ? `${attributes.maxGuests} khách` : null, attributes.bedrooms ? `${attributes.bedrooms} phòng ngủ` : null, attributes.duration].filter(Boolean).join(" · "),
      },
    ]
  }, [activeItem])

  const currentMultiplier = roomVariants[selectedVariantIndex]?.multiplier || 1
  const adjustedUnitPrice = Math.round(baseUnitPrice * currentMultiplier)

  // Calculations
  const unitsCount = type === "stay" ? numberOfNights : type === "experience" ? guestCount : 1
  const subtotal = adjustedUnitPrice * unitsCount
  const totalAmount = subtotal



  // Handle open booking modal
  const handleOpenBooking = () => {
    setBookingCode("")
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
          metadata: { catalogItemId: activeItem.id, serviceType: type },
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

  React.useEffect(() => {
    let isMounted = true
    const loadRelated = async () => {
      try {
        const response = type === "stay"
          ? await stayeaApi.getAccommodations({ limit: 5 })
          : type === "experience"
            ? await stayeaApi.getExperiences({ limit: 5 })
            : type === "package"
              ? await stayeaApi.getPackages({ limit: 5 })
              : await stayeaApi.getCatalogServices({ type: "transport" })
        const items = Array.isArray(response) ? response : response.items || []
        if (!isMounted) return
        setRelatedItems(items.filter((entry: any) => entry.id !== activeItem.id).slice(0, 4).map((entry: any) => {
          const imageUrl = entry.imageUrl || entry.images?.[0] || ""
          const price = Number(entry.pricePerNight || entry.price || 0)
          return { ...entry, imageUrl, price, pricePerNight: price, formattedPrice: formatCurrency(price), rating: Number(entry.rating || 0) }
        }))
      } catch {
        if (isMounted) setRelatedItems([])
      }
    }
    void loadRelated()
    return () => { isMounted = false }
  }, [activeItem.id, type])

  if (!activeItem.id) {
    return (
      <div className="min-h-screen bg-[#FBFBFA] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-xl font-bold text-slate-900 mb-2">Chưa có thông tin dịch vụ</h2>
        <p className="text-sm text-slate-500 mb-6">Dịch vụ này hiện chưa có dữ liệu hoặc đã được gỡ bỏ để cập nhật mới.</p>
        <button
          type="button"
          onClick={onBack || (() => onNavigate?.("home"))}
          className="px-5 py-2.5 rounded-xl bg-[#0c3b40] text-white text-xs font-semibold cursor-pointer"
        >
          Quay lại trang chủ
        </button>
      </div>
    )
  }

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
              onClick={() => void handleToggleFavorite()}
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
            {(activeItem.badge || activeItem.isFeatured) && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-700 border border-emerald-500/20">
                <Sparkles className="w-3 h-3 text-emerald-500" />
                <span>{typeof activeItem.badge === "string" ? activeItem.badge : activeItem.badge?.text || "Nổi bật"}</span>
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {activeItem.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 mt-2.5 text-xs sm:text-sm text-slate-600">
            <div className="flex items-center gap-1 font-bold text-slate-900">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{Number(activeItem.rating || 0).toFixed(1)}</span>
              <span className="text-slate-500 font-normal underline cursor-pointer ml-0.5">
                ({activeItem.reviewsCount || 0} đánh giá)
              </span>
            </div>
            <span className="text-slate-300">·</span>
            <div className="flex items-center gap-1 text-slate-600">
              <MapPin className="w-4 h-4 text-[#0c3b40] shrink-0" />
              <span>{activeItem.location || activeItem.area || ""}</span>
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
              {galleryImages[0] ? <Image src={galleryImages[0]} alt={activeItem.title} fill priority className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out" sizes="(max-width: 768px) 100vw, 50vw" /> : <div className="absolute inset-0 bg-slate-100" />}
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
          {galleryImages.length > 0 && <button
            type="button"
            onClick={() => {
              setCurrentGalleryIndex(0)
              setGalleryModalOpen(true)
            }}
            className="absolute bottom-4 right-4 z-10 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/90 hover:bg-white text-slate-900 font-semibold text-xs shadow-md backdrop-blur-md transition-all active:scale-95 border border-slate-200/80"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#0c3b40]" />
            <span>Xem ảnh ({galleryImages.length})</span>
          </button>}
        </div>

        {/* 4. Main 2-Column Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12 items-start">
          {/* LEFT COLUMN: Narrative, Specs, Amenities, Variants, Host, Reviews (8 cols) */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-8">
            {/* C. Catalog description */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
              <h2 className="text-base font-bold text-slate-900 mb-3">Mô tả dịch vụ</h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {activeItem.description || "Chưa có mô tả cho dịch vụ này."}
              </p>
            </div>

            {/* D. Selectable Room / Package / Service Variants */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-900">Dịch vụ được chọn</h2>
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

            {/* F. Host / Guide / Operator Info */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  {activeItem.hostAvatar ? <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-slate-200 shrink-0 border border-slate-200"><Image src={activeItem.hostAvatar} alt={activeItem.hostName || ""} fill className="object-cover" /></div> : null}
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">{activeItem.hostName || "Thông tin chủ dịch vụ chưa cập nhật"}</h3>
                  </div>
                </div>

              </div>
            </div>

            {/* G. Customer Reviews Breakdown */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-xl font-extrabold text-slate-900">
                    <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                    <span>{Number(activeItem.rating || 0).toFixed(1)}</span>
                  </div>
                  <span className="text-slate-400">/ 5.0</span>
                  <span className="text-xs text-slate-500 font-medium ml-2">
                    {activeItem.reviewsCount ? `Dựa trên ${activeItem.reviewsCount} đánh giá` : "Chưa có đánh giá nào"}
                  </span>
                </div>
              </div>

              {!activeItem.reviewsCount || activeItem.reviewsCount === 0 ? <div className="py-8 text-center text-slate-500 text-xs sm:text-sm">Chưa có đánh giá nào cho dịch vụ này.</div> : null}
            </div>

            {/* H. Policies & Check-in Details */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-[#0c3b40]" />
                <span>Quy định & Chính sách lưu trú</span>
              </h2>

              <p className="text-xs text-slate-600 whitespace-pre-line">{activeItem.cancellationPolicy || "Chính sách chưa được cập nhật."}</p>
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
                  {activeItem.originalPrice ? <span className="text-xs line-through text-slate-400">{formatCurrency(Number(activeItem.originalPrice))}</span> : null}
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
                        min={new Date().toISOString().slice(0, 10)}
                        value={checkInDate}
                        onChange={(e) => setCheckInDate(e.target.value)}
                        className="w-full text-xs font-semibold text-slate-800 bg-white border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-hidden focus:ring-1 focus:ring-[#0c3b40]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-0.5">Trả phòng</label>
                      <input
                        type="date"
                        min={checkInDate}
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

              </div>

            </div>
          </div>
        </div>

        {/* 5. Related Services Recommendations */}
        {relatedItems.length > 0 && <div className="mt-16 pt-10 border-t border-slate-200">
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
                    <span>{Number(relItem.rating || 0).toFixed(1)}</span>
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
                      {relItem.formattedPrice || formatCurrency(Number(relItem.pricePerNight || relItem.price || 0))}
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
        </div>}
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
                  {bookingSuccessMessage || `Yêu cầu đặt dịch vụ ${activeItem.title} đã được ghi nhận.`}
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
                  {customerNotes && (
                    <div className="flex justify-between items-start pt-1.5 border-t border-slate-200/60">
                      <span className="text-slate-400 shrink-0">Yêu cầu đặc biệt:</span>
                      <span className="font-medium text-slate-800 text-right italic ml-2">"{customerNotes}"</span>
                    </div>
                  )}
                </div>

                {paymentMethod === "checkin" ? (
                  <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200 text-left space-y-3">
                    <div className="flex items-center gap-2.5 text-xs text-amber-950 font-bold px-1">
                      <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800 shrink-0">
                        <FileCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="block text-amber-950 font-bold text-sm">Thanh toán khi nhận phòng (Check-in)</span>
                        <span className="text-[11px] font-normal text-amber-800">Thanh toán trực tiếp bằng Tiền mặt hoặc Quẹt thẻ tại quầy tiếp đón</span>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-700 space-y-2 bg-white/90 p-3.5 rounded-xl border border-amber-200/70">
                      <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                        <span className="text-slate-500">Hình thức thanh toán:</span>
                        <span className="font-bold text-amber-900 bg-amber-100/80 px-2 py-0.5 rounded-md text-[11px]">
                          💵 Trực tiếp tại quầy lễ tân
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">Thời gian nhận phòng dự kiến:</span>
                        <span className="font-semibold text-slate-900">{checkInDate} (từ 14:00)</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">Số tiền cần thanh toán:</span>
                        <span className="font-extrabold text-emerald-800 text-xs">{formatCurrency(totalAmount)}</span>
                      </div>
                      {customerNotes && (
                        <div className="pt-2 border-t border-slate-100">
                          <span className="text-slate-500 block mb-0.5">Yêu cầu đặc biệt đã ghi nhận:</span>
                          <span className="font-semibold text-amber-900 italic">"{customerNotes}"</span>
                        </div>
                      )}
                    </div>

                    <p className="text-[11px] text-amber-950/80 leading-relaxed px-1">
                      💡 <strong>Lưu ý:</strong> Vui lòng giữ mã đặt phòng <span className="font-mono font-bold text-slate-900">#{bookingCode}</span> để đối soát với nhân viên lễ tân khi nhận phòng. Đơn đặt phòng đã được hệ thống gửi ngay tới đối tác STAYEA.
                    </p>
                  </div>
                ) : (
                  /* Dynamic VietQR Payment Card (SEC-004 & SePay Integration) */
                  <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 text-center space-y-3">
                    <div className="flex items-center justify-between text-xs text-emerald-900 font-semibold px-1">
                      <span>Quét mã VietQR chuyển khoản</span>
                      <span className="text-[11px] bg-emerald-200/80 text-emerald-800 px-2 py-0.5 rounded-full font-mono font-bold">
                        Giữ phòng 15 phút
                      </span>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-emerald-200 shadow-sm inline-block mx-auto">
                      <img
                        src={`https://img.vietqr.io/image/MB-292222288888-compact2.png?amount=${totalAmount}&addInfo=${encodeURIComponent(
                          `STAYEA ${bookingCode}`
                        )}&accountName=${encodeURIComponent("CTY TNHH TOP CN VA NOI DUNG SO")}`}
                        alt="VietQR thanh toán đặt chỗ STAYEA"
                        className="w-48 h-auto mx-auto object-contain rounded-lg"
                      />
                    </div>

                    <div className="text-[11px] text-slate-600 space-y-1 text-left bg-white/80 p-3 rounded-xl border border-emerald-100 font-mono">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Ngân hàng:</span>
                        <span className="font-bold text-slate-800">MB Bank (Quân Đội)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Số tài khoản:</span>
                        <span className="font-bold text-slate-800 font-mono">292222288888</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Chủ tài khoản:</span>
                        <span className="font-bold text-slate-800">CTY TNHH TOP CN VA NOI DUNG SO</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Nội dung CK:</span>
                        <span className="font-bold text-emerald-700 font-mono">STAYEA {bookingCode}</span>
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-500 italic">
                      * Hệ thống tự động xác nhận đơn ngay khi nhận được thông báo chuyển khoản thành công từ SePay.
                    </p>
                  </div>
                )}

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
