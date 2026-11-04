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
 * STAYEA PMS Room Types Table
 *
 * Defines room categories/classes within a hotel/homestay property.
 */
export const stayeaPmsRoomTypesTable = pgTable(
  "stayea_pms_room_types",
  {
    id: text("id").primaryKey(),
    partnerId: text("partner_id").notNull(),
    serviceId: text("service_id"), // Optional link to stayea_partner_services (marketplace listing)
    name: text("name").notNull(), // e.g. "Phòng Deluxe King Ban Công", "Phòng Superior 2 Giường Đơn"
    code: text("code").notNull(), // e.g. "DLX-KING", "SUP-TWIN"
    basePrice: numeric("base_price", { precision: 12, scale: 2 }).notNull(),
    hourlyPrice: numeric("hourly_price", { precision: 12, scale: 2 }).default("0"),
    maxOccupancy: integer("max_occupancy").notNull().default(2),
    maxAdults: integer("max_adults").notNull().default(2),
    maxChildren: integer("max_children").notNull().default(1),
    amenities: jsonb("amenities").$type<string[]>().notNull().default([]),
    description: text("description"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("stayea_pms_room_types_partner_idx").on(table.partnerId),
    index("stayea_pms_room_types_service_idx").on(table.serviceId),
  ]
)

export type StayeaPmsRoomType = typeof stayeaPmsRoomTypesTable.$inferSelect
export type InsertStayeaPmsRoomType = typeof stayeaPmsRoomTypesTable.$inferInsert

/**
 * STAYEA PMS Physical Rooms Table
 *
 * Manages physical hotel/homestay rooms (Room 101, 102, Villa A, etc.)
 */
export const stayeaPmsRoomsTable = pgTable(
  "stayea_pms_rooms",
  {
    id: text("id").primaryKey(),
    partnerId: text("partner_id").notNull(),
    roomTypeId: text("room_type_id")
      .notNull()
      .references(() => stayeaPmsRoomTypesTable.id, { onDelete: "cascade" }),
    roomNumber: text("room_number").notNull(), // e.g. "101", "202", "Villa 1"
    floor: text("floor").notNull().default("1"),
    status: text("status", {
      enum: ["vacant_clean", "vacant_dirty", "occupied", "reserved", "maintenance"],
    })
      .notNull()
      .default("vacant_clean"),
    housekeepingStatus: text("housekeeping_status", {
      enum: ["clean", "dirty", "cleaning", "inspecting"],
    })
      .notNull()
      .default("clean"),
    housekeepingAssignedTo: text("housekeeping_assigned_to"),
    housekeepingUpdatedAt: timestamp("housekeeping_updated_at", { withTimezone: true }),
    note: text("note"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    uniqueIndex("stayea_pms_rooms_partner_number_idx").on(table.partnerId, table.roomNumber),
    index("stayea_pms_rooms_partner_idx").on(table.partnerId),
    index("stayea_pms_rooms_type_idx").on(table.roomTypeId),
    index("stayea_pms_rooms_status_idx").on(table.status),
  ]
)

export type StayeaPmsRoom = typeof stayeaPmsRoomsTable.$inferSelect
export type InsertStayeaPmsRoom = typeof stayeaPmsRoomsTable.$inferInsert

/**
 * STAYEA PMS Reservations / Stays Table
 *
 * Tracks guest reservations, walk-in check-ins, and marketplace bookings.
 */
export const stayeaPmsReservationsTable = pgTable(
  "stayea_pms_reservations",
  {
    id: text("id").primaryKey(),
    reservationCode: text("reservation_code").notNull().unique(),
    partnerId: text("partner_id").notNull(),
    roomId: text("room_id").references(() => stayeaPmsRoomsTable.id, { onDelete: "set null" }),
    roomTypeId: text("room_type_id")
      .notNull()
      .references(() => stayeaPmsRoomTypesTable.id),
    bookingId: text("booking_id"), // Optional reference to marketplace booking
    partnerOrderId: text("partner_order_id"),
    channel: text("channel", {
      enum: ["direct_walkin", "direct_phone", "stayea_marketplace", "ota_other"],
    })
      .notNull()
      .default("direct_walkin"),
    guestName: text("guest_name").notNull(),
    guestPhone: text("guest_phone").notNull(),
    guestEmail: text("guest_email"),
    guestIdNumber: text("guest_id_number"), // CCCD / Passport
    guestCount: integer("guest_count").notNull().default(1),
    adultsCount: integer("adults_count").notNull().default(1),
    childrenCount: integer("children_count").notNull().default(0),
    expectedCheckIn: timestamp("expected_check_in", { withTimezone: true }).notNull(),
    expectedCheckOut: timestamp("expected_check_out", { withTimezone: true }).notNull(),
    actualCheckIn: timestamp("actual_check_in", { withTimezone: true }),
    actualCheckOut: timestamp("actual_check_out", { withTimezone: true }),
    roomRate: numeric("room_rate", { precision: 12, scale: 2 }).notNull(),
    totalNights: integer("total_nights").notNull().default(1),
    status: text("status", {
      enum: ["confirmed", "checked_in", "checked_out", "cancelled", "no_show"],
    })
      .notNull()
      .default("confirmed"),
    depositAmount: numeric("deposit_amount", { precision: 12, scale: 2 })
      .notNull()
      .default("0"),
    paymentStatus: text("payment_status", {
      enum: ["unpaid", "partial", "paid", "refunded"],
    })
      .notNull()
      .default("unpaid"),
    earlyCheckinFee: numeric("early_checkin_fee", { precision: 12, scale: 2 })
      .notNull()
      .default("0"),
    lateCheckoutFee: numeric("late_checkout_fee", { precision: 12, scale: 2 })
      .notNull()
      .default("0"),
    discountAmount: numeric("discount_amount", { precision: 12, scale: 2 })
      .notNull()
      .default("0"),
    specialRequests: text("special_requests"),
    internalNotes: text("internal_notes"),
    createdBy: text("created_by").notNull().default("Lễ tân"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    uniqueIndex("stayea_pms_reservations_code_idx").on(table.reservationCode),
    index("stayea_pms_reservations_partner_idx").on(table.partnerId),
    index("stayea_pms_reservations_room_idx").on(table.roomId),
    index("stayea_pms_reservations_status_idx").on(table.status),
    index("stayea_pms_reservations_dates_idx").on(table.expectedCheckIn, table.expectedCheckOut),
  ]
)

export type StayeaPmsReservation = typeof stayeaPmsReservationsTable.$inferSelect
export type InsertStayeaPmsReservation = typeof stayeaPmsReservationsTable.$inferInsert

/**
 * STAYEA PMS Folios (Room Billing Invoices)
 *
 * Single source of truth for all charges and payments incurred during a stay.
 */
export const stayeaPmsFoliosTable = pgTable(
  "stayea_pms_folios",
  {
    id: text("id").primaryKey(),
    partnerId: text("partner_id").notNull(),
    reservationId: text("reservation_id")
      .notNull()
      .unique()
      .references(() => stayeaPmsReservationsTable.id, { onDelete: "cascade" }),
    folioNumber: text("folio_number").notNull().unique(),
    roomCharges: numeric("room_charges", { precision: 12, scale: 2 }).notNull().default("0"),
    serviceCharges: numeric("service_charges", { precision: 12, scale: 2 }).notNull().default("0"),
    surcharges: numeric("surcharges", { precision: 12, scale: 2 }).notNull().default("0"),
    discountAmount: numeric("discount_amount", { precision: 12, scale: 2 }).notNull().default("0"),
    taxAmount: numeric("tax_amount", { precision: 12, scale: 2 }).notNull().default("0"),
    totalAmount: numeric("total_amount", { precision: 12, scale: 2 }).notNull().default("0"),
    paidAmount: numeric("paid_amount", { precision: 12, scale: 2 }).notNull().default("0"),
    remainingBalance: numeric("remaining_balance", { precision: 12, scale: 2 })
      .notNull()
      .default("0"),
    status: text("status", {
      enum: ["open", "closed", "void"],
    })
      .notNull()
      .default("open"),
    closedAt: timestamp("closed_at", { withTimezone: true }),
    closedBy: text("closed_by"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    uniqueIndex("stayea_pms_folios_number_idx").on(table.folioNumber),
    index("stayea_pms_folios_partner_idx").on(table.partnerId),
    index("stayea_pms_folios_res_idx").on(table.reservationId),
    index("stayea_pms_folios_status_idx").on(table.status),
  ]
)

export type StayeaPmsFolio = typeof stayeaPmsFoliosTable.$inferSelect
export type InsertStayeaPmsFolio = typeof stayeaPmsFoliosTable.$inferInsert

/**
 * STAYEA PMS Folio Line Items
 *
 * Detailed charges incurred: room rates, minibar bottles, laundry items, restaurant bills.
 */
export const stayeaPmsFolioItemsTable = pgTable(
  "stayea_pms_folio_items",
  {
    id: text("id").primaryKey(),
    partnerId: text("partner_id").notNull(),
    folioId: text("folio_id")
      .notNull()
      .references(() => stayeaPmsFoliosTable.id, { onDelete: "cascade" }),
    itemType: text("item_type", {
      enum: ["room_charge", "minibar", "laundry", "fnb", "spa", "surcharge", "discount", "custom"],
    })
      .notNull()
      .default("custom"),
    serviceItemId: text("service_item_id"), // Optional reference to stayea_pms_service_items
    description: text("description").notNull(),
    quantity: numeric("quantity", { precision: 8, scale: 2 }).notNull().default("1"),
    unitPrice: numeric("unit_price", { precision: 12, scale: 2 }).notNull(),
    amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
    recordedBy: text("recorded_by").notNull(),
    recordedAt: timestamp("recorded_at", { withTimezone: true }).notNull().defaultNow(),
    isCancelled: boolean("is_cancelled").notNull().default(false),
    cancellationReason: text("cancellation_reason"),
    cancelledBy: text("cancelled_by"),
    cancelledAt: timestamp("cancelled_at", { withTimezone: true }),
    note: text("note"),
  },
  (table) => [
    index("stayea_pms_folio_items_folio_idx").on(table.folioId),
    index("stayea_pms_folio_items_partner_idx").on(table.partnerId),
    index("stayea_pms_folio_items_type_idx").on(table.itemType),
  ]
)

export type StayeaPmsFolioItem = typeof stayeaPmsFolioItemsTable.$inferSelect
export type InsertStayeaPmsFolioItem = typeof stayeaPmsFolioItemsTable.$inferInsert

/**
 * STAYEA PMS Folio Payments
 *
 * Records payments made towards a folio: cash at desk, bank QR transfer, credit card POS.
 */
export const stayeaPmsFolioPaymentsTable = pgTable(
  "stayea_pms_folio_payments",
  {
    id: text("id").primaryKey(),
    partnerId: text("partner_id").notNull(),
    folioId: text("folio_id")
      .notNull()
      .references(() => stayeaPmsFoliosTable.id, { onDelete: "cascade" }),
    paymentMethod: text("payment_method", {
      enum: ["cash", "bank_transfer", "credit_card", "stayea_prepaid"],
    })
      .notNull()
      .default("cash"),
    amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
    isDeposit: boolean("is_deposit").notNull().default(false),
    referenceCode: text("reference_code"),
    note: text("note"),
    recordedBy: text("recorded_by").notNull(),
    recordedAt: timestamp("recorded_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("stayea_pms_payments_folio_idx").on(table.folioId),
    index("stayea_pms_payments_partner_idx").on(table.partnerId),
  ]
)

export type StayeaPmsFolioPayment = typeof stayeaPmsFolioPaymentsTable.$inferSelect
export type InsertStayeaPmsFolioPayment = typeof stayeaPmsFolioPaymentsTable.$inferInsert

/**
 * STAYEA PMS Service & Minibar Catalog Table
 *
 * Products and extra services sold at the property (minibar, laundry, breakfast, etc.)
 */
export const stayeaPmsServiceItemsTable = pgTable(
  "stayea_pms_service_items",
  {
    id: text("id").primaryKey(),
    partnerId: text("partner_id").notNull(),
    category: text("category", {
      enum: ["minibar_drink", "minibar_food", "laundry", "fnb", "spa", "transport", "surcharge", "other"],
    })
      .notNull()
      .default("minibar_drink"),
    name: text("name").notNull(),
    code: text("code").notNull(),
    unit: text("unit").notNull().default("chai"), // chai, lon, gói, cái, suất, lần
    sellingPrice: numeric("selling_price", { precision: 12, scale: 2 }).notNull(),
    costPrice: numeric("cost_price", { precision: 12, scale: 2 }).notNull().default("0"),
    trackInventory: boolean("track_inventory").notNull().default(true),
    currentStock: integer("current_stock").notNull().default(0),
    minStockAlert: integer("min_stock_alert").notNull().default(5),
    status: text("status", {
      enum: ["active", "inactive"],
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
    uniqueIndex("stayea_pms_service_items_partner_code_idx").on(table.partnerId, table.code),
    index("stayea_pms_service_items_partner_idx").on(table.partnerId),
    index("stayea_pms_service_items_category_idx").on(table.category),
  ]
)

export type StayeaPmsServiceItem = typeof stayeaPmsServiceItemsTable.$inferSelect
export type InsertStayeaPmsServiceItem = typeof stayeaPmsServiceItemsTable.$inferInsert

/**
 * STAYEA PMS Inventory Transactions Table
 *
 * Records inventory in/out/adjustment for minibar & supplies.
 */
export const stayeaPmsInventoryTransactionsTable = pgTable(
  "stayea_pms_inventory_transactions",
  {
    id: text("id").primaryKey(),
    partnerId: text("partner_id").notNull(),
    itemId: text("item_id")
      .notNull()
      .references(() => stayeaPmsServiceItemsTable.id, { onDelete: "cascade" }),
    transactionType: text("transaction_type", {
      enum: ["in", "out_sale", "out_loss", "adjustment"],
    }).notNull(),
    quantity: integer("quantity").notNull(), // positive for in/adjustment, negative for out
    unitCost: numeric("unit_cost", { precision: 12, scale: 2 }).notNull().default("0"),
    previousStock: integer("previous_stock").notNull(),
    newStock: integer("new_stock").notNull(),
    referenceFolioId: text("reference_folio_id"),
    referenceRoomNumber: text("reference_room_number"),
    reason: text("reason"),
    performedBy: text("performed_by").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("stayea_pms_inv_tx_partner_idx").on(table.partnerId),
    index("stayea_pms_inv_tx_item_idx").on(table.itemId),
    index("stayea_pms_inv_tx_created_idx").on(table.createdAt),
  ]
)

export type StayeaPmsInventoryTransaction = typeof stayeaPmsInventoryTransactionsTable.$inferSelect
export type InsertStayeaPmsInventoryTransaction =
  typeof stayeaPmsInventoryTransactionsTable.$inferInsert

/**
 * STAYEA PMS Staff Roles & Permissions Table
 *
 * Maps staff members to property-level operational roles.
 */
export const stayeaPmsStaffRolesTable = pgTable(
  "stayea_pms_staff_roles",
  {
    id: text("id").primaryKey(),
    partnerId: text("partner_id").notNull(),
    userId: text("user_id").notNull(),
    fullName: text("full_name").notNull(),
    email: text("email").notNull(),
    phone: text("phone"),
    role: text("role", {
      enum: ["owner", "manager", "receptionist", "cashier", "housekeeping"],
    })
      .notNull()
      .default("receptionist"),
    status: text("status", {
      enum: ["active", "inactive"],
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
    uniqueIndex("stayea_pms_staff_partner_user_idx").on(table.partnerId, table.userId),
    index("stayea_pms_staff_partner_idx").on(table.partnerId),
  ]
)

export type StayeaPmsStaffRole = typeof stayeaPmsStaffRolesTable.$inferSelect
export type InsertStayeaPmsStaffRole = typeof stayeaPmsStaffRolesTable.$inferInsert

/**
 * STAYEA PMS Audit Logs Table
 *
 * Immutable audit trail for all sensitive operations (void folio items, early checkouts, inventory adjustments).
 */
export const stayeaPmsAuditLogsTable = pgTable(
  "stayea_pms_audit_logs",
  {
    id: text("id").primaryKey(),
    partnerId: text("partner_id").notNull(),
    action: text("action").notNull(), // 'cancel_folio_item', 'reopen_folio', 'room_transfer', 'inventory_adjust', etc.
    entityType: text("entity_type").notNull(), // 'folio', 'reservation', 'inventory', 'room'
    entityId: text("entity_id").notNull(),
    oldValues: jsonb("old_values").$type<Record<string, unknown>>(),
    newValues: jsonb("new_values").$type<Record<string, unknown>>(),
    reason: text("reason").notNull(),
    performedBy: text("performed_by").notNull(),
    ipAddress: text("ip_address"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("stayea_pms_audit_partner_idx").on(table.partnerId),
    index("stayea_pms_audit_action_idx").on(table.action),
    index("stayea_pms_audit_created_idx").on(table.createdAt),
  ]
)

export type StayeaPmsAuditLog = typeof stayeaPmsAuditLogsTable.$inferSelect
export type InsertStayeaPmsAuditLog = typeof stayeaPmsAuditLogsTable.$inferInsert
