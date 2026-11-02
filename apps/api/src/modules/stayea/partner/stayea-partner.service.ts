import { randomUUID } from "node:crypto"
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common"
import type { OnModuleInit } from "@nestjs/common"
import {
  partnerInventoryTable,
  partnerOrdersTable,
  partnerProfilesTable,
  partnerServicesTable,
  stayeaAccommodationsTable,
  stayeaBookingsTable,
  stayeaExperiencesTable,
  usersTable,
} from "@workspace/database"
import { and, desc, eq, gte, ilike, inArray, lte, or, sql } from "drizzle-orm"

import { DB_TOKEN } from "@/app/database/db.port"
import type {
  AdminApproveOrderDto,
  AdminCreatePartnerDto,
  AdminUpdatePartnerStatusDto,
  AdminUpdateServiceStatusDto,
  BulkUpdateInventoryDto,
  CreateDraftOrderDto,
  CreatePartnerServiceDto,
  PartnerOrderRespondDto,
  RegisterPartnerDto,
  UpdatePartnerProfileDto,
  UpdatePartnerServiceDto,
} from "@/modules/stayea/partner/dtos/partner.dto"

import type { DrizzleDb } from "@/app/database/db.port"

function generateUid(prefix: string) {
  return `${prefix}_${randomUUID().replace(/-/g, "").slice(0, 12)}`
}

function toSlug(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

@Injectable()
export class StayeaPartnerService implements OnModuleInit {
  constructor(@Inject(DB_TOKEN) private readonly db: DrizzleDb) {}

  async onModuleInit() {
    await this.syncAllExistingPartnerServices()
  }

  async syncServiceToCatalog(service: any, hostName?: string) {
    try {
      const defaultStayImg = "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b"
      const defaultExpImg = "https://images.unsplash.com/photo-1544551763-46a013bb70d5"
      const images: string[] = Array.isArray(service.images) && service.images.length > 0
        ? service.images
        : []
      const attrs = (service.attributes as any) || {}

      if (service.serviceType === "stay") {
        const slug = `${toSlug(service.title || "villa")}-${service.id}`
        const cat = attrs.category || 
          (/homestay/i.test(service.title) ? "homestay" : /căn hộ|apartment/i.test(service.title) ? "apartment" : /khách sạn|hotel/i.test(service.title) ? "hotel" : "villa")
        const rawAmenities: string[] = Array.isArray(attrs.amenities) ? attrs.amenities : []
        const mappedAmenities = rawAmenities.map((a: string) => ({
          icon: "check",
          label: a,
        }))
        const img = images[0] || defaultStayImg

        await this.db
          .insert(stayeaAccommodationsTable)
          .values({
            id: service.id,
            title: service.title,
            slug,
            location: service.location || "Phú Quốc",
            category: cat,
            pricePerNight: service.price ? service.price.toString() : "1500000",
            originalPrice: service.originalPrice ? service.originalPrice.toString() : null,
            rating: "5.00",
            reviewCount: 1,
            imageUrl: img,
            gallery: images.length > 0 ? images : [img],
            badge: "Đối tác xác thực",
            bedrooms: Number(attrs.bedrooms) || 1,
            bathrooms: Number(attrs.bathrooms) || 1,
            maxGuests: Number(attrs.maxGuests) || 2,
            amenities: mappedAmenities,
            isFeatured: true,
            hostName: hostName || "Đối tác STAYEA",
            description: service.description || "",
            cancellationPolicy: "Miễn phí hủy phòng trước 48 giờ",
          })
          .onConflictDoUpdate({
            target: stayeaAccommodationsTable.id,
            set: {
              title: service.title,
              location: service.location || "Phú Quốc",
              category: cat,
              pricePerNight: service.price ? service.price.toString() : "1500000",
              originalPrice: service.originalPrice ? service.originalPrice.toString() : null,
              imageUrl: img,
              gallery: images.length > 0 ? images : [img],
              bedrooms: Number(attrs.bedrooms) || 1,
              bathrooms: Number(attrs.bathrooms) || 1,
              maxGuests: Number(attrs.maxGuests) || 2,
              amenities: mappedAmenities,
              description: service.description || "",
              hostName: hostName || "Đối tác STAYEA",
              updatedAt: new Date(),
            },
          })
      } else if (service.serviceType === "experience") {
        const slug = `${toSlug(service.title || "tour")}-${service.id}`
        const img = images[0] || defaultExpImg

        await this.db
          .insert(stayeaExperiencesTable)
          .values({
            id: service.id,
            title: service.title,
            slug,
            location: service.location || "Phú Quốc",
            category: attrs.category || "tour",
            duration: attrs.duration || "1 ngày",
            rating: "5.00",
            reviewCount: 1,
            price: service.price ? service.price.toString() : "850000",
            originalPrice: service.originalPrice ? service.originalPrice.toString() : null,
            imageUrl: img,
            gallery: images.length > 0 ? images : [img],
            badge: "Tour trải nghiệm",
            departureSchedule: attrs.schedule || "Hàng ngày",
            groupSize: "1-15 khách",
            highlights: attrs.amenities || ["Hướng dẫn viên", "Nước suối"],
            included: ["Xe đưa đón", "Nước suối", "Bảo hiểm du lịch"],
            isFeatured: true,
            description: service.description || "",
          })
          .onConflictDoUpdate({
            target: stayeaExperiencesTable.id,
            set: {
              title: service.title,
              location: service.location || "Phú Quốc",
              price: service.price ? service.price.toString() : "850000",
              originalPrice: service.originalPrice ? service.originalPrice.toString() : null,
              imageUrl: img,
              gallery: images.length > 0 ? images : [img],
              description: service.description || "",
              updatedAt: new Date(),
            },
          })
      }
    } catch (err) {
      console.error(`[StayeaPartnerService] Error syncing service ${service?.id} to catalog:`, err)
    }
  }

  async syncAllExistingPartnerServices() {
    try {
      const services = await this.db
        .select()
        .from(partnerServicesTable)
        .where(eq(partnerServicesTable.status, "active"))

      for (const s of services) {
        let hostName = "Đối tác STAYEA"
        try {
          const [p] = await this.db
            .select()
            .from(partnerProfilesTable)
            .where(eq(partnerProfilesTable.id, s.partnerId))
            .limit(1)
          if (p) hostName = p.contactName || p.businessName
        } catch {}

        await this.syncServiceToCatalog(s, hostName)
      }
      console.log(`[StayeaPartnerService] Synced ${services.length} active partner services to catalog tables.`)
    } catch (err) {
      console.error("[StayeaPartnerService] Error syncing existing services:", err)
    }
  }

  // ==========================================
  // 1. PARTNER PROFILE MANAGEMENT
  // ==========================================

  async getProfileByUserId(userId: string) {
    const [profile] = await this.db
      .select()
      .from(partnerProfilesTable)
      .where(eq(partnerProfilesTable.userId, userId))
      .orderBy(desc(partnerProfilesTable.createdAt))
      .limit(1)

    return profile || null
  }

  async getAllProfilesByUserId(userId: string) {
    return this.db
      .select()
      .from(partnerProfilesTable)
      .where(eq(partnerProfilesTable.userId, userId))
      .orderBy(desc(partnerProfilesTable.createdAt))
  }

  async getProfileById(id: string) {
    const [profile] = await this.db
      .select()
      .from(partnerProfilesTable)
      .where(eq(partnerProfilesTable.id, id))
      .limit(1)

    if (!profile) {
      throw new NotFoundException(`Partner with ID "${id}" not found`)
    }
    return profile
  }

  async registerPartner(userId: string, dto: RegisterPartnerDto) {
    const partnerId = generateUid("ptn")

    const [newProfile] = await this.db
      .insert(partnerProfilesTable)
      .values({
        id: partnerId,
        userId,
        businessName: dto.businessName,
        businessType: dto.businessType,
        contactName: dto.contactName,
        phone: dto.phone,
        email: dto.email,
        address: dto.address,
        city: dto.city || "Phú Quốc",
        taxId: dto.taxId,
        bankName: dto.bankName,
        bankAccount: dto.bankAccount,
        bankAccountHolder: dto.bankAccountHolder,
        status: "approved",
        commissionRate: "10.00",
        rating: "0.00",
        totalOrders: 0,
        metadata: {},
      })
      .returning()

    // Elevate user role to PARTNER if they were USER
    await this.db
      .update(usersTable)
      .set({ role: "PARTNER" })
      .where(and(eq(usersTable.id, userId), eq(usersTable.role, "USER")))

    return newProfile
  }

  async updateProfile(userId: string, dto: UpdatePartnerProfileDto) {
    const profile = await this.getProfileByUserId(userId)
    if (!profile) {
      throw new NotFoundException("Chưa tìm thấy hồ sơ đối tác")
    }

    const [updated] = await this.db
      .update(partnerProfilesTable)
      .set({
        ...(dto.businessName ? { businessName: dto.businessName } : {}),
        ...(dto.contactName ? { contactName: dto.contactName } : {}),
        ...(dto.phone ? { phone: dto.phone } : {}),
        ...(dto.email ? { email: dto.email } : {}),
        ...(dto.address !== undefined ? { address: dto.address } : {}),
        ...(dto.city ? { city: dto.city } : {}),
        ...(dto.taxId !== undefined ? { taxId: dto.taxId } : {}),
        ...(dto.bankName !== undefined ? { bankName: dto.bankName } : {}),
        ...(dto.bankAccount !== undefined ? { bankAccount: dto.bankAccount } : {}),
        ...(dto.bankAccountHolder !== undefined
          ? { bankAccountHolder: dto.bankAccountHolder }
          : {}),
      })
      .where(eq(partnerProfilesTable.id, profile.id))
      .returning()

    return updated
  }

  async getAllPartnersForAdmin(query?: { search?: string; status?: string; type?: string }) {
    let conditions = []

    if (query?.status) {
      conditions.push(eq(partnerProfilesTable.status, query.status as any))
    }
    if (query?.type) {
      conditions.push(eq(partnerProfilesTable.businessType, query.type as any))
    }
    if (query?.search) {
      const s = `%${query.search}%`
      conditions.push(
        or(
          ilike(partnerProfilesTable.businessName, s),
          ilike(partnerProfilesTable.contactName, s),
          ilike(partnerProfilesTable.phone, s),
          ilike(partnerProfilesTable.email, s)
        )
      )
    }

    const partners = await this.db
      .select()
      .from(partnerProfilesTable)
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(desc(partnerProfilesTable.createdAt))

    return partners
  }

  async adminUpdatePartnerStatus(id: string, dto: AdminUpdatePartnerStatusDto) {
    const partner = await this.getProfileById(id)
    const [updated] = await this.db
      .update(partnerProfilesTable)
      .set({
        status: dto.status,
        ...(dto.commissionRate !== undefined
          ? { commissionRate: dto.commissionRate.toFixed(2) }
          : {}),
        ...(dto.adminNotes
          ? {
              metadata: {
                ...(partner.metadata || {}),
                adminNotes: dto.adminNotes,
                reviewedAt: new Date().toISOString(),
              },
            }
          : {}),
        updatedAt: new Date(),
      })
      .where(eq(partnerProfilesTable.id, partner.id))
      .returning()

    return updated
  }

  async adminCreatePartner(dto: AdminCreatePartnerDto) {
    const partnerId = generateUid("ptn")
    const userId = generateUid("usr_partner")

    const [newProfile] = await this.db
      .insert(partnerProfilesTable)
      .values({
        id: partnerId,
        userId,
        businessName: dto.businessName,
        businessType: dto.businessType || "homestay",
        contactName: dto.contactName,
        phone: dto.phone,
        email: dto.email,
        address: dto.address,
        city: dto.city || "Phú Quốc",
        taxId: dto.taxId,
        bankName: dto.bankName,
        bankAccount: dto.bankAccount,
        bankAccountHolder: dto.bankAccountHolder,
        status: dto.status || "approved",
        commissionRate: (dto.commissionRate || 10).toFixed(2),
        rating: "0.00",
        totalOrders: 0,
        metadata: {},
      })
      .returning()

    return newProfile
  }

  // ==========================================
  // 2. PARTNER SERVICES (HOMESTAYS, CARS, TOURS)
  // ==========================================

  async getPartnerServices(partnerId: string) {
    return this.db
      .select()
      .from(partnerServicesTable)
      .where(eq(partnerServicesTable.partnerId, partnerId))
      .orderBy(desc(partnerServicesTable.createdAt))
  }

  async getAllActiveServices(query?: {
    type?: string
    search?: string
    location?: string
    partnerId?: string
  }) {
    const approvedPartners = await this.db
      .select({ id: partnerProfilesTable.id })
      .from(partnerProfilesTable)
      .where(eq(partnerProfilesTable.status, "approved"))
    const approvedPartnerIds = approvedPartners.map((partner) => partner.id)
    if (approvedPartnerIds.length === 0) return []
    const conditions = [
      eq(partnerServicesTable.status, "active"),
      inArray(partnerServicesTable.partnerId, approvedPartnerIds),
    ]

    if (query?.partnerId) {
      conditions.push(eq(partnerServicesTable.partnerId, query.partnerId))
    }
    if (query?.type) {
      conditions.push(eq(partnerServicesTable.serviceType, query.type as any))
    }
    if (query?.location) {
      conditions.push(ilike(partnerServicesTable.location, `%${query.location}%`))
    }
    if (query?.search) {
      const s = `%${query.search}%`
      conditions.push(
        sql`(${partnerServicesTable.title} ILIKE ${s} OR coalesce(${partnerServicesTable.description}, '') ILIKE ${s} OR ${partnerServicesTable.location} ILIKE ${s})`
      )
    }

    return this.db
      .select()
      .from(partnerServicesTable)
      .where(and(...conditions))
      .orderBy(desc(partnerServicesTable.createdAt))
  }

  async createService(
    partnerId: string,
    dto: CreatePartnerServiceDto,
    userId?: string
  ) {
    let profile: any
    try {
      profile = await this.getProfileById(partnerId)
    } catch {
      profile = null
    }

    if (!profile) {
      let realUser: any = null
      if (userId) {
        const [u] = await this.db
          .select()
          .from(usersTable)
          .where(eq(usersTable.id, userId))
          .limit(1)
        realUser = u
      }

      const [created] = await this.db
        .insert(partnerProfilesTable)
        .values({
          id: partnerId,
          userId: realUser?.id || userId || generateUid("usr_partner"),
          businessName: realUser?.name
            ? `Cơ sở ${realUser.name}`
            : "Cơ sở đối tác",
          businessType:
            dto.serviceType === "transport"
              ? "transport"
              : dto.serviceType === "experience"
              ? "tour"
              : "homestay",
          contactName: realUser?.name || "Chủ cơ sở",
          phone: realUser?.phone || "",
          email: realUser?.email || "partner@stayea.com",
          address: dto.location || "Phú Quốc",
          city: "Phú Quốc",
          status: "approved",
          commissionRate: "10.00",
          rating: "0.00",
          totalOrders: 0,
          metadata: {},
        })
        .onConflictDoNothing()
        .returning()

      profile = created || (await this.getProfileById(partnerId))
    }

    const serviceId = generateUid("svc")
    const isPartnerApproved = profile.status === "approved"
    const serviceStatus =
      (dto.status as "active" | "inactive" | "pending_approval") ||
      (isPartnerApproved ? "active" : "pending_approval")

    const [service] = await this.db
      .insert(partnerServicesTable)
      .values({
        id: serviceId,
        partnerId,
        serviceType: dto.serviceType,
        title: dto.title,
        description: dto.description || "",
        location: dto.location,
        price: dto.price.toString(),
        originalPrice: dto.originalPrice ? dto.originalPrice.toString() : null,
        unit: dto.unit || (dto.serviceType === "transport" ? "ngày" : "đêm"),
        images: dto.images || [],
        attributes: (dto.attributes as any) || {},
        status: serviceStatus,
      })
      .returning()

    // Automatically sync into public catalog only if active and approved
    if (serviceStatus === "active" && isPartnerApproved) {
      await this.syncServiceToCatalog(
        service,
        profile?.contactName || profile?.businessName
      )
    }

    return service
  }

  async updateService(
    partnerId: string,
    serviceId: string,
    dto: UpdatePartnerServiceDto
  ) {
    const conditions = [eq(partnerServicesTable.id, serviceId)]
    if (partnerId) {
      conditions.push(eq(partnerServicesTable.partnerId, partnerId))
    }
    const [existing] = await this.db
      .select()
      .from(partnerServicesTable)
      .where(and(...conditions))
      .limit(1)

    if (!existing) {
      throw new NotFoundException("Không tìm thấy dịch vụ hoặc bạn không có quyền sửa")
    }

    const [updated] = await this.db
      .update(partnerServicesTable)
      .set({
        ...(dto.title ? { title: dto.title } : {}),
        ...(dto.description !== undefined ? { description: dto.description } : {}),
        ...(dto.location ? { location: dto.location } : {}),
        ...(dto.price !== undefined ? { price: dto.price.toString() } : {}),
        ...(dto.originalPrice !== undefined
          ? { originalPrice: dto.originalPrice ? dto.originalPrice.toString() : null }
          : {}),
        ...(dto.unit ? { unit: dto.unit } : {}),
        ...(dto.images ? { images: dto.images } : {}),
        ...(dto.attributes ? { attributes: dto.attributes as any } : {}),
        ...(dto.status ? { status: dto.status } : {}),
      })
      .where(eq(partnerServicesTable.id, serviceId))
      .returning()

    // Automatically sync update into catalog
    if (updated) {
      await this.syncServiceToCatalog(updated)
    }

    return updated
  }

  async deleteService(partnerId: string, serviceId: string) {
    const conditions = [eq(partnerServicesTable.id, serviceId)]
    if (partnerId) {
      conditions.push(eq(partnerServicesTable.partnerId, partnerId))
    }
    const [existing] = await this.db
      .select()
      .from(partnerServicesTable)
      .where(and(...conditions))
      .limit(1)

    if (!existing) {
      throw new NotFoundException("Không tìm thấy dịch vụ")
    }

    await this.db
      .delete(partnerServicesTable)
      .where(eq(partnerServicesTable.id, serviceId))

    // Also remove from catalog tables
    await this.db
      .delete(stayeaAccommodationsTable)
      .where(eq(stayeaAccommodationsTable.id, serviceId))
      .catch(() => {})

    await this.db
      .delete(stayeaExperiencesTable)
      .where(eq(stayeaExperiencesTable.id, serviceId))
      .catch(() => {})

    return { success: true, deletedId: serviceId }
  }

  // ==========================================
  // 3. INVENTORY & AVAILABILITY
  // ==========================================

  async getInventory(serviceId: string, startDate?: string, endDate?: string) {
    let conditions = [eq(partnerInventoryTable.serviceId, serviceId)]

    if (startDate) {
      conditions.push(gte(partnerInventoryTable.date, startDate))
    }
    if (endDate) {
      conditions.push(lte(partnerInventoryTable.date, endDate))
    }

    return this.db
      .select()
      .from(partnerInventoryTable)
      .where(and(...conditions))
      .orderBy(partnerInventoryTable.date)
  }

  async bulkUpdateInventory(partnerId: string, dto: BulkUpdateInventoryDto) {
    const [service] = await this.db
      .select()
      .from(partnerServicesTable)
      .where(
        and(
          eq(partnerServicesTable.id, dto.serviceId),
          eq(partnerServicesTable.partnerId, partnerId)
        )
      )
      .limit(1)

    if (!service) {
      throw new NotFoundException("Dịch vụ không tồn tại hoặc không thuộc đối tác")
    }

    const results = []
    for (const item of dto.dates) {
      const invId = generateUid("inv")
      const [upserted] = await this.db
        .insert(partnerInventoryTable)
        .values({
          id: invId,
          partnerId,
          serviceId: dto.serviceId,
          date: item.date,
          totalSlots: item.totalSlots ?? 1,
          bookedSlots: 0,
          isAvailable: item.isAvailable ?? true,
          priceOverride: item.priceOverride ? item.priceOverride.toString() : null,
          note: item.note || null,
        })
        .onConflictDoUpdate({
          target: [partnerInventoryTable.serviceId, partnerInventoryTable.date],
          set: {
            ...(item.totalSlots !== undefined ? { totalSlots: item.totalSlots } : {}),
            ...(item.isAvailable !== undefined ? { isAvailable: item.isAvailable } : {}),
            ...(item.priceOverride !== undefined
              ? {
                  priceOverride: item.priceOverride
                    ? item.priceOverride.toString()
                    : null,
                }
              : {}),
            ...(item.note !== undefined ? { note: item.note } : {}),
          },
        })
        .returning()

      results.push(upserted)
    }

    return results
  }

  // ==========================================
  // 4. ORDERS WORKFLOW (AI AGENT -> ADMIN -> PARTNER)
  // ==========================================

  /**
   * Step 1: AI Agent or Customer creates draft order -> enters `pending_admin` queue.
   */
  async createDraftOrder(dto: CreateDraftOrderDto) {
    // Validate customer phone: strip whitespace, hyphens, dots
    const cleanPhone = (dto.customerPhone || "").replace(/[\s.-]/g, "")
    const vnPhoneRegex = /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/
    if (!vnPhoneRegex.test(cleanPhone)) {
      throw new BadRequestException(
        `Số điện thoại không hợp lệ ("${dto.customerPhone}"). Vui lòng cung cấp số di động Việt Nam hợp lệ (ví dụ: 0912345678 hoặc +84912345678).`
      )
    }

    // Validate start date: must not be in the past
    const todayStr = new Date().toISOString().slice(0, 10)
    if (dto.startDate && dto.startDate < todayStr) {
      throw new BadRequestException(
        `Ngày bắt đầu dịch vụ ("${dto.startDate}") không thể ở trong quá khứ. Vui lòng chọn ngày từ hôm nay (${todayStr}) trở đi.`
      )
    }

    const partner = await this.getProfileById(dto.partnerId)
    const orderId = generateUid("pord")
    const orderCode = `STY-ORD-${Date.now().toString().slice(-6)}-${randomUUID().slice(0, 4).toUpperCase()}`

    const commissionRate = Number.parseFloat(partner.commissionRate || "10.00") / 100
    const commissionAmount = Math.round(dto.totalAmount * commissionRate)
    const partnerPayoutAmount = dto.totalAmount - commissionAmount

    const [order] = await this.db
      .insert(partnerOrdersTable)
      .values({
        id: orderId,
        orderCode,
        partnerId: dto.partnerId,
        serviceId: dto.serviceId,
        customerName: dto.customerName,
        customerPhone: cleanPhone,
        customerEmail: dto.customerEmail || null,
        serviceTitle: dto.serviceTitle,
        serviceType: dto.serviceType,
        startDate: dto.startDate,
        endDate: dto.endDate || null,
        quantity: dto.quantity || 1,
        unitPrice: dto.unitPrice.toString(),
        totalAmount: dto.totalAmount.toString(),
        commissionAmount: commissionAmount.toString(),
        partnerPayoutAmount: partnerPayoutAmount.toString(),
        status: "pending_admin",
        source: dto.source || "direct_customer",
        adminNotes: dto.adminNotes || null,
      })
      .returning()

    return order
  }

  /**
   * Admin view: see all orders with status filtering
   */
  async getAdminOrders(query?: { status?: string; search?: string; partnerId?: string }) {
    let conditions = []

    if (query?.status) {
      conditions.push(eq(partnerOrdersTable.status, query.status as any))
    }
    if (query?.partnerId) {
      conditions.push(eq(partnerOrdersTable.partnerId, query.partnerId))
    }
    if (query?.search) {
      const s = `%${query.search}%`
      conditions.push(
        or(
          ilike(partnerOrdersTable.orderCode, s),
          ilike(partnerOrdersTable.customerName, s),
          ilike(partnerOrdersTable.customerPhone, s),
          ilike(partnerOrdersTable.serviceTitle, s)
        )
      )
    }

    return this.db
      .select()
      .from(partnerOrdersTable)
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(desc(partnerOrdersTable.createdAt))
  }

  /**
   * Step 2: Admin approves order -> status becomes `sent_to_partner`
   */
  async adminApproveOrder(orderId: string, dto?: AdminApproveOrderDto) {
    const [order] = await this.db
      .select()
      .from(partnerOrdersTable)
      .where(eq(partnerOrdersTable.id, orderId))
      .limit(1)

    if (!order) {
      throw new NotFoundException("Đơn hàng không tồn tại")
    }

    if (order.status !== "pending_admin") {
      throw new BadRequestException(
        `Không thể duyệt đơn này vì trạng thái hiện tại là: "${order.status}"`
      )
    }

    const [updated] = await this.db
      .update(partnerOrdersTable)
      .set({
        status: "sent_to_partner",
        ...(dto?.reassignPartnerId ? { partnerId: dto.reassignPartnerId } : {}),
        adminNotes: dto?.adminNotes || order.adminNotes,
      })
      .where(eq(partnerOrdersTable.id, orderId))
      .returning()

    if (order.bookingId) {
      await this.db
        .update(stayeaBookingsTable)
        .set({ status: "confirmed", updatedAt: new Date() })
        .where(eq(stayeaBookingsTable.id, order.bookingId))
        .catch(() => {})
    }

    return updated
  }

  /**
   * Step 2b: Admin cancels or rejects an order
   */
  async adminRejectOrder(orderId: string, reason?: string) {
    const [order] = await this.db
      .select()
      .from(partnerOrdersTable)
      .where(eq(partnerOrdersTable.id, orderId))
      .limit(1)

    if (!order) {
      throw new NotFoundException("Đơn hàng không tồn tại")
    }

    const [updated] = await this.db
      .update(partnerOrdersTable)
      .set({
        status: "cancelled",
        adminNotes: reason
          ? `Admin từ chối đơn: ${reason}`
          : order.adminNotes || "Admin đã từ chối duyệt đơn.",
      })
      .where(eq(partnerOrdersTable.id, orderId))
      .returning()

    if (order.bookingId) {
      await this.db
        .update(stayeaBookingsTable)
        .set({ status: "cancelled", updatedAt: new Date() })
        .where(eq(stayeaBookingsTable.id, order.bookingId))
        .catch(() => {})
    }

    return updated
  }

  /**
   * Partner view: see orders dispatched to them
   */
  async getPartnerOrders(partnerId: string, status?: string) {
    let conditions = [
      eq(partnerOrdersTable.partnerId, partnerId),
      // Partners see all orders related to their property or service
      inArray(partnerOrdersTable.status, [
        "pending_admin",
        "sent_to_partner",
        "partner_accepted",
        "partner_rejected",
        "in_progress",
        "completed",
        "cancelled",
      ]),
    ]

    if (status) {
      conditions.push(eq(partnerOrdersTable.status, status as any))
    }

    return this.db
      .select()
      .from(partnerOrdersTable)
      .where(and(...conditions))
      .orderBy(desc(partnerOrdersTable.createdAt))
  }

  /**
   * Step 3: Partner accepts or rejects order
   */
  async partnerRespondOrder(
    partnerId: string,
    orderId: string,
    dto: PartnerOrderRespondDto
  ) {
    const [order] = await this.db
      .select()
      .from(partnerOrdersTable)
      .where(
        and(
          eq(partnerOrdersTable.id, orderId),
          eq(partnerOrdersTable.partnerId, partnerId)
        )
      )
      .limit(1)

    if (!order) {
      throw new NotFoundException("Đơn hàng không tồn tại hoặc không thuộc quyền quản lý")
    }

    if (order.status !== "sent_to_partner") {
      throw new BadRequestException(
        `Chỉ đơn hàng đang ở trạng thái 'sent_to_partner' mới có thể tiếp nhận hoặc từ chối`
      )
    }

    if (dto.action === "reject") {
      const rejectReason = dto.note || "Đối tác báo hết phòng/xe"
      const [updated] = await this.db
        .update(partnerOrdersTable)
        .set({
          // Rebound back to Admin Queue so the order is never trapped or lost!
          status: "pending_admin",
          rejectionReason: rejectReason,
          partnerNotes: `Đối tác từ chối nhận khách: ${rejectReason}`,
          adminNotes: `⚠️ ĐỐI TÁC TỪ CHỐI (Lý do: "${rejectReason}"). Cần Admin đổi đối tác khác để điều phối lại!`,
        })
        .where(eq(partnerOrdersTable.id, orderId))
        .returning()

      return updated
    }

    const [updated] = await this.db
      .update(partnerOrdersTable)
      .set({
        status: "partner_accepted",
        partnerNotes: dto.note || order.partnerNotes,
        rejectionReason: null,
      })
      .where(eq(partnerOrdersTable.id, orderId))
      .returning()

    // Increment partner completed/accepted order counter
    await this.db
      .update(partnerProfilesTable)
      .set({
        totalOrders: sql`${partnerProfilesTable.totalOrders} + 1`,
      })
      .where(eq(partnerProfilesTable.id, partnerId))

    if (order.bookingId) {
      await this.db
        .update(stayeaBookingsTable)
        .set({ status: "confirmed", updatedAt: new Date() })
        .where(eq(stayeaBookingsTable.id, order.bookingId))
        .catch(() => {})
    }

    return updated
  }

  /**
   * Step 4: Admin or Partner marks order completed
   */
  async completeOrder(orderId: string) {
    const [order] = await this.db
      .select()
      .from(partnerOrdersTable)
      .where(eq(partnerOrdersTable.id, orderId))
      .limit(1)

    if (!order) {
      throw new NotFoundException("Đơn hàng không tồn tại")
    }

    const [updated] = await this.db
      .update(partnerOrdersTable)
      .set({
        status: "completed",
      })
      .where(eq(partnerOrdersTable.id, orderId))
      .returning()

    if (order.bookingId) {
      await this.db
        .update(stayeaBookingsTable)
        .set({ status: "completed", updatedAt: new Date() })
        .where(eq(stayeaBookingsTable.id, order.bookingId))
        .catch(() => {})
    }

    return updated
  }

  // ==========================================
  // 5. PARTNER DASHBOARD KPI SUMMARY
  // ==========================================

  async getPartnerSummary(partnerId: string) {
    const profile = await this.getProfileById(partnerId)
    const services = await this.getPartnerServices(partnerId)
    const orders = await this.getPartnerOrders(partnerId)

    const pendingOrders = orders.filter((o) => o.status === "sent_to_partner")
    const acceptedOrders = orders.filter(
      (o) => o.status === "partner_accepted" || o.status === "in_progress"
    )
    const completedOrders = orders.filter((o) => o.status === "completed")

    const totalRevenue = completedOrders.reduce(
      (acc, o) => acc + Number.parseFloat(o.partnerPayoutAmount || "0"),
      0
    )
    const pendingRevenue = acceptedOrders.reduce(
      (acc, o) => acc + Number.parseFloat(o.partnerPayoutAmount || "0"),
      0
    )

    return {
      partner: profile,
      metrics: {
        totalServices: services.length,
        activeServices: services.filter((s) => s.status === "active").length,
        totalOrders: orders.length,
        newPendingOrdersCount: pendingOrders.length,
        inProgressOrdersCount: acceptedOrders.length,
        completedOrdersCount: completedOrders.length,
        totalRevenue,
        pendingRevenue,
      },
      recentOrders: orders.slice(0, 5),
    }
  }

  // ==========================================
  // 6. ADMIN CATALOG MODERATION
  // ==========================================

  async adminGetAllServices(query?: {
    status?: string
    partnerId?: string
    type?: string
    search?: string
  }) {
    const conditions = []
    if (query?.status) {
      conditions.push(eq(partnerServicesTable.status, query.status as any))
    }
    if (query?.partnerId) {
      conditions.push(eq(partnerServicesTable.partnerId, query.partnerId))
    }
    if (query?.type) {
      conditions.push(eq(partnerServicesTable.serviceType, query.type as any))
    }
    if (query?.search) {
      const s = `%${query.search.trim()}%`
      conditions.push(
        sql`(${partnerServicesTable.title} ILIKE ${s} OR coalesce(${partnerServicesTable.description}, '') ILIKE ${s} OR ${partnerServicesTable.location} ILIKE ${s})`
      )
    }

    return this.db
      .select({
        id: partnerServicesTable.id,
        partnerId: partnerServicesTable.partnerId,
        serviceType: partnerServicesTable.serviceType,
        title: partnerServicesTable.title,
        description: partnerServicesTable.description,
        location: partnerServicesTable.location,
        price: partnerServicesTable.price,
        originalPrice: partnerServicesTable.originalPrice,
        unit: partnerServicesTable.unit,
        images: partnerServicesTable.images,
        attributes: partnerServicesTable.attributes,
        status: partnerServicesTable.status,
        createdAt: partnerServicesTable.createdAt,
        updatedAt: partnerServicesTable.updatedAt,
        partnerBusinessName: partnerProfilesTable.businessName,
        partnerContactName: partnerProfilesTable.contactName,
        partnerPhone: partnerProfilesTable.phone,
        partnerStatus: partnerProfilesTable.status,
      })
      .from(partnerServicesTable)
      .leftJoin(
        partnerProfilesTable,
        eq(partnerServicesTable.partnerId, partnerProfilesTable.id)
      )
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(desc(partnerServicesTable.createdAt))
  }

  async adminUpdateServiceStatus(
    id: string,
    dto: AdminUpdateServiceStatusDto
  ) {
    const [existing] = await this.db
      .select()
      .from(partnerServicesTable)
      .where(eq(partnerServicesTable.id, id))
      .limit(1)

    if (!existing) {
      throw new NotFoundException(`Dịch vụ với ID "${id}" không tồn tại`)
    }

    const [updated] = await this.db
      .update(partnerServicesTable)
      .set({
        status: dto.status,
        updatedAt: new Date(),
      })
      .where(eq(partnerServicesTable.id, id))
      .returning()

    if (updated && updated.status === "active") {
      const [partner] = await this.db
        .select()
        .from(partnerProfilesTable)
        .where(eq(partnerProfilesTable.id, updated.partnerId))
        .limit(1)
      await this.syncServiceToCatalog(updated, partner?.businessName)
    }

    return updated
  }
}
