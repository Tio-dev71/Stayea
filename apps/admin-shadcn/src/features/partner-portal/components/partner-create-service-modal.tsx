"use client"

import { useState, useRef } from "react"
import {
  Building2,
  Car,
  CheckCircle2,
  Compass,
  FolderUp,
  Image as ImageIcon,
  Loader2,
  MapPin,
  Plus,
  Trash2,
  X,
} from "lucide-react"
import { toast } from "sonner"
import { stayeaApi } from "@/lib/stayea-api-service"
import type { BusinessType, PartnerServiceData } from "../types"

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

interface PartnerCreateServiceModalProps {
  isOpen: boolean
  onClose: () => void
  businessType: BusinessType
  onSaveService: (newService: Omit<PartnerServiceData, "id" | "partnerId">) => void
}

export function PartnerCreateServiceModal({
  isOpen,
  onClose,
  businessType,
  onSaveService,
}: PartnerCreateServiceModalProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [location, setLocation] = useState("Dương Đông, Phú Quốc")
  const [price, setPrice] = useState("1500000")
  const [originalPrice, setOriginalPrice] = useState("1800000")
  const [unit, setUnit] = useState(
    businessType === "transport" ? "ngày" : businessType === "tour" ? "vé/khách" : "đêm"
  )
  const [imageUrl, setImageUrl] = useState(
    businessType === "transport"
      ? "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&q=80"
      : businessType === "tour"
      ? "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80"
      : "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80"
  )
  const [isDriveDetected, setIsDriveDetected] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUrlChange = (val: string) => {
    const { convertedUrl, isDrive } = parseDriveUrl(val)
    setImageUrl(convertedUrl)
    setIsDriveDetected(isDrive)
    if (isDrive) {
      toast.success("Đã tự động chuyển đổi liên kết Google Drive sang ảnh hiển thị!")
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Kích thước tệp tối đa là 10MB.")
      return
    }

    setIsUploading(true)
    try {
      const uploadedUrl = await stayeaApi.uploadImage(file)
      if (uploadedUrl) {
        setImageUrl(uploadedUrl)
        setIsDriveDetected(false)
        toast.success("Tải ảnh từ thiết bị thành công!")
      } else {
        // Fallback to FileReader data URL
        const reader = new FileReader()
        reader.onload = () => {
          if (typeof reader.result === "string") {
            setImageUrl(reader.result)
            setIsDriveDetected(false)
            toast.success("Đã tải ảnh lên thành công!")
          }
        }
        reader.readAsDataURL(file)
      }
    } catch {
      const reader = new FileReader()
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setImageUrl(reader.result)
          setIsDriveDetected(false)
          toast.success("Đã tải ảnh lên thành công!")
        }
      }
      reader.readAsDataURL(file)
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  // Homestay specific
  const [bedrooms, setBedrooms] = useState(2)
  const [maxGuests, setMaxGuests] = useState(4)
  const [selectedAmenities] = useState<string[]>([
    "Hồ bơi riêng",
    "Bếp nấu gia đình",
    "Wifi tốc độ cao",
  ])

  // Transport specific
  const [vehicleType, setVehicleType] = useState("7 Chỗ (MPV)")
  const [transmission, setTransmission] = useState("Số tự động (AT)")
  const [hasDriver, setHasDriver] = useState(false)

  // Tour specific
  const [duration] = useState("8 tiếng")
  const [schedule] = useState("08:30 - 16:30")

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const serviceType =
      businessType === "transport"
        ? "transport"
        : businessType === "tour"
        ? "experience"
        : "stay"

    const attributes: PartnerServiceData["attributes"] = {
      ...(businessType === "homestay"
        ? {
            bedrooms,
            maxGuests,
            amenities: selectedAmenities,
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

    onSaveService({
      serviceType,
      title,
      description,
      location,
      price,
      originalPrice,
      unit,
      images: [imageUrl],
      attributes,
      status: "active",
    })

    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-emerald-900/60 rounded-2xl shadow-2xl p-6 text-white my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              {businessType === "transport" ? (
                <Car className="w-5 h-5" />
              ) : businessType === "tour" ? (
                <Compass className="w-5 h-5" />
              ) : (
                <Building2 className="w-5 h-5" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Thêm Dịch Vụ Mới</h3>
              <p className="text-xs text-slate-400">
                {businessType === "transport"
                  ? "Đăng ký xe cho thuê tự lái hoặc đưa đón sân bay"
                  : businessType === "tour"
                  ? "Đăng ký tour đảo, trải nghiệm lặn biển Phú Quốc"
                  : "Đăng ký căn homestay, villa nghỉ dưỡng"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Service Title */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Tên dịch vụ / Xe / Phòng <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder={
                businessType === "transport"
                  ? "Ví dụ: Xe 7 Chỗ Kia Carnival Sang Trọng 2025"
                  : businessType === "tour"
                  ? "Ví dụ: Tour Câu Mực Đêm & Ăn Tối Trên Tàu"
                  : "Ví dụ: Villa Vườn Nhiệt Đới 2 Phòng Ngủ"
              }
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Pricing & Unit Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Giá niêm yết (₫) <span className="text-rose-400">*</span>
              </label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Giá gốc (nếu có giảm giá)
              </label>
              <input
                type="number"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-white focus:outline-none focus:border-emerald-500"
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
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Vị trí / Địa chỉ phục vụ <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Image Upload & Google Drive section */}
          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/80 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-emerald-400" />
                <span>Hình ảnh dịch vụ (Link Drive / Tải từ thiết bị)</span>
              </label>
              {isDriveDetected && (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  <CheckCircle2 className="w-3 h-3" />
                  Google Drive CDN
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="sm:col-span-2 relative">
                <input
                  type="text"
                  placeholder="Dán link Google Drive hoặc URL ảnh..."
                  value={imageUrl}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  disabled={isUploading}
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-full min-h-[38px] px-3 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Đang tải lên...</span>
                    </>
                  ) : (
                    <>
                      <FolderUp className="w-4 h-4" />
                      <span>Tải từ thiết bị</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <p className="text-[11px] text-slate-400">
              💡 Hỗ trợ: Dán trực tiếp liên kết chia sẻ Google Drive (bật &quot;Bất kỳ ai có đường liên kết&quot;), URL ảnh trực tiếp, hoặc nhấn &quot;Tải từ thiết bị&quot; để tải file ảnh từ máy.
            </p>

            {/* Preview Box */}
            {imageUrl && (
              <div className="relative mt-2 p-2 rounded-xl bg-slate-900/80 border border-slate-700/60 flex items-center gap-3">
                <div className="relative w-20 h-14 rounded-lg overflow-hidden bg-slate-800 flex-shrink-0 border border-slate-700">
                  <img
                    src={imageUrl}
                    alt="Xem trước hình ảnh"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80"
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-slate-200 truncate">
                    {isDriveDetected
                      ? "Hình ảnh Google Drive (Đã tối ưu CDN)"
                      : imageUrl.startsWith("data:")
                      ? "Ảnh từ tệp tải lên (Bộ nhớ đệm)"
                      : imageUrl.startsWith("/api/uploads")
                      ? "Ảnh đã tải lên máy chủ STAYEA"
                      : "Liên kết hình ảnh trực tiếp"}
                  </div>
                  <div className="text-[11px] text-slate-400 truncate max-w-sm">
                    {imageUrl}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setImageUrl("")
                    setIsDriveDetected(false)
                  }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                  title="Xóa ảnh"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Custom Fields per Business Type */}
          {businessType === "homestay" && (
            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-900/40 space-y-3">
              <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                Đặc tính Homestay / Villa
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Số phòng ngủ</label>
                  <input
                    type="number"
                    value={bedrooms}
                    onChange={(e) => setBedrooms(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Khách tối đa</label>
                  <input
                    type="number"
                    value={maxGuests}
                    onChange={(e) => setMaxGuests(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-sm text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {businessType === "transport" && (
            <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-900/40 space-y-3">
              <div className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
                Đặc tính Xe / Vận chuyển
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Loại phương tiện</label>
                  <select
                    value={vehicleType}
                    onChange={(e) => setVehicleType(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-sm text-white"
                  >
                    <option value="4 Chỗ Sedan">4 Chỗ (Sedan)</option>
                    <option value="7 Chỗ (MPV)">7 Chỗ (Xpander/Innova)</option>
                    <option value="7 Chỗ SUV">7 Chỗ SUV (Fortuner/Everest)</option>
                    <option value="16 Chỗ Ford Transit">16 Chỗ (Transit/Solati)</option>
                    <option value="Xe máy tay ga">Xe máy tay ga</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Hộp số</label>
                  <select
                    value={transmission}
                    onChange={(e) => setTransmission(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-sm text-white"
                  >
                    <option value="Số tự động (AT)">Số tự động (AT)</option>
                    <option value="Số sàn (MT)">Số sàn (MT)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Hình thức lái</label>
                  <select
                    value={hasDriver ? "yes" : "no"}
                    onChange={(e) => setHasDriver(e.target.value === "yes")}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-sm text-white"
                  >
                    <option value="no">Tự lái (Khách tự lái)</option>
                    <option value="yes">Có tài xế riêng</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Mô tả chi tiết
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Giới thiệu về dịch vụ, tiện ích, chính sách giao nhận xe hoặc giờ check-in..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Modal Actions */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-900/30 transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Đăng Bán Dịch Vụ</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
