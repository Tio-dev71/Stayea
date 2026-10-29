"use client"

import { useState } from "react"
import { X, Building2, MapPin, Users, Bed, Image as ImageIcon, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { stayeaApi } from "@/lib/stayea-api-service"

interface CreatePropertyModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmitSuccess?: (newProperty: any) => void
}

export function CreatePropertyModal({
  isOpen,
  onClose,
  onSubmitSuccess,
}: CreatePropertyModalProps) {
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("villa")
  const [address, setAddress] = useState("Bãi Trường, Dương Tơ, Phú Quốc")
  const [pricePerNight, setPricePerNight] = useState("4500000")
  const [bedrooms, setBedrooms] = useState("3")
  const [maxGuests, setMaxGuests] = useState("6")
  const [heroImage, setHeroImage] = useState("/stay/tropical-garden.jpg")
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      toast.error("Vui lòng nhập tên bất động sản.")
      return
    }

    setIsSubmitting(true)
    try {
      const res = await stayeaApi.createAccommodation({
        title: title.trim(),
        category,
        address: address.trim(),
        pricePerNight: Number(pricePerNight) || 3000000,
        bedrooms: Number(bedrooms) || 2,
        maxGuests: Number(maxGuests) || 4,
        heroImage: heroImage.trim() || "/stay/tropical-garden.jpg",
        amenities: ["Bể bơi vô cực", "View biển", "Bếp cao cấp", "Wifi tốc độ cao"],
      })

      if (res && res.id) {
        toast.success("Thêm bất động sản thành công!", {
          description: `Đã đưa "${title}" vào hệ thống lưu trú STAYEA.`,
        })
        onSubmitSuccess?.(res)
        onClose()
      } else {
        toast.error("Không thể tạo bất động sản. Vui lòng thử lại.")
      }
    } catch (err: any) {
      toast.error(err?.message || "Đã xảy ra lỗi khi tạo bất động sản.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200/80 p-6 overflow-hidden space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#eef8f3] text-[#1b7a4e] flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Thêm bất động sản mới
              </h2>
              <p className="text-xs text-slate-500">
                Đăng ký villa, căn hộ hoặc homestay lên hệ thống STAYEA Phú Quốc
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          {/* Tên BĐS */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Tên bất động sản *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="VD: Sunset Sanato Oceanfront Villa"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all"
            />
          </div>

          {/* Phân loại & Giá */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Phân loại loại hình
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all"
              >
                <option value="villa">Biệt thự nghỉ dưỡng (Villa)</option>
                <option value="apartment">Căn hộ cao cấp (Apartment)</option>
                <option value="homestay">Homestay độc bản</option>
                <option value="resort">Khu nghỉ dưỡng (Resort)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Giá niêm yết / đêm (VNĐ)
              </label>
              <input
                type="number"
                value={pricePerNight}
                onChange={(e) => setPricePerNight(e.target.value)}
                placeholder="VD: 4500000"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Địa chỉ Phú Quốc */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Địa chỉ tại Phú Quốc
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="VD: Bãi Trường, Dương Tơ, Phú Quốc"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Số phòng ngủ & Số khách tối đa */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Số phòng ngủ
              </label>
              <div className="relative">
                <Bed className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="number"
                  min="1"
                  value={bedrooms}
                  onChange={(e) => setBedrooms(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Số khách tối đa
              </label>
              <div className="relative">
                <Users className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="number"
                  min="1"
                  value={maxGuests}
                  onChange={(e) => setMaxGuests(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Ảnh minh họa */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Hình ảnh đại diện (Đường dẫn hoặc ảnh mẫu)
            </label>
            <div className="relative">
              <ImageIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={heroImage}
                onChange={(e) => setHeroImage(e.target.value)}
                placeholder="/stay/tropical-garden.jpg"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1b7a4e] hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-all disabled:opacity-50"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>Tạo bất động sản</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
