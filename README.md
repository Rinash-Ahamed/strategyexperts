# Strategy Experts website

Next.js (App Router, TypeScript), plain CSS, no animation libraries.

    npm install
    npm run dev      # http://localhost:3000
    npm run typecheck
    npm test
    npm run build && npm start

## Project structure

- `app/` - App Router routes, metadata and route-level boundaries.
- `components/layout/` - shared site chrome used by the root layout.
- `components/home/` - homepage-only sections.
- `components/services/` - service-page composition.
- `components/contact/` - contact-page interactions.
- `components/shared/` - reusable presentational components.
- `components/effects/` - isolated client-side behavior.
- `lib/` - typed site configuration and content.

## Configuration (.env.local - see .env.example)
- NEXT_PUBLIC_WHATSAPP_NUMBER: optionally enable WhatsApp enquiries using an international-format number. NEXT_PUBLIC_CONTACT_EMAIL optionally overrides the confirmed business email addresses with comma-separated recipients. Email enquiries open a draft addressed to both configured recipients; visitors review and send it in their email app.
- NEXT_PUBLIC_SITE_URL: public site origin (for example, https://www.strategyexperts.in), used for metadata, sitemap and social sharing. Bare domains are normalized to HTTPS; blank or invalid values safely use the existing fallback origin.
- NEXT_PUBLIC_SHOW_METRICS=true: reveals the per-service impact figures (lib/site.ts). They were transcribed from screenshots and must be verified first. Each set stays scoped to its own service.

## Content
All copy lives in lib/site.ts, taken from the supplied documents. Testimonials and client names are intentionally not used (approval pending). Confirmed Instagram and WhatsApp links appear in the footer. Privacy/Terms links are omitted until real pages exist.

## Verification

Use Node.js 22.18+ (or Node.js 24) for the dependency-free unit tests, including native TypeScript loading.

- `npm run lint`, `npm run typecheck`, `npm test` and `npm run build` are the static/unit checks.
- With a production server running, `node scripts/verify-navigation.mjs http://localhost:3126` checks native navigation, opening behaviour and contact selection.
- `node scripts/verify-content-colour.mjs http://localhost:3126` checks all six content routes across responsive widths and runs accessibility scans.
- Browser scripts use installed Chrome; set `CHROME_PATH` if its location differs from the Windows default.

Both TypeScript packages are intentional: `@typescript/native` supplies the `tsc` executable, while `typescript` provides the compiler API used by Next.js. Do not remove either based only on application imports.
