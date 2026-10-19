"use client"

import React from "react"
import { Crown, Check, ArrowRight } from "lucide-react"
import { STAYEA_CLUB_TIERS } from "@/features/landing/data/stayea-mock-data"
import type { StayeaClubTierTierItem } from "@/features/landing/data/stayea-mock-data"

export interface StayeaClubTiersComparisonProps {
  readonly onSelectTier?: (tier: StayeaClubTierTierItem) => void
  readonly onCompareClick?: () => void
}

export const StayeaClubTiersComparison: React.FC<StayeaClubTiersComparisonProps> = ({
  onSelectTier,
  onCompareClick,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-[#0A2239]">
          <Crown className="w-5 h-5 text-[#1E40AF]" />
          <h3 className="text-base font-bold text-[#0A2239]">Các hạng thành viên</h3>
        </div>
        <button
          type="button"
          onClick={onCompareClick}
          className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors cursor-pointer"
        >
          <span>So sánh chi tiết</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 3 Tier Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1 items-stretch">
        {STAYEA_CLUB_TIERS.map((tier) => {
          const isGold = tier.id === "gold"
          const isPlatinum = tier.id === "platinum"

          return (
            <div
              key={tier.id}
              className={`relative rounded-xl p-3.5 flex flex-col justify-between transition-all duration-200 ${
                isGold
                  ? "bg-[#FFFDF7] border-2 border-amber-300 ring-1 ring-amber-300/50 shadow-xs"
                  : "bg-slate-50/50 border border-slate-200/90 hover:border-slate-300"
              }`}
            >
              {/* Badge for Current Tier */}
              {tier.isCurrent && (
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 z-10">
                  <span className="inline-flex items-center whitespace-nowrap px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-amber-950 shadow-2xs">
                    Hạng hiện tại
                  </span>
                </div>
              )}

              {/* Tier Header */}
              <div className="text-center pt-1 mb-3">
                <div className="flex justify-center mb-1.5">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center ${
                      isGold
                        ? "bg-amber-100 text-amber-600 shadow-inner"
                        : isPlatinum
                        ? "bg-purple-100 text-purple-600"
                        : "bg-slate-200/80 text-slate-500"
                    }`}
                  >
                    <Crown className="w-5 h-5 fill-current" />
                  </div>
                </div>
                <h4
                  className={`text-sm font-bold ${
                    isGold
                      ? "text-amber-950"
                      : isPlatinum
                      ? "text-purple-950"
                      : "text-slate-800"
                  }`}
                >
                  {tier.name}
                </h4>
                <p className="text-[11px] text-slate-500">{tier.subtitle}</p>
              </div>

              {/* Feature List */}
              <ul className="space-y-2 mb-4 flex-1">
                {tier.features.map((feature) => (
                  <li key={`${tier.id}-${feature}`} className="flex items-start gap-1.5 text-[11px] leading-snug text-slate-700">
                    <span
                      className={`shrink-0 mt-0.5 ${
                        isGold
                          ? "text-amber-600 font-bold"
                          : isPlatinum
                          ? "text-purple-600 font-bold"
                          : "text-slate-500"
                      }`}
                    >
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Action Button */}
              <button
                type="button"
                onClick={() => onSelectTier?.(tier)}
                className={`w-full py-2 px-2.5 rounded-lg text-xs font-semibold transition-all text-center shadow-2xs active:scale-95 cursor-pointer ${
                  isGold
                    ? "bg-amber-400 hover:bg-amber-500 text-amber-950 font-bold"
                    : "bg-[#EBF3FC] hover:bg-blue-100 text-[#2563EB]"
                }`}
              >
                {tier.buttonText}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
