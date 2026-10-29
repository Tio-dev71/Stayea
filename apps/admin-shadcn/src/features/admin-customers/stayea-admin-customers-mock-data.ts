export interface CustomerItem {
  id: string
  name: string
  badge?: "vip" | "loyal"
  badgeLabel?: string
  avatar: string
  nationality: string
  flag: string
  phoneNumber: string
  email: string
  bookingsCount: number
  totalSpent: string
  status: "active" | "paused" | "pending"
  statusLabel: string
}

export interface CustomerKpiItem {
  id: string
  title: string
  value: string
  change: string
  comparisonText: string
  isPositive: boolean
  iconType: "total" | "loyal" | "new" | "revenue"
}

export interface CustomerNationalityItem {
  id: string
  country: string
  percentage: number
  color: string
}

export interface RecentCustomerItem {
  id: string
  name: string
  flag: string
  avatar: string
}

export interface CustomerSegmentItem {
  id: string
  label: string
  count: number
}

// 4 KPI Summary Cards
export const CUSTOMERS_KPI_DATA: readonly CustomerKpiItem[] = [
  {
    id: "total-customers",
    title: "Tổng số khách hàng",
    value: "0",
    change: "0%",
    comparisonText: "so với tháng trước",
    isPositive: true,
    iconType: "total",
  },
  {
    id: "loyal-customers",
    title: "Khách hàng thân thiết",
    value: "0",
    change: "0%",
    comparisonText: "so với tháng trước",
    isPositive: true,
    iconType: "loyal",
  },
  {
    id: "new-customers",
    title: "Khách hàng mới",
    value: "0",
    change: "0%",
    comparisonText: "so với tháng trước",
    isPositive: true,
    iconType: "new",
  },
  {
    id: "revenue-customers",
    title: "Doanh thu từ khách hàng",
    value: "0 đ",
    change: "0%",
    comparisonText: "so với tháng trước",
    isPositive: true,
    iconType: "revenue",
  },
]

// Segment Tabs
export const CUSTOMERS_SEGMENT_TABS: readonly CustomerSegmentItem[] = [
  { id: "all", label: "Tất cả", count: 0 },
  { id: "loyal", label: "Khách hàng thân thiết", count: 0 },
  { id: "new", label: "Khách hàng mới", count: 0 },
  { id: "enterprise", label: "Khách hàng doanh nghiệp", count: 0 },
  { id: "international", label: "Khách hàng quốc tế", count: 0 },
]

// 10 Customers Table Rows
export const CUSTOMERS_MOCK_LIST: readonly CustomerItem[] = []

// Customer Nationality Breakdown for Donut Chart
export const CUSTOMER_NATIONALITY_DISTRIBUTION: readonly CustomerNationalityItem[] = [
  { id: "nat-1", country: "Việt Nam", percentage: 38, color: "#10b981" },
  { id: "nat-2", country: "Hàn Quốc", percentage: 18, color: "#ef4444" },
  { id: "nat-3", country: "Trung Quốc", percentage: 12, color: "#f59e0b" },
  { id: "nat-4", country: "Nga", percentage: 8, color: "#3b82f6" },
  { id: "nat-5", country: "Châu Âu", percentage: 8, color: "#8b5cf6" },
  { id: "nat-6", country: "Mỹ", percentage: 7, color: "#06b6d4" },
  { id: "nat-7", country: "Khác", percentage: 9, color: "#94a3b8" },
]

// Recent Customers (Right Sidebar)
export const RECENT_CUSTOMERS_LIST: readonly RecentCustomerItem[] = [
  {
    id: "rec-1",
    name: "Alex Chen",
    flag: "🇨🇳",
    avatar: "/about/team-1.jpg",
  },
  {
    id: "rec-2",
    name: "Maria Ivanova",
    flag: "🇷🇺",
    avatar: "/about/team-2.jpg",
  },
  {
    id: "rec-3",
    name: "Hiroshi Tanaka",
    flag: "🇯🇵",
    avatar: "/about/team-3.jpg",
  },
  {
    id: "rec-4",
    name: "Linh Nguyễn",
    flag: "🇻🇳",
    avatar: "/about/team-4.jpg",
  },
  {
    id: "rec-5",
    name: "David Wilson",
    flag: "🇺🇸",
    avatar: "/profile/profile-avatar.jpg",
  },
]
