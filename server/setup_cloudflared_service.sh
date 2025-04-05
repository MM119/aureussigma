#!/bin/bash

# Setup Cloudflare Tunnel Service
# Run this script with sudo on your server

# Create system-wide cloudflared directory if it doesn't exist
mkdir -p /etc/cloudflared

# Copy configuration and credentials
cp ~/.cloudflared/config.yml /etc/cloudflared/
cp ~/.cloudflared/dbfa6587-ddd8-4182-aa78-36dfb2eb8f38.json /etc/cloudflared/

# Set correct permissions
chmod 644 /etc/cloudflared/config.yml
chmod 400 /etc/cloudflared/dbfa6587-ddd8-4182-aa78-36dfb2eb8f38.json

# Install the service
cloudflared service install

# Enable and start the service
systemctl enable cloudflared
systemctl start cloudflared

# Check service status
systemctl status cloudflared
