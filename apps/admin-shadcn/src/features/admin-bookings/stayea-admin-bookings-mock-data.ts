/**
 * Dữ liệu mẫu (Isolated Mock Data) cho Màn hình Đặt phòng - Stayea Admin
 * Khởi tạo độc lập, phản ánh chuẩn xác 100% ảnh thiết kế tham chiếu.
 */

export interface BookingKpiItem {
  id: string
  title: string
  value: string
  change: string
  comparisonText: string
  isPositive: boolean
  iconType: "calendar" | "clock" | "bed" | "currency"
}

export const BOOKINGS_KPIS: readonly BookingKpiItem[] = [
  {
    id: "total-bookings",
    title: "Tổng đặt phòng",
    value: "0",
    change: "0%",
    comparisonText: "so với tuần trước",
    isPositive: true,
    iconType: "calendar",
  },
  {
    id: "pending-confirmation",
    title: "Chờ xác nhận",
    value: "0",
    change: "0%",
    comparisonText: "so với tuần trước",
    isPositive: true,
    iconType: "clock",
  },
  {
    id: "currently-staying",
    title: "Đang lưu trú",
    value: "0",
    change: "0%",
    comparisonText: "so với tuần trước",
    isPositive: true,
    iconType: "bed",
  },
  {
    id: "booking-revenue",
    title: "Doanh thu từ đặt phòng",
    value: "0 đ",
    change: "0%",
    comparisonText: "so với tuần trước",
    isPositive: true,
    iconType: "currency",
  },
]

export interface BookingRecord {
  id: string
  code: string
  guestName: string
  guestAvatar: string
  guestFlag: string
  propertyName: string
  checkIn: string
  checkOut: string
  guestsCount: number
  bookingStatus: "Đang lưu trú" | "Đã xác nhận" | "Đã hoàn tất" | "Đã hủy" | "Chờ xác nhận"
  paymentStatus: "Đã thanh toán" | "Cọc 50%" | "Hoàn tiền" | "Chờ thanh toán"
  totalAmount: string
  channel: "Website" | "Agoda" | "Booking.com" | "Airbnb" | "Traveloka" | "Expedia"
  channelType: "website" | "agoda" | "booking" | "airbnb" | "traveloka" | "expedia"
}

export const BOOKINGS_DATA: readonly BookingRecord[] = []

export interface ScheduleItem {
  id: string
  guestName: string
  guestAvatar: string
  propertyName: string
  guestsCountText: string
  time: string
}

export const TODAY_CHECKIN_ITEMS: readonly ScheduleItem[] = [
  {
    id: "ci-1",
    guestName: "Sarah Johnson",
    guestAvatar: "/about/team-2.jpg",
    propertyName: "Sunset Villa Phú Quốc",
    guestsCountText: "4 khách",
    time: "14:00",
  },
  {
    id: "ci-2",
    guestName: "Nguyễn Thị Mai",
    guestAvatar: "/about/team-4.jpg",
    propertyName: "Ocean View Apartment",
    guestsCountText: "2 khách",
    time: "14:00",
  },
  {
    id: "ci-3",
    guestName: "James Miller",
    guestAvatar: "/about/team-3.jpg",
    propertyName: "Tropical Villa",
    guestsCountText: "3 khách",
    time: "15:00",
  },
  {
    id: "ci-4",
    guestName: "Trần Văn Hùng",
    guestAvatar: "/about/team-1.jpg",
    propertyName: "Beach House Phú Quốc",
    guestsCountText: "2 khách",
    time: "15:00",
  },
  {
    id: "ci-5",
    guestName: "Emma Davis",
    guestAvatar: "/about/team-2.jpg",
    propertyName: "Garden House",
    guestsCountText: "4 khách",
    time: "16:00",
  },
]

export const TODAY_CHECKOUT_ITEMS: readonly ScheduleItem[] = [
  {
    id: "co-1",
    guestName: "Daniel Kim",
    guestAvatar: "/about/team-1.jpg",
    propertyName: "City Loft Phú Quốc",
    guestsCountText: "1 khách",
    time: "11:00",
  },
  {
    id: "co-2",
    guestName: "Olivia Brown",
    guestAvatar: "/about/team-4.jpg",
    propertyName: "Garden House",
    guestsCountText: "2 khách",
    time: "12:00",
  },
  {
    id: "co-3",
    guestName: "Lý Văn Nam",
    guestAvatar: "/about/team-3.jpg",
    propertyName: "Ocean View Apartment",
    guestsCountText: "2 khách",
    time: "12:00",
  },
]

export interface ChannelSlice {
  channel: string
  percentage: number
  color: string
}

export const BOOKING_CHANNELS_DATA: readonly ChannelSlice[] = [
  { channel: "Website", percentage: 38, color: "#166534" },
  { channel: "Airbnb", percentage: 24, color: "#f43f5e" },
  { channel: "Booking.com", percentage: 18, color: "#2563eb" },
  { channel: "Agoda", percentage: 10, color: "#f97316" },
  { channel: "Traveloka", percentage: 6, color: "#0ea5e9" },
  { channel: "Khác", percentage: 4, color: "#94a3b8" },
]
