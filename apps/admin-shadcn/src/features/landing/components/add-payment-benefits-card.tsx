"use client"

import { Star, Zap, FileText, ShieldCheck, Settings } from "lucide-react"
import { PAYMENT_BENEFIT_ITEMS } from "@/features/landing/data/stayea-mock-data"
import type { PaymentBenefitItem } from "@/features/landing/data/stayea-mock-data"

function renderBenefitIcon(iconName: string) {
  const className = "w-5 h-5 text-[#1E40AF] shrink-0 mt-0.5"
  switch (iconName) {
    case "zap":
      return <Zap className={className} />
    case "file-text":
      return <FileText className={className} />
    case "shield-check":
      return <ShieldCheck className={className} />
    case "settings":
      return <Settings className={className} />
    default:
      return <Star className={className} />
  }
}

export function AddPaymentBenefitsCard() {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-2xs">
      {/* Header */}
      <div className="flex items-center gap-2 text-[#0A2239] pb-4 border-b border-slate-100">
        <Star className="w-5 h-5 text-[#1E40AF]" />
        <h3 className="text-sm sm:text-base font-bold text-[#0A2239]">
          Lợi ích khi lưu thẻ
        </h3>
      </div>

      {/* Benefits List */}
      <div className="space-y-4 pt-4">
        {PAYMENT_BENEFIT_ITEMS.map((item: PaymentBenefitItem) => (
          <div key={item.id} className="flex items-start gap-3">
            {renderBenefitIcon(item.iconName)}
            <div className="space-y-0.5">
              <h4 className="text-xs sm:text-sm font-bold text-[#0A2239]">
                {item.title}
              </h4>
              <p className="text-[11px] sm:text-xs text-slate-500 leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
