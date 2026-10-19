#!/usr/bin/env node

/**
 * STAYEA Seed Script
 * ------------------
 * Seeds Accommodations, Experiences, Packages, Flights, Promotions,
 * Loyalty Club Profile, Payment Methods, and Sample Bookings.
 *
 * Usage: pnpm run db:seed:stayea
 */

import { config } from "dotenv"
import { eq } from "drizzle-orm"
import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"

import {
  stayeaAccommodationsTable,
  stayeaExperiencesTable,
  stayeaPackagesTable,
  stayeaFlightsTable,
  stayeaPromotionsTable,
  stayeaClubProfilesTable,
  stayeaClubPointsTransactionsTable,
  stayeaPaymentMethodsTable,
  stayeaBookingsTable,
  stayeaUserSettingsTable,
  usersTable,
} from "../src/schemas/index"

config({ path: ".env" })

const ACCOMMODATIONS_SEED = [
  {
    id: "stay-1",
    title: "Premier Village Phu Quoc Resort",
    slug: "premier-village-phu-quoc-resort",
    location: "Mũi Ông Đội, An Thới, Phú Quốc",
    category: "villa",
    pricePerNight: "8500000",
    originalPrice: "10500000",
    rating: "4.95",
    reviewCount: 328,
    imageUrl: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b",
    gallery: [
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d",
    ],
    badge: "Ưu đãi 20%",
    bedrooms: 3,
    bathrooms: 3,
    maxGuests: 6,
    amenities: [
      { icon: "waves", label: "Hồ bơi vô cực riêng" },
      { icon: "sun", label: "View biển 2 mặt vịnh" },
      { icon: "utensils", label: "Bếp & BBQ riêng" },
      { icon: "wifi", label: "Wi-Fi tốc độ cao" },
    ],
    isFeatured: true,
    hostName: "Stayea Premium Host",
    description: "Biệt thự cao cấp tọa lạc tại Mũi Ông Đội với 2 mặt biển độc nhất vô nhị.",
    cancellationPolicy: "Miễn phí hủy phòng trước 48 giờ",
  },
  {
    id: "stay-2",
    title: "Regent Phu Quoc Luxury Beachfront",
    slug: "regent-phu-quoc-luxury-beachfront",
    location: "Bãi Trường, Dương Tơ, Phú Quốc",
    category: "resort",
    pricePerNight: "14200000",
    originalPrice: "16500000",
    rating: "4.98",
    reviewCount: 245,
    imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945",
    gallery: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4",
    ],
    badge: "Stayea Choice",
    bedrooms: 2,
    bathrooms: 2,
    maxGuests: 4,
    amenities: [
      { icon: "sparkles", label: "Quản gia riêng 24/7" },
      { icon: "coffee", label: "Buffet sáng thượng hạng" },
      { icon: "spa", label: "Liệu trình Spa kèm theo" },
    ],
    isFeatured: true,
    hostName: "Regent Hospitality",
    description: "Khu nghỉ dưỡng 6 sao sang trọng bậc nhất bên bờ biển Bãi Trường nguyên sơ.",
    cancellationPolicy: "Miễn phí hủy phòng trước 7 ngày",
  },
  {
    id: "stay-3",
    title: "JW Marriott Phu Quoc Emerald Bay",
    slug: "jw-marriott-phu-quoc-emerald-bay",
    location: "Bãi Khem, An Thới, Phú Quốc",
    category: "resort",
    pricePerNight: "9800000",
    originalPrice: "12000000",
    rating: "4.92",
    reviewCount: 512,
    imageUrl: "https://images.unsplash.com/photo-1571896349842-33c89424de2d",
    gallery: [
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d",
    ],
    badge: "Hot",
    bedrooms: 1,
    bathrooms: 1,
    maxGuests: 2,
    amenities: [
      { icon: "landmark", label: "Kiến trúc Pháp Bill Bensley" },
      { icon: "umbrella-beach", label: "Bãi cát trắng mịn Bãi Khem" },
    ],
    isFeatured: true,
    hostName: "Marriott International",
    description: "Tuyệt tác kiến trúc đại học giả tưởng độc đáo bên bãi biển đẹp nhất thế giới.",
    cancellationPolicy: "Miễn phí hủy phòng trước 3 ngày",
  },
  {
    id: "stay-4",
    title: "InterContinental Phu Quoc Long Beach Resort",
    slug: "intercontinental-phu-quoc-long-beach-resort",
    location: "Bãi Trường, Dương Tơ, Phú Quốc",
    category: "hotel",
    pricePerNight: "6200000",
    originalPrice: "7500000",
    rating: "4.89",
    reviewCount: 420,
    imageUrl: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4",
    gallery: [],
    badge: "Gia đình yêu thích",
    bedrooms: 1,
    bathrooms: 1,
    maxGuests: 3,
    amenities: [
      { icon: "cocktail", label: "INK 360 Rooftop Bar" },
      { icon: "gamepad", label: "Kids Club lớn nhất đảo" },
    ],
    isFeatured: true,
    hostName: "IHG Hotels & Resorts",
    description: "Khu nghỉ dưỡng lý tưởng cho kỳ nghỉ gia đình với đầy đủ tiện ích và rooftop bar cao nhất đảo.",
    cancellationPolicy: "Miễn phí hủy trước 48 giờ",
  },
]

const EXPERIENCES_SEED = [
  {
    id: "exp-1",
    title: "Tour 4 đảo cáp treo Hòn Thơm & Cano cao tốc ngắm san hô",
    slug: "tour-4-dao-cap-treo-hon-thom-cano-cao-toc",
    location: "Quần đảo An Thới, Phú Quốc",
    category: "tour",
    duration: "8 giờ",
    rating: "4.96",
    reviewCount: 680,
    price: "1050000",
    originalPrice: "1350000",
    imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5",
    gallery: ["https://images.unsplash.com/photo-1544551763-46a013bb70d5"],
    badge: "Bán chạy nhất",
    departureSchedule: "Khởi hành hàng ngày 08:30",
    groupSize: "Nhóm tối đa 15 người",
    highlights: ["Cáp treo vượt biển dài nhất thế giới", "Check-in Hòn Móng Tay, Hòn Gầm Ghì, Hòn Mây Rút", "Quay video Flycam & chụp SUP miễn phí"],
    included: ["Cano cao tốc đời mới", "Vé cáp treo Hòn Thơm & Công viên nước", "Bữa trưa hải sản 8 món", "Kính lặn, ống thở, áo phao"],
    isFeatured: true,
    description: "Hành trình khám phá vẻ đẹp kỳ vĩ của thiên đường biển đảo phía Nam Phú Quốc.",
  },
  {
    id: "exp-2",
    title: "Lặn bình khí (Scuba Diving) ngắm san hô tự nhiên Bãi Trào",
    slug: "lan-binh-khi-scuba-diving-ngam-san-ho",
    location: "Bãi Trào, Hòn Thơm, Phú Quốc",
    category: "diving",
    duration: "4 giờ",
    rating: "4.98",
    reviewCount: 310,
    price: "1450000",
    originalPrice: "1800000",
    imageUrl: "https://images.unsplash.com/photo-1682687220063-4742bd7fd538",
    gallery: [],
    badge: "Chuyên nghiệp",
    departureSchedule: "09:00 & 14:00 hàng ngày",
    groupSize: "1 Huấn luyện viên kèm 1 Khách",
    highlights: ["Trang bị lặn chuyên nghiệp chuẩn PADI", "Chụp ảnh dưới nước kèm clip GoPro"],
    included: ["Toàn bộ trang thiết bị lặn", "Huấn luyện viên riêng", "Nước uống, trái cây tươi"],
    isFeatured: true,
    description: "Thám hiểm hệ sinh thái san hô rực rỡ dưới lòng đại dương cùng chuyên gia lặn biển.",
  },
  {
    id: "exp-3",
    title: "Du thuyền ngắm hoàng hôn vịnh An Thới & Tiệc tối hải sản",
    slug: "du-thuyen-ngam-hoang-hon-vinh-an-thoi",
    location: "Cảng Quốc Tế An Thới, Phú Quốc",
    category: "cruise",
    duration: "4.5 giờ",
    rating: "4.94",
    reviewCount: 220,
    price: "2200000",
    originalPrice: "2600000",
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    gallery: [],
    badge: "Lãng mạn",
    departureSchedule: "Khởi hành 15:30 chiều",
    groupSize: "Tối đa 20 khách",
    highlights: ["Ngắm trọn vẹn hoàng hôn buông xuống biển Tây", "Bữa tối BBQ tôm hùm & rượu vang trên boong tàu"],
    included: ["Du thuyền 2 thân Catamaran sang trọng", "Rượu vang & canape chào đón", "Tiệc tối hải sản cao cấp"],
    isFeatured: true,
    description: "Khoảnh khắc lãng mạn khó quên khi chiêm ngưỡng ánh hoàng hôn rực rỡ buông trên biển khơi.",
  },
]

const PACKAGES_SEED = [
  {
    id: "pkg-1",
    title: "Combo Kỳ Nghỉ Lãng Mạn Phú Quốc 3N2Đ Resort 5 Sao & Vé Máy Bay",
    slug: "combo-ky-nghi-lang-man-phu-quoc-3n2d",
    destination: "Phú Quốc, Kiên Giang",
    duration: "3 ngày 2 đêm",
    rating: "4.97",
    reviewCount: 380,
    price: "6890000",
    originalPrice: "8500000",
    imageUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef",
    badge: "Tiết kiệm 25%",
    audience: "couple",
    includedServices: ["Vé máy bay khứ hồi (HAN/SGN - PQC)", "2 đêm nghỉ phòng Ocean View Resort 5*", "Ăn sáng buffet mỗi ngày", "Xe đưa đón sân bay khứ hồi riêng"],
    itinerarySummary: [
      { day: 1, title: "Đón tại sân bay & Thư giãn hoàng hôn Bãi Trường", activities: ["Đưa đón sân bay về resort", "Check-in & tiệc trà chiều", "Thưởng thức cocktail ngắm hoàng hôn"] },
      { day: 2, title: "Khám phá 4 đảo & Cáp treo vượt biển", activities: ["Cano vi vu quần đảo An Thới", "Lặn ngắm san hô Hòn Gầm Ghì", "Cáp treo hoàng hôn Hòn Thơm"] },
      { day: 3, title: "Mua sắm đặc sản & Tạm biệt Phú Quốc", activities: ["Buffet sáng bên hồ bơi", "Thăm vườn tiêu & nhà thùng nước mắm", "Xe tiễn sân bay Phú Quốc"] },
    ],
    isFeatured: true,
    description: "Gói combo trọn vẹn được thiết kế riêng cho các cặp đôi tìm kiếm kỳ nghỉ ngọt ngào và riêng tư.",
  },
  {
    id: "pkg-2",
    title: "Kỳ Nghỉ Gia Đình Trọn Gói All-Inclusive 4N3Đ VinWonders & Safari",
    slug: "ky-nghi-gia-dinh-tron-goi-all-inclusive-4n3d",
    destination: "Bắc đảo Phú Quốc",
    duration: "4 ngày 3 đêm",
    rating: "4.92",
    reviewCount: 450,
    price: "9950000",
    originalPrice: "12500000",
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    badge: "All-Inclusive",
    audience: "family",
    includedServices: ["Vé máy bay khứ hồi khứ hồi kèm 20kg hành lý", "3 đêm nghỉ Villa 2 phòng ngủ hướng biển", "Vé không giới hạn VinWonders & Vinpearl Safari", "Trọn gói các bữa ăn trong ngày"],
    itinerarySummary: [
      { day: 1, title: "Chào đón tại đảo ngọc & Grand World không ngủ", activities: ["Xe riêng đón sân bay", "Dạo thuyền Venice tại Grand World"] },
      { day: 2, title: "Phiêu lưu Safari bán hoang dã & Công viên chủ đề", activities: ["Khám phá Vinpearl Safari", "Khu trò chơi cảm giác mạnh VinWonders"] },
      { day: 3, title: "Bãi biển Rạch Vẹm & Làng chài sao biển", activities: ["Check-in sao biển Rạch Vẹm", "Thưởng thức hải sản tươi sống"] },
      { day: 4, title: "Nghỉ ngơi thư giãn & Khởi hành về", activities: ["Bơi tại bãi biển riêng resort", "Tiễn sân bay về đất liền"] },
    ],
    isFeatured: true,
    description: "Kỳ nghỉ gia đình đẳng cấp với đầy đủ vé vui chơi giải trí hàng đầu Việt Nam.",
  },
]

const FLIGHTS_SEED = [
  {
    id: "FL-VN1823",
    flightNumber: "VN-1823",
    airlineCode: "VN",
    airlineName: "Vietnam Airlines",
    airlineLogo: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=100&h=100&fit=crop",
    departureAirport: "SGN",
    departureCity: "TP. Hồ Chí Minh",
    arrivalAirport: "PQC",
    arrivalCity: "Phú Quốc",
    departureTime: "06:30",
    arrivalTime: "07:35",
    duration: "1g 05p",
    seatClass: "economy",
    price: "1250000",
    baggageCabin: "12kg",
    baggageChecked: "23kg",
    aircraft: "Airbus A321",
    stops: 0,
    departureDate: "2026-10-25",
  },
  {
    id: "FL-VJ321",
    flightNumber: "VJ-321",
    airlineCode: "VJ",
    airlineName: "Vietjet Air",
    airlineLogo: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=100&h=100&fit=crop",
    departureAirport: "SGN",
    departureCity: "TP. Hồ Chí Minh",
    arrivalAirport: "PQC",
    arrivalCity: "Phú Quốc",
    departureTime: "08:15",
    arrivalTime: "09:20",
    duration: "1g 05p",
    seatClass: "economy",
    price: "890000",
    baggageCabin: "7kg",
    baggageChecked: "0kg",
    aircraft: "Airbus A321neo",
    stops: 0,
    departureDate: "2026-10-25",
  },
  {
    id: "FL-VN1233",
    flightNumber: "VN-1233",
    airlineCode: "VN",
    airlineName: "Vietnam Airlines",
    airlineLogo: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=100&h=100&fit=crop",
    departureAirport: "HAN",
    departureCity: "Hà Nội",
    arrivalAirport: "PQC",
    arrivalCity: "Phú Quốc",
    departureTime: "07:00",
    arrivalTime: "09:15",
    duration: "2g 15p",
    seatClass: "economy",
    price: "1980000",
    baggageCabin: "12kg",
    baggageChecked: "23kg",
    aircraft: "Boeing 787-9",
    stops: 0,
    departureDate: "2026-10-25",
  },
  {
    id: "FL-QH1845",
    flightNumber: "QH-1845",
    airlineCode: "QH",
    airlineName: "Bamboo Airways",
    airlineLogo: "https://images.unsplash.com/photo-1520437358207-323b43b50729?w=100&h=100&fit=crop",
    departureAirport: "HAN",
    departureCity: "Hà Nội",
    arrivalAirport: "PQC",
    arrivalCity: "Phú Quốc",
    departureTime: "10:30",
    arrivalTime: "12:45",
    duration: "2g 15p",
    seatClass: "economy",
    price: "1750000",
    baggageCabin: "7kg",
    baggageChecked: "20kg",
    aircraft: "Embraer 190",
    stops: 0,
    departureDate: "2026-10-25",
  },
  {
    id: "FL-VN1601",
    flightNumber: "VN-1601",
    airlineCode: "VN",
    airlineName: "Vietnam Airlines",
    airlineLogo: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=100&h=100&fit=crop",
    departureAirport: "DAD",
    departureCity: "Đà Nẵng",
    arrivalAirport: "PQC",
    arrivalCity: "Phú Quốc",
    departureTime: "09:00",
    arrivalTime: "10:45",
    duration: "1g 45p",
    seatClass: "economy",
    price: "1450000",
    baggageCabin: "12kg",
    baggageChecked: "23kg",
    aircraft: "Airbus A321",
    stops: 0,
    departureDate: "2026-10-25",
  },
]

const PROMOTIONS_SEED = [
  {
    id: "promo-1",
    code: "STAYEA10AIR",
    title: "Giảm 10% Vé máy bay chặng bay Phú Quốc",
    description: "Áp dụng cho mọi chuyến bay khứ hồi hoặc một chiều đến Phú Quốc trong tháng này.",
    discountType: "percentage" as const,
    discountValue: "10.00",
    maxDiscount: "300000",
    minSpend: "1500000",
    category: "flight",
    badge: "MỚI",
    imageUrl: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05",
    terms: ["Áp dụng cho đặt vé trực tuyến trên Stayea", "Mỗi tài khoản được dùng tối đa 2 lần"],
    isActive: true,
  },
  {
    id: "promo-2",
    code: "SUMMER2026",
    title: "Ưu đãi Mùa hè Rực rỡ - Giảm 15% Đặt Villa & Resort",
    description: "Giảm trực tiếp 15% cho các đơn đặt villa hoặc resort từ 2 đêm trở lên.",
    discountType: "percentage" as const,
    discountValue: "15.00",
    maxDiscount: "1500000",
    minSpend: "4000000",
    category: "stay",
    badge: "HOT",
    imageUrl: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b",
    terms: ["Thời hạn áp dụng đến hết 31/12/2026", "Không áp dụng đồng thời mã ưu đãi khác"],
    isActive: true,
  },
  {
    id: "promo-3",
    code: "CLUBVIP20",
    title: "Đặc quyền Hội viên Stayea Club - Giảm 20%",
    description: "Đặc quyền tri ân dành riêng cho hội viên Gold & Platinum của Stayea Club.",
    discountType: "percentage" as const,
    discountValue: "20.00",
    maxDiscount: "2000000",
    minSpend: "3000000",
    category: "exclusive",
    badge: "VIP",
    imageUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef",
    terms: ["Yêu cầu đăng nhập tài khoản Stayea Club", "Giảm tối đa 2,000,000 VND"],
    isActive: true,
  },
  {
    id: "promo-4",
    code: "COMBO500",
    title: "Giảm 500,000 VND Gói Combo Nghỉ Dưỡng Trọn Gói",
    description: "Giảm ngay 500,000 VND khi đặt các gói combo 3N2Đ hoặc 4N3Đ.",
    discountType: "fixed" as const,
    discountValue: "500000.00",
    minSpend: "5000000",
    category: "combo",
    badge: "TIẾT KIỆM",
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    terms: ["Áp dụng cho tất cả gói Combo trên Stayea", "Mỗi đơn hàng chỉ áp dụng 1 lần"],
    isActive: true,
  },
]

async function seedStayea() {
  const databaseUrl = process.env["DATABASE_URL"]
  if (!databaseUrl) {
    console.error("❌ DATABASE_URL is not configured")
    process.exit(1)
  }

  console.log("🔄 Connecting to Stayea database...")
  const pool = new Pool({ connectionString: databaseUrl })
  const db = drizzle(pool)

  try {
    // 1. Seed Accommodations
    console.log("🏨 Seeding Stayea Accommodations...")
    for (const item of ACCOMMODATIONS_SEED) {
      const [existing] = await db
        .select()
        .from(stayeaAccommodationsTable)
        .where(eq(stayeaAccommodationsTable.id, item.id))
      if (!existing) {
        await db.insert(stayeaAccommodationsTable).values(item)
        console.log(`  + Accommodation added: ${item.title}`)
      }
    }

    // 2. Seed Experiences
    console.log("🌴 Seeding Stayea Experiences...")
    for (const item of EXPERIENCES_SEED) {
      const [existing] = await db
        .select()
        .from(stayeaExperiencesTable)
        .where(eq(stayeaExperiencesTable.id, item.id))
      if (!existing) {
        await db.insert(stayeaExperiencesTable).values(item)
        console.log(`  + Experience added: ${item.title}`)
      }
    }

    // 3. Seed Packages
    console.log("📦 Seeding Stayea Packages...")
    for (const item of PACKAGES_SEED) {
      const [existing] = await db
        .select()
        .from(stayeaPackagesTable)
        .where(eq(stayeaPackagesTable.id, item.id))
      if (!existing) {
        await db.insert(stayeaPackagesTable).values(item)
        console.log(`  + Package added: ${item.title}`)
      }
    }

    // 4. Seed Flights
    console.log("✈️ Seeding Stayea Flights...")
    for (const item of FLIGHTS_SEED) {
      const [existing] = await db
        .select()
        .from(stayeaFlightsTable)
        .where(eq(stayeaFlightsTable.id, item.id))
      if (!existing) {
        await db.insert(stayeaFlightsTable).values(item)
        console.log(`  + Flight added: ${item.flightNumber} (${item.departureAirport} -> ${item.arrivalAirport})`)
      }
    }

    // 5. Seed Promotions
    console.log("🏷️ Seeding Stayea Promotions & Deals...")
    for (const item of PROMOTIONS_SEED) {
      const [existing] = await db
        .select()
        .from(stayeaPromotionsTable)
        .where(eq(stayeaPromotionsTable.code, item.code))
      if (!existing) {
        await db.insert(stayeaPromotionsTable).values(item)
        console.log(`  + Promotion added: ${item.code} (${item.title})`)
      }
    }

    // 6. Seed User Data for existing users (or default test user)
    const [user] = await db.select().from(usersTable).limit(1)
    if (user) {
      console.log(`👤 Seeding Stayea User features for: ${user.email} (${user.id})...`)

      // Stayea Club Profile
      const [existingClub] = await db
        .select()
        .from(stayeaClubProfilesTable)
        .where(eq(stayeaClubProfilesTable.userId, user.id))
      if (!existingClub) {
        await db.insert(stayeaClubProfilesTable).values({
          id: `club-${user.id}`,
          userId: user.id,
          tier: "Gold",
          pointsBalance: 1250,
          pointsToNextTier: 750,
          currentProgressPercent: 65,
          memberSince: "Tháng 03, 2024",
          cardCode: "STY-8899-VIP",
          expiresAt: "31/12/2026",
        })

        await db.insert(stayeaClubPointsTransactionsTable).values([
          {
            id: `ptx-1`,
            userId: user.id,
            points: 500,
            type: "bonus",
            title: "Thưởng gia nhập Stayea Club Gold",
            description: "Đặc quyền khởi đầu",
          },
          {
            id: `ptx-2`,
            userId: user.id,
            points: 750,
            type: "earned",
            title: "Hoàn tất chuyến nghỉ dưỡng Premier Village",
            description: "Tích điểm từ hóa đơn đặt phòng",
          },
        ])
        console.log("  + Stayea Club profile & points initialized")
      }

      // Payment Methods
      const [existingPayment] = await db
        .select()
        .from(stayeaPaymentMethodsTable)
        .where(eq(stayeaPaymentMethodsTable.userId, user.id))
      if (!existingPayment) {
        await db.insert(stayeaPaymentMethodsTable).values([
          {
            id: `pm-1`,
            userId: user.id,
            type: "credit_card",
            brand: "visa",
            title: "Thẻ Visa Platinum •••• 8899",
            isDefault: true,
            details: {
              cardHolder: user.name || "NGUYEN VAN A",
              cardNumberMasked: "•••• 8899",
              expDate: "12/28",
            },
          },
          {
            id: `pm-2`,
            userId: user.id,
            type: "bank_account",
            brand: "vcb",
            title: "Vietcombank Digital Banking",
            isDefault: false,
            details: {
              bankName: "Vietcombank",
              accountNumberMasked: "•••• 5678",
            },
          },
          {
            id: `pm-3`,
            userId: user.id,
            type: "e_wallet",
            brand: "momo",
            title: "Ví Điện Tử MoMo",
            isDefault: false,
            details: {
              walletProvider: "MoMo",
              phoneNumberMasked: "090 •••• 889",
            },
          },
        ])
        console.log("  + Saved payment methods initialized")
      }

      // Sample Booking
      const [existingBooking] = await db
        .select()
        .from(stayeaBookingsTable)
        .where(eq(stayeaBookingsTable.userId, user.id))
      if (!existingBooking) {
        await db.insert(stayeaBookingsTable).values({
          id: `bk-sample-1`,
          bookingCode: "STA-202610-8891",
          userId: user.id,
          bookingType: "stay",
          title: "Premier Village Phu Quoc Resort - Eden Villa",
          destination: "Mũi Ông Đội, An Thới, Phú Quốc",
          startDate: "2026-11-10",
          endDate: "2026-11-14",
          guestCount: 2,
          status: "confirmed",
          paymentStatus: "paid",
          paymentMethod: "credit_card",
          totalAmount: "8500000",
          discountAmount: "850000",
          finalAmount: "7650000",
          currency: "VND",
          voucherCode: "STAYEA10AIR",
          pointsUsed: 0,
          pointsEarned: 153,
          details: {
            stayId: "stay-1",
            roomType: "Eden Bay Sunset Villa 3PN",
            nightCount: 4,
          },
        })
        console.log("  + Sample booking initialized")
      }

      // User Settings
      const [existingSettings] = await db
        .select()
        .from(stayeaUserSettingsTable)
        .where(eq(stayeaUserSettingsTable.userId, user.id))
      if (!existingSettings) {
        await db.insert(stayeaUserSettingsTable).values({
          id: `sett-${user.id}`,
          userId: user.id,
          language: "vi",
          currency: "VND",
          twoFactorEnabled: false,
        })
        console.log("  + User settings initialized")
      }
    }

    console.log("🎉 Stayea Database Seeding completed successfully!")
  } catch (error) {
    console.error("❌ Stayea Seed failed:", error)
    process.exit(1)
  } finally {
    await pool.end()
    console.log("🔒 Database connection closed")
  }
}

await seedStayea()
