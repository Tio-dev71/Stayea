/**
 * Stayea Admin Reports - Bookings Sub-module Mock Data
 * Dữ liệu chuẩn hóa cho phân hệ "Đặt phòng" trong màn hình Báo cáo
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
    value: "0",
    changePercent: "0%",
    changeType: "up",
    subText: "dữ liệu thời gian thực",
    icon: "calendar-check",
    badgeBg: "bg-sky-50 text-sky-600 border border-sky-100",
    badgeText: "text-sky-700",
  },
  {
    id: "successful-bookings",
    title: "Đặt phòng thành công",
    value: "0",
    changePercent: "0%",
    changeType: "up",
    subText: "dữ liệu thời gian thực",
    icon: "check-circle",
    badgeBg: "bg-emerald-50 text-emerald-600 border border-emerald-100",
    badgeText: "text-emerald-700",
  },
  {
    id: "pending-bookings",
    title: "Đang xử lý",
    value: "0",
    changePercent: "0%",
    changeType: "up",
    subText: "dữ liệu thời gian thực",
    icon: "clock",
    badgeBg: "bg-amber-50 text-amber-600 border border-amber-100",
    badgeText: "text-amber-700",
  },
  {
    id: "canceled-bookings",
    title: "Đã hủy",
    value: "0",
    changePercent: "0%",
    changeType: "up",
    subText: "dữ liệu thời gian thực",
    icon: "x-circle",
    badgeBg: "bg-rose-50 text-rose-600 border border-rose-100",
    badgeText: "text-rose-700",
  },
]

// 2. Chuỗi thời gian số lượng đặt phòng (Line / Area chart)
export const MOCK_BOOKING_TIMELINE: BookingTimelinePoint[] = []

// 3. Tỷ lệ trạng thái đặt phòng (Donut chart)
export const MOCK_BOOKING_STATUS_SLICES: BookingStatusSlice[] = []

// 4. Đặt phòng theo loại sản phẩm (Bar chart)
export const MOCK_BOOKING_PRODUCT_TYPES: BookingProductTypeItem[] = []

// 5. Đặt phòng theo kênh (Horizontal progress bars)
export const MOCK_BOOKING_CHANNELS: BookingChannelItem[] = []

// 6. Danh sách đặt phòng gần đây (Recent Bookings)
export const MOCK_RECENT_BOOKINGS: RecentBookingItem[] = []

// 7. Cột phải: Chỉ số đặt phòng quan trọng (Important Booking Metrics)
export const MOCK_BOOKING_KEY_METRICS: BookingKeyMetricItem[] = [
  {
    id: "success-rate",
    label: "Tỷ lệ đặt phòng thành công",
    value: "0%",
    changePercent: "0%",
    isPositive: true,
  },
  {
    id: "cancel-rate",
    label: "Tỷ lệ hủy phòng",
    value: "0%",
    changePercent: "0%",
    isPositive: false,
  },
  {
    id: "avg-processing-time",
    label: "Thời gian xử lý trung bình",
    value: "0 phút",
    changePercent: "0%",
    isPositive: false,
  },
  {
    id: "aov-booking",
    label: "Giá trị đặt phòng trung bình",
    value: "0 đ",
    changePercent: "0%",
    isPositive: true,
  },
  {
    id: "avg-stay-nights",
    label: "Số đêm lưu trú trung bình",
    value: "0 đêm",
    changePercent: "0%",
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
