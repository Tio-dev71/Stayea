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
    value: "0",
    trendPercent: "0%",
    trendPeriod: "dữ liệu thời gian thực",
    trendDirection: "up",
    iconType: "ticket",
  },
  {
    id: "total-guests",
    title: "Khách tham gia",
    value: "0",
    trendPercent: "0%",
    trendPeriod: "dữ liệu thời gian thực",
    trendDirection: "up",
    iconType: "users",
  },
  {
    id: "total-revenue",
    title: "Doanh thu tour",
    value: "0 đ",
    trendPercent: "0%",
    trendPeriod: "dữ liệu thời gian thực",
    trendDirection: "up",
    iconType: "revenue",
  },
  {
    id: "avg-rating",
    title: "Đánh giá trung bình",
    value: "0.0/5",
    trendPercent: "0%",
    trendPeriod: "dữ liệu thời gian thực",
    trendDirection: "up",
    iconType: "star",
  },
  {
    id: "destinations-count",
    title: "Số điểm đến",
    value: "0",
    trendPercent: "0%",
    trendPeriod: "dữ liệu thời gian thực",
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

export const MOCK_EXPERIENCE_TIMELINE: ExperienceTimelinePoint[] = []

export interface ExperienceCategorySlice {
  name: string
  count: number
  percent: number
  color: string
}

export const MOCK_EXPERIENCE_CATEGORIES_DONUT: ExperienceCategorySlice[] = []

export interface ExperienceChannelRevenueItem {
  channel: string
  revenueM: number
  revenueFormatted: string
  color: string
}

export const MOCK_EXPERIENCE_CHANNEL_REVENUES: ExperienceChannelRevenueItem[] = []

export interface CustomerAgeSlice {
  label: string
  count: number
  countFormatted: string
  percent: number
  color: string
}

export const MOCK_CUSTOMER_AGE_DONUT: CustomerAgeSlice[] = []

export const MOCK_CUSTOMER_GROUP_DONUT: CustomerAgeSlice[] = []

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

export const MOCK_TOP_SELLING_TOURS: TopSellingTourRow[] = []

export interface TopDestinationSidebarItem {
  id: string
  order: number
  destination: string
  thumbnail: string
  bookingsText: string
  trendPercent: string
}

export const MOCK_TOP_DESTINATIONS_SIDEBAR: TopDestinationSidebarItem[] = []

export interface HighlightExperienceSidebarItem {
  id: string
  order: number
  title: string
  thumbnail: string
  bookingsText: string
  rating: number
}

export const MOCK_HIGHLIGHT_EXPERIENCES_SIDEBAR: HighlightExperienceSidebarItem[] = []

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
