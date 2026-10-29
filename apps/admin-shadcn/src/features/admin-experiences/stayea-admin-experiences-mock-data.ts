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

export const MOCK_EXPERIENCES: ExperienceItem[] = [
  {
    id: "exp-1",
    name: "Tour 4 đảo Phú Quốc",
    tag: { label: "Bán chạy", variant: "rose" },
    category: "Tour biển đảo",
    location: "Phú Quốc",
    provider: "Ocean Stay",
    price: 450_000,
    status: "active",
    rating: 4.9,
    reviewsCount: 320,
    image: "/experience/cano-4-islands.jpg",
  },
  {
    id: "exp-2",
    name: "Lặn ngắm san hô",
    tag: { label: "Trải nghiệm", variant: "sky" },
    category: "Thể thao biển",
    location: "Phú Quốc",
    provider: "PhuQuoc Dive",
    price: 650_000,
    status: "active",
    rating: 4.8,
    reviewsCount: 215,
    image: "/experience/scuba-diving.jpg",
  },
  {
    id: "exp-3",
    name: "Câu mực đêm",
    tag: { label: "Trải nghiệm", variant: "sky" },
    category: "Tour biển",
    location: "Phú Quốc",
    provider: "Sunset Tours",
    price: 550_000,
    status: "active",
    rating: 4.7,
    reviewsCount: 189,
    image: "/experience/night-squid.jpg",
  },
  {
    id: "exp-4",
    name: "Tham quan Vinpearl Safari",
    tag: { label: "Vé tham quan", variant: "teal" },
    category: "Tham quan",
    location: "Phú Quốc",
    provider: "VinWonders",
    price: 600_000,
    status: "active",
    rating: 4.8,
    reviewsCount: 412,
    image: "/phu-quoc/featured-article.jpg",
  },
  {
    id: "exp-5",
    name: "Trải nghiệm cáp treo Hòn Thơm",
    tag: { label: "Vé tham quan", variant: "teal" },
    category: "Tham quan",
    location: "Phú Quốc",
    provider: "Sun World",
    price: 350_000,
    status: "active",
    rating: 4.6,
    reviewsCount: 176,
    image: "/experience/hon-thom-cable-car.jpg",
  },
  {
    id: "exp-6",
    name: "Tour khám phá Gành Dầu",
    tag: { label: "Mới", variant: "emerald" },
    category: "Tour khám phá",
    location: "Phú Quốc",
    provider: "Local Tours",
    price: 420_000,
    status: "pending",
    rating: 4.8,
    reviewsCount: 64,
    image: "/experience/trekking.jpg",
  },
  {
    id: "exp-7",
    name: "Lớp học nấu ăn món Việt",
    tag: { label: "Trải nghiệm", variant: "sky" },
    category: "Ẩm thực",
    location: "Phú Quốc",
    provider: "Taste of Phu Quoc",
    price: 380_000,
    status: "active",
    rating: 4.9,
    reviewsCount: 98,
    image: "/experience/cooking-class.jpg",
  },
  {
    id: "exp-8",
    name: "Kayak ngắm hoàng hôn",
    tag: { label: "Trải nghiệm", variant: "sky" },
    category: "Thể thao biển",
    location: "Phú Quốc",
    provider: "Island Adventure",
    price: 300_000,
    status: "paused",
    rating: 4.5,
    reviewsCount: 73,
    image: "/experience/kayak-rach-vem.jpg",
  },
  {
    id: "exp-9",
    name: "Tour câu cá truyền thống",
    tag: { label: "Địa phương", variant: "emerald" },
    category: "Tour biển",
    location: "Phú Quốc",
    provider: "Fisherman Trip",
    price: 500_000,
    status: "active",
    rating: 4.7,
    reviewsCount: 112,
    image: "/experience/tour-3-dao.jpg",
  },
  {
    id: "exp-10",
    name: "Thiền & Yoga trên biển",
    tag: { label: "Wellness", variant: "purple" },
    category: "Sức khỏe",
    location: "Phú Quốc",
    provider: "Mindful Travel",
    price: 450_000,
    status: "active",
    rating: 4.8,
    reviewsCount: 90,
    image: "/experience/spa-wellness.jpg",
  },
]
