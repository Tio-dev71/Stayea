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
    value: "0",
    trend: "0%",
    trendDirection: "up",
    comparisonText: "dữ liệu thời gian thực",
    iconType: "megaphone",
    bgLightColor: "bg-[#e6f5ef]",
    iconColor: "text-[#007a48]",
  },
  {
    id: "kpi-camp-running",
    label: "Đang chạy",
    value: "0",
    trend: "0%",
    trendDirection: "up",
    comparisonText: "dữ liệu thời gian thực",
    iconType: "users",
    bgLightColor: "bg-[#fef3c7]",
    iconColor: "text-[#d97706]",
  },
  {
    id: "kpi-camp-completed",
    label: "Đã hoàn thành",
    value: "0",
    trend: "0%",
    trendDirection: "up",
    comparisonText: "dữ liệu thời gian thực",
    iconType: "check-circle",
    bgLightColor: "bg-[#ecfdf5]",
    iconColor: "text-[#10b981]",
  },
  {
    id: "kpi-camp-paused",
    label: "Tạm dừng",
    value: "0",
    trend: "0%",
    trendDirection: "down",
    comparisonText: "dữ liệu thời gian thực",
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

export const MOCK_CAMPAIGN_TYPES_DONUT: CampaignTypeShareItem[] = []

export const MOCK_CAMPAIGN_BOOKINGS_BY_CHANNEL: MarketingOrdersByChannelItem[] = []

export interface CampaignCostRoasItem {
  id: string
  title: string
  costFormatted: string
  roas: number
  barWidthPercent: number
}

export const MOCK_CAMPAIGN_COST_ROAS_TOP5: CampaignCostRoasItem[] = []

export const MOCK_CAMPAIGN_FULL_LIST: MarketingCampaignItem[] = []

export interface CampaignTopBookedItem {
  rank: number
  title: string
  image: string
  bookingsFormatted: string
}

export const MOCK_CAMPAIGN_TOP_BOOKINGS_SIDEBAR: CampaignTopBookedItem[] = []

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
    value: "0",
    trend: "0%",
    trendIsPositive: true,
    comparisonText: "dữ liệu thời gian thực",
    iconType: "pointer",
  },
  {
    id: "engagement",
    label: "Lượt tương tác",
    value: "0",
    trend: "0%",
    trendIsPositive: true,
    comparisonText: "dữ liệu thời gian thực",
    iconType: "users",
  },
  {
    id: "bookings",
    label: "Lượt đặt phòng",
    value: "0",
    trend: "0%",
    trendIsPositive: true,
    comparisonText: "dữ liệu thời gian thực",
    iconType: "cart",
  },
  {
    id: "revenue",
    label: "Doanh thu",
    value: "0 ₫",
    trend: "0%",
    trendIsPositive: true,
    comparisonText: "dữ liệu thời gian thực",
    iconType: "revenue",
  },
  {
    id: "roas",
    label: "ROAS trung bình",
    value: "0",
    trend: "0%",
    trendIsPositive: true,
    comparisonText: "dữ liệu thời gian thực",
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

export const MOCK_CHANNEL_TIMELINE_TRENDS: ChannelTimelineTrendPoint[] = []

export interface ChannelReachDonutItem {
  id: string
  name: string
  percent: number
  formattedReach: string
  color: string
}

export const MOCK_CHANNEL_REACH_DONUT: ChannelReachDonutItem[] = []

export interface ChannelBookingsBarItem {
  channel: string
  orders: number
  color: string
}

export const MOCK_CHANNEL_BOOKINGS_BAR: ChannelBookingsBarItem[] = []

export interface ChannelRevenueBarItem {
  id: string
  channel: string
  revenueNum: number
  revenueFormatted: string
  color: string
}

export const MOCK_CHANNEL_REVENUE_BAR: ChannelRevenueBarItem[] = []

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

export const MOCK_CHANNEL_PERFORMANCE_TABLE: ChannelPerformanceTableItem[] = []

export interface ChannelHighlightItem {
  id: string
  channelName: string
  iconType: "facebook" | "google" | "instagram" | "zalo" | "email"
  note: string
  badgeValue: string
  badgeType: "link" | "text" | "percentage" | "arrow"
}

export const MOCK_CHANNEL_HIGHLIGHTS: ChannelHighlightItem[] = []

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
    value: "0",
    trend: "0%",
    trendIsPositive: true,
    comparisonText: "dữ liệu thời gian thực",
    iconType: "file-text",
  },
  {
    id: "total_views",
    label: "Tổng lượt xem",
    value: "0",
    trend: "0%",
    trendIsPositive: true,
    comparisonText: "dữ liệu thời gian thực",
    iconType: "eye",
  },
  {
    id: "total_engagement",
    label: "Tổng lượt tương tác",
    value: "0",
    trend: "0%",
    trendIsPositive: true,
    comparisonText: "dữ liệu thời gian thực",
    iconType: "heart",
  },
  {
    id: "link_clicks",
    label: "Lượt nhấp liên kết",
    value: "0",
    trend: "0%",
    trendIsPositive: true,
    comparisonText: "dữ liệu thời gian thực",
    iconType: "link",
  },
  {
    id: "conversions",
    label: "Chuyển đổi từ nội dung",
    value: "0",
    trend: "0%",
    trendIsPositive: true,
    comparisonText: "dữ liệu thời gian thực",
    iconType: "users",
  },
]

export interface ContentTimelinePoint {
  date: string
  views: number
  engagement: number
  clicks: number
}

export const MOCK_CONTENT_TIMELINE: ContentTimelinePoint[] = []

export interface ContentFormatDonutItem {
  id: string
  name: string
  percent: number
  count: number
  color: string
}

export const MOCK_CONTENT_FORMAT_DONUT: ContentFormatDonutItem[] = []

export interface ContentChannelBarItem {
  channel: string
  views: number
  engagement: number
}

export const MOCK_CONTENT_CHANNELS_BAR: ContentChannelBarItem[] = []

export interface ContentTopicItem {
  id: string
  name: string
  percent: number
  count: number
  color: string
}

export const MOCK_CONTENT_TOPICS_LIST: ContentTopicItem[] = []

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

export const MOCK_FEATURED_CONTENT_TABLE: FeaturedContentTableItem[] = []

export interface ContentHighlightSidebarItem {
  id: string
  rank: number
  title: string
  thumbnail: string
  views: string
  likes: string
}

export const MOCK_CONTENT_HIGHLIGHTS_SIDEBAR: ContentHighlightSidebarItem[] = []

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
    value: "0 ₫",
    trendPercent: "0%",
    trendDirection: "down",
    trendPeriod: "dữ liệu thời gian thực",
    iconType: "megaphone",
  },
  {
    id: "ads-kpi-2",
    title: "Lượt hiển thị",
    value: "0",
    trendPercent: "0%",
    trendDirection: "up",
    trendPeriod: "dữ liệu thời gian thực",
    iconType: "eye",
  },
  {
    id: "ads-kpi-3",
    title: "Lượt nhấp (Click)",
    value: "0",
    trendPercent: "0%",
    trendDirection: "up",
    trendPeriod: "dữ liệu thời gian thực",
    iconType: "cursor",
  },
  {
    id: "ads-kpi-4",
    title: "Lượt chuyển đổi",
    value: "0",
    trendPercent: "0%",
    trendDirection: "up",
    trendPeriod: "dữ liệu thời gian thực",
    iconType: "users",
  },
  {
    id: "ads-kpi-5",
    title: "ROAS (Doanh thu/Chi phí)",
    value: "0",
    trendPercent: "0%",
    trendDirection: "up",
    trendPeriod: "dữ liệu thời gian thực",
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

export const MOCK_ADS_TIMELINE: AdsTimelinePoint[] = []

export interface AdsChannelDonutItem {
  name: string
  percent: number
  amount: string
  color: string
}

export const MOCK_ADS_CHANNEL_DONUT: AdsChannelDonutItem[] = []

export interface AdsCostRevenueBarItem {
  channel: string
  cost: number
  costLabel: string
  revenue: number
  revenueLabel: string
}

export const MOCK_ADS_COST_REVENUE_BARS: AdsCostRevenueBarItem[] = []

export interface AdsFunnelStageItem {
  id: string
  stageName: string
  count: string
  percentage: string
  color: string
  widthPercent: number
}

export const MOCK_ADS_FUNNEL_STAGES: AdsFunnelStageItem[] = []

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

export const MOCK_ADS_CAMPAIGNS_TABLE: AdsCampaignRowItem[] = []

export interface AdsHighlightSidebarItem {
  id: string
  order: number
  channelName: string
  channel: "facebook" | "google" | "instagram" | "zalo" | "tiktok"
  roas: string
}

export const MOCK_ADS_HIGHLIGHTS_SIDEBAR: AdsHighlightSidebarItem[] = []

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
    value: "0",
    trendPercent: "0%",
    trendDirection: "up",
    trendPeriod: "dữ liệu thời gian thực",
    iconType: "mail",
  },
  {
    id: "ekpi-2",
    title: "Tỷ lệ mở (Open rate)",
    value: "0%",
    trendPercent: "0%",
    trendDirection: "up",
    trendPeriod: "dữ liệu thời gian thực",
    iconType: "eye",
  },
  {
    id: "ekpi-3",
    title: "Tỷ lệ nhấp (CTR)",
    value: "0%",
    trendPercent: "0%",
    trendDirection: "up",
    trendPeriod: "dữ liệu thời gian thực",
    iconType: "cursor",
  },
  {
    id: "ekpi-4",
    title: "Số lượt chuyển đổi",
    value: "0",
    trendPercent: "0%",
    trendDirection: "up",
    trendPeriod: "dữ liệu thời gian thực",
    iconType: "users",
  },
  {
    id: "ekpi-5",
    title: "Doanh thu từ email",
    value: "0 ₫",
    trendPercent: "0%",
    trendDirection: "up",
    trendPeriod: "dữ liệu thời gian thực",
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

export const MOCK_EMAIL_TIMELINE: EmailTimelinePoint[] = []

export interface EmailTypeDonutItem {
  name: string
  percent: number
  amount: string
  color: string
}

export const MOCK_EMAIL_TYPES_DONUT: EmailTypeDonutItem[] = []

export interface EmailDeviceBarItem {
  device: string
  openRate: number
  openRateLabel: string
  clickRate: number
  clickRateLabel: string
}

export const MOCK_EMAIL_DEVICE_BARS: EmailDeviceBarItem[] = []

export interface EmailSegmentItem {
  id: string
  name: string
  percent: number
  count: number
  color: string
}

export const MOCK_EMAIL_SEGMENTS: EmailSegmentItem[] = []

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

export const MOCK_EMAIL_CAMPAIGNS_TABLE: EmailCampaignRowItem[] = []

export interface EmailTopCampaignSidebarItem {
  id: string
  order: number
  title: string
  thumbnail: string
  openRate: string
}

export const MOCK_EMAIL_TOP_CAMPAIGNS_SIDEBAR: EmailTopCampaignSidebarItem[] = []

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
    value: "0",
    trendPercent: "0%",
    trendDirection: "up",
    trendPeriod: "dữ liệu thời gian thực",
    iconType: "search",
  },
  {
    id: "skpi-2",
    title: "Từ khóa top 1-3",
    value: "0",
    trendPercent: "0%",
    trendDirection: "up",
    trendPeriod: "dữ liệu thời gian thực",
    iconType: "chart",
  },
  {
    id: "skpi-3",
    title: "Tổng số từ khóa",
    value: "0",
    trendPercent: "0%",
    trendDirection: "up",
    trendPeriod: "dữ liệu thời gian thực",
    iconType: "key",
  },
  {
    id: "skpi-4",
    title: "Backlink chất lượng",
    value: "0",
    trendPercent: "0%",
    trendDirection: "up",
    trendPeriod: "dữ liệu thời gian thực",
    iconType: "link",
  },
  {
    id: "skpi-5",
    title: "Điểm SEO tổng thể",
    value: "0/100",
    trendPercent: "0%",
    trendDirection: "up",
    trendPeriod: "dữ liệu thời gian thực",
    iconType: "star",
  },
]

export interface SeoTimelinePoint {
  date: string
  totalTraffic: number
  brandTraffic: number
  nonBrandTraffic: number
}

export const MOCK_SEO_TIMELINE: SeoTimelinePoint[] = []

export interface SeoRankDistributionItem {
  name: string
  count: number
  countFormatted: string
  percent: number
  color: string
}

export const MOCK_SEO_RANK_DISTRIBUTION: SeoRankDistributionItem[] = []

export interface SeoTopPageItem {
  id: string
  order: number
  pageTitle: string
  visits: string
  percent: number
  color: string
}

export const MOCK_SEO_TOP_PAGES: SeoTopPageItem[] = []

export interface SeoTopKeywordItem {
  id: string
  order: number
  keyword: string
  position: number
  monthlySearches: string
  trend: "up" | "down" | "neutral"
}

export const MOCK_SEO_TOP_RANKED_KEYWORDS: SeoTopKeywordItem[] = []

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

export const MOCK_SEO_KEYWORDS_TABLE: SeoKeywordTableRowItem[] = []

export interface SeoKeyMetricSidebarItem {
  id: string
  label: string
  value: string
  trendPercent: string
  trendDirection: "up" | "down"
}

export const MOCK_SEO_KEY_METRICS_SIDEBAR: SeoKeyMetricSidebarItem[] = []

export interface SeoGrowthKeywordItem {
  id: string
  order: number
  keyword: string
  growthPercent: string
}

export const MOCK_SEO_GROWTH_KEYWORDS_SIDEBAR: SeoGrowthKeywordItem[] = []

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
