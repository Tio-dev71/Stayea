"use client"

import { useState, useRef, useEffect } from "react"
import {
  Bold,
  Building2,
  Car,
  CheckCircle2,
  Compass,
  Crown,
  Eye,
  FileEdit,
  FolderUp,
  Image as ImageIcon,
  Info,
  Italic,
  List,
  ListOrdered,
  Loader2,
  MapPin,
  Plus,
  Sparkles,
  Trash2,
  X,
} from "lucide-react"
import { toast } from "sonner"
import { stayeaApi } from "@/lib/stayea-api-service"
import type { BusinessType, PartnerServiceData } from "../types"
import { RichTextPreview } from "./rich-text-preview"

/**
 * Converts Google Drive sharing link to a direct high-speed image CDN link
 */
function parseDriveUrl(input: string): { convertedUrl: string; isDrive: boolean } {
  if (!input) return { convertedUrl: "", isDrive: false }
  const trimmed = input.trim()

  if (trimmed.includes("drive.google.com") || trimmed.includes("docs.google.com")) {
    const fileIdMatch =
      trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) ||
      trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/)

    if (fileIdMatch && fileIdMatch[1]) {
      return {
        convertedUrl: `https://lh3.googleusercontent.com/d/${fileIdMatch[1]}`,
        isDrive: true,
      }
    }
  }

  return { convertedUrl: trimmed, isDrive: false }
}

const TEMPLATES: Partial<Record<BusinessType, { label: string; text: string }>> = {
  transport: {
    label: "Mẫu cho thuê xe tự lái / Vận chuyển",
    text: `### 🚗 Thông tin phương tiện & Trang bị
- **Đời xe**: Đời mới 2024 - 2025, động cơ êm ái, bảo dưỡng định kỳ
- **Tình trạng**: Giao xe sạch sẽ, lốp mới, phanh an toàn tuyệt đối
- **Phụ kiện kèm theo**: 02 nón bảo hiểm cao cấp, 02 áo mưa tiện lợi, giá đỡ điện thoại

### 📋 Chính sách & Thủ tục bàn giao
- **Thủ tục đơn giản**: Chỉ cần CCCD / Hộ chiếu gốc và Bằng lái xe hợp lệ
- **Giao nhận tận nơi**: Miễn phí tại Sân bay Phú Quốc, Cảng Bãi Vòng hoặc Khách sạn trung tâm Dương Đông
- **Thời gian thuê**: Tính tròn 24h / ngày kể từ lúc nhận xe

> 💡 **Lưu ý**: Khách hàng đổ xăng theo mức ban đầu khi nhận xe. Đội xe hỗ trợ kỹ thuật và cứu hộ 24/7 trên toàn đảo Phú Quốc.`,
  },
  homestay: {
    label: "Mẫu Homestay / Villa nghỉ dưỡng",
    text: `### 🌿 Không gian & Tiện ích nổi bật
- **Phòng ngủ**: Nệm cao cấp tiêu chuẩn resort, máy lạnh Inverter, ban công thoáng mát
- **Bếp gia đình**: Đầy đủ bếp từ, tủ lạnh lớn, lò vi sóng, dụng cụ nấu ăn và gia vị cơ bản
- **Tiện ích chung**: Hồ bơi ngoài trời xanh mát, sân nướng BBQ tiệc tối, Wifi cáp quang tốc độ cao

### ⏰ Giờ giấc & Quy định lưu trú
- **Check-in**: Từ 14:00 | **Check-out**: Trước 12:00 ngày hôm sau
- Hỗ trợ gửi hành lý miễn phí nếu quý khách đến sớm hoặc có chuyến bay muộn

> 💡 **Lưu ý**: Giữ yên tĩnh chung sau 22:00. Miễn phí trà, cà phê và nước suối chào đón khi nhận phòng.`,
  },
  tour: {
    label: "Mẫu Tour cano đảo / Trải nghiệm",
    text: `### 🏝️ Lịch trình trải nghiệm đặc sắc
- **08:30**: Xe ô tô đưa đón tận nơi tại sảnh khách sạn Dương Đông
- **09:30**: Lên Cano cao tốc khám phá 3 hòn đảo thiên đường: Hòn Mây Rút, Hòn Gầm Ghì, Hòn Móng Tay
- **12:00**: Dùng bữa trưa hải sản tươi sống 8 món đậm đà phong vị Phú Quốc
- **14:00**: Trải nghiệm lặn ngắm san hô tự nhiên, chèo ván SUP và quay chụp Flycam
- **16:30**: Cano cập cảng An Thới, xe đưa quý khách về khách sạn an toàn

### ✅ Giá tour đã bao gồm
- Xe du lịch đời mới & Cano cao tốc an toàn
- Bữa trưa hải sản tiêu chuẩn
- Kính lặn, ống thở, áo phao & dịch vụ Flycam chụp ảnh
- Hướng dẫn viên địa phương nhiệt tình + Bảo hiểm du lịch trọn gói`,
  },
}

interface PartnerCreateServiceModalProps {
  isOpen: boolean
  onClose: () => void
  businessType: BusinessType
  onSaveService: (newService: Omit<PartnerServiceData, "id" | "partnerId">) => void
  serviceToEdit?: PartnerServiceData | null
  onUpdateService?: (serviceId: string, updatedData: Partial<PartnerServiceData>) => Promise<boolean> | void
}

export function PartnerCreateServiceModal({
  isOpen,
  onClose,
  businessType,
  onSaveService,
  serviceToEdit,
  onUpdateService,
}: PartnerCreateServiceModalProps) {
  const isEditing = Boolean(serviceToEdit)

  // Basic Info
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [descTab, setDescTab] = useState<"edit" | "preview">("edit")
  const [location, setLocation] = useState("Dương Đông, Phú Quốc")
  const [price, setPrice] = useState("1500000")
  const [originalPrice, setOriginalPrice] = useState("1800000")
  const [unit, setUnit] = useState(
    businessType === "transport" ? "ngày" : businessType === "tour" ? "vé/khách" : "đêm"
  )

  // Capacity / Total Units in Inventory
  const [totalUnits, setTotalUnits] = useState(
    businessType === "transport" ? 5 : businessType === "tour" ? 20 : 1
  )

  // Multi-Image Gallery State
  const [images, setImages] = useState<string[]>([])
  const [inputUrl, setInputUrl] = useState("")
  const [isDriveDetected, setIsDriveDetected] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  // Specific Attributes
  const [bedrooms, setBedrooms] = useState(2)
  const [maxGuests, setMaxGuests] = useState(4)
  const [vehicleType, setVehicleType] = useState("7 Chỗ (MPV)")
  const [transmission, setTransmission] = useState("Số tự động (AT)")
  const [hasDriver, setHasDriver] = useState(false)
  const [duration, setDuration] = useState("8 tiếng")
  const [schedule, setSchedule] = useState("08:30 - 16:30")

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Initialize or reset form state when modal opens or serviceToEdit changes
  useEffect(() => {
    if (serviceToEdit) {
      setTitle(serviceToEdit.title || "")
      setDescription(serviceToEdit.description || "")
      setLocation(serviceToEdit.location || "Dương Đông, Phú Quốc")
      setPrice(serviceToEdit.price || "1500000")
      setOriginalPrice(serviceToEdit.originalPrice || "")
      setUnit(serviceToEdit.unit || (businessType === "transport" ? "ngày" : "đêm"))
      setImages(
        Array.isArray(serviceToEdit.images) && serviceToEdit.images.length > 0
          ? serviceToEdit.images
          : []
      )
      const attrs = serviceToEdit.attributes || {}
      setTotalUnits(Number(attrs.totalUnits) || Number(attrs.capacity) || (businessType === "transport" ? 5 : 1))
      if (attrs.bedrooms) setBedrooms(Number(attrs.bedrooms))
      if (attrs.maxGuests) setMaxGuests(Number(attrs.maxGuests))
      if (attrs.vehicleType) setVehicleType(attrs.vehicleType)
      if (attrs.transmission) setTransmission(attrs.transmission)
      if (attrs.hasDriver !== undefined) setHasDriver(Boolean(attrs.hasDriver))
      if (attrs.duration) setDuration(attrs.duration)
      if (attrs.schedule) setSchedule(attrs.schedule)
    } else {
      // Default initial images
      const defaultImg =
        businessType === "transport"
          ? "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&q=80"
          : businessType === "tour"
          ? "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80"
          : "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80"

      setTitle("")
      setDescription("")
      setLocation("Dương Đông, Phú Quốc")
      setPrice(businessType === "transport" ? "150000" : businessType === "tour" ? "850000" : "1500000")
      setOriginalPrice("")
      setUnit(businessType === "transport" ? "ngày" : businessType === "tour" ? "vé/khách" : "đêm")
      setTotalUnits(businessType === "transport" ? 5 : businessType === "tour" ? 20 : 1)
      setImages([defaultImg])
      setInputUrl("")
      setIsDriveDetected(false)
    }
  }, [serviceToEdit, businessType, isOpen])

  if (!isOpen) return null

  // Image actions
  const handleAddUrl = () => {
    if (!inputUrl.trim()) return
    const { convertedUrl } = parseDriveUrl(inputUrl.trim())
    if (images.includes(convertedUrl)) {
      toast.error("Hình ảnh này đã có trong danh sách.")
      return
    }
    if (images.length >= 10) {
      toast.error("Tối đa 10 hình ảnh cho mỗi bài đăng.")
      return
    }
    setImages((prev) => [...prev, convertedUrl])
    setInputUrl("")
    setIsDriveDetected(false)
    toast.success("Đã thêm ảnh vào bộ sưu tập!")
  }

  const handleMakeCover = (index: number) => {
    if (index === 0) return
    setImages((prev) => {
      const copy = [...prev]
      const selected = copy[index]
      if (!selected) return prev
      copy.splice(index, 1)
      return [selected, ...copy]
    })
    toast.success("Đã đặt làm ảnh bìa đại diện!")
  }

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== index))
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)
    const newAddedUrls: string[] = []

    for (let i = 0; i < files.length; i++) {
      if (images.length + newAddedUrls.length >= 10) {
        toast.warning("Đã đạt giới hạn tối đa 10 ảnh.")
        break
      }
      const file = files[i]
      if (!file) continue
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`Tệp ${file.name} vượt quá 10MB.`)
        continue
      }

      try {
        const uploadedUrl = await stayeaApi.uploadImage(file)
        if (uploadedUrl) {
          newAddedUrls.push(uploadedUrl)
        } else {
          // Read local base64 fallback
          await new Promise<void>((resolve) => {
            const reader = new FileReader()
            reader.onload = () => {
              if (typeof reader.result === "string") {
                newAddedUrls.push(reader.result)
              }
              resolve()
            }
            reader.onerror = () => resolve()
            reader.readAsDataURL(file)
          })
        }
      } catch {
        // Fallback
        await new Promise<void>((resolve) => {
          const reader = new FileReader()
          reader.onload = () => {
            if (typeof reader.result === "string") {
              newAddedUrls.push(reader.result)
            }
            resolve()
          }
          reader.onerror = () => resolve()
          reader.readAsDataURL(file)
        })
      }
    }

    if (newAddedUrls.length > 0) {
      setImages((prev) => [...prev, ...newAddedUrls])
      toast.success(`Đã thêm ${newAddedUrls.length} ảnh từ thiết bị!`)
    }
    setIsUploading(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // Markdown Toolbar Insertion Helpers
  const insertFormatting = (prefix: string, suffix: string = "") => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = description.substring(start, end)
    const replacement = `${prefix}${selectedText || "văn bản"}${suffix}`

    const newDescription =
      description.substring(0, start) + replacement + description.substring(end)

    setDescription(newDescription)

    // Restore focus and selection
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + (selectedText.length || "văn bản".length)
      )
    }, 50)
  }

  const applyTemplate = () => {
    const tpl = TEMPLATES[businessType]
    if (tpl) {
      setDescription(tpl.text)
      toast.success(`Đã áp dụng ${tpl.label}`)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (images.length === 0) {
      toast.error("Vui lòng thêm ít nhất 1 hình ảnh đại diện cho dịch vụ.")
      return
    }

    const serviceType =
      businessType === "transport"
        ? "transport"
        : businessType === "tour"
        ? "experience"
        : "stay"

    const sanitizedTotalUnits = Math.max(1, Number(totalUnits) || 1)

    const attributes: PartnerServiceData["attributes"] = {
      totalUnits: sanitizedTotalUnits,
      capacity: sanitizedTotalUnits,
      ...(businessType === "homestay"
        ? {
            bedrooms,
            maxGuests,
            amenities: ["Hồ bơi riêng", "Bếp nấu gia đình", "Wifi cáp quang"],
          }
        : businessType === "transport"
        ? {
            vehicleType,
            transmission,
            hasDriver,
            amenities: ["Giao nhận xe sân bay", "Bảo hiểm 2 chiều", "Camera hành trình"],
          }
        : {
            duration,
            schedule,
            amenities: ["Canô cao tốc", "Ăn trưa hải sản", "Lặn ngắm san hô"],
          }),
    }

    if (isEditing && serviceToEdit && onUpdateService) {
      await onUpdateService(serviceToEdit.id, {
        title,
        description,
        location,
        price,
        originalPrice: originalPrice || undefined,
        unit,
        images,
        attributes,
      })
      onClose()
      return
    }

    onSaveService({
      serviceType,
      title,
      description,
      location,
      price,
      originalPrice: originalPrice || undefined,
      unit,
      images,
      attributes,
      status: "active",
    })

    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-emerald-900/60 rounded-2xl shadow-2xl p-5 sm:p-7 text-white my-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              {businessType === "transport" ? (
                <Car className="w-5 h-5" />
              ) : businessType === "tour" ? (
                <Compass className="w-5 h-5" />
              ) : (
                <Building2 className="w-5 h-5" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span>{isEditing ? "Chỉnh Sửa Dịch Vụ" : "Thêm Dịch Vụ Mới"}</span>
                {isEditing && (
                  <span className="text-[10px] font-semibold uppercase tracking-wider bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                    Cập nhật
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {businessType === "transport"
                  ? "Khai báo đội xe, số lượng xe sẵn sàng phục vụ và chính sách thuê"
                  : businessType === "tour"
                  ? "Khai báo tour đảo, số chỗ tối đa mỗi ngày và lịch trình"
                  : "Khai báo homestay/villa, số phòng cùng hạng và tiện ích"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1.5">
              Tên dịch vụ / Xe / Phòng <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder={
                businessType === "transport"
                  ? "Ví dụ: Xe Máy Honda Wave Alpha 110cc Tiết Kiệm Xăng"
                  : businessType === "tour"
                  ? "Ví dụ: Tour 4 Đảo Cano Cao Tốc & Lặn Ngắm San Hô Tự Nhiên"
                  : "Ví dụ: Villa Vườn Nhiệt Đới 2 Phòng Ngủ View Biển"
              }
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* SỨC CHỨA & QUẢN LÝ SỐ LƯỢNG TỒN KHO (Crucial Feature requested by User) */}
          <div className="p-4 rounded-xl bg-emerald-950/25 border border-emerald-800/40 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Số lượng tồn kho & Sức chứa sẵn sàng phục vụ</span>
              </label>
              <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                Tự động trừ tồn kho khi khách đặt
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
              <div className="sm:col-span-1">
                <label className="block text-xs text-slate-300 mb-1 font-medium">
                  {businessType === "transport"
                    ? "Tổng số xe sẵn có trong kho:"
                    : businessType === "tour"
                    ? "Số vé tối đa mỗi ngày:"
                    : "Số phòng cùng hạng sẵn có:"}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    max={500}
                    required
                    value={totalUnits}
                    onChange={(e) => setTotalUnits(Math.max(1, Number(e.target.value)))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-emerald-700/60 text-base font-bold text-emerald-300 text-center focus:outline-none focus:border-emerald-400"
                  />
                  <span className="text-xs font-semibold text-slate-400 shrink-0">
                    {businessType === "transport" ? "xe" : businessType === "tour" ? "vé/chỗ" : "phòng"}
                  </span>
                </div>
              </div>

              <div className="sm:col-span-2 text-xs text-slate-300 bg-slate-900/60 p-3 rounded-xl border border-slate-800 leading-relaxed">
                💡 <strong>Đối tác không cần đăng nhiều bài trùng lặp!</strong>
                <p className="text-[11px] text-slate-400 mt-1">
                  Ví dụ: Bạn có <strong>{totalUnits || 5} chiếc xe</strong> cùng loại. Chỉ cần đăng 1 bài duy nhất và đặt số lượng là <strong>{totalUnits || 5}</strong>. Khi khách thứ nhất đặt xe ngày 15/11, hệ thống hiển thị còn <strong>{(totalUnits || 5) - 1} xe</strong> để đón tiếp tiếp tục khách thứ 2, thứ 3... Cho đến khi hết sạch {totalUnits || 5} xe mới tự động báo kín lịch.
                </p>
              </div>
            </div>
          </div>

          {/* Pricing & Unit Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1">
                Giá niêm yết (₫) <span className="text-rose-400">*</span>
              </label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-sm text-white font-medium focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Giá gốc chưa giảm (₫)
              </label>
              <input
                type="number"
                placeholder="Để trống nếu không giảm"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Đơn vị tính
              </label>
              <input
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1">
              Vị trí / Địa chỉ giao nhận <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Ví dụ: 124 Trần Hưng Đạo, Dương Đông, Phú Quốc hoặc Giao nhận tận nơi"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* BỘ SƯU TẬP ĐA HÌNH ẢNH (Multi-Image Gallery Album) */}
          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80 space-y-3.5">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-emerald-400" />
                <span>Bộ sưu tập hình ảnh ({images.length}/10 ảnh)</span>
              </label>
              <span className="text-[11px] text-slate-400">
                Ảnh đầu tiên (👑) sẽ là ảnh bìa đại diện
              </span>
            </div>

            {/* Input URL & Upload Action Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
              <div className="sm:col-span-3 flex gap-2">
                <input
                  type="text"
                  placeholder="Dán link ảnh hoặc link Google Drive..."
                  value={inputUrl}
                  onChange={(e) => {
                    setInputUrl(e.target.value)
                    const { isDrive } = parseDriveUrl(e.target.value)
                    setIsDriveDetected(isDrive)
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      handleAddUrl()
                    }
                  }}
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="button"
                  onClick={handleAddUrl}
                  className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1 shrink-0 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Thêm ảnh</span>
                </button>
              </div>

              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  disabled={isUploading || images.length >= 10}
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-full min-h-[38px] px-3 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 border border-slate-600 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                      <span>Đang tải...</span>
                    </>
                  ) : (
                    <>
                      <FolderUp className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Tải ảnh từ máy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {isDriveDetected && (
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/40 p-2 rounded-lg border border-emerald-800/40">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Đã nhận diện link Google Drive! Nhấn &quot;Thêm ảnh&quot; để tự động nạp ảnh qua CDN tốc độ cao.</span>
              </div>
            )}

            {/* Gallery Thumbnails Grid */}
            {images.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2.5 pt-1">
                {images.map((img, idx) => {
                  const isCover = idx === 0
                  return (
                    <div
                      key={idx}
                      className={`group relative rounded-xl overflow-hidden aspect-4/3 bg-slate-900 border transition-all ${
                        isCover
                          ? "border-emerald-500 ring-2 ring-emerald-500/40 shadow-lg"
                          : "border-slate-700 hover:border-slate-500"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Ảnh ${idx + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80"
                        }}
                      />

                      {/* Cover Badge */}
                      {isCover && (
                        <div className="absolute top-1.5 left-1.5 bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm flex items-center gap-1">
                          <Crown className="w-2.5 h-2.5" />
                          <span>Ảnh bìa</span>
                        </div>
                      )}

                      {/* Overlay Actions on Hover */}
                      <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-1">
                        {!isCover && (
                          <button
                            type="button"
                            onClick={() => handleMakeCover(idx)}
                            className="px-2 py-1 rounded bg-emerald-600/90 hover:bg-emerald-500 text-white text-[10px] font-medium flex items-center gap-1 transition-colors cursor-pointer w-full justify-center"
                          >
                            <Crown className="w-3 h-3" />
                            <span>Đặt làm bìa</span>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="px-2 py-1 rounded bg-rose-600/90 hover:bg-rose-500 text-white text-[10px] font-medium flex items-center gap-1 transition-colors cursor-pointer w-full justify-center"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Xóa ảnh</span>
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="py-6 text-center text-xs text-slate-500 border border-dashed border-slate-700 rounded-xl">
                Chưa có hình ảnh nào. Dán link hoặc bấm &quot;Tải ảnh từ máy&quot; để thêm bộ sưu tập.
              </div>
            )}
          </div>

          {/* Business Type Specific Attributes */}
          {businessType === "transport" && (
            <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-900/40 space-y-3">
              <div className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                Đặc tính Phương tiện & Hộp số
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Phân loại xe</label>
                  <select
                    value={vehicleType}
                    onChange={(e) => setVehicleType(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white"
                  >
                    <option value="Xe máy tay ga">Xe máy tay ga (Vision/AirBlade)</option>
                    <option value="Xe máy số">Xe máy số (Wave Alpha/Blade)</option>
                    <option value="4 Chỗ Sedan">4 Chỗ Sedan (Vios/Accent)</option>
                    <option value="7 Chỗ (MPV)">7 Chỗ MPV (Xpander/Veloz)</option>
                    <option value="7 Chỗ SUV">7 Chỗ SUV (Fortuner/Everest)</option>
                    <option value="16 Chỗ Ford Transit">16 Chỗ (Transit/Solati)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Loại truyền động</label>
                  <select
                    value={transmission}
                    onChange={(e) => setTransmission(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white"
                  >
                    <option value="Số tự động (AT)">Số tự động (AT)</option>
                    <option value="Số sàn (MT)">Số sàn (MT)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Hình thức</label>
                  <select
                    value={hasDriver ? "yes" : "no"}
                    onChange={(e) => setHasDriver(e.target.value === "yes")}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white"
                  >
                    <option value="no">Khách tự lái</option>
                    <option value="yes">Có tài xế riêng phục vụ</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {businessType === "homestay" && (
            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-900/40 space-y-3">
              <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Đặc tính Homestay / Villa
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Số phòng ngủ</label>
                  <input
                    type="number"
                    min={1}
                    value={bedrooms}
                    onChange={(e) => setBedrooms(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Số khách tối đa</label>
                  <input
                    type="number"
                    min={1}
                    value={maxGuests}
                    onChange={(e) => setMaxGuests(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {businessType === "tour" && (
            <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-900/40 space-y-3">
              <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Đặc tính Tour Trải Nghiệm
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Thời lượng tour</label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="Ví dụ: 8 tiếng hoặc 1 ngày"
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Khung giờ khởi hành</label>
                  <input
                    type="text"
                    value={schedule}
                    onChange={(e) => setSchedule(e.target.value)}
                    placeholder="Ví dụ: 08:30 - 16:30 hàng ngày"
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TRÌNH SOẠN THẢO MÔ TẢ RICH TEXT & MARKDOWN TOOLBAR (Crucial Feature requested by User) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <label className="text-xs font-semibold text-slate-200">
                Mô tả chi tiết bài viết (Hỗ trợ định dạng in đậm, nghiêng, danh sách)
              </label>

              {/* Edit / Preview Tabs */}
              <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-lg border border-slate-700">
                <button
                  type="button"
                  onClick={() => setDescTab("edit")}
                  className={`px-2.5 py-1 rounded text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                    descTab === "edit"
                      ? "bg-emerald-600 text-white"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <FileEdit className="w-3 h-3" />
                  <span>Soạn thảo</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDescTab("preview")}
                  className={`px-2.5 py-1 rounded text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                    descTab === "preview"
                      ? "bg-emerald-600 text-white"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Eye className="w-3 h-3" />
                  <span>Xem trước ({description ? "Đã định dạng" : "Trống"})</span>
                </button>
              </div>
            </div>

            {/* Markdown Toolbar */}
            {descTab === "edit" && (
              <div className="flex items-center gap-1.5 p-2 bg-slate-800/90 border border-slate-700 rounded-t-xl flex-wrap">
                <button
                  type="button"
                  onClick={() => insertFormatting("**", "**")}
                  className="p-1.5 rounded-md hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  title="In đậm (Bold)"
                >
                  <Bold className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting("*", "*")}
                  className="p-1.5 rounded-md hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  title="In nghiêng (Italic)"
                >
                  <Italic className="w-3.5 h-3.5" />
                </button>
                <div className="w-px h-4 bg-slate-700 mx-1" />
                <button
                  type="button"
                  onClick={() => insertFormatting("- ")}
                  className="p-1.5 rounded-md hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  title="Gạch đầu dòng danh sách"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting("1. ")}
                  className="p-1.5 rounded-md hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  title="Danh sách số"
                >
                  <ListOrdered className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting("> 💡 **Lưu ý**: ")}
                  className="p-1.5 rounded-md hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  title="Hộp lưu ý nổi bật"
                >
                  <Info className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting("✅ ")}
                  className="p-1.5 rounded-md hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  title="Dấu tích tiện ích bao gồm"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </button>

                <div className="ml-auto">
                  <button
                    type="button"
                    onClick={applyTemplate}
                    className="px-2.5 py-1 rounded bg-emerald-950/70 hover:bg-emerald-900/60 border border-emerald-700/50 text-emerald-300 text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3 text-emerald-400" />
                    <span>Chèn bài viết mẫu chuẩn</span>
                  </button>
                </div>
              </div>
            )}

            {/* Editor Textarea vs Live Formatted Preview */}
            {descTab === "edit" ? (
              <textarea
                ref={textareaRef}
                rows={7}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Nhập mô tả chi tiết, tiện nghi, điều kiện giao xe, thủ tục hoặc nhấn 'Chèn bài viết mẫu chuẩn' phía trên..."
                className="w-full px-3.5 py-2.5 rounded-b-xl bg-slate-800/80 border border-slate-700 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono leading-relaxed"
              />
            ) : (
              <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 min-h-[180px] max-h-[300px] overflow-y-auto">
                <RichTextPreview content={description} />
              </div>
            )}
          </div>

          {/* Modal Actions */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-950 transition-all flex items-center gap-2 cursor-pointer"
            >
              {isEditing ? <Sparkles className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              <span>{isEditing ? "Lưu Thay Đổi Dịch Vụ" : "Đăng Bán Dịch Vụ"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
