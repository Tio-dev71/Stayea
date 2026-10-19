"use client"

import {
  Receipt,
  Pencil,
} from "lucide-react"
import type { BillingInvoiceAddress } from "@/features/landing/data/stayea-mock-data"

interface BillingAddressCardProps {
  readonly address: BillingInvoiceAddress
  readonly onEdit: () => void
}

export function BillingAddressCard({ address, onEdit }: BillingAddressCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-start gap-3 pb-1 border-b border-slate-100">
        <div className="p-2 rounded-xl bg-slate-100 text-slate-700 shrink-0 mt-0.5">
          <Receipt className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Địa chỉ xuất hóa đơn
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Thông tin sử dụng để xuất hóa đơn cho các giao dịch của bạn.
          </p>
        </div>
      </div>

      {/* Info Rows */}
      <div className="space-y-2.5 text-xs sm:text-[13px]">
        <div className="flex items-start justify-between py-1 border-b border-slate-50 gap-2">
          <span className="text-slate-500 font-medium shrink-0">Loại</span>
          <span className="font-semibold text-slate-900 text-right">{address.type}</span>
        </div>

        <div className="flex items-start justify-between py-1 border-b border-slate-50 gap-2">
          <span className="text-slate-500 font-medium shrink-0">Họ tên</span>
          <span className="font-semibold text-slate-900 text-right">{address.fullName}</span>
        </div>

        <div className="flex items-start justify-between py-1 border-b border-slate-50 gap-2">
          <span className="text-slate-500 font-medium shrink-0">Email</span>
          <span className="font-medium text-slate-700 text-right truncate">{address.email}</span>
        </div>

        <div className="flex items-start justify-between py-1 border-b border-slate-50 gap-2">
          <span className="text-slate-500 font-medium shrink-0">Số điện thoại</span>
          <span className="font-medium text-slate-700 text-right">{address.phone}</span>
        </div>

        <div className="flex items-start justify-between py-1 gap-2">
          <span className="text-slate-500 font-medium shrink-0">Địa chỉ</span>
          <span className="font-medium text-slate-700 text-right leading-snug">
            {address.address}
          </span>
        </div>
      </div>

      {/* Update Action Button */}
      <button
        type="button"
        onClick={onEdit}
        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-2xs active:scale-95"
      >
        <Pencil className="w-3.5 h-3.5 text-slate-500" />
        <span>Cập nhật thông tin</span>
      </button>
    </div>
  )
}
