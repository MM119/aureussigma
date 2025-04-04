#!/bin/bash

# Duck DNS updater script
# --IMPORTANT: Replace these values with your actual Duck DNS domain and token--
DOMAIN="REPLACE_WITH_YOUR_DOMAIN"  # Example: aureussigma
TOKEN="REPLACE_WITH_YOUR_TOKEN"    # Example: a1b2c3d4-e5f6-g7h8-i9j0

# Log file path
LOG_FILE="$HOME/scripts/duckdns_update.log"

# Update the IP with Duck DNS
echo "$(date): Updating Duck DNS IP..." >> $LOG_FILE
UPDATE_URL="https://www.duckdns.org/update?domains=$DOMAIN&token=$TOKEN&ip="
UPDATE_RESULT=$(curl -s "$UPDATE_URL")

# Log the result
echo "$(date): Result: $UPDATE_RESULT" >> $LOG_FILE

# Check if update was successful
if [ "$UPDATE_RESULT" = "OK" ]; then
    echo "$(date): Duck DNS successfully updated" >> $LOG_FILE
    exit 0
else
    echo "$(date): Duck DNS update failed" >> $LOG_FILE
    exit 1
fi
