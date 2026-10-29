import { Inject, Injectable } from "@nestjs/common"
import {
  stayeaClubProfilesTable,
  stayeaClubPointsTransactionsTable,
  stayeaClubPerksTable,
} from "@workspace/database"
import dayjs from "dayjs"
import { desc, eq } from "drizzle-orm"

import { DB_TOKEN } from "@/app/database/db.port"

import type { DrizzleDb } from "@/app/database/db.port"
import type { AddPointsDto, ClaimPerkDto } from "@/modules/stayea/club/dtos/club.dto"

@Injectable()
export class StayeaClubService {
  constructor(@Inject(DB_TOKEN) private readonly db: DrizzleDb) {}

  /**
   * Get user loyalty profile, auto-initialize if not yet exists
   */
  async getProfile(userId: string) {
    const [existing] = await this.db
      .select()
      .from(stayeaClubProfilesTable)
      .where(eq(stayeaClubProfilesTable.userId, userId))
      .limit(1)

    if (existing) {
      return existing
    }

    // Initialize new profile for user
    const randomCode = Math.floor(1000 + Math.random() * 9000)
    const cardCode = `STY-${randomCode}-VIP`
    const memberSince = dayjs().format("MM/YYYY")

    const [created] = await this.db
      .insert(stayeaClubProfilesTable)
      .values({
        id: `club-${crypto.randomUUID()}`,
        userId,
        tier: "Silver",
        pointsBalance: 0,
        pointsToNextTier: 1000,
        currentProgressPercent: 0,
        memberSince: `Tháng ${memberSince}`,
        cardCode,
        expiresAt: "31/12/2026",
      })
      .returning()

    return created
  }

  /**
   * List all perks claimed by user
   */
  async getPerks(userId: string) {
    return this.db
      .select()
      .from(stayeaClubPerksTable)
      .where(eq(stayeaClubPerksTable.userId, userId))
      .orderBy(desc(stayeaClubPerksTable.claimedAt))
  }

  /**
   * Claim a new club perk/offer
   */
  async claimPerk(userId: string, dto: ClaimPerkDto) {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000)
    const perkCode = `CLUB-${randomSuffix}`

    const [perk] = await this.db
      .insert(stayeaClubPerksTable)
      .values({
        id: `perk-${crypto.randomUUID()}`,
        userId,
        offerId: dto.offerId,
        title: dto.title,
        discount: dto.discount,
        code: perkCode,
        status: "active",
        expiresAt: dayjs().add(30, "days").toDate(),
      })
      .returning()

    return perk
  }

  /**
   * Get user points transaction history
   */
  async getPointsHistory(userId: string) {
    return this.db
      .select()
      .from(stayeaClubPointsTransactionsTable)
      .where(eq(stayeaClubPointsTransactionsTable.userId, userId))
      .orderBy(desc(stayeaClubPointsTransactionsTable.createdAt))
  }

  /**
   * Award or deduct points
   */
  async addPoints(userId: string, dto: AddPointsDto) {
    const profile = await this.getProfile(userId)
    const newBalance = Math.max(0, (profile?.pointsBalance ?? 0) + dto.points)

    await this.db
      .update(stayeaClubProfilesTable)
      .set({
        pointsBalance: newBalance,
        updatedAt: new Date(),
      })
      .where(eq(stayeaClubProfilesTable.userId, userId))

    const [tx] = await this.db
      .insert(stayeaClubPointsTransactionsTable)
      .values({
        id: `ptx-${crypto.randomUUID()}`,
        userId,
        points: dto.points,
        type: dto.type,
        title: dto.title,
        description: dto.description,
      })
      .returning()

    return {
      transaction: tx,
      currentPoints: newBalance,
    }
  }
}
