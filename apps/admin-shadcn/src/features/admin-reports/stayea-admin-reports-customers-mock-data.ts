/**
 * Stayea Admin Reports - Customers Sub-module Mock Data
 * Dữ liệu chuẩn hóa cho phân hệ "Khách hàng" trong màn hình Báo cáo
 */

export interface CustomerReportKpiItem {
  id: string
  title: string
  value: string
  changePercent: string
  changeType: "up" | "down"
  subText: string
  icon: "user-check" | "user-plus" | "users" | "crown"
  badgeBg: string
  badgeText: string
}

export interface CustomerTimelinePoint {
  date: string
  total: number
  newCustomers: number
  returning: number
}

export interface CustomerStructureSlice {
  name: string
  percent: number
  countFormatted: string
  color: string
  legendColor?: string
}

export interface CustomerChannelBarItem {
  channel: string
  count: number
  color: string
}

export interface CustomerSegmentItem {
  segment: string
  percent: number
  countFormatted: string
  color: string
  icon: "family" | "couple" | "friends" | "business" | "international" | "other"
}

export interface TopValuedCustomerItem {
  id: string
  rank: number
  name: string
  avatar: string
  bookingCount: number
  totalRevenue: string
  lastBookingDate: string
  segmentGroup: "Gia đình" | "Cặp đôi" | "Khách công tác" | "Nhóm bạn"
}

export interface CustomerKeyMetricItem {
  id: string
  label: string
  value: string
  changePercent: string
  isPositive: boolean
}

// 1. 4 Thẻ chỉ số tổng quan Khách hàng
export const MOCK_CUSTOMER_REPORT_KPIS: CustomerReportKpiItem[] = [
  {
    id: "total-customers",
    title: "Tổng khách hàng",
    value: "0",
    changePercent: "0%",
    changeType: "up",
    subText: "dữ liệu thời gian thực",
    icon: "user-check",
    badgeBg: "bg-emerald-50 text-emerald-600 border border-emerald-100",
    badgeText: "text-emerald-700",
  },
  {
    id: "new-customers",
    title: "Khách hàng mới",
    value: "0",
    changePercent: "0%",
    changeType: "up",
    subText: "dữ liệu thời gian thực",
    icon: "user-plus",
    badgeBg: "bg-sky-50 text-sky-600 border border-sky-100",
    badgeText: "text-sky-700",
  },
  {
    id: "returning-customers",
    title: "Khách hàng quay lại",
    value: "0",
    changePercent: "0%",
    changeType: "up",
    subText: "dữ liệu thời gian thực",
    icon: "users",
    badgeBg: "bg-teal-50 text-teal-600 border border-teal-100",
    badgeText: "text-teal-700",
  },
  {
    id: "loyal-customers",
    title: "Khách hàng thân thiết",
    value: "0",
    changePercent: "0%",
    changeType: "up",
    subText: "dữ liệu thời gian thực",
    icon: "crown",
    badgeBg: "bg-amber-50 text-amber-600 border border-amber-100",
    badgeText: "text-amber-700",
  },
]

// 2. Chuỗi thời gian số lượng khách hàng
export const MOCK_CUSTOMER_TIMELINE: CustomerTimelinePoint[] = []

// 3. Cơ cấu khách hàng (Donut Chart)
export const MOCK_CUSTOMER_STRUCTURE: CustomerStructureSlice[] = []

// 4. Khách hàng mới theo kênh (Bar Chart)
export const MOCK_CUSTOMER_CHANNELS: CustomerChannelBarItem[] = []

// 5. Phân khúc khách hàng
export const MOCK_CUSTOMER_SEGMENTS: CustomerSegmentItem[] = []

// 6. Top khách hàng giá trị cao
export const MOCK_TOP_VALUED_CUSTOMERS: TopValuedCustomerItem[] = []

// 7. Cột phải: Chỉ số khách hàng quan trọng
export const MOCK_CUSTOMER_KEY_METRICS: CustomerKeyMetricItem[] = [
  {
    id: "clv",
    label: "Giá trị vòng đời khách hàng (CLV)",
    value: "0 đ",
    changePercent: "0%",
    isPositive: true,
  },
  {
    id: "rep-rate",
    label: "Tần suất đặt lại",
    value: "0 lần/năm",
    changePercent: "0%",
    isPositive: true,
  },
  {
    id: "cac",
    label: "Chi phí chuyển đổi (CAC)",
    value: "0 đ",
    changePercent: "0%",
    isPositive: false,
  },
  {
    id: "satisfaction",
    label: "Mức độ hài lòng (CSAT)",
    value: "0/5",
    changePercent: "0%",
    isPositive: true,
  },
  {
    id: "nps",
    label: "Chỉ số trung thành (NPS)",
    value: "0",
    changePercent: "0%",
    isPositive: true,
  },
]

// 8. Báo cáo liên quan Khách hàng
export const MOCK_CUSTOMER_RELATED_REPORTS = [
  { id: "rel-1", label: "Hành vi người dùng", icon: "user-activity", targetHash: "#user-activity" },
  { id: "rel-2", label: "Phân loại khách VIP", icon: "vip-tiers", targetHash: "#vip" },
  { id: "rel-3", label: "Lịch sử mua hàng", icon: "order-history", targetHash: "#orders" },
  { id: "rel-4", label: "Khách theo địa lý", icon: "geo-customers", targetHash: "#geo" },
  { id: "rel-5", label: "Tỷ lệ rời bỏ (Churn)", icon: "churn", targetHash: "#churn" },
] as const
