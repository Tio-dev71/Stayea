"use client"

import { Check, CreditCard, Landmark, Wallet } from "lucide-react"
import { PAYMENT_METHOD_TYPE_OPTIONS } from "@/features/landing/data/stayea-mock-data"
import type { PaymentMethodTypeOption } from "@/features/landing/data/stayea-mock-data"

interface AddPaymentMethodSelectorProps {
  readonly selectedType: "card" | "bank" | "wallet"
  readonly onSelectType: (type: "card" | "bank" | "wallet") => void
}

function renderTypeIcon(iconName: string, isSelected: boolean) {
  const className = `w-6 h-6 ${isSelected ? "text-[#1E40AF]" : "text-slate-600"}`
  switch (iconName) {
    case "credit-card":
      return <CreditCard className={className} />
    case "landmark":
      return <Landmark className={className} />
    case "wallet":
      return <Wallet className={className} />
    default:
      return <CreditCard className={className} />
  }
}

export function AddPaymentMethodSelector({
  selectedType,
  onSelectType,
}: AddPaymentMethodSelectorProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-8">
      {PAYMENT_METHOD_TYPE_OPTIONS.map((option: PaymentMethodTypeOption) => {
        const isSelected = selectedType === option.id
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onSelectType(option.id)}
            className={`relative flex flex-col items-center justify-center p-5 rounded-2xl text-center transition-all cursor-pointer ${
              isSelected
                ? "bg-[#F0F7FF] border-2 border-[#1E40AF] shadow-sm"
                : "bg-white border border-slate-200 hover:border-slate-300 hover:shadow-xs"
            }`}
          >
            {/* Checked Indicator for selected item */}
            {isSelected && (
              <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#1E40AF] text-white flex items-center justify-center shadow-xs">
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              </span>
            )}

            {/* Icon */}
            <div className="mb-2.5">
              {renderTypeIcon(option.iconName, isSelected)}
            </div>

            {/* Title */}
            <h3
              className={`text-sm font-bold tracking-tight mb-1 ${
                isSelected ? "text-[#0A2239]" : "text-slate-800"
              }`}
            >
              {option.title}
            </h3>

            {/* Subtitle */}
            <p className="text-xs text-slate-500 line-clamp-1">{option.subtitle}</p>
          </button>
        )
      })}
    </div>
  )
}
