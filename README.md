# Strategy Experts website

Next.js (App Router, TypeScript), plain CSS, no animation libraries.

    npm install
    npm run dev      # http://localhost:3000
    npm run typecheck
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
All copy lives in lib/site.ts, taken from the supplied documents. Testimonials and client names are intentionally not used (approval pending). Social links and Privacy/Terms links are omitted until real URLs/pages exist.
