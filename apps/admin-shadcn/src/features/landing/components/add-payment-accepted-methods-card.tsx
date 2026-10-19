"use client"

import { CreditCard } from "lucide-react"
import {
  VisaLogo,
  MastercardLogo,
  JcbLogo,
  ApplePayLogo,
  MomoLogo,
  VnpayLogo,
} from "./payment-brand-logos"

export function AddPaymentAcceptedMethodsCard() {
  return (
    <div className="relative overflow-hidden bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-2xs">
      {/* Header */}
      <div className="flex items-center gap-2 text-[#0A2239] mb-1.5">
        <CreditCard className="w-5 h-5 text-[#1E40AF]" />
        <h3 className="text-sm sm:text-base font-bold text-[#0A2239]">
          Các phương thức được chấp nhận
        </h3>
      </div>

      <p className="text-xs text-slate-500 leading-relaxed mb-5">
        STAYEA hỗ trợ nhiều phương thức thanh toán phổ biến và an toàn.
      </p>

      {/* 2x3 Logos Grid */}
      <div className="relative z-10 grid grid-cols-2 gap-3">
        {/* 1. VISA */}
        <div className="h-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center p-2 hover:border-slate-300 transition-all shadow-2xs">
          <VisaLogo className="h-4 sm:h-5 w-auto" />
        </div>

        {/* 2. Mastercard */}
        <div className="h-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center p-2 hover:border-slate-300 transition-all shadow-2xs">
          <MastercardLogo className="h-5 sm:h-6 w-auto" />
        </div>

        {/* 3. JCB */}
        <div className="h-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center p-2 hover:border-slate-300 transition-all shadow-2xs">
          <JcbLogo className="h-5" />
        </div>

        {/* 4. Apple Pay */}
        <div className="h-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center p-2 hover:border-slate-300 transition-all shadow-2xs">
          <ApplePayLogo className="h-5 sm:h-6 w-auto" />
        </div>

        {/* 5. MoMo */}
        <div className="h-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center p-2 hover:border-slate-300 transition-all shadow-2xs">
          <MomoLogo className="h-6 w-6" />
        </div>

        {/* 6. VNPay */}
        <div className="h-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center p-2 hover:border-slate-300 transition-all shadow-2xs">
          <VnpayLogo className="h-5 w-auto" />
        </div>
      </div>

      {/* Decorative Tropical Palm Tree Beach Watermark */}
      <div className="pointer-events-none absolute -bottom-3 -right-2 w-48 h-32 opacity-25 text-sky-400 select-none">
        <svg viewBox="0 0 200 120" fill="currentColor" className="w-full h-full">
          {/* Waves */}
          <path d="M0,110 Q50,105 100,110 T200,110 L200,120 L0,120 Z" opacity="0.4" />
          <path d="M0,115 Q60,112 120,115 T200,115 L200,120 L0,120 Z" opacity="0.6" />
          {/* Beach Mound */}
          <ellipse cx="170" cy="115" rx="50" ry="12" />
          {/* Palm Tree Trunk */}
          <path d="M165,115 Q158,80 148,50 Q145,50 143,51 Q154,82 161,115 Z" />
          {/* Palm Leaves */}
          <path d="M146,50 Q130,40 105,45 Q125,52 145,51 Z" />
          <path d="M147,49 Q135,30 115,22 Q130,38 146,50 Z" />
          <path d="M148,49 Q155,25 142,8 Q152,28 149,50 Z" />
          <path d="M149,50 Q170,30 185,25 Q170,42 149,51 Z" />
          <path d="M149,51 Q180,48 195,58 Q175,60 148,52 Z" />
        </svg>
      </div>
    </div>
  )
}
