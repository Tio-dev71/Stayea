export interface PropertyItem {
  id: string
  name: string
  badge?: "verified" | "select"
  propertyType: "Biệt thự" | "Căn hộ" | "Homestay" | "Khách sạn" | "Resort"
  location: string
  roomsCount: number
  priceFrom: string
  status: "active" | "paused" | "pending"
  statusLabel: string
  views: string
  bookingsCount: number
  imageUrl: string
}

export interface PropertyKpiItem {
  id: string
  title: string
  value: string
  change: string
  comparisonText: string
  isPositive: boolean
  iconType: "total" | "active" | "paused" | "pending"
}

export interface AreaDistributionItem {
  id: string
  area: string
  percentage: number
  count: number
  color: string
}

export interface PropertyTypeDistributionItem {
  id: string
  typeName: string
  percentage: number
  color: string
}

// 4 KPI Summary Cards
export const PROPERTIES_KPI_DATA: readonly PropertyKpiItem[] = [
  {
    id: "total-properties",
    title: "Tổng bất động sản",
    value: "4",
    change: "0%",
    comparisonText: "so với tháng trước",
    isPositive: true,
    iconType: "total",
  },
  {
    id: "active-properties",
    title: "Đang hoạt động",
    value: "4",
    change: "0%",
    comparisonText: "so với tháng trước",
    isPositive: true,
    iconType: "active",
  },
  {
    id: "paused-properties",
    title: "Tạm dừng",
    value: "0",
    change: "0%",
    comparisonText: "so với tháng trước",
    isPositive: false,
    iconType: "paused",
  },
  {
    id: "pending-properties",
    title: "Cần kiểm duyệt",
    value: "0",
    change: "0%",
    comparisonText: "so với tháng trước",
    isPositive: true,
    iconType: "pending",
  },
]

// 10 Properties Table Rows
export const PROPERTIES_MOCK_LIST: readonly PropertyItem[] = []

// Area Distribution Breakdown
export const PROPERTIES_AREA_DISTRIBUTION: readonly AreaDistributionItem[] = [
  { id: "area-1", area: "Dương Đông", percentage: 28, count: 96, color: "#10b981" },
  { id: "area-2", area: "An Thới", percentage: 22, count: 75, color: "#eab308" },
  { id: "area-3", area: "Gành Dầu", percentage: 15, count: 51, color: "#3b82f6" },
  { id: "area-4", area: "Cửa Cạn", percentage: 12, count: 41, color: "#f97316" },
  { id: "area-5", area: "Ông Lang", percentage: 10, count: 34, color: "#06b6d4" },
  { id: "area-6", area: "Hàm Ninh", percentage: 8, count: 27, color: "#a855f7" },
  { id: "area-7", area: "Khác", percentage: 5, count: 18, color: "#22c55e" },
]

// Property Types Distribution for Donut Chart
export const PROPERTY_TYPE_DISTRIBUTION: readonly PropertyTypeDistributionItem[] = [
  { id: "type-1", typeName: "Biệt thự", percentage: 38, color: "#10b981" },
  { id: "type-2", typeName: "Căn hộ", percentage: 24, color: "#ef4444" },
  { id: "type-3", typeName: "Homestay", percentage: 18, color: "#f59e0b" },
  { id: "type-4", typeName: "Khách sạn", percentage: 10, color: "#3b82f6" },
  { id: "type-5", typeName: "Resort", percentage: 6, color: "#8b5cf6" },
  { id: "type-6", typeName: "Khác", percentage: 4, color: "#94a3b8" },
]
