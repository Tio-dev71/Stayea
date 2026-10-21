/**
 * STAYEA MOCK DATA (Isolate Mock Data)
 * ------------------------------------
 * Toàn bộ dữ liệu mẫu cô lập mô phỏng cho Landing Page Stayea.
 * Khi Backend cung cấp API endpoints chính thức, thay thế các mock này bằng queries tương ứng.
 */

export interface NavItem {
  readonly label: string
  readonly href: string
  readonly hasDropdown?: boolean
  readonly isMegaMenu?: boolean
  readonly items?: readonly { readonly label: string; readonly href: string }[]
}

export interface TrustBadge {
  readonly id: string
  readonly title: string
  readonly description: string
  readonly iconName: "diamond" | "tag" | "star" | "headset"
}

export interface MegaMenuCard {
  readonly id: string
  readonly kicker?: string
  readonly title: string
  readonly subtitle?: string
  readonly imageUrl: string
  readonly href: string
}

export interface StayMegaMenuData {
  readonly kicker: string
  readonly title: readonly string[]
  readonly description: string
  readonly features: readonly { readonly icon: "leaf" | "diamond" | "heart"; readonly text: string }[]
  readonly ctaText: string
  readonly ctaHref: string
  readonly banners: readonly MegaMenuCard[]
}

export interface AccommodationCategory {
  readonly id: string
  readonly title: string
  readonly description: string
  readonly imageUrl: string
  readonly iconName: "villa" | "building" | "home" | "hotel" | "calendar" | "shield-check" | "crown"
  readonly isSelect?: boolean
  readonly badge?: string
}

export interface ExperienceCategory {
  readonly id: string
  readonly title: string
  readonly description: string
  readonly imageUrl: string
  readonly iconName: "tour" | "island" | "snorkeling" | "diving" | "cruise" | "food" | "spa" | "activity"
  readonly badge?: string
}


export interface DealCategory {
  readonly id: string
  readonly title: string
  readonly description: string
  readonly imageUrl: string
  readonly iconName: string
}

export interface DealsMegaMenuData {
  readonly kicker: string
  readonly title: readonly string[]
  readonly description: string
  readonly features: readonly {
    readonly icon: string
    readonly text: string
  }[]
  readonly ctaText: string
  readonly ctaHref: string
  readonly banners: readonly MegaMenuCard[]
}

export interface ExploreCategory {
  readonly id: string
  readonly title: string
  readonly description: string
  readonly imageUrl: string
  readonly iconName:
    | "mountain"
    | "hotel"
    | "activity"
    | "umbrella"
    | "food"
    | "nightlife"
    | "shopping"
    | "book"
}

export interface ExploreMegaMenuData {
  readonly kicker: string
  readonly title: readonly string[]
  readonly description: string
  readonly features: readonly { readonly icon: string; readonly text: string }[]
  readonly ctaText: string
  readonly ctaHref: string
  readonly banners: readonly MegaMenuCard[]
}

export interface TransportCategory {
  readonly id: string
  readonly title: string
  readonly description: string
  readonly imageUrl: string
  readonly iconName: "plane-takeoff" | "car" | "bike" | "chauffeur"
  readonly badge?: string
}

export interface TransportMegaMenuData {
  readonly kicker: string
  readonly title: readonly string[]
  readonly description: string
  readonly features: readonly { readonly icon: "plane" | "shield" | "diamond"; readonly text: string }[]
  readonly ctaText: string
  readonly ctaHref: string
  readonly banners: readonly {
    readonly id: string
    readonly kicker: string
    readonly title: string
    readonly subtitle: string
    readonly imageUrl: string
    readonly href: string
  }[]
}

export interface ExperienceMegaMenuData {
  readonly kicker: string
  readonly title: readonly string[]
  readonly description: string
  readonly features: readonly { readonly icon: "leaf" | "map-pin" | "heart"; readonly text: string }[]
  readonly ctaText: string
  readonly ctaHref: string
  readonly banners: readonly MegaMenuCard[]
}

export interface ExperienceItem {
  readonly id: string
  readonly title: string
  readonly description: string
  readonly imageUrl: string
}

export interface PackageItem {
  readonly id: string
  readonly title: string
  readonly description: string
  readonly imageUrl: string
}

export interface ExploreGuideItem {
  readonly id: string
  readonly title: string
  readonly description: string
  readonly imageUrl: string
}

export interface TransportationItem {
  readonly id: string
  readonly title: string
  readonly description: string
  readonly imageUrl: string
}

export interface PromoBanner {
  readonly id: string
  readonly title: string
  readonly description: string
  readonly buttonText: string
  readonly href: string
  readonly imageUrl: string
}

export interface PartnerCard {
  readonly id: string
  readonly title: string
  readonly description: string
  readonly buttonText: string
  readonly href: string
  readonly imageUrl: string
}

export const NAV_ITEMS: readonly NavItem[] = [
  { label: "Trang chủ", href: "/" },
  {
    label: "Lưu trú",
    href: "/stay",
    hasDropdown: true,
    isMegaMenu: true,
  },
  {
    label: "Trải nghiệm",
    href: "/experience",
    hasDropdown: true,
    isMegaMenu: true,
  },
  {
    label: "Gói",
    href: "/packages",
    hasDropdown: true,
    isMegaMenu: true,
  },
  {
    label: "Di chuyển",
    href: "/transport",
    hasDropdown: true,
    isMegaMenu: true,
  },
  {
    label: "Khám phá",
    href: "/phu-quoc",
    hasDropdown: true,
    isMegaMenu: true,
  },
  {
    label: "Ưu đãi",
    href: "/deals",
    hasDropdown: true,
    isMegaMenu: true,
  },
  { label: "Stayea Club", href: "/stayea-club" },
  { label: "Trở thành chủ nhà", href: "/host" },
  { label: "Hỗ trợ", href: "/about" },
]

export const TRUST_BADGES: readonly TrustBadge[] = [
  {
    id: "verified",
    title: "Lưu trú uy tín",
    description: "Được kiểm định bởi STAYEA",
    iconName: "diamond",
  },
  {
    id: "best-price",
    title: "Giá tốt nhất",
    description: "Nhiều ưu đãi độc quyền",
    iconName: "tag",
  },
  {
    id: "unique-experience",
    title: "Trải nghiệm độc đáo",
    description: "Từ đội ngũ chuyên gia địa phương",
    iconName: "star",
  },
  {
    id: "support-247",
    title: "Hỗ trợ 24/7",
    description: "Luôn đồng hành cùng bạn",
    iconName: "headset",
  },
]

export const ACCOMMODATIONS: readonly AccommodationCategory[] = [
  {
    id: "villas",
    title: "Biệt thự",
    description: "Biệt thự nghỉ dưỡng riêng tư",
    imageUrl: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=700&q=80",
    iconName: "villa",
  },
  {
    id: "apartments",
    title: "Căn hộ",
    description: "Căn hộ tiện nghi như ở nhà",
    imageUrl: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=700&q=80",
    iconName: "building",
  },
  {
    id: "homestays",
    title: "Homestay",
    description: "Không gian gần gũi, đậm chất địa phương",
    imageUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=400&q=80",
    iconName: "home",
  },
  {
    id: "hotels",
    title: "Khách sạn",
    description: "Thoải mái, tiện nghi và dịch vụ chuyên nghiệp",
    imageUrl: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=400&q=80",
    iconName: "hotel",
  },
  {
    id: "long-stay",
    title: "Lưu trú dài hạn",
    description: "Linh hoạt cho hành trình dài ngày",
    imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=700&q=80",
    iconName: "calendar",
  },
  {
    id: "stayea-verified",
    title: "Stayea Verified",
    description: "Lưu trú được kiểm định và xác thực bởi STAYEA",
    imageUrl: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=400&q=80",
    iconName: "shield-check",
    badge: "Đề xuất",
  },
  {
    id: "stayea-select",
    title: "Stayea Select",
    description: "Bộ sưu tập lưu trú tinh hoa, trải nghiệm khác biệt",
    imageUrl: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=700&q=80",
    iconName: "crown",
    badge: "Cao cấp",
    isSelect: true,
  },
]

export const STAY_MEGA_MENU_DATA: StayMegaMenuData = {
  kicker: "KHÁM PHÁ LƯU TRÚ",
  title: [
    "Nơi mỗi hành trình",
    "đều bắt đầu từ",
    "một chốn dừng chân",
    "đặc biệt",
  ],
  description: "Đa dạng lựa chọn lưu trú tại những điểm đến đẹp nhất Việt Nam và khu vực, được tuyển chọn kỹ lưỡng bởi STAYEA.",
  features: [
    { icon: "leaf", text: "Không gian tuyệt vời" },
    { icon: "diamond", text: "Trải nghiệm khác biệt" },
    { icon: "heart", text: "Luôn đồng hành cùng bạn" },
  ],
  ctaText: "Xem tất cả lưu trú",
  ctaHref: "#accommodations",
    banners: [
    {
      id: "exp-banner-1",
      kicker: "TRẢI NGHIỆM TUYỂN CHỌN",
      title: "Những khoảnh khắc khó quên giữa thiên nhiên Phú Quốc",
      imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
      href: "#experiences",
    },
    {
      id: "exp-banner-2",
      title: "Từ khám phá đến thư giãn, luôn có trải nghiệm dành cho bạn cùng STAYEA",
      imageUrl: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80",
      href: "#experiences",
    },
  ],
}


export const EXPERIENCE_CATEGORIES: readonly ExperienceCategory[] = [
  {
    id: "tour",
    title: "Tour",
    description: "Các hành trình khám phá nổi bật",
    imageUrl: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=400&q=80",
    iconName: "tour",
  },
  {
    id: "island-tour",
    title: "Tour đảo",
    description: "Du ngoạn các hòn đảo đẹp nhất",
    imageUrl: "https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?auto=format&fit=crop&w=400&q=80",
    iconName: "island",
  },
  {
    id: "snorkeling",
    title: "Lặn ngắm san hô",
    description: "Khám phá thế giới dưới nước",
    imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=400&q=80",
    iconName: "snorkeling",
    badge: "Nổi bật",
  },
  {
    id: "diving",
    title: "Lặn biển",
    description: "Trải nghiệm chuyên sâu cùng hướng dẫn viên",
    imageUrl: "https://images.unsplash.com/photo-1682687220063-4742bd7fd538?auto=format&fit=crop&w=400&q=80",
    iconName: "diving",
  },
  {
    id: "cruise",
    title: "Du thuyền",
    description: "Thưởng ngoạn biển trời sang trọng",
    imageUrl: "https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?auto=format&fit=crop&w=400&q=80",
    iconName: "cruise",
  },
  {
    id: "food",
    title: "Ẩm thực",
    description: "Hương vị Phú Quốc được tuyển chọn",
    imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80",
    iconName: "food",
  },
  {
    id: "spa",
    title: "Spa",
    description: "Thư giãn, tái tạo năng lượng",
    imageUrl: "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&w=400&q=80",
    iconName: "spa",
  },
  {
    id: "activity",
    title: "Hoạt động vui chơi",
    description: "Kayak, chèo SUP và nhiều hơn nữa",
    imageUrl: "https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?auto=format&fit=crop&w=400&q=80",
    iconName: "activity",
  },
]

export const EXPLORE_CATEGORIES: readonly ExploreCategory[] = [
  {
    id: "phu-quoc",
    title: "Phú Quốc",
    description: "Tổng quan về đảo ngọc đầy mê hoặc",
    imageUrl: "/explore/phu-quoc.jpg",
    iconName: "mountain",
  },
  {
    id: "o-dau",
    title: "Ở đâu",
    description: "Khách sạn, resort và khu lưu trú lý tưởng",
    imageUrl: "/explore/o-dau.jpg",
    iconName: "hotel",
  },
  {
    id: "choi-gi",
    title: "Chơi gì",
    description: "Những hoạt động thú vị không thể bỏ lỡ",
    imageUrl: "/explore/choi-gi.jpg",
    iconName: "activity",
  },
  {
    id: "bai-bien",
    title: "Bãi biển",
    description: "Những bãi biển đẹp nhất Phú Quốc",
    imageUrl: "/explore/bai-bien.jpg",
    iconName: "umbrella",
  },
  {
    id: "an-gi",
    title: "Ăn gì",
    description: "Tinh hoa ẩm thực đảo ngọc",
    imageUrl: "/explore/an-gi.jpg",
    iconName: "food",
  },
  {
    id: "vui-choi-ve-dem",
    title: "Vui chơi về đêm",
    description: "Sôi động và đầy màu sắc sau hoàng hôn",
    imageUrl: "/explore/vui-choi-ve-dem.jpg",
    iconName: "nightlife",
  },
  {
    id: "mua-sam",
    title: "Mua sắm",
    description: "Đặc sản và quà lưu niệm đậm chất Phú Quốc",
    imageUrl: "/explore/mua-sam.jpg",
    iconName: "shopping",
  },
  {
    id: "cam-nang",
    title: "Cẩm nang du lịch",
    description: "Kinh nghiệm, mẹo hay cho chuyến đi trọn vẹn",
    imageUrl: "/explore/cam-nang.jpg",
    iconName: "book",
  },
]

export const EXPLORE_MEGA_MENU_DATA: ExploreMegaMenuData = {
  kicker: "KHÁM PHÁ PHÚ QUỐC",
  title: ["Mỗi góc Phú Quốc", "đều có một câu chuyện", "đáng để khám phá"],
  description:
    "Từ những bãi biển ngọc lam, làng chài bình yên đến ẩm thực đặc sắc và văn hóa bản địa, STAYEA cùng bạn khám phá Phú Quốc theo cách sâu sắc và trọn vẹn nhất.",
  features: [
    { icon: "leaf", text: "Thông tin hữu ích, cập nhật" },
    { icon: "pin", text: "Góc nhìn bản địa chân thực" },
    { icon: "heart", text: "Truyền cảm hứng cho hành trình" },
  ],
  ctaText: "Xem tất cả bài viết",
  ctaHref: "#explore",
  banners: [
    {
      id: "explore-tropical",
      kicker: "KHÁM PHÁ PHÚ QUỐC",
      title: "Thiên đường nhiệt đới đang chờ bạn khám phá",
      subtitle: "",
      imageUrl: "/explore/cable-car.jpg",
      href: "#explore",
    },
    {
      id: "explore-local",
      kicker: "GÓC NHÌN ĐỊA PHƯƠNG",
      title: "Những điều tuyệt vời chỉ có ở Phú Quốc",
      subtitle: "",
      imageUrl: "/explore/sunset-island.jpg",
      href: "#explore",
    },
  ],
}

export const TRANSPORT_CATEGORIES: readonly TransportCategory[] = [
  {
    id: "airport-transfer",
    title: "Đưa đón sân bay",
    description: "Đúng giờ, thuận tiện khởi đầu hành trình",
    imageUrl: "/transport/airport-van.jpg",
    iconName: "plane-takeoff",
  },
  {
    id: "car-rental",
    title: "Thuê ô tô",
    description: "Linh hoạt, thoải mái chinh phục mọi hành trình",
    imageUrl: "/transport/car-rental-suv.jpg",
    iconName: "car",
  },
  {
    id: "motorbike-rental",
    title: "Thuê xe máy",
    description: "Tự do khám phá vẻ đẹp Phú Quốc",
    imageUrl: "/transport/motorbike-rental.jpg",
    iconName: "bike",
  },
  {
    id: "private-chauffeur",
    title: "Tài xế riêng",
    description: "Riêng tư, cao cấp cho hành trình đặc biệt",
    imageUrl: "/transport/chauffeur-vip.jpg",
    iconName: "chauffeur",
  },
]

export const TRANSPORT_MEGA_MENU_DATA: TransportMegaMenuData = {
  kicker: "KHÁM PHÁ DI CHUYỂN",
  title: ["Di chuyển dễ dàng", "Khám phá trọn vẹn", "Phú Quốc"],
  description:
    "Dịch vụ di chuyển đa dạng, tiện lợi và an toàn, giúp bạn tận hưởng hành trình khám phá Phú Quốc một cách thoải mái và trọn vẹn hơn.",
  features: [
    { icon: "plane", text: "Đặt nhanh, xác nhận tức thì" },
    { icon: "shield", text: "An toàn, đáng tin cậy" },
    { icon: "diamond", text: "Dịch vụ chất lượng, trải nghiệm cao cấp" },
  ],
  ctaText: "Xem tất cả dịch vụ",
  ctaHref: "#transportation",
  banners: [
    {
      id: "airport-vip",
      kicker: "ĐƯA ĐÓN SÂN BAY CAO CẤP",
      title: "Hành trình suôn sẻ bắt đầu từ STAYEA",
      subtitle: "Đúng giờ · An toàn · Thoải mái",
      imageUrl: "/transport/airport-sunset-vip.jpg",
      href: "#transportation",
    },
    {
      id: "scenic-drive",
      kicker: "DI CHUYỂN LINH HOẠT",
      title: "Dễ dàng khám phá mọi nẻo đường Phú Quốc",
      subtitle: "Tự do hơn, trải nghiệm nhiều hơn",
      imageUrl: "/transport/car-rental-suv.jpg",
      href: "#transportation",
    },
  ],
}

export const EXPERIENCE_MEGA_MENU_DATA: ExperienceMegaMenuData = {
  kicker: "KHÁM PHÁ TRẢI NGHIỆM",
  title: [
    "Mỗi hành trình trở nên",
    "đáng nhớ nhờ những",
    "trải nghiệm đặc sắc",
  ],
  description: "Từ khám phá biển đảo đến ẩm thực và thư giãn, STAYEA tuyển chọn những trải nghiệm giúp bạn tận hưởng Phú Quốc theo cách trọn vẹn nhất.",
  features: [
    { icon: "leaf", text: "Hoạt động tuyển chọn" },
    { icon: "map-pin", text: "Đậm chất địa phương" },
    { icon: "heart", text: "Trọn vẹn từng khoảnh khắc" },
  ],
  ctaText: "Xem tất cả trải nghiệm",
  ctaHref: "#experiences",
  banners: [
    {
      id: "exp-banner-1",
      kicker: "TRẢI NGHIỆM TUYỂN CHỌN",
      title: "Những khoảnh khắc khó quên giữa thiên nhiên Phú Quốc",
      imageUrl: "https://images.unsplash.com/photo-1682687220063-4742bd7fd538?auto=format&fit=crop&w=800&q=80",
      href: "#experiences",
    },
    {
      id: "exp-banner-2",
      title: "Từ khám phá đến thư giãn, luôn có trải nghiệm dành cho bạn cùng STAYEA",
      imageUrl: "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=800&q=80",
      href: "#experiences",
    },
  ],
}

export const EXPERIENCES: readonly ExperienceItem[] = [
  {
    id: "tours",
    title: "Tours",
    description: "Tham quan nổi bật",
    imageUrl: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "island-trips",
    title: "Island Trips",
    description: "Khám phá các hòn đảo",
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "snorkeling",
    title: "Snorkeling",
    description: "Ngắm san hô rực rỡ",
    imageUrl: "https://images.unsplash.com/photo-1682687220063-4742bd7fd538?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "diving",
    title: "Diving",
    description: "Lặn biển khám phá đại dương",
    imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "cruises",
    title: "Cruises",
    description: "Du thuyền trên biển ngọc",
    imageUrl: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "food",
    title: "Food",
    description: "Tinh hoa ẩm thực",
    imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "spa",
    title: "Spa",
    description: "Thư giãn tái tạo năng lượng",
    imageUrl: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "activities",
    title: "Activities",
    description: "Nhiều hoạt động thú vị",
    imageUrl: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=400&q=80",
  },
]

export const PACKAGES: readonly PackageItem[] = [
  {
    id: "couple",
    title: "Couple",
    description: "Lãng mạn cùng nhau",
    imageUrl: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "family",
    title: "Family",
    description: "Kết nối gia đình",
    imageUrl: "https://images.unsplash.com/photo-1609220136736-443140cffec6?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "friends",
    title: "Friends",
    description: "Cùng bạn bè khám phá",
    imageUrl: "https://images.unsplash.com/photo-1539635278303-d4002c07eae3?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "long-stay-pack",
    title: "Long Stay",
    description: "Sống chậm tận hưởng",
    imageUrl: "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "workation",
    title: "Workation",
    description: "Làm việc từ thiên đường",
    imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=400&q=80",
  },
]

export const EXPLORE_GUIDES: readonly ExploreGuideItem[] = [
  {
    id: "phu-quoc",
    title: "Phú Quốc",
    description: "Tổng quan về đảo ngọc",
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "noi-luu-tru",
    title: "Nơi lưu trú",
    description: "Gợi ý khu vực phù hợp",
    imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "diem-tham-quan",
    title: "Điểm tham quan",
    description: "Những địa điểm không thể bỏ lỡ",
    imageUrl: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "bai-bien",
    title: "Bãi biển",
    description: "Thiên đường biển xanh",
    imageUrl: "https://images.unsplash.com/photo-1473186578172-c141e6798cf4?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "am-thuc",
    title: "Ẩm thực",
    description: "Hương vị đặc trưng Phú Quốc",
    imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "nightlife",
    title: "Cuộc sống về đêm",
    description: "Sôi động và đầy màu sắc",
    imageUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "shopping",
    title: "Mua sắm",
    description: "Đặc sản & quà lưu niệm",
    imageUrl: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "travel-guide",
    title: "Cẩm nang du lịch",
    description: "Kinh nghiệm hữu ích",
    imageUrl: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=400&q=80",
  },
]

export const TRANSPORTATION_SERVICES: readonly TransportationItem[] = [
  {
    id: "airport-shuttle",
    title: "Đón tiễn sân bay",
    description: "Thuận tiện, đúng giờ",
    imageUrl: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "car-rental",
    title: "Thuê xe ô tô",
    description: "Tự do khám phá",
    imageUrl: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "scooter-rental",
    title: "Thuê xe máy",
    description: "Linh hoạt, tiết kiệm",
    imageUrl: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "private-driver",
    title: "Tài xế riêng",
    description: "Riêng tư, thoải mái",
    imageUrl: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=600&q=80",
  },
]

export const PROMO_BANNERS: readonly PromoBanner[] = [
  {
    id: "trip-planner",
    title: "Lên kế hoạch chuyến đi cùng Trip Planner",
    description: "Tạo hành trình hoàn hảo chỉ trong vài phút với gợi ý thông minh từ STAYEA.",
    buttonText: "Bắt đầu ngay",
    href: "#planner",
    imageUrl: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "special-deals",
    title: "Ưu đãi đặc biệt",
    description: "Tiết kiệm hơn cho kỳ nghỉ tuyệt vời",
    buttonText: "Xem ưu đãi",
    href: "#deals",
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80",
  },
]

export const PARTNER_CARDS: readonly PartnerCard[] = [
  {
    id: "stayea-club",
    title: "Tham gia Stayea Club",
    description: "Nhiều đặc quyền, nhiều trải nghiệm hơn",
    buttonText: "Khám phá ngay",
    href: "#club",
    imageUrl: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "become-host",
    title: "Trở thành chủ nhà",
    description: "Chia sẻ không gian, tạo nên giá trị",
    buttonText: "Đăng ký ngay",
    href: "#host",
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "partner-stayea",
    title: "Hợp tác cùng Stayea",
    description: "Cùng phát triển du lịch bền vững",
    buttonText: "Liên hệ ngay",
    href: "#partner",
    imageUrl: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=800&q=80",
  },
]

export const FOOTER_COLUMNS = {
  khamPha: {
    title: "Khám phá",
    links: [
      { label: "Lưu trú", href: "#accommodations" },
      { label: "Trải nghiệm", href: "#experiences" },
      { label: "Gói hành trình", href: "#packages" },
      { label: "Khám phá Phú Quốc", href: "#explore" },
      { label: "Di chuyển", href: "#transportation" },
      { label: "Ưu đãi", href: "#deals" },
    ],
  },
  veStayea: {
    title: "Về Stayea",
    links: [
      { label: "Câu chuyện của chúng tôi", href: "#about" },
      { label: "Giá trị cốt lõi", href: "#values" },
      { label: "Tin tức", href: "#news" },
      { label: "Cơ hội nghề nghiệp", href: "#careers" },
      { label: "Trở thành chủ nhà", href: "#host" },
      { label: "Hợp tác cùng Stayea", href: "#partner" },
    ],
  },
  hoTro: {
    title: "Hỗ trợ",
    links: [
      { label: "Trung tâm trợ giúp", href: "#help" },
      { label: "Liên hệ", href: "#contact" },
      { label: "Điều khoản sử dụng", href: "#terms" },
      { label: "Chính sách bảo mật", href: "#privacy" },
      { label: "Chính sách hủy phòng", href: "#cancellation" },
      { label: "FAQ", href: "#faq" },
    ],
  },
} as const

export const LANGUAGES = [
  { code: "vi", label: "Tiếng Việt", flag: "🇻🇳" },
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "zh", label: "中文", flag: "🇨🇳" },
  { code: "ko", label: "한국어", flag: "🇰🇷" },
  { code: "ru", label: "Русский", flag: "🇷🇺" },
  { code: "hi", label: "हिन्दी", flag: "🇮🇳" },
] as const


export const DEALS_CATEGORIES: readonly DealCategory[] = [
  {
    id: "early-bird",
    title: "Ưu đãi sớm",
    description: "Đặt sớm để nhận mức giá tốt hơn",
    imageUrl: "/deals/early-bird.jpg",
    iconName: "calendar",
  },
  {
    id: "member",
    title: "Ưu đãi cho thành viên",
    description: "Đặc quyền riêng dành cho Stayea Club",
    imageUrl: "/deals/member.jpg",
    iconName: "crown",
  },
  {
    id: "last-minute",
    title: "Ưu đãi phút chót",
    description: "Linh hoạt cho những chuyến đi bất chợt",
    imageUrl: "/deals/last-minute.jpg",
    iconName: "clock",
  },
  {
    id: "combo",
    title: "Combo tiết kiệm",
    description: "Kết hợp lưu trú và trải nghiệm tiện lợi",
    imageUrl: "/deals/combo.jpg",
    iconName: "tag",
  },
  {
    id: "long-stay",
    title: "Lưu trú dài hạn",
    description: "Ở lâu hơn, tối ưu chi phí hơn",
    imageUrl: "/deals/long-stay.jpg",
    iconName: "hotel",
  },
  {
    id: "workation",
    title: "Workation deal",
    description: "Làm việc từ đảo ngọc với chi phí hợp lý",
    imageUrl: "/deals/workation.jpg",
    iconName: "briefcase",
  },
  {
    id: "seasonal",
    title: "Ưu đãi theo mùa",
    description: "Khuyến mãi theo thời điểm đẹp nhất",
    imageUrl: "/deals/seasonal.jpg",
    iconName: "sun",
  },
  {
    id: "family",
    title: "Gia đình & nhóm bạn",
    description: "Giá tốt hơn cho kỳ nghỉ đông người",
    imageUrl: "/deals/family.jpg",
    iconName: "users",
  },
]

export const DEALS_MEGA_MENU_DATA: DealsMegaMenuData = {
  kicker: "ƯU ĐÃI STAYEA",
  title: ["Nhiều ưu đãi hơn", "cho mỗi chuyến đi", "của bạn"],
  description:
    "STAYEA tổng hợp những ưu đãi đặc biệt cho lưu trú, trải nghiệm, di chuyển và các gói theo mùa tại Phú Quốc, giúp bạn tiết kiệm hơn và tận hưởng những chuyến đi trọn vẹn hơn.",
  features: [
    { icon: "piggy", text: "Tiết kiệm hơn mỗi lần đặt" },
    { icon: "star", text: "Ưu đãi chọn lọc, dễ sử dụng" },
    { icon: "gift", text: "Áp dụng cho nhiều nhu cầu du lịch" },
  ],
  ctaText: "Xem tất cả ưu đãi",
  ctaHref: "#deals",
  banners: [
    {
      id: "deal-special",
      kicker: "ƯU ĐÃI ĐẶC BIỆT",
      title: "Giảm thêm cho hành trình khám phá Phú Quốc",
      subtitle: "",
      imageUrl: "/deals/tropical-deal.jpg",
      href: "#deals",
    },
    {
      id: "deal-member",
      kicker: "ĐẶC QUYỀN THÀNH VIÊN",
      title: "Nhiều quà tặng hơn cho chuyến đi rực rỡ của bạn",
      subtitle: "",
      imageUrl: "/deals/member-luxury.jpg",
      href: "#deals",
    },
  ],
}


export interface TeamMember {
  readonly id: string
  readonly name: string
  readonly role: string
  readonly quote: string
  readonly imageUrl: string
}

export interface AboutPageData {
  readonly hero: {
    readonly kicker: string
    readonly title: string
    readonly description: string
    readonly features: readonly { readonly icon: string; readonly text: string }[]
    readonly ctaPrimary: string
    readonly ctaSecondary: string
    readonly location: string
    readonly locationSub: string
  }
  readonly story: {
    readonly kicker: string
    readonly title: string
    readonly paragraphs: readonly string[]
    readonly quote: string
    readonly videoText: string
    readonly videoBadge: string
    readonly imageUrl: string
  }
  readonly principles: {
    readonly kicker: string
    readonly title: string
    readonly subtitle: string
    readonly vision: {
      readonly title: string
      readonly description: string
    }
    readonly mission: {
      readonly title: string
      readonly description: string
    }
    readonly coreValues: readonly {
      readonly title: string
      readonly description: string
      readonly icon: string
    }[]
  }
  readonly team: {
    readonly kicker: string
    readonly title: string
    readonly subtitle: string
    readonly ctaText: string
    readonly members: readonly TeamMember[]
  }
}

export const ABOUT_PAGE_DATA: AboutPageData = {
  hero: {
    kicker: "VỀ STAYEA",
    title: "STAYEA – Hơn cả một nơi lưu trú, là cách bạn khám phá Phú Quốc tinh tế hơn",
    description:
      "Chúng tôi kiến tạo những kỳ nghỉ trọn vẹn hơn, với nơi lưu trú tinh tuyển, trải nghiệm ý nghĩa và hành trình dễ dàng hơn tại đảo ngọc Phú Quốc.",
    features: [
      { icon: "leaf", text: "Tinh tuyển điểm đến" },
      { icon: "pin", text: "Trải nghiệm đáng nhớ" },
      { icon: "heart", text: "Hành trình dễ dàng hơn" },
    ],
    ctaPrimary: "Khám phá Stayea",
    ctaSecondary: "Liên hệ hợp tác",
    location: "Phú Quốc, Việt Nam",
    locationSub: "Nơi những điều tuyệt vời bắt đầu",
  },
  story: {
    kicker: "CÂU CHUYỆN CỦA CHÚNG TÔI",
    title: "Từ tình yêu Phú Quốc đến một hành trình ý nghĩa",
    paragraphs: [
      "STAYEA ra đời từ tình yêu dành cho Phú Quốc – hòn đảo của những bãi biển ngọc lam, thiên nhiên trù phú và con người mến khách. Chúng tôi tin rằng, mỗi chuyến đi đều có thể trở nên đặc biệt hơn khi bạn tìm được nơi lưu trú phù hợp, trải nghiệm đúng với sở thích và hành trình được chuẩn bị chu đáo.",
      "Vì thế, STAYEA được tạo nên để tinh tuyển những nơi lưu trú chất lượng, kết nối bạn với những trải nghiệm địa phương chân thực, và mang đến hành trình khám phá Phú Quốc dễ dàng, trọn vẹn hơn – theo cách tinh tế và bền vững.",
    ],
    quote: "“Mỗi chuyến đi là một câu chuyện, và chúng tôi ở đây để giúp bạn viết nên những chương đẹp nhất tại Phú Quốc.”",
    videoText: "Xem video về Stayea",
    videoBadge: "Đảo ngọc những câu chuyện đẹp",
    imageUrl: "/about/story-beach.jpg",
  },
  principles: {
    kicker: "NỀN TẢNG CHO NHỮNG HÀNH TRÌNH Ý NGHĨA",
    title: "Tầm nhìn – Sứ mệnh – Giá trị cốt lõi",
    subtitle:
      "Những nguyên tắc dẫn lối cho mọi điều chúng tôi làm, vì một Phú Quốc đẹp hơn mỗi ngày.",
    vision: {
      title: "Tầm nhìn",
      description:
        "Trở thành nền tảng du lịch và lưu trú được tin cậy hàng đầu khi nhắc đến Phú Quốc, góp phần nâng tầm trải nghiệm du lịch Việt Nam ra thế giới.",
    },
    mission: {
      title: "Sứ mệnh",
      description:
        "Kết nối du khách với những nơi lưu trú tinh tuyển, trải nghiệm địa phương ý nghĩa và dịch vụ đáng tin cậy, để mỗi hành trình tại Phú Quốc trở nên dễ dàng, trọn vẹn và đáng nhớ hơn.",
    },
    coreValues: [
      {
        title: "Tinh tuyển",
        description: "Chất lượng là ưu tiên hàng đầu",
        icon: "leaf",
      },
      {
        title: "Tin cậy",
        description: "Minh bạch, đáng tin, có trách nhiệm",
        icon: "shield",
      },
      {
        title: "Tinh tế",
        description: "Chú trọng trải nghiệm và chi tiết",
        icon: "star",
      },
      {
        title: "Đồng hành",
        description: "Luôn bên bạn trong suốt hành trình",
        icon: "users",
      },
    ],
  },
  team: {
    kicker: "NHỮNG CON NGƯỜI KIẾN TẠO STAYEA",
    title: "Đội ngũ của chúng tôi",
    subtitle:
      "Một đội ngũ đam mê du lịch, am hiểu Phú Quốc và luôn nỗ lực mang đến những trải nghiệm tốt đẹp hơn mỗi ngày.",
    ctaText: "Gia nhập đội ngũ",
    members: [
      {
        id: "nguyen-minh-anh",
        name: "Nguyễn Minh Anh",
        role: "CEO & Nhà sáng lập",
        quote: "“Vì một Phú Quốc được khám phá theo cách tinh tế hơn.”",
        imageUrl: "/about/team-1.jpg",
      },
      {
        id: "tran-thao-vy",
        name: "Trần Thảo Vy",
        role: "Giám đốc Sản phẩm",
        quote: "“Trải nghiệm tuyệt vời bắt đầu từ sự thấu hiểu.”",
        imageUrl: "/about/team-2.jpg",
      },
      {
        id: "le-quang-huy",
        name: "Lê Quang Huy",
        role: "Giám đốc Vận hành",
        quote: "“Mỗi hành trình suôn sẻ là niềm vui của chúng tôi.”",
        imageUrl: "/about/team-3.jpg",
      },
      {
        id: "pham-mai-linh",
        name: "Phạm Mai Linh",
        role: "Giám đốc Truyền thông",
        quote: "“Lan tỏa những câu chuyện đẹp về Phú Quốc.”",
        imageUrl: "/about/team-4.jpg",
      },
    ],
  },
}

// ============================================================================
// HOST LANDING PAGE MOCK DATA ("TRỞ THÀNH CHỦ NHÀ CÙNG STAYEA")
// ============================================================================

export interface HostBenefitItem {
  readonly id: string
  readonly title: string
  readonly description: string
  readonly iconName: string
}

export const HOST_BENEFITS: readonly HostBenefitItem[] = [
  {
    id: "access-guests",
    title: "Tiếp cận khách du lịch trong nước & quốc tế",
    description: "Kết nối với cộng đồng du khách chất lượng, yêu thích trải nghiệm tại Phú Quốc.",
    iconName: "globe",
  },
  {
    id: "occupancy-rate",
    title: "Tăng tỷ lệ lấp phòng",
    description: "Tối ưu hiển thị, tiếp thị hiệu quả giúp gia tăng lượng đặt phòng.",
    iconName: "barchart",
  },
  {
    id: "calendar-pricing",
    title: "Chủ động lịch và giá",
    description: "Bạn hoàn toàn kiểm soát lịch trống, mức giá và các chính sách lưu trú của mình.",
    iconName: "calendar",
  },
  {
    id: "transparent-payment",
    title: "Thanh toán rõ ràng, minh bạch",
    description: "Quy trình thanh toán an toàn, minh bạch với báo cáo chi tiết.",
    iconName: "creditcard",
  },
  {
    id: "media-support",
    title: "Hỗ trợ truyền thông & hình ảnh",
    description: "Được tư vấn chụp ảnh chuyên nghiệp và truyền thông trên các kênh của STAYEA.",
    iconName: "camera",
  },
  {
    id: "local-team",
    title: "Đội ngũ hỗ trợ địa phương",
    description: "Đội ngũ tại Phú Quốc luôn sẵn sàng hỗ trợ nhanh chóng, tận tâm.",
    iconName: "users",
  },
  {
    id: "guest-verification",
    title: "Quy trình xác minh khách & lưu trú an toàn",
    description: "Xác minh thông tin khách hàng, đảm bảo môi trường lưu trú an toàn, văn minh.",
    iconName: "shieldcheck",
  },
  {
    id: "realtime-report",
    title: "Báo cáo hiệu quả & theo dõi đặt phòng",
    description: "Cung cấp báo cáo chi tiết về lượt xem, đặt phòng và doanh thu theo thời gian thực.",
    iconName: "filetext",
  },
]

export interface HostProcessStep {
  readonly step: number
  readonly title: string
  readonly description: string
  readonly iconName: string
}

export const HOST_PROCESS_STEPS: readonly HostProcessStep[] = [
  {
    step: 1,
    title: "Gửi thông tin chỗ ở",
    description: "Điền thông tin cơ bản về lưu trú của bạn.",
    iconName: "user",
  },
  {
    step: 2,
    title: "STAYEA tư vấn & thẩm định",
    description: "Đội ngũ liên hệ, tư vấn chi tiết và thẩm định thực tế (nếu cần).",
    iconName: "messages",
  },
  {
    step: 3,
    title: "Đăng tải và tối ưu listing",
    description: "Chúng tôi hỗ trợ tạo nội dung, hình ảnh chuyên nghiệp.",
    iconName: "upload",
  },
  {
    step: 4,
    title: "Nhận khách & tăng trưởng doanh thu",
    description: "Bắt đầu đón khách và cùng STAYEA phát triển bền vững.",
    iconName: "trending",
  },
]

export interface HostPartnershipValue {
  readonly id: string
  readonly title: string
  readonly description: string
  readonly iconName: string
}

export const HOST_PARTNERSHIP_VALUES: readonly HostPartnershipValue[] = [
  {
    id: "local-insight",
    title: "Am hiểu Phú Quốc",
    description: "Chúng tôi là những người bản địa, hiểu rõ thị trường và nhu cầu du khách.",
    iconName: "mappin",
  },
  {
    id: "targeted-guests",
    title: "Tệp khách phù hợp",
    description: "Thu hút những du khách văn minh, chi tiêu tốt, yêu thích trải nghiệm.",
    iconName: "users",
  },
  {
    id: "curated-positioning",
    title: "Định vị lưu trú tinh tuyển",
    description: "Chỉ hợp tác với những không gian chất lượng, đúng tinh thần nghỉ dưỡng Phú Quốc.",
    iconName: "diamond",
  },
  {
    id: "sustainable-partnership",
    title: "Hợp tác chuyên nghiệp, lâu dài",
    description: "Luôn đặt lợi ích của chủ nhà lên hàng đầu, hướng đến mối quan hệ bền vững.",
    iconName: "handshake",
  },
]

export interface HostPropertyCategory {
  readonly id: string
  readonly title: string
  readonly subtitle?: string
  readonly imageUrl: string
}

export const HOST_PROPERTY_CATEGORIES: readonly HostPropertyCategory[] = [
  {
    id: "villa",
    title: "Biệt thự",
    imageUrl: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: "apartment",
    title: "Căn hộ",
    imageUrl: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: "homestay",
    title: "Homestay",
    imageUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "boutique-hotel",
    title: "Khách sạn nhỏ",
    subtitle: "Boutique stay",
    imageUrl: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "long-stay",
    title: "Lưu trú dài hạn",
    imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=700&q=80",
  },
]

export interface HostTransparencyItem {
  readonly id: string
  readonly title: string
  readonly description: string
  readonly iconName: string
}

export const HOST_TRANSPARENCY_ITEMS: readonly HostTransparencyItem[] = [
  {
    id: "no-hidden-fees",
    title: "Không phí ẩn",
    description: "Minh bạch mọi chi phí ngay từ đầu.",
    iconName: "coins",
  },
  {
    id: "clear-terms",
    title: "Điều khoản rõ ràng",
    description: "Hợp đồng chi tiết, dễ hiểu, bảo vệ quyền lợi hai bên.",
    iconName: "filecheck",
  },
  {
    id: "support-journey",
    title: "Hỗ trợ trước, trong và sau khi đón khách",
    description: "Luôn đồng hành khi bạn cần.",
    iconName: "headphones",
  },
  {
    id: "host-control",
    title: "Chủ nhà kiểm soát tình trạng chỗ ở, lịch và mức giá",
    description: "Bạn luôn là người quyết định.",
    iconName: "settings",
  },
]

export interface HostFaqItem {
  readonly id: string
  readonly question: string
  readonly answer: string
}

export const HOST_FAQS: readonly HostFaqItem[] = [
  {
    id: "faq-1",
    question: "STAYEA phù hợp với loại hình lưu trú nào?",
    answer: "STAYEA chào đón các biệt thự nghỉ dưỡng riêng tư, căn hộ cao cấp, homestay đậm chất bản địa, khách sạn boutique và các không gian lưu trú dài hạn đáp ứng tiêu chuẩn chất lượng, vệ sinh và trải nghiệm tại Phú Quốc.",
  },
  {
    id: "faq-2",
    question: "Tôi có thể tự quản lý lịch và giá không?",
    answer: "Hoàn toàn có thể. Bạn có toàn quyền thiết lập giá phòng, cập nhật lịch trống, chính sách phụ thu hoặc áp dụng các mức giá ưu đãi linh hoạt theo từng mùa cao điểm/thấp điểm thông qua bảng điều khiển chủ nhà.",
  },
  {
    id: "faq-3",
    question: "Quy trình hợp tác có mất phí ban đầu không?",
    answer: "Không. STAYEA cam kết không thu bất kỳ khoản phí khởi tạo hay phí duy trì niêm yết ban đầu nào. Chúng tôi chỉ áp dụng mức phí hoa hồng dựa trên các giao dịch đặt phòng thành công và thực tế.",
  },
  {
    id: "faq-4",
    question: "Bao lâu tôi có thể bắt đầu nhận khách?",
    answer: "Thông thường từ 24 - 48 giờ sau khi tiếp nhận thông tin, hoàn tất xác minh cơ sở lưu trú và đồng bộ hình ảnh/nội dung lên hệ thống, chỗ nghỉ của bạn đã có thể sẵn sàng đón những vị khách đầu tiên.",
  },
]

// =============================================================================
// PARTNER SCREEN DATA ("Hợp tác cùng STAYEA") - Mock Data
// =============================================================================

export interface PartnerBenefitItem {
  readonly id: number
  readonly title: string
  readonly description: string
  readonly iconName: string
}

export const PARTNER_BENEFITS: readonly PartnerBenefitItem[] = [
  {
    id: 1,
    title: "Tiếp cận khách hàng phù hợp",
    description: "Kết nối với nhóm khách hàng yêu du lịch, có nhu cầu thực.",
    iconName: "users",
  },
  {
    id: 2,
    title: "Tăng hiện diện thương hiệu",
    description: "Xuất hiện trên các kênh truyền thông của STAYEA.",
    iconName: "star",
  },
  {
    id: 3,
    title: "Hỗ trợ nội dung & truyền thông",
    description: "Đồng hành xây dựng nội dung hình ảnh, bài viết chuyên nghiệp.",
    iconName: "filetext",
  },
  {
    id: 4,
    title: "Tối ưu cơ hội bán hàng",
    description: "Tiếp cận nhiều kênh phân phối và chương trình ưu đãi hấp dẫn.",
    iconName: "trendingup",
  },
  {
    id: 5,
    title: "Đề xuất gói hợp tác linh hoạt",
    description: "Thiết kế giải pháp phù hợp với mô hình và mục tiêu của bạn.",
    iconName: "settings",
  },
  {
    id: 6,
    title: "Báo cáo minh bạch",
    description: "Cập nhật số liệu rõ ràng, đo lường hiệu quả.",
    iconName: "piechart",
  },
  {
    id: 7,
    title: "Đồng hành dài hạn",
    description: "Phát triển cùng nhau trên tinh thần đối tác chiến lược.",
    iconName: "heart",
  },
  {
    id: 8,
    title: "Kết nối hệ sinh thái du lịch",
    description: "Mở rộng cơ hội hợp tác với các đối tác chất lượng trong ngành.",
    iconName: "network",
  },
]

export interface PartnerCategoryItem {
  readonly id: number
  readonly title: string
  readonly subtitle: string
  readonly imageUrl: string
}

export const PARTNER_CATEGORIES: readonly PartnerCategoryItem[] = [
  {
    id: 1,
    title: "Lưu trú",
    subtitle: "Khách sạn, resort, villa, homestay...",
    imageUrl: "/partner/stay.jpg",
  },
  {
    id: 2,
    title: "Trải nghiệm & Tour",
    subtitle: "Tour tham quan, trải nghiệm biển đảo, hoạt động thú vị...",
    imageUrl: "/partner/tour.jpg",
  },
  {
    id: 3,
    title: "Di chuyển",
    subtitle: "Taxi, xe đưa đón, thuê xe, tàu cao tốc, du thuyền...",
    imageUrl: "/partner/transport.jpg",
  },
  {
    id: 4,
    title: "Ẩm thực & Café",
    subtitle: "Nhà hàng, quán ăn, café đặc sản địa phương...",
    imageUrl: "/partner/cuisine.jpg",
  },
  {
    id: 5,
    title: "Spa & Wellness",
    subtitle: "Spa, chăm sóc sức khỏe, làm đẹp, trị liệu...",
    imageUrl: "/partner/wellness.jpg",
  },
  {
    id: 6,
    title: "Thương hiệu / Dịch vụ địa phương",
    subtitle: "Sản phẩm đặc trưng, dịch vụ bản địa, nghệ nhân, làng nghề...",
    imageUrl: "/partner/local.jpg",
  },
]

export interface PartnerProcessStep {
  readonly step: string
  readonly title: string
  readonly description: string
  readonly iconName: string
}

export const PARTNER_PROCESS_STEPS: readonly PartnerProcessStep[] = [
  {
    step: "01",
    title: "Gửi thông tin đăng ký",
    description: "Điền đầy đủ thông tin qua form trực tuyến.",
    iconName: "fileedit",
  },
  {
    step: "02",
    title: "STAYEA tư vấn & kết nối",
    description: "Đội ngũ STAYEA liên hệ, tìm hiểu nhu cầu và đề xuất hướng hợp tác phù hợp.",
    iconName: "message",
  },
  {
    step: "03",
    title: "Thống nhất quyền lợi & cách triển khai",
    description: "Trao đổi chi tiết, thống nhất kế hoạch và điều khoản.",
    iconName: "filecheck",
  },
  {
    step: "04",
    title: "Bắt đầu hợp tác & theo dõi hiệu quả",
    description: "Triển khai, đồng hành và cùng đánh giá kết quả định kỳ.",
    iconName: "send",
  },
]

export interface PartnerTransparencyItem {
  readonly id: number
  readonly title: string
  readonly description: string
  readonly iconName: string
}

export const PARTNER_TRANSPARENCY_ITEMS: readonly PartnerTransparencyItem[] = [
  {
    id: 1,
    title: "Điều khoản rõ ràng",
    description: "Hợp tác dựa trên các điều khoản minh bạch, rõ ràng.",
    iconName: "filecheck",
  },
  {
    id: 2,
    title: "Dấu mốc phối hợp cụ thể",
    description: "Có kế hoạch triển khai và đánh giá từng giai đoạn.",
    iconName: "calendar",
  },
  {
    id: 3,
    title: "Quyền lợi minh bạch",
    description: "Rõ ràng về quyền lợi, trách nhiệm và cách thức hợp tác.",
    iconName: "coins",
  },
  {
    id: 4,
    title: "Ưu tiên giá trị win-win",
    description: "Cùng phát triển bền vững, hài hòa lợi ích.",
    iconName: "handshake",
  },
  {
    id: 5,
    title: "Tôn trọng thương hiệu đối tác",
    description: "Luôn đề cao và tôn trọng giá trị, bản sắc riêng.",
    iconName: "star",
  },
  {
    id: 6,
    title: "Tập trung trải nghiệm khách hàng",
    description: "Mọi hợp tác đều hướng đến trải nghiệm tốt nhất cho du khách.",
    iconName: "heart",
  },
]

export interface PartnerFaqItem {
  readonly id: string
  readonly question: string
  readonly answer: string
}

export const PARTNER_FAQS: readonly PartnerFaqItem[] = [
  {
    id: "pfaq-1",
    question: "STAYEA hợp tác với những mô hình nào?",
    answer: "STAYEA hợp tác với đa dạng mô hình bao gồm cơ sở lưu trú, đơn vị tour trải nghiệm biển đảo, nhà xe & vận tải du lịch, nhà hàng đặc sản địa phương, spa & chăm sóc sức khỏe, cũng như các thương hiệu thủ công, nghệ nhân và làng nghề bản địa tại Phú Quốc.",
  },
  {
    id: "pfaq-2",
    question: "Tôi có phải trả phí để đăng ký không?",
    answer: "Hoàn toàn không. Việc đăng ký và tư vấn ban đầu cùng STAYEA là hoàn toàn miễn phí. Chúng tôi sẽ cùng đối tác thảo luận mô hình hợp tác đôi bên cùng có lợi (win-win) dựa trên hiệu quả thực tế.",
  },
  {
    id: "pfaq-3",
    question: "Bao lâu tôi sẽ nhận được phản hồi?",
    answer: "Đội ngũ phát triển đối tác của STAYEA cam kết liên hệ lại trong vòng 24 - 48 giờ làm việc sau khi nhận được thông tin đăng ký của bạn.",
  },
  {
    id: "pfaq-4",
    question: "Có thể hợp tác theo từng chiến dịch không?",
    answer: "Có. Ngoài hợp tác chiến lược lâu dài, STAYEA luôn chào đón các hình thức hợp tác theo mùa du lịch, sự kiện văn hóa, hoặc chiến dịch quảng bá điểm đến theo giai đoạn cụ thể.",
  },
]

/* ========================================================================= */
/* STAY / VILLA / ACCOMMODATION LISTING MOCK DATA                            */
/* ========================================================================= */

export interface StayAmenity {
  readonly icon: string
  readonly label: string
}

export interface StayListingBadge {
  readonly text: string
  readonly variant: "select" | "verified" | "bestseller" | "longstay" | "bestprice" | "family"
}

export interface StayAccommodationItem {
  readonly id: string
  readonly title: string
  readonly type: "Villa" | "Khách sạn" | "Homestay" | "Căn hộ" | "Resort" | "Lưu trú dài hạn"
  readonly location: string
  readonly rating: number
  readonly reviewsCount: number
  readonly pricePerNight: number
  readonly formattedPrice: string
  readonly imageUrl: string
  readonly badge?: StayListingBadge
  readonly amenities: readonly StayAmenity[]
  readonly categoryId: string
  readonly area: string
}

export interface StayCategoryTab {
  readonly id: string
  readonly label: string
  readonly iconName: "all" | "villa" | "building" | "home" | "hotel" | "calendar" | "verified" | "select"
}

export const STAY_CATEGORY_TABS: readonly StayCategoryTab[] = [
  { id: "all", label: "Tất cả", iconName: "all" },
  { id: "villas", label: "Villas", iconName: "villa" },
  { id: "apartments", label: "Căn hộ", iconName: "building" },
  { id: "homestays", label: "Homestay", iconName: "home" },
  { id: "hotels", label: "Khách sạn", iconName: "hotel" },
  { id: "long-stay", label: "Lưu trú dài hạn", iconName: "calendar" },
  { id: "verified", label: "Stayea Verified", iconName: "verified" },
  { id: "select", label: "Stayea Select", iconName: "select" },
]

export const STAY_ACCOMMODATION_LISTINGS: readonly StayAccommodationItem[] = [
  {
    id: "ocean-bliss-villa",
    title: "Ocean Bliss Villa",
    type: "Villa",
    location: "Bãi Khem, Phú Quốc",
    rating: 4.9,
    reviewsCount: 128,
    pricePerNight: 4_500_000,
    formattedPrice: "4.500.000 đ",
    imageUrl: "/stay/ocean-bliss-villa.jpg",
    badge: { text: "Stayea Select", variant: "select" },
    categoryId: "villas",
    area: "Bãi Khem",
    amenities: [
      { icon: "pool", label: "Hồ bơi riêng" },
      { icon: "beach", label: "Gần biển" },
      { icon: "kitchen", label: "Bếp riêng" },
    ],
  },
  {
    id: "the-shell-resort",
    title: "The Shell Resort & Spa",
    type: "Khách sạn",
    location: "Bãi Trường, Phú Quốc",
    rating: 4.8,
    reviewsCount: 96,
    pricePerNight: 3_200_000,
    formattedPrice: "3.200.000 đ",
    imageUrl: "/stay/the-shell-resort.jpg",
    badge: { text: "Stayea Verified", variant: "verified" },
    categoryId: "hotels",
    area: "Bãi Trường",
    amenities: [
      { icon: "beach", label: "Gần biển" },
      { icon: "spa", label: "Spa" },
      { icon: "restaurant", label: "Nhà hàng" },
    ],
  },
  {
    id: "mango-bay-homestay",
    title: "Mango Bay Homestay",
    type: "Homestay",
    location: "Cửa Dương, Phú Quốc",
    rating: 4.7,
    reviewsCount: 86,
    pricePerNight: 850_000,
    formattedPrice: "850.000 đ",
    imageUrl: "/stay/mango-bay.jpg",
    badge: { text: "Bán chạy nhất", variant: "bestseller" },
    categoryId: "homestays",
    area: "Dương Đông",
    amenities: [
      { icon: "beach", label: "Gần biển" },
      { icon: "green", label: "Không gian xanh" },
      { icon: "kitchen", label: "Bếp chung" },
    ],
  },
  {
    id: "sunset-apartments",
    title: "Sunset Apartments",
    type: "Căn hộ",
    location: "Dương Đông, Phú Quốc",
    rating: 4.8,
    reviewsCount: 74,
    pricePerNight: 1_200_000,
    formattedPrice: "1.200.000 đ",
    imageUrl: "/stay/sunset-apartments.jpg",
    badge: { text: "Lưu trú dài hạn", variant: "longstay" },
    categoryId: "apartments",
    area: "Dương Đông",
    amenities: [
      { icon: "furniture", label: "Full nội thất" },
      { icon: "kitchen", label: "Bếp riêng" },
      { icon: "work", label: "Phù hợp workation" },
    ],
  },
  {
    id: "salinda-resort-phu-quoc",
    title: "Salinda Resort Phu Quoc",
    type: "Khách sạn",
    location: "Dương Tơ, Phú Quốc",
    rating: 4.9,
    reviewsCount: 112,
    pricePerNight: 3_800_000,
    formattedPrice: "3.800.000 đ",
    imageUrl: "/stay/salinda-resort.jpg",
    categoryId: "hotels",
    area: "Bãi Trường",
    amenities: [
      { icon: "pool", label: "Hồ bơi" },
      { icon: "spa", label: "Spa" },
      { icon: "restaurant", label: "Nhà hàng" },
    ],
  },
  {
    id: "the-leaf-villa",
    title: "The Leaf Villa",
    type: "Villa",
    location: "Ông Lang, Phú Quốc",
    rating: 4.7,
    reviewsCount: 68,
    pricePerNight: 3_000_000,
    formattedPrice: "3.000.000 đ",
    imageUrl: "/stay/the-leaf-villa.jpg",
    badge: { text: "Stayea Verified", variant: "verified" },
    categoryId: "villas",
    area: "Bãi Ông Lang",
    amenities: [
      { icon: "pool", label: "Hồ bơi riêng" },
      { icon: "kitchen", label: "Bếp riêng" },
      { icon: "garden", label: "Sân vườn" },
    ],
  },
  {
    id: "seashell-boutique-hotel",
    title: "Seashell Boutique Hotel",
    type: "Khách sạn",
    location: "Dương Đông, Phú Quốc",
    rating: 4.6,
    reviewsCount: 52,
    pricePerNight: 1_600_000,
    formattedPrice: "1.600.000 đ",
    imageUrl: "/stay/seashell-boutique.jpg",
    categoryId: "hotels",
    area: "Dương Đông",
    amenities: [
      { icon: "beach", label: "Gần biển" },
      { icon: "design", label: "Thiết kế boutique" },
      { icon: "breakfast", label: "Bữa sáng" },
    ],
  },
  {
    id: "lahana-beachfront-villa",
    title: "Lahana Beachfront Villa",
    type: "Villa",
    location: "Gành Dầu, Phú Quốc",
    rating: 4.8,
    reviewsCount: 91,
    pricePerNight: 5_200_000,
    formattedPrice: "5.200.000 đ",
    imageUrl: "/stay/lahana-villa.jpg",
    badge: { text: "Stayea Select", variant: "select" },
    categoryId: "villas",
    area: "Gành Dầu",
    amenities: [
      { icon: "beach", label: "Sát biển" },
      { icon: "pool", label: "Hồ bơi riêng" },
      { icon: "private", label: "Không gian riêng" },
    ],
  },
  {
    id: "tropical-garden-homestay",
    title: "Tropical Garden Homestay",
    type: "Homestay",
    location: "Cửa Dương, Phú Quốc",
    rating: 4.6,
    reviewsCount: 48,
    pricePerNight: 650_000,
    formattedPrice: "650.000 đ",
    imageUrl: "/stay/tropical-garden.jpg",
    badge: { text: "Giá tốt nhất", variant: "bestprice" },
    categoryId: "homestays",
    area: "Dương Đông",
    amenities: [
      { icon: "garden", label: "Sân vườn" },
      { icon: "kitchen", label: "Bếp chung" },
      { icon: "friendly", label: "Thân thiện" },
    ],
  },
  {
    id: "marina-apartment",
    title: "Marina Apartment",
    type: "Căn hộ",
    location: "An Thới, Phú Quốc",
    rating: 4.7,
    reviewsCount: 63,
    pricePerNight: 1_800_000,
    formattedPrice: "1.800.000 đ",
    imageUrl: "/stay/marina-apartment.jpg",
    categoryId: "apartments",
    area: "An Thới",
    amenities: [
      { icon: "beach", label: "View biển" },
      { icon: "pool", label: "Hồ bơi chung" },
      { icon: "kitchen", label: "Bếp riêng" },
    ],
  },
  {
    id: "famiana-resort-villas",
    title: "Famiana Resort & Villas",
    type: "Resort",
    location: "Bãi Trường, Phú Quốc",
    rating: 4.8,
    reviewsCount: 77,
    pricePerNight: 2_900_000,
    formattedPrice: "2.900.000 đ",
    imageUrl: "/stay/famiana-resort.jpg",
    badge: { text: "Phù hợp gia đình", variant: "family" },
    categoryId: "hotels",
    area: "Bãi Trường",
    amenities: [
      { icon: "pool", label: "Hồ bơi" },
      { icon: "baby", label: "Trẻ em" },
      { icon: "restaurant", label: "Nhà hàng" },
    ],
  },
  {
    id: "sunset-hill-retreat",
    title: "Sunset Hill Retreat",
    type: "Lưu trú dài hạn",
    location: "Dương Đông, Phú Quốc",
    rating: 4.6,
    reviewsCount: 58,
    pricePerNight: 1_400_000,
    formattedPrice: "1.400.000 đ",
    imageUrl: "/stay/sunset-hill.jpg",
    categoryId: "long-stay",
    area: "Dương Đông",
    amenities: [
      { icon: "peace", label: "Yên tĩnh" },
      { icon: "work", label: "Làm việc từ xa" },
      { icon: "sunset", label: "View đồi biển" },
    ],
  },
]

export interface StayFilterOptions {
  readonly priceRange: [number, number]
  readonly accommodationTypes: readonly { readonly id: string; readonly label: string; readonly count: number }[]
  readonly locations: readonly { readonly id: string; readonly label: string; readonly count: number }[]
  readonly amenities: readonly { readonly id: string; readonly label: string; readonly count: number }[]
  readonly suitability: readonly { readonly id: string; readonly label: string; readonly count: number }[]
  readonly sortOptions: readonly { readonly id: string; readonly label: string }[]
}

export const STAY_FILTER_OPTIONS: StayFilterOptions = {
  priceRange: [0, 20_000_000],
  accommodationTypes: [
    { id: "villas", label: "Villas", count: 124 },
    { id: "apartments", label: "Căn hộ", count: 98 },
    { id: "homestays", label: "Homestay", count: 64 },
    { id: "hotels", label: "Khách sạn", count: 86 },
    { id: "long-stay", label: "Lưu trú dài hạn", count: 52 },
  ],
  locations: [
    { id: "duong-dong", label: "Dương Đông", count: 98 },
    { id: "bai-truong", label: "Bãi Trường", count: 76 },
    { id: "bai-ong-lang", label: "Bãi Ông Lang", count: 62 },
    { id: "bai-khem", label: "Bãi Khem", count: 40 },
    { id: "ganh-dau", label: "Gành Dầu", count: 28 },
    { id: "an-thoi", label: "An Thới", count: 36 },
    { id: "khac", label: "Khác", count: 24 },
  ],
  amenities: [
    { id: "pool", label: "Hồ bơi", count: 210 },
    { id: "beach", label: "Gần biển", count: 162 },
    { id: "kitchen", label: "Bếp riêng", count: 128 },
    { id: "wifi", label: "Wi-Fi tốc độ cao", count: 220 },
    { id: "parking", label: "Bãi đỗ xe", count: 156 },
    { id: "pets", label: "Cho phép thú cưng", count: 32 },
  ],
  suitability: [
    { id: "family", label: "Gia đình", count: 142 },
    { id: "couples", label: "Cặp đôi", count: 168 },
    { id: "friends", label: "Nhóm bạn", count: 120 },
    { id: "workation", label: "Workation", count: 66 },
    { id: "kids", label: "Trẻ em", count: 98 },
  ],
  sortOptions: [
    { id: "popular", label: "Phổ biến nhất" },
    { id: "price-asc", label: "Giá thấp đến cao" },
    { id: "price-desc", label: "Giá cao đến thấp" },
    { id: "rating", label: "Đánh giá cao nhất" },
    { id: "newest", label: "Mới nhất" },
  ],
}

/* ========================================================================= */
/* EXPERIENCE LISTING SCREEN MOCK DATA                                      */
/* ========================================================================= */

export interface ExperienceCategorySidebarItem {
  readonly id: string
  readonly label: string
  readonly count: number
  readonly iconName: string
}

export interface ExperienceListingItem {
  readonly id: string
  readonly title: string
  readonly tag: string
  readonly categoryId: string
  readonly rating: number
  readonly reviewsCount: string
  readonly description: string
  readonly duration: string
  readonly highlight: string
  readonly highlightIcon: string
  readonly price: number
  readonly formattedPrice: string
  readonly imageUrl: string
}

export interface ExperienceHeroBadgeItem {
  readonly id: string
  readonly title: string
  readonly subtitle?: string
  readonly iconName: string
}

export const EXPERIENCE_HERO_BADGES: readonly ExperienceHeroBadgeItem[] = [
  {
    id: "badge-1",
    title: "Trải nghiệm",
    subtitle: "chân thực",
    iconName: "leaf",
  },
  {
    id: "badge-2",
    title: "Đặt dễ dàng",
    subtitle: "An toàn",
    iconName: "shield",
  },
  {
    id: "badge-3",
    title: "Hướng dẫn viên",
    subtitle: "chuyên nghiệp",
    iconName: "guide",
  },
  {
    id: "badge-4",
    title: "Trải nghiệm",
    subtitle: "đáng nhớ",
    iconName: "heart",
  },
  {
    id: "badge-5",
    title: "Hỗ trợ 24/7",
    subtitle: "trước, trong và sau chuyến đi",
    iconName: "headset",
  },
]

export const EXPERIENCE_SIDEBAR_CATEGORIES: readonly ExperienceCategorySidebarItem[] = [
  { id: "all", label: "Tất cả trải nghiệm", count: 120, iconName: "all" },
  { id: "tours", label: "Tours", count: 28, iconName: "tours" },
  { id: "island-trips", label: "Khám phá đảo", count: 18, iconName: "island-trips" },
  { id: "snorkeling", label: "Snorkeling", count: 16, iconName: "snorkeling" },
  { id: "diving", label: "Diving", count: 12, iconName: "diving" },
  { id: "cruises", label: "Du thuyền", count: 10, iconName: "cruises" },
  { id: "food", label: "Ẩm thực", count: 14, iconName: "food" },
  { id: "spa", label: "Spa & Wellness", count: 8, iconName: "spa" },
  { id: "activities", label: "Hoạt động vui chơi", count: 20, iconName: "activities" },
]

export const EXPERIENCE_LISTINGS: readonly ExperienceListingItem[] = [
  {
    id: "tour-3-dao",
    title: "Tour 3 đảo Phú Quốc",
    tag: "Tours",
    categoryId: "tours",
    rating: 4.9,
    reviewsCount: "1.2k đánh giá",
    description: "Khám phá Hòn Móng Tay, Hòn Gầm Ghì, Hòn Mây Rút với làn nước trong xanh.",
    duration: "1 ngày",
    highlight: "Đón tại khách sạn",
    highlightIcon: "car",
    price: 850_000,
    formattedPrice: "850.000đ/khách",
    imageUrl: "/experience/tour-3-dao.jpg",
  },
  {
    id: "lan-ngam-san-ho",
    title: "Lặn ngắm san hô Nam Đảo",
    tag: "Snorkeling",
    categoryId: "snorkeling",
    rating: 4.8,
    reviewsCount: "856 đánh giá",
    description: "Chiêm ngưỡng thế giới đại dương rực rỡ cùng hướng dẫn viên chuyên nghiệp.",
    duration: "Nửa ngày",
    highlight: "Bao gồm thiết bị",
    highlightIcon: "package",
    price: 690_000,
    formattedPrice: "690.000đ/khách",
    imageUrl: "/experience/snorkeling-nam-dao.jpg",
  },
  {
    id: "sunset-cruise",
    title: "Sunset Cruise ngắm hoàng hôn",
    tag: "Du thuyền",
    categoryId: "cruises",
    rating: 4.9,
    reviewsCount: "732 đánh giá",
    description: "Thư giãn trên du thuyền sang trọng, ngắm hoàng hôn tuyệt đẹp tại Phú Quốc.",
    duration: "3 giờ",
    highlight: "Đồ uống & nhẹ",
    highlightIcon: "cocktail",
    price: 1_290_000,
    formattedPrice: "1.290.000đ/khách",
    imageUrl: "/experience/sunset-cruise.jpg",
  },
  {
    id: "tour-am-thuc",
    title: "Tour ẩm thực Phú Quốc",
    tag: "Ẩm thực",
    categoryId: "food",
    rating: 4.8,
    reviewsCount: "640 đánh giá",
    description: "Khám phá tinh hoa ẩm thực đảo ngọc cùng local guide.",
    duration: "Nửa ngày",
    highlight: "Nhiều điểm dừng",
    highlightIcon: "map-pin",
    price: 790_000,
    formattedPrice: "790.000đ/khách",
    imageUrl: "/experience/tour-am-thuc.jpg",
  },
  {
    id: "scuba-diving",
    title: "Lặn biển chuyên sâu (Scuba Diving)",
    tag: "Diving",
    categoryId: "diving",
    rating: 4.9,
    reviewsCount: "521 đánh giá",
    description: "Trải nghiệm lặn biển chuyên nghiệp với huấn luyện viên quốc tế (PADI).",
    duration: "Nửa ngày",
    highlight: "Thiết bị cao cấp",
    highlightIcon: "diving",
    price: 1_690_000,
    formattedPrice: "1.690.000đ/khách",
    imageUrl: "/experience/scuba-diving.jpg",
  },
  {
    id: "kayak-rach-vem",
    title: "Kayak khám phá làng chài Rạch Vẹm",
    tag: "Hoạt động vui chơi",
    categoryId: "activities",
    rating: 4.7,
    reviewsCount: "412 đánh giá",
    description: "Chèo kayak qua rừng ngập mặn, khám phá làng chài bình yên.",
    duration: "Nửa ngày",
    highlight: "Hướng dẫn viên",
    highlightIcon: "user",
    price: 550_000,
    formattedPrice: "550.000đ/khách",
    imageUrl: "/experience/kayak-rach-vem.jpg",
  },
  {
    id: "cham-soc-suc-khoe-spa",
    title: "Chăm sóc sức khoẻ & Spa",
    tag: "Spa & Wellness",
    categoryId: "spa",
    rating: 4.8,
    reviewsCount: "389 đánh giá",
    description: "Thư giãn với liệu trình spa cao cấp lấy cảm hứng từ thiên nhiên đảo ngọc.",
    duration: "1-2 giờ",
    highlight: "Đón tại resort",
    highlightIcon: "hotel",
    price: 690_000,
    formattedPrice: "690.000đ/khách",
    imageUrl: "/experience/spa-wellness.jpg",
  },
  {
    id: "tour-nam-dao-cap-treo",
    title: "Tour Nam Đảo & Cáp treo Hòn Thơm",
    tag: "Khám phá đảo",
    categoryId: "island-trips",
    rating: 4.9,
    reviewsCount: "980 đánh giá",
    description: "Khám phá Nam đảo, check-in Cầu Hôn và trải nghiệm cáp treo 3 dây dài nhất thế giới.",
    duration: "1 ngày",
    highlight: "Xe đưa đón",
    highlightIcon: "bus",
    price: 1_250_000,
    formattedPrice: "1.250.000đ/khách",
    imageUrl: "/experience/hon-thom-cable-car.jpg",
  },
  {
    id: "cau-muc-dem",
    title: "Câu mực đêm & Ngắm hoàng hôn",
    tag: "Tours",
    categoryId: "tours",
    rating: 4.7,
    reviewsCount: "310 đánh giá",
    description: "Trải nghiệm lênh đênh câu mực đêm cùng ngư dân và thưởng thức hải sản tươi rói.",
    duration: "Nửa ngày",
    highlight: "Bữa tối hải sản",
    highlightIcon: "cocktail",
    price: 450_000,
    formattedPrice: "450.000đ/khách",
    imageUrl: "/experience/night-squid.jpg",
  },
  {
    id: "trekking-vuon-quoc-gia",
    title: "Trekking Vườn Quốc Gia Phú Quốc",
    tag: "Hoạt động vui chơi",
    categoryId: "activities",
    rating: 4.8,
    reviewsCount: "215 đánh giá",
    description: "Băng rừng nguyên sinh, tắm suối Tranh và tìm hiểu hệ sinh thái đảo ngọc.",
    duration: "1 ngày",
    highlight: "Local Ranger dẫn đường",
    highlightIcon: "user",
    price: 650_000,
    formattedPrice: "650.000đ/khách",
    imageUrl: "/experience/trekking.jpg",
  },
  {
    id: "cooking-class",
    title: "Lớp học nấu ăn đặc sản Phú Quốc",
    tag: "Ẩm thực",
    categoryId: "food",
    rating: 4.9,
    reviewsCount: "174 đánh giá",
    description: "Tự tay chọn nguyên liệu tại chợ và chế biến các món đặc sản Phú Quốc chuẩn vị.",
    duration: "3 giờ",
    highlight: "Tặng công thức",
    highlightIcon: "package",
    price: 580_000,
    formattedPrice: "580.000đ/khách",
    imageUrl: "/experience/cooking-class.jpg",
  },
  {
    id: "cano-4-dao-flycam",
    title: "Tour cano 4 đảo & Flycam quay chụp",
    tag: "Khám phá đảo",
    categoryId: "island-trips",
    rating: 4.9,
    reviewsCount: "680 đánh giá",
    description: "Trọn gói cano siêu tốc tham quan 4 đảo ngọc kèm bộ ảnh và video flycam chuyên nghiệp.",
    duration: "1 ngày",
    highlight: "Tặng video flycam",
    highlightIcon: "diving",
    price: 1_150_000,
    formattedPrice: "1.150.000đ/khách",
    imageUrl: "/experience/cano-4-islands.jpg",
  },
]


export interface PackageHeroBadgeItem {
  readonly id: string
  readonly title: string
  readonly subtitle?: string
  readonly iconName: string
}

export interface PackageAudienceTabItem {
  readonly id: string
  readonly label: string
  readonly icon: string
  readonly count?: number
}

export interface PackageListingItem {
  readonly id: string
  readonly title: string
  readonly tag: string
  readonly tagColor: "amber" | "blue" | "cyan" | "emerald" | "indigo" | "rose" | "sky" | "slate"
  readonly audienceId: "all" | "couple" | "family" | "friends" | "long-stay" | "workation"
  readonly category: string
  readonly duration: string
  readonly highlight: string
  readonly highlightIcon: "activity" | "building" | "car" | "coffee" | "fish" | "food" | "shield" | "spa" | "user" | "utensils"
  readonly rating: number
  readonly reviewsCount: string
  readonly price: number
  readonly formattedPrice: string
  readonly imageUrl: string
}

export const PACKAGE_HERO_BADGES: readonly PackageHeroBadgeItem[] = [
  {
    id: "pbadge-1",
    title: "Lịch trình tối ưu",
    iconName: "calendar",
  },
  {
    id: "pbadge-2",
    title: "Giá tốt, minh bạch",
    iconName: "tag",
  },
  {
    id: "pbadge-3",
    title: "Hỗ trợ 24/7",
    iconName: "headset",
  },
  {
    id: "pbadge-4",
    title: "Trải nghiệm khác biệt",
    iconName: "sparkles",
  },
  {
    id: "pbadge-5",
    title: "Đánh giá thực tế",
    iconName: "check",
  },
]

export const PACKAGE_AUDIENCE_TABS: readonly PackageAudienceTabItem[] = [
  { id: "all", label: "Tất cả gói", icon: "grid", count: 24 },
  { id: "couple", label: "Couple", icon: "heart" },
  { id: "family", label: "Family", icon: "family" },
  { id: "friends", label: "Friends", icon: "friends" },
  { id: "long-stay", label: "Long Stay", icon: "luggage" },
  { id: "workation", label: "Workation", icon: "laptop" },
]

export const PACKAGE_FILTER_DURATIONS: readonly string[] = [
  "Tất cả thời gian",
  "Nửa ngày",
  "1 ngày",
  "2 ngày trở lên",
]

export const PACKAGE_FILTER_PRICES: readonly string[] = [
  "Tất cả mức giá",
  "Dưới 700.000đ",
  "700.000đ - 1.200.000đ",
  "Trên 1.200.000đ",
]

export const PACKAGE_FILTER_TYPES: readonly string[] = [
  "Tất cả loại trải nghiệm",
  "Khám phá đảo",
  "Lặn ngắm san hô",
  "Du thuyền hoàng hôn",
  "Ẩm thực địa phương",
  "Spa & Chăm sóc",
  "Hoạt động & Vui chơi",
]

export const PACKAGE_FILTER_SUITABILITIES: readonly string[] = [
  "Tất cả phù hợp",
  "Cặp đôi",
  "Gia đình",
  "Nhóm bạn",
  "Cá nhân",
]

export const PACKAGE_SORT_OPTIONS: readonly string[] = [
  "Phổ biến nhất",
  "Giá: Thấp đến cao",
  "Giá: Cao đến thấp",
  "Đánh giá cao nhất",
]

export const PACKAGE_LISTINGS: readonly PackageListingItem[] = [
  {
    id: "tour-3-dao-phu-quoc",
    title: "Tour 3 Đảo Phú Quốc",
    tag: "Bán chạy",
    tagColor: "emerald",
    audienceId: "all",
    category: "Khám phá đảo",
    duration: "1 ngày",
    highlight: "Đón tại khách sạn",
    highlightIcon: "building",
    rating: 4.9,
    reviewsCount: "1.2k đánh giá",
    price: 850_000,
    formattedPrice: "850.000đ/khách",
    imageUrl: "/packages/tour-3-dao.jpg",
  },
  {
    id: "lan-ngam-san-ho-nam-dao",
    title: "Lặn ngắm san hô Nam Đảo",
    tag: "Hot",
    tagColor: "rose",
    audienceId: "friends",
    category: "Lặn ngắm san hô",
    duration: "1 ngày",
    highlight: "Thiết bị cao cấp",
    highlightIcon: "shield",
    rating: 4.8,
    reviewsCount: "856 đánh giá",
    price: 690_000,
    formattedPrice: "690.000đ/khách",
    imageUrl: "/packages/lan-ngam-san-ho.jpg",
  },
  {
    id: "sunset-cruise-ngam-hoang-hon",
    title: "Sunset Cruise ngắm hoàng hôn",
    tag: "Được yêu thích",
    tagColor: "blue",
    audienceId: "couple",
    category: "Du thuyền hoàng hôn",
    duration: "3 giờ",
    highlight: "Đồ uống & nhẹ",
    highlightIcon: "coffee",
    rating: 4.9,
    reviewsCount: "732 đánh giá",
    price: 1_290_000,
    formattedPrice: "1.290.000đ/khách",
    imageUrl: "/experience/sunset-cruise.jpg",
  },
  {
    id: "tour-nam-dao-cap-treo-hon-thom",
    title: "Tour Nam Đảo & Cáp treo Hòn Thơm",
    tag: "Mới",
    tagColor: "cyan",
    audienceId: "family",
    category: "Khám phá đảo",
    duration: "1 ngày",
    highlight: "Xe đưa đón",
    highlightIcon: "car",
    rating: 4.9,
    reviewsCount: "980 đánh giá",
    price: 1_250_000,
    formattedPrice: "1.250.000đ/khách",
    imageUrl: "/packages/hon-thom-cap-treo.jpg",
  },
  {
    id: "kayak-kham-pha-lang-chai-rach-vem",
    title: "Kayak khám phá làng chài Rạch Vẹm",
    tag: "Gia đình",
    tagColor: "sky",
    audienceId: "family",
    category: "Hoạt động & Vui chơi",
    duration: "1/2 ngày",
    highlight: "Hướng dẫn viên",
    highlightIcon: "user",
    rating: 4.7,
    reviewsCount: "412 đánh giá",
    price: 550_000,
    formattedPrice: "550.000đ/khách",
    imageUrl: "/packages/kayak-rach-vem.jpg",
  },
  {
    id: "tour-am-thuc-phu-quoc",
    title: "Tour ẩm thực Phú Quốc",
    tag: "Đặc sắc",
    tagColor: "amber",
    audienceId: "friends",
    category: "Ẩm thực địa phương",
    duration: "1 ngày",
    highlight: "Guide ẩm thực",
    highlightIcon: "utensils",
    rating: 4.8,
    reviewsCount: "640 đánh giá",
    price: 790_000,
    formattedPrice: "790.000đ/khách",
    imageUrl: "/packages/tour-am-thuc.jpg",
  },
  {
    id: "cham-soc-suc-khoe-spa",
    title: "Chăm sóc sức khoẻ & Spa",
    tag: "Thư giãn",
    tagColor: "slate",
    audienceId: "couple",
    category: "Spa & Chăm sóc",
    duration: "1-2 giờ",
    highlight: "Tại resort",
    highlightIcon: "spa",
    rating: 4.8,
    reviewsCount: "389 đánh giá",
    price: 690_000,
    formattedPrice: "690.000đ/khách",
    imageUrl: "/packages/spa-wellness.jpg",
  },
  {
    id: "city-tour-phu-quoc-ve-dem",
    title: "City Tour Phú Quốc về đêm",
    tag: "Văn hóa",
    tagColor: "indigo",
    audienceId: "family",
    category: "Hoạt động & Vui chơi",
    duration: "1/2 ngày",
    highlight: "Xe đưa đón",
    highlightIcon: "car",
    rating: 4.7,
    reviewsCount: "320 đánh giá",
    price: 490_000,
    formattedPrice: "490.000đ/khách",
    imageUrl: "/packages/city-tour-dem.jpg",
  },
  {
    id: "cau-ca-bien-phu-quoc",
    title: "Câu cá biển Phú Quốc",
    tag: "Trải nghiệm",
    tagColor: "slate",
    audienceId: "friends",
    category: "Hoạt động & Vui chơi",
    duration: "1/2 ngày",
    highlight: "Dụng cụ câu",
    highlightIcon: "fish",
    rating: 4.6,
    reviewsCount: "278 đánh giá",
    price: 750_000,
    formattedPrice: "750.000đ/khách",
    imageUrl: "/packages/cau-ca-bien.jpg",
  },
  {
    id: "kham-pha-4-dao-phia-nam",
    title: "Khám phá 4 đảo phía Nam",
    tag: "Thiên nhiên",
    tagColor: "cyan",
    audienceId: "friends",
    category: "Khám phá đảo",
    duration: "1 ngày",
    highlight: "Ăn trưa BBQ",
    highlightIcon: "food",
    rating: 4.9,
    reviewsCount: "512 đánh giá",
    price: 1_450_000,
    formattedPrice: "1.450.000đ/khách",
    imageUrl: "/packages/kham-pha-4-dao.jpg",
  },
  {
    id: "family-fun-vui-choi-ca-gia-dinh",
    title: "Family Fun - Vui chơi cả gia đình",
    tag: "Gia đình",
    tagColor: "blue",
    audienceId: "family",
    category: "Hoạt động & Vui chơi",
    duration: "1 ngày",
    highlight: "Nhiều hoạt động",
    highlightIcon: "activity",
    rating: 4.8,
    reviewsCount: "410 đánh giá",
    price: 990_000,
    formattedPrice: "990.000đ/khách",
    imageUrl: "/packages/family-fun.jpg",
  },
  {
    id: "tour-dao-hoang-picnic-rieng-tu",
    title: "Tour đảo hoang & Picnic riêng tư",
    tag: "Cao cấp",
    tagColor: "slate",
    audienceId: "couple",
    category: "Khám phá đảo",
    duration: "1 ngày",
    highlight: "BBQ trên đảo",
    highlightIcon: "food",
    rating: 4.9,
    reviewsCount: "230 đánh giá",
    price: 2_490_000,
    formattedPrice: "2.490.000đ/khách",
    imageUrl: "/packages/tour-dao-hoang.jpg",
  },
  {
    id: "tour-cano-4-dao-flycam",
    title: "Tour cano 4 đảo & Flycam quay chụp",
    tag: "Bán chạy",
    tagColor: "emerald",
    audienceId: "friends",
    category: "Khám phá đảo",
    duration: "1 ngày",
    highlight: "Tặng video flycam",
    highlightIcon: "activity",
    rating: 4.9,
    reviewsCount: "680 đánh giá",
    price: 1_150_000,
    formattedPrice: "1.150.000đ/khách",
    imageUrl: "/experience/cano-4-islands.jpg",
  },
  {
    id: "lop-hoc-nau-an-dac-san",
    title: "Lớp học nấu ăn đặc sản Phú Quốc",
    tag: "Đặc sắc",
    tagColor: "amber",
    audienceId: "couple",
    category: "Ẩm thực địa phương",
    duration: "3 giờ",
    highlight: "Tặng công thức",
    highlightIcon: "utensils",
    rating: 4.9,
    reviewsCount: "174 đánh giá",
    price: 580_000,
    formattedPrice: "580.000đ/khách",
    imageUrl: "/experience/cooking-class.jpg",
  },
  {
    id: "trekking-vuon-quoc-gia-phu-quoc",
    title: "Trekking Vườn Quốc Gia Phú Quốc",
    tag: "Thiên nhiên",
    tagColor: "cyan",
    audienceId: "friends",
    category: "Hoạt động & Vui chơi",
    duration: "1 ngày",
    highlight: "Local Ranger dẫn đường",
    highlightIcon: "user",
    rating: 4.8,
    reviewsCount: "215 đánh giá",
    price: 650_000,
    formattedPrice: "650.000đ/khách",
    imageUrl: "/experience/trekking.jpg",
  },
  {
    id: "cau-muc-dem-ngam-hoang-hon",
    title: "Câu mực đêm & Ngắm hoàng hôn",
    tag: "Trải nghiệm",
    tagColor: "slate",
    audienceId: "friends",
    category: "Hoạt động & Vui chơi",
    duration: "Nửa ngày",
    highlight: "Bữa tối hải sản",
    highlightIcon: "food",
    rating: 4.7,
    reviewsCount: "310 đánh giá",
    price: 450_000,
    formattedPrice: "450.000đ/khách",
    imageUrl: "/experience/night-squid.jpg",
  },
  {
    id: "lan-scuba-diving-chuyen-sau",
    title: "Lặn Scuba Diving chuyên sâu",
    tag: "Hot",
    tagColor: "rose",
    audienceId: "friends",
    category: "Lặn ngắm san hô",
    duration: "Nửa ngày",
    highlight: "Chứng chỉ PADI",
    highlightIcon: "shield",
    rating: 4.9,
    reviewsCount: "521 đánh giá",
    price: 1_690_000,
    formattedPrice: "1.690.000đ/khách",
    imageUrl: "/experience/scuba-diving.jpg",
  },
  {
    id: "goi-nghi-duong-long-stay",
    title: "Gói nghỉ dưỡng dài ngày Long Stay 7N6Đ",
    tag: "Cao cấp",
    tagColor: "slate",
    audienceId: "long-stay",
    category: "Khám phá đảo",
    duration: "7 ngày",
    highlight: "Villa riêng biệt",
    highlightIcon: "building",
    rating: 5,
    reviewsCount: "142 đánh giá",
    price: 8_500_000,
    formattedPrice: "8.500.000đ/khách",
    imageUrl: "/stay/ocean-bliss-villa.jpg",
  },
  {
    id: "goi-workation-thien-duong",
    title: "Gói Workation thiên đường nhiệt đới",
    tag: "Mới",
    tagColor: "cyan",
    audienceId: "workation",
    category: "Hoạt động & Vui chơi",
    duration: "5 ngày",
    highlight: "High-speed WiFi",
    highlightIcon: "activity",
    rating: 4.9,
    reviewsCount: "98 đánh giá",
    price: 4_200_000,
    formattedPrice: "4.200.000đ/khách",
    imageUrl: "/stay/sunset-apartments.jpg",
  },
  {
    id: "ky-nghi-lang-man-cap-doi",
    title: "Kỳ nghỉ lãng mạn cho Cặp đôi",
    tag: "Được yêu thích",
    tagColor: "blue",
    audienceId: "couple",
    category: "Khám phá đảo",
    duration: "3 ngày",
    highlight: "Bữa tối nến bờ biển",
    highlightIcon: "utensils",
    rating: 4.9,
    reviewsCount: "320 đánh giá",
    price: 3_900_000,
    formattedPrice: "3.900.000đ/khách",
    imageUrl: "/stay/the-leaf-villa.jpg",
  },
  {
    id: "ky-nghi-ket-noi-dai-gia-dinh",
    title: "Kỳ nghỉ kết nối Đại gia đình",
    tag: "Gia đình",
    tagColor: "blue",
    audienceId: "family",
    category: "Khám phá đảo",
    duration: "4 ngày",
    highlight: "Villa 4 phòng ngủ",
    highlightIcon: "building",
    rating: 4.8,
    reviewsCount: "210 đánh giá",
    price: 6_800_000,
    formattedPrice: "6.800.000đ/khách",
    imageUrl: "/stay/lahana-villa.jpg",
  },
  {
    id: "hanh-trinh-kham-pha-lang-nghe",
    title: "Hành trình khám phá làng nghề & Rượu sim",
    tag: "Văn hóa",
    tagColor: "indigo",
    audienceId: "family",
    category: "Hoạt động & Vui chơi",
    duration: "1/2 ngày",
    highlight: "Nếm thử đặc sản",
    highlightIcon: "food",
    rating: 4.7,
    reviewsCount: "195 đánh giá",
    price: 380_000,
    formattedPrice: "380.000đ/khách",
    imageUrl: "/experience/tour-am-thuc.jpg",
  },
  {
    id: "combo-nghi-duong-salinda-spa",
    title: "Combo Nghỉ dưỡng Salinda & Spa trị liệu",
    tag: "Thư giãn",
    tagColor: "slate",
    audienceId: "couple",
    category: "Spa & Chăm sóc",
    duration: "2 ngày",
    highlight: "Gói trị liệu 90p",
    highlightIcon: "spa",
    rating: 4.9,
    reviewsCount: "260 đánh giá",
    price: 2_890_000,
    formattedPrice: "2.890.000đ/khách",
    imageUrl: "/stay/salinda-resort.jpg",
  },
  {
    id: "cheo-sup-don-binh-minh-bai-sao",
    title: "Chèo SUP đón bình minh Bãi Sao",
    tag: "Thiên nhiên",
    tagColor: "cyan",
    audienceId: "friends",
    category: "Hoạt động & Vui chơi",
    duration: "2 giờ",
    highlight: "Ảnh chụp SUP",
    highlightIcon: "activity",
    rating: 4.8,
    reviewsCount: "160 đánh giá",
    price: 420_000,
    formattedPrice: "420.000đ/khách",
    imageUrl: "/experience/kayak-rach-vem.jpg",
  },
]


export interface PhuQuocHeroBadgeItem {
  readonly id: string
  readonly title: string
  readonly iconName: string
}

export interface PhuQuocCategoryItem {
  readonly id: string
  readonly label: string
  readonly count: number
  readonly iconName: string
}

export interface PhuQuocArticleItem {
  readonly id: string
  readonly title: string
  readonly category: string
  readonly categoryId: string
  readonly excerpt: string
  readonly date: string
  readonly views: string
  readonly viewsCount: number
  readonly imageUrl: string
  readonly isFeatured?: boolean
}

export const PHU_QUOC_HERO_BADGES: readonly PhuQuocHeroBadgeItem[] = [
  { id: "badge-1", title: "Cẩm nang du lịch", iconName: "book" },
  { id: "badge-2", title: "Gợi ý địa điểm", iconName: "pin" },
  { id: "badge-3", title: "Kinh nghiệm thực tế", iconName: "note" },
  { id: "badge-4", title: "Câu chuyện truyền cảm hứng", iconName: "heart" },
]

export const PHU_QUOC_CATEGORIES: readonly PhuQuocCategoryItem[] = [
  { id: "all", label: "Tất cả bài viết", count: 256, iconName: "book" },
  { id: "diem-den", label: "Điểm đến", count: 48, iconName: "map" },
  { id: "luu-tru", label: "Lưu trú", count: 36, iconName: "building" },
  { id: "am-thuc", label: "Ẩm thực", count: 42, iconName: "utensils" },
  { id: "trai-nghiem", label: "Trải nghiệm", count: 38, iconName: "activity" },
  { id: "di-chuyen", label: "Di chuyển", count: 24, iconName: "car" },
  { id: "cam-nang", label: "Cẩm nang", count: 34, iconName: "bookmark" },
  { id: "su-kien", label: "Sự kiện", count: 18, iconName: "calendar" },
  { id: "cau-chuyen", label: "Câu chuyện", count: 12, iconName: "heart" },
  { id: "khac", label: "Khác", count: 4, iconName: "grid" },
]

export const PHU_QUOC_FEATURED_ARTICLE: PhuQuocArticleItem = {
  id: "featured-phu-quoc-thien-duong",
  title: "Phú Quốc – Hành trình chạm đến thiên đường",
  category: "BÀI VIẾT NỔI BẬT",
  categoryId: "all",
  excerpt: "Không chỉ là một điểm đến, Phú Quốc là cảm xúc, là những ký ức đẹp theo bạn suốt cuộc đời.",
  date: "10 Thg 9, 2026",
  views: "28.4K",
  viewsCount: 28_400,
  imageUrl: "/phu-quoc/featured-article.jpg",
  isFeatured: true,
}

export const PHU_QUOC_ARTICLES: readonly PhuQuocArticleItem[] = [
  {
    id: "top-10-bai-bien-dep-nhat",
    title: "Top 10 bãi biển đẹp nhất Phú Quốc không thể bỏ lỡ",
    category: "Điểm đến",
    categoryId: "diem-den",
    excerpt: "Biển xanh, cát trắng, nắng vàng – khám phá những bãi biển đẹp nhất đảo ngọc.",
    date: "16 Thg 9, 2026",
    views: "12.5K",
    viewsCount: 12_500,
    imageUrl: "/phu-quoc/top-10-bai-bien.jpg",
  },
  {
    id: "kinh-nghiem-du-lich-tu-tuc",
    title: "Kinh nghiệm du lịch Phú Quốc tự túc từ A-Z",
    category: "Cẩm nang",
    categoryId: "cam-nang",
    excerpt: "Hướng dẫn chi tiết về di chuyển, lưu trú, ăn uống và lịch trình để có chuyến đi trọn vẹn.",
    date: "14 Thg 9, 2026",
    views: "10.2K",
    viewsCount: 10_200,
    imageUrl: "/phu-quoc/kinh-nghiem-tu-tuc.jpg",
  },
  {
    id: "phu-quoc-an-gi-20-mon-ngon",
    title: "Phú Quốc ăn gì? 20 món ngon nhất định phải thử",
    category: "Ẩm thực",
    categoryId: "am-thuc",
    excerpt: "Từ hải sản tươi sống đến đặc sản địa phương – thiên đường ẩm thực đang chờ bạn khám phá.",
    date: "12 Thg 9, 2026",
    views: "15.6K",
    viewsCount: 15_600,
    imageUrl: "/phu-quoc/phu-quoc-an-gi.jpg",
  },
  {
    id: "review-resort-dep-nhat-phu-quoc",
    title: "Review các resort đẹp nhất Phú Quốc cho kỳ nghỉ sang trọng",
    category: "Lưu trú",
    categoryId: "luu-tru",
    excerpt: "Những khu nghỉ dưỡng tuyệt vời với view biển triệu đô, dịch vụ đẳng cấp.",
    date: "11 Thg 9, 2026",
    views: "9.8K",
    viewsCount: 9800,
    imageUrl: "/phu-quoc/review-resort.jpg",
  },
  {
    id: "trai-nghiem-cap-treo-hon-thom",
    title: "Trải nghiệm cáp treo Hòn Thơm – Ngắm trọn vẻ đẹp Nam Đảo",
    category: "Trải nghiệm",
    categoryId: "trai-nghiem",
    excerpt: "Hành trình trên không ấn tượng, ngắm toàn cảnh biển trời Phú Quốc từ trên cao.",
    date: "10 Thg 9, 2026",
    views: "13.1K",
    viewsCount: 13_100,
    imageUrl: "/phu-quoc/cap-treo-hon-thom.jpg",
  },
  {
    id: "huong-dan-di-chuyen-den-phu-quoc",
    title: "Hướng dẫn di chuyển đến Phú Quốc dễ dàng và tiết kiệm",
    category: "Di chuyển",
    categoryId: "di-chuyen",
    excerpt: "Tổng hợp các phương tiện di chuyển, mẹo săn vé giá tốt và kinh nghiệm thực tế.",
    date: "8 Thg 9, 2026",
    views: "8.9K",
    viewsCount: 8900,
    imageUrl: "/phu-quoc/huong-dan-di-chuyen.jpg",
  },
  {
    id: "lan-ngam-san-ho-o-nam-dao",
    title: "Lặn ngắm san hô ở Nam Đảo – Thế giới màu sắc dưới đại dương",
    category: "Trải nghiệm",
    categoryId: "trai-nghiem",
    excerpt: "Khám phá những rạn san hô tuyệt đẹp và sinh vật biển phong phú tại Phú Quốc.",
    date: "5 Thg 9, 2026",
    views: "11.7K",
    viewsCount: 11_700,
    imageUrl: "/phu-quoc/lan-ngam-san-ho.jpg",
  },
  {
    id: "phu-quoc-noi-chua-lanh-tam-hon",
    title: "Phú Quốc – Nơi chữa lành tâm hồn",
    category: "Câu chuyện",
    categoryId: "cau-chuyen",
    excerpt: "Những câu chuyện truyền cảm hứng từ du khách về hành trình tìm lại sự bình yên tại đảo ngọc.",
    date: "4 Thg 9, 2026",
    views: "7.5K",
    viewsCount: 7500,
    imageUrl: "/phu-quoc/noi-chua-lanh.jpg",
  },
  {
    id: "kham-pha-lang-nghe-hat-tieu",
    title: "Khám phá làng nghề hạt tiêu Phú Quốc",
    category: "Khác",
    categoryId: "khac",
    excerpt: "Tìm hiểu quy trình trồng, chế biến và những câu chuyện thú vị về đặc sản trứ danh của đảo ngọc.",
    date: "2 Thg 9, 2026",
    views: "6.3K",
    viewsCount: 6300,
    imageUrl: "/phu-quoc/lang-nghe-tieu.jpg",
  },
  {
    id: "lich-trinh-3n2d-phu-quoc-gia-dinh",
    title: "Lịch trình 3 ngày 2 đêm ở Phú Quốc cho gia đình",
    category: "Cẩm nang",
    categoryId: "cam-nang",
    excerpt: "Gợi ý lịch trình chi tiết, phù hợp cho gia đình có trẻ nhỏ, vừa chơi vừa nghỉ dưỡng.",
    date: "30 Thg 8, 2026",
    views: "9.1K",
    viewsCount: 9100,
    imageUrl: "/phu-quoc/lich-trinh-3n2d.jpg",
  },
  {
    id: "cheo-sup-o-phu-quoc",
    title: "Chèo SUP ở Phú Quốc – Trải nghiệm đáng thử một lần",
    category: "Trải nghiệm",
    categoryId: "trai-nghiem",
    excerpt: "Tận hưởng cảm giác lênh đênh giữa biển xanh và ngắm hoàng hôn tuyệt đẹp.",
    date: "28 Thg 8, 2026",
    views: "8.4K",
    viewsCount: 8400,
    imageUrl: "/phu-quoc/cheo-sup.jpg",
  },
  {
    id: "le-hoi-va-su-kien-noi-bat",
    title: "Lễ hội và sự kiện nổi bật tại Phú Quốc 2026-2027",
    category: "Sự kiện",
    categoryId: "su-kien",
    excerpt: "Cập nhật những lễ hội, sự kiện văn hóa, thể thao và giải trí hấp dẫn sắp diễn ra.",
    date: "26 Thg 8, 2026",
    views: "5.9K",
    viewsCount: 5900,
    imageUrl: "/phu-quoc/le-hoi-su-kien.jpg",
  },
]

// ==========================================
// 6. TRANSPORTATION (DI CHUYỂN) MOCK DATA
// ==========================================

export interface TransportBadge {
  readonly icon: 'zap' | 'shield-check' | 'tag' | 'headphones'
  readonly title: string
  readonly desc: string
}

export const TRANSPORT_HERO_BADGES: readonly TransportBadge[] = [
  { icon: 'zap', title: 'Đặt nhanh', desc: 'Chỉ vài phút' },
  { icon: 'shield-check', title: 'An toàn', desc: 'Đồng hành tin cậy' },
  { icon: 'tag', title: 'Giá minh bạch', desc: 'Không phí ẩn' },
  { icon: 'headphones', title: 'Hỗ trợ 24/7', desc: 'Luôn bên bạn' },
]

export interface TransportServiceTab {
  readonly id: string
  readonly label: string
  readonly icon: 'car' | 'plane' | 'bike' | 'user'
}

export const TRANSPORT_SERVICE_TABS: readonly TransportServiceTab[] = [
  { id: 'all', label: 'Tất cả', icon: 'car' },
  { id: 'airport-transfer', label: 'Đưa đón sân bay', icon: 'plane' },
  { id: 'car-rental', label: 'Thuê ô tô', icon: 'car' },
  { id: 'motorbike-rental', label: 'Thuê xe máy', icon: 'bike' },
  { id: 'private-driver', label: 'Tài xế riêng', icon: 'user' },
]

export interface TransportFeature {
  readonly icon: string
  readonly label: string
}

export interface TransportItem {
  readonly id: string
  readonly title: string
  readonly serviceType: string
  readonly serviceTypeId: 'airport-transfer' | 'car-rental' | 'motorbike-rental' | 'private-driver'
  readonly location: string
  readonly description: string
  readonly rating: number
  readonly reviewsCount: number
  readonly price: number
  readonly priceDisplay: string
  readonly priceUnit: string
  readonly badge?: {
    readonly text: string
    readonly bgClass: string
  }
  readonly features: readonly TransportFeature[]
  readonly imageUrl: string
}

export const TRANSPORT_ITEMS: readonly TransportItem[] = [
  {
    id: 'airport-premium-transfer',
    title: 'Airport Premium Transfer',
    serviceType: 'Đưa đón sân bay',
    serviceTypeId: 'airport-transfer',
    location: 'Sân bay Phú Quốc',
    description: 'Xe cao cấp, đón tiễn đúng giờ, thoải mái và an toàn.',
    rating: 4.9,
    reviewsCount: 328,
    price: 250_000,
    priceDisplay: '250.000đ',
    priceUnit: '/ chuyến',
    badge: { text: 'Bán chạy', bgClass: 'bg-emerald-600 text-white' },
    features: [
      { icon: 'car', label: 'Đón tận nơi' },
      { icon: 'shield', label: 'Bảo hiểm' },
      { icon: 'wifi', label: 'Wi-Fi' },
    ],
    imageUrl: '/transport/airport-premium-transfer.jpg',
  },
  {
    id: 'sunset-car-rental',
    title: 'Sunset Car Rental',
    serviceType: 'Thuê ô tô',
    serviceTypeId: 'car-rental',
    location: 'Dương Đông',
    description: 'Thuê xe tự lái, thoải mái khám phá đảo ngọc theo lịch trình riêng.',
    rating: 4.8,
    reviewsCount: 215,
    price: 900_000,
    priceDisplay: '900.000đ',
    priceUnit: '/ ngày',
    badge: { text: 'Yêu thích', bgClass: 'bg-rose-500 text-white' },
    features: [
      { icon: 'key', label: 'Tự lái' },
      { icon: 'shield', label: 'Bảo hiểm' },
      { icon: 'headphones', label: 'Hỗ trợ 24/7' },
    ],
    imageUrl: '/transport/sunset-car-rental.jpg',
  },
  {
    id: 'island-motorbike-rental',
    title: 'Island Motorbike Rental',
    serviceType: 'Thuê xe máy',
    serviceTypeId: 'motorbike-rental',
    location: 'Dương Đông',
    description: 'Xe máy chất lượng, dễ dàng vi vu khắp đảo.',
    rating: 4.8,
    reviewsCount: 412,
    price: 180_000,
    priceDisplay: '180.000đ',
    priceUnit: '/ ngày',
    features: [
      { icon: 'hard-hat', label: 'Nón bảo hiểm' },
      { icon: 'car', label: 'Hỗ trợ tận nơi' },
      { icon: 'shield', label: 'Bảo hiểm' },
    ],
    imageUrl: '/transport/island-motorbike-rental.jpg',
  },
  {
    id: 'private-driver-elite',
    title: 'Private Driver Elite',
    serviceType: 'Tài xế riêng',
    serviceTypeId: 'private-driver',
    location: 'Toàn đảo',
    description: 'Tài xế riêng chuyên nghiệp, linh hoạt theo lịch trình của bạn.',
    rating: 4.9,
    reviewsCount: 186,
    price: 1_200_000,
    priceDisplay: '1.200.000đ',
    priceUnit: '/ ngày',
    badge: { text: 'Cao cấp', bgClass: 'bg-blue-700 text-white' },
    features: [
      { icon: 'user-check', label: 'Tài xế chuyên nghiệp' },
      { icon: 'car', label: 'Xe cao cấp' },
      { icon: 'clock', label: 'Linh hoạt lịch trình' },
    ],
    imageUrl: '/transport/private-driver-elite.jpg',
  },
  {
    id: 'family-airport-van',
    title: 'Family Airport Van',
    serviceType: 'Đưa đón sân bay',
    serviceTypeId: 'airport-transfer',
    location: 'Sân bay Phú Quốc',
    description: 'Xe 7-16 chỗ, phù hợp cho gia đình và nhóm đông người.',
    rating: 4.8,
    reviewsCount: 142,
    price: 800_000,
    priceDisplay: '800.000đ',
    priceUnit: '/ chuyến',
    features: [
      { icon: 'car', label: 'Xe rộng rãi' },
      { icon: 'armchair', label: 'Ghế trẻ em' },
      { icon: 'briefcase', label: 'Hỗ trợ hành lý' },
    ],
    imageUrl: '/transport/family-airport-van.jpg',
  },
  {
    id: 'beach-road-suv-rental',
    title: 'Beach Road SUV Rental',
    serviceType: 'Thuê ô tô',
    serviceTypeId: 'car-rental',
    location: 'Bãi Trường',
    description: 'SUV mạnh mẽ, lý tưởng cho những cung đường biển tuyệt đẹp.',
    rating: 4.9,
    reviewsCount: 96,
    price: 1_000_000,
    priceDisplay: '1.000.000đ',
    priceUnit: '/ ngày',
    badge: { text: 'Mới', bgClass: 'bg-teal-600 text-white' },
    features: [
      { icon: 'key', label: 'Tự lái' },
      { icon: 'shield', label: 'Bảo hiểm' },
      { icon: 'infinity', label: 'Không giới hạn km' },
    ],
    imageUrl: '/transport/beach-road-suv-rental.jpg',
  },
  {
    id: 'flexible-scooter-daily',
    title: 'Flexible Scooter Daily',
    serviceType: 'Thuê xe máy',
    serviceTypeId: 'motorbike-rental',
    location: 'Toàn đảo',
    description: 'Linh hoạt theo ngày, giá tốt, thủ tục nhanh gọn.',
    rating: 4.7,
    reviewsCount: 320,
    price: 150_000,
    priceDisplay: '150.000đ',
    priceUnit: '/ ngày',
    features: [
      { icon: 'hard-hat', label: 'Nón bảo hiểm' },
      { icon: 'truck', label: 'Giao tận nơi' },
      { icon: 'headphones', label: 'Hỗ trợ 24/7' },
    ],
    imageUrl: '/transport/flexible-scooter-daily.jpg',
  },
  {
    id: 'chauffeur-discovery-tour',
    title: 'Chauffeur Discovery Tour',
    serviceType: 'Tài xế riêng',
    serviceTypeId: 'private-driver',
    location: 'Toàn đảo',
    description: 'Khám phá Bắc - Nam đảo cùng tài xế giàu kinh nghiệm.',
    rating: 4.9,
    reviewsCount: 118,
    price: 1_500_000,
    priceDisplay: '1.500.000đ',
    priceUnit: '/ ngày',
    badge: { text: 'Đề xuất', bgClass: 'bg-indigo-600 text-white' },
    features: [
      { icon: 'calendar', label: 'Lịch trình tùy chỉnh' },
      { icon: 'message-square', label: 'Hướng dẫn viên' },
      { icon: 'car', label: 'Xe cao cấp' },
    ],
    imageUrl: '/transport/chauffeur-discovery-tour.jpg',
  },
  {
    id: 'luxury-business-transfer',
    title: 'Luxury Business Transfer',
    serviceType: 'Đưa đón sân bay',
    serviceTypeId: 'airport-transfer',
    location: 'Sân bay Phú Quốc',
    description: 'Dịch vụ cao cấp cho khách doanh nghiệp, ưu tiên sự riêng tư và thoải mái.',
    rating: 4.9,
    reviewsCount: 76,
    price: 1_800_000,
    priceDisplay: '1.800.000đ',
    priceUnit: '/ chuyến',
    features: [
      { icon: 'sparkles', label: 'Xe sang' },
      { icon: 'crown', label: 'Đón VIP' },
      { icon: 'wifi', label: 'Wi-Fi' },
    ],
    imageUrl: '/transport/luxury-business-transfer.jpg',
  },
  {
    id: 'long-stay-car-package',
    title: 'Long Stay Car Package',
    serviceType: 'Thuê ô tô',
    serviceTypeId: 'car-rental',
    location: 'Toàn đảo',
    description: 'Gói thuê xe dài hạn, ưu đãi đặc biệt cho kỳ nghỉ dài ngày.',
    rating: 4.8,
    reviewsCount: 54,
    price: 12_000_000,
    priceDisplay: '12.000.000đ',
    priceUnit: '/ 7 ngày',
    badge: { text: 'Tiết kiệm', bgClass: 'bg-emerald-600 text-white' },
    features: [
      { icon: 'key', label: 'Giao xe ưu đãi' },
      { icon: 'shield', label: 'Bảo hiểm' },
      { icon: 'headphones', label: 'Hỗ trợ 24/7' },
    ],
    imageUrl: '/transport/long-stay-car-package.jpg',
  },
]

// ==========================================
// 7. DEALS (ƯU ĐÃI) SCREEN MOCK DATA
// ==========================================

export interface DealsHeroBadge {
  readonly icon: 'tag' | 'gift' | 'shield-check' | 'headphones' | 'crown'
  readonly label: string
}

export const DEALS_HERO_BADGES: readonly DealsHeroBadge[] = [
  { icon: 'tag', label: 'Giá tốt mỗi ngày' },
  { icon: 'gift', label: 'Ưu đãi độc quyền chỉ có tại STAYEA' },
  { icon: 'shield-check', label: 'Đặt nhanh, an toàn' },
  { icon: 'headphones', label: 'Hỗ trợ 24/7' },
  { icon: 'crown', label: 'Thành viên Staya Club nhận thêm ưu đãi' },
]

export interface DealsServiceTab {
  readonly id: string
  readonly label: string
  readonly icon: 'tag' | 'plane' | 'ship' | 'car' | 'bus' | 'hotel' | 'palmtree'
}

export const DEALS_SERVICE_TABS: readonly DealsServiceTab[] = [
  { id: 'all', label: 'Tất cả ưu đãi', icon: 'tag' },
  { id: 'flight', label: 'Vé máy bay', icon: 'plane' },
  { id: 'ferry', label: 'Tàu cao tốc', icon: 'ship' },
  { id: 'car-rental', label: 'Thuê xe', icon: 'car' },
  { id: 'transfer', label: 'Xe đưa đón', icon: 'bus' },
  { id: 'hotel', label: 'Khách sạn', icon: 'hotel' },
  { id: 'tour', label: 'Tour trải nghiệm', icon: 'palmtree' },
]

export interface DealsFeaturedCard {
  readonly id: string
  readonly category: string
  readonly categoryTag: string
  readonly discount: string
  readonly discountColor: string
  readonly title: string
  readonly highlight?: string
  readonly subtitle: string
  readonly imageUrl: string
}

export const DEALS_FEATURED_CARDS: readonly DealsFeaturedCard[] = [
  {
    id: 'vietjet-air-phu-quoc',
    category: 'Vé máy bay',
    categoryTag: 'flight',
    discount: 'Giảm đến 30%',
    discountColor: 'bg-[#FF3B30]',
    title: 'Bay Phú Quốc giá tốt',
    highlight: 'cùng Vietjet Air',
    subtitle: 'Áp dụng cho nhiều chặng bay',
    imageUrl: '/deals/plane-vietjet.jpg',
  },
  {
    id: 'superdong-ferry-he',
    category: 'Tàu cao tốc',
    categoryTag: 'ferry',
    discount: 'Giảm 20%',
    discountColor: 'bg-[#FF9500]',
    title: 'Tàu cao tốc Superdong',
    highlight: 'Ưu đãi mùa hè',
    subtitle: 'Áp dụng tuyến Rạch Giá – Phú Quốc',
    imageUrl: '/deals/ferry-superdong.jpg',
  },
  {
    id: 'toyota-vios-rental',
    category: 'Thuê xe',
    categoryTag: 'car-rental',
    discount: 'Giảm 15%',
    discountColor: 'bg-[#FF9500]',
    title: 'Thuê xe Toyota Vios',
    highlight: 'Giá chỉ từ 600.000đ/ngày',
    subtitle: 'Tự lái · Thủ tục nhanh gọn',
    imageUrl: '/deals/car-vios.jpg',
  },
  {
    id: 'airport-van-transfer',
    category: 'Xe đưa đón',
    categoryTag: 'transfer',
    discount: 'Giảm 20%',
    discountColor: 'bg-[#FF3B30]',
    title: 'Xe đưa đón sân bay',
    highlight: 'An tâm di chuyển',
    subtitle: 'Đón tiễn sân bay – Khách sạn',
    imageUrl: '/deals/transfer-van.jpg',
  },
]

export interface DealsCategoryItem {
  readonly id: string
  readonly label: string
  readonly discountText: string
  readonly icon: 'plane' | 'ship' | 'car' | 'bus' | 'hotel' | 'palmtree'
  readonly bgClass: string
  readonly borderClass: string
  readonly textClass: string
}

export const DEALS_CATEGORY_ITEMS: readonly DealsCategoryItem[] = [
  {
    id: 'flight',
    label: 'Vé máy bay',
    discountText: 'Ưu đãi đến 30%',
    icon: 'plane',
    bgClass: 'bg-blue-50/70',
    borderClass: 'border-blue-100',
    textClass: 'text-blue-700',
  },
  {
    id: 'ferry',
    label: 'Tàu cao tốc',
    discountText: 'Ưu đãi đến 25%',
    icon: 'ship',
    bgClass: 'bg-sky-50/70',
    borderClass: 'border-sky-100',
    textClass: 'text-sky-700',
  },
  {
    id: 'car-rental',
    label: 'Thuê xe',
    discountText: 'Ưu đãi đến 20%',
    icon: 'car',
    bgClass: 'bg-amber-50/70',
    borderClass: 'border-amber-100',
    textClass: 'text-amber-700',
  },
  {
    id: 'transfer',
    label: 'Xe đưa đón',
    discountText: 'Ưu đãi đến 20%',
    icon: 'bus',
    bgClass: 'bg-emerald-50/70',
    borderClass: 'border-emerald-100',
    textClass: 'text-emerald-700',
  },
  {
    id: 'hotel',
    label: 'Khách sạn',
    discountText: 'Ưu đãi đến 40%',
    icon: 'hotel',
    bgClass: 'bg-purple-50/70',
    borderClass: 'border-purple-100',
    textClass: 'text-purple-700',
  },
  {
    id: 'tour',
    label: 'Tour trải nghiệm',
    discountText: 'Ưu đãi đến 50%',
    icon: 'palmtree',
    bgClass: 'bg-rose-50/70',
    borderClass: 'border-rose-100',
    textClass: 'text-rose-700',
  },
]

export interface DealsValuePillar {
  readonly icon: 'tag' | 'shield-check' | 'headphones' | 'star'
  readonly title: string
  readonly subtitle: string
}

export const DEALS_VALUE_PILLARS: readonly DealsValuePillar[] = [
  { icon: 'tag', title: 'Giá tốt nhất', subtitle: 'Cam kết cạnh tranh' },
  { icon: 'shield-check', title: 'Thanh toán an toàn', subtitle: 'Bảo mật thông tin' },
  { icon: 'headphones', title: 'Hỗ trợ 24/7', subtitle: 'Luôn đồng hành cùng bạn' },
  { icon: 'star', title: 'Trải nghiệm đáng nhớ', subtitle: 'Khám phá Phú Quốc trọn vẹn' },
]

export interface AuthSideBenefit {
  readonly id: string
  readonly icon: 'star' | 'heart' | 'bag'
  readonly text: string
}

export const AUTH_SIDE_BENEFITS: readonly AuthSideBenefit[] = [
  {
    id: 'itinerary',
    icon: 'star',
    text: 'Lưu lịch trình\nvà kế hoạch chuyến đi',
  },
  {
    id: 'member-perks',
    icon: 'heart',
    text: 'Nhận ưu đãi\ndành riêng cho thành viên',
  },
  {
    id: 'personalize',
    icon: 'bag',
    text: 'Trải nghiệm cá nhân hóa\ntiện lợi hơn',
  },
]

export interface AuthOnboardingStep {
  readonly id: string
  readonly icon: 'search' | 'calendar' | 'heart' | 'plane'
  readonly line1: string
  readonly line2: string
}

export const AUTH_ONBOARDING_STEPS: readonly AuthOnboardingStep[] = [
  {
    id: 'search',
    icon: 'search',
    line1: 'Tìm điểm đến',
    line2: 'yêu thích',
  },
  {
    id: 'planner',
    icon: 'calendar',
    line1: 'Lên kế hoạch',
    line2: 'cùng Trip Planner',
  },
  {
    id: 'booking',
    icon: 'heart',
    line1: 'Đặt dịch vụ',
    line2: 'dễ dàng, an toàn',
  },
  {
    id: 'journey',
    icon: 'plane',
    line1: 'Bắt đầu hành trình',
    line2: 'đáng nhớ',
  },
]


// ==========================================
// 16. USER PROFILE & DASHBOARD DATA (SCREEN: TRANG CÁ NHÂN)
// ==========================================

export interface UserProfileInfo {
  readonly id: string
  readonly name: string
  readonly membershipTier: string
  readonly email: string
  readonly phone: string
  readonly bio: string
  readonly avatarUrl: string
  readonly coverUrl: string
  readonly stats: {
    readonly trips: number
    readonly favorites: number
    readonly reviews: number
    readonly tierName: string
  }
}

export const CURRENT_USER_PROFILE: UserProfileInfo = {
  id: "user-default",
  name: "Thành viên STAYEA",
  membershipTier: "Thành viên Staya Club",
  email: "",
  phone: "",
  bio: "Chào mừng bạn đến với kỳ nghỉ tuyệt mỹ cùng STAYEA.",
  avatarUrl: "/profile/profile-avatar.jpg",
  coverUrl: "/profile/profile-hero-banner.jpg",
  stats: {
    trips: 12,
    favorites: 28,
    reviews: 8,
    tierName: "Thành viên",
  },
}

export interface ProfileSidebarItem {
  readonly id: string
  readonly label: string
  readonly iconName: string
  readonly badge?: string
}

export const PROFILE_SIDEBAR_ITEMS: readonly ProfileSidebarItem[] = [
  { id: "profile", label: "Trang cá nhân", iconName: "user" },
  { id: "bookings", label: "Đơn đặt dịch vụ", iconName: "calendar" },
  { id: "plans", label: "Kế hoạch của tôi", iconName: "clipboard-list" },
  { id: "favorites", label: "Yêu thích", iconName: "heart", badge: "28" },
  { id: "reviews", label: "Đánh giá của tôi", iconName: "star", badge: "8" },
  { id: "account-info", label: "Thông tin cá nhân", iconName: "user-check" },
  { id: "payment", label: "Phương thức thanh toán", iconName: "credit-card" },
  { id: "deals", label: "Ưu đãi của tôi", iconName: "gift" },
  { id: "staya-club", label: "Stayea Club", iconName: "crown" },
  { id: "settings", label: "Cài đặt", iconName: "settings" },
  { id: "support", label: "Hỗ trợ", iconName: "headphones" },
  { id: "logout", label: "Đăng xuất", iconName: "log-out" },
]

export interface UpcomingTrip {
  readonly id: string
  readonly title: string
  readonly statusBadge: string
  readonly dates: string
  readonly guests: string
  readonly tripType: string
  readonly imageUrl: string
  readonly bookingCode: string
}

export const UPCOMING_TRIP: UpcomingTrip = {
  id: "trip-upcoming-1",
  title: "Phú Quốc – Biển xanh, nắng vàng",
  statusBadge: "Sắp diễn ra",
  dates: "15/06/2025 - 18/06/2025",
  guests: "2 người",
  tripType: "Cặp đôi / Honeymoon",
  imageUrl: "/profile/phu-quoc-upcoming.jpg",
  bookingCode: "STAYEA-PQ-202506",
}

export interface PastTrip {
  readonly id: string
  readonly title: string
  readonly dates: string
  readonly location: string
  readonly imageUrl: string
}

export const PAST_TRIPS: readonly PastTrip[] = [
  {
    id: "past-1",
    title: "Sunset Sanato",
    dates: "12/04/2025 - 14/04/2025",
    location: "Phú Quốc",
    imageUrl: "/profile/sunset-sanato.jpg",
  },
  {
    id: "past-2",
    title: "Khám phá Hòn Thơm",
    dates: "05/02/2025 - 07/02/2025",
    location: "Phú Quốc",
    imageUrl: "/profile/hon-thom.jpg",
  },
  {
    id: "past-3",
    title: "Chợ đêm Dương Đông",
    dates: "20/01/2025 - 22/01/2025",
    location: "Phú Quốc",
    imageUrl: "/profile/cho-dem.jpg",
  },
]

export interface FavoriteDestination {
  readonly id: string
  readonly title: string
  readonly imageUrl: string
  readonly isFavorite: boolean
}

export const FAVORITE_DESTINATIONS: readonly FavoriteDestination[] = [
  {
    id: "fav-1",
    title: "Bãi Sao",
    imageUrl: "/profile/bai-sao.jpg",
    isFavorite: true,
  },
  {
    id: "fav-2",
    title: "Hòn Thơm",
    imageUrl: "/profile/hon-thom-fav.jpg",
    isFavorite: true,
  },
  {
    id: "fav-3",
    title: "VinWonders Phú Quốc",
    imageUrl: "/profile/vinwonders.jpg",
    isFavorite: true,
  },
  {
    id: "fav-4",
    title: "Grand World",
    imageUrl: "/profile/grand-world.jpg",
    isFavorite: true,
  },
]


// ==========================================
// 17. SERVICE BOOKINGS DATA (SCREEN: ĐƠN ĐẶT DỊCH VỤ)
// ==========================================

export interface ServiceBookingItem {
  readonly id: string
  readonly code: string
  readonly category: "stay" | "experience" | "transport"
  readonly status: "upcoming" | "completed" | "cancelled"
  readonly statusLabel: string
  readonly title: string
  readonly dates: string
  readonly location?: string
  readonly route?: string
  readonly guests?: string
  readonly detailInfo: string
  readonly detailIcon: "bed" | "sparkles" | "plane" | "ticket" | "utensils"
  readonly price: string
  readonly priceNum: number
  readonly imageUrl: string
  readonly primaryActionLabel: string
  readonly secondaryActionLabel: string
}

export const SERVICE_BOOKINGS_DATA: readonly ServiceBookingItem[] = [
  {
    id: "booking-1",
    code: "ST250615001",
    category: "stay",
    status: "upcoming",
    statusLabel: "Sắp diễn ra",
    title: "Premier Residences Phu Quoc Emerald Bay",
    dates: "15/06/2025 - 18/06/2025 (3 đêm)",
    location: "Bãi Khem, Phú Quốc (PQC)",
    guests: "2 người lớn",
    detailInfo: "Phòng Deluxe Ocean View",
    detailIcon: "bed",
    price: "7.500.000đ",
    priceNum: 7_500_000,
    imageUrl: "/bookings/premier-residences.jpg",
    primaryActionLabel: "Quản lý đặt phòng",
    secondaryActionLabel: "Liên hệ hỗ trợ",
  },
  {
    id: "booking-2",
    code: "ST250616002",
    category: "experience",
    status: "upcoming",
    statusLabel: "Sắp diễn ra",
    title: "Lặn ngắm san hô tại Hòn Thơm",
    dates: "16/06/2025 - 16/06/2025",
    location: "Hòn Thơm, Phú Quốc",
    guests: "2 người",
    detailInfo: "Trải nghiệm biển",
    detailIcon: "sparkles",
    price: "1.200.000đ",
    priceNum: 1_200_000,
    imageUrl: "/bookings/hon-thom-snorkeling.jpg",
    primaryActionLabel: "Xem voucher",
    secondaryActionLabel: "Liên hệ hỗ trợ",
  },
  {
    id: "booking-3",
    code: "ST250412003",
    category: "transport",
    status: "completed",
    statusLabel: "Đã hoàn thành",
    title: "Vé máy bay Vietjet Air",
    dates: "12/04/2025",
    route: "Hà Nội (HAN) ➔ Phú Quốc (PQC)",
    detailInfo: "Hạng phổ thông",
    detailIcon: "plane",
    price: "4.800.000đ",
    priceNum: 4_800_000,
    imageUrl: "/deals/plane-vietjet.jpg",
    primaryActionLabel: "Xem chi tiết",
    secondaryActionLabel: "Đặt lại",
  },
  {
    id: "booking-4",
    code: "ST250412004",
    category: "experience",
    status: "completed",
    statusLabel: "Đã hoàn thành",
    title: "Sunset Sanato",
    dates: "12/04/2025",
    location: "Dương Đông, Phú Quốc",
    guests: "2 người",
    detailInfo: "Vé tham quan & trải nghiệm",
    detailIcon: "ticket",
    price: "800.000đ",
    priceNum: 800_000,
    imageUrl: "/bookings/sunset-sanato.jpg",
    primaryActionLabel: "Đánh giá",
    secondaryActionLabel: "Đặt lại",
  },
  {
    id: "booking-5",
    code: "ST250413005",
    category: "experience",
    status: "completed",
    statusLabel: "Đã hoàn thành",
    title: "Tour ẩm thực chợ đêm Dương Đông",
    dates: "13/04/2025",
    location: "Chợ đêm Dương Đông, Phú Quốc",
    detailInfo: "Trải nghiệm ẩm thực",
    detailIcon: "utensils",
    price: "1.000.000đ",
    priceNum: 1_000_000,
    imageUrl: "/bookings/cho-dem.jpg",
    primaryActionLabel: "Đánh giá",
    secondaryActionLabel: "Đặt lại",
  },
]

export interface BookingTabOption {
  readonly id: "all" | "stay" | "experience" | "transport" | "cancelled"
  readonly label: string
  readonly count: number
}

export const BOOKING_TABS: readonly BookingTabOption[] = [
  { id: "all", label: "Tất cả", count: 5 },
  { id: "stay", label: "Lưu trú", count: 2 },
  { id: "experience", label: "Trải nghiệm", count: 2 },
  { id: "transport", label: "Di chuyển", count: 1 },
  { id: "cancelled", label: "Đã hủy", count: 0 },
]


// ==========================================
// 18. MOCK DATA FOR "ĐẶT DỊCH VỤ MỚI" SCREEN
// ==========================================

export interface NewBookingCategoryItem {
  readonly id: "stay" | "experience" | "package" | "transport"
  readonly title: string
  readonly iconName: "home" | "umbrella" | "gift" | "car"
  readonly description: string
  readonly actionLabel: string
  readonly targetRoute: string
  readonly imageUrl: string
  readonly secondaryImageUrl?: string
}

export const NEW_BOOKING_CATEGORIES: readonly NewBookingCategoryItem[] = [
  {
    id: "stay",
    title: "Lưu trú",
    iconName: "home",
    description: "Biệt thự, căn hộ, khách sạn và homestay tuyển chọn.",
    actionLabel: "Đặt lưu trú",
    targetRoute: "stay",
    imageUrl: "/auth/auth-villa-bg.jpg",
  },
  {
    id: "experience",
    title: "Trải nghiệm",
    iconName: "umbrella",
    description: "Tour, hoạt động biển, ẩm thực và khám phá địa phương.",
    actionLabel: "Đặt trải nghiệm",
    targetRoute: "experience",
    imageUrl: "/experience/snorkeling-nam-dao.jpg",
  },
  {
    id: "package",
    title: "Gói hành trình",
    iconName: "gift",
    description: "Combo trọn gói tiết kiệm cho kỳ nghỉ hoàn hảo.",
    actionLabel: "Xem gói",
    targetRoute: "packages",
    imageUrl: "/explore/sunset-island.jpg",
  },
  {
    id: "transport",
    title: "Di chuyển",
    iconName: "car",
    description: "Vé máy bay, tàu cao tốc, thuê xe và xe đưa đón.",
    actionLabel: "Đặt di chuyển",
    targetRoute: "transport",
    imageUrl: "/transport/family-airport-van.jpg",
    secondaryImageUrl: "/deals/plane-vietjet.jpg",
  },
]

export interface NewBookingRecommendationItem {
  readonly id: string
  readonly category: "stay" | "experience" | "transport" | "package"
  readonly title: string
  readonly rating: number
  readonly reviewsCount: number
  readonly location: string
  readonly priceDisplay: string
  readonly priceNum: number
  readonly priceUnit: string
  readonly imageUrl: string
  readonly targetRoute: string
  readonly isFavorite?: boolean
}

export const NEW_BOOKING_RECOMMENDATIONS: readonly NewBookingRecommendationItem[] = [
  {
    id: "rec-1",
    category: "stay",
    title: "Premier Residences Phu Quoc Emerald Bay",
    rating: 4.8,
    reviewsCount: 320,
    location: "Bãi Khem, Phú Quốc",
    priceDisplay: "7.500.000đ",
    priceNum: 7_500_000,
    priceUnit: "3 đêm",
    imageUrl: "/auth/auth-villa-bg.jpg",
    targetRoute: "stay",
  },
  {
    id: "rec-2",
    category: "experience",
    title: "Tour 3 đảo Phú Quốc",
    rating: 4.7,
    reviewsCount: 218,
    location: "Hòn Thơm, Phú Quốc",
    priceDisplay: "1.200.000đ",
    priceNum: 1_200_000,
    priceUnit: "người",
    imageUrl: "/stay/the-shell-resort.jpg",
    targetRoute: "experience",
  },
  {
    id: "rec-3",
    category: "transport",
    title: "Vé máy bay Vietjet Air",
    rating: 4.6,
    reviewsCount: 156,
    location: "Hà Nội (HAN) ➔ Phú Quốc (PQC)",
    priceDisplay: "4.800.000đ",
    priceNum: 4_800_000,
    priceUnit: "vé",
    imageUrl: "/deals/plane-vietjet.jpg",
    targetRoute: "transport",
  },
  {
    id: "rec-4",
    category: "transport",
    title: "Xe đưa đón sân bay",
    rating: 4.9,
    reviewsCount: 98,
    location: "Sân bay Phú Quốc (PQC)",
    priceDisplay: "350.000đ",
    priceNum: 350_000,
    priceUnit: "xe",
    imageUrl: "/transport/family-airport-van.jpg",
    targetRoute: "transport",
  },
]


// ==========================================
// 19. MOCK DATA FOR "KẾ HOẠCH CỦA TÔI" SCREEN
// ==========================================

export interface MyPlanTripCard {
  readonly id: string
  readonly status: "upcoming" | "planning" | "past" | "draft" | "wishlist"
  readonly statusLabel: string
  readonly statusVariant: "emerald" | "blue" | "slate"
  readonly title: string
  readonly dates: string
  readonly location: string
  readonly guests: string
  readonly imageUrl: string
  readonly actionLabel: string
}

export const MY_PLANS_TRIPS: readonly MyPlanTripCard[] = [
  {
    id: "plan-phu-quoc-bien-xanh",
    status: "upcoming",
    statusLabel: "Sắp diễn ra",
    statusVariant: "emerald",
    title: "Phú Quốc – Biển xanh, nắng vàng",
    dates: "15/06/2025 - 18/06/2025 (4 ngày)",
    location: "Phú Quốc (PQC)",
    guests: "2 người",
    imageUrl: "/profile/bai-sao.jpg",
    actionLabel: "Xem chi tiết",
  },
  {
    id: "plan-kham-pha-hon-thom",
    status: "planning",
    statusLabel: "Đang lên kế hoạch",
    statusVariant: "blue",
    title: "Khám phá Hòn Thơm",
    dates: "12/08/2025 - 14/08/2025 (3 ngày)",
    location: "Phú Quốc (PQC)",
    guests: "2 người",
    imageUrl: "/packages/hon-thom-cap-treo.jpg",
    actionLabel: "Tiếp tục lên kế hoạch",
  },
]

export interface ItineraryDayItem {
  readonly id: string
  readonly dayIndex: number
  readonly date: string
  readonly dayLabel: string
  readonly title: string
  readonly description: string
  readonly iconName: "plane-arrival" | "waves" | "fish" | "shopping-bag"
}

export const ACTIVE_PLAN_ITINERARY_DAYS: readonly ItineraryDayItem[] = [
  {
    id: "day-1",
    dayIndex: 1,
    date: "15/06",
    dayLabel: "Ngày 1",
    title: "Đến Phú Quốc",
    description: "Đón sân bay, nhận phòng khách sạn",
    iconName: "plane-arrival",
  },
  {
    id: "day-2",
    dayIndex: 2,
    date: "16/06",
    dayLabel: "Ngày 2",
    title: "Khám phá Bãi Sao",
    description: "Tắm biển, chụp ảnh, thư giãn",
    iconName: "waves",
  },
  {
    id: "day-3",
    dayIndex: 3,
    date: "17/06",
    dayLabel: "Ngày 3",
    title: "Lặn ngắm san hô Hòn Thơm",
    description: "Trải nghiệm thế giới đại dương",
    iconName: "fish",
  },
  {
    id: "day-4",
    dayIndex: 4,
    date: "18/06",
    dayLabel: "Ngày 4",
    title: "Mua sắm & trở về",
    description: "Mua đặc sản, trả phòng, di chuyển ra sân bay",
    iconName: "shopping-bag",
  },
]

export interface PlanBookedServiceItem {
  readonly id: string
  readonly title: string
  readonly statusLabel: string
  readonly dates: string
  readonly typeLabel: string
  readonly route?: string
  readonly imageUrl: string
}

export const ACTIVE_PLAN_BOOKED_SERVICES: readonly PlanBookedServiceItem[] = [
  {
    id: "booked-1",
    title: "Premier Residences Phu Quoc Emerald Bay",
    statusLabel: "Đã xác nhận",
    dates: "15/06 - 18/06/2025",
    typeLabel: "Lưu trú",
    imageUrl: "/auth/auth-villa-bg.jpg",
  },
  {
    id: "booked-2",
    title: "Vietjet Air – VJ458",
    statusLabel: "Đã xác nhận",
    dates: "15/06/2025",
    typeLabel: "Vé máy bay",
    route: "Hà Nội ➔ Phú Quốc",
    imageUrl: "/deals/plane-vietjet.jpg",
  },
  {
    id: "booked-3",
    title: "Tour lặn ngắm san hô Hòn Thơm",
    statusLabel: "Đã xác nhận",
    dates: "17/06/2025",
    typeLabel: "Trải nghiệm",
    imageUrl: "/experience/snorkeling-nam-dao.jpg",
  },
  {
    id: "booked-4",
    title: "Xe đưa đón sân bay",
    statusLabel: "Đã xác nhận",
    dates: "15/06/2025",
    typeLabel: "Di chuyển",
    imageUrl: "/transport/family-airport-van.jpg",
  },
]

export interface PlanRecommendedAddonItem {
  readonly id: string
  readonly title: string
  readonly location: string
  readonly rating: number
  readonly reviewsCount: string
  readonly imageUrl: string
}

export const PLAN_RECOMMENDED_ADDONS: readonly PlanRecommendedAddonItem[] = [
  {
    id: "addon-1",
    title: "Sunset Sanato",
    location: "Dương Đông, Phú Quốc",
    rating: 4.6,
    reviewsCount: "1.2k đánh giá",
    imageUrl: "/profile/sunset-sanato.jpg",
  },
  {
    id: "addon-2",
    title: "VinWonders Phú Quốc",
    location: "Bãi Dài, Phú Quốc",
    rating: 4.7,
    reviewsCount: "3.5k đánh giá",
    imageUrl: "/profile/vinwonders.jpg",
  },
  {
    id: "addon-3",
    title: "Tour ẩm thực chợ đêm",
    location: "Chợ đêm Dương Đông",
    rating: 4.5,
    reviewsCount: "892 đánh giá",
    imageUrl: "/profile/cho-dem.jpg",
  },
  {
    id: "addon-4",
    title: "Grand World",
    location: "Gành Dầu, Phú Quốc",
    rating: 4.6,
    reviewsCount: "1.1k đánh giá",
    imageUrl: "/profile/grand-world.jpg",
  },
]

// ==========================================
// 20. FAVORITES SCREEN MOCK DATA (YÊU THÍCH)
// ==========================================

export type FavoriteItemCategory = "all" | "stay" | "experience" | "transport"

export interface FavoriteItem {
  readonly id: string
  readonly title: string
  readonly category: FavoriteItemCategory
  readonly categoryLabel: "Lưu trú" | "Trải nghiệm" | "Di chuyển"
  readonly categoryVariant: "purple" | "emerald" | "sky" | "amber"
  readonly rating: number
  readonly reviewsCount: string
  readonly dateOrDuration: string
  readonly location: string
  readonly extraDetail: string
  readonly extraDetailIcon: "users" | "bed" | "ticket"
  readonly price: number
  readonly priceUnit: "/ người" | "/ đêm" | "/ vé"
  readonly imageUrl: string
  readonly targetRoute?: string
}

export interface FavoriteCategoryTab {
  readonly id: FavoriteItemCategory
  readonly label: string
  readonly count: number
}

export const FAVORITE_CATEGORY_TABS: readonly FavoriteCategoryTab[] = [
  { id: "all", label: "Tất cả", count: 5 },
  { id: "stay", label: "Lưu trú", count: 1 },
  { id: "experience", label: "Trải nghiệm", count: 3 },
  { id: "transport", label: "Di chuyển", count: 1 },
]

export const FAVORITE_ITEMS: readonly FavoriteItem[] = [
  {
    id: "fav-1",
    title: "Phú Quốc – Biển xanh, nắng vàng",
    category: "experience",
    categoryLabel: "Trải nghiệm",
    categoryVariant: "emerald",
    rating: 4.8,
    reviewsCount: "320 đánh giá",
    dateOrDuration: "15/06/2025 - 18/06/2025 (4 ngày)",
    location: "Phú Quốc (PQC)",
    extraDetail: "2 - 10 người",
    extraDetailIcon: "users",
    price: 7_500_000,
    priceUnit: "/ người",
    imageUrl: "/profile/bai-sao.jpg",
    targetRoute: "packages",
  },
  {
    id: "fav-2",
    title: "Premier Residences Phu Quoc Emerald Bay",
    category: "stay",
    categoryLabel: "Lưu trú",
    categoryVariant: "purple",
    rating: 4.8,
    reviewsCount: "320 đánh giá",
    dateOrDuration: "15/06/2025 - 18/06/2025 (3 đêm)",
    location: "Bãi Khem, Phú Quốc (PQC)",
    extraDetail: "Phòng Deluxe Ocean View",
    extraDetailIcon: "bed",
    price: 2_000_000,
    priceUnit: "/ đêm",
    imageUrl: "/auth/auth-villa-bg.jpg",
    targetRoute: "stay",
  },
  {
    id: "fav-3",
    title: "Khám phá Hòn Thơm",
    category: "experience",
    categoryLabel: "Trải nghiệm",
    categoryVariant: "sky",
    rating: 4.7,
    reviewsCount: "218 đánh giá",
    dateOrDuration: "12/08/2025 - 14/08/2025 (3 ngày)",
    location: "Phú Quốc (PQC)",
    extraDetail: "2 người",
    extraDetailIcon: "users",
    price: 1_200_000,
    priceUnit: "/ người",
    imageUrl: "/packages/hon-thom-cap-treo.jpg",
    targetRoute: "packages",
  },
  {
    id: "fav-4",
    title: "Vé máy bay Vietjet Air",
    category: "transport",
    categoryLabel: "Di chuyển",
    categoryVariant: "amber",
    rating: 4.6,
    reviewsCount: "156 đánh giá",
    dateOrDuration: "15/06/2025",
    location: "Hà Nội (HAN) → Phú Quốc (PQC)",
    extraDetail: "Hạng phổ thông",
    extraDetailIcon: "ticket",
    price: 4_800_000,
    priceUnit: "/ vé",
    imageUrl: "/deals/plane-vietjet.jpg",
    targetRoute: "transport",
  },
  {
    id: "fav-5",
    title: "Tour lặn ngắm san hô Hòn Thơm",
    category: "experience",
    categoryLabel: "Trải nghiệm",
    categoryVariant: "emerald",
    rating: 4.5,
    reviewsCount: "892 đánh giá",
    dateOrDuration: "17/06/2025",
    location: "Hòn Thơm, Phú Quốc",
    extraDetail: "2 người",
    extraDetailIcon: "users",
    price: 1_000_000,
    priceUnit: "/ người",
    imageUrl: "/experience/snorkeling-nam-dao.jpg",
    targetRoute: "experience",
  },
]

// ==========================================
// 21. MY REVIEWS SCREEN MOCK DATA (ĐÁNH GIÁ CỦA TÔI)
// ==========================================

export type ReviewCategory = "all" | "stay" | "experience" | "transport" | "dining"

export interface UserReviewItem {
  readonly id: string
  readonly title: string
  readonly category: ReviewCategory
  readonly categoryTagLabel: "Khách sạn" | "Trải nghiệm" | "Di chuyển" | "Ẩm thực"
  readonly categoryTagVariant: "sky" | "purple" | "amber" | "emerald"
  readonly date: string
  readonly location: string
  readonly rating: number
  readonly comment: string
  readonly imageUrl: string
  readonly targetRoute?: string
}

export interface ReviewCategoryTab {
  readonly id: ReviewCategory
  readonly label: string
  readonly count: number
}

export const MY_REVIEWS_SUMMARY = {
  averageRating: 4.8,
  totalReviews: 8,
  thankYouMessage: "Cảm ơn bạn đã chia sẻ những trải nghiệm tuyệt vời!",
} as const

export const MY_REVIEWS_TABS: readonly ReviewCategoryTab[] = [
  { id: "all", label: "Tất cả", count: 8 },
  { id: "stay", label: "Lưu trú", count: 2 },
  { id: "experience", label: "Trải nghiệm", count: 3 },
  { id: "transport", label: "Di chuyển", count: 2 },
  { id: "dining", label: "Ẩm thực", count: 1 },
]

export const MY_REVIEWS_ITEMS: readonly UserReviewItem[] = [
  {
    id: "rev-1",
    title: "Premier Residences Phu Quoc Emerald Bay",
    category: "stay",
    categoryTagLabel: "Khách sạn",
    categoryTagVariant: "sky",
    date: "15/06/2025",
    location: "Bãi Khem, Phú Quốc",
    rating: 5,
    comment:
      "Phòng rất đẹp, view biển tuyệt vời và dịch vụ chuyên nghiệp. Nhân viên thân thiện, hỗ trợ nhiệt tình từ lúc check-in đến check-out. Một kỳ nghỉ thật đáng nhớ!",
    imageUrl: "/auth/auth-villa-bg.jpg",
    targetRoute: "stay",
  },
  {
    id: "rev-2",
    title: "Tour lặn ngắm san hô Hòn Thơm",
    category: "experience",
    categoryTagLabel: "Trải nghiệm",
    categoryTagVariant: "sky",
    date: "17/06/2025",
    location: "Hòn Thơm, Phú Quốc",
    rating: 4.8,
    comment:
      "Trải nghiệm tuyệt vời! Nước biển trong xanh, san hô rất đẹp và đa dạng. Hướng dẫn viên nhiệt tình, chu đáo và luôn đảm bảo an toàn cho cả đoàn.",
    imageUrl: "/experience/snorkeling-nam-dao.jpg",
    targetRoute: "experience",
  },
  {
    id: "rev-3",
    title: "Xe đưa đón sân bay",
    category: "transport",
    categoryTagLabel: "Di chuyển",
    categoryTagVariant: "purple",
    date: "12/08/2025",
    location: "Phú Quốc",
    rating: 4.9,
    comment:
      "Dịch vụ đưa đón rất chuyên nghiệp. Tài xế đến đúng giờ, xe sạch sẽ, thoải mái và rất thân thiện. Giúp chuyến đi của mình bắt đầu thật suôn sẻ!",
    imageUrl: "/transport/family-airport-van.jpg",
    targetRoute: "transport",
  },
  {
    id: "rev-4",
    title: "Sunset Sanato",
    category: "experience",
    categoryTagLabel: "Trải nghiệm",
    categoryTagVariant: "sky",
    date: "10/06/2025",
    location: "Dương Đông, Phú Quốc",
    rating: 4.7,
    comment:
      "Không gian nghệ thuật độc đáo, cảnh hoàng hôn cực kỳ đẹp. Rất nhiều góc chụp ảnh ấn tượng, thích hợp cho cả gia đình và cặp đôi. Một điểm đến không nên bỏ lỡ khi đến Phú Quốc!",
    imageUrl: "/profile/sunset-sanato.jpg",
    targetRoute: "experience",
  },
  {
    id: "rev-5",
    title: "Salinda Resort Phu Quoc Island",
    category: "stay",
    categoryTagLabel: "Khách sạn",
    categoryTagVariant: "sky",
    date: "02/05/2025",
    location: "Cửa Lấp, Dương Tơ, Phú Quốc",
    rating: 5,
    comment:
      "Resort sang trọng, hồ bơi điện phân muối lọc cao cấp, bữa sáng buffet phong phú và có nhạc sống piano thư giãn. Rất hài lòng với chất lượng phục vụ tại đây.",
    imageUrl: "/stay/salinda-resort.jpg",
    targetRoute: "stay",
  },
  {
    id: "rev-6",
    title: "Khám phá Hòn Thơm – Cáp treo vượt biển",
    category: "experience",
    categoryTagLabel: "Trải nghiệm",
    categoryTagVariant: "sky",
    date: "28/04/2025",
    location: "An Thới, Phú Quốc",
    rating: 4.8,
    comment:
      "Cáp treo 3 dây vượt biển dài nhất thế giới, tầm nhìn toàn cảnh quần đảo An Thới ngoạn mục. Công viên nước Aquatopia rất sạch và nhiều trò chơi phấn khích.",
    imageUrl: "/packages/hon-thom-cap-treo.jpg",
    targetRoute: "packages",
  },
  {
    id: "rev-7",
    title: "Thuê xe tự lái Toyota Vios 2024",
    category: "transport",
    categoryTagLabel: "Di chuyển",
    categoryTagVariant: "purple",
    date: "15/04/2025",
    location: "Giao nhận xe tại sân bay PQC",
    rating: 4.6,
    comment:
      "Thủ tục nhận xe nhanh chóng, xe mới sạch sẽ điều hòa mát lạnh. Chủ xe hướng dẫn nhiệt tình các cung đường đẹp ở Bắc Đảo và Nam Đảo.",
    imageUrl: "/deals/toyota-vios.jpg",
    targetRoute: "transport",
  },
  {
    id: "rev-8",
    title: "Tour ẩm thực hải sản Chợ đêm Phú Quốc",
    category: "dining",
    categoryTagLabel: "Ẩm thực",
    categoryTagVariant: "amber",
    date: "10/04/2025",
    location: "Chợ đêm Bạch Đằng, Dương Đông",
    rating: 4.7,
    comment:
      "Hải sản tươi sống nướng mỡ hành thơm nức, nhum biển béo ngậy và kẹo chỉ đặc sản rất vui mắt. Tour guide địa phương dẫn vào các quán ăn uy tín không bị chặt chém.",
    imageUrl: "/profile/cho-dem.jpg",
    targetRoute: "experience",
  },
]

// ============================================================================
// SECTION 22: THÔNG TIN CÁ NHÂN (PERSONAL INFO & ACCOUNT DETAILS)
// ============================================================================

export interface UserAccountFormDetails {
  readonly fullName: string
  readonly email: string
  readonly phone: string
  readonly birthDate: string
  readonly gender: string
  readonly nationality: string
  readonly city: string
  readonly address: string
  readonly documentType: string
  readonly documentNumber: string
  readonly documentExpiry: string
  readonly emergencyContactName: string
  readonly emergencyContactPhone: string
  readonly emergencyContactRelation: string
  readonly twoFactorAuth: boolean
  readonly promoNotifications: boolean
}

export const USER_ACCOUNT_FORM_DEFAULT: UserAccountFormDetails = {
  fullName: "",
  email: "",
  phone: "",
  birthDate: "",
  gender: "Khác",
  nationality: "Việt Nam",
  city: "",
  address: "",
  documentType: "CCCD",
  documentNumber: "",
  documentExpiry: "",
  emergencyContactName: "",
  emergencyContactPhone: "",
  emergencyContactRelation: "",
  twoFactorAuth: false,
  promoNotifications: true,
}

export interface StayeaProfileTip {
  readonly id: string
  readonly text: string
}

export const STAYEA_PROFILE_TIPS: readonly StayeaProfileTip[] = [
  {
    id: "tip-1",
    text: "Thông tin chính xác giúp đặt dịch vụ nhanh chóng và thuận tiện hơn.",
  },
  {
    id: "tip-2",
    text: "Cập nhật số điện thoại để nhận thông báo quan trọng về chuyến đi.",
  },
  {
    id: "tip-3",
    text: "Bảo mật tài khoản để giữ an toàn thông tin và giao dịch của bạn.",
  },
]

export const GENDER_OPTIONS: readonly string[] = ["Nam", "Nữ", "Khác"]

export const NATIONALITY_OPTIONS: readonly string[] = [
  "Việt Nam",
  "Hoa Kỳ (United States)",
  "Hàn Quốc (South Korea)",
  "Nhật Bản (Japan)",
  "Úc (Australia)",
  "Pháp (France)",
  "Vương quốc Anh (UK)",
  "Đức (Germany)",
  "Singapore",
  "Khác",
]

export const CITY_OPTIONS: readonly string[] = [
  "Hà Nội",
  "TP. Hồ Chí Minh",
  "Đà Nẵng",
  "Kiên Giang (Phú Quốc)",
  "Cần Thơ",
  "Hải Phòng",
  "Khánh Hòa (Nha Trang)",
  "Lâm Đồng (Đà Lạt)",
  "Quảng Ninh",
  "Khác",
]

export const DOCUMENT_TYPE_OPTIONS: readonly string[] = [
  "CCCD",
  "Hộ chiếu",
  "CMND",
  "Bằng lái xe",
]

export const EMERGENCY_RELATION_OPTIONS: readonly string[] = [
  "Vợ",
  "Chồng",
  "Bố / Cha",
  "Mẹ",
  "Con",
  "Anh / Chị / Em",
  "Bạn bè",
  "Đồng nghiệp",
  "Khác",
]

// ============================================================================
// SECTION 23: PHƯƠNG THỨC THANH TOÁN (PAYMENT METHODS & BILLING)
// ============================================================================

export interface SavedCreditCard {
  readonly id: string
  readonly cardType: "visa" | "mastercard" | "jcb"
  readonly cardNumberMasked: string
  readonly cardHolder: string
  readonly expiryDate: string
  readonly isDefault: boolean
  readonly backgroundGradient: string
}

export const SAVED_CREDIT_CARDS: readonly SavedCreditCard[] = [
  {
    id: "card-visa-4242",
    cardType: "visa",
    cardNumberMasked: "•••• •••• •••• 4242",
    cardHolder: "NGUYỄN MINH",
    expiryDate: "12/28",
    isDefault: true,
    backgroundGradient: "from-[#1D4ED8] via-[#2563EB] to-[#0284C7]",
  },
  {
    id: "card-mastercard-8516",
    cardType: "mastercard",
    cardNumberMasked: "•••• •••• •••• 8516",
    cardHolder: "NGUYỄN MINH",
    expiryDate: "09/27",
    isDefault: false,
    backgroundGradient: "from-[#1E293B] via-[#0F172A] to-[#020617]",
  },
]

export interface LinkedBankAccount {
  readonly id: string
  readonly bankName: string
  readonly bankCode: "vcb" | "tcb" | "bidv" | "mbb"
  readonly accountHolder: string
  readonly accountNumberMasked: string
  readonly logoColor: string
}

export const LINKED_BANK_ACCOUNTS: readonly LinkedBankAccount[] = [
  {
    id: "bank-vcb-257522",
    bankName: "Vietcombank",
    bankCode: "vcb",
    accountHolder: "Chủ tài khoản",
    accountNumberMasked: "**** 257522",
    logoColor: "#007A33",
  },
  {
    id: "bank-tcb-886621",
    bankName: "Techcombank",
    bankCode: "tcb",
    accountHolder: "Chủ tài khoản",
    accountNumberMasked: "**** 886621",
    logoColor: "#E31837",
  },
]

export interface LinkedEWallet {
  readonly id: string
  readonly name: string
  readonly code: "momo" | "zalopay" | "applepay"
  readonly isLinked: boolean
  readonly logoBg: string
}

export const LINKED_E_WALLETS: readonly LinkedEWallet[] = [
  {
    id: "wallet-momo",
    name: "MoMo",
    code: "momo",
    isLinked: false,
    logoBg: "#A50064",
  },
  {
    id: "wallet-zalopay",
    name: "ZaloPay",
    code: "zalopay",
    isLinked: false,
    logoBg: "#0068FF",
  },
  {
    id: "wallet-applepay",
    name: "Apple Pay",
    code: "applepay",
    isLinked: false,
    logoBg: "#000000",
  },
]

export interface BillingInvoiceAddress {
  readonly type: "Cá nhân" | "Doanh nghiệp"
  readonly fullName: string
  readonly email: string
  readonly phone: string
  readonly address: string
  readonly taxId?: string
}

export const DEFAULT_BILLING_ADDRESS: BillingInvoiceAddress = {
  type: "Cá nhân",
  fullName: "Khách hàng",
  email: "",
  phone: "",
  address: "Phú Quốc, Kiên Giang, Việt Nam",
}

export interface RecentPaymentTransaction {
  readonly id: string
  readonly bookingCode: string
  readonly serviceTitle: string
  readonly date: string
  readonly amountFormatted: string
  readonly status: "Đã thanh toán" | "Hoàn tất" | "Đang xử lý"
  readonly imageUrl: string
}

export const RECENT_PAYMENT_TRANSACTIONS: readonly RecentPaymentTransaction[] = [
  {
    id: "tx-1",
    bookingCode: "ST250615001",
    serviceTitle: "Ocean Bay Resort Phú Quốc",
    date: "15/06/2025",
    amountFormatted: "7.500.000đ",
    status: "Đã thanh toán",
    imageUrl: "/stay/salinda-resort.jpg",
  },
  {
    id: "tx-2",
    bookingCode: "ST250616002",
    serviceTitle: "Tour 3 đảo Phú Quốc",
    date: "16/06/2025",
    amountFormatted: "1.200.000đ",
    status: "Đã thanh toán",
    imageUrl: "/experience/snorkeling-nam-dao.jpg",
  },
  {
    id: "tx-3",
    bookingCode: "ST250620014",
    serviceTitle: "Sunset Cruise Phú Quốc",
    date: "20/06/2025",
    amountFormatted: "350.000đ",
    status: "Hoàn tất",
    imageUrl: "/profile/sunset-sanato.jpg",
  },
]

export interface PaymentMethodsMetrics {
  readonly savedMethodsCount: number
  readonly defaultCardTitle: string
  readonly recentTxCount: number
  readonly securityStatus: string
}

export const PAYMENT_METHODS_METRICS: PaymentMethodsMetrics = {
  savedMethodsCount: 3,
  defaultCardTitle: "Visa **** 4242",
  recentTxCount: 12,
  securityStatus: "An toàn",
}

// ============================================================================
// SECTION 24: THÊM PHƯƠNG THỨC THANH TOÁN (ADD PAYMENT METHOD)
// ============================================================================

export interface PaymentMethodTypeOption {
  readonly id: "card" | "bank" | "wallet"
  readonly title: string
  readonly subtitle: string
  readonly iconName: string
}

export const PAYMENT_METHOD_TYPE_OPTIONS: readonly PaymentMethodTypeOption[] = [
  {
    id: "card",
    title: "Thẻ tín dụng/Ghi nợ",
    subtitle: "Visa, Mastercard, JCB...",
    iconName: "credit-card",
  },
  {
    id: "bank",
    title: "Tài khoản ngân hàng",
    subtitle: "Liên kết tài khoản nội địa",
    iconName: "landmark",
  },
  {
    id: "wallet",
    title: "Ví điện tử",
    subtitle: "MoMo, ZaloPay, VNPay...",
    iconName: "wallet",
  },
]

export interface CardBrandOption {
  readonly id: "visa" | "mastercard" | "jcb"
  readonly label: string
}

export const CARD_BRAND_OPTIONS: readonly CardBrandOption[] = [
  { id: "visa", label: "Visa" },
  { id: "mastercard", label: "Mastercard" },
  { id: "jcb", label: "JCB" },
]

export interface PaymentBenefitItem {
  readonly id: string
  readonly title: string
  readonly description: string
  readonly iconName: string
}

export const PAYMENT_BENEFIT_ITEMS: readonly PaymentBenefitItem[] = [
  {
    id: "ben-1",
    title: "Thanh toán nhanh hơn",
    description: "Không cần nhập lại thông tin thẻ mỗi lần đặt dịch vụ.",
    iconName: "zap",
  },
  {
    id: "ben-2",
    title: "Đặt dịch vụ chỉ với vài bước",
    description: "Trải nghiệm đặt phòng, tour, trải nghiệm dễ dàng và tiện lợi hơn.",
    iconName: "file-text",
  },
  {
    id: "ben-3",
    title: "An toàn & bảo mật",
    description: "Thông tin được mã hóa theo tiêu chuẩn quốc tế, bảo vệ tuyệt đối.",
    iconName: "shield-check",
  },
  {
    id: "ben-4",
    title: "Dễ quản lý hóa đơn",
    description: "Theo dõi lịch sử thanh toán và quản lý chi tiêu thuận tiện trong một nơi.",
    iconName: "settings",
  },
]

export interface AcceptedPaymentMethodLogo {
  readonly id: string
  readonly name: string
  readonly type: "visa" | "mastercard" | "jcb" | "applepay" | "momo" | "vnpay"
}

export const ACCEPTED_PAYMENT_METHOD_LOGOS: readonly AcceptedPaymentMethodLogo[] = [
  { id: "p-visa", name: "VISA", type: "visa" },
  { id: "p-mastercard", name: "Mastercard", type: "mastercard" },
  { id: "p-jcb", name: "JCB", type: "jcb" },
  { id: "p-applepay", name: "Apple Pay", type: "applepay" },
  { id: "p-momo", name: "MoMo", type: "momo" },
  { id: "p-vnpay", name: "VNPay", type: "vnpay" },
]

export const SUPPORTED_COUNTRIES: readonly { code: string; name: string; flag: string }[] = [
  { code: "VN", name: "Việt Nam", flag: "🇻🇳" },
  { code: "US", name: "Hoa Kỳ", flag: "🇺🇸" },
  { code: "KR", name: "Hàn Quốc", flag: "🇰🇷" },
  { code: "JP", name: "Nhật Bản", flag: "🇯🇵" },
  { code: "AU", name: "Úc", flag: "🇦🇺" },
  { code: "FR", name: "Pháp", flag: "🇫🇷" },
  { code: "SG", name: "Singapore", flag: "🇸🇬" },
]


// ============================================================================
// SECTION 25: ƯU ĐÃI CỦA TÔI (MY DEALS / MY VOUCHERS)
// ============================================================================

export interface MyDealsMetrics {
  readonly availableCount: number
  readonly savedCount: number
  readonly usedCount: number
  readonly stayaClubPoints: number
}

export const MY_DEALS_METRICS: MyDealsMetrics = {
  availableCount: 8,
  savedCount: 5,
  usedCount: 12,
  stayaClubPoints: 2450,
}

export interface MyVoucherItem {
  readonly id: string
  readonly title: string
  readonly description: string
  readonly category: "all" | "voucher" | "discount" | "member" | "expired"
  readonly code: string
  readonly expiryDate: string
  readonly status: "active" | "expired"
  readonly badgeText: string
  readonly badgeVariant: "emerald" | "purple" | "blue" | "amber" | "gray"
  readonly imageUrl: string
  readonly minSpend?: string
  readonly terms?: string
}

export const MY_VOUCHERS_LIST: readonly MyVoucherItem[] = [
  {
    id: "vouch-1",
    title: "Giảm 10% vé máy bay Vietjet Air",
    description: "Áp dụng chặng Hà Nội - Phú Quốc",
    category: "voucher",
    code: "STAYFLY10",
    expiryDate: "30/06/2025",
    status: "active",
    badgeText: "Còn hiệu lực",
    badgeVariant: "emerald",
    imageUrl: "/deals/vietjet-air.jpg",
    minSpend: "Không giới hạn",
    terms: "Áp dụng khi đặt vé máy bay Vietjet Air chặng Hà Nội - Phú Quốc qua nền tảng STAYEA. Mã giảm trực tiếp 10% trên giá vé cơ bản.",
  },
  {
    id: "vouch-2",
    title: "Miễn phí xe đưa đón sân bay",
    description: "Cho đơn từ 3 đêm lưu trú",
    category: "voucher",
    code: "PICKUPFREE",
    expiryDate: "20/06/2025",
    status: "active",
    badgeText: "Độc quyền",
    badgeVariant: "purple",
    imageUrl: "/deals/van-airport.jpg",
    minSpend: "Đơn đặt phòng tối thiểu 3 đêm",
    terms: "Áp dụng xe Limousine hoặc SUV 7 chỗ đón tiễn 2 chiều sân bay quốc tế Phú Quốc về khách sạn/resort đối tác.",
  },
  {
    id: "vouch-3",
    title: "Giảm 15% tour 3 đảo",
    description: "Áp dụng cho 2 khách trở lên",
    category: "member",
    code: "ISLAND15",
    expiryDate: "28/06/2025",
    status: "active",
    badgeText: "Staya Club",
    badgeVariant: "blue",
    imageUrl: "/experience/tour-3-dao.jpg",
    minSpend: "Tối thiểu 2 khách",
    terms: "Đặc quyền hội viên Staya Club: Khám phá cano cao cấp 3 đảo Nam Phú Quốc kèm bữa trưa hải sản tươi sống và quay chụp flycam miễn phí.",
  },
  {
    id: "vouch-4",
    title: "Nâng hạng phòng Deluxe",
    description: "Tại Premier Residences Phu Quoc Emerald Bay",
    category: "discount",
    code: "UPGRADEDLX",
    expiryDate: "18/06/2025",
    status: "active",
    badgeText: "Giới hạn",
    badgeVariant: "amber",
    imageUrl: "/deals/member-luxury.jpg",
    minSpend: "Đặt từ hạng phòng Superior",
    terms: "Nâng cấp miễn phí lên phòng Deluxe Ocean View tại Premier Residences khi nhận phòng (tùy thuộc vào tình trạng phòng thực tế).",
  },
  {
    id: "vouch-5",
    title: "Giảm 20% Sunset Sanato",
    description: "Áp dụng cho vé tham quan và ẩm thực",
    category: "expired",
    code: "SUNSET20",
    expiryDate: "10/05/2025",
    status: "expired",
    badgeText: "Hết hạn",
    badgeVariant: "gray",
    imageUrl: "/profile/sunset-sanato.jpg",
    minSpend: "Không giới hạn",
    terms: "Voucher đã hết hạn áp dụng vào ngày 10/05/2025. Vui lòng theo dõi các chương trình ưu đãi mùa mới từ STAYEA.",
  },
]

export interface RecommendedDealItem {
  readonly id: string
  readonly title: string
  readonly discountTag: string
  readonly subtitle: string
  readonly imageUrl: string
  readonly actionType: "save" | "view"
}

export const RECOMMENDED_DEALS_LIST: readonly RecommendedDealItem[] = [
  {
    id: "rec-1",
    title: "Combo nghỉ dưỡng Phú Quốc 3N2Đ",
    discountTag: "Giảm đến 20%",
    subtitle: "Kèm bữa sáng + đưa đón",
    imageUrl: "/stay/lahana-villa.jpg",
    actionType: "save",
  },
  {
    id: "rec-2",
    title: "Vé Sun World Phú Quốc",
    discountTag: "Giảm 15%",
    subtitle: "Áp dụng cho vé người lớn",
    imageUrl: "/experience/hon-thom-cable-car.jpg",
    actionType: "save",
  },
  {
    id: "rec-3",
    title: "Ưu đãi spa & chăm sóc sức khỏe",
    discountTag: "Giảm 20%",
    subtitle: "Tại các resort đối tác",
    imageUrl: "/experience/spa-wellness.jpg",
    actionType: "view",
  },
  {
    id: "rec-4",
    title: "Du thuyền ngắm hoàng hôn",
    discountTag: "Giảm 10%",
    subtitle: "Kèm tiệc tối cao cấp",
    imageUrl: "/experience/sunset-cruise.jpg",
    actionType: "save",
  },
]


// ============================================================================
// SECTION 26: STAYEA CLUB (MEMBER REWARDS & PRIVILEGES)
// ============================================================================

export interface StayeaClubProfile {
  readonly memberName: string
  readonly memberTier: string
  readonly memberSince: string
  readonly avatarUrl: string
  readonly currentPoints: number
  readonly nextTier: string
  readonly pointsNeededForNextTier: number
  readonly nextTierThreshold: number
}

export const STAYEA_CLUB_PROFILE: StayeaClubProfile = {
  memberName: "Thành viên STAYEA",
  memberTier: "Thành viên Vàng",
  memberSince: "06/2024",
  avatarUrl: "/profile/profile-avatar.jpg",
  currentPoints: 3280,
  nextTier: "Bạch Kim",
  pointsNeededForNextTier: 720,
  nextTierThreshold: 4000,
}

export interface StayeaClubPerkItem {
  readonly id: string
  readonly title: string
  readonly description: string
  readonly iconName: "ticket" | "coins" | "headphones" | "gift"
  readonly iconBg: string
  readonly iconColor: string
}

export const STAYEA_CLUB_PERKS: readonly StayeaClubPerkItem[] = [
  {
    id: "perk-1",
    title: "Giảm giá độc quyền",
    description: "Ưu đãi riêng chỉ dành cho thành viên Stayea Club",
    iconName: "ticket",
    iconBg: "bg-rose-50",
    iconColor: "text-rose-500",
  },
  {
    id: "perk-2",
    title: "Tích điểm mỗi giao dịch",
    description: "Nhận điểm cho mọi đặt phòng, tour và dịch vụ",
    iconName: "coins",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    id: "perk-3",
    title: "Ưu tiên hỗ trợ 24/7",
    description: "Kênh hỗ trợ riêng cho thành viên",
    iconName: "headphones",
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
  {
    id: "perk-4",
    title: "Quà tặng sinh nhật",
    description: "Nhận ưu đãi đặc biệt vào tháng sinh nhật",
    iconName: "gift",
    iconBg: "bg-purple-50",
    iconColor: "text-purple-600",
  },
]

export interface StayeaClubOfferItem {
  readonly id: string
  readonly title: string
  readonly description: string
  readonly badgeText: string
  readonly badgeVariant: "emerald" | "blue" | "amber" | "cyan"
  readonly expiryDate: string
  readonly imageUrl: string
  readonly buttonText: string
}

export const STAYEA_CLUB_OFFERS: readonly StayeaClubOfferItem[] = [
  {
    id: "club-off-1",
    title: "Giảm 10% vé máy bay",
    description: "Áp dụng cho tất cả chặng bay nội địa và quốc tế",
    badgeText: "Độc quyền",
    badgeVariant: "emerald",
    expiryDate: "30/06/2025",
    imageUrl: "/deals/vietjet-air.jpg",
    buttonText: "Nhận ưu đãi",
  },
  {
    id: "club-off-2",
    title: "Miễn phí đón sân bay",
    description: "Áp dụng cho đơn lưu trú từ 3 đêm",
    badgeText: "Stayea Club",
    badgeVariant: "blue",
    expiryDate: "31/07/2025",
    imageUrl: "/deals/van-airport.jpg",
    buttonText: "Nhận ưu đãi",
  },
  {
    id: "club-off-3",
    title: "Nâng hạng phòng ưu đãi",
    description: "Tại Premier Residences Phu Quoc Emerald Bay",
    badgeText: "Ưu đãi hạng phòng",
    badgeVariant: "amber",
    expiryDate: "30/06/2025",
    imageUrl: "/deals/member-luxury.jpg",
    buttonText: "Xem chi tiết",
  },
  {
    id: "club-off-4",
    title: "Tour ngắm hoàng hôn giảm 15%",
    description: "Khám phá vẻ đẹp Phú Quốc lúc hoàng hôn",
    badgeText: "Trải nghiệm",
    badgeVariant: "cyan",
    expiryDate: "15/07/2025",
    imageUrl: "/experience/sunset-cruise.jpg",
    buttonText: "Nhận ưu đãi",
  },
]

export interface StayeaClubPointsTransaction {
  readonly id: string
  readonly date: string
  readonly activity: string
  readonly points: string
  readonly isPositive: boolean
  readonly status: string
  readonly iconType: "bed" | "palmtree" | "gift" | "percent"
}

export const STAYEA_CLUB_POINTS_HISTORY: readonly StayeaClubPointsTransaction[] = [
  {
    id: "tx-1",
    date: "20/06/2025",
    activity: "Đặt phòng Premier Residences Phu Quoc Emerald Bay",
    points: "+480 điểm",
    isPositive: true,
    status: "Đã cộng",
    iconType: "bed",
  },
  {
    id: "tx-2",
    date: "15/06/2025",
    activity: "Tour lặn ngắm san hô Hòn Thơm",
    points: "+120 điểm",
    isPositive: true,
    status: "Đã cộng",
    iconType: "palmtree",
  },
  {
    id: "tx-3",
    date: "10/06/2025",
    activity: "Vé hạng thưởng sinh nhật",
    points: "+200 điểm",
    isPositive: true,
    status: "Đã cộng",
    iconType: "gift",
  },
  {
    id: "tx-4",
    date: "05/06/2025",
    activity: "Dùng voucher giảm giá",
    points: "-300 điểm",
    isPositive: false,
    status: "Đã trừ",
    iconType: "percent",
  },
]

export interface StayeaClubTierTierItem {
  readonly id: "silver" | "gold" | "platinum"
  readonly name: string
  readonly subtitle: string
  readonly isCurrent?: boolean
  readonly features: readonly string[]
  readonly buttonText: string
  readonly crownColor: string
}

export const STAYEA_CLUB_TIERS: readonly StayeaClubTierTierItem[] = [
  {
    id: "silver",
    name: "Silver",
    subtitle: "Thành viên Bạc",
    isCurrent: false,
    crownColor: "text-slate-400",
    features: ["Giảm giá đến 5%", "Tích 1 điểm/10.000đ", "Hỗ trợ ưu tiên"],
    buttonText: "Xem chi tiết",
  },
  {
    id: "gold",
    name: "Gold",
    subtitle: "Thành viên Vàng",
    isCurrent: true,
    crownColor: "text-amber-500",
    features: [
      "Giảm giá đến 10%",
      "Tích 1,5 điểm/10.000đ",
      "Ưu tiên hỗ trợ 24/7",
      "Quà tặng sinh nhật",
    ],
    buttonText: "Đặc quyền của tôi",
  },
  {
    id: "platinum",
    name: "Platinum",
    subtitle: "Thành viên Bạch Kim",
    isCurrent: false,
    crownColor: "text-indigo-600",
    features: [
      "Giảm giá đến 15%",
      "Tích 2 điểm/10.000đ",
      "Ưu tiên hỗ trợ VIP",
      "Nâng hạng phòng miễn phí",
      "Quà tặng đặc biệt",
    ],
    buttonText: "Xem chi tiết",
  },
]

// ============================================================================
// SECTION 27: STAYEA CLUB CLAIMED OFFER (NHẬN ƯU ĐÃI TRONG STAYEA CLUB)
// ============================================================================

export interface StayeaClubClaimedStep {
  readonly step: number
  readonly title: string
  readonly description: string
}

export interface StayeaClubClaimedOfferDetails {
  readonly id: string
  readonly title: string
  readonly description: string
  readonly badgeText: string
  readonly expiryDate: string
  readonly code: string
  readonly imageUrl: string
  readonly isReceived: boolean
  readonly terms: readonly string[]
  readonly steps: readonly StayeaClubClaimedStep[]
  readonly infoType: string
  readonly infoCode: string
  readonly infoStatus: string
  readonly infoValidUntil: string
  readonly infoApplicableFor: string
  readonly availableVouchersCount: number
}

export interface StayeaClubOtherOfferItem {
  readonly id: string
  readonly title: string
  readonly description: string
  readonly badgeText: string
  readonly badgeVariant: "emerald" | "blue" | "amber" | "cyan"
  readonly expiryDate: string
  readonly imageUrl: string
  readonly buttonText: string
}

export const STAYEA_CLUB_CLAIMED_OFFER: StayeaClubClaimedOfferDetails = {
  id: "claimed-air-1",
  title: "Giảm 10% vé máy bay",
  description: "Áp dụng cho tất cả chặng bay nội địa và quốc tế",
  badgeText: "Độc quyền",
  expiryDate: "30/06/2025",
  code: "STAYEA10AIR",
  imageUrl: "/bookings/vietjet-air.jpg",
  isReceived: true,
  terms: [
    "Giảm 10% trên giá vé cơ bản",
    "Áp dụng cho đơn đặt vé từ 1.500.000đ",
    "Không áp dụng đồng thời với một số khuyến mãi khác",
    "Sử dụng 1 lần cho mỗi tài khoản",
    "Ưu đãi dành riêng cho thành viên Stayea Club",
  ],
  steps: [
    {
      step: 1,
      title: "Chọn chuyến bay",
      description: "Tìm và chọn chuyến bay phù hợp trên Stayea",
    },
    {
      step: 2,
      title: "Nhập mã ưu đãi khi thanh toán",
      description: "Nhập mã STAYEA10AIR trong bước thanh toán",
    },
    {
      step: 3,
      title: "Hoàn tất đặt vé",
      description: "Kiểm tra thông tin và hoàn tất thanh toán",
    },
  ],
  infoType: "Vé máy bay",
  infoCode: "STAYEA10AIR",
  infoStatus: "Đã nhận",
  infoValidUntil: "30/06/2025",
  infoApplicableFor: "Nội địa & quốc tế",
  availableVouchersCount: 13,
}

export const STAYEA_CLUB_OTHER_OFFERS: readonly StayeaClubOtherOfferItem[] = [
  {
    id: "other-off-1",
    title: "Miễn phí đón sân bay",
    description: "Áp dụng cho đơn lưu trú từ 3 đêm",
    badgeText: "Stayea Club",
    badgeVariant: "blue",
    expiryDate: "31/07/2025",
    imageUrl: "/deals/van-airport.jpg",
    buttonText: "Nhận ưu đãi",
  },
  {
    id: "other-off-2",
    title: "Tặng bữa tối hải sản",
    description: "Áp dụng khi đặt combo nghỉ dưỡng 2 đêm",
    badgeText: "Ẩm thực",
    badgeVariant: "amber",
    expiryDate: "10/08/2025",
    imageUrl: "/experience/tour-am-thuc.jpg",
    buttonText: "Nhận ưu đãi",
  },
  {
    id: "other-off-3",
    title: "Tour ngắm hoàng hôn giảm 15%",
    description: "Khám phá vẻ đẹp Phú Quốc lúc hoàng hôn",
    badgeText: "Trải nghiệm",
    badgeVariant: "cyan",
    expiryDate: "15/07/2025",
    imageUrl: "/packages/sunset-cruise.jpg",
    buttonText: "Nhận ưu đãi",
  },
]

// ==========================================
// SECTION 28: STAYEA FLIGHT BOOKING (ĐẶT VÉ MÁY BAY ĐẾN PHÚ QUỐC)
// ==========================================

export type AirlineType = "vietjet" | "bamboo" | "vietnam-airlines" | "vietravel" | "pacific"

export interface FlightAirline {
  readonly id: string
  readonly name: string
  readonly code: string
  readonly type: AirlineType
}

export interface FlightItem {
  readonly id: string
  readonly airline: FlightAirline
  readonly flightNumber: string
  readonly departureTime: string
  readonly departureAirport: string
  readonly arrivalTime: string
  readonly arrivalAirport: string
  readonly duration: string
  readonly stops: string
  readonly originalPrice: number
  readonly price: number
  readonly isRecommended?: boolean
  readonly isClubDiscountApplied?: boolean
}

export interface FlightDateOption {
  readonly id: string
  readonly dayOfWeek: string
  readonly date: string
  readonly priceText: string
  readonly isSelected?: boolean
}

export interface FlightSearchQuery {
  readonly fromCity: string
  readonly fromCode: string
  readonly toCity: string
  readonly toCode: string
  readonly departureDate: string
  readonly returnDate: string
  readonly passengerText: string
  readonly passengerSubtext: string
}

export interface FlightBookingSummary {
  readonly flightId: string
  readonly airlineName: string
  readonly airlineType: AirlineType
  readonly flightNumber: string
  readonly departureTime: string
  readonly departureAirport: string
  readonly arrivalTime: string
  readonly arrivalAirport: string
  readonly travelDate: string
  readonly flightInfo: string
  readonly passengerText: string
  readonly originalTicketPrice: number
  readonly clubDiscountAmount: number
  readonly clubDiscountPercent: number
  readonly taxesAndFees: number
  readonly totalPayment: number
  readonly appliedVoucherCode: string
  readonly appliedVoucherTitle: string
  readonly appliedVoucherDesc: string
}

export const STAYEA_FLIGHT_SEARCH_DEFAULT: FlightSearchQuery = {
  fromCity: "Hà Nội",
  fromCode: "HAN",
  toCity: "Phú Quốc",
  toCode: "PQC",
  departureDate: "19/06/2025",
  returnDate: "22/06/2025",
  passengerText: "1 người",
  passengerSubtext: "1 người lớn, 0 trẻ em, 0 em bé",
}

export const STAYEA_FLIGHT_DATES: readonly FlightDateOption[] = [
  { id: "date-1", dayOfWeek: "Th 4", date: "12/06", priceText: "1.490.000đ" },
  { id: "date-2", dayOfWeek: "Th 5", date: "13/06", priceText: "1.290.000đ" },
  { id: "date-3", dayOfWeek: "Th 6", date: "14/06", priceText: "1.190.000đ" },
  { id: "date-4", dayOfWeek: "Th 7", date: "19/06", priceText: "Từ 1.090.000đ", isSelected: true },
  { id: "date-5", dayOfWeek: "CN", date: "20/06", priceText: "1.190.000đ" },
  { id: "date-6", dayOfWeek: "Th 2", date: "21/06", priceText: "1.290.000đ" },
  { id: "date-7", dayOfWeek: "Th 3", date: "22/06", priceText: "1.350.000đ" },
]

export const STAYEA_FLIGHT_RESULTS: readonly FlightItem[] = [
  {
    id: "fl-1",
    airline: {
      id: "air-vj",
      name: "Vietjet Air",
      code: "VJ",
      type: "vietjet",
    },
    flightNumber: "VJ 458",
    departureTime: "06:10",
    departureAirport: "HAN",
    arrivalTime: "08:20",
    arrivalAirport: "PQC",
    duration: "2h 10m",
    stops: "Bay thẳng",
    originalPrice: 1_090_000,
    price: 981_000,
    isRecommended: true,
    isClubDiscountApplied: true,
  },
  {
    id: "fl-2",
    airline: {
      id: "air-qh",
      name: "Bamboo Airways",
      code: "QH",
      type: "bamboo",
    },
    flightNumber: "QH 1621",
    departureTime: "07:05",
    departureAirport: "HAN",
    arrivalTime: "09:20",
    arrivalAirport: "PQC",
    duration: "2h 15m",
    stops: "Bay thẳng",
    originalPrice: 1_250_000,
    price: 1_250_000,
  },
  {
    id: "fl-3",
    airline: {
      id: "air-vn",
      name: "Vietnam Airlines",
      code: "VN",
      type: "vietnam-airlines",
    },
    flightNumber: "VN 1235",
    departureTime: "09:00",
    departureAirport: "HAN",
    arrivalTime: "11:10",
    arrivalAirport: "PQC",
    duration: "2h 10m",
    stops: "Bay thẳng",
    originalPrice: 1_390_000,
    price: 1_390_000,
  },
  {
    id: "fl-4",
    airline: {
      id: "air-vj-2",
      name: "Vietjet Air",
      code: "VJ",
      type: "vietjet",
    },
    flightNumber: "VJ 456",
    departureTime: "13:20",
    departureAirport: "HAN",
    arrivalTime: "15:35",
    arrivalAirport: "PQC",
    duration: "2h 15m",
    stops: "Bay thẳng",
    originalPrice: 1_290_000,
    price: 1_290_000,
  },
  {
    id: "fl-5",
    airline: {
      id: "air-vn-2",
      name: "Vietnam Airlines",
      code: "VN",
      type: "vietnam-airlines",
    },
    flightNumber: "VN 1237",
    departureTime: "16:40",
    departureAirport: "HAN",
    arrivalTime: "18:50",
    arrivalAirport: "PQC",
    duration: "2h 10m",
    stops: "Bay thẳng",
    originalPrice: 1_490_000,
    price: 1_490_000,
  },
]

export const STAYEA_FLIGHT_BOOKING_SUMMARY: FlightBookingSummary = {
  flightId: "fl-1",
  airlineName: "Vietjet Air",
  airlineType: "vietjet",
  flightNumber: "VJ 458",
  departureTime: "06:10",
  departureAirport: "Hà Nội (HAN)",
  arrivalTime: "08:20",
  arrivalAirport: "Phú Quốc (PQC)",
  travelDate: "Thứ 7, 19/06/2025",
  flightInfo: "Thứ 7, 19/06/2025 | Bay thẳng | 2h 10m",
  passengerText: "1 người lớn",
  originalTicketPrice: 1_090_000,
  clubDiscountAmount: 109_000,
  clubDiscountPercent: 10,
  taxesAndFees: 320_000,
  totalPayment: 1_301_000,
  appliedVoucherCode: "STAYEA10AIR",
  appliedVoucherTitle: "Giảm 10% vé máy bay",
  appliedVoucherDesc: "Áp dụng cho tất cả chặng bay nội địa và quốc tế",
}

// ==========================================
// SECTION 29: STAYEA SETTINGS (CÀI ĐẶT TÀI KHOẢN)
// ==========================================

export interface SettingsAccountSecurity {
  readonly email: string
  readonly phone: string
  readonly isPhoneVerified: boolean
  readonly is2FAEnabled: boolean
}

export interface SettingsNotificationToggles {
  readonly promoEmails: boolean
  readonly tripUpdates: boolean
  readonly itineraryReminders: boolean
  readonly clubOffers: boolean
  readonly supportMessages: boolean
}

export interface SettingsPreferences {
  readonly language: string
  readonly currency: string
  readonly timezone: string
  readonly theme: "light" | "dark" | "system"
}

export interface StayeaSettingsData {
  readonly security: SettingsAccountSecurity
  readonly notifications: SettingsNotificationToggles
  readonly preferences: SettingsPreferences
}

export const STAYEA_SETTINGS_DATA: StayeaSettingsData = {
  security: {
    email: "",
    phone: "",
    isPhoneVerified: false,
    is2FAEnabled: false,
  },
  notifications: {
    promoEmails: true,
    tripUpdates: true,
    itineraryReminders: true,
    clubOffers: true,
    supportMessages: true,
  },
  preferences: {
    language: "Tiếng Việt",
    currency: "VND - Việt Nam Đồng (đ)",
    timezone: "(GMT+7) Bangkok, Hà Nội, Hồ Chí Minh",
    theme: "light",
  },
}
