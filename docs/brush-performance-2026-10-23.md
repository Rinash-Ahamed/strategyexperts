# Brush navigation performance - 23 October 2026

## Cause and scoped changes

Previously the full-document arrival reveal was owned by a React layout effect.
The server-rendered brush stayed covered until framework JavaScript downloaded,
executed and hydrated. This was additional to the reference's intentional
one-second draw and one-second erase. Development-mode route compilation can add
further delay and is not a valid production performance baseline.

The transition is now server-rendered with a small inline, dependency-free
controller in `lib/brush-runtime.ts`. It starts the arrival erase when the document
is parsed, independently of React, remote assets and the robot. Existing SVG
paths, silver colours, reference timing, quadratic easing and simultaneous
stroke-width/dash animation are preserved. Navigation still replaces the document;
there is no SPA routing, content injection, model replacement or animation swap.

Intent-based native document prefetch now also handles touch pointer-down and
keyboard focus before hydration. Warming is bounded and respects data-saving
connections. Homepage 3D initialization waits until the incoming brush finishes,
then starts automatically using the existing idle scheduling. Already-loaded
robot animation and cursor interactions are unchanged.

## Production checks and limits

The user explicitly authorized production builds for this audit. Both before and
after builds passed; all content pages remain static/SSG. No lint command was run.
TypeScript, the standalone runtime's JavaScript syntax and the browser-check
script's syntax passed.

Tests used the same local production port, system headless Chrome, fresh browser
profiles, DPR 1, desktop 1440px and mobile 390px. There was no artificial network
throttling. These are single local samples per route/viewport, not field results,
Lighthouse scores, controlled repeated medians or a real-device frame-rate claim.

Across six service/contact navigations, the median positive delay between
DOMContentLoaded and arrival-state initialization changed from 146.8ms to 0ms.
The new controller initializes before DOMContentLoaded and schedules the actual
erase after parsing. This metric is controller readiness, not visual paint time.
Median destination-navigation-start to final idle changed only from 1451.8ms to
1418.4ms in these samples; a broad page-load speedup is not established.
The reference's two one-second animation phases remain intentional.

Executed checks:

- `node scripts/verify-brush.mjs http://localhost:3122 brush-before`: six passes.
- `node scripts/verify-brush.mjs http://localhost:3122 brush-after`: six passes.
- `node scripts/verify-brush.mjs http://localhost:3122 brush-independent --block-framework --include-home`:
  eight passes with 94 framework requests confirmed blocked. Drawing, thickening,
  erasing and actual document replacement work without framework hydration;
  no horizontal overflow or browser exceptions/console errors were recorded.
- `node scripts/verify-brush.mjs http://localhost:3122 brush-home-confirmed --include-home`:
  eight passes with framework JavaScript enabled, including both homepage arrivals.
  No robot canvas mounted during an arrival brush phase; no console errors were
  recorded. Both SVG path strings were separately compared with the supplied
  reference file and match exactly.
- `node scripts/verify-site.mjs http://localhost:3122 brush-regression`: passed.
  Original model loaded and animated; head/hand snapshots changed after cursor
  input. Menu focus handling, menu rendering lifecycle, reduced-motion behaviour,
  continuously running ticker, service navigation and all route statuses passed.
  Four homepage widths from 320px to 1440px had no horizontal overflow.
- Inspected desktop and mobile contact-page screenshots after the normal
  production transition.

An additional loaded-system run missed some fixed-wall-clock CDP draw samples.
The regression check was corrected to observe the source document's actual
stroke mutations before navigation, rather than guessing animation progress from
external timers. The subsequent eight-case normal-framework run passed. Sparse
software-rendered animation samples and variable response times still prevent
claiming real-device smoothness or a general load-time improvement.

The model/runtime still has substantial startup cost. This change prevents its
initialization from competing with the incoming brush; it does not make the 3D
asset cheaper or guarantee seamless motion on all hardware or slow connections.
No deployment or contact delivery was performed. Temporary browser profiles and
screenshots are audit artifacts outside the repository.
