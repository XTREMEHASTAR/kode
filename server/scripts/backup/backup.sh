#!/bin/sh
# ──────────────────────────────────────────────
# Kontagi — PostgreSQL Backup Script
#
# Usage:
#   ./scripts/backup/backup.sh
#
# Runs pg_dump inside the Docker container.
# Stores timestamped backups in ./backups/
# Rotates old backups after 7 days.
# ──────────────────────────────────────────────

set -euo pipefail

BACKUP_DIR="$(cd "$(dirname "$0")" && pwd)"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/kontagi_${TIMESTAMP}.sql.gz"
RETENTION_DAYS="${BACKUP_RETENTION_DAYS:-7}"

echo "[backup] Starting PostgreSQL backup..."

# Dump from Docker container
docker compose exec -T postgres pg_dump \
  -U kontagi \
  -d kontagi \
  --format=custom \
  --compress=6 \
  --no-owner \
  --no-privileges \
  > "${BACKUP_FILE}"

BACKUP_SIZE=$(ls -lh "${BACKUP_FILE}" | awk '{print $5}')
echo "[backup] Created: ${BACKUP_FILE} (${BACKUP_SIZE})"

# Rotate old backups
DELETED=$(find "${BACKUP_DIR}" -name "kontagi_*.sql.gz" -mtime +${RETENTION_DAYS} -delete -print | wc -l)
if [ "${DELETED}" -gt 0 ]; then
  echo "[backup] Rotated ${DELETED} backups older than ${RETENTION_DAYS} days"
fi

echo "[backup] Done."
