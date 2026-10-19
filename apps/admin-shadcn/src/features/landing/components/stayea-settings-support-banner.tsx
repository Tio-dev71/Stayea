"use client"

import * as React from "react"
import { Headphones, ArrowRight } from "lucide-react"

export interface StayeaSettingsSupportBannerProps {
  readonly onContactSupport?: () => void
}

export const StayeaSettingsSupportBanner: React.FC<StayeaSettingsSupportBannerProps> = ({
  onContactSupport,
}) => {
  return (
    <div className="bg-[#F0F7FF] border border-[#D0E2FF] rounded-2xl p-5 sm:p-6 shadow-2xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left: Icon & Text */}
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-2xs border border-blue-100">
            <Headphones className="w-5 h-5 text-[#1E40AF]" />
          </div>

          <div className="space-y-0.5">
            <h3 className="text-sm sm:text-base font-extrabold text-[#0A2239] leading-tight">
              Cần hỗ trợ thiết lập?
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Đội ngũ STAYEA luôn sẵn sàng hỗ trợ bạn trong việc quản lý tài khoản, bảo mật và các tùy chọn khác.
            </p>
          </div>
        </div>

        {/* Right: Action Button */}
        <button
          type="button"
          onClick={onContactSupport}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#0A2239] hover:bg-[#071726] text-white text-xs sm:text-sm font-bold shadow-2xs transition-all active:scale-95 cursor-pointer shrink-0"
        >
          <span>Liên hệ hỗ trợ</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
