"use client"

import Image from "next/image"
import {
  Camera,
  Edit3,
  Mail,
  Phone,
  Crown,
  CalendarDays,
  Heart,
  Star,
} from "lucide-react"
import type { UserProfileInfo } from "@/features/landing/data/stayea-mock-data"

interface ProfileUserCardProps {
  readonly profile: UserProfileInfo
  readonly onEditProfile?: () => void
  readonly onChangeAvatar?: () => void
}

export function ProfileUserCard({
  profile,
  onEditProfile,
  onChangeAvatar,
}: ProfileUserCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs">
      {/* 1. Top Section: Avatar + User Details + Edit Button */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5">
        {/* Avatar & Info */}
        <div className="flex items-start gap-4 sm:gap-5">
          {/* Avatar with Camera badge */}
          <div className="relative shrink-0">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-slate-100 shadow-sm bg-slate-100">
              <Image
                src={profile.avatarUrl}
                alt={profile.name}
                fill
                unoptimized
                className="object-cover object-top"
              />
            </div>
            {/* Camera badge to change avatar */}
            <button
              type="button"
              onClick={onChangeAvatar}
              aria-label="Thay đổi ảnh đại diện"
              className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-[#0A2239] hover:bg-[#071726] text-white shadow-md transition-transform hover:scale-110 active:scale-95"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* User Details */}
          <div className="space-y-1.5 min-w-0">
            {/* Name + Staya Club Badge */}
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                {profile.name}
              </h2>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-[#EEF4FF] text-[#2563EB] text-xs font-semibold">
                <Crown className="w-3.5 h-3.5 fill-current" />
                <span>{profile.membershipTier}</span>
              </span>
            </div>

            {/* Contact Row: Email + Phone */}
            <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-600 pt-0.5">
              <div className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{profile.email}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{profile.phone}</span>
              </div>
            </div>

            {/* Bio */}
            <p className="text-xs sm:text-[13px] text-slate-500 italic pt-1 max-w-xl leading-relaxed">
              {profile.bio}
            </p>
          </div>
        </div>

        {/* Edit Profile Action Button */}
        <div className="shrink-0 self-start sm:self-auto">
          <button
            type="button"
            onClick={onEditProfile}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 hover:border-slate-400 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-all active:scale-95"
          >
            <Edit3 className="w-3.5 h-3.5 text-slate-600" />
            <span>Chỉnh sửa hồ sơ</span>
          </button>
        </div>
      </div>

      {/* 2. Divider */}
      <div className="border-t border-slate-100 my-5" />

      {/* 3. Bottom Row: 4 Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
        {/* Stat 1: Chuyến đi */}
        <div className="flex items-center gap-3.5 pt-2 sm:pt-0 sm:px-3 first:px-0">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <CalendarDays className="w-5 h-5" />
          </div>
          <div>
            <div className="text-lg sm:text-xl font-bold text-slate-900 leading-tight">
              {profile.stats.trips}
            </div>
            <div className="text-xs text-slate-500 font-medium">Chuyến đi</div>
          </div>
        </div>

        {/* Stat 2: Địa điểm yêu thích */}
        <div className="flex items-center gap-3.5 pt-2 sm:pt-0 sm:px-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
            <Heart className="w-5 h-5 fill-rose-500/20" />
          </div>
          <div>
            <div className="text-lg sm:text-xl font-bold text-slate-900 leading-tight">
              {profile.stats.favorites}
            </div>
            <div className="text-xs text-slate-500 font-medium">Địa điểm yêu thích</div>
          </div>
        </div>

        {/* Stat 3: Đánh giá */}
        <div className="flex items-center gap-3.5 pt-2 sm:pt-0 sm:px-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
            <Star className="w-5 h-5 fill-amber-500/20" />
          </div>
          <div>
            <div className="text-lg sm:text-xl font-bold text-slate-900 leading-tight">
              {profile.stats.reviews}
            </div>
            <div className="text-xs text-slate-500 font-medium">Đánh giá</div>
          </div>
        </div>

        {/* Stat 4: Staya Club */}
        <div className="flex items-center gap-3.5 pt-2 sm:pt-0 sm:px-3 last:pr-0">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Crown className="w-5 h-5 fill-amber-500/20" />
          </div>
          <div>
            <div className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
              {profile.stats.tierName}
            </div>
            <div className="text-xs text-slate-500 font-medium">Staya Club</div>
          </div>
        </div>
      </div>
    </div>
  )
}
