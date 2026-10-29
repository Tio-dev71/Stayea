"use client"

import Image from "next/image"
import { Heart, ArrowRight } from "lucide-react"
import type { FavoriteDestination } from "@/features/landing/data/stayea-mock-data"

interface ProfileFavoritesProps {
  readonly favorites: readonly FavoriteDestination[]
  readonly onToggleFavorite?: (id: string) => void
  readonly onSelectDestination?: (item: FavoriteDestination) => void
  readonly onViewAll?: () => void
}

export function ProfileFavorites({
  favorites,
  onToggleFavorite,
  onSelectDestination,
  onViewAll,
}: ProfileFavoritesProps) {
  return (
    <section className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-slate-800" />
          <h3 className="font-bold text-slate-900 text-base sm:text-lg tracking-tight">
            Địa điểm yêu thích
          </h3>
        </div>

        {favorites.length > 0 && (
          <button
            type="button"
            onClick={onViewAll}
            className="text-xs font-semibold text-[#1E3A8A] hover:underline inline-flex items-center gap-1 transition-colors"
          >
            <span>Xem tất cả</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {favorites.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 text-center space-y-2 shadow-xs">
          <div className="w-10 h-10 mx-auto rounded-full bg-rose-50 flex items-center justify-center text-rose-500">
            <Heart className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-semibold text-slate-800">
            Danh sách yêu thích trống
          </h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Nhấn vào biểu tượng trái tim khi xem bất kỳ Villa hoặc Trải nghiệm nào để lưu lại danh sách riêng của bạn.
          </p>
        </div>
      ) : (
        /* 4-Cards Grid */
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
          {favorites.map((item: FavoriteDestination) => (
            <div
              key={item.id}
              onClick={() => onSelectDestination?.(item)}
              className="group cursor-pointer"
            >
              {/* Image Container */}
              <div className="relative w-full h-32 sm:h-36 rounded-xl overflow-hidden bg-slate-100 shadow-2xs">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  unoptimized
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Heart Badge at Top Right */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onToggleFavorite?.(item.id)
                  }}
                  aria-label={`Bỏ yêu thích ${item.title}`}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 hover:bg-white text-rose-500 shadow-sm transition-transform active:scale-90 hover:scale-110"
                >
                  <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                </button>
              </div>

              {/* Title */}
              <h4 className="text-xs sm:text-sm font-semibold text-slate-900 group-hover:text-teal-700 transition-colors mt-2 text-center sm:text-left truncate">
                {item.title}
              </h4>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
