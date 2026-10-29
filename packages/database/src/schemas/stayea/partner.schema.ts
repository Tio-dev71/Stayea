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
 * Partner Profiles Table
 *
 * Stores partner business entities (Homestay hosts, car/vehicle rental fleets, tour operators).
 */
export const partnerProfilesTable = pgTable(
  "stayea_partner_profiles",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull(),
    businessName: text("business_name").notNull(),
    businessType: text("business_type", {
      enum: ["homestay", "transport", "tour", "combo", "multi"],
    })
      .notNull()
      .default("homestay"),
    contactName: text("contact_name").notNull(),
    phone: text("phone").notNull(),
    email: text("email").notNull(),
    address: text("address"),
    city: text("city").notNull().default("Phú Quốc"),
    taxId: text("tax_id"),
    bankName: text("bank_name"),
    bankAccount: text("bank_account"),
    bankAccountHolder: text("bank_account_holder"),
    status: text("status", {
      enum: ["pending", "approved", "rejected", "suspended"],
    })
      .notNull()
      .default("approved"),
    commissionRate: numeric("commission_rate", { precision: 5, scale: 2 })
      .notNull()
      .default("10.00"),
    rating: numeric("rating", { precision: 3, scale: 2 }).notNull().default("5.00"),
    totalOrders: integer("total_orders").notNull().default(0),
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
    index("stayea_partner_user_id_idx").on(table.userId),
    index("stayea_partner_status_idx").on(table.status),
    index("stayea_partner_type_idx").on(table.businessType),
  ]
)

export type PartnerProfile = typeof partnerProfilesTable.$inferSelect
export type InsertPartnerProfile = typeof partnerProfilesTable.$inferInsert

/**
 * Partner Services Table
 *
 * Accommodations, Car/Transport fleets, and Experiences registered by the partner.
 */
export const partnerServicesTable = pgTable(
  "stayea_partner_services",
  {
    id: text("id").primaryKey(),
    partnerId: text("partner_id").notNull(),
    serviceType: text("service_type", {
      enum: ["stay", "transport", "experience", "package"],
    }).notNull(),
    title: text("title").notNull(),
    description: text("description"),
    location: text("location").notNull(),
    price: numeric("price", { precision: 12, scale: 2 }).notNull(),
    originalPrice: numeric("original_price", { precision: 12, scale: 2 }),
    unit: text("unit").notNull().default("đêm"), // đêm, ngày, chuyến, vé/khách, giờ
    images: jsonb("images").$type<string[]>().notNull().default([]),
    attributes: jsonb("attributes")
      .$type<{
        vehicleType?: "xe_4_cho" | "xe_7_cho" | "xe_16_cho" | "xe_may" | "can_o" | string
        transmission?: "tu_dong" | "so_san" | string
        hasDriver?: boolean
        bedrooms?: number
        bathrooms?: number
        maxGuests?: number
        amenities?: string[]
        schedule?: string
        duration?: string
        cancellationPolicy?: string
      }>()
      .notNull()
      .default({}),
    status: text("status", {
      enum: ["active", "inactive", "pending_approval"],
    })
      .notNull()
      .default("active"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("stayea_partner_services_partner_idx").on(table.partnerId),
    index("stayea_partner_services_type_idx").on(table.serviceType),
    index("stayea_partner_services_status_idx").on(table.status),
  ]
)

export type PartnerService = typeof partnerServicesTable.$inferSelect
export type InsertPartnerService = typeof partnerServicesTable.$inferInsert

/**
 * Partner Inventory & Daily Availability Table
 */
export const partnerInventoryTable = pgTable(
  "stayea_partner_inventory",
  {
    id: text("id").primaryKey(),
    partnerId: text("partner_id").notNull(),
    serviceId: text("service_id").notNull(),
    date: text("date").notNull(), // Format: YYYY-MM-DD
    totalSlots: integer("total_slots").notNull().default(1),
    bookedSlots: integer("booked_slots").notNull().default(0),
    isAvailable: boolean("is_available").notNull().default(true),
    priceOverride: numeric("price_override", { precision: 12, scale: 2 }),
    note: text("note"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    uniqueIndex("stayea_inventory_service_date_idx").on(table.serviceId, table.date),
    index("stayea_inventory_partner_idx").on(table.partnerId),
  ]
)

export type PartnerInventory = typeof partnerInventoryTable.$inferSelect
export type InsertPartnerInventory = typeof partnerInventoryTable.$inferInsert

/**
 * Partner Orders Table
 *
 * Workflow:
 * 1. AI Agent / Customer requests service -> Order created as 'pending_admin'
 * 2. Admin inspects & approves -> 'admin_approved' -> dispatches to partner -> 'sent_to_partner'
 * 3. Partner accepts -> 'partner_accepted' (or rejects -> 'partner_rejected')
 * 4. Fulfilled -> 'completed'
 */
export const partnerOrdersTable = pgTable(
  "stayea_partner_orders",
  {
    id: text("id").primaryKey(),
    orderCode: text("order_code").notNull().unique(),
    partnerId: text("partner_id").notNull(),
    serviceId: text("service_id").notNull(),
    bookingId: text("booking_id"),
    customerName: text("customer_name").notNull(),
    customerPhone: text("customer_phone").notNull(),
    customerEmail: text("customer_email"),
    serviceTitle: text("service_title").notNull(),
    serviceType: text("service_type").notNull(),
    startDate: text("start_date").notNull(),
    endDate: text("end_date"),
    quantity: integer("quantity").notNull().default(1),
    unitPrice: numeric("unit_price", { precision: 12, scale: 2 }).notNull(),
    totalAmount: numeric("total_amount", { precision: 12, scale: 2 }).notNull(),
    commissionAmount: numeric("commission_amount", { precision: 12, scale: 2 })
      .notNull()
      .default("0"),
    partnerPayoutAmount: numeric("partner_payout_amount", {
      precision: 12,
      scale: 2,
    }).notNull(),
    status: text("status", {
      enum: [
        "pending_admin",
        "admin_approved",
        "sent_to_partner",
        "partner_accepted",
        "partner_rejected",
        "in_progress",
        "completed",
        "cancelled",
      ],
    })
      .notNull()
      .default("pending_admin"),
    source: text("source", {
      enum: ["ai_agent", "direct_customer", "admin_manual"],
    })
      .notNull()
      .default("direct_customer"),
    adminNotes: text("admin_notes"),
    partnerNotes: text("partner_notes"),
    rejectionReason: text("rejection_reason"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    uniqueIndex("stayea_partner_orders_code_idx").on(table.orderCode),
    index("stayea_partner_orders_partner_idx").on(table.partnerId),
    index("stayea_partner_orders_status_idx").on(table.status),
    index("stayea_partner_orders_created_idx").on(table.createdAt),
  ]
)

export type PartnerOrder = typeof partnerOrdersTable.$inferSelect
export type InsertPartnerOrder = typeof partnerOrdersTable.$inferInsert

