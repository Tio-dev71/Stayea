"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import {
  Plus,
  X,
  Tag,
  Percent,
  Calendar,
  ChevronDown,
  UploadCloud,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link2,
  FileText,
  Check,
  ArrowRight,
  Send,
} from "lucide-react"
import { DealConditionsTab } from "@/features/admin-deals/components/deal-conditions-tab"
import { DealGiftsTab } from "@/features/admin-deals/components/deal-gifts-tab"
import { DealMediaTab } from "@/features/admin-deals/components/deal-media-tab"
import { DealPreviewTab } from "@/features/admin-deals/components/deal-preview-tab"
import type { DealItem, DealStatus } from "@/features/admin-deals/stayea-admin-deals-mock-data"

export type DealModalTab =
  | "basic"
  | "conditions"
  | "gifts"
  | "media"
  | "preview"

interface CreateDealModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (deal: DealItem) => void
  initialTab?: DealModalTab
}

export function CreateDealModal({
  isOpen,
  onClose,
  onSubmit,
  initialTab = "basic",
}: CreateDealModalProps) {
  const [activeTab, setActiveTab] = useState<DealModalTab>(initialTab)

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab)
    }
  }, [initialTab])

  // Form Fields
  const [name, setName] = useState("")
  const [dealType, setDealType] = useState<DealItem["type"] | "">("")
  const [shortDescription, setShortDescription] = useState("")
  const [discountType, setDiscountType] = useState<"percent" | "fixed" | "same-price">("percent")
  const [discountValue, setDiscountValue] = useState("")
  const [startDate, setStartDate] = useState("01/06/2024")
  const [endDate, setEndDate] = useState("31/08/2024")
  const [status, setStatus] = useState<"Đang hoạt động" | "Tạm dừng" | "Chưa kích hoạt" | "Hết hạn">("Đang hoạt động")

  const [detailedDescription, setDetailedDescription] = useState("")
  const [coverImage, setCoverImage] = useState<string | null>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)

  const [category, setCategory] = useState("Tất cả")
  const [isFeatured, setIsFeatured] = useState(true)
  const [sortOrder, setSortOrder] = useState<number>(0)

  const formBodyRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (formBodyRef.current) {
      formBodyRef.current.scrollTop = 0
    }
  }, [activeTab, isOpen])

  if (!isOpen) return null

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setCoverImage(url)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const dealStatusMap: Record<string, DealStatus> = {
      "Đang hoạt động": "active",
      "Tạm dừng": "paused",
      "Chưa kích hoạt": "upcoming",
      "Hết hạn": "expired",
    }

    const newDeal: DealItem = {
      id: `deal-${Date.now()}`,
      name: name.trim() || "Chương trình ưu đãi mới",
      subtitle: shortDescription.trim() || "Ưu đãi trải nghiệm & tour",
      code: `PROMO${Math.floor(1000 + Math.random() * 9000)}`,
      type: dealType || "Giảm giá trực tiếp",
      value: discountType === "percent" ? `${discountValue || 20}%` : `${discountValue || 200_000} đ`,
      startDate: startDate || "01/06/2024",
      endDate: endDate || "31/08/2024",
      usedCount: 0,
      status: dealStatusMap[status] || "active",
      image: coverImage || "/experience/cano-4-islands.jpg",
      category: category || "Tất cả",
      featured: isFeatured,
      sortOrder: Number(sortOrder) || 0,
    }

    onSubmit(newDeal)
    onClose()
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-deal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-5xl lg:max-w-[1040px] bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col max-h-[92vh] overflow-hidden z-10 animate-in zoom-in-95 duration-200">
        {/* 1. Modal Header */}
        <div className="px-5 sm:px-7 pt-5 sm:pt-6 pb-4 border-b border-slate-100 flex items-start justify-between gap-4 shrink-0 bg-white">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-[#005938] text-white flex items-center justify-center shrink-0 shadow-sm">
              <Plus className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2
                id="create-deal-title"
                className="text-base sm:text-lg font-bold text-slate-900 tracking-tight"
              >
                Tạo chương trình khuyến mãi
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Thiết lập chương trình ưu đãi, khuyến mãi cho trải nghiệm và tour.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2. Navigation Tab Strip (5 steps) */}
        <div className="px-5 sm:px-7 pt-2.5 border-b border-slate-100 bg-[#fafbfa] shrink-0 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-5 sm:gap-7 min-w-max">
            <button
              type="button"
              onClick={() => setActiveTab("basic")}
              className={`pb-2.5 text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === "basic"
                  ? "text-[#1b7a4e] border-b-2 border-[#1b7a4e]"
                  : "text-slate-500 hover:text-slate-800 border-b-2 border-transparent"
              }`}
            >
              Thông tin cơ bản
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("conditions")}
              className={`pb-2.5 text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === "conditions"
                  ? "text-[#1b7a4e] border-b-2 border-[#1b7a4e]"
                  : "text-slate-500 hover:text-slate-800 border-b-2 border-transparent"
              }`}
            >
              Điều kiện áp dụng
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("gifts")}
              className={`pb-2.5 text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === "gifts"
                  ? "text-[#1b7a4e] border-b-2 border-[#1b7a4e]"
                  : "text-slate-500 hover:text-slate-800 border-b-2 border-transparent"
              }`}
            >
              Quà tặng & lợi ích
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("media")}
              className={`pb-2.5 text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === "media"
                  ? "text-[#1b7a4e] border-b-2 border-[#1b7a4e]"
                  : "text-slate-500 hover:text-slate-800 border-b-2 border-transparent"
              }`}
            >
              Hình ảnh & truyền thông
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("preview")}
              className={`pb-2.5 text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === "preview"
                  ? "text-[#1b7a4e] border-b-2 border-[#1b7a4e]"
                  : "text-slate-500 hover:text-slate-800 border-b-2 border-transparent"
              }`}
            >
              Xem trước & xuất bản
            </button>
          </div>
        </div>

        {/* 3. Modal Form Body (Scrollable) */}
        <form
          ref={formBodyRef}
          id="deal-create-form"
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto px-5 sm:px-6 py-3.5 space-y-3.5"
        >
          {activeTab === "basic" ? (
            <div className="space-y-5">
              {/* SECTION 1: THÔNG TIN CHUNG */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 tracking-tight mb-3">
                  Thông tin chung
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                  {/* Row 1 Col 1: Tên chương trình * */}
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <label className="text-xs font-semibold text-slate-700">
                        Tên chương trình
                      </label>
                      <span className="text-rose-500 font-bold">*</span>
                    </div>
                    <input
                      type="text"
                      required
                      maxLength={100}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Nhập tên chương trình khuyến mãi (ví dụ: Khám phá Phú Quốc hè 2024)"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-normal text-slate-800 placeholder:text-slate-400"
                    />
                    <div className="text-right mt-1">
                      <span className="text-[11px] text-slate-400">{name.length}/100</span>
                    </div>
                  </div>

                  {/* Row 1 Col 2: Loại ưu đãi * */}
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <label className="text-xs font-semibold text-slate-700">
                        Loại ưu đãi
                      </label>
                      <span className="text-rose-500 font-bold">*</span>
                    </div>
                    <div className="relative">
                      <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <select
                        value={dealType}
                        onChange={(e) => setDealType(e.target.value as DealItem["type"])}
                        className="w-full pl-9 pr-8 py-2 text-xs rounded-xl border border-slate-200 bg-white hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium text-slate-800 appearance-none cursor-pointer"
                      >
                        <option value="">Chọn loại ưu đãi</option>
                        <option value="Giảm giá trực tiếp">Giảm giá trực tiếp</option>
                        <option value="Mã giảm giá">Mã giảm giá</option>
                        <option value="Combo ưu đãi">Combo ưu đãi</option>
                        <option value="Quà tặng kèm">Quà tặng kèm</option>
                        <option value="Miễn phí dịch vụ">Miễn phí dịch vụ</option>
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {/* Row 2 Col 1: Mô tả ngắn * */}
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <label className="text-xs font-semibold text-slate-700">
                        Mô tả ngắn
                      </label>
                      <span className="text-rose-500 font-bold">*</span>
                    </div>
                    <textarea
                      rows={3}
                      maxLength={200}
                      value={shortDescription}
                      onChange={(e) => setShortDescription(e.target.value)}
                      placeholder="Viết mô tả ngắn gọn về chương trình (hiển thị trên danh sách, tối đa 200 ký tự)"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-normal text-slate-800 placeholder:text-slate-400 resize-none leading-relaxed"
                    />
                    <div className="text-right mt-1">
                      <span className="text-[11px] text-slate-400">{shortDescription.length}/200</span>
                    </div>
                  </div>

                  {/* Row 2 Col 2: Giá trị ưu đãi * */}
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <label className="text-xs font-semibold text-slate-700">
                        Giá trị ưu đãi
                      </label>
                      <span className="text-rose-500 font-bold">*</span>
                    </div>

                    {/* Dropdown hình thức ưu đãi */}
                    <div className="relative mb-2">
                      <Percent className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <select
                        value={discountType}
                        onChange={(e) => setDiscountType(e.target.value as "percent" | "fixed" | "same-price")}
                        className="w-full pl-9 pr-8 py-2 text-xs rounded-xl border border-slate-200 bg-white hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium text-slate-800 appearance-none cursor-pointer"
                      >
                        <option value="percent">Chọn hình thức ưu đãi (hoặc %)</option>
                        <option value="fixed">Giảm số tiền cố định (VNĐ)</option>
                        <option value="same-price">Đồng giá</option>
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>

                    {/* Input nhập giá trị kèm suffix */}
                    <div className="border border-slate-200 rounded-xl bg-white flex items-center overflow-hidden focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-all">
                      <input
                        type="text"
                        value={discountValue}
                        onChange={(e) => setDiscountValue(e.target.value)}
                        placeholder="Nhập giá trị (ví dụ: 20)"
                        className="flex-1 px-3 py-2 text-xs font-normal text-slate-800 bg-transparent focus:outline-none"
                      />
                      <span className="px-3.5 py-2 text-xs font-semibold text-slate-600 bg-slate-50 border-l border-slate-200 select-none">
                        {discountType === "fixed" ? "đ" : "%"}
                      </span>
                    </div>
                  </div>

                  {/* Row 3 Col 1: Thời gian áp dụng * */}
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <label className="text-xs font-semibold text-slate-700">
                        Thời gian áp dụng
                      </label>
                      <span className="text-rose-500 font-bold">*</span>
                    </div>
                    <div className="border border-slate-200 rounded-xl px-3 py-2 bg-white flex items-center justify-between text-xs text-slate-800 shadow-2xs">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                        <input
                          type="text"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="w-24 bg-transparent font-medium text-slate-800 focus:outline-none text-xs"
                          placeholder="dd/mm/yyyy"
                        />
                      </div>
                      <span className="text-slate-400 font-medium">→</span>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="w-24 bg-transparent font-medium text-slate-800 focus:outline-none text-xs text-right"
                          placeholder="dd/mm/yyyy"
                        />
                        <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                      </div>
                    </div>
                  </div>

                  {/* Row 3 Col 2: Trạng thái * */}
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <label className="text-xs font-semibold text-slate-700">
                        Trạng thái
                      </label>
                      <span className="text-rose-500 font-bold">*</span>
                    </div>
                    <div className="relative">
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value as any)}
                        className="w-full pl-7 pr-8 py-2 text-xs rounded-xl border border-slate-200 bg-white hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium text-slate-800 appearance-none cursor-pointer"
                      >
                        <option value="Đang hoạt động">Đang hoạt động</option>
                        <option value="Tạm dừng">Tạm dừng</option>
                        <option value="Chưa kích hoạt">Chưa kích hoạt</option>
                        <option value="Hết hạn">Hết hạn</option>
                      </select>
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-emerald-500 pointer-events-none" />
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 2: MÔ TẢ CHI TIẾT & HÌNH ẢNH ĐẠI DIỆN */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start pt-1">
                {/* Cột trái (7/12): Mô tả chi tiết */}
                <div className="md:col-span-7 space-y-1.5">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight">
                    Mô tả chi tiết
                  </h4>
                  <div className="border border-slate-200 rounded-xl bg-white overflow-hidden focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-all shadow-2xs">
                    {/* Toolbar */}
                    <div className="border-b border-slate-100 px-3 py-2 flex items-center gap-2.5 bg-slate-50/50 text-slate-600">
                      <button type="button" className="p-1 hover:bg-slate-200/60 rounded cursor-pointer" title="In đậm">
                        <Bold className="w-3.5 h-3.5" />
                      </button>
                      <button type="button" className="p-1 hover:bg-slate-200/60 rounded cursor-pointer" title="In nghiêng">
                        <Italic className="w-3.5 h-3.5" />
                      </button>
                      <button type="button" className="p-1 hover:bg-slate-200/60 rounded cursor-pointer" title="Gạch chân">
                        <Underline className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-px h-3.5 bg-slate-200" />
                      <button type="button" className="p-1 hover:bg-slate-200/60 rounded cursor-pointer" title="Danh sách dấu chấm">
                        <List className="w-3.5 h-3.5" />
                      </button>
                      <button type="button" className="p-1 hover:bg-slate-200/60 rounded cursor-pointer" title="Danh sách đánh số">
                        <ListOrdered className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-px h-3.5 bg-slate-200" />
                      <button type="button" className="p-1 hover:bg-slate-200/60 rounded cursor-pointer" title="Chèn liên kết">
                        <Link2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Textarea */}
                    <textarea
                      rows={5}
                      maxLength={2000}
                      value={detailedDescription}
                      onChange={(e) => setDetailedDescription(e.target.value)}
                      placeholder="Nhập mô tả chi tiết về chương trình, điều khoản, lợi ích..."
                      className="w-full p-3 text-xs text-slate-800 bg-transparent focus:outline-none resize-none min-h-[125px] leading-relaxed placeholder:text-slate-400"
                    />
                    <div className="text-right px-3 pb-2">
                      <span className="text-[11px] text-slate-400">{detailedDescription.length}/2000</span>
                    </div>
                  </div>
                </div>

                {/* Cột phải (5/12): Hình ảnh đại diện */}
                <div className="md:col-span-5 space-y-1.5">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight">
                    Hình ảnh đại diện
                  </h4>

                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={handleImageFileChange}
                  />

                  {coverImage ? (
                    <div className="rounded-2xl border border-slate-200 bg-white p-2 relative group overflow-hidden shadow-2xs">
                      <div className="h-36 rounded-xl overflow-hidden relative">
                        <Image
                          src={coverImage}
                          alt="Cover preview"
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                        <button
                          type="button"
                          onClick={() => setCoverImage(null)}
                          className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-full p-1 transition-colors cursor-pointer"
                          title="Xóa ảnh"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="pt-2 text-center">
                        <button
                          type="button"
                          onClick={() => imageInputRef.current?.click()}
                          className="text-xs text-[#1b7a4e] font-semibold hover:underline"
                        >
                          Thay đổi ảnh khác
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => imageInputRef.current?.click()}
                      className="border-2 border-dashed border-slate-200 hover:border-[#1b7a4e]/40 rounded-2xl p-4 flex flex-col items-center justify-center text-center bg-white hover:bg-slate-50/60 transition-all cursor-pointer min-h-[160px] group shadow-2xs"
                    >
                      <div className="w-11 h-11 rounded-full bg-emerald-50 text-[#1b7a4e] flex items-center justify-center group-hover:scale-105 transition-transform">
                        <UploadCloud className="w-5 h-5 stroke-[2.2]" />
                      </div>
                      <span className="font-bold text-slate-800 text-xs mt-2">
                        Tải ảnh lên
                      </span>
                      <span className="text-[11px] text-slate-400 mt-0.5">
                        hoặc kéo thả
                      </span>
                      <div className="mt-1.5 text-[10px] text-slate-400 leading-tight">
                        <p>JPG, PNG, WebP. Tối đa 5MB</p>
                        <p>Tỷ lệ 16:9, khuyến nghị 1920x1080</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* SECTION 3: HIỂN THỊ */}
              <div className="pt-3 border-t border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 tracking-tight mb-2.5">
                  Hiển thị
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  {/* Danh mục hiển thị */}
                  <div className="md:col-span-4">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Danh mục hiển thị
                    </label>
                    <div className="relative">
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-3 pr-8 py-2 text-xs rounded-xl border border-slate-200 bg-white hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium text-slate-800 appearance-none cursor-pointer"
                      >
                        <option value="Tất cả">Tất cả</option>
                        <option value="Tour biển đảo">Tour biển đảo</option>
                        <option value="Khách sạn & Resort">Khách sạn & Resort</option>
                        <option value="Ẩm thực">Ẩm thực</option>
                        <option value="Vé tham quan">Vé tham quan</option>
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {/* Hiển thị nổi bật */}
                  <div className="md:col-span-5">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Hiển thị nổi bật
                    </label>
                    <div className="flex items-center gap-2.5 pt-0.5">
                      <button
                        type="button"
                        role="switch"
                        aria-checked={isFeatured}
                        onClick={() => setIsFeatured(!isFeatured)}
                        className={`w-9 h-5 rounded-full transition-colors relative shrink-0 cursor-pointer ${
                          isFeatured ? "bg-[#1b7a4e]" : "bg-slate-300"
                        }`}
                      >
                        <span
                          className={`w-4 h-4 rounded-full bg-white transition-transform block shadow-xs absolute top-0.5 ${
                            isFeatured ? "translate-x-4.5" : "translate-x-0.5"
                          }`}
                        />
                      </button>
                      <span className="text-[11px] text-slate-500 leading-tight">
                        Hiển thị chương trình ở vị trí nổi bật trên website và ứng dụng
                      </span>
                    </div>
                  </div>

                  {/* Thứ tự hiển thị */}
                  <div className="md:col-span-3">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Thứ tự hiển thị
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={sortOrder}
                      onChange={(e) => setSortOrder(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    />
                    <span className="text-[10px] text-slate-400 block mt-1">
                      Số nhỏ hơn sẽ hiển thị trước
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : activeTab === "conditions" ? (
            <DealConditionsTab />
          ) : activeTab === "gifts" ? (
            <DealGiftsTab />
          ) : activeTab === "media" ? (
            <DealMediaTab />
          ) : activeTab === "preview" ? (
            <DealPreviewTab />
          ) : (
            <div className="py-12 text-center text-slate-400 text-xs">
              <p>Nội dung đang được thiết lập cho tab này.</p>
            </div>
          )}
        </form>

        {/* 4. Modal Footer Actions (Fixed Bottom) */}
        {activeTab === "preview" ? (
          <div className="px-5 sm:px-7 py-3.5 border-t border-slate-100 bg-white flex items-center justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab("media")}
              className="px-6 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
            >
              Quay lại
            </button>

            <button
              type="submit"
              form="deal-create-form"
              className="px-6 py-2.5 rounded-xl bg-[#007a48] hover:bg-[#00663f] text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4 stroke-[2.2]" />
              <span>Xuất bản ngay</span>
            </button>
          </div>
        ) : activeTab === "media" ? (
          <div className="px-5 sm:px-7 py-3.5 border-t border-slate-100 bg-white flex items-center justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab("gifts")}
              className="px-6 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
            >
              Quay lại
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("preview")}
              className="px-6 py-2.5 rounded-xl bg-[#007a48] hover:bg-[#00663f] text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>Tiếp tục</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        ) : activeTab === "gifts" ? (
          <div className="px-5 sm:px-7 py-3.5 border-t border-slate-100 bg-white flex items-center justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab("conditions")}
              className="px-6 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
            >
              Quay lại
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("media")}
              className="px-6 py-2.5 rounded-xl bg-[#007a48] hover:bg-[#00663f] text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>Tiếp tục</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        ) : activeTab === "conditions" ? (
          <div className="px-5 sm:px-7 py-3.5 border-t border-slate-100 bg-white flex items-center justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab("basic")}
              className="px-6 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
            >
              Quay lại
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("gifts")}
              className="px-6 py-2.5 rounded-xl bg-[#007a48] hover:bg-[#00663f] text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>Tiếp tục</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        ) : activeTab === "basic" ? (
          <div className="px-5 sm:px-7 py-3.5 border-t border-slate-100 bg-white flex items-center justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
            >
              Hủy
            </button>

            <button
              type="button"
              onClick={(e) => {
                handleSubmit(e)
              }}
              className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <FileText className="w-4 h-4 text-slate-500" />
              <span>Lưu nháp</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("conditions")}
              className="px-6 py-2.5 rounded-xl bg-[#007a48] hover:bg-[#00663f] text-white text-xs font-semibold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>Tiếp tục</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        ) : (
          <div className="px-5 sm:px-7 py-3.5 border-t border-slate-100 bg-white flex items-center justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab("conditions")}
              className="px-6 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
            >
              Quay lại
            </button>

            <button
              type="submit"
              form="deal-create-form"
              className="px-6 py-2.5 rounded-xl bg-[#1b7a4e] hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>Tạo chương trình</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
