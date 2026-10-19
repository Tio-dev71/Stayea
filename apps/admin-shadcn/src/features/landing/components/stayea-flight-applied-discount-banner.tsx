"use client"

import * as React from "react"
import { CheckCircle2, ArrowRight, X, Check } from "lucide-react"

export interface StayeaFlightAppliedDiscountBannerProps {
  readonly code?: string
  readonly title?: string
  readonly description?: string
  readonly onChangeOffer?: () => void
  readonly onClose?: () => void
}

export const StayeaFlightAppliedDiscountBanner: React.FC<
  StayeaFlightAppliedDiscountBannerProps
> = ({
  code = "STAYEA10AIR",
  title = "Đã áp dụng ưu đãi Giảm 10% vé máy bay",
  description = "Ưu đãi từ Stayea Club đã được áp dụng vào giá vé. Bạn có thể tiếp tục tìm kiếm và hoàn tất đặt vé.",
  onChangeOffer,
  onClose,
}) => {
  return (
    <div className="bg-[#EDFDF5] border border-[#A7F3D0] rounded-2xl p-4 sm:p-5 shadow-2xs">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left Section: Icon + Texts */}
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#10B981] flex items-center justify-center shrink-0 shadow-2xs">
            <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-white stroke-[2.5]" />
          </div>

          <div className="space-y-0.5">
            <h3 className="text-sm sm:text-base font-extrabold text-[#065F46] leading-tight">
              {title}
            </h3>
            <p className="text-xs sm:text-sm text-[#047857]/90 leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        {/* Right Section: Code Tag + Status Badge + Change Offer Link + Close */}
        <div className="flex items-center flex-wrap sm:flex-nowrap gap-3 pl-12 lg:pl-0 shrink-0">
          {/* Label & Voucher Code */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <span className="text-[11px] text-slate-500 hidden sm:inline">Mã ưu đãi:</span>
            <span className="font-mono font-bold text-xs px-2.5 py-1 rounded-lg bg-[#EBF5FF] text-[#1D4ED8] border border-[#BFDBFE]">
              {code}
            </span>
          </div>

          {/* Status Badge */}
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#D1FAE5] text-[#047857] border border-[#6EE7B7]/50 shadow-2xs">
            <Check className="w-3 h-3 stroke-[2.5]" />
            <span>Đã áp dụng</span>
          </span>

          {/* Link "Thay đổi ưu đãi ->" */}
          <button
            type="button"
            onClick={onChangeOffer}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#1E40AF] hover:text-[#1D4ED8] hover:underline transition-colors cursor-pointer"
          >
            <span>Thay đổi ưu đãi</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {/* Close Button */}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-black/5 transition-colors cursor-pointer"
              aria-label="Đóng thông báo"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
