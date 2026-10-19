"use client"

import { Headphones, ArrowRight } from "lucide-react"

interface BookingsSupportBannerProps {
  readonly onContactSupport?: () => void
}

export function BookingsSupportBanner({
  onContactSupport,
}: BookingsSupportBannerProps) {
  return (
    <div className="bg-[#EEF5FC] border border-[#D8E6F8] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs mt-8">
      {/* Icon + Information */}
      <div className="flex items-center gap-3.5 text-center sm:text-left">
        <div className="w-11 h-11 rounded-full bg-[#0A2239] text-white flex items-center justify-center shrink-0 shadow-xs">
          <Headphones className="w-5 h-5 text-white" />
        </div>
        <div>
          <h4 className="font-bold text-slate-900 text-sm sm:text-base">
            Cần hỗ trợ về đơn đặt dịch vụ?
          </h4>
          <p className="text-xs text-slate-600 mt-0.5">
            Đội ngũ STAYEA luôn sẵn sàng hỗ trợ bạn 24/7 trong suốt hành trình.
          </p>
        </div>
      </div>

      {/* Contact Support Action */}
      <div className="shrink-0">
        <button
          type="button"
          onClick={onContactSupport}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 hover:border-slate-400 text-slate-800 text-xs font-semibold shadow-2xs transition-all active:scale-95"
        >
          <span>Liên hệ hỗ trợ</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-700" />
        </button>
      </div>
    </div>
  )
}
