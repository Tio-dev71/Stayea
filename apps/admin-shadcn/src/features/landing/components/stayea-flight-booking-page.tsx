"use client"

import * as React from "react"
import { CheckCircle2, X, ChevronDown, Plane, CreditCard, ShieldCheck, Check, ArrowRight } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@workspace/ui/components/dialog" 
import { StayeaFlightBookingHero } from "./stayea-flight-booking-hero"
import { StayeaFlightAppliedDiscountBanner } from "./stayea-flight-applied-discount-banner"
import { StayeaFlightSearchBar } from "./stayea-flight-search-bar"
import { StayeaFlightFilterSidebar } from "./stayea-flight-filter-sidebar"
import { StayeaFlightDateStrip } from "./stayea-flight-date-strip"
import { StayeaFlightCardItem } from "./stayea-flight-card-item"
import { StayeaFlightSummarySidebar } from "./stayea-flight-summary-sidebar"
import {
  STAYEA_FLIGHT_SEARCH_DEFAULT,
  STAYEA_FLIGHT_DATES,
  STAYEA_FLIGHT_RESULTS,
  STAYEA_FLIGHT_BOOKING_SUMMARY,
} from "@/features/landing/data/stayea-mock-data"
import type { FlightItem, FlightBookingSummary } from "@/features/landing/data/stayea-mock-data"

export interface StayeaFlightBookingPageProps {
  readonly onNavigate?: (route: string) => void
}

export function StayeaFlightBookingPage({ onNavigate }: StayeaFlightBookingPageProps) {
  const [toastMessage, setToastMessage] = React.useState<string | null>(null)
  const [showAppliedBanner, setShowAppliedBanner] = React.useState<boolean>(true)
  const [selectedDateId, setSelectedDateId] = React.useState<string>("date-4")
  const [selectedFlightId, setSelectedFlightId] = React.useState<string>("fl-1")
  const [sortOption, setSortOption] = React.useState<string>("price-asc")
  const [bookingSummary, setBookingSummary] = React.useState<FlightBookingSummary>(
    STAYEA_FLIGHT_BOOKING_SUMMARY
  )
  const [showCheckoutModal, setShowCheckoutModal] = React.useState<boolean>(false)
  const [paymentOption, setPaymentOption] = React.useState<string>("card")
  const [isProcessing, setIsProcessing] = React.useState<boolean>(false)
  const [bookingSuccess, setBookingSuccess] = React.useState<boolean>(false)

  function showToast(msg: string) {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage(null)
    }, 3500)
  }

  function handleConfirmBooking() {
    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
      setShowCheckoutModal(false)
      setBookingSuccess(true)
      showToast("Đặt vé máy bay thành công! Mã đặt chỗ: PQC-8921. Vé điện tử đã gửi tới email.")
    }, 1200)
  }

  function handleSelectFlight(flight: FlightItem) {
    setSelectedFlightId(flight.id)

    // Calculate dynamic pricing based on selected flight and voucher
    const basePrice = flight.originalPrice || flight.price
    const discountAmount = Math.round(basePrice * 0.1) // 10%
    const taxesAndFees = 320_000
    const total = basePrice - discountAmount + taxesAndFees

    setBookingSummary({
      ...bookingSummary,
      flightId: flight.id,
      airlineName: flight.airline.name,
      airlineType: flight.airline.type,
      flightNumber: flight.flightNumber,
      departureTime: flight.departureTime,
      arrivalTime: flight.arrivalTime,
      originalTicketPrice: basePrice,
      clubDiscountAmount: discountAmount,
      totalPayment: total,
    })

    showToast(`Đã chọn chuyến bay ${flight.flightNumber} (${flight.airline.name})!`)
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-[#0A2239] text-white px-4 py-3 rounded-2xl shadow-xl text-xs sm:text-sm animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="p-1 hover:bg-white/10 rounded-lg text-slate-300 ml-2 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 1. Hero Panorama Banner with Breadcrumb & 4 Badges */}
      <StayeaFlightBookingHero
        onNavigateBreadcrumb={(target) => onNavigate?.(target)}
      />

      {/* 2. Main Page Content Container */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
        {/* 2a. Green Applied Discount Alert */}
        {showAppliedBanner && (
          <StayeaFlightAppliedDiscountBanner
            code="STAYEA10AIR"
            title="Đã áp dụng ưu đãi Giảm 10% vé máy bay"
            description="Ưu đãi từ Stayea Club đã được áp dụng vào giá vé. Bạn có thể tiếp tục tìm kiếm và hoàn tất đặt vé."
            onChangeOffer={() => onNavigate?.("stayea-club-claimed")}
            onClose={() => setShowAppliedBanner(false)}
          />
        )}

        {/* 2b. Horizontal Transport Tabs & Flight Search Bar */}
        <StayeaFlightSearchBar
          query={STAYEA_FLIGHT_SEARCH_DEFAULT}
          activeTab="plane"
          onTabChange={(tab) => {
            if (tab !== "plane") {
              onNavigate?.("transport")
            }
          }}
          onSearch={() => showToast("Đang cập nhật danh sách chuyến bay phù hợp...")}
        />

        {/* 2c. 3-Column Main Flight Booking Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Col 1: Left Filter Sidebar (3 cols on lg) */}
          <div className="lg:col-span-3">
            <StayeaFlightFilterSidebar
              onFilterChange={(_cat, val, checked) =>
                showToast(`Đã cập nhật bộ lọc: ${val} (${checked ? "chọn" : "bỏ"})`)
              }
            />
          </div>

          {/* Col 2: Center Flight List (6 cols on lg) */}
          <div className="lg:col-span-6 space-y-4">
            {/* Header: Title + Sorting */}
            <div className="flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-black text-[#0A2239] tracking-tight">
                Chuyến bay đi: Hà Nội → Phú Quốc
              </h2>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500 hidden sm:inline">Sắp xếp theo</span>
                <div className="relative">
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="appearance-none bg-white border border-slate-200/90 rounded-xl px-3 py-1.5 pr-7 text-xs font-semibold text-slate-800 shadow-2xs cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="price-asc">Giá thấp nhất</option>
                    <option value="price-desc">Giá cao nhất</option>
                    <option value="depart-early">Cất cánh sớm nhất</option>
                    <option value="duration-fast">Thời gian bay ngắn nhất</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Date Selector Carousel Strip */}
            <StayeaFlightDateStrip
              dates={STAYEA_FLIGHT_DATES}
              selectedDateId={selectedDateId}
              onSelectDate={(id) => {
                setSelectedDateId(id)
                showToast("Đang tải dữ liệu chuyến bay cho ngày được chọn...")
              }}
              onPrev={() => showToast("Đang tải các ngày trước...")}
              onNext={() => showToast("Đang tải các ngày sau...")}
            />

            {/* Flight Cards List */}
            <div className="space-y-3">
              {STAYEA_FLIGHT_RESULTS.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-2">
                  <p className="text-sm font-semibold text-slate-800">
                    Chưa có chặng bay nào được cập nhật cho tuyến này.
                  </p>
                  <p className="text-xs text-slate-400">
                    Bạn có thể cập nhật các lịch bay mới từ hệ thống quản trị STAYEA.
                  </p>
                </div>
              ) : (
                STAYEA_FLIGHT_RESULTS.map((flight) => (
                  <StayeaFlightCardItem
                    key={flight.id}
                    flight={flight}
                    isSelected={flight.id === selectedFlightId}
                    onSelect={handleSelectFlight}
                  />
                ))
              )}
            </div>
          </div>

          {/* Col 3: Right Trip Summary & Price Breakdown Sidebar (3 cols on lg) */}
          <div className="lg:col-span-3">
            <StayeaFlightSummarySidebar
              summary={bookingSummary}
              onChangeFlight={() => showToast("Vui lòng chọn một chuyến bay khác trong danh sách")}
              onChangePassengers={() => showToast("Chỉnh sửa số lượng hành khách")}
              onChangeVoucher={() => onNavigate?.("stayea-club-claimed")}
              onProceedBooking={() => setShowCheckoutModal(true)}
            />
          </div>
        </div>
      </div>

      {/* =========================================================================
          DIALOG MODAL: XÁC NHẬN & THANH TOÁN VÉ MÁY BAY
      ========================================================================= */}
      <Dialog open={showCheckoutModal} onOpenChange={setShowCheckoutModal}>
        <DialogContent className="sm:max-w-lg rounded-2xl p-6">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-[#1E3A8A] border border-blue-200">
                <Plane className="w-3 h-3" /> Chuyến bay thẳng
              </span>
              <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                <Check className="w-3 h-3" /> Đã giảm 10%
              </span>
            </div>
            <DialogTitle className="text-lg font-black text-[#0A2239]">
              Xác nhận thông tin & Thanh toán
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Kiểm tra thông tin hành trình đến Phú Quốc trước khi xuất vé.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 my-2">
            {/* Flight Brief Info */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800">
                  {bookingSummary.flightNumber} ({bookingSummary.airlineName})
                </span>
                <span className="text-slate-500 font-medium">Hạng Eco Standard</span>
              </div>
              <div className="flex items-center justify-between font-bold text-sm text-[#0A2239]">
                <span>{bookingSummary.departureTime} (HAN)</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
                <span>{bookingSummary.arrivalTime} (PQC)</span>
              </div>
              <div className="text-[11px] text-slate-500">
                Hành khách: {bookingSummary.passengerText}
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800 block">
                Phương thức thanh toán
              </label>
              <div className="space-y-2">
                <label className={`flex items-center justify-between p-3 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                  paymentOption === "card" ? "border-[#1E3A8A] bg-blue-50/50" : "border-slate-200 hover:bg-slate-50"
                }`}>
                  <div className="flex items-center gap-2.5">
                    <input
                      type="radio"
                      name="paymentOption"
                      checked={paymentOption === "card"}
                      onChange={() => setPaymentOption("card")}
                      className="text-[#1E3A8A] focus:ring-0"
                    />
                    <CreditCard className="w-4 h-4 text-blue-800" />
                    <span>Thẻ Visa / MasterCard mặc định (•••• 4242)</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-normal">Miễn phí giao dịch</span>
                </label>

                <label className={`flex items-center justify-between p-3 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                  paymentOption === "vnpay" ? "border-[#1E3A8A] bg-blue-50/50" : "border-slate-200 hover:bg-slate-50"
                }`}>
                  <div className="flex items-center gap-2.5">
                    <input
                      type="radio"
                      name="paymentOption"
                      checked={paymentOption === "vnpay"}
                      onChange={() => setPaymentOption("vnpay")}
                      className="text-[#1E3A8A] focus:ring-0"
                    />
                    <div className="w-4 h-4 rounded-sm bg-red-600 text-[8px] font-black text-white flex items-center justify-center">VN</div>
                    <span>Quét mã QR VNPay / Mobile Banking</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-normal">Xác nhận tức thì</span>
                </label>
              </div>
            </div>

            {/* Total Price Row */}
            <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-500 block">Tổng thanh toán (đã bao gồm thuế, phí)</span>
                <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Tiết kiệm {new Intl.NumberFormat("vi-VN").format(bookingSummary.clubDiscountAmount)}đ nhờ Stayea Club
                </span>
              </div>
              <span className="text-lg font-black text-[#1E3A8A]">
                {new Intl.NumberFormat("vi-VN").format(bookingSummary.totalPayment)}đ
              </span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowCheckoutModal(false)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-all cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="button"
              disabled={isProcessing}
              onClick={handleConfirmBooking}
              className="px-5 py-2.5 rounded-xl bg-[#1E3A8A] hover:bg-[#1E40AF] text-white text-xs font-semibold shadow-xs transition-all active:scale-95 cursor-pointer flex items-center gap-2"
            >
              {isProcessing ? (
                <span>Đang xử lý xuất vé...</span>
              ) : (
                <>
                  <span>Xác nhận & Thanh toán</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* =========================================================================
          DIALOG MODAL: ĐẶT VÉ THÀNH CÔNG
      ========================================================================= */}
      <Dialog open={bookingSuccess} onOpenChange={setBookingSuccess}>
        <DialogContent className="sm:max-w-md rounded-2xl p-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3 shadow-2xs">
            <Check className="w-8 h-8 stroke-[3]" />
          </div>
          <DialogTitle className="text-lg sm:text-xl font-black text-[#0A2239]">
            Đặt vé máy bay thành công!
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-600 mt-1">
            Mã đặt chỗ của bạn là <strong className="font-mono text-slate-900 font-black">PQC-8921</strong>. Thông tin vé điện tử và hướng dẫn làm thủ tục đã được gửi về email của bạn.
          </DialogDescription>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1 my-3 text-left">
            <div className="flex justify-between">
              <span className="text-slate-400">Chuyến bay:</span>
              <span className="font-semibold text-slate-800">{bookingSummary.flightNumber} ({bookingSummary.departureTime} - {bookingSummary.arrivalTime})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Hành trình:</span>
              <span className="font-semibold text-slate-800">Hà Nội (HAN) → Phú Quốc (PQC)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Tổng thanh toán:</span>
              <span className="font-bold text-[#1E3A8A]">{new Intl.NumberFormat("vi-VN").format(bookingSummary.totalPayment)}đ</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2.5 pt-2">
            <button
              type="button"
              onClick={() => setBookingSuccess(false)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold cursor-pointer"
            >
              Tiếp tục tìm kiếm
            </button>
            <button
              type="button"
              onClick={() => {
                setBookingSuccess(false)
                onNavigate?.("bookings")
              }}
              className="px-5 py-2.5 rounded-xl bg-[#0A2239] hover:bg-[#071726] text-white text-xs font-semibold shadow-xs cursor-pointer"
            >
              Xem đơn dịch vụ
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
