export type PartnerType = "individual" | "management_company" | "agency"
export type PartnerStatus = "active" | "pending" | "paused"

export interface HostPartnerItem {
  id: string
  name: string
  email: string
  avatar: string
  partnerType: PartnerType
  partnerTypeLabel: string
  propertiesCount: number
  region: string
  joinedDate: string
  revenue: string
  commission: string
  status: PartnerStatus
  statusLabel: string
}

export interface HostKpiItem {
  id: string
  title: string
  value: string
  change: string
  comparisonText: string
  isPositive: boolean
  iconType: "total" | "active" | "pending" | "paused"
}

export interface HostRegionDistributionItem {
  id: string
  region: string
  percentage: number
  count: number
  color: string
}

export interface TopPerformingHostItem {
  id: string
  rank: number
  name: string
  revenue: string
  avatar: string
}

export interface HostSegmentItem {
  id: string
  label: string
  count: number
}

// 4 KPI Summary Cards
export const HOSTS_KPI_DATA: readonly HostKpiItem[] = [
  {
    id: "total-hosts",
    title: "Tổng chủ nhà/đối tác",
    value: "0",
    change: "0%",
    comparisonText: "so với tháng trước",
    isPositive: true,
    iconType: "total",
  },
  {
    id: "active-hosts",
    title: "Đang hợp tác",
    value: "0",
    change: "0%",
    comparisonText: "so với tháng trước",
    isPositive: true,
    iconType: "active",
  },
  {
    id: "pending-hosts",
    title: "Chờ duyệt",
    value: "0",
    change: "0%",
    comparisonText: "so với tháng trước",
    isPositive: true,
    iconType: "pending",
  },
  {
    id: "paused-hosts",
    title: "Tạm ngưng",
    value: "0",
    change: "0%",
    comparisonText: "so với tháng trước",
    isPositive: false,
    iconType: "paused",
  },
]

// 5 Segment Tabs
export const HOSTS_SEGMENT_TABS: readonly HostSegmentItem[] = [
  { id: "all", label: "Tất cả", count: 0 },
  { id: "individual", label: "Chủ nhà cá nhân", count: 0 },
  { id: "management_company", label: "Công ty quản lý", count: 0 },
  { id: "agency", label: "Đối tác đại lý", count: 0 },
  { id: "pending", label: "Đang chờ duyệt", count: 0 },
]

// 10 Hosts / Partners Table Rows
export const HOSTS_MOCK_LIST: readonly HostPartnerItem[] = []

// Regional Distribution (Donut Chart)
export const HOST_REGIONAL_DISTRIBUTION: readonly HostRegionDistributionItem[] = [
  { id: "reg-1", region: "Dương Đông", percentage: 28, count: 120, color: "#10b981" },
  { id: "reg-2", region: "An Thới", percentage: 22, count: 94, color: "#ef4444" },
  { id: "reg-3", region: "Gành Dầu", percentage: 15, count: 64, color: "#f59e0b" },
  { id: "reg-4", region: "Cửa Cạn", percentage: 12, count: 51, color: "#3b82f6" },
  { id: "reg-5", region: "Hàm Ninh", percentage: 10, count: 43, color: "#8b5cf6" },
  { id: "reg-6", region: "Ông Lang", percentage: 8, count: 34, color: "#06b6d4" },
  { id: "reg-7", region: "Khác", percentage: 5, count: 22, color: "#94a3b8" },
]

// Top 5 Performing Hosts / Partners
export const TOP_PERFORMING_HOSTS: readonly TopPerformingHostItem[] = [
  {
    id: "top-1",
    rank: 1,
    name: "Phú Quốc Homes",
    revenue: "2.580.000.000 đ",
    avatar: "/stay/ocean-bliss-villa.jpg",
  },
  {
    id: "top-2",
    rank: 2,
    name: "Sunset Villas",
    revenue: "1.920.000.000 đ",
    avatar: "/stay/sunset-hill.jpg",
  },
  {
    id: "top-3",
    rank: 3,
    name: "Tropical Living",
    revenue: "860.000.000 đ",
    avatar: "/stay/tropical-garden.jpg",
  },
  {
    id: "top-4",
    rank: 4,
    name: "Ocean Stay",
    revenue: "750.000.000 đ",
    avatar: "/stay/the-shell-resort.jpg",
  },
  {
    id: "top-5",
    rank: 5,
    name: "Trần Văn Hùng",
    revenue: "320.000.000 đ",
    avatar: "/about/team-3.jpg",
  },
]
