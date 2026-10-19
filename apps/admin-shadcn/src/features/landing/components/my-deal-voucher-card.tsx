"use client"

import Image from "next/image"
import { Copy, Calendar, Crown, Check } from "lucide-react"
import * as React from "react"
import type { MyVoucherItem } from "@/features/landing/data/stayea-mock-data"

interface MyDealVoucherCardProps {
  readonly voucher: MyVoucherItem
  readonly onCopyCode: (code: string) => void
  readonly onViewDetails: (voucher: MyVoucherItem) => void
}

function renderBadge(variant: MyVoucherItem["badgeVariant"], text: string) {
  switch (variant) {
    case "emerald":
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100/90 text-emerald-800 border border-emerald-300 shadow-2xs">
          {text}
        </span>
      )
    case "purple":
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100/90 text-purple-800 border border-purple-300 shadow-2xs">
          {text}
        </span>
      )
    case "blue":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100/90 text-blue-800 border border-blue-300 shadow-2xs">
          <Crown className="w-2.5 h-2.5 text-blue-700" />
          <span>{text}</span>
        </span>
      )
    case "amber":
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100/90 text-amber-800 border border-amber-300 shadow-2xs">
          {text}
        </span>
      )
    default:
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-600 border border-slate-300 shadow-2xs">
          {text}
        </span>
      )
  }
}

export function MyDealVoucherCard({
  voucher,
  onCopyCode,
  onViewDetails,
}: MyDealVoucherCardProps) {
  const [copied, setCopied] = React.useState(false)
  const isExpired = voucher.status === "expired"

  function handleCopy() {
    if (isExpired) return
    onCopyCode(voucher.code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className={`bg-white border rounded-2xl overflow-hidden transition-all flex flex-col justify-between shadow-2xs hover:shadow-xs ${
        isExpired ? "border-slate-200 opacity-80" : "border-slate-200/90 hover:border-slate-300"
      }`}
    >
      {/* 1. Card Top: Thumbnail Image + Badge */}
      <div>
        <div className="relative w-full h-32 sm:h-36 overflow-hidden bg-slate-100">
          <Image
            src={voucher.imageUrl}
            alt={voucher.title}
            fill
            unoptimized
            className={`object-cover object-center transition-transform duration-300 hover:scale-105 ${
              isExpired ? "grayscale-30" : ""
            }`}
          />
          {/* Badge Floating on Thumbnail */}
          <div className="absolute bottom-2.5 left-2.5 z-10">
            {renderBadge(voucher.badgeVariant, voucher.badgeText)}
          </div>
        </div>

        {/* 2. Card Content */}
        <div className="p-3 sm:p-3.5 space-y-2">

          {/* Title */}
          <h3
            className={`text-xs sm:text-sm font-bold tracking-tight line-clamp-1 ${
              isExpired ? "text-slate-600" : "text-[#0A2239]"
            }`}
            title={voucher.title}
          >
            {voucher.title}
          </h3>

          {/* Subtitle */}
          <p className="text-[11px] text-slate-500 line-clamp-1" title={voucher.description}>
            {voucher.description}
          </p>

          {/* Promo Code & Expiry Container */}
          <div className="pt-1 flex items-center justify-between text-[11px] text-slate-500">
            {/* Code button */}
            <button
              type="button"
              onClick={handleCopy}
              disabled={isExpired}
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-mono text-[11px] font-bold border transition-colors ${
                isExpired
                  ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
                  : "bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100 cursor-pointer"
              }`}
            >
              <span>{voucher.code}</span>
              {copied ? (
                <Check className="w-3 h-3 text-emerald-600" />
              ) : (
                <Copy className="w-3 h-3 text-slate-400" />
              )}
            </button>

            {/* Expiry Date */}
            <div className="flex items-center gap-1 text-[10px] text-slate-400 shrink-0">
              <Calendar className="w-3 h-3 text-slate-400" />
              <span>HSD: {voucher.expiryDate}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Bottom Actions: Sao chép mã & Chi tiết */}
      <div className="p-3.5 pt-0 flex items-center justify-between gap-2 border-t border-slate-100 mt-2">
        <button
          type="button"
          onClick={handleCopy}
          disabled={isExpired}
          className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-semibold transition-all active:scale-95 ${
            isExpired
              ? "bg-slate-200 text-slate-500 cursor-not-allowed"
              : "bg-[#0A2239] hover:bg-[#071726] text-white shadow-2xs cursor-pointer"
          }`}
        >
          {copied ? "Đã chép" : "Sao chép mã"}
        </button>

        <button
          type="button"
          onClick={() => onViewDetails(voucher)}
          className="text-xs text-blue-600 hover:text-blue-800 font-medium underline px-1 py-1 cursor-pointer shrink-0"
        >
          Chi tiết
        </button>
      </div>
    </div>
  )
}
