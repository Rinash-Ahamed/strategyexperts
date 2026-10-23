# Clarity and motion pass - 23 October 2026

## Design and scope

Applied the repository web-quality skill. Preserved the original Spline model,
rendering setup, cursor interactions, separate service pages, brand colours and
the optimized SVG brush controller from version 1.0.22. The removed hero graphic
was the separate curved SVG line crossing the two footer labels, not the page
transition brush. The labels remain and are no longer hidden from screen readers.

Section spacing now uses shared responsive tokens: 56-112px for major sections,
40-72px for compact sections, and 56-100px for service features. Previous major
section spacing reached 180px. Heading line-height and wrapping, content gaps,
intro padding, process rows, contact and footer spacing were tightened without
changing content or routes. Existing hero model framing is unchanged.

Replaced section-boundary rules with selected treatments: a rounded paper intro,
an uninterrupted commerce composition, a silver hospitality blend, an asymmetric
graphite hotel panel and restrained ambient gradients for digital/CTA areas.
Functional dividers inside lists, navigation, forms and FAQs remain for clarity.
No decorative numbering or eyebrow labels were reintroduced.

New effects are static gradients and border radii, not animated blur, masks,
parallax or extra JavaScript loops. Removed the hero glow's blur filter and the
abstract rings' continuous pulse. Menus now use opacity/transform rather than a
full-screen clip-path animation. Reveals use a shorter 14px translation and 620ms
settle. Hover states no longer animate padding/gaps. Scrolling remains native,
including wheel, touch and keyboard input; reduced motion disables smooth anchor
scrolling and keeps reveal content visible.

## Verification and measurement limits

Production build permission was explicitly granted for this request. Optimized
builds and TypeScript passed; all content routes remain static/SSG. Lint was not
run. The six-route, nine-width production sweep completed 54 cases with no
horizontal overflow, one H1 per route and no recorded browser exceptions.

The full production regression passed: robot loading/animation, head and hand
cursor snapshots, menu keyboard containment/Escape/focus restoration, continuous
ticker, all route statuses and reduced-motion behaviour. Hero hover geometry
remained exactly 340.5625 x 62px with 0px left padding before/after hover at
1440px. Computed menu clip-path and hero glow filter are both `none`; reveal
transitions are `opacity, transform`. Both hero labels are present, exposed to
assistive technology and clear of the removed SVG. Inspected current desktop,
tablet, mobile, intro, service and graphite-panel screenshots.

The dedicated brush regression also passed all six desktop/mobile full-document
navigations with 74 framework requests deliberately blocked. Both draw/thicken
and erase phases remain intact alongside the new styles. Neither the brush
controller nor its SVG paths, timing, colours or integration was changed.

Native local production samples used headless Chrome, software WebGL and DPR 1.
They are single, non-controlled samples, not Lighthouse scores or real-device
frame-rate measurements. Desktop FCP/LCP was 3920ms before and 4376ms after;
mobile was 2608ms before and 1276ms after. Desktop CLS changed from 0 to 0.00025;
mobile remained 0. Startup long-task blocking sums increased in these samples
(6475 to 7301ms desktop, 4342 to 5145ms mobile). The script payload was unchanged
at 3,617,038 decoded bytes. These samples do not establish a general performance
improvement or a regression caused by the CSS changes.

The model remained visible and animated and stopped automatically off-screen in
both samples. Frame sampling produced only one or two frames over the observation
window; it cannot support 60/120 FPS claims. The original 3D runtime remains the
dominant cost and needs real GPU/mobile profiling for a reliable frame budget.
No model was substituted, hidden or reduced in quality to influence the result.

Artifacts are temporary local screenshots/JSON, not tracked assets. No deployment
or external enquiry was performed.

## Follow-up: disappearing brush after overlay replacement (1.0.24)

A later investigation reproduced a controller lifecycle bug on the development
server. A fresh document navigated correctly, but replacing the overlay DOM node
caused the existing document listener to draw into the detached SVG. Navigation
still completed, making the outgoing brush appear removed. This is a reproduced
failure mode consistent with hot updates, not an inspection of the user's own
browser session. Previous fresh-document checks did not exercise this lifecycle.

The controller now reconnects to the live overlay when necessary, including
mid-draw replacement, preserving its current pose. Connected frames only check
`isConnected`; the document is queried again only after detachment. No additional
animation loop, timing change, SVG replacement or reduced-motion override was
introduced. An already-open page running the old inline controller needs one
full reload to acquire this fix.

Verification was functional against the existing development server, not a new
production performance measurement. Before the fix, the one-case replacement
test failed while its fresh-document control passed. Afterwards six desktop/
mobile cases passed with overlay replacement before and during the draw and
framework JavaScript blocked. Two additional desktop/mobile cases with React
enabled confirmed the connected overlay had visible computed styles throughout
the observed drawing, successful erase and actual document navigation. No
exceptions or console errors were recorded. TypeScript and check-script syntax
passed. Build and lint were not run for this follow-up request.
