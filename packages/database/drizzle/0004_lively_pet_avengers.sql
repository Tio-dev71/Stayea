CREATE TYPE "public"."user_role" AS ENUM('ADMIN', 'USER');--> statement-breakpoint
CREATE TYPE "public"."login_status" AS ENUM('success', 'failed');--> statement-breakpoint
CREATE TABLE "login_logs" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text,
	"email" text NOT NULL,
	"status" "login_status" NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"fail_reason" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "stayea_accommodations" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"location" text NOT NULL,
	"category" text NOT NULL,
	"price_per_night" numeric(12, 2) NOT NULL,
	"original_price" numeric(12, 2),
	"rating" numeric(3, 2) DEFAULT '5.00' NOT NULL,
	"review_count" integer DEFAULT 0 NOT NULL,
	"image_url" text NOT NULL,
	"gallery" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"badge" text,
	"bedrooms" integer DEFAULT 1 NOT NULL,
	"bathrooms" integer DEFAULT 1 NOT NULL,
	"max_guests" integer DEFAULT 2 NOT NULL,
	"amenities" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"is_featured" boolean DEFAULT false NOT NULL,
	"host_name" text,
	"description" text,
	"cancellation_policy" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "stayea_accommodations_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "stayea_experiences" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"location" text NOT NULL,
	"category" text NOT NULL,
	"duration" text NOT NULL,
	"rating" numeric(3, 2) DEFAULT '5.00' NOT NULL,
	"review_count" integer DEFAULT 0 NOT NULL,
	"price" numeric(12, 2) NOT NULL,
	"original_price" numeric(12, 2),
	"image_url" text NOT NULL,
	"gallery" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"badge" text,
	"departure_schedule" text,
	"group_size" text,
	"highlights" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"included" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"is_featured" boolean DEFAULT false NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "stayea_experiences_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "stayea_flights" (
	"id" text PRIMARY KEY NOT NULL,
	"flight_number" text NOT NULL,
	"airline_code" text NOT NULL,
	"airline_name" text NOT NULL,
	"airline_logo" text NOT NULL,
	"departure_airport" text NOT NULL,
	"departure_city" text NOT NULL,
	"arrival_airport" text NOT NULL,
	"arrival_city" text NOT NULL,
	"departure_time" text NOT NULL,
	"arrival_time" text NOT NULL,
	"duration" text NOT NULL,
	"seat_class" text DEFAULT 'economy' NOT NULL,
	"price" numeric(12, 2) NOT NULL,
	"baggage_cabin" text DEFAULT '7kg' NOT NULL,
	"baggage_checked" text DEFAULT '20kg' NOT NULL,
	"aircraft" text,
	"stops" integer DEFAULT 0 NOT NULL,
	"departure_date" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "stayea_packages" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"destination" text NOT NULL,
	"duration" text NOT NULL,
	"rating" numeric(3, 2) DEFAULT '5.00' NOT NULL,
	"review_count" integer DEFAULT 0 NOT NULL,
	"price" numeric(12, 2) NOT NULL,
	"original_price" numeric(12, 2),
	"image_url" text NOT NULL,
	"badge" text,
	"audience" text DEFAULT 'all' NOT NULL,
	"included_services" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"itinerary_summary" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"is_featured" boolean DEFAULT false NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "stayea_packages_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "stayea_promotions" (
	"id" text PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"discount_type" text DEFAULT 'percentage' NOT NULL,
	"discount_value" numeric(10, 2) NOT NULL,
	"max_discount" numeric(12, 2),
	"min_spend" numeric(12, 2) DEFAULT '0' NOT NULL,
	"category" text DEFAULT 'all' NOT NULL,
	"badge" text,
	"image_url" text,
	"terms" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"start_date" timestamp with time zone,
	"end_date" timestamp with time zone,
	"usage_limit" integer,
	"used_count" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "stayea_promotions_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "stayea_bookings" (
	"id" text PRIMARY KEY NOT NULL,
	"booking_code" text NOT NULL,
	"user_id" text NOT NULL,
	"booking_type" text NOT NULL,
	"title" text NOT NULL,
	"destination" text NOT NULL,
	"start_date" text NOT NULL,
	"end_date" text NOT NULL,
	"guest_count" integer DEFAULT 1 NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"payment_status" text DEFAULT 'unpaid' NOT NULL,
	"payment_method" text,
	"total_amount" numeric(12, 2) NOT NULL,
	"discount_amount" numeric(12, 2) DEFAULT '0' NOT NULL,
	"final_amount" numeric(12, 2) NOT NULL,
	"currency" text DEFAULT 'VND' NOT NULL,
	"voucher_code" text,
	"points_used" integer DEFAULT 0 NOT NULL,
	"points_earned" integer DEFAULT 0 NOT NULL,
	"details" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "stayea_bookings_booking_code_unique" UNIQUE("booking_code")
);
--> statement-breakpoint
CREATE TABLE "stayea_club_perks" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"offer_id" text NOT NULL,
	"title" text NOT NULL,
	"discount" text NOT NULL,
	"code" text NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expires_at" timestamp with time zone,
	"used_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "stayea_club_points_transactions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"points" integer NOT NULL,
	"type" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"booking_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "stayea_club_profiles" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"tier" text DEFAULT 'Silver' NOT NULL,
	"points_balance" integer DEFAULT 0 NOT NULL,
	"points_to_next_tier" integer DEFAULT 1000 NOT NULL,
	"current_progress_percent" integer DEFAULT 0 NOT NULL,
	"member_since" text NOT NULL,
	"card_code" text NOT NULL,
	"expires_at" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "stayea_club_profiles_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "stayea_payment_methods" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"type" text NOT NULL,
	"brand" text NOT NULL,
	"title" text NOT NULL,
	"is_default" boolean DEFAULT false NOT NULL,
	"details" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "stayea_payment_transactions" (
	"id" text PRIMARY KEY NOT NULL,
	"booking_id" text NOT NULL,
	"user_id" text NOT NULL,
	"amount" numeric(12, 2) NOT NULL,
	"currency" text DEFAULT 'VND' NOT NULL,
	"payment_method" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"transaction_ref" text NOT NULL,
	"gateway_response" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "stayea_payment_transactions_transaction_ref_unique" UNIQUE("transaction_ref")
);
--> statement-breakpoint
CREATE TABLE "stayea_favorites" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"item_type" text NOT NULL,
	"item_id" text NOT NULL,
	"title" text NOT NULL,
	"location" text,
	"image_url" text NOT NULL,
	"price" numeric(12, 2) NOT NULL,
	"rating" numeric(3, 2) DEFAULT '5.00',
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "stayea_reviews" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"item_type" text NOT NULL,
	"item_id" text NOT NULL,
	"item_title" text NOT NULL,
	"rating" integer DEFAULT 5 NOT NULL,
	"comment" text NOT NULL,
	"author_name" text NOT NULL,
	"author_avatar" text,
	"status" text DEFAULT 'approved' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "stayea_user_plans" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"title" text NOT NULL,
	"destination" text NOT NULL,
	"dates" text NOT NULL,
	"cover_image" text NOT NULL,
	"status" text DEFAULT 'planning' NOT NULL,
	"itinerary" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "stayea_user_settings" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"email_notifications" jsonb DEFAULT '{"bookingConfirmations":true,"promotionsAndDiscounts":true,"travelReminders":true,"newsletter":false}'::jsonb NOT NULL,
	"push_notifications" jsonb DEFAULT '{"orderStatus":true,"priceDropAlerts":true,"specialOffers":true}'::jsonb NOT NULL,
	"language" text DEFAULT 'vi' NOT NULL,
	"currency" text DEFAULT 'VND' NOT NULL,
	"two_factor_enabled" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "stayea_user_settings_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "stayea_user_vouchers" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"promotion_id" text NOT NULL,
	"code" text NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"discount_type" text NOT NULL,
	"discount_value" numeric(10, 2) NOT NULL,
	"min_spend" numeric(12, 2) DEFAULT '0' NOT NULL,
	"max_discount" numeric(12, 2),
	"category" text DEFAULT 'all' NOT NULL,
	"is_used" boolean DEFAULT false NOT NULL,
	"used_at" timestamp with time zone,
	"expires_at" timestamp with time zone,
	"claimed_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "profiles" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "conversation" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "conversation_message" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "conversation_message_vote" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "conversation_stream" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "artifact" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "artifact_suggestion" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "profiles" CASCADE;--> statement-breakpoint
DROP TABLE "conversation" CASCADE;--> statement-breakpoint
DROP TABLE "conversation_message" CASCADE;--> statement-breakpoint
DROP TABLE "conversation_message_vote" CASCADE;--> statement-breakpoint
DROP TABLE "conversation_stream" CASCADE;--> statement-breakpoint
DROP TABLE "artifact" CASCADE;--> statement-breakpoint
DROP TABLE "artifact_suggestion" CASCADE;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'USER'::"public"."user_role";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET DATA TYPE "public"."user_role" USING "role"::"public"."user_role";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "articles" ADD COLUMN "search_vector" "tsvector" DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "display_name" varchar(50);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "bio" varchar(500);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "preferences" jsonb DEFAULT '{}'::jsonb;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD COLUMN "actor_name" text;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD COLUMN "before" jsonb;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD COLUMN "after" jsonb;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD COLUMN "occurred_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "login_logs" ADD CONSTRAINT "login_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "login_logs_user_id_idx" ON "login_logs" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "login_logs_created_at_idx" ON "login_logs" USING btree ("created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "stayea_accommodations_slug_idx" ON "stayea_accommodations" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "stayea_accommodations_category_idx" ON "stayea_accommodations" USING btree ("category");--> statement-breakpoint
CREATE INDEX "stayea_accommodations_featured_idx" ON "stayea_accommodations" USING btree ("is_featured");--> statement-breakpoint
CREATE UNIQUE INDEX "stayea_experiences_slug_idx" ON "stayea_experiences" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "stayea_experiences_category_idx" ON "stayea_experiences" USING btree ("category");--> statement-breakpoint
CREATE INDEX "stayea_experiences_featured_idx" ON "stayea_experiences" USING btree ("is_featured");--> statement-breakpoint
CREATE INDEX "stayea_flights_route_idx" ON "stayea_flights" USING btree ("departure_airport","arrival_airport");--> statement-breakpoint
CREATE INDEX "stayea_flights_number_idx" ON "stayea_flights" USING btree ("flight_number");--> statement-breakpoint
CREATE UNIQUE INDEX "stayea_packages_slug_idx" ON "stayea_packages" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "stayea_packages_audience_idx" ON "stayea_packages" USING btree ("audience");--> statement-breakpoint
CREATE INDEX "stayea_packages_featured_idx" ON "stayea_packages" USING btree ("is_featured");--> statement-breakpoint
CREATE UNIQUE INDEX "stayea_promotions_code_idx" ON "stayea_promotions" USING btree ("code");--> statement-breakpoint
CREATE INDEX "stayea_promotions_category_idx" ON "stayea_promotions" USING btree ("category");--> statement-breakpoint
CREATE INDEX "stayea_promotions_active_idx" ON "stayea_promotions" USING btree ("is_active");--> statement-breakpoint
CREATE UNIQUE INDEX "stayea_bookings_code_idx" ON "stayea_bookings" USING btree ("booking_code");--> statement-breakpoint
CREATE INDEX "stayea_bookings_user_id_idx" ON "stayea_bookings" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "stayea_bookings_status_idx" ON "stayea_bookings" USING btree ("status");--> statement-breakpoint
CREATE INDEX "stayea_bookings_type_idx" ON "stayea_bookings" USING btree ("booking_type");--> statement-breakpoint
CREATE INDEX "stayea_club_perks_user_idx" ON "stayea_club_perks" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "stayea_club_perks_status_idx" ON "stayea_club_perks" USING btree ("status");--> statement-breakpoint
CREATE INDEX "stayea_club_tx_user_idx" ON "stayea_club_points_transactions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "stayea_club_tx_type_idx" ON "stayea_club_points_transactions" USING btree ("type");--> statement-breakpoint
CREATE UNIQUE INDEX "stayea_club_profiles_user_idx" ON "stayea_club_profiles" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "stayea_club_profiles_tier_idx" ON "stayea_club_profiles" USING btree ("tier");--> statement-breakpoint
CREATE INDEX "stayea_payment_methods_user_idx" ON "stayea_payment_methods" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "stayea_payment_methods_default_idx" ON "stayea_payment_methods" USING btree ("is_default");--> statement-breakpoint
CREATE UNIQUE INDEX "stayea_payment_tx_ref_idx" ON "stayea_payment_transactions" USING btree ("transaction_ref");--> statement-breakpoint
CREATE INDEX "stayea_payment_tx_booking_idx" ON "stayea_payment_transactions" USING btree ("booking_id");--> statement-breakpoint
CREATE INDEX "stayea_payment_tx_user_idx" ON "stayea_payment_transactions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "stayea_favorites_user_idx" ON "stayea_favorites" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "stayea_favorites_item_idx" ON "stayea_favorites" USING btree ("item_type","item_id");--> statement-breakpoint
CREATE INDEX "stayea_reviews_user_idx" ON "stayea_reviews" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "stayea_reviews_item_idx" ON "stayea_reviews" USING btree ("item_type","item_id");--> statement-breakpoint
CREATE INDEX "stayea_reviews_status_idx" ON "stayea_reviews" USING btree ("status");--> statement-breakpoint
CREATE INDEX "stayea_user_plans_user_idx" ON "stayea_user_plans" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "stayea_user_plans_status_idx" ON "stayea_user_plans" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "stayea_user_settings_user_idx" ON "stayea_user_settings" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "stayea_user_vouchers_user_idx" ON "stayea_user_vouchers" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "stayea_user_vouchers_code_idx" ON "stayea_user_vouchers" USING btree ("code");--> statement-breakpoint
CREATE INDEX "stayea_user_vouchers_used_idx" ON "stayea_user_vouchers" USING btree ("is_used");--> statement-breakpoint
CREATE INDEX "articles_search_vector_idx" ON "articles" USING gin ("search_vector");--> statement-breakpoint
CREATE INDEX "audit_logs_resource_idx" ON "audit_logs" USING btree ("resource_type","resource_id");--> statement-breakpoint
CREATE INDEX "audit_logs_occurred_at_idx" ON "audit_logs" USING btree ("occurred_at");