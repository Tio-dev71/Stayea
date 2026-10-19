"use client"

import * as React from "react"
import { ChevronDown, ArrowRight } from "lucide-react"
import type { HostFaqItem } from "@/features/landing/data/stayea-mock-data"
import { HOST_FAQS } from "@/features/landing/data/stayea-mock-data"

export function HostFaq() {
  const [openFaqId, setOpenFaqId] = React.useState<string | null>(null)

  function toggleFaq(id: string) {
    setOpenFaqId(openFaqId === id ? null : id)
  }

  return (
    <section className="py-12 sm:py-16 bg-[#f8fafb] border-t border-slate-200/70">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-6 border-b border-slate-200/80">
          <div className="space-y-1">
            <span className="inline-block text-[11px] font-bold uppercase tracking-[0.22em] text-[#0c3b40]">
              CÂU HỎI THƯỜNG GẶP
            </span>
            <h2 className="font-sans text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Bạn còn thắc mắc? Chúng tôi có câu trả lời.
            </h2>
          </div>

          <a
            href="#faq"
            className="text-xs font-semibold text-[#0c3b40] hover:text-[#082b30] inline-flex items-center gap-1 group self-start sm:self-end"
          >
            <span>Xem tất cả câu hỏi thường gặp</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>

        {/* 4 FAQ Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 pt-6">
          {HOST_FAQS.map((item: HostFaqItem) => {
            const isOpen = openFaqId === item.id
            return (
              <div
                key={item.id}
                onClick={() => toggleFaq(item.id)}
                className={`rounded-2xl border transition-all cursor-pointer p-4 flex flex-col justify-between ${
                  isOpen
                    ? "bg-white border-[#0c3b40] shadow-sm ring-1 ring-[#0c3b40]/20"
                    : "bg-white border-slate-200/80 hover:border-slate-300 hover:shadow-xs"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-sans text-xs sm:text-[12.5px] font-bold text-slate-800 leading-snug">
                    {item.question}
                  </h3>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 mt-0.5 ${
                      isOpen ? "rotate-180 text-[#0c3b40]" : ""
                    }`}
                  />
                </div>

                {isOpen && (
                  <p className="text-xs text-slate-600 leading-relaxed pt-2.5 mt-2.5 border-t border-slate-100 animate-in fade-in-50">
                    {item.answer}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
