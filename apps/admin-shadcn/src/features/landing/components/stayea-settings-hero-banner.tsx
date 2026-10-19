"use client"

import * as React from "react"
import Image from "next/image"

export const StayeaSettingsHeroBanner: React.FC = () => {
  return (
    <section className="relative w-full h-[200px] sm:h-[230px] md:h-[250px] overflow-hidden bg-slate-900 select-none">
      {/* 1. Background Cover Panorama with Tropical Island & Beach */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/homepagemainbanner.png"
          alt="STAYEA Cài đặt Cover"
          fill
          unoptimized
          priority
          className="object-cover object-center"
        />
        {/* Subtle dark gradient overlay for crystal clear contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-950/60 via-blue-900/30 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* 2. Banner Content Container */}
      <div className="relative z-10 w-full h-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center text-white">
        <div className="flex items-center justify-between">
          {/* Left Title & Subtitle */}
          <div className="space-y-1.5 max-w-xl">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white drop-shadow-md">
              Cài đặt
            </h1>
            <p className="text-white/95 text-xs sm:text-sm md:text-base font-normal drop-shadow-sm leading-relaxed">
              Quản lý tài khoản, bảo mật và tùy chọn trải nghiệm của bạn tại STAYEA.
            </p>
          </div>

          {/* Right Cursive Calligraphy: More Than a Trip ♡ */}
          <div className="hidden md:flex flex-col items-end pr-4">
            <div
              className="text-white text-2xl xl:text-3xl leading-tight text-right drop-shadow-lg"
              style={{ fontFamily: 'Georgia, "Brush Script MT", cursive, serif' }}
            >
              <p className="italic">More</p>
              <p className="italic flex items-center gap-1.5 justify-end">
                <span>Than a Trip</span>
                <span className="text-xl">♡</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
