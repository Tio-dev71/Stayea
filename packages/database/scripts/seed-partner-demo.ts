import { config } from "dotenv"
import postgres from "postgres"

config({ path: "../../.env" })

const sql = postgres(
  process.env["DATABASE_URL"] ||
    "postgresql://postgres.ujbtzneetqlqclspsfwk:Topmediacto!!!@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres"
)

async function seed() {
  console.log("Seeding Partner Demo data...")

  // 1. Create or ensure partner users
  const partnerUser1 = {
    id: "usr_ptn_sunshine",
    name: "Phú Quốc Sunshine Villa",
    email: "partner.homestay@stayea.com",
    username: "partner_sunshine",
    displayUsername: "Partner Sunshine",
    displayName: "Sunshine Homestay",
    role: "PARTNER",
  }

  const partnerUser2 = {
    id: "usr_ptn_carrent",
    name: "Đội Xe Phú Quốc Car Fleet",
    email: "partner.transport@stayea.com",
    username: "partner_carrent",
    displayUsername: "Partner Car Fleet",
    displayName: "Phú Quốc Car Fleet",
    role: "PARTNER",
  }

  const partnerUser3 = {
    id: "usr_ptn_tour",
    name: "Đảo Ngọc Coral Tours",
    email: "partner.tour@stayea.com",
    username: "partner_tour",
    displayUsername: "Partner Tour Coral",
    displayName: "Coral Tours",
    role: "PARTNER",
  }

  for (const u of [partnerUser1, partnerUser2, partnerUser3]) {
    await sql`
      INSERT INTO users (id, name, email, username, display_username, display_name, role, email_verified)
      VALUES (${u.id}, ${u.name}, ${u.email}, ${u.username}, ${u.displayUsername}, ${u.displayName}, ${u.role}, true)
      ON CONFLICT (email) DO UPDATE SET role = ${u.role}
    `
  }

  // 2. Partner profiles
  const profile1 = {
    id: "ptn_sunshine_01",
    userId: partnerUser1.id,
    businessName: "Phú Quốc Sunshine Homestays & Villas",
    businessType: "homestay",
    contactName: "Nguyễn Văn Phát",
    phone: "0918 234 567",
    email: partnerUser1.email,
    address: "Đường Trần Hưng Đạo, Dương Đông, Phú Quốc",
    city: "Phú Quốc",
    bankName: "Vietcombank Chi nhánh Phú Quốc",
    bankAccount: "0071009876543",
    bankAccountHolder: "NGUYEN VAN PHAT",
    status: "approved",
    commissionRate: "10.00",
    rating: "4.95",
    totalOrders: 18,
  }

  const profile2 = {
    id: "ptn_carrent_02",
    userId: partnerUser2.id,
    businessName: "Đội Xe Tự Lái & Đưa Đón Phú Quốc Express",
    businessType: "transport",
    contactName: "Trần Minh Hoàng",
    phone: "0909 888 999",
    email: partnerUser2.email,
    address: "Khu Phố 7, Phường An Thới, Phú Quốc",
    city: "Phú Quốc",
    bankName: "Techcombank Phú Quốc",
    bankAccount: "19034567891011",
    bankAccountHolder: "TRAN MINH HOANG",
    status: "approved",
    commissionRate: "12.00",
    rating: "4.90",
    totalOrders: 42,
  }

  const profile3 = {
    id: "ptn_tour_03",
    userId: partnerUser3.id,
    businessName: "Đảo Ngọc Coral & Speedboat Tours",
    businessType: "tour",
    contactName: "Lê Cẩm Tú",
    phone: "0933 112 233",
    email: partnerUser3.email,
    address: "Cảng Quốc Tế An Thới, Phú Quốc",
    city: "Phú Quốc",
    bankName: "MBBank",
    bankAccount: "88880933112233",
    bankAccountHolder: "LE CAM TU",
    status: "approved",
    commissionRate: "15.00",
    rating: "5.00",
    totalOrders: 65,
  }

  for (const p of [profile1, profile2, profile3]) {
    await sql`
      INSERT INTO stayea_partner_profiles (
        id, user_id, business_name, business_type, contact_name, phone, email,
        address, city, bank_name, bank_account, bank_account_holder, status,
        commission_rate, rating, total_orders
      ) VALUES (
        ${p.id}, ${p.userId}, ${p.businessName}, ${p.businessType}, ${p.contactName},
        ${p.phone}, ${p.email}, ${p.address}, ${p.city}, ${p.bankName},
        ${p.bankAccount}, ${p.bankAccountHolder}, ${p.status}, ${p.commissionRate},
        ${p.rating}, ${p.totalOrders}
      )
      ON CONFLICT (id) DO UPDATE SET
        business_name = ${p.businessName},
        phone = ${p.phone},
        status = ${p.status}
    `
  }

  // 3. Partner Services
  const services = [
    {
      id: "svc_villa_sunset",
      partnerId: profile1.id,
      serviceType: "stay",
      title: "Villa Biển Hoàng Hôn 3 Phòng Ngủ",
      description: "Villa riêng biệt sát biển Bãi Trường, hồ bơi vô cực view biển ngắm hoàng hôn, sân BBQ và bếp tiện nghi cao cấp.",
      location: "Bãi Trường, Dương Tơ, Phú Quốc",
      price: "2500000",
      originalPrice: "3200000",
      unit: "đêm",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b",
        "https://images.unsplash.com/photo-1566073771259-6a8506099945",
      ]),
      attributes: JSON.stringify({
        bedrooms: 3,
        bathrooms: 3,
        maxGuests: 6,
        amenities: ["Hồ bơi vô cực", "Bếp gia đình", "Tiệc BBQ", "Xe đạp miễn phí", "Wifi 200Mbps"],
      }),
      status: "active",
    },
    {
      id: "svc_bungalow_eco",
      partnerId: profile1.id,
      serviceType: "stay",
      title: "Bungalow Vườn Đồi Sim Yên Bình",
      description: "Bungalow gỗ mộc ấm cúng giữa vườn sim Phú Quốc, view suối đá tự nhiên, không gian thư giãn tuyệt đối.",
      location: "Ấp Suối Đá, Dương Tơ, Phú Quốc",
      price: "850000",
      originalPrice: "1100000",
      unit: "đêm",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6",
      ]),
      attributes: JSON.stringify({
        bedrooms: 1,
        bathrooms: 1,
        maxGuests: 2,
        amenities: ["Ban công view đồi", "Khu cắm trại", "Bữa sáng địa phương miễn phí"],
      }),
      status: "active",
    },
    {
      id: "svc_car_xpander",
      partnerId: profile2.id,
      serviceType: "transport",
      title: "Xe 7 Chỗ Mitsubishi Xpander Tự Lái Mới 2025",
      description: "Xe 7 chỗ rộng rãi số tự động, tiết kiệm nhiên liệu, trang bị camera hành trình, bảo hiểm 2 chiều, giao xe miễn phí sân bay.",
      location: "Giao xe toàn đảo Phú Quốc",
      price: "900000",
      originalPrice: "1100000",
      unit: "ngày",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1549399542-7e3f8b79c341",
      ]),
      attributes: JSON.stringify({
        vehicleType: "xe_7_cho",
        transmission: "tu_dong",
        hasDriver: false,
        amenities: ["Giao nhận sân bay miễn phí", "Hỗ trợ 24/7", "Camera hành trình Vietmap", "Bảo hiểm vật chất"],
      }),
      status: "active",
    },
    {
      id: "svc_car_fortuner_driver",
      partnerId: profile2.id,
      serviceType: "transport",
      title: "Xe Fortuner 7 Chỗ Có Tài Xế Phục Vụ Tour Trọn Ngày",
      description: "Tài xế người địa phương am hiểu điểm vui chơi, thái độ nhiệt tình, bao trọn tuyến Nam Đảo hoặc Bắc Đảo trong 8 tiếng.",
      location: "Toàn đảo Phú Quốc",
      price: "1400000",
      originalPrice: "1700000",
      unit: "chuyến (8 tiếng)",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf",
      ]),
      attributes: JSON.stringify({
        vehicleType: "xe_7_cho",
        transmission: "tu_dong",
        hasDriver: true,
        duration: "8 giờ",
        amenities: ["Tài xế bản địa", "Nước khoáng & khăn lạnh miễn phí", "Nhiên liệu bao gồm", "Không phụ phí phát sinh"],
      }),
      status: "active",
    },
    {
      id: "svc_tour_4dao",
      partnerId: profile3.id,
      serviceType: "experience",
      title: "Tour Canô Cao Tốc 4 Đảo Lặn San Hô & Quay Flycam",
      description: "Trải nghiệm canô cao tốc lướt sóng qua Hòn Móng Tay, Gầm Ghì, Mây Rút Trong & Ngoài. Tặng video Flycam chuyên nghiệp.",
      location: "Quần đảo An Thới, Phú Quốc",
      price: "750000",
      originalPrice: "950000",
      unit: "vé/khách",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1544551763-46a013bb70d5",
      ]),
      attributes: JSON.stringify({
        schedule: "08:30 - 16:30 hằng ngày",
        duration: "8 tiếng",
        amenities: ["Canô SB cao cấp", "Ăn trưa hải sản 8 món", "Quay chụp Flycam miễn phí", "Kính lặn ống thở"],
      }),
      status: "active",
    },
  ]

  for (const s of services) {
    await sql`
      INSERT INTO stayea_partner_services (
        id, partner_id, service_type, title, description, location,
        price, original_price, unit, images, attributes, status
      ) VALUES (
        ${s.id}, ${s.partnerId}, ${s.serviceType}, ${s.title}, ${s.description}, ${s.location},
        ${s.price}, ${s.originalPrice}, ${s.unit}, ${s.images}::jsonb, ${s.attributes}::jsonb, ${s.status}
      )
      ON CONFLICT (id) DO UPDATE SET
        title = ${s.title},
        price = ${s.price},
        status = ${s.status}
    `
  }

  // 4. Partner Orders across the lifecycle:
  const orders = [
    // 1. Chờ Admin duyệt (Created via AI Agent)
    {
      id: "pord_demo_01",
      orderCode: "STY-ORD-20261029-AI01",
      partnerId: profile2.id,
      serviceId: "svc_car_xpander",
      customerName: "Nguyễn Thu Hà",
      customerPhone: "0987 654 321",
      customerEmail: "thuha.travel@gmail.com",
      serviceTitle: "Xe 7 Chỗ Mitsubishi Xpander Tự Lái Mới 2025",
      serviceType: "transport",
      startDate: "2026-11-02",
      endDate: "2026-11-05",
      quantity: 3,
      unitPrice: "900000",
      totalAmount: "2700000",
      commissionAmount: "324000",
      partnerPayoutAmount: "2376000",
      status: "pending_admin",
      source: "ai_agent",
      adminNotes: "AI Agent vừa tạo đơn theo yêu cầu khách. Khách đến sân bay Phú Quốc lúc 11:30 ngày 02/11.",
    },
    // 2. Admin đã duyệt -> Chờ Đối Tác xác nhận nhận đơn
    {
      id: "pord_demo_02",
      orderCode: "STY-ORD-20261029-DISP02",
      partnerId: profile1.id,
      serviceId: "svc_villa_sunset",
      customerName: "Đoàn Gia Đình Anh Vũ",
      customerPhone: "0912 345 999",
      customerEmail: "vudoan@vietholding.vn",
      serviceTitle: "Villa Biển Hoàng Hôn 3 Phòng Ngủ",
      serviceType: "stay",
      startDate: "2026-11-10",
      endDate: "2026-11-13",
      quantity: 3,
      unitPrice: "2500000",
      totalAmount: "7500000",
      commissionAmount: "750000",
      partnerPayoutAmount: "6750000",
      status: "sent_to_partner",
      source: "direct_customer",
      adminNotes: "Admin đã kiểm tra cọc 50%. Chuyển đơn tới Sunshine Villa để chuẩn bị đón khách.",
    },
    // 3. Đối tác đã tiếp nhận (partner_accepted)
    {
      id: "pord_demo_03",
      orderCode: "STY-ORD-20261025-ACC03",
      partnerId: profile1.id,
      serviceId: "svc_bungalow_eco",
      customerName: "Chị Mai Phương",
      customerPhone: "0934 567 890",
      customerEmail: "maiphuong@gmail.com",
      serviceTitle: "Bungalow Vườn Đồi Sim Yên Bình",
      serviceType: "stay",
      startDate: "2026-11-01",
      endDate: "2026-11-03",
      quantity: 2,
      unitPrice: "850000",
      totalAmount: "1700000",
      commissionAmount: "170000",
      partnerPayoutAmount: "1530000",
      status: "partner_accepted",
      source: "direct_customer",
      partnerNotes: "Đã bố trí Bungalow số 03 view hồ suối, tặng kèm 1 giỏ trái cây tươi đón khách.",
    },
    // 4. Đơn hoàn thành (completed)
    {
      id: "pord_demo_04",
      orderCode: "STY-ORD-20261020-CMP04",
      partnerId: profile3.id,
      serviceId: "svc_tour_4dao",
      customerName: "Nhóm Bạn Hoàng Yến (8 người)",
      customerPhone: "0977 443 322",
      customerEmail: "hoangyen.pq@outlook.com",
      serviceTitle: "Tour Canô Cao Tốc 4 Đảo Lặn San Hô & Quay Flycam",
      serviceType: "experience",
      startDate: "2026-10-26",
      endDate: "2026-10-26",
      quantity: 8,
      unitPrice: "750000",
      totalAmount: "6000000",
      commissionAmount: "900000",
      partnerPayoutAmount: "5100000",
      status: "completed",
      source: "direct_customer",
      partnerNotes: "Đã hoàn thành tour 4 đảo tuyệt vời, khách rất hài lòng và đánh giá 5 sao.",
    },
  ]

  for (const o of orders) {
    await sql`
      INSERT INTO stayea_partner_orders (
        id, order_code, partner_id, service_id, customer_name, customer_phone,
        customer_email, service_title, service_type, start_date, end_date,
        quantity, unit_price, total_amount, commission_amount, partner_payout_amount,
        status, source, admin_notes, partner_notes
      ) VALUES (
        ${o.id}, ${o.orderCode}, ${o.partnerId}, ${o.serviceId}, ${o.customerName},
        ${o.customerPhone}, ${o.customerEmail}, ${o.serviceTitle}, ${o.serviceType},
        ${o.startDate}, ${o.endDate}, ${o.quantity}, ${o.unitPrice}, ${o.totalAmount},
        ${o.commissionAmount}, ${o.partnerPayoutAmount}, ${o.status}, ${o.source},
        ${o.adminNotes || null}, ${o.partnerNotes || null}
      )
      ON CONFLICT (order_code) DO UPDATE SET
        status = ${o.status},
        admin_notes = ${o.adminNotes || null},
        partner_notes = ${o.partnerNotes || null}
    `
  }

  console.log("Successfully seeded Partner demo profiles, services, and orders!")
  await sql.end()
}

seed().catch((err) => {
  console.error("Seed failed:", err)
  process.exit(1)
})
