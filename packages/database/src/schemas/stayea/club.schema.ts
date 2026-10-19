import {
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core"

/**
 * Stayea Club Loyalty Profiles
 */
export const stayeaClubProfilesTable = pgTable(
  "stayea_club_profiles",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull().unique(),
    tier: text("tier", {
      enum: ["Silver", "Gold", "Platinum", "Diamond"],
    })
      .notNull()
      .default("Silver"),
    pointsBalance: integer("points_balance").notNull().default(0),
    pointsToNextTier: integer("points_to_next_tier").notNull().default(1000),
    currentProgressPercent: integer("current_progress_percent").notNull().default(0),
    memberSince: text("member_since").notNull(),
    cardCode: text("card_code").notNull(),
    expiresAt: text("expires_at"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    uniqueIndex("stayea_club_profiles_user_idx").on(table.userId),
    index("stayea_club_profiles_tier_idx").on(table.tier),
  ]
)

export type StayeaClubProfile = typeof stayeaClubProfilesTable.$inferSelect
export type InsertStayeaClubProfile = typeof stayeaClubProfilesTable.$inferInsert

/**
 * Stayea Club Points Transactions History
 */
export const stayeaClubPointsTransactionsTable = pgTable(
  "stayea_club_points_transactions",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull(),
    points: integer("points").notNull(),
    type: text("type", {
      enum: ["earned", "redeemed", "bonus", "tier_upgrade"],
    }).notNull(),
    title: text("title").notNull(),
    description: text("description"),
    bookingId: text("booking_id"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("stayea_club_tx_user_idx").on(table.userId),
    index("stayea_club_tx_type_idx").on(table.type),
  ]
)

export type StayeaClubPointsTransaction = typeof stayeaClubPointsTransactionsTable.$inferSelect
export type InsertStayeaClubPointsTransaction =
  typeof stayeaClubPointsTransactionsTable.$inferInsert

/**
 * Stayea Club Claimed Perks & Rewards
 */
export const stayeaClubPerksTable = pgTable(
  "stayea_club_perks",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull(),
    offerId: text("offer_id").notNull(),
    title: text("title").notNull(),
    discount: text("discount").notNull(),
    code: text("code").notNull(),
    status: text("status", { enum: ["active", "used", "expired"] })
      .notNull()
      .default("active"),
    claimedAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    usedAt: timestamp("used_at", { withTimezone: true }),
  },
  (table) => [
    index("stayea_club_perks_user_idx").on(table.userId),
    index("stayea_club_perks_status_idx").on(table.status),
  ]
)

export type StayeaClubPerk = typeof stayeaClubPerksTable.$inferSelect
export type InsertStayeaClubPerk = typeof stayeaClubPerksTable.$inferInsert
