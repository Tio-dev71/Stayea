"use client"

export type ExperienceStatus = "active" | "pending" | "paused"

export interface ExperienceItem {
  id: string
  name: string
  tag?: {
    label: string
    variant: "rose" | "sky" | "teal" | "emerald" | "purple"
  }
  category: string
  location: string
  provider: string
  price: number
  status: ExperienceStatus
  rating: number
  reviewsCount: number
  image: string
}

export interface ExperienceKpiMetric {
  id: string
  title: string
  value: string
  trend: string
  trendLabel: string
  trendType: "up" | "down"
  icon: "compass" | "users" | "alert" | "star"
  color: "emerald" | "amber" | "rose" | "gold"
}

export interface ExperienceCategoryDistribution {
  name: string
  percentage: number
  count: number
  color: string
}

export interface PopularLocationItem {
  rank: number
  name: string
  count: number
  image: string
}

export interface QuickActionItem {
  id: string
  label: string
  icon: "user-plus" | "handshake" | "folder" | "settings" | "download"
}

export const EXPERIENCES_KPIS: readonly ExperienceKpiMetric[] = [
  {
    id: "total",
    title: "Tổng trải nghiệm / Tour",
    value: "2",
    trend: "+100%",
    trendLabel: "dữ liệu thực tế",
    trendType: "up",
    icon: "compass",
    color: "emerald",
  },
  {
    id: "active",
    title: "Đang hoạt động",
    value: "2",
    trend: "+100%",
    trendLabel: "sẵn sàng đặt",
    trendType: "up",
    icon: "users",
    color: "amber",
  },
  {
    id: "paused",
    title: "Tạm ngưng",
    value: "0",
    trend: "0%",
    trendLabel: "không có",
    trendType: "down",
    icon: "alert",
    color: "rose",
  },
  {
    id: "rating",
    title: "Đánh giá trung bình",
    value: "5.0/5",
    trend: "+0.1",
    trendLabel: "tiêu chuẩn cao",
    trendType: "up",
    icon: "star",
    color: "gold",
  },
]

export const EXPERIENCE_CATEGORY_DISTRIBUTION: readonly ExperienceCategoryDistribution[] = [
  { name: "Tour biển đảo", percentage: 28, count: 44, color: "#10b981" },
  { name: "Tham quan", percentage: 22, count: 34, color: "#ef4444" },
  { name: "Ẩm thực", percentage: 15, count: 23, color: "#f59e0b" },
  { name: "Thể thao biển", percentage: 14, count: 22, color: "#3b82f6" },
  { name: "Văn hóa", percentage: 10, count: 16, color: "#8b5cf6" },
  { name: "Wellness", percentage: 7, count: 11, color: "#06b6d4" },
  { name: "Khác", percentage: 4, count: 6, color: "#94a3b8" },
]

export const POPULAR_LOCATIONS: readonly PopularLocationItem[] = [
  { rank: 1, name: "Phú Quốc", count: 78, image: "/phu-quoc/hero-phu-quoc.jpg" },
  { rank: 2, name: "Hà Nội", count: 18, image: "/experience/tour-am-thuc.jpg" },
  { rank: 3, name: "Đà Nẵng", count: 15, image: "/deals/member-luxury.jpg" },
  { rank: 4, name: "Nha Trang", count: 12, image: "/experience/sunset-cruise.jpg" },
  { rank: 5, name: "Đà Lạt", count: 11, image: "/deals/tropical-deal.jpg" },
]

export const QUICK_ACTIONS: readonly QuickActionItem[] = [
  { id: "add_new", label: "Thêm trải nghiệm / Tour mới", icon: "user-plus" },
  { id: "partners", label: "Quản lý đối tác cung cấp", icon: "handshake" },
  { id: "categories", label: "Quản lý danh mục trải nghiệm", icon: "folder" },
  { id: "pricing", label: "Thiết lập chính sách giá", icon: "settings" },
  { id: "export", label: "Xuất danh sách trải nghiệm", icon: "download" },
]

export const MOCK_EXPERIENCES: ExperienceItem[] = []
