"use client"

import React from "react"
import { Info, Gift, Headphones, ArrowRight, Check } from "lucide-react"
import type { StayeaClubClaimedOfferDetails } from "@/features/landing/data/stayea-mock-data"

export interface StayeaClubClaimedSidebarWidgetsProps {
  readonly offer: StayeaClubClaimedOfferDetails
  readonly onViewWallet?: () => void
  readonly onContactSupport?: () => void
}

export const StayeaClubClaimedSidebarWidgets: React.FC<StayeaClubClaimedSidebarWidgetsProps> = ({
  offer,
  onViewWallet,
  onContactSupport,
}) => {
  return (
    <div className="space-y-5">
      {/* Widget 1: Thông tin ưu đãi */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
        <div className="flex items-center gap-2 text-[#0A2239] mb-4 pb-2.5 border-b border-slate-100">
          <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#1E40AF] flex items-center justify-center shrink-0">
            <Info className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-[#0A2239]">
            Thông tin ưu đãi
          </h3>
        </div>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Loại ưu đãi:</span>
            <span className="font-semibold text-slate-800">{offer.infoType}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500">Mã ưu đãi:</span>
            <span className="font-mono font-bold text-slate-800">{offer.infoCode}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500">Trạng thái:</span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Check className="w-3 h-3 stroke-[2.5]" />
              <span>{offer.infoStatus}</span>
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500">Hiệu lực đến:</span>
            <span className="font-semibold text-slate-800">{offer.infoValidUntil}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500">Áp dụng cho:</span>
            <span className="font-semibold text-slate-800">{offer.infoApplicableFor}</span>
          </div>
        </div>
      </div>

      {/* Widget 2: Ưu đãi của bạn */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
        <div className="flex items-center gap-2 text-[#0A2239] mb-3 pb-2.5 border-b border-slate-100">
          <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#1E40AF] flex items-center justify-center shrink-0">
            <Gift className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-[#0A2239]">
            Ưu đãi của bạn
          </h3>
        </div>

        <p className="text-xs text-slate-700 leading-relaxed">
          Bạn hiện có <strong className="font-bold text-[#0A2239]">{offer.availableVouchersCount}</strong> ưu đãi khả dụng
        </p>
        <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
          Khám phá thêm nhiều ưu đãi đặc quyền khác dành riêng cho thành viên Stayea Club.
        </p>

        <button
          type="button"
          onClick={onViewWallet}
          className="w-full mt-4 py-2.5 px-4 rounded-xl bg-[#0A2239] hover:bg-[#071726] text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-2xs transition-all active:scale-95 cursor-pointer"
        >
          <span>Xem ví ưu đãi</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Widget 3: Cần hỗ trợ? */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
        <div className="flex items-center gap-2 text-[#0A2239] mb-3 pb-2.5 border-b border-slate-100">
          <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#1E40AF] flex items-center justify-center shrink-0">
            <Headphones className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-[#0A2239]">
            Cần hỗ trợ?
          </h3>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Nếu bạn cần hỗ trợ về ưu đãi hoặc gặp bất kỳ vấn đề nào khi sử dụng, hãy liên hệ đội ngũ CSKH của Stayea.
        </p>

        <button
          type="button"
          onClick={onContactSupport}
          className="w-full mt-4 py-2 px-4 rounded-xl bg-white hover:bg-slate-50 text-blue-600 hover:text-blue-800 border border-blue-200/90 text-xs font-semibold flex items-center justify-center gap-1.5 shadow-2xs transition-all active:scale-95 cursor-pointer"
        >
          <span>Liên hệ ngay</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}
