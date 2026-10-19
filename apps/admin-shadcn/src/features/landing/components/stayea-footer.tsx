"use client"

import * as React from "react"
import Image from "next/image"
import { MapPin, ArrowRight, Check, Phone, Mail, ArrowUp } from "lucide-react"
import { FOOTER_COLUMNS, LANGUAGES } from "@/features/landing/data/stayea-mock-data"

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  )
}

function YoutubeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  )
}

function TiktokIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.86.11V9.4a6.33 6.33 0 0 0-6.19 6.34 6.34 6.34 0 0 0 10.82 4.48c.06-.06.12-.12.18-.18a6.3 6.3 0 0 0 1.94-4.57V8.41a8.2 8.2 0 0 0 4.79 1.52V6.69z" />
    </svg>
  )
}

function LinkedinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
  )
}

interface StayeaFooterProps {
  readonly variant?: "default" | "about"
  readonly onNavigate?: (item: string) => void
}

export function StayeaFooter({ variant = "about", onNavigate }: StayeaFooterProps = {}) {
  const [email, setEmail] = React.useState("")
  const [subscribed, setSubscribed] = React.useState(false)
  const [selectedLang, setSelectedLang] = React.useState("vi")

  function handleLinkClick(item: string) {
    if (!onNavigate) return
    switch (item) {
      case "Lưu trú":
      case "Villa biệt thự":
      case "Căn hộ cao cấp":
      case "Khách sạn & Resort":
        onNavigate("stay")
        break
      case "Trải nghiệm":
      case "Tour đảo & Lặn san hô":
      case "Sunset ngắm hoàng hôn":
      case "Ẩm thực địa phương":
        onNavigate("experience")
        break
      case "Gói du lịch":
      case "Gói hành trình":
      case "Combo nghỉ dưỡng":
        onNavigate("packages")
        break
      case "Di chuyển":
      case "Vé máy bay":
      case "Đưa đón sân bay":
      case "Thuê xe tự lái":
        onNavigate("flight-booking")
        break
      case "Ưu đãi":
      case "Ưu đãi thành viên":
      case "Khuyến mãi mùa hè":
        onNavigate("deals")
        break
      case "Stayea Club":
        onNavigate("stayea-club")
        break
      case "Trở thành chủ nhà":
        onNavigate("host")
        break
      case "Hợp tác cùng Stayea":
      case "Hợp tác cùng STAYEA":
        onNavigate("partner")
        break
      case "Câu chuyện":
      case "Câu chuyện của chúng tôi":
      case "Đội ngũ":
      case "Về Stayea":
      case "Về chúng tôi":
        onNavigate("about")
        break
      case "Trung tâm hỗ trợ":
      case "Trung tâm trợ giúp":
      case "Câu hỏi thường gặp":
      case "FAQ":
      case "Liên hệ":
        alert("Đang kết nối trung tâm hỗ trợ khách hàng STAYEA 24/7 (Hotline: +84 297 730 9999)...")
        break
      case "Điều khoản dịch vụ":
      case "Điều khoản sử dụng":
      case "Chính sách bảo mật":
      case "Chính sách hủy phòng":
      case "Chính sách huỷ phòng":
        alert("Chính sách & Điều khoản dịch vụ STAYEA: Cam kết bảo vệ quyền lợi và bảo mật thông tin tối đa cho khách hàng và đối tác.")
        break
      default:
        onNavigate(item)
    }
  }

  function handleSubscribe(e: React.FormEvent) {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setEmail("")
      setTimeout(() => setSubscribed(false), 4000)
    }
  }

  const isAboutVariant = variant === "about"

  return (
    <footer className="relative w-full overflow-hidden text-white bg-[#06181b]">
      {/* Background Image: footerhomepagebanner.png stretching across the full footer */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src="/footerhomepagebanner.png"
          alt="Phú Quốc Coral Reef Background"
          fill
          priority
          unoptimized
          className="object-cover object-bottom"
        />
        {/* Gradient Overlay: Deep dark teal at top fading to clear water & coral reef at bottom */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#06181b]/95 via-[#06181b]/85 to-[#06181b]/60 backdrop-blur-[0.5px]" />
      </div>

      {/* Main Footer Links Content */}
      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        {isAboutVariant ? (
          /* About Page Design Layout: Balanced 12-Column Grid (3 - 2 - 2 - 2 - 3) */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-8 xl:gap-10 items-start">
            {/* Brand Info Column (Col 1-3) */}
            <div className="lg:col-span-3 space-y-4">
              <div>
                <span className="font-brand text-2xl sm:text-3xl font-bold tracking-[0.25em] text-white uppercase select-none drop-shadow">
                  STAYEA
                </span>
                <span className="block text-[8.5px] uppercase tracking-[0.24em] text-white/80 font-semibold mt-0.5">
                  MORE THAN A STAY
                </span>
              </div>

              <p className="text-xs text-white/85 leading-relaxed max-w-xs drop-shadow-sm font-normal">
                Đồng hành cùng bạn khám phá Phú Quốc theo cách tinh tế và trọn vẹn hơn, với những nơi lưu trú tinh tuyển, trải nghiệm ý nghĩa và hành trình dễ dàng hơn.
              </p>

              {/* Social Icons */}
              <div className="flex items-center gap-3.5 text-white/90 pt-1">
                <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" className="hover:text-white transition-colors">
                  <FacebookIcon className="w-4 h-4" />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="hover:text-white transition-colors">
                  <InstagramIcon className="w-4 h-4" />
                </a>
                <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube" className="hover:text-white transition-colors">
                  <YoutubeIcon className="w-4 h-4" />
                </a>
                <a href="https://tiktok.com" target="_blank" rel="noreferrer" aria-label="TikTok" className="hover:text-white transition-colors">
                  <TiktokIcon className="w-4 h-4" />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="hover:text-white transition-colors">
                  <LinkedinIcon className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Links Column 1: Khám phá (Col 4-5) */}
            <div className="lg:col-span-2 space-y-3.5">
              <h4 className="text-xs font-bold text-white tracking-wider uppercase">
                Khám phá
              </h4>
              <ul className="space-y-2.5 text-xs text-white/80">
                {["Lưu trú", "Trải nghiệm", "Gói du lịch", "Di chuyển", "Ưu đãi"].map((item) => (
                  <li key={item}>
                    <button
                      type="button"
                      onClick={() => handleLinkClick(item)}
                      className="hover:text-white transition-colors text-left"
                    >
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Links Column 2: Về Stayea (Col 6-7) */}
            <div className="lg:col-span-2 space-y-3.5">
              <h4 className="text-xs font-bold text-white tracking-wider uppercase">
                Về Stayea
              </h4>
              <ul className="space-y-2.5 text-xs text-white/80">
                {["Câu chuyện", "Đội ngũ", "Stayea Club", "Trở thành chủ nhà", "Hợp tác cùng Stayea"].map((item) => (
                  <li key={item}>
                    <button
                      type="button"
                      onClick={() => handleLinkClick(item)}
                      className="hover:text-white transition-colors text-left"
                    >
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Links Column 3: Hỗ trợ (Col 8-9) */}
            <div className="lg:col-span-2 space-y-3.5">
              <h4 className="text-xs font-bold text-white tracking-wider uppercase">
                Hỗ trợ
              </h4>
              <ul className="space-y-2.5 text-xs text-white/80">
                {["Trung tâm hỗ trợ", "Câu hỏi thường gặp", "Điều khoản dịch vụ", "Chính sách bảo mật", "Liên hệ"].map((item) => (
                  <li key={item}>
                    <button
                      type="button"
                      onClick={() => handleLinkClick(item)}
                      className="hover:text-white transition-colors text-left"
                    >
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Links Column 4: Liên hệ với chúng tôi (Col 10-12) */}
            <div className="lg:col-span-3 space-y-3.5">
              <h4 className="text-xs font-bold text-white tracking-wider uppercase">
                Liên hệ với chúng tôi
              </h4>
              <div className="space-y-2.5 text-xs text-white/85">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                  <a href="tel:+842977309999" className="hover:text-white transition-colors">
                    +84 297 730 9999
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                  <a href="mailto:hello@stayea.com" className="hover:text-white transition-colors">
                    hello@stayea.com
                  </a>
                </div>
                <div className="flex items-start gap-2 pt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-300 shrink-0 mt-0.5" />
                  <span>Phú Quốc, Kiên Giang, Việt Nam</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Default Landing Page Footer Layout: Balanced 12-Column Grid (3 - 2 - 2 - 2 - 3) */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-8 xl:gap-10 items-start">
            {/* Brand Info Column (Col 1-3) */}
            <div className="lg:col-span-3 space-y-4">
              <div>
                <span className="font-brand text-2xl sm:text-3xl font-bold tracking-[0.25em] text-white uppercase select-none drop-shadow">
                  STAYEA
                </span>
                <span className="block text-[9.5px] uppercase tracking-[0.22em] text-white/80 font-medium mt-1">
                  Khám phá hơn một kỳ nghỉ
                </span>
              </div>

              <p className="text-xs text-white/85 leading-relaxed max-w-xs drop-shadow-sm font-normal">
                STAYEA là nền tảng du lịch và lưu trú cao cấp, mang đến những kỳ nghỉ tuyển chọn và trải nghiệm tinh tế tại Phú Quốc.
              </p>

              <div className="flex items-center gap-2 text-xs text-white/90 pt-1">
                <MapPin className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                <span>Phú Quốc, Việt Nam</span>
              </div>
            </div>

            {/* Links Column 1: Khám phá (Col 4-5) */}
            <div className="lg:col-span-2 space-y-3.5">
              <h4 className="text-xs font-bold text-white tracking-wider uppercase">
                {FOOTER_COLUMNS.khamPha.title}
              </h4>
              <ul className="space-y-2.5 text-xs text-white/80">
                {FOOTER_COLUMNS.khamPha.links.map((link) => (
                  <li key={link.label}>
                    <button
                      type="button"
                      onClick={() => handleLinkClick(link.label)}
                      className="hover:text-white transition-colors text-left"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Links Column 2: Về Stayea (Col 6-7) */}
            <div className="lg:col-span-2 space-y-3.5">
              <h4 className="text-xs font-bold text-white tracking-wider uppercase">
                {FOOTER_COLUMNS.veStayea.title}
              </h4>
              <ul className="space-y-2.5 text-xs text-white/80">
                {FOOTER_COLUMNS.veStayea.links.map((link) => (
                  <li key={link.label}>
                    <button
                      type="button"
                      onClick={() => handleLinkClick(link.label)}
                      className="hover:text-white transition-colors text-left"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Links Column 3: Hỗ trợ (Col 8-9) */}
            <div className="lg:col-span-2 space-y-3.5">
              <h4 className="text-xs font-bold text-white tracking-wider uppercase">
                {FOOTER_COLUMNS.hoTro.title}
              </h4>
              <ul className="space-y-2.5 text-xs text-white/80">
                {FOOTER_COLUMNS.hoTro.links.map((link) => (
                  <li key={link.label}>
                    <button
                      type="button"
                      onClick={() => handleLinkClick(link.label)}
                      className="hover:text-white transition-colors text-left"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter & Socials (Col 10-12) */}
            <div className="lg:col-span-3 space-y-4">
              <div>
                <h4 className="text-xs font-bold text-white tracking-wider uppercase">
                  Đăng ký nhận tin
                </h4>
                <p className="text-[11.5px] text-white/80 mt-1.5 leading-snug">
                  Nhận ưu đãi mới nhất và cảm hứng du lịch từ Phú Quốc.
                </p>
              </div>

              {/* Newsletter Input Form */}
              <form onSubmit={handleSubscribe} className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Nhập email của bạn"
                  className="w-full bg-white text-slate-800 rounded-lg px-3.5 py-2.5 text-xs placeholder:text-slate-400 pr-11 focus:outline-none focus:ring-2 focus:ring-[#e8c783] shadow-sm transition-all"
                />
                <button
                  type="submit"
                  aria-label="Đăng ký nhận bản tin"
                  className="absolute right-1 top-1 bottom-1 px-3 bg-[#0c3b40] hover:bg-[#072528] text-white rounded-md flex items-center justify-center transition-colors shadow-xs"
                >
                  {subscribed ? <Check className="w-4 h-4 text-emerald-400" /> : <ArrowRight className="w-4 h-4" />}
                </button>
              </form>
              {subscribed && (
                <span className="text-[11px] text-emerald-300 block -mt-2">
                  Cảm ơn bạn đã đăng ký nhận tin!
                </span>
              )}

              {/* Social Icons */}
              <div className="pt-1 space-y-2">
                <span className="text-[11px] font-semibold text-white/90 block">
                  Kết nối với chúng tôi
                </span>
                <div className="flex items-center gap-3.5 text-white/80">
                  <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" className="hover:text-white transition-colors">
                    <FacebookIcon className="w-4 h-4" />
                  </a>
                  <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="hover:text-white transition-colors">
                    <InstagramIcon className="w-4 h-4" />
                  </a>
                  <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube" className="hover:text-white transition-colors">
                    <YoutubeIcon className="w-4 h-4" />
                  </a>
                  <a href="https://tiktok.com" target="_blank" rel="noreferrer" aria-label="TikTok" className="hover:text-white transition-colors">
                    <TiktokIcon className="w-4 h-4" />
                  </a>
                  <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="hover:text-white transition-colors">
                    <LinkedinIcon className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Handwritten Signature Script */}
              <div className="pt-2">
                <span className="font-script-vi text-2xl sm:text-[27px] font-semibold text-white/95 select-none drop-shadow whitespace-nowrap">
                  Một hành trình trọn vẹn hơn ♡
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Bar: Copyright & Language Switcher & Scroll to top */}
      <div className="relative z-10 w-full overflow-hidden border-t border-white/15">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/90 drop-shadow">
          <p className="font-normal text-white/85">
            © 2024 STAYEA. Tất cả quyền được bảo lưu.
          </p>

          <div className="flex items-center gap-4 sm:gap-6">
            {/* Language Switcher Bar */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-white/70 text-[11px]">Ngôn ngữ:</span>
              <div className="flex items-center gap-2 text-white/85 text-[11px] font-medium">
                {LANGUAGES.map((lang, idx) => (
                  <React.Fragment key={lang.code}>
                    <button
                      type="button"
                      onClick={() => setSelectedLang(lang.code)}
                      className={`hover:text-white transition-colors ${
                        selectedLang === lang.code ? "font-bold text-white underline underline-offset-4" : "text-white/80"
                      }`}
                    >
                      {lang.label}
                    </button>
                    {idx < LANGUAGES.length - 1 && <span className="text-white/40">|</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Scroll-to-Top Button */}
            <button
              type="button"
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.scrollTo({ top: 0, behavior: "smooth" })
                }
              }}
              aria-label="Cuộn lên đầu trang"
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-all shadow-xs shrink-0 active:scale-95"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
