import {
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
 * Stayea Unified Bookings Table
 *
 * Supports bookings for all 4 verticals (Stays, Flights, Experiences, Packages)
 */
export const stayeaBookingsTable = pgTable(
  "stayea_bookings",
  {
    id: text("id").primaryKey(),
    bookingCode: text("booking_code").notNull().unique(),
    userId: text("user_id").notNull(),
    bookingType: text("booking_type", {
      enum: ["stay", "flight", "experience", "package", "combo"],
    }).notNull(),
    title: text("title").notNull(),
    destination: text("destination").notNull(),
    startDate: text("start_date").notNull(),
    endDate: text("end_date").notNull(),
    guestCount: integer("guest_count").notNull().default(1),
    status: text("status", {
      enum: ["pending", "confirmed", "completed", "cancelled", "refunded"],
    })
      .notNull()
      .default("pending"),
    paymentStatus: text("payment_status", {
      enum: ["unpaid", "paid", "refunded", "failed"],
    })
      .notNull()
      .default("unpaid"),
    paymentMethod: text("payment_method"), // credit_card, bank_transfer, e_wallet, points
    totalAmount: numeric("total_amount", { precision: 12, scale: 2 }).notNull(),
    discountAmount: numeric("discount_amount", { precision: 12, scale: 2 }).notNull().default("0"),
    finalAmount: numeric("final_amount", { precision: 12, scale: 2 }).notNull(),
    currency: text("currency").notNull().default("VND"),
    voucherCode: text("voucher_code"),
    pointsUsed: integer("points_used").notNull().default(0),
    pointsEarned: integer("points_earned").notNull().default(0),
    details: jsonb("details")
      .$type<{
        stayId?: string
        roomType?: string
        nightCount?: number
        flightId?: string
        flightNumber?: string
        seatClass?: string
        experienceId?: string
        packageId?: string
        passengers?: { fullName: string; idNumber?: string; type: "adult" | "child" }[]
        contactInfo?: { fullName: string; email: string; phone: string; note?: string }
        metadata?: Record<string, unknown>
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
    uniqueIndex("stayea_bookings_code_idx").on(table.bookingCode),
    index("stayea_bookings_user_id_idx").on(table.userId),
    index("stayea_bookings_status_idx").on(table.status),
    index("stayea_bookings_type_idx").on(table.bookingType),
  ]
)

export type StayeaBooking = typeof stayeaBookingsTable.$inferSelect
export type InsertStayeaBooking = typeof stayeaBookingsTable.$inferInsert
