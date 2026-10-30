export interface MarketingKpiItem {
  id: string
  label: string
  value: string
  trend: string
  trendDirection: "up" | "down"
  iconType: "megaphone" | "users" | "mouse-pointer" | "bar-chart"
  comparisonText: string
  bgLightColor: string
  iconColor: string
}

export interface MarketingTimelinePoint {
  date: string
  reach: number // Lượt tiếp cận (K)
  engagement: number // Lượt tương tác (K)
  orders: number // Lượt đặt hàng (K)
}

export interface MarketingChannelSlice {
  name: string
  percentage: number
  value: string
  color: string
}

export interface MarketingOrdersByChannelItem {
  channel: string
  orders: number
  color: string
}

export interface MarketingFunnelStage {
  id: string
  stage: string
  countFormatted: string
  conversionRate: string
  color: string
}

export type CampaignStatus = "running" | "scheduled" | "paused" | "ended" | "completed"

export interface MarketingCampaignItem {
  id: string
  rank?: number
  title: string
  subtitle: string
  image: string
  channel: "Facebook" | "Google" | "Instagram" | "Zalo" | "Email Marketing" | "TikTok"
  channelType: string
  dateRange: string
  costFormatted: string
  reachFormatted: string
  ordersCount: number | string
  roas: number
  status: CampaignStatus
  statusLabel: string
  budget?: number
  budgetFormatted?: string
  resultValue?: string
  resultUnit?: string
}

export interface MarketingKeyMetricItem {
  id: string
  label: string
  value: string
  trend: string
  trendDirection: "up" | "down"
}

export interface MarketingRelatedReportItem {
  id: string
  label: string
  iconType: "campaign" | "channel" | "content" | "email" | "social" | "promotion"
}

export interface MarketingQuickActionItem {
  id: string
  label: string
  iconType: "create" | "ads" | "calendar" | "export"
  actionKey: string
}

/* ==========================================================================
   1. KPI CARDS (4 cards at top)
   ========================================================================== */
export const MOCK_MARKETING_KPIS: MarketingKpiItem[] = [
  {
    id: "reach",
    label: "Tổng lượt tiếp cận",
    value: "0",
    trend: "0%",
    trendDirection: "up",
    iconType: "megaphone",
    comparisonText: "dữ liệu thời gian thực",
    bgLightColor: "bg-emerald-50 border-emerald-100/80",
    iconColor: "text-emerald-600",
  },
  {
    id: "engagement",
    label: "Lượt tương tác",
    value: "0",
    trend: "0%",
    trendDirection: "up",
    iconType: "users",
    comparisonText: "dữ liệu thời gian thực",
    bgLightColor: "bg-amber-50 border-amber-100/80",
    iconColor: "text-amber-500",
  },
  {
    id: "web-traffic",
    label: "Lượt truy cập website",
    value: "0",
    trend: "0%",
    trendDirection: "up",
    iconType: "mouse-pointer",
    comparisonText: "dữ liệu thời gian thực",
    bgLightColor: "bg-sky-50 border-sky-100/80",
    iconColor: "text-sky-600",
  },
  {
    id: "orders",
    label: "Lượt đặt hàng từ Marketing",
    value: "0",
    trend: "0%",
    trendDirection: "up",
    iconType: "bar-chart",
    comparisonText: "dữ liệu thời gian thực",
    bgLightColor: "bg-amber-50 border-amber-100/80",
    iconColor: "text-amber-600",
  },
]

/* ==========================================================================
   2. 9 CATEGORY TABS
   ========================================================================== */
export const MOCK_MARKETING_CATEGORY_TABS = [
  { id: "tong-quan", label: "Tổng quan" },
  { id: "kenh-marketing", label: "Kênh marketing" },
  { id: "chien-dich", label: "Chiến dịch" },
  { id: "quang-cao", label: "Quảng cáo" },
  { id: "noi-dung", label: "Nội dung" },
  { id: "email-marketing", label: "Email Marketing" },
  { id: "seo", label: "SEO" },
  { id: "mang-xa-hoi", label: "Mạng xã hội" },
  { id: "khuyen-mai", label: "Khuyến mãi" },
] as const

/* ==========================================================================
   3. TIMELINE DATA (Hiệu quả theo thời gian - 3 series: Tiếp cận, Tương tác, Đặt hàng)
   ========================================================================== */
export const MOCK_MARKETING_TIMELINE: MarketingTimelinePoint[] = []

/* ==========================================================================
   4. CHANNELS SHARE (Hiệu quả theo kênh - Donut Chart: 258.4K Lượt tiếp cận)
   ========================================================================== */
export const MOCK_MARKETING_CHANNELS: MarketingChannelSlice[] = []

/* ==========================================================================
   5. ORDERS BY CHANNEL (Lượt đặt hàng theo kênh marketing - Bar Chart)
   ========================================================================== */
export const MOCK_MARKETING_ORDERS_BY_CHANNEL: MarketingOrdersByChannelItem[] = []

/* ==========================================================================
   6. CONVERSION FUNNEL (Phễu chuyển đổi marketing)
   ========================================================================== */
export const MOCK_MARKETING_CONVERSION_FUNNEL: MarketingFunnelStage[] = []

/* ==========================================================================
   7. TOP 5 MARKETING CAMPAIGNS (Top chiến dịch marketing)
   ========================================================================== */
export const MOCK_TOP_MARKETING_CAMPAIGNS: MarketingCampaignItem[] = []

// Backwards compatibility alias
export const MOCK_MARKETING_CAMPAIGNS = MOCK_TOP_MARKETING_CAMPAIGNS

/* ==========================================================================
   8. RIGHT SIDEBAR: CHỈ SỐ MARKETING QUAN TRỌNG
   ========================================================================== */
export const MOCK_MARKETING_KEY_METRICS: MarketingKeyMetricItem[] = [
  {
    id: "metric-cr",
    label: "Tỷ lệ chuyển đổi",
    value: "0%",
    trend: "0%",
    trendDirection: "up",
  },
  {
    id: "metric-cpa",
    label: "Chi phí/đặt phòng (CPA)",
    value: "0 đ",
    trend: "0%",
    trendDirection: "down",
  },
  {
    id: "metric-roas",
    label: "ROAS (Doanh thu/Chi phí)",
    value: "0",
    trend: "0%",
    trendDirection: "up",
  },
  {
    id: "metric-ctr",
    label: "Tỷ lệ nhấp (CTR)",
    value: "0%",
    trend: "0%",
    trendDirection: "up",
  },
  {
    id: "metric-engagement",
    label: "Tỷ lệ tương tác (Engagement)",
    value: "0%",
    trend: "0%",
    trendDirection: "up",
  },
]

/* ==========================================================================
   9. RIGHT SIDEBAR: BÁO CÁO LIÊN QUAN
   ========================================================================== */
export const MOCK_MARKETING_RELATED_REPORTS: MarketingRelatedReportItem[] = [
  { id: "rel-campaigns", label: "Báo cáo chiến dịch", iconType: "campaign" },
  { id: "rel-channels", label: "Báo cáo kênh marketing", iconType: "channel" },
  { id: "rel-content", label: "Báo cáo nội dung", iconType: "content" },
  { id: "rel-email", label: "Báo cáo email marketing", iconType: "email" },
  { id: "rel-social", label: "Báo cáo mạng xã hội", iconType: "social" },
  { id: "rel-promotions", label: "Báo cáo khuyến mãi", iconType: "promotion" },
]

/* ==========================================================================
   10. RIGHT SIDEBAR: THAO TÁC NHANH
   ========================================================================== */
export const MOCK_MARKETING_QUICK_ACTIONS: MarketingQuickActionItem[] = [
  {
    id: "qa-create",
    label: "Tạo chiến dịch mới",
    iconType: "create",
    actionKey: "create-campaign",
  },
  {
    id: "qa-ads",
    label: "Quản lý quảng cáo",
    iconType: "ads",
    actionKey: "manage-ads",
  },
  {
    id: "qa-calendar",
    label: "Lên lịch nội dung",
    iconType: "calendar",
    actionKey: "schedule-content",
  },
  {
    id: "qa-export",
    label: "Xuất báo cáo marketing",
    iconType: "export",
    actionKey: "export-report",
  },
]

// Backwards compatibility exports
export const MOCK_RANKED_CHANNELS = [
  { rank: 1, name: "Facebook" as const, reach: "98.2K lượt tiếp cận" },
  { rank: 2, name: "Google" as const, reach: "61.9K lượt tiếp cận" },
  { rank: 3, name: "Instagram" as const, reach: "46.5K lượt tiếp cận" },
  { rank: 4, name: "Email Marketing" as const, reach: "20.6K lượt tiếp cận" },
  { rank: 5, name: "Zalo" as const, reach: "18.1K lượt tiếp cận" },
]

export const MOCK_MARKETING_SUGGESTIONS = [
  {
    id: "sug-1",
    title: "Tạo chiến dịch mùa cao điểm",
    subtitle: "Tận dụng xu hướng du lịch hè",
    iconType: "lightbulb" as const,
    bgColor: "bg-[#fff7ed]",
    iconColor: "text-[#ea580c]",
  },
]

export type MarketingRankedChannel = (typeof MOCK_RANKED_CHANNELS)[number]
export type MarketingSuggestionItem = (typeof MOCK_MARKETING_SUGGESTIONS)[number]

// ==========================================
// DỮ LIỆU MOCK: BÁO CÁO CHIẾN DỊCH MARKETING
// ==========================================

export interface CampaignPageKpiItem {
  id: string
  label: string
  value: string
  trend: string
  trendDirection: "up" | "down"
  comparisonText: string
  iconType: "megaphone" | "users" | "check-circle" | "pause-circle"
  bgLightColor: string
  iconColor: string
}

export const MOCK_CAMPAIGN_PAGE_KPIS: CampaignPageKpiItem[] = [
  {
    id: "kpi-camp-total",
    label: "Tổng số chiến dịch",
    value: "24",
    trend: "↑ +33%",
    trendDirection: "up",
    comparisonText: "so với 3 tháng trước",
    iconType: "megaphone",
    bgLightColor: "bg-[#e6f5ef]",
    iconColor: "text-[#007a48]",
  },
  {
    id: "kpi-camp-running",
    label: "Đang chạy",
    value: "8",
    trend: "↑ +14%",
    trendDirection: "up",
    comparisonText: "so với 3 tháng trước",
    iconType: "users",
    bgLightColor: "bg-[#fef3c7]",
    iconColor: "text-[#d97706]",
  },
  {
    id: "kpi-camp-completed",
    label: "Đã hoàn thành",
    value: "12",
    trend: "↑ +50%",
    trendDirection: "up",
    comparisonText: "so với 3 tháng trước",
    iconType: "check-circle",
    bgLightColor: "bg-[#ecfdf5]",
    iconColor: "text-[#10b981]",
  },
  {
    id: "kpi-camp-paused",
    label: "Tạm dừng",
    value: "4",
    trend: "↓ -20%",
    trendDirection: "down",
    comparisonText: "so với 3 tháng trước",
    iconType: "pause-circle",
    bgLightColor: "bg-[#fef2f2]",
    iconColor: "text-[#ef4444]",
  },
]

export interface CampaignTypeShareItem {
  name: string
  count: number
  percentage: number
  color: string
}

export const MOCK_CAMPAIGN_TYPES_DONUT: CampaignTypeShareItem[] = [
  { name: "Quảng cáo trả phí", count: 9, percentage: 37, color: "#2563eb" },
  { name: "Nội dung mạng xã hội", count: 6, percentage: 25, color: "#9333ea" },
  { name: "Email marketing", count: 4, percentage: 15, color: "#ec4899" },
  { name: "Chương trình hợp tác", count: 3, percentage: 12, color: "#f59e0b" },
  { name: "Ưu đãi/Khuyến mãi", count: 2, percentage: 8, color: "#0ea5e9" },
  { name: "Khác", count: 1, percentage: 3, color: "#1e293b" },
]

export const MOCK_CAMPAIGN_BOOKINGS_BY_CHANNEL: MarketingOrdersByChannelItem[] = [
  { channel: "Facebook", orders: 1250, color: "#3b82f6" },
  { channel: "Google", orders: 980, color: "#ef4444" },
  { channel: "Instagram", orders: 760, color: "#ec4899" },
  { channel: "Zalo", orders: 540, color: "#f59e0b" },
  { channel: "Email", orders: 220, color: "#14b8a6" },
  { channel: "TikTok", orders: 76, color: "#334155" },
]

export interface CampaignCostRoasItem {
  id: string
  title: string
  costFormatted: string
  roas: number
  barWidthPercent: number
}

export const MOCK_CAMPAIGN_COST_ROAS_TOP5: CampaignCostRoasItem[] = [
  {
    id: "cr-1",
    title: "Khám phá Phú Quốc hè 2024",
    costFormatted: "20.000.000 đ",
    roas: 5.4,
    barWidthPercent: 100,
  },
  {
    id: "cr-2",
    title: "Early Bird Đà Nẵng",
    costFormatted: "15.000.000 đ",
    roas: 4.8,
    barWidthPercent: 75,
  },
  {
    id: "cr-3",
    title: "Trải nghiệm ẩm thực Việt",
    costFormatted: "5.000.000 đ",
    roas: 4.1,
    barWidthPercent: 25,
  },
  {
    id: "cr-4",
    title: "Ưu đãi cuối tuần",
    costFormatted: "8.000.000 đ",
    roas: 3.6,
    barWidthPercent: 40,
  },
  {
    id: "cr-5",
    title: "Newsletter tháng 8",
    costFormatted: "3.000.000 đ",
    roas: 2.9,
    barWidthPercent: 15,
  },
]

export const MOCK_CAMPAIGN_FULL_LIST: MarketingCampaignItem[] = [
  {
    id: "camp-1",
    rank: 1,
    title: "Khám phá Phú Quốc hè 2024",
    subtitle: "Quảng cáo trả phí mùa du lịch biển đảo",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=400&auto=format&fit=crop",
    channel: "Facebook",
    channelType: "Quảng cáo trả phí",
    dateRange: "01/06 - 31/08/2024",
    costFormatted: "20.000.000 đ",
    reachFormatted: "98.2K",
    ordersCount: "1.250",
    roas: 5.4,
    status: "running",
    statusLabel: "Đang chạy",
  },
  {
    id: "camp-2",
    rank: 2,
    title: "Early Bird Đà Nẵng",
    subtitle: "Google Search & Performance Max",
    image: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?q=80&w=400&auto=format&fit=crop",
    channel: "Google",
    channelType: "Google Ads",
    dateRange: "01/07 - 30/09/2024",
    costFormatted: "15.000.000 đ",
    reachFormatted: "61.9K",
    ordersCount: "980",
    roas: 4.8,
    status: "running",
    statusLabel: "Đang chạy",
  },
  {
    id: "camp-3",
    rank: 3,
    title: "Trải nghiệm ẩm thực Việt",
    subtitle: "Instagram Reels & Influencer Content",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=400&auto=format&fit=crop",
    channel: "Instagram",
    channelType: "Nội dung mạng xã hội",
    dateRange: "15/07 - 15/09/2024",
    costFormatted: "5.000.000 đ",
    reachFormatted: "46.5K",
    ordersCount: "760",
    roas: 4.1,
    status: "running",
    statusLabel: "Đang chạy",
  },
  {
    id: "camp-4",
    rank: 4,
    title: "Ưu đãi cuối tuần",
    subtitle: "Thông báo Zalo OA khách hàng thân thiết",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=400&auto=format&fit=crop",
    channel: "Zalo",
    channelType: "Zalo Offical Account",
    dateRange: "01/08 - 31/08/2024",
    costFormatted: "8.000.000 đ",
    reachFormatted: "18.1K",
    ordersCount: "220",
    roas: 3.6,
    status: "paused",
    statusLabel: "Tạm dừng",
  },
  {
    id: "camp-5",
    rank: 5,
    title: "Newsletter tháng 8",
    subtitle: "Bản tin du lịch & voucher độc quyền",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=400&auto=format&fit=crop",
    channel: "Email Marketing",
    channelType: "Email Marketing",
    dateRange: "01/08 - 31/08/2024",
    costFormatted: "3.000.000 đ",
    reachFormatted: "12.9K",
    ordersCount: "76",
    roas: 2.9,
    status: "completed",
    statusLabel: "Đã hoàn thành",
  },
]

export interface CampaignTopBookedItem {
  rank: number
  title: string
  image: string
  bookingsFormatted: string
}

export const MOCK_CAMPAIGN_TOP_BOOKINGS_SIDEBAR: CampaignTopBookedItem[] = [
  {
    rank: 1,
    title: "Khám phá Phú Quốc hè 2024",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=300&auto=format&fit=crop",
    bookingsFormatted: "1.250",
  },
  {
    rank: 2,
    title: "Early Bird Đà Nẵng",
    image: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?q=80&w=300&auto=format&fit=crop",
    bookingsFormatted: "980",
  },
  {
    rank: 3,
    title: "Trải nghiệm ẩm thực Việt",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=300&auto=format&fit=crop",
    bookingsFormatted: "760",
  },
  {
    rank: 4,
    title: "Ưu đãi cuối tuần",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=300&auto=format&fit=crop",
    bookingsFormatted: "540",
  },
  {
    rank: 5,
    title: "Newsletter tháng 8",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=300&auto=format&fit=crop",
    bookingsFormatted: "220",
  },
]

export interface CampaignOptimizationSuggestion {
  id: string
  title: string
  iconType: "clipboard" | "video" | "megaphone" | "ab-test" | "influencer"
}

export const MOCK_CAMPAIGN_OPTIMIZATION_SUGGESTIONS: CampaignOptimizationSuggestion[] = [
  {
    id: "cos-1",
    title: "Tăng ngân sách cho chiến dịch đang có ROAS cao",
    iconType: "clipboard",
  },
  {
    id: "cos-2",
    title: "Thử định dạng video ngắn trên TikTok/Instagram",
    iconType: "video",
  },
  {
    id: "cos-3",
    title: "Tái tiếp cận khách hàng đã tương tác",
    iconType: "megaphone",
  },
  {
    id: "cos-4",
    title: "A/B test nội dung quảng cáo",
    iconType: "ab-test",
  },
  {
    id: "cos-5",
    title: "Tận dụng Influencer địa phương",
    iconType: "influencer",
  },
]

export interface CampaignQuickActionItem {
  id: string
  label: string
  iconType: "create" | "manage" | "calendar" | "export" | "target"
  actionKey: string
}

export const MOCK_CAMPAIGN_PAGE_QUICK_ACTIONS: CampaignQuickActionItem[] = [
  {
    id: "cqa-create",
    label: "Tạo chiến dịch mới",
    iconType: "create",
    actionKey: "create-campaign",
  },
  {
    id: "cqa-manage",
    label: "Quản lý chiến dịch",
    iconType: "manage",
    actionKey: "manage-campaigns",
  },
  {
    id: "cqa-calendar",
    label: "Lên lịch nội dung",
    iconType: "calendar",
    actionKey: "schedule-content",
  },
  {
    id: "cqa-export",
    label: "Xuất báo cáo chiến dịch",
    iconType: "export",
    actionKey: "export-campaigns",
  },
  {
    id: "cqa-target",
    label: "Cài đặt mục tiêu",
    iconType: "target",
    actionKey: "settings-target",
  },
]


/* ==========================================================================
   MARKETING CHANNELS PAGE DATA ("Báo cáo Kênh marketing")
   ========================================================================== */

export interface ChannelPageKpi {
  id: string
  label: string
  value: string
  trend: string
  trendIsPositive: boolean
  comparisonText: string
  iconType: "pointer" | "users" | "cart" | "revenue" | "roas"
}

export const MOCK_CHANNEL_PAGE_KPIS: ChannelPageKpi[] = [
  {
    id: "reach",
    label: "Tổng lượt tiếp cận",
    value: "258.4K",
    trend: "+42%",
    trendIsPositive: true,
    comparisonText: "so với 3 tháng trước",
    iconType: "pointer",
  },
  {
    id: "engagement",
    label: "Lượt tương tác",
    value: "36.7K",
    trend: "+28%",
    trendIsPositive: true,
    comparisonText: "so với 3 tháng trước",
    iconType: "users",
  },
  {
    id: "bookings",
    label: "Lượt đặt phòng",
    value: "8.420",
    trend: "+31%",
    trendIsPositive: true,
    comparisonText: "so với 3 tháng trước",
    iconType: "cart",
  },
  {
    id: "revenue",
    label: "Doanh thu",
    value: "425.3M đ",
    trend: "+18%",
    trendIsPositive: true,
    comparisonText: "so với 3 tháng trước",
    iconType: "revenue",
  },
  {
    id: "roas",
    label: "ROAS trung bình",
    value: "4.8",
    trend: "+36%",
    trendIsPositive: true,
    comparisonText: "so với 3 tháng trước",
    iconType: "roas",
  },
]

export interface ChannelTimelineTrendPoint {
  date: string
  facebook: number
  google: number
  instagram: number
  zalo: number
  email: number
  other: number
}

export const MOCK_CHANNEL_TIMELINE_TRENDS: ChannelTimelineTrendPoint[] = [
  { date: "01/06", facebook: 20, google: 16, instagram: 12, zalo: 7, email: 5, other: 3 },
  { date: "15/06", facebook: 42, google: 22, instagram: 18, zalo: 11, email: 8, other: 4 },
  { date: "01/07", facebook: 38, google: 20, instagram: 16, zalo: 10, email: 7, other: 3 },
  { date: "15/07", facebook: 50, google: 28, instagram: 24, zalo: 14, email: 10, other: 5 },
  { date: "01/08", facebook: 46, google: 24, instagram: 20, zalo: 12, email: 9, other: 4 },
  { date: "15/08", facebook: 68, google: 42, instagram: 32, zalo: 18, email: 14, other: 6 },
  { date: "31/08", facebook: 78, google: 52, instagram: 38, zalo: 22, email: 16, other: 7 },
]

export interface ChannelReachDonutItem {
  id: string
  name: string
  percent: number
  formattedReach: string
  color: string
}

export const MOCK_CHANNEL_REACH_DONUT: ChannelReachDonutItem[] = [
  { id: "facebook", name: "Facebook", percent: 38, formattedReach: "98.2K", color: "#1877f2" },
  { id: "google", name: "Google", percent: 24, formattedReach: "61.9K", color: "#ea4335" },
  { id: "instagram", name: "Instagram", percent: 18, formattedReach: "46.5K", color: "#e1306c" },
  { id: "zalo", name: "Zalo", percent: 7, formattedReach: "18.1K", color: "#0068ff" },
  { id: "email", name: "Email Marketing", percent: 8, formattedReach: "20.6K", color: "#10b981" },
  { id: "tiktok", name: "TikTok", percent: 5, formattedReach: "12.9K", color: "#111827" },
]

export interface ChannelBookingsBarItem {
  channel: string
  orders: number
  color: string
}

export const MOCK_CHANNEL_BOOKINGS_BAR: ChannelBookingsBarItem[] = [
  { channel: "Facebook", orders: 1250, color: "#1877f2" },
  { channel: "Google", orders: 980, color: "#ea4335" },
  { channel: "Instagram", orders: 760, color: "#e1306c" },
  { channel: "Zalo", orders: 540, color: "#0068ff" },
  { channel: "Email", orders: 220, color: "#10b981" },
  { channel: "TikTok", orders: 76, color: "#1e293b" },
]

export interface ChannelRevenueBarItem {
  id: string
  channel: string
  revenueNum: number
  revenueFormatted: string
  color: string
}

export const MOCK_CHANNEL_REVENUE_BAR: ChannelRevenueBarItem[] = [
  { id: "fb", channel: "Facebook", revenueNum: 162.5, revenueFormatted: "162.5M đ", color: "#1877f2" },
  { id: "gg", channel: "Google", revenueNum: 76.6, revenueFormatted: "76.6M đ", color: "#ea4335" },
  { id: "ig", channel: "Instagram", revenueNum: 63.8, revenueFormatted: "63.8M đ", color: "#e1306c" },
  { id: "zl", channel: "Zalo", revenueNum: 34, revenueFormatted: "34.0M đ", color: "#0068ff" },
  { id: "em", channel: "Email Marketing", revenueNum: 12.4, revenueFormatted: "12.4M đ", color: "#10b981" },
  { id: "tt", channel: "TikTok", revenueNum: 8.1, revenueFormatted: "8.1M đ", color: "#1e293b" },
]

export interface ChannelPerformanceTableItem {
  rank: number
  id: string
  name: string
  iconType: "facebook" | "google" | "instagram" | "zalo" | "email" | "tiktok"
  reach: string
  engagement: string
  bookings: string
  cost: string
  revenue: string
  roas: number
  conversionRate: string
  trend: string
  trendPositive: boolean
}

export const MOCK_CHANNEL_PERFORMANCE_TABLE: ChannelPerformanceTableItem[] = [
  {
    rank: 1,
    id: "ch-fb",
    name: "Facebook",
    iconType: "facebook",
    reach: "98.2K",
    engagement: "14.5K",
    bookings: "1.250",
    cost: "20.000.000 đ",
    revenue: "162.500.000 đ",
    roas: 5.4,
    conversionRate: "1.27%",
    trend: "+28%",
    trendPositive: true,
  },
  {
    rank: 2,
    id: "ch-gg",
    name: "Google",
    iconType: "google",
    reach: "61.9K",
    engagement: "9.8K",
    bookings: "980",
    cost: "15.000.000 đ",
    revenue: "76.600.000 đ",
    roas: 4.8,
    conversionRate: "1.58%",
    trend: "+22%",
    trendPositive: true,
  },
  {
    rank: 3,
    id: "ch-ig",
    name: "Instagram",
    iconType: "instagram",
    reach: "46.5K",
    engagement: "7.2K",
    bookings: "760",
    cost: "5.000.000 đ",
    revenue: "63.800.000 đ",
    roas: 4.1,
    conversionRate: "1.63%",
    trend: "+46%",
    trendPositive: true,
  },
  {
    rank: 4,
    id: "ch-zl",
    name: "Zalo",
    iconType: "zalo",
    reach: "18.1K",
    engagement: "3.4K",
    bookings: "540",
    cost: "8.000.000 đ",
    revenue: "34.000.000 đ",
    roas: 3.6,
    conversionRate: "2.98%",
    trend: "+31%",
    trendPositive: true,
  },
  {
    rank: 5,
    id: "ch-em",
    name: "Email Marketing",
    iconType: "email",
    reach: "20.6K",
    engagement: "2.1K",
    bookings: "220",
    cost: "3.000.000 đ",
    revenue: "12.400.000 đ",
    roas: 2.9,
    conversionRate: "7.20%",
    trend: "+18%",
    trendPositive: true,
  },
  {
    rank: 6,
    id: "ch-tt",
    name: "TikTok",
    iconType: "tiktok",
    reach: "12.9K",
    engagement: "1.6K",
    bookings: "76",
    cost: "2.000.000 đ",
    revenue: "8.100.000 đ",
    roas: 2.7,
    conversionRate: "0.59%",
    trend: "+12%",
    trendPositive: true,
  },
]

export interface ChannelHighlightItem {
  id: string
  channelName: string
  iconType: "facebook" | "google" | "instagram" | "zalo" | "email"
  note: string
  badgeValue: string
  badgeType: "link" | "text" | "percentage" | "arrow"
}

export const MOCK_CHANNEL_HIGHLIGHTS: ChannelHighlightItem[] = [
  {
    id: "hl-1",
    channelName: "Facebook",
    iconType: "facebook",
    note: "Lượt đặt phòng cao nhất",
    badgeValue: "1.250 đơn >",
    badgeType: "link",
  },
  {
    id: "hl-2",
    channelName: "Google",
    iconType: "google",
    note: "ROAS cao nhất 5.4",
    badgeValue: "5.4",
    badgeType: "text",
  },
  {
    id: "hl-3",
    channelName: "Instagram",
    iconType: "instagram",
    note: "Tương tác tăng nhanh",
    badgeValue: "+46%",
    badgeType: "percentage",
  },
  {
    id: "hl-4",
    channelName: "Zalo",
    iconType: "zalo",
    note: "Chi phí thấp, hiệu quả tốt",
    badgeValue: ">",
    badgeType: "arrow",
  },
  {
    id: "hl-5",
    channelName: "Email Marketing",
    iconType: "email",
    note: "Tỷ lệ chuyển đổi cao nhất",
    badgeValue: "7.2%",
    badgeType: "percentage",
  },
]

export interface ChannelOptimizationTip {
  id: string
  title: string
  subtitle: string
  iconType: "megaphone" | "video" | "google" | "zalo" | "email"
}

export const MOCK_CHANNEL_OPTIMIZATION_TIPS: ChannelOptimizationTip[] = [
  {
    id: "tip-1",
    title: "Tăng ngân sách cho Facebook",
    subtitle: "Đang có ROAS cao (5.4)",
    iconType: "megaphone",
  },
  {
    id: "tip-2",
    title: "Thử định dạng video cho Instagram",
    subtitle: "Tăng tương tác và lượt đặt phòng",
    iconType: "video",
  },
  {
    id: "tip-3",
    title: "Tối ưu từ khóa Google Ads",
    subtitle: "Giảm CPA, tăng chuyển đổi",
    iconType: "google",
  },
  {
    id: "tip-4",
    title: "Mở rộng chiến dịch Zalo",
    subtitle: "Chi phí thấp, khách hàng tiềm năng cao",
    iconType: "zalo",
  },
  {
    id: "tip-5",
    title: "Tận dụng email chăm sóc lại",
    subtitle: "Tỷ lệ chuyển đổi đạt 7.2%",
    iconType: "email",
  },
]


/* ==========================================================================
   CONTENT PAGE DATA ("Báo cáo Nội dung")
   ========================================================================== */

export interface ContentPageKpi {
  id: string
  label: string
  value: string
  trend: string
  trendIsPositive: boolean
  comparisonText: string
  iconType: "file-text" | "eye" | "heart" | "link" | "users"
}

export const MOCK_CONTENT_PAGE_KPIS: ContentPageKpi[] = [
  {
    id: "total_content",
    label: "Tổng số nội dung",
    value: "320",
    trend: "+28%",
    trendIsPositive: true,
    comparisonText: "so với 3 tháng trước",
    iconType: "file-text",
  },
  {
    id: "total_views",
    label: "Tổng lượt xem",
    value: "1.2M",
    trend: "+42%",
    trendIsPositive: true,
    comparisonText: "so với 3 tháng trước",
    iconType: "eye",
  },
  {
    id: "total_engagement",
    label: "Tổng lượt tương tác",
    value: "96.5K",
    trend: "+35%",
    trendIsPositive: true,
    comparisonText: "so với 3 tháng trước",
    iconType: "heart",
  },
  {
    id: "link_clicks",
    label: "Lượt nhấp liên kết",
    value: "25.8K",
    trend: "+27%",
    trendIsPositive: true,
    comparisonText: "so với 3 tháng trước",
    iconType: "link",
  },
  {
    id: "conversions",
    label: "Chuyển đổi từ nội dung",
    value: "1.850",
    trend: "+18%",
    trendIsPositive: true,
    comparisonText: "so với 3 tháng trước",
    iconType: "users",
  },
]

export interface ContentTimelinePoint {
  date: string
  views: number
  engagement: number
  clicks: number
}

export const MOCK_CONTENT_TIMELINE: ContentTimelinePoint[] = [
  { date: "01/06", views: 50, engagement: 25, clicks: 10 },
  { date: "15/06", views: 110, engagement: 50, clicks: 20 },
  { date: "01/07", views: 100, engagement: 45, clicks: 18 },
  { date: "15/07", views: 140, engagement: 60, clicks: 30 },
  { date: "01/08", views: 130, engagement: 55, clicks: 25 },
  { date: "15/08", views: 175, engagement: 85, clicks: 40 },
  { date: "31/08", views: 205, engagement: 105, clicks: 48 },
]

export interface ContentFormatDonutItem {
  id: string
  name: string
  percent: number
  count: number
  color: string
}

export const MOCK_CONTENT_FORMAT_DONUT: ContentFormatDonutItem[] = [
  { id: "blog", name: "Bài viết blog", percent: 32, count: 102, color: "#1877f2" },
  { id: "video", name: "Video", percent: 28, count: 90, color: "#f43f5e" },
  { id: "image", name: "Hình ảnh", percent: 20, count: 64, color: "#0ea5e9" },
  { id: "reels", name: "Reels/Shorts", percent: 12, count: 38, color: "#f97316" },
  { id: "infographic", name: "Infographic", percent: 5, count: 16, color: "#10b981" },
  { id: "other", name: "Khác", percent: 3, count: 10, color: "#475569" },
]

export interface ContentChannelBarItem {
  channel: string
  views: number
  engagement: number
}

export const MOCK_CONTENT_CHANNELS_BAR: ContentChannelBarItem[] = [
  { channel: "Facebook", views: 320, engagement: 85 },
  { channel: "Instagram", views: 280, engagement: 70 },
  { channel: "Website/Blog", views: 210, engagement: 55 },
  { channel: "Zalo", views: 150, engagement: 35 },
  { channel: "Email", views: 90, engagement: 20 },
  { channel: "TikTok", views: 80, engagement: 18 },
]

export interface ContentTopicItem {
  id: string
  name: string
  percent: number
  count: number
  color: string
}

export const MOCK_CONTENT_TOPICS_LIST: ContentTopicItem[] = [
  { id: "t1", name: "Điểm đến & Du lịch", percent: 28, count: 90, color: "#2563eb" },
  { id: "t2", name: "Resort & Nghỉ dưỡng", percent: 22, count: 70, color: "#06b6d4" },
  { id: "t3", name: "Ẩm thực địa phương", percent: 18, count: 58, color: "#f59e0b" },
  { id: "t4", name: "Kinh nghiệm du lịch", percent: 12, count: 38, color: "#8b5cf6" },
  { id: "t5", name: "Ưu đãi & Khuyến mãi", percent: 10, count: 32, color: "#ec4899" },
  { id: "t6", name: "Trải nghiệm & Tour", percent: 7, count: 22, color: "#6366f1" },
  { id: "t7", name: "Khác", percent: 3, count: 10, color: "#94a3b8" },
]

export interface FeaturedContentTableItem {
  id: string
  rank: number
  title: string
  thumbnail: string
  formatType: "image" | "video" | "blog" | "infographic" | "reels"
  formatLabel: string
  channel: string
  channelIcon: "facebook" | "video" | "website" | "instagram" | "tiktok"
  publishDate: string
  views: string
  engagement: string
  clicks: string
  conversions: string
  status: "active" | "completed"
}

export const MOCK_FEATURED_CONTENT_TABLE: FeaturedContentTableItem[] = [
  {
    id: "cnt-1",
    rank: 1,
    title: "Khám phá Phú Quốc hè 2024",
    thumbnail: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=120&auto=format&fit=crop&q=80",
    formatType: "image",
    formatLabel: "Ảnh",
    channel: "Facebook",
    channelIcon: "facebook",
    publishDate: "12/06/2024",
    views: "125.000",
    engagement: "8.200",
    clicks: "2.450",
    conversions: "320",
    status: "active",
  },
  {
    id: "cnt-2",
    rank: 2,
    title: "Top 5 resort Đà Nẵng đáng ở",
    thumbnail: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=120&auto=format&fit=crop&q=80",
    formatType: "video",
    formatLabel: "Video",
    channel: "Video",
    channelIcon: "video",
    publishDate: "28/06/2024",
    views: "98.000",
    engagement: "6.400",
    clicks: "1.980",
    conversions: "280",
    status: "active",
  },
  {
    id: "cnt-3",
    rank: 3,
    title: "Trải nghiệm ẩm thực Việt",
    thumbnail: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=120&auto=format&fit=crop&q=80",
    formatType: "blog",
    formatLabel: "Bài viết",
    channel: "Website",
    channelIcon: "website",
    publishDate: "15/07/2024",
    views: "76.000",
    engagement: "5.100",
    clicks: "1.250",
    conversions: "186",
    status: "completed",
  },
  {
    id: "cnt-4",
    rank: 4,
    title: "Ưu đãi cuối tuần",
    thumbnail: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=120&auto=format&fit=crop&q=80",
    formatType: "infographic",
    formatLabel: "Infographic",
    channel: "Instagram",
    channelIcon: "instagram",
    publishDate: "01/08/2024",
    views: "54.000",
    engagement: "3.800",
    clicks: "980",
    conversions: "124",
    status: "active",
  },
  {
    id: "cnt-5",
    rank: 5,
    title: "Checklist du lịch Nha Trang",
    thumbnail: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=120&auto=format&fit=crop&q=80",
    formatType: "reels",
    formatLabel: "Reels",
    channel: "TikTok",
    channelIcon: "tiktok",
    publishDate: "20/08/2024",
    views: "52.000",
    engagement: "3.600",
    clicks: "860",
    conversions: "98",
    status: "active",
  },
]

export interface ContentHighlightSidebarItem {
  id: string
  rank: number
  title: string
  thumbnail: string
  views: string
  likes: string
}

export const MOCK_CONTENT_HIGHLIGHTS_SIDEBAR: ContentHighlightSidebarItem[] = [
  {
    id: "chl-1",
    rank: 1,
    title: "Khám phá Phú Quốc hè 2024",
    thumbnail: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=120&auto=format&fit=crop&q=80",
    views: "125K",
    likes: "8.2K",
  },
  {
    id: "chl-2",
    rank: 2,
    title: "Top 5 resort Đà Nẵng đáng ở",
    thumbnail: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=120&auto=format&fit=crop&q=80",
    views: "98K",
    likes: "6.4K",
  },
  {
    id: "chl-3",
    rank: 3,
    title: "Trải nghiệm ẩm thực Việt",
    thumbnail: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=120&auto=format&fit=crop&q=80",
    views: "76K",
    likes: "5.1K",
  },
  {
    id: "chl-4",
    rank: 4,
    title: "Ưu đãi cuối tuần",
    thumbnail: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=120&auto=format&fit=crop&q=80",
    views: "54K",
    likes: "3.8K",
  },
  {
    id: "chl-5",
    rank: 5,
    title: "Checklist du lịch Nha Trang",
    thumbnail: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=120&auto=format&fit=crop&q=80",
    views: "52K",
    likes: "3.6K",
  },
]

export interface ContentIdeaTipItem {
  id: string
  title: string
  iconType: "feather" | "video" | "infographic" | "chat" | "reel"
}

export const MOCK_CONTENT_IDEAS_TIPS: ContentIdeaTipItem[] = [
  {
    id: "idea-1",
    title: "Viết bài về các điểm đến mùa thu",
    iconType: "feather",
  },
  {
    id: "idea-2",
    title: "Tạo video trải nghiệm dịch vụ thực tế",
    iconType: "video",
  },
  {
    id: "idea-3",
    title: "Infographic hướng dẫn đặt phòng",
    iconType: "infographic",
  },
  {
    id: "idea-4",
    title: "Nội dung khách hàng đánh giá",
    iconType: "chat",
  },
  {
    id: "idea-5",
    title: "Chuỗi Reel khám phá ẩm thực địa phương",
    iconType: "reel",
  },
]

export interface ContentQuickActionItem {
  id: string
  title: string
  actionKey: string
}

export const MOCK_CONTENT_QUICK_ACTIONS: ContentQuickActionItem[] = [
  { id: "cqa-1", title: "Tạo nội dung mới", actionKey: "create-content" },
  { id: "cqa-2", title: "Lên lịch đăng bài", actionKey: "schedule-post" },
  { id: "cqa-3", title: "Quản lý thư viện nội dung", actionKey: "manage-library" },
  { id: "cqa-4", title: "Xuất báo cáo nội dung", actionKey: "export-report" },
  { id: "cqa-5", title: "Cài đặt nội dung", actionKey: "settings-content" },
]

// ==========================================
// 4. MÀN HÌNH QUẢNG CÁO (ADS REPORT)
// ==========================================

export interface AdsKpiItem {
  id: string
  title: string
  value: string
  subValue?: string
  trendPercent: string
  trendDirection: "up" | "down"
  trendPeriod: string
  iconType: "megaphone" | "eye" | "cursor" | "users" | "roas"
}

export const MOCK_ADS_KPIS: AdsKpiItem[] = [
  {
    id: "ads-kpi-1",
    title: "Tổng chi phí quảng cáo",
    value: "85.000.000 đ",
    trendPercent: "-22%",
    trendDirection: "down",
    trendPeriod: "so với 3 tháng trước",
    iconType: "megaphone",
  },
  {
    id: "ads-kpi-2",
    title: "Lượt hiển thị",
    value: "1.850.000",
    trendPercent: "+35%",
    trendDirection: "up",
    trendPeriod: "so với 3 tháng trước",
    iconType: "eye",
  },
  {
    id: "ads-kpi-3",
    title: "Lượt nhấp (Click)",
    value: "46.500",
    trendPercent: "+28%",
    trendDirection: "up",
    trendPeriod: "so với 3 tháng trước",
    iconType: "cursor",
  },
  {
    id: "ads-kpi-4",
    title: "Lượt chuyển đổi",
    value: "1.250",
    trendPercent: "+42%",
    trendDirection: "up",
    trendPeriod: "so với 3 tháng trước",
    iconType: "users",
  },
  {
    id: "ads-kpi-5",
    title: "ROAS (Doanh thu/Chi phí)",
    value: "4.8",
    trendPercent: "+36%",
    trendDirection: "up",
    trendPeriod: "so với 3 tháng trước",
    iconType: "roas",
  },
]

export interface AdsTimelinePoint {
  date: string
  cost: number
  impressions: number
  clicks: number
  conversions: number
}

export const MOCK_ADS_TIMELINE: AdsTimelinePoint[] = [
  { date: "01/06", cost: 35, impressions: 45, clicks: 15, conversions: 5 },
  { date: "15/06", cost: 60, impressions: 105, clicks: 25, conversions: 12 },
  { date: "01/07", cost: 52, impressions: 98, clicks: 35, conversions: 18 },
  { date: "15/07", cost: 85, impressions: 145, clicks: 42, conversions: 22 },
  { date: "01/08", cost: 78, impressions: 135, clicks: 52, conversions: 28 },
  { date: "15/08", cost: 110, impressions: 175, clicks: 58, conversions: 35 },
  { date: "31/08", cost: 105, impressions: 165, clicks: 62, conversions: 32 },
]

export interface AdsChannelDonutItem {
  name: string
  percent: number
  amount: string
  color: string
}

export const MOCK_ADS_CHANNEL_DONUT: AdsChannelDonutItem[] = [
  { name: "Facebook", percent: 35, amount: "29.8M", color: "#0284c7" },
  { name: "Google Ads", percent: 28, amount: "23.8M", color: "#ef4444" },
  { name: "Instagram", percent: 15, amount: "12.8M", color: "#f59e0b" },
  { name: "Zalo", percent: 10, amount: "8.5M", color: "#10b981" },
  { name: "TikTok", percent: 7, amount: "6.0M", color: "#3b82f6" },
  { name: "Khác", percent: 5, amount: "4.0M", color: "#8b5cf6" },
]

export interface AdsCostRevenueBarItem {
  channel: string
  cost: number
  costLabel: string
  revenue: number
  revenueLabel: string
}

export const MOCK_ADS_COST_REVENUE_BARS: AdsCostRevenueBarItem[] = [
  { channel: "Facebook", cost: 29.8, costLabel: "29.8M", revenue: 162.5, revenueLabel: "162.5M" },
  { channel: "Google", cost: 23.8, costLabel: "23.8M", revenue: 114.2, revenueLabel: "114.2M" },
  { channel: "Instagram", cost: 12.8, costLabel: "12.8M", revenue: 52.5, revenueLabel: "52.5M" },
  { channel: "Zalo", cost: 8.5, costLabel: "8.5M", revenue: 34, revenueLabel: "34.0M" },
  { channel: "TikTok", cost: 6, costLabel: "6.0M", revenue: 17.4, revenueLabel: "17.4M" },
  { channel: "Khác", cost: 4, costLabel: "4.0M", revenue: 9.2, revenueLabel: "9.2M" },
]

export interface AdsFunnelStageItem {
  id: string
  stageName: string
  count: string
  percentage: string
  color: string
  widthPercent: number
}

export const MOCK_ADS_FUNNEL_STAGES: AdsFunnelStageItem[] = [
  { id: "f1", stageName: "Hiển thị", count: "1.850.000", percentage: "100%", color: "#0284c7", widthPercent: 100 },
  { id: "f2", stageName: "Nhấp chuột", count: "46.500", percentage: "2.5%", color: "#06b6d4", widthPercent: 72 },
  { id: "f3", stageName: "Truy cập website", count: "28.600", percentage: "1.5%", color: "#10b981", widthPercent: 50 },
  { id: "f4", stageName: "Đặt phòng/Đăng ký", count: "1.250", percentage: "0.07%", color: "#f59e0b", widthPercent: 28 },
]

export interface AdsCampaignRowItem {
  id: string
  order: number
  campaignName: string
  thumbnail: string
  channel: "facebook" | "google" | "instagram" | "zalo" | "tiktok"
  channelName: string
  period: string
  cost: string
  impressions: string
  clicks: string
  conversions: string
  roas: string
  status: "active" | "paused"
}

export const MOCK_ADS_CAMPAIGNS_TABLE: AdsCampaignRowItem[] = [
  {
    id: "ad-camp-1",
    order: 1,
    campaignName: "Khám phá Phú Quốc hè 2024",
    thumbnail: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=120&auto=format&fit=crop&q=80",
    channel: "facebook",
    channelName: "Facebook",
    period: "01/06 - 31/08/2024",
    cost: "20.000.000 đ",
    impressions: "980.000",
    clicks: "24.500",
    conversions: "520",
    roas: "5.4",
    status: "active",
  },
  {
    id: "ad-camp-2",
    order: 2,
    campaignName: "Early Bird Đà Nẵng",
    thumbnail: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=120&auto=format&fit=crop&q=80",
    channel: "google",
    channelName: "Google Ads",
    period: "01/07 - 30/09/2024",
    cost: "15.000.000 đ",
    impressions: "610.000",
    clicks: "12.200",
    conversions: "310",
    roas: "4.8",
    status: "active",
  },
  {
    id: "ad-camp-3",
    order: 3,
    campaignName: "Trải nghiệm ẩm thực Việt",
    thumbnail: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=120&auto=format&fit=crop&q=80",
    channel: "instagram",
    channelName: "Instagram",
    period: "15/07 - 15/09/2024",
    cost: "10.000.000 đ",
    impressions: "260.000",
    clicks: "5.400",
    conversions: "160",
    roas: "4.1",
    status: "active",
  },
  {
    id: "ad-camp-4",
    order: 4,
    campaignName: "Ưu đãi cuối tuần",
    thumbnail: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=120&auto=format&fit=crop&q=80",
    channel: "zalo",
    channelName: "Zalo",
    period: "01/08 - 31/08/2024",
    cost: "8.000.000 đ",
    impressions: "180.000",
    clicks: "3.800",
    conversions: "120",
    roas: "3.6",
    status: "active",
  },
  {
    id: "ad-camp-5",
    order: 5,
    campaignName: "Video trải nghiệm thực tế",
    thumbnail: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=120&auto=format&fit=crop&q=80",
    channel: "tiktok",
    channelName: "TikTok",
    period: "01/08 - 31/08/2024",
    cost: "6.000.000 đ",
    impressions: "120.000",
    clicks: "2.600",
    conversions: "80",
    roas: "2.9",
    status: "paused",
  },
]

export interface AdsHighlightSidebarItem {
  id: string
  order: number
  channelName: string
  channel: "facebook" | "google" | "instagram" | "zalo" | "tiktok"
  roas: string
}

export const MOCK_ADS_HIGHLIGHTS_SIDEBAR: AdsHighlightSidebarItem[] = [
  { id: "ah-1", order: 1, channelName: "Facebook Ads", channel: "facebook", roas: "ROAS 5.4" },
  { id: "ah-2", order: 2, channelName: "Google Ads", channel: "google", roas: "ROAS 4.8" },
  { id: "ah-3", order: 3, channelName: "Instagram Ads", channel: "instagram", roas: "ROAS 4.1" },
  { id: "ah-4", order: 4, channelName: "Zalo Ads", channel: "zalo", roas: "ROAS 3.6" },
  { id: "ah-5", order: 5, channelName: "TikTok Ads", channel: "tiktok", roas: "ROAS 2.9" },
]

export interface AdsOptimizeTipItem {
  id: string
  title: string
  iconType: "bulb" | "tiktok" | "search" | "remarketing" | "abtest"
}

export const MOCK_ADS_OPTIMIZE_TIPS: AdsOptimizeTipItem[] = [
  { id: "aot-1", title: "Tăng ngân sách cho Facebook Ads (ROAS cao 5.4)", iconType: "bulb" },
  { id: "aot-2", title: "Thử quảng cáo video ngắn trên TikTok", iconType: "tiktok" },
  { id: "aot-3", title: "Tối ưu từ khóa Google Ads", iconType: "search" },
  { id: "aot-4", title: "Remarketing khách hàng đã xem tour", iconType: "remarketing" },
  { id: "aot-5", title: "A/B test mẫu quảng cáo", iconType: "abtest" },
]

export interface AdsQuickActionItem {
  id: string
  title: string
  actionKey: string
  iconType: "create" | "manage" | "schedule" | "export" | "settings"
}

export const MOCK_ADS_QUICK_ACTIONS: AdsQuickActionItem[] = [
  { id: "aqa-1", title: "Tạo chiến dịch quảng cáo", actionKey: "create-ads", iconType: "create" },
  { id: "aqa-2", title: "Quản lý quảng cáo", actionKey: "manage-ads", iconType: "manage" },
  { id: "aqa-3", title: "Lên lịch quảng cáo", actionKey: "schedule-ads", iconType: "schedule" },
  { id: "aqa-4", title: "Xuất báo cáo quảng cáo", actionKey: "export-ads", iconType: "export" },
  { id: "aqa-5", title: "Cài đặt ngân sách", actionKey: "settings-budget", iconType: "settings" },
]

// ==========================================
// 5. MÀN HÌNH EMAIL MARKETING (EMAIL REPORT)
// ==========================================

export interface EmailKpiItem {
  id: string
  title: string
  value: string
  trendPercent: string
  trendDirection: "up" | "down"
  trendPeriod: string
  iconType: "mail" | "eye" | "cursor" | "users" | "coins"
}

export const MOCK_EMAIL_KPIS: EmailKpiItem[] = [
  {
    id: "ekpi-1",
    title: "Tổng số email gửi",
    value: "120.000",
    trendPercent: "+28%",
    trendDirection: "up",
    trendPeriod: "so với 3 tháng trước",
    iconType: "mail",
  },
  {
    id: "ekpi-2",
    title: "Tỷ lệ mở (Open rate)",
    value: "32.5%",
    trendPercent: "+12%",
    trendDirection: "up",
    trendPeriod: "so với 3 tháng trước",
    iconType: "eye",
  },
  {
    id: "ekpi-3",
    title: "Tỷ lệ nhấp (CTR)",
    value: "5.8%",
    trendPercent: "+26%",
    trendDirection: "up",
    trendPeriod: "so với 3 tháng trước",
    iconType: "cursor",
  },
  {
    id: "ekpi-4",
    title: "Số lượt chuyển đổi",
    value: "2.860",
    trendPercent: "+35%",
    trendDirection: "up",
    trendPeriod: "so với 3 tháng trước",
    iconType: "users",
  },
  {
    id: "ekpi-5",
    title: "Doanh thu từ email",
    value: "125.4M đ",
    trendPercent: "+42%",
    trendDirection: "up",
    trendPeriod: "so với 3 tháng trước",
    iconType: "coins",
  },
]

export interface EmailSubTabItem {
  id: string
  label: string
}

export const MOCK_EMAIL_SUB_TABS: EmailSubTabItem[] = [
  { id: "tong-quan", label: "Tổng quan" },
  { id: "chien-dich", label: "Chiến dịch" },
  { id: "danh-sach-email", label: "Danh sách email" },
  { id: "noi-dung", label: "Nội dung" },
  { id: "tu-dong-hoa", label: "Tự động hóa" },
  { id: "ab-testing", label: "A/B Testing" },
  { id: "phan-khuc", label: "Phân khúc" },
  { id: "bao-cao-chi-tiet", label: "Báo cáo chi tiết" },
]

export interface EmailTimelinePoint {
  date: string
  sent: number
  opened: number
  clicked: number
  conversions: number
}

export const MOCK_EMAIL_TIMELINE: EmailTimelinePoint[] = [
  { date: "01/06", sent: 12, opened: 8, clicked: 3, conversions: 1.5 },
  { date: "15/06", sent: 24, opened: 15, clicked: 5, conversions: 2.5 },
  { date: "01/07", sent: 29, opened: 18, clicked: 7, conversions: 3.5 },
  { date: "15/07", sent: 37, opened: 26, clicked: 10, conversions: 5.2 },
  { date: "01/08", sent: 43, opened: 29, clicked: 12, conversions: 6.8 },
  { date: "15/08", sent: 47, opened: 33, clicked: 14, conversions: 8.5 },
  { date: "31/08", sent: 51, opened: 36, clicked: 16, conversions: 10.2 },
]

export interface EmailTypeDonutItem {
  name: string
  percent: number
  amount: string
  color: string
}

export const MOCK_EMAIL_TYPES_DONUT: EmailTypeDonutItem[] = [
  { name: "Email khuyến mãi", percent: 38, amount: "45.6K", color: "#10b981" },
  { name: "Email bản tin", percent: 24, amount: "28.8K", color: "#0284c7" },
  { name: "Email chăm sóc", percent: 18, amount: "21.6K", color: "#f59e0b" },
  { name: "Email tái tiếp cận", percent: 12, amount: "14.4K", color: "#8b5cf6" },
  { name: "Email tự động", percent: 6, amount: "7.2K", color: "#ef4444" },
  { name: "Khác", percent: 2, amount: "2.4K", color: "#94a3b8" },
]

export interface EmailDeviceBarItem {
  device: string
  openRate: number
  openRateLabel: string
  clickRate: number
  clickRateLabel: string
}

export const MOCK_EMAIL_DEVICE_BARS: EmailDeviceBarItem[] = [
  { device: "Desktop", openRate: 28.4, openRateLabel: "28.4%", clickRate: 4.1, clickRateLabel: "4.1%" },
  { device: "Mobile", openRate: 35.2, openRateLabel: "35.2%", clickRate: 6.8, clickRateLabel: "6.8%" },
  { device: "Tablet", openRate: 22.1, openRateLabel: "22.1%", clickRate: 3.2, clickRateLabel: "3.2%" },
]

export interface EmailSegmentItem {
  id: string
  name: string
  percent: number
  count: number
  color: string
}

export const MOCK_EMAIL_SEGMENTS: EmailSegmentItem[] = [
  { id: "seg-1", name: "Khách đã đặt phòng", percent: 42, count: 1201, color: "#007a48" },
  { id: "seg-2", name: "Khách tiềm năng", percent: 28, count: 800, color: "#0284c7" },
  { id: "seg-3", name: "Khách thân thiết", percent: 18, count: 515, color: "#f59e0b" },
  { id: "seg-4", name: "Khách chưa hoạt động", percent: 8, count: 229, color: "#8b5cf6" },
  { id: "seg-5", name: "Đối tác B2B", percent: 4, count: 115, color: "#3b82f6" },
]

export interface EmailCampaignRowItem {
  id: string
  order: number
  campaignName: string
  thumbnail: string
  emailType: string
  sentDate: string
  sentCount: string
  openRate: string
  clickRate: string
  conversions: string
  revenue: string
  status: "sent" | "active"
}

export const MOCK_EMAIL_CAMPAIGNS_TABLE: EmailCampaignRowItem[] = [
  {
    id: "ec-1",
    order: 1,
    campaignName: "Ưu đãi hè Phú Quốc",
    thumbnail: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=120&auto=format&fit=crop&q=80",
    emailType: "Khuyến mãi",
    sentDate: "05/06/2024",
    sentCount: "20.000",
    openRate: "34.5%",
    clickRate: "6.2%",
    conversions: "520",
    revenue: "28.600.000 đ",
    status: "sent",
  },
  {
    id: "ec-2",
    order: 2,
    campaignName: "Khám phá Đà Nẵng",
    thumbnail: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=120&auto=format&fit=crop&q=80",
    emailType: "Bản tin",
    sentDate: "20/06/2024",
    sentCount: "18.000",
    openRate: "31.8%",
    clickRate: "5.9%",
    conversions: "410",
    revenue: "21.400.000 đ",
    status: "sent",
  },
  {
    id: "ec-3",
    order: 3,
    campaignName: "Trải nghiệm ẩm thực Việt",
    thumbnail: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=120&auto=format&fit=crop&q=80",
    emailType: "Chăm sóc",
    sentDate: "05/07/2024",
    sentCount: "16.000",
    openRate: "29.6%",
    clickRate: "5.1%",
    conversions: "360",
    revenue: "18.200.000 đ",
    status: "sent",
  },
  {
    id: "ec-4",
    order: 4,
    campaignName: "Ưu đãi cuối tuần",
    thumbnail: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=120&auto=format&fit=crop&q=80",
    emailType: "Tái tiếp cận",
    sentDate: "18/07/2024",
    sentCount: "14.000",
    openRate: "27.4%",
    clickRate: "4.7%",
    conversions: "280",
    revenue: "14.600.000 đ",
    status: "sent",
  },
  {
    id: "ec-5",
    order: 5,
    campaignName: "Bản tin tháng 8",
    thumbnail: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=120&auto=format&fit=crop&q=80",
    emailType: "Bản tin",
    sentDate: "05/08/2024",
    sentCount: "12.000",
    openRate: "25.8%",
    clickRate: "4.2%",
    conversions: "210",
    revenue: "10.800.000 đ",
    status: "active",
  },
]

export interface EmailTopCampaignSidebarItem {
  id: string
  order: number
  title: string
  thumbnail: string
  openRate: string
}

export const MOCK_EMAIL_TOP_CAMPAIGNS_SIDEBAR: EmailTopCampaignSidebarItem[] = [
  {
    id: "etc-1",
    order: 1,
    title: "Ưu đãi hè Phú Quốc",
    thumbnail: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=120&auto=format&fit=crop&q=80",
    openRate: "32.5%",
  },
  {
    id: "etc-2",
    order: 2,
    title: "Khám phá Đà Nẵng",
    thumbnail: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=120&auto=format&fit=crop&q=80",
    openRate: "28.7%",
  },
  {
    id: "etc-3",
    order: 3,
    title: "Trải nghiệm ẩm thực Việt",
    thumbnail: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=120&auto=format&fit=crop&q=80",
    openRate: "24.1%",
  },
  {
    id: "etc-4",
    order: 4,
    title: "Ưu đãi cuối tuần",
    thumbnail: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=120&auto=format&fit=crop&q=80",
    openRate: "21.3%",
  },
  {
    id: "etc-5",
    order: 5,
    title: "Bản tin tháng 8",
    thumbnail: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=120&auto=format&fit=crop&q=80",
    openRate: "18.6%",
  },
]

export interface EmailOptimizeTipItem {
  id: string
  title: string
  iconType: "mail" | "user" | "abtest" | "clock" | "heart"
}

export const MOCK_EMAIL_OPTIMIZE_TIPS: EmailOptimizeTipItem[] = [
  { id: "eot-1", title: "Cải thiện tiêu đề để tăng tỷ lệ mở", iconType: "mail" },
  { id: "eot-2", title: "Cá nhân hóa nội dung theo hành vi", iconType: "user" },
  { id: "eot-3", title: "Thử A/B testing nút kêu gọi hành động", iconType: "abtest" },
  { id: "eot-4", title: "Tự động hóa email sau khi đặt phòng", iconType: "clock" },
  { id: "eot-5", title: "Tái kích hoạt khách hàng chưa hoạt động", iconType: "heart" },
]

export interface EmailQuickActionItem {
  id: string
  title: string
  actionKey: string
  iconType: "create" | "subscribers" | "template" | "automation" | "export"
}

export const MOCK_EMAIL_QUICK_ACTIONS: EmailQuickActionItem[] = [
  { id: "eqa-1", title: "Tạo chiến dịch email mới", actionKey: "create-email", iconType: "create" },
  { id: "eqa-2", title: "Quản lý danh sách email", actionKey: "manage-subscribers", iconType: "subscribers" },
  { id: "eqa-3", title: "Tạo mẫu email", actionKey: "create-template", iconType: "template" },
  { id: "eqa-4", title: "Thiết lập tự động hóa", actionKey: "setup-automation", iconType: "automation" },
  { id: "eqa-5", title: "Xuất báo cáo email", actionKey: "export-email", iconType: "export" },
]

// ==========================================
// 6. MÀN HÌNH BÁO CÁO SEO (SEO REPORT)
// ==========================================

export interface SeoKpiItem {
  id: string
  title: string
  value: string
  trendPercent: string
  trendDirection: "up" | "down"
  trendPeriod: string
  iconType: "search" | "chart" | "key" | "link" | "star"
}

export const MOCK_SEO_KPIS: SeoKpiItem[] = [
  {
    id: "skpi-1",
    title: "Lượt truy cập tự nhiên",
    value: "112.500",
    trendPercent: "+38%",
    trendDirection: "up",
    trendPeriod: "so với 3 tháng trước",
    iconType: "search",
  },
  {
    id: "skpi-2",
    title: "Từ khóa top 1-3",
    value: "1.248",
    trendPercent: "+25%",
    trendDirection: "up",
    trendPeriod: "so với 3 tháng trước",
    iconType: "chart",
  },
  {
    id: "skpi-3",
    title: "Tổng số từ khóa",
    value: "8.620",
    trendPercent: "+18%",
    trendDirection: "up",
    trendPeriod: "so với 3 tháng trước",
    iconType: "key",
  },
  {
    id: "skpi-4",
    title: "Backlink chất lượng",
    value: "2.430",
    trendPercent: "+32%",
    trendDirection: "up",
    trendPeriod: "so với 3 tháng trước",
    iconType: "link",
  },
  {
    id: "skpi-5",
    title: "Điểm SEO tổng thể",
    value: "78/100",
    trendPercent: "+12%",
    trendDirection: "up",
    trendPeriod: "so với 3 tháng trước",
    iconType: "star",
  },
]

export interface SeoTimelinePoint {
  date: string
  totalTraffic: number
  brandTraffic: number
  nonBrandTraffic: number
}

export const MOCK_SEO_TIMELINE: SeoTimelinePoint[] = [
  { date: "01/06", totalTraffic: 15, brandTraffic: 8, nonBrandTraffic: 7 },
  { date: "15/06", totalTraffic: 48, brandTraffic: 24, nonBrandTraffic: 14 },
  { date: "01/07", totalTraffic: 46, brandTraffic: 23, nonBrandTraffic: 17 },
  { date: "15/07", totalTraffic: 68, brandTraffic: 38, nonBrandTraffic: 22 },
  { date: "01/08", totalTraffic: 62, brandTraffic: 35, nonBrandTraffic: 23 },
  { date: "15/08", totalTraffic: 78, brandTraffic: 44, nonBrandTraffic: 25 },
  { date: "31/08", totalTraffic: 110, brandTraffic: 65, nonBrandTraffic: 32 },
]

export interface SeoRankDistributionItem {
  name: string
  count: number
  countFormatted: string
  percent: number
  color: string
}

export const MOCK_SEO_RANK_DISTRIBUTION: SeoRankDistributionItem[] = [
  { name: "Top 1 - 3", count: 1248, countFormatted: "1.248", percent: 14.5, color: "#007a48" },
  { name: "Top 4 - 10", count: 2310, countFormatted: "2.310", percent: 26.8, color: "#0284c7" },
  { name: "Top 11 - 20", count: 1950, countFormatted: "1.950", percent: 22.6, color: "#f59e0b" },
  { name: "Top 21 - 50", count: 1870, countFormatted: "1.870", percent: 21.7, color: "#8b5cf6" },
  { name: "Top > 50", count: 1242, countFormatted: "1.242", percent: 14.4, color: "#ec4899" },
]

export interface SeoTopPageItem {
  id: string
  order: number
  pageTitle: string
  visits: string
  percent: number
  color: string
}

export const MOCK_SEO_TOP_PAGES: SeoTopPageItem[] = [
  { id: "stp-1", order: 1, pageTitle: "Trang chủ", visits: "32.5K (28.9%)", percent: 28.9, color: "#007a48" },
  { id: "stp-2", order: 2, pageTitle: "Tour Phú Quốc", visits: "24.8K (22.0%)", percent: 22, color: "#0284c7" },
  { id: "stp-3", order: 3, pageTitle: "Villa Đà Nẵng", visits: "18.6K (16.5%)", percent: 16.5, color: "#f59e0b" },
  { id: "stp-4", order: 4, pageTitle: "Homestay Đà Lạt", visits: "12.4K (11.0%)", percent: 11, color: "#8b5cf6" },
  { id: "stp-5", order: 5, pageTitle: "Kinh nghiệm du lịch", visits: "8.9K (7.9%)", percent: 7.9, color: "#06b6d4" },
  { id: "stp-6", order: 6, pageTitle: "Trang khác", visits: "14.3K (12.7%)", percent: 12.7, color: "#94a3b8" },
]

export interface SeoTopKeywordItem {
  id: string
  order: number
  keyword: string
  position: number
  monthlySearches: string
  trend: "up" | "down" | "neutral"
}

export const MOCK_SEO_TOP_RANKED_KEYWORDS: SeoTopKeywordItem[] = [
  { id: "tk-1", order: 1, keyword: "du lịch Phú Quốc", position: 1, monthlySearches: "74.000", trend: "up" },
  { id: "tk-2", order: 2, keyword: "villa Đà Nẵng", position: 2, monthlySearches: "49.500", trend: "up" },
  { id: "tk-3", order: 3, keyword: "homestay Đà Lạt", position: 3, monthlySearches: "33.100", trend: "up" },
  { id: "tk-4", order: 4, keyword: "tour trải nghiệm", position: 3, monthlySearches: "27.100", trend: "up" },
  { id: "tk-5", order: 5, keyword: "khách sạn gần biển", position: 4, monthlySearches: "22.200", trend: "up" },
]

export interface SeoKeywordTableRowItem {
  id: string
  order: number
  keyword: string
  currentRank: number
  previousRank: number
  monthlySearches: string
  rankingUrl: string
  trend: "up" | "down" | "neutral"
}

export const MOCK_SEO_KEYWORDS_TABLE: SeoKeywordTableRowItem[] = [
  {
    id: "kw-row-1",
    order: 1,
    keyword: "du lịch Phú Quốc",
    currentRank: 1,
    previousRank: 3,
    monthlySearches: "74.000",
    rankingUrl: "/tour/phu-quoc",
    trend: "up",
  },
  {
    id: "kw-row-2",
    order: 2,
    keyword: "villa Đà Nẵng",
    currentRank: 2,
    previousRank: 4,
    monthlySearches: "49.500",
    rankingUrl: "/villa-da-nang",
    trend: "up",
  },
  {
    id: "kw-row-3",
    order: 3,
    keyword: "homestay Đà Lạt",
    currentRank: 3,
    previousRank: 6,
    monthlySearches: "33.100",
    rankingUrl: "/homestay-da-lat",
    trend: "up",
  },
  {
    id: "kw-row-4",
    order: 4,
    keyword: "tour trải nghiệm",
    currentRank: 3,
    previousRank: 5,
    monthlySearches: "27.100",
    rankingUrl: "/tour-trai-nghiem",
    trend: "up",
  },
  {
    id: "kw-row-5",
    order: 5,
    keyword: "khách sạn gần biển",
    currentRank: 4,
    previousRank: 7,
    monthlySearches: "22.200",
    rankingUrl: "/khach-san-gan-bien",
    trend: "up",
  },
]

export interface SeoKeyMetricSidebarItem {
  id: string
  label: string
  value: string
  trendPercent: string
  trendDirection: "up" | "down"
}

export const MOCK_SEO_KEY_METRICS_SIDEBAR: SeoKeyMetricSidebarItem[] = [
  { id: "skm-1", label: "Lượt truy cập tự nhiên", value: "112.500", trendPercent: "+38%", trendDirection: "up" },
  { id: "skm-2", label: "Tỷ lệ thoát trang", value: "48%", trendPercent: "-12%", trendDirection: "down" },
  { id: "skm-3", label: "Thời gian trên trang", value: "2 phút 36 giây", trendPercent: "+22%", trendDirection: "up" },
  { id: "skm-4", label: "Số trang/phiên", value: "3.8", trendPercent: "+18%", trendDirection: "up" },
  { id: "skm-5", label: "Tỷ lệ chuyển đổi (từ organic)", value: "4.2%", trendPercent: "+28%", trendDirection: "up" },
]

export interface SeoGrowthKeywordItem {
  id: string
  order: number
  keyword: string
  growthPercent: string
}

export const MOCK_SEO_GROWTH_KEYWORDS_SIDEBAR: SeoGrowthKeywordItem[] = [
  { id: "gk-1", order: 1, keyword: "du lịch Phú Quốc", growthPercent: "+120%" },
  { id: "gk-2", order: 2, keyword: "villa Đà Nẵng", growthPercent: "+95%" },
  { id: "gk-3", order: 3, keyword: "homestay Đà Lạt", growthPercent: "+80%" },
  { id: "gk-4", order: 4, keyword: "tour trải nghiệm", growthPercent: "+68%" },
  { id: "gk-5", order: 5, keyword: "khách sạn gần biển", growthPercent: "+54%" },
]

export interface SeoRelatedReportItem {
  id: string
  title: string
  actionKey: string
  iconType: "keywords" | "backlinks" | "technical" | "content" | "export"
}

export const MOCK_SEO_RELATED_REPORTS_SIDEBAR: SeoRelatedReportItem[] = [
  { id: "srr-1", title: "Báo cáo từ khóa chi tiết", actionKey: "seo-keywords-report", iconType: "keywords" },
  { id: "srr-2", title: "Báo cáo backlink", actionKey: "seo-backlinks-report", iconType: "backlinks" },
  { id: "srr-3", title: "Báo cáo kỹ thuật SEO", actionKey: "seo-technical-report", iconType: "technical" },
  { id: "srr-4", title: "Báo cáo nội dung SEO", actionKey: "seo-content-report", iconType: "content" },
  { id: "srr-5", title: "Xuất dữ liệu SEO", actionKey: "seo-export-data", iconType: "export" },
]
