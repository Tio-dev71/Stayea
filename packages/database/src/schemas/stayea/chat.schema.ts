import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core"

/**
 * STAYEA Chat Conversations Table
 *
 * Stores conversation threads between:
 * - Customer & Admin/Consultant (from public STAYEA AI widget)
 * - Partner & Admin (from Partner Hub & Admin Partners page)
 */
export const stayeaChatConversationsTable = pgTable(
  "stayea_chat_conversations",
  {
    id: text("id").primaryKey(),
    type: text("type", { enum: ["customer", "partner", "host"] })
      .notNull()
      .default("customer"),
    participantId: text("participant_id").notNull(),
    participantName: text("participant_name").notNull(),
    participantPhone: text("participant_phone"),
    participantEmail: text("participant_email"),
    participantAvatar: text("participant_avatar"),
    partnerId: text("partner_id"),
    lastMessage: text("last_message"),
    lastMessageAt: timestamp("last_message_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    unreadAdminCount: integer("unread_admin_count").notNull().default(0),
    unreadParticipantCount: integer("unread_participant_count").notNull().default(0),
    metadata: jsonb("metadata")
      .$type<Record<string, unknown>>()
      .notNull()
      .default({}),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("idx_stayea_chat_conv_type").on(table.type),
    index("idx_stayea_chat_conv_part").on(table.participantId),
    index("idx_stayea_chat_conv_partner").on(table.partnerId),
    index("idx_stayea_chat_conv_last_msg").on(table.lastMessageAt),
  ]
)

export type StayeaChatConversation = typeof stayeaChatConversationsTable.$inferSelect
export type InsertStayeaChatConversation = typeof stayeaChatConversationsTable.$inferInsert

/**
 * STAYEA Chat Messages Table
 *
 * Stores individual messages within a conversation.
 */
export const stayeaChatMessagesTable = pgTable(
  "stayea_chat_messages",
  {
    id: text("id").primaryKey(),
    conversationId: text("conversation_id")
      .notNull()
      .references(() => stayeaChatConversationsTable.id, { onDelete: "cascade" }),
    senderType: text("sender_type", {
      enum: ["customer", "partner", "admin", "ai"],
    }).notNull(),
    senderId: text("sender_id"),
    senderName: text("sender_name").notNull(),
    senderAvatar: text("sender_avatar"),
    content: text("content").notNull(),
    metadata: jsonb("metadata")
      .$type<Record<string, unknown>>()
      .notNull()
      .default({}),
    isRead: boolean("is_read").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_stayea_chat_msg_conv").on(table.conversationId, table.createdAt),
  ]
)

export type StayeaChatMessage = typeof stayeaChatMessagesTable.$inferSelect
export type InsertStayeaChatMessage = typeof stayeaChatMessagesTable.$inferInsert

