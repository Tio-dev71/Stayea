"use client"

import * as React from "react"
import Image from "next/image"
import {
  MapPin,
  Users,
  Diamond,
  Handshake,
  Coins,
  FileCheck,
  Headphones,
  Settings,
  ArrowRight,
  CheckCircle2,
} from "lucide-react"
import {
  HOST_PARTNERSHIP_VALUES,
  HOST_PROPERTY_CATEGORIES,
  HOST_TRANSPARENCY_ITEMS,
} from "@/features/landing/data/stayea-mock-data"

function getValueIcon(iconName: string) {
  switch (iconName) {
    case "mappin":
      return <MapPin className="w-5 h-5 text-[#c69a58]" />
    case "users":
      return <Users className="w-5 h-5 text-[#c69a58]" />
    case "diamond":
      return <Diamond className="w-5 h-5 text-[#c69a58]" />
    case "handshake":
      return <Handshake className="w-5 h-5 text-[#c69a58]" />
    default:
      return <MapPin className="w-5 h-5 text-[#c69a58]" />
  }
}

function getTransparencyIcon(iconName: string) {
  switch (iconName) {
    case "coins":
      return <Coins className="w-5 h-5 text-[#c69a58]" />
    case "filecheck":
      return <FileCheck className="w-5 h-5 text-[#c69a58]" />
    case "headphones":
      return <Headphones className="w-5 h-5 text-[#c69a58]" />
    case "settings":
      return <Settings className="w-5 h-5 text-[#c69a58]" />
    default:
      return <Coins className="w-5 h-5 text-[#c69a58]" />
  }
}

export function HostPartnershipAndForm() {
  const [formState, setFormState] = React.useState({
    fullName: "",
    phone: "",
    email: "",
    propertyType: "",
    address: "",
    scale: "",
    notes: "",
    agreed: true,
  })

  const [submitted, setSubmitted] = React.useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!formState.agreed) {
      alert("Vui lòng đồng ý với Điều khoản hợp tác và Chính sách bảo mật của STAYEA.")
      return
    }
    setSubmitted(true)
  }

  return (
    <section id="host-partnership" className="py-14 sm:py-18 lg:py-22 bg-white">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* ========================================================= */}
          {/* LEFT COLUMN: Values, Types & Transparency (~58% width)   */}
          {/* ========================================================= */}
          <div className="lg:col-span-7 space-y-10 sm:space-y-12">
            {/* Header */}
            <div className="space-y-1.5">
              <span className="inline-block text-[11px] font-bold uppercase tracking-[0.22em] text-[#0c3b40]">
                VÌ SAO NÊN CHỌN STAYEA?
              </span>
              <h2 className="font-sans text-2xl sm:text-3xl lg:text-[34px] font-bold text-[#0c3b40] tracking-tight leading-snug">
                Đồng hành cùng những chủ nhà
                <br />
                tâm huyết tại Phú Quốc
              </h2>
            </div>

            {/* Split: Hostess Photo + 4 Core Values */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 sm:gap-6 items-center">
              {/* Hostess Photo with Quote Card */}
              <div className="sm:col-span-5 relative rounded-2xl overflow-hidden shadow-md group">
                <div className="relative aspect-[4/5] sm:aspect-auto sm:h-[300px] w-full">
                  <Image
                    src="/host/host-portrait.jpg"
                    alt="Đồng hành cùng những chủ nhà tâm huyết tại Phú Quốc"
                    fill
                    unoptimized
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 640px) 100vw, 30vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                </div>

                {/* Overlaid Quote Card */}
                <div className="absolute inset-x-2.5 bottom-2.5 bg-white/95 backdrop-blur-md rounded-xl p-3 border border-slate-100 shadow-sm text-center">
                  <p className="font-script-vi text-sm sm:text-[15px] text-[#c69a58] leading-tight -rotate-[1deg]">
                    &ldquo;Những không gian đẹp
                    <br />
                    tạo nên những hành trình đáng nhớ&rdquo;
                  </p>
                  <span className="block text-[8px] tracking-[0.24em] uppercase font-bold text-slate-500 mt-1">
                    STAYEA
                  </span>
                </div>
              </div>

              {/* 4 Value Bullets */}
              <div className="sm:col-span-7 space-y-3.5">
                {HOST_PARTNERSHIP_VALUES.map((val) => (
                  <div key={val.id} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#c69a58]/10 border border-[#c69a58]/20 flex items-center justify-center shrink-0 mt-0.5">
                      {getValueIcon(val.iconName)}
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="font-sans text-xs sm:text-[13px] font-bold text-slate-900 leading-tight">
                        {val.title}
                      </h4>
                      <p className="text-[11.5px] sm:text-xs text-slate-500 leading-relaxed">
                        {val.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sub-Section 1: LOẠI HÌNH LƯU TRÚ PHÙ HỢP */}
            <div className="space-y-4 pt-2">
              <div className="space-y-1">
                <span className="inline-block text-[10.5px] font-bold uppercase tracking-[0.2em] text-slate-500">
                  LOẠI HÌNH LƯU TRÚ PHÙ HỢP
                </span>
                <h3 className="font-sans text-lg sm:text-xl font-bold text-[#0c3b40] tracking-tight">
                  Mọi không gian tuyệt vời đều có thể trở thành một phần của STAYEA
                </h3>
              </div>

              {/* 5 Property Category Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 sm:gap-3">
                {HOST_PROPERTY_CATEGORIES.map((cat) => (
                  <div
                    key={cat.id}
                    className="bg-white rounded-xl border border-slate-200/80 overflow-hidden shadow-2xs hover:shadow-md hover:border-teal-200 transition-all group flex flex-col justify-between"
                  >
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                      <Image
                        src={cat.imageUrl}
                        alt={cat.title}
                        fill
                        unoptimized
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        sizes="(max-width: 640px) 50vw, 15vw"
                      />
                    </div>
                    <div className="p-2 text-center bg-white">
                      <div className="text-[11px] sm:text-xs font-bold text-slate-800 leading-tight">
                        {cat.title}
                      </div>
                      {cat.subtitle && (
                        <div className="text-[9px] text-slate-400 font-medium leading-none mt-0.5">
                          {cat.subtitle}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sub-Section 2: QUYỀN LỢI RÕ RÀNG – HỢP TÁC MINH BẠCH */}
            <div className="space-y-3.5 pt-2">
              <div className="space-y-0.5">
                <span className="inline-block text-[10.5px] font-bold uppercase tracking-[0.2em] text-slate-500">
                  QUYỀN LỢI RÕ RÀNG – HỢP TÁC MINH BẠCH
                </span>
                <p className="text-xs sm:text-[12.5px] text-slate-600">
                  Chúng tôi cam kết một môi trường hợp tác công bằng, minh bạch và bền vững.
                </p>
              </div>

              {/* 4 Mini-Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2.5 sm:gap-3">
                {HOST_TRANSPARENCY_ITEMS.map((item) => (
                  <div
                    key={item.id}
                    className="bg-[#f8fafb] rounded-xl border border-slate-200/70 p-3.5 space-y-2 hover:bg-white hover:border-slate-300 hover:shadow-xs transition-all"
                  >
                    <div className="w-7 h-7 rounded-lg bg-[#c69a58]/10 flex items-center justify-center shrink-0">
                      {getTransparencyIcon(item.iconName)}
                    </div>
                    <h5 className="font-sans text-xs font-bold text-slate-900 leading-snug">
                      {item.title}
                    </h5>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* RIGHT COLUMN: Host Registration Form Card (~42% width)    */}
          {/* ========================================================= */}
          <div
            id="host-register-form"
            className="lg:col-span-5 scroll-mt-24 w-full"
          >
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden sticky top-24">
              {/* Card Banner Image */}
              <div className="relative h-24 sm:h-28 w-full overflow-hidden bg-slate-900">
                <Image
                  src="/about/conversion-host.jpg"
                  alt="Đăng ký chủ nhà Stayea"
                  fill
                  unoptimized
                  className="object-cover object-center opacity-85"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>

              {/* Card Form Body */}
              <div className="p-6 sm:p-7 space-y-4">
                <div className="space-y-1">
                  <h3 className="font-sans text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                    Đăng ký chủ nhà
                  </h3>
                  <p className="text-xs sm:text-[12.5px] text-slate-500 leading-relaxed">
                    Bắt đầu hành trình cùng STAYEA ngay hôm nay.
                    <br />
                    Đội ngũ của chúng tôi sẽ liên hệ để tư vấn chi tiết.
                  </p>
                </div>

                {submitted ? (
                  <div className="py-8 px-4 text-center space-y-3 bg-emerald-50/70 border border-emerald-200 rounded-2xl animate-in fade-in-50 zoom-in-95">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-7 h-7" />
                    </div>
                    <h4 className="font-sans text-base font-bold text-emerald-900">
                      Gửi đăng ký thành công!
                    </h4>
                    <p className="text-xs text-emerald-800 leading-relaxed max-w-xs mx-auto">
                      Cảm ơn bạn đã quan tâm hợp tác. Chuyên viên phát triển đối tác của STAYEA sẽ liên hệ trong vòng 24 giờ làm việc.
                    </p>
                    <button
                      type="button"
                      onClick={() => setSubmitted(false)}
                      className="text-xs font-semibold text-[#0c3b40] underline hover:text-emerald-900 pt-2"
                    >
                      Đăng ký cơ sở khác
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-3">
                    {/* Row 1: Họ tên + Số điện thoại */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-slate-700">
                          Họ và tên <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Nguyễn Văn A"
                          value={formState.fullName}
                          onChange={(e) => setFormState({ ...formState, fullName: e.target.value })}
                          className="w-full h-9 px-3 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1.5 focus:ring-[#0c3b40]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-slate-700">
                          Số điện thoại <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="0123 456 789"
                          value={formState.phone}
                          onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                          className="w-full h-9 px-3 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1.5 focus:ring-[#0c3b40]"
                        />
                      </div>
                    </div>

                    {/* Row 2: Email + Loại hình */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-slate-700">
                          Email <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="example@email.com"
                          value={formState.email}
                          onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                          className="w-full h-9 px-3 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1.5 focus:ring-[#0c3b40]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-slate-700">
                          Loại hình lưu trú <span className="text-rose-500">*</span>
                        </label>
                        <select
                          required
                          value={formState.propertyType}
                          onChange={(e) => setFormState({ ...formState, propertyType: e.target.value })}
                          className="w-full h-9 px-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white focus:outline-none focus:ring-1.5 focus:ring-[#0c3b40]"
                        >
                          <option value="">Chọn loại hình lưu trú</option>
                          <option value="Biệt thự">Biệt thự</option>
                          <option value="Căn hộ">Căn hộ</option>
                          <option value="Homestay">Homestay</option>
                          <option value="Khách sạn nhỏ / Boutique stay">Khách sạn nhỏ / Boutique stay</option>
                          <option value="Lưu trú dài hạn">Lưu trú dài hạn</option>
                        </select>
                      </div>
                    </div>

                    {/* Row 3: Khu vực + Quy mô */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-slate-700">
                          Khu vực / địa chỉ chỗ ở <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Dương Đông, Phú Quốc, Kiên Giang"
                          value={formState.address}
                          onChange={(e) => setFormState({ ...formState, address: e.target.value })}
                          className="w-full h-9 px-3 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1.5 focus:ring-[#0c3b40]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-slate-700">
                          Số phòng / quy mô <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Ví dụ: 3 phòng"
                          value={formState.scale}
                          onChange={(e) => setFormState({ ...formState, scale: e.target.value })}
                          className="w-full h-9 px-3 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1.5 focus:ring-[#0c3b40]"
                        />
                      </div>
                    </div>

                    {/* Row 4: Ghi chú thêm */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-700">
                        Ghi chú thêm (nếu có)
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Chia sẻ thêm về chỗ ở của bạn..."
                        value={formState.notes}
                        onChange={(e) => setFormState({ ...formState, notes: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1.5 focus:ring-[#0c3b40] resize-none"
                      />
                    </div>

                    {/* Row 5: Checkbox điều khoản */}
                    <div className="flex items-start gap-2 pt-1">
                      <input
                        type="checkbox"
                        id="host-terms"
                        checked={formState.agreed}
                        onChange={(e) => setFormState({ ...formState, agreed: e.target.checked })}
                        className="mt-0.5 rounded border-slate-300 text-[#0c3b40] focus:ring-[#0c3b40]"
                        required
                      />
                      <label htmlFor="host-terms" className="text-[11px] text-slate-500 leading-snug">
                        Tôi đồng ý với{" "}
                        <a href="#terms" className="text-slate-700 underline font-medium hover:text-[#0c3b40]">
                          Điều khoản hợp tác
                        </a>{" "}
                        và{" "}
                        <a href="#privacy" className="text-slate-700 underline font-medium hover:text-[#0c3b40]">
                          Chính sách bảo mật
                        </a>{" "}
                        của STAYEA.
                      </label>
                    </div>

                    {/* Row 6: Submit CTA */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        className="w-full h-11 rounded-xl bg-[#0c3b40] hover:bg-[#072528] text-white font-semibold text-xs sm:text-sm transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2 group cursor-pointer"
                      >
                        <span>Gửi đăng ký</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
