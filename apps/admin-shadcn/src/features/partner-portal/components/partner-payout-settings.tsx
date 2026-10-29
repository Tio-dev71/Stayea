"use client"

import { useState } from "react"
import {
  Building,
  Check,
  CreditCard,
  Save,
  ShieldCheck,
} from "lucide-react"
import type { PartnerProfileData } from "../types"

interface PartnerPayoutSettingsProps {
  profile: PartnerProfileData
  onUpdateProfile: (updated: Partial<PartnerProfileData>) => void
}

export function PartnerPayoutSettings({
  profile,
  onUpdateProfile,
}: PartnerPayoutSettingsProps) {
  const [businessName, setBusinessName] = useState(profile.businessName)
  const [contactName, setContactName] = useState(profile.contactName)
  const [phone, setPhone] = useState(profile.phone)
  const [email, setEmail] = useState(profile.email)
  const [address, setAddress] = useState(profile.address)
  const [bankName, setBankName] = useState(profile.bankName)
  const [bankAccount, setBankAccount] = useState(profile.bankAccount)
  const [bankAccountHolder, setBankAccountHolder] = useState(profile.bankAccountHolder)

  const [savedSuccess, setSavedSuccess] = useState(false)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    onUpdateProfile({
      businessName,
      contactName,
      phone,
      email,
      address,
      bankName,
      bankAccount,
      bankAccountHolder,
    })
    setSavedSuccess(true)
    setTimeout(() => setSavedSuccess(false), 3000)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <span>Tài Khoản Quyết Toán & Thông Tin Doanh Nghiệp</span>
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          STAYEA quyết toán doanh thu đơn hàng cho đối tác vào thứ Hai hàng tuần qua tài khoản ngân hàng dưới đây.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Bank Payout Information */}
        <div className="rounded-2xl bg-gradient-to-br from-emerald-950/30 to-slate-900 border border-emerald-900/50 p-6 shadow-xl">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Tài Khoản Ngân Hàng Nhận Tiền Quyết Toán</h3>
              <p className="text-[11px] text-slate-400">
                Tiền phòng, xe và tour được chuyển khoản tự động sau khi đối soát
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Tên Ngân hàng <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder="VD: Vietcombank / Techcombank"
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Số Tài Khoản (STK) <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={bankAccount}
                onChange={(e) => setBankAccount(e.target.value)}
                placeholder="VD: 0071001234567"
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Chủ Tài Khoản (In hoa không dấu) <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={bankAccountHolder}
                onChange={(e) => setBankAccountHolder(e.target.value.toUpperCase())}
                placeholder="VD: NGUYEN VAN PHAT"
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white font-mono uppercase focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Partner Profile & Business Information */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Thông Tin Cơ Sở Kinh Doanh / Đơn Vị</h3>
              <p className="text-[11px] text-slate-400">
                Thông tin xuất hiện trên hóa đơn và đối soát hệ thống
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Tên Cơ Sở / Hộ Kinh Doanh <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Người Đại Diện Phụ Trách <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Hotline Tiếp Nhận Khách (Zalo/SĐT) <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Email Nhận Thông Báo Đơn
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Địa Chỉ Hoạt Động (Phú Quốc)
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Commission & Terms */}
        <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5 flex items-center justify-between text-xs text-slate-300 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <div>
              <div className="font-semibold text-white">
                Hợp Đồng Đối Tác STAYEA: {profile.commissionRate}% Chiết Khấu
              </div>
              <div className="text-[11px] text-slate-400">
                STAYEA cam kết không phát sinh bất kỳ khoản phí ẩn nào khác.
              </div>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800 text-xs font-medium">
            Hợp đồng hiệu lực
          </span>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          {savedSuccess && (
            <span className="text-xs text-emerald-400 flex items-center gap-1.5 animate-fade-in font-medium">
              <Check className="w-4 h-4" /> Đã cập nhật thông tin thành công!
            </span>
          )}
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-950 transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Lưu Thông Tin Cài Đặt</span>
          </button>
        </div>
      </form>
    </div>
  )
}
