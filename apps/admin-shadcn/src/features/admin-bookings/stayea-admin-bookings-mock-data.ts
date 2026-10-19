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
    value: "342",
    change: "+12%",
    comparisonText: "so với tuần trước",
    isPositive: true,
    iconType: "calendar",
  },
  {
    id: "pending-confirmation",
    title: "Chờ xác nhận",
    value: "68",
    change: "+8%",
    comparisonText: "so với tuần trước",
    isPositive: true,
    iconType: "clock",
  },
  {
    id: "currently-staying",
    title: "Đang lưu trú",
    value: "124",
    change: "+15%",
    comparisonText: "so với tuần trước",
    isPositive: true,
    iconType: "bed",
  },
  {
    id: "booking-revenue",
    title: "Doanh thu từ đặt phòng",
    value: "1.268.590.000 đ",
    change: "+18%",
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

export const BOOKINGS_DATA: readonly BookingRecord[] = [
  {
    id: "b-1",
    code: "ST240425001",
    guestName: "Sarah Johnson",
    guestAvatar: "/about/team-2.jpg",
    guestFlag: "🇺🇸",
    propertyName: "Sunset Villa Phú Quốc",
    checkIn: "25/04/2025",
    checkOut: "28/04/2025",
    guestsCount: 4,
    bookingStatus: "Đang lưu trú",
    paymentStatus: "Đã thanh toán",
    totalAmount: "8.320.000 đ",
    channel: "Website",
    channelType: "website",
  },
  {
    id: "b-2",
    code: "ST240425002",
    guestName: "Lý Văn Nam",
    guestAvatar: "/about/team-3.jpg",
    guestFlag: "🇻🇳",
    propertyName: "Ocean View Apartment",
    checkIn: "24/04/2025",
    checkOut: "27/04/2025",
    guestsCount: 2,
    bookingStatus: "Đã xác nhận",
    paymentStatus: "Cọc 50%",
    totalAmount: "5.460.000 đ",
    channel: "Agoda",
    channelType: "agoda",
  },
  {
    id: "b-3",
    code: "ST240425003",
    guestName: "Emma Wilson",
    guestAvatar: "/about/team-4.jpg",
    guestFlag: "🇺🇸",
    propertyName: "Beach House Phú Quốc",
    checkIn: "22/04/2025",
    checkOut: "26/04/2025",
    guestsCount: 3,
    bookingStatus: "Đang lưu trú",
    paymentStatus: "Đã thanh toán",
    totalAmount: "10.250.000 đ",
    channel: "Booking.com",
    channelType: "booking",
  },
  {
    id: "b-4",
    code: "ST240425004",
    guestName: "Trần Thu Hà",
    guestAvatar: "/about/team-1.jpg",
    guestFlag: "🇻🇳",
    propertyName: "Tropical Villa",
    checkIn: "21/04/2025",
    checkOut: "24/04/2025",
    guestsCount: 2,
    bookingStatus: "Đã hoàn tất",
    paymentStatus: "Đã thanh toán",
    totalAmount: "4.800.000 đ",
    channel: "Website",
    channelType: "website",
  },
  {
    id: "b-5",
    code: "ST240425005",
    guestName: "Daniel Kim",
    guestAvatar: "/about/team-1.jpg",
    guestFlag: "🇰🇷",
    propertyName: "City Loft Phú Quốc",
    checkIn: "20/04/2025",
    checkOut: "23/04/2025",
    guestsCount: 1,
    bookingStatus: "Đã hủy",
    paymentStatus: "Hoàn tiền",
    totalAmount: "0 đ",
    channel: "Airbnb",
    channelType: "airbnb",
  },
  {
    id: "b-6",
    code: "ST240425006",
    guestName: "Sophie Martin",
    guestAvatar: "/about/team-2.jpg",
    guestFlag: "🇫🇷",
    propertyName: "Bungalow Gành Dầu",
    checkIn: "26/04/2025",
    checkOut: "29/04/2025",
    guestsCount: 2,
    bookingStatus: "Chờ xác nhận",
    paymentStatus: "Chờ thanh toán",
    totalAmount: "6.120.000 đ",
    channel: "Website",
    channelType: "website",
  },
  {
    id: "b-7",
    code: "ST240425007",
    guestName: "Nguyễn Hoàng",
    guestAvatar: "/about/team-3.jpg",
    guestFlag: "🇻🇳",
    propertyName: "Sea View Villa",
    checkIn: "27/04/2025",
    checkOut: "30/04/2025",
    guestsCount: 4,
    bookingStatus: "Chờ xác nhận",
    paymentStatus: "Cọc 50%",
    totalAmount: "12.500.000 đ",
    channel: "Traveloka",
    channelType: "traveloka",
  },
  {
    id: "b-8",
    code: "ST240425008",
    guestName: "Olivia Brown",
    guestAvatar: "/about/team-4.jpg",
    guestFlag: "🇬🇧",
    propertyName: "Garden House",
    checkIn: "23/04/2025",
    checkOut: "25/04/2025",
    guestsCount: 2,
    bookingStatus: "Đã hoàn tất",
    paymentStatus: "Đã thanh toán",
    totalAmount: "3.900.000 đ",
    channel: "Expedia",
    channelType: "expedia",
  },
  {
    id: "b-9",
    code: "ST240425009",
    guestName: "Phạm Minh Đức",
    guestAvatar: "/about/team-1.jpg",
    guestFlag: "🇻🇳",
    propertyName: "Lakeside Villa",
    checkIn: "22/04/2025",
    checkOut: "26/04/2025",
    guestsCount: 5,
    bookingStatus: "Đang lưu trú",
    paymentStatus: "Cọc 50%",
    totalAmount: "9.750.000 đ",
    channel: "Website",
    channelType: "website",
  },
  {
    id: "b-10",
    code: "ST240425010",
    guestName: "Isabella Garcia",
    guestAvatar: "/about/team-2.jpg",
    guestFlag: "🇪🇸",
    propertyName: "Beach House Phú Quốc",
    checkIn: "21/04/2025",
    checkOut: "28/04/2025",
    guestsCount: 3,
    bookingStatus: "Đã xác nhận",
    paymentStatus: "Chờ thanh toán",
    totalAmount: "7.280.000 đ",
    channel: "Airbnb",
    channelType: "airbnb",
  },
]

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
