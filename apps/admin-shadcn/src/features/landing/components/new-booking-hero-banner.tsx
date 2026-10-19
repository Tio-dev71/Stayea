"use client"

import Image from "next/image"

export function NewBookingHeroBanner() {
  return (
    <section className="relative w-full h-[220px] sm:h-[250px] md:h-[270px] overflow-hidden bg-slate-900 select-none">
      {/* 1. Background Cover Panorama */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/profile/profile-hero-banner.jpg"
          alt="STAYEA New Booking Cover"
          fill
          unoptimized
          priority
          className="object-cover object-center"
        />
        {/* Gradients for Optimal Contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-black/30 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* 2. Banner Content Container */}
      <div className="relative z-10 w-full h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center text-white">
        <div className="flex items-center justify-between">
          {/* Left Title & Subtitle */}
          <div className="space-y-1.5 max-w-xl">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white drop-shadow-md">
              Bắt đầu hành trình mới cùng STAYEA
            </h1>
            <p className="text-white/95 text-xs sm:text-sm md:text-[15px] font-normal drop-shadow-sm leading-relaxed">
              Khám phá Phú Quốc theo cách của riêng bạn
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
