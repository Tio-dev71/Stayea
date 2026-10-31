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
    value: "0 ₫",
    trendPercent: "0%",
    trendLabel: "so với kỳ trước",
    isPositive: true,
    icon: "wallet",
    colorTheme: "green",
  },
  {
    id: "paid-revenue",
    title: "Doanh thu đã thanh toán",
    value: "0 ₫",
    trendPercent: "0%",
    trendLabel: "so với kỳ trước",
    isPositive: true,
    icon: "paid",
    colorTheme: "blue",
  },
  {
    id: "pending-revenue",
    title: "Doanh thu chờ thanh toán",
    value: "0 ₫",
    trendPercent: "0%",
    trendLabel: "so với kỳ trước",
    isPositive: true,
    icon: "pending",
    colorTheme: "orange",
  },
  {
    id: "platform-commission",
    title: "Hoa hồng nền tảng",
    value: "0 ₫",
    trendPercent: "0%",
    trendLabel: "(20% tổng doanh thu)",
    isPositive: true,
    icon: "commission",
    colorTheme: "purple",
  },
]

export const MOCK_REVENUE_TIMELINE: RevenueTimelinePoint[] = []

export const MOCK_REVENUE_CATEGORIES: RevenueCategorySlice[] = []

export const MOCK_REVENUE_ORDERS: RevenueOrderItem[] = []

export const MOCK_PAYMENT_METHODS: PaymentMethodItem[] = []

export const MOCK_LOCATION_REVENUES: LocationRevenueItem[] = []

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
