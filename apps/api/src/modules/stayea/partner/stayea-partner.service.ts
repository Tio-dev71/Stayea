import { randomUUID } from "node:crypto"
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common"
import {
  partnerInventoryTable,
  partnerOrdersTable,
  partnerProfilesTable,
  partnerServicesTable,
  usersTable,
} from "@workspace/database"
import { and, desc, eq, gte, ilike, inArray, lte, or, sql } from "drizzle-orm"

import { DB_TOKEN } from "@/app/database/db.port"
import type {
  AdminApproveOrderDto,
  AdminCreatePartnerDto,
  AdminUpdatePartnerStatusDto,
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

@Injectable()
export class StayeaPartnerService {
  constructor(@Inject(DB_TOKEN) private readonly db: DrizzleDb) {}

  // ==========================================
  // 1. PARTNER PROFILE MANAGEMENT
  // ==========================================

  async getProfileByUserId(userId: string) {
    const [profile] = await this.db
      .select()
      .from(partnerProfilesTable)
      .where(eq(partnerProfilesTable.userId, userId))
      .limit(1)

    return profile || null
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
    const existing = await this.getProfileByUserId(userId)
    if (existing) {
      throw new BadRequestException("Tài khoản này đã đăng ký đối tác STAYEA")
    }

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
        status: "approved", // Auto-approve for seamless onboarding demo or pending
        commissionRate: "10.00",
        rating: "5.00",
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
        rating: "5.00",
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
    let conditions = [eq(partnerServicesTable.status, "active")]

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

  async createService(partnerId: string, dto: CreatePartnerServiceDto) {
    const serviceId = generateUid("svc")

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
        status: "active",
      })
      .returning()

    return service
  }

  async updateService(
    partnerId: string,
    serviceId: string,
    dto: UpdatePartnerServiceDto
  ) {
    const [existing] = await this.db
      .select()
      .from(partnerServicesTable)
      .where(
        and(
          eq(partnerServicesTable.id, serviceId),
          eq(partnerServicesTable.partnerId, partnerId)
        )
      )
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

    return updated
  }

  async deleteService(partnerId: string, serviceId: string) {
    const [existing] = await this.db
      .select()
      .from(partnerServicesTable)
      .where(
        and(
          eq(partnerServicesTable.id, serviceId),
          eq(partnerServicesTable.partnerId, partnerId)
        )
      )
      .limit(1)

    if (!existing) {
      throw new NotFoundException("Không tìm thấy dịch vụ")
    }

    await this.db
      .delete(partnerServicesTable)
      .where(eq(partnerServicesTable.id, serviceId))

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

    return updated
  }

  /**
   * Partner view: see orders dispatched to them
   */
  async getPartnerOrders(partnerId: string, status?: string) {
    let conditions = [
      eq(partnerOrdersTable.partnerId, partnerId),
      // Partners only see orders that have reached their inbox or completed
      inArray(partnerOrdersTable.status, [
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
}
