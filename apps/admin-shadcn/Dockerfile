# syntax=docker/dockerfile:1

# ────────────────────────────────────────────
# Stage 1: Dependencies
# ────────────────────────────────────────────
FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/admin-shadcn/package.json ./apps/admin-shadcn/
COPY packages/ui/package.json ./packages/ui/
COPY packages/icons/package.json ./packages/icons/
COPY packages/api-types/package.json ./packages/api-types/
COPY packages/eslint-config/package.json ./packages/eslint-config/

RUN pnpm install --frozen-lockfile

# ────────────────────────────────────────────
# Stage 2: Builder
# ────────────────────────────────────────────
FROM node:22-alpine AS builder
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/admin-shadcn/node_modules ./apps/admin-shadcn/node_modules

COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN pnpm --filter @workspace/icons build
RUN pnpm --filter @workspace/ui build
RUN pnpm --filter admin-shadcn build

# ────────────────────────────────────────────
# Stage 3: Runner
# ────────────────────────────────────────────
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=8080
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/apps/admin-shadcn/public ./apps/admin-shadcn/public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/apps/admin-shadcn/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/admin-shadcn/.next/static ./apps/admin-shadcn/.next/static

USER nextjs

EXPOSE 8080

CMD ["node", "apps/admin-shadcn/server.js"]
