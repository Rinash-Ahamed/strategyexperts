# Performance audit - 8 November 2026

## Scope and method

Production-only audit of Home, all four service pages, Pricing and Contact. The repository's web-quality-audit workflow was used. The starting working tree already contained service-page/content changes; those were preserved rather than compared against an older Git revision.

Baseline: 2.13.1, measured before this audit's runtime edits. Optimized release: 2.13.2 (patch: delivery, performance, cleanup and regression checks; no new feature or public-contract change).

- Lighthouse 13.5.0, Chrome 156.0.8078.81, Node 24.15.0, Next 16.4.2 on this Windows workstation.
- Seven routes, mobile and desktop, two runs per combination before and after (56 final/baseline runs). Tables use the median of two samples, i.e. their arithmetic midpoint; half-point scores are intentional.
- Mobile: 412 x 823, DPR 1.75, simulated 150 ms RTT / 1,638.4 Kbit/s / 4x CPU slowdown. Desktop: 1350 x 940, DPR 1, simulated 40 ms RTT / 10,240 Kbit/s / 1x CPU.
- Fresh Lighthouse browser profiles; production server/image caches persist. These are local lab comparisons, not cold-CDN or real-phone results. Lighthouse emitted CPU-calibration warnings on several runs. The audit was paused overnight at the user's request; resumed samples and affected-page remeasurements were collected the following morning. Host timing is not controlled across that gap. For example, Contact's benchmark index changes from 978.5 in optimized sample 1 to 694 in sample 2, with increased script, style and painting costs. The retained scores therefore do not establish that the code caused every timing change.
- A stalled Lighthouse browser produced no usable result; only that owned browser was closed and the missing run resumed. Completed runs were retained. No successful samples were discarded to improve a score.
- An earlier candidate was rejected after image preloads delayed the hero. Final image priorities and bounded fixed-logo srcsets correct that issue. After high-DPR checks exposed a larger full-size screenshot derivative, Home and Restaurant were remeasured with the original-WebP fallback; the five unchanged pages retain their prior results. Superseded candidate reports remain available separately rather than being mixed into those affected-page medians.

## Measurements

Before -> after. Transfer uses decimal kB, including the resources Lighthouse actually loaded (not all public source artwork). All 56 baseline/selected-final samples are retained in `performance-audit-2026-11-08-results.json`, including timestamps, CPU benchmark indices and warning counts. Superseded candidates remain separately in the raw local audit directory.

### Mobile medians

| Page | Performance | FCP (s) | LCP (s) | TBT (ms) | Transfer (kB) |
| --- | --- | --- | --- | --- | --- |
| Home | 75.5 -> 51.5 | 1.59 -> 2.57 | 3.54 -> 4.93 | 465 -> 6721 | 947.1 -> 540.6 |
| E-Commerce | 84.0 -> 87.5 | 1.23 -> 1.25 | 3.00 -> 2.85 | 352 -> 273 | 289.3 -> 270.2 |
| Restaurant | 78.5 -> 84.0 | 1.56 -> 1.43 | 3.77 -> 3.41 | 363 -> 249 | 568.5 -> 399.7 |
| Hotel | 87.0 -> 88.0 | 1.25 -> 1.26 | 3.12 -> 3.01 | 247 -> 230 | 336.9 -> 327.7 |
| Digital Marketing | 85.0 -> 80.5 | 1.23 -> 1.24 | 2.99 -> 2.88 | 327 -> 514 | 284.3 -> 263.0 |
| Pricing | 85.5 -> 85.0 | 1.23 -> 1.21 | 2.87 -> 2.74 | 314 -> 360 | 261.4 -> 237.8 |
| Contact | 85.0 -> 78.5 | 1.22 -> 1.15 | 2.93 -> 2.87 | 344 -> 602 | 271.2 -> 247.5 |

### Desktop medians

| Page | Performance | FCP (s) | LCP (s) | TBT (ms) | Transfer (kB) |
| --- | --- | --- | --- | --- | --- |
| Home | 96.5 -> 98.5 | 0.40 -> 0.39 | 1.09 -> 0.82 | 41 -> 54 | 1037.8 -> 556.1 |
| E-Commerce | 98.5 -> 98.5 | 0.33 -> 0.31 | 0.77 -> 0.72 | 66 -> 77 | 289.3 -> 261.2 |
| Restaurant | 99.0 -> 99.0 | 0.37 -> 0.38 | 0.79 -> 0.78 | 31 -> 35 | 568.5 -> 458.6 |
| Hotel | 99.0 -> 86.5 | 0.31 -> 0.37 | 0.79 -> 0.80 | 43 -> 270 | 336.9 -> 296.1 |
| Digital Marketing | 99.5 -> 88.5 | 0.30 -> 0.41 | 0.71 -> 0.81 | 32 -> 195 | 279.3 -> 252.4 |
| Pricing | 100.0 -> 96.5 | 0.30 -> 0.38 | 0.68 -> 0.79 | 42 -> 110 | 261.4 -> 233.5 |
| Contact | 99.5 -> 94.0 | 0.28 -> 0.33 | 0.70 -> 0.78 | 38 -> 156 | 271.2 -> 243.2 |

Every baseline/final run: CLS 0; accessibility, best practices and SEO 100.

The clearest deterministic gains are delivery size: homepage mobile transfer is down **42.9%**, restaurant mobile transfer **29.7%**. Initial route JS gzip decreases from **186,993 to 181,092 bytes** (5,901 bytes / 3.2%); Contact decreases from 189,523 to 183,622 bytes. There is one fewer initially loaded JS chunk. This is not a claim that 3.2% less JS guarantees a better TBT score.

The tradeoff is explicit: homepage uncompressed HTML grows from 112,891 to 169,858 bytes because native responsive images include srcsets in HTML/RSC. Its gzip body is 19,412 bytes after optimization; baseline Lighthouse document transfer was 17,643 bytes including headers. Those last two numbers are not identical measurement boundaries and should not be directly subtracted. Total Lighthouse transfer above includes the net result.

No universal Lighthouse/Core Web Vitals pass is claimed. Six of seven mobile LCP medians improve; Home is slightly slower. Some mobile and resumed desktop blocking-time results regress. Further CPU wins need controlled profiling on the deployment/device without shortening the preserved effects.

## Changes made

### Responsive image delivery, without changing artwork

- Replaced unoptimized full-size platform PNG delivery with responsive Next-optimized WebP at quality 90. Logo colours, transparency, proportions, optical scaling and CSS dimensions are unchanged. Original files remain untouched.
- Homepage dashboard screenshots use responsive widths/quality 90 and native below-fold lazy loading, rather than eagerly downloading all five 1600-pixel originals. At full size, both dashboard showcases use the already-compressed original WebP through its immutable static-import URL instead of a larger recompressed/upscaled variant. Intrinsic width/height and existing frame aspect ratios remain in place.
- All service hero logos remain eager, including logos used in animated phases. Banner logos are also eager so subsequent phases do not wait for lazy loading. Their low fetch priority prevents decorative artwork from outranking CSS/fonts and the text LCP. Restaurant's five switchable reports remain eager at low priority so selection stays immediate.
- The fixed Straty avatar uses a responsive 64-pixel slot rather than downloading the 320-pixel source everywhere. The same server-rendered avatar is passed into the existing client dialog/launcher; enquiry state, consent, focus and feedback behaviour are unchanged.
- Added small optimizer widths for real logo slots. Fixed-logo srcsets retain responsive candidates through at least 4x slot density, without serializing a full viewport-wide list on every conveyor copy. Large screenshot srcsets are not clamped to logo sizes.
- WebP is deliberately used here; adding AVIF blindly would add cold encoding cost and require separate fine-text/alpha quality validation. Browsers without WebP support can still use Next's source-format fallback. SVGs stay vector assets.

### Less image hydration and reusable delivery logic

`components/shared/StaticImage.tsx` uses Next's documented `getImageProps` on the server, returning a native responsive image. It removes a separate client Image controller/state instance per artwork and keeps asset sizing/optimizer behaviour in one helper. It deliberately excludes blur placeholders and load/error callbacks, which require a client component.

No animation library, dependency, JS scroll loop, loading overlay, prefetch-all navigation system or delayed-interaction loader was added. Existing route code splitting, static rendering, passive/rAF-coalesced header scrolling and IntersectionObserver motion handling were already suitable and were retained.

### Caching that still notices new/replaced logos

- Both client and platform folders share content-hash fingerprinting. Replacing a file under the same name creates a new URL; unchanged files keep their URL across redeploys even when filesystem timestamps change.
- Fingerprinted `/clients/` and `/Brand/` originals receive `public, max-age=31536000, immutable`. Bare filenames retain revalidation; page HTML and enquiries are not given unsafe long-lived caching.
- HTTP checks confirmed optimized WebP delivery and a repeated optimizer `HIT`. Optimized variants inherit the versioned source's one-year cache lifetime (Next returns `must-revalidate`, not `immutable`, for its optimizer response).
- Folder discovery remains automatic. Production still requires rebuild/redeploy after file changes; this is not a live-upload CMS. No logo manifest was introduced.

### Verified dead code removed

An import-reference graph from App Router entry points, followed by repository reference searches, found these files unreachable:

- `components/shared/Faq.tsx`
- `components/shared/Metrics.tsx`
- `components/shared/IndustryVisual.tsx`
- `components/shared/IndustryVisual.module.css`
- `components/shared/PlatformMarks.tsx`

They were not rendered by any current page. They were already tree-shaken, so their removal is a maintainability improvement, not claimed as bundle savings. No active service content, original artwork, runtime dependency, working feature or global style block was deleted speculatively. All installed runtime dependencies remain used.

## Animation and design preservation

All 27 active CSS files are byte-identical to the audit baseline. The only removed stylesheet belonged to the unreachable IndustryVisual component. No keyframe, duration, delay, easing, sequence, transition, hover treatment, layout breakpoint or animation visibility rule was edited.

The native images retain existing classes, wrappers, dimensions and aspect ratios. Existing hero/banner synchronization, gradients, dashboard text motion, client choreography, orbit, report switching, sticky approach headings, navigation, footer and Straty remain present. Screenshots and animation signatures are checked separately from performance runs; animation pausing for deterministic comparison is test-only, not shipped behaviour.

## API and deployment review

There is one enquiry API and no database/query layer in this project. Its existing warm SMTP pool already avoids unnecessary DNS/TCP/TLS/authentication work. It was retained; validation, rate limits, recipient acceptance checks, HTML template/source labels and honest success/error semantics were not changed.

Consent-false production POST probes returned 400 with `Cache-Control: no-store`; no mail was sent. Mocked automated/browser tests cover both interfaces without contacting Gmail. Validation-only latency is not SMTP delivery latency: a first Gmail handshake, provider response or serverless cold start can still take seconds. The API must not return success before Gmail accepts the message merely to appear faster.

All seven public pages remain prerendered; only `/api/enquiry` needs dynamic Node.js execution. Keep Next's image cache persistent across production instances/deployments where the host supports it, use a correctly configured CDN/Next image service, and retain upstream cache/query keys and WebP content negotiation. A static-only host cannot run SMTP or the default Next image optimizer. Existing per-process enquiry limits still need edge/shared rate limiting for a multi-instance deployment (see `email-setup.md`).

## Verification executed

- Production build: passed, all 16 generated outputs completed; Home, service pages, Pricing and Contact retain static/SSG rendering.
- Lint: passed with zero warnings. Type check: passed.
- Automated tests: 10 Node tests plus the page-bootstrap regression script passed. Added coverage for folder inclusion/order, content fingerprints, safe immutable-cache rules, native responsive sizing, fixed-logo density limits and original-at-full-size screenshots. Node's existing experimental TypeScript loader/module-detection warnings are test-tooling warnings, not production build failures. The expected mocked SMTP failure case logs an error without sending mail.
- Production dependency audit: zero known vulnerabilities; no dependency upgrades/removals were needed or forced.
- Responsive/a11y: 84 layout checks (seven pages x 12 widths, 320-1920 px) passed without horizontal overflow, clipped/overlapping primary headings or missing navigation. Axe reported zero violations in 14 desktop/mobile checks. This is automated coverage, not a complete WCAG or screen-reader certification.
- Functional browser smoke: 21 assertions passed for desktop/mobile navigation and Escape, buddy service selection/consent/success focus, contact preselection/consent/success/error focus, enquiry source labels, all five restaurant report selections and continuous digital orbit motion. API responses were intercepted in the browser: no real email was sent.
- Images/visual preservation: all images loaded successfully in 14 route/viewport captures; above-fold images were complete. All animation signatures matched the baseline, including names, counts, durations, delays, easing, iteration counts and direction. After the final full-size fallback, all four affected Home/Restaurant captures were rechecked, still with zero broken images and matching signatures. All 27 active CSS hashes are unchanged; all 43 inventoried source assets retain their original file sizes and were not edited.
- Full-page image payload at DPR 1.75, after scrolling: Home mobile 701,450 -> 319,898 bytes; Home desktop 846,174 -> 536,510; Restaurant mobile 312,456 -> 149,358; Restaurant desktop 312,456 -> 301,910. These are image-resource bytes only, measured separately from Lighthouse's initial-load totals. The final high-DPR captures confirm that full-size screenshots use immutable original WebP URLs, while mobile uses smaller derivatives.
- Final actual-network stress: 390 x 844/DPR 1.75, 150 ms latency, 1.6384 Mbps down, 4x CPU, motion enabled. Five-second down/up scroll produced 200 frame intervals: p50 16.7 ms, p95 49.9 ms, worst 267.2 ms; two observed long tasks (89/61 ms). The buddy still opened afterward; its lab click event duration was 304 ms. No runtime exceptions. These results expose remaining frame/interaction delays; they do not demonstrate continuous 60/120 FPS or field INP. An earlier same-config stress sample was worse (p95 181.4 ms), reinforcing that workstation timing varies.

Browser evidence directories under `C:/Users/rinas/AppData/Local/Temp/`: `se-readability-VKqyyg` (functional), `se-readability-oCKmiv` (84 layout/axe), `se-readability-t92H7W` (all-page image/motion captures), `se-readability-1cMJQY` (final affected-page captures), `se-readability-i3HdWb` (final stress). Baseline captures: `se-readability-wG0bJX`.

## Remaining bottlenecks and limits

- Not every lab score improves. Repeated mobile TBT is noisy and some routes regress in the final samples despite smaller downloads. The tables report those regressions instead of claiming a universal Core Web Vitals pass.
- A final Home mobile sample is particularly poor (score 31, LCP 6.22 s, TBT 12.845 s); its companion run on the same code scores 72 with LCP 3.64 s/TBT 0.596 s. Both are retained, not replaced with better scores. A read-only host check during that batch showed approximately 900 MiB free out of 8 GiB physical memory. Resource pressure and CPU variability make causal timing claims unsafe; they do not prove that every regression is environmental. This is not an all-clear performance certification.
- Mobile LCP/TBT targets are not met everywhere. The homepage LCP is hero copy with a substantial existing element-render delay; animated gradients, glass, layout and the preserved entrance sequence remain material main-thread/rendering costs. This audit did not shorten or remove them to game Lighthouse.
- Server-native responsive images trade a somewhat larger HTML/RSC payload for less client image code/state. The homepage raw HTML increases because repeated artwork includes srcsets; transfer and initial JS measurements below expose that tradeoff.
- Native lazy loading avoids initial screenshot downloads but a newly requested derivative still needs a first encode; browser cache hits do not establish cold production-edge performance. Optional deployment cache warming should be tested on the actual host.
- Field INP and real-user Core Web Vitals require production traffic/CrUX or a separately approved analytics setup. TBT and scripted event timings are lab diagnostics, not field INP. No new third-party telemetry was installed.
- Real iOS/Android hardware, Safari, Firefox, production CDN geography, Gmail delivery time/inbox placement and guaranteed 120 FPS were not verified. Responsive Chrome emulation and workstation frame samples cannot establish those guarantees.

## Reproduce

Start the production site after `npm run build`:

```powershell
npm run start -- --hostname 127.0.0.1 --port 3100
node scripts/performance-audit.mjs --lighthouse=<path-to-lighthouse/cli/index.js> --output=<new-results-directory> --repeats=2
node scripts/verify-readability.mjs http://127.0.0.1:3100 --strict
npm run lint
npm run typecheck
npm test
```

The Lighthouse runner uses external tooling rather than adding a production dependency. Optional `--route=/contact`, `--mode=mobile` and `--resume` support targeted runs or continuing the same build after a tool failure. Do not resume into a directory from a different build or mix test settings. Full raw local reports: `C:/Users/rinas/AppData/Local/Temp/se-performance-37bb48b4/baseline` and `optimized-delivery-final`; earlier candidates are kept in sibling directories. The final directory explicitly reuses the five unchanged routes and remeasures both modified dashboard routes, as described above.
