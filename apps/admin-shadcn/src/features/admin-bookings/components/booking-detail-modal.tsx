"use client"

import { X, Calendar, MapPin, User, Phone, Mail, CheckCircle2 } from "lucide-react"
import type { BookingRecord } from "../stayea-admin-bookings-mock-data"

interface BookingDetailModalProps {
  booking: BookingRecord | null
  isOpen: boolean
  onClose: () => void
  onUpdateStatus?: (id: string, status: string) => void
}

export function BookingDetailModal({
  booking,
  isOpen,
  onClose,
  onUpdateStatus,
}: BookingDetailModalProps) {
  if (!isOpen || !booking) return null

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200/80 p-6 overflow-hidden space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold">
              <span>Mã đơn: {booking.code}</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 mt-1">
              Chi tiết đơn đặt phòng
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="space-y-4 text-xs sm:text-sm">
          {/* Property Info */}
          <div className="p-3.5 bg-slate-50 rounded-2xl space-y-2">
            <div className="flex items-center gap-2 text-slate-900 font-bold">
              <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{booking.propertyName}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-slate-600 text-xs pt-1">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Nhận: <strong>{booking.checkIn}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Trả: <strong>{booking.checkOut}</strong></span>
              </div>
              <div>Số khách: <strong>{booking.guestsCount} khách</strong></div>
              <div>Kênh: <strong>{booking.channel}</strong></div>
            </div>
          </div>

          {/* Guest Info */}
          <div className="p-3.5 border border-slate-200/80 rounded-2xl space-y-2">
            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
              Thông tin khách hàng
            </h3>
            <div className="space-y-1.5 text-xs text-slate-700">
              <div className="flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-semibold">{booking.guestName}</span>
                <span>{booking.guestFlag}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>khachhang@stayea.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>0908 123 456 (Zalo sẵn sàng)</span>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="p-3.5 bg-emerald-50/50 border border-emerald-100 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 font-medium">Tổng tiền thanh toán</span>
              <p className="text-lg font-bold text-emerald-900 leading-tight">
                {booking.totalAmount}
              </p>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-slate-500">Trạng thái cọc:</span>
              <div className="font-semibold text-emerald-800 text-xs">
                {booking.paymentStatus}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-wrap gap-2 justify-end border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors"
          >
            Đóng
          </button>
          {booking.bookingStatus !== "Đã xác nhận" && (
            <button
              type="button"
              onClick={() => {
                onUpdateStatus?.(booking.id, "confirmed")
                onClose()
              }}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Xác nhận đơn này</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
