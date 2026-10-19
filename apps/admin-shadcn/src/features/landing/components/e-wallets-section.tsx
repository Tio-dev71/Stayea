"use client"

import {
  Wallet,
} from "lucide-react"
import type { LinkedEWallet } from "@/features/landing/data/stayea-mock-data"

interface EWalletsSectionProps {
  readonly wallets: readonly LinkedEWallet[]
  readonly onLinkWallet: (wallet: LinkedEWallet) => void
}

export function EWalletsSection({ wallets, onLinkWallet }: EWalletsSectionProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-start gap-3 pb-1 border-b border-slate-100">
        <div className="p-2 rounded-xl bg-slate-100 text-slate-700 shrink-0 mt-0.5">
          <Wallet className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900">
            Ví & thanh toán khác
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Liên kết các ví điện tử và phương thức thanh toán nhanh khác.
          </p>
        </div>
      </div>

      {/* Wallets 3-col Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {wallets.map((wallet) => (
          <div
            key={wallet.id}
            className="flex items-center justify-between p-3 rounded-xl border border-slate-200/90 hover:border-slate-300 bg-slate-50/40 transition-all gap-2"
          >
            {/* Logo + Name */}
            <div className="flex items-center gap-3 min-w-0">
              {wallet.code === "momo" ? (
                <div className="w-9 h-9 rounded-xl bg-[#A50064] flex items-center justify-center text-white font-bold text-[10px] shrink-0 shadow-2xs leading-none">
                  momo
                </div>
              ) : wallet.code === "zalopay" ? (
                <div className="w-9 h-9 rounded-xl bg-[#0068FF] flex items-center justify-center text-white font-bold text-[9px] shrink-0 shadow-2xs leading-tight text-center">
                  Zalo<br />Pay
                </div>
              ) : (
                <div className="w-9 h-9 rounded-xl bg-black flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-2xs">
                  
                </div>
              )}

              <div className="min-w-0">
                <div className="font-bold text-xs text-slate-900 whitespace-nowrap">
                  {wallet.name}
                </div>
                <div className="text-[10px] text-slate-400 whitespace-nowrap">
                  {wallet.isLinked ? "Đã liên kết" : "Chưa liên kết"}
                </div>
              </div>
            </div>

            {/* Link Button */}
            <button
              type="button"
              onClick={() => onLinkWallet(wallet)}
              className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition-all cursor-pointer shadow-2xs active:scale-95 shrink-0 ${
                wallet.isLinked
                  ? "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100 hover:border-slate-400"
              }`}
            >
              {wallet.isLinked ? "Hủy" : "Liên kết"}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
