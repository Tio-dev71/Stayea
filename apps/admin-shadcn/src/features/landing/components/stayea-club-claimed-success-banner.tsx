"use client"

import React from "react"
import { Check, X } from "lucide-react"

export interface StayeaClubClaimedSuccessBannerProps {
  readonly onClose?: () => void
}

export const StayeaClubClaimedSuccessBanner: React.FC<StayeaClubClaimedSuccessBannerProps> = ({
  onClose,
}) => {
  return (
    <div className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4 shadow-2xs animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="flex items-center gap-3.5">
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
          <Check className="w-5 h-5 stroke-[2.5]" />
        </div>
        <div>
          <h3 className="text-sm sm:text-base font-bold text-[#0A2239]">
            Bạn đã nhận ưu đãi thành công
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Ưu đãi đã được lưu vào ví ưu đãi của bạn và sẵn sàng sử dụng khi đặt vé máy bay.
          </p>
        </div>
      </div>

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-emerald-100/50 transition-colors shrink-0 cursor-pointer"
          aria-label="Đóng thông báo"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}
