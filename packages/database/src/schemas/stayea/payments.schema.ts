import {
  boolean,
  index,
  jsonb,
  numeric,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core"

/**
 * Stayea Saved Payment Methods Table (Cards, Bank Accounts, E-wallets)
 */
export const stayeaPaymentMethodsTable = pgTable(
  "stayea_payment_methods",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull(),
    type: text("type", {
      enum: ["credit_card", "bank_account", "e_wallet"],
    }).notNull(),
    brand: text("brand").notNull(), // visa, mastercard, jcb, vcb, momo, zalopay
    title: text("title").notNull(),
    isDefault: boolean("is_default").notNull().default(false),
    details: jsonb("details")
      .$type<{
        cardHolder?: string
        cardNumberMasked?: string
        expDate?: string
        bankName?: string
        accountNumberMasked?: string
        walletProvider?: string
        phoneNumberMasked?: string
      }>()
      .notNull()
      .default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("stayea_payment_methods_user_idx").on(table.userId),
    index("stayea_payment_methods_default_idx").on(table.isDefault),
  ]
)

export type StayeaPaymentMethod = typeof stayeaPaymentMethodsTable.$inferSelect
export type InsertStayeaPaymentMethod = typeof stayeaPaymentMethodsTable.$inferInsert

/**
 * Stayea Payment Transactions Log Table
 */
export const stayeaPaymentTransactionsTable = pgTable(
  "stayea_payment_transactions",
  {
    id: text("id").primaryKey(),
    bookingId: text("booking_id").notNull(),
    userId: text("user_id").notNull(),
    amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
    currency: text("currency").notNull().default("VND"),
    paymentMethod: text("payment_method").notNull(),
    status: text("status", {
      enum: ["success", "pending", "failed", "refunded"],
    })
      .notNull()
      .default("pending"),
    transactionRef: text("transaction_ref").notNull().unique(),
    gatewayResponse: jsonb("gateway_response")
      .$type<Record<string, unknown>>()
      .notNull()
      .default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("stayea_payment_tx_ref_idx").on(table.transactionRef),
    index("stayea_payment_tx_booking_idx").on(table.bookingId),
    index("stayea_payment_tx_user_idx").on(table.userId),
  ]
)

export type StayeaPaymentTransaction = typeof stayeaPaymentTransactionsTable.$inferSelect
export type InsertStayeaPaymentTransaction =
  typeof stayeaPaymentTransactionsTable.$inferInsert

/**
 * Partner Payout Requests Table
 */
export const partnerPayoutRequestsTable = pgTable(
  "stayea_partner_payout_requests",
  {
    id: text("id").primaryKey(),
    payoutCode: text("payout_code").notNull().unique(),
    partnerId: text("partner_id").notNull(),
    amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
    currency: text("currency").notNull().default("VND"),
    bankName: text("bank_name").notNull(),
    bankAccount: text("bank_account").notNull(),
    bankAccountHolder: text("bank_account_holder").notNull(),
    status: text("status", {
      enum: ["pending", "approved", "processing", "paid", "rejected"],
    })
      .notNull()
      .default("pending"),
    adminNotes: text("admin_notes"),
    transactionRef: text("transaction_ref"),
    requestedAt: timestamp("requested_at", { withTimezone: true }).notNull().defaultNow(),
    processedAt: timestamp("processed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    uniqueIndex("stayea_payout_code_idx").on(table.payoutCode),
    index("stayea_payout_partner_idx").on(table.partnerId),
    index("stayea_payout_status_idx").on(table.status),
  ]
)

export type PartnerPayoutRequest = typeof partnerPayoutRequestsTable.$inferSelect
export type InsertPartnerPayoutRequest = typeof partnerPayoutRequestsTable.$inferInsert

