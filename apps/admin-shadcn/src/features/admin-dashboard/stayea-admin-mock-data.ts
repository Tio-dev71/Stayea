/**
 * Dữ liệu mẫu (Isolated Mock Data) cho Stayea Admin Dashboard Tiếng Việt
 * Bám sát chính xác 100% ảnh thiết kế tham chiếu mới nhất.
 */

export interface AdminKpiItem {
  id: string
  title: string
  value: string
  change: string
  comparisonText: string
  isPositive: boolean
  iconName: "calendar" | "currency" | "home" | "users"
}

export const ADMIN_KPIS_VI: readonly AdminKpiItem[] = [
  {
    id: "total-bookings",
    title: "Tổng số đặt phòng",
    value: "0",
    change: "0%",
    comparisonText: "so với tuần trước",
    isPositive: true,
    iconName: "calendar",
  },
  {
    id: "total-revenue",
    title: "Doanh thu",
    value: "0 ₫",
    change: "0%",
    comparisonText: "so với tuần trước",
    isPositive: true,
    iconName: "currency",
  },
  {
    id: "active-properties",
    title: "Bất động sản đang hoạt động",
    value: "4",
    change: "0%",
    comparisonText: "so với tuần trước",
    isPositive: true,
    iconName: "home",
  },
  {
    id: "total-guests",
    title: "Tổng số khách",
    value: "0",
    change: "0%",
    comparisonText: "so với tuần trước",
    isPositive: true,
    iconName: "users",
  },
]

export interface RevenueDataPoint {
  date: string
  fullDate: string
  revenue: number
  displayAmount: string
}

export const REVENUE_CHART_DATA_VI: readonly RevenueDataPoint[] = [
  { date: "21/04", fullDate: "21/04/2025", revenue: 0, displayAmount: "0 đ" },
  { date: "22/04", fullDate: "22/04/2025", revenue: 0, displayAmount: "0 đ" },
  { date: "23/04", fullDate: "23/04/2025", revenue: 0, displayAmount: "0 đ" },
  { date: "24/04", fullDate: "24/04/2025", revenue: 0, displayAmount: "0 đ" },
  { date: "25/04", fullDate: "25/04/2025", revenue: 0, displayAmount: "0 đ" },
  { date: "26/04", fullDate: "26/04/2025", revenue: 0, displayAmount: "0 đ" },
  { date: "27/04", fullDate: "27/04/2025", revenue: 0, displayAmount: "0 đ" },
]

export interface BookingStatusSlice {
  status: string
  percentage: number
  count: number
  color: string
}

export const BOOKING_STATUS_DATA_VI: readonly BookingStatusSlice[] = [
  { status: "Đã xác nhận", percentage: 0, count: 0, color: "#166534" },
  { status: "Chờ xác nhận", percentage: 0, count: 0, color: "#eab308" },
  { status: "Đã hủy", percentage: 0, count: 0, color: "#ef4444" },
  { status: "Đã hoàn thành", percentage: 0, count: 0, color: "#94a3b8" },
]

export interface AdminRecentBooking {
  id: string
  guestName: string
  guestAvatar: string
  guestCountry: string
  guestFlag: string
  propertyTitle: string
  propertySubtitle: string
  checkIn: string
  checkOut: string
  status: "Đã xác nhận" | "Chờ xác nhận" | "Đã hoàn thành" | "Đã hủy"
  totalAmount: string
}

export const ADMIN_RECENT_BOOKINGS_VI: readonly AdminRecentBooking[] = []

export interface AdminActivityItem {
  id: string
  title: string
  timeAgo: string
  type: "booking" | "property" | "review" | "payment" | "partner"
}

export const ADMIN_RECENT_ACTIVITIES_VI: readonly AdminActivityItem[] = [
  {
    id: "act-1",
    title: "Đơn đặt phòng mới",
    timeAgo: "2 phút trước",
    type: "booking",
  },
  {
    id: "act-2",
    title: "Cập nhật thông tin bất động sản",
    timeAgo: "15 phút trước",
    type: "property",
  },
  {
    id: "act-3",
    title: "Có đánh giá mới",
    timeAgo: "28 phút trước",
    type: "review",
  },
  {
    id: "act-4",
    title: "Thanh toán thành công",
    timeAgo: "1 giờ trước",
    type: "payment",
  },
  {
    id: "act-5",
    title: "Đối tác mới đăng ký",
    timeAgo: "2 giờ trước",
    type: "partner",
  },
]

export interface SidebarNavMenuItem {
  id: string
  label: string
  icon: string
  href: string
  isActive?: boolean
}

export const ADMIN_SIDEBAR_NAV_VI: readonly SidebarNavMenuItem[] = [
  { id: "tong-quan", label: "Tổng quan", icon: "dashboard", href: "#admin", isActive: true },
  { id: "dat-phong", label: "Đặt phòng", icon: "bookings", href: "#admin-bookings" },
  { id: "bat-dong-san", label: "Bất động sản", icon: "properties", href: "#properties" },
  { id: "khach-hang", label: "Khách hàng", icon: "guests", href: "#guests" },
  { id: "chu-nha-doi-tac", label: "Chủ nhà/Đối tác", icon: "hosts", href: "#hosts" },
  { id: "trai-nghiem-tour", label: "Trải nghiệm & Tour", icon: "experience", href: "#experience" },
  { id: "uu-dai-khuyen-mai", label: "Ưu đãi & Khuyến mãi", icon: "deals", href: "#deals" },
  { id: "doanh-thu-thanh-toan", label: "Doanh thu & Thanh toán", icon: "transactions", href: "#transactions" },
  { id: "danh-gia", label: "Đánh giá", icon: "reviews", href: "#danh-gia" },
  { id: "tin-nhan", label: "Tin nhắn", icon: "messages", href: "#tin-nhan" },
  { id: "marketing", label: "Marketing", icon: "marketing", href: "#marketing" },
  { id: "bao-cao", label: "Báo cáo", icon: "analytics", href: "#analytics" },
  { id: "cai-dat", label: "Cài đặt", icon: "settings", href: "#settings" },
]
