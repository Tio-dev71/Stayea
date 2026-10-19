"use client"

import * as React from "react"
import {
  Settings,
  Globe,
  CircleDollarSign,
  Clock,
  Moon,
  Sun,
  Laptop,
  ChevronDown,
} from "lucide-react"
import type { SettingsPreferences } from "@/features/landing/data/stayea-mock-data"

export interface StayeaSettingsPreferencesPanelProps {
  readonly preferences: SettingsPreferences
  readonly onLanguageChange?: (lang: string) => void
  readonly onCurrencyChange?: (curr: string) => void
  readonly onTimezoneChange?: (tz: string) => void
  readonly onThemeChange?: (theme: "light" | "dark" | "system") => void
}

export const StayeaSettingsPreferencesPanel: React.FC<
  StayeaSettingsPreferencesPanelProps
> = ({
  preferences,
  onLanguageChange,
  onCurrencyChange,
  onTimezoneChange,
  onThemeChange,
}) => {
  const [selectedLanguage, setSelectedLanguage] = React.useState(preferences.language)
  const [selectedCurrency, setSelectedCurrency] = React.useState(preferences.currency)
  const [selectedTimezone, setSelectedTimezone] = React.useState(preferences.timezone)
  const [selectedTheme, setSelectedTheme] = React.useState<"light" | "dark" | "system">(
    preferences.theme
  )

  function handleTheme(theme: "light" | "dark" | "system") {
    setSelectedTheme(theme)
    onThemeChange?.(theme)
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 space-y-4">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <Settings className="w-5 h-5 text-[#1E40AF]" />
          <h2 className="text-base sm:text-lg font-black text-[#0A2239]">
            Tùy chọn hiển thị
          </h2>
        </div>
        <p className="text-[11px] text-slate-400 mt-0.5 ml-7">
          Cá nhân hóa trải nghiệm sử dụng STAYEA
        </p>
      </div>

      {/* Controls List */}
      <div className="space-y-4 pt-1">
        {/* Row 1: Ngôn ngữ */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-3">
            <Globe className="w-4 h-4 text-slate-500 shrink-0" />
            <span className="text-xs font-bold text-slate-900">Ngôn ngữ</span>
          </div>

          <div className="relative w-full sm:w-60">
            <select
              value={selectedLanguage}
              onChange={(e) => {
                setSelectedLanguage(e.target.value)
                onLanguageChange?.(e.target.value)
              }}
              className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-3 py-2 pr-8 text-xs font-medium text-slate-800 shadow-2xs cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="Tiếng Việt">Tiếng Việt</option>
              <option value="English">English (US)</option>
              <option value="한국어">한국어 (Korean)</option>
              <option value="日本語">日本語 (Japanese)</option>
              <option value="中文">中文 (Chinese)</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Row 2: Tiền tệ hiển thị */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-1">
          <div className="flex items-center gap-3">
            <CircleDollarSign className="w-4 h-4 text-slate-500 shrink-0" />
            <span className="text-xs font-bold text-slate-900">Tiền tệ hiển thị</span>
          </div>

          <div className="relative w-full sm:w-60">
            <select
              value={selectedCurrency}
              onChange={(e) => {
                setSelectedCurrency(e.target.value)
                onCurrencyChange?.(e.target.value)
              }}
              className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-3 py-2 pr-8 text-xs font-medium text-slate-800 shadow-2xs cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="VND - Việt Nam Đồng (đ)">VND - Việt Nam Đồng (đ)</option>
              <option value="USD - US Dollar ($)">USD - US Dollar ($)</option>
              <option value="EUR - Euro (€)">EUR - Euro (€)</option>
              <option value="KRW - Korean Won (₩)">KRW - Korean Won (₩)</option>
              <option value="JPY - Japanese Yen (¥)">JPY - Japanese Yen (¥)</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Row 3: Múi giờ */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-1">
          <div className="flex items-center gap-3">
            <Clock className="w-4 h-4 text-slate-500 shrink-0" />
            <span className="text-xs font-bold text-slate-900">Múi giờ</span>
          </div>

          <div className="relative w-full sm:w-60">
            <select
              value={selectedTimezone}
              onChange={(e) => {
                setSelectedTimezone(e.target.value)
                onTimezoneChange?.(e.target.value)
              }}
              className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-3 py-2 pr-8 text-xs font-medium text-slate-800 shadow-2xs cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500 truncate"
            >
              <option value="(GMT+7) Bangkok, Hà Nội, Hồ Chí Minh">
                (GMT+7) Bangkok, Hà Nội, Hồ Chí Minh
              </option>
              <option value="(GMT+8) Singapore, Hong Kong">
                (GMT+8) Singapore, Hong Kong
              </option>
              <option value="(GMT+9) Tokyo, Seoul">
                (GMT+9) Tokyo, Seoul
              </option>
              <option value="(GMT+0) London, GMT">
                (GMT+0) London, GMT
              </option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Row 4: Chế độ giao diện */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-2">
          <div className="flex items-center gap-3">
            <Moon className="w-4 h-4 text-slate-500 shrink-0" />
            <span className="text-xs font-bold text-slate-900">Chế độ giao diện</span>
          </div>

          {/* Segmented Control */}
          <div className="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200/80 gap-1">
            {/* Sáng */}
            <button
              type="button"
              onClick={() => handleTheme("light")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedTheme === "light"
                  ? "bg-[#1E40AF] text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Sun className="w-3.5 h-3.5 fill-current" />
              <span>Sáng</span>
            </button>

            {/* Tối */}
            <button
              type="button"
              onClick={() => handleTheme("dark")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedTheme === "dark"
                  ? "bg-[#1E40AF] text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              <span>Tối</span>
            </button>

            {/* Theo hệ thống */}
            <button
              type="button"
              onClick={() => handleTheme("system")}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedTheme === "system"
                  ? "bg-[#1E40AF] text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Laptop className="w-3.5 h-3.5" />
              <span>Theo hệ thống</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
