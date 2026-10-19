"use client"

import Image from "next/image"
import { Camera } from "lucide-react"

interface ProfileHeroBannerProps {
  readonly userName?: string
  readonly onEditCover?: () => void
}

export function ProfileHeroBanner({
  userName = "Nguyễn Minh",
  onEditCover,
}: ProfileHeroBannerProps) {
  return (
    <section className="relative w-full h-[260px] sm:h-[290px] md:h-[320px] overflow-hidden bg-slate-900 select-none">
      {/* 1. Background Cover Panorama */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/profile/profile-hero-banner.jpg"
          alt="STAYEA Phú Quốc Cover"
          fill
          unoptimized
          priority
          className="object-cover object-center"
        />
        {/* Subtle Vignette Gradients for Text Legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-black/35 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* 2. Banner Content Container */}
      <div className="relative z-10 w-full h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-between py-6 sm:py-8 text-white">
        {/* Top/Center Row */}
        <div className="flex items-start justify-between">
          {/* Left Greeting & Calligraphy */}
          <div className="space-y-1 max-w-lg">
            <p className="text-white/90 text-sm sm:text-base font-medium">Xin chào,</p>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white drop-shadow-md">
              {userName}!
            </h1>
            <p className="text-white/90 italic text-xs sm:text-sm drop-shadow-sm pt-0.5">
              &ldquo;Khám phá thế giới theo cách của bạn&rdquo;
            </p>

            {/* Left Cursive Calligraphy: More Than a Stay ♡ */}
            <div
              className="text-white text-xl sm:text-2xl pt-2 drop-shadow-md flex items-center gap-2"
              style={{ fontFamily: 'Georgia, "Brush Script MT", cursive, serif' }}
            >
              <span className="italic">More Than a Stay</span>
              <span className="text-lg">♡</span>
            </div>
          </div>

          {/* Right Cursive Calligraphy: More Than a Trip */}
          <div className="hidden md:flex flex-col items-end pr-4 pt-1">
            <div
              className="text-white text-2xl xl:text-3xl leading-tight text-right drop-shadow-lg"
              style={{ fontFamily: 'Georgia, "Brush Script MT", cursive, serif' }}
            >
              <p className="italic">More</p>
              <p className="italic">Than a Trip</p>
            </div>
          </div>
        </div>

        {/* Bottom Right Action: Chỉnh sửa ảnh bìa */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onEditCover}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 sm:py-2 rounded-lg bg-white/95 hover:bg-white text-slate-800 text-xs font-semibold shadow-md backdrop-blur-xs transition-all active:scale-95 hover:shadow-lg"
          >
            <Camera className="w-4 h-4 text-slate-700" />
            <span>Chỉnh sửa ảnh bìa</span>
          </button>
        </div>
      </div>
    </section>
  )
}
