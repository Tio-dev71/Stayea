"use client"

import { ChevronRight } from "lucide-react"

interface AddPaymentMethodBreadcrumbProps {
  readonly onNavigate?: (route: string) => void
}

export function AddPaymentMethodBreadcrumb({ onNavigate }: AddPaymentMethodBreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 mb-2">
      <button
        type="button"
        onClick={() => onNavigate?.("profile")}
        className="hover:text-[#0A2239] transition-colors cursor-pointer"
      >
        Trang cá nhân
      </button>
      <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
      <button
        type="button"
        onClick={() => onNavigate?.("payment")}
        className="hover:text-[#0A2239] transition-colors cursor-pointer"
      >
        Phương thức thanh toán
      </button>
      <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
      <span className="font-semibold text-slate-900">Thêm phương thức</span>
    </nav>
  )
}
