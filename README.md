# Strategy Experts website

Custom seven-page consultancy website using Next.js App Router, React, TypeScript and CSS/CSS Modules, without animation-library dependencies. The current hero is text-led; the robot and opening loading screen are no longer included. Its background and service icons stay lavender, with subtle background motion but no green/teal colour cycle.

    npm ci
    npm run dev      # http://localhost:3000
    npm run typecheck
    npm test
    npm run build
    npm run start -- --port 3011

Use Node.js 24 LTS (or Node.js 22.18+ for the native-TypeScript tests). Copy `.env.example` to `.env.local` and configure it locally. Reuse an existing dev server instead of starting competing instances in the same directory. Development compilation time is not production performance.

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Hero, synchronized platform banner, dashboard showcase, approach, clients and enquiry CTA |
| `/services/e-commerce-support` | E-commerce services, benefits and audience |
| `/services/restaurant-consulting` | Restaurant services, report switcher, impact counters and audience |
| `/services/hotel-revenue-management` | Hotel services, benefits and audience |
| `/services/digital-marketing` | Digital services, animated connectivity circle, benefits and audience |
| `/pricing` | Starter, Pro and Custom plans, with enquiry links |
| `/contact` | Business hours and consent-gated email/WhatsApp enquiries |
| `/api/enquiry` | Server-only Node.js SMTP endpoint |

The seven public pages are prerendered. Product opens `https://dashboard.strategyexperts.in/login` in a new tab; that application is external, not implemented here. This repository has no database, CMS or payment checkout. Straty is a guided enquiry interface, not an LLM chatbot.

## Project structure

- `app/` - App Router routes, metadata and route-level boundaries.
- `components/layout/` - shared site chrome used by the root layout.
- `components/home/` - homepage-only sections.
- `components/services/` - service-page composition.
- `components/contact/` - contact-page interactions.
- `components/support/` - Straty's guided enquiry interface.
- `components/shared/` - reusable presentational components.
- `components/effects/` - isolated client-side behavior.
- `lib/` - configuration, content, logo discovery, validation and enquiry helpers.
- `public/` - approved artwork, platform/client logos and dashboard screenshots.

Global CSS import order in `app/layout.tsx` affects the final cascade. Shared service composition is in `components/services/ServiceDetails.tsx`. Responsive image delivery is handled by `components/shared/StaticImage.tsx`.

The four service pages no longer render an Our Approach section. Supplied process copy remains in `lib/service-details.ts` as source content; the homepage's approach section is unchanged.

Only Digital Marketing's Who We Work With section uses a full-width pure-white section background, white audience tiles and dark text, with no decorative corner ring (`ServiceAudience.module.css`, digital-only light variant). The other three service audience sections retain their dark design.

Below 1280px, navigation opens a compact frosted sheet beneath the header rather than oversized full-screen links. Services expand inline (initially expanded on a service page); Product still opens externally. The sheet supports Escape, backdrop dismissal, visible focus, focus containment/return, background scroll locking and reduced motion. Desktop navigation remains separate and unchanged.

## Configuration (.env.local - see .env.example)
- NEXT_PUBLIC_WHATSAPP_NUMBER: optional international-format number, digits only. WhatsApp opens a prepared message for the visitor to send.
- NEXT_PUBLIC_CONTACT_EMAIL: optional comma-separated fixed recipients, defaulting to the business addresses in `lib/site.ts`. Public contact information, not a secret.
- GMAIL_SMTP_USER and GMAIL_SMTP_APP_PASSWORD: server-only sender credentials. Enable Google 2-Step Verification and use an App Password, never a normal login password or a `NEXT_PUBLIC_*` secret. Contact and Straty send through `/api/enquiry`, not an email-app draft. Success waits for SMTP recipient acceptance, which does not guarantee inbox placement.
- NEXT_PUBLIC_SITE_URL: public site origin (for example, https://www.strategyexperts.in), used for metadata, sitemap and social sharing. Bare domains are normalized to HTTPS; blank or invalid values safely use the existing fallback origin.
- NEXT_PUBLIC_SHOW_METRICS: legacy shared configuration flag. It does **not** gate the detailed restaurant impact section in `lib/service-details.ts`; do not rely on it to hide those claims.

See [email setup](docs/email-setup.md) for SMTP configuration, timeouts and abuse controls. Never commit or share credentials in screenshots, chat, documentation or delivery archives. If exposed, revoke and replace them, then restart/redeploy so pooled connections use the replacement. Public build-time configuration changes require a rebuild.

## Content
Shared identity, contacts and service metadata live in `lib/site.ts`; detailed service content is in `lib/service-details.ts`. Some section-specific copy remains colocated with its component or route. Approved client logos appear on the homepage. Confirm all figures, logos, pricing and claims with the client before publishing; never invent testimonials or imply platform certification.

Privacy/Terms pages are not implemented. Obtain appropriate client guidance for consent/privacy wording rather than inventing legal copy.

### Folder-driven assets

- Clients: add artwork to `public/clients`.
- Platforms: use `public/Brand/Restaurant`, `Hotel`, `Ecommerce` or `DigitalMarketting` (preserve the existing folder spelling).
- PNG, JPG/JPEG, WebP, AVIF and SVG files are discovered by `lib/logo-library.ts`; do not maintain manual imports or an inclusion manifest. Descriptive filenames improve accessible names. Preserve approved proportions and colours.
- Refresh development to discover changes; rebuild/redeploy production after additions, replacements or removals. This is not a live-upload CMS. Content-fingerprinted logo URLs invalidate same-name replacements; only versioned sources receive long-lived caching.
- PDFs are source artwork, not browser logos. Convert and visually verify them before deletion, and remove sources only with authorization.
- `public/dashboard/1.webp` through `5.webp` map to Daily, Payout, Ticketing, Leaderboard and Visibility. The restaurant switcher follows that order, advancing every five seconds while visible and not being interacted with. Reduced-motion users retain manual controls.
- Restaurant impact values animate once on entry. Preserve suffixes, reserved width and accessible final text, and get client approval for the source claims.
- The e-commerce hero uses `CommercePlatforms`: folder-discovered logos float over lavender isometric platforms without white backplates or logo glow. Original artwork remains unchanged; use approved light-lettering variants where dark logos lack contrast. Motion is CSS-only, pauses through the existing visibility observer and respects reduced-motion preferences. Digital Marketing retains its separate circular illustration.
- Restaurant uses `HospitalityPlatforms`: floating graphite serving platters with layered lavender-edged rims and upright original-colour logos, without white backplates or logo glow. Hotel uses `HotelPlatforms`: an open lavender wireframe hotel with unboxed, staggered platform logos floating on either side; no key tags, pale backplates or logo glow. Approved light-lettering artwork is preferable for dark marks on these surfaces. Both discover all logos from their matching folders and use transform/opacity-only CSS motion, reduced-motion support and visibility handling.

## Verification

Use Node.js 22.18+ (or Node.js 24) for the dependency-free unit tests, including native TypeScript loading.

- `npm run lint`, `npm run typecheck`, `npm test` and `npm run build` are the static/unit checks.
- **Coding agents must not run lint/build without explicit permission in the current request.** The commands here document available checks, not standing permission; see [AGENTS.md](AGENTS.md).
- `npm test` covers bootstrap behaviour, URL normalization, folder discovery, image delivery, validation, branded templates and the enquiry route with mocked SMTP. It does not send real mail. Native TypeScript helpers may emit Node experimental/module-format warnings; do not change package module mode blindly to silence them.
- With a production server running, `node scripts/verify-readability.mjs http://localhost:3011 --strict` checks seven pages across responsive widths and runs axe at representative mobile/desktop sizes.
- `node scripts/verify-navigation.mjs http://localhost:3011` checks navigation and home/contact behaviour. Older visual scripts may contain historical-design assumptions: inspect assertions before treating them as release gates.
- Browser scripts use installed Chrome; set `CHROME_PATH` if its location differs from the Windows default.
- Browser reports/screenshots go to the temporary directory printed by each script.
- `scripts/performance-audit.mjs` accepts an existing Lighthouse CLI via `--lighthouse=<path>`, plus `--output=<directory>` and `--base=<production URL>`. Do not install tooling without approval. Record production measurement conditions; distinguish lab scores from real-device performance and field Core Web Vitals.

The [8 November audit](docs/performance-audit-2026-11-08.md) is historical evidence, not certification of the latest version or deployment. It records unresolved mobile bottlenecks as well as improvements. Never promise guaranteed rankings, revenue gains, perfect accessibility or 120 FPS from build/axe/lab checks.

Both TypeScript packages are intentional: `@typescript/native` supplies the `tsc` executable, while `typescript` provides the compiler API used by Next.js. Do not remove either based only on application imports.

## Deployment and client handoff

1. Use a Node.js-capable Next.js host with outbound SMTP and image optimization support. Static-only hosting cannot run the enquiry endpoint or default optimizer.
2. Configure the production origin, public contacts and server-only SMTP credentials. Deploy the approved source and lockfile, not a development server.
3. Preserve the image cache where supported. Verify CDN query-string cache keys, HTTPS, canonical URLs, sitemap, social previews, icons, service links and the external Product URL on the real domain.
4. With permission, send one enquiry from Contact and one from Straty after credential rotation. Check success/error feedback, recipient inbox/spam, source labels and Reply-To. Mocked tests do not prove actual inbox delivery.
5. Confirm client approval for logos, pricing, impact claims and consent/privacy wording. Agree on hosting ownership, support scope and future changes.
6. Configure edge/shared rate limits for public or multi-instance deployment. Existing in-process limits reset on restart and are not distributed anti-spam protection. CSP is not configured by this repository; assess it against the deployment and inline-script requirements before adding one.
7. Exclude `.env.local`, credentials, `node_modules`, `.next`, browser profiles and temporary audit artifacts from source handoff archives. Share production secrets only through an appropriate secret manager.
