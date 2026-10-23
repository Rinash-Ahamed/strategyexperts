# Web quality audit - 23 October 2026

## Scope and conditions

Applied `.agents/skills/web-quality-audit` and the relevant public-site checks from
`.agents/skills/security-audit`. Existing user changes were preserved. No deployment,
external messages, production mutations, or dependency upgrades were performed.

Measurements used the local Next.js production server, headless system Chrome,
software WebGL, DPR 1, and no artificial CPU/network throttling. Desktop was a cold
profile; the subsequent mobile sample shared that profile's cache. These are native
PerformanceObserver measurements, not Lighthouse scores or real-device results.
The initial before/after samples are not statistically controlled medians.

## Findings and changes

- The original Spline runtime was competing with initial page work. Its component
  now mounts after the first rendering opportunity and a bounded idle callback.
  A low-priority CORS-compatible scene preload removes the serial discovery delay.
  The asset URL is shared in `lib/robot.ts` so preload and renderer cannot drift.
- Removed the full-canvas grayscale filter and the header's backdrop blur. Actual
  screenshots confirmed that the original robot remains black and silver.
- The robot continued rendering under the fullscreen mobile menu. It now pauses
  when its page becomes inert, then resumes subject to visibility and user pause.
- Scroll progress mutated an inherited CSS custom property on the document root
  and read document height on each scroll frame. Progress now updates only its own
  element; ResizeObserver maintains the scroll range. Header state changes only
  when crossing its scrolled threshold.
- The header and contact form imported complete service content for a few labels.
  The server now passes just navigation labels and service choices to these clients.
- Disabled unused SPA route prefetching on the primary content links. Existing
  full-document navigation and the brush transition remain in place.
- The platform ticker now stops off-screen/in hidden tabs and has a pause button.
- Fixed mobile-menu keyboard focus containment, Escape dismissal, focus restoration,
  inert background content, and closure when resizing into desktop navigation.
- Invalid contact fields receive focus. Sending still requires the existing
  configured WhatsApp or email channel and explicit user action.
- Fixed the unconfigured site URL fallback: sitemap and metadata use the existing
  production host rather than localhost. An explicitly configured URL still wins.

The existing Spline scene, rendering library, camera, materials, lights, authored
animation, head/hand tracking limits, reduced-motion support and robot controls
remain intact. The model is not replaced or hidden to obtain faster timings.

## Measurements

| Measurement | Before | After |
| --- | ---: | ---: |
| Desktop FCP / LCP, one sample | 3,084 ms | 3,044 ms |
| Desktop observed long-task blocking sum | 7,742 ms | 5,702 ms |
| Desktop long-task count | 11 | 8 |
| Desktop decoded route script bytes | 3,643,841 | 3,621,991 |
| Mobile FCP / LCP, first comparison | 1,584 ms | 4,652 ms |
| Mobile observed long-task blocking sum, first comparison | 4,185 ms | 3,579 ms |
| CLS | 0 | 0 |

The blocking sum is `sum(max(longTask.duration - 50, 0))` over the observed startup
window. It is not Lighthouse TBT. Desktop blocking was lower by about 26% in this
single comparison; that is not a general performance guarantee.

The mobile paint regression was investigated with three additional optimized-site
runs in one fresh profile: **2,032 / 2,700 / 2,628 ms LCP**, median **2,628 ms**,
all with **CLS 0** and the original model loaded. Model readiness in those runs was
**4,693 / 4,622 / 4,775 ms**. Mobile loading improvement is not established against
the single baseline, and the median still exceeds a 2.5-second LCP target.

Software rendering produced only 1-3 frame samples per 1.5-second sampling window.
Those samples cannot substantiate a smoothness or frame-rate claim. No Apple-level,
60 fps, field INP, or real-device performance guarantee is made.

## Executed verification

- `npm run build`: passed, including TypeScript. All six content routes remain static.
- `npm audit --omit=dev --json`: zero known production vulnerabilities reported.
- `node scripts/audit-site.mjs http://localhost:3115 before`: completed.
- `node scripts/audit-site.mjs http://localhost:3116 after`: completed.
- `node scripts/audit-site.mjs http://localhost:3116 mobile-repeat --mobile-only --metrics-only --repeat=3`: completed.
- `node scripts/verify-site.mjs http://localhost:3116 performance-fixes`: passed.
- Responsive sweep: six routes at nine widths from 320 to 1920 pixels, 54 cases,
  no horizontal overflow, one H1 and a title on each route.
- Inspected desktop and mobile screenshots. Existing robot appearance preserved.
- Browser exceptions: zero in completed runs.
- Menu keyboard cycle, Escape/focus restore, rendering pause under menu: passed.
- Pause/resume robot, reduced-motion model visibility and paused state: passed.
- Ticker pause and actual full-document service-link navigation: passed.
- Homepage, four services, contact, robots and sitemap: HTTP 200.
- Sitemap inspected: production host present, localhost absent.
- Existing security headers observed: HSTS, nosniff, frame restriction, referrer
  policy and permissions policy. No X-Powered-By header.
- Only `.env.example` is tracked; no backend/authentication/database surface found.

## Remaining limits

- The original 3D scene/runtime remains the main cost. Its export follows device
  pixel ratio; DPR 2 and 3 can multiply pixel work by 4 and 9. A real GPU/mobile
  profile and a quality-budget review of the same editable Spline scene are needed
  before making premium-smoothness claims. Private runtime APIs were not used to
  change the scene or silently alter camera framing.
- No existing lint or test runner script is configured. Lint was not run; build
  authorization was granted specifically for this audit. No dependencies added.
- Lighthouse and axe were not run; native metrics and manual/functional checks
  do not certify a Lighthouse score or WCAG conformance.
- Contact channels are unconfigured locally. The form rendered correctly, but
  delivery and validation-focus interaction with configured send buttons were not
  exercised. No enquiry was sent.
- CSP remains a hardening opportunity, not a confirmed exploit. Tightening it
  without testing the third-party Spline/WASM origins could break the scene.
- Real iPhone/Mac hardware, Safari/Firefox, screen readers, zoom reflow and field
  Web Vitals were not tested. Nothing was deployed.

## Reproducing

Start a production server with `npm run start -- --port 3116` after an explicitly
authorized build. The browser scripts write screenshots and JSON reports to a
unique temporary directory and print its path. They use the system Chrome binary,
with an optional `CHROME_PATH` override, and close only their own browser process.
