#!/bin/bash

# Duck DNS updater script with your actual Duck DNS information
DOMAIN="aureussigma"
TOKEN="64436288-5c55-4435-a3f8-72e5249bc350"

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
