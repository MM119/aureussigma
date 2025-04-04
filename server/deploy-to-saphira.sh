#!/bin/bash
# Script to deploy the Aureus Sigma authentication server to Tailscale server (saphira)

echo "Deploying Aureus Sigma authentication server to saphira..."

# Variables - adjust these as needed
SSH_USER="$(whoami)"
SSH_PORT=2345
REMOTE_DIR="/home/$SSH_USER/aureussigma-auth"

# Create a deployment package excluding node_modules and other unnecessary files
echo "Creating deployment package..."
rm -f deploy.tar.gz
tar --exclude="node_modules" --exclude=".git" --exclude="users.db" -czf deploy.tar.gz .

# Ensure the deployment directory exists on saphira
echo "Setting up remote directory on saphira..."
ssh -p $SSH_PORT $SSH_USER@saphira "mkdir -p $REMOTE_DIR"

# Copy the deployment package to saphira
echo "Copying files to saphira..."
scp -P $SSH_PORT deploy.tar.gz $SSH_USER@saphira:$REMOTE_DIR/

# Extract files and install dependencies on saphira
echo "Extracting files and installing dependencies on saphira..."
ssh -p $SSH_PORT $SSH_USER@saphira "cd $REMOTE_DIR && tar -xzf deploy.tar.gz && npm install"

# Start the server on saphira using Node.js directly
echo "Starting the authentication server on saphira..."
ssh -p $SSH_PORT $SSH_USER@saphira "cd $REMOTE_DIR && nohup node server.js > server.log 2>&1 &"

# Clean up local deployment package
echo "Cleaning up..."
rm -f deploy.tar.gz

echo "Deployment completed successfully!"
echo "The authentication server should now be running on http://saphira:3000"
echo ""
echo "To check the server logs, run: ssh -p $SSH_PORT $SSH_USER@saphira 'cat $REMOTE_DIR/server.log'"
echo "To stop the server, run: ssh -p $SSH_PORT $SSH_USER@saphira 'pkill -f \'node server.js\''"
