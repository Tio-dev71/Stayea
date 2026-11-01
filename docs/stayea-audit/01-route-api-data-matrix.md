# STAYEA PLATFORM AUDIT: ROUTE, API & DATA MATRIX
**Document ID:** `STAYEA-AUD-01`  
**Date:** 2026-11-02  
**Baseline Commit:** `f9c97a7`

This matrix traces every user-facing screen across the three platform domains to its underlying React component, client fetch logic, NestJS API endpoint, application service, and PostgreSQL database tables.

---

## 1. Customer Platform (`stayea.com` / Default Domain)

| Route Path | UI Component / Page | State Source | API Endpoint & Method | Controller & Service Method | Guards / Auth | DB Tables Touched | Status | Notes / Gaps |
|---|---|---|---|---|---|---|---|---|
| `/` | `apps/admin-shadcn/src/app/page.tsx` $\rightarrow$ `stayea-landing-page.tsx` | `@tanstack/react-query`, `stayea-api.ts` | `GET /api/stayea/accommodations`<br>`GET /api/stayea/experiences` | `StayeaCatalogController.getAccommodations`<br>`StayeaCatalogController.getExperiences` | Public | `stayea_accommodations`<br>`stayea_experiences` | **REAL** | Real accommodations and experiences displayed. Hero search redirects to `/stay`. |
| `/stay` | `apps/admin-shadcn/src/app/stay/page.tsx` $\rightarrow$ `stayea-stays-page.tsx` | React Query via `useCatalogAccommodations` | `GET /api/stayea/accommodations` | `StayeaCatalogController.getAccommodations` | Public | `stayea_accommodations` | **REAL** | Filters by category, price range, bedrooms, bathrooms. |
| `/stay/[id]` | `apps/admin-shadcn/src/app/stay/[id]/page.tsx` $\rightarrow$ `stayea-stay-detail-page.tsx` | React Query via `useCatalogAccommodation` | `GET /api/stayea/accommodations/:id` | `StayeaCatalogController.getAccommodationById` | Public | `stayea_accommodations` | **REAL** | Interactive booking card opens date selector and checkout sheet. |
| `/experiences` | `apps/admin-shadcn/src/app/experiences/page.tsx` | React Query | `GET /api/stayea/experiences` | `StayeaCatalogController.getExperiences` | Public | `stayea_experiences` | **REAL** | Lists scuba diving, sunset cruises, island tours. |
| `/experiences/[id]` | `apps/admin-shadcn/src/app/experiences/[id]/page.tsx` | React Query | `GET /api/stayea/experiences/:id` | `StayeaCatalogController.getExperienceById` | Public | `stayea_experiences` | **REAL** | Booking sheet connects to `/api/stayea/bookings`. |
| `/transport` | `apps/admin-shadcn/src/app/transport/page.tsx` | React Query | `GET /api/stayea/transports` | `StayeaCatalogController.getTransports` | Public | `stayea_transports` | **REAL** | Self-drive cars, motorbikes, luxury vans. |
| `/flights` | `apps/admin-shadcn/src/app/flights/page.tsx` | Local State + Static API Seed | `GET /api/stayea/flights` | `StayeaCatalogController.getFlights` | Public | `stayea_flights` | **PARTIAL** | Displays seeded flight schedules. Booking is simulated (no GDS/OTA connector). |
| `/checkout` | `apps/admin-shadcn/src/app/checkout/page.tsx` | React Hook Form + Mutation | `POST /api/stayea/bookings`<br>`POST /api/stayea/payments/initiate` | `StayeaBookingController.createBooking`<br>`StayeaPaymentController.initiatePayment` | Optional JWT | `stayea_bookings`<br>`stayea_orders`<br>`stayea_payments` | **P0 RISK** | Booking created as `confirmed` before payment; bank QR is static placeholder. |
| `/profile` | `apps/admin-shadcn/src/app/profile/page.tsx` | React Query | `GET /api/stayea/users/me`<br>`GET /api/stayea/bookings/my-bookings` | `StayeaUserController.getProfile`<br>`StayeaBookingController.getMyBookings` | `JwtAuthGuard` | `users`<br>`stayea_bookings` | **REAL** | Requires login; displays user booking history. |
| `/auth/login` | `apps/admin-shadcn/src/app/auth/login/page.tsx` | React Hook Form + Zod | `POST /api/auth/login` | `AuthController.login` | Public | `users`<br>`auth_identities` | **REAL** | JWT returned and saved in `localStorage` + non-HttpOnly cookie. |
| Global AI Concierge | `apps/admin-shadcn/src/features/ai-agent/stayea-ai-chat-widget.tsx` | Local state + Stream API | `POST /api/stayea/ai/chat` | `StayeaAiAgentController.chat` | Public / Optional User | OpenAI API + `stayea_orders` | **REAL / PARTIAL** | Function calling creates `stayea_orders` with status `pending_admin`. |

---

## 2. Partner Hub (`hub.stayea.com` / Subdomain Routed)

| Route Path | UI Component / Page | State Source | API Endpoint & Method | Controller & Service Method | Guards / Auth | DB Tables Touched | Status | Notes / Gaps |
|---|---|---|---|---|---|---|---|---|
| `/login` | `apps/admin-shadcn/src/app/login/page.tsx` (Subdomain check) | React Hook Form | `POST /api/auth/login` | `AuthController.login` | Public | `users` | **REAL** | Strictly prevents `role: ADMIN` from logging into Hub portal. |
| `/hub` (Overview) | `apps/admin-shadcn/src/features/partner-portal/stayea-partner-hub-page.tsx` | React Query | `GET /api/stayea/partner/profile`<br>`GET /api/stayea/partner/services`<br>`GET /api/stayea/partner/orders` | `StayeaPartnerController.getProfile`<br>`StayeaPartnerController.getMyServices`<br>`StayeaPartnerController.getMyOrders` | `JwtAuthGuard` + `PartnerGuard` | `partner_profiles`<br>`partner_services`<br>`stayea_orders` | **REAL** | Displays active listings, pending orders, and earnings overview. |
| `/hub/services` | `apps/admin-shadcn/src/features/partner-portal/partner-services-tab.tsx` | React Query | `GET /api/stayea/partner/services`<br>`POST /api/stayea/partner/services` | `StayeaPartnerController.getMyServices`<br>`StayeaPartnerController.createService` | `JwtAuthGuard` | `partner_services`<br>`stayea_accommodations`<br>`stayea_experiences` | **REAL** | Creates listing and syncs directly to public catalog & admin tables. Supports Drive link + upload. |
| `/hub/orders` | `apps/admin-shadcn/src/features/partner-portal/partner-orders-tab.tsx` | React Query | `GET /api/stayea/partner/orders`<br>`PATCH /api/stayea/partner/orders/:id/status` | `StayeaPartnerController.getMyOrders`<br>`StayeaPartnerController.updateOrderStatus` | `JwtAuthGuard` | `stayea_orders` | **REAL** | Allows partner to accept or reject incoming booking orders. |
| `/hub/inventory` | `apps/admin-shadcn/src/features/partner-portal/partner-calendar-tab.tsx` | React Query | `GET /api/stayea/partner/services` | `StayeaPartnerController.getMyServices` | `JwtAuthGuard` | `partner_services` | **PARTIAL** | Shows calendar occupancy; date-blocking persistence needs explicit inventory table. |
| `/hub/finance` | `apps/admin-shadcn/src/features/partner-portal/partner-finance-tab.tsx` | React Query | `GET /api/stayea/partner/profile` | `StayeaPartnerController.getProfile` | `JwtAuthGuard` | `partner_profiles` | **PARTIAL** | Shows commission rates and bank details; payout request submission is UI-only. |

---

## 3. Admin Console (`admin.stayea.com` / `/stayea/*`)

| Route Path | UI Component / Page | State Source | API Endpoint & Method | Controller & Service Method | Guards / Auth | DB Tables Touched | Status | Notes / Gaps |
|---|---|---|---|---|---|---|---|---|
| `/stayea` (Dashboard) | `apps/admin-shadcn/src/features/stayea-admin/stayea-admin-dashboard-page.tsx` | React Query + Initial Mock Data | `GET /api/stayea/admin/dashboard` | `StayeaAdminController.getDashboardStats` | `JwtAuthGuard` + `AdminRoleGuard` | `stayea_bookings`<br>`users`<br>`partner_profiles`<br>`stayea_accommodations` | **PARTIAL** | Header stats are live; time-series chart falls back to mock array. |
| `/stayea/bookings` | `apps/admin-shadcn/src/features/stayea-admin/stayea-admin-bookings-page.tsx` | React Query | `GET /api/stayea/admin/bookings`<br>`PATCH /api/stayea/admin/bookings/:id/status` | `StayeaAdminController.getAllBookings`<br>`StayeaAdminController.updateBookingStatus` | `JwtAuthGuard` + `AdminRoleGuard` | `stayea_bookings`<br>`stayea_payments` | **REAL** | Real tabular list with pagination, search, and status modification. |
| `/stayea/properties` | `apps/admin-shadcn/src/features/stayea-admin/stayea-admin-properties-page.tsx` | React Query | `GET /api/stayea/catalog/accommodations`<br>`POST /api/stayea/catalog/accommodations` | `StayeaCatalogController.getAccommodations`<br>`StayeaCatalogController.createAccommodation` | `JwtAuthGuard` + `AdminRoleGuard` | `stayea_accommodations` | **REAL** | Admin can view all partner & direct properties, edit details, and add new inventory. |
| `/stayea/partners` | `apps/admin-shadcn/src/features/stayea-admin/stayea-admin-partners-page.tsx` | React Query | `GET /api/stayea/partner/all`<br>`PATCH /api/stayea/partner/:id/verify` | `StayeaPartnerController.getAllPartners`<br>`StayeaPartnerController.verifyPartner` | `JwtAuthGuard` + `AdminRoleGuard` | `partner_profiles` | **REAL** | KYC verification, commission adjustment, and status toggle (`approved` / `suspended`). |
| `/stayea/experiences` | `apps/admin-shadcn/src/features/stayea-admin/stayea-admin-experiences-page.tsx` | React Query | `GET /api/stayea/catalog/experiences` | `StayeaCatalogController.getExperiences` | `JwtAuthGuard` + `AdminRoleGuard` | `stayea_experiences` | **REAL** | Catalog curation of scuba, tours, boat charters. |
| `/stayea/customers` | `apps/admin-shadcn/src/features/stayea-admin/stayea-admin-customers-page.tsx` | React Query | `GET /api/stayea/admin/customers` | `StayeaAdminController.getAllCustomers` | `JwtAuthGuard` + `AdminRoleGuard` | `users`<br>`stayea_bookings` | **REAL** | Customer CRM view, total spent calculation, booking history count. |
| `/stayea/finance` | `apps/admin-shadcn/src/features/stayea-admin/stayea-admin-finance-page.tsx` | React Query | `GET /api/stayea/admin/payouts` | `StayeaAdminController.getPayouts` | `JwtAuthGuard` + `AdminRoleGuard` | `partner_payouts` | **PARTIAL** | Table rendered, batch payout approval needs backend bank connector. |
| `/stayea/settings` | `apps/admin-shadcn/src/features/stayea-admin/stayea-admin-settings-page.tsx` | React Query | `GET /api/stayea/admin/settings`<br>`PUT /api/stayea/admin/settings` | `StayeaAdminController.getSettings`<br>`StayeaAdminController.updateSettings` | `JwtAuthGuard` + `AdminRoleGuard` | `system_settings` | **REAL** | Commission rates, platform fees, payment gateway toggles. |

---

## 4. Cross-Cutting API Contracts & DTOs

| DTO Name | Location | Key Fields | Validation Rules | Security / Integrity Note |
|---|---|---|---|---|
| `CreateBookingDto` | `apps/api/src/modules/stayea/booking/dto/create-booking.dto.ts` | `stayId`, `checkIn`, `checkOut`, `guests`, `customerName`, `customerEmail`, `customerPhone` | `@IsUUID()`, `@IsDateString()`, `@IsPositive()` | Must validate `checkIn < checkOut` and check-in date $\ge$ today. |
| `CreatePartnerServiceDto` | `apps/api/src/modules/stayea/partner/dto/create-partner-service.dto.ts` | `title`, `serviceType`, `price`, `location`, `imageUrl`, `description`, `metadata` | `@IsString()`, `@IsPositive()`, `@IsOptional()` | Validates URL format for Google Drive or direct CDN links. |
| `InitiatePaymentDto` | `apps/api/src/modules/stayea/payment/dto/initiate-payment.dto.ts` | `bookingId`, `paymentMethod`, `amount`, `currency` | `@IsUUID()`, `@IsEnum()`, `@IsPositive()` | Requires server-side verification that `amount == booking.totalPrice`. |
| `PaymentWebhookDto` | `apps/api/src/modules/stayea/payment/dto/payment-webhook.dto.ts` | `orderId`, `transactionId`, `amount`, `status`, `signature` | `@IsString()`, `@IsNotEmpty()` | **CRITICAL:** Signature verification must be strictly mandatory in all environments. |

