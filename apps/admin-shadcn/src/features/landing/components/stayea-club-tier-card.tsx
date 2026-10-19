"use client"

import Image from "next/image"
import { Crown, Star, ArrowRight } from "lucide-react"
import type { StayeaClubProfile } from "@/features/landing/data/stayea-mock-data"

interface StayeaClubTierCardProps {
  readonly profile: StayeaClubProfile
  readonly onViewTiers?: () => void
}

export function StayeaClubTierCard({ profile, onViewTiers }: StayeaClubTierCardProps) {
  const progressPercent = Math.min(
    100,
    Math.round((profile.currentPoints / profile.nextTierThreshold) * 100)
  )

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-[#FFFBEB] via-[#FEF3C7]/40 to-white border border-amber-200/80 rounded-2xl p-5 sm:p-6 shadow-2xs">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* 1. Member Profile (Col 5) */}
        <div className="md:col-span-5 flex items-center gap-4">
          {/* Avatar with Golden Star Badge */}
          <div className="relative shrink-0">
            <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-full overflow-hidden border-2 border-white shadow-sm">
              <Image
                src={profile.avatarUrl}
                alt={profile.memberName}
                fill
                unoptimized
                className="object-cover object-center"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center border-2 border-white shadow-xs">
              <Star className="w-3.5 h-3.5 fill-white" />
            </div>
          </div>

          {/* Member Info */}
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-[#0A2239]">
                {profile.memberName}
              </h2>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                <Crown className="w-2.5 h-2.5" />
                <span>Thành viên Stayea Club</span>
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700">
              <Crown className="w-3.5 h-3.5 fill-amber-500 text-amber-600" />
              <span>{profile.memberTier}</span>
            </div>

            <p className="text-[11px] text-slate-400">
              Thành viên từ {profile.memberSince}
            </p>
          </div>
        </div>

        {/* 2. Points Balance (Col 3) */}
        <div className="md:col-span-3 flex items-center gap-3.5 md:border-l md:border-r border-amber-200/60 md:px-6">
          <div className="w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-2xs">
            <Star className="w-5 h-5 fill-white" />
          </div>
          <div>
            <span className="block text-xl sm:text-2xl font-black text-[#0A2239] leading-tight">
              {profile.currentPoints.toLocaleString("vi-VN")} điểm
            </span>
            <span className="block text-xs text-slate-500">
              Điểm Stayea Club của bạn
            </span>
          </div>
        </div>

        {/* 3. Tier Progression & Next Level (Col 4) */}
        <div className="md:col-span-4 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-700 font-medium">
              Còn{" "}
              <strong className="text-[#0A2239] font-bold">
                {profile.pointsNeededForNextTier.toLocaleString("vi-VN")} điểm
              </strong>{" "}
              để lên hạng{" "}
              <strong className="text-indigo-900 font-bold">
                {profile.nextTier}
              </strong>
            </span>
            <span className="text-slate-400 font-semibold">
              {profile.nextTierThreshold.toLocaleString("vi-VN")} điểm
            </span>
          </div>

          {/* Progress Bar */}
          <div className="h-2 w-full bg-amber-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs pt-0.5">
            <span className="text-[11px] text-slate-500 font-medium">
              {profile.currentPoints.toLocaleString("vi-VN")} /{" "}
              {profile.nextTierThreshold.toLocaleString("vi-VN")}
            </span>
            <button
              type="button"
              onClick={onViewTiers}
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
            >
              <span>Xem hạng và quyền lợi</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
