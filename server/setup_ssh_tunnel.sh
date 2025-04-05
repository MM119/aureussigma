#!/bin/bash

# SSH Authentication Server Tunnel Script
# This script sets up an SSH tunnel to make your authentication server accessible
# It uses your existing SSH configuration to create port forwards

# Configuration
LOCAL_PORT=8443                        # Local port on your machine to forward to
REMOTE_PORT=3000                       # Port that the auth server is running on remotely
REMOTE_HOST="saphira.tail7bda3a.ts.net" # Tailscale hostname (preferred) or IP
SSH_PORT=2345                          # SSH port on the remote server
CHECK_INTERVAL=60                      # Seconds between connection checks
LOG_FILE="$HOME/scripts/ssh_tunnel.log" # Log file location

# Ensure log directory exists
mkdir -p "$(dirname "$LOG_FILE")"

# Function to check if tunnel is active
check_tunnel() {
  # Check if process exists and port is listening
  if pgrep -f "ssh.*-L $LOCAL_PORT:localhost:$REMOTE_PORT" > /dev/null && \
     netstat -an | grep "LISTEN" | grep ".$LOCAL_PORT " > /dev/null; then
    return 0  # Tunnel is active
  else
    return 1  # Tunnel is not active
  fi
}

# Function to start the tunnel
start_tunnel() {
  echo "$(date): Starting SSH tunnel from localhost:$LOCAL_PORT to $REMOTE_HOST:$REMOTE_PORT" >> "$LOG_FILE"
  
  # Using SSH to create the tunnel in the background
  ssh -N -L "$LOCAL_PORT:localhost:$REMOTE_PORT" -p "$SSH_PORT" "raymond@$REMOTE_HOST" &
  
  # Store the PID
  TUNNEL_PID=$!
  echo "$TUNNEL_PID" > "$HOME/scripts/ssh_tunnel.pid"
  
  echo "$(date): Tunnel started with PID $TUNNEL_PID" >> "$LOG_FILE"
  
  # Wait for tunnel to become active
  for i in {1..10}; do
    if check_tunnel; then
      echo "$(date): Tunnel is now active" >> "$LOG_FILE"
      return 0
    fi
    echo "$(date): Waiting for tunnel to activate..." >> "$LOG_FILE"
    sleep 2
  done
  
  echo "$(date): Tunnel failed to activate within timeout" >> "$LOG_FILE"
  return 1
}

# Function to stop the tunnel
stop_tunnel() {
  if [ -f "$HOME/scripts/ssh_tunnel.pid" ]; then
    TUNNEL_PID=$(cat "$HOME/scripts/ssh_tunnel.pid")
    echo "$(date): Stopping tunnel with PID $TUNNEL_PID" >> "$LOG_FILE"
    kill $TUNNEL_PID 2>/dev/null || true
    rm "$HOME/scripts/ssh_tunnel.pid"
  else
    echo "$(date): No tunnel PID file found" >> "$LOG_FILE"
    # Kill any hanging tunnels
    pkill -f "ssh.*-L $LOCAL_PORT:localhost:$REMOTE_PORT" 2>/dev/null || true
  fi
}

# Handle script arguments
case "$1" in
  start)
    if check_tunnel; then
      echo "Tunnel is already running"
      exit 0
    fi
    start_tunnel
    ;;
  stop)
    stop_tunnel
    echo "Tunnel stopped"
    ;;
  restart)
    stop_tunnel
    sleep 2
    start_tunnel
    ;;
  status)
    if check_tunnel; then
      echo "Tunnel is active"
      echo "Forwarding localhost:$LOCAL_PORT to $REMOTE_HOST:$REMOTE_PORT"
      exit 0
    else
      echo "Tunnel is not active"
      exit 1
    fi
    ;;
  *)
    echo "Usage: $0 {start|stop|restart|status}"
    exit 1
    ;;
esac

exit 0
