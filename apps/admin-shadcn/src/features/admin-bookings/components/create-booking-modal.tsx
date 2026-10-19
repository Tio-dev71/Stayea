"use client"

import { useState, useId } from "react"
import {
  X,
  Plus,
  Minus,
  Calendar,
  ChevronDown,
  CheckCircle2,
} from "lucide-react"

interface CreateBookingModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmitSuccess?: (bookingData: BookingFormData) => void
}

export interface BookingFormData {
  fullName: string
  nationality: string
  phoneNumber: string
  email: string
  property: string
  propertyType: string
  roomName: string
  checkInDate: string
  checkOutDate: string
  nightsCount: number
  guestsCount: number
  roomsCount: number
  specialRequests: string
  pricePerNight: string
  totalAmount: string
  paymentMethod: string
  paymentStatus: string
  bookingSource: string
  discountCode: string
  internalNotes: string
  sendNotification: boolean
}

export function CreateBookingModal({
  isOpen,
  onClose,
  onSubmitSuccess,
}: CreateBookingModalProps) {
  const notifyCheckboxId = useId()

  // Form State matching screenshot defaults
  const [fullName, setFullName] = useState("")
  const [nationality, setNationality] = useState("Việt Nam")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [email, setEmail] = useState("")

  const [property, setProperty] = useState("")
  const [propertyType, setPropertyType] = useState("")
  const [roomName, setRoomName] = useState("")

  const [checkInDate, setCheckInDate] = useState("")
  const [checkOutDate, setCheckOutDate] = useState("")
  const [checkInFocused, setCheckInFocused] = useState(false)
  const [checkOutFocused, setCheckOutFocused] = useState(false)

  const [nightsCount, setNightsCount] = useState(0)
  const [guestsCount, setGuestsCount] = useState(1)
  const [roomsCount, setRoomsCount] = useState(1)
  const [specialRequests, setSpecialRequests] = useState("")

  const [pricePerNight, setPricePerNight] = useState("0 đ")
  const [totalAmount, setTotalAmount] = useState("0 đ")
  const [paymentMethod, setPaymentMethod] = useState("")
  const [paymentStatus, setPaymentStatus] = useState("Chưa thanh toán")

  const [bookingSource, setBookingSource] = useState("")
  const [discountCode, setDiscountCode] = useState("")
  const [internalNotes, setInternalNotes] = useState("")
  const [sendNotification, setSendNotification] = useState(true)

  if (!isOpen) return null

  // Fast demo prefill helper
  const handleSelectExistingCustomer = () => {
    setFullName("Sarah Johnson")
    setNationality("Mỹ")
    setPhoneNumber("+84 912 345 678")
    setEmail("sarah.johnson@example.com")
    setProperty("Sunset Villa Phú Quốc")
    setPropertyType("Biệt thự")
    setRoomName("Villa 3 phòng ngủ hướng biển")
    setCheckInDate("2025-04-25")
    setCheckOutDate("2025-04-28")
    setNightsCount(3)
    setGuestsCount(4)
    setRoomsCount(1)
    setPricePerNight("2.500.000 đ")
    setTotalAmount("7.500.000 đ")
    setPaymentMethod("Chuyển khoản")
    setPaymentStatus("Chưa thanh toán")
    setBookingSource("Website")
    setSpecialRequests("Cần nhận phòng sớm lúc 12:00 nếu phòng trống, đón sân bay lúc 11:15")
  }

  const handleDateChange = (newCheckIn: string, newCheckOut: string) => {
    setCheckInDate(newCheckIn)
    setCheckOutDate(newCheckOut)
    if (newCheckIn && newCheckOut) {
      const d1 = new Date(newCheckIn)
      const d2 = new Date(newCheckOut)
      const diffTime = Math.max(0, d2.getTime() - d1.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      const nights = Math.max(diffDays, 0)
      setNightsCount(nights)

      const rawPrice = Number.parseInt(pricePerNight.replaceAll(/\D/g, ""), 10) || 0
      const total = rawPrice * nights * roomsCount
      setTotalAmount(total > 0 ? `${total.toLocaleString("vi-VN")} đ` : "0 đ")
    } else {
      setNightsCount(0)
      setTotalAmount("0 đ")
    }
  }

  const handlePriceChange = (val: string) => {
    const digits = val.replaceAll(/\D/g, "")
    if (!digits || digits === "0") {
      setPricePerNight("0 đ")
      setTotalAmount("0 đ")
      return
    }
    const num = Number.parseInt(digits, 10)
    const formatted = `${num.toLocaleString("vi-VN")} đ`
    setPricePerNight(formatted)
    const total = num * nightsCount * roomsCount
    setTotalAmount(total > 0 ? `${total.toLocaleString("vi-VN")} đ` : "0 đ")
  }

  const handleRoomsCountChange = (newCount: number) => {
    const validCount = Math.max(1, newCount)
    setRoomsCount(validCount)
    const rawPrice = Number.parseInt(pricePerNight.replaceAll(/\D/g, ""), 10) || 0
    const total = rawPrice * nightsCount * validCount
    setTotalAmount(total > 0 ? `${total.toLocaleString("vi-VN")} đ` : "0 đ")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmitSuccess?.({
      fullName,
      nationality,
      phoneNumber,
      email,
      property,
      propertyType,
      roomName,
      checkInDate,
      checkOutDate,
      nightsCount,
      guestsCount,
      roomsCount,
      specialRequests,
      pricePerNight,
      totalAmount,
      paymentMethod,
      paymentStatus,
      bookingSource,
      discountCode,
      internalNotes,
      sendNotification,
    })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/40 backdrop-blur-xs overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="relative w-full max-w-[820px] bg-white rounded-2xl shadow-2xl border border-slate-100 my-auto text-left overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* 1. Modal Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#1b7a4e] text-white flex items-center justify-center font-bold text-xl shrink-0 shadow-xs">
              <Plus className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight">
                Tạo đặt phòng mới
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-normal mt-0.5">
                Nhập thông tin để tạo đơn đặt phòng thủ công cho khách hàng
              </p>
            </div>
          </div>

          <button
            type="button"
            aria-label="Đóng cửa sổ"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2. Modal Body Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-6 max-h-[82vh] overflow-y-auto">
          {/* SECTION 1: Thông tin khách hàng */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                Thông tin khách hàng
              </h3>
              <button
                type="button"
                onClick={handleSelectExistingCustomer}
                className="text-xs font-semibold text-[#1b7a4e] hover:text-emerald-800 hover:underline transition-colors"
              >
                Chọn khách hàng có sẵn
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              {/* Họ và tên * */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Họ và tên <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Nhập họ và tên"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-xs sm:text-sm"
                />
              </div>

              {/* Quốc tịch */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Quốc tịch
                </label>
                <div className="relative">
                  <select
                    value={nationality}
                    onChange={(e) => setNationality(e.target.value)}
                    className="w-full appearance-none px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-xs sm:text-sm cursor-pointer"
                  >
                    <option value="Việt Nam">🇻🇳 Việt Nam</option>
                    <option value="Mỹ">🇺🇸 Mỹ</option>
                    <option value="Hàn Quốc">🇰🇷 Hàn Quốc</option>
                    <option value="Pháp">🇫🇷 Pháp</option>
                    <option value="Anh">🇬🇧 Anh</option>
                    <option value="Tây Ban Nha">🇪🇸 Tây Ban Nha</option>
                    <option value="Khác">🌐 Quốc tế khác</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Số điện thoại * */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Số điện thoại <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Nhập số điện thoại"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-xs sm:text-sm"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Nhập email"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-xs sm:text-sm"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: Thông tin đặt phòng */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <h3 className="text-xs sm:text-sm font-bold text-slate-900">
              Thông tin đặt phòng
            </h3>

            {/* Row 1: Bất động sản, Loại lưu trú, Phòng / Villa */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Bất động sản <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={property}
                    onChange={(e) => setProperty(e.target.value)}
                    className="w-full appearance-none px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-xs sm:text-sm cursor-pointer"
                  >
                    <option value="">Chọn bất động sản</option>
                    <option value="Sunset Villa Phú Quốc">Sunset Villa Phú Quốc</option>
                    <option value="Ocean View Apartment">Ocean View Apartment</option>
                    <option value="Beach House Phú Quốc">Beach House Phú Quốc</option>
                    <option value="Tropical Villa">Tropical Villa</option>
                    <option value="City Loft Phú Quốc">City Loft Phú Quốc</option>
                    <option value="Bungalow Gành Dầu">Bungalow Gành Dầu</option>
                    <option value="Sea View Villa">Sea View Villa</option>
                    <option value="Garden House">Garden House</option>
                    <option value="Lakeside Villa">Lakeside Villa</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Loại lưu trú
                </label>
                <div className="relative">
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className="w-full appearance-none px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-xs sm:text-sm cursor-pointer"
                  >
                    <option value="">Chọn loại lưu trú</option>
                    <option value="Biệt thự">Biệt thự</option>
                    <option value="Căn hộ">Căn hộ</option>
                    <option value="Homestay">Homestay</option>
                    <option value="Bungalow">Bungalow</option>
                    <option value="Resort">Resort</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Phòng / Villa <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    className="w-full appearance-none px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-xs sm:text-sm cursor-pointer"
                  >
                    <option value="">Chọn phòng</option>
                    <option value="Villa 3 phòng ngủ hướng biển">Villa 3 phòng ngủ hướng biển</option>
                    <option value="Căn hộ Studio tầng cao">Căn hộ Studio tầng cao</option>
                    <option value="Phòng Deluxe hướng vườn">Phòng Deluxe hướng vườn</option>
                    <option value="Phòng Suite King Size">Phòng Suite King Size</option>
                    <option value="Toàn bộ căn hộ 2 phòng ngủ">Toàn bộ căn hộ 2 phòng ngủ</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Row 2: Ngày nhận phòng, Ngày trả phòng, Số đêm */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Ngày nhận phòng <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={checkInFocused || checkInDate ? "date" : "text"}
                    placeholder="Chọn ngày"
                    value={checkInDate}
                    onFocus={() => setCheckInFocused(true)}
                    onBlur={() => setCheckInFocused(false)}
                    onChange={(e) => handleDateChange(e.target.value, checkOutDate)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-xs sm:text-sm cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Ngày trả phòng <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={checkOutFocused || checkOutDate ? "date" : "text"}
                    placeholder="Chọn ngày"
                    value={checkOutDate}
                    onFocus={() => setCheckOutFocused(true)}
                    onBlur={() => setCheckOutFocused(false)}
                    onChange={(e) => handleDateChange(checkInDate, e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-xs sm:text-sm cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Số đêm
                </label>
                <input
                  type="text"
                  readOnly
                  value={`${nightsCount} đêm`}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-100/70 text-slate-600 font-medium text-center text-xs sm:text-sm select-none"
                />
              </div>
            </div>

            {/* Row 3: Số khách, Số phòng, Yêu cầu đặc biệt */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs items-end">
              {/* Số khách * */}
              <div className="sm:col-span-3">
                <label className="block text-slate-700 font-semibold mb-1">
                  Số khách <span className="text-rose-500">*</span>
                </label>
                <div className="flex items-center justify-between border border-slate-200 rounded-xl px-2 py-1.5 bg-white">
                  <button
                    type="button"
                    aria-label="Giảm số khách"
                    onClick={() => setGuestsCount((prev) => Math.max(1, prev - 1))}
                    className="w-6 h-6 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-bold text-slate-800 text-sm">{guestsCount}</span>
                  <button
                    type="button"
                    aria-label="Tăng số khách"
                    onClick={() => setGuestsCount((prev) => prev + 1)}
                    className="w-6 h-6 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Số phòng */}
              <div className="sm:col-span-3">
                <label className="block text-slate-700 font-semibold mb-1">
                  Số phòng
                </label>
                <div className="flex items-center justify-between border border-slate-200 rounded-xl px-2 py-1.5 bg-white">
                  <button
                    type="button"
                    aria-label="Giảm số phòng"
                    onClick={() => handleRoomsCountChange(roomsCount - 1)}
                    className="w-6 h-6 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-bold text-slate-800 text-sm">{roomsCount}</span>
                  <button
                    type="button"
                    aria-label="Tăng số phòng"
                    onClick={() => handleRoomsCountChange(roomsCount + 1)}
                    className="w-6 h-6 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Yêu cầu đặc biệt (nếu có) */}
              <div className="sm:col-span-6">
                <label className="block text-slate-700 font-semibold mb-1">
                  Yêu cầu đặc biệt (nếu có)
                </label>
                <input
                  type="text"
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="Ví dụ: giường đôi, tầng cao, đón sân bay..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-xs sm:text-sm"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: Giá & Thanh toán */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <h3 className="text-xs sm:text-sm font-bold text-slate-900">
              Giá &amp; Thanh toán
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              {/* Giá phòng / đêm */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Giá phòng / đêm
                </label>
                <input
                  type="text"
                  value={pricePerNight}
                  onChange={(e) => handlePriceChange(e.target.value)}
                  onFocus={(e) => {
                    if (pricePerNight === "0 đ") e.target.select()
                  }}
                  placeholder="0 đ"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-xs sm:text-sm font-medium"
                />
              </div>

              {/* Tổng tiền (readOnly) */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Tổng tiền
                </label>
                <input
                  type="text"
                  readOnly
                  value={totalAmount}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-100/70 text-slate-900 font-bold text-xs sm:text-sm select-none"
                />
              </div>

              {/* Phương thức thanh toán */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Phương thức thanh toán
                </label>
                <div className="relative">
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full appearance-none px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-xs sm:text-sm cursor-pointer"
                  >
                    <option value="">Chọn phương thức</option>
                    <option value="Chuyển khoản">Chuyển khoản ngân hàng</option>
                    <option value="Tiền mặt">Tiền mặt tại quầy</option>
                    <option value="Thẻ tín dụng">Thẻ tín dụng / Ghi nợ</option>
                    <option value="Cổng thanh toán">Cổng thanh toán điện tử</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Trạng thái thanh toán */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Trạng thái thanh toán
                </label>
                <div className="relative">
                  <select
                    value={paymentStatus}
                    onChange={(e) => setPaymentStatus(e.target.value)}
                    className="w-full appearance-none px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-xs sm:text-sm cursor-pointer"
                  >
                    <option value="Chưa thanh toán">🟡 Chưa thanh toán</option>
                    <option value="Cọc 50%">🟠 Cọc 50%</option>
                    <option value="Đã thanh toán">🟢 Đã thanh toán</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 4: Nguồn đặt & Ghi chú */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <h3 className="text-xs sm:text-sm font-bold text-slate-900">
              Nguồn đặt &amp; Ghi chú
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              {/* Nguồn đặt phòng */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Nguồn đặt phòng
                </label>
                <div className="relative">
                  <select
                    value={bookingSource}
                    onChange={(e) => setBookingSource(e.target.value)}
                    className="w-full appearance-none px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-xs sm:text-sm cursor-pointer"
                  >
                    <option value="">Chọn nguồn</option>
                    <option value="Website">Website Stayea.com</option>
                    <option value="Trực tiếp">Trực tiếp tại chỗ</option>
                    <option value="Hotline">Hotline / Zalo</option>
                    <option value="Airbnb">Airbnb</option>
                    <option value="Booking.com">Booking.com</option>
                    <option value="Agoda">Agoda</option>
                    <option value="Traveloka">Traveloka</option>
                    <option value="Khác">Đối tác đại lý khác</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Mã khuyến mãi (nếu có) */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Mã khuyến mãi (nếu có)
                </label>
                <input
                  type="text"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                  placeholder="Nhập mã khuyến mãi"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-xs sm:text-sm"
                />
              </div>

              {/* Ghi chú nội bộ */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Ghi chú nội bộ
                </label>
                <input
                  type="text"
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                  placeholder="Nhập ghi chú..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-xs sm:text-sm"
                />
              </div>
            </div>
          </div>

          {/* 3. Modal Footer */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Checkbox notification */}
            <div className="flex items-center gap-2">
              <input
                id={notifyCheckboxId}
                type="checkbox"
                checked={sendNotification}
                onChange={(e) => setSendNotification(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer accent-[#1b7a4e]"
              />
              <label
                htmlFor={notifyCheckboxId}
                className="text-xs sm:text-sm text-slate-700 font-medium cursor-pointer select-none"
              >
                Gửi xác nhận đặt phòng cho khách hàng qua email/SMS
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-medium transition-colors"
              >
                Hủy
              </button>

              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1b7a4e] hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs sm:text-sm font-semibold shadow-xs transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Tạo đặt phòng</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
