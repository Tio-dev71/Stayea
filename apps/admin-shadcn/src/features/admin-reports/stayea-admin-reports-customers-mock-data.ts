/**
 * Stayea Admin Reports - Customers Sub-module Mock Data
 * Dữ liệu mẫu chuẩn hóa cho phân hệ "Khách hàng" trong màn hình Báo cáo
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
    value: "8.420",
    changePercent: "+28%",
    changeType: "up",
    subText: "so với 3 tháng trước",
    icon: "user-check",
    badgeBg: "bg-emerald-50 text-emerald-600 border border-emerald-100",
    badgeText: "text-emerald-700",
  },
  {
    id: "new-customers",
    title: "Khách hàng mới",
    value: "2.360",
    changePercent: "+35%",
    changeType: "up",
    subText: "so với 3 tháng trước",
    icon: "user-plus",
    badgeBg: "bg-sky-50 text-sky-600 border border-sky-100",
    badgeText: "text-sky-700",
  },
  {
    id: "returning-customers",
    title: "Khách hàng quay lại",
    value: "6.060",
    changePercent: "+18%",
    changeType: "up",
    subText: "so với 3 tháng trước",
    icon: "users",
    badgeBg: "bg-teal-50 text-teal-600 border border-teal-100",
    badgeText: "text-teal-700",
  },
  {
    id: "loyal-customers",
    title: "Khách hàng thân thiết",
    value: "1.285",
    changePercent: "+42%",
    changeType: "up",
    subText: "so với 3 tháng trước",
    icon: "crown",
    badgeBg: "bg-amber-50 text-amber-600 border border-amber-100",
    badgeText: "text-amber-700",
  },
]

// 2. Chuỗi thời gian số lượng khách hàng (01/06 - 31/08)
export const MOCK_CUSTOMER_TIMELINE: CustomerTimelinePoint[] = [
  { date: "01/06", total: 720, newCustomers: 380, returning: 340 },
  { date: "08/06", total: 1180, newCustomers: 590, returning: 480 },
  { date: "15/06", total: 1150, newCustomers: 560, returning: 460 },
  { date: "22/06", total: 1320, newCustomers: 680, returning: 510 },
  { date: "01/07", total: 1260, newCustomers: 620, returning: 490 },
  { date: "08/07", total: 1540, newCustomers: 780, returning: 600 },
  { date: "15/07", total: 1510, newCustomers: 760, returning: 590 },
  { date: "22/07", total: 1720, newCustomers: 860, returning: 680 },
  { date: "01/08", total: 1650, newCustomers: 820, returning: 650 },
  { date: "08/08", total: 1980, newCustomers: 980, returning: 780 },
  { date: "15/08", total: 1890, newCustomers: 940, returning: 750 },
  { date: "22/08", total: 2150, newCustomers: 1080, returning: 860 },
  { date: "31/08", total: 2280, newCustomers: 1150, returning: 920 },
]

// 3. Cơ cấu khách hàng (Donut Chart)
export const MOCK_CUSTOMER_STRUCTURE: CustomerStructureSlice[] = [
  { name: "Khách hàng mới", percent: 28, countFormatted: "2.360", color: "#0284c7" },
  { name: "Khách hàng quay lại", percent: 72, countFormatted: "6.060", color: "#007a48", legendColor: "#f59e0b" },
  { name: "Khách hàng thân thiết", percent: 15, countFormatted: "1.285", color: "#f43f5e" },
  { name: "Khách hàng doanh nghiệp", percent: 6, countFormatted: "505", color: "#a855f7" },
]

// 4. Khách hàng mới theo kênh (Bar Chart)
export const MOCK_CUSTOMER_CHANNELS: CustomerChannelBarItem[] = [
  { channel: "Facebook", count: 820, color: "#3b82f6" },
  { channel: "Google", count: 620, color: "#ef4444" },
  { channel: "Instagram", count: 420, color: "#ec4899" },
  { channel: "Zalo", count: 280, color: "#0ea5e9" },
  { channel: "Email", count: 150, color: "#10b981" },
  { channel: "Khác", count: 70, color: "#64748b" },
]

// 5. Phân khúc khách hàng (Horizontal progress bars)
export const MOCK_CUSTOMER_SEGMENTS: CustomerSegmentItem[] = [
  {
    segment: "Gia đình",
    percent: 32,
    countFormatted: "2.690",
    color: "#007a48",
    icon: "family",
  },
  {
    segment: "Cặp đôi",
    percent: 26,
    countFormatted: "2.190",
    color: "#0284c7",
    icon: "couple",
  },
  {
    segment: "Nhóm bạn",
    percent: 20,
    countFormatted: "1.680",
    color: "#f59e0b",
    icon: "friends",
  },
  {
    segment: "Khách công tác",
    percent: 12,
    countFormatted: "1.010",
    color: "#a855f7",
    icon: "business",
  },
  {
    segment: "Khách quốc tế",
    percent: 7,
    countFormatted: "590",
    color: "#64748b",
    icon: "international",
  },
  {
    segment: "Khác",
    percent: 3,
    countFormatted: "260",
    color: "#0d9488",
    icon: "other",
  },
]

// 6. Top khách hàng giá trị cao
export const MOCK_TOP_VALUED_CUSTOMERS: TopValuedCustomerItem[] = [
  {
    id: "tvc-1",
    rank: 1,
    name: "Trần Minh Anh",
    avatar: "/about/team-1.jpg",
    bookingCount: 18,
    totalRevenue: "45.200.000 đ",
    lastBookingDate: "25/08/2024",
    segmentGroup: "Gia đình",
  },
  {
    id: "tvc-2",
    rank: 2,
    name: "Nguyễn Thu Hà",
    avatar: "/about/team-2.jpg",
    bookingCount: 12,
    totalRevenue: "32.500.000 đ",
    lastBookingDate: "20/08/2024",
    segmentGroup: "Cặp đôi",
  },
  {
    id: "tvc-3",
    rank: 3,
    name: "Lê Văn Bình",
    avatar: "/about/team-3.jpg",
    bookingCount: 10,
    totalRevenue: "28.400.000 đ",
    lastBookingDate: "18/08/2024",
    segmentGroup: "Khách công tác",
  },
  {
    id: "tvc-4",
    rank: 4,
    name: "Phạm Thị Mai",
    avatar: "/about/team-4.jpg",
    bookingCount: 9,
    totalRevenue: "25.600.000 đ",
    lastBookingDate: "15/08/2024",
    segmentGroup: "Nhóm bạn",
  },
  {
    id: "tvc-5",
    rank: 5,
    name: "Hoàng Quốc Duy",
    avatar: "/profile/profile-avatar.jpg",
    bookingCount: 8,
    totalRevenue: "22.300.000 đ",
    lastBookingDate: "12/08/2024",
    segmentGroup: "Gia đình",
  },
]

// 7. Cột phải: Chỉ số khách hàng quan trọng
export const MOCK_CUSTOMER_KEY_METRICS: CustomerKeyMetricItem[] = [
  {
    id: "new-cust-rate",
    label: "Tỷ lệ khách hàng mới",
    value: "28%",
    changePercent: "↑ +35%",
    isPositive: true,
  },
  {
    id: "ret-cust-rate",
    label: "Tỷ lệ khách hàng quay lại",
    value: "72%",
    changePercent: "↑ +18%",
    isPositive: true,
  },
  {
    id: "loyal-cust-rate",
    label: "Tỷ lệ khách hàng thân thiết",
    value: "15%",
    changePercent: "↑ +42%",
    isPositive: true,
  },
  {
    id: "corp-cust-rate",
    label: "Tỷ lệ khách hàng doanh nghiệp",
    value: "6%",
    changePercent: "↑ +12%",
    isPositive: true,
  },
  {
    id: "aov-per-cust",
    label: "Giá trị đặt phòng TB/khách",
    value: "854.000 đ",
    changePercent: "↑ +8%",
    isPositive: true,
  },
]

// 8. Cột phải: Báo cáo liên quan
export const MOCK_CUSTOMER_RELATED_REPORTS = [
  { id: "rel-cust-detail", label: "Báo cáo khách hàng chi tiết", icon: "detail" },
  { id: "rel-loyalty", label: "Khách hàng thân thiết (Loyalty)", icon: "loyalty" },
  { id: "rel-segments", label: "Phân khúc khách hàng", icon: "segment" },
  { id: "rel-regions", label: "Khách hàng theo khu vực", icon: "region" },
  { id: "rel-channels", label: "Khách hàng theo kênh", icon: "channel" },
  { id: "rel-export-list", label: "Xuất danh sách khách hàng", icon: "export" },
] as const
