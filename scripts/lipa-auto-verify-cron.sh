#!/bin/bash

# Lipa Number Auto-Verification Cron Script
# This script checks email for payment notifications and auto-processes orders

# Load environment variables
export $(cat /path/to/onrampa/.env | xargs)

# API endpoint
API_URL="${NEXT_PUBLIC_APP_URL:-http://localhost:3000}"
ENDPOINT="$API_URL/api/admin/auto-verify-lipa"

# Log file
LOG_FILE="/var/log/onrampa-lipa-verify.log"

# Timestamp
echo "[$(date '+%Y-%m-%d %H:%M:%S')] Running Lipa auto-verification..." >> "$LOG_FILE"

# Make API call
RESPONSE=$(curl -s -X POST "$ENDPOINT" \
  -H "Authorization: Bearer $ADMIN_SECRET" \
  -H "Content-Type: application/json")

# Log response
echo "$RESPONSE" >> "$LOG_FILE"

# Parse and log summary
CHECKED=$(echo "$RESPONSE" | jq -r '.summary.total_checked // 0')
VERIFIED=$(echo "$RESPONSE" | jq -r '.summary.payments_verified // 0')
PROCESSED=$(echo "$RESPONSE" | jq -r '.summary.orders_processed // 0')
FAILED=$(echo "$RESPONSE" | jq -r '.summary.failures // 0')

echo "Summary: Checked=$CHECKED, Verified=$VERIFIED, Processed=$PROCESSED, Failed=$FAILED" >> "$LOG_FILE"
echo "---" >> "$LOG_FILE"

# Exit
exit 0
