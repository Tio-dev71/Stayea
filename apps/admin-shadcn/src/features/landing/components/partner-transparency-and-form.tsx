"use client"

import * as React from "react"
import Image from "next/image"
import {
  FileCheck,
  Calendar,
  Coins,
  Handshake,
  Star,
  Heart,
  Plus,
  Minus,
  ArrowRight,
  Lock,
  CheckCircle2,
} from "lucide-react"
import type {
  PartnerTransparencyItem,
  PartnerFaqItem,
} from "@/features/landing/data/stayea-mock-data"
import {
  PARTNER_TRANSPARENCY_ITEMS,
  PARTNER_FAQS,
} from "@/features/landing/data/stayea-mock-data"

function getTransparencyIcon(iconName: string) {
  switch (iconName) {
    case "filecheck":
      return <FileCheck className="w-4 h-4 text-[#c69a58]" />
    case "calendar":
      return <Calendar className="w-4 h-4 text-[#c69a58]" />
    case "coins":
      return <Coins className="w-4 h-4 text-[#c69a58]" />
    case "handshake":
      return <Handshake className="w-4 h-4 text-[#c69a58]" />
    case "star":
      return <Star className="w-4 h-4 text-[#c69a58]" />
    case "heart":
      return <Heart className="w-4 h-4 text-[#c69a58]" />
    default:
      return <FileCheck className="w-4 h-4 text-[#c69a58]" />
  }
}

export function PartnerTransparencyAndForm() {
  const [openFaqId, setOpenFaqId] = React.useState<string | null>(null)

  const [formState, setFormState] = React.useState({
    businessName: "",
    contactPerson: "",
    email: "",
    phone: "",
    field: "",
    operatingArea: "",
    website: "",
    notes: "",
    agreed: true,
  })

  const [submitted, setSubmitted] = React.useState(false)

  function toggleFaq(id: string) {
    setOpenFaqId(openFaqId === id ? null : id)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!formState.agreed) {
      alert("Vui lòng đồng ý với Điều khoản hợp tác và Chính sách bảo mật của STAYEA.")
      return
    }
    setSubmitted(true)
  }

  return (
    <section className="py-12 sm:py-16 bg-white border-t border-slate-200/60">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* ========================================================= */}
          {/* LEFT COLUMN: Transparency + FAQ (~58% width on desktop)   */}
          {/* ========================================================= */}
          <div className="lg:col-span-7 space-y-10 sm:space-y-12">
            {/* Subsection 1: Hợp tác minh bạch – cùng tạo giá trị dài hạn */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
                {/* Coastal Island Image Card with text overlay */}
                <div className="md:col-span-7 relative rounded-2xl overflow-hidden shadow-sm group min-h-[260px] sm:min-h-[290px] flex flex-col justify-between p-5 sm:p-6 text-white">
                  {/* Background Image */}
                  <div className="absolute inset-0 z-0 pointer-events-none">
                    <Image
                      src="/partner/phu-quoc-aerial.jpg"
                      alt="Hợp tác minh bạch – cùng tạo giá trị dài hạn"
                      fill
                      unoptimized
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                      sizes="(max-width: 768px) 100vw, 35vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#0c2e32]/90 via-[#0c2e32]/40 to-black/30" />
                  </div>

                  {/* Header text on top */}
                  <div className="relative z-10 space-y-2">
                    <h3 className="font-sans text-base sm:text-lg font-bold text-white leading-snug drop-shadow-sm">
                      Hợp tác minh bạch –
                      <br />
                      cùng tạo giá trị dài hạn
                    </h3>
                    <p className="text-[11.5px] sm:text-xs text-white/90 leading-relaxed drop-shadow-xs max-w-sm font-normal">
                      STAYEA tin rằng những mối quan hệ bền vững được xây dựng trên sự minh bạch, tôn trọng và cùng hướng đến giá trị tốt đẹp hơn cho du khách, cộng đồng và điểm đến Phú Quốc.
                    </p>
                  </div>

                  {/* Script callout on ocean bottom right */}
                  <div className="relative z-10 text-right pt-4 self-end">
                    <div className="font-script-vi text-2xl sm:text-3xl text-[#e8c783] drop-shadow -rotate-[3deg]">
                      Better Together
                    </div>
                    <div className="text-[8px] uppercase tracking-[0.24em] font-bold text-white/80 drop-shadow">
                      FOR A BRIGHTER PHU QUOC
                    </div>
                  </div>
                </div>

                {/* Right Checklist (6 items) */}
                <div className="md:col-span-5 flex flex-col justify-between space-y-2.5">
                  {PARTNER_TRANSPARENCY_ITEMS.map((item: PartnerTransparencyItem) => (
                    <div
                      key={item.id}
                      className="bg-[#f8fafb] rounded-xl border border-slate-200/70 p-2.5 sm:p-3 hover:bg-white hover:border-slate-300 transition-all flex items-start gap-2.5 shadow-2xs"
                    >
                      <div className="w-6 h-6 rounded-lg bg-[#c69a58]/10 flex items-center justify-center shrink-0 mt-0.5">
                        {getTransparencyIcon(item.iconName)}
                      </div>
                      <div className="space-y-0.5 min-w-0">
                        <h4 className="font-sans text-[11.5px] sm:text-xs font-bold text-slate-800 leading-snug">
                          {item.title}
                        </h4>
                        <p className="text-[10px] sm:text-[10.5px] text-slate-500 leading-tight">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Subsection 2: Câu hỏi thường gặp (FAQ) */}
            <div className="space-y-4 pt-2 border-t border-slate-200/60">
              {/* Header */}
              <div className="flex items-center justify-between pb-1">
                <h3 className="font-sans text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                  Câu hỏi thường gặp
                </h3>
                <a
                  href="#partner-register-form"
                  className="text-xs font-semibold text-[#0c3b40] hover:text-[#082b30] inline-flex items-center gap-1 group transition-colors"
                >
                  <span>Xem tất cả</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </a>
              </div>

              {/* Accordion FAQ Items */}
              <div className="space-y-2.5">
                {PARTNER_FAQS.map((item: PartnerFaqItem) => {
                  const isOpen = openFaqId === item.id
                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleFaq(item.id)}
                      className={`rounded-xl border transition-all cursor-pointer p-4 bg-white ${
                        isOpen
                          ? "border-[#0c3b40]/40 shadow-xs ring-1 ring-[#0c3b40]/10"
                          : "border-slate-200/80 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-sans text-xs sm:text-[13px] font-semibold text-slate-800 leading-snug">
                          {item.question}
                        </span>
                        <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                          {isOpen ? (
                            <Minus className="w-3.5 h-3.5" />
                          ) : (
                            <Plus className="w-3.5 h-3.5" />
                          )}
                        </div>
                      </div>

                      {isOpen && (
                        <p className="text-xs text-slate-600 leading-relaxed pt-3 mt-2.5 border-t border-slate-100 animate-in fade-in-50">
                          {item.answer}
                        </p>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* RIGHT COLUMN: Dark Registration Form Card (~42% width)    */}
          {/* ========================================================= */}
          <div
            id="partner-register-form"
            className="lg:col-span-5 scroll-mt-24 w-full"
          >
            <div className="bg-[#0c3036] text-white rounded-3xl border border-teal-900/60 shadow-xl overflow-hidden sticky top-24 p-6 sm:p-7 space-y-5">
              {/* Card Header */}
              <div className="space-y-1.5 border-b border-teal-800/60 pb-4">
                <h3 className="font-sans text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
                  Đăng ký hợp tác cùng STAYEA
                </h3>
                <p className="text-xs sm:text-[12.5px] text-teal-100/80 leading-relaxed">
                  Hãy để đội ngũ STAYEA liên hệ và cùng bạn xây dựng hình thức hợp tác phù hợp.
                </p>
              </div>

              {submitted ? (
                /* Success Notification */
                <div className="py-10 text-center space-y-3 bg-teal-950/40 rounded-2xl p-6 border border-teal-700/50">
                  <div className="w-12 h-12 rounded-full bg-[#d4a359]/20 text-[#e8c783] flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h4 className="font-sans text-base font-bold text-white">
                    Gửi thông tin thành công!
                  </h4>
                  <p className="text-xs text-teal-100/80 leading-relaxed max-w-xs mx-auto">
                    Cảm ơn đối tác. Đội ngũ phát triển đối tác của STAYEA sẽ liên hệ lại trong vòng 24 giờ làm việc.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false)
                      setFormState({
                        businessName: "",
                        contactPerson: "",
                        email: "",
                        phone: "",
                        field: "",
                        operatingArea: "",
                        website: "",
                        notes: "",
                        agreed: true,
                      })
                    }}
                    className="text-xs text-[#e8c783] hover:underline pt-2 font-medium"
                  >
                    Gửi thông tin khác
                  </button>
                </div>
              ) : (
                /* Registration Form */
                <form onSubmit={handleSubmit} className="space-y-3.5 text-left">
                  {/* Field 1: Tên doanh nghiệp / Thương hiệu */}
                  <div className="space-y-1">
                    <label
                      htmlFor="businessName"
                      className="block text-[11px] font-semibold text-teal-100/90"
                    >
                      Tên doanh nghiệp / Thương hiệu <span className="text-[#e8c783]">*</span>
                    </label>
                    <input
                      id="businessName"
                      type="text"
                      required
                      placeholder="VD: Khách sạn Mây Xanh"
                      value={formState.businessName}
                      onChange={(e) => setFormState({ ...formState, businessName: e.target.value })}
                      className="w-full h-9 px-3.5 rounded-xl border border-teal-700/60 bg-white text-slate-800 text-xs placeholder:text-slate-400 focus:outline-none focus:ring-1.5 focus:ring-[#d4a359]"
                    />
                  </div>

                  {/* Field 2: Người liên hệ & Email (2 columns) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label
                        htmlFor="contactPerson"
                        className="block text-[11px] font-semibold text-teal-100/90"
                      >
                        Người liên hệ <span className="text-[#e8c783]">*</span>
                      </label>
                      <input
                        id="contactPerson"
                        type="text"
                        required
                        placeholder="Họ và tên"
                        value={formState.contactPerson}
                        onChange={(e) => setFormState({ ...formState, contactPerson: e.target.value })}
                        className="w-full h-9 px-3.5 rounded-xl border border-teal-700/60 bg-white text-slate-800 text-xs placeholder:text-slate-400 focus:outline-none focus:ring-1.5 focus:ring-[#d4a359]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label
                        htmlFor="partnerEmail"
                        className="block text-[11px] font-semibold text-teal-100/90"
                      >
                        Email <span className="text-[#e8c783]">*</span>
                      </label>
                      <input
                        id="partnerEmail"
                        type="email"
                        required
                        placeholder="you@email.com"
                        value={formState.email}
                        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                        className="w-full h-9 px-3.5 rounded-xl border border-teal-700/60 bg-white text-slate-800 text-xs placeholder:text-slate-400 focus:outline-none focus:ring-1.5 focus:ring-[#d4a359]"
                      />
                    </div>
                  </div>

                  {/* Field 3: Số điện thoại & Lĩnh vực hợp tác (2 columns) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label
                        htmlFor="partnerPhone"
                        className="block text-[11px] font-semibold text-teal-100/90"
                      >
                        Số điện thoại <span className="text-[#e8c783]">*</span>
                      </label>
                      <input
                        id="partnerPhone"
                        type="tel"
                        required
                        placeholder="0901 234 567"
                        value={formState.phone}
                        onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                        className="w-full h-9 px-3.5 rounded-xl border border-teal-700/60 bg-white text-slate-800 text-xs placeholder:text-slate-400 focus:outline-none focus:ring-1.5 focus:ring-[#d4a359]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label
                        htmlFor="partnerField"
                        className="block text-[11px] font-semibold text-teal-100/90"
                      >
                        Lĩnh vực hợp tác <span className="text-[#e8c783]">*</span>
                      </label>
                      <select
                        id="partnerField"
                        required
                        value={formState.field}
                        onChange={(e) => setFormState({ ...formState, field: e.target.value })}
                        className="w-full h-9 px-3 rounded-xl border border-teal-700/60 bg-white text-slate-800 text-xs focus:outline-none focus:ring-1.5 focus:ring-[#d4a359]"
                      >
                        <option value="" disabled>
                          Chọn lĩnh vực
                        </option>
                        <option value="Lưu trú">Lưu trú (Khách sạn, Resort, Villa...)</option>
                        <option value="Trải nghiệm & Tour">Trải nghiệm & Tour</option>
                        <option value="Di chuyển">Di chuyển & Đưa đón</option>
                        <option value="Ẩm thực & Café">Ẩm thực & Café</option>
                        <option value="Spa & Wellness">Spa & Wellness</option>
                        <option value="Thương hiệu / Dịch vụ địa phương">Thương hiệu / Dịch vụ địa phương</option>
                        <option value="Khác">Lĩnh vực khác</option>
                      </select>
                    </div>
                  </div>

                  {/* Field 4: Khu vực hoạt động & Website / Fanpage (2 columns) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label
                        htmlFor="operatingArea"
                        className="block text-[11px] font-semibold text-teal-100/90"
                      >
                        Khu vực hoạt động
                      </label>
                      <input
                        id="operatingArea"
                        type="text"
                        placeholder="VD: Phú Quốc, Kiên Giang"
                        value={formState.operatingArea}
                        onChange={(e) => setFormState({ ...formState, operatingArea: e.target.value })}
                        className="w-full h-9 px-3.5 rounded-xl border border-teal-700/60 bg-white text-slate-800 text-xs placeholder:text-slate-400 focus:outline-none focus:ring-1.5 focus:ring-[#d4a359]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label
                        htmlFor="website"
                        className="block text-[11px] font-semibold text-teal-100/90"
                      >
                        Website / Fanpage
                      </label>
                      <input
                        id="website"
                        type="text"
                        placeholder="https://"
                        value={formState.website}
                        onChange={(e) => setFormState({ ...formState, website: e.target.value })}
                        className="w-full h-9 px-3.5 rounded-xl border border-teal-700/60 bg-white text-slate-800 text-xs placeholder:text-slate-400 focus:outline-none focus:ring-1.5 focus:ring-[#d4a359]"
                      />
                    </div>
                  </div>

                  {/* Field 5: Nhu cầu hợp tác / ghi chú */}
                  <div className="space-y-1">
                    <label
                      htmlFor="partnerNotes"
                      className="block text-[11px] font-semibold text-teal-100/90"
                    >
                      Nhu cầu hợp tác / ghi chú
                    </label>
                    <textarea
                      id="partnerNotes"
                      rows={3}
                      placeholder="Chia sẻ thêm về mong muốn hợp tác của bạn..."
                      value={formState.notes}
                      onChange={(e) => setFormState({ ...formState, notes: e.target.value })}
                      className="w-full p-3 rounded-xl border border-teal-700/60 bg-white text-slate-800 text-xs placeholder:text-slate-400 focus:outline-none focus:ring-1.5 focus:ring-[#d4a359] resize-none"
                    />
                  </div>

                  {/* Checkbox: Agreement */}
                  <div className="pt-1">
                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formState.agreed}
                        onChange={(e) => setFormState({ ...formState, agreed: e.target.checked })}
                        className="mt-0.5 w-4 h-4 rounded text-[#d4a359] focus:ring-[#d4a359] accent-[#d4a359]"
                        required
                      />
                      <span className="text-[11px] text-teal-100/85 leading-tight">
                        Tôi đồng ý với{" "}
                        <a href="#terms" className="underline hover:text-white">
                          Điều khoản hợp tác
                        </a>{" "}
                        và{" "}
                        <a href="#privacy" className="underline hover:text-white">
                          Chính sách bảo mật
                        </a>{" "}
                        của STAYEA. <span className="text-[#e8c783]">*</span>
                      </span>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full h-10 mt-2 rounded-xl bg-[#d4a359] hover:bg-[#c69a58] text-white text-xs sm:text-sm font-semibold transition-all shadow-md inline-flex items-center justify-center gap-2 group active:scale-95"
                  >
                    <span>Gửi đăng ký</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </button>

                  {/* Security Note */}
                  <div className="flex items-center justify-center gap-1.5 pt-1 text-[11px] text-teal-200/70">
                    <Lock className="w-3.5 h-3.5 text-[#e8c783]" />
                    <span>Thông tin của bạn được bảo mật tuyệt đối.</span>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
