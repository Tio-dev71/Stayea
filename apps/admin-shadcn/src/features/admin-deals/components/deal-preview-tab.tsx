"use client"

import { useState } from "react"
import Image from "next/image"
import {
  Rocket,
  FileText,
  Calendar,
  Infinity as InfinityIcon,
  Check,
  Gift,
  Utensils,
  Car,
  Users,
  Megaphone,
  Tag,
  Award,
  Clock,
} from "lucide-react"

export interface DealPreviewData {
  title?: string
  subtitle?: string
  discountBadge?: string
  remainingDays?: string
  bannerImage?: string
  galleryImages?: string[]
  startDate?: string
  endDate?: string
  targetAudience?: string
  publishStatus?: "publish_now" | "draft"
  durationMode?: "custom" | "continuous"
  placements?: {
    homeBanner: boolean
    toursList: boolean
    tourDetail: boolean
    mobileApp: boolean
  }
}

interface DealPreviewTabProps {
  data?: DealPreviewData
  onChange?: (updated: Partial<DealPreviewData>) => void
}

export function DealPreviewTab({ data = {}, onChange }: DealPreviewTabProps) {
  const [publishStatus, setPublishStatus] = useState<"publish_now" | "draft">(
    data.publishStatus ?? "publish_now"
  )
  const [durationMode, setDurationMode] = useState<"custom" | "continuous">(
    data.durationMode ?? "custom"
  )
  const [placements, setPlacements] = useState(
    data.placements ?? {
      homeBanner: true,
      toursList: true,
      tourDetail: true,
      mobileApp: true,
    }
  )

  const bannerImage = data.bannerImage ?? "/deals/banner-deals.jpg"
  const title = data.title ?? "Ưu đãi hè Phú Quốc"
  const subtitle = data.subtitle ?? "Khám phá thiên đường biển đảo"
  const discountBadge = data.discountBadge ?? "Giảm 30%"
  const remainingDays = data.remainingDays ?? "Còn 15 ngày"
  const startDate = data.startDate ?? "01/06/2024"
  const endDate = data.endDate ?? "31/08/2024"
  const targetAudience =
    data.targetAudience ?? "Tất cả trải nghiệm & tour tại Phú Quốc"

  const galleryImages = data.galleryImages ?? [
    "/packages/tour-3-dao.jpg",
    "/packages/lan-ngam-san-ho.jpg",
    "/packages/sunset-cruise.jpg",
    "/stay/salinda-resort.jpg",
    "/explore/an-gi.jpg",
  ]

  const togglePlacement = (key: keyof typeof placements) => {
    const next = { ...placements, [key]: !placements[key] }
    setPlacements(next)
    onChange?.({ placements: next })
  }

  const handleStatusChange = (status: "publish_now" | "draft") => {
    setPublishStatus(status)
    onChange?.({ publishStatus: status })
  }

  const handleDurationChange = (mode: "custom" | "continuous") => {
    setDurationMode(mode)
    onChange?.({ durationMode: mode })
  }

  return (
    <div className="space-y-3">
      {/* 2-Column Responsive Grid: Left Preview (7 cols) + Right Settings (5 cols) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
        {/* ================= LEFT COLUMN: XEM TRƯỚC CHƯƠNG TRÌNH (7 cols) ================= */}
        <div className="md:col-span-7 space-y-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Xem trước chương trình
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Đây là giao diện hiển thị của chương trình khuyến mãi trên website và ứng dụng Stayea.
            </p>
          </div>

          {/* 1. Main Banner Showcase Card */}
          <div className="relative rounded-2xl overflow-hidden shadow-xs border border-slate-200 bg-slate-900 min-h-[175px] sm:min-h-[190px] flex flex-col justify-between p-3.5 group">
            {/* Background Image */}
            <Image
              src={bannerImage}
              alt={title}
              fill
              priority
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 55vw"
            />
            {/* Dark gradient overlay for text legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/35 pointer-events-none" />

            {/* Top row: Discount Badge (Left) + Remaining Days (Right) */}
            <div className="relative z-10 flex items-center justify-between">
              {/* Giảm 30% Badge */}
              <div className="px-3 py-1 rounded-xl bg-[#e53935] text-white text-xs font-black uppercase tracking-tight shadow-sm">
                {discountBadge}
              </div>

              {/* Còn 15 ngày pill */}
              <div className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-xs text-white text-[11px] font-medium flex items-center gap-1.5 shadow-xs border border-white/10">
                <Clock className="w-3 h-3 text-white/90" />
                <span>{remainingDays}</span>
              </div>
            </div>

            {/* Middle & Bottom: Content + Feature Badges + Book Now */}
            <div className="relative z-10 space-y-2.5 mt-auto pt-4">
              <div>
                <h4 className="text-lg sm:text-xl font-bold text-white tracking-tight drop-shadow-md leading-tight">
                  {title}
                </h4>
                <p className="text-xs text-slate-200 font-medium drop-shadow-xs mt-0.5">
                  {subtitle}
                </p>
              </div>

              {/* 3 Benefit Pills Row */}
              <div className="flex flex-wrap items-center gap-1.5">
                <div className="px-2.5 py-1 rounded-full bg-black/45 backdrop-blur-xs text-white text-[10px] font-medium flex items-center gap-1 border border-white/10">
                  <Tag className="w-3 h-3 text-emerald-400" />
                  <span>Tiết kiệm chi phí</span>
                </div>
                <div className="px-2.5 py-1 rounded-full bg-black/45 backdrop-blur-xs text-white text-[10px] font-medium flex items-center gap-1 border border-white/10">
                  <Award className="w-3 h-3 text-amber-400" />
                  <span>Trải nghiệm trọn vẹn</span>
                </div>
                <div className="px-2.5 py-1 rounded-full bg-black/45 backdrop-blur-xs text-white text-[10px] font-medium flex items-center gap-1 border border-white/10">
                  <Calendar className="w-3 h-3 text-sky-400" />
                  <span>Linh hoạt lựa chọn</span>
                </div>
              </div>

              {/* Book now button */}
              <div className="pt-0.5">
                <button
                  type="button"
                  className="px-4 py-1.5 rounded-full bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs shadow-md transition-transform active:scale-95 flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Đặt ngay</span>
                  <span className="text-xs">→</span>
                </button>
              </div>
            </div>
          </div>

          {/* 2. Photo Gallery Strip (5 thumbnails) */}
          <div className="grid grid-cols-5 gap-2">
            {galleryImages.slice(0, 5).map((imgUrl, idx) => (
              <div
                key={imgUrl}
                className="relative aspect-video sm:h-14 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-2xs"
              >
                <Image
                  src={imgUrl}
                  alt={`Thư viện ${idx + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 20vw, 12vw"
                />
              </div>
            ))}
          </div>

          {/* 3. Gifts & Benefits Summary Box */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-3 shadow-2xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Gift Item 1 */}
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 text-[#1e3a5f] flex items-center justify-center shrink-0">
                  <Gift className="w-4 h-4 stroke-[2]" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 leading-snug">
                    Tặng set lặn biển (snorkeling)
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5 leading-snug">
                    Bao gồm kính lặn, ống thở, áo phao
                  </div>
                </div>
              </div>

              {/* Gift Item 2 */}
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 text-[#1e3a5f] flex items-center justify-center shrink-0">
                  <Utensils className="w-4 h-4 stroke-[2]" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 leading-snug">
                    Tặng bữa trưa hải sản
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5 leading-snug">
                    Thực đơn đặc sản địa phương
                  </div>
                </div>
              </div>

              {/* Gift Item 3 */}
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 text-[#1e3a5f] flex items-center justify-center shrink-0">
                  <Car className="w-4 h-4 stroke-[2]" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 leading-snug">
                    Miễn phí đưa đón sân bay
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5 leading-snug">
                    Áp dụng cho đơn từ 2 khách trở lên
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Applicability & Dates Metadata Box */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-3 shadow-2xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
              {/* Col 1: Thời gian áp dụng */}
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-slate-50 text-[#1e3a5f] flex items-center justify-center shrink-0 mt-0.5">
                  <Calendar className="w-4 h-4 stroke-[2]" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    Thời gian áp dụng
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {startDate} - {endDate}
                  </div>
                </div>
              </div>

              {/* Col 2: Áp dụng cho */}
              <div className="flex items-start gap-2.5 pt-2.5 sm:pt-0 sm:pl-3">
                <div className="w-7 h-7 rounded-xl bg-slate-50 text-[#1e3a5f] flex items-center justify-center shrink-0 mt-0.5">
                  <Users className="w-4 h-4 stroke-[2]" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    Áp dụng cho
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {targetAudience}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= RIGHT COLUMN: THIẾT LẬP XUẤT BẢN (5 cols) ================= */}
        <div className="md:col-span-5 space-y-3.5">
          {/* Section 1: Trạng thái xuất bản */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-900 tracking-tight">
              Trạng thái xuất bản
            </h4>

            {/* Option 1: Xuất bản ngay */}
            <div
              onClick={() => handleStatusChange("publish_now")}
              className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                publishStatus === "publish_now"
                  ? "border-emerald-500 bg-white shadow-2xs ring-1 ring-emerald-500/30"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <div className="pt-0.5">
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                    publishStatus === "publish_now"
                      ? "border-[#007a48] bg-white"
                      : "border-slate-300 bg-white"
                  }`}
                >
                  {publishStatus === "publish_now" && (
                    <div className="w-2 h-2 rounded-full bg-[#007a48]" />
                  )}
                </div>
              </div>

              <div className="w-8 h-8 rounded-xl bg-slate-50 text-[#1e3a5f] flex items-center justify-center shrink-0">
                <Rocket className="w-4 h-4 stroke-[2]" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-slate-900">
                  Xuất bản ngay
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                  Chương trình sẽ hiển thị ngay trên website và ứng dụng.
                </div>
              </div>
            </div>

            {/* Option 2: Lưu nháp */}
            <div
              onClick={() => handleStatusChange("draft")}
              className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                publishStatus === "draft"
                  ? "border-emerald-500 bg-white shadow-2xs ring-1 ring-emerald-500/30"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <div className="pt-0.5">
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                    publishStatus === "draft"
                      ? "border-[#007a48] bg-white"
                      : "border-slate-300 bg-white"
                  }`}
                >
                  {publishStatus === "draft" && (
                    <div className="w-2 h-2 rounded-full bg-[#007a48]" />
                  )}
                </div>
              </div>

              <div className="w-8 h-8 rounded-xl bg-slate-50 text-[#1e3a5f] flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4 stroke-[2]" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-slate-900">
                  Lưu nháp
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                  Lưu để chỉnh sửa và xuất bản sau.
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Thời gian hiển thị */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-900 tracking-tight">
              Thời gian hiển thị
            </h4>

            {/* Option 1: Theo thời gian đã chọn */}
            <div
              onClick={() => handleDurationChange("custom")}
              className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                durationMode === "custom"
                  ? "border-emerald-500 bg-white shadow-2xs ring-1 ring-emerald-500/30"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <div className="pt-0.5">
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                    durationMode === "custom"
                      ? "border-[#007a48] bg-white"
                      : "border-slate-300 bg-white"
                  }`}
                >
                  {durationMode === "custom" && (
                    <div className="w-2 h-2 rounded-full bg-[#007a48]" />
                  )}
                </div>
              </div>

              <div className="w-8 h-8 rounded-xl bg-slate-50 text-[#1e3a5f] flex items-center justify-center shrink-0">
                <Calendar className="w-4 h-4 stroke-[2]" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-slate-900">
                  Theo thời gian đã chọn
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                  {startDate} - {endDate}
                </div>
              </div>
            </div>

            {/* Option 2: Hiển thị liên tục */}
            <div
              onClick={() => handleDurationChange("continuous")}
              className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                durationMode === "continuous"
                  ? "border-emerald-500 bg-white shadow-2xs ring-1 ring-emerald-500/30"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <div className="pt-0.5">
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                    durationMode === "continuous"
                      ? "border-[#007a48] bg-white"
                      : "border-slate-300 bg-white"
                  }`}
                >
                  {durationMode === "continuous" && (
                    <div className="w-2 h-2 rounded-full bg-[#007a48]" />
                  )}
                </div>
              </div>

              <div className="w-8 h-8 rounded-xl bg-slate-50 text-[#1e3a5f] flex items-center justify-center shrink-0">
                <InfinityIcon className="w-4 h-4 stroke-[2]" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-slate-900">
                  Hiển thị liên tục
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                  Không giới hạn thời gian (cho đến khi tạm dừng).
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Vị trí hiển thị */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-900 tracking-tight">
              Vị trí hiển thị
            </h4>

            <div className="space-y-2">
              {/* Item 1: Banner trang chủ */}
              <div
                onClick={() => togglePlacement("homeBanner")}
                className="flex items-start gap-2.5 cursor-pointer select-none"
              >
                <div
                  className={`w-4 h-4 rounded mt-0.5 transition-colors flex items-center justify-center shrink-0 ${
                    placements.homeBanner
                      ? "bg-[#007a48] border border-[#007a48] text-white"
                      : "border border-slate-300 bg-white"
                  }`}
                >
                  {placements.homeBanner && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 leading-tight">
                    Banner trang chủ
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5 leading-tight">
                    Hiển thị ở vị trí nổi bật trên trang chủ
                  </div>
                </div>
              </div>

              {/* Item 2: Trang danh sách trải nghiệm & tour */}
              <div
                onClick={() => togglePlacement("toursList")}
                className="flex items-start gap-2.5 cursor-pointer select-none"
              >
                <div
                  className={`w-4 h-4 rounded mt-0.5 transition-colors flex items-center justify-center shrink-0 ${
                    placements.toursList
                      ? "bg-[#007a48] border border-[#007a48] text-white"
                      : "border border-slate-300 bg-white"
                  }`}
                >
                  {placements.toursList && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 leading-tight">
                    Trang danh sách trải nghiệm & tour
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5 leading-tight">
                    Hiển thị trong danh sách tour, trải nghiệm
                  </div>
                </div>
              </div>

              {/* Item 3: Trang chi tiết trải nghiệm & tour */}
              <div
                onClick={() => togglePlacement("tourDetail")}
                className="flex items-start gap-2.5 cursor-pointer select-none"
              >
                <div
                  className={`w-4 h-4 rounded mt-0.5 transition-colors flex items-center justify-center shrink-0 ${
                    placements.tourDetail
                      ? "bg-[#007a48] border border-[#007a48] text-white"
                      : "border border-slate-300 bg-white"
                  }`}
                >
                  {placements.tourDetail && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 leading-tight">
                    Trang chi tiết trải nghiệm & tour
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5 leading-tight">
                    Hiển thị trong trang chi tiết
                  </div>
                </div>
              </div>

              {/* Item 4: Ứng dụng di động */}
              <div
                onClick={() => togglePlacement("mobileApp")}
                className="flex items-start gap-2.5 cursor-pointer select-none"
              >
                <div
                  className={`w-4 h-4 rounded mt-0.5 transition-colors flex items-center justify-center shrink-0 ${
                    placements.mobileApp
                      ? "bg-[#007a48] border border-[#007a48] text-white"
                      : "border border-slate-300 bg-white"
                  }`}
                >
                  {placements.mobileApp && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 leading-tight">
                    Ứng dụng di động
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5 leading-tight">
                    Hiển thị trên ứng dụng Stayea
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mẹo Box */}
          <div className="rounded-2xl border border-emerald-100 bg-[#f4fbf7] p-3 flex items-start gap-2.5 shadow-2xs">
            <Megaphone className="w-4 h-4 text-[#007a48] shrink-0 mt-0.5" />
            <div className="text-[11px] text-slate-600 leading-relaxed">
              <span className="font-bold text-[#007a48]">Mẹo: </span>
              Bạn có thể theo dõi hiệu quả chương trình trong{" "}
              <span className="font-semibold text-slate-800">báo cáo</span> sau khi xuất bản.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
