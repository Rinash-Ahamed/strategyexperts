# Strategy Experts website

Custom nine-page consultancy website using Next.js App Router, React, TypeScript and CSS/CSS Modules, without animation-library dependencies. The current hero is text-led; the robot and opening loading screen are no longer included. Its background and service icons stay lavender, with subtle background motion but no green/teal colour cycle.

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
| `/terms` | Website terms of use |
| `/privacy-policy` | Website enquiry privacy notice |
| `/api/enquiry` | Server-only Node.js SMTP endpoint |

The nine public pages are prerendered. Product opens `https://dashboard.strategyexperts.in/login` in a new tab; that application is external, not implemented here. This repository has no database, CMS or payment checkout. Straty is a guided enquiry interface, not an LLM chatbot.

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

### Image delivery and deployment

- `npm run build` and `npm run dev` automatically run `scripts/prepare-images.mjs`. It discovers all logo folders and generates responsive WebP derivatives in ignored `public/_images/`, without modifying approved originals or maintaining an asset inclusion list. Node.js 22.18+ is required for the preparation script's native TypeScript helper; Node.js 24 is recommended.
- `lib/logo-variants.ts` uses content plus encoder-recipe hashes, at most six static raster widths (three for client plaques), no upscaling, preserved transparency and the existing quality levels (platforms 90, clients 75). The shared 128/192/256/320px steps avoid small-logo overfetch; these are build artifacts, not Vercel transformations. Small rasters under 10KB and at most 640px wide stay direct; SVGs stay native. Animated artwork retains the Next fallback rather than being flattened.
- The same generated URLs are reused in banners and service illustrations. Folder discovery also prepares missing derivatives during development rendering, so new logos still appear after refresh. Production pages remain prerendered: rebuild/redeploy after artwork changes. Use `npm run build`, not a bare `next build`, to ensure preparation happens before hosting packages public assets. No generation runs during normal visitor image requests.
- `StaticImage` bypasses `/_next/image` only when static responsive variants are supplied (or the source is SVG). Unprepared images retain normal Next optimization. Generated files and hashed static imports have immutable caching. Bare source artwork revalidates; source fingerprint query strings remain stable until content changes.
- Straty uses precompressed 128px/192px WebP imports with responsive selection, shared by its launcher and dialog. The original avatar remains available. Dashboard screenshots retain Next optimization at smaller widths and their original 1600px compressed WebP at full size. Remaining optimizer responses have a 30-day minimum cache TTL; use versioned sources rather than mutable URLs.
- `deviceSizes`, `imageSizes`, `qualities: [75, 90]` and WebP-only runtime format negotiation are deliberately retained: the remaining detailed screenshots benefit from those widths, and enabling AVIF alongside WebP would create another transformation family. Optimization is not disabled globally.
- Direct static delivery avoids Image Optimization transformations/cache reads/writes for those requests, not ordinary CDN request or bandwidth usage. See the [image delivery audit](docs/image-delivery-audit-2026-11-11.md) for measured conditions, results and deployment caveats.

The four service pages no longer render an Our Approach section. Supplied process copy remains in `lib/service-details.ts` as source content; the homepage's approach section is unchanged.

All four service pages use a full-width pure-white Who We Work With section with white audience tiles and dark text, without a decorative corner ring (`ServiceAudience.module.css`). Our Services icons have black symbols on white backgrounds, a lavender outline on hover and a staggered outline sequence; benefits use small travelling line highlights where benefit items exist. Motion respects reduced-motion preferences and pauses off-screen. Each page retains its own content and logo illustration.

Below 1280px, navigation opens a compact frosted sheet beneath the header rather than oversized full-screen links. Services expand inline (initially expanded on a service page); Product still opens externally. The sheet supports Escape, backdrop dismissal, visible focus, focus containment/return, background scroll locking and reduced motion. Desktop navigation remains separate and unchanged.

At widths up to 820px, Straty's floating launcher steps aside while the contact form is in or near the viewport and returns when the form is off-screen. This uses IntersectionObserver, without a scroll loop or per-frame React updates. The support dialog and enquiry flow remain unchanged.

Shared content wrappers and legal pages respect horizontal safe-area insets on notched devices. While Straty is open, VisualViewport events cap and reposition its scrollable panel when the on-screen keyboard reduces the visible area. Listeners are removed on close; pinch zoom and existing panel sizing remain unchanged. Chrome notch/viewport simulations are not a substitute for physical iPhone/iPad Safari keyboard testing.

## Configuration (.env.local - see .env.example)
- NEXT_PUBLIC_WHATSAPP_NUMBER: optional international-format number, digits only. WhatsApp opens a prepared message for the visitor to send.
- NEXT_PUBLIC_CONTACT_EMAIL: optional comma-separated fixed recipients, defaulting to the business addresses in `lib/site.ts`. Public contact information, not a secret.
- GMAIL_SMTP_USER and GMAIL_SMTP_APP_PASSWORD: server-only sender credentials. Enable Google 2-Step Verification and use an App Password, never a normal login password or a `NEXT_PUBLIC_*` secret. Contact and Straty send through `/api/enquiry`, not an email-app draft. Success waits for SMTP recipient acceptance, which does not guarantee inbox placement.
- NEXT_PUBLIC_SITE_URL: public site origin (for example, https://www.strategyexperts.in), used for metadata, sitemap and social sharing. Bare domains are normalized to HTTPS; blank or invalid values safely use the existing fallback origin.
- NEXT_PUBLIC_SHOW_METRICS: legacy shared configuration flag. It does **not** gate the detailed restaurant impact section in `lib/service-details.ts`; do not rely on it to hide those claims.

See [email setup](docs/email-setup.md) for SMTP configuration, timeouts and abuse controls. Never commit or share credentials in screenshots, chat, documentation or delivery archives. If exposed, revoke and replace them, then restart/redeploy so pooled connections use the replacement. Public build-time configuration changes require a rebuild.

## Content
Shared identity, contacts and service metadata live in `lib/site.ts`; detailed service content is in `lib/service-details.ts`. Some section-specific copy remains colocated with its component or route. Approved client logos appear on the homepage. Confirm all figures, logos, pricing and claims with the client before publishing; never invent testimonials or imply platform certification.

Terms and Privacy Policy pages are linked from the footer. Their initial website-specific wording requires client/legal approval before delivery, including confirmation of the operator identity, hosting providers, retention practice and privacy-request handling. They are not a compliance certification or a replacement for a signed service agreement. Add the privacy notice to consent journeys if required after legal review.

### Folder-driven assets

- Clients: add artwork to `public/clients`.
- Platforms: use `public/Brand/Restaurant`, `Hotel`, `Ecommerce` or `DigitalMarketting` (preserve the existing folder spelling).
- PNG, JPG/JPEG, WebP, AVIF and SVG files are discovered by `lib/logo-library.ts`; do not maintain manual imports or an inclusion manifest. Descriptive filenames improve accessible names. Preserve approved proportions and colours.
- Refresh development to discover changes; rebuild/redeploy production after additions, replacements or removals. This is not a live-upload CMS. Content-fingerprinted logo URLs invalidate same-name replacements; only versioned sources receive long-lived caching.
- PDFs are source artwork, not browser logos. Convert and visually verify them before deletion, and remove sources only with authorization.
- `public/dashboard/1.webp` through `5.webp` map to Daily, Payout, Ticketing, Leaderboard and Visibility. The restaurant switcher follows that order, advancing every five seconds while visible and not being interacted with. Reduced-motion users retain manual controls.
- Restaurant impact values animate once on entry. Preserve suffixes, reserved width and accessible final text, and get client approval for the source claims.
- The e-commerce hero uses `CommercePlatforms`: folder-discovered logos float over lavender isometric platforms without white backplates or logo glow. Original artwork remains unchanged; use approved light-lettering variants where dark logos lack contrast. Motion is CSS-only, pauses through the existing visibility observer and respects reduced-motion preferences. Digital Marketing retains its separate circular illustration.
- Restaurant uses `HospitalityPlatforms`: floating graphite serving platters with layered lavender-edged rims and upright original-colour logos, without white backplates or logo glow. Hotel uses the shared `CommercePlatforms` pedestal treatment via `HotelPlatforms`: an asymmetric cluster with three foreground platforms, two middle platforms and two smaller rear platforms. Seven reusable spatial slots repeat in additional bands for new folder assets, not a logo inclusion list. Hexagonal SVG plinths retain e-commerce's lavender surface colours, opaque dark tops, solid side faces and one soft outline. Hotel logos sit closer to the shallower-angled bases, without contact shadows, and retain an 11-second, 3px float. There is no bottom business label or hotel cursor-tracking island. E-commerce retains its original rectangular plinths, business label and motion. Both discover all logos from their matching folders and use transform-only CSS motion, reduced-motion support and visibility handling. Original logo colours and proportions are preserved.

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
