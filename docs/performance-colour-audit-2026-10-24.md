# Colour and performance audit - 24 October 2026

Applied the repository's `web-quality-audit` skill. Baseline: 1.4.13; handoff:
1.4.14. Preserved the published robot, rig, cursor interaction, business figures,
metrics approval setting, original platform assets and separate service pages.

## Changes

- Added static terracotta, sand, botanical and teal paper surfaces and restrained
  accents below the black-and-silver home hero. No animation dependency, animated
  blur or new JavaScript render loop was added.
- Removed the SVG brush, its controller and obsolete brush regression script.
  It delayed each document request by approximately one second, then spent
  another second revealing the destination. Native document links replace the
  interceptor; the website has not been converted to SPA navigation.
- Removed hydration-dependent reveals from service hero visuals and the service
  headline entrance animation. Above-the-fold content can paint immediately.
- Kept the scene preload but yielded two rendering opportunities before mounting
  the heavy 3D runtime. Existing offscreen/reduced-motion lifecycle handling stays.
- Removed effect-driven extra renders in the opening/headline/header. A paused
  headline cannot remain stuck in its outgoing transparent phase.
- Kept the preloaded local font, using `font-display: optional` to avoid a late
  font swap. On a slow first visit the metric-adjusted fallback may remain for
  that visit. Darkened small captions for the new backgrounds.
- Added a repeatable ESLint command with official Next.js rules and axe checks.
  The compiler remains TypeScript 7.0.2; lint's API dependency uses Microsoft's
  TypeScript 6 compatibility package, tested at 6.0.3.

### Follow-up refinements in this session

- Top-aligned digital marketing copy, reduced top padding to 24-48px and capped
  the orbit column at 460px instead of letting it vertically centre the copy.
- Reduced metric figures to a shared responsive 24-32px scale on home and all
  service pages, with service-specific colours and tighter spacing. Values and
  approval gating were not changed.
- Added an accessible 44px Instagram icon link below the footer wordmark. The
  wordmark has a subtle seven-second, transform-only 1.025x breathing animation;
  reduced motion disables it.
- Home and navigation-logo links scroll to the top without reloading when
  already home. Preventing mobile-menu focus from scrolling fixes the competing
  scroll position during menu dismissal. Other pages still navigate normally.
- The opening is now refresh-only, not shown on direct navigation or Home clicks.
  Reduced motion skips it, and back-forward-cache restoration clears its trigger.

## Production measurements

Representative route: `/services/restaurant-consulting`, not the robot homepage.
Lighthouse 13.5.0, Chrome 155, local Next.js production server. Mobile used the
default 412x823 viewport, DPR 1.75, simulated 150ms RTT / 1,638.4Kbps / 4x CPU.
Desktop used Lighthouse's desktop preset. These are lab results, not field data.

| Measurement | Mobile baseline | Mobile after: three runs | Desktop after |
| --- | ---: | ---: | ---: |
| Performance | 68 | 88 / 81 / 73; median 81 | 97 |
| LCP | 3,289ms | 3,019 / 3,049 / 3,270ms | 735ms |
| Total blocking time | 997ms | 240 / 416 / 652ms | 146ms |
| Layout shift | 0 | 0 / 0 / 0 | 0 |
| Total transfer | 285,286B | 278,691 / 278,691 / 278,700B | 272,260B |

Accessibility, best-practices and SEO scores were 100 in these runs. A second
baseline scored 58 with a 0.150 font-related layout shift while a separate live
robot test was running; it is not used as a clean comparison. Timing varies with
machine load. There is only one uncontended baseline, so this is not a controlled
statistical experiment, nor a claim that every route scores 97.

Ten production navigation checks measured click-to-document-request delay:
baseline median **1,027ms**, final median **33ms** (range 18-49ms). This measures
request initiation, not complete destination loading. The remote scene was held
pending for this navigation-only check, equally before and after. Ten additional
checks passed with framework JavaScript blocked.

### Robot limitation

The actual, unblocked scene loaded and animated. Its head responded to the
cursor; touch retained live animation without cursor tracking. Offscreen stop,
visible resume and reduced-motion stop all passed against the production build.

The homepage still loads approximately 3.6MB of decoded JavaScript, mostly the
3D runtime. Unthrottled, DPR-1 software-WebGL mobile samples were unstable:
baseline LCP 1.52-1.95s, after 1.75-3.98s; model readiness 6.46-6.69s before and
4.20-8.65s after. This does **not** establish a homepage loading improvement.
Full homepage Lighthouse attempts stalled/closed under software WebGL and did
not produce a usable score. No homepage Lighthouse score or 120 FPS guarantee
is claimed. Editable scene/export optimisation and real-device GPU profiling
remain the highest-value next steps; the model was not replaced to obtain scores.

## Verification and limits

- Initial audit: production build, ESLint with zero warnings, TypeScript check
  and production dependency audit passed; zero reported production vulnerabilities.
  One build encountered sandbox worker `EPERM`; its permitted retry passed.
- Final production colour artifact: 72 layouts across six routes, at widths
  320, 360, 390, 430, 600, 768, 820, 1024, 1180, 1280, 1440 and 1920 passed.
  Twelve desktop/mobile axe scans reported no automated violations.
- Latest follow-ups: repeated 72 layouts and twelve axe scans on the existing
  development server, plus metric sizing, digital top spacing, Instagram target,
  reduced-motion logo, live logo transform, seven headline phrases, stable title
  layout, keyboard menu containment/Escape, moving ticker and restored-scroll
  image-loading checks. No uncaught errors or lazy-LCP warnings were recorded.
- Home/logo scroll, no reload, refresh-only opening and reduced-motion opening
  checks passed separately at 390px and 1440px. Latest TypeScript check passed.
- **At the user's subsequent request, build and lint were not rerun for the
  latest follow-ups.** Production performance figures above predate those edits;
  no performance claim is derived from the development preview.
- Axe marks gradient contrast as requiring manual review. The updated muted
  caption colour `#555D59` has at least 5.06:1 contrast on the new light endpoints;
  the service accent text also exceeds 4.5:1. This is not a full WCAG certification.
- Real phones, Safari/Firefox, screen readers, field INP, and form submissions
  were not tested. Existing CSP absence and requested continuously moving ticker
  without a manual pause control remain outside this change; reduced motion works.

## Reproduce

Only run build/lint when separately authorised under `AGENTS.md`. Once a production
server is running, the checks are:

```text
npm run typecheck
node scripts/verify-content-colour.mjs http://localhost:3126
node scripts/verify-navigation.mjs http://localhost:3126
node scripts/verify-navigation.mjs http://localhost:3126 --block-framework
node scripts/verify-site.mjs http://localhost:3126 robot --motion-only
node scripts/audit-site.mjs http://localhost:3126 runtime --mobile-only --metrics-only --repeat=2
```

Browser scripts print temporary report/screenshot directories. Key final artifacts
in this session: `se-content-colour-csuATk` (production), `se-content-colour-QMtZds`
(latest preview), `se-navigation-lobabI` (production timing), `se-navigation-rX1B5T`
(Home/refresh), and `strategy-experts-premium-final-motion-SzULLV` (live robot).

Implementation references: [Next.js ESLint configuration](https://nextjs.org/docs/app/api-reference/config/eslint),
[Microsoft's side-by-side TypeScript setup](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/#running-side-by-side-with-typescript-60),
and [Chrome's optional-font preload guidance](https://web.dev/articles/preload-optional-fonts).
