"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Calendar,
  Eye,
  ArrowRight,
  BookOpen,
  MapPin,
  Building,
  Utensils,
  Sparkles,
  Car,
  Bookmark,
  CalendarDays,
  Heart,
  LayoutGrid,
  CheckCircle2,
} from "lucide-react"
import {
  PHU_QUOC_CATEGORIES,
  PHU_QUOC_FEATURED_ARTICLE,
} from "@/features/landing/data/stayea-mock-data"

interface PhuQuocSidebarProps {
  readonly activeCategory: string
  readonly onSelectCategory: (categoryId: string) => void
}

function getCategoryIcon(iconName: string) {
  switch (iconName) {
    case "book":
      return <BookOpen className="w-4 h-4 text-slate-400 shrink-0" />
    case "map":
      return <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
    case "building":
      return <Building className="w-4 h-4 text-slate-400 shrink-0" />
    case "utensils":
      return <Utensils className="w-4 h-4 text-slate-400 shrink-0" />
    case "activity":
      return <Sparkles className="w-4 h-4 text-slate-400 shrink-0" />
    case "car":
      return <Car className="w-4 h-4 text-slate-400 shrink-0" />
    case "bookmark":
      return <Bookmark className="w-4 h-4 text-slate-400 shrink-0" />
    case "calendar":
      return <CalendarDays className="w-4 h-4 text-slate-400 shrink-0" />
    case "heart":
      return <Heart className="w-4 h-4 text-slate-400 shrink-0" />
    case "grid":
      return <LayoutGrid className="w-4 h-4 text-slate-400 shrink-0" />
    default:
      return <BookOpen className="w-4 h-4 text-slate-400 shrink-0" />
  }
}

export function PhuQuocSidebar({
  activeCategory,
  onSelectCategory,
}: PhuQuocSidebarProps) {
  const [email, setEmail] = React.useState("")
  const [subscribed, setSubscribed] = React.useState(false)

  function handleSubscribe(e: React.FormEvent) {
    e.preventDefault()
    if (email.trim()) {
      setSubscribed(true)
      setTimeout(() => {
        setSubscribed(false)
        setEmail("")
      }, 3000)
    }
  }

  return (
    <aside className="w-full space-y-6">
      {/* 1. Featured Article Card */}
      <div className="group bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all overflow-hidden flex flex-col justify-between">
        <div>
          {/* Image */}
          <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
            <Image
              src={PHU_QUOC_FEATURED_ARTICLE.imageUrl}
              alt={PHU_QUOC_FEATURED_ARTICLE.title}
              fill
              sizes="(max-width: 1024px) 100vw, 320px"
              className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
            />
            <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#1e3a8a] text-white tracking-wider uppercase shadow-xs">
              BÀI VIẾT NỔI BẬT
            </span>
          </div>

          {/* Info */}
          <div className="p-4 space-y-2">
            <h3 className="font-sans text-base font-bold text-slate-900 group-hover:text-[#0c3b40] transition-colors leading-snug">
              {PHU_QUOC_FEATURED_ARTICLE.title}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
              {PHU_QUOC_FEATURED_ARTICLE.excerpt}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 pb-4 pt-2 flex items-center justify-between border-t border-slate-50 text-[11px] text-slate-400">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 shrink-0" />
              <span>{PHU_QUOC_FEATURED_ARTICLE.date}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5 shrink-0" />
              <span>{PHU_QUOC_FEATURED_ARTICLE.views}</span>
            </div>
          </div>

          <Link
            href={`#article-${PHU_QUOC_FEATURED_ARTICLE.id}`}
            aria-label={`Đọc bài viết: ${PHU_QUOC_FEATURED_ARTICLE.title}`}
            className="w-8 h-8 rounded-full bg-[#0c3b40] hover:bg-[#072528] text-white flex items-center justify-center shadow-xs transition-transform active:scale-95 group-hover:scale-105"
          >
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 2. Danh mục (Categories List Card) */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-4 sm:p-5 space-y-3">
        <h3 className="font-sans text-base font-bold text-slate-900 tracking-tight">
          Danh mục
        </h3>

        <div className="space-y-1">
          {PHU_QUOC_CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-[13px] transition-colors select-none ${
                  isActive
                    ? "bg-teal-50/80 text-[#0c3b40] font-bold"
                    : "text-slate-700 hover:bg-slate-50 font-medium"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {getCategoryIcon(cat.iconName)}
                  <span>{cat.label}</span>
                </div>
                <span
                  className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${
                    isActive
                      ? "bg-[#0c3b40] text-white"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* 3. Newsletter Subscription Card */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-teal-50/90 via-emerald-50/50 to-slate-50 border border-teal-100/70 p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] space-y-3">
        <div className="space-y-1.5 relative z-10">
          <h4 className="font-sans text-base font-bold text-slate-900 leading-snug">
            Cùng STAYEA khám phá nhiều hơn
          </h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Nhận những bài viết mới nhất, gợi ý độc quyền và ưu đãi đặc biệt từ Phú Quốc.
          </p>
        </div>

        <form onSubmit={handleSubscribe} className="space-y-2.5 relative z-10 pt-1">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Nhập email của bạn"
            className="w-full h-10 px-3.5 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm placeholder:text-slate-400 focus:outline-none focus:border-[#0c3b40] focus:ring-1 focus:ring-[#0c3b40] transition-colors shadow-2xs"
          />
          <button
            type="submit"
            disabled={subscribed}
            className="w-full h-10 rounded-xl bg-[#0c3b40] hover:bg-[#072528] text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-95"
          >
            {subscribed ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                <span>Đã đăng ký thành công!</span>
              </>
            ) : (
              <>
                <span>Đăng ký nhận tin</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>
      </div>

      {/* 4. Social Links */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-4 sm:p-5 space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Kết nối với chúng tôi
        </h4>

        <div className="flex items-center gap-2 pt-0.5">
          {/* Facebook */}
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-[#0c3b40] hover:text-white text-slate-600 flex items-center justify-center transition-colors"
          >
            <span className="font-bold text-xs">f</span>
          </a>

          {/* Instagram */}
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-[#0c3b40] hover:text-white text-slate-600 flex items-center justify-center transition-colors"
          >
            <span className="font-bold text-xs">ig</span>
          </a>

          {/* YouTube */}
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="YouTube"
            className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-[#0c3b40] hover:text-white text-slate-600 flex items-center justify-center transition-colors"
          >
            <span className="font-bold text-xs">yt</span>
          </a>

          {/* TikTok */}
          <a
            href="https://tiktok.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="TikTok"
            className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-[#0c3b40] hover:text-white text-slate-600 flex items-center justify-center transition-colors"
          >
            <span className="font-bold text-xs">tk</span>
          </a>

          {/* LinkedIn */}
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-[#0c3b40] hover:text-white text-slate-600 flex items-center justify-center transition-colors"
          >
            <span className="font-bold text-xs">in</span>
          </a>
        </div>
      </div>
    </aside>
  )
}
