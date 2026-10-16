#!/usr/bin/env bash
# Run this ON or with network access to the OLD cPanel host (via SSH/phpMyAdmin export,
# or mysqldump if shell access is available). Produces one CSV per legacy table.
#
# Usage: ./01-export-mysql.sh <db_host> <db_user> <db_name> ./export
set -euo pipefail

DB_HOST="${1:?db host required}"
DB_USER="${2:?db user required}"
DB_NAME="${3:?db name required}"
OUT_DIR="${4:-./export}"

mkdir -p "$OUT_DIR"
read -rsp "MySQL password for $DB_USER: " DB_PASS
echo

for TABLE in users banner events gallery; do
  echo "Exporting $TABLE..."
  mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" \
    -e "SELECT * FROM $TABLE" --batch --raw \
    | sed 's/\t/,/g' > "$OUT_DIR/$TABLE.csv"
done

echo "Done. Review CSVs in $OUT_DIR, then run 02-import-to-postgres.ts."
echo "IMPORTANT: rotate the MySQL credentials after this export - see README security notes."
