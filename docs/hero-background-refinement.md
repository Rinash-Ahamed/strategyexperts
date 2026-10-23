# Cinematic hero background refinement

## Scope

Background-only change to the homepage: replace the old lower glow/pseudo-element
with one static, feathered graphite halo and one static silver SVG arc. The halo
uses the brief's silver/graphite colour stops. The arc uses one Bezier path,
five fading gradient stops and a non-scaling 1.5px stroke. No duplicate bloom,
filter, texture, image, video, library, WebGL scene or animation loop was added.

Layer order is black base, halo (0), arc (1), robot (2), content (3). Both new
decorations are non-interactive and hidden from assistive technology. Existing
CSS black backdrops on the robot wrapper and canvas were made transparent; a
baseline canvas-edge probe returned transparent RGBA, so no renderer/scene API
change was needed. RobotHero, model URL, rig, camera, materials, lights, animation
and cursor logic are unchanged. The optimized page-transition brush is untouched.

The halo follows the existing robot region on tablet/mobile. The arc occupies a
lower clear band, with separate tablet/mobile and short-desktop positioning. No
hero height, grid, content, typography, navigation, links or CTA was changed.

## Verification

Used the repository web-quality skill. The deployed URL was inaccessible through
the web tool; checks used the local app. Production baseline and updated builds
were run. The updated build initially failed on a newly present local setting:
`NEXT_PUBLIC_SITE_URL=www.strategyexperts.in` is not a complete URL. The build
passed with a process-only override of `https://www.strategyexperts.in`. No
environment or metadata source file was changed. Future local builds need that
value to include its protocol.

- `npm run typecheck`: passed.
- `npm run build`: passed with the URL override above; routes remain static/SSG.
- Lint: no lint script/tool configuration is available; none was installed.
- `node --check scripts/verify-hero-background.mjs`: passed.
- `node scripts/verify-hero-background.mjs http://localhost:3124 halo-before`:
  baseline screenshots at desktop, tablet and mobile; original robot loaded.
- `node scripts/verify-hero-background.mjs http://localhost:3124 halo-after --after`:
  desktop 1440x1000, laptop 1440x800, tablet 820x1180 and mobile 390x844 passed.
  One arc path, correct stacking, no filter/background animation, pointer-events
  none, no protected-content overlap, no horizontal overflow, no runtime errors.
  Reduced-motion screenshot captured; the background is static in all modes.
- Compared baseline/new hero, robot and shell rectangles and brand/copy/service
  link rectangles: exact matches at the three shared viewport sizes.
- Inspected before/after, laptop, tablet and mobile screenshots. A first desktop
  capture had incomplete software-rendered tiles; the capture helper now takes
  a warm-up screenshot before saving the final image.
- Final warmed desktop retake (`halo-desktop-final --after --desktop-only`)
  passed and was visually inspected; full text/navigation and both effects
  rendered correctly.
- `node scripts/verify-site.mjs http://localhost:3124 halo-interaction --motion-only`:
  passed. Original robot loaded and animated; head/hand snapshots changed after
  pointer input; hero hover geometry stayed fixed; reduced motion retained the
  model, stopped animation and disabled tracking as before. No exceptions.

Checks used local headless Chrome with software WebGL and DPR 1. They establish
layout/functionality, not real-device smoothness, field performance or a frame
rate guarantee. No deployment, contact submission or external mutation occurred.

Runtime source changes: `app/page.tsx`, `app/globals.css`, `app/refinements.css`.
Supporting changes: this note, `scripts/verify-hero-background.mjs`, and the
required synchronized project-version fields in package.json/package-lock.json.
