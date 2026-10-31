---
name: stayea-webapp-test
description: Test the Stayea web app end to end across guest, customer, admin, and partner hub workflows. Use when validating features, regressions, permissions, or demo-data removal in this repository.
---

# Stayea web app testing

Use this skill from the repository root. The app is a pnpm monorepo: Next.js frontend at `apps/admin-shadcn` (port 8080), NestJS API at `apps/api` (port 3000), PostgreSQL and Redis via `docker/docker-compose.yml`. Check `.env` configuration and repository-specific instructions before starting services. Never print secrets.

## Test strategy

1. Map the requested feature to its Next route, feature module, API controller/service, and database schema. Use `rg --files apps/admin-shadcn/src/app apps/admin-shadcn/src/features apps/api/src/modules/stayea` and inspect the matching source before testing.
2. Prefer the running app and its real API. Use Playwright/browser interaction for user-visible behavior; use API requests for setup and contract checks. The repo includes `scripts/system-test-suite.mjs` and API Vitest e2e specs. Run the smallest relevant checks first, then expand to the full suite when requested or needed.
3. Test with isolated, clearly named records. Use repository seed scripts only against a local/test database; do not point them at production or a shared live environment. Avoid real payment, email, or third-party side effects.
4. Cover success, validation errors, empty/loading states, API failures, refresh persistence, and authorization boundaries. Confirm changes persist after reload rather than only changing React state.
5. Report each scenario as pass/fail/not run, with the role, route or endpoint, observed result, and any setup limitation. Do not count a rendered mock value as a passing data test.

## Role and feature coverage

### Guest and customer

- Public landing page, search/catalog discovery, stay, experience, package, flight, transport and deal detail flows.
- Registration, login, logout, session refresh/revocation, profile/settings, payment method management, and protected-route redirects.
- Favorites, vouchers, plans, reviews, booking creation, booking list/detail/cancellation, checkout and payment status.
- Stayea Club profile, perks claim and history.
- Verify empty catalog and empty account states; invalid dates, unavailable inventory, invalid voucher, duplicate submission and unauthenticated requests.

### Admin

- Dashboard metrics and reports must reflect API/database values and show useful empty/error states.
- User/role management, bookings and status transitions, properties/catalog, hosts/partners and approval, deals, experiences, customer records, messages, marketing, revenue, reviews, audit logs, login logs and settings.
- Verify admin-only endpoints reject customer and partner credentials, list filters/pagination work, mutations persist, and audit entries are generated where applicable.
- Watch for fallback arrays/constants from `*-mock-data.ts`. On API failure the UI must not present fabricated metrics or successful mutations.

### Partner Hub

- Partner registration creates a pending profile; admin approval/rejection controls access/status.
- Own profile and summary; create/edit/disable/delete own services; inventory updates; assigned orders list, accept/reject, and refresh persistence.
- Attempt to read or mutate another partner's records by changing IDs. The server must derive partner identity from the authenticated session and reject cross-partner access.
- Verify a failed API mutation leaves the UI unchanged and gives a visible error.

## Data and hardcode audit

Search application source for `mock-data`, `DEMO_`, `MOCK_`, fake IDs, seeded names, hard-coded totals, and catch blocks that silently return demo/default data. Keep test fixtures in test-only files. Seed scripts are acceptable only as explicit local development/test setup; check they do not run automatically in production. Distinguish configuration/content defaults from fake transactional records. For each finding, trace whether it is rendered or used in a live mutation before classifying it.

## Useful commands

```bash
pnpm --filter api test:e2e
pnpm --filter api test
pnpm --filter admin-shadcn test --run
pnpm --filter api typecheck
pnpm --filter admin-shadcn typecheck
node scripts/system-test-suite.mjs
```

Use commands relevant to the change and report the exact command and result. Do not claim coverage for integrations that are not configured or exercised.
