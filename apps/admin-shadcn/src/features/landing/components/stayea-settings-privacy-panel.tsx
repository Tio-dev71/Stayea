"use client"

import * as React from "react"
import { ShieldCheck, Eye, Cookie, Download, Trash2 } from "lucide-react"

export interface StayeaSettingsPrivacyPanelProps {
  readonly onProfilePrivacy?: () => void
  readonly onManageCookies?: () => void
  readonly onDownloadData?: () => void
  readonly onDeleteAccount?: () => void
}

export const StayeaSettingsPrivacyPanel: React.FC<StayeaSettingsPrivacyPanelProps> = ({
  onProfilePrivacy,
  onManageCookies,
  onDownloadData,
  onDeleteAccount,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 space-y-4">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-[#1E40AF]" />
          <h2 className="text-base sm:text-lg font-black text-[#0A2239]">
            Quyền riêng tư & dữ liệu
          </h2>
        </div>
        <p className="text-[11px] text-slate-400 mt-0.5 ml-7">
          Kiểm soát thông tin cá nhân và dữ liệu của bạn
        </p>
      </div>

      {/* Rows */}
      <div className="space-y-4 divide-y divide-slate-100 pt-1">
        {/* Row 1: Quyền riêng tư hồ sơ */}
        <div className="pt-3 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <Eye className="w-4 h-4 text-slate-500 mt-1 shrink-0" />
            <div className="min-w-0">
              <span className="block text-xs font-bold text-slate-900">
                Quyền riêng tư hồ sơ
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                Kiểm soát ai có thể xem thông tin cá nhân của bạn
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onProfilePrivacy}
            className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold shadow-2xs transition-all active:scale-95 cursor-pointer shrink-0"
          >
            Cài đặt
          </button>
        </div>

        {/* Row 2: Quản lý cookie */}
        <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <Cookie className="w-4 h-4 text-slate-500 mt-1 shrink-0" />
            <div className="min-w-0">
              <span className="block text-xs font-bold text-slate-900">
                Quản lý cookie
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                Tùy chỉnh cookie và công nghệ theo dõi
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onManageCookies}
            className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold shadow-2xs transition-all active:scale-95 cursor-pointer shrink-0"
          >
            Quản lý
          </button>
        </div>

        {/* Row 3: Tải dữ liệu của tôi */}
        <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <Download className="w-4 h-4 text-slate-500 mt-1 shrink-0" />
            <div className="min-w-0">
              <span className="block text-xs font-bold text-slate-900">
                Tải dữ liệu của tôi
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                Tải bản sao dữ liệu cá nhân của bạn
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onDownloadData}
            className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold shadow-2xs transition-all active:scale-95 cursor-pointer shrink-0"
          >
            Tải xuống
          </button>
        </div>

        {/* Row 4: Xóa hoặc vô hiệu hóa tài khoản */}
        <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <Trash2 className="w-4 h-4 text-[#DC2626] mt-1 shrink-0" />
            <div className="min-w-0">
              <span className="block text-xs font-bold text-slate-900">
                Xóa hoặc vô hiệu hóa tài khoản
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                Tạm dừng hoặc xóa vĩnh viễn tài khoản
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onDeleteAccount}
            className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-1.5 rounded-xl bg-white hover:bg-red-50 text-[#DC2626] border border-red-200 text-xs font-semibold shadow-2xs transition-all active:scale-95 cursor-pointer shrink-0"
          >
            Xem tùy chọn
          </button>
        </div>
      </div>
    </div>
  )
}
