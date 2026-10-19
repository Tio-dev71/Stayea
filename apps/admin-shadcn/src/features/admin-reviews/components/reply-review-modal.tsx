"use client"

import { useState } from "react"
import Image from "next/image"
import { X, Star, MessageSquareReply, Send } from "lucide-react"
import type { ReviewItem } from "@/features/admin-reviews/stayea-admin-reviews-mock-data"

interface ReplyReviewModalProps {
  isOpen: boolean
  review: ReviewItem | null
  onClose: () => void
  onSubmitReply: (reviewId: string, replyText: string) => void
}

export function ReplyReviewModal({
  isOpen,
  review,
  onClose,
  onSubmitReply,
}: ReplyReviewModalProps) {
  const [replyText, setReplyText] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen || !review) return null

  const handleSubmit = () => {
    if (!replyText.trim()) return
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      onSubmitReply(review.id, replyText)
      setReplyText("")
      onClose()
    }, 500)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden text-slate-800">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#e8f7ee] text-[#007a48] flex items-center justify-center">
              <MessageSquareReply className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 leading-tight">
                Trả lời đánh giá
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Phản hồi sẽ được hiển thị công khai trên trang chi tiết trải nghiệm
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Customer Review Summary Box */}
        <div className="p-6 space-y-4 text-xs sm:text-sm">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2.5">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="relative w-8 h-8 rounded-full overflow-hidden border border-slate-200">
                  <Image
                    src={review.customerAvatar}
                    alt={review.customerName}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 leading-tight text-xs">
                    {review.customerName}
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-tight">
                    {review.tourTitle} • {review.reviewDate}
                  </p>
                </div>
              </div>

              {/* Stars */}
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-3.5 h-3.5 ${
                      s <= review.rating
                        ? "fill-amber-400 text-amber-500"
                        : "fill-slate-200 text-slate-300"
                    }`}
                  />
                ))}
              </div>
            </div>

            <p className="text-xs text-slate-600 italic bg-white p-3 rounded-xl border border-slate-200/60 leading-relaxed">
              &ldquo;{review.content}&rdquo;
            </p>
          </div>

          {/* Reply Form */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 block text-xs">
              Nội dung phản hồi từ Stayea
            </label>
            <textarea
              rows={4}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Cảm ơn quý khách đã trải nghiệm dịch vụ của Stayea..."
              className="w-full bg-slate-50/70 hover:bg-slate-50 focus:bg-white text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 rounded-xl p-3 border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-200/60 transition-colors"
          >
            Hủy
          </button>
          <button
            type="button"
            disabled={isSubmitting || !replyText.trim()}
            onClick={handleSubmit}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#007a48] hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50 text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Đang gửi...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Gửi phản hồi</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
