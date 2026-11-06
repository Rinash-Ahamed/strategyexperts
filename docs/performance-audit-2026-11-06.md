# Strategy Experts performance and cleanup audit

## Scope and conditions

Reviewed the homepage, four service pages, Pricing and Contact. Preserved content, page routes, the floating client gallery, platform ticker, navigation glass/curves, dashboard text motion, support buddy, contact channels and SMTP integration. No original artwork was modified or removed.

Measurements used the actual production build on localhost, headless Chrome, DPR 1, 390px and 1440px viewports, and two browser-cache-disabled samples per route/viewport. Server caches were not cleared. LCP was observed for two seconds after DOM readiness. These are local diagnostics, not Lighthouse scores, field INP, real-phone measurements or a guaranteed frame rate. Simultaneous processes and warm server/image caches affect timings.

## Confirmed bottleneck and fix

The nine client PNGs were downloaded unoptimized at 1254 × 1254 each even though displayed at roughly 130–156px. This added substantial below-the-fold transfer, image decoding and texture work.

| Client gallery, desktop DPR 1 | Before | After |
| --- | ---: | ---: |
| Encoded image payload | 11,221,494 bytes | 39,994 bytes |
| Requested bitmap dimensions per logo | 1254 × 1254 | 256 × 256 |
| Estimated RGBA bitmap storage, nine images | 56,610,576 bytes | 2,359,296 bytes |
| Logos retained | 9 | 9 |

Payload reduction: **99.6%**. The bitmap estimate is width × height × four bytes, not a process/GPU-memory measurement. Higher-DPR devices automatically request larger variants.

Enabled the existing Next.js responsive optimizer for this gallery with accurate `sizes`, lazy loading and unchanged artwork/proportions. No new dependency or manual logo manifest. File-size/mtime URL fingerprints invalidate optimized derivatives after a same-name artwork replacement and subsequent render/build. Production additions and replacements still require rebuild/redeploy, not a live-upload CMS.

## Other safe improvements

- Added the digital-marketing orbit to the existing off-screen/hidden-tab animation lifecycle. Its visible animation and manual pause control remain unchanged.
- Removed the unreferenced `GrowthPriorities` component and its private stylesheet.
- Removed the unreferenced `GrowthPath` component and only its unused rules from the shared industry stylesheet. Service photography and platform-logo styles remain.
- Removed the unused compact business-hours variant; the contact hours and Sunday arrow/Closed badge remain.
- Consolidated a duplicated Straty status selector without changing styling.
- Included Pricing in the existing production profiling script's default route list.
- Kept every dependency that has an active use. Did not blanket-delete global CSS or artwork based on a single viewport's coverage.

The unused components were already excluded by bundling; removing them is maintainability cleanup, not a claimed large JavaScript saving. Initial script gzip totals remained approximately 187 KB per page (Contact approximately 189 KB).

## Local loading observations

Mean mobile LCP from the two diagnostic samples, milliseconds:

| Page | Baseline | Optimized candidate |
| --- | ---: | ---: |
| Home | 1300 | 1048 |
| E-Commerce Support | 1744 | 496 |
| Restaurant Consulting | 444 | 378 |
| Hotel Revenue Management | 448 | 354 |
| Digital Marketing | 784 | 564 |
| Pricing | 866 | 506 |
| Contact | 566 | 504 |

Do not attribute these timing changes entirely to the fixes: most service-page loading code was unchanged, server image caches were warmer, and the samples varied. Desktop Digital Marketing LCP increased from 440ms to 708ms, while other readings varied. Homepage mobile initial blocking remained approximately 359ms versus 364ms baseline; this is not a clean sub-200ms claim. The repeatable improvement is the client-gallery transfer/bitmap reduction and avoided off-screen animation work. CLS was zero in all optimized loading samples; no runtime exceptions were recorded.

## Verification

- Production build and lint checked; TypeScript checked.
- Existing page-bootstrap and URL tests plus enquiry validation/SMTP-adapter tests passed. SMTP was mocked: no live email was sent.
- Seven routes × ten widths: 320, 390, 600, 768, 820, 1024, 1180, 1280, 1440 and 1920px. No document overflow, clipped primary heading or missing navigation detected.
- Fourteen axe WCAG A/AA checks across mobile/desktop: no violations. This does not replace manual screen-reader testing.
- Services dropdown and Escape behavior verified; orbit running while visible and paused off-screen verified.
- Client-gallery screenshot inspected with all nine optimized logos and existing floating design.

Artifacts for this run were saved outside the repository in Windows Temp:

- `se-baseline-4XYhPy/report.json` and `se-baseline-pricing-zA5a0P/report.json`
- `se-optimized-nkjPuB/report.json`
- `se-readability-11SxyT/client-payload.json` and `se-readability-3cgGgj/client-payload.json`
- `se-readability-pGe0cQ/responsive-report.json` and its client-gallery screenshot

## Remaining limits

No live deployment, slow network, real touch hardware, Safari/Firefox or field Web Vitals was measured. No guaranteed 120 FPS or zero-lag claim. The existing glass navbar and decorative effects were retained rather than removed for a synthetic score. For launch, collect field Web Vitals and test representative low-end phones. Gmail delivery still requires configured server credentials; per-process SMTP limits are not distributed anti-spam protection (see `email-setup.md`).
