# Setting Up Duck DNS for aureussigmacapital.com

This guide will help you set up Duck DNS as your Dynamic DNS solution to ensure your domain always points to your server, even when your public IP changes.

## 1. Sign up for Duck DNS

1. Go to [Duck DNS](https://www.duckdns.org/) and sign in using your preferred method (GitHub, Google, Twitter, etc.)
2. Once logged in, you'll see a dashboard where you can create subdomains

## 2. Create a Duck DNS Subdomain

1. Enter your desired subdomain name (e.g., `aureussigma`)
2. Click "Add domain"
3. You'll get a hostname like `aureussigma.duckdns.org`
4. Note the token shown on your account page - you'll need this for updates

## 3. Set Up Duck DNS Client on Your Linux Server

SSH into your server (lvd_server at 192.168.1.4):

```bash
ssh -p 22 user@123.20.200.222
```

Create a dedicated directory for the Duck DNS updater script:
```bash
mkdir -p ~/duckdns
cd ~/duckdns
```

Create the update script:

```bash
nano duck.sh
```

Add the following content (replace YOUR_TOKEN and YOUR_DOMAIN with your actual values):

```bash
#!/bin/bash

echo url="https://www.duckdns.org/update?domains=aureussigma&token=YOUR_TOKEN&ip=" | curl -k -o ~/duckdns/duck.log -K -
```

Make the script executable:

```bash
chmod 700 duck.sh
```

Test the script:

```bash
./duck.sh
```

Check the log file to ensure it worked:

```bash
cat duck.log
```

You should see "OK" as the response if successful.

Set up automatic updates with cron:

```bash
crontab -e
```

Add this line to update every 5 minutes:

```
*/5 * * * * ~/duckdns/duck.sh >/dev/null 2>&1
```

## 4. Update Your Domain's DNS Records

Go to your domain registrar for aureussigmacapital.com and create a CNAME record:

| Type  | Name | Value                  | TTL    |
|-------|------|------------------------|--------|
| CNAME | api  | aureussigma.duckdns.org| 1800   |

Use a shorter TTL (like 1800 seconds = 30 minutes) to reduce propagation delays when IP changes.

## 5. Update Your Login and Dashboard Pages

Update your client code to only use your domain (and not fallback to Tailscale):

```javascript
// In login.html and dashboard.html
const authServerConfig = {
  serverUrls: [
    'https://api.aureussigmacapital.com/api/login'
  ],
  // other config options...
};
```

## 6. Set Up SSL with Let's Encrypt

Since your IP might change, you'll want to use a certificate that supports this:

```bash
# Install certbot
sudo apt-get install certbot

# Get a wildcard certificate (requires DNS verification)
sudo certbot certonly --manual --preferred-challenges dns -d *.aureussigmacapital.com -d aureussigmacapital.com
```

## 7. Testing Your DDNS Setup

1. Check that your Duck DNS hostname resolves to your current IP:
   ```bash
   nslookup aureussigma.duckdns.org
   ```

2. Verify your domain points to the Duck DNS hostname:
   ```bash
   nslookup api.aureussigmacapital.com
   ```

## 8. Handling Server Restarts

Set up your Node.js server to start automatically after reboots:

```bash
# Using PM2
npm install -g pm2
pm2 start server.js --name "aureussigma-auth"
pm2 startup
pm2 save
```

## 9. IP Change Testing

You can test the DDNS update process by:
1. Rebooting your router (safely, when no users are active)
2. Checking if the DDNS client updates the IP
3. Verifying your site still works after the IP change

With this setup, your authentication system will remain accessible even if your public IP changes.
