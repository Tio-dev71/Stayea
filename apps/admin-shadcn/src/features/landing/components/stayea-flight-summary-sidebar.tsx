"use client"

import * as React from "react"
import { Plane, User, ArrowRight, Gift, Check } from "lucide-react"
import { AirlineLogo } from "./airline-logo"
import type { FlightBookingSummary } from "@/features/landing/data/stayea-mock-data"

export interface StayeaFlightSummarySidebarProps {
  readonly summary: FlightBookingSummary
  readonly onChangeFlight?: () => void
  readonly onChangePassengers?: () => void
  readonly onChangeVoucher?: () => void
  readonly onProceedBooking?: () => void
}

function formatVND(val: number): string {
  return new Intl.NumberFormat("vi-VN").format(val) + "đ"
}

export const StayeaFlightSummarySidebar: React.FC<StayeaFlightSummarySidebarProps> = ({
  summary,
  onChangeFlight,
  onChangePassengers,
  onChangeVoucher,
  onProceedBooking,
}) => {
  return (
    <div className="space-y-4">
      {/* 1. Main Booking Summary Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-5">
        <h2 className="text-base font-black text-[#0A2239]">Thông tin chuyến đi</h2>

        {/* 1a. Flight Segment */}
        <div className="space-y-2.5 pb-4 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-800">
              <Plane className="w-4 h-4 text-[#1E3A8A] fill-[#1E3A8A]" />
              <span>Chuyến bay đi</span>
            </div>
            <button
              type="button"
              onClick={onChangeFlight}
              className="text-xs font-semibold text-[#1E40AF] hover:underline cursor-pointer"
            >
              Thay đổi
            </button>
          </div>

          <div className="flex items-center gap-2">
            <AirlineLogo type={summary.airlineType} size="sm" />
            <span className="text-xs font-semibold text-slate-500">
              {summary.flightNumber}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
            <span>{summary.departureTime}</span>
            <span className="font-medium text-slate-600">{summary.departureAirport}</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{summary.arrivalTime}</span>
            <span className="font-medium text-slate-600">{summary.arrivalAirport}</span>
          </div>

          <p className="text-[11px] text-slate-400">
            {summary.flightInfo}
          </p>
        </div>

        {/* 1b. Passenger Segment */}
        <div className="space-y-1.5 pb-4 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-800">
              <User className="w-4 h-4 text-[#1E3A8A]" />
              <span>Hành khách</span>
            </div>
            <button
              type="button"
              onClick={onChangePassengers}
              className="text-xs font-semibold text-[#1E40AF] hover:underline cursor-pointer"
            >
              Thay đổi
            </button>
          </div>
          <span className="block text-xs text-slate-600 font-medium">
            {summary.passengerText}
          </span>
        </div>

        {/* 1c. Price Details */}
        <div className="space-y-2.5 pb-4 border-b border-slate-100">
          <h3 className="text-xs sm:text-sm font-bold text-slate-900">Chi tiết giá vé</h3>

          <div className="space-y-2 text-xs text-slate-600">
            {/* Giá vé gốc */}
            <div className="flex items-center justify-between">
              <span>Giá vé gốc</span>
              <span className="font-semibold text-slate-900">
                {formatVND(summary.originalTicketPrice)}
              </span>
            </div>

            {/* Ưu đãi Stayea Club */}
            <div className="flex items-center justify-between text-[#DC2626]">
              <span>Ưu đãi Stayea Club ({summary.clubDiscountPercent}%)</span>
              <span className="font-bold">
                - {formatVND(summary.clubDiscountAmount)}
              </span>
            </div>

            {/* Thuế phí */}
            <div className="flex items-center justify-between">
              <span>Thuế, phí</span>
              <span className="font-semibold text-slate-900">
                {formatVND(summary.taxesAndFees)}
              </span>
            </div>
          </div>
        </div>

        {/* 1d. Total Payment Row */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-xs sm:text-sm font-bold text-slate-900">Tổng thanh toán</span>
          <span className="text-xl sm:text-2xl font-black text-[#1E3A8A]">
            {formatVND(summary.totalPayment)}
          </span>
        </div>

        {/* CTA Button: Tiếp tục đặt vé */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onProceedBooking}
            className="w-full py-3 px-4 rounded-xl bg-[#1E3A8A] hover:bg-[#1E40AF] text-white text-xs sm:text-sm font-bold shadow-xs transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Tiếp tục đặt vé</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Active Voucher Card (Ưu đãi đang dùng) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4 sm:p-5 space-y-3">
        <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-800">
          <Gift className="w-4 h-4 text-[#1E3A8A]" />
          <span>Ưu đãi đang dùng</span>
        </div>

        <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-200/70 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <span className="font-mono font-bold text-xs text-slate-900">
                {summary.appliedVoucherCode}
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#D1FAE5] text-[#047857]">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
                <span>Đã áp dụng</span>
              </span>
            </div>

            <button
              type="button"
              onClick={onChangeVoucher}
              className="text-xs font-semibold text-[#1E40AF] hover:underline cursor-pointer shrink-0"
            >
              Thay đổi
            </button>
          </div>

          <div className="space-y-0.5">
            <span className="block text-xs font-bold text-slate-800">
              {summary.appliedVoucherTitle}
            </span>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              {summary.appliedVoucherDesc}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
