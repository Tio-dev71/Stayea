"use client"

import { FileEdit, MessageSquare, FileCheck, Send, ChevronRight, ArrowRight } from "lucide-react"
import type { PartnerProcessStep } from "@/features/landing/data/stayea-mock-data"
import { PARTNER_PROCESS_STEPS } from "@/features/landing/data/stayea-mock-data"

function getProcessIcon(iconName: string) {
  switch (iconName) {
    case "fileedit":
      return <FileEdit className="w-5 h-5 text-[#c69a58]" />
    case "message":
      return <MessageSquare className="w-5 h-5 text-[#c69a58]" />
    case "filecheck":
      return <FileCheck className="w-5 h-5 text-[#c69a58]" />
    case "send":
      return <Send className="w-5 h-5 text-[#c69a58]" />
    default:
      return <FileEdit className="w-5 h-5 text-[#c69a58]" />
  }
}

export function PartnerProcess() {
  return (
    <section className="py-12 sm:py-16 bg-[#f8fafb] border-t border-slate-200/60">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-slate-200/80">
          <h2 className="font-sans text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Quy trình hợp tác rõ ràng, dễ bắt đầu
          </h2>

          <a
            href="#partner-register-form"
            className="text-xs sm:text-[13px] font-semibold text-[#0c3b40] hover:text-[#082b30] inline-flex items-center gap-1.5 group self-start sm:self-auto transition-colors"
          >
            <span>Chỉ 4 bước để cùng nhau tạo nên những hành trình tuyệt vời</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>

        {/* 4 Process Cards Row with connecting chevrons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 pt-6 relative">
          {PARTNER_PROCESS_STEPS.map((item: PartnerProcessStep, idx: number) => (
            <div key={item.step} className="relative group">
              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 space-y-3.5 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between h-full">
                {/* Step badge & icon */}
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-full bg-[#f8fafb] border border-[#c69a58]/30 font-sans text-xs font-bold text-[#c69a58] flex items-center justify-center shrink-0">
                    {item.step}
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-[#c69a58]/10 flex items-center justify-center shrink-0">
                    {getProcessIcon(item.iconName)}
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-1.5 flex-grow">
                  <h3 className="font-sans text-sm sm:text-[14.5px] font-bold text-slate-900 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-[12px] text-slate-500 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Connecting Chevron (Desktop only, between cards) */}
              {idx < PARTNER_PROCESS_STEPS.length - 1 && (
                <div className="hidden lg:flex absolute -right-2.5 top-1/2 -translate-y-1/2 z-10 w-5 h-5 rounded-full bg-white border border-slate-200 shadow-2xs items-center justify-center text-slate-400 pointer-events-none">
                  <ChevronRight className="w-3 h-3 stroke-[2.5]" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
