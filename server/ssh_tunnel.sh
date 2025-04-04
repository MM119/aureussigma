#!/bin/bash

# SSH Reverse Tunnel script for Aureus Sigma authentication server
# This script creates a secure tunnel from your server to a publicly accessible server

# Log file
LOG_FILE="$HOME/scripts/ssh_tunnel.log"

# Target public SSH server details (could be a VPS or another server you control)
REMOTE_USER="your_username"
REMOTE_HOST="your_public_server.com"  # Replace with a server you have SSH access to
REMOTE_PORT=22                        # Remote SSH port
LOCAL_PORT=3000                       # Your authentication server port
REMOTE_FORWARD_PORT=3000              # Port on remote server to forward to

# SSH tunnel options
SSH_OPTIONS="-N -R $REMOTE_FORWARD_PORT:localhost:$LOCAL_PORT -o ServerAliveInterval=60 -o ExitOnForwardFailure=yes"

# Check if tunnel is already running
if pgrep -f "ssh.*$REMOTE_FORWARD_PORT:localhost:$LOCAL_PORT" > /dev/null; then
    echo "$(date): SSH tunnel already running" >> $LOG_FILE
    exit 0
fi

# Start the tunnel
echo "$(date): Starting SSH tunnel to $REMOTE_HOST..." >> $LOG_FILE
ssh $SSH_OPTIONS -p $REMOTE_PORT $REMOTE_USER@$REMOTE_HOST &

# Check if tunnel started successfully
if [ $? -eq 0 ]; then
    echo "$(date): SSH tunnel established successfully" >> $LOG_FILE
    
    # Store the PID for potential future use
    echo $! > $HOME/scripts/ssh_tunnel.pid
else
    echo "$(date): Failed to establish SSH tunnel" >> $LOG_FILE
    exit 1
fi
