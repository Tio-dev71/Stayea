"use client"

import { ShieldCheck } from "lucide-react"

export function PaymentSecurityCard() {
  return (
    <div className="relative bg-[#F0F7FF] rounded-2xl border border-blue-100/90 p-5 shadow-xs overflow-hidden">
      {/* Decorative Palm Silhouette in Background */}
      <div className="absolute -right-3 -bottom-4 w-28 h-28 opacity-15 text-blue-600 pointer-events-none select-none">
        <svg viewBox="0 0 100 100" fill="currentColor">
          <path d="M50 85 C48 60 49 35 50 10 C53 10 55 10 58 10 C55 35 54 60 52 85 Z" />
          <path d="M50 20 C40 10 20 15 10 25 C25 25 40 22 50 20 Z" />
          <path d="M52 20 C62 10 82 15 92 25 C77 25 62 22 52 20 Z" />
          <path d="M50 22 C35 25 20 35 15 50 C28 42 42 32 50 22 Z" />
          <path d="M52 22 C67 25 82 35 87 50 C74 42 60 32 52 22 Z" />
        </svg>
      </div>

      <div className="relative z-10 flex items-start gap-3.5">
        <div className="p-2.5 rounded-xl bg-blue-100/70 text-blue-700 shrink-0">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-[#0A2239]">
            Thanh toán an toàn
          </h4>
          <p className="text-xs text-slate-600 leading-relaxed max-w-[260px]">
            Tất cả thông tin thanh toán của bạn đều được mã hóa và bảo vệ bằng công nghệ bảo mật tiên tiến của STAYEA.
          </p>
        </div>
      </div>
    </div>
  )
}
