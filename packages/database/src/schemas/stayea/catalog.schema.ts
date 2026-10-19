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
 * Stayea Accommodations Table (Stays, Villas, Resorts, Apartments)
 */
export const stayeaAccommodationsTable = pgTable(
  "stayea_accommodations",
  {
    id: text("id").primaryKey(),
    title: text("title").notNull(),
    slug: text("slug").notNull().unique(),
    location: text("location").notNull(),
    category: text("category").notNull(), // villa, resort, apartment, hotel, beachfront
    pricePerNight: numeric("price_per_night", { precision: 12, scale: 2 }).notNull(),
    originalPrice: numeric("original_price", { precision: 12, scale: 2 }),
    rating: numeric("rating", { precision: 3, scale: 2 }).notNull().default("5.00"),
    reviewCount: integer("review_count").notNull().default(0),
    imageUrl: text("image_url").notNull(),
    gallery: jsonb("gallery").$type<string[]>().notNull().default([]),
    badge: text("badge"),
    bedrooms: integer("bedrooms").notNull().default(1),
    bathrooms: integer("bathrooms").notNull().default(1),
    maxGuests: integer("max_guests").notNull().default(2),
    amenities: jsonb("amenities")
      .$type<{ icon: string; label: string }[]>()
      .notNull()
      .default([]),
    isFeatured: boolean("is_featured").notNull().default(false),
    hostName: text("host_name"),
    description: text("description"),
    cancellationPolicy: text("cancellation_policy"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    uniqueIndex("stayea_accommodations_slug_idx").on(table.slug),
    index("stayea_accommodations_category_idx").on(table.category),
    index("stayea_accommodations_featured_idx").on(table.isFeatured),
  ]
)

export type StayeaAccommodation = typeof stayeaAccommodationsTable.$inferSelect
export type InsertStayeaAccommodation = typeof stayeaAccommodationsTable.$inferInsert

/**
 * Stayea Experiences Table (Tours, Island Hops, Scuba, Sunsets)
 */
export const stayeaExperiencesTable = pgTable(
  "stayea_experiences",
  {
    id: text("id").primaryKey(),
    title: text("title").notNull(),
    slug: text("slug").notNull().unique(),
    location: text("location").notNull(),
    category: text("category").notNull(), // tour, island, snorkeling, diving, cruise, food, spa
    duration: text("duration").notNull(),
    rating: numeric("rating", { precision: 3, scale: 2 }).notNull().default("5.00"),
    reviewCount: integer("review_count").notNull().default(0),
    price: numeric("price", { precision: 12, scale: 2 }).notNull(),
    originalPrice: numeric("original_price", { precision: 12, scale: 2 }),
    imageUrl: text("image_url").notNull(),
    gallery: jsonb("gallery").$type<string[]>().notNull().default([]),
    badge: text("badge"),
    departureSchedule: text("departure_schedule"),
    groupSize: text("group_size"),
    highlights: jsonb("highlights").$type<string[]>().notNull().default([]),
    included: jsonb("included").$type<string[]>().notNull().default([]),
    isFeatured: boolean("is_featured").notNull().default(false),
    description: text("description"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    uniqueIndex("stayea_experiences_slug_idx").on(table.slug),
    index("stayea_experiences_category_idx").on(table.category),
    index("stayea_experiences_featured_idx").on(table.isFeatured),
  ]
)

export type StayeaExperience = typeof stayeaExperiencesTable.$inferSelect
export type InsertStayeaExperience = typeof stayeaExperiencesTable.$inferInsert

/**
 * Stayea Packages Table (Combos, 3D2N, All-inclusive vacation packages)
 */
export const stayeaPackagesTable = pgTable(
  "stayea_packages",
  {
    id: text("id").primaryKey(),
    title: text("title").notNull(),
    slug: text("slug").notNull().unique(),
    destination: text("destination").notNull(),
    duration: text("duration").notNull(),
    rating: numeric("rating", { precision: 3, scale: 2 }).notNull().default("5.00"),
    reviewCount: integer("review_count").notNull().default(0),
    price: numeric("price", { precision: 12, scale: 2 }).notNull(),
    originalPrice: numeric("original_price", { precision: 12, scale: 2 }),
    imageUrl: text("image_url").notNull(),
    badge: text("badge"),
    audience: text("audience").notNull().default("all"), // couple, family, luxury, wellness, all
    includedServices: jsonb("included_services").$type<string[]>().notNull().default([]),
    itinerarySummary: jsonb("itinerary_summary")
      .$type<{ day: number; title: string; activities: string[] }[]>()
      .notNull()
      .default([]),
    isFeatured: boolean("is_featured").notNull().default(false),
    description: text("description"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    uniqueIndex("stayea_packages_slug_idx").on(table.slug),
    index("stayea_packages_audience_idx").on(table.audience),
    index("stayea_packages_featured_idx").on(table.isFeatured),
  ]
)

export type StayeaPackage = typeof stayeaPackagesTable.$inferSelect
export type InsertStayeaPackage = typeof stayeaPackagesTable.$inferInsert

/**
 * Stayea Flights Table (Domestic & International Flight Schedules)
 */
export const stayeaFlightsTable = pgTable(
  "stayea_flights",
  {
    id: text("id").primaryKey(),
    flightNumber: text("flight_number").notNull(),
    airlineCode: text("airline_code").notNull(), // VN, VJ, QH, VU
    airlineName: text("airline_name").notNull(),
    airlineLogo: text("airline_logo").notNull(),
    departureAirport: text("departure_airport").notNull(), // SGN, HAN, DAD
    departureCity: text("departure_city").notNull(),
    arrivalAirport: text("arrival_airport").notNull(), // PQC
    arrivalCity: text("arrival_city").notNull(),
    departureTime: text("departure_time").notNull(),
    arrivalTime: text("arrival_time").notNull(),
    duration: text("duration").notNull(),
    seatClass: text("seat_class").notNull().default("economy"), // economy, business
    price: numeric("price", { precision: 12, scale: 2 }).notNull(),
    baggageCabin: text("baggage_cabin").notNull().default("7kg"),
    baggageChecked: text("baggage_checked").notNull().default("20kg"),
    aircraft: text("aircraft"),
    stops: integer("stops").notNull().default(0),
    departureDate: text("departure_date"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("stayea_flights_route_idx").on(table.departureAirport, table.arrivalAirport),
    index("stayea_flights_number_idx").on(table.flightNumber),
  ]
)

export type StayeaFlight = typeof stayeaFlightsTable.$inferSelect
export type InsertStayeaFlight = typeof stayeaFlightsTable.$inferInsert

/**
 * Stayea Promotions Table (Public Deals & Voucher Templates)
 */
export const stayeaPromotionsTable = pgTable(
  "stayea_promotions",
  {
    id: text("id").primaryKey(),
    code: text("code").notNull().unique(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    discountType: text("discount_type", { enum: ["percentage", "fixed"] })
      .notNull()
      .default("percentage"),
    discountValue: numeric("discount_value", { precision: 10, scale: 2 }).notNull(),
    maxDiscount: numeric("max_discount", { precision: 12, scale: 2 }),
    minSpend: numeric("min_spend", { precision: 12, scale: 2 }).notNull().default("0"),
    category: text("category").notNull().default("all"), // all, stay, flight, tour, combo, exclusive
    badge: text("badge"),
    imageUrl: text("image_url"),
    terms: jsonb("terms").$type<string[]>().notNull().default([]),
    startDate: timestamp("start_date", { withTimezone: true }),
    endDate: timestamp("end_date", { withTimezone: true }),
    usageLimit: integer("usage_limit"),
    usedCount: integer("used_count").notNull().default(0),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    uniqueIndex("stayea_promotions_code_idx").on(table.code),
    index("stayea_promotions_category_idx").on(table.category),
    index("stayea_promotions_active_idx").on(table.isActive),
  ]
)

export type StayeaPromotion = typeof stayeaPromotionsTable.$inferSelect
export type InsertStayeaPromotion = typeof stayeaPromotionsTable.$inferInsert
