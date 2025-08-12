# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
npm run dev          # Start Vite dev server at http://localhost:5173

# Build
npm run build        # Build for production to dist/
npm run preview      # Preview production build locally
```

## Architecture Overview

This is a single-page React application for Aureus Sigma Capital's website mockup, built with Vite. The entire application is intentionally contained in a single monolithic component (`src/App.jsx`, 724 lines) for rapid prototyping.

### Key Architectural Decisions

1. **Monolithic Component Design**: All functionality resides in `App.jsx` with no component extraction. This is intentional for quick mockup development but should be refactored for production.

2. **Complete Bilingual Implementation**: The app features comprehensive English/Vietnamese translations using a nested translation object structure at lines 7-195. Language switching is handled via React state.

3. **Static Data Architecture**: All mock data (performance metrics, team info, research articles) is embedded directly in the component. No API calls or external data fetching.

4. **Section-Based Navigation**: Uses smooth scroll navigation to anchor sections (#home, #about, #strategies, etc.) without React Router. Navigation handling at lines 197-207.

5. **Tailwind via CDN**: Tailwind CSS is loaded from CDN in `index.html` (not installed locally). Custom brand colors are defined but not in Tailwind config.

### Important Patterns

**Asset Handling**:
- Images are in `public/` and referenced directly (e.g., "/logo.svg")
- Missing assets show fallback UI (placeholder divs with text)

**Performance Data Structure** (lines 477-495):
```javascript
{
  name: "Jan",
  strategy1: value,
  strategy2: value,
  benchmark: value
}
```

**Form Handling**:
- Contact form at lines 691-722 uses browser alerts for submission feedback
- No backend integration - forms are display-only

**Responsive Grid Patterns**:
- Strategy cards: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- Team cards: `grid-cols-1 md:grid-cols-2 lg:grid-cols-4`

### Development Considerations

- **No TypeScript**: Plain JavaScript with JSX
- **No tests**: No testing framework configured
- **No linting**: ESLint not configured
- **No component library**: All UI built with Tailwind utilities
- **No state management**: Only React useState for language toggle

### Future Scaling

When converting to production:
1. Extract components from the monolithic App.jsx
2. Implement proper routing with React Router
3. Move translations to i18n library (react-i18next)
4. Extract data to API/CMS integration
5. Configure Tailwind locally with custom theme
6. Add TypeScript for type safety
7. Implement proper form handling with backend