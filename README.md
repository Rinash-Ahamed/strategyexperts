# Strategy Experts website

Next.js (App Router, TypeScript), plain CSS, no animation libraries.

    npm install
    npm run dev      # http://localhost:3000
    npm run typecheck
    npm run build && npm start

## Project structure

- `app/` — App Router routes, metadata and route-level boundaries.
- `components/layout/` — shared site chrome used by the root layout.
- `components/home/` — homepage-only sections.
- `components/services/` — service-page composition.
- `components/contact/` — contact-page interactions.
- `components/shared/` — reusable presentational components.
- `components/effects/` — isolated client-side behavior.
- `lib/` — typed site configuration and content.

## Configuration (.env.local — see .env.example)
- NEXT_PUBLIC_WHATSAPP_NUMBER / NEXT_PUBLIC_CONTACT_EMAIL: enable the contact form's send buttons and footer contact details. Nothing is invented; with both blank the form shows a "not configured" notice.
- NEXT_PUBLIC_SITE_URL: used for metadata, sitemap, social sharing.
- NEXT_PUBLIC_SHOW_METRICS=true: reveals the per-service impact figures (lib/site.ts). They were transcribed from screenshots and must be verified first. Each set stays scoped to its own service.

## Content
All copy lives in lib/site.ts, taken from the supplied documents. Testimonials and client names are intentionally not used (approval pending). Social links and Privacy/Terms links are omitted until real URLs/pages exist.
