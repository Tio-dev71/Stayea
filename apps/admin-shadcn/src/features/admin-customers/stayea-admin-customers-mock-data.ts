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
    value: "2.716",
    change: "+22%",
    comparisonText: "so với tháng trước",
    isPositive: true,
    iconType: "total",
  },
  {
    id: "loyal-customers",
    title: "Khách hàng thân thiết",
    value: "428",
    change: "+35%",
    comparisonText: "so với tháng trước",
    isPositive: true,
    iconType: "loyal",
  },
  {
    id: "new-customers",
    title: "Khách hàng mới",
    value: "368",
    change: "+18%",
    comparisonText: "so với tháng trước",
    isPositive: true,
    iconType: "new",
  },
  {
    id: "revenue-customers",
    title: "Doanh thu từ khách hàng",
    value: "1.268.590.000 đ",
    change: "+28%",
    comparisonText: "so với tháng trước",
    isPositive: true,
    iconType: "revenue",
  },
]

// Segment Tabs
export const CUSTOMERS_SEGMENT_TABS: readonly CustomerSegmentItem[] = [
  { id: "all", label: "Tất cả", count: 2716 },
  { id: "loyal", label: "Khách hàng thân thiết", count: 428 },
  { id: "new", label: "Khách hàng mới", count: 368 },
  { id: "enterprise", label: "Khách hàng doanh nghiệp", count: 156 },
  { id: "international", label: "Khách hàng quốc tế", count: 892 },
]

// 10 Customers Table Rows
export const CUSTOMERS_MOCK_LIST: readonly CustomerItem[] = [
  {
    id: "cust-01",
    name: "Sarah Johnson",
    badge: "loyal",
    badgeLabel: "Khách hàng thân thiết",
    avatar: "/about/team-2.jpg",
    nationality: "Mỹ",
    flag: "🇺🇸",
    phoneNumber: "+1 234 567 890",
    email: "sarah.j@gmail.com",
    bookingsCount: 12,
    totalSpent: "68.250.000 đ",
    status: "active",
    statusLabel: "Đang hoạt động",
  },
  {
    id: "cust-02",
    name: "Lý Văn Nam",
    avatar: "/about/team-3.jpg",
    nationality: "Việt Nam",
    flag: "🇻🇳",
    phoneNumber: "0903 456 789",
    email: "namlv@gmail.com",
    bookingsCount: 5,
    totalSpent: "24.600.000 đ",
    status: "active",
    statusLabel: "Đang hoạt động",
  },
  {
    id: "cust-03",
    name: "Emma Wilson",
    badge: "loyal",
    badgeLabel: "Khách hàng thân thiết",
    avatar: "/about/team-4.jpg",
    nationality: "Anh",
    flag: "🇬🇧",
    phoneNumber: "+44 7700 900123",
    email: "emma.wilson@mail.com",
    bookingsCount: 8,
    totalSpent: "52.300.000 đ",
    status: "active",
    statusLabel: "Đang hoạt động",
  },
  {
    id: "cust-04",
    name: "Trần Thu Hà",
    avatar: "/about/team-1.jpg",
    nationality: "Việt Nam",
    flag: "🇻🇳",
    phoneNumber: "0912 345 678",
    email: "hathu@gmail.com",
    bookingsCount: 4,
    totalSpent: "18.750.000 đ",
    status: "active",
    statusLabel: "Đang hoạt động",
  },
  {
    id: "cust-05",
    name: "Daniel Kim",
    avatar: "/about/team-3.jpg",
    nationality: "Hàn Quốc",
    flag: "🇰🇷",
    phoneNumber: "+82 10 9876 5432",
    email: "daniel.kim@mail.com",
    bookingsCount: 6,
    totalSpent: "35.800.000 đ",
    status: "active",
    statusLabel: "Đang hoạt động",
  },
  {
    id: "cust-06",
    name: "Sophie Martin",
    avatar: "/about/team-4.jpg",
    nationality: "Pháp",
    flag: "🇫🇷",
    phoneNumber: "+33 6 12 34 56 78",
    email: "sophie.m@mail.com",
    bookingsCount: 3,
    totalSpent: "15.200.000 đ",
    status: "paused",
    statusLabel: "Tạm ngừng",
  },
  {
    id: "cust-07",
    name: "Nguyễn Hoàng",
    avatar: "/about/team-1.jpg",
    nationality: "Việt Nam",
    flag: "🇻🇳",
    phoneNumber: "0987 654 321",
    email: "hoangnguyen@gmail.com",
    bookingsCount: 7,
    totalSpent: "42.150.000 đ",
    status: "active",
    statusLabel: "Đang hoạt động",
  },
  {
    id: "cust-08",
    name: "Olivia Brown",
    avatar: "/about/team-2.jpg",
    nationality: "Úc",
    flag: "🇦🇺",
    phoneNumber: "+61 412 345 678",
    email: "olivia.b@mail.com",
    bookingsCount: 4,
    totalSpent: "22.800.000 đ",
    status: "active",
    statusLabel: "Đang hoạt động",
  },
  {
    id: "cust-09",
    name: "Phạm Minh Đức",
    avatar: "/about/team-3.jpg",
    nationality: "Việt Nam",
    flag: "🇻🇳",
    phoneNumber: "0919 876 543",
    email: "minhduc@gmail.com",
    bookingsCount: 2,
    totalSpent: "9.600.000 đ",
    status: "pending",
    statusLabel: "Chưa kích hoạt",
  },
  {
    id: "cust-10",
    name: "Isabella Garcia",
    avatar: "/about/team-4.jpg",
    nationality: "Tây Ban Nha",
    flag: "🇪🇸",
    phoneNumber: "+34 612 345 678",
    email: "isabella.g@mail.com",
    bookingsCount: 5,
    totalSpent: "28.400.000 đ",
    status: "active",
    statusLabel: "Đang hoạt động",
  },
]

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
