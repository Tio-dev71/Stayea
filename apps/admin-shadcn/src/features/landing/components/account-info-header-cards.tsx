"use client"

import Image from "next/image"
import {
  Camera,
  Pencil,
  Mail,
  Phone,
  Crown,
  Lightbulb,
  Check,
} from "lucide-react"
import type { UserProfileInfo, StayeaProfileTip } from "@/features/landing/data/stayea-mock-data"

interface AccountInfoHeaderCardsProps {
  readonly profile: UserProfileInfo
  readonly tips: readonly StayeaProfileTip[]
  readonly onChangeAvatar?: () => void
}

export function AccountInfoHeaderCards({
  profile,
  tips,
  onChangeAvatar,
}: AccountInfoHeaderCardsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
      {/* 1. Left Card: User Profile Summary (Col Span 2) */}
      <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4 sm:gap-5">
          {/* Avatar + Info */}
          <div className="flex items-start gap-4 sm:gap-5 min-w-0">
            {/* Avatar with Camera Badge */}
            <div className="relative shrink-0">
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-white shadow-sm bg-slate-100 ring-1 ring-slate-200/60">
                <Image
                  src={profile.avatarUrl}
                  alt={profile.name}
                  fill
                  unoptimized
                  className="object-cover object-top"
                />
              </div>
              <button
                type="button"
                onClick={onChangeAvatar}
                aria-label="Thay đổi ảnh đại diện"
                className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-[#0A2239] hover:bg-[#071726] text-white flex items-center justify-center border-2 border-white shadow-sm transition-transform hover:scale-110 active:scale-95 cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Info details */}
            <div className="space-y-1.5 min-w-0">
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  {profile.name}
                </h2>
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#EBF3FC] text-[#2563EB] text-xs font-semibold">
                  <Crown className="w-3.5 h-3.5 fill-current" />
                  <span>{profile.membershipTier}</span>
                </span>
              </div>

              {/* Email & Phone */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs text-slate-600 pt-0.5">
                <div className="flex items-center gap-1.5 truncate">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{profile.email}</span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{profile.phone}</span>
                </div>
              </div>

              {/* Bio */}
              <p className="text-xs sm:text-[13px] text-slate-500 pt-1 leading-relaxed line-clamp-2">
                {profile.bio}
              </p>
            </div>
          </div>

          {/* Top Right Action: Chỉnh sửa ảnh */}
          <button
            type="button"
            onClick={onChangeAvatar}
            className="shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-all active:scale-95 cursor-pointer"
          >
            <Pencil className="w-3.5 h-3.5 text-slate-500" />
            <span>Chỉnh sửa ảnh</span>
          </button>
        </div>
      </div>

      {/* 2. Right Card: Mẹo từ STAYEA (Col Span 1) */}
      <div className="lg:col-span-1 bg-[#F4F8FD] rounded-2xl border border-blue-100/90 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="flex items-start gap-2.5">
            <div className="p-1.5 rounded-lg bg-amber-100/80 text-amber-600 shrink-0 mt-0.5">
              <Lightbulb className="w-4 h-4 fill-amber-500 text-amber-600" />
            </div>
            <div>
              <h3 className="text-sm sm:text-[15px] font-bold text-[#0A2239]">
                Mẹo từ STAYEA
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
                Cập nhật thông tin cá nhân giúp bạn có trải nghiệm tốt hơn!
              </p>
            </div>
          </div>

          {/* Tips List */}
          <div className="space-y-3 mt-4 pt-1">
            {tips.map((tip) => (
              <div key={tip.id} className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-[#1E3A8A] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                  <Check className="w-3 h-3 stroke-[2.5]" />
                </div>
                <p className="text-xs text-slate-600 leading-snug">
                  {tip.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
