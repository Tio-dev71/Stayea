"use client"

import {
  Landmark,
  Pencil,
  Trash2,
} from "lucide-react"
import type { LinkedBankAccount } from "@/features/landing/data/stayea-mock-data"

interface BankAccountsSectionProps {
  readonly accounts: readonly LinkedBankAccount[]
  readonly onEditAccount: (account: LinkedBankAccount) => void
  readonly onDeleteAccount: (accountId: string) => void
}

export function BankAccountsSection({
  accounts,
  onEditAccount,
  onDeleteAccount,
}: BankAccountsSectionProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-start gap-3 pb-1 border-b border-slate-100">
        <div className="p-2 rounded-xl bg-slate-100 text-slate-700 shrink-0 mt-0.5">
          <Landmark className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900">
            Tài khoản ngân hàng
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Liên kết tài khoản ngân hàng để thanh toán nhanh chóng và thuận tiện.
          </p>
        </div>
      </div>

      {/* Account List */}
      <div className="space-y-3">
        {accounts.map((acc) => (
          <div
            key={acc.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-slate-200/90 hover:border-slate-300 bg-slate-50/40 transition-all"
          >
            {/* Left: Bank Logo + Details */}
            <div className="flex items-center gap-3.5 min-w-0">
              {/* Bank Logo Emblem */}
              <div className="w-11 h-11 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-2xs">
                {acc.bankCode === "vcb" ? (
                  <div className="w-6 h-6 rounded-full bg-[#007A33] flex items-center justify-center text-white font-bold text-[10px]">
                    VCB
                  </div>
                ) : (
                  <div className="w-6 h-6 rotate-45 bg-[#E31837] flex items-center justify-center">
                    <span className="w-2.5 h-2.5 bg-white -rotate-45" />
                  </div>
                )}
              </div>

              {/* Text Info */}
              <div className="min-w-0 space-y-0.5">
                <div className="font-bold text-sm sm:text-base text-slate-900 truncate">
                  {acc.bankName}
                </div>
                <div className="text-xs text-slate-600 truncate">
                  {acc.accountHolder}
                </div>
                <div className="text-[11px] sm:text-xs text-slate-500 font-mono">
                  Số tài khoản: {acc.accountNumberMasked}
                </div>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
              <button
                type="button"
                onClick={() => onEditAccount(acc)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-all cursor-pointer shadow-2xs active:scale-95"
              >
                <Pencil className="w-3.5 h-3.5 text-slate-500" />
                <span>Chỉnh sửa</span>
              </button>

              <button
                type="button"
                onClick={() => onDeleteAccount(acc.id)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-200 hover:border-rose-300 hover:bg-rose-50 text-rose-600 text-xs font-semibold transition-all cursor-pointer shadow-2xs active:scale-95"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                <span>Xóa</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
