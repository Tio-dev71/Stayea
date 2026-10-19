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

export const MOCK_DEALS: DealItem[] = [
  {
    id: "deal-1",
    name: "Khám phá Phú Quốc hè 2024",
    subtitle: "Ưu đãi mùa hè sôi động",
    code: "PQSUMMER24",
    type: "Giảm giá trực tiếp",
    value: "20%",
    startDate: "01/06/2024",
    endDate: "31/08/2024",
    usedCount: 1250,
    status: "active",
    image: "/experience/cano-4-islands.jpg",
    category: "Tour biển đảo",
    featured: true,
    sortOrder: 1,
  },
  {
    id: "deal-2",
    name: "Early Bird - Đặt sớm giá tốt",
    subtitle: "Đặt sớm, tiết kiệm nhiều",
    code: "EARLYBIRD",
    type: "Giảm giá trực tiếp",
    value: "15%",
    startDate: "15/05/2024",
    endDate: "15/09/2024",
    usedCount: 980,
    status: "active",
    image: "/experience/tour-3-dao.jpg",
    category: "Tất cả",
    featured: true,
    sortOrder: 2,
  },
  {
    id: "deal-3",
    name: "Mùa thu vàng Đà Nẵng",
    subtitle: "Trải nghiệm trọn vẹn",
    code: "AUTUMNDN",
    type: "Mã giảm giá",
    value: "300.000 đ",
    startDate: "01/08/2024",
    endDate: "30/10/2024",
    usedCount: 540,
    status: "active",
    image: "/packages/sunset-cruise.jpg",
    category: "Tham quan",
    featured: false,
    sortOrder: 3,
  },
  {
    id: "deal-4",
    name: "Combo gia đình",
    subtitle: "Đi cùng nhau, vui gấp bội",
    code: "FAMILYFUN",
    type: "Combo ưu đãi",
    value: "25%",
    startDate: "01/06/2024",
    endDate: "31/07/2024",
    usedCount: 760,
    status: "active",
    image: "/packages/kayak-rach-vem.jpg",
    category: "Tour biển đảo",
    featured: true,
    sortOrder: 4,
  },
  {
    id: "deal-5",
    name: "Quà tặng sinh nhật",
    subtitle: "Món ngon nhất, vui nhất",
    code: "BDAYGIFT",
    type: "Quà tặng kèm",
    value: "Bữa tối hải sản",
    startDate: "01/01/2024",
    endDate: "31/12/2024",
    usedCount: 320,
    status: "active",
    image: "/packages/tour-am-thuc.jpg",
    category: "Ẩm thực",
    featured: false,
    sortOrder: 5,
  },
  {
    id: "deal-6",
    name: "Flash Sale cuối tuần",
    subtitle: "Sập sàn hè này",
    code: "FLASHSALE",
    type: "Giảm giá trực tiếp",
    value: "35%",
    startDate: "01/06/2024",
    endDate: "30/08/2024",
    usedCount: 520,
    status: "active",
    image: "/packages/tour-dao-hoang.jpg",
    category: "Thể thao biển",
    featured: true,
    sortOrder: 6,
  },
  {
    id: "deal-7",
    name: "Ưu đãi khách hàng thân thiết",
    subtitle: "Tri ân khách hàng",
    code: "VIPLOYAL",
    type: "Mã giảm giá",
    value: "500.000 đ",
    startDate: "01/01/2024",
    endDate: "31/12/2024",
    usedCount: 410,
    status: "active",
    image: "/about/beach-opt-0.jpg",
    category: "Tất cả",
    featured: false,
    sortOrder: 7,
  },
  {
    id: "deal-8",
    name: "Giảm giá nhóm đông",
    subtitle: "Đi càng đông, vui càng nhiều",
    code: "GROUP10",
    type: "Giảm giá trực tiếp",
    value: "18%",
    startDate: "01/05/2024",
    endDate: "30/09/2024",
    usedCount: 290,
    status: "active",
    image: "/packages/kham-pha-4-dao.jpg",
    category: "Tour biển đảo",
    featured: false,
    sortOrder: 8,
  },
  {
    id: "deal-9",
    name: "Black Friday 2024",
    subtitle: "Ưu đãi lớn nhất năm",
    code: "BF2024",
    type: "Giảm giá trực tiếp",
    value: "50%",
    startDate: "25/11/2024",
    endDate: "30/11/2024",
    usedCount: 0,
    status: "upcoming",
    image: "/about/phu-quoc-coral-reef.jpg",
    category: "Tất cả",
    featured: true,
    sortOrder: 9,
  },
  {
    id: "deal-10",
    name: "Tết 2025 - Du xuân đón lộc",
    subtitle: "Lộc cưới, trải nghiệm mới",
    code: "TET2025",
    type: "Combo ưu đãi",
    value: "20%",
    startDate: "20/01/2025",
    endDate: "10/02/2025",
    usedCount: 0,
    status: "upcoming",
    image: "/packages/sunset-cruise.jpg",
    category: "Tour biển đảo",
    featured: true,
    sortOrder: 10,
  },
]

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
