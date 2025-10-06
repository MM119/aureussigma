# Cloudflare Security Headers Setup Guide

Since GitHub Pages doesn't support custom HTTP headers, you **must** configure these through **Cloudflare Transform Rules** (HTTP Response Header Modification).

## Step-by-Step Configuration

### 1. Access Cloudflare Dashboard
1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Select your domain: `aureussigmacapital.com`
3. Navigate to **Rules** → **Transform Rules** → **Modify Response Header**

### 2. Create Transform Rule

Click **"Create rule"** and use these settings:

**Rule Name:** `Security Headers`

**When incoming requests match:**
- Field: `Hostname`
- Operator: `equals`
- Value: `aureussigmacapital.com`

**Then:**

Add the following headers (click "Set dynamic" or "Set static" for each):

#### Header 1: Strict-Transport-Security
- **Action:** Set static
- **Header name:** `Strict-Transport-Security`
- **Value:** `max-age=31536000; includeSubDomains; preload`

#### Header 2: X-Frame-Options
- **Action:** Set static
- **Header name:** `X-Frame-Options`
- **Value:** `SAMEORIGIN`

#### Header 3: X-Content-Type-Options
- **Action:** Set static
- **Header name:** `X-Content-Type-Options`
- **Value:** `nosniff`

#### Header 4: Referrer-Policy
- **Action:** Set static
- **Header name:** `Referrer-Policy`
- **Value:** `strict-origin-when-cross-origin`

#### Header 5: Permissions-Policy
- **Action:** Set static
- **Header name:** `Permissions-Policy`
- **Value:** `geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()`

#### Header 6: Content-Security-Policy (FIXED - SUPPORTS VITE + LEGACY)
- **Action:** Set static
- **Header name:** `Content-Security-Policy`
- **Value:** `default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.tailwindcss.com; style-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com https://fonts.googleapis.com; img-src 'self' data: https:; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com; frame-ancestors 'self'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests`

**IMPORTANT:** 
- `'unsafe-inline'` is required for Vite's inline module detection script
- `'unsafe-eval'` is required for SystemJS (used by the legacy plugin for older browsers)
- Both are necessary for the site to work with the current build configuration

#### Header 7: Access-Control-Allow-Origin (Remove GitHub Pages CORS)
- **Action:** Set static
- **Header name:** `Access-Control-Allow-Origin`
- **Value:** `https://aureussigmacapital.com`

### 3. Enable SSL/TLS Settings

1. Go to **SSL/TLS** → **Overview**
2. Set encryption mode to: **Full (strict)**

3. Go to **SSL/TLS** → **Edge Certificates**
4. Enable these settings:
   - ✅ **Always Use HTTPS** (redirects HTTP to HTTPS)
   - ✅ **Automatic HTTPS Rewrites**
   - ✅ **Certificate Transparency Monitoring**
   - Set **Minimum TLS Version** to: `TLS 1.2`

### 4. Additional Security Settings (Optional but Recommended)

#### Enable Security Features
1. Go to **Security** → **Settings**
2. Enable:
   - ✅ **Security Level:** Medium or High
   - ✅ **Challenge Passage:** 30 minutes
   - ✅ **Browser Integrity Check**

#### Enable Bot Fight Mode
1. Go to **Security** → **Bots**
2. Enable **Bot Fight Mode** (free tier)

#### Enable Rate Limiting (if needed)
1. Go to **Security** → **WAF**
2. Configure rate limiting rules for your contact form endpoint

## Verification

After applying these changes:

1. **Wait 5 minutes** for Cloudflare to propagate changes
2. **Clear your browser cache** (Ctrl+Shift+Delete)
3. **Test your site** at: https://securityheaders.com/?q=https://aureussigmacapital.com/
4. You should now see an **A** or **A+** rating

## CSP Notes

The **working** Content-Security-Policy for Vite + Legacy Plugin:
- ⚠️ **`'unsafe-inline'` in `script-src`** - Required for Vite's inline module detection
- ⚠️ **`'unsafe-eval'` in `script-src`** - Required for SystemJS (legacy browser support)
- ✅ Allows Tailwind CSS from CDN (`https://cdn.tailwindcss.com`)
- ✅ Allows Google Fonts for typography
- ✅ Inline styles allowed (required for Tailwind - `style-src 'unsafe-inline'` is acceptable)
- ✅ Images from any HTTPS source
- ✅ Added `base-uri 'self'` and `form-action 'self'` for extra protection

**Security Note:** While `'unsafe-inline'` and `'unsafe-eval'` reduce security, they are currently necessary for:
1. Vite's module system to work properly
2. SystemJS to dynamically load polyfills for older browsers
3. Proper fallback behavior for browsers that don't support ES modules

If you want to remove these directives for better security, you would need to switch to a different build system or serve pre-built static HTML files without client-side JavaScript.

## CORS Policy Fix

GitHub Pages sets `Access-Control-Allow-Origin: *` by default, which is flagged as insecure.

**Solution:** Override it in Cloudflare Transform Rules (Header 7) to restrict to your domain only:
- `Access-Control-Allow-Origin: https://aureussigmacapital.com`

This is safe because your site doesn't need to be embedded cross-origin.

### If your site breaks after enabling CSP:

1. Open **Browser DevTools** (F12)
2. Check **Console** for CSP violation errors
3. Update the CSP value to whitelist the blocked resources
4. Example error: `Refused to load script from 'https://example.com/script.js'`
   - Solution: Add `https://example.com` to `script-src`

## Troubleshooting

### HSTS Issues
If you see "Your connection is not private" errors after enabling HSTS:
1. Clear HSTS settings in Chrome: `chrome://net-internals/#hsts`
2. Delete domain and try again
3. Ensure Cloudflare SSL is set to "Full (strict)"

### CSP Breaking Functionality
If parts of your site don't work:
1. Open DevTools Console (F12)
2. Look for CSP violation errors
3. Add the blocked sources to the appropriate CSP directive
4. Update the Cloudflare Transform Rule

### Headers Not Applying
1. Verify the Transform Rule is **enabled** in Cloudflare
2. Check that the hostname matches exactly: `aureussigmacapital.com`
3. Clear Cloudflare cache: **Caching** → **Configuration** → **Purge Everything**
4. Wait 5 minutes and test again

## Alternative: Cloudflare Workers (Advanced)

If Transform Rules don't work (unlikely), use a Cloudflare Worker:

```javascript
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const response = await fetch(request)
  const newResponse = new Response(response.body, response)

  // Add security headers
  newResponse.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')
  newResponse.headers.set('X-Frame-Options', 'SAMEORIGIN')
  newResponse.headers.set('X-Content-Type-Options', 'nosniff')
  newResponse.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  newResponse.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=(), payment=()')
  newResponse.headers.set('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.tailwindcss.com; style-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com https://fonts.googleapis.com; img-src 'self' data: https:; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com; frame-ancestors 'self'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests")

  return newResponse
}
```

Deploy this worker and route `aureussigmacapital.com/*` to it.

## Expected Results

After completing this setup, your security headers report should show:

- ✅ **Strict-Transport-Security**: PASS
- ✅ **Content-Security-Policy**: PASS
- ✅ **X-Frame-Options**: PASS
- ✅ **X-Content-Type-Options**: PASS
- ✅ **Referrer-Policy**: PASS
- ✅ **Permissions-Policy**: PASS

**Rating:** A or A+ (up from F)
