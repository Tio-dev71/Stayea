export interface ReviewKpiItem {
  id: string
  title: string
  value: string
  trendPercent: string
  trendLabel: string
  isPositive: boolean
  icon: "star" | "total" | "positive" | "new"
  colorTheme: "yellow" | "blue" | "green" | "purple"
}

export interface ReviewItem {
  id: string
  customerName: string
  customerAvatar: string
  tourTitle: string
  tourLocation: string
  tourImage: string
  category?: string
  rating: number // 1 to 5
  content: string
  reviewDate: string
  status: "displayed" | "replied" | "pending"
  statusLabel: string
  replyText?: string
  repliedAt?: string
}

export interface RatingDistributionSlice {
  stars: number
  label: string
  percentage: number
  count: number
  color: string
}

export interface CategoryReviewCountItem {
  id: string
  name: string
  icon: "island" | "monument" | "food" | "sport" | "culture" | "wellness" | "other"
  percentage: number
  count: number
}

export interface LocationReviewCountItem {
  id: string
  rank: number
  city: string
  reviewCountFormatted: string
  imageUrl: string
}

export interface ReviewQuickActionItem {
  id: string
  title: string
  icon: "new-reviews" | "reply-pending" | "manage-reviews" | "review-policy"
}

export const MOCK_REVIEWS_KPIS: readonly ReviewKpiItem[] = [
  {
    id: "avg-rating",
    title: "Đánh giá trung bình",
    value: "4.8/5",
    trendPercent: "+0.2",
    trendLabel: "so với tháng trước",
    isPositive: true,
    icon: "star",
    colorTheme: "yellow",
  },
  {
    id: "total-reviews",
    title: "Tổng số đánh giá",
    value: "1.248",
    trendPercent: "+18%",
    trendLabel: "so với tháng trước",
    isPositive: true,
    icon: "total",
    colorTheme: "blue",
  },
  {
    id: "positive-rate",
    title: "Đánh giá tích cực",
    value: "92%",
    trendPercent: "+5%",
    trendLabel: "so với tháng trước",
    isPositive: true,
    icon: "positive",
    colorTheme: "green",
  },
  {
    id: "new-reviews",
    title: "Đánh giá mới",
    value: "86",
    trendPercent: "+32%",
    trendLabel: "so với tháng trước",
    isPositive: true,
    icon: "new",
    colorTheme: "purple",
  },
]

export const MOCK_RATING_DISTRIBUTION: RatingDistributionSlice[] = [
  {
    stars: 5,
    label: "5 sao",
    percentage: 71,
    count: 892,
    color: "#007a48",
  },
  {
    stars: 4,
    label: "4 sao",
    percentage: 18,
    count: 220,
    color: "#10b981",
  },
  {
    stars: 3,
    label: "3 sao",
    percentage: 7,
    count: 85,
    color: "#f59e0b",
  },
  {
    stars: 2,
    label: "2 sao",
    percentage: 3,
    count: 32,
    color: "#0284c7",
  },
  {
    stars: 1,
    label: "1 sao",
    percentage: 2,
    count: 19,
    color: "#ef4444",
  },
]

export const MOCK_CATEGORY_REVIEWS: CategoryReviewCountItem[] = [
  {
    id: "cat-island",
    name: "Tour biển đảo",
    icon: "island",
    percentage: 28,
    count: 349,
  },
  {
    id: "cat-sightseeing",
    name: "Tham quan",
    icon: "monument",
    percentage: 22,
    count: 275,
  },
  {
    id: "cat-cuisine",
    name: "Ẩm thực",
    icon: "food",
    percentage: 15,
    count: 187,
  },
  {
    id: "cat-watersport",
    name: "Thể thao biển",
    icon: "sport",
    percentage: 12,
    count: 150,
  },
  {
    id: "cat-culture",
    name: "Văn hóa",
    icon: "culture",
    percentage: 10,
    count: 124,
  },
  {
    id: "cat-wellness",
    name: "Wellness",
    icon: "wellness",
    percentage: 8,
    count: 99,
  },
  {
    id: "cat-other",
    name: "Khác",
    icon: "other",
    percentage: 5,
    count: 64,
  },
]

export const MOCK_LOCATION_REVIEWS: LocationReviewCountItem[] = [
  {
    id: "loc-pq",
    rank: 1,
    city: "Phú Quốc",
    reviewCountFormatted: "562 đánh giá",
    imageUrl: "/phu-quoc/hero-phu-quoc.jpg",
  },
  {
    id: "loc-hn",
    rank: 2,
    city: "Hà Nội",
    reviewCountFormatted: "318 đánh giá",
    imageUrl: "/stay/famiana-resort.jpg",
  },
  {
    id: "loc-dn",
    rank: 3,
    city: "Đà Nẵng",
    reviewCountFormatted: "186 đánh giá",
    imageUrl: "/stay/lahana-villa.jpg",
  },
  {
    id: "loc-nt",
    rank: 4,
    city: "Nha Trang",
    reviewCountFormatted: "98 đánh giá",
    imageUrl: "/stay/mango-bay.jpg",
  },
  {
    id: "loc-dl",
    rank: 5,
    city: "Đà Lạt",
    reviewCountFormatted: "98 đánh giá",
    imageUrl: "/stay/tropical-garden.jpg",
  },
]

export const MOCK_REVIEWS_LIST: ReviewItem[] = [
  {
    id: "rev-1",
    customerName: "Trần Minh Anh",
    customerAvatar: "/about/team-1.jpg",
    tourTitle: "Tour 4 đảo Phú Quốc",
    tourLocation: "Phú Quốc",
    tourImage: "/experience/cano-4-islands.jpg",
    category: "Tour biển đảo",
    rating: 5,
    content: "Trải nghiệm tuyệt vời! Hướng dẫn viên rất nhiệt tình, cảnh đẹp và đồ ăn ngon.",
    reviewDate: "20/08/2024",
    status: "displayed",
    statusLabel: "Đã hiển thị",
  },
  {
    id: "rev-2",
    customerName: "Nguyễn Thu Hà",
    customerAvatar: "/about/team-2.jpg",
    tourTitle: "Lặn ngắm san hô",
    tourLocation: "Phú Quốc",
    tourImage: "/experience/scuba-diving.jpg",
    category: "Thể thao biển",
    rating: 5,
    content: "Nước biển trong, san hô rất đẹp. Sẽ quay lại lần nữa!",
    reviewDate: "19/08/2024",
    status: "displayed",
    statusLabel: "Đã hiển thị",
  },
  {
    id: "rev-3",
    customerName: "Lê Văn Bình",
    customerAvatar: "/about/team-3.jpg",
    tourTitle: "Câu mực đêm",
    tourLocation: "Phú Quốc",
    tourImage: "/experience/night-squid.jpg",
    category: "Tour biển đảo",
    rating: 4,
    content: "Hoạt động thú vị, tàu sạch sẽ. Nên chuẩn bị áo ấm vào buổi tối.",
    reviewDate: "18/08/2024",
    status: "displayed",
    statusLabel: "Đã hiển thị",
  },
  {
    id: "rev-4",
    customerName: "Phạm Thị Mai",
    customerAvatar: "/about/team-4.jpg",
    tourTitle: "Vinpearl Safari",
    tourLocation: "Phú Quốc",
    tourImage: "/experience/trekking.jpg",
    category: "Tham quan",
    rating: 5,
    content: "Rất thích hợp cho gia đình có trẻ nhỏ. Dịch vụ chuyên nghiệp.",
    reviewDate: "17/08/2024",
    status: "replied",
    statusLabel: "Đã trả lời",
    replyText: "Cảm ơn chị Mai và gia đình đã tin tưởng lựa chọn dịch vụ của Stayea. Rất hân hạnh được phục vụ gia đình trong các kỳ nghỉ tiếp theo!",
    repliedAt: "17/08/2024",
  },
  {
    id: "rev-5",
    customerName: "Hoàng Quốc Duy",
    customerAvatar: "/profile/profile-avatar.jpg",
    tourTitle: "Kayak hoàng hôn",
    tourLocation: "Phú Quốc",
    tourImage: "/experience/kayak-rach-vem.jpg",
    category: "Thể thao biển",
    rating: 5,
    content: "Cảnh hoàng hôn tuyệt đẹp, hướng dẫn an toàn và thân thiện.",
    reviewDate: "16/08/2024",
    status: "displayed",
    statusLabel: "Đã hiển thị",
  },
  {
    id: "rev-6",
    customerName: "Đặng Thảo Vy",
    customerAvatar: "/about/team-2.jpg",
    tourTitle: "Thiền & Yoga biển",
    tourLocation: "Phú Quốc",
    tourImage: "/experience/spa-wellness.jpg",
    category: "Wellness",
    rating: 4,
    content: "Không gian yên bình, rất thư giãn. Nên có thêm nhiều khung giờ.",
    reviewDate: "15/08/2024",
    status: "pending",
    statusLabel: "Chờ duyệt",
  },
  {
    id: "rev-7",
    customerName: "Nguyễn Quang Huy",
    customerAvatar: "/about/team-1.jpg",
    tourTitle: "Ẩm thực Phú Quốc",
    tourLocation: "Phú Quốc",
    tourImage: "/experience/cooking-class.jpg",
    category: "Ẩm thực",
    rating: 5,
    content: "Đồ ăn ngon, hướng dẫn chi tiết về văn hóa ẩm thực địa phương.",
    reviewDate: "14/08/2024",
    status: "displayed",
    statusLabel: "Đã hiển thị",
  },
  {
    id: "rev-8",
    customerName: "Trịnh Thu Trang",
    customerAvatar: "/about/team-3.jpg",
    tourTitle: "Trekking núi Hàm Ninh",
    tourLocation: "Phú Quốc",
    tourImage: "/experience/trekking.jpg",
    category: "Tham quan",
    rating: 5,
    content: "Hành trình đẹp, hơi mệt nhưng rất đáng trải nghiệm!",
    reviewDate: "13/08/2024",
    status: "displayed",
    statusLabel: "Đã hiển thị",
  },
  {
    id: "rev-9",
    customerName: "Phạm Gia Hân",
    customerAvatar: "/about/team-4.jpg",
    tourTitle: "Tour khám phá Gành Dầu",
    tourLocation: "Phú Quốc",
    tourImage: "/experience/tour-3-dao.jpg",
    category: "Tham quan",
    rating: 4,
    content: "Phong cảnh hoang sơ, yên tĩnh. Hướng dẫn viên rất dễ thương.",
    reviewDate: "12/08/2024",
    status: "replied",
    statusLabel: "Đã trả lời",
    replyText: "Dạ Stayea cảm ơn bạn Gia Hân nhiều ạ! Chúc bạn luôn có những chuyến đi tuyệt vời.",
    repliedAt: "13/08/2024",
  },
  {
    id: "rev-10",
    customerName: "Vũ Hoàng Nam",
    customerAvatar: "/profile/profile-avatar.jpg",
    tourTitle: "Câu cá truyền thống",
    tourLocation: "Phú Quốc",
    tourImage: "/experience/cano-4-islands.jpg",
    category: "Tour biển đảo",
    rating: 3,
    content: "Trải nghiệm ổn, nhưng thời gian hơi ngắn. Cần cải thiện lịch trình.",
    reviewDate: "11/08/2024",
    status: "displayed",
    statusLabel: "Đã hiển thị",
  },
]

export const MOCK_REVIEW_QUICK_ACTIONS: ReviewQuickActionItem[] = [
  {
    id: "new-reviews",
    title: "Xem đánh giá mới",
    icon: "new-reviews",
  },
  {
    id: "reply-pending",
    title: "Trả lời đánh giá",
    icon: "reply-pending",
  },
  {
    id: "manage-reviews",
    title: "Quản lý đánh giá",
    icon: "manage-reviews",
  },
  {
    id: "review-policy",
    title: "Thiết lập chính sách đánh giá",
    icon: "review-policy",
  },
]
