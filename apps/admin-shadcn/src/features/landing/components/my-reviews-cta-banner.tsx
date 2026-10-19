"use client"

import { ArrowRight } from "lucide-react"

interface MyReviewsCtaBannerProps {
  readonly onWriteReviewClick: () => void
}

export function MyReviewsCtaBanner({
  onWriteReviewClick,
}: MyReviewsCtaBannerProps) {
  return (
    <section className="bg-[#EDF4FB] border border-[#D5E5F5] rounded-2xl p-5 sm:p-6 shadow-2xs">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Left Info with Heart Icon */}
        <div className="flex items-center gap-3.5 sm:gap-4">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white shadow-2xs flex items-center justify-center shrink-0">
            <span className="text-xl sm:text-2xl leading-none select-none text-rose-500" role="img" aria-label="heart">
              ❤️
            </span>
          </div>

          <div className="space-y-0.5">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
              Chia sẻ thêm trải nghiệm của bạn
            </h3>
            <p className="text-xs sm:text-[13px] text-slate-500 leading-relaxed">
              Mỗi đánh giá của bạn đều giúp cộng đồng du khách có những lựa chọn tốt hơn, và truyền cảm hứng cho những chuyến đi tiếp theo.
            </p>
          </div>
        </div>

        {/* Right CTA Button */}
        <div className="shrink-0 self-end sm:self-center">
          <button
            type="button"
            onClick={onWriteReviewClick}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#0A2239] hover:bg-[#12365A] text-white text-xs sm:text-sm font-semibold shadow-2xs transition-all active:scale-95 group"
          >
            <span>Viết đánh giá mới</span>
            <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  )
}
