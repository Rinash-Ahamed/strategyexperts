# Readability and layout pass

Used the repository web-quality-audit skill for a focused visual review of the current black/silver theme. Tested the existing development preview at localhost:3000; these are functional checks, not production performance measurements. Build and lint were not authorized for this request and were not run.

## Fixed

- Legacy light-service hero rules beat the monochrome base selector, leaving the first heading line dark on black and retaining a pale background gradient. The dark-theme selectors now match the original specificity; headings and captions have a consistent dark backdrop.
- Hotel's FAQ consultation link inherited a hard-coded brown accent (axe measured 2.88:1 on black). All four service themes now use the silver accent and graphite panel tokens consistently.
- The translucent sticky navbar allowed underlying page text to show through. Its scrolled background is now opaque graphite, without a backdrop filter.
- Form placeholders now have an explicit readable silver colour rather than relying on browser defaults.

## Verified

- Six routes at 320, 390, 768, 1024, 1280 and 1440px: 36 checks passed for page overflow, one primary heading, heading-to-copy overlap, heading clipping, navigation availability and heading colour contrast against the dark backdrop.
- Twelve axe scans (390 and 1440px on each route): zero automated violations after fixes. Gradient/image contrast can remain marked incomplete and is not claimed to be exhaustively verified by axe.
- Inspected desktop/mobile/tablet screenshots, including service heroes, contact form, cards, closing CTAs and footer.
- Existing editorial-motion regression passed: stationary card grids, subtle hover, touch and reduced-motion behaviour, image zoom, keyboard focus, and content visible without JavaScript.
- All 48 service CTA states (normal/hover/focus, two buttons, four services, two widths) passed; lowest measured button text contrast was 13.48:1.
- Type checking and opening-bootstrap unit checks passed; diff whitespace checks passed.

Reproduce with `node scripts/verify-readability.mjs http://localhost:3000 --strict` and `node scripts/verify-editorial-motion.mjs http://localhost:3000` against the current preview. Screenshots and JSON reports from this run are in the OS temporary folders `se-readability-gprWIF` (baseline), `se-readability-A5esGH` (final) and `se-editorial-KT4u3v`.

## Limits

No physical-device, Safari/Firefox, screen-reader or production-build verification was performed. Some supplied logos contain dark lettering that is difficult to distinguish on black; their approved colours/transparency were not altered and white backing tiles were not restored. Approved dark-background logo variants are the appropriate follow-up for those assets.
