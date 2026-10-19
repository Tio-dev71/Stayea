"use client"

import { useState } from "react"
import Image from "next/image"
import {
  X,
  Plus,
  Target,
  Megaphone,
  ChevronDown,
  ArrowRight,
  Mail,
  Palmtree,
  ImageIcon,
  Send,
  Home,
  Globe,
  MoreHorizontal,
  ThumbsUp,
  Heart,
  MessageCircle,
  Share2,
  UtensilsCrossed,
  Headphones,
  Check,
  Users,
  Search,
  Info,
  Lightbulb,
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  Pencil,
  FileText,
  Rocket,
} from "lucide-react"

export interface CreateCampaignSubmitData {
  title: string
  subtitle: string
  goal: string
  description: string
  channels: string[]
  campaignType: string
  startDate: string
  endDate: string
  budget: number
}

interface CreateCampaignModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (campaignData: {
    title: string
    subtitle: string
    channel: string
    channelType: string
    startDate: string
    endDate: string
    budget: number
  }) => void
  initialStep?: number
}

interface HighlightItem {
  id: string
  text: string
  icon: "palm" | "food" | "snorkel" | "support"
}

const CHANNELS_LIST = [
  { id: "facebook", name: "Facebook", logo: "facebook" },
  { id: "google", name: "Google", logo: "google" },
  { id: "instagram", name: "Instagram", logo: "instagram" },
  { id: "zalo", name: "Zalo", logo: "zalo" },
  { id: "email", name: "Email Marketing", logo: "email" },
  { id: "tiktok", name: "TikTok", logo: "tiktok" },
]

const CAMPAIGN_TYPES = [
  { id: "paid_ads", label: "Quảng cáo trả phí" },
  { id: "social_content", label: "Nội dung mạng xã hội" },
  { id: "email_marketing", label: "Email marketing" },
  { id: "partnership", label: "Chương trình hợp tác" },
  { id: "other", label: "Khác" },
]

const STEPS = [
  { number: 1, label: "Thông tin cơ bản" },
  { number: 2, label: "Nội dung & kênh" },
  { number: 3, label: "Đối tượng & ngân sách" },
  { number: 4, label: "Lịch trình" },
  { number: 5, label: "Xem trước & xuất bản" },
]

const TIPS_LIST = [
  "Đặt tên chiến dịch rõ ràng, dễ nhận biết",
  "Chọn mục tiêu phù hợp với giai đoạn kinh doanh",
  "Kết hợp nhiều kênh để tăng hiệu quả tiếp cận",
  "Xác định ngân sách và thời gian hợp lý",
  "Sử dụng hình ảnh, video hấp dẫn",
  "Theo dõi và tối ưu dựa trên kết quả thực tế",
]

const DEFAULT_HIGHLIGHTS: HighlightItem[] = [
  { id: "1", text: "Tour biển đảo trọn gói", icon: "palm" },
  { id: "2", text: "Ăn trưa hải sản đặc sắc", icon: "food" },
  { id: "3", text: "Lặn ngắm san hô", icon: "snorkel" },
  { id: "4", text: "Hỗ trợ 24/7", icon: "support" },
]

function SnorkelIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="8" cy="9" r="4" />
      <circle cx="16" cy="9" r="4" />
      <path d="M12 9v4" />
      <path d="M21 7v7a4 4 0 0 1-4 4h-2" />
    </svg>
  )
}

function renderHighlightIcon(type: "palm" | "food" | "snorkel" | "support") {
  switch (type) {
    case "palm":
      return <Palmtree className="w-3.5 h-3.5 text-emerald-600" />
    case "food":
      return <UtensilsCrossed className="w-3.5 h-3.5 text-sky-600" />
    case "snorkel":
      return <SnorkelIcon className="w-3.5 h-3.5 text-teal-600" />
    case "support":
      return <Headphones className="w-3.5 h-3.5 text-indigo-600" />
  }
}

function renderChannelLogo(logo: string) {
  switch (logo) {
    case "facebook":
      return (
        <div className="w-8 h-8 rounded-full bg-[#1877f2] flex items-center justify-center text-white font-bold text-sm shadow-xs">
          f
        </div>
      )
    case "google":
      return (
        <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center font-bold text-sm shadow-xs">
          <span className="text-[#4285f4]">G</span>
        </div>
      )
    case "instagram":
      return (
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#f58529] via-[#dd2a7b] to-[#8134af] flex items-center justify-center text-white shadow-xs">
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="currentColor" strokeWidth="2" />
            <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
            <circle cx="17.5" cy="6.5" r="1.5" />
          </svg>
        </div>
      )
    case "zalo":
      return (
        <div className="w-8 h-8 rounded-lg bg-[#0068ff] flex items-center justify-center text-white text-[10px] font-extrabold shadow-xs">
          Zalo
        </div>
      )
    case "email":
      return (
        <div className="w-8 h-8 rounded-lg bg-[#059669] flex items-center justify-center text-white shadow-xs">
          <Mail className="w-4 h-4" />
        </div>
      )
    case "tiktok":
      return (
        <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center text-white text-xs font-bold shadow-xs">
          <span className="text-[#00f2fe]">♪</span>
        </div>
      )
    default:
      return (
        <div className="w-8 h-8 rounded-lg bg-slate-500 flex items-center justify-center text-white font-bold text-xs">
          M
        </div>
      )
  }
}

export function CreateCampaignModal({
  isOpen,
  onClose,
  onSubmit,
  initialStep = 1,
}: CreateCampaignModalProps) {
  const [currentStep, setCurrentStep] = useState(initialStep)

  // Step 1: Basic Info
  const [campaignTitle, setCampaignTitle] = useState("Khám phá Phú Quốc hè 2024")
  const [goal, setGoal] = useState("conversions")
  const [description, setDescription] = useState(
    "Biển xanh, nắng vàng, trải nghiệm tuyệt vời!\nĐặt tour ngay để nhận ưu đãi lên đến 30% cho mùa hè này."
  )
  const [selectedChannels, setSelectedChannels] = useState<string[]>([
    "facebook",
    "google",
    "instagram",
    "zalo",
  ])
  const [campaignType, setCampaignType] = useState("paid_ads")

  // Step 2: Content & Media & Highlights
  const [contentSubTab, setContentSubTab] = useState<"ad_content" | "media" | "cta">("ad_content")
  const [previewPlatform, setPreviewPlatform] = useState<"facebook" | "instagram" | "zalo" | "email">("facebook")
  const [highlights, setHighlights] = useState<HighlightItem[]>(DEFAULT_HIGHLIGHTS)
  const [newHighlightText, setNewHighlightText] = useState("")
  const [showAddHighlightInput, setShowAddHighlightInput] = useState(false)

  // Step 3: Audience & Budget
  const [locationType, setLocationType] = useState<"all" | "domestic" | "regional" | "province">("all")
  const [minAge, setMinAge] = useState(18)
  const [maxAge, setMaxAge] = useState(55)
  const [gender, setGender] = useState<"all" | "male" | "female" | "other">("all")
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    "Du lịch biển",
    "Resort & nghỉ dưỡng",
    "Ẩm thực địa phương",
    "Chụp ảnh/Check-in",
    "Gia đình",
    "Du lịch cuối tuần",
  ])
  const [interestSearch, setInterestSearch] = useState("")
  const [isInterestDropdownOpen, setIsInterestDropdownOpen] = useState(false)
  const [audienceOptions, setAudienceOptions] = useState({
    pastInteractions: true,
    excludeCurrent: false,
    lookalike: true,
    byDevice: false,
  })
  const [budgetType, setBudgetType] = useState<"daily" | "total">("daily")
  const [budgetAmount, setBudgetAmount] = useState("500.000")
  const [biddingStrategy, setBiddingStrategy] = useState("auto")
  const [optimizationGoal, setOptimizationGoal] = useState("reach")

  // Step 4: Schedule
  const [startDate, setStartDate] = useState("01/06/2024")
  const [endDate, setEndDate] = useState("31/08/2024")
  const [startTime, setStartTime] = useState("06:00")
  const [endTime, setEndTime] = useState("23:00")
  const [isRun247, setIsRun247] = useState(true)
  const [selectedDays, setSelectedDays] = useState<string[]>([
    "Thứ 2",
    "Thứ 3",
    "Thứ 4",
    "Thứ 5",
    "Thứ 6",
    "Thứ 7",
    "Chủ nhật",
  ])
  const [timeZone, setTimeZone] = useState("(GMT+7) Hà Nội, TP. Hồ Chí Minh, Đà Nẵng")
  const [previewMonth, setPreviewMonth] = useState("Tháng 6, 2024")
  const [previewChannel, setPreviewChannel] = useState<"facebook" | "instagram" | "zalo" | "email">("facebook")

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    )
  }

  if (!isOpen) return null

  const toggleChannel = (channelId: string) => {
    setSelectedChannels((prev) =>
      prev.includes(channelId)
        ? prev.filter((id) => id !== channelId)
        : [...prev, channelId]
    )
  }

  const removeHighlight = (id: string) => {
    setHighlights((prev) => prev.filter((h) => h.id !== id))
  }

  const handleAddHighlight = () => {
    if (!newHighlightText.trim()) {
      setShowAddHighlightInput(false)
      return
    }
    const newItem: HighlightItem = {
      id: Date.now().toString(),
      text: newHighlightText.trim(),
      icon: "palm",
    }
    setHighlights((prev) => [...prev, newItem])
    setNewHighlightText("")
    setShowAddHighlightInput(false)
  }

  const handleNextStep = () => {
    if (currentStep < 5) {
      setCurrentStep((prev) => prev + 1)
    } else {
      handleFinalSubmit()
    }
  }

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1)
    } else {
      onClose()
    }
  }

  const handleFinalSubmit = () => {
    const primaryChannel =
      selectedChannels.length > 0
        ? CHANNELS_LIST.find((c) => c.id === selectedChannels[0])?.name || "Facebook"
        : "Facebook"

    const selectedTypeObj = CAMPAIGN_TYPES.find((t) => t.id === campaignType)

    onSubmit({
      title: campaignTitle || "Khám phá Phú Quốc hè 2024",
      subtitle: description.slice(0, 40) || "Biển xanh, trải nghiệm thật",
      channel: primaryChannel,
      channelType: selectedTypeObj?.label || "Quảng cáo trả phí",
      startDate,
      endDate,
      budget: Number.parseInt(budgetAmount.replaceAll(/\D/g, ""), 10) || 500_000,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-5xl w-full shadow-2xl border border-slate-200/90 overflow-hidden my-auto flex flex-col max-h-[92vh]">
        {/* ==========================================================================
            1. HEADER
           ========================================================================== */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100 bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#007a48] text-white flex items-center justify-center shadow-xs">
              <Plus className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="font-extrabold text-slate-900 text-base sm:text-lg tracking-tight">
                Tạo chiến dịch marketing mới
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Thiết lập chiến dịch marketing để quảng bá và tăng trưởng cho Stayea.
              </p>
            </div>
          </div>
          <button
            type="button"
            aria-label="Đóng"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ==========================================================================
            2. STEP NAVIGATION BAR (5 STEPS)
           ========================================================================== */}
        <div className="flex items-center justify-between px-6 border-b border-slate-100 bg-slate-50/50 overflow-x-auto shrink-0">
          {STEPS.map((step) => {
            const isActive = currentStep === step.number

            return (
              <button
                key={step.number}
                type="button"
                onClick={() => setCurrentStep(step.number)}
                className={`py-3.5 px-3 flex items-center gap-2 text-xs sm:text-sm transition-all relative shrink-0 cursor-pointer ${
                  isActive
                    ? "text-[#007a48] font-bold"
                    : "text-slate-600 hover:text-slate-900 font-medium"
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    isActive
                      ? "bg-[#007a48] text-white shadow-2xs"
                      : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {step.number}
                </div>
                <span>{step.label}</span>

                {/* Active indicator bar */}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#007a48] rounded-full" />
                )}
              </button>
            )
          })}
        </div>

        {/* ==========================================================================
            3. MODAL BODY (SCROLLABLE)
           ========================================================================== */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* ------------------------------------------------------------------------
              STEP 1: THÔNG TIN CƠ BẢN
             ------------------------------------------------------------------------ */}
          {currentStep === 1 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* LEFT COLUMN: FORM (~65% -> col-span-7) */}
              <div className="lg:col-span-7 space-y-5">
                <h3 className="font-extrabold text-slate-900 text-sm tracking-tight">
                  Thông tin chiến dịch
                </h3>

                {/* 1. Tên chiến dịch */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Tên chiến dịch <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      maxLength={100}
                      value={campaignTitle}
                      onChange={(e) => setCampaignTitle(e.target.value)}
                      placeholder="Nhập tên chiến dịch (ví dụ: Khám phá Phú Quốc hè 2024)"
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200/90 rounded-xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-[#007a48] focus:ring-1 focus:ring-[#007a48] transition-all"
                    />
                    <span className="absolute right-3 bottom-2.5 text-[11px] font-medium text-slate-400">
                      {campaignTitle.length}/100
                    </span>
                  </div>
                </div>

                {/* 2. Mục tiêu chiến dịch */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Mục tiêu chiến dịch <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                      <Target className="w-4 h-4 text-slate-500" />
                    </div>
                    <select
                      value={goal}
                      aria-label="Chọn mục tiêu chiến dịch"
                      onChange={(e) => setGoal(e.target.value)}
                      className="w-full pl-10 pr-8 py-2.5 bg-white border border-slate-200/90 rounded-xl text-xs sm:text-sm text-slate-800 appearance-none focus:outline-hidden focus:border-[#007a48] focus:ring-1 focus:ring-[#007a48] cursor-pointer font-medium"
                    >
                      <option value="">Chọn mục tiêu chiến dịch</option>
                      <option value="brand_awareness">🎯 Tăng nhận diện thương hiệu</option>
                      <option value="conversions">🏨 Thúc đẩy đặt phòng & tour</option>
                      <option value="leads">👥 Thu hút khách hàng tiềm năng mới</option>
                      <option value="retention">🔄 Tái kích hoạt khách hàng thân thiết</option>
                      <option value="traffic">🌐 Tăng lượt truy cập website</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* 3. Mô tả chiến dịch */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Mô tả chiến dịch
                  </label>
                  <div className="relative">
                    <textarea
                      rows={3}
                      maxLength={500}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Viết mô tả ngắn gọn về chiến dịch, thông điệp, lợi ích mang lại..."
                      className="w-full p-3.5 pb-6 bg-white border border-slate-200/90 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-[#007a48] focus:ring-1 focus:ring-[#007a48] transition-all resize-none"
                    />
                    <span className="absolute right-3 bottom-2 text-[11px] font-medium text-slate-400">
                      {description.length}/500
                    </span>
                  </div>
                </div>

                {/* 4. Chọn kênh triển khai */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-0.5">
                    Chọn kênh triển khai <span className="text-red-500">*</span>
                  </label>
                  <p className="text-[11px] text-slate-400 mb-2.5">
                    Chọn một hoặc nhiều kênh để hiển thị chiến dịch.
                  </p>

                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
                    {CHANNELS_LIST.map((item) => {
                      const isSelected = selectedChannels.includes(item.id)
                      return (
                        <div
                          key={item.id}
                          onClick={() => toggleChannel(item.id)}
                          className={`relative rounded-xl border p-2.5 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                            isSelected
                              ? "border-[#007a48] bg-[#f0faf4] ring-1 ring-[#007a48]/30 shadow-2xs"
                              : "border-slate-200/90 bg-white hover:border-slate-300 hover:bg-slate-50/60"
                          }`}
                        >
                          {/* Checkbox top-left */}
                          <div className="absolute top-2 left-2">
                            <div
                              className={`w-3.5 h-3.5 rounded flex items-center justify-center transition-colors ${
                                isSelected
                                  ? "bg-[#007a48] text-white"
                                  : "border border-slate-300 bg-white"
                              }`}
                            >
                              {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                            </div>
                          </div>

                          <div className="my-1">{renderChannelLogo(item.logo)}</div>
                          <span className="text-[11px] font-semibold text-slate-800 mt-1 truncate max-w-full">
                            {item.name}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* 5. Loại chiến dịch */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-2">
                    Loại chiến dịch <span className="text-red-500">*</span>
                  </label>

                  <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-700">
                    {CAMPAIGN_TYPES.map((type) => (
                      <label
                        key={type.id}
                        className="inline-flex items-center gap-2 cursor-pointer hover:text-slate-900"
                      >
                        <input
                          type="radio"
                          name="campaignType"
                          value={type.id}
                          checked={campaignType === type.id}
                          onChange={(e) => setCampaignType(e.target.value)}
                          className="text-[#007a48] focus:ring-[#007a48] w-4 h-4 cursor-pointer"
                        />
                        <span>{type.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: TIPS & VALUE CARD (~35% -> col-span-5) */}
              <div className="lg:col-span-5 space-y-4">
                {/* 1. Mẹo tạo chiến dịch hiệu quả */}
                <div className="bg-[#f0faf4] border border-emerald-100/90 rounded-2xl p-4 sm:p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 rounded-lg bg-[#e6f7f0] text-[#007a48] flex items-center justify-center shrink-0">
                      <Megaphone className="w-4 h-4" />
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-[#007a48]">
                      Mẹo tạo chiến dịch hiệu quả
                    </h4>
                  </div>

                  <ul className="space-y-2 text-xs text-slate-700">
                    {TIPS_LIST.map((tip) => (
                      <li key={tip} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-[#007a48] shrink-0 mt-0.5 stroke-[2.5]" />
                        <span className="leading-relaxed">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 2. Value Card & Phú Quốc Stamp */}
                <div className="bg-gradient-to-b from-[#f0f7ff] to-white border border-sky-100 rounded-2xl p-5 text-center flex flex-col items-center justify-between min-h-[220px]">
                  {/* Browser Mockup Illustration */}
                  <div className="w-full max-w-[200px] bg-white border border-slate-200/90 rounded-xl shadow-xs overflow-hidden mx-auto">
                    <div className="flex items-center gap-1 px-2.5 py-1.5 border-b border-slate-100 bg-slate-50/80">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    </div>
                    <div className="p-3 flex items-center justify-center">
                      <div className="w-full h-16 rounded-lg bg-sky-50 flex items-center justify-center text-sky-400 border border-dashed border-sky-200">
                        <ImageIcon className="w-6 h-6" />
                      </div>
                    </div>
                  </div>

                  <p className="text-xs font-semibold text-slate-700 leading-relaxed mt-4 max-w-[240px]">
                    Tăng khả năng tiếp cận, thu hút khách hàng và lan toả trải nghiệm cùng Stayea.
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100/80 w-full flex items-center justify-center">
                    <div className="flex items-center gap-1 text-slate-600 font-serif italic text-xs">
                      <span className="font-bold text-slate-800 not-italic">Phú Quốc</span>
                      <Palmtree className="w-3.5 h-3.5 text-emerald-600 shrink-0 not-italic" />
                      <span className="text-[10px] text-slate-400 ml-1">Always a good idea</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------------------
              STEP 2: NỘI DUNG & KÊNH (MATCHING ATTACHED SCREENSHOT EXACTLY)
             ------------------------------------------------------------------------ */}
          {currentStep === 2 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* LEFT COLUMN: NỘI DUNG CHIẾN DỊCH (~54% -> col-span-7) */}
              <div className="lg:col-span-7 space-y-4">
                <h3 className="font-extrabold text-slate-900 text-sm tracking-tight">
                  Nội dung chiến dịch
                </h3>

                {/* Sub-tabs: Nội dung quảng cáo | Hình ảnh / Video | Liên kết & CTA */}
                <div className="grid grid-cols-3 bg-slate-100/80 p-1 rounded-xl border border-slate-200/60 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setContentSubTab("ad_content")}
                    className={`py-2 px-1 text-center rounded-lg transition-all cursor-pointer ${
                      contentSubTab === "ad_content"
                        ? "bg-[#edf8f2] text-[#007a48] font-bold shadow-2xs"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    Nội dung quảng cáo
                  </button>
                  <button
                    type="button"
                    onClick={() => setContentSubTab("media")}
                    className={`py-2 px-1 text-center rounded-lg transition-all cursor-pointer ${
                      contentSubTab === "media"
                        ? "bg-[#edf8f2] text-[#007a48] font-bold shadow-2xs"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    Hình ảnh / Video
                  </button>
                  <button
                    type="button"
                    onClick={() => setContentSubTab("cta")}
                    className={`py-2 px-1 text-center rounded-lg transition-all cursor-pointer ${
                      contentSubTab === "cta"
                        ? "bg-[#edf8f2] text-[#007a48] font-bold shadow-2xs"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    Liên kết & CTA
                  </button>
                </div>

                {/* Subtab 1: Nội dung quảng cáo */}
                {contentSubTab === "ad_content" && (
                  <div className="space-y-4 pt-1">
                    {/* Tiêu đề * */}
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1.5">
                        Tiêu đề <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          maxLength={100}
                          value={campaignTitle}
                          onChange={(e) => setCampaignTitle(e.target.value)}
                          placeholder="Khám phá Phú Quốc hè 2024"
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-200/90 rounded-xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-[#007a48] focus:ring-1 focus:ring-[#007a48] transition-all font-medium"
                        />
                        <span className="absolute right-3 bottom-2.5 text-[11px] font-medium text-slate-400">
                          {campaignTitle.length}/100
                        </span>
                      </div>
                    </div>

                    {/* Nội dung mô tả * */}
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1.5">
                        Nội dung mô tả <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <textarea
                          rows={3}
                          maxLength={500}
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder={"Biển xanh, nắng vàng, trải nghiệm tuyệt vời!\nĐặt tour ngay để nhận ưu đãi lên đến 30% cho mùa hè này."}
                          className="w-full p-3.5 pb-6 bg-white border border-slate-200/90 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-[#007a48] focus:ring-1 focus:ring-[#007a48] transition-all resize-none leading-relaxed font-medium"
                        />
                        <span className="absolute right-3 bottom-2 text-[11px] font-medium text-slate-400">
                          {description.length}/500
                        </span>
                      </div>
                    </div>

                    {/* Điểm nổi bật (tùy chọn) */}
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1.5">
                        Điểm nổi bật (tùy chọn)
                      </label>
                      <div className="border border-slate-200/90 rounded-xl divide-y divide-slate-100 bg-white overflow-hidden">
                        {highlights.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between px-3.5 py-2.5 hover:bg-slate-50/50 transition-colors"
                          >
                            <div className="flex items-center gap-2.5">
                              {renderHighlightIcon(item.icon)}
                              <span className="text-xs text-slate-800 font-medium">
                                {item.text}
                              </span>
                            </div>
                            <button
                              type="button"
                              aria-label={`Xóa điểm ${item.text}`}
                              onClick={() => removeHighlight(item.id)}
                              className="text-slate-400 hover:text-slate-700 transition-colors p-1 rounded-md hover:bg-slate-100 cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>

                      {showAddHighlightInput ? (
                        <div className="mt-2 flex items-center gap-2">
                          <input
                            type="text"
                            value={newHighlightText}
                            onChange={(e) => setNewHighlightText(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleAddHighlight()
                            }}
                            placeholder="Nhập điểm nổi bật mới..."
                            className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:border-[#007a48]"
                          />
                          <button
                            type="button"
                            onClick={handleAddHighlight}
                            className="px-3 py-1.5 bg-[#007a48] text-white text-xs font-semibold rounded-lg hover:bg-[#00633b] cursor-pointer"
                          >
                            Lưu
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowAddHighlightInput(false)}
                            className="px-2 py-1.5 text-slate-400 hover:text-slate-600 text-xs"
                          >
                            Hủy
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setShowAddHighlightInput(true)}
                          className="w-full mt-2 py-2 px-3 bg-[#f0faf4] hover:bg-[#e4f7ec] text-[#007a48] text-xs font-semibold rounded-xl border border-emerald-200/50 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                          <span>Thêm điểm nổi bật</span>
                        </button>
                      )}
                    </div>

                    {/* Chọn kênh triển khai * */}
                    <div className="pt-1">
                      <label className="block text-xs font-bold text-slate-800 mb-0.5">
                        Chọn kênh triển khai <span className="text-red-500">*</span>
                      </label>
                      <p className="text-[11px] text-slate-400 mb-2.5">
                        Chọn một hoặc nhiều kênh để đăng chiến dịch.
                      </p>

                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
                        {CHANNELS_LIST.map((item) => {
                          const isSelected = selectedChannels.includes(item.id)
                          return (
                            <div
                              key={item.id}
                              onClick={() => toggleChannel(item.id)}
                              className={`relative rounded-xl border p-2.5 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                                isSelected
                                  ? "border-[#007a48] bg-[#f0faf4] ring-1 ring-[#007a48]/30 shadow-2xs"
                                  : "border-slate-200/90 bg-white hover:border-slate-300 hover:bg-slate-50/60"
                              }`}
                            >
                              {/* Checkbox top-left */}
                              <div className="absolute top-2 left-2">
                                <div
                                  className={`w-3.5 h-3.5 rounded flex items-center justify-center transition-colors ${
                                    isSelected
                                      ? "bg-[#007a48] text-white"
                                      : "border border-slate-300 bg-white"
                                  }`}
                                >
                                  {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                                </div>
                              </div>

                              <div className="my-1">{renderChannelLogo(item.logo)}</div>
                              <span className="text-[11px] font-semibold text-slate-800 mt-1 truncate max-w-full">
                                {item.name}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* Subtab 2: Hình ảnh / Video */}
                {contentSubTab === "media" && (
                  <div className="space-y-4 pt-1 text-xs">
                    <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center bg-slate-50/50">
                      <ImageIcon className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                      <p className="font-semibold text-slate-800">Ảnh banner Phú Quốc đang dùng</p>
                      <p className="text-slate-500 text-[11px] mt-1">
                        Kích thước khuyên dùng: 1200 x 628 px (Tỷ lệ 16:9). Định dạng JPG/PNG.
                      </p>
                    </div>
                  </div>
                )}

                {/* Subtab 3: Liên kết & CTA */}
                {contentSubTab === "cta" && (
                  <div className="space-y-4 pt-1 text-xs">
                    <div>
                      <label className="block font-bold text-slate-800 mb-1">Nút kêu gọi hành động (CTA)</label>
                      <select
                        aria-label="Chọn nút kêu gọi hành động"
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium"
                      >
                        <option value="Đặt ngay">Đặt ngay (Khuyên dùng cho tour)</option>
                        <option value="Khám phá ngay">Khám phá ngay</option>
                        <option value="Nhận ưu đãi">Nhận ưu đãi 30%</option>
                        <option value="Xem chi tiết">Xem chi tiết</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-slate-800 mb-1">Đường dẫn đích (Landing Page)</label>
                      <input
                        type="text"
                        defaultValue="https://stayea.com/packages/kham-pha-4-dao"
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* RIGHT COLUMN: XEM TRƯỚC NỘI DUNG (~46% -> col-span-5) */}
              <div className="lg:col-span-5 space-y-3">
                <h3 className="font-extrabold text-slate-900 text-sm tracking-tight">
                  Xem trước nội dung
                </h3>

                {/* Platform tabs: Facebook | Instagram | Zalo | Email */}
                <div className="flex items-center gap-6 border-b border-slate-200/80 text-xs font-semibold px-1">
                  <button
                    type="button"
                    onClick={() => setPreviewPlatform("facebook")}
                    className={`pb-2.5 relative cursor-pointer transition-colors ${
                      previewPlatform === "facebook"
                        ? "text-[#007a48] font-bold"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    Facebook
                    {previewPlatform === "facebook" && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#007a48] rounded-full" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setPreviewPlatform("instagram")}
                    className={`pb-2.5 relative cursor-pointer transition-colors ${
                      previewPlatform === "instagram"
                        ? "text-[#007a48] font-bold"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    Instagram
                    {previewPlatform === "instagram" && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#007a48] rounded-full" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setPreviewPlatform("zalo")}
                    className={`pb-2.5 relative cursor-pointer transition-colors ${
                      previewPlatform === "zalo"
                        ? "text-[#007a48] font-bold"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    Zalo
                    {previewPlatform === "zalo" && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#007a48] rounded-full" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setPreviewPlatform("email")}
                    className={`pb-2.5 relative cursor-pointer transition-colors ${
                      previewPlatform === "email"
                        ? "text-[#007a48] font-bold"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    Email
                    {previewPlatform === "email" && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#007a48] rounded-full" />
                    )}
                  </button>
                </div>

                {/* Facebook Mockup Card */}
                {previewPlatform === "facebook" && (
                  <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden">
                    {/* Post Header */}
                    <div className="flex items-center justify-between p-3.5 pb-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#007a48] text-white flex items-center justify-center shrink-0 shadow-2xs">
                          <Home className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-xs text-slate-900 leading-tight">
                            Stayea.com
                          </div>
                          <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <span>Được tài trợ</span>
                            <span>•</span>
                            <Globe className="w-2.5 h-2.5 text-slate-400" />
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        aria-label="Tùy chọn bài viết"
                        className="text-slate-400 hover:text-slate-600 p-1"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Post Text */}
                    <div className="px-3.5 pb-2.5">
                      <h4 className="font-bold text-xs text-slate-900 mb-1 leading-snug">
                        {campaignTitle || "Khám phá Phú Quốc hè 2024"}
                      </h4>
                      <p className="text-[11px] text-slate-700 leading-relaxed whitespace-pre-line">
                        {description ||
                          "Biển xanh, nắng vàng, trải nghiệm tuyệt vời!\nĐặt tour ngay để nhận ưu đãi lên đến 30% cho mùa hè này."}
                      </p>
                    </div>

                    {/* Media Banner Image with Overlay */}
                    <div className="relative w-full aspect-[16/9] overflow-hidden bg-slate-800">
                      <Image
                        src="/packages/kham-pha-4-dao.jpg"
                        alt="Khám phá Phú Quốc hè 2024"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />

                      {/* Artistic calligraphy overlay */}
                      <div className="absolute bottom-3 left-4 text-white drop-shadow-md">
                        <div className="font-serif italic font-extrabold text-2xl sm:text-3xl tracking-wide leading-tight drop-shadow-lg">
                          Phú Quốc
                        </div>
                        <div className="font-sans font-semibold text-xs tracking-widest text-white/95 uppercase drop-shadow-md -mt-0.5">
                          Hè 2024
                        </div>
                      </div>

                      {/* Discount Badge on bottom right */}
                      <div className="absolute bottom-3 right-4 bg-[#e11d48] text-white px-2.5 py-1.5 rounded-xl shadow-lg text-center flex flex-col items-center justify-center leading-none border border-white/20">
                        <span className="text-[8px] font-bold tracking-tight uppercase text-rose-100">
                          GIẢM ĐẾN
                        </span>
                        <span className="text-base sm:text-lg font-black mt-0.5">
                          30%
                        </span>
                      </div>
                    </div>

                    {/* Highlights summary + CTA button */}
                    <div className="p-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-3">
                      <div className="space-y-1">
                        {highlights.map((h) => (
                          <div
                            key={h.id}
                            className="flex items-center gap-1.5 text-[10px] text-slate-700 font-medium"
                          >
                            {renderHighlightIcon(h.icon)}
                            <span>{h.text}</span>
                          </div>
                        ))}
                      </div>

                      <button
                        type="button"
                        className="bg-slate-100 text-slate-800 border border-slate-200/90 hover:bg-slate-200 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors shrink-0 shadow-2xs cursor-pointer"
                      >
                        Đặt ngay
                      </button>
                    </div>

                    {/* Reactions Bar */}
                    <div className="px-3.5 py-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <div className="flex items-center -space-x-1">
                          <div className="w-4 h-4 rounded-full bg-[#1877f2] flex items-center justify-center text-white text-[9px] shadow-2xs">
                            <ThumbsUp className="w-2.5 h-2.5 fill-white" />
                          </div>
                          <div className="w-4 h-4 rounded-full bg-[#fa3e3e] flex items-center justify-center text-white text-[9px] shadow-2xs">
                            <Heart className="w-2.5 h-2.5 fill-white text-[#fa3e3e]" />
                          </div>
                        </div>
                        <span className="font-medium text-slate-600">1,2K</span>
                      </div>

                      <div className="text-[10px] text-slate-500">
                        152 bình luận  48 lượt chia sẻ
                      </div>
                    </div>

                    {/* Action Buttons: Thích | Bình luận | Chia sẻ */}
                    <div className="px-2 py-1.5 border-t border-slate-100 grid grid-cols-3 gap-1 text-[11px] font-medium text-slate-600">
                      <button
                        type="button"
                        className="flex items-center justify-center gap-1.5 py-1 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>Thích</span>
                      </button>
                      <button
                        type="button"
                        className="flex items-center justify-center gap-1.5 py-1 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Bình luận</span>
                      </button>
                      <button
                        type="button"
                        className="flex items-center justify-center gap-1.5 py-1 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>Chia sẻ</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Instagram Preview */}
                {previewPlatform === "instagram" && (
                  <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden text-xs">
                    <div className="flex items-center justify-between p-3 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-400 to-fuchsia-600 p-0.5">
                          <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-[10px] font-bold text-[#007a48]">
                            S
                          </div>
                        </div>
                        <span className="font-bold text-slate-900">stayea.phuquoc</span>
                      </div>
                      <MoreHorizontal className="w-4 h-4 text-slate-400" />
                    </div>

                    <div className="relative aspect-square bg-slate-900 overflow-hidden">
                      <Image
                        src="/packages/kham-pha-4-dao.jpg"
                        alt="Instagram preview"
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="p-3 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Heart className="w-4 h-4 text-slate-800" />
                          <MessageCircle className="w-4 h-4 text-slate-800" />
                          <Send className="w-4 h-4 text-slate-800" />
                        </div>
                      </div>
                      <div className="font-bold text-slate-900">1.240 lượt thích</div>
                      <p className="text-[11px] text-slate-700">
                        <span className="font-bold text-slate-900 mr-1.5">stayea.phuquoc</span>
                        {campaignTitle} - {description.slice(0, 80)}...
                      </p>
                    </div>
                  </div>
                )}

                {/* Zalo Preview */}
                {previewPlatform === "zalo" && (
                  <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-[#0068ff] text-white flex items-center justify-center font-bold text-xs">
                        Zalo
                      </div>
                      <div>
                        <div className="font-bold text-xs text-slate-900">Stayea Phú Quốc OA</div>
                        <div className="text-[10px] text-slate-400">Tài khoản doanh nghiệp xác thực</div>
                      </div>
                    </div>
                    <div className="rounded-xl border border-slate-200 overflow-hidden">
                      <div className="relative w-full h-28">
                        <Image src="/packages/kham-pha-4-dao.jpg" alt="Zalo" fill className="object-cover" />
                      </div>
                      <div className="p-3">
                        <h4 className="font-bold text-xs text-slate-900">{campaignTitle}</h4>
                        <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">{description}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Email Preview */}
                {previewPlatform === "email" && (
                  <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden p-4 space-y-3 text-xs">
                    <div className="border-b border-slate-100 pb-2 text-slate-500">
                      <div><strong className="text-slate-700">Từ:</strong> Stayea &lt;deals@stayea.com&gt;</div>
                      <div><strong className="text-slate-700">Tiêu đề:</strong> {campaignTitle}</div>
                    </div>
                    <div className="space-y-2">
                      <div className="relative w-full h-32 rounded-xl overflow-hidden">
                        <Image src="/packages/kham-pha-4-dao.jpg" alt="Email hero" fill className="object-cover" />
                      </div>
                      <p className="text-[11px] text-slate-700 leading-relaxed">{description}</p>
                      <button type="button" className="w-full py-2 bg-[#007a48] text-white font-bold rounded-lg text-xs">
                        Đặt tour ngay - Giảm 30%
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------------------
              STEP 3: ĐỐI TƯỢNG & NGÂN SÁCH (MATCHING ATTACHED SCREENSHOT EXACTLY)
             ------------------------------------------------------------------------ */}
          {currentStep === 3 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* LEFT COLUMN: ĐỐI TƯỢNG MỤC TIÊU (~55% -> col-span-7) */}
              <div className="lg:col-span-7 space-y-4.5">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm tracking-tight">
                    Đối tượng mục tiêu
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Chọn đối tượng phù hợp để tiếp cận đúng khách hàng tiềm năng.
                  </p>
                </div>

                {/* 1. Vị trí */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Vị trí
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {/* Card 1: Tất cả */}
                    <div
                      onClick={() => setLocationType("all")}
                      className={`p-2.5 sm:p-3 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                        locationType === "all"
                          ? "border-[#007a48] bg-[#f0faf4] ring-1 ring-[#007a48]/20 shadow-2xs"
                          : "border-slate-200/90 bg-white hover:border-slate-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="locationType"
                        checked={locationType === "all"}
                        onChange={() => setLocationType("all")}
                        className="text-[#007a48] focus:ring-[#007a48] w-4 h-4 cursor-pointer shrink-0"
                      />
                      <span className="text-xs font-bold text-slate-800">Tất cả</span>
                    </div>

                    {/* Card 2: Trong nước */}
                    <div
                      onClick={() => setLocationType("domestic")}
                      className={`p-2.5 sm:p-3 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                        locationType === "domestic"
                          ? "border-[#007a48] bg-[#f0faf4] ring-1 ring-[#007a48]/20 shadow-2xs"
                          : "border-slate-200/90 bg-white hover:border-slate-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="locationType"
                        checked={locationType === "domestic"}
                        onChange={() => setLocationType("domestic")}
                        className="text-[#007a48] focus:ring-[#007a48] w-4 h-4 cursor-pointer shrink-0"
                      />
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-slate-800 block truncate">Trong nước</span>
                        <span className="text-[10px] text-slate-400 block truncate">Việt Nam</span>
                      </div>
                    </div>

                    {/* Card 3: Theo khu vực */}
                    <div
                      onClick={() => setLocationType("regional")}
                      className={`p-2.5 sm:p-3 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                        locationType === "regional"
                          ? "border-[#007a48] bg-[#f0faf4] ring-1 ring-[#007a48]/20 shadow-2xs"
                          : "border-slate-200/90 bg-white hover:border-slate-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="locationType"
                        checked={locationType === "regional"}
                        onChange={() => setLocationType("regional")}
                        className="text-[#007a48] focus:ring-[#007a48] w-4 h-4 cursor-pointer shrink-0"
                      />
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-slate-800 block truncate">Theo khu vực</span>
                        <span className="text-[10px] text-slate-400 block truncate">Hà Nội, Đà Nẵng...</span>
                      </div>
                    </div>

                    {/* Card 4: Theo tỉnh/thành */}
                    <div
                      onClick={() => setLocationType("province")}
                      className={`p-2.5 sm:p-3 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                        locationType === "province"
                          ? "border-[#007a48] bg-[#f0faf4] ring-1 ring-[#007a48]/20 shadow-2xs"
                          : "border-slate-200/90 bg-white hover:border-slate-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="locationType"
                        checked={locationType === "province"}
                        onChange={() => setLocationType("province")}
                        className="text-[#007a48] focus:ring-[#007a48] w-4 h-4 cursor-pointer shrink-0"
                      />
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-slate-800 block truncate">Theo tỉnh/thành</span>
                        <span className="text-[10px] text-slate-400 block truncate">Chọn tỉnh/thành</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Khoảng tuổi */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-2">
                    Khoảng tuổi
                  </label>
                  <div className="relative pt-1 pb-1">
                    <div className="h-1.5 bg-slate-200 rounded-full relative">
                      <div
                        className="absolute top-0 bottom-0 bg-[#007a48] rounded-full"
                        style={{ left: "0%", right: `${Math.max(0, 100 - ((maxAge - 18) / (65 - 18)) * 100)}%` }}
                      />
                      <div
                        className="w-4 h-4 rounded-full bg-[#007a48] shadow-md border-2 border-white absolute top-1/2 -translate-y-1/2 transition-all pointer-events-none"
                        style={{ left: `${Math.min(96, Math.max(0, ((maxAge - 18) / (65 - 18)) * 100))}%` }}
                      />
                    </div>
                    <input
                      type="range"
                      min={18}
                      max={65}
                      value={maxAge}
                      onChange={(e) => {
                        const val = Number(e.target.value)
                        setMaxAge(val)
                        if (val < minAge) setMinAge(val)
                      }}
                      aria-label="Chọn khoảng tuổi"
                      className="absolute inset-0 w-full opacity-0 cursor-pointer h-5 -top-1"
                    />
                    <div className="flex items-center justify-between text-xs text-slate-600 font-semibold mt-2">
                      <button
                        type="button"
                        onClick={() => setMinAge(18)}
                        className="hover:text-[#007a48] cursor-pointer"
                      >
                        {minAge}
                      </button>
                      <button
                        type="button"
                        onClick={() => setMaxAge(55)}
                        className="hover:text-[#007a48] cursor-pointer"
                      >
                        {maxAge}+
                      </button>
                    </div>
                  </div>
                </div>

                {/* 3. Giới tính */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-2">
                    Giới tính
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: "all", label: "Tất cả" },
                      { id: "male", label: "Nam" },
                      { id: "female", label: "Nữ" },
                      { id: "other", label: "Khác" },
                    ].map((g) => (
                      <div
                        key={g.id}
                        onClick={() => setGender(g.id as "all" | "male" | "female" | "other")}
                        className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                          gender === g.id
                            ? "border-[#007a48] bg-[#f0faf4] ring-1 ring-[#007a48]/20 shadow-2xs"
                            : "border-slate-200/90 bg-white hover:border-slate-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="gender"
                          checked={gender === g.id}
                          onChange={() => setGender(g.id as "all" | "male" | "female" | "other")}
                          className="text-[#007a48] focus:ring-[#007a48] w-4 h-4 cursor-pointer shrink-0"
                        />
                        <span className="text-xs font-bold text-slate-800">{g.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. Sở thích & hành vi */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Sở thích & hành vi
                  </label>
                  <div className="relative">
                    <div className="relative flex items-center">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                      <input
                        type="text"
                        value={interestSearch}
                        onChange={(e) => {
                          setInterestSearch(e.target.value)
                          setIsInterestDropdownOpen(true)
                        }}
                        onFocus={() => setIsInterestDropdownOpen(true)}
                        placeholder="Tìm hoặc chọn sở thích"
                        className="w-full pl-9 pr-9 py-2.5 bg-white border border-slate-200/90 rounded-xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-[#007a48] focus:ring-1 focus:ring-[#007a48] transition-all font-medium"
                      />
                      <button
                        type="button"
                        aria-label="Mở danh sách sở thích"
                        onClick={() => setIsInterestDropdownOpen(!isInterestDropdownOpen)}
                        className="absolute right-3 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Dropdown list if open */}
                    {isInterestDropdownOpen && (
                      <div className="absolute z-20 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-48 overflow-y-auto p-1 text-xs">
                        {[
                          "Du lịch biển",
                          "Resort & nghỉ dưỡng",
                          "Ẩm thực địa phương",
                          "Chụp ảnh/Check-in",
                          "Gia đình",
                          "Du lịch cuối tuần",
                          "Tour lặn biển",
                          "Du lịch trải nghiệm",
                          "Khách sạn 5 sao",
                          "Trăng mật & Cặp đôi",
                        ]
                          .filter((i) => i.toLowerCase().includes(interestSearch.toLowerCase()))
                          .map((item) => {
                            const isSelected = selectedInterests.includes(item)
                            return (
                              <div
                                key={item}
                                onClick={() => {
                                  if (isSelected) {
                                    setSelectedInterests(selectedInterests.filter((x) => x !== item))
                                  } else {
                                    setSelectedInterests([...selectedInterests, item])
                                  }
                                }}
                                className="px-3 py-2 rounded-lg hover:bg-slate-50 flex items-center justify-between cursor-pointer"
                              >
                                <span className="font-medium text-slate-800">{item}</span>
                                {isSelected && <Check className="w-3.5 h-3.5 text-[#007a48] stroke-[3]" />}
                              </div>
                            )
                          })}
                      </div>
                    )}
                  </div>

                  {/* Selected Tags list */}
                  <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                    {selectedInterests.map((interest) => (
                      <span
                        key={interest}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#edf8f2] border border-emerald-200/60 text-[#007a48] text-xs font-semibold"
                      >
                        <span>{interest}</span>
                        <button
                          type="button"
                          aria-label={`Xóa ${interest}`}
                          onClick={() => setSelectedInterests(selectedInterests.filter((x) => x !== interest))}
                          className="hover:text-emerald-950 transition-colors cursor-pointer"
                        >
                          <X className="w-3 h-3 stroke-[2.5]" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* 5. Đối tượng nâng cao (tùy chọn) ⓘ */}
                <div className="pt-1">
                  <div className="flex items-center gap-1.5 mb-2.5">
                    <label className="text-xs font-bold text-slate-800">
                      Đối tượng nâng cao (tùy chọn)
                    </label>
                    <Info className="w-3.5 h-3.5 text-slate-400" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Option 1: Khách hàng đã từng tương tác với Stayea */}
                    <div
                      onClick={() =>
                        setAudienceOptions((prev) => ({ ...prev, pastInteractions: !prev.pastInteractions }))
                      }
                      className="flex items-start gap-2.5 cursor-pointer text-xs select-none"
                    >
                      <div
                        className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center transition-colors shrink-0 ${
                          audienceOptions.pastInteractions
                            ? "bg-[#007a48] text-white"
                            : "border border-slate-300 bg-white"
                        }`}
                      >
                        {audienceOptions.pastInteractions && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span className="text-slate-800 font-medium">
                        Khách hàng đã từng tương tác với Stayea
                      </span>
                    </div>

                    {/* Option 2: Loại trừ khách hàng hiện tại */}
                    <div
                      onClick={() =>
                        setAudienceOptions((prev) => ({ ...prev, excludeCurrent: !prev.excludeCurrent }))
                      }
                      className="flex items-start gap-2.5 cursor-pointer text-xs select-none"
                    >
                      <div
                        className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center transition-colors shrink-0 ${
                          audienceOptions.excludeCurrent
                            ? "bg-[#007a48] text-white"
                            : "border border-slate-300 bg-white"
                        }`}
                      >
                        {audienceOptions.excludeCurrent && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span className="text-slate-800 font-medium">
                        Loại trừ khách hàng hiện tại
                      </span>
                    </div>

                    {/* Option 3: Khách hàng tương tự (Lookalike) */}
                    <div
                      onClick={() =>
                        setAudienceOptions((prev) => ({ ...prev, lookalike: !prev.lookalike }))
                      }
                      className="flex items-start gap-2.5 cursor-pointer text-xs select-none"
                    >
                      <div
                        className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center transition-colors shrink-0 ${
                          audienceOptions.lookalike
                            ? "bg-[#007a48] text-white"
                            : "border border-slate-300 bg-white"
                        }`}
                      >
                        {audienceOptions.lookalike && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span className="text-slate-800 font-medium">
                        Khách hàng tương tự (Lookalike)
                      </span>
                    </div>

                    {/* Option 4: Theo thiết bị */}
                    <div
                      onClick={() =>
                        setAudienceOptions((prev) => ({ ...prev, byDevice: !prev.byDevice }))
                      }
                      className="flex items-start gap-2.5 cursor-pointer text-xs select-none"
                    >
                      <div
                        className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center transition-colors shrink-0 ${
                          audienceOptions.byDevice
                            ? "bg-[#007a48] text-white"
                            : "border border-slate-300 bg-white"
                        }`}
                      >
                        {audienceOptions.byDevice && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <div>
                        <span className="text-slate-800 font-medium block">Theo thiết bị</span>
                        <span className="text-[11px] text-slate-400 block">(Điện thoại, máy tính...)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: QUY MÔ, NGÂN SÁCH & MẸO (~45% -> col-span-5) */}
              <div className="lg:col-span-5 space-y-4">
                {/* 1. Quy mô đối tượng ước tính */}
                <div>
                  <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm mb-2 tracking-tight">
                    Quy mô đối tượng ước tính
                  </h4>
                  <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#007a48] flex items-center justify-center shrink-0">
                        <Users className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                          ~ 1.2 triệu người
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">Tại Việt Nam</div>
                      </div>
                    </div>

                    {/* Gauge bar with Phù hợp */}
                    <div>
                      <div className="flex items-center justify-end mb-1">
                        <span className="text-[11px] font-semibold text-[#007a48]">Phù hợp</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex">
                        <div className="w-1/4 bg-slate-200" />
                        <div className="w-1/2 bg-[#007a48] rounded-full" />
                        <div className="w-1/4 bg-slate-200" />
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Quy mô có thể thay đổi tùy theo kênh hiển thị và bộ lọc.
                    </p>
                  </div>
                </div>

                {/* 2. Ngân sách & đặt giá */}
                <div>
                  <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm mb-2 tracking-tight">
                    Ngân sách & đặt giá
                  </h4>
                  <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-3.5">
                    {/* Radio Hàng ngày vs Tổng ngân sách */}
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1.5">
                        Ngân sách <span className="text-red-500">*</span>
                      </label>
                      <div className="flex items-center gap-5 text-xs font-medium text-slate-700 mb-2">
                        <label className="inline-flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="radio"
                            name="budgetType"
                            value="daily"
                            checked={budgetType === "daily"}
                            onChange={() => setBudgetType("daily")}
                            className="text-[#007a48] focus:ring-[#007a48] w-4 h-4 cursor-pointer"
                          />
                          <span>Hàng ngày</span>
                        </label>
                        <label className="inline-flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="radio"
                            name="budgetType"
                            value="total"
                            checked={budgetType === "total"}
                            onChange={() => setBudgetType("total")}
                            className="text-[#007a48] focus:ring-[#007a48] w-4 h-4 cursor-pointer"
                          />
                          <span>Tổng ngân sách</span>
                        </label>
                      </div>

                      {/* Amount input */}
                      <div className="relative flex items-center">
                        <input
                          type="text"
                          value={budgetAmount}
                          onChange={(e) => setBudgetAmount(e.target.value)}
                          className="w-full pl-3.5 pr-16 py-2.5 bg-white border border-slate-200/90 rounded-xl text-xs sm:text-sm text-slate-900 font-bold focus:outline-hidden focus:border-[#007a48]"
                        />
                        <span className="absolute right-3 text-xs font-semibold text-slate-500 pointer-events-none">
                          {budgetType === "daily" ? "đ/ngày" : "đ"}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-400 mt-1.5">
                        Ngân sách đề xuất: 300.000 – 1.000.000 đ/ngày
                      </p>
                    </div>

                    {/* Chiến lược đặt giá */}
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1.5">
                        Chiến lược đặt giá
                      </label>
                      <div className="relative">
                        <select
                          value={biddingStrategy}
                          onChange={(e) => setBiddingStrategy(e.target.value)}
                          aria-label="Chọn chiến lược đặt giá"
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-200/90 rounded-xl text-xs sm:text-sm text-slate-800 appearance-none font-medium focus:outline-hidden focus:border-[#007a48] cursor-pointer pr-9"
                        >
                          <option value="auto">Tự động tối ưu (Khuyến nghị)</option>
                          <option value="cost_cap">Giới hạn chi phí (Cost Cap)</option>
                          <option value="bid_cap">Giới hạn giá thầu (Bid Cap)</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Hệ thống sẽ tự động tối ưu để đạt hiệu quả tốt nhất.
                      </p>
                    </div>

                    {/* Mục tiêu tối ưu */}
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1.5">
                        Mục tiêu tối ưu
                      </label>
                      <div className="relative">
                        <select
                          value={optimizationGoal}
                          onChange={(e) => setOptimizationGoal(e.target.value)}
                          aria-label="Chọn mục tiêu tối ưu"
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-200/90 rounded-xl text-xs sm:text-sm text-slate-800 appearance-none font-medium focus:outline-hidden focus:border-[#007a48] cursor-pointer pr-9"
                        >
                          <option value="reach">Lượt tiếp cận</option>
                          <option value="clicks">Lượt nhấp liên kết (Clicks)</option>
                          <option value="conversions">Lượt đặt tour & phòng</option>
                          <option value="engagement">Tương tác bài viết</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Tối ưu hiển thị đến nhiều người nhất có thể.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 3. Mẹo tối ưu đối tượng & ngân sách */}
                <div className="bg-[#f0faf4] border border-emerald-100/90 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-2.5">
                    <div className="w-6 h-6 rounded-lg bg-[#e6f7f0] text-[#007a48] flex items-center justify-center shrink-0">
                      <Lightbulb className="w-3.5 h-3.5" />
                    </div>
                    <h5 className="text-xs font-bold text-[#007a48]">
                      Mẹo tối ưu đối tượng & ngân sách
                    </h5>
                  </div>

                  <ul className="space-y-1.5 text-xs text-slate-700">
                    <li className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-[#007a48] shrink-0 mt-0.5 stroke-[2.5]" />
                      <span className="leading-relaxed">Nhắm mục tiêu theo sở thích du lịch để tăng hiệu quả</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-[#007a48] shrink-0 mt-0.5 stroke-[2.5]" />
                      <span className="leading-relaxed">Bắt đầu với ngân sách nhỏ và điều chỉnh theo kết quả</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-[#007a48] shrink-0 mt-0.5 stroke-[2.5]" />
                      <span className="leading-relaxed">Sử dụng đối tượng Lookalike để mở rộng tệp khách hàng</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-[#007a48] shrink-0 mt-0.5 stroke-[2.5]" />
                      <span className="leading-relaxed">Theo dõi hiệu quả và A/B test nhiều nhóm đối tượng</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------------------
              STEP 4: LỊCH TRÌNH (MATCHING ATTACHED SCREENSHOT EXACTLY)
             ------------------------------------------------------------------------ */}
          {currentStep === 4 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-xs">
              {/* ================================================================
                  LEFT COLUMN: CẤU HÌNH THỜI GIAN VÀ KHUNG GIỜ (~7 cols - 58%)
                 ================================================================ */}
              <div className="lg:col-span-7 space-y-6">
                {/* 1. THỜI GIAN CHẠY CHIẾN DỊCH */}
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">Thời gian chạy chiến dịch</h3>
                  <p className="text-slate-500 text-xs mt-0.5">
                    Chọn thời gian bắt đầu và kết thúc chiến dịch.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                        Ngày bắt đầu <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative flex items-center">
                        <Calendar className="w-4 h-4 text-slate-700 absolute left-3.5 pointer-events-none" />
                        <input
                          type="text"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs font-medium focus:outline-hidden focus:border-[#007a48] transition-colors"
                          placeholder="01/06/2024"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                        Ngày kết thúc <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative flex items-center">
                        <Calendar className="w-4 h-4 text-slate-700 absolute left-3.5 pointer-events-none" />
                        <input
                          type="text"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs font-medium focus:outline-hidden focus:border-[#007a48] transition-colors"
                          placeholder="31/08/2024"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. KHUNG GIỜ HIỂN THỊ (TÙY CHỌN) */}
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">Khung giờ hiển thị (tùy chọn)</h3>
                  <p className="text-slate-500 text-xs mt-0.5">
                    Chọn khung giờ trong ngày để phân phối quảng cáo (theo múi giờ Việt Nam - GMT+7).
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                        Từ giờ
                      </label>
                      <div className="relative flex items-center">
                        <Clock className="w-4 h-4 text-slate-700 absolute left-3.5 pointer-events-none" />
                        <input
                          type="text"
                          value={startTime}
                          onChange={(e) => setStartTime(e.target.value)}
                          className="w-full pl-10 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs font-medium focus:outline-hidden focus:border-[#007a48] transition-colors"
                        />
                        <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 pointer-events-none" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                        Đến giờ
                      </label>
                      <div className="relative flex items-center">
                        <Clock className="w-4 h-4 text-slate-700 absolute left-3.5 pointer-events-none" />
                        <input
                          type="text"
                          value={endTime}
                          onChange={(e) => setEndTime(e.target.value)}
                          className="w-full pl-10 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs font-medium focus:outline-hidden focus:border-[#007a48] transition-colors"
                        />
                        <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* Checkbox Chạy liên tục 24/7 */}
                  <div
                    onClick={() => setIsRun247(!isRun247)}
                    className="flex items-start gap-2.5 mt-3.5 cursor-pointer select-none"
                  >
                    <div
                      className={`w-4 h-4 rounded-sm flex items-center justify-center shrink-0 mt-0.5 transition-colors ${isRun247 ? "bg-[#007a48] text-white" : "border border-slate-300 bg-white"}`}
                    >
                      {isRun247 && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-xs">Chạy liên tục 24/7</div>
                      <div className="text-slate-500 text-[11.5px] mt-0.5">
                        Quảng cáo sẽ hiển thị suốt cả ngày để tối ưu hiệu quả tiếp cận.
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. LỊCH CHẠY NÂNG CAO (TÙY CHỌN) */}
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">Lịch chạy nâng cao (tùy chọn)</h3>
                  <p className="text-slate-500 text-xs mt-0.5">
                    Chọn ngày trong tuần để hiển thị quảng cáo.
                  </p>

                  <div className="flex flex-wrap items-center gap-2 mt-3">
                    {[
                      "Thứ 2",
                      "Thứ 3",
                      "Thứ 4",
                      "Thứ 5",
                      "Thứ 6",
                      "Thứ 7",
                      "Chủ nhật",
                    ].map((day) => {
                      const isSelected = selectedDays.includes(day)
                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => toggleDay(day)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs ${isSelected ? "bg-[#007a48] text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                        >
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          <span>{day}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* 4. MÚI GIỜ */}
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                    Múi giờ
                  </label>
                  <div className="relative flex items-center">
                    <select
                      value={timeZone}
                      onChange={(e) => setTimeZone(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs font-medium appearance-none focus:outline-hidden focus:border-[#007a48] transition-colors pr-8 cursor-pointer"
                    >
                      <option value="(GMT+7) Hà Nội, TP. Hồ Chí Minh, Đà Nẵng">
                        (GMT+7) Hà Nội, TP. Hồ Chí Minh, Đà Nẵng
                      </option>
                      <option value="(GMT+8) Singapore, Kuala Lumpur, Hong Kong">
                        (GMT+8) Singapore, Kuala Lumpur, Hong Kong
                      </option>
                      <option value="(GMT+9) Tokyo, Seoul">
                        (GMT+9) Tokyo, Seoul
                      </option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* ================================================================
                  RIGHT COLUMN: XEM TRƯỚC LỊCH CHẠY VÀ MẸO TỐI ƯU (~5 cols - 42%)
                 ================================================================ */}
              <div className="lg:col-span-5 space-y-4">
                <h3 className="font-extrabold text-slate-900 text-sm">Xem trước lịch chạy</h3>

                {/* CARD 1: CALENDAR VIEW */}
                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
                  {/* Calendar Nav */}
                  <div className="flex items-center justify-between mb-3 px-1">
                    <button
                      type="button"
                      onClick={() =>
                        setPreviewMonth((prev) =>
                          prev === "Tháng 6, 2024" ? "Tháng 5, 2024" : "Tháng 6, 2024"
                        )
                      }
                      className="p-1 hover:bg-slate-100 rounded-md text-slate-600 transition-colors cursor-pointer"
                      title="Tháng trước"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="font-bold text-slate-900 text-xs sm:text-sm">
                      {previewMonth}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setPreviewMonth((prev) =>
                          prev === "Tháng 6, 2024" ? "Tháng 7, 2024" : "Tháng 6, 2024"
                        )
                      }
                      className="p-1 hover:bg-slate-100 rounded-md text-slate-600 transition-colors cursor-pointer"
                      title="Tháng sau"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Day of week header row */}
                  <div className="grid grid-cols-7 gap-1 text-center mb-1 text-[11px] font-semibold text-slate-500">
                    <div>T2</div>
                    <div>T3</div>
                    <div>T4</div>
                    <div>T5</div>
                    <div>T6</div>
                    <div>T7</div>
                    <div>CN</div>
                  </div>

                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 gap-y-1 gap-x-1 text-center text-xs">
                    {/* Row 1 */}
                    <div className="text-slate-300 py-1.5 flex items-center justify-center">27</div>
                    <div className="text-slate-300 py-1.5 flex items-center justify-center">28</div>
                    <div className="text-slate-300 py-1.5 flex items-center justify-center">29</div>
                    <div className="text-slate-300 py-1.5 flex items-center justify-center">30</div>
                    <div className="text-slate-300 py-1.5 flex items-center justify-center">31</div>
                    <div className="flex items-center justify-center py-1">
                      <span className="w-7 h-7 rounded-full bg-emerald-50 text-[#007a48] font-bold flex items-center justify-center">
                        1
                      </span>
                    </div>
                    <div className="flex items-center justify-center py-1">
                      <span className="w-7 h-7 rounded-full bg-emerald-50 text-[#007a48] font-bold flex items-center justify-center">
                        2
                      </span>
                    </div>

                    {/* Row 2 */}
                    {[3, 4, 5, 6, 7, 8, 9].map((day) => (
                      <div key={day} className="flex items-center justify-center py-1">
                        <span className="w-7 h-7 rounded-full bg-emerald-50 text-[#007a48] font-bold flex items-center justify-center">
                          {day}
                        </span>
                      </div>
                    ))}

                    {/* Row 3 */}
                    {[10, 11, 12, 13, 14, 15, 16].map((day) => (
                      <div key={day} className="flex items-center justify-center py-1">
                        <span className="w-7 h-7 rounded-full bg-emerald-50 text-[#007a48] font-bold flex items-center justify-center">
                          {day}
                        </span>
                      </div>
                    ))}

                    {/* Row 4 */}
                    {[17, 18, 19, 20, 21, 22, 23].map((day) => (
                      <div key={day} className="flex items-center justify-center py-1">
                        <span className="w-7 h-7 rounded-full bg-emerald-50 text-[#007a48] font-bold flex items-center justify-center">
                          {day}
                        </span>
                      </div>
                    ))}

                    {/* Row 5 */}
                    {[24, 25, 26, 27, 28, 29, 30].map((day) => (
                      <div key={day} className="flex items-center justify-center py-1">
                        <span className="w-7 h-7 rounded-full bg-emerald-50 text-[#007a48] font-bold flex items-center justify-center">
                          {day}
                        </span>
                      </div>
                    ))}

                    {/* Row 6 */}
                    <div className="flex items-center justify-center py-1">
                      <span className="w-7 h-7 rounded-full bg-emerald-50 text-[#007a48] font-bold flex items-center justify-center">
                        31
                      </span>
                    </div>
                    <div className="text-slate-300 py-1.5 flex items-center justify-center">1</div>
                    <div className="text-slate-300 py-1.5 flex items-center justify-center">2</div>
                    <div className="text-slate-300 py-1.5 flex items-center justify-center">3</div>
                    <div className="text-slate-300 py-1.5 flex items-center justify-center">4</div>
                    <div className="text-slate-300 py-1.5 flex items-center justify-center">5</div>
                    <div className="text-slate-300 py-1.5 flex items-center justify-center">6</div>
                  </div>
                </div>

                {/* CARD 2: TỔNG THỜI GIAN CHẠY */}
                <div className="bg-white border border-slate-200 rounded-2xl p-3.5 flex items-center gap-3.5 shadow-2xs">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-slate-500 text-xs font-medium">Tổng thời gian chạy</div>
                    <div className="text-slate-900 font-extrabold text-base leading-tight mt-0.5">
                      92 ngày
                    </div>
                    <div className="text-slate-400 text-[11px] mt-0.5">
                      Từ {startDate} đến {endDate}
                    </div>
                  </div>
                </div>

                {/* CARD 3: MẸO TỐI ƯU LỊCH TRÌNH */}
                <div className="bg-[#f0faf4] border border-emerald-100/90 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-2.5">
                    <Lightbulb className="w-4 h-4 text-[#007a48] shrink-0" />
                    <span className="font-bold text-[#007a48] text-xs">Mẹo tối ưu lịch trình</span>
                  </div>
                  <div className="space-y-2 text-slate-700 text-xs">
                    <div className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-[#007a48] shrink-0 mt-0.5 stroke-[2.5]" />
                      <span className="leading-snug">Chạy chiến dịch ít nhất 2-4 tuần để đạt hiệu quả tốt</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-[#007a48] shrink-0 mt-0.5 stroke-[2.5]" />
                      <span className="leading-snug">Tập trung vào khung giờ khách hàng hoạt động nhiều</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-[#007a48] shrink-0 mt-0.5 stroke-[2.5]" />
                      <span className="leading-snug">Kết hợp các ngày cuối tuần để tăng lượt tương tác</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-[#007a48] shrink-0 mt-0.5 stroke-[2.5]" />
                      <span className="leading-snug">Theo dõi hiệu suất và điều chỉnh lịch trình phù hợp</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------------------
              STEP 5: XEM TRƯỚC & XUẤT BẢN (MATCHING ATTACHED SCREENSHOT EXACTLY)
             ------------------------------------------------------------------------ */}
          {currentStep === 5 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-xs">
              {/* ================================================================
                  LEFT COLUMN: XEM TRƯỚC THÔNG TIN CHIẾN DỊCH (~7 cols - 56%)
                 ================================================================ */}
              <div className="lg:col-span-7 space-y-3.5">
                {/* Header with Title and "Chỉnh sửa" Button */}
                <div className="flex items-center justify-between pb-1">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm">
                      Xem trước thông tin chiến dịch
                    </h3>
                    <p className="text-slate-500 text-xs mt-0.5">
                      Vui lòng kiểm tra lại thông tin trước khi xuất bản.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-semibold text-xs shadow-2xs transition-colors cursor-pointer"
                  >
                    <Pencil className="w-3.5 h-3.5 text-slate-600" />
                    <span>Chỉnh sửa</span>
                  </button>
                </div>

                {/* 1. THÔNG TIN CƠ BẢN CARD */}
                <div
                  onClick={() => setCurrentStep(1)}
                  className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs hover:border-[#007a48]/40 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-emerald-50 text-[#007a48] flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4 stroke-[2.2]" />
                      </div>
                      <span className="font-bold text-slate-900 text-xs sm:text-sm">
                        Thông tin cơ bản
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-colors" />
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-start gap-3">
                      <span className="text-slate-500 w-28 shrink-0">Tên chiến dịch:</span>
                      <span className="font-medium text-slate-900 flex-1">
                        {campaignTitle || "Khám phá Phú Quốc hè 2024"}
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-slate-500 w-28 shrink-0">Mục tiêu:</span>
                      <span className="font-medium text-slate-900 flex-1">
                        Quảng cáo trả phí
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-slate-500 w-28 shrink-0">Mô tả:</span>
                      <span className="font-medium text-slate-900 flex-1 leading-relaxed">
                        {description ||
                          "Biển xanh, nắng vàng, trải nghiệm tuyệt vời!\nĐặt tour ngay để nhận ưu đãi lên đến 30% cho mùa hè này."}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. NỘI DUNG & KÊNH CARD */}
                <div
                  onClick={() => setCurrentStep(2)}
                  className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs hover:border-[#007a48]/40 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                        <ImageIcon className="w-4 h-4 stroke-[2.2]" />
                      </div>
                      <span className="font-bold text-slate-900 text-xs sm:text-sm">
                        Nội dung & kênh
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-colors" />
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-start gap-3">
                      <span className="text-slate-500 w-28 shrink-0">Loại nội dung:</span>
                      <span className="font-medium text-slate-900 flex-1">
                        Nội dung quảng cáo (hình ảnh)
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-slate-500 w-28 shrink-0">Tiêu đề:</span>
                      <span className="font-medium text-slate-900 flex-1">
                        {campaignTitle || "Khám phá Phú Quốc hè 2024"}
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-slate-500 w-28 shrink-0">Kênh triển khai:</span>
                      <span className="font-medium text-slate-900 flex-1">
                        Facebook, Google, Instagram, Zalo, Email Marketing
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-slate-500 w-28 shrink-0">Điểm nổi bật:</span>
                      <span className="font-medium text-slate-900 flex-1 leading-relaxed">
                        Tour biển đảo trọn gói, Ăn trưa hải sản đặc sắc, Lặn ngắm san hô, Hỗ trợ 24/7
                      </span>
                    </div>
                  </div>
                </div>

                {/* 3. ĐỐI TƯỢNG & NGÂN SÁCH CARD */}
                <div
                  onClick={() => setCurrentStep(3)}
                  className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs hover:border-[#007a48]/40 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-emerald-50 text-[#007a48] flex items-center justify-center shrink-0">
                        <Users className="w-4 h-4 stroke-[2.2]" />
                      </div>
                      <span className="font-bold text-slate-900 text-xs sm:text-sm">
                        Đối tượng & ngân sách
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-colors" />
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-start gap-3">
                      <span className="text-slate-500 w-28 shrink-0">Vị trí:</span>
                      <span className="font-medium text-slate-900 flex-1">Việt Nam</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-slate-500 w-28 shrink-0">Độ tuổi:</span>
                      <span className="font-medium text-slate-900 flex-1">18 - 55+</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-slate-500 w-28 shrink-0">Giới tính:</span>
                      <span className="font-medium text-slate-900 flex-1">Tất cả</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-slate-500 w-28 shrink-0">Sở thích:</span>
                      <span className="font-medium text-slate-900 flex-1 leading-relaxed">
                        Du lịch biển, Resort & nghỉ dưỡng, Ẩm thực địa phương, Chụp ảnh/Check-in, Gia đình, Du lịch cuối tuần
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-slate-500 w-28 shrink-0">Ngân sách:</span>
                      <span className="font-medium text-slate-900 flex-1">
                        500.000 đ/ngày (Tổng: 46.000.000 đ cho 92 ngày)
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-slate-500 w-28 shrink-0">Chiến lược đặt giá:</span>
                      <span className="font-medium text-slate-900 flex-1">
                        Tự động tối ưu (Khuyến nghị)
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-slate-500 w-28 shrink-0">Mục tiêu tối ưu:</span>
                      <span className="font-medium text-slate-900 flex-1">Lượt tiếp cận</span>
                    </div>
                  </div>
                </div>

                {/* 4. LỊCH TRÌNH CARD */}
                <div
                  onClick={() => setCurrentStep(4)}
                  className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs hover:border-[#007a48]/40 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                        <Calendar className="w-4 h-4 stroke-[2.2]" />
                      </div>
                      <span className="font-bold text-slate-900 text-xs sm:text-sm">
                        Lịch trình
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-colors" />
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-start gap-3">
                      <span className="text-slate-500 w-28 shrink-0">Thời gian:</span>
                      <span className="font-medium text-slate-900 flex-1">
                        {startDate} - {endDate} (92 ngày)
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-slate-500 w-28 shrink-0">Khung giờ:</span>
                      <span className="font-medium text-slate-900 flex-1">
                        {startTime} - {endTime}
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-slate-500 w-28 shrink-0">Chạy liên tục:</span>
                      <span className="font-medium text-slate-900 flex-1">
                        {isRun247 ? "Có" : "Không"}
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-slate-500 w-28 shrink-0">Ngày chạy:</span>
                      <span className="font-medium text-slate-900 flex-1">
                        Thứ 2, 3, 4, 5, 6, 7, Chủ nhật
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-slate-500 w-28 shrink-0">Múi giờ:</span>
                      <span className="font-medium text-slate-900 flex-1">
                        {timeZone}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ================================================================
                  RIGHT COLUMN: XEM TRƯỚC QUẢNG CÁO (~5 cols - 44%)
                 ================================================================ */}
              <div className="lg:col-span-5 space-y-3.5">
                <h3 className="font-extrabold text-slate-900 text-sm">Xem trước quảng cáo</h3>

                {/* Channel Selector Pill Tabs */}
                <div className="bg-slate-100/80 p-1 rounded-xl flex items-center justify-between border border-slate-200/80">
                  <button
                    type="button"
                    onClick={() => setPreviewChannel("facebook")}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      previewChannel === "facebook"
                        ? "bg-white text-slate-900 shadow-2xs border border-slate-200/60"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <div className="w-4 h-4 rounded-full bg-[#1877f2] text-white flex items-center justify-center text-[10px] font-bold">
                      f
                    </div>
                    <span>Facebook</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPreviewChannel("instagram")}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      previewChannel === "instagram"
                        ? "bg-white text-slate-900 shadow-2xs border border-slate-200/60 font-bold"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <div className="w-4 h-4 rounded-md bg-gradient-to-tr from-[#f58529] via-[#dd2a7b] to-[#8134af] text-white flex items-center justify-center">
                      <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="currentColor" strokeWidth="2.5" />
                        <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2.5" />
                        <circle cx="17.5" cy="6.5" r="1.5" />
                      </svg>
                    </div>
                    <span>Instagram</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPreviewChannel("zalo")}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      previewChannel === "zalo"
                        ? "bg-white text-slate-900 shadow-2xs border border-slate-200/60 font-bold"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <div className="w-4 h-4 rounded-sm bg-[#0068ff] text-white flex items-center justify-center text-[7px] font-extrabold">
                      Zalo
                    </div>
                    <span>Zalo</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPreviewChannel("email")}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      previewChannel === "email"
                        ? "bg-white text-slate-900 shadow-2xs border border-slate-200/60 font-bold"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Email</span>
                  </button>
                </div>

                {/* Facebook Post Mockup Card */}
                <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden">
                  {/* Header */}
                  <div className="flex items-center justify-between p-3.5 pb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#007a48] text-white flex items-center justify-center shrink-0 shadow-2xs">
                        <Home className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-slate-900 leading-tight">
                          Stayea.com
                        </div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <span>Được tài trợ</span>
                          <span>•</span>
                          <Globe className="w-2.5 h-2.5 text-slate-400" />
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="text-slate-400 hover:text-slate-600 p-1"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Post Text Description */}
                  <div className="px-3.5 pb-2.5">
                    <h4 className="font-bold text-xs text-slate-900 mb-1 leading-snug">
                      {campaignTitle || "Khám phá Phú Quốc hè 2024"}
                    </h4>
                    <p className="text-[11px] text-slate-700 leading-relaxed whitespace-pre-line">
                      {description ||
                        "Biển xanh, nắng vàng, trải nghiệm tuyệt vời!\nĐặt tour ngay để nhận ưu đãi lên đến 30% cho mùa hè này."}
                    </p>
                  </div>

                  {/* Media Banner Image with Overlay */}
                  <div className="relative w-full aspect-[16/10] overflow-hidden bg-slate-800">
                    <Image
                      src="/packages/kham-pha-4-dao.jpg"
                      alt="Khám phá Phú Quốc hè 2024"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/20" />

                    {/* Headline and Tagline Overlay */}
                    <div className="absolute top-1/2 -translate-y-6 left-4 text-white drop-shadow-md">
                      <div className="font-serif italic font-extrabold text-2xl sm:text-3xl tracking-wide leading-tight drop-shadow-lg">
                        Phú Quốc
                      </div>
                      <div className="font-sans font-bold text-sm tracking-wider text-white/95 uppercase drop-shadow-md">
                        Hè 2024
                      </div>
                      <div className="text-[9.5px] text-white/90 font-medium tracking-tight mt-0.5 drop-shadow-sm">
                        Biển xanh - Nắng vàng - Trải nghiệm tuyệt vời
                      </div>
                    </div>

                    {/* Discount Badge & CTA on right */}
                    <div className="absolute top-1/2 -translate-y-7 right-3.5 flex flex-col items-center gap-1.5">
                      <div className="bg-[#e11d48] text-white px-2.5 py-1.5 rounded-xl shadow-lg text-center flex flex-col items-center justify-center leading-none border border-white/20">
                        <span className="text-[8px] font-bold tracking-tight uppercase text-rose-100">
                          GIẢM ĐẾN
                        </span>
                        <span className="text-base sm:text-lg font-black mt-0.5">
                          30%
                        </span>
                      </div>

                      <div className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-[10px] px-2.5 py-1 rounded-full shadow-md transition-all flex items-center gap-0.5 cursor-pointer">
                        <span>Đặt ngay</span>
                        <ArrowRight className="w-2.5 h-2.5" />
                      </div>
                    </div>

                    {/* 4 Highlight Pills at Bottom of Image */}
                    <div className="absolute bottom-2 left-2 right-2 bg-white/90 backdrop-blur-xs rounded-xl p-2 grid grid-cols-4 gap-1 text-[9px] text-slate-800 font-semibold text-center border border-white/40 shadow-xs">
                      <div className="flex flex-col items-center justify-center">
                        <Palmtree className="w-3.5 h-3.5 text-emerald-600 mb-0.5" />
                        <span className="truncate w-full">Tour biển đảo trọn gói</span>
                      </div>
                      <div className="flex flex-col items-center justify-center">
                        <UtensilsCrossed className="w-3.5 h-3.5 text-sky-600 mb-0.5" />
                        <span className="truncate w-full">Ăn trưa hải sản đặc sắc</span>
                      </div>
                      <div className="flex flex-col items-center justify-center">
                        <SnorkelIcon className="w-3.5 h-3.5 text-teal-600 mb-0.5" />
                        <span className="truncate w-full">Lặn ngắm san hô</span>
                      </div>
                      <div className="flex flex-col items-center justify-center">
                        <Headphones className="w-3.5 h-3.5 text-indigo-600 mb-0.5" />
                        <span className="truncate w-full">Hỗ trợ 24/7</span>
                      </div>
                    </div>
                  </div>

                  {/* Link Callout Below Image */}
                  <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">
                        STAYEA.COM
                      </div>
                      <div className="font-bold text-xs text-slate-900 truncate">
                        {campaignTitle || "Khám phá Phú Quốc hè 2024"}
                      </div>
                      <div className="text-[10.5px] text-slate-500 truncate mt-0.5">
                        Ưu đãi hấp dẫn - Trải nghiệm thiên đường biển đảo
                      </div>
                    </div>

                    <button
                      type="button"
                      className="bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors shrink-0 shadow-2xs cursor-pointer"
                    >
                      Tìm hiểu thêm
                    </button>
                  </div>

                  {/* Social Metrics Bar */}
                  <div className="px-3.5 py-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <div className="flex items-center -space-x-1">
                        <div className="w-4 h-4 rounded-full bg-[#1877f2] flex items-center justify-center text-white text-[9px] shadow-2xs">
                          <ThumbsUp className="w-2.5 h-2.5 fill-white" />
                        </div>
                        <div className="w-4 h-4 rounded-full bg-[#fa3e3e] flex items-center justify-center text-white text-[9px] shadow-2xs">
                          <Heart className="w-2.5 h-2.5 fill-white text-[#fa3e3e]" />
                        </div>
                      </div>
                      <span className="font-medium text-slate-600">1,2K</span>
                    </div>

                    <div className="text-[10px] text-slate-500">
                      152 bình luận • 48 lượt chia sẻ
                    </div>
                  </div>

                  {/* Action Buttons Bar: Thích | Bình luận | Chia sẻ */}
                  <div className="px-2 py-1.5 border-t border-slate-100 grid grid-cols-3 gap-1 text-[11px] font-medium text-slate-600">
                    <button
                      type="button"
                      className="flex items-center justify-center gap-1.5 py-1 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>Thích</span>
                    </button>
                    <button
                      type="button"
                      className="flex items-center justify-center gap-1.5 py-1 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Bình luận</span>
                    </button>
                    <button
                      type="button"
                      className="flex items-center justify-center gap-1.5 py-1 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Chia sẻ</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ==========================================================================
            4. ACTION FOOTER
           ========================================================================== */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-white shrink-0">
          <button
            type="button"
            onClick={handlePrevStep}
            className="px-6 py-2.5 border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors text-xs sm:text-sm cursor-pointer"
          >
            <span>{currentStep > 1 ? "Quay lại" : "Hủy"}</span>
          </button>

          <button
            type="button"
            onClick={handleNextStep}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#007a48] hover:bg-[#00663c] text-white font-semibold rounded-xl shadow-xs transition-colors text-xs sm:text-sm cursor-pointer"
          >
            {currentStep === 5 ? (
              <>
                <Rocket className="w-4 h-4" />
                <span>Xuất bản chiến dịch</span>
              </>
            ) : (
              <>
                <span>Tiếp tục</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
