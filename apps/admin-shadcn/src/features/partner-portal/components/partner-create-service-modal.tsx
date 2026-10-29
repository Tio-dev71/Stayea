"use client"

import { useState } from "react"
import {
  Building2,
  Car,
  Compass,
  Image as ImageIcon,
  MapPin,
  Plus,
  X,
} from "lucide-react"
import type { BusinessType, PartnerServiceData } from "../types"

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

          {/* Location & Image */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                URL Hình ảnh đại diện
              </label>
              <div className="relative">
                <ImageIcon className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
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
