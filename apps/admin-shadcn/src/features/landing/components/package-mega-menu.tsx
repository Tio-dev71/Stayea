"use client"

import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  Heart,
  Users,
  Briefcase,
  Laptop,
  Sparkles,
} from "lucide-react"

interface PackageMegaMenuProps {
  readonly onClose: () => void
}

const PACKAGE_STYLES = [
  {
    id: "couple",
    title: "Couple & Lãng mạn",
    desc: "Kỳ nghỉ ngọt ngào cho 2 người",
    icon: Heart,
    color: "text-amber-500",
  },
  {
    id: "family",
    title: "Family - Gia đình",
    desc: "Hoạt động kết nối mọi thế hệ",
    icon: Users,
    color: "text-blue-600",
  },
  {
    id: "friends",
    title: "Friends - Nhóm bạn",
    desc: "Khám phá, cắm trại & lặn biển",
    icon: Users,
    color: "text-emerald-600",
  },
  {
    id: "long-stay",
    title: "Long Stay - Nghỉ dưỡng",
    desc: "Sống chậm tận hưởng thiên đường",
    icon: Briefcase,
    color: "text-teal-600",
  },
  {
    id: "workation",
    title: "Workation - Làm việc từ xa",
    desc: "Cân bằng công việc & tái tạo năng lượng",
    icon: Laptop,
    color: "text-purple-600",
  },
]

export function PackageMegaMenu({ onClose }: PackageMegaMenuProps) {
  return (
    <div
      onMouseLeave={onClose}
      className="w-full bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden"
    >
      <div className="p-6 lg:p-8 grid grid-cols-12 gap-8">
        {/* Col 1: Categories / Styles (Span 4) */}
        <div className="col-span-12 lg:col-span-4 space-y-4 border-r border-slate-100 pr-0 lg:pr-6">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Phong cách hành trình
            </h4>
            <Link
              href="#packages"
              onClick={onClose}
              className="text-xs font-semibold text-[#0c3b40] hover:text-[#072528] flex items-center gap-1 group"
            >
              <span>Xem tất cả</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="space-y-1.5">
            {PACKAGE_STYLES.map((style) => {
              const Icon = style.icon
              return (
                <Link
                  key={style.id}
                  href={`#packages?audience=${style.id}`}
                  onClick={onClose}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
                >
                  <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 group-hover:bg-[#0c3b40]/10 transition-colors">
                    <Icon className={`w-4 h-4 ${style.color}`} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800 group-hover:text-[#0c3b40] transition-colors">
                      {style.title}
                    </div>
                    <div className="text-[11px] text-slate-500">{style.desc}</div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Col 2: Featured Packages (Span 5) */}
        <div className="col-span-12 lg:col-span-5 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Gói nổi bật được yêu thích
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Card 1 */}
            <Link
              href="#packages"
              onClick={onClose}
              className="group block rounded-xl overflow-hidden border border-slate-100 hover:shadow-md transition-all"
            >
              <div className="relative h-28 w-full">
                <Image
                  src="/packages/tour-3-dao.jpg"
                  alt="Tour 3 Đảo Phú Quốc"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white">
                  Bán chạy
                </span>
              </div>
              <div className="p-2.5 bg-white">
                <div className="text-xs font-bold text-slate-800 group-hover:text-[#0c3b40] truncate">
                  Tour 3 Đảo Phú Quốc
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                  <span>1 ngày</span>
                  <span className="font-bold text-[#0c3b40]">850.000đ</span>
                </div>
              </div>
            </Link>

            {/* Card 2 */}
            <Link
              href="#packages"
              onClick={onClose}
              className="group block rounded-xl overflow-hidden border border-slate-100 hover:shadow-md transition-all"
            >
              <div className="relative h-28 w-full">
                <Image
                  src="/packages/sunset-cruise.jpg"
                  alt="Sunset Cruise ngắm hoàng hôn"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-600 text-white">
                  Được yêu thích
                </span>
              </div>
              <div className="p-2.5 bg-white">
                <div className="text-xs font-bold text-slate-800 group-hover:text-[#0c3b40] truncate">
                  Sunset Cruise ngắm hoàng hôn
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                  <span>3 giờ</span>
                  <span className="font-bold text-[#0c3b40]">1.290.000đ</span>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Col 3: Banner Custom Trip (Span 3) */}
        <div className="col-span-12 lg:col-span-3">
          <div className="h-full rounded-2xl bg-gradient-to-br from-[#0c3b40] to-[#072528] text-white p-5 flex flex-col justify-between relative overflow-hidden">
            <div className="space-y-2 relative z-10">
              <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-wider uppercase text-teal-300">
                <Sparkles className="w-3 h-3" />
                Hành trình may đo
              </span>
              <h5 className="font-sans text-sm font-bold text-white">
                Thiết kế chuyến đi riêng theo ngân sách
              </h5>
              <p className="text-[11px] text-white/80 leading-relaxed">
                Đội ngũ Stayea sắp xếp trọn gói biệt thự, xe đưa đón và tour riêng theo mong muốn của bạn.
              </p>
            </div>

            <div className="pt-4 relative z-10">
              <Link
                href="#packages"
                onClick={onClose}
                className="inline-flex items-center justify-center w-full px-4 py-2 rounded-xl bg-white text-[#0c3b40] hover:bg-slate-100 text-xs font-bold transition-colors"
              >
                <span>Khám phá ngay</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>

            {/* Decorative background shape */}
            <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-teal-400/10 blur-xl pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  )
}
