/**
 * STAYEA Comprehensive System Test Suite
 * Covers API Functional, Performance, Security, White-label & Regression testing
 */

const BASE_URL = process.env.TEST_BASE_URL || "https://admin.stayea.com";

class TestRunner {
  constructor() {
    this.results = [];
    this.startTime = Date.now();
  }

  async runTest(name, category, testFn) {
    const t0 = performance.now();
    try {
      await testFn();
      const duration = Math.round(performance.now() - t0);
      this.results.push({
        name,
        category,
        status: "PASS",
        duration,
        error: null,
      });
      console.log(`  ✓ [PASS] [${duration}ms] ${name}`);
    } catch (err) {
      const duration = Math.round(performance.now() - t0);
      this.results.push({
        name,
        category,
        status: "FAIL",
        duration,
        error: err.message || String(err),
      });
      console.error(`  ✗ [FAIL] [${duration}ms] ${name}: ${err.message}`);
    }
  }

  summarize() {
    const total = this.results.length;
    const passed = this.results.filter((r) => r.status === "PASS").length;
    const failed = this.results.filter((r) => r.status === "FAIL").length;
    const durations = this.results.map((r) => r.duration);
    const avgDuration = Math.round(
      durations.reduce((a, b) => a + b, 0) / (total || 1)
    );
    durations.sort((a, b) => a - b);
    const p95 = durations[Math.floor(durations.length * 0.95)] || 0;

    return {
      total,
      passed,
      failed,
      passRate: ((passed / (total || 1)) * 100).toFixed(1) + "%",
      avgDurationMs: avgDuration,
      p95DurationMs: p95,
      totalTimeMs: Date.now() - this.startTime,
      results: this.results,
    };
  }
}

async function run() {
  console.log(`\n======================================================`);
  console.log(`🚀 STARTING STAYEA SYSTEM-WIDE VERIFICATION & REGRESSION`);
  console.log(`Target: ${BASE_URL}`);
  console.log(`Time: ${new Date().toISOString()}`);
  console.log(`======================================================\n`);

  const runner = new TestRunner();

  // -------------------------------------------------------------------
  // 1. AI ENGINE & WHITE-LABEL COMPLIANCE
  // -------------------------------------------------------------------
  console.log(`\n📋 SUITE 1: AI Engine & White-Label Compliance`);

  await runner.runTest("AI Health Endpoint returns online status", "AI Engine", async () => {
    const res = await fetch(`${BASE_URL}/api/stayea/ai/health`);
    if (!res.ok) throw new Error(`HTTP status ${res.status}`);
    const json = await res.json();
    if (json.status !== "online") throw new Error(`Expected online, got ${json.status}`);
    if (json.service !== "STAYEA AI Engine") throw new Error(`Expected service 'STAYEA AI Engine', got ${json.service}`);
    if (json.routerUrl) throw new Error(`routerUrl leaked in health response!`);
    if (json.activeModel) throw new Error(`activeModel leaked in health response!`);
  });

  await runner.runTest("White-Label Leak Audit: No '9Router' or internal keywords", "Security", async () => {
    const res = await fetch(`${BASE_URL}/api/stayea/ai/health`);
    const rawText = await res.text();
    if (/9router/i.test(rawText)) throw new Error("Found '9router' in AI Health API response!");
    if (/openclaw/i.test(rawText)) throw new Error("Found 'openclaw' in AI Health API response!");
    if (/sandbox/i.test(rawText)) throw new Error("Found 'sandbox' in AI Health API response!");
  });

  await runner.runTest("AI Concierge Chat Endpoint handles travel consultation", "AI Engine", async () => {
    const res = await fetch(`${BASE_URL}/api/stayea/ai/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [
          {
            role: "user",
            content: "Xin chào, tôi cần tìm villa 3 phòng ngủ có hồ bơi tại Phú Quốc",
          },
        ],
      }),
    });
    if (!res.ok) throw new Error(`HTTP status ${res.status}`);
    const json = await res.json();
    if (!json.reply || typeof json.reply !== "string") {
      throw new Error("AI chat response missing 'reply' string");
    }
    if (/9router/i.test(json.reply)) {
      throw new Error("AI reply leaked '9router' keyword!");
    }
  });

  // -------------------------------------------------------------------
  // 2. CATALOG & SERVICE DISCOVERY
  // -------------------------------------------------------------------
  console.log(`\n📋 SUITE 2: Catalog Services & Accommodations`);

  await runner.runTest("Accommodations API returns active villas/resorts", "Catalog", async () => {
    const res = await fetch(`${BASE_URL}/api/stayea/accommodations`);
    if (!res.ok) throw new Error(`HTTP status ${res.status}`);
    const json = await res.json();
    const items = json.items || (Array.isArray(json) ? json : null);
    if (!items || !items.length) throw new Error("No accommodations returned");
    const first = items[0];
    if (!first.id || !first.title || !first.pricePerNight) {
      throw new Error(`Accommodation item missing essential fields: ${JSON.stringify(first)}`);
    }
  });

  await runner.runTest("Experiences & Tours API returns active activities", "Catalog", async () => {
    const res = await fetch(`${BASE_URL}/api/stayea/experiences`);
    if (!res.ok) throw new Error(`HTTP status ${res.status}`);
    const json = await res.json();
    const items = json.items || (Array.isArray(json) ? json : null);
    if (!items || !items.length) throw new Error("No experiences returned");
    const first = items[0];
    if (!first.id || !first.title) {
      throw new Error(`Experience item missing fields: ${JSON.stringify(first)}`);
    }
  });

  await runner.runTest("Partner Catalog Services returns multi-category fleet", "Catalog", async () => {
    const res = await fetch(`${BASE_URL}/api/stayea/partner/catalog/services`);
    if (!res.ok) throw new Error(`HTTP status ${res.status}`);
    const json = await res.json();
    if (!Array.isArray(json) || json.length === 0) {
      throw new Error("Expected array of partner services");
    }
    const types = new Set(json.map((s) => s.serviceType));
    if (!types.size) throw new Error("No service types found");
  });

  // -------------------------------------------------------------------
  // 3. BUSINESS LOGIC & REGRESSION TESTING (PHONE & DATE VALIDATION)
  // -------------------------------------------------------------------
  console.log(`\n📋 SUITE 3: Business Logic & Regression Guard`);

  await runner.runTest("Regression: Draft Order REJECTS invalid phone number", "Validation", async () => {
    const res = await fetch(`${BASE_URL}/api/stayea/partner/orders/draft`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        partnerId: "ptn_carrent_02",
        serviceId: "svc_car_xpander",
        customerName: "Test Khách Hàng",
        customerPhone: "12345", // Invalid!
        serviceTitle: "Thuê xe 7 chỗ",
        serviceType: "transport",
        startDate: "2026-11-20",
        unitPrice: 900000,
        totalAmount: 900000,
      }),
    });

    if (res.status !== 400) {
      throw new Error(`Expected HTTP 400 for invalid phone, got ${res.status}`);
    }
    const json = await res.json();
    const message = json.message || json.detail || JSON.stringify(json);
    if (!message.includes("Số điện thoại không hợp lệ")) {
      throw new Error(`Expected Vietnamese phone validation message, got: ${message}`);
    }
  });

  await runner.runTest("Regression: Draft Order REJECTS past startDate", "Validation", async () => {
    const res = await fetch(`${BASE_URL}/api/stayea/partner/orders/draft`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        partnerId: "ptn_carrent_02",
        serviceId: "svc_car_xpander",
        customerName: "Test Khách Hàng",
        customerPhone: "0912345678",
        serviceTitle: "Thuê xe 7 chỗ",
        serviceType: "transport",
        startDate: "2020-01-01", // Past date!
        unitPrice: 900000,
        totalAmount: 900000,
      }),
    });

    if (res.status !== 400) {
      throw new Error(`Expected HTTP 400 for past date, got ${res.status}`);
    }
    const json = await res.json();
    const message = json.message || json.detail || JSON.stringify(json);
    if (!message.includes("quá khứ")) {
      throw new Error(`Expected past date rejection message, got: ${message}`);
    }
  });

  let createdOrderId = null;

  await runner.runTest("Draft Order ACCEPTS valid phone and future date", "Order Workflow", async () => {
    const res = await fetch(`${BASE_URL}/api/stayea/partner/orders/draft`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        partnerId: "ptn_carrent_02",
        serviceId: "svc_car_xpander",
        customerName: "Nguyễn Văn Kiểm Thử",
        customerPhone: "0987 654 321", // Valid with spaces -> normalized
        serviceTitle: "Thuê xe 7 chỗ Mitsubishi Xpander",
        serviceType: "transport",
        startDate: "2026-11-25",
        quantity: 2,
        unitPrice: 900000,
        totalAmount: 1800000,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Failed to create order: HTTP ${res.status} - ${errText}`);
    }
    const order = await res.json();
    if (!order.id || !order.orderCode) throw new Error("Order missing id/orderCode");
    if (order.status !== "pending_admin") throw new Error(`Expected pending_admin, got ${order.status}`);
    if (order.customerPhone !== "0987654321") throw new Error(`Phone not normalized: ${order.customerPhone}`);
    createdOrderId = order.id;
  });

  // -------------------------------------------------------------------
  // 4. FRONTEND ROUTE ACCESSIBILITY & TECH LEAK CHECKS
  // -------------------------------------------------------------------
  console.log(`\n📋 SUITE 4: Frontend Routes & White-Label HTML Scans`);

  const routesToCheck = [
    { path: "/", name: "Landing Page" },
    { path: "/stayea/overview", name: "Admin Dashboard / Overview" },
    { path: "/stayea/bookings", name: "Admin Bookings" },
    { path: "/stayea/properties", name: "Admin Properties" },
    { path: "/stayea/customers", name: "Admin Customers" },
    { path: "/stayea/hosts", name: "Admin Partner / Hosts Management" },
    { path: "/stayea/experiences", name: "Admin Experiences" },
    { path: "/stayea/marketing", name: "Admin Marketing" },
    { path: "/stayea/reports", name: "Admin Reports" },
    { path: "/stayea/revenue", name: "Admin Revenue" },
    { path: "/hub", name: "Partner Hub Portal" },
  ];

  for (const r of routesToCheck) {
    await runner.runTest(`Route ${r.name} (${r.path}) responds HTTP 200/307`, "Frontend", async () => {
      const res = await fetch(`${BASE_URL}${r.path}`, { redirect: "manual" });
      if (res.status !== 200 && res.status !== 307 && res.status !== 308) {
        throw new Error(`Route ${r.path} returned unexpected status ${res.status}`);
      }
      if (res.status === 200) {
        const html = await res.text();
        if (/9router/i.test(html)) {
          throw new Error(`Route ${r.path} leaked '9Router' in HTML!`);
        }
      }
    });
  }

  // -------------------------------------------------------------------
  // SUMMARY REPORT
  // -------------------------------------------------------------------
  const summary = runner.summarize();
  console.log(`\n======================================================`);
  console.log(`📊 TEST EXECUTION SUMMARY`);
  console.log(`Total Tests:    ${summary.total}`);
  console.log(`Passed:         ${summary.passed} (${summary.passRate})`);
  console.log(`Failed:         ${summary.failed}`);
  console.log(`Avg Latency:    ${summary.avgDurationMs}ms`);
  console.log(`P95 Latency:    ${summary.p95DurationMs}ms`);
  console.log(`Total Runtime:  ${summary.totalTimeMs}ms`);
  console.log(`======================================================\n`);

  return summary;
}

run()
  .then((summary) => {
    if (summary.failed > 0) {
      process.exit(1);
    }
  })
  .catch((err) => {
    console.error("Fatal error:", err);
    process.exit(1);
  });
