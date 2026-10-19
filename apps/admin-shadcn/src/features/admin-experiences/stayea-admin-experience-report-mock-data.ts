export interface ExperienceReportKpiItem {
  id: string
  title: string
  value: string
  trendPercent: string
  trendPeriod: string
  trendDirection: "up" | "down"
  iconType: "ticket" | "users" | "revenue" | "star" | "location"
}

export const MOCK_EXPERIENCE_REPORT_KPIS: ExperienceReportKpiItem[] = [
  {
    id: "total-bookings",
    title: "Tổng lượt đặt tour",
    value: "1.250",
    trendPercent: "+32%",
    trendPeriod: "so với 3 tháng trước",
    trendDirection: "up",
    iconType: "ticket",
  },
  {
    id: "total-guests",
    title: "Khách tham gia",
    value: "2.980",
    trendPercent: "+28%",
    trendPeriod: "so với 3 tháng trước",
    trendDirection: "up",
    iconType: "users",
  },
  {
    id: "total-revenue",
    title: "Doanh thu tour",
    value: "162.500.000 đ",
    trendPercent: "+38%",
    trendPeriod: "so với 3 tháng trước",
    trendDirection: "up",
    iconType: "revenue",
  },
  {
    id: "avg-rating",
    title: "Đánh giá trung bình",
    value: "4.7/5",
    trendPercent: "+6%",
    trendPeriod: "so với 3 tháng trước",
    trendDirection: "up",
    iconType: "star",
  },
  {
    id: "destinations-count",
    title: "Số điểm đến",
    value: "28",
    trendPercent: "+12%",
    trendPeriod: "so với 3 tháng trước",
    trendDirection: "up",
    iconType: "location",
  },
]

export const MOCK_EXPERIENCE_REPORT_CATEGORY_TABS = [
  { id: "tong-quan", label: "Tổng quan" },
  { id: "tour-trai-nghiem", label: "Tour & Trải nghiệm" },
  { id: "diem-den", label: "Điểm đến" },
  { id: "khach-hang", label: "Khách hàng" },
  { id: "doi-tac", label: "Đối tác" },
  { id: "danh-gia", label: "Đánh giá" },
  { id: "doanh-thu", label: "Doanh thu" },
  { id: "khuyen-mai", label: "Khuyến mãi" },
] as const

export interface ExperienceTimelinePoint {
  date: string
  bookings: number
  guests: number
}

export const MOCK_EXPERIENCE_TIMELINE: ExperienceTimelinePoint[] = [
  { date: "01/06", bookings: 75, guests: 48 },
  { date: "15/06", bookings: 220, guests: 110 },
  { date: "01/07", bookings: 210, guests: 105 },
  { date: "15/07", bookings: 330, guests: 170 },
  { date: "01/08", bookings: 380, guests: 155 },
  { date: "15/08", bookings: 360, guests: 195 },
  { date: "31/08", bookings: 430, guests: 240 },
]

export interface ExperienceCategorySlice {
  name: string
  count: number
  percent: number
  color: string
}

export const MOCK_EXPERIENCE_CATEGORIES_DONUT: ExperienceCategorySlice[] = [
  { name: "Tham quan thiên nhiên", count: 400, percent: 32, color: "#10b981" },
  { name: "Trải nghiệm văn hóa", count: 300, percent: 24, color: "#0284c7" },
  { name: "Thể thao & mạo hiểm", count: 225, percent: 18, color: "#f97316" },
  { name: "Ẩm thực địa phương", count: 175, percent: 14, color: "#f43f5e" },
  { name: "Tour nghỉ dưỡng", count: 100, percent: 8, color: "#a855f7" },
  { name: "Khác", count: 50, percent: 4, color: "#64748b" },
]

export interface ExperienceChannelRevenueItem {
  channel: string
  revenueM: number
  revenueFormatted: string
  color: string
}

export const MOCK_EXPERIENCE_CHANNEL_REVENUES: ExperienceChannelRevenueItem[] = [
  { channel: "Website", revenueM: 48.5, revenueFormatted: "48.5M", color: "#3b82f6" },
  { channel: "Mobile App", revenueM: 36.2, revenueFormatted: "36.2M", color: "#10b981" },
  { channel: "Mạng xã hội", revenueM: 28.4, revenueFormatted: "28.4M", color: "#f59e0b" },
  { channel: "Đối tác OTA", revenueM: 24.1, revenueFormatted: "24.1M", color: "#a855f7" },
  { channel: "Email", revenueM: 15.3, revenueFormatted: "15.3M", color: "#f43f5e" },
  { channel: "Khác", revenueM: 10, revenueFormatted: "10.0M", color: "#64748b" },
]

export interface CustomerAgeSlice {
  label: string
  count: number
  countFormatted: string
  percent: number
  color: string
}

export const MOCK_CUSTOMER_AGE_DONUT: CustomerAgeSlice[] = [
  { label: "18 - 25", count: 834, countFormatted: "834", percent: 28, color: "#38bdf8" },
  { label: "26 - 35", count: 1132, countFormatted: "1.132", percent: 38, color: "#2563eb" },
  { label: "36 - 45", count: 596, countFormatted: "596", percent: 20, color: "#f59e0b" },
  { label: "46 - 60", count: 298, countFormatted: "298", percent: 10, color: "#f43f5e" },
  { label: "> 60", count: 120, countFormatted: "120", percent: 4, color: "#8b5cf6" },
]

export const MOCK_CUSTOMER_GROUP_DONUT: CustomerAgeSlice[] = [
  { label: "Cặp đôi", count: 1043, countFormatted: "1.043", percent: 35, color: "#ec4899" },
  { label: "Gia đình", count: 894, countFormatted: "894", percent: 30, color: "#10b981" },
  { label: "Nhóm bạn", count: 745, countFormatted: "745", percent: 25, color: "#0284c7" },
  { label: "Đi một mình", count: 298, countFormatted: "298", percent: 10, color: "#f59e0b" },
]

export interface TopSellingTourRow {
  id: string
  order: number
  title: string
  thumbnail: string
  destination: string
  bookingsCount: number
  revenueFormatted: string
  rating: number
  trendPercent: string
  status: "Đang chạy" | "Tạm ngưng"
}

export const MOCK_TOP_SELLING_TOURS: TopSellingTourRow[] = [
  {
    id: "tst-1",
    order: 1,
    title: "Khám phá Phú Quốc 3N2D",
    thumbnail: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=120&auto=format&fit=crop&q=80",
    destination: "Phú Quốc",
    bookingsCount: 320,
    revenueFormatted: "48.000.000 đ",
    rating: 4.8,
    trendPercent: "+45%",
    status: "Đang chạy",
  },
  {
    id: "tst-2",
    order: 2,
    title: "City Tour Đà Nẵng",
    thumbnail: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=120&auto=format&fit=crop&q=80",
    destination: "Đà Nẵng",
    bookingsCount: 280,
    revenueFormatted: "42.000.000 đ",
    rating: 4.7,
    trendPercent: "+32%",
    status: "Đang chạy",
  },
  {
    id: "tst-3",
    order: 3,
    title: "Trekking Langbiang",
    thumbnail: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=120&auto=format&fit=crop&q=80",
    destination: "Đà Lạt",
    bookingsCount: 210,
    revenueFormatted: "31.500.000 đ",
    rating: 4.5,
    trendPercent: "+28%",
    status: "Đang chạy",
  },
  {
    id: "tst-4",
    order: 4,
    title: "Lặn ngắm san hô",
    thumbnail: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=120&auto=format&fit=crop&q=80",
    destination: "Nha Trang",
    bookingsCount: 180,
    revenueFormatted: "27.000.000 đ",
    rating: 4.6,
    trendPercent: "+18%",
    status: "Đang chạy",
  },
  {
    id: "tst-5",
    order: 5,
    title: "Tour ẩm thực Hội An",
    thumbnail: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=120&auto=format&fit=crop&q=80",
    destination: "Hội An",
    bookingsCount: 150,
    revenueFormatted: "22.500.000 đ",
    rating: 4.5,
    trendPercent: "+12%",
    status: "Đang chạy",
  },
]

export interface TopDestinationSidebarItem {
  id: string
  order: number
  destination: string
  thumbnail: string
  bookingsText: string
  trendPercent: string
}

export const MOCK_TOP_DESTINATIONS_SIDEBAR: TopDestinationSidebarItem[] = [
  {
    id: "td-1",
    order: 1,
    destination: "Phú Quốc",
    thumbnail: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=120&auto=format&fit=crop&q=80",
    bookingsText: "320 lượt đặt",
    trendPercent: "+45%",
  },
  {
    id: "td-2",
    order: 2,
    destination: "Đà Nẵng",
    thumbnail: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=120&auto=format&fit=crop&q=80",
    bookingsText: "280 lượt đặt",
    trendPercent: "+32%",
  },
  {
    id: "td-3",
    order: 3,
    destination: "Đà Lạt",
    thumbnail: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=120&auto=format&fit=crop&q=80",
    bookingsText: "210 lượt đặt",
    trendPercent: "+28%",
  },
  {
    id: "td-4",
    order: 4,
    destination: "Nha Trang",
    thumbnail: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=120&auto=format&fit=crop&q=80",
    bookingsText: "180 lượt đặt",
    trendPercent: "+18%",
  },
  {
    id: "td-5",
    order: 5,
    destination: "Hội An",
    thumbnail: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=120&auto=format&fit=crop&q=80",
    bookingsText: "150 lượt đặt",
    trendPercent: "+12%",
  },
]

export interface HighlightExperienceSidebarItem {
  id: string
  order: number
  title: string
  thumbnail: string
  bookingsText: string
  rating: number
}

export const MOCK_HIGHLIGHT_EXPERIENCES_SIDEBAR: HighlightExperienceSidebarItem[] = [
  {
    id: "he-1",
    order: 1,
    title: "Khám phá Phú Quốc",
    thumbnail: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=120&auto=format&fit=crop&q=80",
    bookingsText: "125 lượt đặt",
    rating: 4.8,
  },
  {
    id: "he-2",
    order: 2,
    title: "Lặn ngắm san hô Nha Trang",
    thumbnail: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=120&auto=format&fit=crop&q=80",
    bookingsText: "98 lượt đặt",
    rating: 4.7,
  },
  {
    id: "he-3",
    order: 3,
    title: "Tour ẩm thực Đà Nẵng",
    thumbnail: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=120&auto=format&fit=crop&q=80",
    bookingsText: "76 lượt đặt",
    rating: 4.6,
  },
  {
    id: "he-4",
    order: 4,
    title: "Trekking Langbiang",
    thumbnail: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=120&auto=format&fit=crop&q=80",
    bookingsText: "54 lượt đặt",
    rating: 4.5,
  },
  {
    id: "he-5",
    order: 5,
    title: "Tham quan phố cổ Hội An",
    thumbnail: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=120&auto=format&fit=crop&q=80",
    bookingsText: "52 lượt đặt",
    rating: 4.5,
  },
]

export interface ExperienceQuickActionItem {
  id: string
  title: string
  actionKey: string
  iconType: "create" | "manage" | "schedule" | "reviews" | "export"
}

export const MOCK_EXPERIENCE_QUICK_ACTIONS_SIDEBAR: ExperienceQuickActionItem[] = [
  { id: "eqa-1", title: "Tạo tour/trải nghiệm mới", actionKey: "create-experience", iconType: "create" },
  { id: "eqa-2", title: "Quản lý tour & trải nghiệm", actionKey: "manage-experiences", iconType: "manage" },
  { id: "eqa-3", title: "Cập nhật lịch khởi hành", actionKey: "update-schedule", iconType: "schedule" },
  { id: "eqa-4", title: "Xem đánh giá khách hàng", actionKey: "view-reviews", iconType: "reviews" },
  { id: "eqa-5", title: "Xuất báo cáo trải nghiệm & tour", actionKey: "export-report", iconType: "export" },
]
