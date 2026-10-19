"use client"

import { useState } from "react"
import Image from "next/image"
import {
  Plus,
  Trash2,
  GripVertical,
  Check,
  Gift,
  Crown,
  Calendar,
  Zap,
  Headphones,
  RotateCcw,
  Shield,
  Leaf,
  Star,
  Sparkles,
  PiggyBank,
} from "lucide-react"

export interface GiftItem {
  id: string
  name: string
  description: string
  image: string
  isSnorkelIcon?: boolean
  showOnPage: boolean
}

export interface BenefitItem {
  id: string
  name: string
  description: string
  iconType: "savings" | "crown" | "calendar" | "instant" | "support" | "flexible" | "trust" | "eco" | "priority"
}

export const INITIAL_GIFTS: GiftItem[] = [
  {
    id: "gift-1",
    name: "Tặng set lặn biển (snorkeling)",
    description: "Bao gồm kính lặn, ống thở, áo phao",
    image: "/experience/snorkeling-nam-dao.jpg",
    isSnorkelIcon: true,
    showOnPage: true,
  },
  {
    id: "gift-2",
    name: "Tặng bữa trưa hải sản",
    description: "Thực đơn đặc sản địa phương",
    image: "/explore/an-gi.jpg",
    showOnPage: true,
  },
  {
    id: "gift-3",
    name: "Miễn phí đưa đón sân bay",
    description: "Áp dụng cho đơn từ 2 khách trở lên",
    image: "/deals/car-vios.jpg",
    showOnPage: true,
  },
]

export const BENEFIT_OPTIONS: BenefitItem[] = [
  {
    id: "savings",
    name: "Tiết kiệm chi phí",
    description: "Giá tốt hơn so với thông thường",
    iconType: "savings",
  },
  {
    id: "crown",
    name: "Trải nghiệm trọn vẹn",
    description: "Thêm nhiều dịch vụ giá trị",
    iconType: "crown",
  },
  {
    id: "calendar",
    name: "Linh hoạt lựa chọn",
    description: "Đa dạng tour, thời gian",
    iconType: "calendar",
  },
  {
    id: "instant",
    name: "Dễ dàng đặt chỗ",
    description: "Đặt nhanh, xác nhận ngay",
    iconType: "instant",
  },
  {
    id: "support",
    name: "Hỗ trợ 24/7",
    description: "Đội ngũ chăm sóc khách hàng",
    iconType: "support",
  },
  {
    id: "flexible",
    name: "Hủy/đổi linh hoạt",
    description: "Chính sách linh hoạt",
    iconType: "flexible",
  },
  {
    id: "trust",
    name: "An toàn & tin cậy",
    description: "Đối tác uy tín, đảm bảo chất lượng",
    iconType: "trust",
  },
  {
    id: "eco",
    name: "Thân thiện môi trường",
    description: "Du lịch xanh, bền vững",
    iconType: "eco",
  },
  {
    id: "priority",
    name: "Ưu tiên đặc biệt",
    description: "Dành riêng cho khách tham gia",
    iconType: "priority",
  },
]

function renderBenefitIcon(type: BenefitItem["iconType"], isSelected: boolean) {
  const colorClass = isSelected ? "text-[#007a48]" : "text-slate-600"
  switch (type) {
    case "savings":
      return <PiggyBank className={`w-4 h-4 shrink-0 ${colorClass}`} />
    case "crown":
      return <Crown className={`w-4 h-4 shrink-0 ${isSelected ? "text-[#d97706]" : colorClass}`} />
    case "calendar":
      return <Calendar className={`w-4 h-4 shrink-0 ${colorClass}`} />
    case "instant":
      return <Zap className={`w-4 h-4 shrink-0 ${colorClass}`} />
    case "support":
      return <Headphones className={`w-4 h-4 shrink-0 ${colorClass}`} />
    case "flexible":
      return <RotateCcw className={`w-4 h-4 shrink-0 ${colorClass}`} />
    case "trust":
      return <Shield className={`w-4 h-4 shrink-0 ${colorClass}`} />
    case "eco":
      return <Leaf className={`w-4 h-4 shrink-0 ${colorClass}`} />
    case "priority":
      return <Star className={`w-4 h-4 shrink-0 ${colorClass}`} />
    default:
      return <Sparkles className={`w-4 h-4 shrink-0 ${colorClass}`} />
  }
}

interface DealGiftsTabProps {
  gifts?: GiftItem[]
  onGiftsChange?: (gifts: GiftItem[]) => void
  selectedBenefitIds?: string[]
  onBenefitsChange?: (benefitIds: string[]) => void
  message?: string
  onMessageChange?: (msg: string) => void
}

export function DealGiftsTab({
  gifts: initialGifts = INITIAL_GIFTS,
  onGiftsChange,
  selectedBenefitIds: initialSelectedBenefits = ["savings", "crown", "calendar"],
  onBenefitsChange,
  message: initialMessage = "Đặt tour ngay để nhận nhiều quà tặng hấp dẫn!",
  onMessageChange,
}: DealGiftsTabProps) {
  const [gifts, setGifts] = useState<GiftItem[]>(initialGifts)
  const [selectedBenefitIds, setSelectedBenefitIds] = useState<string[]>(initialSelectedBenefits)
  const [displayMessage, setDisplayMessage] = useState(initialMessage)
  const [isAddingGift, setIsAddingGift] = useState(false)
  const [newGiftName, setNewGiftName] = useState("")
  const [newGiftDesc, setNewGiftDesc] = useState("")

  const handleDeleteGift = (id: string) => {
    const updated = gifts.filter((g) => g.id !== id)
    setGifts(updated)
    onGiftsChange?.(updated)
  }

  const handleAddGift = () => {
    if (!newGiftName.trim()) return
    const newGift: GiftItem = {
      id: `gift-${Date.now()}`,
      name: newGiftName.trim(),
      description: newGiftDesc.trim() || "Quà tặng kèm đặc quyền Stayea",
      image: "/deals/combo.jpg",
      showOnPage: true,
    }
    const updated = [...gifts, newGift]
    setGifts(updated)
    onGiftsChange?.(updated)
    setNewGiftName("")
    setNewGiftDesc("")
    setIsAddingGift(false)
  }

  const toggleBenefit = (id: string) => {
    const updated = selectedBenefitIds.includes(id)
      ? selectedBenefitIds.filter((bId) => bId !== id)
      : [...selectedBenefitIds, id]
    setSelectedBenefitIds(updated)
    onBenefitsChange?.(updated)
  }

  const handleMessageUpdate = (val: string) => {
    if (val.length <= 100) {
      setDisplayMessage(val)
      onMessageChange?.(val)
    }
  }

  const selectedBenefits = BENEFIT_OPTIONS.filter((b) => selectedBenefitIds.includes(b.id))

  return (
    <div className="space-y-4">
      {/* 1. SECTION 1: QUÀ TẶNG ĐI KÈM */}
      <div>
        <div className="flex items-start justify-between gap-4 mb-2.5">
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Quà tặng đi kèm
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Thêm các quà tặng, dịch vụ cộng thêm khi khách hàng tham gia chương trình.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsAddingGift(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#007a48] hover:bg-[#00663f] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer shrink-0"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Thêm quà tặng</span>
          </button>
        </div>

        {/* Form thêm quà tặng nếu click */}
        {isAddingGift && (
          <div className="mb-2.5 p-3 rounded-2xl border border-emerald-200 bg-emerald-50/30 space-y-2 animate-in fade-in duration-150">
            <div className="text-xs font-bold text-slate-800">Thêm quà tặng mới</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Tên quà tặng (ví dụ: Tặng vé cáp treo)"
                value={newGiftName}
                onChange={(e) => setNewGiftName(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
              <input
                type="text"
                placeholder="Mô tả chi tiết (ví dụ: Miễn phí vé khứ hồi)"
                value={newGiftDesc}
                onChange={(e) => setNewGiftDesc(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
            <div className="flex items-center justify-end gap-2 pt-0.5">
              <button
                type="button"
                onClick={() => setIsAddingGift(false)}
                className="px-3 py-1 text-xs font-semibold text-slate-600 hover:text-slate-800 cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleAddGift}
                className="px-3.5 py-1 rounded-xl bg-[#007a48] text-white text-xs font-semibold hover:bg-[#00663f] cursor-pointer"
              >
                Xác nhận
              </button>
            </div>
          </div>
        )}

        {/* List of Gift Cards */}
        <div className="space-y-2">
          {gifts.map((gift) => (
            <div
              key={gift.id}
              className="px-3 py-2 rounded-2xl border border-slate-200 bg-white flex items-center justify-between gap-3 shadow-xs hover:border-slate-300 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* Drag dots handle */}
                <GripVertical className="w-4 h-4 text-slate-400 shrink-0 cursor-grab" />

                {/* Thumbnail image or Snorkel icon */}
                {gift.isSnorkelIcon ? (
                  <div className="w-14 h-9.5 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center shrink-0 overflow-hidden">
                    <svg
                      viewBox="0 0 36 24"
                      className="w-8 h-5.5 text-sky-600"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="4" width="30" height="15" rx="6" className="fill-sky-100/80 stroke-sky-600" />
                      <circle cx="12" cy="11.5" r="4" className="stroke-sky-700 fill-white" />
                      <circle cx="24" cy="11.5" r="4" className="stroke-sky-700 fill-white" />
                      <line x1="16" y1="11.5" x2="20" y2="11.5" className="stroke-sky-700 stroke-[2.5]" />
                      <path d="M29 5 L33 2" className="stroke-sky-500" />
                    </svg>
                  </div>
                ) : (
                  <div className="w-14 h-9.5 rounded-xl overflow-hidden shrink-0 border border-slate-100 relative bg-slate-100">
                    <Image
                      src={gift.image}
                      alt={gift.name}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </div>
                )}

                {/* Gift Details */}
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 leading-tight truncate">
                    {gift.name}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5 leading-tight truncate">
                    {gift.description}
                  </div>
                </div>
              </div>

              {/* Right: Badge & Trash button */}
              <div className="flex items-center gap-3 shrink-0">
                <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-medium leading-none">
                  Hiện thị trên trang
                </span>

                <button
                  type="button"
                  onClick={() => handleDeleteGift(gift.id)}
                  className="w-7 h-7 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Xóa quà tặng"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. SECTION 2: LỢI ÍCH DÀNH CHO KHÁCH HÀNG */}
      <div>
        <div className="mb-2.5">
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">
            Lợi ích dành cho khách hàng
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Hiển thị các lợi ích nổi bật của chương trình để thu hút khách hàng.
          </p>
        </div>

        {/* 3x3 Grid of 9 Benefits */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
          {BENEFIT_OPTIONS.map((benefit) => {
            const isSelected = selectedBenefitIds.includes(benefit.id)
            return (
              <button
                type="button"
                key={benefit.id}
                onClick={() => toggleBenefit(benefit.id)}
                className={`text-left p-2.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-2.5 ${
                  isSelected
                    ? "border-emerald-300 bg-emerald-50/20 shadow-xs"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                {/* Checkbox */}
                <div
                  className={`w-4 h-4 rounded transition-colors flex items-center justify-center shrink-0 ${
                    isSelected
                      ? "bg-[#007a48] border border-[#007a48] text-white"
                      : "border border-slate-300 bg-white"
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                </div>

                {/* Icon */}
                {renderBenefitIcon(benefit.iconType, isSelected)}

                {/* Text */}
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 leading-tight">
                    {benefit.name}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5 leading-tight truncate">
                    {benefit.description}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* 3. SECTION 3: THÔNG ĐIỆP HIỂN THỊ & XEM TRƯỚC LỢI ÍCH */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start pt-0.5">
        {/* Left Col: Thông điệp hiển thị (tùy chọn) */}
        <div className="lg:col-span-7 space-y-1">
          <label className="block text-xs font-bold text-slate-900">
            Thông điệp hiển thị (tùy chọn)
          </label>
          <p className="text-[11px] text-slate-500">
            Thông điệp ngắn gọn hiển thị trên trang ưu đãi.
          </p>

          <div className="relative mt-1.5">
            <textarea
              rows={2}
              maxLength={100}
              value={displayMessage}
              onChange={(e) => handleMessageUpdate(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-2xl border border-slate-200 bg-white font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none h-[72px]"
              placeholder="Nhập thông điệp hiển thị..."
            />
            <span className="absolute right-3.5 bottom-2 text-[11px] text-slate-400 font-medium pointer-events-none">
              {displayMessage.length}/100
            </span>
          </div>
        </div>

        {/* Right Col: Xem trước lợi ích */}
        <div className="lg:col-span-5 rounded-2xl border border-emerald-100 bg-[#f4fbf7] p-3.5">
          <h4 className="text-xs font-bold text-[#007a48] mb-2.5">
            Xem trước lợi ích
          </h4>

          <div className="space-y-1.5 text-xs">
            {/* Gift Items in preview */}
            {gifts.map((g) => (
              <div key={g.id} className="flex items-center gap-2 text-slate-700">
                <Gift className="w-3.5 h-3.5 text-[#007a48] shrink-0" />
                <span className="truncate font-medium text-xs">{g.name}</span>
              </div>
            ))}

            {/* Selected Benefits in preview */}
            {selectedBenefits.map((b) => (
              <div key={b.id} className="flex items-center gap-2 text-slate-700">
                <Check className="w-3.5 h-3.5 text-[#007a48] stroke-[2.5] shrink-0" />
                <span className="truncate font-medium text-xs">{b.name}</span>
              </div>
            ))}

            {gifts.length === 0 && selectedBenefits.length === 0 && (
              <div className="text-[11px] text-slate-400 italic">
                Chưa có quà tặng hoặc lợi ích nào được chọn
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
