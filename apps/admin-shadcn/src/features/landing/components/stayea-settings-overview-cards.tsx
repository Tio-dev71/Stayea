"use client"

import * as React from "react"
import { Shield, Bell, Globe, Lock } from "lucide-react"

export interface StayeaSettingsOverviewCardsProps {
  readonly onCardClick?: (sectionId: string) => void
}

export const StayeaSettingsOverviewCards: React.FC<StayeaSettingsOverviewCardsProps> = ({
  onCardClick,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {/* 1. Bảo mật tài khoản */}
      <button
        type="button"
        onClick={() => onCardClick?.("security")}
        className="flex items-center gap-3.5 p-4 rounded-2xl bg-[#F0F7FF] border border-[#D0E2FF] hover:border-blue-400 text-left transition-all shadow-2xs group cursor-pointer"
      >
        <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center shrink-0 shadow-2xs border border-blue-100 group-hover:scale-105 transition-transform">
          <Shield className="w-5 h-5 text-[#1E40AF]" />
        </div>
        <div className="min-w-0">
          <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
            Bảo mật tài khoản
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5 leading-snug truncate">
            Giữ tài khoản của bạn luôn an toàn
          </p>
        </div>
      </button>

      {/* 2. Thông báo */}
      <button
        type="button"
        onClick={() => onCardClick?.("notifications")}
        className="flex items-center gap-3.5 p-4 rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] hover:border-amber-400 text-left transition-all shadow-2xs group cursor-pointer"
      >
        <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center shrink-0 shadow-2xs border border-amber-100 group-hover:scale-105 transition-transform">
          <Bell className="w-5 h-5 text-[#D97706]" />
        </div>
        <div className="min-w-0">
          <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
            Thông báo
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5 leading-snug truncate">
            Nhận thông tin quan trọng và ưu đãi mới nhất
          </p>
        </div>
      </button>

      {/* 3. Ngôn ngữ & tiền tệ */}
      <button
        type="button"
        onClick={() => onCardClick?.("preferences")}
        className="flex items-center gap-3.5 p-4 rounded-2xl bg-[#FAF5FF] border border-[#E9D5FF] hover:border-purple-400 text-left transition-all shadow-2xs group cursor-pointer"
      >
        <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center shrink-0 shadow-2xs border border-purple-100 group-hover:scale-105 transition-transform">
          <Globe className="w-5 h-5 text-[#9333EA]" />
        </div>
        <div className="min-w-0">
          <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
            Ngôn ngữ & tiền tệ
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5 leading-snug truncate">
            Tùy chỉnh ngôn ngữ, đơn vị tiền tệ và múi giờ
          </p>
        </div>
      </button>

      {/* 4. Quyền riêng tư */}
      <button
        type="button"
        onClick={() => onCardClick?.("privacy")}
        className="flex items-center gap-3.5 p-4 rounded-2xl bg-[#F0FDF4] border border-[#BBF7D0] hover:border-emerald-400 text-left transition-all shadow-2xs group cursor-pointer"
      >
        <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center shrink-0 shadow-2xs border border-emerald-100 group-hover:scale-105 transition-transform">
          <Lock className="w-5 h-5 text-[#059669]" />
        </div>
        <div className="min-w-0">
          <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
            Quyền riêng tư
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5 leading-snug truncate">
            Kiểm soát dữ liệu và quyền riêng tư cá nhân
          </p>
        </div>
      </button>
    </div>
  )
}
