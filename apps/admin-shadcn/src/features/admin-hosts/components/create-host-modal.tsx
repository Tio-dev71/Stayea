"use client"

import { useState, useEffect, useId } from "react"
import {
  Plus,
  X,
  User,
  Briefcase,
  Phone,
  Mail,
  UploadCloud,
  Languages,
  MapPin,
  Building2,
  CheckCircle2,
  ChevronDown,
  Store,
  Calendar,
  ArrowRight,
  Landmark,
  CreditCard,
  ShieldCheck,
  FileText,
  Info,
  Wallet,
  Cloud,
  Share2,
  Archive,
} from "lucide-react"
import type { PartnerType } from "@/features/admin-hosts/stayea-admin-hosts-mock-data"

export type BusinessEntityType = "enterprise" | "household" | "individual"
export type PayoutMethodType = "bank_transfer" | "e_wallet" | "other"

export interface CreateHostFormData {
  fullName: string
  partnerType: PartnerType
  phoneNumber: string
  email: string
  nationality: string
  communicationLanguage: string
  zalo?: string
  whatsApp?: string
  address: string
  province: string
  district: string
  ward: string
  isActiveNow: boolean
  // Business Tab Fields
  businessEntityType: BusinessEntityType
  businessName: string
  taxCode: string
  shortName?: string
  industry?: string
  foundingDate?: string
  companySize?: string
  headquartersAddress?: string
  headquartersProvince?: string
  headquartersDistrict?: string
  headquartersWard?: string
  // Payment Tab Fields
  payoutMethodType: PayoutMethodType
  bankAccountHolder: string
  bankName: string
  bankAccountNumber: string
  bankBranch?: string
  paymentCycle: string
  payoutType: string
  // Notes & Settings Tab Fields
  internalNotes?: string
  accountStatus?: "active" | "inactive" | "pending"
  partnerGroup?: string
  referralSource?: string
  autoNotification?: boolean
  shareRevenueReport?: boolean
  receiveMarketingEmail?: boolean
  isStrategicPartner?: boolean
}

export type ModalSubTab = "basic" | "business" | "payment" | "notes"

interface CreateHostModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmitSuccess?: (data: CreateHostFormData) => void
  initialTab?: ModalSubTab
}

export function CreateHostModal({
  isOpen,
  onClose,
  onSubmitSuccess,
  initialTab = "basic",
}: CreateHostModalProps) {
  const [activeTab, setActiveTab] = useState<ModalSubTab>(initialTab)

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab)
    }
  }, [isOpen, initialTab])

  // Form Fields - Tab 1: Basic
  const [fullName, setFullName] = useState("")
  const [partnerType, setPartnerType] = useState<PartnerType>("management_company")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [email, setEmail] = useState("")
  const [nationality, setNationality] = useState("Việt Nam")
  const [communicationLanguage, setCommunicationLanguage] = useState("Tiếng Việt")
  const [zalo, setZalo] = useState("")
  const [whatsApp, setWhatsApp] = useState("")
  const [address, setAddress] = useState("")
  const [province, setProvince] = useState("Kiên Giang")
  const [district, setDistrict] = useState("TP. Phú Quốc")
  const [ward, setWard] = useState("Phường Dương Đông")
  const [isActiveNow, setIsActiveNow] = useState(true)

  // Form Fields - Tab 2: Business
  const [businessEntityType, setBusinessEntityType] = useState<BusinessEntityType>("enterprise")
  const [businessName, setBusinessName] = useState("")
  const [taxCode, setTaxCode] = useState("")
  const [shortName, setShortName] = useState("")
  const [industry, setIndustry] = useState("")
  const [foundingDate, setFoundingDate] = useState("")
  const [companySize, setCompanySize] = useState("")
  const [headquartersAddress, setHeadquartersAddress] = useState("")
  const [headquartersProvince, setHeadquartersProvince] = useState("")
  const [headquartersDistrict, setHeadquartersDistrict] = useState("")
  const [headquartersWard, setHeadquartersWard] = useState("")

  // Form Fields - Tab 3: Payment
  const [payoutMethodType, setPayoutMethodType] = useState<PayoutMethodType>("bank_transfer")
  const [bankAccountHolder, setBankAccountHolder] = useState("")
  const [bankName, setBankName] = useState("")
  const [bankAccountNumber, setBankAccountNumber] = useState("")
  const [bankBranch, setBankBranch] = useState("")
  const [paymentCycle, setPaymentCycle] = useState("Hàng tháng")
  const [payoutType, setPayoutType] = useState("Chuyển khoản ngân hàng")

  // Form Fields - Tab 4: Notes & Settings
  const [internalNotes, setInternalNotes] = useState("")
  const [accountStatus, setAccountStatus] = useState<"active" | "inactive" | "pending">("active")
  const [partnerGroup, setPartnerGroup] = useState("")
  const [referralSource, setReferralSource] = useState("")
  const [autoNotification, setAutoNotification] = useState(true)
  const [shareRevenueReport, setShareRevenueReport] = useState(true)
  const [receiveMarketingEmail, setReceiveMarketingEmail] = useState(true)
  const [isStrategicPartner, setIsStrategicPartner] = useState(false)

  const activeToggleId = useId()

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const formData: CreateHostFormData = {
      fullName: fullName || (businessName ? businessName : "Chủ nhà mới"),
      partnerType,
      phoneNumber,
      email,
      nationality,
      communicationLanguage,
      zalo,
      whatsApp,
      address,
      province,
      district,
      ward,
      isActiveNow,
      businessEntityType,
      businessName,
      taxCode,
      shortName,
      industry,
      foundingDate,
      companySize,
      headquartersAddress,
      headquartersProvince,
      headquartersDistrict,
      headquartersWard,
      payoutMethodType,
      bankAccountHolder,
      bankName,
      bankAccountNumber,
      bankBranch,
      paymentCycle,
      payoutType,
      internalNotes,
      accountStatus,
      partnerGroup,
      referralSource,
      autoNotification,
      shareRevenueReport,
      receiveMarketingEmail,
      isStrategicPartner,
    }

    onSubmitSuccess?.(formData)
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-host-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/45 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden z-10 flex flex-col my-auto max-h-[96vh]">
        {/* 1. Modal Header */}
        <div className="px-4 sm:px-7 py-3.5 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#1b7a4e] flex items-center justify-center text-white shrink-0 shadow-xs">
              <Plus className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2
                id="create-host-title"
                className="text-base sm:text-lg font-bold text-slate-900 tracking-tight"
              >
                Thêm chủ nhà/đối tác
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Tạo tài khoản chủ nhà, đối tác mới để bắt đầu hợp tác cùng Stayea.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng biểu mẫu"
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2. Stepper / Sub Tabs */}
        <div className="px-4 sm:px-7 pt-2.5 pb-1.5 border-b border-slate-100 bg-slate-50/50">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 bg-slate-100/70 rounded-2xl text-xs font-medium">
            <button
              type="button"
              onClick={() => setActiveTab("basic")}
              className={`py-2 px-3 rounded-xl transition-all text-center truncate border-b-2 ${
                activeTab === "basic"
                  ? "bg-white text-[#1b7a4e] font-bold border-[#1b7a4e] shadow-xs"
                  : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-white/50"
              }`}
            >
              Thông tin cơ bản
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("business")}
              className={`py-2 px-3 rounded-xl transition-all text-center truncate border-b-2 ${
                activeTab === "business"
                  ? "bg-white text-[#1b7a4e] font-bold border-[#1b7a4e] shadow-xs"
                  : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-white/50"
              }`}
            >
              Thông tin doanh nghiệp
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("payment")}
              className={`py-2 px-3 rounded-xl transition-all text-center truncate border-b-2 ${
                activeTab === "payment"
                  ? "bg-white text-[#1b7a4e] font-bold border-[#1b7a4e] shadow-xs"
                  : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-white/50"
              }`}
            >
              Thông tin thanh toán
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("notes")}
              className={`py-2 px-3 rounded-xl transition-all text-center truncate border-b-2 ${
                activeTab === "notes"
                  ? "bg-white text-[#1b7a4e] font-bold border-[#1b7a4e] shadow-xs"
                  : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-white/50"
              }`}
            >
              Ghi chú &amp; cài đặt
            </button>
          </div>
        </div>

        {/* 3. Modal Form Body (Scrollable) */}
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 p-4 sm:px-7 sm:py-4 space-y-3.5">
          {activeTab === "basic" ? (
            /* TAB 1: THÔNG TIN CƠ BẢN */
            <>
              {/* SECTION 1: Thông tin cá nhân / Liên hệ (Left) & Ảnh đại diện (Right) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                {/* Left 8 cols: Personal / Contact info */}
                <div className="lg:col-span-8 space-y-3">
                  <h3 className="text-xs sm:text-sm font-bold text-slate-800">
                    Thông tin cá nhân / Liên hệ
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {/* Họ và tên */}
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Họ và tên <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Nhập họ và tên"
                          className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-white placeholder:text-slate-400 focus:outline-none focus:border-[#1b7a4e] focus:ring-1 focus:ring-[#1b7a4e] transition-all font-medium"
                        />
                      </div>
                    </div>

                    {/* Loại đối tác */}
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Loại đối tác <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Briefcase className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <select
                          value={partnerType}
                          onChange={(e) => setPartnerType(e.target.value as PartnerType)}
                          className="w-full appearance-none pl-9 pr-8 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:border-[#1b7a4e] focus:ring-1 focus:ring-[#1b7a4e] transition-all font-medium cursor-pointer"
                        >
                          <option value="individual">Chủ nhà cá nhân</option>
                          <option value="management_company">Công ty quản lý</option>
                          <option value="agency">Đối tác đại lý</option>
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    {/* Số điện thoại */}
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Số điện thoại <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="tel"
                          required
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder="Nhập số điện thoại"
                          className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-white placeholder:text-slate-400 focus:outline-none focus:border-[#1b7a4e] focus:ring-1 focus:ring-[#1b7a4e] transition-all font-medium"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Email <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Nhập email"
                          className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-white placeholder:text-slate-400 focus:outline-none focus:border-[#1b7a4e] focus:ring-1 focus:ring-[#1b7a4e] transition-all font-medium"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right 4 cols: Avatar Upload */}
                <div className="lg:col-span-4 space-y-2 text-center lg:border-l lg:border-slate-100 lg:pl-5">
                  <h3 className="text-xs sm:text-sm font-bold text-slate-800 text-left lg:text-center">
                    Ảnh đại diện
                  </h3>

                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-dashed border-slate-300 flex flex-col items-center justify-center mx-auto text-center cursor-pointer hover:border-[#1b7a4e] bg-slate-50/60 hover:bg-emerald-50/20 transition-all group">
                    <UploadCloud className="w-6 h-6 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                    <span className="text-[10px] sm:text-[11px] text-slate-500 font-medium mt-1 leading-tight px-2">
                      Tải ảnh lên <br /> hoặc kéo thả
                    </span>
                  </div>

                  <span className="text-[10px] text-slate-400 block">
                    JPG, PNG, tối đa 5MB
                  </span>
                </div>
              </div>

              {/* SECTION 2: Thông tin bổ sung */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <h3 className="text-xs sm:text-sm font-bold text-slate-800">
                  Thông tin bổ sung
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  {/* Quốc tịch */}
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Quốc tịch
                    </label>
                    <div className="relative">
                      <select
                        value={nationality}
                        onChange={(e) => setNationality(e.target.value)}
                        className="w-full appearance-none pl-3 pr-7 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:border-[#1b7a4e] focus:ring-1 focus:ring-[#1b7a4e] transition-all font-medium cursor-pointer"
                      >
                        <option value="Việt Nam">🇻🇳 Việt Nam</option>
                        <option value="Hàn Quốc">🇰🇷 Hàn Quốc</option>
                        <option value="Trung Quốc">🇨🇳 Trung Quốc</option>
                        <option value="Mỹ">🇺🇸 Mỹ</option>
                        <option value="Anh">🇬🇧 Anh</option>
                        <option value="Khác">🌐 Quốc gia khác</option>
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {/* Ngôn ngữ giao tiếp */}
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Ngôn ngữ giao tiếp
                    </label>
                    <div className="relative">
                      <Languages className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <select
                        value={communicationLanguage}
                        onChange={(e) => setCommunicationLanguage(e.target.value)}
                        className="w-full appearance-none pl-9 pr-7 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:border-[#1b7a4e] focus:ring-1 focus:ring-[#1b7a4e] transition-all font-medium cursor-pointer"
                      >
                        <option value="Tiếng Việt">Tiếng Việt</option>
                        <option value="English">English</option>
                        <option value="한국어">한국어</option>
                        <option value="中文">中文</option>
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {/* Zalo */}
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Zalo (nếu có)
                    </label>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-sky-600 bg-sky-50 px-1 py-0.5 rounded pointer-events-none">
                        Zalo
                      </span>
                      <input
                        type="text"
                        value={zalo}
                        onChange={(e) => setZalo(e.target.value)}
                        placeholder="Nhập Zalo"
                        className="w-full pl-12 pr-3 py-2 rounded-xl border border-slate-200 bg-white placeholder:text-slate-400 focus:outline-none focus:border-[#1b7a4e] focus:ring-1 focus:ring-[#1b7a4e] transition-all font-medium"
                      />
                    </div>
                  </div>

                  {/* WhatsApp */}
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      WhatsApp (nếu có)
                    </label>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1 py-0.5 rounded pointer-events-none">
                        WA
                      </span>
                      <input
                        type="text"
                        value={whatsApp}
                        onChange={(e) => setWhatsApp(e.target.value)}
                        placeholder="Nhập WhatsApp"
                        className="w-full pl-10 pr-3 py-2 rounded-xl border border-slate-200 bg-white placeholder:text-slate-400 focus:outline-none focus:border-[#1b7a4e] focus:ring-1 focus:ring-[#1b7a4e] transition-all font-medium"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 3: Địa chỉ liên hệ */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <h3 className="text-xs sm:text-sm font-bold text-slate-800">
                  Địa chỉ liên hệ
                </h3>

                <div className="space-y-3 text-xs">
                  {/* Row 1: Địa chỉ + Tỉnh/Thành phố */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Địa chỉ
                      </label>
                      <div className="relative">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="text"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="Nhập địa chỉ (số nhà, tên đường...)"
                          className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-white placeholder:text-slate-400 focus:outline-none focus:border-[#1b7a4e] focus:ring-1 focus:ring-[#1b7a4e] transition-all font-medium"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Tỉnh/Thành phố
                      </label>
                      <div className="relative">
                        <Building2 className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <select
                          value={province}
                          onChange={(e) => setProvince(e.target.value)}
                          className="w-full appearance-none pl-9 pr-7 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:border-[#1b7a4e] focus:ring-1 focus:ring-[#1b7a4e] transition-all font-medium cursor-pointer"
                        >
                          <option value="Kiên Giang">Kiên Giang</option>
                          <option value="Hồ Chí Minh">TP. Hồ Chí Minh</option>
                          <option value="Hà Nội">Hà Nội</option>
                          <option value="Đà Nẵng">Đà Nẵng</option>
                          <option value="Khánh Hòa">Khánh Hòa</option>
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* Row 2: Quận/Huyện + Phường/Xã */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Quận/Huyện
                      </label>
                      <div className="relative">
                        <Building2 className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <select
                          value={district}
                          onChange={(e) => setDistrict(e.target.value)}
                          className="w-full appearance-none pl-9 pr-7 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:border-[#1b7a4e] focus:ring-1 focus:ring-[#1b7a4e] transition-all font-medium cursor-pointer"
                        >
                          <option value="TP. Phú Quốc">TP. Phú Quốc</option>
                          <option value="Huyện Kiên Hải">Huyện Kiên Hải</option>
                          <option value="TP. Rạch Giá">TP. Rạch Giá</option>
                          <option value="TP. Hà Tiên">TP. Hà Tiên</option>
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Phường/Xã
                      </label>
                      <div className="relative">
                        <Building2 className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <select
                          value={ward}
                          onChange={(e) => setWard(e.target.value)}
                          className="w-full appearance-none pl-9 pr-7 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:border-[#1b7a4e] focus:ring-1 focus:ring-[#1b7a4e] transition-all font-medium cursor-pointer"
                        >
                          <option value="Phường Dương Đông">Phường Dương Đông</option>
                          <option value="Phường An Thới">Phường An Thới</option>
                          <option value="Xã Gành Dầu">Xã Gành Dầu</option>
                          <option value="Xã Cửa Cạn">Xã Cửa Cạn</option>
                          <option value="Xã Hàm Ninh">Xã Hàm Ninh</option>
                          <option value="Xã Dương Tơ">Xã Dương Tơ</option>
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 4: Trạng thái (Toggle Switch) */}
              <div className="space-y-2 pt-3 border-t border-slate-100">
                <h3 className="text-xs sm:text-sm font-bold text-slate-800">
                  Trạng thái
                </h3>

                <div className="flex items-center gap-3">
                  {/* Switch Pill */}
                  <button
                    type="button"
                    role="switch"
                    aria-checked={isActiveNow}
                    id={activeToggleId}
                    onClick={() => setIsActiveNow(!isActiveNow)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      isActiveNow ? "bg-[#1b7a4e]" : "bg-slate-200"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                        isActiveNow ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>

                  <div className="select-none">
                    <label
                      htmlFor={activeToggleId}
                      className="text-xs sm:text-sm font-semibold text-slate-800 cursor-pointer block"
                    >
                      Kích hoạt tài khoản ngay
                    </label>
                    <span className="text-[11px] text-slate-500 font-medium block">
                      Chủ nhà/đối tác sẽ nhận email thông báo tài khoản và hướng dẫn sử dụng.
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons Footer for Tab 1 */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-medium transition-colors"
                >
                  Hủy
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("business")}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#1b7a4e] hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs sm:text-sm font-semibold shadow-xs transition-all"
                >
                  <span>Tiếp tục</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : activeTab === "business" ? (
            /* TAB 2: THÔNG TIN DOANH NGHIỆP / CÁ NHÂN (HỘ KINH DOANH) */
            <>
              {/* SECTION 1: Loại đối tác (3 cards: Doanh nghiệp | Hộ kinh doanh | Cá nhân) */}
              <div className="space-y-2">
                <label className="block text-xs sm:text-sm font-bold text-slate-800">
                  Loại đối tác <span className="text-rose-500">*</span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* 1. Doanh nghiệp */}
                  <button
                    type="button"
                    onClick={() => setBusinessEntityType("enterprise")}
                    className={`flex items-center gap-3 p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      businessEntityType === "enterprise"
                        ? "border-[#1b7a4e] bg-emerald-50/40 shadow-xs ring-1 ring-[#1b7a4e]"
                        : "border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                        businessEntityType === "enterprise"
                          ? "border-[#1b7a4e] bg-white"
                          : "border-slate-300 bg-white"
                      }`}
                    >
                      {businessEntityType === "enterprise" && (
                        <div className="w-2 h-2 rounded-full bg-[#1b7a4e]" />
                      )}
                    </div>

                    <div className="w-7 h-7 rounded-lg bg-emerald-100/60 text-[#1b7a4e] flex items-center justify-center shrink-0">
                      <Building2 className="w-4 h-4" />
                    </div>

                    <div className="min-w-0">
                      <span className="font-bold text-xs sm:text-sm text-slate-900 block truncate leading-tight">
                        Doanh nghiệp
                      </span>
                      <span className="text-[11px] text-slate-500 block truncate mt-0.5">
                        Công ty, pháp nhân
                      </span>
                    </div>
                  </button>

                  {/* 2. Hộ kinh doanh */}
                  <button
                    type="button"
                    onClick={() => setBusinessEntityType("household")}
                    className={`flex items-center gap-3 p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      businessEntityType === "household"
                        ? "border-[#1b7a4e] bg-emerald-50/40 shadow-xs ring-1 ring-[#1b7a4e]"
                        : "border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                        businessEntityType === "household"
                          ? "border-[#1b7a4e] bg-white"
                          : "border-slate-300 bg-white"
                      }`}
                    >
                      {businessEntityType === "household" && (
                        <div className="w-2 h-2 rounded-full bg-[#1b7a4e]" />
                      )}
                    </div>

                    <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                      <Store className="w-4 h-4" />
                    </div>

                    <div className="min-w-0">
                      <span className="font-bold text-xs sm:text-sm text-slate-900 block truncate leading-tight">
                        Hộ kinh doanh
                      </span>
                      <span className="text-[11px] text-slate-500 block truncate mt-0.5">
                        Hộ kinh doanh cá thể
                      </span>
                    </div>
                  </button>

                  {/* 3. Cá nhân */}
                  <button
                    type="button"
                    onClick={() => setBusinessEntityType("individual")}
                    className={`flex items-center gap-3 p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      businessEntityType === "individual"
                        ? "border-[#1b7a4e] bg-emerald-50/40 shadow-xs ring-1 ring-[#1b7a4e]"
                        : "border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                        businessEntityType === "individual"
                          ? "border-[#1b7a4e] bg-white"
                          : "border-slate-300 bg-white"
                      }`}
                    >
                      {businessEntityType === "individual" && (
                        <div className="w-2 h-2 rounded-full bg-[#1b7a4e]" />
                      )}
                    </div>

                    <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                      <User className="w-4 h-4" />
                    </div>

                    <div className="min-w-0">
                      <span className="font-bold text-xs sm:text-sm text-slate-900 block truncate leading-tight">
                        Cá nhân
                      </span>
                      <span className="text-[11px] text-slate-500 block truncate mt-0.5">
                        Cho thuê tài sản cá nhân
                      </span>
                    </div>
                  </button>
                </div>
              </div>

              {/* SECTION 2: Thông tin doanh nghiệp */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs sm:text-sm font-bold text-slate-800">
                  Thông tin doanh nghiệp
                </h3>

                <div className="space-y-3 text-xs">
                  {/* Row 1: Tên doanh nghiệp * & Mã số thuế * */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Tên doanh nghiệp <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        placeholder="Nhập tên doanh nghiệp (ví dụ: Công ty TNHH ABC)"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white placeholder:text-slate-400 focus:outline-none focus:border-[#1b7a4e] focus:ring-1 focus:ring-[#1b7a4e] transition-all font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Mã số thuế <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={taxCode}
                        onChange={(e) => setTaxCode(e.target.value)}
                        placeholder="Nhập mã số thuế"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white placeholder:text-slate-400 focus:outline-none focus:border-[#1b7a4e] focus:ring-1 focus:ring-[#1b7a4e] transition-all font-medium"
                      />
                    </div>
                  </div>

                  {/* Row 2: Tên viết tắt & Ngành nghề kinh doanh */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Tên viết tắt
                      </label>
                      <input
                        type="text"
                        value={shortName}
                        onChange={(e) => setShortName(e.target.value)}
                        placeholder="Nhập tên viết tắt (nếu có)"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white placeholder:text-slate-400 focus:outline-none focus:border-[#1b7a4e] focus:ring-1 focus:ring-[#1b7a4e] transition-all font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Ngành nghề kinh doanh
                      </label>
                      <div className="relative">
                        <select
                          value={industry}
                          onChange={(e) => setIndustry(e.target.value)}
                          className="w-full appearance-none pl-3 pr-7 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:border-[#1b7a4e] focus:ring-1 focus:ring-[#1b7a4e] transition-all font-medium cursor-pointer"
                        >
                          <option value="">Chọn ngành nghề</option>
                          <option value="Dịch vụ lưu trú & khách sạn">Dịch vụ lưu trú &amp; khách sạn</option>
                          <option value="Quản lý bất động sản">Quản lý &amp; vận hành bất động sản</option>
                          <option value="Lữ hành & Tour du lịch">Lữ hành &amp; Tour du lịch</option>
                          <option value="Ẩm thực & Giải trí">Ẩm thực &amp; Giải trí biển đảo</option>
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* Row 3: Ngày thành lập & Quy mô doanh nghiệp */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Ngày thành lập
                      </label>
                      <div className="relative">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="text"
                          value={foundingDate}
                          onChange={(e) => setFoundingDate(e.target.value)}
                          placeholder="Chọn ngày"
                          className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-white placeholder:text-slate-400 focus:outline-none focus:border-[#1b7a4e] focus:ring-1 focus:ring-[#1b7a4e] transition-all font-medium"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Quy mô doanh nghiệp
                      </label>
                      <div className="relative">
                        <select
                          value={companySize}
                          onChange={(e) => setCompanySize(e.target.value)}
                          className="w-full appearance-none pl-3 pr-7 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:border-[#1b7a4e] focus:ring-1 focus:ring-[#1b7a4e] transition-all font-medium cursor-pointer"
                        >
                          <option value="">Chọn quy mô</option>
                          <option value="Dưới 10 nhân sự">Dưới 10 nhân sự</option>
                          <option value="10 - 50 nhân sự">10 - 50 nhân sự</option>
                          <option value="50 - 200 nhân sự">50 - 200 nhân sự</option>
                          <option value="Trên 200 nhân sự">Trên 200 nhân sự</option>
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 3: Địa chỉ trụ sở chính */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <h3 className="text-xs sm:text-sm font-bold text-slate-800">
                  Địa chỉ trụ sở chính
                </h3>

                <div className="space-y-3 text-xs">
                  {/* Địa chỉ * */}
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Địa chỉ <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={headquartersAddress}
                      onChange={(e) => setHeadquartersAddress(e.target.value)}
                      placeholder="Nhập số nhà, tên đường, phường/xã..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white placeholder:text-slate-400 focus:outline-none focus:border-[#1b7a4e] focus:ring-1 focus:ring-[#1b7a4e] transition-all font-medium"
                    />
                  </div>

                  {/* 3 cols: Tỉnh/Thành phố * | Quận/Huyện * | Phường/Xã * */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Tỉnh/Thành phố <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Building2 className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <select
                          value={headquartersProvince}
                          onChange={(e) => setHeadquartersProvince(e.target.value)}
                          className="w-full appearance-none pl-9 pr-7 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:border-[#1b7a4e] focus:ring-1 focus:ring-[#1b7a4e] transition-all font-medium cursor-pointer"
                        >
                          <option value="">Chọn tỉnh/thành phố</option>
                          <option value="Kiên Giang">Kiên Giang</option>
                          <option value="Hồ Chí Minh">TP. Hồ Chí Minh</option>
                          <option value="Hà Nội">Hà Nội</option>
                          <option value="Đà Nẵng">Đà Nẵng</option>
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Quận/Huyện <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Building2 className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <select
                          value={headquartersDistrict}
                          onChange={(e) => setHeadquartersDistrict(e.target.value)}
                          className="w-full appearance-none pl-9 pr-7 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:border-[#1b7a4e] focus:ring-1 focus:ring-[#1b7a4e] transition-all font-medium cursor-pointer"
                        >
                          <option value="">Chọn quận/huyện</option>
                          <option value="TP. Phú Quốc">TP. Phú Quốc</option>
                          <option value="Huyện Kiên Hải">Huyện Kiên Hải</option>
                          <option value="TP. Rạch Giá">TP. Rạch Giá</option>
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Phường/Xã <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Building2 className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <select
                          value={headquartersWard}
                          onChange={(e) => setHeadquartersWard(e.target.value)}
                          className="w-full appearance-none pl-9 pr-7 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:border-[#1b7a4e] focus:ring-1 focus:ring-[#1b7a4e] transition-all font-medium cursor-pointer"
                        >
                          <option value="">Chọn phường/xã</option>
                          <option value="Phường Dương Đông">Phường Dương Đông</option>
                          <option value="Phường An Thới">Phường An Thới</option>
                          <option value="Xã Gành Dầu">Xã Gành Dầu</option>
                          <option value="Xã Cửa Cạn">Xã Cửa Cạn</option>
                          <option value="Xã Hàm Ninh">Xã Hàm Ninh</option>
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 4: Giấy tờ pháp lý */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <h3 className="text-xs sm:text-sm font-bold text-slate-800">
                  Giấy tờ pháp lý
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Card 1: Giấy chứng nhận ĐKKD */}
                  <div className="space-y-1.5">
                    <label className="block text-[11px] text-slate-700 font-semibold truncate">
                      Giấy chứng nhận đăng ký doanh nghiệp <span className="text-rose-500">*</span>
                    </label>
                    <div className="border-2 border-dashed border-slate-200 rounded-2xl p-4 flex flex-col items-center justify-center text-center hover:border-emerald-500 hover:bg-emerald-50/20 transition-all cursor-pointer group">
                      <UploadCloud className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                      <span className="text-xs font-semibold text-slate-700 group-hover:text-emerald-700 mt-1.5">
                        Tải lên file
                      </span>
                      <span className="text-[10px] text-slate-400 mt-0.5">
                        (PDF, JPG, PNG, tối đa 5MB)
                      </span>
                    </div>
                  </div>

                  {/* Card 2: Mã số thuế */}
                  <div className="space-y-1.5">
                    <label className="block text-[11px] text-slate-700 font-semibold truncate">
                      Mã số thuế
                    </label>
                    <div className="border-2 border-dashed border-slate-200 rounded-2xl p-4 flex flex-col items-center justify-center text-center hover:border-emerald-500 hover:bg-emerald-50/20 transition-all cursor-pointer group">
                      <UploadCloud className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                      <span className="text-xs font-semibold text-slate-700 group-hover:text-emerald-700 mt-1.5">
                        Tải lên file
                      </span>
                      <span className="text-[10px] text-slate-400 mt-0.5">
                        (PDF, JPG, PNG, tối đa 5MB)
                      </span>
                    </div>
                  </div>

                  {/* Card 3: Giấy tờ khác */}
                  <div className="space-y-1.5">
                    <label className="block text-[11px] text-slate-700 font-semibold truncate">
                      Giấy tờ khác (nếu có)
                    </label>
                    <div className="border-2 border-dashed border-slate-200 rounded-2xl p-4 flex flex-col items-center justify-center text-center hover:border-emerald-500 hover:bg-emerald-50/20 transition-all cursor-pointer group">
                      <UploadCloud className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                      <span className="text-xs font-semibold text-slate-700 group-hover:text-emerald-700 mt-1.5">
                        Tải lên file
                      </span>
                      <span className="text-[10px] text-slate-400 mt-0.5">
                        (PDF, JPG, PNG, tối đa 5MB)
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons Footer for Tab 2: Quay lại & Tiếp tục */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab("basic")}
                  className="px-6 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-medium transition-colors"
                >
                  Quay lại
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("payment")}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#1b7a4e] hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs sm:text-sm font-semibold shadow-xs transition-all"
                >
                  <span>Tiếp tục</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : activeTab === "payment" ? (
            /* TAB 3: THÔNG TIN THANH TOÁN */
            <>
              {/* SECTION 1: Thông tin nhận thanh toán */}
              <div className="space-y-3">
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-800">
                    Thông tin nhận thanh toán
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Stayea sẽ chuyển doanh thu đặt phòng cho chủ nhà/đối tác theo thông tin bên dưới.
                  </p>
                </div>

                {/* Phương thức nhận thanh toán * (3 cards) */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Phương thức nhận thanh toán <span className="text-rose-500">*</span>
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* 1. Chuyển khoản ngân hàng (Selected) */}
                    <button
                      type="button"
                      onClick={() => setPayoutMethodType("bank_transfer")}
                      className={`flex items-center gap-2.5 p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        payoutMethodType === "bank_transfer"
                          ? "border-[#1b7a4e] bg-emerald-50/40 shadow-xs ring-1 ring-[#1b7a4e]"
                          : "border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300"
                      }`}
                    >
                      <div className="w-4 h-4 rounded-full border-2 border-[#1b7a4e] bg-white flex items-center justify-center shrink-0">
                        <div className="w-2 h-2 rounded-full bg-[#1b7a4e]" />
                      </div>
                      <span className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                        Chuyển khoản ngân hàng
                      </span>
                    </button>

                    {/* 2. Ví điện tử */}
                    <button
                      type="button"
                      onClick={() => setPayoutMethodType("e_wallet")}
                      className={`flex items-center gap-2.5 p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        payoutMethodType === "e_wallet"
                          ? "border-[#1b7a4e] bg-emerald-50/40 shadow-xs ring-1 ring-[#1b7a4e]"
                          : "border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300"
                      }`}
                    >
                      <Wallet className="w-5 h-5 text-slate-600 shrink-0" strokeWidth={1.75} />
                      <span className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                        Ví điện tử
                      </span>
                    </button>

                    {/* 3. Khác (Theo thỏa thuận) */}
                    <button
                      type="button"
                      onClick={() => setPayoutMethodType("other")}
                      className={`flex items-center gap-2.5 p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        payoutMethodType === "other"
                          ? "border-[#1b7a4e] bg-emerald-50/40 shadow-xs ring-1 ring-[#1b7a4e]"
                          : "border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300"
                      }`}
                    >
                      <Cloud className="w-5 h-5 text-slate-500 shrink-0" strokeWidth={1.75} />
                      <div className="min-w-0">
                        <span className="font-bold text-xs sm:text-sm text-slate-900 block truncate leading-tight">
                          Khác
                        </span>
                        <span className="text-[10px] text-slate-400 block truncate">
                          (Theo thỏa thuận)
                        </span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Account Details */}
                <div className="space-y-3 text-xs pt-1">
                  {/* Row 1: Tên chủ tài khoản * & Tên ngân hàng * */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Tên chủ tài khoản <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="text"
                          required
                          value={bankAccountHolder}
                          onChange={(e) => setBankAccountHolder(e.target.value)}
                          placeholder="Nhập tên chủ tài khoản (viết hoa, không dấu)"
                          className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-white placeholder:text-slate-400 focus:outline-none focus:border-[#1b7a4e] focus:ring-1 focus:ring-[#1b7a4e] transition-all font-medium uppercase"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Tên ngân hàng <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Landmark className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <select
                          required
                          value={bankName}
                          onChange={(e) => setBankName(e.target.value)}
                          className="w-full appearance-none pl-9 pr-7 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:border-[#1b7a4e] focus:ring-1 focus:ring-[#1b7a4e] transition-all font-medium cursor-pointer"
                        >
                          <option value="">Chọn ngân hàng</option>
                          <option value="Vietcombank">Vietcombank (Ngoại thương Việt Nam)</option>
                          <option value="Techcombank">Techcombank (Kỹ thương Việt Nam)</option>
                          <option value="MBBank">MBBank (Quân đội)</option>
                          <option value="ACB">ACB (Á Châu)</option>
                          <option value="BIDV">BIDV (Đầu tư và Phát triển)</option>
                          <option value="VietinBank">VietinBank (Công thương Việt Nam)</option>
                          <option value="VPBank">VPBank (Việt Nam Thịnh Vượng)</option>
                          <option value="TPBank">TPBank (Tiên Phong)</option>
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* Row 2: Số tài khoản * & Chi nhánh (tùy chọn) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Số tài khoản <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <CreditCard className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="text"
                          required
                          value={bankAccountNumber}
                          onChange={(e) => setBankAccountNumber(e.target.value)}
                          placeholder="Nhập số tài khoản"
                          className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-white placeholder:text-slate-400 focus:outline-none focus:border-[#1b7a4e] focus:ring-1 focus:ring-[#1b7a4e] transition-all font-medium"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Chi nhánh (tùy chọn)
                      </label>
                      <div className="relative">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="text"
                          value={bankBranch}
                          onChange={(e) => setBankBranch(e.target.value)}
                          placeholder="Nhập chi nhánh ngân hàng"
                          className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-white placeholder:text-slate-400 focus:outline-none focus:border-[#1b7a4e] focus:ring-1 focus:ring-[#1b7a4e] transition-all font-medium"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Security Banner (Green) */}
                <div className="bg-emerald-50/70 border border-emerald-200/60 rounded-2xl p-3 flex items-start gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-[#1b7a4e] shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <span className="font-bold text-slate-800 text-xs sm:text-sm block underline decoration-slate-400 underline-offset-2">
                      Thông tin thanh toán được mã hóa và bảo mật tuyệt đối.
                    </span>
                    <span className="text-[11px] text-slate-600 block mt-0.5">
                      Stayea chỉ sử dụng thông tin này để chuyển thanh toán doanh thu theo hợp đồng.
                    </span>
                  </div>
                </div>
              </div>

              {/* SECTION 2: Chu kỳ và hình thức thanh toán */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <h3 className="text-xs sm:text-sm font-bold text-slate-800">
                  Chu kỳ và hình thức thanh toán
                </h3>

                <div className="space-y-3 text-xs">
                  {/* Row: Chu kỳ thanh toán & Hình thức thanh toán */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Chu kỳ thanh toán */}
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Chu kỳ thanh toán <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <select
                          value={paymentCycle}
                          onChange={(e) => setPaymentCycle(e.target.value)}
                          className="w-full appearance-none pl-9 pr-7 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:border-[#1b7a4e] focus:ring-1 focus:ring-[#1b7a4e] transition-all font-medium cursor-pointer"
                        >
                          <option value="Hàng tháng">Hàng tháng</option>
                          <option value="Hàng tuần">Hàng tuần</option>
                          <option value="Sau mỗi đặt phòng">Sau mỗi kỳ đặt phòng</option>
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                      <span className="text-[11px] text-slate-500 block mt-1">
                        Thanh toán vào ngày 05 hàng tháng.
                      </span>
                    </div>

                    {/* Hình thức thanh toán */}
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Hình thức thanh toán <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <FileText className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <select
                          value={payoutType}
                          onChange={(e) => setPayoutType(e.target.value)}
                          className="w-full appearance-none pl-9 pr-7 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:border-[#1b7a4e] focus:ring-1 focus:ring-[#1b7a4e] transition-all font-medium cursor-pointer"
                        >
                          <option value="Chuyển khoản ngân hàng">Chuyển khoản ngân hàng</option>
                          <option value="Ví điện tử Stayea Pay">Ví điện tử Stayea Pay</option>
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                      <span className="text-[11px] text-slate-500 block mt-1">
                        Phí giao dịch (nếu có) do Stayea chi trả.
                      </span>
                    </div>
                  </div>

                  {/* Blue Info Notice Box (Lưu ý) */}
                  <div className="bg-sky-50/70 border border-sky-100 rounded-2xl p-3.5 space-y-1">
                    <div className="flex items-center gap-1.5 text-sky-800">
                      <Info className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                      <span className="font-bold text-xs">Lưu ý</span>
                    </div>
                    <ul className="text-[11px] text-slate-600 space-y-0.5 pl-5 list-disc">
                      <li>Vui lòng kiểm tra kỹ thông tin tài khoản để tránh sai sót.</li>
                      <li>Thời gian xử lý thanh toán thường từ 1 – 3 ngày làm việc.</li>
                      <li>Bạn có thể thay đổi thông tin thanh toán bất kỳ lúc nào trong phần Cài đặt.</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Action Buttons Footer for Tab 3: Quay lại & Tiếp tục */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab("business")}
                  className="px-6 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-medium transition-colors"
                >
                  Quay lại
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("notes")}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#1b7a4e] hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs sm:text-sm font-semibold shadow-xs transition-all"
                >
                  <span>Tiếp tục</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            /* TAB 4: GHI CHÚ & CÀI ĐẶT */
            <>
              {/* SECTION 1: Ghi chú */}
              <div className="space-y-1.5">
                <h3 className="text-xs sm:text-sm font-bold text-slate-800">
                  Ghi chú
                </h3>
                <label className="block text-xs font-semibold text-slate-700">
                  Ghi chú nội bộ
                </label>
                <div className="relative">
                  <textarea
                    rows={4}
                    maxLength={500}
                    value={internalNotes}
                    onChange={(e) => setInternalNotes(e.target.value)}
                    placeholder="Nhập ghi chú về chủ nhà/đối tác (ví dụ: thói quen làm việc, lưu ý đặc biệt, lịch sử trao đổi,...)"
                    className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 bg-white placeholder:text-slate-400 focus:outline-none focus:border-[#1b7a4e] focus:ring-1 focus:ring-[#1b7a4e] font-medium text-xs resize-none transition-all leading-relaxed"
                  />
                  <span className="text-[11px] text-slate-400 block text-right mt-0.5 font-medium">
                    {internalNotes.length}/500
                  </span>
                </div>
              </div>

              {/* SECTION 2: Cài đặt hợp tác */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-800">
                    Cài đặt hợp tác
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Thiết lập các tùy chọn mặc định cho chủ nhà/đối tác này.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                  {/* Left Column: Dropdowns */}
                  <div className="space-y-3 text-xs">
                    {/* 1. Trạng thái tài khoản */}
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Trạng thái tài khoản
                      </label>
                      <div className="relative">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <select
                          value={accountStatus}
                          onChange={(e) => setAccountStatus(e.target.value as "active" | "inactive" | "pending")}
                          className="w-full appearance-none pl-9 pr-7 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 font-medium focus:outline-none focus:border-[#1b7a4e] focus:ring-1 focus:ring-[#1b7a4e] transition-all cursor-pointer"
                        >
                          <option value="active">Hoạt động</option>
                          <option value="pending">Chờ phê duyệt</option>
                          <option value="inactive">Tạm ngưng</option>
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    {/* 2. Nhóm đối tác */}
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Nhóm đối tác
                      </label>
                      <div className="relative">
                        <Archive className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <select
                          value={partnerGroup}
                          onChange={(e) => setPartnerGroup(e.target.value)}
                          className="w-full appearance-none pl-9 pr-7 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 font-medium focus:outline-none focus:border-[#1b7a4e] focus:ring-1 focus:ring-[#1b7a4e] transition-all cursor-pointer"
                        >
                          <option value="">Chọn nhóm đối tác</option>
                          <option value="vip">Chủ nhà VIP</option>
                          <option value="strategic">Đối tác chiến lược</option>
                          <option value="agency">Đại lý phân phối</option>
                          <option value="standard">Chủ nhà tiêu chuẩn</option>
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    {/* 3. Nguồn giới thiệu */}
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Nguồn giới thiệu
                      </label>
                      <div className="relative">
                        <Share2 className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <select
                          value={referralSource}
                          onChange={(e) => setReferralSource(e.target.value)}
                          className="w-full appearance-none pl-9 pr-7 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 font-medium focus:outline-none focus:border-[#1b7a4e] focus:ring-1 focus:ring-[#1b7a4e] transition-all cursor-pointer"
                        >
                          <option value="">Chọn nguồn</option>
                          <option value="website">Đăng ký trực tiếp website</option>
                          <option value="referral">Đối tác hiện tại giới thiệu</option>
                          <option value="sales">Đội ngũ Sales Stayea</option>
                          <option value="event">Sự kiện du lịch / BĐS</option>
                          <option value="other">Nguồn khác</option>
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* Right Column: 4 Toggles List */}
                  <div className="bg-slate-50/70 border border-slate-100 rounded-2xl p-3.5 space-y-3.5">
                    {/* Toggle 1: Tự động gửi thông báo */}
                    <div className="flex items-start gap-3">
                      <button
                        type="button"
                        role="switch"
                        aria-checked={autoNotification}
                        onClick={() => setAutoNotification(!autoNotification)}
                        className={`w-9 h-5 rounded-full p-0.5 transition-colors shrink-0 mt-0.5 flex items-center cursor-pointer ${
                          autoNotification ? "bg-[#1b7a4e]" : "bg-slate-300"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full bg-white shadow-xs transition-transform ${
                            autoNotification ? "translate-x-4" : "translate-x-0"
                          }`}
                        />
                      </button>
                      <div>
                        <span className="font-bold text-xs text-slate-800 block leading-tight">
                          Tự động gửi thông báo
                        </span>
                        <span className="text-[11px] text-slate-500 block mt-0.5 leading-normal">
                          Gửi email/SMS khi có đặt phòng mới, thay đổi hoặc hủy lịch.
                        </span>
                      </div>
                    </div>

                    {/* Toggle 2: Chia sẻ báo cáo doanh thu */}
                    <div className="flex items-start gap-3">
                      <button
                        type="button"
                        role="switch"
                        aria-checked={shareRevenueReport}
                        onClick={() => setShareRevenueReport(!shareRevenueReport)}
                        className={`w-9 h-5 rounded-full p-0.5 transition-colors shrink-0 mt-0.5 flex items-center cursor-pointer ${
                          shareRevenueReport ? "bg-[#1b7a4e]" : "bg-slate-300"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full bg-white shadow-xs transition-transform ${
                            shareRevenueReport ? "translate-x-4" : "translate-x-0"
                          }`}
                        />
                      </button>
                      <div>
                        <span className="font-bold text-xs text-slate-800 block leading-tight">
                          Chia sẻ báo cáo doanh thu
                        </span>
                        <span className="text-[11px] text-slate-500 block mt-0.5 leading-normal">
                          Cho phép chủ nhà xem báo cáo doanh thu của tài sản
                        </span>
                      </div>
                    </div>

                    {/* Toggle 3: Nhận email marketing */}
                    <div className="flex items-start gap-3">
                      <button
                        type="button"
                        role="switch"
                        aria-checked={receiveMarketingEmail}
                        onClick={() => setReceiveMarketingEmail(!receiveMarketingEmail)}
                        className={`w-9 h-5 rounded-full p-0.5 transition-colors shrink-0 mt-0.5 flex items-center cursor-pointer ${
                          receiveMarketingEmail ? "bg-[#1b7a4e]" : "bg-slate-300"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full bg-white shadow-xs transition-transform ${
                            receiveMarketingEmail ? "translate-x-4" : "translate-x-0"
                          }`}
                        />
                      </button>
                      <div>
                        <span className="font-bold text-xs text-slate-800 block leading-tight">
                          Nhận email marketing
                        </span>
                        <span className="text-[11px] text-slate-500 block mt-0.5 leading-normal">
                          Gửi thông tin khuyến mãi, sự kiện và sản phẩm mới
                        </span>
                      </div>
                    </div>

                    {/* Toggle 4: Đối tác chiến lược */}
                    <div className="flex items-start gap-3">
                      <button
                        type="button"
                        role="switch"
                        aria-checked={isStrategicPartner}
                        onClick={() => setIsStrategicPartner(!isStrategicPartner)}
                        className={`w-9 h-5 rounded-full p-0.5 transition-colors shrink-0 mt-0.5 flex items-center cursor-pointer ${
                          isStrategicPartner ? "bg-[#1b7a4e]" : "bg-slate-300"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full bg-white shadow-xs transition-transform ${
                            isStrategicPartner ? "translate-x-4" : "translate-x-0"
                          }`}
                        />
                      </button>
                      <div>
                        <span className="font-bold text-xs text-slate-800 block leading-tight">
                          Đối tác chiến lược
                        </span>
                        <span className="text-[11px] text-slate-500 block mt-0.5 leading-normal">
                          Đánh dấu là đối tác chiến lược (ưu tiên hiển thị, hỗ trợ đặc biệt)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 3: Blue Notice Box (Lưu ý) */}
              <div className="bg-sky-50/70 border border-sky-100 rounded-2xl p-3.5 space-y-1">
                <div className="flex items-center gap-1.5 text-sky-800">
                  <Info className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                  <span className="font-bold text-xs">Lưu ý</span>
                </div>
                <ul className="text-[11px] text-slate-600 space-y-0.5 pl-5 list-disc">
                  <li>Bạn có thể chỉnh sửa các cài đặt này sau trong trang chi tiết đối tác.</li>
                  <li>Chủ nhà/đối tác sẽ nhận email thông tin tài khoản sau khi được tạo.</li>
                  <li>Các quyền truy cập sẽ được áp dụng theo chính sách của Stayea.</li>
                </ul>
              </div>

              {/* Footer Actions: Quay lại & Tạo chủ nhà/đối tác */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab("payment")}
                  className="px-6 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-medium transition-colors"
                >
                  Quay lại
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#1b7a4e] hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs sm:text-sm font-semibold shadow-xs transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Tạo chủ nhà/đối tác</span>
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  )
}
