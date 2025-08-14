#!/bin/bash

# Cloudflare Tunnel Setup Script for aureussigma API
# This script sets up a Cloudflare Tunnel to route traffic to your Tailscale network

set -e

echo "🚀 Setting up Cloudflare Tunnel for aureussigma API..."

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   echo "❌ This script should not be run as root. Please run as a regular user."
   exit 1
fi

# Check if cloudflared is already installed
if command -v cloudflared &> /dev/null; then
    echo "✅ cloudflared is already installed"
else
    echo "📥 Installing cloudflared..."
    curl -L --output cloudflared.deb https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
    sudo dpkg -i cloudflared.deb
    rm cloudflared.deb
    echo "✅ cloudflared installed successfully"
fi

# Check if already authenticated
if [ -f "$HOME/.cloudflared/cert.pem" ]; then
    echo "✅ Already authenticated with Cloudflare"
else
    echo "🔐 Authenticating with Cloudflare..."
    echo "This will open a browser window. Please complete the authentication."
    cloudflared tunnel login
    echo "✅ Authentication completed"
fi

# Create tunnel
echo "🕳️ Creating Cloudflare tunnel..."
TUNNEL_NAME="aureussigma-api"
TUNNEL_INFO=$(cloudflared tunnel create $TUNNEL_NAME)
TUNNEL_ID=$(echo "$TUNNEL_INFO" | grep "Created tunnel" | awk '{print $3}')

if [ -z "$TUNNEL_ID" ]; then
    echo "❌ Failed to create tunnel"
    exit 1
fi

echo "✅ Tunnel created with ID: $TUNNEL_ID"

# Create config directory
mkdir -p "$HOME/.cloudflared"

# Create config file
echo "📝 Creating tunnel configuration..."
cat > "$HOME/.cloudflared/config.yml" << EOF
tunnel: $TUNNEL_ID
credentials-file: $HOME/.cloudflared/$TUNNEL_ID.json

ingress:
  - hostname: api.aureussigmacapital.com
    service: http://saphira.tail7bda3a.ts.net:3000
    originRequest:
      noTLSVerify: true
  - service: http_status:404
EOF

echo "✅ Configuration file created at $HOME/.cloudflared/config.yml"

# Display next steps
echo ""
echo "🎯 Next Steps:"
echo "1. Add DNS record in Cloudflare dashboard:"
echo "   - Go to: https://dash.cloudflare.com"
echo "   - Select your domain: aureussigmacapital.com"
echo "   - Go to DNS → Records"
echo "   - Add CNAME record:"
echo "     Name: api"
echo "     Target: $TUNNEL_ID.cfargotunnel.com"
echo "     Proxy status: Proxied (orange cloud)"
echo ""
echo "2. Add DNS record in GoDaddy:"
echo "   - Go to GoDaddy DNS management"
echo "   - Add A record:"
echo "     Name: api"
echo "     Value: 127.0.0.1"
echo "     TTL: 600"
echo ""
echo "3. Test the tunnel:"
echo "   cloudflared tunnel run $TUNNEL_NAME"
echo ""
echo "4. Install as service (optional):"
echo "   sudo cloudflared service install"
echo ""
echo "✅ Setup complete! Your tunnel ID is: $TUNNEL_ID"



