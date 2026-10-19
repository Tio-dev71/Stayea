"use client"

import Image from "next/image"
import Link from "next/link"
import { Calendar, Eye, ArrowRight } from "lucide-react"
import type { PhuQuocArticleItem } from "@/features/landing/data/stayea-mock-data"

interface PhuQuocArticleCardProps {
  readonly article: PhuQuocArticleItem
}

export function PhuQuocArticleCard({ article }: PhuQuocArticleCardProps) {
  return (
    <article className="group bg-white rounded-2xl border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.07)] hover:-translate-y-0.5 transition-all duration-200 overflow-hidden flex flex-col justify-between">
      <div>
        {/* Thumbnail Image Container */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
          <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />

          {/* Floating Category Badge */}
          <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/95 text-slate-800 backdrop-blur-xs shadow-xs tracking-wide">
            {article.category}
          </span>
        </div>

        {/* Content Body */}
        <div className="p-3.5 sm:p-4 space-y-2">
          {/* Title */}
          <h3 className="font-sans text-sm sm:text-[15px] font-bold text-slate-900 group-hover:text-[#0c3b40] transition-colors line-clamp-2 leading-snug">
            {article.title}
          </h3>

          {/* Excerpt */}
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {article.excerpt}
          </p>
        </div>
      </div>

      {/* Card Footer: Metadata (Date, Views) + CTA button */}
      <div className="px-3.5 sm:px-4 pb-3.5 sm:pb-4 pt-2.5 flex items-center justify-between border-t border-slate-50 text-[11px] text-slate-400">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 shrink-0" />
            <span>{article.date}</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5 shrink-0" />
            <span>{article.views}</span>
          </div>
        </div>

        <Link
          href={`#article-${article.id}`}
          aria-label={`Đọc bài viết: ${article.title}`}
          className="w-8 h-8 rounded-full bg-[#0c3b40] hover:bg-[#072528] text-white flex items-center justify-center shadow-xs transition-transform active:scale-95 group-hover:scale-105"
        >
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </article>
  )
}
