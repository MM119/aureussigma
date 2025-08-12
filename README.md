# ASC Website Mockup (Vite + React)

This is a minimal Vite project to preview the Aureus Sigma Capital mockup locally.

## Quick start
```bash
# 1) Extract and enter folder
npm install
npm run dev
# open the printed localhost URL
```

## Logo
The logo is in `public/asc-logo.png`. In React, any file in `public/` is served at the root path.
The code references it as:
```js
const LOGO_SRC = "/asc-logo.png";
```

## Notes
- Tailwind is loaded via the Play CDN in `index.html` for fast preview (no config required). For production, set up Tailwind properly and remove the CDN.
- Dependencies: react, recharts, framer-motion, lucide-react.
