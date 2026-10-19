"use client"

import { Globe, ChevronDown, Palmtree } from "lucide-react"

export function StayeaAdminFooter() {
  return (
    <footer className="mt-8 pt-6 pb-8 border-t border-slate-200/80 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-medium">
      {/* Left: Copyright */}
      <div className="flex items-center gap-2">
        <span>&copy; 2025 Stayea.com. Tất cả quyền được bảo lưu.</span>
      </div>

      {/* Middle/Right: Terms, Policy, Help & Language Selector */}
      <div className="flex flex-wrap items-center gap-4 sm:gap-6">
        <a
          href="#terms"
          className="hover:text-emerald-700 transition-colors"
        >
          Điều khoản
        </a>
        <a
          href="#privacy"
          className="hover:text-emerald-700 transition-colors"
        >
          Chính sách bảo mật
        </a>
        <a
          href="#help"
          className="hover:text-emerald-700 transition-colors"
        >
          Hỗ trợ
        </a>

        {/* Language selector */}
        <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200 text-slate-700 cursor-pointer hover:text-emerald-800 transition-colors">
          <Globe className="w-3.5 h-3.5 text-slate-400" />
          <span>Tiếng Việt</span>
          <ChevronDown className="w-3 h-3 text-slate-400" />
        </div>
      </div>

      {/* Far Right: Phú Quốc Artistic Tagline */}
      <div className="flex items-center gap-2 text-slate-500 italic select-none">
        <div className="flex flex-col text-right leading-tight">
          <span className="font-serif text-sm font-bold text-slate-700 not-italic flex items-center justify-end gap-1">
            <span>Phú Quốc</span>
            <Palmtree className="w-3.5 h-3.5 text-emerald-600" />
          </span>
          <span className="text-[10px] tracking-wide text-slate-400">
            Always a good idea
          </span>
        </div>
      </div>
    </footer>
  )
}
