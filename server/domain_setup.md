# Setting Up aureussigmacapital.com with Your Linux Server

This guide will walk you through the process of configuring your domain to point to your Linux server (lvd_server) and setting up secure HTTPS connections for your authentication system.

## 1. DNS Configuration

1. Log in to your domain registrar or DNS provider for `aureussigmacapital.com`
2. Add the following DNS records:

   | Type  | Name | Value              | TTL    |
   |-------|------|-------------------|--------|
   | A     | api  | 123.20.200.222    | 3600   |
   
   You're using the remote server IP (123.20.200.222) as that's your public-facing IP.

## 2. Port Forwarding

Since you already have port forwarding configured for SSH (external port 22 to internal 192.168.1.4:22), you'll need to add another port forwarding rule for the API:

1. Log in to your router's admin interface
2. Add a new port forwarding rule:
   - External port: 3000 (or 443 if you want to use standard HTTPS)
   - Internal IP: 192.168.1.4 (your lvd_server)
   - Internal port: 3000

## 3. SSL Certificate Setup

For a professional setup, you'll want to use HTTPS. Let's Encrypt provides free SSL certificates:

```bash
# SSH into your server
ssh -p 22 user@123.20.200.222

# Install certbot
sudo apt update
sudo apt install certbot

# Obtain a certificate for your domain
sudo certbot certonly --standalone -d api.aureussigmacapital.com

# You'll get certificate files at:
# /etc/letsencrypt/live/api.aureussigmacapital.com/fullchain.pem
# /etc/letsencrypt/live/api.aureussigmacapital.com/privkey.pem
```

## 4. Update Server Code for HTTPS

Modify your server.js file to use HTTPS with your SSL certificate:

```javascript
const express = require('express');
const https = require('https');
const fs = require('fs');
const cors = require('cors');
// ... other imports

// SSL/TLS options
const httpsOptions = {
  cert: fs.readFileSync('/etc/letsencrypt/live/api.aureussigmacapital.com/fullchain.pem'),
  key: fs.readFileSync('/etc/letsencrypt/live/api.aureussigmacapital.com/privkey.pem')
};

// Update CORS settings to allow your domain
app.use(cors({
  origin: ['https://aureussigmacapital.com', 'https://www.aureussigmacapital.com'],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ... rest of your server code

// Start HTTPS server instead of HTTP
https.createServer(httpsOptions, app).listen(3000, '0.0.0.0', () => {
  console.log('HTTPS Server running on port 3000');
});
```

## 5. Deploy to Your Linux Server

1. Transfer the updated server files to your Linux server:

```bash
# From your local machine
scp -r /Users/raymond/aureussigma/server user@123.20.200.222:/home/user/aureussigma-auth
```

2. SSH into your server and start the authentication service:

```bash
ssh user@123.20.200.222
cd /home/user/aureussigma-auth
npm install
node server.js
```

3. For production use, you'll want to use a process manager like PM2:

```bash
npm install -g pm2
pm2 start server.js --name "aureussigma-auth"
pm2 startup
pm2 save
```

## 6. Database Considerations

Your authentication system is currently using SQLite, which is stored on the server. For production use, you might want to consider:

1. **Regular Backups**: Set up automated backups of your SQLite database
2. **Migration to a More Robust Database**: Consider PostgreSQL or MySQL for higher traffic

For basic backup:
```bash
# On your Linux server
mkdir -p /home/user/backups
cp /home/user/aureussigma-auth/users.db /home/user/backups/users_$(date +%Y%m%d).db
```

For automated backup, add to crontab:
```
0 0 * * * cp /home/user/aureussigma-auth/users.db /home/user/backups/users_$(date +%Y%m%d).db
```

## 7. Testing Your Setup

1. After DNS propagation (can take up to 24 hours), test your API endpoint:
```
curl https://api.aureussigmacapital.com/api/health
```

2. You should receive a response like:
```json
{"status":"ok","timestamp":"2025-04-03T14:51:04.000Z"}
```

## 8. Going Live

1. Host your HTML files (index.html, login.html, dashboard.html) on a web hosting service
2. Or set up a web server on your Linux machine to serve these files as well

## Security Considerations

1. Keep your server updated with security patches
2. Use a firewall to limit access to necessary ports only
3. Set up monitoring for unauthorized access attempts
4. Regularly rotate your JWT secret key
