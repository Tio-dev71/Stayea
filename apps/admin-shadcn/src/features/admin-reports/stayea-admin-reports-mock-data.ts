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
    value: "425.320.000 đ",
    changePercent: "+18%",
    changeType: "up",
    subText: "so với 3 tháng trước",
    icon: "bar-chart",
    badgeBg: "bg-emerald-50 text-emerald-600 border border-emerald-100",
    badgeText: "text-emerald-700",
  },
  {
    id: "orders",
    title: "Đơn hàng",
    value: "1.248",
    changePercent: "+22%",
    changeType: "up",
    subText: "so với 3 tháng trước",
    icon: "calendar",
    badgeBg: "bg-sky-50 text-sky-600 border border-sky-100",
    badgeText: "text-sky-700",
  },
  {
    id: "customers",
    title: "Khách hàng mới",
    value: "892",
    changePercent: "+25%",
    changeType: "up",
    subText: "so với 3 tháng trước",
    icon: "users",
    badgeBg: "bg-amber-50 text-amber-600 border border-amber-100",
    badgeText: "text-amber-700",
  },
  {
    id: "traffic",
    title: "Lượt truy cập",
    value: "258.400",
    changePercent: "+35%",
    changeType: "up",
    subText: "so với 3 tháng trước",
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
export const MOCK_REPORT_REVENUE_TIMELINE: ReportTimelinePoint[] = [
  { date: "01/06", revenue: 17.5, previousRevenue: 13 },
  { date: "08/06", revenue: 21, previousRevenue: 15.2 },
  { date: "15/06", revenue: 20.2, previousRevenue: 16.8 },
  { date: "22/06", revenue: 26.5, previousRevenue: 19.4 },
  { date: "01/07", revenue: 24.8, previousRevenue: 18 },
  { date: "08/07", revenue: 28.6, previousRevenue: 20.5 },
  { date: "15/07", revenue: 32.4, previousRevenue: 22.8 },
  { date: "22/07", revenue: 30.1, previousRevenue: 23.2 },
  { date: "01/08", revenue: 37, previousRevenue: 24.5 },
  { date: "08/08", revenue: 35.8, previousRevenue: 25.1 },
  { date: "15/08", revenue: 42.5, previousRevenue: 26.8 },
  { date: "22/08", revenue: 41, previousRevenue: 27.5 },
  { date: "31/08", revenue: 48.2, previousRevenue: 30.5 },
]

// 4. Biểu đồ: Doanh thu theo kênh (Donut Chart)
export const MOCK_REPORT_CHANNELS: ReportChannelSlice[] = [
  { name: "Website", percent: 38, valueFormatted: "161.6M", color: "#007a48" },
  { name: "Booking Engine", percent: 22, valueFormatted: "93.6M", color: "#0284c7" },
  { name: "OTA (Agoda, Booking...)", percent: 15, valueFormatted: "63.8M", color: "#f97316" },
  { name: "Trải nghiệm & Tour", percent: 10, valueFormatted: "42.5M", color: "#a855f7" },
  { name: "Đối tác", percent: 8, valueFormatted: "34.0M", color: "#3b82f6" },
  { name: "Khác", percent: 7, valueFormatted: "29.8M", color: "#0f766e" },
]

// 5. Biểu đồ: Lượt truy cập & Chuyển đổi (Combo Bar + Line)
export const MOCK_REPORT_TRAFFIC_CONVERSION: ReportTrafficPoint[] = [
  { date: "01/06", visits: 22.4, conversionRate: 4.8 },
  { date: "05/06", visits: 18.2, conversionRate: 4.5 },
  { date: "10/06", visits: 20.8, conversionRate: 4.7 },
  { date: "15/06", visits: 19.5, conversionRate: 4.9 },
  { date: "20/06", visits: 24.1, conversionRate: 5.1 },
  { date: "25/06", visits: 22.9, conversionRate: 5.3 },
  { date: "01/07", visits: 26.5, conversionRate: 5.2 },
  { date: "05/07", visits: 28, conversionRate: 5.5 },
  { date: "10/07", visits: 25.2, conversionRate: 5.4 },
  { date: "15/07", visits: 31.8, conversionRate: 5.8 },
  { date: "20/07", visits: 29.5, conversionRate: 6 },
  { date: "25/07", visits: 33.2, conversionRate: 6.2 },
  { date: "01/08", visits: 32, conversionRate: 6.1 },
  { date: "05/08", visits: 34.6, conversionRate: 6.4 },
  { date: "10/08", visits: 30.1, conversionRate: 6.2 },
  { date: "15/08", visits: 36.8, conversionRate: 6.8 },
  { date: "20/08", visits: 33.4, conversionRate: 6.5 },
  { date: "25/08", visits: 35, conversionRate: 6.7 },
  { date: "31/08", visits: 32.5, conversionRate: 6.6 },
]

// 6. Biểu đồ: Khách hàng mới theo nguồn (Donut Chart)
export const MOCK_REPORT_CUSTOMER_SOURCES: ReportCustomerSourceSlice[] = [
  { source: "Tìm kiếm tự nhiên", percent: 32, countFormatted: "286", color: "#10b981" },
  { source: "Quảng cáo", percent: 25, countFormatted: "223", color: "#06b6d4" },
  { source: "Mạng xã hội", percent: 18, countFormatted: "160", color: "#f59e0b" },
  { source: "Referral", percent: 12, countFormatted: "107", color: "#ec4899" },
  { source: "Trực tiếp", percent: 8, countFormatted: "71", color: "#f43f5e" },
  { source: "Khác", percent: 5, countFormatted: "45", color: "#14b8a6" },
]

// 7. Top 5 Tour & Trải nghiệm bán chạy
export const MOCK_REPORT_TOP_TOURS: ReportTopTourItem[] = [
  {
    id: "tour-1",
    rank: 1,
    name: "Khám phá Phú Quốc hè 2024",
    image: "/experience/cano-4-islands.jpg",
    bookingCount: 1250,
    revenue: "162.500.000 đ",
    conversionRate: "6.8%",
    rating: 4.8,
  },
  {
    id: "tour-2",
    rank: 2,
    name: "Early Bird - Đặt sớm giá tốt",
    image: "/phu-quoc/top-10-bai-bien.jpg",
    bookingCount: 980,
    revenue: "76.600.000 đ",
    conversionRate: "5.2%",
    rating: 4.7,
  },
  {
    id: "tour-3",
    rank: 3,
    name: "Combo gia đình",
    image: "/experience/tour-3-dao.jpg",
    bookingCount: 760,
    revenue: "63.800.000 đ",
    conversionRate: "4.9%",
    rating: 4.6,
  },
  {
    id: "tour-4",
    rank: 4,
    name: "Mùa thu vàng Đà Nẵng",
    image: "/experience/tour-am-thuc.jpg",
    bookingCount: 540,
    revenue: "42.500.000 đ",
    conversionRate: "4.1%",
    rating: 4.5,
  },
  {
    id: "tour-5",
    rank: 5,
    name: "Flash Sale cuối tuần",
    image: "/phu-quoc/cap-treo-hon-thom.jpg",
    bookingCount: 520,
    revenue: "34.000.000 đ",
    conversionRate: "3.8%",
    rating: 4.4,
  },
]

// 8. Cột phải: Chỉ số quan trọng (Important Metrics)
export const MOCK_REPORT_KEY_METRICS: ReportKeyMetricItem[] = [
  {
    id: "occupancy",
    label: "Tỷ lệ lấp đầy phòng",
    value: "68%",
    changePercent: "↑ +12%",
    isPositive: true,
  },
  {
    id: "aov",
    label: "Giá trị đơn hàng trung bình",
    value: "854.000 đ",
    changePercent: "↑ +8%",
    isPositive: true,
  },
  {
    id: "returning-rate",
    label: "Tỷ lệ khách quay lại",
    value: "28%",
    changePercent: "↑ +15%",
    isPositive: true,
  },
  {
    id: "cancellation-rate",
    label: "Tỷ lệ hủy đơn",
    value: "3.2%",
    changePercent: "↓ -18%",
    isPositive: false, // Hiển thị màu đỏ cam tương phản theo thiết kế
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
