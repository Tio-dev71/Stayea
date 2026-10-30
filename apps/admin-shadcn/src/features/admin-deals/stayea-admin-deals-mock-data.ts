export type DealStatus = "active" | "upcoming" | "expired" | "paused"

export interface DealItem {
  id: string
  name: string
  subtitle: string
  code: string
  type: "Giảm giá trực tiếp" | "Mã giảm giá" | "Combo ưu đãi" | "Quà tặng kèm" | "Miễn phí dịch vụ"
  value: string
  startDate: string
  endDate: string
  usedCount: number
  status: DealStatus
  image: string
  category: string
  featured: boolean
  sortOrder: number
}

export interface DealKpiStat {
  id: string
  title: string
  value: string
  change: string
  trend: "up" | "down"
  subtext: string
  icon: "tag" | "percent" | "clock" | "check-circle"
}

export const MOCK_DEAL_KPIS: readonly DealKpiStat[] = [
  {
    id: "total",
    title: "Tổng chương trình",
    value: "24",
    change: "+33%",
    trend: "up",
    subtext: "so với tháng trước",
    icon: "tag",
  },
  {
    id: "active",
    title: "Đang hoạt động",
    value: "18",
    change: "+12%",
    trend: "up",
    subtext: "đang mang lại doanh thu",
    icon: "percent",
  },
  {
    id: "upcoming",
    title: "Sắp diễn ra",
    value: "3",
    change: "0%",
    trend: "up",
    subtext: "đã lên lịch sẵn",
    icon: "clock",
  },
  {
    id: "conversion",
    title: "Tỷ lệ sử dụng",
    value: "68.4%",
    change: "+4.2%",
    trend: "up",
    subtext: "trên tổng số booking",
    icon: "check-circle",
  },
]

export const MOCK_DEALS: DealItem[] = []

export interface DealCategoryStat {
  name: string
  percent: number
  count: number
  color: string
}

export const DEAL_CATEGORY_STATS: readonly DealCategoryStat[] = [
  { name: "Giảm giá", percent: 46, count: 11, color: "#10b981" },
  { name: "Mã giảm giá", percent: 25, count: 6, color: "#059669" },
  { name: "Combo", percent: 13, count: 3, color: "#f59e0b" },
  { name: "Quà tặng", percent: 8, count: 2, color: "#0284c7" },
  { name: "Miễn phí", percent: 4, count: 1, color: "#8b5cf6" },
  { name: "Khác", percent: 4, count: 1, color: "#64748b" },
]

export interface TopDealProgram {
  rank: number
  name: string
  bookings: string
  image: string
}

export const TOP_DEAL_PROGRAMS: readonly TopDealProgram[] = [
  {
    rank: 1,
    name: "Khám phá Phú Quốc hè 2024",
    bookings: "1.250 lượt đặt",
    image: "/experience/cano-4-islands.jpg",
  },
  {
    rank: 2,
    name: "Early Bird - Đặt sớm giá tốt",
    bookings: "980 lượt đặt",
    image: "/experience/tour-3-dao.jpg",
  },
  {
    rank: 3,
    name: "Combo gia đình",
    bookings: "760 lượt đặt",
    image: "/packages/kayak-rach-vem.jpg",
  },
  {
    rank: 4,
    name: "Mùa thu vàng Đà Nẵng",
    bookings: "540 lượt đặt",
    image: "/packages/sunset-cruise.jpg",
  },
  {
    rank: 5,
    name: "Flash Sale cuối tuần",
    bookings: "520 lượt đặt",
    image: "/packages/tour-dao-hoang.jpg",
  },
]
