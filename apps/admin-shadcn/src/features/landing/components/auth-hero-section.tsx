"use client"

import Image from "next/image"
import { Star, Heart, ShoppingBag } from "lucide-react"
import { AuthCard } from "./auth-card"

interface AuthHeroSectionProps {
  readonly initialMode?: "login" | "register"
  readonly onAuthSuccess?: (user: string) => void
  readonly onForgotPassword?: () => void
}

export function AuthHeroSection({
  initialMode = "login",
  onAuthSuccess,
  onForgotPassword,
}: AuthHeroSectionProps) {
  return (
    <section className="relative w-full min-h-[760px] lg:min-h-[860px] pt-24 pb-16 lg:py-20 flex items-center justify-center overflow-hidden bg-slate-900 text-white">
      {/* 1. Background Image: Luxury Villa Infinity Pool (Mirrored so ocean is on left, pool on right like reference) */}
      <div className="absolute inset-0 z-0">
        <div className="relative w-full h-full -scale-x-100">
          <Image
            src="/auth/auth-villa-bg.jpg"
            alt="STAYEA Luxury Resort & Villa"
            fill
            unoptimized
            priority
            className="object-cover object-center"
          />
        </div>
        {/* Soft Vignette Overlay for perfect readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/35 via-black/10 to-black/40 pointer-events-none" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          {/* Left Side: Cursive Calligraphy over Ocean/Sky */}
          <div className="hidden lg:flex lg:col-span-3 flex-col justify-center select-none pointer-events-none pl-6">
            <div
              className="text-white text-3xl xl:text-4xl leading-tight drop-shadow-lg"
              style={{ fontFamily: 'Georgia, "Brush Script MT", cursive, serif' }}
            >
              <p className="italic">More</p>
              <p className="italic">Than a Trip</p>
              <p className="italic mt-2">More</p>
              <p className="italic">Than a Stay</p>
              <p className="text-2xl mt-3 text-white">♡</p>
            </div>
          </div>

          {/* Center Column: The Authentic Auth Card */}
          <div className="lg:col-span-6 flex justify-center">
            <AuthCard
              initialMode={initialMode}
              onAuthSuccess={onAuthSuccess}
              onForgotPassword={onForgotPassword}
            />
          </div>

          {/* Right Side: Quote & 3 Benefit Pillars over Pool/Villa */}
          <div className="hidden lg:flex lg:col-span-3 flex-col justify-center space-y-7 pr-6 select-none">
            {/* Top Quote */}
            <div className="max-w-[260px]">
              <p className="text-white font-bold text-base xl:text-lg leading-snug drop-shadow-md">
                “Những hành trình đẹp hơn bắt đầu từ đây”
              </p>
            </div>

            {/* 3 Circular Glass Benefit Badges */}
            <div className="space-y-6">
              {/* Item 1: Star */}
              <div className="flex flex-col items-start gap-1.5">
                <div className="w-10 h-10 rounded-full border border-white/70 bg-white/10 backdrop-blur-xs flex items-center justify-center shadow-xs">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <div className="text-xs font-medium text-white leading-relaxed drop-shadow-md">
                  Lưu lịch trình
                  <br />
                  và kế hoạch chuyến đi
                </div>
              </div>

              {/* Item 2: Heart */}
              <div className="flex flex-col items-start gap-1.5">
                <div className="w-10 h-10 rounded-full border border-white/70 bg-white/10 backdrop-blur-xs flex items-center justify-center shadow-xs">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <div className="text-xs font-medium text-white leading-relaxed drop-shadow-md">
                  Nhận ưu đãi
                  <br />
                  dành riêng cho thành viên
                </div>
              </div>

              {/* Item 3: Bag */}
              <div className="flex flex-col items-start gap-1.5">
                <div className="w-10 h-10 rounded-full border border-white/70 bg-white/10 backdrop-blur-xs flex items-center justify-center shadow-xs">
                  <ShoppingBag className="w-5 h-5 text-white" />
                </div>
                <div className="text-xs font-medium text-white leading-relaxed drop-shadow-md">
                  Trải nghiệm cá nhân hóa
                  <br />
                  tiện lợi hơn
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
