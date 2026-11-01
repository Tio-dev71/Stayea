# STAYEA Production Operations & Disaster Recovery Runbook

**Version:** 1.0.0 (Production Hardened)  
**Target Environment:** VPS Ubuntu 24.04 LTS (Primary Host: `157.66.100.35`)  
**Architecture:** Monorepo (NestJS API on port 3000, Next.js Web/Hub/Admin on port 8080, PostgreSQL 16, Nginx Reverse Proxy, PM2 Cluster)

---

## 1. System Topology & Domains

| Subdomain | Target Upstream | Target Role |
| :--- | :--- | :--- |
| `stayea.com` / `www.stayea.com` | `127.0.0.1:8080` (Next.js Root) | Luxury B2C Guest Portal & Booking Checkout |
| `hub.stayea.com` | `127.0.0.1:8080/hub` (Next.js Hub) | Partner & Host Management Portal |
| `admin.stayea.com` | `127.0.0.1:8080/stayea` (Next.js Admin) | Internal Executive & Operations Control Plane |
| `api.stayea.com` | `127.0.0.1:3000` (NestJS Cluster) | Core Platform API & Webhook Processing |

---

## 2. Cold-Start Deployment Procedure (Fresh Host)

Follow these exact steps when provisioning a new server from bare metal or recovering from complete VM loss:

### Step 2.1: Base System Prerequisites
```bash
# Update and install OS packages
sudo apt-get update && sudo apt-get upgrade -y
sudo apt-get install -y curl git nginx postgresql-client certbot python3-certbot-nginx

# Install Node.js 22 LTS
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install pnpm & pm2 globally
sudo npm install -g pnpm@latest pm2@latest
```

### Step 2.2: Repository & Environment Setup
```bash
# Clone the repository
git clone https://github.com/oNo500/nestjs-boilerplate.git /var/www/stayea
cd /var/www/stayea

# Configure production environment
cp .env.example .env
nano .env # Verify DATABASE_URL, PAYMENT_WEBHOOK_SECRET, JWT_SECRET, AI keys
```

### Step 2.3: Database Schema Migration
```bash
# Install dependencies
pnpm install --frozen-lockfile

# Push database schema & indices
pnpm --filter @workspace/database run db:push
```

### Step 2.4: Build Monorepo Artifacts
```bash
# Build all packages & apps
pnpm build
```

### Step 2.5: Process Management (PM2)
```bash
# Start cluster mode
pm2 start ecosystem.config.cjs
pm2 save
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u $USER --hp $HOME
```

### Step 2.6: Nginx Reverse Proxy & SSL Configuration
```bash
# Install Nginx configuration
sudo cp docker/nginx/stayea-production.conf /etc/nginx/sites-available/stayea.conf
sudo ln -s /etc/nginx/sites-available/stayea.conf /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Obtain SSL Certificates via Let's Encrypt
sudo certbot --nginx -d stayea.com -d www.stayea.com -d hub.stayea.com -d admin.stayea.com -d api.stayea.com

# Test and reload Nginx
sudo nginx -t
sudo systemctl reload nginx
```

---

## 3. Zero-Downtime Rolling Update Workflow

For application releases without customer disruption:

```bash
cd /var/www/stayea

# 1. Fetch latest changes
git pull origin main

# 2. Re-install packages if lockfile changed
pnpm install --frozen-lockfile

# 3. Compile backend & frontend
pnpm build

# 4. Graceful rolling reload in PM2 (no dropped connections)
pm2 reload ecosystem.config.cjs --update-env

# 5. Verify process health
pm2 status
curl -fsS https://api.stayea.com/api/stayea/ai/health
```

---

## 4. Database Backup & Disaster Recovery Drill

### Step 4.1: Automated Cron Setup
Add the backup script to system crontab (`sudo crontab -e`):
```cron
# Runs every night at 02:00 AM UTC
0 2 * * * /var/www/stayea/scripts/backup-db.sh >> /var/log/stayea-backup-cron.log 2>&1
```

### Step 4.2: Full Database Restore Drill
In the event of catastrophic data corruption or accidental drop:

```bash
# 1. Stop write traffic by putting API in maintenance mode or stopping PM2
pm2 stop stayea-api

# 2. Identify the most recent healthy backup
BACKUP_FILE=$(ls -t /var/backups/stayea-db/stayea_db_*.sql.gz | head -n 1)
echo "Restoring from: ${BACKUP_FILE}"

# 3. Verify gzip archive integrity
gunzip -t "${BACKUP_FILE}"

# 4. Stream restore into PostgreSQL
gunzip -c "${BACKUP_FILE}" | psql "${DATABASE_URL}"

# 5. Re-run migration push to ensure consistency with latest code
cd /var/www/stayea
pnpm --filter @workspace/database run db:push

# 6. Restart PM2 API instances
pm2 restart stayea-api

# 7. Verify endpoints
curl -fsS https://api.stayea.com/api/stayea/public/services
```

---

## 5. Security Secrets Rotation Procedure

### 5.1: Payment Webhook Secret (`PAYMENT_WEBHOOK_SECRET`)
1. Generate new 64-character cryptographic token:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
2. Update the Webhook Secret in the VietQR / Banking gateway merchant dashboard.
3. Update `.env` on production host: `PAYMENT_WEBHOOK_SECRET="<new_key>"`.
4. Perform rolling reload:
   ```bash
   pm2 reload stayea-api --update-env
   ```
5. Trigger a simulated test webhook with the new key to verify HMAC verification passes.

### 5.2: JWT Secret Rotation
1. Update `JWT_SECRET` in `.env`.
2. Reload `stayea-api`. Note: Existing sessions will require re-login, which cleanly invalidates stale auth tokens.

---

## 6. Real-Time Observability & Health Checks

- **API Process Health:** `curl -fsS http://localhost:3000/api/stayea/ai/health`
- **PM2 Dashboard:** `pm2 monit`
- **Nginx Access & Error Logs:**
  - `tail -f /var/log/nginx/access.log`
  - `tail -f /var/log/nginx/error.log`
- **API Application Logs:**
  - `pm2 logs stayea-api --lines 100`
- **Web Frontend Logs:**
  - `pm2 logs stayea-web --lines 100`
- **Automated Expired Booking Release Cron:**
  - Check `pm2 logs stayea-api | grep "releaseExpiredBookings"` every minute to confirm auto-release routine runs without exceptions.

