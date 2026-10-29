import { randomUUID } from "node:crypto"
import { Inject, Injectable, NotFoundException } from "@nestjs/common"
import {
  stayeaAccommodationsTable,
  stayeaExperiencesTable,
  stayeaPackagesTable,
  stayeaFlightsTable,
  stayeaPromotionsTable,
} from "@workspace/database"
import { and, eq, gte, ilike, lte, or } from "drizzle-orm"

import { DB_TOKEN } from "@/app/database/db.port"
import { ErrorCode } from "@/shared-kernel/infrastructure/enums/error-code"

import type { DrizzleDb } from "@/app/database/db.port"
import type {
  AccommodationsQueryDto,
  ExperiencesQueryDto,
  PackagesQueryDto,
  FlightsQueryDto,
  ValidatePromoDto,
} from "@/modules/stayea/catalog/dtos/catalog-query.dto"

@Injectable()
export class StayeaCatalogService {
  constructor(@Inject(DB_TOKEN) private readonly db: DrizzleDb) {}

  // --------------------------------------------------------------------------
  // Accommodations (Stays, Villas, Resorts)
  // --------------------------------------------------------------------------
  async findAccommodations(query: AccommodationsQueryDto) {
    const conditions = []

    if (query.category && query.category !== "all") {
      conditions.push(eq(stayeaAccommodationsTable.category, query.category))
    }

    if (query.search) {
      const term = `%${query.search.trim()}%`
      conditions.push(
        or(
          ilike(stayeaAccommodationsTable.title, term),
          ilike(stayeaAccommodationsTable.location, term)
        )
      )
    }

    if (query.minPrice !== undefined) {
      conditions.push(gte(stayeaAccommodationsTable.pricePerNight, query.minPrice.toString()))
    }

    if (query.maxPrice !== undefined) {
      conditions.push(lte(stayeaAccommodationsTable.pricePerNight, query.maxPrice.toString()))
    }

    if (query.bedrooms !== undefined) {
      conditions.push(gte(stayeaAccommodationsTable.bedrooms, query.bedrooms))
    }

    if (query.isFeatured !== undefined) {
      conditions.push(eq(stayeaAccommodationsTable.isFeatured, query.isFeatured))
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined

    const items = await this.db
      .select()
      .from(stayeaAccommodationsTable)
      .where(whereClause)
      .limit(query.limit ?? 20)
      .offset(query.offset ?? 0)

    return {
      items,
      count: items.length,
      limit: query.limit ?? 20,
      offset: query.offset ?? 0,
    }
  }

  async findAccommodationById(idOrSlug: string) {
    const [item] = await this.db
      .select()
      .from(stayeaAccommodationsTable)
      .where(
        or(
          eq(stayeaAccommodationsTable.id, idOrSlug),
          eq(stayeaAccommodationsTable.slug, idOrSlug)
        )
      )
      .limit(1)

    if (!item) {
      throw new NotFoundException({
        code: ErrorCode.RESOURCE_NOT_FOUND,
        message: `Accommodation ${idOrSlug} not found`,
      })
    }

    return item
  }

  async createAccommodation(dto: any) {
    const randomSuffix = Math.random().toString(36).substring(2, 7)
    const slug = `${(dto.title || "villa")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")}-${randomSuffix}`

    const id = `stay_${randomUUID().replace(/-/g, "").slice(0, 12)}`

    const [created] = await this.db
      .insert(stayeaAccommodationsTable)
      .values({
        id,
        title: dto.title,
        slug,
        location: dto.location || "Phú Quốc, Việt Nam",
        category: dto.category || "villa",
        pricePerNight: dto.pricePerNight ? dto.pricePerNight.toString() : "2000000.00",
        originalPrice: dto.originalPrice ? dto.originalPrice.toString() : null,
        imageUrl:
          dto.imageUrl ||
          "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b",
        gallery: dto.gallery || [
          "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b",
          "https://images.unsplash.com/photo-1566073771259-6a8506099945",
        ],
        bedrooms: dto.bedrooms ?? 2,
        bathrooms: dto.bathrooms ?? 2,
        maxGuests: dto.maxGuests ?? 4,
        amenities: dto.amenities || [
          { icon: "wifi", label: "Wifi tốc độ cao" },
          { icon: "pool", label: "Hồ bơi riêng" },
          { icon: "kitchen", label: "Bếp gia đình" },
        ],
        badge: dto.badge || null,
        isFeatured: dto.isFeatured ?? true,
        hostName: dto.hostName || "STAYEA Official Host",
        description: dto.description || "",
      })
      .returning()

    return created
  }

  async updateAccommodation(id: string, dto: any) {
    const [existing] = await this.db
      .select()
      .from(stayeaAccommodationsTable)
      .where(eq(stayeaAccommodationsTable.id, id))
      .limit(1)

    if (!existing) {
      throw new NotFoundException(`Không tìm thấy chỗ nghỉ với ID ${id}`)
    }

    const [updated] = await this.db
      .update(stayeaAccommodationsTable)
      .set({
        ...(dto.title ? { title: dto.title } : {}),
        ...(dto.location ? { location: dto.location } : {}),
        ...(dto.category ? { category: dto.category } : {}),
        ...(dto.pricePerNight !== undefined
          ? { pricePerNight: dto.pricePerNight.toString() }
          : {}),
        ...(dto.originalPrice !== undefined
          ? { originalPrice: dto.originalPrice ? dto.originalPrice.toString() : null }
          : {}),
        ...(dto.imageUrl ? { imageUrl: dto.imageUrl } : {}),
        ...(dto.bedrooms !== undefined ? { bedrooms: dto.bedrooms } : {}),
        ...(dto.bathrooms !== undefined ? { bathrooms: dto.bathrooms } : {}),
        ...(dto.maxGuests !== undefined ? { maxGuests: dto.maxGuests } : {}),
        ...(dto.badge !== undefined ? { badge: dto.badge } : {}),
        ...(dto.isFeatured !== undefined ? { isFeatured: dto.isFeatured } : {}),
        ...(dto.description !== undefined ? { description: dto.description } : {}),
      })
      .where(eq(stayeaAccommodationsTable.id, id))
      .returning()

    return updated
  }

  async deleteAccommodation(id: string) {
    const [existing] = await this.db
      .select()
      .from(stayeaAccommodationsTable)
      .where(eq(stayeaAccommodationsTable.id, id))
      .limit(1)

    if (!existing) {
      throw new NotFoundException(`Không tìm thấy chỗ nghỉ với ID ${id}`)
    }

    await this.db
      .delete(stayeaAccommodationsTable)
      .where(eq(stayeaAccommodationsTable.id, id))

    return { success: true, deletedId: id }
  }

  // --------------------------------------------------------------------------
  // Experiences (Tours, Island Hops, Scuba, Sunsets)
  // --------------------------------------------------------------------------
  async findExperiences(query: ExperiencesQueryDto) {
    const conditions = []

    if (query.category && query.category !== "all") {
      conditions.push(eq(stayeaExperiencesTable.category, query.category))
    }

    if (query.search) {
      const term = `%${query.search.trim()}%`
      conditions.push(
        or(
          ilike(stayeaExperiencesTable.title, term),
          ilike(stayeaExperiencesTable.location, term)
        )
      )
    }

    if (query.duration) {
      conditions.push(ilike(stayeaExperiencesTable.duration, `%${query.duration}%`))
    }

    if (query.isFeatured !== undefined) {
      conditions.push(eq(stayeaExperiencesTable.isFeatured, query.isFeatured))
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined

    const items = await this.db
      .select()
      .from(stayeaExperiencesTable)
      .where(whereClause)
      .limit(query.limit ?? 20)
      .offset(query.offset ?? 0)

    return {
      items,
      count: items.length,
      limit: query.limit ?? 20,
      offset: query.offset ?? 0,
    }
  }

  async findExperienceById(idOrSlug: string) {
    const [item] = await this.db
      .select()
      .from(stayeaExperiencesTable)
      .where(
        or(
          eq(stayeaExperiencesTable.id, idOrSlug),
          eq(stayeaExperiencesTable.slug, idOrSlug)
        )
      )
      .limit(1)

    if (!item) {
      throw new NotFoundException({
        code: ErrorCode.RESOURCE_NOT_FOUND,
        message: `Experience ${idOrSlug} not found`,
      })
    }

    return item
  }

  // --------------------------------------------------------------------------
  // Packages (Combos, 3D2N, All-Inclusive)
  // --------------------------------------------------------------------------
  async findPackages(query: PackagesQueryDto) {
    const conditions = []

    if (query.audience && query.audience !== "all") {
      conditions.push(eq(stayeaPackagesTable.audience, query.audience))
    }

    if (query.search) {
      const term = `%${query.search.trim()}%`
      conditions.push(
        or(
          ilike(stayeaPackagesTable.title, term),
          ilike(stayeaPackagesTable.destination, term)
        )
      )
    }

    if (query.duration) {
      conditions.push(ilike(stayeaPackagesTable.duration, `%${query.duration}%`))
    }

    if (query.isFeatured !== undefined) {
      conditions.push(eq(stayeaPackagesTable.isFeatured, query.isFeatured))
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined

    const items = await this.db
      .select()
      .from(stayeaPackagesTable)
      .where(whereClause)
      .limit(query.limit ?? 20)
      .offset(query.offset ?? 0)

    return {
      items,
      count: items.length,
      limit: query.limit ?? 20,
      offset: query.offset ?? 0,
    }
  }

  async findPackageById(idOrSlug: string) {
    const [item] = await this.db
      .select()
      .from(stayeaPackagesTable)
      .where(
        or(
          eq(stayeaPackagesTable.id, idOrSlug),
          eq(stayeaPackagesTable.slug, idOrSlug)
        )
      )
      .limit(1)

    if (!item) {
      throw new NotFoundException({
        code: ErrorCode.RESOURCE_NOT_FOUND,
        message: `Package ${idOrSlug} not found`,
      })
    }

    return item
  }

  // --------------------------------------------------------------------------
  // Flights (Domestic & Direct to Phu Quoc)
  // --------------------------------------------------------------------------
  async findFlights(query: FlightsQueryDto) {
    const conditions = []

    if (query.fromAirport) {
      conditions.push(eq(stayeaFlightsTable.departureAirport, query.fromAirport.toUpperCase()))
    }

    if (query.toAirport) {
      conditions.push(eq(stayeaFlightsTable.arrivalAirport, query.toAirport.toUpperCase()))
    }

    if (query.seatClass) {
      conditions.push(eq(stayeaFlightsTable.seatClass, query.seatClass.toLowerCase()))
    }

    if (query.airline) {
      conditions.push(eq(stayeaFlightsTable.airlineCode, query.airline.toUpperCase()))
    }

    if (query.departureDate) {
      conditions.push(eq(stayeaFlightsTable.departureDate, query.departureDate))
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined

    const items = await this.db
      .select()
      .from(stayeaFlightsTable)
      .where(whereClause)
      .limit(query.limit ?? 20)

    return {
      items,
      count: items.length,
    }
  }

  async findFlightById(id: string) {
    const [item] = await this.db
      .select()
      .from(stayeaFlightsTable)
      .where(eq(stayeaFlightsTable.id, id))
      .limit(1)

    if (!item) {
      throw new NotFoundException({
        code: ErrorCode.RESOURCE_NOT_FOUND,
        message: `Flight ${id} not found`,
      })
    }

    return item
  }

  // --------------------------------------------------------------------------
  // Deals & Promotions
  // --------------------------------------------------------------------------
  async findPromotions(category?: string) {
    const conditions = [eq(stayeaPromotionsTable.isActive, true)]

    if (category && category !== "all") {
      conditions.push(
        or(
          eq(stayeaPromotionsTable.category, category),
          eq(stayeaPromotionsTable.category, "all")
        )!
      )
    }

    return this.db
      .select()
      .from(stayeaPromotionsTable)
      .where(and(...conditions))
  }

  async validatePromoCode(dto: ValidatePromoDto) {
    const cleanCode = dto.code.trim().toUpperCase()
    const [promo] = await this.db
      .select()
      .from(stayeaPromotionsTable)
      .where(
        and(
          eq(stayeaPromotionsTable.code, cleanCode),
          eq(stayeaPromotionsTable.isActive, true)
        )
      )
      .limit(1)

    if (!promo) {
      return {
        isValid: false,
        message: "Mã ưu đãi không hợp lệ hoặc đã hết hạn",
      }
    }

    const subtotal = dto.subtotal ?? 0
    const minSpend = Number(promo.minSpend || 0)

    if (subtotal < minSpend) {
      return {
        isValid: false,
        message: `Đơn hàng tối thiểu để áp dụng mã là ${minSpend.toLocaleString("vi-VN")} VND`,
        promo,
      }
    }

    let discountAmount = 0
    const discountVal = Number(promo.discountValue)

    if (promo.discountType === "percentage") {
      const calculated = (subtotal * discountVal) / 100
      const maxDiscount = promo.maxDiscount ? Number(promo.maxDiscount) : Infinity
      discountAmount = Math.min(calculated, maxDiscount)
    } else {
      discountAmount = Math.min(discountVal, subtotal)
    }

    return {
      isValid: true,
      code: promo.code,
      title: promo.title,
      discountType: promo.discountType,
      discountValue: discountVal,
      discountAmount,
      finalAmount: Math.max(0, subtotal - discountAmount),
      promo,
    }
  }
}
