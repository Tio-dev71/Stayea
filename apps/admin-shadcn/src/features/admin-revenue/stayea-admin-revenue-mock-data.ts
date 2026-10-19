export interface RevenueKpiItem {
  id: string
  title: string
  value: string
  trendPercent: string
  trendLabel: string
  isPositive: boolean
  icon: "wallet" | "paid" | "pending" | "commission"
  colorTheme: "green" | "blue" | "orange" | "purple"
}

export interface RevenueTimelinePoint {
  date: string
  fullDate: string
  totalRevenue: number // in millions VND
  paidRevenue: number // in millions VND
  displayTotal: string
  displayPaid: string
}

export interface RevenueCategorySlice {
  id: string
  name: string
  percentage: number
  valueFormatted: string
  color: string
}

export interface RevenueOrderItem {
  id: string
  orderCode: string
  title: string
  category: string
  imageUrl: string
  customerName: string
  bookingDate: string
  totalAmount: number
  totalFormatted: string
  status: "paid" | "pending" | "refunded"
  statusLabel: string
  commissionAmount: number
  commissionFormatted: string
}

export interface PaymentMethodItem {
  id: string
  name: string
  percentage: number
  amountFormatted: string
  icon: "wallet" | "card" | "transfer" | "e-wallet" | "cash"
}

export interface LocationRevenueItem {
  id: string
  rank: number
  city: string
  revenueFormatted: string
  percentage: number
  imageUrl: string
}

export interface QuickActionItem {
  id: string
  label: string
  icon: "export" | "reconcile" | "refund" | "payment-settings" | "schedule"
}

export const MOCK_REVENUE_KPIS: RevenueKpiItem[] = [
  {
    id: "total-revenue",
    title: "Tổng doanh thu",
    value: "425.320.000 ₫",
    trendPercent: "+18%",
    trendLabel: "so với kỳ trước",
    isPositive: true,
    icon: "wallet",
    colorTheme: "green",
  },
  {
    id: "paid-revenue",
    title: "Doanh thu đã thanh toán",
    value: "378.450.000 ₫",
    trendPercent: "+15%",
    trendLabel: "so với kỳ trước",
    isPositive: true,
    icon: "paid",
    colorTheme: "blue",
  },
  {
    id: "pending-revenue",
    title: "Doanh thu chờ thanh toán",
    value: "46.870.000 ₫",
    trendPercent: "+32%",
    trendLabel: "so với kỳ trước",
    isPositive: true,
    icon: "pending",
    colorTheme: "orange",
  },
  {
    id: "platform-commission",
    title: "Hoa hồng nền tảng",
    value: "85.064.000 ₫",
    trendPercent: "+18%",
    trendLabel: "(20% tổng doanh thu)",
    isPositive: true,
    icon: "commission",
    colorTheme: "purple",
  },
]

export const MOCK_REVENUE_TIMELINE: RevenueTimelinePoint[] = [
  {
    date: "01/06",
    fullDate: "01/06/2024",
    totalRevenue: 18.5,
    paidRevenue: 8.2,
    displayTotal: "18.500.000 ₫",
    displayPaid: "8.200.000 ₫",
  },
  {
    date: "15/06",
    fullDate: "15/06/2024",
    totalRevenue: 24.8,
    paidRevenue: 16.4,
    displayTotal: "24.800.000 ₫",
    displayPaid: "16.400.000 ₫",
  },
  {
    date: "01/07",
    fullDate: "01/07/2024",
    totalRevenue: 27.2,
    paidRevenue: 21,
    displayTotal: "27.200.000 ₫",
    displayPaid: "21.000.000 ₫",
  },
  {
    date: "15/07",
    fullDate: "15/07/2024",
    totalRevenue: 24,
    paidRevenue: 18.5,
    displayTotal: "24.000.000 ₫",
    displayPaid: "18.500.000 ₫",
  },
  {
    date: "01/08",
    fullDate: "01/08/2024",
    totalRevenue: 34.5,
    paidRevenue: 27.2,
    displayTotal: "34.500.000 ₫",
    displayPaid: "27.200.000 ₫",
  },
  {
    date: "15/08",
    fullDate: "15/08/2024",
    totalRevenue: 43.6,
    paidRevenue: 34.8,
    displayTotal: "43.600.000 ₫",
    displayPaid: "34.800.000 ₫",
  },
  {
    date: "31/08",
    fullDate: "31/08/2024",
    totalRevenue: 38.2,
    paidRevenue: 29.5,
    displayTotal: "38.200.000 ₫",
    displayPaid: "29.500.000 ₫",
  },
]

export const MOCK_REVENUE_CATEGORIES: RevenueCategorySlice[] = [
  {
    id: "tour-island",
    name: "Tour biển đảo",
    percentage: 38,
    valueFormatted: "161.6M",
    color: "#007a48",
  },
  {
    id: "sightseeing",
    name: "Tham quan",
    percentage: 22,
    valueFormatted: "93.6M",
    color: "#10b981",
  },
  {
    id: "cuisine",
    name: "Ẩm thực",
    percentage: 15,
    valueFormatted: "63.8M",
    color: "#f59e0b",
  },
  {
    id: "watersport",
    name: "Thể thao biển",
    percentage: 10,
    valueFormatted: "42.5M",
    color: "#0284c7",
  },
  {
    id: "culture",
    name: "Văn hóa",
    percentage: 8,
    valueFormatted: "34.0M",
    color: "#8b5cf6",
  },
  {
    id: "wellness",
    name: "Wellness",
    percentage: 5,
    valueFormatted: "21.3M",
    color: "#ec4899",
  },
  {
    id: "other",
    name: "Khác",
    percentage: 2,
    valueFormatted: "8.5M",
    color: "#475569",
  },
]

export const MOCK_REVENUE_ORDERS: RevenueOrderItem[] = [
  {
    id: "ord-1",
    orderCode: "#ST23984",
    title: "Tour 4 đảo Phú Quốc",
    category: "Tour biển đảo",
    imageUrl: "/experience/cano-4-islands.jpg",
    customerName: "Trần Minh Anh",
    bookingDate: "20/08/2024",
    totalAmount: 450_000,
    totalFormatted: "450.000 đ",
    status: "paid",
    statusLabel: "Đã thanh toán",
    commissionAmount: 90_000,
    commissionFormatted: "90.000 đ",
  },
  {
    id: "ord-2",
    orderCode: "#ST23983",
    title: "Lặn ngắm san hô",
    category: "Thể thao biển",
    imageUrl: "/experience/scuba-diving.jpg",
    customerName: "Nguyễn Thu Hà",
    bookingDate: "19/08/2024",
    totalAmount: 650_000,
    totalFormatted: "650.000 đ",
    status: "paid",
    statusLabel: "Đã thanh toán",
    commissionAmount: 130_000,
    commissionFormatted: "130.000 đ",
  },
  {
    id: "ord-3",
    orderCode: "#ST23982",
    title: "Câu mực đêm",
    category: "Tour biển",
    imageUrl: "/experience/night-squid.jpg",
    customerName: "Lê Văn Bình",
    bookingDate: "19/08/2024",
    totalAmount: 550_000,
    totalFormatted: "550.000 đ",
    status: "pending",
    statusLabel: "Chờ thanh toán",
    commissionAmount: 110_000,
    commissionFormatted: "110.000 đ",
  },
  {
    id: "ord-4",
    orderCode: "#ST23981",
    title: "Tham quan Vinpearl Safari",
    category: "Tham quan",
    imageUrl: "/experience/trekking.jpg",
    customerName: "Phạm Thị Mai",
    bookingDate: "18/08/2024",
    totalAmount: 600_000,
    totalFormatted: "600.000 đ",
    status: "paid",
    statusLabel: "Đã thanh toán",
    commissionAmount: 120_000,
    commissionFormatted: "120.000 đ",
  },
  {
    id: "ord-5",
    orderCode: "#ST23980",
    title: "Kayak ngắm hoàng hôn",
    category: "Thể thao biển",
    imageUrl: "/experience/kayak-rach-vem.jpg",
    customerName: "Hoàng Quốc Duy",
    bookingDate: "18/08/2024",
    totalAmount: 300_000,
    totalFormatted: "300.000 đ",
    status: "paid",
    statusLabel: "Đã thanh toán",
    commissionAmount: 60_000,
    commissionFormatted: "60.000 đ",
  },
]

export const MOCK_PAYMENT_METHODS: PaymentMethodItem[] = [
  {
    id: "stayea-wallet",
    name: "Ví Stayea",
    percentage: 42,
    amountFormatted: "178.6M",
    icon: "wallet",
  },
  {
    id: "bank-card",
    name: "Thẻ ngân hàng",
    percentage: 28,
    amountFormatted: "119.1M",
    icon: "card",
  },
  {
    id: "bank-transfer",
    name: "Chuyển khoản",
    percentage: 20,
    amountFormatted: "85.1M",
    icon: "transfer",
  },
  {
    id: "e-wallet",
    name: "Ví điện tử (MoMo, ZaloPay)",
    percentage: 8,
    amountFormatted: "34.0M",
    icon: "e-wallet",
  },
  {
    id: "cash",
    name: "Tiền mặt",
    percentage: 2,
    amountFormatted: "8.5M",
    icon: "cash",
  },
]

export const MOCK_LOCATION_REVENUES: LocationRevenueItem[] = [
  {
    id: "loc-pq",
    rank: 1,
    city: "Phú Quốc",
    revenueFormatted: "162.5M",
    percentage: 38,
    imageUrl: "/phu-quoc/hero-phu-quoc.jpg",
  },
  {
    id: "loc-hn",
    rank: 2,
    city: "Hà Nội",
    revenueFormatted: "76.6M",
    percentage: 18,
    imageUrl: "/stay/famiana-resort.jpg",
  },
  {
    id: "loc-dn",
    rank: 3,
    city: "Đà Nẵng",
    revenueFormatted: "63.8M",
    percentage: 15,
    imageUrl: "/stay/lahana-villa.jpg",
  },
  {
    id: "loc-nt",
    rank: 4,
    city: "Nha Trang",
    revenueFormatted: "42.5M",
    percentage: 10,
    imageUrl: "/stay/mango-bay.jpg",
  },
  {
    id: "loc-dl",
    rank: 5,
    city: "Đà Lạt",
    revenueFormatted: "34.0M",
    percentage: 8,
    imageUrl: "/stay/tropical-garden.jpg",
  },
]

export const MOCK_QUICK_ACTIONS: QuickActionItem[] = [
  {
    id: "action-export",
    label: "Xuất báo cáo doanh thu",
    icon: "export",
  },
  {
    id: "action-reconcile",
    label: "Đối soát với đối tác",
    icon: "reconcile",
  },
  {
    id: "action-refund",
    label: "Quản lý hoàn tiền / hủy đơn",
    icon: "refund",
  },
  {
    id: "action-payment-settings",
    label: "Cài đặt phương thức thanh toán",
    icon: "payment-settings",
  },
  {
    id: "action-schedule",
    label: "Xem lịch thanh toán",
    icon: "schedule",
  },
]
