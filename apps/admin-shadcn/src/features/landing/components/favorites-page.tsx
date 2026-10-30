"use client"

import * as React from "react"
import Image from "next/image"
import {
  Heart,
  Calendar,
  MapPin,
  Star,
  Users,
  Bed,
  Ticket,
  ExternalLink,
  Trash2,
  RotateCcw,
  Share2,
  Check,
  AlertCircle,
  X,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@workspace/ui/components/dialog"
import { ProfileSidebar } from "./profile-sidebar"
import { FavoritesHeroBanner } from "./favorites-hero-banner"
import { FavoritesHeaderAndTabs } from "./favorites-header-and-tabs"
import { FavoritesGrid } from "./favorites-grid"
import { FavoritesDiscoveryBanner } from "./favorites-discovery-banner"
import { stayeaApi } from "@/lib/stayea-api-service"
import { FAVORITE_ITEMS } from "@/features/landing/data/stayea-mock-data"
import type {
  FavoriteItem,
  FavoriteItemCategory,
  FavoriteCategoryTab,
} from "@/features/landing/data/stayea-mock-data"

interface FavoritesPageProps {
  readonly onNavigate?: (route: string, subCategory?: string, itemData?: any) => void
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("vi-VN").format(amount) + "đ"
}

export function FavoritesPage({ onNavigate }: FavoritesPageProps) {
  // 1. Filter Category State
  const [activeCategory, setActiveCategory] = React.useState<FavoriteItemCategory>("all")

  // 2. Favorite items state
  const [favoriteList, setFavoriteList] = React.useState<readonly FavoriteItem[]>(FAVORITE_ITEMS)
  const [lastRemovedItem, setLastRemovedItem] = React.useState<FavoriteItem | null>(null)

  React.useEffect(() => {
    stayeaApi
      .getUserFavorites()
      .then((raw) => {
        if (Array.isArray(raw) && raw.length > 0) {
          const mapped: FavoriteItem[] = raw.map((f: any) => ({
            id: f.id || f.itemId,
            title: f.title || "Địa điểm yêu thích",
            category: (f.itemType || "stay") as FavoriteItemCategory,
            categoryLabel:
              f.itemType === "experience"
                ? "Trải nghiệm"
                : f.itemType === "transport"
                  ? "Di chuyển"
                  : "Lưu trú",
            categoryVariant:
              f.itemType === "experience"
                ? "emerald"
                : f.itemType === "transport"
                  ? "amber"
                  : "purple",
            rating: Number(f.rating) || 5.0,
            reviewsCount: `${f.reviewsCount || 0} đánh giá`,
            dateOrDuration: f.dateOrDuration || "Linh hoạt",
            location: f.location || "Phú Quốc",
            extraDetail: f.extraDetail || "Chi tiết dịch vụ",
            extraDetailIcon: "bed",
            price: Number(f.price || 0),
            priceUnit: f.priceUnit || "",
            imageUrl: f.imageUrl || "/profile/bai-sao.jpg",
            targetRoute: f.itemType || "stay",
          }))
          setFavoriteList(mapped)
        } else {
          setFavoriteList([])
        }
      })
      .catch(() => {
        setFavoriteList([])
      })
  }, [])

  // 3. Modals state
  const [selectedItemForDetail, setSelectedItemForDetail] = React.useState<FavoriteItem | null>(null)
  const [isManageModalOpen, setIsManageModalOpen] = React.useState<boolean>(false)

  // 4. Toast feedback state
  const [toastMessage, setToastMessage] = React.useState<string | null>(null)
  const [toastType, setToastType] = React.useState<"success" | "info" | "undo">("info")
  const toastTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)

  const showToast = React.useCallback(
    (message: string, type: "success" | "info" | "undo" = "info") => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current)
      }
      setToastMessage(message)
      setToastType(type)
      toastTimeoutRef.current = setTimeout(() => {
        setToastMessage(null)
      }, 4500)
    },
    []
  )

  // Compute dynamic tabs based on favoriteList
  const computedTabs = React.useMemo<readonly FavoriteCategoryTab[]>(() => {
    const stayCount = favoriteList.filter((it) => it.category === "stay").length
    const expCount = favoriteList.filter((it) => it.category === "experience").length
    const transCount = favoriteList.filter((it) => it.category === "transport").length

    return [
      { id: "all", label: "Tất cả", count: favoriteList.length },
      { id: "stay", label: "Lưu trú", count: stayCount },
      { id: "experience", label: "Trải nghiệm", count: expCount },
      { id: "transport", label: "Di chuyển", count: transCount },
    ]
  }, [favoriteList])

  // Filter items
  const filteredItems = React.useMemo(() => {
    if (activeCategory === "all") return favoriteList
    return favoriteList.filter((it) => it.category === activeCategory)
  }, [favoriteList, activeCategory])

  // Handlers
  function handleRemoveFavorite(item: FavoriteItem) {
    setFavoriteList((prev) => prev.filter((it) => it.id !== item.id))
    setLastRemovedItem(item)
    showToast(`Đã bỏ "${item.title}" khỏi danh sách yêu thích`, "undo")
  }

  function handleUndoRemove() {
    if (lastRemovedItem) {
      setFavoriteList((prev) => [lastRemovedItem, ...prev])
      setLastRemovedItem(null)
      showToast(`Đã khôi phục "${lastRemovedItem.title}" vào mục yêu thích`, "success")
    }
  }

  function handleResetFavorites() {
    setFavoriteList(FAVORITE_ITEMS)
    setIsManageModalOpen(false)
    showToast("Đã khôi phục danh sách yêu thích mặc định (5 mục)", "success")
  }

  function handleClearAllFavorites() {
    setFavoriteList([])
    setIsManageModalOpen(false)
    showToast("Đã làm trống toàn bộ danh sách yêu thích", "info")
  }

  function handleShareWishlist() {
    if (typeof window !== "undefined" && navigator?.clipboard) {
      navigator.clipboard.writeText(window.location.href)
      showToast("Đã sao chép liên kết danh sách yêu thích vào bộ nhớ tạm!", "success")
    } else {
      showToast("Liên kết danh sách yêu thích đã sẵn sàng chia sẻ!", "success")
    }
  }

  function handleSelectSidebarTab(tabId: string) {
    if (tabId === "favorites") {
      // already on favorites
      return
    }
    if (tabId === "deals" || tabId === "my-deals") {
      onNavigate?.("my-deals")
      return
    }
    if (tabId === "staya-club" || tabId === "stayea-club") {
      onNavigate?.("stayea-club")
      return
    }
    if (tabId === "settings" || tabId === "cai-dat") {
      onNavigate?.("settings")
      return
    }
    onNavigate?.(tabId)
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* 1. Hero Panorama Banner */}
      <FavoritesHeroBanner />

      {/* 2. Main 2-Column Dashboard Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
          {/* Left Sidebar Menu */}
          <ProfileSidebar
            activeTab="favorites"
            hideBadges
            onSelectTab={handleSelectSidebarTab}
            onLogout={() => {
              showToast("Đã đăng xuất thành công!", "info")
              setTimeout(() => onNavigate?.("login"), 600)
            }}
          />

          {/* Right Main Content Area */}
          <div className="flex-1 w-full space-y-6">
            {/* Header + Category Tabs */}
            <FavoritesHeaderAndTabs
              activeCategory={activeCategory}
              tabs={computedTabs}
              onSelectCategory={setActiveCategory}
              onOpenManageModal={() => setIsManageModalOpen(true)}
            />

            {/* Favorites 3-Column Grid */}
            <FavoritesGrid
              items={filteredItems}
              onRemoveFavorite={handleRemoveFavorite}
              onViewDetails={(item) => setSelectedItemForDetail(item)}
              onResetFilter={() => setActiveCategory("all")}
            />

            {/* Bottom Discovery Callout */}
            <FavoritesDiscoveryBanner
              onExploreClick={() => {
                onNavigate?.("new-booking")
              }}
            />
          </div>
        </div>
      </div>

      {/* 3. Toast Notification Pill */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-3 duration-300">
          <div className="bg-[#0A2239] text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-700/60 max-w-md">
            <span className="text-sm shrink-0">
              {toastType === "success" ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : toastType === "undo" ? (
                <Heart className="w-4 h-4 text-rose-400" />
              ) : (
                <AlertCircle className="w-4 h-4 text-sky-400" />
              )}
            </span>

            <p className="text-xs sm:text-sm font-medium flex-1">{toastMessage}</p>

            {toastType === "undo" && lastRemovedItem && (
              <button
                type="button"
                onClick={handleUndoRemove}
                className="shrink-0 text-xs font-bold text-amber-300 hover:text-amber-200 underline ml-2 cursor-pointer"
              >
                Hoàn tác
              </button>
            )}

            <button
              type="button"
              onClick={() => setToastMessage(null)}
              className="text-slate-400 hover:text-white shrink-0"
              aria-label="Đóng"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 4. Modal Chi tiết Mục Yêu thích */}
      <Dialog
        open={Boolean(selectedItemForDetail)}
        onOpenChange={(open) => {
          if (!open) setSelectedItemForDetail(null)
        }}
      >
        <DialogContent className="sm:max-w-xl p-0 overflow-hidden rounded-2xl">
          {selectedItemForDetail && (
            <div>
              {/* Image banner */}
              <div className="relative w-full h-52 sm:h-60 bg-slate-900">
                <Image
                  src={selectedItemForDetail.imageUrl}
                  alt={selectedItemForDetail.title}
                  fill
                  unoptimized
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                <div className="absolute top-4 left-4 z-10">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/95 text-slate-900 backdrop-blur-xs shadow-xs">
                    {selectedItemForDetail.categoryLabel}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4 z-10 text-white">
                  <h3 className="text-lg sm:text-xl font-bold drop-shadow-md">
                    {selectedItemForDetail.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-white/90 mt-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="font-bold">{selectedItemForDetail.rating}</span>
                    <span>({selectedItemForDetail.reviewsCount})</span>
                  </div>
                </div>
              </div>

              {/* Details Body */}
              <div className="p-5 sm:p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span>{selectedItemForDetail.dateOrDuration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span>{selectedItemForDetail.location}</span>
                  </div>
                  <div className="flex items-center gap-2 sm:col-span-2">
                    {selectedItemForDetail.extraDetailIcon === "bed" ? (
                      <Bed className="w-4 h-4 text-slate-400" />
                    ) : selectedItemForDetail.extraDetailIcon === "ticket" ? (
                      <Ticket className="w-4 h-4 text-slate-400" />
                    ) : (
                      <Users className="w-4 h-4 text-slate-400" />
                    )}
                    <span>{selectedItemForDetail.extraDetail}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <div>
                    <span className="text-xs text-slate-400">Giá tham khảo</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-extrabold text-[#0A2239]">
                        {formatCurrency(selectedItemForDetail.price)}
                      </span>
                      <span className="text-xs text-slate-500">
                        {selectedItemForDetail.priceUnit}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        handleRemoveFavorite(selectedItemForDetail)
                        setSelectedItemForDetail(null)
                      }}
                      className="px-3.5 py-2 rounded-xl border border-slate-200 text-slate-600 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 text-xs font-semibold transition-all"
                    >
                      Bỏ lưu
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const it = selectedItemForDetail
                        setSelectedItemForDetail(null)
                        const sType = it.category === "stay" ? "stay" : it.category === "experience" ? "experience" : it.category === "transport" ? "transport" : "stay"
                        onNavigate?.("service-detail", undefined, { type: sType, item: it })
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0c3b40] text-white hover:bg-[#072528] text-xs font-semibold shadow-2xs transition-all"
                    >
                      <span>Xem chi tiết</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 5. Modal Quản lý Yêu thích */}
      <Dialog open={isManageModalOpen} onOpenChange={setIsManageModalOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
              <span>Quản lý danh sách yêu thích</span>
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm text-slate-500">
              Quản lý các chuyến đi, dịch vụ và trải nghiệm bạn đã lưu trữ trên STAYEA.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-3">
            {/* Action 1: Chia sẻ danh sách */}
            <button
              type="button"
              onClick={handleShareWishlist}
              className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all text-left group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                  <Share2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-semibold text-slate-900 group-hover:text-[#0A2239]">
                    Sao chép liên kết chia sẻ
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Gửi danh sách yêu thích cho bạn bè hoặc người đồng hành
                  </p>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
            </button>

            {/* Action 2: Khôi phục về mặc định */}
            <button
              type="button"
              onClick={handleResetFavorites}
              className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all text-left group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <RotateCcw className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-semibold text-slate-900 group-hover:text-emerald-700">
                    Khôi phục danh sách mẫu (5 mục)
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Nạp lại đầy đủ 5 dịch vụ Phú Quốc tiêu biểu theo thiết kế
                  </p>
                </div>
              </div>
            </button>

            {/* Action 3: Xóa tất cả */}
            <button
              type="button"
              onClick={handleClearAllFavorites}
              className="w-full flex items-center justify-between p-3.5 rounded-xl border border-rose-200 bg-rose-50/40 hover:bg-rose-50 transition-all text-left group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                  <Trash2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-semibold text-rose-700">
                    Xóa tất cả mục đã lưu
                  </h4>
                  <p className="text-[11px] text-rose-500">
                    Làm trống danh sách yêu thích của bạn
                  </p>
                </div>
              </div>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
