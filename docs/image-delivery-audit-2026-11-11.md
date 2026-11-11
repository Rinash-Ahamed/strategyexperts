# Image delivery audit - 11 November 2026

## Outcome

Baseline: 2.14.19. Optimized release: 2.14.20 (performance patch).

Ten local production page/device loads made **110 -> 10 optimizer requests (90.9% fewer)**. Image bodies totalled **1,515,014 -> 1,518,828 bytes (+0.25%)**. This is primarily an Image Optimization usage reduction, not a claim of large bandwidth savings. Ordinary static CDN requests and transfer still apply.

No images, source artwork, CSS, layout, animation timings or interactions were removed or redesigned. Original artwork remains available. No deployment was performed.

## Scope and inventory

- Next.js 16.4.2 App Router, React, native full-document navigation; nine public pages.
- All rendered image consumers use `components/shared/StaticImage.tsx` / Next `getImageProps`: homepage Ticker, ClientPartners and DashboardShowcase; CommercePlatforms (hotel/e-commerce), HospitalityPlatforms, ServiceDetails and RestaurantReports; the shared Straty avatar.
- The navbar/footer wordmark is text, and service illustration shapes/icons are inline SVG. Favicons and generated social artwork are separate static routes, not optimizer URLs.
- 28 folder-discovered logos: 17 platform logos and 11 clients. Sources total 12,456,798 bytes, including nine approximately 1.1-1.4MB client PNGs and a 777KB Amazon PNG. Unused industry photography is not requested by current pages and was retained, not needlessly converted.
- Five precompressed dashboard screenshots are already 1600px WebP, 23.9-91.7KB each. Their original-at-full-size path was retained.
- No hospital listings, consultant profiles/photos, upload API, Firebase SDK/storage URLs, database or admin dashboard exist in this repository. The Product link opens an external dashboard; its images and permissions were not accessed or audited.
- All baseline optimizer requests used `/_next/image`; no `/_vercel/image` usage was found.

## Changes

1. `scripts/prepare-images.mjs` runs before `npm run build` / `npm run dev`, automatically discovering existing folders. `lib/logo-variants.ts` produces static WebP candidates without a manual manifest, cropping, recolouring or overwriting originals. Development discovery also prepares newly added files on refresh.
2. Platform quality remains 90, client quality 75, alpha quality 100. Clients use 160/320/640px; platform steps are 128/192/256/320/640px plus the source-capped maximum up to 960px. No upscaling. Current artwork produces 122 generated files plus two direct small originals (124 candidates total). The roughly 320px delivery set totals 236,539 bytes, versus 12.46MB of originals; this is a source comparison, not savings over the previous responsive optimizer.
3. `StaticImage` accepts prepared variants and emits native `srcset`/`sizes` while retaining layout dimensions/fill styles, loading priority, alt text and native lazy loading. The same hashes are reused across banner copies and service pages. SVGs bypass optimization, including versioned SVG URLs. Small sources under 10KB and at most 640px wide stay direct. Animated inputs are not flattened and retain the existing fallback.
4. Generated names hash source content plus encoder recipe. Same-name replacements change URLs; ordinary refreshes do not. `/_images/` derivatives have one-year immutable caching. Existing source fingerprints and cache rules remain. Originals without versioning still revalidate.
5. Straty has static, responsive 128px/192px WebP imports, preserving 2x/3x clarity at its 64px slot and reusing the URL in launcher/dialog. The original 320px avatar is retained.
6. **Only the five dashboard screenshots still use on-demand optimization for smaller widths** on current pages; their full-size compressed originals remain direct. Future unprepared/animated images retain optimization as a fallback. Optimization is not globally disabled.
7. `minimumCacheTTL` is explicitly 30 days for remaining optimizer responses. Existing `deviceSizes`, `imageSizes`, qualities [75,90] and WebP negotiation remain: screenshots still benefit from these widths; adding runtime AVIF would add a format/transform family rather than reduce it. Above-the-fold logos remain eager, client plaques/dashboard sections retain lazy loading, and existing screenshot-switcher eager low-priority loading is preserved.
8. Sharp, already installed by Next and used by existing tooling, is declared directly at the same locked version. No third-party service or new processing library was added. Superseded trial derivatives were removed; originals were not.

## Production comparison

`node scripts/audit-image-delivery.mjs http://localhost:3011 <report.json>` was run before and after. Both use installed headless Chrome, DPR 2, cold browser caches per route, retained server optimizer caches, five routes at 390px and 1440px, 900px height. Mobile uses simulated 1.6Mbps download and 150ms latency; desktop is unthrottled. Native lazy images are triggered and decoded before image-byte accounting. One run per route/device: timings are illustrative, not a statistically stable benchmark or field Core Web Vitals. No Lighthouse scores are claimed.

| Route | Mobile optimizer requests | Desktop optimizer requests | Mobile image KiB | Desktop image KiB |
| --- | --- | --- | --- | --- |
| Home | 34 -> 5 | 29 -> 0 | 314.1 -> 321.0 | 507.5 -> 507.5 |
| E-commerce | 4 -> 0 | 4 -> 0 | 27.1 -> 23.9 | 31.5 -> 33.6 |
| Restaurant | 10 -> 5 | 5 -> 0 | 145.9 -> 145.5 | 303.3 -> 302.9 |
| Hotel | 8 -> 0 | 8 -> 0 | 50.2 -> 49.7 | 64.8 -> 64.2 |
| Digital | 4 -> 0 | 4 -> 0 | 17.6 -> 17.5 | 17.6 -> 17.5 |

Homepage mobile LCP was 2,316 -> 1,648ms; desktop 684 -> 412ms. Other mobile results ranged from 1,012-1,280ms before and 944-1,032ms after; hotel moved 1,012 -> 1,032ms. CLS was 0 for every measured before/after load. Do not interpret the small differences as guaranteed improvements: CPU load, local caching and animation timing affect single-run results. Some selected widths and WebP encoder output sizes differ slightly; aggregate bytes are effectively flat, not universally lower.

The homepage's advertised unique optimizer candidate URLs fell **172 -> 25**. Browser-selected optimizer requests fell 90.9% in this scenario. Those requests no longer need Image Optimization cache reads/writes or transformations for the static logos/avatar, but actual monthly savings depend on traffic, cache hits/evictions, selected widths, regions and your Vercel billing model. This local audit has no access to deployed billing telemetry.

Raw measurements: [before](image-delivery-before-2026-11-11.json), [after](image-delivery-after-2026-11-11.json). An initial baseline attempt observed lazy images still loading; it was not used. The retained reports use the same explicit lazy-image settling on both runs and have zero broken images.

## Validation

- Production build passed, all 18 static entries generated; nine content pages remain prerendered, only `/api/enquiry` is dynamic.
- Lint and standalone typecheck passed.
- Full automated suite: bootstrap check plus 11 tests passed, including five image-delivery tests. An initial restricted-shell `npm test` failed to spawn worker processes (EPERM); the full suite passed when rerun with process permission. SMTP was mocked; no real email was sent.
- 54 layout checks across all nine pages at 320/390/768/820/1024/1440px: no horizontal overflow, clipped main headings, heading/copy collisions or missing navigation. 18 representative axe scans returned no violations; this is not complete accessibility certification.
- Ten image audit loads: zero broken/undecoded images, CLS 0. Mobile/desktop screenshots and a source-versus-derivative contact sheet were visually inspected; logo colours, transparency, proportions and readability were retained. Metadata tests confirm candidate dimensions and no upscaling. Existing dark-lettering OTA artwork remains low contrast on black; artwork/branding was deliberately not changed.
- Task browser profiles, temporary screenshots and reports were removed after inspection. Only the requested durable audit report/measurement JSONs are retained.

## Deployment and remaining risks

- Deploy with **`npm run build`**, Node 22.18+ (24 recommended), installing declared Sharp and its matching native binaries. Do not override Vercel's build command to skip preparation. `public/_images/` is a generated, ignored build artifact, not source to edit. Rebuild after adding/replacing/removing logos.
- This build-time pipeline is for trusted local static artwork, not a live upload system. Image uploads or remote storage added later need their own resizing, access-control and cache review. No Firebase permission change was made or required.
- Physical iPhone/iPad Safari, other browsers, real networks, deployed CDN headers, monthly usage, field INP and real-user LCP remain unverified. Browser emulation is not an Apple-device certification. The pre-existing Straty floating widget can overlap page content at intermediate scroll positions; its existing mobile footer clearance is unchanged.
- Vercel [documents Hobby as non-commercial/personal use](https://vercel.com/docs/plans/hobby). A commercial consultancy/client site must use an eligible hosting plan; these technical savings do not waive plan terms.
- Vercel's [cost guidance](https://vercel.com/docs/image-optimization/managing-image-optimization-costs) supports bypassing optimization for suitable small/static images. Its [pricing documentation](https://vercel.com/docs/image-optimization/limits-and-pricing) distinguishes transformations, cache reads and cache writes from ordinary CDN transfer. Validate actual usage on the selected deployment before assigning a currency saving.
