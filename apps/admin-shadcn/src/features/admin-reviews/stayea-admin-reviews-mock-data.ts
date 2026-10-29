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

export const MOCK_RATING_DISTRIBUTION: RatingDistributionSlice[] = [
  {
    stars: 5,
    label: "5 sao",
    percentage: 71,
    count: 892,
    color: "#007a48",
  },
  {
    stars: 4,
    label: "4 sao",
    percentage: 18,
    count: 220,
    color: "#10b981",
  },
  {
    stars: 3,
    label: "3 sao",
    percentage: 7,
    count: 85,
    color: "#f59e0b",
  },
  {
    stars: 2,
    label: "2 sao",
    percentage: 3,
    count: 32,
    color: "#0284c7",
  },
  {
    stars: 1,
    label: "1 sao",
    percentage: 2,
    count: 19,
    color: "#ef4444",
  },
]

export const MOCK_CATEGORY_REVIEWS: CategoryReviewCountItem[] = [
  {
    id: "cat-island",
    name: "Tour biển đảo",
    icon: "island",
    percentage: 28,
    count: 349,
  },
  {
    id: "cat-sightseeing",
    name: "Tham quan",
    icon: "monument",
    percentage: 22,
    count: 275,
  },
  {
    id: "cat-cuisine",
    name: "Ẩm thực",
    icon: "food",
    percentage: 15,
    count: 187,
  },
  {
    id: "cat-watersport",
    name: "Thể thao biển",
    icon: "sport",
    percentage: 12,
    count: 150,
  },
  {
    id: "cat-culture",
    name: "Văn hóa",
    icon: "culture",
    percentage: 10,
    count: 124,
  },
  {
    id: "cat-wellness",
    name: "Wellness",
    icon: "wellness",
    percentage: 8,
    count: 99,
  },
  {
    id: "cat-other",
    name: "Khác",
    icon: "other",
    percentage: 5,
    count: 64,
  },
]

export const MOCK_LOCATION_REVIEWS: LocationReviewCountItem[] = [
  {
    id: "loc-pq",
    rank: 1,
    city: "Phú Quốc",
    reviewCountFormatted: "562 đánh giá",
    imageUrl: "/phu-quoc/hero-phu-quoc.jpg",
  },
  {
    id: "loc-hn",
    rank: 2,
    city: "Hà Nội",
    reviewCountFormatted: "318 đánh giá",
    imageUrl: "/stay/famiana-resort.jpg",
  },
  {
    id: "loc-dn",
    rank: 3,
    city: "Đà Nẵng",
    reviewCountFormatted: "186 đánh giá",
    imageUrl: "/stay/lahana-villa.jpg",
  },
  {
    id: "loc-nt",
    rank: 4,
    city: "Nha Trang",
    reviewCountFormatted: "98 đánh giá",
    imageUrl: "/stay/mango-bay.jpg",
  },
  {
    id: "loc-dl",
    rank: 5,
    city: "Đà Lạt",
    reviewCountFormatted: "98 đánh giá",
    imageUrl: "/stay/tropical-garden.jpg",
  },
]

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
