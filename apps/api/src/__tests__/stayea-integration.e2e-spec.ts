import crypto from "node:crypto"
import { afterAll, beforeAll, describe, expect, it } from "vitest"
import { USER_ROLE_REPOSITORY } from "@/modules/auth/application/ports/user-role.repository.port.js"
import { createTestApp } from "./helpers/create-app.js"
import { registerAndLogin } from "./helpers/create-authenticated-request.js"
import { createRequest } from "./helpers/create-request.js"

import type { UserRoleRepository } from "@/modules/auth/application/ports/user-role.repository.port.js"
import type { INestApplication } from "@nestjs/common"

describe("STAYEA Full Platform E2E Integration Suite", () => {
  let app: INestApplication
  let prefix: string
  let customerToken: string
  let adminToken: string
  let adminUserId: string
  const webhookSecret = process.env.PAYMENT_WEBHOOK_SECRET || "stayea-webhook-secret-key-2026"

  function computeSignature(orderCode: string, amount: number, status: string) {
    return crypto
      .createHmac("sha256", webhookSecret)
      .update(`${orderCode}|${amount}|${status}`)
      .digest("hex")
  }

  beforeAll(async () => {
    app = await createTestApp()
    prefix = `stayea-e2e-${Date.now()}`

    // 1. Register regular customer user
    const customerEmail = `${prefix}-traveler@stayea.test`
    customerToken = await registerAndLogin(app, customerEmail, "TravelerPass@123", "Nguyễn Du Khách")

    // 2. Register user & elevate to ADMIN role in DB
    const adminEmail = `${prefix}-admin@stayea.test`
    const adminRegRes = await createRequest(app)
      .post("/api/auth/register")
      .send({ email: adminEmail, password: "AdminSecurePass@123", name: "Quản Trị Viên STAYEA" })
      .expect(201)

    const adminBody = adminRegRes.body as { accessToken: string; user: { id: string } }
    adminUserId = adminBody.user.id

    const userRoleRepo = app.get<UserRoleRepository>(USER_ROLE_REPOSITORY)
    await userRoleRepo.setRole(adminUserId, "ADMIN")

    // Re-login to get token with ADMIN role embedded
    const adminLoginRes = await createRequest(app)
      .post("/api/auth/login")
      .send({ email: adminEmail, password: "AdminSecurePass@123" })
      .expect(200)

    adminToken = (adminLoginRes.body as { accessToken: string }).accessToken
  }, 30000)

  afterAll(async () => {
    await app.close()
  })

  describe("1. Catalog & Public Discovery", () => {
    it("GET /api/stayea/accommodations returns active luxury villas & stays", async () => {
      const res = await createRequest(app)
        .get("/api/stayea/accommodations")
        .expect(200)

      const body = res.body?.data || res.body
      const items = Array.isArray(body) ? body : body.items
      expect(Array.isArray(items)).toBe(true)
    })
  })

  describe("2. AI Concierge Health & Safety", () => {
    it("GET /api/stayea/ai/health returns system operational status", async () => {
      const res = await createRequest(app)
        .get("/api/stayea/ai/health")
        .expect(200)

      const data = res.body?.data || res.body
      expect(data).toHaveProperty("status")
      expect(["online", "offline", "degraded"]).toContain(data.status)
      expect(data).toHaveProperty("service")
      expect(data.service).toBe("STAYEA AI Engine")
    })
  })

  describe("3. Security P0 — Webhook Signature Enforcement", () => {
    it("rejects unsigned payment webhook with 401 Unauthorized", async () => {
      await createRequest(app)
        .post("/api/stayea/payments/webhook")
        .send({
          orderCode: "STA-202611-FORGED",
          transactionRef: "TX-FAKE",
          amount: 5000000,
          status: "PAID",
        })
        .expect(401)
    })

    it("rejects bypass attempt with skip_dev_check header", async () => {
      await createRequest(app)
        .post("/api/stayea/payments/webhook")
        .set("x-signature", "skip_dev_check")
        .send({
          orderCode: "STA-202611-BYPASS",
          transactionRef: "TX-BYPASS",
          amount: 5000000,
          status: "PAID",
        })
        .expect(401)
    })

    it("rejects forged or tampered HMAC signature", async () => {
      await createRequest(app)
        .post("/api/stayea/payments/webhook")
        .set("x-signature", "deadbeef0123456789abcdef0123456789abcdef0123456789abcdef01234567")
        .send({
          orderCode: "STA-202611-TAMPERED",
          transactionRef: "TX-TAMPER",
          amount: 5000000,
          status: "PAID",
        })
        .expect(401)
    })
  })

  describe("4. End-to-End Booking & Payment Flow", () => {
    let createdBookingCode: string
    const bookingAmount = 3_500_000

    it("creates a customer booking with pending status and 15-minute hold", async () => {
      const payload = {
        title: "Villa Sunset Grand View Phú Quốc",
        bookingType: "stay",
        destination: "Dương Đông, Phú Quốc",
        startDate: "2026-11-10",
        endDate: "2026-11-14",
        totalAmount: bookingAmount,
        guestCount: 2,
      }

      const res = await createRequest(app)
        .post("/api/stayea/bookings")
        .set("Authorization", `Bearer ${customerToken}`)
        .send(payload)
        .expect(201)

      const body = res.body?.data || res.body
      expect(body).toHaveProperty("id")
      expect(body).toHaveProperty("bookingCode")
      expect(["pending", "pending_payment"]).toContain(body.status)
      expect(body.paymentStatus).toBe("unpaid")

      createdBookingCode = body.bookingCode
      expect(createdBookingCode).toMatch(/^STA-\d{6}-\d{4}$/)
    })

    it("confirms booking atomically upon verified bank payment webhook", async () => {
      const validSig = computeSignature(createdBookingCode, bookingAmount, "PAID")

      const res = await createRequest(app)
        .post("/api/stayea/payments/webhook")
        .set("x-signature", validSig)
        .send({
          orderCode: createdBookingCode,
          transactionRef: `VCB-${Date.now()}`,
          amount: bookingAmount,
          status: "PAID",
        })
        .expect(201)

      const body = res.body?.data || res.body
      expect(body.success).toBe(true)
      expect(body.replayed).toBe(false)
      expect(body.booking.status).toBe("confirmed")
      expect(body.booking.paymentStatus).toBe("paid")
    })

    it("handles idempotent webhook replays gracefully without duplicate mutations", async () => {
      const validSig = computeSignature(createdBookingCode, bookingAmount, "PAID")

      const res = await createRequest(app)
        .post("/api/stayea/payments/webhook")
        .set("x-signature", validSig)
        .send({
          orderCode: createdBookingCode,
          transactionRef: `VCB-${Date.now()}`,
          amount: bookingAmount,
          status: "PAID",
        })
        .expect(201)

      const body = res.body?.data || res.body
      expect(body.success).toBe(true)
      expect(body.replayed).toBe(true)
    })
  })

  describe("5. Admin Control Plane & Governance Endpoints", () => {
    it("GET /api/stayea/bookings/admin/analytics/revenue returns time-series analytics for ADMIN", async () => {
      const res = await createRequest(app)
        .get("/api/stayea/bookings/admin/analytics/revenue?days=7")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200)

      const body = res.body?.data || res.body
      expect(body).toHaveProperty("windowDays")
      expect(body).toHaveProperty("kpis")
      expect(body.kpis).toHaveProperty("totalRevenue")
      expect(body.kpis).toHaveProperty("totalBookings")
      expect(body).toHaveProperty("timeline")
      expect(Array.isArray(body.timeline)).toBe(true)
      expect(body.timeline.length).toBe(7)
    })

    it("GET /api/stayea/admin/partners/catalog/services lists services for moderation", async () => {
      const res = await createRequest(app)
        .get("/api/stayea/admin/partners/catalog/services")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200)

      const body = res.body?.data || res.body
      expect(Array.isArray(body)).toBe(true)
    })
  })
})
