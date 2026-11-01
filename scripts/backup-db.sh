#!/usr/bin/env bash
# ==============================================================================
# STAYEA Production Database Automated Backup Script
# PostgreSQL Automated Dump, Gzip Compression, Rotation & Health Check
# ==============================================================================

set -euo pipefail

BACKUP_DIR="${BACKUP_DIR:-/var/backups/stayea-db}"
RETENTION_DAYS="${RETENTION_DAYS:-14}"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/stayea_db_${TIMESTAMP}.sql.gz"
LOG_FILE="${BACKUP_DIR}/backup.log"

mkdir -p "${BACKUP_DIR}"

log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" | tee -a "${LOG_FILE}"
}

log "INFO: Starting STAYEA database backup..."

if [ -z "${DATABASE_URL:-}" ]; then
  log "WARN: DATABASE_URL not set in environment. Checking .env file..."
  if [ -f .env ]; then
    export $(grep -v '^#' .env | grep -E '^DATABASE_URL=' | xargs)
  fi
fi

if [ -z "${DATABASE_URL:-}" ]; then
  log "ERROR: DATABASE_URL is not set. Aborting backup."
  exit 1
fi

# Run pg_dump piped through gzip with maximum compression
if pg_dump "${DATABASE_URL}" --no-owner --no-acl --clean --if-exists | gzip -9 > "${BACKUP_FILE}"; then
  FILE_SIZE=$(du -h "${BACKUP_FILE}" | cut -f1)
  log "SUCCESS: Backup completed successfully: ${BACKUP_FILE} (Size: ${FILE_SIZE})"
  
  # Verify archive integrity
  if gunzip -t "${BACKUP_FILE}"; then
    log "SUCCESS: Backup integrity check passed."
  else
    log "ERROR: Backup integrity check failed for ${BACKUP_FILE}!"
    exit 2
  fi
else
  log "ERROR: pg_dump command failed!"
  rm -f "${BACKUP_FILE}"
  exit 1
fi

# Prune old backups older than RETENTION_DAYS
log "INFO: Pruning backups older than ${RETENTION_DAYS} days..."
find "${BACKUP_DIR}" -type f -name "stayea_db_*.sql.gz" -mtime +"${RETENTION_DAYS}" -exec rm -f {} \;
log "INFO: Pruning complete. Current backup directory status:"
ls -lh "${BACKUP_DIR}"/*.sql.gz 2>/dev/null | tail -n 5 | while read line; do log "  ${line}"; done

log "INFO: Backup routine finished."
exit 0

