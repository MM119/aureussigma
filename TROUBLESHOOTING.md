# Troubleshooting Guide

## Issue: Site Not Rendering (Blank Page)

### Root Cause
The Content-Security-Policy (CSP) configured in Cloudflare was blocking JavaScript execution.

### Why It Happened
1. **Vite's build output includes inline scripts** that detect browser module support
2. **SystemJS (legacy plugin)** requires `eval()` to dynamically load polyfills
3. **Strict CSP without `'unsafe-eval'`** blocks these essential operations

### The Problem
Original CSP was:
```
script-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com
```

This blocked:
- SystemJS dynamic imports (needs `'unsafe-eval'`)
- Vite's legacy browser detection logic

### The Solution
Updated CSP to:
```
script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.tailwindcss.com
```

### How to Apply the Fix in Cloudflare

1. **Log in to Cloudflare Dashboard**
2. Go to **Rules** → **Transform Rules** → **Modify Response Header**
3. Find your "Security Headers" rule
4. Edit **Header 6: Content-Security-Policy**
5. Update the value to:
   ```
   default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.tailwindcss.com; style-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com https://fonts.googleapis.com; img-src 'self' data: https:; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com; frame-ancestors 'self'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests
   ```
6. **Save** and **Deploy** the rule
7. Wait 2-3 minutes for propagation
8. Clear your browser cache (Ctrl+Shift+Delete)
9. Test the site

### Verification
After applying the fix:
1. Visit https://aureussigmacapital.com/
2. The site should render correctly
3. Open DevTools Console (F12) - no CSP errors should appear
4. Check Network tab - all JavaScript files should load successfully

### Security Implications

**Q: Is `'unsafe-eval'` safe?**
A: It reduces security but is necessary for:
- SystemJS to load polyfills dynamically
- Supporting older browsers that don't have ES module support
- Vite's legacy plugin to work correctly

**Alternatives if you want to avoid `'unsafe-eval'`:**
1. Remove the legacy plugin (only support modern browsers)
2. Use a different bundler (like webpack with specific configurations)
3. Serve static pre-rendered HTML (no client-side JavaScript)

### Testing CSP Configuration

To test if CSP is causing issues:
1. Open DevTools Console (F12)
2. Look for errors like:
   - `Refused to evaluate a string as JavaScript because 'unsafe-eval'...`
   - `Refused to execute inline script because it violates CSP...`
3. If you see these, the CSP needs adjustment

### Quick Disable (Temporary Testing Only)
To temporarily disable CSP in Cloudflare:
1. Go to **Rules** → **Transform Rules**
2. Find "Security Headers" rule
3. Toggle it **OFF**
4. Test if the site works
5. **Remember to re-enable it after testing!**

## Other Common Issues

### Site Loads Locally But Not on Production
**Possible causes:**
1. CSP blocking scripts (fixed above)
2. Cloudflare caching old files - Solution: Purge Cloudflare cache
3. DNS not propagated - Solution: Wait 24-48 hours after DNS changes
4. CNAME file missing from build - Solution: Ensure `public/CNAME` exists

### JavaScript Files Return 404
**Solution:**
- Check that GitHub Actions build completed successfully
- Verify files exist in the `dist` folder after build
- Check GitHub Pages settings: should deploy from GitHub Actions artifact

### Mixed Content Errors
**Solution:**
- Ensure all resources use HTTPS URLs
- Enable "Automatic HTTPS Rewrites" in Cloudflare
- Set Cloudflare SSL mode to "Full (strict)"

### Font Loading Issues
**Solution:**
- Check that CSP allows `fonts.googleapis.com` and `fonts.gstatic.com`
- Current CSP includes these in `font-src` and `connect-src`

## Need More Help?

1. Check browser DevTools Console (F12) for specific errors
2. Review Network tab to see which resources fail to load
3. Test CSP with https://csp-evaluator.withgoogle.com/
4. Review this documentation: `CLOUDFLARE_SECURITY_SETUP.md`
