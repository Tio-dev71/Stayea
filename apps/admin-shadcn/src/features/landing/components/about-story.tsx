"use client"

import Image from "next/image"
import { Play } from "lucide-react"
import { ABOUT_PAGE_DATA } from "@/features/landing/data/stayea-mock-data"

export function AboutStory() {
  const { story } = ABOUT_PAGE_DATA

  return (
    <section id="story" className="relative py-16 sm:py-20 lg:py-24 bg-white overflow-hidden">
      {/* Background Palm Leaf Watermark */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 opacity-[0.03] pointer-events-none select-none text-[#0c3b40]">
        <svg viewBox="0 0 200 200" fill="currentColor" className="w-full h-full">
          <path d="M100 190 C100 120, 140 80, 190 60 C140 75, 115 105, 105 130 C130 90, 160 50, 180 10 C145 35, 120 70, 105 105 C115 65, 130 30, 140 0 C115 25, 95 65, 95 100 C85 60, 75 25, 60 0 C70 30, 85 65, 95 105 C80 70, 55 35, 20 10 C40 50, 70 90, 95 130 C85 105, 60 75, 10 60 C60 80, 100 120, 100 190 Z" />
        </svg>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          {/* Left Column: Visual Story Card with Video CTA */}
          <div className="lg:col-span-5 relative">
            <div className="relative h-[340px] sm:h-[420px] rounded-3xl overflow-hidden shadow-lg group">
              <Image
                src={story.imageUrl}
                alt="Câu chuyện Stayea Phú Quốc"
                fill
                unoptimized
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 1024px) 100vw, 45vw"
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

              {/* Bottom Overlay: Calligraphy & Video Pill Button */}
              <div className="absolute bottom-6 left-6 right-6 space-y-3">
                <p className="font-serif italic text-xl sm:text-2xl text-[#f3dfa2] drop-shadow font-normal">
                  {story.videoBadge}
                </p>
                <button
                  type="button"
                  className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-white text-xs font-medium border border-white/20 transition-all shadow-md group/btn"
                >
                  <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-slate-900 group-hover/btn:scale-110 transition-transform">
                    <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
                  </div>
                  <span>{story.videoText}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Narrative Story Text */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-5">
            <span className="inline-block text-[11px] font-bold uppercase tracking-[0.2em] text-[#0c3b40]">
              {story.kicker}
            </span>

            <h2 className="font-sans text-2xl sm:text-3xl lg:text-[34px] font-bold text-slate-900 tracking-tight leading-[1.25]">
              {story.title}
            </h2>

            <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              {story.paragraphs.map((p) => (
                <p key={p.slice(0, 30)}>{p}</p>
              ))}
            </div>

            {/* Quote with Gold Accent Bar */}
            <div className="pt-3 border-l-2 border-[#c59b27] pl-4 sm:pl-5 my-2">
              <p className="text-xs sm:text-sm font-medium italic text-[#996515] leading-relaxed">
                {story.quote}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
