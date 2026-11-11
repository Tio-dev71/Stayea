"use client"

import { useState, useEffect } from "react"
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
    const [termsAgreed, setTermsAgreed] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        stayeaApi.getProfile().then((u) => {
            if (u) {
                if (u.name && !contactName) setContactName(u.name)
                if (u.email && !email) setEmail(u.email)
                if (u.phone && !phone) setPhone(u.phone)
            }
        }).catch(() => { })
    }, [isOpen])

    if (!isOpen) return null

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!businessName.trim() || !contactName.trim() || !phone.trim()) {
            toast.error("Vui lòng điền đầy đủ các thông tin bắt buộc (*)")
            return
        }

        // Phone validation
        const cleanedPhone = phone.trim().replace(/[\s.-]/g, "")
        const vnPhoneRegex = /^(0[35789])[0-9]{8}$/
        if (!vnPhoneRegex.test(cleanedPhone)) {
            toast.error("Số điện thoại không hợp lệ. Vui lòng nhập số di động 10 chữ số (VD: 0921724444).")
            return
        }

        // Bank Account validation
        if (bankAccount.trim() && !/^[0-9]{6,25}$/.test(bankAccount.trim().replace(/\s/g, ""))) {
            toast.error("Số tài khoản ngân hàng không hợp lệ (yêu cầu từ 6 đến 25 chữ số).")
            return
        }

        // Legal & Terms agreement check
        if (!termsAgreed) {
            toast.error("Vui lòng tích chọn đồng ý với Hợp đồng Đối tác & Quy chế Sàn STAYEA.")
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

            const res = await stayeaApi.registerPartner(dto)
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
            <div className="relative w-full max-w-xl bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 sm:p-7 text-slate-800 my-8">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                            <Building className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-slate-900">Đăng Ký Cơ Sở Đối Tác Mới</h3>
                            <p className="text-xs text-slate-500">
                                Thêm thông tin homestay, đội xe hoặc tour du lịch tại Phú Quốc
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 mt-5">
                    {/* Business Type */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                            Loại hình dịch vụ <span className="text-rose-500">*</span>
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            <button
                                type="button"
                                onClick={() => setBusinessType("homestay")}
                                className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${businessType === "homestay"
                                    ? "bg-emerald-50 border-emerald-300 text-emerald-800 shadow-xs"
                                    : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                                    }`}
                            >
                                <Building className="w-4 h-4 text-emerald-600" />
                                <span>Homestay / Villa</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setBusinessType("transport")}
                                className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${businessType === "transport"
                                    ? "bg-blue-50 border-blue-300 text-blue-800 shadow-xs"
                                    : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                                    }`}
                            >
                                <Car className="w-4 h-4 text-blue-600" />
                                <span>Đội Xe / Vận Chuyển</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setBusinessType("tour")}
                                className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${businessType === "tour"
                                    ? "bg-amber-50 border-amber-300 text-amber-800 shadow-xs"
                                    : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                                    }`}
                            >
                                <Compass className="w-4 h-4 text-amber-600" />
                                <span>Tour / Canô</span>
                            </button>
                        </div>
                    </div>

                    {/* Business Name */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Tên cơ sở kinh doanh <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            value={businessName}
                            onChange={(e) => setBusinessName(e.target.value)}
                            placeholder="VD: Sunset Hill Villa Phú Quốc"
                            className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors"
                        />
                    </div>

                    {/* Contact Name & Phone */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                                Người đại diện / Liên hệ <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                value={contactName}
                                onChange={(e) => setContactName(e.target.value)}
                                placeholder="VD: Nguyễn Văn A"
                                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                                Số điện thoại liên hệ <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="VD: 0912 345 678"
                                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors"
                            />
                        </div>
                    </div>

                    {/* Email & Address */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="partner@stayea.com"
                                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                                Khu vực / Tỉnh thành
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    placeholder="Địa chỉ / Khu vực"
                                    className="w-2/3 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors"
                                />
                                <input
                                    type="text"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    placeholder="TP / Tỉnh"
                                    className="w-1/3 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Bank Info */}
                    <div className="pt-2 border-t border-slate-100">
                        <span className="block text-xs font-bold text-emerald-800 mb-2">
                            Thông tin nhận quyết toán ngân hàng (Không bắt buộc)
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                            <div>
                                <input
                                    type="text"
                                    value={bankName}
                                    onChange={(e) => setBankName(e.target.value)}
                                    placeholder="Ngân hàng (VD: VCB)"
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors"
                                />
                            </div>
                            <div>
                                <input
                                    type="text"
                                    value={bankAccount}
                                    onChange={(e) => setBankAccount(e.target.value)}
                                    placeholder="Số tài khoản"
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors font-mono"
                                />
                            </div>
                            <div>
                                <input
                                    type="text"
                                    value={bankAccountHolder}
                                    onChange={(e) => setBankAccountHolder(e.target.value)}
                                    placeholder="Chủ tài khoản"
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors uppercase"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Terms & Agreement Checkbox */}
                    <div className="pt-2 border-t border-slate-100">
                        <label className="flex items-start gap-2.5 cursor-pointer text-[11px] text-slate-600 leading-relaxed select-none">
                            <input
                                type="checkbox"
                                checked={termsAgreed}
                                onChange={(e) => setTermsAgreed(e.target.checked)}
                                className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                            />
                            <span>
                                Tôi xác nhận thông tin cơ sở là chính xác và đồng ý với{" "}
                                <a
                                    href="/partner-agreement"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-emerald-700 underline hover:text-emerald-800 font-semibold"
                                >
                                    Hợp đồng Đối tác & Quy chế Hoạt động Sàn STAYEA
                                </a>{" "}
                                (Mức chiết khấu hoa hồng 10.00%, quyết toán minh bạch, cam kết chất lượng dịch vụ).
                            </span>
                        </label>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm hover:shadow transition-all flex items-center gap-1.5 disabled:opacity-50"
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
