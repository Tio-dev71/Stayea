/**
 * Stayea Admin Reports - Mock Data
 * Dữ liệu mẫu cô lập chuẩn hóa theo ảnh thiết kế Báo cáo
 */

export interface ReportKpiCardItem {
  id: string
  title: string
  value: string
  changePercent: string
  changeType: "up" | "down"
  subText: string
  icon: "bar-chart" | "calendar" | "users" | "mouse-pointer"
  badgeBg: string
  badgeText: string
}

export interface ReportTimelinePoint {
  date: string
  revenue: number // in millions VND
  previousRevenue: number // in millions VND
}

export interface ReportChannelSlice {
  name: string
  percent: number
  valueFormatted: string
  color: string
}

export interface ReportTrafficPoint {
  date: string
  visits: number // in thousands
  conversionRate: number // in percentage
}

export interface ReportCustomerSourceSlice {
  source: string
  percent: number
  countFormatted: string
  color: string
}

export interface ReportTopTourItem {
  id: string
  rank: number
  name: string
  image: string
  bookingCount: number
  revenue: string
  conversionRate: string
  rating: number
}

export interface ReportKeyMetricItem {
  id: string
  label: string
  value: string
  changePercent: string
  isPositive: boolean
}

export interface ReportQuickReportLink {
  id: string
  label: string
  icon: "revenue" | "marketing" | "customers" | "experiences" | "partners" | "payments"
  targetTab?: string
}

// 1. 4 Thẻ chỉ số tổng quan (KPI Cards)
export const MOCK_REPORT_KPIS: ReportKpiCardItem[] = [
  {
    id: "revenue",
    title: "Tổng doanh thu",
    value: "0 đ",
    changePercent: "0%",
    changeType: "up",
    subText: "dữ liệu thời gian thực",
    icon: "bar-chart",
    badgeBg: "bg-emerald-50 text-emerald-600 border border-emerald-100",
    badgeText: "text-emerald-700",
  },
  {
    id: "orders",
    title: "Đơn hàng",
    value: "0",
    changePercent: "0%",
    changeType: "up",
    subText: "dữ liệu thời gian thực",
    icon: "calendar",
    badgeBg: "bg-sky-50 text-sky-600 border border-sky-100",
    badgeText: "text-sky-700",
  },
  {
    id: "customers",
    title: "Khách hàng mới",
    value: "0",
    changePercent: "0%",
    changeType: "up",
    subText: "dữ liệu thời gian thực",
    icon: "users",
    badgeBg: "bg-amber-50 text-amber-600 border border-amber-100",
    badgeText: "text-amber-700",
  },
  {
    id: "traffic",
    title: "Lượt truy cập",
    value: "0",
    changePercent: "0%",
    changeType: "up",
    subText: "dữ liệu thời gian thực",
    icon: "mouse-pointer",
    badgeBg: "bg-purple-50 text-purple-600 border border-purple-100",
    badgeText: "text-purple-700",
  },
]

// 2. 8 Category Tabs
export const MOCK_REPORT_CATEGORY_TABS = [
  { id: "tong-quan", label: "Tổng quan" },
  { id: "doanh-thu", label: "Doanh thu" },
  { id: "dat-phong", label: "Đặt phòng" },
  { id: "khach-hang", label: "Khách hàng" },
  { id: "marketing", label: "Marketing" },
  { id: "trai-nghiem-tour", label: "Trải nghiệm & Tour" },
  { id: "doi-tac", label: "Đối tác" },
  { id: "thanh-toan", label: "Thanh toán" },
] as const

// 3. Biểu đồ: Doanh thu theo thời gian (Area Spline Chart)
export const MOCK_REPORT_REVENUE_TIMELINE: ReportTimelinePoint[] = []

// 4. Biểu đồ: Doanh thu theo kênh (Donut Chart)
export const MOCK_REPORT_CHANNELS: ReportChannelSlice[] = []

// 5. Biểu đồ: Lượt truy cập & Chuyển đổi (Combo Bar + Line)
export const MOCK_REPORT_TRAFFIC_CONVERSION: ReportTrafficPoint[] = []

// 6. Biểu đồ: Khách hàng mới theo nguồn (Donut Chart)
export const MOCK_REPORT_CUSTOMER_SOURCES: ReportCustomerSourceSlice[] = []

// 7. Top 5 Tour & Trải nghiệm bán chạy
export const MOCK_REPORT_TOP_TOURS: ReportTopTourItem[] = []

// 8. Cột phải: Chỉ số quan trọng (Important Metrics)
export const MOCK_REPORT_KEY_METRICS: ReportKeyMetricItem[] = [
  {
    id: "occupancy",
    label: "Tỷ lệ lấp đầy phòng",
    value: "0%",
    changePercent: "0%",
    isPositive: true,
  },
  {
    id: "aov",
    label: "Giá trị đơn hàng trung bình",
    value: "0 đ",
    changePercent: "0%",
    isPositive: true,
  },
  {
    id: "returning-rate",
    label: "Tỷ lệ khách quay lại",
    value: "0%",
    changePercent: "0%",
    isPositive: true,
  },
  {
    id: "cancellation-rate",
    label: "Tỷ lệ hủy đơn",
    value: "0%",
    changePercent: "0%",
    isPositive: true,
  },
]

// 9. Cột phải: Báo cáo nhanh (Quick Reports)
export const MOCK_REPORT_QUICK_LINKS: ReportQuickReportLink[] = [
  { id: "qr-revenue", label: "Báo cáo doanh thu", icon: "revenue", targetTab: "doanh-thu" },
  { id: "qr-marketing", label: "Báo cáo marketing", icon: "marketing", targetTab: "marketing" },
  { id: "qr-customers", label: "Báo cáo khách hàng", icon: "customers", targetTab: "khach-hang" },
  { id: "qr-experiences", label: "Báo cáo trải nghiệm & tour", icon: "experiences", targetTab: "trai-nghiem-tour" },
  { id: "qr-partners", label: "Báo cáo đối tác", icon: "partners", targetTab: "doi-tac" },
  { id: "qr-payments", label: "Báo cáo thanh toán", icon: "payments", targetTab: "thanh-toan" },
]
