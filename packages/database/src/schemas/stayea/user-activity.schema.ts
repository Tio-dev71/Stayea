import {
  boolean,
  index,
  integer,
  jsonb,
  numeric,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core"

/**
 * Stayea User Vouchers Wallet Table
 */
export const stayeaUserVouchersTable = pgTable(
  "stayea_user_vouchers",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull(),
    promotionId: text("promotion_id").notNull(),
    code: text("code").notNull(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    discountType: text("discount_type", { enum: ["percentage", "fixed"] }).notNull(),
    discountValue: numeric("discount_value", { precision: 10, scale: 2 }).notNull(),
    minSpend: numeric("min_spend", { precision: 12, scale: 2 }).notNull().default("0"),
    maxDiscount: numeric("max_discount", { precision: 12, scale: 2 }),
    category: text("category").notNull().default("all"),
    isUsed: boolean("is_used").notNull().default(false),
    usedAt: timestamp("used_at", { withTimezone: true }),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    claimedAt: timestamp("claimed_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("stayea_user_vouchers_user_idx").on(table.userId),
    index("stayea_user_vouchers_code_idx").on(table.code),
    index("stayea_user_vouchers_used_idx").on(table.isUsed),
  ]
)

export type StayeaUserVoucher = typeof stayeaUserVouchersTable.$inferSelect
export type InsertStayeaUserVoucher = typeof stayeaUserVouchersTable.$inferInsert

/**
 * Stayea User Trip Plans & Itineraries Table
 */
export const stayeaUserPlansTable = pgTable(
  "stayea_user_plans",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull(),
    title: text("title").notNull(),
    destination: text("destination").notNull(),
    dates: text("dates").notNull(),
    coverImage: text("cover_image").notNull(),
    status: text("status", {
      enum: ["planning", "confirmed", "completed"],
    })
      .notNull()
      .default("planning"),
    itinerary: jsonb("itinerary")
      .$type<{
        day: number
        date: string
        title: string
        activities: { time: string; activity: string; location?: string; icon?: string }[]
        bookedServices?: { id: string; type: string; title: string; status: string }[]
        notes?: string
      }[]>()
      .notNull()
      .default([]),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("stayea_user_plans_user_idx").on(table.userId),
    index("stayea_user_plans_status_idx").on(table.status),
  ]
)

export type StayeaUserPlan = typeof stayeaUserPlansTable.$inferSelect
export type InsertStayeaUserPlan = typeof stayeaUserPlansTable.$inferInsert

/**
 * Stayea User Favorites / Wishlist Table
 */
export const stayeaFavoritesTable = pgTable(
  "stayea_favorites",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull(),
    itemType: text("item_type", {
      enum: ["stay", "experience", "package", "flight"],
    }).notNull(),
    itemId: text("item_id").notNull(),
    title: text("title").notNull(),
    location: text("location"),
    imageUrl: text("image_url").notNull(),
    price: numeric("price", { precision: 12, scale: 2 }).notNull(),
    rating: numeric("rating", { precision: 3, scale: 2 }).default("5.00"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("stayea_favorites_user_idx").on(table.userId),
    index("stayea_favorites_item_idx").on(table.itemType, table.itemId),
  ]
)

export type StayeaFavorite = typeof stayeaFavoritesTable.$inferSelect
export type InsertStayeaFavorite = typeof stayeaFavoritesTable.$inferInsert

/**
 * Stayea User Reviews & Ratings Table
 */
export const stayeaReviewsTable = pgTable(
  "stayea_reviews",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull(),
    itemType: text("item_type", {
      enum: ["stay", "experience", "package"],
    }).notNull(),
    itemId: text("item_id").notNull(),
    itemTitle: text("item_title").notNull(),
    rating: integer("rating").notNull().default(5),
    comment: text("comment").notNull(),
    authorName: text("author_name").notNull(),
    authorAvatar: text("author_avatar"),
    status: text("status", { enum: ["approved", "pending", "hidden"] })
      .notNull()
      .default("approved"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("stayea_reviews_user_idx").on(table.userId),
    index("stayea_reviews_item_idx").on(table.itemType, table.itemId),
    index("stayea_reviews_status_idx").on(table.status),
  ]
)

export type StayeaReview = typeof stayeaReviewsTable.$inferSelect
export type InsertStayeaReview = typeof stayeaReviewsTable.$inferInsert

/**
 * Stayea User Settings & Preferences Table
 */
export const stayeaUserSettingsTable = pgTable(
  "stayea_user_settings",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull().unique(),
    emailNotifications: jsonb("email_notifications")
      .$type<{
        bookingConfirmations: boolean
        promotionsAndDiscounts: boolean
        travelReminders: boolean
        newsletter: boolean
      }>()
      .notNull()
      .default({
        bookingConfirmations: true,
        promotionsAndDiscounts: true,
        travelReminders: true,
        newsletter: false,
      }),
    pushNotifications: jsonb("push_notifications")
      .$type<{
        orderStatus: boolean
        priceDropAlerts: boolean
        specialOffers: boolean
      }>()
      .notNull()
      .default({
        orderStatus: true,
        priceDropAlerts: true,
        specialOffers: true,
      }),
    language: text("language").notNull().default("vi"),
    currency: text("currency").notNull().default("VND"),
    twoFactorEnabled: boolean("two_factor_enabled").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    uniqueIndex("stayea_user_settings_user_idx").on(table.userId),
  ]
)

export type StayeaUserSettings = typeof stayeaUserSettingsTable.$inferSelect
export type InsertStayeaUserSettings = typeof stayeaUserSettingsTable.$inferInsert
