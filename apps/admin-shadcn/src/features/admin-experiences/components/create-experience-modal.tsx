"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import {
  Plus,
  X,
  Ticket,
  LayoutGrid,
  Clock,
  MapPin,
  Users,
  Upload,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link2,
  ChevronDown,
  ChevronUp,
  ImageIcon,
  Sparkles,
  Check,
  Info,
  Trash2,
  MoreHorizontal,
  GripVertical,
  Car,
  Landmark,
  Utensils,
  Waves,
  Square,
  ArrowRight,
  User,
  Baby,
  Lightbulb,
  Calendar,
  UploadCloud,
  Play,
  ExternalLink,
} from "lucide-react"
import type { ExperienceItem, ExperienceStatus } from "@/features/admin-experiences/stayea-admin-experiences-mock-data"
import { AddDayModal } from "./add-day-modal"
import type { NewDayData } from "./add-day-modal"

export type ExperienceModalTab =
  | "basic"
  | "itinerary"
  | "pricing"
  | "media"
  | "seo"

export interface TimelineActivity {
  id: string
  time: string
  icon: "car" | "landmark" | "utensils" | "waves"
  title: string
  description: string
}

export interface ItineraryDay {
  id: string
  dayNumber: number
  title: string
  destination?: string
  description?: string
  isExpanded: boolean
  activities: TimelineActivity[]
}

export interface SeasonalRate {
  id: string
  dateRange: string
  seasonType: "high" | "low" | "special"
  seasonLabel: string
  priceAdult: string
  priceChild: string
  priceGroup: string
  note: string
}

const INITIAL_SEASONAL_RATES: readonly SeasonalRate[] = [
  {
    id: "season-1",
    dateRange: "01/12/2024 - 28/02/2025",
    seasonType: "high",
    seasonLabel: "Mùa cao điểm",
    priceAdult: "550.000 đ",
    priceChild: "350.000 đ",
    priceGroup: "500.000 đ",
    note: "Giá áp dụng dịp lễ, Tết",
  },
  {
    id: "season-2",
    dateRange: "01/03/2025 - 31/05/2025",
    seasonType: "low",
    seasonLabel: "Mùa thấp điểm",
    priceAdult: "420.000 đ",
    priceChild: "280.000 đ",
    priceGroup: "400.000 đ",
    note: "Giá ưu đãi mùa hè",
  },
]

interface CreateExperienceModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (experience: ExperienceItem) => void
  initialTab?: ExperienceModalTab
  initialAddDayOpen?: boolean
}

const GALLERY_SAMPLE_IMAGES: readonly string[] = [
  "/experience/cano-4-islands.jpg",
  "/experience/tour-3-dao.jpg",
  "/packages/kayak-rach-vem.jpg",
  "/partner/tour.jpg",
  "/packages/sunset-cruise.jpg",
  "/packages/tour-dao-hoang.jpg",
  "/packages/tour-am-thuc.jpg",
]

const INITIAL_SEO_TAGS: readonly string[] = [
  "phú quốc",
  "tour 4 đảo",
  "lặn ngắm san hô",
  "du lịch phú quốc",
  "tour biển đảo",
]

const PHOTO_TIPS: readonly string[] = [
  "Sử dụng ảnh thực tế, rõ nét, ánh sáng tốt",
  "Ưu tiên ảnh khung cảnh, hoạt động, trải nghiệm thực tế",
  "Tỷ lệ ảnh đề xuất 16:9 hoặc 4:3",
  "Tránh chèn logo, chữ, watermark",
  "Ảnh đầu tiên sẽ hiển thị làm ảnh đại diện",
]

const VIDEO_TIPS: readonly string[] = [
  "Giới thiệu ngắn gọn về trải nghiệm",
  "Quay cảnh thực tế, hoạt động nổi bật",
  "Độ dài lý tưởng từ 30 giây - 2 phút",
  "Có thể thêm phụ đề để dễ tiếp cận khách quốc tế",
  "Đảm bảo video không vi phạm bản quyền",
]

const INITIAL_DAYS: readonly ItineraryDay[] = [
  {
    id: "day-1",
    dayNumber: 1,
    title: "Đón khách tại sân bay Phú Quốc – Khám phá Nam đảo",
    isExpanded: true,
    activities: [
      {
        id: "act-1",
        time: "08:00",
        icon: "car",
        title: "Đón khách tại sân bay Phú Quốc",
        description: "Di chuyển về trung tâm, nhận phòng hoặc gửi hành lý",
      },
      {
        id: "act-2",
        time: "10:00",
        icon: "landmark",
        title: "Tham quan Nhà tù Phú Quốc",
        description: "Tìm hiểu lịch sử, nghe thuyết minh",
      },
      {
        id: "act-3",
        time: "12:00",
        icon: "utensils",
        title: "Ăn trưa tại nhà hàng địa phương",
        description: "Thưởng thức đặc sản biển",
      },
      {
        id: "act-4",
        time: "14:00",
        icon: "waves",
        title: "Bãi Sao – Tắm biển & nghỉ ngơi",
        description: "Tự do tắm biển, chụp ảnh",
      },
    ],
  },
  {
    id: "day-2",
    dayNumber: 2,
    title: "Khám phá Bắc đảo – Vinpearl Safari – Grand World",
    isExpanded: false,
    activities: [],
  },
  {
    id: "day-3",
    dayNumber: 3,
    title: "Tự do khám phá – Kết thúc hành trình",
    isExpanded: false,
    activities: [],
  },
]

const INITIAL_INCLUDED_SERVICES: readonly string[] = [
  "Xe di chuyển",
  "Hướng dẫn viên",
  "Vé tham quan",
  "Bữa ăn",
  "Nước uống",
  "Bảo hiểm du lịch",
]

const INITIAL_EXCLUDED_SERVICES: readonly string[] = [
  "Vé máy bay",
  "Chi phí cá nhân",
  "Đồ uống ngoài chương trình",
  "Tiền tip",
]

function renderActivityIcon(icon: TimelineActivity["icon"]) {
  switch (icon) {
    case "car":
      return <Car className="w-3.5 h-3.5 text-slate-600" />
    case "landmark":
      return <Landmark className="w-3.5 h-3.5 text-slate-600" />
    case "utensils":
      return <Utensils className="w-3.5 h-3.5 text-slate-600" />
    case "waves":
      return <Waves className="w-3.5 h-3.5 text-slate-600" />
    default:
      return <MapPin className="w-3.5 h-3.5 text-slate-600" />
  }
}

export function CreateExperienceModal({
  isOpen,
  onClose,
  onSubmit,
  initialTab = "basic",
  initialAddDayOpen = false,
}: CreateExperienceModalProps) {
  const [activeTab, setActiveTab] = useState<ExperienceModalTab>(initialTab)
  const [isAddDayModalOpen, setIsAddDayModalOpen] = useState(initialAddDayOpen)

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab)
    }
  }, [initialTab])

  useEffect(() => {
    setIsAddDayModalOpen(initialAddDayOpen)
  }, [initialAddDayOpen])

  // 1. Thông tin cơ bản
  const [name, setName] = useState("")
  const [category, setCategory] = useState("")
  const [duration, setDuration] = useState("")
  const [location, setLocation] = useState("")
  const [provider, setProvider] = useState("")
  const [avatarImage, setAvatarImage] = useState("/experience/cano-4-islands.jpg")
  const [shortDescription, setShortDescription] = useState("")
  const [detailedDescription, setDetailedDescription] = useState("")
  const [highlights, setHighlights] = useState("")
  const [isPublic, setIsPublic] = useState(true)
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const tagLabel = tags[0] || "Mới"
  const tagVariant: "rose" | "sky" | "teal" | "emerald" | "purple" = "emerald"

  // 2. Lịch trình & dịch vụ
  const [days, setDays] = useState<ItineraryDay[]>([...INITIAL_DAYS])
  const [includedServices, setIncludedServices] = useState<string[]>([...INITIAL_INCLUDED_SERVICES])
  const [excludedServices, setExcludedServices] = useState<string[]>([...INITIAL_EXCLUDED_SERVICES])

  // 3. Giá & chính sách
  const [currency, setCurrency] = useState("Việt Nam đồng (VND)")
  const [priceAdult, setPriceAdult] = useState("450.000")
  const [priceChild, setPriceChild] = useState("300.000")
  const [priceInfant, setPriceInfant] = useState("Miễn phí")
  const [priceGroup, setPriceGroup] = useState("420.000")
  const [seasonalRates, setSeasonalRates] = useState<SeasonalRate[]>([...INITIAL_SEASONAL_RATES])
  const [depositRequirement, setDepositRequirement] = useState("30% giá trị tour")
  const [paymentDeadline, setPaymentDeadline] = useState("Trong vòng 24 giờ")
  const [cancellationPolicyRule, setCancellationPolicyRule] = useState("Hủy miễn phí trước 7 ngày")
  const [lateCancellationFee, setLateCancellationFee] = useState("Phí 50% giá trị tour")
  const [instantBook, setInstantBook] = useState(true)
  const [manualApproval, setManualApproval] = useState(false)
  const [limitGuestsPerDay, setLimitGuestsPerDay] = useState(true)
  const [maxGuestsPerDay, setMaxGuestsPerDay] = useState(20)
  const [allowSpecialRequests, setAllowSpecialRequests] = useState(true)
  const [flexiblePricingByGroup, setFlexiblePricingByGroup] = useState(false)
  const [includeInsurance, setIncludeInsurance] = useState(true)

  // 4. Hình ảnh & video
  const [galleryImages, setGalleryImages] = useState<string[]>([...GALLERY_SAMPLE_IMAGES])
  const [videoSourceType, setVideoSourceType] = useState<"upload" | "link">("upload")
  const [videoFile, setVideoFile] = useState<{
    name: string
    duration: string
    size: string
    thumbnail: string
  } | null>({
    name: "video-tour-phu-quoc.mp4",
    duration: "2:15",
    size: "45 MB",
    thumbnail: "/packages/kham-pha-4-dao.jpg",
  })
  const [videoUrl, setVideoUrl] = useState("https://youtube.com/watch?v=phuquoc-tour")

  const imageUploadRef = useRef<HTMLInputElement>(null)
  const videoUploadRef = useRef<HTMLInputElement>(null)

  const handleRemoveImage = (indexToRemove: number) => {
    setGalleryImages((prev) => prev.filter((_, idx) => idx !== indexToRemove))
  }

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    const newUrls: string[] = []
    for (const file of files) {
      if (file) {
        newUrls.push(URL.createObjectURL(file))
      }
    }
    setGalleryImages((prev) => [...prev, ...newUrls].slice(0, 20))
    if (imageUploadRef.current) {
      imageUploadRef.current.value = ""
    }
  }

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const sizeMb = (file.size / (1024 * 1024)).toFixed(0)
    setVideoFile({
      name: file.name,
      duration: "2:15",
      size: `${sizeMb} MB`,
      thumbnail: "/experience/tour-3-dao.jpg",
    })
    if (videoUploadRef.current) {
      videoUploadRef.current.value = ""
    }
  }

  // 5. SEO & hiển thị
  const [metaTitle, setMetaTitle] = useState("Tour 4 đảo Phú Quốc - Khám phá Nam đảo | Stayea")
  const [metaDescription, setMetaDescription] = useState(
    "Khám phá 4 đảo đẹp nhất Phú Quốc: Hòn Thơm, Hòn Móng Tay, Hòn Gầm Ghì, Hòn Mây Rút. Tour trọn gói, hướng dẫn viên chuyên nghiệp, lặn ngắm san hô, BBQ hải sản. Đặt ngay trên Stayea!"
  )
  const [metaSlug, setMetaSlug] = useState("tour-4-dao-phu-quoc")
  const [seoTags, setSeoTags] = useState<string[]>([...INITIAL_SEO_TAGS])
  const [seoTagInput, setSeoTagInput] = useState("")

  // Hiển thị & phân loại
  const [experienceStatus, setExperienceStatus] = useState<"Đang hoạt động" | "Tạm dừng" | "Bản nháp">("Đang hoạt động")
  const [displayCategory, setDisplayCategory] = useState("Tour biển đảo")
  const [isFeatured, setIsFeatured] = useState(true)
  const [displayBadges, setDisplayBadges] = useState<{
    bestSeller: boolean
    newArrival: boolean
    discount: boolean
    recommended: boolean
  }>({
    bestSeller: true,
    newArrival: false,
    discount: false,
    recommended: true,
  })

  // Preview tab: "google" | "stayea"
  const [previewTab, setPreviewTab] = useState<"google" | "stayea">("google")

  // Cài đặt nâng cao
  const [advancedSettings, setAdvancedSettings] = useState({
    allowIndexGoogle: true,
    allowShareSocial: true,
    hideFromInternalSearch: false,
    customDateTourDisplay: false,
  })

  const handleAddSeoTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && seoTagInput.trim()) {
      e.preventDefault()
      const newTag = seoTagInput.trim().toLowerCase()
      if (!seoTags.includes(newTag) && seoTags.length < 10) {
        setSeoTags([...seoTags, newTag])
      }
      setSeoTagInput("")
    }
  }

  const handleRemoveSeoTag = (tagToRemove: string) => {
    setSeoTags(seoTags.filter((t) => t !== tagToRemove))
  }

  const handleSlugChange = (val: string) => {
    const formatted = val.toLowerCase().replaceAll(/[^a-z0-9-]/g, "")
    setMetaSlug(formatted)
  }

  const fileInputRef = useRef<HTMLInputElement>(null)
  const formBodyRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (formBodyRef.current) {
      formBodyRef.current.scrollTop = 0
    }
  }, [activeTab, isOpen])

  if (!isOpen) return null

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault()
      const newTag = tagInput.trim().toLowerCase()
      if (!tags.includes(newTag)) {
        setTags([...tags, newTag])
      }
      setTagInput("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove))
  }

  const handleTriggerUpload = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const tempUrl = URL.createObjectURL(file)
      setAvatarImage(tempUrl)
    }
  }

  // Itinerary handlers
  const handleToggleDay = (dayId: string) => {
    setDays((prev) =>
      prev.map((d) => (d.id === dayId ? { ...d, isExpanded: !d.isExpanded } : d))
    )
  }

  const handleDeleteDay = (dayId: string) => {
    setDays((prev) => prev.filter((d) => d.id !== dayId))
  }

  const handleAddDay = () => {
    setIsAddDayModalOpen(true)
  }

  const handleConfirmAddDay = (data: NewDayData) => {
    const dayTitle = data.destination
      ? `${data.destination} – ${data.title}`
      : data.title
    const newDay: ItineraryDay = {
      id: `day-${Date.now()}`,
      dayNumber: data.dayNumber,
      title: dayTitle,
      destination: data.destination,
      description: data.description,
      isExpanded: true,
      activities: [
        {
          id: `act-${Date.now()}`,
          time: "08:30",
          icon: "car",
          title: data.title,
          description:
            data.description ||
            "Bắt đầu hành trình và các điểm tham quan theo lịch trình.",
        },
      ],
    }
    setDays((prev) =>
      [...prev, newDay].sort((a, b) => a.dayNumber - b.dayNumber)
    )
  }

  const handleAddSeasonalRate = () => {
    const newRate: SeasonalRate = {
      id: `season-${Date.now()}`,
      dateRange: "01/06/2025 - 31/08/2025",
      seasonType: "special",
      seasonLabel: "Mùa lễ hội",
      priceAdult: "500.000 đ",
      priceChild: "320.000 đ",
      priceGroup: "480.000 đ",
      note: "Giá mùa hè & lễ hội",
    }
    setSeasonalRates((prev) => [...prev, newRate])
  }

  const handleAddActivity = (dayId: string) => {
    const newAct: TimelineActivity = {
      id: `act-${Date.now()}`,
      time: "16:00",
      icon: "waves",
      title: "Hoạt động bổ sung",
      description: "Tự do tham quan và chụp ảnh lưu niệm",
    }
    setDays((prev) =>
      prev.map((d) =>
        d.id === dayId ? { ...d, activities: [...d.activities, newAct] } : d
      )
    )
  }

  const toggleIncludedService = (service: string) => {
    if (includedServices.includes(service)) {
      setIncludedServices((prev) => prev.filter((s) => s !== service))
    } else {
      setIncludedServices((prev) => [...prev, service])
    }
  }

  const handleAddIncludedService = () => {
    const sName = window.prompt("Nhập tên dịch vụ bao gồm:")
    if (sName?.trim() && !includedServices.includes(sName.trim())) {
      setIncludedServices((prev) => [...prev, sName.trim()])
    }
  }

  const toggleExcludedService = (service: string) => {
    if (excludedServices.includes(service)) {
      setExcludedServices((prev) => prev.filter((s) => s !== service))
    } else {
      setExcludedServices((prev) => [...prev, service])
    }
  }

  const handleAddExcludedService = () => {
    const sName = window.prompt("Nhập tên dịch vụ không bao gồm:")
    if (sName?.trim() && !excludedServices.includes(sName.trim())) {
      setExcludedServices((prev) => [...prev, sName.trim()])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      setActiveTab("basic")
      return
    }

    const status: ExperienceStatus = isPublic ? "active" : "paused"

    const newExp: ExperienceItem = {
      id: `exp-${Date.now()}`,
      name: name.trim(),
      category: category || "Tour biển đảo",
      location: location.trim() || "Phú Quốc",
      provider: provider.trim() || "Stayea Partner",
      price: Number(priceAdult) || 450_000,
      status,
      rating: 5,
      reviewsCount: 1,
      image: avatarImage,
      tag: tagLabel.trim()
        ? {
            label: tagLabel.trim(),
            variant: tagVariant,
          }
        : undefined,
    }

    onSubmit(newExp)
    onClose()
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-experience-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/45 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden z-10 flex flex-col my-auto max-h-[95vh]">
        {/* 1. Modal Header (Fixed) */}
        <div className="px-5 sm:px-7 py-3.5 flex items-center justify-between border-b border-slate-100 bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#1b7a4e] flex items-center justify-center text-white shrink-0 shadow-xs">
              <Plus className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2
                id="create-experience-title"
                className="text-base sm:text-lg font-bold text-slate-900 tracking-tight"
              >
                Thêm trải nghiệm / Tour
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Tạo mới trải nghiệm, tour du lịch để thu hút khách hàng trên Stayea.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng biểu mẫu"
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2. Top Tabs Navigation Bar (Fixed) */}
        <div className="px-5 sm:px-7 pt-2 border-b border-slate-100 bg-white overflow-x-auto shrink-0">
          <div className="flex items-center gap-6 text-xs min-w-max">
            <button
              type="button"
              onClick={() => setActiveTab("basic")}
              className={`pb-2.5 font-semibold transition-all relative cursor-pointer ${
                activeTab === "basic"
                  ? "text-[#1b7a4e] border-b-2 border-[#1b7a4e]"
                  : "text-slate-500 hover:text-slate-800 border-b-2 border-transparent"
              }`}
            >
              Thông tin cơ bản
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("itinerary")}
              className={`pb-2.5 font-semibold transition-all relative cursor-pointer ${
                activeTab === "itinerary"
                  ? "text-[#1b7a4e] border-b-2 border-[#1b7a4e]"
                  : "text-slate-500 hover:text-slate-800 border-b-2 border-transparent"
              }`}
            >
              Lịch trình & dịch vụ
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("pricing")}
              className={`pb-2.5 font-semibold transition-all relative cursor-pointer ${
                activeTab === "pricing"
                  ? "text-[#1b7a4e] border-b-2 border-[#1b7a4e]"
                  : "text-slate-500 hover:text-slate-800 border-b-2 border-transparent"
              }`}
            >
              Giá & chính sách
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("media")}
              className={`pb-2.5 font-semibold transition-all relative cursor-pointer ${
                activeTab === "media"
                  ? "text-[#1b7a4e] border-b-2 border-[#1b7a4e]"
                  : "text-slate-500 hover:text-slate-800 border-b-2 border-transparent"
              }`}
            >
              Hình ảnh & video
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("seo")}
              className={`pb-2.5 font-semibold transition-all relative cursor-pointer ${
                activeTab === "seo"
                  ? "text-[#1b7a4e] border-b-2 border-[#1b7a4e]"
                  : "text-slate-500 hover:text-slate-800 border-b-2 border-transparent"
              }`}
            >
              SEO & hiển thị
            </button>
          </div>
        </div>

        {/* 3. Modal Form Body (Scrollable) */}
        <form ref={formBodyRef} id="experience-create-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          {/* TAB 1: THÔNG TIN CƠ BẢN */}
          {activeTab === "basic" && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                Thông tin chung
              </h3>

              {/* Row 1: Left Form Fields + Right Image Upload */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                {/* Left Fields */}
                <div className="lg:col-span-8 space-y-3">
                  {/* Tên trải nghiệm / Tour */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Tên trải nghiệm / Tour <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Ticket className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Nhập tên trải nghiệm / tour (ví dụ: Tour 4 đảo Phú Quốc)"
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-white hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  {/* Grid: Loại hình & Thời lượng */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Loại hình */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Loại hình <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <LayoutGrid className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="w-full pl-9 pr-7 py-2 text-xs rounded-xl border border-slate-200 bg-white hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 appearance-none cursor-pointer"
                        >
                          <option value="">Chọn loại hình</option>
                          <option value="Tour biển đảo">Tour biển đảo</option>
                          <option value="Tham quan">Tham quan</option>
                          <option value="Ẩm thực">Ẩm thực</option>
                          <option value="Thể thao biển">Thể thao biển</option>
                          <option value="Văn hóa">Văn hóa</option>
                          <option value="Sức khỏe">Wellness (Sức khỏe)</option>
                          <option value="Khác">Khác</option>
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    {/* Thời lượng */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Thời lượng <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <select
                          value={duration}
                          onChange={(e) => setDuration(e.target.value)}
                          className="w-full pl-9 pr-7 py-2 text-xs rounded-xl border border-slate-200 bg-white hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 appearance-none cursor-pointer"
                        >
                          <option value="">Chọn thời lượng</option>
                          <option value="Nửa ngày (4-5 giờ)">Nửa ngày (4-5 giờ)</option>
                          <option value="1 ngày (8-10 giờ)">1 ngày (8-10 giờ)</option>
                          <option value="2 ngày 1 đêm">2 ngày 1 đêm</option>
                          <option value="3 ngày 2 đêm">3 ngày 2 đêm</option>
                          <option value="Theo yêu cầu">Theo yêu cầu</option>
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* Grid: Địa điểm & Đối tác cung cấp */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Địa điểm */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Địa điểm <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="text"
                          required
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          placeholder="Nhập địa điểm (ví dụ: Phú Quốc)"
                          className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-white hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-slate-400"
                        />
                      </div>
                    </div>

                    {/* Đối tác cung cấp */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Đối tác cung cấp <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Users className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <select
                          value={provider}
                          onChange={(e) => setProvider(e.target.value)}
                          className="w-full pl-9 pr-7 py-2 text-xs rounded-xl border border-slate-200 bg-white hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 appearance-none cursor-pointer"
                        >
                          <option value="">Chọn đối tác</option>
                          <option value="Ocean Stay">Ocean Stay</option>
                          <option value="PhuQuoc Dive">PhuQuoc Dive</option>
                          <option value="Sunset Tours">Sunset Tours</option>
                          <option value="VinWonders">VinWonders</option>
                          <option value="Sun World">Sun World</option>
                          <option value="Local Tours">Local Tours</option>
                          <option value="Taste of Phú Quốc">Taste of Phú Quốc</option>
                          <option value="Island Adventure">Island Adventure</option>
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Upload Ảnh đại diện */}
                <div className="lg:col-span-4 flex flex-col">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Ảnh đại diện <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <div
                    onClick={handleTriggerUpload}
                    className="flex-1 rounded-2xl border-2 border-dashed border-emerald-300/80 bg-emerald-50/20 hover:bg-emerald-50/40 transition-colors p-4 flex flex-col items-center justify-center text-center cursor-pointer min-h-[155px] group"
                  >
                    <div className="w-11 h-11 rounded-full bg-emerald-100/70 text-emerald-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                      <Upload className="w-5 h-5 text-emerald-700" />
                    </div>
                    <span className="text-xs font-bold text-emerald-800">
                      Tải ảnh lên
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      hoặc kéo thả
                    </span>
                    <span className="text-[10px] text-slate-400 mt-2 block">
                      JPG, PNG, tối đa 5MB
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      Tỷ lệ 16:9, khuyến nghị 1920x1080
                    </span>
                  </div>
                </div>
              </div>

              {/* Row 2: Mô tả ngắn */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mô tả ngắn <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <textarea
                    rows={2}
                    maxLength={200}
                    value={shortDescription}
                    onChange={(e) => setShortDescription(e.target.value)}
                    placeholder="Viết mô tả ngắn hấp dẫn (hiển thị trên danh sách, tối đa 200 ký tự)"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-slate-400 resize-none"
                  />
                  <span className="text-[10px] text-slate-400 absolute right-3 bottom-2 pointer-events-none">
                    {shortDescription.length}/200
                  </span>
                </div>
              </div>

              {/* Row 3: Mô tả chi tiết & Điểm nổi bật */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Mô tả chi tiết */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mô tả chi tiết <span className="text-rose-500">*</span>
                  </label>
                  <div className="rounded-xl border border-slate-200 overflow-hidden focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 bg-white">
                    <div className="flex items-center gap-1 px-2.5 py-1.5 border-b border-slate-100 bg-slate-50/70 text-slate-600">
                      <button type="button" aria-label="In đậm" className="p-1 rounded hover:bg-slate-200/60 text-slate-700"><Bold className="w-3.5 h-3.5" /></button>
                      <button type="button" aria-label="In nghiêng" className="p-1 rounded hover:bg-slate-200/60 text-slate-700"><Italic className="w-3.5 h-3.5" /></button>
                      <button type="button" aria-label="Gạch chân" className="p-1 rounded hover:bg-slate-200/60 text-slate-700"><Underline className="w-3.5 h-3.5" /></button>
                      <span className="w-px h-3.5 bg-slate-200 mx-1" />
                      <button type="button" aria-label="Danh sách gạch đầu dòng" className="p-1 rounded hover:bg-slate-200/60 text-slate-700"><List className="w-3.5 h-3.5" /></button>
                      <button type="button" aria-label="Danh sách số" className="p-1 rounded hover:bg-slate-200/60 text-slate-700"><ListOrdered className="w-3.5 h-3.5" /></button>
                      <button type="button" aria-label="Chèn liên kết" className="p-1 rounded hover:bg-slate-200/60 text-slate-700"><Link2 className="w-3.5 h-3.5" /></button>
                    </div>
                    <div className="relative">
                      <textarea
                        rows={3}
                        maxLength={2000}
                        value={detailedDescription}
                        onChange={(e) => setDetailedDescription(e.target.value)}
                        placeholder="Nhập mô tả chi tiết về trải nghiệm / tour..."
                        className="w-full p-2.5 text-xs bg-white focus:outline-none resize-none placeholder:text-slate-400"
                      />
                      <span className="text-[10px] text-slate-400 absolute right-3 bottom-1.5 pointer-events-none">
                        {detailedDescription.length}/2000
                      </span>
                    </div>
                  </div>
                </div>

                {/* Điểm nổi bật */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Điểm nổi bật
                  </label>
                  <div className="rounded-xl border border-slate-200 overflow-hidden focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 bg-white">
                    <div className="flex items-center gap-1 px-2.5 py-1.5 border-b border-slate-100 bg-slate-50/70 text-slate-600">
                      <button type="button" aria-label="In đậm" className="p-1 rounded hover:bg-slate-200/60 text-slate-700"><Bold className="w-3.5 h-3.5" /></button>
                      <button type="button" aria-label="In nghiêng" className="p-1 rounded hover:bg-slate-200/60 text-slate-700"><Italic className="w-3.5 h-3.5" /></button>
                      <button type="button" aria-label="Gạch chân" className="p-1 rounded hover:bg-slate-200/60 text-slate-700"><Underline className="w-3.5 h-3.5" /></button>
                      <span className="w-px h-3.5 bg-slate-200 mx-1" />
                      <button type="button" aria-label="Danh sách gạch đầu dòng" className="p-1 rounded hover:bg-slate-200/60 text-slate-700"><List className="w-3.5 h-3.5" /></button>
                      <button type="button" aria-label="Danh sách số" className="p-1 rounded hover:bg-slate-200/60 text-slate-700"><ListOrdered className="w-3.5 h-3.5" /></button>
                      <button type="button" aria-label="Chèn liên kết" className="p-1 rounded hover:bg-slate-200/60 text-slate-700"><Link2 className="w-3.5 h-3.5" /></button>
                    </div>
                    <div className="relative">
                      <textarea
                        rows={3}
                        maxLength={1000}
                        value={highlights}
                        onChange={(e) => setHighlights(e.target.value)}
                        placeholder="Nhập các điểm nổi bật, lý do nên trải nghiệm..."
                        className="w-full p-2.5 text-xs bg-white focus:outline-none resize-none placeholder:text-slate-400"
                      />
                      <span className="text-[10px] text-slate-400 absolute right-3 bottom-1.5 pointer-events-none">
                        {highlights.length}/1000
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 4: Trạng thái & Nhãn / Tag */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start pt-1">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    Trạng thái
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      role="switch"
                      aria-checked={isPublic}
                      onClick={() => setIsPublic(!isPublic)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        isPublic ? "bg-[#1b7a4e]" : "bg-slate-200"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                          isPublic ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block leading-tight">
                        Hiển thị công khai
                      </span>
                      <span className="text-[11px] text-slate-400 block leading-tight mt-0.5">
                        Trải nghiệm sẽ hiển thị trên website và ứng dụng Stayea.
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nhãn / Tag
                  </label>
                  <div className="space-y-1.5">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleAddTag}
                      placeholder="Nhập nhãn, tag (ví dụ: biển đảo, gia đình, adventure)"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-slate-400"
                    />
                    {tags.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        {tags.map((t) => (
                          <span
                            key={t}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[10px] font-semibold border border-emerald-200/60"
                          >
                            {t}
                            <button
                              type="button"
                              onClick={() => handleRemoveTag(t)}
                              className="hover:text-emerald-950 cursor-pointer"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                    <span className="text-[11px] text-slate-400 block mt-1">
                      Nhấn Enter để thêm tag
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: LỊCH TRÌNH & DỊCH VỤ */}
          {activeTab === "itinerary" && (
            <div className="space-y-3">
              {/* SECTION 1: Lịch trình chi tiết */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                        Lịch trình chi tiết
                      </h3>
                      <Info className="w-3.5 h-3.5 text-slate-400 cursor-pointer" />
                    </div>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      Thêm các ngày, hoạt động và điểm đến trong hành trình trải nghiệm.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddDay}
                    className="px-3.5 py-1.5 rounded-xl bg-[#1b7a4e] hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Thêm ngày</span>
                  </button>
                </div>

                {/* Days Accordion List */}
                <div className="space-y-2">
                  {days.map((day) => (
                    <div
                      key={day.id}
                      className="border border-slate-200/90 rounded-2xl bg-white overflow-hidden transition-all shadow-2xs"
                    >
                      {/* Day Header Row */}
                      <div
                        className={`flex items-center justify-between px-3.5 py-2.5 ${
                          day.isExpanded ? "bg-slate-50/70 border-b border-slate-100" : "bg-white"
                        }`}
                      >
                        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                          <GripVertical className="w-4 h-4 text-slate-300 hover:text-slate-500 cursor-grab shrink-0" />
                          <LayoutGrid className="w-4 h-4 text-slate-600 shrink-0" />
                          <span className="text-xs font-bold text-slate-900 shrink-0">
                            Ngày {day.dayNumber}
                          </span>
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="text-xs font-medium text-slate-700 truncate">
                            {day.title}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleToggleDay(day.id)}
                            className="p-1 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                            aria-label={day.isExpanded ? "Thu gọn ngày" : "Mở rộng ngày"}
                          >
                            {day.isExpanded ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteDay(day.id)}
                            className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            aria-label="Xóa ngày"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Expanded Content: Timeline */}
                      {day.isExpanded && (
                        <div className="p-3 sm:p-3.5 relative">
                          {/* Vertical Timeline Guide Line */}
                          <div className="absolute left-[78px] top-6 bottom-10 w-[1.5px] bg-slate-200" />

                          {/* Activities List */}
                          <div className="space-y-2">
                            {day.activities.map((act) => (
                              <div
                                key={act.id}
                                className="relative flex items-center justify-between gap-3 group"
                              >
                                {/* Left details */}
                                <div className="flex items-center gap-3 min-w-0 flex-1">
                                  <span className="w-12 text-right text-xs font-medium text-slate-500 shrink-0">
                                    {act.time}
                                  </span>

                                  <div className="w-2.5 h-2.5 rounded-full bg-slate-300 ring-4 ring-white shrink-0 z-10" />

                                  <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                                    {renderActivityIcon(act.icon)}
                                  </div>

                                  <div className="min-w-0">
                                    <h4 className="text-xs font-semibold text-slate-800 truncate">
                                      {act.title}
                                    </h4>
                                    <p className="text-[11px] text-slate-500 truncate">
                                      {act.description}
                                    </p>
                                  </div>
                                </div>

                                {/* Right action menu */}
                                <button
                                  type="button"
                                  className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
                                  aria-label="Thao tác hoạt động"
                                >
                                  <MoreHorizontal className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>

                          {/* Add activity button with L-elbow line */}
                          <div className="pt-2.5 ml-[68px] flex items-center gap-2 relative">
                            <div className="w-3 h-3 border-b-[1.5px] border-l-[1.5px] border-slate-200 rounded-bl-sm absolute -left-[1.5px] top-1/2 -translate-y-1/2" />
                            <button
                              type="button"
                              onClick={() => handleAddActivity(day.id)}
                              className="ml-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50/80 hover:bg-emerald-100/80 border border-emerald-200/80 text-emerald-800 text-xs font-semibold transition-colors cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5 text-emerald-700" />
                              <span>Thêm hoạt động</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION 2: Dịch vụ bao gồm */}
              <div className="space-y-1.5 pt-2">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                    Dịch vụ bao gồm
                  </h3>
                  <Info className="w-3.5 h-3.5 text-slate-400 cursor-pointer" />
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  Chọn các dịch vụ đã bao gồm trong giá tour.
                </p>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {includedServices.map((service) => (
                    <button
                      key={service}
                      type="button"
                      onClick={() => toggleIncludedService(service)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50/80 border border-emerald-300/80 text-emerald-800 text-xs font-semibold hover:bg-emerald-100/70 transition-colors cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
                      <span>{service}</span>
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={handleAddIncludedService}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-emerald-300 text-[#1b7a4e] bg-white hover:bg-emerald-50 text-xs font-medium transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Thêm dịch vụ</span>
                  </button>
                </div>
              </div>

              {/* SECTION 3: Dịch vụ không bao gồm */}
              <div className="space-y-1.5 pt-2">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                    Dịch vụ không bao gồm
                  </h3>
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  Chọn các dịch vụ không bao gồm trong giá tour.
                </p>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {excludedServices.map((service) => (
                    <button
                      key={service}
                      type="button"
                      onClick={() => toggleExcludedService(service)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-medium hover:bg-slate-50 hover:border-slate-300 transition-colors cursor-pointer"
                    >
                      <Square className="w-3.5 h-3.5 text-slate-400 stroke-[1.8]" />
                      <span>{service}</span>
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={handleAddExcludedService}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-emerald-300 text-[#1b7a4e] bg-white hover:bg-emerald-50 text-xs font-medium transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Thêm dịch vụ</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: GIÁ & CHÍNH SÁCH */}
          {activeTab === "pricing" && (
            <div className="space-y-3">
              {/* SECTION 1: GIÁ BÁN */}
              <div className="border border-slate-200/90 rounded-2xl bg-white p-3.5 sm:p-4 shadow-2xs space-y-2.5">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 tracking-tight">Giá bán</h3>
                    <p className="text-xs text-slate-500 mt-0.5 font-medium">
                      Thiết lập giá bán và các tùy chọn giá theo đối tượng khách hàng.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-slate-500 font-medium">Đơn vị tiền tệ</span>
                    <div className="relative">
                      <select
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        className="appearance-none pl-3 pr-8 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-800 shadow-2xs cursor-pointer focus:outline-none focus:ring-1.5 focus:ring-emerald-500 hover:border-slate-300 transition-colors"
                      >
                        <option value="Việt Nam đồng (VND)">Việt Nam đồng (VND)</option>
                        <option value="Đô la Mỹ (USD)">Đô la Mỹ (USD)</option>
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* 4-column Price Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {/* 1. Giá người lớn * */}
                  <div>
                    <label className="flex items-center gap-1 text-xs font-semibold text-slate-700 mb-1.5">
                      <span>Giá người lớn</span>
                      <span className="text-red-500 font-bold">*</span>
                      <Info className="w-3 h-3 text-slate-400 cursor-pointer" />
                    </label>
                    <div className="relative flex items-center">
                      <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
                      <input
                        type="text"
                        value={priceAdult}
                        onChange={(e) => setPriceAdult(e.target.value)}
                        className="w-full pl-8.5 pr-7 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-900 shadow-2xs focus:outline-none focus:ring-1.5 focus:ring-emerald-500"
                      />
                      <span className="text-xs font-semibold text-slate-400 absolute right-3 pointer-events-none">đ</span>
                    </div>
                  </div>

                  {/* 2. Giá trẻ em (2 - 11 tuổi) */}
                  <div>
                    <label className="flex items-center gap-1 text-xs font-semibold text-slate-700 mb-1.5">
                      <span>Giá trẻ em (2 - 11 tuổi)</span>
                      <Info className="w-3 h-3 text-slate-400 cursor-pointer" />
                    </label>
                    <div className="relative flex items-center">
                      <Baby className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
                      <input
                        type="text"
                        value={priceChild}
                        onChange={(e) => setPriceChild(e.target.value)}
                        className="w-full pl-8.5 pr-7 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-900 shadow-2xs focus:outline-none focus:ring-1.5 focus:ring-emerald-500"
                      />
                      <span className="text-xs font-semibold text-slate-400 absolute right-3 pointer-events-none">đ</span>
                    </div>
                  </div>

                  {/* 3. Giá em bé (< 2 tuổi) */}
                  <div>
                    <label className="flex items-center gap-1 text-xs font-semibold text-slate-700 mb-1.5">
                      <span>Giá em bé (&lt; 2 tuổi)</span>
                      <Info className="w-3 h-3 text-slate-400 cursor-pointer" />
                    </label>
                    <div className="relative flex items-center">
                      <Baby className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
                      <input
                        type="text"
                        value={priceInfant}
                        onChange={(e) => setPriceInfant(e.target.value)}
                        className="w-full pl-8.5 pr-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-900 shadow-2xs focus:outline-none focus:ring-1.5 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  {/* 4. Giá nhóm (từ 5 khách) */}
                  <div>
                    <label className="flex items-center gap-1 text-xs font-semibold text-slate-700 mb-1.5">
                      <span>Giá nhóm (từ 5 khách)</span>
                      <Info className="w-3 h-3 text-slate-400 cursor-pointer" />
                    </label>
                    <div className="relative flex items-center">
                      <Users className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
                      <input
                        type="text"
                        value={priceGroup}
                        onChange={(e) => setPriceGroup(e.target.value)}
                        className="w-full pl-8.5 pr-7 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-900 shadow-2xs focus:outline-none focus:ring-1.5 focus:ring-emerald-500"
                      />
                      <span className="text-xs font-semibold text-slate-400 absolute right-3 pointer-events-none">đ</span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-medium mt-1">Áp dụng cho mỗi người</p>
                  </div>
                </div>

                {/* Tip banner */}
                <div className="bg-emerald-50/70 border border-emerald-100/90 rounded-xl px-3.5 py-2.5 flex items-center gap-2 mt-2">
                  <Lightbulb className="w-4 h-4 text-emerald-600 shrink-0" />
                  <p className="text-xs text-emerald-950 font-medium">
                    <span className="font-bold">Mẹo:</span> Bạn có thể thiết lập nhiều mức giá theo mùa, ngày lễ ở phần bên dưới.
                  </p>
                </div>
              </div>

              {/* SECTION 2: GIÁ THEO MÙA / NGÀY ĐẶC BIỆT */}
              <div className="border border-slate-200/90 rounded-2xl bg-white p-3.5 sm:p-4 shadow-2xs space-y-2.5">
                {/* Header */}
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                      Giá theo mùa / Ngày đặc biệt
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5 font-medium">
                      Thiết lập giá khác nhau theo thời gian (mùa cao điểm, lễ tết...).
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddSeasonalRate}
                    className="px-3.5 py-1.5 rounded-xl bg-[#1b7a4e] hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Thêm mức giá</span>
                  </button>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-700 font-semibold text-[11px]">
                        <th className="pb-2.5 font-semibold">Thời gian áp dụng</th>
                        <th className="pb-2.5 font-semibold">Giá người lớn</th>
                        <th className="pb-2.5 font-semibold">Giá trẻ em</th>
                        <th className="pb-2.5 font-semibold">Giá nhóm</th>
                        <th className="pb-2.5 font-semibold">Ghi chú</th>
                        <th className="pb-2.5 font-semibold text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {seasonalRates.map((rate) => (
                        <tr key={rate.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-2">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span className="font-medium text-slate-800">{rate.dateRange}</span>
                              <span
                                className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                                  rate.seasonType === "high"
                                    ? "bg-amber-50 text-amber-700 border border-amber-200"
                                    : rate.seasonType === "low"
                                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                      : "bg-blue-50 text-blue-700 border border-blue-200"
                                }`}
                              >
                                {rate.seasonLabel}
                              </span>
                            </div>
                          </td>
                          <td className="py-2 font-semibold text-slate-800">{rate.priceAdult}</td>
                          <td className="py-2 font-semibold text-slate-800">{rate.priceChild}</td>
                          <td className="py-2 font-semibold text-slate-800">{rate.priceGroup}</td>
                          <td className="py-2 text-slate-500 font-medium">{rate.note}</td>
                          <td className="py-2 text-right">
                            <button
                              type="button"
                              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer inline-flex items-center justify-center"
                              aria-label="Thao tác khác"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* SECTION 3: 2 CỘT CHÍNH SÁCH */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
                {/* Cột 1: Chính sách đặt & hủy */}
                <div className="border border-slate-200/90 rounded-2xl bg-white p-3.5 sm:p-4 shadow-2xs space-y-2.5">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 tracking-tight">
                      Chính sách đặt & hủy
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5 font-medium">
                      Thiết lập quy định đặt cọc, thanh toán và chính sách hủy.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {/* 1. Yêu cầu đặt cọc */}
                    <div>
                      <label className="flex items-center gap-1 text-[11px] font-semibold text-slate-700 mb-1">
                        <span>Yêu cầu đặt cọc</span>
                        <Info className="w-3 h-3 text-slate-400 cursor-pointer" />
                      </label>
                      <div className="relative">
                        <select
                          value={depositRequirement}
                          onChange={(e) => setDepositRequirement(e.target.value)}
                          className="w-full appearance-none pl-3 pr-8 py-2 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-800 shadow-2xs cursor-pointer focus:outline-none focus:ring-1.5 focus:ring-emerald-500 hover:border-slate-300 transition-colors"
                        >
                          <option value="Không yêu cầu đặt cọc">Không yêu cầu đặt cọc</option>
                          <option value="20% giá trị tour">20% giá trị tour</option>
                          <option value="30% giá trị tour">30% giá trị tour</option>
                          <option value="50% giá trị tour">50% giá trị tour</option>
                          <option value="100% giá trị tour">100% giá trị tour</option>
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    {/* 2. Thời hạn thanh toán */}
                    <div>
                      <label className="flex items-center gap-1 text-[11px] font-semibold text-slate-700 mb-1">
                        <span>Thời hạn thanh toán</span>
                      </label>
                      <div className="relative">
                        <select
                          value={paymentDeadline}
                          onChange={(e) => setPaymentDeadline(e.target.value)}
                          className="w-full appearance-none pl-3 pr-8 py-2 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-800 shadow-2xs cursor-pointer focus:outline-none focus:ring-1.5 focus:ring-emerald-500 hover:border-slate-300 transition-colors"
                        >
                          <option value="Trong vòng 12 giờ">Trong vòng 12 giờ</option>
                          <option value="Trong vòng 24 giờ">Trong vòng 24 giờ</option>
                          <option value="Trong vòng 48 giờ">Trong vòng 48 giờ</option>
                          <option value="Trước khi khởi hành">Trước khi khởi hành</option>
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    {/* 3. Chính sách hủy */}
                    <div>
                      <label className="flex items-center gap-1 text-[11px] font-semibold text-slate-700 mb-1">
                        <span>Chính sách hủy</span>
                      </label>
                      <div className="relative">
                        <select
                          value={cancellationPolicyRule}
                          onChange={(e) => setCancellationPolicyRule(e.target.value)}
                          className="w-full appearance-none pl-3 pr-8 py-2 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-800 shadow-2xs cursor-pointer focus:outline-none focus:ring-1.5 focus:ring-emerald-500 hover:border-slate-300 transition-colors"
                        >
                          <option value="Hủy miễn phí trước 24 giờ">Hủy miễn phí trước 24 giờ</option>
                          <option value="Hủy miễn phí trước 3 ngày">Hủy miễn phí trước 3 ngày</option>
                          <option value="Hủy miễn phí trước 7 ngày">Hủy miễn phí trước 7 ngày</option>
                          <option value="Không hoàn tiền khi hủy">Không hoàn tiền khi hủy</option>
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    {/* 4. Phí hủy sau thời hạn */}
                    <div>
                      <label className="flex items-center gap-1 text-[11px] font-semibold text-slate-700 mb-1">
                        <span>Phí hủy sau thời hạn</span>
                      </label>
                      <div className="relative">
                        <select
                          value={lateCancellationFee}
                          onChange={(e) => setLateCancellationFee(e.target.value)}
                          className="w-full appearance-none pl-3 pr-8 py-2 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-800 shadow-2xs cursor-pointer focus:outline-none focus:ring-1.5 focus:ring-emerald-500 hover:border-slate-300 transition-colors"
                        >
                          <option value="Miễn phí">Miễn phí</option>
                          <option value="Phí 30% giá trị tour">Phí 30% giá trị tour</option>
                          <option value="Phí 50% giá trị tour">Phí 50% giá trị tour</option>
                          <option value="Phí 100% giá trị tour">Phí 100% giá trị tour</option>
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* Note box */}
                  <div className="bg-sky-50/70 border border-sky-100 rounded-xl px-3.5 py-2.5 flex items-center gap-2 mt-2">
                    <Info className="w-4 h-4 text-sky-600 shrink-0" />
                    <p className="text-xs text-sky-950 font-medium">
                      Chính sách minh bạch giúp tăng uy tín và giảm tranh chấp với khách hàng.
                    </p>
                  </div>
                </div>

                {/* Cột 2: Chính sách khác */}
                <div className="border border-slate-200/90 rounded-2xl bg-white p-3.5 sm:p-4 shadow-2xs space-y-2.5">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 tracking-tight">
                      Chính sách khác
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5 font-medium">
                      Các tùy chọn và quy định bổ sung.
                    </p>
                  </div>

                  <div className="space-y-3 pt-1">
                    {/* 1. Cho phép đặt nhanh */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <button
                          type="button"
                          role="switch"
                          aria-checked={instantBook}
                          onClick={() => setInstantBook(!instantBook)}
                          className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${
                            instantBook ? "bg-[#1b7a4e]" : "bg-slate-300"
                          }`}
                        >
                          <div
                            className={`w-4 h-4 rounded-full bg-white shadow-xs transition-transform ${
                              instantBook ? "translate-x-4" : "translate-x-0"
                            }`}
                          />
                        </button>
                        <span className="text-xs font-semibold text-slate-800">
                          Cho phép đặt nhanh (Instant Book)
                        </span>
                        <Info className="w-3.5 h-3.5 text-slate-400 cursor-pointer" />
                      </div>
                    </div>

                    {/* 2. Xác nhận thủ công */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5">
                        <button
                          type="button"
                          role="switch"
                          aria-checked={manualApproval}
                          onClick={() => setManualApproval(!manualApproval)}
                          className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer shrink-0 mt-0.5 ${
                            manualApproval ? "bg-[#1b7a4e]" : "bg-slate-300"
                          }`}
                        >
                          <div
                            className={`w-4 h-4 rounded-full bg-white shadow-xs transition-transform ${
                              manualApproval ? "translate-x-4" : "translate-x-0"
                            }`}
                          />
                        </button>
                        <div>
                          <div className="flex items-center gap-1">
                            <span className="text-xs font-semibold text-slate-800">
                              Xác nhận thủ công
                            </span>
                            <Info className="w-3.5 h-3.5 text-slate-400 cursor-pointer" />
                          </div>
                          <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                            Yêu cầu bạn phê duyệt trước khi xác nhận
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* 3. Giới hạn số lượng khách mỗi ngày */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <button
                          type="button"
                          role="switch"
                          aria-checked={limitGuestsPerDay}
                          onClick={() => setLimitGuestsPerDay(!limitGuestsPerDay)}
                          className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${
                            limitGuestsPerDay ? "bg-[#1b7a4e]" : "bg-slate-300"
                          }`}
                        >
                          <div
                            className={`w-4 h-4 rounded-full bg-white shadow-xs transition-transform ${
                              limitGuestsPerDay ? "translate-x-4" : "translate-x-0"
                            }`}
                          />
                        </button>
                        <span className="text-xs font-semibold text-slate-800">
                          Giới hạn số lượng khách mỗi ngày
                        </span>
                        <Info className="w-3.5 h-3.5 text-slate-400 cursor-pointer" />
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <input
                          type="number"
                          min={1}
                          value={maxGuestsPerDay}
                          onChange={(e) => setMaxGuestsPerDay(Number(e.target.value))}
                          className="w-14 px-2 py-1 text-center rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-800 shadow-2xs focus:outline-none focus:ring-1.5 focus:ring-emerald-500"
                        />
                        <span className="text-xs text-slate-500 font-medium">khách</span>
                      </div>
                    </div>

                    {/* 4. Cho phép yêu cầu đặc biệt của khách */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <button
                          type="button"
                          role="switch"
                          aria-checked={allowSpecialRequests}
                          onClick={() => setAllowSpecialRequests(!allowSpecialRequests)}
                          className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${
                            allowSpecialRequests ? "bg-[#1b7a4e]" : "bg-slate-300"
                          }`}
                        >
                          <div
                            className={`w-4 h-4 rounded-full bg-white shadow-xs transition-transform ${
                              allowSpecialRequests ? "translate-x-4" : "translate-x-0"
                            }`}
                          />
                        </button>
                        <span className="text-xs font-semibold text-slate-800">
                          Cho phép yêu cầu đặc biệt của khách
                        </span>
                      </div>
                    </div>

                    {/* 5. Hiển thị giá linh hoạt theo số lượng khách */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <button
                          type="button"
                          role="switch"
                          aria-checked={flexiblePricingByGroup}
                          onClick={() => setFlexiblePricingByGroup(!flexiblePricingByGroup)}
                          className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${
                            flexiblePricingByGroup ? "bg-[#1b7a4e]" : "bg-slate-300"
                          }`}
                        >
                          <div
                            className={`w-4 h-4 rounded-full bg-white shadow-xs transition-transform ${
                              flexiblePricingByGroup ? "translate-x-4" : "translate-x-0"
                            }`}
                          />
                        </button>
                        <span className="text-xs font-semibold text-slate-800">
                          Hiển thị giá linh hoạt theo số lượng khách
                        </span>
                        <Info className="w-3.5 h-3.5 text-slate-400 cursor-pointer" />
                      </div>
                    </div>

                    {/* 6. Bao gồm bảo hiểm du lịch */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <button
                          type="button"
                          role="switch"
                          aria-checked={includeInsurance}
                          onClick={() => setIncludeInsurance(!includeInsurance)}
                          className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${
                            includeInsurance ? "bg-[#1b7a4e]" : "bg-slate-300"
                          }`}
                        >
                          <div
                            className={`w-4 h-4 rounded-full bg-white shadow-xs transition-transform ${
                              includeInsurance ? "translate-x-4" : "translate-x-0"
                            }`}
                          />
                        </button>
                        <span className="text-xs font-semibold text-slate-800">
                          Bao gồm bảo hiểm du lịch
                        </span>
                        <Info className="w-3.5 h-3.5 text-slate-400 cursor-pointer" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: HÌNH ẢNH & VIDEO */}
          {activeTab === "media" && (
            <div className="space-y-4">
              {/* Hidden file inputs */}
              <input
                ref={imageUploadRef}
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleImageFileChange}
              />
              <input
                ref={videoUploadRef}
                type="file"
                accept="video/mp4,video/quicktime,video/mov"
                className="hidden"
                onChange={handleVideoFileChange}
              />

              {/* SECTION 1: HÌNH ẢNH TRẢI NGHIỆM / TOUR */}
              <div>
                <div className="flex items-center gap-1">
                  <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                    Hình ảnh trải nghiệm / Tour
                  </h3>
                  <span className="text-rose-500 font-bold">*</span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tải lên hình ảnh chất lượng cao, rõ nét, thể hiện được vẻ đẹp và các hoạt động nổi bật của trải nghiệm.
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 mt-2.5">
                  {/* Dropzone */}
                  <div
                    onClick={() => imageUploadRef.current?.click()}
                    className="lg:col-span-7 border-2 border-dashed border-slate-300 hover:border-[#1b7a4e]/50 rounded-2xl p-5 flex flex-col items-center justify-center text-center bg-white hover:bg-slate-50/60 transition-all cursor-pointer group shadow-2xs"
                  >
                    <UploadCloud className="w-9 h-9 text-slate-800 stroke-[1.8] group-hover:scale-105 transition-transform" />
                    <span className="font-bold text-slate-800 text-xs sm:text-sm mt-2.5">
                      Kéo thả hình ảnh vào đây hoặc nhấp để chọn
                    </span>
                    <span className="text-[11px] text-slate-400 mt-0.5">
                      JPG, PNG, WebP. Tối đa 5MB mỗi ảnh. Tối thiểu 5 ảnh, tối đa 20 ảnh.
                    </span>
                  </div>

                  {/* Mẹo chụp ảnh đẹp */}
                  <div className="lg:col-span-5 bg-[#f0faf5] border border-emerald-100 rounded-2xl p-3.5 flex flex-col justify-center">
                    <div className="flex items-center gap-1.5 mb-2">
                      <Lightbulb className="w-4 h-4 text-[#1b7a4e] shrink-0" />
                      <span className="text-xs font-bold text-[#064e3b]">Mẹo chụp ảnh đẹp</span>
                    </div>
                    <ul className="space-y-1">
                      {PHOTO_TIPS.map((tip) => (
                        <li key={tip} className="flex items-start gap-2 text-[11px] text-slate-700 leading-snug">
                          <Check className="w-3.5 h-3.5 text-[#1b7a4e] shrink-0 mt-0.5 stroke-[2.5]" />
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* SECTION 2: DANH SÁCH HÌNH ẢNH */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight">
                    Danh sách hình ảnh ({galleryImages.length === 7 ? "8/20" : `${galleryImages.length}/20`})
                  </h4>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2.5">
                  {galleryImages.map((img, index) => {
                    const isPrimaryImage = index === 0
                    return (
                      <div
                        key={img}
                        className="rounded-xl overflow-hidden border border-slate-200 bg-slate-100 aspect-square relative group shadow-2xs"
                      >
                        <Image
                          src={img}
                          alt={`Ảnh trải nghiệm ${index + 1}`}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-200"
                        />

                        {/* First image badge: Ảnh đại diện */}
                        {isPrimaryImage ? (
                          <>
                            <div className="absolute bottom-1.5 left-1.5 right-1.5 flex justify-center pointer-events-none">
                              <span className="bg-[#1b7a4e] text-white text-[9.5px] font-semibold px-2 py-0.5 rounded-md shadow-xs whitespace-nowrap">
                                Ảnh đại diện
                              </span>
                            </div>
                            <div className="absolute top-1.5 right-1.5 bg-black/50 text-white rounded-md p-1 w-5 h-5 flex items-center justify-center pointer-events-none">
                              <ImageIcon className="w-3 h-3 text-white" />
                            </div>
                          </>
                        ) : (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleRemoveImage(index)
                            }}
                            title="Xóa ảnh"
                            className="absolute top-1.5 right-1.5 bg-black/50 hover:bg-black/75 text-white rounded-full p-0.5 w-5 h-5 flex items-center justify-center transition-colors cursor-pointer shadow-xs"
                          >
                            <X className="w-3 h-3 stroke-[2.5]" />
                          </button>
                        )}
                      </div>
                    )
                  })}

                  {/* Add Image Slot */}
                  {galleryImages.length < 20 && (
                    <button
                      type="button"
                      onClick={() => imageUploadRef.current?.click()}
                      className="border-2 border-dashed border-[#1b7a4e]/40 hover:border-[#1b7a4e] rounded-xl bg-white hover:bg-emerald-50/30 transition-all flex flex-col items-center justify-center aspect-square cursor-pointer group p-1 text-center"
                    >
                      <Plus className="w-5 h-5 text-[#1b7a4e] group-hover:scale-110 transition-transform" />
                      <span className="text-[11px] font-semibold text-[#1b7a4e] mt-1">Thêm ảnh</span>
                    </button>
                  )}
                </div>
              </div>

              {/* SECTION 3: VIDEO GIỚI THIỆU (TÙY CHỌN) */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                  Video giới thiệu (tùy chọn)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Thêm video ngắn để giới thiệu trải nghiệm sinh động hơn (YouTube, Vimeo hoặc tải trực tiếp).
                </p>

                {/* Video sub-tabs */}
                <div className="flex items-center gap-2 mt-2 mb-2.5">
                  <button
                    type="button"
                    onClick={() => setVideoSourceType("upload")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                      videoSourceType === "upload"
                        ? "bg-[#f0faf5] text-[#1b7a4e] border border-[#1b7a4e]/40"
                        : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Tải video lên</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setVideoSourceType("link")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                      videoSourceType === "link"
                        ? "bg-[#f0faf5] text-[#1b7a4e] border border-[#1b7a4e]/40"
                        : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Liên kết YouTube / Vimeo</span>
                  </button>
                </div>

                {videoSourceType === "upload" ? (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-stretch">
                    {/* Video Upload Dropzone */}
                    <div
                      onClick={() => videoUploadRef.current?.click()}
                      className="md:col-span-5 border-2 border-dashed border-slate-200 hover:border-[#1b7a4e]/40 rounded-2xl bg-white hover:bg-slate-50/60 p-3.5 sm:p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-colors min-h-[125px] group shadow-2xs"
                    >
                      <UploadCloud className="w-7 h-7 text-slate-800 group-hover:scale-105 transition-transform" />
                      <span className="font-bold text-slate-800 text-xs mt-2">
                        Kéo thả video vào đây hoặc nhấp để chọn
                      </span>
                      <span className="text-[10.5px] text-slate-400 mt-0.5">
                        MP4, MOV. Tối đa 100MB. Thời lượng tối đa 3 phút.
                      </span>
                    </div>

                    {/* Video Preview Card */}
                    <div className="md:col-span-3">
                      {videoFile ? (
                        <div className="rounded-2xl border border-slate-200 bg-white p-2 flex flex-col justify-between shadow-2xs h-full min-h-[135px]">
                          <div className="h-20 sm:h-22 rounded-xl overflow-hidden relative group bg-slate-900 cursor-pointer w-full">
                            <Image
                              src={videoFile.thumbnail}
                              alt="Video preview"
                              fill
                              className="object-cover"
                            />
                            {/* Center Play Button */}
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center backdrop-blur-xs group-hover:scale-110 transition-transform shadow-md">
                                <Play className="w-3.5 h-3.5 fill-white text-white ml-0.5" />
                              </div>
                            </div>
                            {/* Delete button on top-right */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                setVideoFile(null)
                              }}
                              title="Xóa video"
                              className="absolute top-1 right-1 bg-black/60 hover:bg-black/80 text-white rounded-full p-0.5 w-4.5 h-4.5 flex items-center justify-center transition-colors cursor-pointer"
                            >
                              <X className="w-3 h-3 stroke-[2.5]" />
                            </button>
                          </div>
                          <div className="pt-1.5 px-0.5">
                            <div className="text-[11.5px] font-semibold text-slate-800 truncate" title={videoFile.name}>
                              {videoFile.name}
                            </div>
                            <div className="text-[10.5px] text-slate-400 mt-0.5">
                              {videoFile.duration} - {videoFile.size}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div
                          onClick={() => videoUploadRef.current?.click()}
                          className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center p-3 text-center cursor-pointer hover:bg-slate-100/50 transition-colors h-full min-h-[125px]"
                        >
                          <Play className="w-5 h-5 text-slate-400 mb-1" />
                          <span className="text-xs text-slate-600 font-medium">Chưa có video được chọn</span>
                          <span className="text-[10px] text-slate-400 mt-0.5">Nhấp để tải video lên</span>
                        </div>
                      )}
                    </div>

                    {/* Mẹo video hấp dẫn */}
                    <div className="md:col-span-4 bg-[#f0f8ff] border border-sky-100 rounded-2xl p-3.5 flex flex-col justify-center">
                      <div className="flex items-center gap-1.5 mb-2">
                        <Lightbulb className="w-4 h-4 text-sky-600 shrink-0" />
                        <span className="text-xs font-bold text-sky-900">Mẹo video hấp dẫn</span>
                      </div>
                      <ul className="space-y-1">
                        {VIDEO_TIPS.map((tip) => (
                          <li key={tip} className="flex items-start gap-1.5 text-[11px] text-slate-700 leading-snug">
                            <Check className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5 stroke-[2.5]" />
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-stretch">
                    <div className="md:col-span-8 flex flex-col justify-center gap-2.5 p-4 rounded-2xl border border-slate-200 bg-white">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Đường dẫn video (YouTube / Vimeo)
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="url"
                            value={videoUrl}
                            onChange={(e) => setVideoUrl(e.target.value)}
                            placeholder="https://www.youtube.com/watch?v=..."
                            className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                          />
                          <button
                            type="button"
                            className="px-4 py-2 bg-[#1b7a4e] text-white text-xs font-semibold rounded-xl hover:bg-emerald-700 transition-colors shrink-0 cursor-pointer"
                          >
                            Kiểm tra link
                          </button>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Hỗ trợ định dạng video công khai từ YouTube Shorts, YouTube Video hoặc Vimeo Showcase.
                      </p>
                    </div>

                    {/* Mẹo video hấp dẫn */}
                    <div className="md:col-span-4 bg-[#f0f8ff] border border-sky-100 rounded-2xl p-3.5 flex flex-col justify-center">
                      <div className="flex items-center gap-1.5 mb-2">
                        <Lightbulb className="w-4 h-4 text-sky-600 shrink-0" />
                        <span className="text-xs font-bold text-sky-900">Mẹo video hấp dẫn</span>
                      </div>
                      <ul className="space-y-1">
                        {VIDEO_TIPS.map((tip) => (
                          <li key={tip} className="flex items-start gap-1.5 text-[11px] text-slate-700 leading-snug">
                            <Check className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5 stroke-[2.5]" />
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: SEO & HIỂN THỊ */}
          {activeTab === "seo" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              {/* CỘT TRÁI (7/12) */}
              <div className="lg:col-span-7 space-y-4">
                {/* 1. TỐI ƯU TÌM KIẾM (SEO) */}
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                      Tối ưu tìm kiếm (SEO)
                    </h3>
                    <Sparkles className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Cung cấp thông tin SEO giúp trải nghiệm của bạn dễ dàng được tìm thấy trên Google và Stayea.
                  </p>

                  <div className="space-y-3 mt-3">
                    {/* Tiêu đề SEO * */}
                    <div>
                      <div className="flex items-center gap-1 mb-1">
                        <label className="text-xs font-semibold text-slate-700">
                          Tiêu đề SEO
                        </label>
                        <span className="text-rose-500 font-bold">*</span>
                      </div>
                      <input
                        type="text"
                        maxLength={60}
                        value={metaTitle}
                        onChange={(e) => setMetaTitle(e.target.value)}
                        placeholder="Nhập tiêu đề SEO..."
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-normal text-slate-800 placeholder:text-slate-400"
                      />
                      <div className="text-right mt-1">
                        <span className="text-[11px] text-slate-400">{metaTitle.length}/60</span>
                      </div>
                    </div>

                    {/* Mô tả SEO * */}
                    <div>
                      <div className="flex items-center gap-1 mb-1">
                        <label className="text-xs font-semibold text-slate-700">
                          Mô tả SEO
                        </label>
                        <span className="text-rose-500 font-bold">*</span>
                      </div>
                      <textarea
                        rows={3}
                        maxLength={160}
                        value={metaDescription}
                        onChange={(e) => setMetaDescription(e.target.value)}
                        placeholder="Nhập mô tả SEO..."
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-normal text-slate-800 placeholder:text-slate-400 resize-none leading-relaxed"
                      />
                      <div className="text-right mt-1">
                        <span className="text-[11px] text-slate-400">{metaDescription.length}/160</span>
                      </div>
                    </div>

                    {/* Từ khóa (tags) * */}
                    <div>
                      <div className="flex items-center gap-1 mb-1">
                        <label className="text-xs font-semibold text-slate-700">
                          Từ khóa (tags)
                        </label>
                        <span className="text-rose-500 font-bold">*</span>
                      </div>
                      <div className="border border-slate-200 rounded-xl p-2 bg-white flex flex-wrap items-center gap-1.5 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-all min-h-[42px]">
                        {seoTags.map((tag) => (
                          <span
                            key={tag}
                            className="bg-[#e0f2fe]/70 text-sky-800 border border-sky-100 rounded-lg px-2.5 py-1 text-xs font-medium flex items-center gap-1.5 shadow-2xs"
                          >
                            <span>{tag}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveSeoTag(tag)}
                              className="text-sky-500 hover:text-sky-700 focus:outline-none cursor-pointer"
                              title={`Xóa từ khóa ${tag}`}
                            >
                              <X className="w-3 h-3 stroke-[2.5]" />
                            </button>
                          </span>
                        ))}
                        {seoTags.length < 10 && (
                          <input
                            type="text"
                            value={seoTagInput}
                            onChange={(e) => setSeoTagInput(e.target.value)}
                            onKeyDown={handleAddSeoTag}
                            placeholder={seoTags.length === 0 ? "Thêm từ khóa và nhấn Enter..." : "Thêm từ khóa và nhấn Enter..."}
                            className="flex-1 min-w-[170px] text-xs py-1 px-1 bg-transparent focus:outline-none text-slate-800 placeholder:text-slate-400"
                          />
                        )}
                      </div>
                      <div className="text-right mt-1">
                        <span className="text-[11px] text-slate-400">{seoTags.length}/10</span>
                      </div>
                    </div>

                    {/* Đường dẫn (URL) */}
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight">
                        Đường dẫn (URL)
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5 mb-1.5">
                        Đường dẫn thân thiện giúp khách hàng dễ nhớ và tốt cho SEO.
                      </p>
                      <div className="border border-slate-200 rounded-xl px-3 py-2 bg-white flex items-center gap-1 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-all shadow-2xs">
                        <span className="text-xs text-slate-400 select-none whitespace-nowrap">
                          https://www.stayea.com/trai-nghiem/
                        </span>
                        <input
                          type="text"
                          value={metaSlug}
                          onChange={(e) => handleSlugChange(e.target.value)}
                          placeholder="tour-4-dao-phu-quoc"
                          className="flex-1 text-xs font-medium text-slate-800 bg-transparent focus:outline-none min-w-0"
                        />
                        <div className="w-5 h-5 rounded-full bg-[#1b7a4e] text-white flex items-center justify-center shrink-0 shadow-2xs">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Chỉ sử dụng chữ thường, số và dấu gạch ngang (-).
                      </p>
                    </div>
                  </div>
                </div>

                {/* 2. HIỂN THỊ & PHÂN LOẠI */}
                <div className="pt-2 border-t border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                    Hiển thị & phân loại
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Thiết lập cách hiển thị trải nghiệm trên Stayea.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                    {/* Cột con trái */}
                    <div className="space-y-3">
                      {/* Trạng thái * */}
                      <div>
                        <div className="flex items-center gap-1 mb-1">
                          <label className="text-xs font-semibold text-slate-700">
                            Trạng thái
                          </label>
                          <span className="text-rose-500 font-bold">*</span>
                        </div>
                        <div className="relative">
                          <select
                            value={experienceStatus}
                            onChange={(e) => setExperienceStatus(e.target.value as "Đang hoạt động" | "Tạm dừng" | "Bản nháp")}
                            className="w-full pl-7 pr-8 py-2 text-xs rounded-xl border border-slate-200 bg-white hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium text-slate-800 appearance-none cursor-pointer"
                          >
                            <option value="Đang hoạt động">Đang hoạt động</option>
                            <option value="Tạm dừng">Tạm dừng</option>
                            <option value="Bản nháp">Bản nháp</option>
                          </select>
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-emerald-500 pointer-events-none" />
                          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                      </div>

                      {/* Danh mục hiển thị * */}
                      <div>
                        <div className="flex items-center gap-1 mb-1">
                          <label className="text-xs font-semibold text-slate-700">
                            Danh mục hiển thị
                          </label>
                          <span className="text-rose-500 font-bold">*</span>
                        </div>
                        <div className="relative">
                          <select
                            value={displayCategory}
                            onChange={(e) => setDisplayCategory(e.target.value)}
                            className="w-full px-3 pr-8 py-2 text-xs rounded-xl border border-slate-200 bg-white hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium text-slate-800 appearance-none cursor-pointer"
                          >
                            <option value="Tour biển đảo">Tour biển đảo</option>
                            <option value="Tham quan">Tham quan</option>
                            <option value="Ẩm thực">Ẩm thực</option>
                            <option value="Thể thao biển">Thể thao biển</option>
                            <option value="Văn hóa">Văn hóa</option>
                            <option value="Wellness">Wellness</option>
                            <option value="Khác">Khác</option>
                          </select>
                          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    {/* Cột con phải */}
                    <div className="space-y-3">
                      {/* Hiển thị nổi bật */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Hiển thị nổi bật
                        </label>
                        <div className="flex items-start gap-2.5 pt-0.5">
                          <button
                            type="button"
                            role="switch"
                            aria-checked={isFeatured}
                            onClick={() => setIsFeatured(!isFeatured)}
                            className={`w-9 h-5 rounded-full transition-colors relative shrink-0 cursor-pointer mt-0.5 ${
                              isFeatured ? "bg-[#1b7a4e]" : "bg-slate-300"
                            }`}
                          >
                            <span
                              className={`w-4 h-4 rounded-full bg-white transition-transform block shadow-xs absolute top-0.5 ${
                                isFeatured ? "translate-x-4.5" : "translate-x-0.5"
                              }`}
                            />
                          </button>
                          <div>
                            <span className="text-xs font-medium text-slate-800 block leading-tight">
                              Hiển thị ở trang chủ và danh mục nổi bật
                            </span>
                            <span className="text-[11px] text-slate-400 block mt-0.5">
                              Tăng khả năng tiếp cận và đặt dịch vụ.
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Thẻ hiển thị */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Thẻ hiển thị
                        </label>
                        <div className="flex flex-wrap items-center gap-2.5">
                          {/* Bán chạy */}
                          <label className="flex items-center gap-1.5 cursor-pointer text-xs text-slate-700 select-none">
                            <input
                              type="checkbox"
                              checked={displayBadges.bestSeller}
                              onChange={(e) =>
                                setDisplayBadges((prev) => ({ ...prev, bestSeller: e.target.checked }))
                              }
                              className="sr-only"
                            />
                            <div
                              className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                                displayBadges.bestSeller
                                  ? "bg-[#1b7a4e] border-[#1b7a4e] text-white"
                                  : "border-slate-300 bg-white"
                              }`}
                            >
                              {displayBadges.bestSeller && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                            <span>Bán chạy</span>
                          </label>

                          {/* Mới */}
                          <label className="flex items-center gap-1.5 cursor-pointer text-xs text-slate-700 select-none">
                            <input
                              type="checkbox"
                              checked={displayBadges.newArrival}
                              onChange={(e) =>
                                setDisplayBadges((prev) => ({ ...prev, newArrival: e.target.checked }))
                              }
                              className="sr-only"
                            />
                            <div
                              className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                                displayBadges.newArrival
                                  ? "bg-[#1b7a4e] border-[#1b7a4e] text-white"
                                  : "border-slate-300 bg-white"
                              }`}
                            >
                              {displayBadges.newArrival && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                            <span>Mới</span>
                          </label>

                          {/* Khuyến mãi */}
                          <label className="flex items-center gap-1.5 cursor-pointer text-xs text-slate-700 select-none">
                            <input
                              type="checkbox"
                              checked={displayBadges.discount}
                              onChange={(e) =>
                                setDisplayBadges((prev) => ({ ...prev, discount: e.target.checked }))
                              }
                              className="sr-only"
                            />
                            <div
                              className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                                displayBadges.discount
                                  ? "bg-[#1b7a4e] border-[#1b7a4e] text-white"
                                  : "border-slate-300 bg-white"
                              }`}
                            >
                              {displayBadges.discount && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                            <span>Khuyến mãi</span>
                          </label>

                          {/* Đề xuất */}
                          <label className="flex items-center gap-1.5 cursor-pointer text-xs text-slate-700 select-none">
                            <input
                              type="checkbox"
                              checked={displayBadges.recommended}
                              onChange={(e) =>
                                setDisplayBadges((prev) => ({ ...prev, recommended: e.target.checked }))
                              }
                              className="sr-only"
                            />
                            <div
                              className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                                displayBadges.recommended
                                  ? "bg-[#1b7a4e] border-[#1b7a4e] text-white"
                                  : "border-slate-300 bg-white"
                              }`}
                            >
                              {displayBadges.recommended && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                            <span>Đề xuất</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* CỘT PHẢI (5/12) */}
              <div className="lg:col-span-5 space-y-3.5">
                {/* 1. XEM TRƯỚC HIỂN THỊ */}
                <div className="space-y-2">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight">
                    Xem trước hiển thị
                  </h4>

                  {/* Segmented Control */}
                  <div className="flex items-center p-0.5 rounded-xl border border-slate-200 bg-slate-50/60 max-w-xs">
                    <button
                      type="button"
                      onClick={() => setPreviewTab("google")}
                      className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer text-center ${
                        previewTab === "google"
                          ? "bg-white text-[#1b7a4e] shadow-2xs border border-slate-200/50"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      Trên Google
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewTab("stayea")}
                      className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer text-center ${
                        previewTab === "stayea"
                          ? "bg-white text-[#1b7a4e] shadow-2xs border border-slate-200/50"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      Trên Stayea
                    </button>
                  </div>

                  {/* Preview Container */}
                  {previewTab === "google" ? (
                    <div className="border border-slate-200 rounded-2xl p-3.5 bg-white shadow-2xs">
                      {/* URL Breadcrumb */}
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
                        <div className="w-4 h-4 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[9px] font-bold shrink-0">
                          S
                        </div>
                        <span className="truncate">
                          https://www.stayea.com &gt; trai-nghiem &gt; {metaSlug || "tour-4-dao-phu-quoc"}
                        </span>
                      </div>

                      {/* Google Title */}
                      <h4 className="text-[#1a0dab] font-semibold text-[13px] hover:underline cursor-pointer leading-snug line-clamp-2 mt-1">
                        {metaTitle || "Tour 4 đảo Phú Quốc - Khám phá Nam đảo | Stayea"}
                      </h4>

                      {/* Description + Thumbnail Row */}
                      <div className="flex items-start gap-2.5 mt-1.5">
                        <p className="text-[11px] text-slate-600 leading-relaxed line-clamp-4 flex-1">
                          {metaDescription ||
                            "Khám phá 4 đảo đẹp nhất Phú Quốc: Hòn Thơm, Hòn Móng Tay, Hòn Gầm Ghì, Hòn Mây Rút. Tour trọn gói, hướng dẫn viên chuyên nghiệp, lặn ngắm san hô, BBQ hải sản. Đặt ngay trên Stayea!"}
                        </p>
                        <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 relative bg-slate-100 border border-slate-100">
                          <Image
                            src={galleryImages[0] || "/packages/kham-pha-4-dao.jpg"}
                            alt="Preview thumbnail"
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Preview trên Stayea */
                    <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-2xs">
                      <div className="h-28 relative bg-slate-100">
                        <Image
                          src={galleryImages[0] || "/packages/kham-pha-4-dao.jpg"}
                          alt="Stayea card preview"
                          fill
                          className="object-cover"
                        />
                        <span className="absolute top-2 left-2 bg-[#1b7a4e] text-white text-[10px] font-semibold px-2 py-0.5 rounded-md shadow-xs">
                          {displayCategory}
                        </span>
                      </div>
                      <div className="p-3">
                        <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                          {name || "Tour 4 đảo Phú Quốc - Khám phá Nam đảo"}
                        </h4>
                        <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">
                          {metaDescription}
                        </p>
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-xs">
                          <span className="text-[11px] text-slate-500">Phú Quốc</span>
                          <span className="font-bold text-[#1b7a4e]">{priceAdult} đ</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. CÀI ĐẶT NÂNG CAO */}
                <div className="space-y-2 pt-1">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight">
                    Cài đặt nâng cao
                  </h4>

                  <div className="space-y-2">
                    {/* Cho phép hiển thị trên Google (Index) */}
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 select-none">
                      <input
                        type="checkbox"
                        checked={advancedSettings.allowIndexGoogle}
                        onChange={(e) =>
                          setAdvancedSettings((prev) => ({ ...prev, allowIndexGoogle: e.target.checked }))
                        }
                        className="sr-only"
                      />
                      <div
                        className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors shrink-0 ${
                          advancedSettings.allowIndexGoogle
                            ? "bg-[#1b7a4e] border-[#1b7a4e] text-white"
                            : "border-slate-300 bg-white"
                        }`}
                      >
                        {advancedSettings.allowIndexGoogle && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span>Cho phép hiển thị trên Google (Index)</span>
                    </label>

                    {/* Cho phép chia sẻ lên mạng xã hội (Facebook, Zalo,...) */}
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 select-none">
                      <input
                        type="checkbox"
                        checked={advancedSettings.allowShareSocial}
                        onChange={(e) =>
                          setAdvancedSettings((prev) => ({ ...prev, allowShareSocial: e.target.checked }))
                        }
                        className="sr-only"
                      />
                      <div
                        className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors shrink-0 ${
                          advancedSettings.allowShareSocial
                            ? "bg-[#1b7a4e] border-[#1b7a4e] text-white"
                            : "border-slate-300 bg-white"
                        }`}
                      >
                        {advancedSettings.allowShareSocial && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span>Cho phép chia sẻ lên mạng xã hội (Facebook, Zalo,...)</span>
                    </label>

                    {/* Ẩn khỏi kết quả tìm kiếm nội bộ của Stayea */}
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 select-none">
                      <input
                        type="checkbox"
                        checked={advancedSettings.hideFromInternalSearch}
                        onChange={(e) =>
                          setAdvancedSettings((prev) => ({ ...prev, hideFromInternalSearch: e.target.checked }))
                        }
                        className="sr-only"
                      />
                      <div
                        className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors shrink-0 ${
                          advancedSettings.hideFromInternalSearch
                            ? "bg-[#1b7a4e] border-[#1b7a4e] text-white"
                            : "border-slate-300 bg-white"
                        }`}
                      >
                        {advancedSettings.hideFromInternalSearch && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span>Ẩn khỏi kết quả tìm kiếm nội bộ của Stayea</span>
                    </label>

                    {/* Đặt ngày/tour cụ thể để hiển thị (nếu có) */}
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 select-none">
                      <input
                        type="checkbox"
                        checked={advancedSettings.customDateTourDisplay}
                        onChange={(e) =>
                          setAdvancedSettings((prev) => ({ ...prev, customDateTourDisplay: e.target.checked }))
                        }
                        className="sr-only"
                      />
                      <div
                        className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors shrink-0 ${
                          advancedSettings.customDateTourDisplay
                            ? "bg-[#1b7a4e] border-[#1b7a4e] text-white"
                            : "border-slate-300 bg-white"
                        }`}
                      >
                        {advancedSettings.customDateTourDisplay && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span>Đặt ngày/tour cụ thể để hiển thị (nếu có)</span>
                    </label>
                  </div>
                </div>

                {/* 3. LƯU Ý */}
                <div className="bg-[#f0f8ff] border border-sky-100 rounded-2xl p-3.5 space-y-2">
                  <div className="flex items-center gap-1.5">
                    <div className="w-4 h-4 rounded-full bg-sky-500 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                      i
                    </div>
                    <span className="text-xs font-bold text-sky-900">Lưu ý</span>
                  </div>
                  <ul className="space-y-1 text-[11px] text-slate-700 leading-snug">
                    <li className="flex items-start gap-1.5">
                      <span className="text-sky-500 font-bold">•</span>
                      <span>Tiêu đề và mô tả nên ngắn gọn, hấp dẫn, chứa từ khóa chính.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-sky-500 font-bold">•</span>
                      <span>Hình ảnh và video chất lượng cao giúp tăng tỷ lệ nhấp.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-sky-500 font-bold">•</span>
                      <span>Nội dung sẽ được Google lập chỉ mục sau 1-3 ngày.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

        </form>

        {/* 4. Modal Footer Actions (Fixed Bottom) */}
        <div className="px-5 sm:px-7 py-3.5 border-t border-slate-100 bg-white flex items-center justify-end gap-3 shrink-0">
          {activeTab === "basic" ? (
            <>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("itinerary")}
                className="px-6 py-2.5 rounded-xl bg-[#1b7a4e] hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Tiếp tục</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          ) : activeTab === "itinerary" ? (
            <>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("pricing")}
                className="px-6 py-2.5 rounded-xl bg-[#1b7a4e] hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Tiếp tục</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          ) : activeTab === "pricing" ? (
            <>
              <button
                type="button"
                onClick={() => setActiveTab("itinerary")}
                className="px-6 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
              >
                Quay lại
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("media")}
                className="px-6 py-2.5 rounded-xl bg-[#1b7a4e] hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Tiếp tục</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          ) : activeTab === "media" ? (
            <>
              <button
                type="button"
                onClick={() => setActiveTab("pricing")}
                className="px-6 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
              >
                Quay lại
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("seo")}
                className="px-6 py-2.5 rounded-xl bg-[#1b7a4e] hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Tiếp tục</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setActiveTab("media")}
                className="px-6 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
              >
                Quay lại
              </button>
              <button
                type="submit"
                form="experience-create-form"
                className="px-6 py-2.5 rounded-xl bg-[#1b7a4e] hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-4 h-4 stroke-[2.5]" />
                <span>Tạo trải nghiệm / Tour</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Modal Thêm ngày */}
      <AddDayModal
        isOpen={isAddDayModalOpen}
        onClose={() => setIsAddDayModalOpen(false)}
        onAddDay={handleConfirmAddDay}
        defaultDayNumber={days.length + 1}
        existingDaysCount={days.length}
      />
    </div>
  )
}
