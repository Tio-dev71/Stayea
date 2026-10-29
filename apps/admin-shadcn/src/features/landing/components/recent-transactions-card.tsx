"use client"

import Image from "next/image"
import { Clock } from "lucide-react"
import type { RecentPaymentTransaction } from "@/features/landing/data/stayea-mock-data"

interface RecentTransactionsCardProps {
  readonly transactions: readonly RecentPaymentTransaction[]
  readonly onViewAll?: () => void
}

export function RecentTransactionsCard({
  transactions,
  onViewAll,
}: RecentTransactionsCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 pb-1 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-500" />
          <h3 className="text-base font-bold text-slate-900">
            Lịch sử thanh toán gần đây
          </h3>
        </div>
        <button
          type="button"
          onClick={onViewAll}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
        >
          Xem tất cả
        </button>
      </div>

      <p className="text-xs text-slate-500 -mt-2">
        Các giao dịch thanh toán cho đơn đặt dịch vụ của bạn.
      </p>

      {/* Transaction List */}
      {transactions.length === 0 ? (
        <div className="text-center py-8 px-4 rounded-xl border border-dashed border-slate-200 bg-slate-50/50">
          <Clock className="w-8 h-8 text-slate-400 mx-auto mb-1.5" />
          <h4 className="text-xs font-semibold text-slate-700">Chưa có giao dịch gần đây</h4>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Các khoản thanh toán cho đặt chỗ sẽ hiển thị tại đây.
          </p>
        </div>
      ) : (
        <div className="space-y-3 pt-1">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center justify-between gap-3 p-2.5 rounded-xl hover:bg-slate-50/80 transition-all border border-slate-100"
            >
              {/* Thumbnail + Info */}
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-slate-100 border border-slate-200/60">
                  <Image
                    src={tx.imageUrl}
                    alt={tx.serviceTitle}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>

                <div className="min-w-0 space-y-0.5">
                  <div className="font-bold text-xs text-slate-900 tracking-tight">
                    {tx.bookingCode}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">
                    {tx.serviceTitle}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {tx.date}
                  </div>
                </div>
              </div>

              {/* Price + Status Badge */}
              <div className="text-right shrink-0 space-y-1">
                <div className="font-bold text-xs sm:text-sm text-slate-900">
                  {tx.amountFormatted}
                </div>
                <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700">
                  {tx.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
