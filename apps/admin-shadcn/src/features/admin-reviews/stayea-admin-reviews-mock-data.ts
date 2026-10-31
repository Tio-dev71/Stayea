export interface ReviewKpiItem {
  id: string
  title: string
  value: string
  trendPercent: string
  trendLabel: string
  isPositive: boolean
  icon: "star" | "total" | "positive" | "new"
  colorTheme: "yellow" | "blue" | "green" | "purple"
}

export interface ReviewItem {
  id: string
  customerName: string
  customerAvatar: string
  tourTitle: string
  tourLocation: string
  tourImage: string
  category?: string
  rating: number // 1 to 5
  content: string
  reviewDate: string
  status: "displayed" | "replied" | "pending"
  statusLabel: string
  replyText?: string
  repliedAt?: string
}

export interface RatingDistributionSlice {
  stars: number
  label: string
  percentage: number
  count: number
  color: string
}

export interface CategoryReviewCountItem {
  id: string
  name: string
  icon: "island" | "monument" | "food" | "sport" | "culture" | "wellness" | "other"
  percentage: number
  count: number
}

export interface LocationReviewCountItem {
  id: string
  rank: number
  city: string
  reviewCountFormatted: string
  imageUrl: string
}

export interface ReviewQuickActionItem {
  id: string
  title: string
  icon: "new-reviews" | "reply-pending" | "manage-reviews" | "review-policy"
}

export const MOCK_REVIEWS_KPIS: readonly ReviewKpiItem[] = [
  {
    id: "avg-rating",
    title: "Đánh giá trung bình",
    value: "0.0/5",
    trendPercent: "0%",
    trendLabel: "chưa có đánh giá",
    isPositive: true,
    icon: "star",
    colorTheme: "yellow",
  },
  {
    id: "total-reviews",
    title: "Tổng số đánh giá",
    value: "0",
    trendPercent: "0%",
    trendLabel: "dữ liệu thực tế",
    isPositive: true,
    icon: "total",
    colorTheme: "blue",
  },
  {
    id: "positive-rate",
    title: "Đánh giá tích cực",
    value: "0%",
    trendPercent: "0%",
    trendLabel: "chưa có dữ liệu",
    isPositive: true,
    icon: "positive",
    colorTheme: "green",
  },
  {
    id: "new-reviews",
    title: "Đánh giá mới",
    value: "0",
    trendPercent: "0%",
    trendLabel: "tuần này",
    isPositive: true,
    icon: "new",
    colorTheme: "purple",
  },
]

export const MOCK_RATING_DISTRIBUTION: RatingDistributionSlice[] = []

export const MOCK_CATEGORY_REVIEWS: CategoryReviewCountItem[] = []

export const MOCK_LOCATION_REVIEWS: LocationReviewCountItem[] = []

export const MOCK_REVIEWS_LIST: ReviewItem[] = []

export const MOCK_REVIEW_QUICK_ACTIONS: ReviewQuickActionItem[] = [
  {
    id: "new-reviews",
    title: "Xem đánh giá mới",
    icon: "new-reviews",
  },
  {
    id: "reply-pending",
    title: "Trả lời đánh giá",
    icon: "reply-pending",
  },
  {
    id: "manage-reviews",
    title: "Quản lý đánh giá",
    icon: "manage-reviews",
  },
  {
    id: "review-policy",
    title: "Thiết lập chính sách đánh giá",
    icon: "review-policy",
  },
]
