"use client"

import { User, MessagesSquare, Upload, TrendingUp, ChevronRight } from "lucide-react"
import type { HostProcessStep } from "@/features/landing/data/stayea-mock-data"
import { HOST_PROCESS_STEPS } from "@/features/landing/data/stayea-mock-data"

function getProcessIcon(iconName: string) {
  switch (iconName) {
    case "user":
      return <User className="w-5 h-5 text-[#c69a58]" />
    case "messages":
      return <MessagesSquare className="w-5 h-5 text-[#c69a58]" />
    case "upload":
      return <Upload className="w-5 h-5 text-[#c69a58]" />
    case "trending":
      return <TrendingUp className="w-5 h-5 text-[#c69a58]" />
    default:
      return <User className="w-5 h-5 text-[#c69a58]" />
  }
}

export function HostProcess() {
  return (
    <section className="py-14 sm:py-18 lg:py-20 bg-[#f8fafb] relative overflow-hidden">
      {/* Subtle Tropical Leaves Watermarks */}
      <div className="absolute -top-12 -left-12 w-64 h-64 opacity-[0.035] pointer-events-none select-none text-[#0c3b40]">
        <svg viewBox="0 0 200 200" fill="currentColor" className="w-full h-full">
          <path d="M100 190 C100 120, 140 80, 190 60 C140 75, 115 105, 105 130 C130 90, 160 50, 180 10 C145 35, 120 70, 105 105 C115 65, 130 30, 140 0 C115 25, 95 65, 95 100 C85 60, 75 25, 60 0 C70 30, 85 65, 95 105 C80 70, 55 35, 20 10 C40 50, 70 90, 95 130 C85 105, 60 75, 10 60 C60 80, 100 120, 100 190 Z" />
        </svg>
      </div>
      <div className="absolute -bottom-16 -right-16 w-72 h-72 opacity-[0.035] pointer-events-none select-none text-[#0c3b40] rotate-180">
        <svg viewBox="0 0 200 200" fill="currentColor" className="w-full h-full">
          <path d="M100 190 C100 120, 140 80, 190 60 C140 75, 115 105, 105 130 C130 90, 160 50, 180 10 C145 35, 120 70, 105 105 C115 65, 130 30, 140 0 C115 25, 95 65, 95 100 C85 60, 75 25, 60 0 C70 30, 85 65, 95 105 C80 70, 55 35, 20 10 C40 50, 70 90, 95 130 C85 105, 60 75, 10 60 C60 80, 100 120, 100 190 Z" />
        </svg>
      </div>

      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-10">
          <div className="space-y-1.5">
            <span className="inline-block text-[11px] font-bold uppercase tracking-[0.22em] text-[#0c3b40]">
              ĐƠN GIẢN 4 BƯỚC, BẮT ĐẦU HÀNH TRÌNH CÙNG STAYEA
            </span>
            <h2 className="font-sans text-2xl sm:text-3xl lg:text-[34px] font-bold text-[#0c3b40] tracking-tight">
              Quy trình trở thành chủ nhà
            </h2>
            <p className="text-xs sm:text-[13px] text-slate-500">
              Chúng tôi giúp bạn bắt đầu dễ dàng, với sự đồng hành trong suốt quá trình.
            </p>
          </div>

          <div className="font-script-vi text-xl sm:text-2xl text-[#c69a58] -rotate-[2deg] self-start lg:self-end">
            &ldquo;Cùng bạn kiến tạo những hành trình ý nghĩa&rdquo;
          </div>
        </div>

        {/* 4-Step Cards Row with Flow Arrows */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 relative">
          {HOST_PROCESS_STEPS.map((item: HostProcessStep, index) => (
            <div key={item.step} className="relative group">
              <div className="h-full bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs hover:border-teal-200 hover:shadow-md transition-all flex flex-col justify-between">
                <div>
                  {/* Top: Step Badge & Connecting Arrow */}
                  <div className="flex items-center justify-between pb-3">
                    <span className="w-6 h-6 rounded-full bg-[#0c3b40] text-white text-xs font-bold flex items-center justify-center shrink-0">
                      {item.step}
                    </span>

                    {/* Step indicator arrow for lg screens */}
                    {index < HOST_PROCESS_STEPS.length - 1 && (
                      <div className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 z-20 w-6 h-6 rounded-full bg-white border border-slate-200 items-center justify-center text-slate-400 shadow-2xs">
                        <ChevronRight className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>

                  {/* Icon */}
                  <div className="w-10 h-10 rounded-xl bg-[#c69a58]/10 border border-[#c69a58]/20 flex items-center justify-center shrink-0 mb-3 group-hover:scale-105 transition-transform">
                    {getProcessIcon(item.iconName)}
                  </div>

                  <h3 className="font-sans text-sm sm:text-[14.5px] font-bold text-slate-900 tracking-tight leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-[12.5px] text-slate-500 leading-relaxed mt-1.5">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
