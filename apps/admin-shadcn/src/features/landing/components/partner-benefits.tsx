"use client"

import {
  Users,
  Star,
  FileText,
  TrendingUp,
  Settings,
  PieChart,
  Heart,
  Share2,
  ArrowRight,
} from "lucide-react"
import type { PartnerBenefitItem } from "@/features/landing/data/stayea-mock-data"
import { PARTNER_BENEFITS } from "@/features/landing/data/stayea-mock-data"

function getBenefitIcon(iconName: string) {
  switch (iconName) {
    case "users":
      return <Users className="w-5 h-5 text-[#c69a58]" />
    case "star":
      return <Star className="w-5 h-5 text-[#c69a58]" />
    case "filetext":
      return <FileText className="w-5 h-5 text-[#c69a58]" />
    case "trendingup":
      return <TrendingUp className="w-5 h-5 text-[#c69a58]" />
    case "settings":
      return <Settings className="w-5 h-5 text-[#c69a58]" />
    case "piechart":
      return <PieChart className="w-5 h-5 text-[#c69a58]" />
    case "heart":
      return <Heart className="w-5 h-5 text-[#c69a58]" />
    case "network":
      return <Share2 className="w-5 h-5 text-[#c69a58]" />
    default:
      return <Star className="w-5 h-5 text-[#c69a58]" />
  }
}

export function PartnerBenefits() {
  return (
    <section id="partner-benefits" className="py-12 sm:py-16 bg-[#f8fafb]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-slate-200/80">
          <h2 className="font-sans text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Những quyền lợi dành cho đối tác STAYEA
          </h2>

          <a
            href="#partner-register-form"
            className="text-xs sm:text-[13px] font-semibold text-[#0c3b40] hover:text-[#082b30] inline-flex items-center gap-1.5 group self-start sm:self-auto transition-colors"
          >
            <span>Cùng nhau kiến tạo giá trị bền vững</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>

        {/* 8-Card Grid (4 x 2 on desktop) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 pt-6">
          {PARTNER_BENEFITS.map((item: PartnerBenefitItem) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 space-y-3 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div className="w-10 h-10 rounded-xl bg-[#c69a58]/10 border border-[#c69a58]/20 flex items-center justify-center shrink-0">
                {getBenefitIcon(item.iconName)}
              </div>

              <div className="space-y-1.5 flex-grow">
                <h3 className="font-sans text-sm sm:text-[14.5px] font-bold text-slate-900 leading-snug">
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
