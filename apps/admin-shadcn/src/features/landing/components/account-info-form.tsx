"use client"

import * as React from "react"
import {
  User,
  MapPin,
  PhoneCall,
  Lock,
  Calendar,
  Key,
  Smartphone,
  Gift,
  Save,
  ChevronDown,
} from "lucide-react"
import type { UserAccountFormDetails } from "@/features/landing/data/stayea-mock-data"
import {
  GENDER_OPTIONS,
  NATIONALITY_OPTIONS,
  CITY_OPTIONS,
  DOCUMENT_TYPE_OPTIONS,
  EMERGENCY_RELATION_OPTIONS,
} from "@/features/landing/data/stayea-mock-data"

interface AccountInfoFormProps {
  readonly initialData: UserAccountFormDetails
  readonly onSave: (data: UserAccountFormDetails) => void
  readonly onReset: () => void
  readonly onChangePassword: () => void
}

export function AccountInfoForm({
  initialData,
  onSave,
  onReset,
  onChangePassword,
}: AccountInfoFormProps) {
  const [formData, setFormData] = React.useState<UserAccountFormDetails>(initialData)

  React.useEffect(() => {
    setFormData(initialData)
  }, [initialData])

  function handleChange<K extends keyof UserAccountFormDetails>(
    field: K,
    value: UserAccountFormDetails[K]
  ) {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* =========================================================================
          SECTION 1: THÔNG TIN CƠ BẢN
      ========================================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-5">
        {/* Section Header */}
        <div className="flex items-start gap-3 pb-1 border-b border-slate-100">
          <div className="p-2 rounded-xl bg-slate-100 text-slate-700 shrink-0 mt-0.5">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Thông tin cơ bản
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Cập nhật thông tin cá nhân của bạn để giúp chúng tôi phục vụ bạn tốt hơn.
            </p>
          </div>
        </div>

        {/* Form Fields: 2-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {/* Họ và tên */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center">
              Họ và tên <span className="text-rose-500 ml-1">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200/90 text-sm text-slate-800 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all bg-white"
            />
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center">
              Email <span className="text-rose-500 ml-1">*</span>
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200/90 text-sm text-slate-800 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all bg-white"
            />
          </div>

          {/* Số điện thoại */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center">
              Số điện thoại <span className="text-rose-500 ml-1">*</span>
            </label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200/90 text-sm text-slate-800 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all bg-white"
            />
          </div>

          {/* Ngày sinh */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center">
              Ngày sinh <span className="text-rose-500 ml-1">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={formData.birthDate}
                onChange={(e) => handleChange("birthDate", e.target.value)}
                placeholder="DD/MM/YYYY"
                className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-slate-200/90 text-sm text-slate-800 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all bg-white"
              />
              <Calendar className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Giới tính */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center">
              Giới tính <span className="text-rose-500 ml-1">*</span>
            </label>
            <div className="relative">
              <select
                value={formData.gender}
                onChange={(e) => handleChange("gender", e.target.value)}
                className="w-full appearance-none px-3.5 py-2.5 pr-10 rounded-xl border border-slate-200/90 text-sm text-slate-800 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all bg-white cursor-pointer"
              >
                {GENDER_OPTIONS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Quốc tịch */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center">
              Quốc tịch <span className="text-rose-500 ml-1">*</span>
            </label>
            <div className="relative">
              <select
                value={formData.nationality}
                onChange={(e) => handleChange("nationality", e.target.value)}
                className="w-full appearance-none px-3.5 py-2.5 pr-10 rounded-xl border border-slate-200/90 text-sm text-slate-800 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all bg-white cursor-pointer"
              >
                {NATIONALITY_OPTIONS.map((nat) => (
                  <option key={nat} value={nat}>
                    {nat}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION 2: ĐỊA CHỈ & GIẤY TỜ
      ========================================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-5">
        {/* Section Header */}
        <div className="flex items-start gap-3 pb-1 border-b border-slate-100">
          <div className="p-2 rounded-xl bg-slate-100 text-slate-700 shrink-0 mt-0.5">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Địa chỉ & giấy tờ
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Thông tin địa chỉ và giấy tờ tùy thân giúp việc đặt dịch vụ và di chuyển thuận tiện hơn.
            </p>
          </div>
        </div>

        {/* Row 1: Thành phố + Địa chỉ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          {/* Thành phố */}
          <div className="md:col-span-1 space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center">
              Thành phố <span className="text-rose-500 ml-1">*</span>
            </label>
            <div className="relative">
              <select
                value={formData.city}
                onChange={(e) => handleChange("city", e.target.value)}
                className="w-full appearance-none px-3.5 py-2.5 pr-10 rounded-xl border border-slate-200/90 text-sm text-slate-800 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all bg-white cursor-pointer"
              >
                {CITY_OPTIONS.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Địa chỉ */}
          <div className="md:col-span-2 space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center">
              Địa chỉ <span className="text-rose-500 ml-1">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200/90 text-sm text-slate-800 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all bg-white"
            />
          </div>
        </div>

        {/* Row 2: Loại giấy tờ + Số giấy tờ + Ngày hết hạn */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          {/* Loại giấy tờ */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center">
              Loại giấy tờ <span className="text-rose-500 ml-1">*</span>
            </label>
            <div className="relative">
              <select
                value={formData.documentType}
                onChange={(e) => handleChange("documentType", e.target.value)}
                className="w-full appearance-none px-3.5 py-2.5 pr-10 rounded-xl border border-slate-200/90 text-sm text-slate-800 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all bg-white cursor-pointer"
              >
                {DOCUMENT_TYPE_OPTIONS.map((doc) => (
                  <option key={doc} value={doc}>
                    {doc}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Số giấy tờ */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center">
              Số giấy tờ <span className="text-rose-500 ml-1">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.documentNumber}
              onChange={(e) => handleChange("documentNumber", e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200/90 text-sm font-mono text-slate-800 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all bg-white"
            />
          </div>

          {/* Ngày hết hạn */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center">
              Ngày hết hạn <span className="text-rose-500 ml-1">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={formData.documentExpiry}
                onChange={(e) => handleChange("documentExpiry", e.target.value)}
                placeholder="DD/MM/YYYY"
                className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-slate-200/90 text-sm text-slate-800 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all bg-white"
              />
              <Calendar className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION 3: LIÊN HỆ KHẨN CẤP
      ========================================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-5">
        {/* Section Header */}
        <div className="flex items-start gap-3 pb-1 border-b border-slate-100">
          <div className="p-2 rounded-xl bg-slate-100 text-slate-700 shrink-0 mt-0.5">
            <PhoneCall className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Liên hệ khẩn cấp
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Thông tin liên hệ khẩn cấp sẽ được sử dụng khi cần thiết trong những tình huống đặc biệt.
            </p>
          </div>
        </div>

        {/* 3-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          {/* Người liên hệ */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center">
              Người liên hệ <span className="text-rose-500 ml-1">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.emergencyContactName}
              onChange={(e) => handleChange("emergencyContactName", e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200/90 text-sm text-slate-800 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all bg-white"
            />
          </div>

          {/* Số điện thoại */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center">
              Số điện thoại <span className="text-rose-500 ml-1">*</span>
            </label>
            <input
              type="tel"
              required
              value={formData.emergencyContactPhone}
              onChange={(e) => handleChange("emergencyContactPhone", e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200/90 text-sm text-slate-800 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all bg-white"
            />
          </div>

          {/* Quan hệ */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center">
              Quan hệ <span className="text-rose-500 ml-1">*</span>
            </label>
            <div className="relative">
              <select
                value={formData.emergencyContactRelation}
                onChange={(e) => handleChange("emergencyContactRelation", e.target.value)}
                className="w-full appearance-none px-3.5 py-2.5 pr-10 rounded-xl border border-slate-200/90 text-sm text-slate-800 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all bg-white cursor-pointer"
              >
                {EMERGENCY_RELATION_OPTIONS.map((rel) => (
                  <option key={rel} value={rel}>
                    {rel}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION 4: BẢO MẬT TÀI KHOẢN
      ========================================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-5">
        {/* Section Header */}
        <div className="flex items-start gap-3 pb-1 border-b border-slate-100">
          <div className="p-2 rounded-xl bg-slate-100 text-slate-700 shrink-0 mt-0.5">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Bảo mật tài khoản
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Quản lý mật khẩu và các tùy chọn bảo mật để bảo vệ tài khoản của bạn.
            </p>
          </div>
        </div>

        {/* Row 1: Mật khẩu + Nút Đổi mật khẩu */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700">
            Mật khẩu
          </label>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/70 text-slate-400 text-sm tracking-widest font-mono select-none">
              ••••••••••••
            </div>
            <button
              type="button"
              onClick={onChangePassword}
              className="shrink-0 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition-all active:scale-95 cursor-pointer shadow-2xs"
            >
              <Key className="w-4 h-4 text-slate-500" />
              <span>Đổi mật khẩu</span>
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-100 pt-2 space-y-4">
          {/* Toggle 1: Xác thực 2 bước */}
          <div className="flex items-center justify-between gap-4 py-1">
            <div className="flex items-start gap-3 min-w-0">
              <div className="p-2 rounded-xl bg-blue-50 text-blue-600 shrink-0 mt-0.5">
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                  Xác thực 2 bước
                </h4>
                <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
                  Tăng cường bảo mật cho tài khoản của bạn bằng mã xác thực.
                </p>
              </div>
            </div>

            {/* Accessible Interactive Switch */}
            <button
              type="button"
              role="switch"
              aria-checked={formData.twoFactorAuth}
              onClick={() => handleChange("twoFactorAuth", !formData.twoFactorAuth)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                formData.twoFactorAuth ? "bg-[#2563EB]" : "bg-slate-200"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  formData.twoFactorAuth ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Toggle 2: Nhận thông báo ưu đãi */}
          <div className="flex items-center justify-between gap-4 py-1">
            <div className="flex items-start gap-3 min-w-0">
              <div className="p-2 rounded-xl bg-amber-50 text-amber-600 shrink-0 mt-0.5">
                <Gift className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                  Nhận thông báo ưu đãi
                </h4>
                <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
                  Nhận thông báo về ưu đãi, khuyến mãi và những trải nghiệm mới từ STAYEA.
                </p>
              </div>
            </div>

            {/* Accessible Interactive Switch */}
            <button
              type="button"
              role="switch"
              aria-checked={formData.promoNotifications}
              onClick={() =>
                handleChange("promoNotifications", !formData.promoNotifications)
              }
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                formData.promoNotifications ? "bg-[#2563EB]" : "bg-slate-200"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  formData.promoNotifications ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION 5: BOTTOM ACTION BAR
      ========================================================================= */}
      <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={onReset}
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-all shadow-2xs active:scale-95 cursor-pointer"
        >
          Hủy thay đổi
        </button>

        <button
          type="submit"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-2.5 rounded-xl bg-[#0A2239] hover:bg-[#071726] text-white text-sm font-semibold transition-all shadow-sm active:scale-95 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Lưu thay đổi</span>
        </button>
      </div>
    </form>
  )
}
