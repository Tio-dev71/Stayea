# STAYEA PLATFORM AUDIT: SECURITY RISK REGISTER
**Document ID:** `STAYEA-AUD-03`  
**Date:** 2026-11-02  
**Baseline Commit:** `f9c97a7`

---

## 1. Summary of Identified Security Risks

| Risk ID | Title | Severity | CVSS 3.1 | Status |
|---|---|---|---|---|
| **SEC-001** | Client-Forged Cookie Bypasses SSR Admin Layout | **P0 - Critical** | **9.8** | Confirmed Code Defect |
| **SEC-002** | Insecure Payment Webhook Signature Bypass | **P0 - Critical** | **9.6** | Confirmed Code Defect |
| **SEC-003** | Race Condition in Booking Availability (Double-Booking) | **P0 - Critical** | **8.1** | Confirmed Code Defect |
| **SEC-004** | Booking Instant Confirmation Without Payment | **P0 - Critical** | **8.5** | Confirmed Logic Defect |
| **SEC-005** | Arbitrary Partner Profile Auto-Creation for Any User | **P0 - Critical** | **7.5** | Confirmed Logic Defect |
| **SEC-006** | Hardcoded Secrets in Docker Compose & Repo | **P1 - High** | **8.2** | Confirmed Config Defect |
| **SEC-007** | JWT Storage in LocalStorage and Plain Cookie | **P1 - High** | **7.4** | Architecture Defect |
| **SEC-008** | Insecure Partner Service Ownership Lookup | **P1 - High** | **7.1** | Confirmed Logic Defect |
| **SEC-009** | Missing Rate Limiting on Public AI Chat & Search | **P2 - Medium** | **5.3** | Resource Risk |
| **SEC-010** | Unsanitized Google Drive Image Input in Partner Form | **P2 - Medium** | **5.0** | Input Validation Risk |
| **SEC-011** | Mock Endpoints Bypassing Financial Verification | **P2 - Medium** | **6.5** | Hygiene Risk |
| **SEC-012** | Missing CORS & CSP Headers on Multi-Subdomain Setup | **P2 - Medium** | **5.8** | Network Edge Risk |

---

## 2. Detailed Vulnerability Analyses

### SEC-001: Client-Forged Cookie Bypasses SSR Admin Layout
- **Severity:** P0 - Critical | **CVSS:** 9.8 (`CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H`)
- **Location:** `apps/admin-shadcn/src/lib/server-user.ts` (lines 4–16), `apps/admin-shadcn/src/app/stayea/layout.tsx` (lines 14–26).
- **Code Evidence:**
  ```typescript
  // apps/admin-shadcn/src/lib/server-user.ts
  export async function getServerUser() {
    const cookieStore = await cookies();
    const raw = cookieStore.get("user")?.value;
    if (!raw) return null;
    try {
      return JSON.parse(decodeURIComponent(raw)); // Completely unverified, client-writable!
    } catch {
      return null;
    }
  }
  ```
- **Exploitation Scenario:**
  1. An unauthenticated attacker visits `admin.stayea.com/stayea`.
  2. The attacker opens browser DevTools and executes:
     `document.cookie = 'user=' + encodeURIComponent(JSON.stringify({ id: "any", role: "ADMIN", email: "hacker@evil.com" })) + '; path=/'`
  3. The Next.js SSR layout parses this cookie, evaluates `user.role === 'ADMIN'`, and renders the full Admin layout and all UI controls without ever contacting the NestJS backend to verify identity.
- **Impact:** Complete exposure of administrative UI, customer lists, financial dashboards, and partner management controls.
- **Remediation Plan:**
  1. Store the authentication session in an `HttpOnly`, `Secure`, `SameSite=Lax` cookie containing only the cryptographically signed JWT.
  2. Implement an SSR session validator in Next.js middleware that verifies the JWT signature using the server secret or queries `GET /api/auth/me` with caching.
  3. Never trust client-writable JSON state for role enforcement.

---

### SEC-002: Insecure Payment Webhook Signature Bypass
- **Severity:** P0 - Critical | **CVSS:** 9.6 (`CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:N`)
- **Location:** `apps/api/src/modules/stayea/payment/stayea-payment.service.ts` (lines 104–136).
- **Code Evidence:**
  ```typescript
  // stayea-payment.service.ts
  const signature = signatureHeader || body.signature;
  if (signature === "skip_dev_check" || (!signature && process.env.NODE_ENV !== "production")) {
    this.logger.warn("Skipping webhook signature check in development mode");
    // Execution continues and updates booking to 'paid'!
  }
  ```
- **Exploitation Scenario:**
  1. An attacker reserves a luxury villa for 5 nights ($3,000 total).
  2. Instead of transferring funds, the attacker sends a POST request:
     ```http
     POST /api/stayea/payments/webhook HTTP/1.1
     Host: api.stayea.com
     Content-Type: application/json
     x-stayea-signature: skip_dev_check

     {
       "bookingId": "target-booking-uuid",
       "amount": 3000,
       "status": "success"
     }
     ```
  3. The system accepts the request, updates `stayea_bookings` to `paymentStatus = "paid"`, and marks the booking as valid and active.
- **Impact:** Total financial loss; attackers obtain free lodging, flights, and tours.
- **Remediation Plan:**
  1. Remove all debug/dev bypass branches (`skip_dev_check`) completely.
  2. Compute HMAC-SHA256 over raw request body using gateway-provided webhook secret key.
  3. Reject any request lacking a valid cryptographic signature with HTTP 401 Unauthorized.
  4. Ensure replay protection by checking incoming transaction ID uniqueness against database records.

---

### SEC-003: Race Condition in Booking Availability (Double-Booking)
- **Severity:** P0 - Critical | **CVSS:** 8.1 (`CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:U/C:N/I:H/A:H`)
- **Location:** `apps/api/src/modules/stayea/booking/stayea-booking.service.ts` (lines 142–180).
- **Code Evidence:**
  - Date collision query is executed as an isolated `SELECT` before entering the transaction block.
  - No `FOR UPDATE` lock is placed on the accommodation record or date intervals.
- **Exploitation Scenario:**
  - Two customers simultaneously submit bookings for Villa Horizon from Dec 24 to Dec 28.
  - Both requests pass the `SELECT` query before either completes its `INSERT`.
  - Both bookings receive database approval, causing an irrecoverable real-world physical conflict.
- **Impact:** Breach of customer contract, reputational damage, customer stranding, partner disputes.
- **Remediation Plan:**
  1. Wrap the availability check and insert in a strict PostgreSQL database transaction with `SERIALIZABLE` isolation or `SELECT ... FOR UPDATE` on the parent accommodation row.
  2. In PostgreSQL, implement a `daterange` GiST exclusion constraint:
     `ALTER TABLE stayea_bookings ADD CONSTRAINT no_overlapping_bookings EXCLUDE USING gist (stay_id WITH =, daterange(check_in, check_out, '[)') WITH &&) WHERE (status NOT IN ('cancelled', 'expired'));`

---

### SEC-004: Booking Instant Confirmation Without Payment
- **Severity:** P0 - Critical | **CVSS:** 8.5 (`CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:H/A:L`)
- **Location:** `apps/api/src/modules/stayea/booking/stayea-booking.service.ts` (lines 182–210).
- **Code Evidence:**
  - Bookings are inserted with `status = "confirmed"` and `paymentStatus = "unpaid"`.
- **Impact:** Inventory is blocked indefinitely by unpaid checkout initiations. A denial-of-inventory attack can block all villas across Phu Quoc in minutes.
- **Remediation Plan:**
  1. New bookings MUST enter state `status = "pending_payment"`.
  2. Assign an expiration timestamp: `expiresAt = NOW() + INTERVAL '15 minutes'`.
  3. A scheduled NestJS cron task (`@Cron("*/1 * * * *")`) automatically frees inventory for expired pending bookings.

---

### SEC-005: Arbitrary Partner Profile Auto-Creation
- **Severity:** P0 - Critical | **CVSS:** 7.5 (`CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:L/I:H/A:N`)
- **Location:** `apps/api/src/modules/stayea/partner/stayea-partner.service.ts` (lines 38–62).
- **Code Evidence:**
  ```typescript
  if (!profile) {
    const [created] = await this.db.insert(partnerProfilesTable).values({
      userId,
      businessName: `Cơ sở STAYEA - ${user?.fullName || "Đối tác mới"}`,
      status: "approved", // Automatically approved without KYC or admin verification!
      commissionRate: "10.00"
    }).returning();
  }
  ```
- **Exploitation Scenario:**
  - Any regular customer who logs into `hub.stayea.com` immediately gains an `approved` business profile and can begin publishing services into the platform catalog.
- **Remediation Plan:**
  - Restrict profile auto-creation. If no profile exists, return HTTP 404 with registration prompt.
  - Require a dedicated KYC submission endpoint (`POST /api/stayea/partner/register`).
  - Newly registered partners must be set to `status = "pending"` until an Admin explicitly reviews and approves them in `admin.stayea.com/stayea/partners`.

---

### SEC-006: Hardcoded Secrets in Docker Compose & Repo
- **Severity:** P1 - High | **CVSS:** 8.2 (`CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:L/A:N`)
- **Location:** `docker/docker-compose.yml` (lines 15–30), `apps/api/src/modules/stayea/payment/stayea-payment.service.ts` (line 120).
- **Remediation Plan:**
  - Remove all hardcoded credentials from `docker-compose.yml`. Reference `.env` variables only.
  - Add pre-commit hook scanning via `git-secrets` or Gitleaks.
  - Regenerate all secrets on production server.

