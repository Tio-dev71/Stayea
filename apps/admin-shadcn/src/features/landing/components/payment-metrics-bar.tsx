"use client"

import {
  CreditCard,
  Crown,
  FileText,
  ShieldCheck,
} from "lucide-react"
import type { PaymentMethodsMetrics } from "@/features/landing/data/stayea-mock-data"

interface PaymentMetricsBarProps {
  readonly metrics: PaymentMethodsMetrics
}

export function PaymentMetricsBar({ metrics }: PaymentMetricsBarProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
      {/* 1. Phương thức đã lưu */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-3.5 sm:p-4 shadow-xs flex items-center gap-3">
        <div className="p-2 rounded-xl bg-blue-50 text-blue-600 shrink-0">
          <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <div className="min-w-0">
          <div className="text-[11px] text-slate-500 font-medium leading-tight">
            Phương thức đã lưu
          </div>
          <div className="text-lg sm:text-xl font-bold text-slate-900 leading-tight">
            {metrics.savedMethodsCount}
          </div>
          <div className="text-[10px] text-slate-400 leading-tight">
            Thẻ, tài khoản và ví điện tử
          </div>
        </div>
      </div>

      {/* 2. Mặc định */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-3.5 sm:p-4 shadow-xs flex items-center gap-3">
        <div className="p-2 rounded-xl bg-amber-50 text-amber-500 shrink-0">
          <Crown className="w-4 h-4 sm:w-5 sm:h-5 fill-amber-400" />
        </div>
        <div className="min-w-0">
          <div className="text-[11px] text-slate-500 font-medium leading-tight">
            Mặc định
          </div>
          <div className="text-xs sm:text-sm font-bold text-slate-900 leading-tight truncate">
            {metrics.defaultCardTitle}
          </div>
          <div className="text-[10px] text-slate-400 leading-tight">
            Thẻ thanh toán chính
          </div>
        </div>
      </div>

      {/* 3. Giao dịch gần đây */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-3.5 sm:p-4 shadow-xs flex items-center gap-3">
        <div className="p-2 rounded-xl bg-blue-50 text-blue-600 shrink-0">
          <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <div className="min-w-0">
          <div className="text-[11px] text-slate-500 font-medium leading-tight">
            Giao dịch gần đây
          </div>
          <div className="text-lg sm:text-xl font-bold text-slate-900 leading-tight">
            {metrics.recentTxCount}
          </div>
          <div className="text-[10px] text-slate-400 leading-tight">
            Trong 3 tháng qua
          </div>
        </div>
      </div>

      {/* 4. Bảo mật thanh toán */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-3.5 sm:p-4 shadow-xs flex items-center gap-3">
        <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 shrink-0">
          <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <div className="min-w-0">
          <div className="text-[11px] text-slate-500 font-medium leading-tight">
            Bảo mật thanh toán
          </div>
          <div className="text-xs sm:text-sm font-bold text-emerald-600 leading-tight truncate">
            {metrics.securityStatus}
          </div>
          <div className="text-[10px] text-slate-400 leading-tight">
            Được mã hóa bảo mật
          </div>
        </div>
      </div>
    </div>
  )
}
