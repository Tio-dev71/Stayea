"use client"

import * as React from "react"
import { Shield, Mail, Phone, Lock, ShieldCheck, Monitor, Check } from "lucide-react"
import type { SettingsAccountSecurity } from "@/features/landing/data/stayea-mock-data"

export interface StayeaSettingsSecurityPanelProps {
  readonly security: SettingsAccountSecurity
  readonly onEditEmail?: () => void
  readonly onUpdatePhone?: () => void
  readonly onChangePassword?: () => void
  readonly onToggle2FA?: () => void
  readonly onManageDevices?: () => void
}

export const StayeaSettingsSecurityPanel: React.FC<StayeaSettingsSecurityPanelProps> = ({
  security,
  onEditEmail,
  onUpdatePhone,
  onChangePassword,
  onToggle2FA,
  onManageDevices,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 space-y-5">
      {/* Panel Header */}
      <div className="flex items-center gap-2.5 pb-2">
        <Shield className="w-5 h-5 text-[#1E40AF]" />
        <h2 className="text-base sm:text-lg font-black text-[#0A2239]">
          Tài khoản & bảo mật
        </h2>
      </div>

      <div className="space-y-4 divide-y divide-slate-100">
        {/* Row 1: Email đăng nhập */}
        <div className="pt-3 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <Mail className="w-4 h-4 text-slate-500 mt-1 shrink-0" />
            <div className="min-w-0">
              <span className="block text-xs font-bold text-slate-900">
                Email đăng nhập
              </span>
              <span className="block text-xs text-slate-600 truncate mt-0.5">
                {security.email}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onEditEmail}
            className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold shadow-2xs transition-all active:scale-95 cursor-pointer shrink-0"
          >
            Chỉnh sửa
          </button>
        </div>

        {/* Row 2: Số điện thoại */}
        <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <Phone className="w-4 h-4 text-slate-500 mt-1 shrink-0" />
            <div className="min-w-0">
              <span className="block text-xs font-bold text-slate-900">
                Số điện thoại
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-slate-700 font-medium">
                  {security.phone}
                </span>
                {security.isPhoneVerified && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#D1FAE5] text-[#047857]">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                    <span>Đã xác thực</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onUpdatePhone}
            className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold shadow-2xs transition-all active:scale-95 cursor-pointer shrink-0"
          >
            Cập nhật
          </button>
        </div>

        {/* Row 3: Đổi mật khẩu */}
        <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <Lock className="w-4 h-4 text-slate-500 mt-1 shrink-0" />
            <div className="min-w-0">
              <span className="block text-xs font-bold text-slate-900">
                Đổi mật khẩu
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                Cập nhật mật khẩu để tăng cường bảo mật tài khoản
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onChangePassword}
            className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold shadow-2xs transition-all active:scale-95 cursor-pointer shrink-0"
          >
            Đổi mật khẩu
          </button>
        </div>

        {/* Row 4: Xác thực 2 bước (2FA) */}
        <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <ShieldCheck className="w-4 h-4 text-slate-500 mt-1 shrink-0" />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900">
                  Xác thực 2 bước (2FA)
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                  <span>{security.is2FAEnabled ? "Đang bật" : "Đang tắt"}</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                Tăng cường bảo mật cho tài khoản của bạn
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onToggle2FA}
            className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold shadow-2xs transition-all active:scale-95 cursor-pointer shrink-0"
          >
            {security.is2FAEnabled ? "Tắt" : "Bật ngay"}
          </button>
        </div>

        {/* Row 5: Thiết bị đã đăng nhập */}
        <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <Monitor className="w-4 h-4 text-slate-500 mt-1 shrink-0" />
            <div className="min-w-0">
              <span className="block text-xs font-bold text-slate-900">
                Thiết bị đã đăng nhập
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                Quản lý các thiết bị đang truy cập tài khoản
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onManageDevices}
            className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold shadow-2xs transition-all active:scale-95 cursor-pointer shrink-0"
          >
            Quản lý
          </button>
        </div>
      </div>
    </div>
  )
}
