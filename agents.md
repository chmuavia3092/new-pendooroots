# PENDOOROOTS / LEMOO WASHER — AGENTS.md

## Agent Instructions for OpenCode

This file provides guidance to AI agents working on the PENDOOROOTS codebase.

---

## Project Overview

**PENDOOROOTS** — Premium botanical household care brand
**Primary Product**: LEMOO Washer (natural dish wash)
**Aesthetic**: Cinematic + Classic + Premium + Natural + Editorial + Modern

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Astro 4.x (Static Site Generation) |
| **Language** | TypeScript (strict mode) |
| **Styling** | CSS Variables (design tokens) + Tailwind CSS 4.0 (utilities only) |
| **Animation** | GSAP 3.12.5 + ScrollTrigger |
| **3D/WebGL** | OGL (via ESM) — Specular buttons, grainient backgrounds |
| **State** | Custom typed store with localStorage persistence |
| **Validation** | Zod |
| **Images** | Astro Assets + Sharp (optimized WebP/AVIF) |
| **Fonts** | Self-hosted Manrope + Playfair Display (woff2, subset) |
| **Icons** | Lucide (tree-shakable) + Font Awesome (legacy) |
| **Deployment** | Vercel (static) |
| **Package Manager** | npm |

---

## Architecture Principles

1. **Islands Architecture** — Zero-JS by default, hydrate only interactive components
2. **Type Safety** — Strict TypeScript, no `any`, Zod for runtime validation
3. **Design Tokens** — Single source of truth in `src/styles/tokens.css`
4. **Component-First** — Reusable, composable components in `src/components/`
5. **Performance Budget** — LCP < 2.5s, CLS < 0.1, INP < 200ms
6. **Accessibility First** — Semantic HTML, ARIA, keyboard nav, color contrast
7. **Reduced Motion** — Respect `prefers-reduced-motion` globally

---

## Directory Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Primitive components (Button, Card, Input, etc.)
│   ├── hero/            # Hero-specific components
│   ├── product/         # Product card, gallery, detail
│   ├── layout/          # Header, Footer, Navigation
│   └── animations/      # Reveal, Parallax, Counter, etc.
├── layouts/             # Page layouts (BaseLayout, EditorLayout)
├── pages/               # Astro pages (routes)
│   ├── shop/            # Shop listing + [slug] detail
│   └── api/             # API routes (if needed)
├── styles/              # Global styles + tokens
│   ├── tokens.css       # Design tokens (CSS variables)
│   ├── global.css       # Reset, base, utilities
│   └── components.css   # Component-specific styles
├── data/                # Typed data + content
│   ├── products.ts      # Product catalog
│   ├── collections.ts   # Collections
│   └── content.ts       # Hero copy, testimonials, features
├── store/               # State management
│   ├── index.ts         # Store factory
│   ├── cart.ts          # Cart logic
│   ├── wishlist.ts      # Wishlist logic
│   └── theme.ts         # Theme logic
├── utils/               # Helpers
│   ├── formatting.ts    # Currency, dates
│   ├── animation.ts     # GSAP helpers
│   └── dom.ts           # DOM utilities
└── scripts/             # Client-side entry points
    └── main.ts          # Hydration entry
```

---

## Component Conventions

### Astro Components (`.astro`)
- Server-rendered by default
- Use `client:load`, `client:visible`, `client:idle` for hydration
- Props typed with TypeScript interface
- Slot-based composition preferred

### Client Components (`.tsx` / `.ts`)
- Only for interactive islands
- Use `defineComponent` pattern or vanilla TS classes
- Minimize bundle size — no React/Preact unless necessary

### Styling
- **Always use CSS variables** from `tokens.css`
- **Tailwind only for utilities**: spacing, flex/grid, responsive visibility
- **No arbitrary values** in Tailwind — use tokens
- **Component styles** in `styles/components.css` or scoped `<style>`

### Animation
- **GSAP** for scroll-triggered, complex sequences
- **CSS** for hover, focus, simple transitions
- **OGL/WebGL** only for: SpecularButton, Hero Grainient
- **Always check** `prefers-reduced-motion` before animating

---

## Data Conventions

### Products
```typescript
interface Product {
  id: number;
  slug: string;
  name: string;
  variant: string;
  category: string;
  collection: 'kitchen' | 'rose' | 'aloe' | 'premium';
  price: number;        // in PKR (paisa stored as integer)
  oldPrice?: number;
  rating: number;       // 0-5, one decimal
  reviews: number;
  stock: number;
  badge?: string;
  image: string;        // local optimized path
  images: string[];
  description: string;
  ingredients: string[];
  benefits: string[];
  howToUse: string;
  sizes: string[];
  relatedIds: number[];
}
```

### Collections
```typescript
interface Collection {
  key: 'kitchen' | 'rose' | 'aloe' | 'premium';
  name: string;
  description: string;
  icon: string;         // Lucide icon name
  color: string;        // CSS variable reference
}
```

---

## Animation Patterns

### Reveal (IntersectionObserver)
```typescript
// Use for: section entrances, card stagger
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
```

### ScrollTrigger (GSAP)
```typescript
// Use for: parallax, progress-based animations
gsap.to(element, {
  scrollTrigger: {
    trigger: '.section',
    start: 'top bottom',
    end: 'bottom top',
    scrub: 1
  },
  y: -100,
  rotate: 5
});
```

### Reduced Motion Guard
```typescript
const prefersReducedMotion = () => 
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion()) {
  // Run animation
}
```

---

## E-commerce Rules

1. **Cart persists** to localStorage (`pr_cart`)
2. **Wishlist persists** to localStorage (`pr_wishlist`)
3. **Currency**: PKR (Rs.), stored as integer paisa, formatted with `formatRs()`
4. **Shipping**: Free over Rs.1000, else Rs.100
5. **Checkout**: Mock only — no real payment integration
6. **Validation**: Zod schemas for all forms

---

## SEO Requirements

Every page must have:
- Unique `<title>` (max 60 chars)
- `<meta name="description">` (max 160 chars)
- Open Graph tags (`og:title`, `og:description`, `og:image`, `og:url`)
- Twitter Card tags
- JSON-LD structured data (Product, Organization, WebSite)
- Canonical URL
- Semantic heading hierarchy (h1 → h2 → h3)

---

## Performance Rules

1. **Images**: Always use `<Image />` from `astro:assets` with `loading="lazy"` (except hero)
2. **Fonts**: Preload critical, subset, woff2 only
3. **Scripts**: Defer non-critical, inline critical CSS
4. **WebGL**: Pause when not in viewport (IntersectionObserver)
5. **Bundle**: Code-split GSAP and OGL into separate chunks

---

## Accessibility Checklist

- [ ] Skip link at top of page
- [ ] Semantic HTML5 landmarks (header, nav, main, aside, footer)
- [ ] Heading hierarchy (no skipped levels)
- [ ] Color contrast AA (4.5:1 text, 3:1 large text)
- [ ] Focus visible on all interactive elements
- [ ] ARIA labels on icon-only buttons
- [ ] Live regions for cart/wishlist updates
- [ ] Keyboard trap in modals/drawers
- [ ] Alt text on all images (descriptive, not decorative)

---

## Git Workflow

- **Main branch**: `main` (protected)
- **Feature branches**: `feat/<description>`
- **Fix branches**: `fix/<description>`
- **Commits**: Conventional Commits (`feat:`, `fix:`, `refactor:`, `chore:`)
- **PR required** for all changes to main

---

## Commands Reference

```bash
# Development
npm run dev          # Start dev server (port 4321)
npm run build        # Production build
npm run preview      # Preview production build

# Quality
npm run lint         # ESLint
npm run format       # Prettier
npm run typecheck    # TypeScript check

# All checks (run before commit)
npm run lint && npm run format && npm run typecheck && npm run build
```

---

## Key Files to Know

| File | Purpose |
|------|---------|
| `src/styles/tokens.css` | All design tokens (colors, spacing, typography, motion) |
| `src/data/products.ts` | Product catalog (source of truth) |
| `src/store/cart.ts` | Cart logic |
| `src/components/hero/Hero.astro` | Homepage hero |
| `src/layouts/BaseLayout.astro` | Base HTML layout |
| `astro.config.mjs` | Astro configuration |
| `vite.config.ts` | Vite configuration |

---

## Deployment Workflow

**After every change**, commit, push to **BOTH** remotes, and deploy to **BOTH** Vercel projects:

```bash
git add -A && git commit -m "feat: <description>"
git push origin master        # → pendooroots-site repo
git push new-origin master    # → new-pendooroots repo

vercel link --project pendooroots-site --yes && vercel --yes --prod   # → https://pendooroots-site.vercel.app
vercel link --project new-pendooroots --yes && vercel --yes --prod    # → https://new-pendooroots.vercel.app
```

- Remotes: `origin` → `https://github.com/chmuavia3092/pendooroots-site.git`, `new-origin` → `https://github.com/chmuavia3092/new-pendooroots.git`
- Branch: `master`
- **Both live sites must always be redeployed together**: https://pendooroots-site.vercel.app AND https://new-pendooroots.vercel.app
- Never commit `node_modules/`, `dist/`, `.astro/`, or browser profile data

---

## DO NOT

- ❌ Add dependencies without checking bundle impact
- ❌ Use inline styles (use CSS variables)
- ❌ Hardcode colors, spacing, font sizes
- ❌ Break responsive layouts
- ❌ Ignore `prefers-reduced-motion`
- ❌ Commit directly to main
- ❌ Use `any` type in TypeScript
- ❌ Hotlink external images (self-host via `public/images/`)
- ❌ Expose editor/admin routes in production nav