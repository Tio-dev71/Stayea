# STAYEA PLATFORM AUDIT: EXECUTIVE SUMMARY
**Document ID:** `STAYEA-AUD-00`  
**Date:** 2026-11-02  
**Auditor Roles:** Principal Software Architect, Senior Fullstack Engineer, QA Automation Lead  
**Scope:** Complete Codebase (`apps/api`, `apps/admin-shadcn`, `packages/database`, `packages/api-types`, `docker`)  
**Target Environment:** Local / Docker / Ubuntu 24.04 VPS (157.66.100.35)  
**System State Baseline:** Commit `f9c97a7` on branch `main`

---

## 1. Executive Assessment & System Health

STAYEA is conceived as an all-in-one Phu Quoc luxury travel ecosystem bridging three distinct actor surfaces:
1. **Public Customer Portal** (`stayea.com`): Discovery, search, booking, checkout, AI Concierge.
2. **Partner Hub** (`hub.stayea.com`): Partner onboarding, listing creation, service inventory, incoming booking triage, payout tracking.
3. **Admin Console** (`admin.stayea.com`): Master catalog management, booking oversight, commission governance, financial payouts, partner KYC approval.

### Overall System Readiness: **42% Production-Ready**

| Category | Readiness Score | Grade | Critical Blocker |
|---|---|---|---|
| **Core Architecture & Schemas** | 80% | B+ | Schemas well-structured in Drizzle ORM; migrations coherent. |
| **Authentication & RBAC** | 35% | F (P0 Risk) | Client-side cookie forging allows Admin SSR spoofing; tokens in localStorage. |
| **Catalog & Partner Sync** | 75% | B | Services sync to catalog, but categories/fields require hardening. |
| **Booking & Inventory Engine** | 40% | D (P0 Risk) | Date collision check not atomic; bookings confirmed before payment. |
| **Payment & Settlement** | 25% | F (P0 Risk) | Webhook bypassable; hardcoded bank account; mock checkout endpoints. |
| **Admin Control Plane** | 50% | C- | Many mock KPI cards; lacks manual approval action for partner services. |
| **AI Travel Concierge** | 65% | C+ | Multi-turn OpenAI function calling exists; tool executions write to orders. |
| **DevOps & Production Security** | 30% | F (P0 Risk) | Hardcoded secrets in git; Docker compose network mismatch; unverified SSL. |

---

## 2. Top Five P0 Vulnerabilities Identified

1. **Authentication Spoofing via Unsigned Client Cookie (`apps/admin-shadcn/src/lib/server-user.ts`)**
   - The Server Component layout for `/stayea/*` reads `cookies().get("user")` and parses raw JSON without verifying HMAC signature or session token against the API backend.
   - Any malicious actor can inject `user={"role":"ADMIN","id":"..."}` into their browser cookie jar and pass Next.js SSR admin authorization guards.

2. **Insecure Payment Webhook & Hardcoded Gateway Secrets (`apps/api/src/modules/stayea/payment/stayea-payment.service.ts`)**
   - Webhook signature verification is completely bypassed if the caller sends header `x-stayea-signature: skip_dev_check` or omits the signature in non-strict modes.
   - Fallback secret `"stayea-webhook-secret-key-2026"` is hardcoded in source code.
   - Anyone can mark arbitrary bookings as `paid` with forged HTTP POST requests.

3. **Concurrency Race Condition & Premature Booking Confirmation (`apps/api/src/modules/stayea/booking/stayea-booking.service.ts`)**
   - Availability check is performed prior to entering the transaction without PostgreSQL row-level locks (`FOR UPDATE`) or date range exclusion constraints (`tsrange` with GiST index). Concurrent checkout requests for the same villa on overlapping dates will double-book the accommodation.
   - Bookings are inserted into the database with `status = "confirmed"` immediately upon checkout initiation, even while `paymentStatus = "unpaid"`.

4. **Arbitrary Partner Profile Auto-Creation & Arbitrary Order Attribution**
   - `getProfileByUserId` in `stayea-partner.service.ts` auto-creates an `approved` partner profile for *any* authenticated user requesting their profile if none exists.
   - `createBooking` in `stayea-booking.service.ts` queries the first partner matching business type instead of retrieving the true owner `partnerId` linked to the accommodation or tour.

5. **Exposed Secrets & Broken Container Network in Docker Compose (`docker/docker-compose.yml`)**
   - `JWT_SECRET` and database credentials are committed directly in the compose file.
   - Frontend is passed `NEXT_PUBLIC_API_URL=http://localhost:3000`, causing browser-side and server-side calls inside containerized stacks to fail when accessed remotely.

---

## 3. High-Priority Recommendations (Immediate Action Plan)

1. **Establish Strict Trust Boundary:**
   - Eliminate client-writable role cookies. Store JWT in secure `HttpOnly`, `SameSite=Lax` cookies. Next.js middleware and layout must query `/api/auth/me` or verify a signed session token.
2. **Harden Financial & Booking Workflows:**
   - Enforce cryptographic HMAC-SHA256 signature checks on all incoming webhooks with rejection of unsigned payloads.
   - Transition booking initial state to `pending_payment` with strict 15-minute expiration worker.
   - Introduce database row-level locking or exclusion constraints to guarantee single-tenant occupancy.
3. **Cleanse Mock State:**
   - Connect Admin dashboard KPI counters directly to PostgreSQL aggregation queries (`COUNT`, `SUM`).
   - Remove simulated mock checkout endpoints that bypass real gateway confirmation.
4. **Enforce Role-Based Domain Separation:**
   - `stayea.com` $\rightarrow$ Customers (`role: CUSTOMER` or unauthenticated).
   - `hub.stayea.com` $\rightarrow$ Verified Partners (`role: PARTNER`, status `approved`).
   - `admin.stayea.com` $\rightarrow$ Platform Admins (`role: ADMIN`, enforced server-side).

---

## 4. Audit Deliverables Index

The following comprehensive technical audit documents have been generated:
- [`01-route-api-data-matrix.md`](file:///Users/tiodev/Stayea/docs/stayea-audit/01-route-api-data-matrix.md): Exhaustive end-to-end component $\rightarrow$ API $\rightarrow$ Database mapping.
- [`02-domain-and-data-flow.md`](file:///Users/tiodev/Stayea/docs/stayea-audit/02-domain-and-data-flow.md): Architecture, sequence, and state machine diagrams.
- [`03-security-risk-register.md`](file:///Users/tiodev/Stayea/docs/stayea-audit/03-security-risk-register.md): Full CVSS risk register for all P0/P1/P2 vulnerabilities.
- [`04-feature-readiness-matrix.md`](file:///Users/tiodev/Stayea/docs/stayea-audit/04-feature-readiness-matrix.md): Granular breakdown of feature implementations (Real vs Mock vs Missing).
- [`05-phased-implementation-plan.md`](file:///Users/tiodev/Stayea/docs/stayea-audit/05-phased-implementation-plan.md): 7-Phase implementation roadmap from P0 containment to Production Go-Live.
- [`06-baseline-test-results.md`](file:///Users/tiodev/Stayea/docs/stayea-audit/06-baseline-test-results.md): Typecheck, lint, and unit test execution log.

