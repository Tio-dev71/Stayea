# STAYEA PLATFORM AUDIT: FEATURE READINESS MATRIX
**Document ID:** `STAYEA-AUD-04`  
**Date:** 2026-11-02  
**Baseline Commit:** `f9c97a7`

---

## 1. Feature Classification Criteria

- **🟢 REAL (Production-Ready / Functional):** Component renders real database data, writes via authenticated APIs, passes input validation, and respects domain invariants.
- **🟡 PARTIAL (Mixed Real + Mock):** Core data is fetched from the database, but specific secondary widgets (e.g. charts, filters, export) use hardcoded fallbacks or simulated delays.
- **🔴 MOCK (UI Only / Simulated):** Interface exists and accepts user interaction, but does not persist state or relies on fake simulated timers instead of actual backend services.
- **⛔ BLOCKED_EXTERNAL:** Implementation requires contracts or API keys with external third parties (e.g., Vietnam Airlines Sabre/Amadeus GDS, local telco SMS OTP, SeAPay production credentials).

---

## 2. Platform Feature Inventory

### 2.1 Customer Platform (`stayea.com`)

| Feature Area | Sub-Feature | Status | Frontend File | Backend Service | DB Persistence | Gap / Missing Requirement | Effort (Hours) |
|---|---|---|---|---|---|---|---|
| **Landing & Discovery** | Hero Search Bar | 🟢 REAL | `stayea-landing-page.tsx` | `StayeaCatalogService` | `stayea_accommodations` | Passes query params to `/stay`. | 0 |
| | Featured Villas & Stays | 🟢 REAL | `stayea-landing-page.tsx` | `StayeaCatalogService` | `stayea_accommodations` | Reads active listings. | 0 |
| | Curated Experiences | 🟢 REAL | `stayea-landing-page.tsx` | `StayeaCatalogService` | `stayea_experiences` | Reads active experiences. | 0 |
| **Catalog Browsing** | Stay Listing & Multi-filter | 🟢 REAL | `stayea-stays-page.tsx` | `StayeaCatalogService.getAccommodations` | `stayea_accommodations` | Fully functional filtering. | 0 |
| | Stay Detail View | 🟢 REAL | `stayea-stay-detail-page.tsx` | `StayeaCatalogService.getAccommodationById` | `stayea_accommodations` | Room metadata, gallery, pricing. | 0 |
| | Experience Catalog & Detail | 🟢 REAL | `stayea-experiences-page.tsx` | `StayeaCatalogService.getExperiences` | `stayea_experiences` | Tours and island activities. | 0 |
| | Transport Rental Catalog | 🟢 REAL | `stayea-transport-page.tsx` | `StayeaCatalogService.getTransports` | `stayea_transports` | Cars & motorbikes. | 0 |
| | Flight Booking Engine | ⛔ BLOCKED | `stayea-flights-page.tsx` | `StayeaCatalogService.getFlights` | `stayea_flights` | Static schedule; requires GDS/OTA connector. | 40 |
| **Booking & Checkout** | Date Range Picker | 🟢 REAL | `stayea-booking-sheet.tsx` | Local State | None | Interactive calendar UI. | 0 |
| | Booking Order Creation | 🟡 PARTIAL | `checkout/page.tsx` | `StayeaBookingService.createBooking` | `stayea_bookings` | Creates booking but marks `confirmed` prematurely. | 4 |
| | Payment Gateway Integration | 🔴 MOCK | `checkout/page.tsx` | `StayeaPaymentService.initiatePayment` | `stayea_payments` | Hardcoded MB Bank QR; no dynamic QR webhook. | 16 |
| **Customer Account** | User Registration / Login | 🟢 REAL | `auth/login/page.tsx` | `AuthService.login` | `users`, `auth_identities` | JWT auth functional; needs HttpOnly cookies. | 6 |
| | My Bookings History | 🟢 REAL | `profile/page.tsx` | `StayeaBookingService.getMyBookings` | `stayea_bookings` | Displays booking cards and payment status. | 0 |
| **AI Travel Concierge** | Real-time Chat Assistant | 🟢 REAL | `stayea-ai-chat-widget.tsx` | `StayeaAiAgentService.chat` | `stayea_orders` | Function calling creates real database orders. | 4 |

---

### 2.2 Partner Hub (`hub.stayea.com`)

| Feature Area | Sub-Feature | Status | Frontend File | Backend Service | DB Persistence | Gap / Missing Requirement | Effort (Hours) |
|---|---|---|---|---|---|---|---|
| **Partner Auth** | Domain Isolation & Login | 🟢 REAL | `login/page.tsx` | `AuthService.login` | `users` | Blocks `role: ADMIN` accounts from Hub. | 0 |
| | Partner KYC & Onboarding | 🟡 PARTIAL | `stayea-partner-hub-page.tsx` | `StayeaPartnerService.getProfile` | `partner_profiles` | Auto-approves accounts; needs explicit KYC flow. | 8 |
| **Listing Management** | Service Creation Modal | 🟢 REAL | `partner-create-service-modal.tsx` | `StayeaPartnerService.createService` | `partner_services`, `stayea_accommodations` | Direct catalog synchronization verified. | 0 |
| | Image Ingestion (Drive/Upload) | 🟢 REAL | `partner-create-service-modal.tsx` | Regex conversion | `partner_services.imageUrl` | Drive link auto-converted to previewable thumbnail. | 0 |
| | Service Toggle (Active/Pause) | 🟢 REAL | `partner-services-tab.tsx` | `StayeaPartnerService.updateService` | `partner_services` | Real-time status update. | 2 |
| **Order Triage** | Incoming Booking Notification | 🟢 REAL | `partner-orders-tab.tsx` | `StayeaPartnerService.getMyOrders` | `stayea_orders` | Orders filtered by partner ownership. | 0 |
| | Accept / Reject Booking | 🟢 REAL | `partner-orders-tab.tsx` | `StayeaPartnerService.updateOrderStatus` | `stayea_orders` | Updates status; needs customer SMS/email alert. | 6 |
| **Calendar & Inventory** | Visual Availability Calendar | 🟡 PARTIAL | `partner-calendar-tab.tsx` | `StayeaPartnerService.getMyServices` | None (Computed) | Needs dedicated `room_availability` table for blackout dates. | 12 |
| **Settlement & Payouts** | Revenue & Commission Stats | 🟢 REAL | `stayea-partner-hub-page.tsx` | `StayeaPartnerService.getMyOrders` | `stayea_orders` | Computes gross, commission, and net earnings. | 0 |
| | Request Payout Withdrawal | 🔴 MOCK | `partner-finance-tab.tsx` | None | None | UI button only; missing payout request table and endpoint. | 8 |

---

### 2.3 Admin Console (`admin.stayea.com` / `/stayea/*`)

| Feature Area | Sub-Feature | Status | Frontend File | Backend Service | DB Persistence | Gap / Missing Requirement | Effort (Hours) |
|---|---|---|---|---|---|---|---|
| **Dashboard** | KPI Metric Counters | 🟢 REAL | `stayea-admin-dashboard-page.tsx` | `StayeaAdminService.getDashboardStats` | Multiple tables | Live aggregation of bookings, revenue, partners. | 0 |
| | Revenue Time-Series Chart | 🟡 PARTIAL | `stayea-admin-dashboard-page.tsx` | None | Hardcoded mock array | Recharts fed by static weekly array; needs SQL GROUP BY. | 4 |
| **Catalog Governance** | Property Listing & CRUD | 🟢 REAL | `stayea-admin-properties-page.tsx` | `StayeaCatalogService` | `stayea_accommodations` | Admin can inspect and edit all properties. | 0 |
| | Experience Listing & CRUD | 🟢 REAL | `stayea-admin-experiences-page.tsx` | `StayeaCatalogService` | `stayea_experiences` | Full catalog control. | 0 |
| **Booking Operations** | Booking List & Filters | 🟢 REAL | `stayea-admin-bookings-page.tsx` | `StayeaAdminService.getAllBookings` | `stayea_bookings` | Search by code, customer, status. | 0 |
| | Manual Status Override | 🟢 REAL | `stayea-admin-bookings-page.tsx` | `StayeaAdminService.updateBookingStatus` | `stayea_bookings` | Admin can confirm, cancel, or refund bookings. | 0 |
| **Partner Oversight** | Partner KYC Review | 🟢 REAL | `stayea-admin-partners-page.tsx` | `StayeaPartnerService.getAllPartners` | `partner_profiles` | Lists all partner accounts. | 0 |
| | Verify / Suspend Partner | 🟢 REAL | `stayea-admin-partners-page.tsx` | `StayeaPartnerService.verifyPartner` | `partner_profiles` | Updates status and commission rate. | 0 |
| **Financial Operations** | Partner Payout Reconciliation | 🟡 PARTIAL | `stayea-admin-finance-page.tsx` | `StayeaAdminService.getPayouts` | `partner_payouts` | Displays payout table; batch disbursement is manual. | 12 |
| **System Settings** | Platform Config & Fee Rates | 🟢 REAL | `stayea-admin-settings-page.tsx` | `StayeaAdminService.getSettings` | `system_settings` | Commission rates and maintenance toggles. | 0 |

---

## 3. Summary of Gaps Requiring Development

| Priority | Feature Gap | Affected Area | Estimated Work |
|---|---|---|---|
| **P0** | Booking concurrency lock & `pending_payment` state machine | Booking Core | 8h |
| **P0** | Webhook HMAC signature enforcement & dynamic VietQR | Payment Module | 16h |
| **P0** | HttpOnly cookie auth & SSR session validation | Auth & Next.js SSR | 12h |
| **P1** | Partner payout request workflow & tracking | Partner Hub & Finance | 14h |
| **P1** | Dedicated blackout date inventory engine | Partner Calendar | 12h |
| **P1** | Admin revenue time-series SQL aggregation | Admin Dashboard | 4h |
| **P2** | Dynamic email/SMS booking notifications | Notification Engine | 16h |
| **P3** | Real GDS Flight API integration | Flights Portal | 40h (Pending API contracts) |

