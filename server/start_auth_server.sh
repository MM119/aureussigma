#!/bin/bash

# Authentication Server Startup Script
LOG_FILE="$HOME/scripts/auth_server.log"

echo "$(date): Starting authentication server..." >> $LOG_FILE

# Check if we're running as root
if [ "$(id -u)" != "0" ]; then
    echo "$(date): Not running as root, checking for authbind..." >> $LOG_FILE
    
    # Check if authbind is installed
    if ! command -v authbind &> /dev/null; then
        echo "$(date): authbind not installed. Please install it with:" >> $LOG_FILE
        echo "sudo apt-get install authbind" >> $LOG_FILE
        echo "sudo touch /etc/authbind/byport/443" >> $LOG_FILE
        echo "sudo chmod 500 /etc/authbind/byport/443" >> $LOG_FILE
        echo "sudo chown $USER /etc/authbind/byport/443" >> $LOG_FILE
        echo "$(date): Alternatively, run this script with sudo" >> $LOG_FILE
        exit 1
    fi
    
    # Use authbind to start server
    cd $HOME/aureussigma-auth  # Change to your server directory
    echo "$(date): Starting with authbind..." >> $LOG_FILE
    authbind --deep node server.js >> $LOG_FILE 2>&1 &
    echo $! > $HOME/scripts/auth_server.pid
else
    # Start directly with root privileges
    cd $HOME/aureussigma-auth  # Change to your server directory
    echo "$(date): Starting with root privileges..." >> $LOG_FILE
    node server.js >> $LOG_FILE 2>&1 &
    echo $! > $HOME/scripts/auth_server.pid
fi

echo "$(date): Authentication server started. PID: $(cat $HOME/scripts/auth_server.pid)" >> $LOG_FILE
echo "To stop the server, run: kill $(cat $HOME/scripts/auth_server.pid)"
