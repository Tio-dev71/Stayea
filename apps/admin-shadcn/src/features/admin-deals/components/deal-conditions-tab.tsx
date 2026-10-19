"use client"

import { useState } from "react"
import { Check, ChevronDown } from "lucide-react"

export interface DealConditionsState {
  targetAudience: "all" | "new" | "loyal" | "group"
  scopeType: "all" | "category" | "location" | "partner" | "specific"
  hasMinOrderValue: boolean
  minOrderValue: string
  hasMinGuests: boolean
  minGuests: string
  hasMinAdvanceDays: boolean
  minAdvanceDays: string
  hasMaxUses: boolean
  maxUsesPerUser: string
  notStackable: boolean
  applySpecificDays: boolean
  selectedDays: string[]
  onlyStayeaChannels: boolean
  applySpecificPayment: boolean
  paymentMethod: string
}

interface DealConditionsTabProps {
  conditions?: Partial<DealConditionsState>
  onChange?: (updated: Partial<DealConditionsState>) => void
}

export function DealConditionsTab({ conditions = {}, onChange }: DealConditionsTabProps) {
  // Target Audience (Đối tượng áp dụng)
  const [targetAudience, setTargetAudience] = useState<DealConditionsState["targetAudience"]>(
    conditions.targetAudience ?? "all"
  )

  // Scope Type (Phạm vi áp dụng)
  const [scopeType, setScopeType] = useState<DealConditionsState["scopeType"]>(
    conditions.scopeType ?? "all"
  )

  // Service Booking Conditions (Điều kiện đặt dịch vụ)
  const [hasMinOrderValue, setHasMinOrderValue] = useState(conditions.hasMinOrderValue ?? false)
  const [minOrderValue, setMinOrderValue] = useState(conditions.minOrderValue ?? "500.000")

  const [hasMinGuests, setHasMinGuests] = useState(conditions.hasMinGuests ?? false)
  const [minGuests, setMinGuests] = useState(conditions.minGuests ?? "2")

  const [hasMinAdvanceDays, setHasMinAdvanceDays] = useState(conditions.hasMinAdvanceDays ?? false)
  const [minAdvanceDays, setMinAdvanceDays] = useState(conditions.minAdvanceDays ?? "3")

  const [hasMaxUses, setHasMaxUses] = useState(conditions.hasMaxUses ?? false)
  const [maxUsesPerUser, setMaxUsesPerUser] = useState(conditions.maxUsesPerUser ?? "Mỗi khách hàng 1 lần")

  // Other Conditions (Điều kiện khác)
  const [notStackable, setNotStackable] = useState(conditions.notStackable ?? true)
  const [applySpecificDays, setApplySpecificDays] = useState(conditions.applySpecificDays ?? false)
  const [selectedDays, setSelectedDays] = useState<string[]>(
    conditions.selectedDays ?? []
  )
  const [onlyStayeaChannels, setOnlyStayeaChannels] = useState(conditions.onlyStayeaChannels ?? true)
  const [applySpecificPayment, setApplySpecificPayment] = useState(conditions.applySpecificPayment ?? false)
  const [paymentMethod, setPaymentMethod] = useState(conditions.paymentMethod ?? "")

  const handleAudienceChange = (val: DealConditionsState["targetAudience"]) => {
    setTargetAudience(val)
    onChange?.({ targetAudience: val })
  }

  const handleScopeChange = (val: DealConditionsState["scopeType"]) => {
    setScopeType(val)
    onChange?.({ scopeType: val })
  }

  const toggleDay = (day: string) => {
    const nextDays = selectedDays.includes(day)
      ? selectedDays.filter((d) => d !== day)
      : [...selectedDays, day]
    setSelectedDays(nextDays)
    onChange?.({ selectedDays: nextDays })
  }

  const daysList = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"]

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* 1. Header Section */}
      <div>
        <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
          Điều kiện áp dụng
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Thiết lập các điều kiện để chương trình khuyến mãi được áp dụng.
        </p>
      </div>

      {/* 2. Đối tượng áp dụng * */}
      <div>
        <div className="flex items-center gap-1 mb-2">
          <label className="text-xs font-bold text-slate-900">
            Đối tượng áp dụng
          </label>
          <span className="text-rose-500 font-bold">*</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Card 1: Tất cả khách hàng */}
          <button
            type="button"
            onClick={() => handleAudienceChange("all")}
            className={`text-left px-3.5 py-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-2.5 h-full min-h-[58px] ${
              targetAudience === "all"
                ? "border-slate-300 bg-white shadow-xs"
                : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            {targetAudience === "all" ? (
              <div className="w-4 h-4 rounded-full border-2 border-[#007a48] flex items-center justify-center shrink-0">
                <div className="w-2 h-2 rounded-full bg-[#007a48]" />
              </div>
            ) : (
              <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
            )}
            <span className="text-xs font-bold text-slate-900 leading-tight">
              Tất cả khách hàng
            </span>
          </button>

          {/* Card 2: Khách hàng mới */}
          <button
            type="button"
            onClick={() => handleAudienceChange("new")}
            className={`text-left px-3.5 py-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-2.5 h-full min-h-[58px] ${
              targetAudience === "new"
                ? "border-slate-300 bg-white shadow-xs"
                : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            {targetAudience === "new" ? (
              <div className="w-4 h-4 rounded-full border-2 border-[#007a48] flex items-center justify-center shrink-0">
                <div className="w-2 h-2 rounded-full bg-[#007a48]" />
              </div>
            ) : (
              <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
            )}
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-900 leading-tight">
                Khách hàng mới
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5 leading-tight truncate">
                Lần đầu đặt trên Stayea
              </div>
            </div>
          </button>

          {/* Card 3: Khách hàng thân thiết */}
          <button
            type="button"
            onClick={() => handleAudienceChange("loyal")}
            className={`text-left px-3.5 py-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-2.5 h-full min-h-[58px] ${
              targetAudience === "loyal"
                ? "border-slate-300 bg-white shadow-xs"
                : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            {targetAudience === "loyal" ? (
              <div className="w-4 h-4 rounded-full border-2 border-[#007a48] flex items-center justify-center shrink-0">
                <div className="w-2 h-2 rounded-full bg-[#007a48]" />
              </div>
            ) : (
              <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
            )}
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-900 leading-tight">
                Khách hàng thân thiết
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5 leading-tight truncate">
                Hạng Bạc, Vàng, Kim cương
              </div>
            </div>
          </button>

          {/* Card 4: Nhóm khách hàng */}
          <button
            type="button"
            onClick={() => handleAudienceChange("group")}
            className={`text-left px-3.5 py-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-2.5 h-full min-h-[58px] ${
              targetAudience === "group"
                ? "border-slate-300 bg-white shadow-xs"
                : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            {targetAudience === "group" ? (
              <div className="w-4 h-4 rounded-full border-2 border-[#007a48] flex items-center justify-center shrink-0">
                <div className="w-2 h-2 rounded-full bg-[#007a48]" />
              </div>
            ) : (
              <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
            )}
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-900 leading-tight">
                Nhóm khách hàng
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5 leading-tight truncate">
                Chọn nhóm cụ thể
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* 3. Phạm vi áp dụng * */}
      <div>
        <div className="flex items-center gap-1 mb-2">
          <label className="text-xs font-bold text-slate-900">
            Phạm vi áp dụng
          </label>
          <span className="text-rose-500 font-bold">*</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {/* Scope 1: Tất cả trải nghiệm & tour */}
          <button
            type="button"
            onClick={() => handleScopeChange("all")}
            className={`text-left px-3 py-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-2 h-full min-h-[58px] ${
              scopeType === "all"
                ? "border-slate-300 bg-white shadow-xs"
                : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            {scopeType === "all" ? (
              <div className="w-4 h-4 rounded-full border-2 border-[#007a48] flex items-center justify-center shrink-0">
                <div className="w-2 h-2 rounded-full bg-[#007a48]" />
              </div>
            ) : (
              <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
            )}
            <span className="text-xs font-bold text-slate-900 leading-tight">
              Tất cả trải nghiệm & tour
            </span>
          </button>

          {/* Scope 2: Theo loại hình */}
          <button
            type="button"
            onClick={() => handleScopeChange("category")}
            className={`text-left px-3 py-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-2 h-full min-h-[58px] ${
              scopeType === "category"
                ? "border-slate-300 bg-white shadow-xs"
                : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            {scopeType === "category" ? (
              <div className="w-4 h-4 rounded-full border-2 border-[#007a48] flex items-center justify-center shrink-0">
                <div className="w-2 h-2 rounded-full bg-[#007a48]" />
              </div>
            ) : (
              <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
            )}
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-900 leading-tight">
                Theo loại hình
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5 leading-tight truncate">
                Tour biển đảo, Ẩm thực...
              </div>
            </div>
          </button>

          {/* Scope 3: Theo địa điểm */}
          <button
            type="button"
            onClick={() => handleScopeChange("location")}
            className={`text-left px-3 py-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-2 h-full min-h-[58px] ${
              scopeType === "location"
                ? "border-slate-300 bg-white shadow-xs"
                : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            {scopeType === "location" ? (
              <div className="w-4 h-4 rounded-full border-2 border-[#007a48] flex items-center justify-center shrink-0">
                <div className="w-2 h-2 rounded-full bg-[#007a48]" />
              </div>
            ) : (
              <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
            )}
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-900 leading-tight">
                Theo địa điểm
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5 leading-tight truncate">
                Chọn tỉnh/thành, khu vực
              </div>
            </div>
          </button>

          {/* Scope 4: Theo đối tác cung cấp */}
          <button
            type="button"
            onClick={() => handleScopeChange("partner")}
            className={`text-left px-3 py-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-2 h-full min-h-[58px] ${
              scopeType === "partner"
                ? "border-slate-300 bg-white shadow-xs"
                : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            {scopeType === "partner" ? (
              <div className="w-4 h-4 rounded-full border-2 border-[#007a48] flex items-center justify-center shrink-0">
                <div className="w-2 h-2 rounded-full bg-[#007a48]" />
              </div>
            ) : (
              <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
            )}
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-900 leading-tight">
                Theo đối tác cung cấp
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5 leading-tight truncate">
                Chọn đối tác
              </div>
            </div>
          </button>

          {/* Scope 5: Chọn sản phẩm cụ thể */}
          <button
            type="button"
            onClick={() => handleScopeChange("specific")}
            className={`text-left px-3 py-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-2 h-full min-h-[58px] ${
              scopeType === "specific"
                ? "border-slate-300 bg-white shadow-xs"
                : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            {scopeType === "specific" ? (
              <div className="w-4 h-4 rounded-full border-2 border-[#007a48] flex items-center justify-center shrink-0">
                <div className="w-2 h-2 rounded-full bg-[#007a48]" />
              </div>
            ) : (
              <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
            )}
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-900 leading-tight">
                Chọn sản phẩm cụ thể
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5 leading-tight truncate">
                Chọn trải nghiệm / tour
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* 4. Điều kiện đặt dịch vụ */}
      <div>
        <h4 className="text-sm font-bold text-slate-900 tracking-tight mb-3">
          Điều kiện đặt dịch vụ
        </h4>

        <div className="space-y-3">
          {/* Row 1: Giá trị đơn hàng tối thiểu */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
            <div className="w-56 sm:w-60 shrink-0 flex items-center gap-2.5">
              <button
                type="button"
                role="checkbox"
                aria-checked={hasMinOrderValue}
                onClick={() => {
                  const nextVal = !hasMinOrderValue
                  setHasMinOrderValue(nextVal)
                  onChange?.({ hasMinOrderValue: nextVal })
                }}
                className={`w-4 h-4 rounded border transition-colors flex items-center justify-center shrink-0 cursor-pointer ${
                  hasMinOrderValue
                    ? "bg-[#007a48] border-[#007a48] text-white"
                    : "border-slate-300 bg-white hover:border-slate-400"
                }`}
              >
                {hasMinOrderValue && <Check className="w-3 h-3 stroke-[3]" />}
              </button>
              <span className="text-xs font-medium text-slate-800">
                Giá trị đơn hàng tối thiểu
              </span>
            </div>

            <div className="relative w-44 sm:w-48 shrink-0">
              <input
                type="text"
                value={minOrderValue}
                onChange={(e) => {
                  setMinOrderValue(e.target.value)
                  onChange?.({ minOrderValue: e.target.value })
                }}
                className="w-full px-3.5 py-1.5 pr-8 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-500 font-medium pointer-events-none">
                đ
              </span>
            </div>

            <div className="text-xs text-slate-500 font-normal">
              Áp dụng khi tổng giá trị đơn hàng đạt tối thiểu
            </div>
          </div>

          {/* Row 2: Số lượng khách tối thiểu */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
            <div className="w-56 sm:w-60 shrink-0 flex items-center gap-2.5">
              <button
                type="button"
                role="checkbox"
                aria-checked={hasMinGuests}
                onClick={() => {
                  const nextVal = !hasMinGuests
                  setHasMinGuests(nextVal)
                  onChange?.({ hasMinGuests: nextVal })
                }}
                className={`w-4 h-4 rounded border transition-colors flex items-center justify-center shrink-0 cursor-pointer ${
                  hasMinGuests
                    ? "bg-[#007a48] border-[#007a48] text-white"
                    : "border-slate-300 bg-white hover:border-slate-400"
                }`}
              >
                {hasMinGuests && <Check className="w-3 h-3 stroke-[3]" />}
              </button>
              <span className="text-xs font-medium text-slate-800">
                Số lượng khách tối thiểu
              </span>
            </div>

            <div className="relative w-44 sm:w-48 shrink-0">
              <input
                type="text"
                value={minGuests}
                onChange={(e) => {
                  setMinGuests(e.target.value)
                  onChange?.({ minGuests: e.target.value })
                }}
                className="w-full px-3.5 py-1.5 pr-14 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-500 font-medium pointer-events-none">
                khách
              </span>
            </div>

            <div className="text-xs text-slate-500 font-normal">
              Áp dụng cho số lượng khách trong một đơn
            </div>
          </div>

          {/* Row 3: Thời gian đặt trước tối thiểu */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
            <div className="w-56 sm:w-60 shrink-0 flex items-center gap-2.5">
              <button
                type="button"
                role="checkbox"
                aria-checked={hasMinAdvanceDays}
                onClick={() => {
                  const nextVal = !hasMinAdvanceDays
                  setHasMinAdvanceDays(nextVal)
                  onChange?.({ hasMinAdvanceDays: nextVal })
                }}
                className={`w-4 h-4 rounded border transition-colors flex items-center justify-center shrink-0 cursor-pointer ${
                  hasMinAdvanceDays
                    ? "bg-[#007a48] border-[#007a48] text-white"
                    : "border-slate-300 bg-white hover:border-slate-400"
                }`}
              >
                {hasMinAdvanceDays && <Check className="w-3 h-3 stroke-[3]" />}
              </button>
              <span className="text-xs font-medium text-slate-800">
                Thời gian đặt trước tối thiểu
              </span>
            </div>

            <div className="relative w-44 sm:w-48 shrink-0">
              <input
                type="text"
                value={minAdvanceDays}
                onChange={(e) => {
                  setMinAdvanceDays(e.target.value)
                  onChange?.({ minAdvanceDays: e.target.value })
                }}
                className="w-full px-3.5 py-1.5 pr-12 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-500 font-medium pointer-events-none">
                ngày
              </span>
            </div>

            <div className="text-xs text-slate-500 font-normal">
              Khách hàng cần đặt trước ít nhất số ngày này
            </div>
          </div>

          {/* Row 4: Số lần sử dụng */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
            <div className="w-56 sm:w-60 shrink-0 flex items-center gap-2.5">
              <button
                type="button"
                role="checkbox"
                aria-checked={hasMaxUses}
                onClick={() => {
                  const nextVal = !hasMaxUses
                  setHasMaxUses(nextVal)
                  onChange?.({ hasMaxUses: nextVal })
                }}
                className={`w-4 h-4 rounded border transition-colors flex items-center justify-center shrink-0 cursor-pointer ${
                  hasMaxUses
                    ? "bg-[#007a48] border-[#007a48] text-white"
                    : "border-slate-300 bg-white hover:border-slate-400"
                }`}
              >
                {hasMaxUses && <Check className="w-3 h-3 stroke-[3]" />}
              </button>
              <span className="text-xs font-medium text-slate-800">
                Số lần sử dụng
              </span>
            </div>

            <div className="relative w-44 sm:w-48 shrink-0">
              <select
                value={maxUsesPerUser}
                onChange={(e) => {
                  setMaxUsesPerUser(e.target.value)
                  onChange?.({ maxUsesPerUser: e.target.value })
                }}
                className="w-full px-3.5 py-1.5 pr-8 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 appearance-none cursor-pointer"
              >
                <option value="Mỗi khách hàng 1 lần">Mỗi khách hàng 1 lần</option>
                <option value="Mỗi khách hàng 2 lần">Mỗi khách hàng 2 lần</option>
                <option value="Mỗi khách hàng 3 lần">Mỗi khách hàng 3 lần</option>
                <option value="Không giới hạn">Không giới hạn</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <div className="text-xs text-slate-500 font-normal">
              Giới hạn số lần áp dụng cho mỗi khách hàng
            </div>
          </div>
        </div>
      </div>

      {/* 5. Điều kiện khác */}
      <div>
        <h4 className="text-sm font-bold text-slate-900 tracking-tight mb-3">
          Điều kiện khác
        </h4>

        <div className="space-y-3">
          {/* Checkbox 1: Không áp dụng cho các chương trình khuyến mãi khác */}
          <div className="flex items-center gap-2.5 cursor-pointer select-none">
            <button
              type="button"
              role="checkbox"
              aria-checked={notStackable}
              onClick={() => {
                const nextVal = !notStackable
                setNotStackable(nextVal)
                onChange?.({ notStackable: nextVal })
              }}
              className={`w-4 h-4 rounded transition-colors flex items-center justify-center shrink-0 cursor-pointer ${
                notStackable
                  ? "bg-[#007a48] border border-[#007a48] text-white"
                  : "border border-slate-300 bg-white hover:border-slate-400"
              }`}
            >
              {notStackable && <Check className="w-3 h-3 stroke-[3]" />}
            </button>
            <span
              onClick={() => {
                const nextVal = !notStackable
                setNotStackable(nextVal)
                onChange?.({ notStackable: nextVal })
              }}
              className="text-xs font-semibold text-slate-800"
            >
              Không áp dụng cho các chương trình khuyến mãi khác
            </span>
          </div>

          {/* Checkbox 2: Chỉ áp dụng vào một số ngày trong tuần */}
          <div>
            <div className="flex items-center gap-2.5 cursor-pointer select-none">
              <button
                type="button"
                role="checkbox"
                aria-checked={applySpecificDays}
                onClick={() => {
                  const nextVal = !applySpecificDays
                  setApplySpecificDays(nextVal)
                  onChange?.({ applySpecificDays: nextVal })
                }}
                className={`w-4 h-4 rounded transition-colors flex items-center justify-center shrink-0 cursor-pointer ${
                  applySpecificDays
                    ? "bg-[#007a48] border border-[#007a48] text-white"
                    : "border border-slate-300 bg-white hover:border-slate-400"
                }`}
              >
                {applySpecificDays && <Check className="w-3 h-3 stroke-[3]" />}
              </button>
              <span
                onClick={() => {
                  const nextVal = !applySpecificDays
                  setApplySpecificDays(nextVal)
                  onChange?.({ applySpecificDays: nextVal })
                }}
                className="text-xs font-medium text-slate-800"
              >
                Chỉ áp dụng vào một số ngày trong tuần
              </span>
            </div>

            {/* List of 7 days */}
            <div className="ml-6.5 mt-2 flex flex-wrap items-center gap-4 sm:gap-6">
              {daysList.map((day) => {
                const isDaySelected = selectedDays.includes(day)
                return (
                  <div
                    key={day}
                    className="flex items-center gap-2 cursor-pointer select-none"
                    onClick={() => toggleDay(day)}
                  >
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={isDaySelected}
                      className={`w-3.5 h-3.5 rounded border transition-colors flex items-center justify-center shrink-0 cursor-pointer ${
                        isDaySelected
                          ? "bg-[#007a48] border-[#007a48] text-white"
                          : "border-slate-300 bg-white hover:border-slate-400"
                      }`}
                    >
                      {isDaySelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </button>
                    <span className="text-xs text-slate-600 font-normal">
                      {day}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Checkbox 3: Chỉ áp dụng cho khách đặt qua website/app Stayea */}
          <div className="flex items-center gap-2.5 cursor-pointer select-none">
            <button
              type="button"
              role="checkbox"
              aria-checked={onlyStayeaChannels}
              onClick={() => {
                const nextVal = !onlyStayeaChannels
                setOnlyStayeaChannels(nextVal)
                onChange?.({ onlyStayeaChannels: nextVal })
              }}
              className={`w-4 h-4 rounded transition-colors flex items-center justify-center shrink-0 cursor-pointer ${
                onlyStayeaChannels
                  ? "bg-[#007a48] border border-[#007a48] text-white"
                  : "border border-slate-300 bg-white hover:border-slate-400"
              }`}
            >
              {onlyStayeaChannels && <Check className="w-3 h-3 stroke-[3]" />}
            </button>
            <span
              onClick={() => {
                const nextVal = !onlyStayeaChannels
                setOnlyStayeaChannels(nextVal)
                onChange?.({ onlyStayeaChannels: nextVal })
              }}
              className="text-xs font-semibold text-slate-800"
            >
              Chỉ áp dụng cho khách đặt qua website/app Stayea
            </span>
          </div>

          {/* Checkbox 4: Chỉ áp dụng cho phương thức thanh toán nhất định */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-4">
            <div className="flex items-center gap-2.5 cursor-pointer select-none">
              <button
                type="button"
                role="checkbox"
                aria-checked={applySpecificPayment}
                onClick={() => {
                  const nextVal = !applySpecificPayment
                  setApplySpecificPayment(nextVal)
                  onChange?.({ applySpecificPayment: nextVal })
                }}
                className={`w-4 h-4 rounded transition-colors flex items-center justify-center shrink-0 cursor-pointer ${
                  applySpecificPayment
                    ? "bg-[#007a48] border border-[#007a48] text-white"
                    : "border border-slate-300 bg-white hover:border-slate-400"
                }`}
              >
                {applySpecificPayment && <Check className="w-3 h-3 stroke-[3]" />}
              </button>
              <span
                onClick={() => {
                  const nextVal = !applySpecificPayment
                  setApplySpecificPayment(nextVal)
                  onChange?.({ applySpecificPayment: nextVal })
                }}
                className="text-xs font-medium text-slate-800"
              >
                Chỉ áp dụng cho phương thức thanh toán nhất định
              </span>
            </div>

            <div className="relative min-w-[220px] ml-6.5 sm:ml-0">
              <select
                value={paymentMethod}
                onChange={(e) => {
                  setPaymentMethod(e.target.value)
                  onChange?.({ paymentMethod: e.target.value })
                }}
                className="w-full px-3 py-1.5 pr-8 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 appearance-none cursor-pointer"
              >
                <option value="">Chọn phương thức thanh toán</option>
                <option value="vnpay">VNPAY QR & Thẻ nội địa</option>
                <option value="credit_card">Thẻ tín dụng / Ghi nợ quốc tế</option>
                <option value="momo">Ví điện tử MoMo</option>
                <option value="bank_transfer">Chuyển khoản ngân hàng</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
