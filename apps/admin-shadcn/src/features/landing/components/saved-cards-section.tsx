"use client"

import {
  CreditCard,
  Crown,
  Pencil,
  Trash2,
} from "lucide-react"
import type { SavedCreditCard } from "@/features/landing/data/stayea-mock-data"

interface SavedCardsSectionProps {
  readonly cards: readonly SavedCreditCard[]
  readonly onSetDefault: (cardId: string) => void
  readonly onEditCard: (card: SavedCreditCard) => void
  readonly onDeleteCard: (cardId: string) => void
}

export function SavedCardsSection({
  cards,
  onSetDefault,
  onEditCard,
  onDeleteCard,
}: SavedCardsSectionProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-5">
      {/* Header */}
      <div className="flex items-start gap-3 pb-1 border-b border-slate-100">
        <div className="p-2 rounded-xl bg-slate-100 text-slate-700 shrink-0 mt-0.5">
          <CreditCard className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900">
            Thẻ đã lưu
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Quản lý các thẻ thanh toán quốc tế và nội địa của bạn.
          </p>
        </div>
      </div>

      {/* Cards Grid */}
      {cards.length === 0 ? (
        <div className="text-center py-10 px-4 rounded-xl border border-dashed border-slate-200 bg-slate-50/50">
          <CreditCard className="w-10 h-10 text-slate-400 mx-auto mb-2" />
          <h4 className="text-sm font-bold text-slate-800">Chưa có thẻ thanh toán nào được lưu</h4>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Thêm thẻ tín dụng hoặc ghi nợ quốc tế để thanh toán dịch vụ nhanh chóng và an toàn.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {cards.map((card) => {
          const isVisa = card.cardType === "visa"

          return (
            <div key={card.id} className="space-y-3">
              {/* The Physical Card Mockup */}
              <div
                className={`relative w-full h-[180px] sm:h-[190px] rounded-2xl p-5 text-white shadow-md flex flex-col justify-between overflow-hidden bg-gradient-to-br ${
                  isVisa
                    ? "from-[#194FA8] via-[#1E5CCB] to-[#0A88DE]"
                    : "from-[#2A2B30] via-[#1C1D21] to-[#0D0E11]"
                }`}
              >
                {/* Background Palm Leaves Watermark Overlay */}
                <div className="absolute right-0 bottom-0 w-36 h-36 opacity-10 pointer-events-none select-none">
                  <svg viewBox="0 0 100 100" fill="currentColor">
                    <path d="M50 0 C60 30 80 50 100 50 C80 60 60 80 50 100 C40 80 20 60 0 50 C20 40 40 20 50 0 Z" />
                  </svg>
                </div>

                {/* Top Row: Brand Logo + Default Badge */}
                <div className="flex items-center justify-between">
                  {isVisa ? (
                    <span className="font-extrabold italic text-xl sm:text-2xl tracking-wider select-none">
                      VISA
                    </span>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="flex items-center -space-x-2">
                        <span className="w-6 h-6 rounded-full bg-[#EB001B] inline-block shadow-xs" />
                        <span className="w-6 h-6 rounded-full bg-[#F79E1B] inline-block opacity-90 shadow-xs" />
                      </div>
                      <span className="text-xs font-semibold tracking-wide text-white/90 select-none">
                        mastercard
                      </span>
                    </div>
                  )}

                  {card.isDefault && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-white text-[11px] font-semibold">
                      <Crown className="w-3 h-3 fill-current" />
                      <span>Mặc định</span>
                    </span>
                  )}
                </div>

                {/* Middle: Masked Card Number */}
                <div className="font-mono text-base sm:text-lg tracking-[0.25em] font-medium text-white/95 select-all">
                  {card.cardNumberMasked}
                </div>

                {/* Bottom Row: Cardholder + Expiry */}
                <div className="flex items-end justify-between text-xs tracking-wider select-none">
                  <span className="font-semibold uppercase tracking-wider text-white text-xs">
                    {card.cardHolder}
                  </span>
                  <span className="font-mono font-medium text-white text-xs">
                    {card.expiryDate}
                  </span>
                </div>
              </div>

              {/* Action Buttons Below the Card */}
              <div className="flex items-center gap-2 pt-0.5">
                {!card.isDefault && (
                  <button
                    type="button"
                    onClick={() => onSetDefault(card.id)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-all cursor-pointer shadow-2xs active:scale-95"
                  >
                    <Crown className="w-3.5 h-3.5 text-amber-500" />
                    <span>Đặt mặc định</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => onEditCard(card)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-all cursor-pointer shadow-2xs active:scale-95"
                >
                  <Pencil className="w-3.5 h-3.5 text-slate-500" />
                  <span>Chỉnh sửa</span>
                </button>

                <button
                  type="button"
                  onClick={() => onDeleteCard(card.id)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-rose-200 hover:border-rose-300 hover:bg-rose-50 text-rose-600 text-xs font-semibold transition-all cursor-pointer shadow-2xs active:scale-95"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                  <span>Xóa</span>
                </button>
              </div>
            </div>
          )
        })}
      </div>
      )}
    </div>
  )
}
