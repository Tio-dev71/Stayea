"use client"

import { useState } from "react"
import Image from "next/image"
import { Crown, Home, Handshake, Check, ArrowRight } from "lucide-react"

interface AboutConversionProps {
  readonly onNavigate?: (item: string) => void
}

export function AboutConversion({ onNavigate }: AboutConversionProps = {}) {
  const [clubForm, setClubForm] = useState({ name: "", email: "" })
  const [partnerForm, setPartnerForm] = useState({ business: "", email: "" })

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-[#f8fafb]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Card 1: STAYEA CLUB */}
          <div className="relative bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col justify-between group hover:shadow-md transition-all">
            {/* Background Image (Right side) */}
            <div className="absolute right-0 top-0 bottom-0 w-1/2 pointer-events-none overflow-hidden">
              <Image
                src="/about/conversion-club.jpg"
                alt="Stayea Club"
                fill
                unoptimized
                className="object-cover object-center opacity-40 group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 1024px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent" />
            </div>

            {/* Card Content */}
            <div className="relative z-10 p-6 sm:p-7 space-y-4">
              {/* Header */}
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-600 shrink-0">
                  <Crown className="w-5 h-5 fill-amber-500/20" />
                </div>
                <div className="space-y-0.5">
                  <h3 className="font-sans text-base font-bold text-slate-900 tracking-tight">
                    STAYEA CLUB
                  </h3>
                  <p className="text-[11.5px] text-slate-500 leading-snug">
                    Nhiều đặc quyền hơn cho những hành trình ý nghĩa hơn
                  </p>
                </div>
              </div>

              {/* Bullets */}
              <div className="space-y-2 pt-1">
                {[
                  "Ưu đãi riêng cho thành viên",
                  "Tích điểm đổi quà hấp dẫn",
                  "Đặc quyền trải nghiệm độc đáo",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-[#0c3b40]/10 flex items-center justify-center text-[#0c3b40] shrink-0">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span className="text-xs text-slate-700 font-medium">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Inline Action Form */}
            <div className="relative z-10 p-4 sm:p-5 bg-white/95 border-t border-slate-100 mt-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  alert("Cảm ơn bạn đã đăng ký Stayea Club!")
                }}
                className="flex flex-col sm:flex-row gap-2"
              >
                <input
                  type="text"
                  placeholder="Họ và tên"
                  value={clubForm.name}
                  onChange={(e) => setClubForm({ ...clubForm, name: e.target.value })}
                  className="h-9 px-3 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1.5 focus:ring-[#0c3b40] w-full"
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={clubForm.email}
                  onChange={(e) => setClubForm({ ...clubForm, email: e.target.value })}
                  className="h-9 px-3 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1.5 focus:ring-[#0c3b40] w-full"
                  required
                />
                <button
                  type="submit"
                  className="h-9 px-4 rounded-xl bg-[#0c3b40] hover:bg-[#082b30] text-white text-xs font-semibold whitespace-nowrap inline-flex items-center justify-center gap-1.5 transition-colors shrink-0 shadow-2xs group"
                >
                  <span>Tham gia ngay</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </form>
            </div>
          </div>

          {/* Card 2: TRỞ THÀNH CHỦ NHÀ */}
          <div className="relative bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col justify-between group hover:shadow-md transition-all">
            {/* Background Image (Right side) */}
            <div className="absolute right-0 top-0 bottom-0 w-1/2 pointer-events-none overflow-hidden">
              <Image
                src="/about/conversion-host.jpg"
                alt="Trở thành chủ nhà Stayea"
                fill
                unoptimized
                className="object-cover object-center opacity-40 group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 1024px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent" />
            </div>

            {/* Card Content */}
            <div className="relative z-10 p-6 sm:p-7 space-y-4">
              {/* Header */}
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-emerald-700 shrink-0">
                  <Home className="w-5 h-5 fill-emerald-600/15" />
                </div>
                <div className="space-y-0.5">
                  <h3 className="font-sans text-base font-bold text-slate-900 tracking-tight">
                    TRỞ THÀNH CHỦ NHÀ
                  </h3>
                  <p className="text-[11.5px] text-slate-500 leading-snug">
                    Cùng phát triển du lịch Phú Quốc bền vững
                  </p>
                </div>
              </div>

              {/* Bullets */}
              <div className="space-y-2 pt-1">
                {[
                  "Tiếp cận khách hàng chất lượng",
                  "Hỗ trợ vận hành chuyên nghiệp",
                  "Tăng công suất đặt phòng",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-[#0c3b40]/10 flex items-center justify-center text-[#0c3b40] shrink-0">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span className="text-xs text-slate-700 font-medium">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Button: Đăng ký chủ nhà */}
            <div className="relative z-10 p-4 sm:p-5 bg-white/95 border-t border-slate-100 mt-4 flex items-center justify-end">
              <button
                type="button"
                onClick={() => onNavigate?.("Trở thành chủ nhà")}
                className="w-full sm:w-auto h-9 px-5 rounded-xl bg-[#0c3b40] hover:bg-[#082b30] text-white text-xs font-semibold whitespace-nowrap inline-flex items-center justify-center gap-1.5 transition-colors shrink-0 shadow-2xs group"
              >
                <span>Đăng ký chủ nhà</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>

          {/* Card 3: HỢP TÁC CÙNG STAYEA */}
          <div className="relative bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col justify-between group hover:shadow-md transition-all">
            {/* Background Image (Right side) */}
            <div className="absolute right-0 top-0 bottom-0 w-1/2 pointer-events-none overflow-hidden">
              <Image
                src="/about/conversion-partner.jpg"
                alt="Hợp tác cùng Stayea"
                fill
                unoptimized
                className="object-cover object-center opacity-40 group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 1024px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent" />
            </div>

            {/* Card Content */}
            <div className="relative z-10 p-6 sm:p-7 space-y-4">
              {/* Header */}
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-orange-50 border border-orange-200/60 flex items-center justify-center text-orange-600 shrink-0">
                  <Handshake className="w-5 h-5" />
                </div>
                <div className="space-y-0.5">
                  <h3 className="font-sans text-base font-bold text-slate-900 tracking-tight">
                    HỢP TÁC CÙNG STAYEA
                  </h3>
                  <p className="text-[11.5px] text-slate-500 leading-snug">
                    Kiến tạo giá trị chung, lan tỏa vẻ đẹp Phú Quốc
                  </p>
                </div>
              </div>

              {/* Bullets */}
              <div className="space-y-2 pt-1">
                {[
                  "Hợp tác dịch vụ đa dạng",
                  "Phát triển điểm đến bền vững",
                  "Chiến dịch truyền thông hiệu quả",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-[#0c3b40]/10 flex items-center justify-center text-[#0c3b40] shrink-0">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span className="text-xs text-slate-700 font-medium">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Inline Action Form */}
            <div className="relative z-10 p-4 sm:p-5 bg-white/95 border-t border-slate-100 mt-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  alert("Cảm ơn đối tác đã gửi thông tin liên hệ!")
                }}
                className="flex flex-col sm:flex-row gap-2"
              >
                <input
                  type="text"
                  placeholder="Doanh nghiệp"
                  value={partnerForm.business}
                  onChange={(e) => setPartnerForm({ ...partnerForm, business: e.target.value })}
                  className="h-9 px-3 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1.5 focus:ring-[#0c3b40] w-full"
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={partnerForm.email}
                  onChange={(e) => setPartnerForm({ ...partnerForm, email: e.target.value })}
                  className="h-9 px-3 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1.5 focus:ring-[#0c3b40] w-full"
                  required
                />
                <button
                  type="submit"
                  className="h-9 px-4 rounded-xl bg-[#0c3b40] hover:bg-[#082b30] text-white text-xs font-semibold whitespace-nowrap inline-flex items-center justify-center gap-1.5 transition-colors shrink-0 shadow-2xs group"
                >
                  <span>Liên hệ hợp tác</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
