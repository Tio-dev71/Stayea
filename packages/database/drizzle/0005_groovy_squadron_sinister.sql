ALTER TYPE "public"."user_role" ADD VALUE 'PARTNER' BEFORE 'USER';--> statement-breakpoint
CREATE TABLE "stayea_partner_inventory" (
	"id" text PRIMARY KEY NOT NULL,
	"partner_id" text NOT NULL,
	"service_id" text NOT NULL,
	"date" text NOT NULL,
	"total_slots" integer DEFAULT 1 NOT NULL,
	"booked_slots" integer DEFAULT 0 NOT NULL,
	"is_available" boolean DEFAULT true NOT NULL,
	"price_override" numeric(12, 2),
	"note" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "stayea_partner_orders" (
	"id" text PRIMARY KEY NOT NULL,
	"order_code" text NOT NULL,
	"partner_id" text NOT NULL,
	"service_id" text NOT NULL,
	"booking_id" text,
	"customer_name" text NOT NULL,
	"customer_phone" text NOT NULL,
	"customer_email" text,
	"service_title" text NOT NULL,
	"service_type" text NOT NULL,
	"start_date" text NOT NULL,
	"end_date" text,
	"quantity" integer DEFAULT 1 NOT NULL,
	"unit_price" numeric(12, 2) NOT NULL,
	"total_amount" numeric(12, 2) NOT NULL,
	"commission_amount" numeric(12, 2) DEFAULT '0' NOT NULL,
	"partner_payout_amount" numeric(12, 2) NOT NULL,
	"status" text DEFAULT 'pending_admin' NOT NULL,
	"source" text DEFAULT 'direct_customer' NOT NULL,
	"admin_notes" text,
	"partner_notes" text,
	"rejection_reason" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "stayea_partner_orders_order_code_unique" UNIQUE("order_code")
);
--> statement-breakpoint
CREATE TABLE "stayea_partner_profiles" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"business_name" text NOT NULL,
	"business_type" text DEFAULT 'homestay' NOT NULL,
	"contact_name" text NOT NULL,
	"phone" text NOT NULL,
	"email" text NOT NULL,
	"address" text,
	"city" text DEFAULT 'Phú Quốc' NOT NULL,
	"tax_id" text,
	"bank_name" text,
	"bank_account" text,
	"bank_account_holder" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"commission_rate" numeric(5, 2) DEFAULT '10.00' NOT NULL,
	"rating" numeric(3, 2) DEFAULT '0.00' NOT NULL,
	"total_orders" integer DEFAULT 0 NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "stayea_partner_services" (
	"id" text PRIMARY KEY NOT NULL,
	"partner_id" text NOT NULL,
	"service_type" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"location" text NOT NULL,
	"price" numeric(12, 2) NOT NULL,
	"original_price" numeric(12, 2),
	"unit" text DEFAULT 'đêm' NOT NULL,
	"images" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"attributes" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "stayea_accommodations" ALTER COLUMN "rating" SET DEFAULT '0.00';--> statement-breakpoint
ALTER TABLE "stayea_experiences" ALTER COLUMN "rating" SET DEFAULT '0.00';--> statement-breakpoint
ALTER TABLE "stayea_packages" ALTER COLUMN "rating" SET DEFAULT '0.00';--> statement-breakpoint
ALTER TABLE "stayea_favorites" ALTER COLUMN "rating" SET DEFAULT '0.00';--> statement-breakpoint
CREATE UNIQUE INDEX "stayea_inventory_service_date_idx" ON "stayea_partner_inventory" USING btree ("service_id","date");--> statement-breakpoint
CREATE INDEX "stayea_inventory_partner_idx" ON "stayea_partner_inventory" USING btree ("partner_id");--> statement-breakpoint
CREATE UNIQUE INDEX "stayea_partner_orders_code_idx" ON "stayea_partner_orders" USING btree ("order_code");--> statement-breakpoint
CREATE INDEX "stayea_partner_orders_partner_idx" ON "stayea_partner_orders" USING btree ("partner_id");--> statement-breakpoint
CREATE INDEX "stayea_partner_orders_status_idx" ON "stayea_partner_orders" USING btree ("status");--> statement-breakpoint
CREATE INDEX "stayea_partner_orders_created_idx" ON "stayea_partner_orders" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "stayea_partner_user_id_idx" ON "stayea_partner_profiles" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "stayea_partner_status_idx" ON "stayea_partner_profiles" USING btree ("status");--> statement-breakpoint
CREATE INDEX "stayea_partner_type_idx" ON "stayea_partner_profiles" USING btree ("business_type");--> statement-breakpoint
CREATE INDEX "stayea_partner_services_partner_idx" ON "stayea_partner_services" USING btree ("partner_id");--> statement-breakpoint
CREATE INDEX "stayea_partner_services_type_idx" ON "stayea_partner_services" USING btree ("service_type");--> statement-breakpoint
CREATE INDEX "stayea_partner_services_status_idx" ON "stayea_partner_services" USING btree ("status");