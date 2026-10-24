# Performance, navigation and refresh-opening audit

## Scope and test conditions

Audited the existing Next.js App Router site using the repository's web-quality-audit skill. Preserved full-document service pages, content, typography, the original Spline model, lighting, materials and authored motion. No animation dependencies were added.

The production build prerenders Home, Contact and all four service pages. Measurements used an isolated `next start` on localhost:3126, not the development server.

Two cold **browser-cache** samples per route at 390px and 1440px isolated content loading by holding the external scene fetch pending. Server image/font caches were not reset; CPU and network were not throttled in these content checks. LCP observation continued for two seconds after DOM readiness. These are not whole-homepage, real-phone or field measurements.

The live robot was tested separately. Forced-software WebGL profiling and a final Chrome automatic-renderer functional check have different conditions and are not comparable performance benchmarks. Some forced-software screenshot attempts timed out and are not counted as passing tests.

## Measured problems and fixes

| Check | Before | After, same content-profile conditions |
| --- | ---: | ---: |
| Robot layout reads for a 100-pointer-event burst | 100 synchronous reads | 0 synchronous, 1 deferred read |
| Maximum observed Hotel CLS | 0.0652 | 0 |
| Maximum observed Digital Marketing CLS | 0.0666 | 0 |
| Maximum observed Contact CLS | 0.0212 | 0 |
| Maximum observed Home / E-Commerce / Restaurant CLS | 0 | 0 |

- Logo slots previously relied on decoded image dimensions. Explicit ratio-based boxes now reserve the same visual footprint before loading. The supplied wide WhatsApp image also had incorrect portrait metadata; its actual dimensions are now recorded. Original files, colours and proportions are retained.
- Contact used `useSearchParams` under a Suspense placeholder, so the real form was inserted after JavaScript loaded. The complete form now ships in static HTML. A validated optional query selects the existing service after hydration without changing layout or submission behaviour.
- Robot pointer events now store coordinates only. Geometry is read once per animation frame; per-event diagnostic attribute writes and object allocation were removed. Pending rig frames cancel when hidden/offscreen.
- Native page-entry effects use a 300ms fade and 10px rise. Navigation is not intercepted or held behind an exit animation. The navigation bar remains stationary. Reduced motion does not opt into cross-document transitions; unsupported browsers retain normal navigation.
- Robot startup yields until a native transition completes. Existing offscreen/tab/menu pausing remains; `pagehide` now stops rendering and disposes a genuinely unloaded application while keeping BFCache documents resumable.
- Refresh opening detection, refresh-to-top and Skip now work before React hydration. Normal exit follows the first robot frames and the existing three-second minimum, not the old six-second cutoff. A 60-second failure watchdog and pre-hydration Skip/keyboard controls prevent an indefinite overlay if the scene/client fails. Normal navigation Home does not replay the opening. Reduced motion bypasses it.
- Added the requested WhatsApp footer icon beside Instagram using an inline SVG and the configured WhatsApp number, falling back to the supplied business phone. No external icon library or extra image request.
- Reproduced a shared closing consultation CTA conflict: light section tokens made light button text almost invisible until hover (1.05:1 measured contrast). Scoped solid foreground/background colours fix the normal state without changing layout. The production regression passed all 48 normal, hover and keyboard-focus states across both buttons, all four services and desktop/mobile widths, with at least 4.5:1 text contrast.

No significant initial-JavaScript reduction was demonstrated: initial HTML script gzip totals remained approximately 188KB for Home, 184KB for services and 179KB for Contact. Spline stays route-isolated rather than being loaded on service pages. Individual route LCP timings varied; there is no blanket LCP-speedup claim.

## Remaining 3D cost and performance targets

An exploratory mobile Lighthouse baseline returned performance 35/100, LCP 11.39s, TBT 19.40s and CLS 0 under forced software WebGL and simulated throttling. Lighthouse warned that the host CPU was slower than expected. Script evaluation accounted for about 20.9 seconds in that trace, dominated by the 3D runtime. The separate robot run loaded about 3.6MB of decoded JavaScript, including framework/runtime code.

Those numbers do not establish real-device speed, and no improved final Lighthouse score is claimed. The controlled before/after comparison above is for content and pointer work. The opening covers startup; it does not make shader compilation or runtime downloads instantaneous and is not counted as a benchmark improvement.

LCP <=2.5s, field INP <=200ms and a sustained high refresh rate are targets, not verified outcomes for the full 3D homepage. No field INP data or physical-device GPU tests were available. An optimized export of the same editable Spline scene is the next substantial cold-start opportunity; model quality, DPR, lighting and geometry were not arbitrarily reduced to inflate scores.

## Verification executed

- Production builds, lint and TypeScript checks passed during implementation; all content routes remained static.
- Production dependency audit: zero known vulnerabilities reported.
- 72 responsive checks across six routes and twelve widths; twelve desktop/mobile axe scans with no automated violations. Gradient contrast still requires manual/specific checks; automated axe alone did not catch the closing CTA issue.
- Desktop/mobile native transitions, full-document requests, browser back/forward scroll restoration, Home/logo scroll-to-top, refresh-only opening and reduced-motion checks passed.
- With framework chunks blocked, document navigation, transitions and the opening's native Skip fallback passed. All four service-query selections and invalid-form focus behaviour passed with normal hydration.
- Live-model check passed: cursor-responsive head, unchanged body motion, offscreen stop/resume, live touch animation without cursor tracking, reduced-motion still scene, and an uncached refresh that kept the opening visible until the robot loaded, then ended at Home's top.
- Footer icons and opening screenshots inspected at desktop/mobile sizes. Ten unique internal destinations returned HTTP 200; external contact/social URL syntax was checked without sending messages.
- Editorial motion and consultation-button regressions passed; refresh bootstrap unit checks also passed, including BFCache listener/timer cleanup without a scroll jump.

Physical phones, Safari, Firefox, screen readers and real-user INP remain unverified. Some test conditions isolate content from the robot; those checks must not be presented as complete 3D performance scores.

## Reproduce

```powershell
npm run build
npm run start -- --port 3126
# In a separate terminal:
node scripts/profile-content.mjs http://localhost:3126 content
node scripts/verify-navigation.mjs http://localhost:3126
node scripts/verify-navigation.mjs http://localhost:3126 --block-framework
node scripts/verify-content-colour.mjs http://localhost:3126
node scripts/verify-site.mjs http://localhost:3126 robot --motion-only --verify-opening --native-gpu
node scripts/verify-editorial-motion.mjs http://localhost:3126
node scripts/test-page-bootstrap.mjs
```

Scripts print temporary report/screenshot directories. Relevant completed artifacts from this audit are `se-baseline-content-xyG2NR`, `se-after-content-onKdCF`, `se-navigation-No2ABw`, `se-navigation-UTadJI`, `se-content-colour-n9mfGx`, `strategy-experts-live-opening-final-q8OhAZ` and `se-editorial-NKOvVJ`. The Lighthouse diagnostic is `se-lh-baseline-home.json` in the OS temporary directory.

Implementation references: [Chrome cross-document transitions](https://developer.chrome.com/docs/web-platform/view-transitions/cross-document) and [Spline scene optimization guidance](https://docs.spline.design/exporting-your-scene/how-to-optimize-your-scene).
