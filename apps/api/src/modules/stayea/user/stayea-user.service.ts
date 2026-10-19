import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common"
import {
  stayeaFavoritesTable,
  stayeaPromotionsTable,
  stayeaReviewsTable,
  stayeaUserPlansTable,
  stayeaUserSettingsTable,
  stayeaUserVouchersTable,
  usersTable,
} from "@workspace/database"
import dayjs from "dayjs"
import { and, desc, eq } from "drizzle-orm"

import { DB_TOKEN } from "@/app/database/db.port"
import { ErrorCode } from "@/shared-kernel/infrastructure/enums/error-code"

import type { DrizzleDb } from "@/app/database/db.port"
import type {
  ClaimVoucherDto,
  CreatePlanDto,
  CreateReviewDto,
  FavoriteItemDto,
  UpdateUserSettingsDto,
} from "@/modules/stayea/user/dtos/user-activity.dto"

@Injectable()
export class StayeaUserService {
  constructor(@Inject(DB_TOKEN) private readonly db: DrizzleDb) {}

  // --------------------------------------------------------------------------
  // User Vouchers Wallet
  // --------------------------------------------------------------------------
  async getUserVouchers(userId: string) {
    return this.db
      .select()
      .from(stayeaUserVouchersTable)
      .where(eq(stayeaUserVouchersTable.userId, userId))
      .orderBy(desc(stayeaUserVouchersTable.claimedAt))
  }

  async claimVoucher(userId: string, dto: ClaimVoucherDto) {
    const cleanCode = dto.code.trim().toUpperCase()

    // 1. Check if already claimed
    const [alreadyClaimed] = await this.db
      .select()
      .from(stayeaUserVouchersTable)
      .where(
        and(
          eq(stayeaUserVouchersTable.userId, userId),
          eq(stayeaUserVouchersTable.code, cleanCode)
        )
      )
      .limit(1)

    if (alreadyClaimed) {
      throw new BadRequestException({
        code: ErrorCode.BAD_REQUEST,
        message: "Bạn đã lưu voucher này vào ví rồi",
      })
    }

    // 2. Validate template in promotions table
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
      throw new NotFoundException({
        code: ErrorCode.RESOURCE_NOT_FOUND,
        message: "Mã ưu đãi không tồn tại hoặc đã hết hạn",
      })
    }

    // 3. Add to user wallet
    const [voucher] = await this.db
      .insert(stayeaUserVouchersTable)
      .values({
        id: `uv-${crypto.randomUUID()}`,
        userId,
        promotionId: promo.id,
        code: promo.code,
        title: promo.title,
        description: promo.description,
        discountType: promo.discountType,
        discountValue: promo.discountValue,
        minSpend: promo.minSpend,
        maxDiscount: promo.maxDiscount,
        category: promo.category,
        isUsed: false,
        expiresAt: promo.endDate ?? dayjs().add(60, "days").toDate(),
      })
      .returning()

    return voucher
  }

  // --------------------------------------------------------------------------
  // User Trip Plans & Itineraries
  // --------------------------------------------------------------------------
  async getUserPlans(userId: string) {
    return this.db
      .select()
      .from(stayeaUserPlansTable)
      .where(eq(stayeaUserPlansTable.userId, userId))
      .orderBy(desc(stayeaUserPlansTable.createdAt))
  }

  async createPlan(userId: string, dto: CreatePlanDto) {
    const [plan] = await this.db
      .insert(stayeaUserPlansTable)
      .values({
        id: `plan-${crypto.randomUUID()}`,
        userId,
        title: dto.title,
        destination: dto.destination,
        dates: dto.dates,
        coverImage: dto.coverImage,
        status: "planning",
        itinerary: dto.itinerary ?? [],
      })
      .returning()

    return plan
  }

  async deletePlan(userId: string, id: string) {
    const [deleted] = await this.db
      .delete(stayeaUserPlansTable)
      .where(
        and(
          eq(stayeaUserPlansTable.userId, userId),
          eq(stayeaUserPlansTable.id, id)
        )
      )
      .returning()

    if (!deleted) {
      throw new NotFoundException({
        code: ErrorCode.RESOURCE_NOT_FOUND,
        message: `Plan ${id} not found`,
      })
    }

    return { success: true, id: deleted.id }
  }

  // --------------------------------------------------------------------------
  // User Favorites / Wishlist
  // --------------------------------------------------------------------------
  async getFavorites(userId: string, itemType?: string) {
    const conditions = [eq(stayeaFavoritesTable.userId, userId)]

    if (itemType && itemType !== "all") {
      conditions.push(eq(stayeaFavoritesTable.itemType, itemType as any))
    }

    return this.db
      .select()
      .from(stayeaFavoritesTable)
      .where(and(...conditions))
      .orderBy(desc(stayeaFavoritesTable.createdAt))
  }

  async addFavorite(userId: string, dto: FavoriteItemDto) {
    // Check if already favorited
    const [existing] = await this.db
      .select()
      .from(stayeaFavoritesTable)
      .where(
        and(
          eq(stayeaFavoritesTable.userId, userId),
          eq(stayeaFavoritesTable.itemType, dto.itemType),
          eq(stayeaFavoritesTable.itemId, dto.itemId)
        )
      )
      .limit(1)

    if (existing) {
      return existing
    }

    const [favorite] = await this.db
      .insert(stayeaFavoritesTable)
      .values({
        id: `fav-${crypto.randomUUID()}`,
        userId,
        itemType: dto.itemType,
        itemId: dto.itemId,
        title: dto.title,
        location: dto.location,
        imageUrl: dto.imageUrl,
        price: dto.price.toString(),
        rating: dto.rating ? dto.rating.toString() : "5.00",
      })
      .returning()

    return favorite
  }

  async removeFavorite(userId: string, idOrItemId: string) {
    const [deleted] = await this.db
      .delete(stayeaFavoritesTable)
      .where(
        and(
          eq(stayeaFavoritesTable.userId, userId),
          eq(stayeaFavoritesTable.id, idOrItemId)
        )
      )
      .returning()

    if (deleted) return { success: true, id: deleted.id }

    // Try by itemId
    const [deletedByItem] = await this.db
      .delete(stayeaFavoritesTable)
      .where(
        and(
          eq(stayeaFavoritesTable.userId, userId),
          eq(stayeaFavoritesTable.itemId, idOrItemId)
        )
      )
      .returning()

    return { success: true, id: deletedByItem?.id }
  }

  // --------------------------------------------------------------------------
  // User Reviews & Ratings
  // --------------------------------------------------------------------------
  async getUserReviews(userId: string) {
    return this.db
      .select()
      .from(stayeaReviewsTable)
      .where(eq(stayeaReviewsTable.userId, userId))
      .orderBy(desc(stayeaReviewsTable.createdAt))
  }

  async createReview(userId: string, dto: CreateReviewDto) {
    const [user] = await this.db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, userId))
      .limit(1)

    const authorName = user?.name || user?.displayName || "Khách hàng Stayea"
    const authorAvatar = user?.image || undefined

    const [review] = await this.db
      .insert(stayeaReviewsTable)
      .values({
        id: `rev-${crypto.randomUUID()}`,
        userId,
        itemType: dto.itemType,
        itemId: dto.itemId,
        itemTitle: dto.itemTitle,
        rating: dto.rating,
        comment: dto.comment,
        authorName,
        authorAvatar,
        status: "approved",
      })
      .returning()

    return review
  }

  // --------------------------------------------------------------------------
  // User Settings & Preferences
  // --------------------------------------------------------------------------
  async getUserSettings(userId: string) {
    const [settings] = await this.db
      .select()
      .from(stayeaUserSettingsTable)
      .where(eq(stayeaUserSettingsTable.userId, userId))
      .limit(1)

    if (settings) return settings

    // Initialize default settings
    const [created] = await this.db
      .insert(stayeaUserSettingsTable)
      .values({
        id: `sett-${crypto.randomUUID()}`,
        userId,
        language: "vi",
        currency: "VND",
        twoFactorEnabled: false,
      })
      .returning()

    return created
  }

  async updateUserSettings(userId: string, dto: UpdateUserSettingsDto) {
    await this.getUserSettings(userId) // Ensure exists

    const updatePayload: Record<string, unknown> = {
      updatedAt: new Date(),
    }

    if (dto.emailNotifications) updatePayload.emailNotifications = dto.emailNotifications
    if (dto.pushNotifications) updatePayload.pushNotifications = dto.pushNotifications
    if (dto.language) updatePayload.language = dto.language
    if (dto.currency) updatePayload.currency = dto.currency
    if (dto.twoFactorEnabled !== undefined) updatePayload.twoFactorEnabled = dto.twoFactorEnabled

    const [updated] = await this.db
      .update(stayeaUserSettingsTable)
      .set(updatePayload)
      .where(eq(stayeaUserSettingsTable.userId, userId))
      .returning()

    return updated
  }
}
