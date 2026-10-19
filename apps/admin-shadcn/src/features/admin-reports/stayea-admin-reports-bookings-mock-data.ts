/**
 * Stayea Admin Reports - Bookings Sub-module Mock Data
 * Dữ liệu mẫu chuẩn hóa cho phân hệ "Đặt phòng" trong màn hình Báo cáo
 */

export interface BookingReportKpiItem {
  id: string
  title: string
  value: string
  changePercent: string
  changeType: "up" | "down"
  subText: string
  icon: "calendar-check" | "check-circle" | "clock" | "x-circle"
  badgeBg: string
  badgeText: string
}

export interface BookingTimelinePoint {
  date: string
  success: number
  pending: number
  canceled: number
}

export interface BookingStatusSlice {
  status: string
  percent: number
  countFormatted: string
  color: string
}

export interface BookingProductTypeItem {
  type: string
  count: number | null
  color: string
}

export interface BookingChannelItem {
  channel: string
  percent: number
  countFormatted: string
  color: string
  icon: "website" | "booking-engine" | "ota" | "experience" | "partner" | "other"
}

export interface RecentBookingItem {
  id: string
  code: string
  customerName: string
  customerAvatar: string
  productName: string
  bookingDate: string
  checkInDate: string
  nights: number
  totalAmount: string
  status: "Thành công" | "Đang xử lý" | "Đã hủy"
}

export interface BookingKeyMetricItem {
  id: string
  label: string
  value: string
  changePercent: string
  isPositive: boolean
}

// 1. 4 Thẻ chỉ số tổng quan Đặt phòng
export const MOCK_BOOKING_REPORT_KPIS: BookingReportKpiItem[] = [
  {
    id: "total-bookings",
    title: "Tổng số đặt phòng",
    value: "1.248",
    changePercent: "+22%",
    changeType: "up",
    subText: "so với 3 tháng trước",
    icon: "calendar-check",
    badgeBg: "bg-sky-50 text-sky-600 border border-sky-100",
    badgeText: "text-sky-700",
  },
  {
    id: "successful-bookings",
    title: "Đặt phòng thành công",
    value: "1.158",
    changePercent: "+24%",
    changeType: "up",
    subText: "so với 3 tháng trước",
    icon: "check-circle",
    badgeBg: "bg-emerald-50 text-emerald-600 border border-emerald-100",
    badgeText: "text-emerald-700",
  },
  {
    id: "pending-bookings",
    title: "Đang xử lý",
    value: "62",
    changePercent: "-8%",
    changeType: "down",
    subText: "so với 3 tháng trước",
    icon: "clock",
    badgeBg: "bg-amber-50 text-amber-600 border border-amber-100",
    badgeText: "text-amber-700",
  },
  {
    id: "canceled-bookings",
    title: "Đã hủy",
    value: "28",
    changePercent: "-12%",
    changeType: "down",
    subText: "so với 3 tháng trước",
    icon: "x-circle",
    badgeBg: "bg-rose-50 text-rose-600 border border-rose-100",
    badgeText: "text-rose-700",
  },
]

// 2. Chuỗi thời gian số lượng đặt phòng (Line / Area chart)
export const MOCK_BOOKING_TIMELINE: BookingTimelinePoint[] = [
  { date: "01/06", success: 68, pending: 22, canceled: 8 },
  { date: "08/06", success: 118, pending: 45, canceled: 12 },
  { date: "15/06", success: 112, pending: 42, canceled: 15 },
  { date: "22/06", success: 140, pending: 58, canceled: 18 },
  { date: "01/07", success: 132, pending: 50, canceled: 14 },
  { date: "08/07", success: 168, pending: 65, canceled: 16 },
  { date: "15/07", success: 182, pending: 60, canceled: 20 },
  { date: "22/07", success: 165, pending: 55, canceled: 15 },
  { date: "01/08", success: 188, pending: 68, canceled: 18 },
  { date: "08/08", success: 178, pending: 62, canceled: 19 },
  { date: "15/08", success: 196, pending: 70, canceled: 22 },
  { date: "22/08", success: 186, pending: 66, canceled: 20 },
  { date: "31/08", success: 210, pending: 82, canceled: 24 },
]

// 3. Tỷ lệ trạng thái đặt phòng (Donut chart)
export const MOCK_BOOKING_STATUS_SLICES: BookingStatusSlice[] = [
  { status: "Thành công", percent: 92.8, countFormatted: "1.158", color: "#007a48" },
  { status: "Đang xử lý", percent: 5, countFormatted: "62", color: "#0284c7" },
  { status: "Đã hủy", percent: 2.2, countFormatted: "28", color: "#f43f5e" },
]

// 4. Đặt phòng theo loại sản phẩm (Bar chart)
export const MOCK_BOOKING_PRODUCT_TYPES: BookingProductTypeItem[] = [
  { type: "Biệt thự, villa", count: 520, color: "#007a48" },
  { type: "Khách sạn", count: 280, color: "#0284c7" },
  { type: "Căn hộ", count: 210, color: "#f97316" },
  { type: "Tour & trải nghiệm", count: 150, color: "#a855f7" },
  { type: "Homestay", count: 88, color: "#6366f1" },
  { type: "Khác", count: null, color: "#94a3b8" },
]

// 5. Đặt phòng theo kênh (Horizontal progress bars)
export const MOCK_BOOKING_CHANNELS: BookingChannelItem[] = [
  {
    channel: "Website",
    percent: 38,
    countFormatted: "474",
    color: "#007a48",
    icon: "website",
  },
  {
    channel: "Booking Engine",
    percent: 24,
    countFormatted: "299",
    color: "#0284c7",
    icon: "booking-engine",
  },
  {
    channel: "OTA (Agoda, Booking...)",
    percent: 18,
    countFormatted: "224",
    color: "#f97316",
    icon: "ota",
  },
  {
    channel: "Trải nghiệm & Tour",
    percent: 10,
    countFormatted: "125",
    color: "#06b6d4",
    icon: "experience",
  },
  {
    channel: "Đối tác",
    percent: 7,
    countFormatted: "87",
    color: "#a855f7",
    icon: "partner",
  },
  {
    channel: "Khác",
    percent: 3,
    countFormatted: "39",
    color: "#64748b",
    icon: "other",
  },
]

// 6. Danh sách đặt phòng gần đây (Recent Bookings)
export const MOCK_RECENT_BOOKINGS: RecentBookingItem[] = [
  {
    id: "rb-1",
    code: "BK240831001",
    customerName: "Trần Minh Anh",
    customerAvatar: "/about/team-1.jpg",
    productName: "Villa Ocean View Phú Quốc",
    bookingDate: "31/08/2024",
    checkInDate: "02/09/2024",
    nights: 3,
    totalAmount: "9.600.000 đ",
    status: "Thành công",
  },
  {
    id: "rb-2",
    code: "BK240830992",
    customerName: "Nguyễn Thu Hà",
    customerAvatar: "/about/team-2.jpg",
    productName: "Khách sạn Sea View Đà Nẵng",
    bookingDate: "30/08/2024",
    checkInDate: "05/09/2024",
    nights: 6,
    totalAmount: "8.400.000 đ",
    status: "Đang xử lý",
  },
  {
    id: "rb-3",
    code: "BK240830985",
    customerName: "Lê Văn Bình",
    customerAvatar: "/about/team-3.jpg",
    productName: "Căn hộ trung tâm Hà Nội",
    bookingDate: "30/08/2024",
    checkInDate: "01/09/2024",
    nights: 2,
    totalAmount: "2.800.000 đ",
    status: "Thành công",
  },
  {
    id: "rb-4",
    code: "BK240830978",
    customerName: "Phạm Thị Mai",
    customerAvatar: "/about/team-4.jpg",
    productName: "Tour 4 đảo Phú Quốc",
    bookingDate: "29/08/2024",
    checkInDate: "12/09/2024",
    nights: 4,
    totalAmount: "6.320.000 đ",
    status: "Đã hủy",
  },
  {
    id: "rb-5",
    code: "BK240830965",
    customerName: "Hoàng Quốc Duy",
    customerAvatar: "/profile/profile-avatar.jpg",
    productName: "Khách sạn gần biển Nha Trang",
    bookingDate: "28/08/2024",
    checkInDate: "30/08/2024",
    nights: 2,
    totalAmount: "3.200.000 đ",
    status: "Thành công",
  },
]

// 7. Cột phải: Chỉ số đặt phòng quan trọng (Important Booking Metrics)
export const MOCK_BOOKING_KEY_METRICS: BookingKeyMetricItem[] = [
  {
    id: "success-rate",
    label: "Tỷ lệ đặt phòng thành công",
    value: "92.8%",
    changePercent: "↑ +2.5%",
    isPositive: true,
  },
  {
    id: "cancel-rate",
    label: "Tỷ lệ hủy phòng",
    value: "2.2%",
    changePercent: "↓ -1.1%",
    isPositive: false,
  },
  {
    id: "avg-processing-time",
    label: "Thời gian xử lý trung bình",
    value: "12 phút",
    changePercent: "↓ -20%",
    isPositive: false,
  },
  {
    id: "aov-booking",
    label: "Giá trị đặt phòng trung bình",
    value: "854.000 đ",
    changePercent: "↑ +8%",
    isPositive: true,
  },
  {
    id: "avg-stay-nights",
    label: "Số đêm lưu trú trung bình",
    value: "2.8 đêm",
    changePercent: "↑ +12%",
    isPositive: true,
  },
]

// 8. Cột phải: Báo cáo liên quan
export const MOCK_BOOKING_RELATED_REPORTS = [
  { id: "rel-revenue", label: "Báo cáo doanh thu", icon: "revenue", targetTab: "doanh-thu" },
  { id: "rel-customers", label: "Báo cáo khách hàng", icon: "customers", targetTab: "khach-hang" },
  { id: "rel-marketing", label: "Báo cáo marketing", icon: "marketing", targetTab: "marketing" },
  { id: "rel-experiences", label: "Báo cáo trải nghiệm & tour", icon: "experiences", targetTab: "trai-nghiem-tour" },
  { id: "rel-partners", label: "Báo cáo đối tác", icon: "partners", targetTab: "doi-tac" },
  { id: "rel-payments", label: "Báo cáo thanh toán", icon: "payments", targetTab: "thanh-toan" },
] as const
