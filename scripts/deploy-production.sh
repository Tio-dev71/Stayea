#!/usr/bin/env bash
# ==============================================================================
# STAYEA Production Zero-Downtime Deployment Runner
# Target VPS: 157.66.100.35 | Ubuntu 24.04 LTS
# ==============================================================================

set -euo pipefail

DEPLOY_DIR="${DEPLOY_DIR:-/var/www/stayea}"
HEALTH_CHECK_URL="${HEALTH_CHECK_URL:-http://127.0.0.1:3000/api/stayea/ai/health}"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*"
}

log "🚀 Starting STAYEA Production Automated Deployment (${TIMESTAMP})..."

# 1. Directory Sanity Check
if [ ! -d "${DEPLOY_DIR}" ]; then
  log "ERROR: Deployment directory ${DEPLOY_DIR} not found!"
  exit 1
fi

cd "${DEPLOY_DIR}"

# 2. Environment Configuration Check
if [ ! -f .env ]; then
  log "ERROR: .env file is missing in ${DEPLOY_DIR}! Cannot proceed with deployment."
  exit 1
fi

# 3. Pull Latest Code
log "📥 Pulling latest release from main branch..."
git fetch origin main
git checkout main
git pull origin main

# 4. Install Dependencies
log "📦 Installing monorepo dependencies with frozen lockfile..."
pnpm install --frozen-lockfile

# 5. Database Schema Synchronization
log "🗄️ Synchronizing PostgreSQL schema migrations..."
pnpm --filter @workspace/database run db:push

# 6. Production Monorepo Build
log "⚙️ Building all packages and apps (NestJS API + Next.js)..."
pnpm build

# 7. Zero-Downtime Rolling Reload via PM2
log "🔄 Executing zero-downtime rolling reload in PM2..."
if command -v pm2 >/dev/null 2>&1; then
  pm2 reload ecosystem.config.cjs --update-env
  pm2 save
else
  log "WARN: PM2 command not found in PATH. Skipping PM2 reload."
fi

# 8. Post-Deployment Automated Smoke Health Check
log "🩺 Executing automated health check probe against API..."
MAX_RETRIES=10
RETRY_COUNT=0
HEALTHY=false

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
  HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "${HEALTH_CHECK_URL}" || echo "000")
  if [ "$HTTP_STATUS" = "200" ]; then
    HEALTHY=true
    break
  fi
  log "  Waiting for API cluster to accept connections (Attempt $((RETRY_COUNT+1))/$MAX_RETRIES, HTTP: $HTTP_STATUS)..."
  sleep 3
  RETRY_COUNT=$((RETRY_COUNT+1))
done

if [ "$HEALTHY" = true ]; then
  log "✅ SUCCESS: All services are healthy and serving production traffic!"
  log "🌐 Customer Web:  https://stayea.com"
  log "🏢 Partner Hub:   https://hub.stayea.com"
  log "🛡️ Admin Console: https://admin.stayea.com"
  log "⚡ Platform API:  https://api.stayea.com"
  exit 0
else
  log "❌ CRITICAL: Health check failed after $MAX_RETRIES attempts! Inspect 'pm2 logs stayea-api' immediately."
  exit 2
fi

