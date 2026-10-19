"use client"

import {
  Globe,
  BarChart3,
  Calendar,
  CreditCard,
  Camera,
  Users,
  ShieldCheck,
  FileText,
} from "lucide-react"
import type { HostBenefitItem } from "@/features/landing/data/stayea-mock-data"
import { HOST_BENEFITS } from "@/features/landing/data/stayea-mock-data"

function getBenefitIcon(iconName: string) {
  switch (iconName) {
    case "globe":
      return <Globe className="w-5 h-5 text-[#c69a58]" />
    case "barchart":
      return <BarChart3 className="w-5 h-5 text-[#c69a58]" />
    case "calendar":
      return <Calendar className="w-5 h-5 text-[#c69a58]" />
    case "creditcard":
      return <CreditCard className="w-5 h-5 text-[#c69a58]" />
    case "camera":
      return <Camera className="w-5 h-5 text-[#c69a58]" />
    case "users":
      return <Users className="w-5 h-5 text-[#c69a58]" />
    case "shieldcheck":
      return <ShieldCheck className="w-5 h-5 text-[#c69a58]" />
    case "filetext":
      return <FileText className="w-5 h-5 text-[#c69a58]" />
    default:
      return <Globe className="w-5 h-5 text-[#c69a58]" />
  }
}

export function HostBenefits() {
  return (
    <section id="host-benefits" className="py-14 sm:py-18 lg:py-20 bg-white">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-8 sm:pb-10 border-b border-slate-100">
          <div className="space-y-1.5">
            <span className="inline-block text-[11px] font-bold uppercase tracking-[0.22em] text-[#0c3b40]">
              VÌ NHỮNG CHỦ NHÀ TUYỆT VỜI TẠI PHÚ QUỐC
            </span>
            <h2 className="font-sans text-2xl sm:text-3xl lg:text-[34px] font-bold text-[#0c3b40] tracking-tight">
              Những quyền lợi dành cho chủ nhà STAYEA
            </h2>
          </div>

          <p className="text-xs sm:text-[13px] text-slate-500 leading-relaxed max-w-md lg:text-right">
            STAYEA cam kết đồng hành cùng chủ nhà trong suốt hành trình,
            <br className="hidden sm:inline" />
            {" "}mang đến giải pháp toàn diện để bạn vận hành dễ dàng, hiệu quả và bền vững.
          </p>
        </div>

        {/* 8-Card Grid (4 cols on lg, 2 on sm) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 pt-8">
          {HOST_BENEFITS.map((item: HostBenefitItem) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 hover:border-teal-200 hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#c69a58]/10 border border-[#c69a58]/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  {getBenefitIcon(item.iconName)}
                </div>

                <h3 className="font-sans text-sm sm:text-[14.5px] font-bold text-slate-900 leading-snug tracking-tight">
                  {item.title}
                </h3>

                <p className="text-xs sm:text-[12.5px] text-slate-500 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
