import {
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core"

/**
 * STAYEA Notifications Table
 * Stores notifications created by Admin or triggered by system events (orders, payouts, broadcasts)
 */
export const stayeaNotificationsTable = pgTable(
  "stayea_notifications",
  {
    id: text("id").primaryKey(),
    recipientType: text("recipient_type", {
      enum: ["all", "all_partners", "all_users", "partner", "user"],
    })
      .notNull()
      .default("all"),
    recipientId: text("recipient_id"), // partnerId or userId if target is specific
    senderId: text("sender_id"),
    senderName: text("sender_name").notNull().default("STAYEA Admin"),
    title: text("title").notNull(),
    message: text("message").notNull(),
    type: text("type", {
      enum: ["system", "order", "payout", "promotion", "announcement"],
    })
      .notNull()
      .default("system"),
    priority: text("priority", {
      enum: ["normal", "high", "urgent"],
    })
      .notNull()
      .default("normal"),
    actionUrl: text("action_url"),
    metadata: jsonb("metadata")
      .$type<Record<string, unknown>>()
      .notNull()
      .default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("stayea_notifications_recipient_type_idx").on(table.recipientType),
    index("stayea_notifications_recipient_id_idx").on(table.recipientId),
    index("stayea_notifications_created_at_idx").on(table.createdAt),
  ]
)

/**
 * STAYEA Notification Reads Table
 * Tracks read status per recipient (user, partner, or admin) across broadcast and direct notifications.
 */
export const stayeaNotificationReadsTable = pgTable(
  "stayea_notification_reads",
  {
    id: text("id").primaryKey(),
    notificationId: text("notification_id")
      .notNull()
      .references(() => stayeaNotificationsTable.id, { onDelete: "cascade" }),
    readerId: text("reader_id").notNull(), // userId or partnerId
    readerRole: text("reader_role", {
      enum: ["user", "partner", "admin"],
    })
      .notNull()
      .default("user"),
    readAt: timestamp("read_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("stayea_notif_reads_uniq_idx").on(table.notificationId, table.readerId),
    index("stayea_notif_reads_reader_idx").on(table.readerId),
  ]
)

export type StayeaNotification = typeof stayeaNotificationsTable.$inferSelect
export type NewStayeaNotification = typeof stayeaNotificationsTable.$inferInsert
export type StayeaNotificationRead = typeof stayeaNotificationReadsTable.$inferSelect
export type NewStayeaNotificationRead = typeof stayeaNotificationReadsTable.$inferInsert

