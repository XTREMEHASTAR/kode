#!/bin/sh
# ──────────────────────────────────────────────
# Kontagi — PostgreSQL Restore Script
#
# Usage:
#   ./scripts/backup/restore.sh backups/kontagi_20260726_120000.sql.gz
# ──────────────────────────────────────────────

set -euo pipefail

if [ $# -eq 0 ]; then
  echo "Usage: $0 <backup_file>"
  echo ""
  echo "Available backups:"
  ls -lh "$(dirname "$0")"/kontagi_*.sql.gz 2>/dev/null || echo "  (none found)"
  exit 1
fi

BACKUP_FILE="$1"

if [ ! -f "${BACKUP_FILE}" ]; then
  echo "[restore] Error: File not found: ${BACKUP_FILE}"
  exit 1
fi

echo "[restore] WARNING: This will overwrite the current database."
echo "[restore] File: ${BACKUP_FILE}"
echo ""
echo "Press Ctrl+C to cancel, or Enter to continue..."
read -r _

echo "[restore] Restoring from ${BACKUP_FILE}..."

docker compose exec -T postgres pg_restore \
  -U kontagi \
  -d kontagi \
  --clean \
  --if-exists \
  --no-owner \
  --no-privileges \
  < "${BACKUP_FILE}"

echo "[restore] Done. Database restored successfully."
