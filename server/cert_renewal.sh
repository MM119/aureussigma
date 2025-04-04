#!/bin/bash

# Certificate renewal script
echo "$(date): Attempting certificate renewal..." >> $HOME/scripts/cert_renewal.log
certbot renew --quiet

# Restart your authentication server to pick up new certificates if renewed
if [ $? -eq 0 ]; then
  echo "$(date): Certificate renewal successful, restarting server..." >> $HOME/scripts/cert_renewal.log
  
  # Find the authentication server process and restart it
  # Adjust the command to match how you start your server
  pm2 restart aureussigma-auth 2>/dev/null || echo "$(date): Server restart failed" >> $HOME/scripts/cert_renewal.log
  
  echo "$(date): Renewal process completed" >> $HOME/scripts/cert_renewal.log
else
  echo "$(date): No certificates renewed" >> $HOME/scripts/cert_renewal.log
fi
