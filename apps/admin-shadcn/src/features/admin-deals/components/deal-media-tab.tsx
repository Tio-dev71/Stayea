"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import {
  UploadCloud,
  Check,
  Plus,
  X,
  Pencil,
  Play,
  Lightbulb,
  Link as LinkIcon,
  HelpCircle,
} from "lucide-react"

export interface GalleryImageItem {
  id: string
  url: string
  isFeatured?: boolean
}

export interface MediaTabState {
  featuredImage: string
  bannerTitle: string
  bannerSubtitle: string
  bannerDiscount: string
  galleryImages: GalleryImageItem[]
  videoMode: "upload" | "link"
  videoUrl?: string
  hasVideo: boolean
  channels: {
    website: boolean
    app: boolean
    email: boolean
    social: boolean
  }
}

const INITIAL_GALLERY: GalleryImageItem[] = [
  { id: "img-1", url: "/packages/tour-3-dao.jpg", isFeatured: true },
  { id: "img-2", url: "/phu-quoc/top-10-bai-bien.jpg" },
  { id: "img-3", url: "/packages/lan-ngam-san-ho.jpg" },
  { id: "img-4", url: "/packages/sunset-cruise.jpg" },
  { id: "img-5", url: "/stay/salinda-resort.jpg" },
  { id: "img-6", url: "/explore/an-gi.jpg" },
]

interface DealMediaTabProps {
  mediaState?: Partial<MediaTabState>
  onChange?: (updated: Partial<MediaTabState>) => void
}

export function DealMediaTab({ mediaState = {}, onChange }: DealMediaTabProps) {
  const [featuredImage, setFeaturedImage] = useState(
    mediaState.featuredImage ?? "/deals/banner-deals.jpg"
  )
  const [bannerTitle, setBannerTitle] = useState(
    mediaState.bannerTitle ?? "Ưu đãi hè Phú Quốc"
  )
  const [bannerSubtitle, setBannerSubtitle] = useState(
    mediaState.bannerSubtitle ?? "Khám phá thiên đường biển đảo"
  )
  const [bannerDiscount, setBannerDiscount] = useState(
    mediaState.bannerDiscount ?? "30%"
  )
  const [isEditingBanner, setIsEditingBanner] = useState(false)

  const [galleryImages, setGalleryImages] = useState<GalleryImageItem[]>(
    mediaState.galleryImages ?? INITIAL_GALLERY
  )

  const [videoMode, setVideoMode] = useState<"upload" | "link">(
    mediaState.videoMode ?? "upload"
  )
  const [videoLink, setVideoLink] = useState(mediaState.videoUrl ?? "")
  const [hasUploadedVideo, setHasUploadedVideo] = useState(true)

  const [channels, setChannels] = useState({
    website: mediaState.channels?.website ?? true,
    app: mediaState.channels?.app ?? true,
    email: mediaState.channels?.email ?? true,
    social: mediaState.channels?.social ?? true,
  })

  const fileInputRef = useRef<HTMLInputElement>(null)
  const galleryInputRef = useRef<HTMLInputElement>(null)

  const handleFeaturedFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setFeaturedImage(url)
      onChange?.({ featuredImage: url })
    }
  }

  const handleAddGalleryFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      const newItem: GalleryImageItem = {
        id: `gal-${Date.now()}`,
        url,
      }
      const nextList = [...galleryImages, newItem]
      setGalleryImages(nextList)
      onChange?.({ galleryImages: nextList })
    }
  }

  const handleDeleteGalleryItem = (id: string) => {
    const nextList = galleryImages.filter((item) => item.id !== id)
    setGalleryImages(nextList)
    onChange?.({ galleryImages: nextList })
  }

  const toggleChannel = (key: keyof typeof channels) => {
    const updated = { ...channels, [key]: !channels[key] }
    setChannels(updated)
    onChange?.({ channels: updated })
  }

  return (
    <div className="space-y-3">
      {/* 1. SECTION 1: HÌNH ẢNH ĐẠI DIỆN */}
      <div>
        <div className="flex items-center gap-1.5 mb-1.5">
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">
            Hình ảnh đại diện
          </h3>
          <HelpCircle className="w-3.5 h-3.5 text-slate-400 cursor-help" />
        </div>
        <p className="text-xs text-slate-500 -mt-1 mb-2">
          Tải lên hình ảnh nổi bật cho chương trình khuyến mãi (hiển thị trên danh sách và trang chi tiết).
        </p>

        {/* 3 Columns: Upload Dropzone + Banner Preview + Design Tips */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-stretch">
          {/* Col 1 (3 cols): Upload Box */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="md:col-span-3 rounded-2xl border-2 border-dashed border-slate-200 bg-white p-3.5 flex flex-col items-center justify-center text-center cursor-pointer hover:border-emerald-500 hover:bg-emerald-50/10 transition-all"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFeaturedFileChange}
            />
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#007a48] flex items-center justify-center mb-2 shadow-xs">
              <UploadCloud className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div className="text-xs font-bold text-[#007a48]">
              Tải ảnh lên
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              hoặc kéo thả
            </div>
            <div className="text-[10px] text-slate-400 mt-2 leading-relaxed">
              JPG, PNG, WebP. Tối đa 5MB
              <br />
              Tỷ lệ 16:9, khuyến nghị 1920x1080
            </div>
          </div>

          {/* Col 2 (6 cols): Banner Preview Card */}
          <div className="md:col-span-6 relative rounded-2xl overflow-hidden shadow-xs border border-slate-200 bg-slate-900 min-h-[145px] flex flex-col justify-between p-3.5 group">
            {/* Background Image */}
            <Image
              src={featuredImage}
              alt="Banner Khuyến Mãi"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {/* Dark gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/30 pointer-events-none" />

            {/* Top Right: Chỉnh sửa button */}
            <div className="relative z-10 flex justify-end">
              <button
                type="button"
                onClick={() => setIsEditingBanner(!isEditingBanner)}
                className="px-2.5 py-1 rounded-xl bg-white/95 hover:bg-white text-slate-800 text-[11px] font-semibold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer backdrop-blur-xs"
              >
                <Pencil className="w-3 h-3 text-slate-600" />
                <span>Chỉnh sửa</span>
              </button>
            </div>

            {/* Banner Inner Content */}
            <div className="relative z-10 space-y-2 mt-auto">
              <div>
                <h4 className="text-base sm:text-lg font-bold text-white tracking-tight drop-shadow-sm leading-tight">
                  {bannerTitle}
                </h4>
                <p className="text-[11px] text-slate-200 font-medium drop-shadow-xs mt-0.5">
                  {bannerSubtitle}
                </p>
              </div>

              {/* Bottom row: Discount tag + Book now button */}
              <div className="flex items-center justify-between gap-3 pt-0.5">
                {/* Giảm đến 30% badge */}
                <div className="px-2.5 py-1 rounded-xl bg-white shadow-md flex items-center gap-1.5">
                  <span className="text-[10px] font-semibold text-rose-500 uppercase tracking-tight">
                    Giảm đến
                  </span>
                  <span className="text-sm font-black text-rose-600 leading-none">
                    {bannerDiscount}
                  </span>
                </div>

                {/* Đặt ngay button */}
                <button
                  type="button"
                  className="px-3.5 py-1.5 rounded-full bg-[#f9b800] hover:bg-amber-400 text-slate-900 font-bold text-[11px] shadow-sm transition-transform active:scale-95 flex items-center gap-1 cursor-pointer"
                >
                  <span>Đặt ngay</span>
                  <span className="text-xs">→</span>
                </button>
              </div>
            </div>

            {/* Editing overlay if toggled */}
            {isEditingBanner && (
              <div className="absolute inset-0 z-20 bg-slate-950/85 p-3 flex flex-col justify-between animate-in fade-in duration-150">
                <div className="flex items-center justify-between text-white text-xs font-bold border-b border-white/20 pb-1.5">
                  <span>Chỉnh sửa nội dung Banner</span>
                  <button
                    type="button"
                    onClick={() => setIsEditingBanner(false)}
                    className="text-white/70 hover:text-white"
                  >
                    ✕
                  </button>
                </div>
                <div className="space-y-1.5 py-1">
                  <input
                    type="text"
                    value={bannerTitle}
                    onChange={(e) => setBannerTitle(e.target.value)}
                    placeholder="Tiêu đề banner"
                    className="w-full px-2.5 py-1 text-xs rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none"
                  />
                  <input
                    type="text"
                    value={bannerSubtitle}
                    onChange={(e) => setBannerSubtitle(e.target.value)}
                    placeholder="Phụ đề banner"
                    className="w-full px-2.5 py-1 text-xs rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none"
                  />
                  <input
                    type="text"
                    value={bannerDiscount}
                    onChange={(e) => setBannerDiscount(e.target.value)}
                    placeholder="Giảm giá (ví dụ: 30%)"
                    className="w-full px-2.5 py-1 text-xs rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setIsEditingBanner(false)}
                    className="px-3 py-1 bg-[#007a48] text-white text-[11px] font-bold rounded-lg cursor-pointer"
                  >
                    Xong
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Col 3 (3 cols): Gợi ý thiết kế Box */}
          <div className="md:col-span-3 rounded-2xl border border-emerald-100 bg-[#f4fbf7] p-3.5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-[#007a48] font-bold text-xs mb-2">
                <Lightbulb className="w-3.5 h-3.5" />
                <span>Gợi ý thiết kế</span>
              </div>
              <ul className="space-y-1.5 text-[11px] text-slate-600">
                <li className="flex items-start gap-1.5">
                  <Check className="w-3 h-3 text-[#007a48] stroke-[2.5] mt-0.5 shrink-0" />
                  <span>Sử dụng hình ảnh sắc nét, rực rỡ</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Check className="w-3 h-3 text-[#007a48] stroke-[2.5] mt-0.5 shrink-0" />
                  <span>Ưu tiên ảnh có chữ ngắn gọn, nổi bật</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Check className="w-3 h-3 text-[#007a48] stroke-[2.5] mt-0.5 shrink-0" />
                  <span>Tỷ lệ ảnh 16:9 là tối ưu nhất</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Check className="w-3 h-3 text-[#007a48] stroke-[2.5] mt-0.5 shrink-0" />
                  <span>Tránh che mất chủ thể bằng chữ</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Check className="w-3 h-3 text-[#007a48] stroke-[2.5] mt-0.5 shrink-0" />
                  <span>Có thể thêm logo Stayea để tăng nhận diện</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* 2. SECTION 2: THƯ VIỆN HÌNH ẢNH (TÙY CHỌN) */}
      <div>
        <div className="mb-1.5">
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">
            Thư viện hình ảnh (tùy chọn)
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Thêm nhiều hình ảnh để giới thiệu chương trình (tối đa 10 ảnh).
          </p>
        </div>

        {/* Gallery Thumbnails Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
          {galleryImages.map((item) => (
            <div
              key={item.id}
              className="relative aspect-video sm:h-[70px] rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 group shadow-2xs"
            >
              <Image
                src={item.url}
                alt="Ảnh thư viện"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 25vw, 15vw"
              />

              {/* Close delete button */}
              <button
                type="button"
                onClick={() => handleDeleteGalleryItem(item.id)}
                className="absolute top-1.5 right-1.5 w-4.5 h-4.5 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white flex items-center justify-center text-[10px] transition-colors cursor-pointer"
                aria-label="Xóa ảnh"
              >
                <X className="w-2.5 h-2.5" />
              </button>

              {/* Featured Badge for first photo */}
              {item.isFeatured && (
                <div className="absolute bottom-1.5 left-1.5 right-1.5 py-0.5 rounded-md bg-[#007a48] text-white text-[9px] font-semibold text-center shadow-xs">
                  Ảnh đại diện
                </div>
              )}
            </div>
          ))}

          {/* Add photo slot */}
          <div
            onClick={() => galleryInputRef.current?.click()}
            className="aspect-video sm:h-[70px] rounded-2xl border-2 border-dashed border-emerald-400/60 bg-emerald-50/20 hover:bg-emerald-50/40 transition-colors flex flex-col items-center justify-center cursor-pointer text-center group"
          >
            <input
              ref={galleryInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAddGalleryFile}
            />
            <Plus className="w-4 h-4 text-[#007a48] stroke-[2.5] group-hover:scale-110 transition-transform" />
            <span className="text-[11px] font-bold text-[#007a48] mt-0.5">
              Thêm ảnh
            </span>
          </div>
        </div>
      </div>

      {/* 3. SECTION 3: VIDEO GIỚI THIỆU & KÊNH TRUYỀN THÔNG */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start pt-0.5">
        {/* Col 1 (7 cols): Video giới thiệu */}
        <div className="md:col-span-7 space-y-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Video giới thiệu (tùy chọn)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Thêm video ngắn để thu hút khách hàng (YouTube, Vimeo hoặc tải trực tiếp).
            </p>
          </div>

          {/* Video Mode Switch (2 buttons) */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setVideoMode("upload")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                videoMode === "upload"
                  ? "bg-[#e8f7ee] border border-emerald-300/60 text-[#007a48] shadow-2xs"
                  : "bg-slate-50 border border-slate-200/80 text-slate-600 hover:text-slate-900"
              }`}
            >
              <UploadCloud className="w-3.5 h-3.5 text-[#007a48]" />
              <span>Tải video lên</span>
            </button>

            <button
              type="button"
              onClick={() => setVideoMode("link")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                videoMode === "link"
                  ? "bg-[#e8f7ee] border border-emerald-300/60 text-[#007a48] shadow-2xs font-bold"
                  : "bg-slate-50 border border-slate-200/80 text-slate-600 hover:text-slate-900"
              }`}
            >
              <LinkIcon className="w-3.5 h-3.5 text-slate-500" />
              <span>Liên kết YouTube / Vimeo</span>
            </button>
          </div>

          {/* Video Content depending on Mode */}
          {videoMode === "upload" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-0.5 items-stretch">
              {/* Dropzone */}
              <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-2.5 flex flex-col items-center justify-center text-center cursor-pointer hover:border-emerald-500 hover:bg-emerald-50/10 transition-all h-[130px]">
                <UploadCloud className="w-7 h-7 text-[#1e3a5f] stroke-[1.8] mb-1" />
                <div className="text-xs font-bold text-slate-800 leading-tight">
                  Tải video lên hoặc kéo thả
                </div>
                <div className="text-[10px] text-slate-400 mt-1 leading-snug">
                  MP4, MOV. Tối đa 100MB. Thời lượng tối đa 3 phút.
                </div>
              </div>

              {/* Uploaded Video Preview */}
              {hasUploadedVideo ? (
                <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden flex flex-col shadow-2xs h-[130px]">
                  <div className="relative h-[82px] w-full overflow-hidden bg-slate-900 shrink-0">
                    <Image
                      src="/stay/salinda-resort.jpg"
                      alt="Video thumbnail"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                    {/* Play button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-7 h-7 rounded-full bg-slate-950/65 backdrop-blur-xs text-white flex items-center justify-center shadow-md">
                        <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
                      </div>
                    </div>
                    {/* Remove video button */}
                    <button
                      type="button"
                      onClick={() => setHasUploadedVideo(false)}
                      className="absolute top-1.5 right-1.5 w-4.5 h-4.5 rounded-full bg-slate-900/75 hover:bg-slate-900 text-white flex items-center justify-center text-[10px] transition-colors cursor-pointer"
                      aria-label="Xóa video"
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </div>

                  <div className="px-2.5 py-1.5 min-w-0 flex flex-col justify-center flex-1">
                    <div className="text-xs font-bold text-slate-900 truncate leading-tight">
                      khuyen-mai-phu-quoc.mp4
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5 leading-none">
                      0:45 - 28 MB
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-center text-[11px] text-slate-400 italic h-[130px]">
                  Chưa có video được tải lên
                </div>
              )}
            </div>
          ) : (
            <div className="p-3 rounded-2xl border border-slate-200 bg-white space-y-2">
              <label className="text-xs font-bold text-slate-800">
                Đường dẫn video (YouTube / Vimeo)
              </label>
              <input
                type="url"
                value={videoLink}
                onChange={(e) => setVideoLink(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          )}
        </div>

        {/* Col 2 (5 cols): Kênh truyền thông */}
        <div className="md:col-span-5 space-y-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Kênh truyền thông
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Chọn kênh sẽ hiển thị chương trình này.
            </p>
          </div>

          <div className="space-y-1.5 pt-0.5">
            {/* Channel 1: Website Stayea */}
            <div
              onClick={() => toggleChannel("website")}
              className="flex items-start gap-2.5 cursor-pointer select-none"
            >
              <div
                className={`w-4 h-4 rounded mt-0.5 transition-colors flex items-center justify-center shrink-0 ${
                  channels.website
                    ? "bg-[#007a48] border border-[#007a48] text-white"
                    : "border border-slate-300 bg-white"
                }`}
              >
                {channels.website && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-900 leading-tight">
                  Website Stayea
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5 leading-tight">
                  Hiển thị trên danh sách ưu đãi và trang chi tiết
                </div>
              </div>
            </div>

            {/* Channel 2: Ứng dụng di động (App) */}
            <div
              onClick={() => toggleChannel("app")}
              className="flex items-start gap-2.5 cursor-pointer select-none"
            >
              <div
                className={`w-4 h-4 rounded mt-0.5 transition-colors flex items-center justify-center shrink-0 ${
                  channels.app
                    ? "bg-[#007a48] border border-[#007a48] text-white"
                    : "border border-slate-300 bg-white"
                }`}
              >
                {channels.app && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-900 leading-tight">
                  Ứng dụng di động (App)
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5 leading-tight">
                  Hiển thị trên ứng dụng Stayea
                </div>
              </div>
            </div>

            {/* Channel 3: Email marketing */}
            <div
              onClick={() => toggleChannel("email")}
              className="flex items-start gap-2.5 cursor-pointer select-none"
            >
              <div
                className={`w-4 h-4 rounded mt-0.5 transition-colors flex items-center justify-center shrink-0 ${
                  channels.email
                    ? "bg-[#007a48] border border-[#007a48] text-white"
                    : "border border-slate-300 bg-white"
                }`}
              >
                {channels.email && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-900 leading-tight">
                  Email marketing
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5 leading-tight">
                  Gửi email đến khách hàng tiềm năng
                </div>
              </div>
            </div>

            {/* Channel 4: Mạng xã hội */}
            <div
              onClick={() => toggleChannel("social")}
              className="flex items-start gap-2.5 cursor-pointer select-none"
            >
              <div
                className={`w-4 h-4 rounded mt-0.5 transition-colors flex items-center justify-center shrink-0 ${
                  channels.social
                    ? "bg-[#007a48] border border-[#007a48] text-white"
                    : "border border-slate-300 bg-white"
                }`}
              >
                {channels.social && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-900 leading-tight">
                  Mạng xã hội
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5 leading-tight">
                  Facebook, Instagram, Zalo...
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
