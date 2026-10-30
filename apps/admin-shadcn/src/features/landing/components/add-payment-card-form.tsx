"use client"

import * as React from "react"
import {
  CreditCard,
  Calendar,
  Lock,
  HelpCircle,
  MapPin,
  ChevronDown,
  ShieldCheck,
  Check,
} from "lucide-react"
import { VisaLogo, MastercardLogo, JcbLogo } from "./payment-brand-logos"
import { stayeaApi } from "@/lib/stayea-api-service"
import {
  SUPPORTED_COUNTRIES,
  CARD_BRAND_OPTIONS,
} from "@/features/landing/data/stayea-mock-data"
import type { CardBrandOption } from "@/features/landing/data/stayea-mock-data"

interface AddPaymentCardFormProps {
  readonly selectedType: "card" | "bank" | "wallet"
  readonly onCancel: () => void
  readonly onSubmit: (data: NewPaymentMethodPayload) => void
}

export interface NewPaymentMethodPayload {
  readonly type: "card" | "bank" | "wallet"
  readonly cardHolder?: string
  readonly cardNumber?: string
  readonly cardExpiry?: string
  readonly cardCvv?: string
  readonly cardBrand?: "visa" | "mastercard" | "jcb"
  readonly country?: string
  readonly billingAddress?: string
  readonly isDefault?: boolean
  readonly bankName?: string
  readonly bankAccountNumber?: string
  readonly walletType?: string
  readonly walletPhone?: string
}

export function AddPaymentCardForm({
  selectedType,
  onCancel,
  onSubmit,
}: AddPaymentCardFormProps) {
  // Card Form States
  const [cardHolder, setCardHolder] = React.useState<string>("")
  const [cardNumber, setCardNumber] = React.useState<string>("")
  const [cardExpiry, setCardExpiry] = React.useState<string>("")
  const [cardCvv, setCardCvv] = React.useState<string>("")
  const [cardBrand, setCardBrand] = React.useState<"visa" | "mastercard" | "jcb">("visa")
  const [isDefault, setIsDefault] = React.useState<boolean>(true)
  const [billingAddress, setBillingAddress] = React.useState<string>("")
  const [showCvvTooltip, setShowCvvTooltip] = React.useState<boolean>(false)

  // Bank Form States
  const [bankName, setBankName] = React.useState<string>("Ngân hàng TMCP Ngoại thương (Vietcombank)")
  const [bankAccountNumber, setBankAccountNumber] = React.useState<string>("")

  // Wallet Form States
  const [walletType, setWalletType] = React.useState<string>("MoMo")
  const [walletPhone, setWalletPhone] = React.useState<string>("")

  React.useEffect(() => {
    stayeaApi.getProfile().then((u) => {
      if (u && (u.displayName || u.name)) {
        setCardHolder((u.displayName || u.name).toUpperCase())
      }
    }).catch(() => {})
  }, [])

  // Country Dropdown State
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = React.useState<boolean>(false)
  const [selectedCountry, setSelectedCountry] = React.useState<{ code: string; name: string; flag: string }>(
    SUPPORTED_COUNTRIES[0] ?? { code: "VN", name: "Việt Nam", flag: "🇻🇳" }
  )

  // Validation Error State
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

  // Auto format card number with spaces (#### #### #### ####)
  function handleCardNumberChange(e: React.ChangeEvent<HTMLInputElement>) {
    const rawValue = e.target.value.replaceAll(/\D/g, "").slice(0, 16)
    const formatted = rawValue.replaceAll(/(\d{4})(?=\d)/g, "$1 ")
    setCardNumber(formatted)

    // Auto-detect brand based on prefix
    if (rawValue.startsWith("4")) {
      setCardBrand("visa")
    } else if (rawValue.startsWith("5")) {
      setCardBrand("mastercard")
    } else if (rawValue.startsWith("35")) {
      setCardBrand("jcb")
    }
  }

  // Auto format expiry date (MM/YY)
  function handleExpiryChange(e: React.ChangeEvent<HTMLInputElement>) {
    let value = e.target.value.replaceAll(/\D/g, "").slice(0, 4)
    if (value.length >= 3) {
      value = `${value.slice(0, 2)} / ${value.slice(2)}`
    }
    setCardExpiry(value)
  }

  // Format CVV (3-4 digits)
  function handleCvvChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value.replaceAll(/\D/g, "").slice(0, 4)
    setCardCvv(value)
  }

  function handleSubmitForm(e: React.FormEvent) {
    e.preventDefault()
    setErrorMessage(null)

    if (selectedType === "card") {
      if (!cardHolder.trim()) {
        setErrorMessage("Vui lòng nhập tên chủ thẻ.")
        return
      }
      if (cardNumber.replaceAll(/\s/g, "").length < 12) {
        setErrorMessage("Vui lòng nhập số thẻ hợp lệ (tối thiểu 12 chữ số).")
        return
      }
      if (!cardExpiry.includes("/")) {
        setErrorMessage("Vui lòng nhập ngày hết hạn (MM/YY).")
        return
      }
      if (cardCvv.length < 3) {
        setErrorMessage("Vui lòng nhập mã bảo mật CVV (3 hoặc 4 số).")
        return
      }

      onSubmit({
        type: "card",
        cardHolder: cardHolder.toUpperCase(),
        cardNumber,
        cardExpiry,
        cardCvv,
        cardBrand,
        country: selectedCountry.name,
        billingAddress,
        isDefault,
      })
    } else if (selectedType === "bank") {
      if (!bankAccountNumber.trim()) {
        setErrorMessage("Vui lòng nhập số tài khoản ngân hàng.")
        return
      }
      onSubmit({
        type: "bank",
        bankName,
        bankAccountNumber,
        isDefault,
      })
    } else {
      if (!walletPhone.trim()) {
        setErrorMessage("Vui lòng nhập số điện thoại liên kết ví.")
        return
      }
      onSubmit({
        type: "wallet",
        walletType,
        walletPhone,
        isDefault,
      })
    }
  }

  return (
    <form onSubmit={handleSubmitForm} className="space-y-7">
      {errorMessage && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs sm:text-sm">
          {errorMessage}
        </div>
      )}

      {selectedType === "card" && (
        <>
          {/* Section 1: Thông tin thẻ */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-slate-900 pb-1">
              <CreditCard className="w-5 h-5 text-[#0A2239]" />
              <h2 className="text-base sm:text-lg font-bold text-[#0A2239]">Thông tin thẻ</h2>
            </div>

            {/* Field: Tên chủ thẻ */}
            <div>
              <label htmlFor="card-holder" className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
                Tên chủ thẻ
              </label>
              <input
                id="card-holder"
                type="text"
                value={cardHolder}
                onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                placeholder="NGUYEN VAN A"
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 text-sm font-medium tracking-wide focus:outline-hidden focus:border-[#0A2239] focus:ring-2 focus:ring-[#0A2239]/10 transition-all uppercase placeholder:normal-case placeholder:text-slate-400"
              />
              <p className="text-[11px] sm:text-xs text-slate-400 mt-1">
                Nhập đúng tên hiển thị trên thẻ của bạn.
              </p>
            </div>

            {/* Field: Số thẻ */}
            <div>
              <label htmlFor="card-number" className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
                Số thẻ
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <CreditCard className="w-4 h-4" />
                </div>
                <input
                  id="card-number"
                  type="text"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 text-sm font-medium tracking-wider focus:outline-hidden focus:border-[#0A2239] focus:ring-2 focus:ring-[#0A2239]/10 transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Row: Ngày hết hạn & CVV */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Ngày hết hạn */}
              <div>
                <label htmlFor="card-expiry" className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
                  Ngày hết hạn
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <input
                    id="card-expiry"
                    type="text"
                    value={cardExpiry}
                    onChange={handleExpiryChange}
                    placeholder="MM / YY"
                    maxLength={7}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 text-sm font-medium focus:outline-hidden focus:border-[#0A2239] focus:ring-2 focus:ring-[#0A2239]/10 transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* CVV */}
              <div>
                <label htmlFor="card-cvv" className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
                  CVV
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="card-cvv"
                    type="password"
                    value={cardCvv}
                    onChange={handleCvvChange}
                    placeholder="123"
                    maxLength={4}
                    className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 text-sm font-medium tracking-widest focus:outline-hidden focus:border-[#0A2239] focus:ring-2 focus:ring-[#0A2239]/10 transition-all placeholder:text-slate-400"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      onClick={() => setShowCvvTooltip((prev) => !prev)}
                      className="text-slate-400 hover:text-slate-600 cursor-pointer"
                      title="Mã bảo mật gồm 3 hoặc 4 chữ số ở mặt sau thẻ"
                    >
                      <HelpCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {showCvvTooltip && (
                  <p className="text-[11px] text-blue-600 mt-1">
                    Mã bảo mật gồm 3 hoặc 4 chữ số ở mặt sau thẻ (hoặc mặt trước thẻ Amex).
                  </p>
                )}
              </div>
            </div>

            {/* Field: Loại thẻ */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                Loại thẻ
              </label>
              <div className="grid grid-cols-3 gap-3">
                {CARD_BRAND_OPTIONS.map((brand: CardBrandOption) => {
                  const isBrandSelected = cardBrand === brand.id
                  return (
                    <button
                      key={brand.id}
                      type="button"
                      onClick={() => setCardBrand(brand.id)}
                      className={`relative flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl transition-all cursor-pointer ${
                        isBrandSelected
                          ? "bg-[#F0F7FF] border-2 border-[#1E40AF] shadow-2xs"
                          : "bg-white border border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      {/* Left Radio Dot Indicator */}
                      <div className="absolute top-3 left-3 sm:top-3.5 sm:left-3.5">
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                            isBrandSelected
                              ? "border-[#1E40AF] bg-white"
                              : "border-slate-300 bg-white"
                          }`}
                        >
                          {isBrandSelected && <div className="w-2 h-2 rounded-full bg-[#1E40AF]" />}
                        </div>
                      </div>

                      {/* Brand Logo */}
                      <div className="h-6 flex items-center justify-center mb-1">
                        {brand.id === "visa" && <VisaLogo className="h-4 w-auto" />}
                        {brand.id === "mastercard" && <MastercardLogo className="h-5 w-auto" />}
                        {brand.id === "jcb" && <JcbLogo className="h-4" />}
                      </div>

                      {/* Brand Label */}
                      <span className="text-[11px] sm:text-xs text-slate-600 font-medium">
                        {brand.label}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Section 2: Địa chỉ thanh toán */}
          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-2 text-slate-900 pb-1">
              <MapPin className="w-5 h-5 text-[#0A2239]" />
              <h2 className="text-base sm:text-lg font-bold text-[#0A2239]">Địa chỉ thanh toán</h2>
            </div>

            {/* Field: Quốc gia/Khu vực */}
            <div className="relative">
              <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
                Quốc gia/Khu vực
              </label>
              <button
                type="button"
                onClick={() => setIsCountryDropdownOpen((prev) => !prev)}
                className="w-full flex items-center justify-between px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 text-sm font-medium hover:border-slate-300 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-base leading-none">{selectedCountry.flag}</span>
                  <span>{selectedCountry.name}</span>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>

              {/* Country Selection Dropdown */}
              {isCountryDropdownOpen && (
                <div className="absolute z-30 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg py-1 max-h-56 overflow-auto">
                  {SUPPORTED_COUNTRIES.map((c) => (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => {
                        setSelectedCountry(c)
                        setIsCountryDropdownOpen(false)
                      }}
                      className="w-full flex items-center justify-between px-4 py-2 text-sm text-left hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-base leading-none">{c.flag}</span>
                        <span className={c.code === selectedCountry.code ? "font-bold text-[#0A2239]" : "text-slate-700"}>
                          {c.name}
                        </span>
                      </div>
                      {c.code === selectedCountry.code && (
                        <Check className="w-4 h-4 text-[#1E40AF]" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Field: Địa chỉ thanh toán (tùy chọn) */}
            <div>
              <label htmlFor="billing-address" className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
                Địa chỉ thanh toán <span className="text-slate-400 font-normal">(tùy chọn)</span>
              </label>
              <input
                id="billing-address"
                type="text"
                value={billingAddress}
                onChange={(e) => setBillingAddress(e.target.value)}
                placeholder="Nhập địa chỉ thanh toán của bạn"
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 text-sm font-medium focus:outline-hidden focus:border-[#0A2239] focus:ring-2 focus:ring-[#0A2239]/10 transition-all placeholder:text-slate-400"
              />
              <p className="text-[11px] sm:text-xs text-slate-400 mt-1">
                Địa chỉ này phải trùng với địa chỉ đăng ký thẻ để xác minh thanh toán.
              </p>
            </div>
          </div>
        </>
      )}

      {selectedType === "bank" && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-slate-900 pb-1">
            <CreditCard className="w-5 h-5 text-[#0A2239]" />
            <h2 className="text-base sm:text-lg font-bold text-[#0A2239]">Liên kết tài khoản ngân hàng</h2>
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
              Chọn ngân hàng
            </label>
            <select
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 text-sm font-medium focus:outline-hidden focus:border-[#0A2239]"
            >
              <option value="Vietcombank">Ngân hàng TMCP Ngoại thương (Vietcombank)</option>
              <option value="BIDV">Ngân hàng TMCP Đầu tư và Phát triển (BIDV)</option>
              <option value="Techcombank">Ngân hàng TMCP Kỹ Thương (Techcombank)</option>
              <option value="MBBank">Ngân hàng TMCP Quân đội (MBBank)</option>
              <option value="ACB">Ngân hàng TMCP Á Châu (ACB)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
              Số tài khoản ngân hàng
            </label>
            <input
              type="text"
              value={bankAccountNumber}
              onChange={(e) => setBankAccountNumber(e.target.value)}
              placeholder="VD: 10123456789"
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 text-sm font-medium focus:outline-hidden focus:border-[#0A2239]"
            />
          </div>
        </div>
      )}

      {selectedType === "wallet" && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-slate-900 pb-1">
            <CreditCard className="w-5 h-5 text-[#0A2239]" />
            <h2 className="text-base sm:text-lg font-bold text-[#0A2239]">Liên kết ví điện tử</h2>
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
              Chọn ví điện tử
            </label>
            <select
              value={walletType}
              onChange={(e) => setWalletType(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 text-sm font-medium focus:outline-hidden focus:border-[#0A2239]"
            >
              <option value="MoMo">Ví MoMo</option>
              <option value="ZaloPay">Ví ZaloPay</option>
              <option value="VNPay">Ví VNPay</option>
              <option value="ShopeePay">Ví ShopeePay</option>
            </select>
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
              Số điện thoại liên kết ví
            </label>
            <input
              type="tel"
              value={walletPhone}
              onChange={(e) => setWalletPhone(e.target.value)}
              placeholder="0912 345 678"
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 text-sm font-medium focus:outline-hidden focus:border-[#0A2239]"
            />
          </div>
        </div>
      )}

      {/* Switch: Đặt làm phương thức thanh toán mặc định */}
      <div className="flex items-center gap-3.5 pt-1">
        <button
          type="button"
          role="switch"
          aria-checked={isDefault}
          onClick={() => setIsDefault((prev) => !prev)}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
            isDefault ? "bg-[#1E40AF]" : "bg-slate-300"
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
              isDefault ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
        <div>
          <span className="block text-xs sm:text-sm font-semibold text-slate-800">
            Đặt làm phương thức thanh toán mặc định
          </span>
          <span className="block text-[11px] sm:text-xs text-slate-500">
            Sử dụng phương thức này cho các giao dịch tiếp theo.
          </span>
        </div>
      </div>

      {/* Security Assurance Banner */}
      <div className="flex items-start gap-3 p-4 bg-[#F0F7FF] border border-[#BFDBFE] rounded-2xl">
        <ShieldCheck className="w-5 h-5 text-[#1E40AF] shrink-0 mt-0.5" />
        <div>
          <h4 className="text-xs sm:text-sm font-bold text-[#0A2239]">
            Thông tin của bạn được mã hóa và bảo mật
          </h4>
          <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 leading-relaxed">
            Chúng tôi sử dụng công nghệ mã hóa SSL và tuân thủ các tiêu chuẩn an toàn thanh toán quốc tế để bảo vệ thông tin của bạn.
          </p>
        </div>
      </div>

      {/* Action Buttons: Hủy & Lưu phương thức */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-7 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold rounded-xl transition-all active:scale-95 cursor-pointer shadow-2xs"
        >
          Hủy
        </button>
        <button
          type="submit"
          className="px-7 py-2.5 bg-[#0A2239] hover:bg-[#071726] text-white text-xs sm:text-sm font-semibold rounded-xl shadow-sm hover:shadow transition-all active:scale-95 cursor-pointer"
        >
          Lưu phương thức
        </button>
      </div>
    </form>
  )
}
