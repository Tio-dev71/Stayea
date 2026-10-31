"use client"

import { useState } from "react"
import { Building, Car, Compass, Plus, X } from "lucide-react"
import type { BusinessType, PartnerProfileData } from "../types"
import { stayeaApi } from "@/lib/stayea-api-service"
import { toast } from "sonner"

interface PartnerCreateProfileModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (newProfile: PartnerProfileData) => void
}

export function PartnerCreateProfileModal({
  isOpen,
  onClose,
  onSuccess,
}: PartnerCreateProfileModalProps) {
  const [businessName, setBusinessName] = useState("")
  const [businessType, setBusinessType] = useState<BusinessType>("homestay")
  const [contactName, setContactName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("Phú Quốc")
  const [bankName, setBankName] = useState("")
  const [bankAccount, setBankAccount] = useState("")
  const [bankAccountHolder, setBankAccountHolder] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!businessName.trim() || !contactName.trim() || !phone.trim()) {
      toast.error("Vui lòng điền đầy đủ các thông tin bắt buộc (*)")
      return
    }

    setIsSubmitting(true)
    try {
      const dto = {
        businessName: businessName.trim(),
        businessType,
        contactName: contactName.trim(),
        phone: phone.trim(),
        email: email.trim() || `partner_${Date.now()}@stayea.com`,
        address: address.trim() || "Phú Quốc",
        city: city.trim() || "Phú Quốc",
        bankName: bankName.trim(),
        bankAccount: bankAccount.trim(),
        bankAccountHolder: bankAccountHolder.trim().toUpperCase(),
        commissionRate: 10,
        status: "approved",
      }

      const res = await stayeaApi.adminCreatePartner(dto)
      const createdId = res?.id || `ptn_${Date.now()}`

      const newProfile: PartnerProfileData = {
        id: createdId,
        userId: res?.userId || "",
        businessName: dto.businessName,
        businessType: dto.businessType,
        contactName: dto.contactName,
        phone: dto.phone,
        email: dto.email,
        address: dto.address,
        city: dto.city,
        bankName: dto.bankName,
        bankAccount: dto.bankAccount,
        bankAccountHolder: dto.bankAccountHolder,
        status: "approved",
        commissionRate: "10.00",
        rating: "0.00",
        totalOrders: 0,
      }

      toast.success("Tạo cơ sở đối tác thành công!", {
        description: `Cơ sở ${newProfile.businessName} đã được kích hoạt.`,
      })
      onSuccess(newProfile)
      onClose()
    } catch (err: any) {
      toast.error("Không thể tạo đối tác: " + (err?.message || "Lỗi kết nối"))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 text-white my-8">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Đăng Ký Cơ Sở Đối Tác Mới</h3>
              <p className="text-xs text-slate-400">
                Thêm thông tin homestay, đội xe hoặc tour du lịch tại Phú Quốc
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-5">
          {/* Business Type */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Loại hình dịch vụ <span className="text-rose-400">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setBusinessType("homestay")}
                className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  businessType === "homestay"
                    ? "bg-emerald-600/30 border-emerald-500 text-emerald-300 shadow-sm"
                    : "bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white"
                }`}
              >
                <Building className="w-4 h-4" />
                <span>Homestay / Villa</span>
              </button>
              <button
                type="button"
                onClick={() => setBusinessType("transport")}
                className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  businessType === "transport"
                    ? "bg-blue-600/30 border-blue-500 text-blue-300 shadow-sm"
                    : "bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white"
                }`}
              >
                <Car className="w-4 h-4" />
                <span>Đội Xe / Vận Chuyển</span>
              </button>
              <button
                type="button"
                onClick={() => setBusinessType("tour")}
                className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  businessType === "tour"
                    ? "bg-amber-600/30 border-amber-500 text-amber-300 shadow-sm"
                    : "bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white"
                }`}
              >
                <Compass className="w-4 h-4" />
                <span>Tour / Canô</span>
              </button>
            </div>
          </div>

          {/* Business Name */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Tên cơ sở kinh doanh <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="VD: Sunset Hill Villa Phú Quốc"
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Contact Name & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Người đại diện / Liên hệ <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="VD: Nguyễn Văn A"
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Số điện thoại liên hệ <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="VD: 0912 345 678"
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Email & Address */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="partner@stayea.com"
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Khu vực / Tỉnh thành
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Địa chỉ / Khu vực"
                  className="w-2/3 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="TP / Tỉnh"
                  className="w-1/3 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Bank Info */}
          <div className="pt-2 border-t border-slate-800">
            <span className="block text-xs font-semibold text-emerald-400 mb-2">
              Thông tin nhận quyết toán ngân hàng (Không bắt buộc)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div>
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder="Ngân hàng (VD: VCB)"
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <input
                  type="text"
                  value={bankAccount}
                  onChange={(e) => setBankAccount(e.target.value)}
                  placeholder="Số tài khoản"
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>
              <div>
                <input
                  type="text"
                  value={bankAccountHolder}
                  onChange={(e) => setBankAccountHolder(e.target.value)}
                  placeholder="Chủ tài khoản"
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 uppercase"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-950 transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              <span>{isSubmitting ? "Đang tạo..." : "Xác Nhận Tạo Cơ Sở"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
