# STAYEA PLATFORM AUDIT: BASELINE TEST RESULTS
**Document ID:** `STAYEA-AUD-06`  
**Date:** 2026-11-02  
**Baseline Commit:** `f9c97a7 (HEAD -> main, origin/main)`  
**Node.js Version:** `v22.13.0`  
**pnpm Version:** `10.32.1`  
**OS:** macOS Darwin 24.3.0 (arm64)

---

## 1. Monorepo TypeScript Typecheck Results

**Execution Command:** `pnpm typecheck` (`turbo run typecheck`)

```text
• turbo 2.8.20
• Packages in scope: @workspace/api-types, @workspace/database, @workspace/icons, @workspace/ui, admin-shadcn, api
• Running typecheck in 6 packages

✔ @workspace/ui: tsc --noEmit (0 errors)
✔ @workspace/database: tsc --noEmit (0 errors)
✔ api: tsc -b --noEmit (0 errors)
✔ admin-shadcn: tsc -b --noEmit (0 errors)

Tasks:    4 successful, 4 total
Cached:   0 cached, 4 total
Time:     5.199s
Status:   GREEN (PASS)
```

**Assessment:**  
All workspace packages compile cleanly under strict TypeScript mode with zero type errors.

---

## 2. Backend Unit & Domain Tests (`apps/api`)

**Execution Command:** `pnpm --filter api test` (`vitest run`)

```text
RUN  v4.1.0 /Users/tiodev/Stayea/apps/api

✓ src/__tests__/unit/global-modules.spec.ts (3 tests) 71ms
✓ src/modules/order/domain/aggregates/order.aggregate.spec.ts (7 tests) 7ms
✓ src/modules/auth/domain/aggregates/auth-identity.aggregate.spec.ts (6 tests) 5ms
✓ src/modules/article/application/services/article.service.spec.ts (15 tests) 10ms
✓ src/modules/order/application/services/order.service.spec.ts (11 tests) 10ms
✓ src/modules/auth/application/services/oauth.service.spec.ts (5 tests) 7ms
✓ src/modules/auth/application/services/auth.service.spec.ts (15 tests) 13ms
✓ src/modules/identity/application/services/user.service.spec.ts (8 tests) 6ms
✓ src/modules/order/domain/value-objects/money.vo.spec.ts (6 tests) 3ms
✓ src/modules/order/domain/value-objects/order-item.vo.spec.ts (6 tests) 4ms
✓ src/__tests__/unit/stayea-booking.service.spec.ts (3 tests) 6ms
✓ src/__tests__/unit/stayea-catalog.service.spec.ts (3 tests) 5ms
✓ src/__tests__/unit/stayea-payment.service.spec.ts (3 tests) 4ms

Test Files  13 passed (13)
Tests       91 passed (91)
Duration    1.14s (transform 1.10s, setup 0ms, import 3.95s, tests 152ms)
Status:     GREEN (PASS)
```

**Assessment:**  
Existing unit tests for boilerplate and newly added Stayea services pass completely. However, tests currently lack concurrency race condition verification and strict webhook rejection assertions.

---

## 3. Frontend Unit & Component Tests (`apps/admin-shadcn`)

**Execution Command:** `pnpm --filter admin-shadcn test -- --run` (`vitest run`)

```text
RUN  v4.1.0 /Users/tiodev/Stayea/apps/admin-shadcn

✓ src/components/admin-layout.test.tsx (2 tests) 95ms
✓ src/features/ai-agent/components/ai-chat-drawer.test.tsx (4 tests) 78ms
✓ src/features/ai-agent/components/ai-chat-trigger-button.test.tsx (2 tests) 64ms
✓ src/features/ai-agent/components/ai-quick-action-cards.test.tsx (4 tests) 65ms
✓ src/features/ai-agent/components/ai-thinking-indicator.test.tsx (3 tests) 55ms
✓ src/features/ai-agent/components/ai-welcome-card.test.tsx (4 tests) 70ms
✓ src/features/ai-agent/components/chat-right-sidebar.test.tsx (2 tests) 82ms
✓ src/lib/rbac.test.ts (6 tests) 11ms
✓ src/features/partner-portal/components/partner-create-service-modal.test.ts (4 tests) 11ms

Test Files  9 passed (9)
Tests       31 passed (31)
Duration    2.60s
Status:     GREEN (PASS)
```

**Assessment:**  
Partner portal form validation and AI chat UI components pass all unit assertions.

---

## 4. Static Code Quality & Linter Results (`oxlint`)

**Execution Command:** `pnpm lint` (`turbo run lint`)

- `@workspace/ui`: Found 0 warnings and 0 errors (PASS).
- `@workspace/icons`: Found 0 warnings and 0 errors (PASS).
- `@workspace/database`: Found 1 error (`eslint-plugin-unicorn(catch-error-name)` in `scripts/seed-partner-demo.ts`).
- `apps/api`: Found 12 errors and 62 warnings (Unicorn rule catches, nested blocks in AI agent service).
- `apps/admin-shadcn`: Warning regarding missing `"type": "module"` in `package.json`.

**Assessment:**  
TypeScript compilation is clean, but strict Oxlint formatting and unicorn lint rules need cleanup during code hardening phases.

---

## 5. Live VPS Baseline Verification (`157.66.100.35`)

- **API Process (`stayea-api`, ID 9):** Online on port `3088`. Healthy.
- **Frontend Process (`stayea-frontend`, ID 10):** Online on port `8088`. Healthy.
- **Database (`postgres`):** Healthy with seeded Phú Quốc accommodations, experiences, transports, flights, and partner listings.
- **Public Domain Access:**
  - `stayea.com` resolves and loads customer portal.
  - `hub.stayea.com` resolves and loads partner hub with isolated partner login.
  - `admin.stayea.com` resolves and loads admin console.

---

## 6. QA Baseline Verdict

The foundational code is solid and runs cleanly without crashes or type breaks. However, because critical business rules (locking, webhook HMAC, SSR cookie auth) exist in insecure or incomplete states, the system cannot be declared production-ready until Phase 1 and Phase 2 are implemented and verified.

