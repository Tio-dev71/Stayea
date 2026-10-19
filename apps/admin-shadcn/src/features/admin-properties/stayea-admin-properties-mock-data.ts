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
    value: "342",
    change: "+12%",
    comparisonText: "so với tháng trước",
    isPositive: true,
    iconType: "total",
  },
  {
    id: "active-properties",
    title: "Đang hoạt động",
    value: "298",
    change: "+8%",
    comparisonText: "so với tháng trước",
    isPositive: true,
    iconType: "active",
  },
  {
    id: "paused-properties",
    title: "Tạm dừng",
    value: "28",
    change: "-5%",
    comparisonText: "so với tháng trước",
    isPositive: false,
    iconType: "paused",
  },
  {
    id: "pending-properties",
    title: "Cần kiểm duyệt",
    value: "16",
    change: "+33%",
    comparisonText: "so với tháng trước",
    isPositive: true,
    iconType: "pending",
  },
]

// 10 Properties Table Rows
export const PROPERTIES_MOCK_LIST: readonly PropertyItem[] = [
  {
    id: "prop-01",
    name: "Sunset Villa Phú Quốc",
    badge: "verified",
    propertyType: "Biệt thự",
    location: "Dương Đông, Phú Quốc",
    roomsCount: 4,
    priceFrom: "3.500.000 đ",
    status: "active",
    statusLabel: "Đang hoạt động",
    views: "12.4K",
    bookingsCount: 86,
    imageUrl: "/stay/lahana-villa.jpg",
  },
  {
    id: "prop-02",
    name: "Ocean View Apartment",
    propertyType: "Căn hộ",
    location: "An Thới, Phú Quốc",
    roomsCount: 2,
    priceFrom: "1.800.000 đ",
    status: "active",
    statusLabel: "Đang hoạt động",
    views: "8.7K",
    bookingsCount: 64,
    imageUrl: "/stay/sunset-apartments.jpg",
  },
  {
    id: "prop-03",
    name: "Beach House Phú Quốc",
    badge: "select",
    propertyType: "Homestay",
    location: "Cửa Cạn, Phú Quốc",
    roomsCount: 3,
    priceFrom: "2.200.000 đ",
    status: "active",
    statusLabel: "Đang hoạt động",
    views: "6.3K",
    bookingsCount: 52,
    imageUrl: "/stay/ocean-bliss-villa.jpg",
  },
  {
    id: "prop-04",
    name: "Tropical Villa",
    propertyType: "Biệt thự",
    location: "Gành Dầu, Phú Quốc",
    roomsCount: 5,
    priceFrom: "6.800.000 đ",
    status: "paused",
    statusLabel: "Tạm dừng",
    views: "4.1K",
    bookingsCount: 28,
    imageUrl: "/stay/tropical-garden.jpg",
  },
  {
    id: "prop-05",
    name: "City Loft Phú Quốc",
    propertyType: "Căn hộ",
    location: "Dương Đông, Phú Quốc",
    roomsCount: 1,
    priceFrom: "1.200.000 đ",
    status: "active",
    statusLabel: "Đang hoạt động",
    views: "9.8K",
    bookingsCount: 71,
    imageUrl: "/stay/marina-apartment.jpg",
  },
  {
    id: "prop-06",
    name: "Garden House",
    propertyType: "Homestay",
    location: "Cửa Dương, Phú Quốc",
    roomsCount: 2,
    priceFrom: "1.500.000 đ",
    status: "pending",
    statusLabel: "Cần kiểm duyệt",
    views: "2.3K",
    bookingsCount: 12,
    imageUrl: "/stay/the-leaf-villa.jpg",
  },
  {
    id: "prop-07",
    name: "Lakeside Villa",
    propertyType: "Biệt thự",
    location: "Bãi Trường, Phú Quốc",
    roomsCount: 4,
    priceFrom: "4.200.000 đ",
    status: "active",
    statusLabel: "Đang hoạt động",
    views: "7.6K",
    bookingsCount: 40,
    imageUrl: "/stay/verified-resort.jpg",
  },
  {
    id: "prop-08",
    name: "Sea View Villa",
    propertyType: "Biệt thự",
    location: "An Thới, Phú Quốc",
    roomsCount: 3,
    priceFrom: "3.800.000 đ",
    status: "active",
    statusLabel: "Đang hoạt động",
    views: "5.9K",
    bookingsCount: 38,
    imageUrl: "/stay/seashell-boutique.jpg",
  },
  {
    id: "prop-09",
    name: "Palm Villa",
    propertyType: "Biệt thự",
    location: "Hàm Ninh, Phú Quốc",
    roomsCount: 3,
    priceFrom: "2.900.000 đ",
    status: "paused",
    statusLabel: "Tạm dừng",
    views: "3.1K",
    bookingsCount: 21,
    imageUrl: "/stay/famiana-resort.jpg",
  },
  {
    id: "prop-10",
    name: "The Mango House",
    propertyType: "Homestay",
    location: "Ông Lang, Phú Quốc",
    roomsCount: 2,
    priceFrom: "1.600.000 đ",
    status: "active",
    statusLabel: "Đang hoạt động",
    views: "6.7K",
    bookingsCount: 49,
    imageUrl: "/stay/mango-bay.jpg",
  },
]

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
