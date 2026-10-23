# Brand assets, breadcrumbs and Spline compatibility

## Spline homepage message

The installed Spline runtime's schema converter emits
`updating from 114 to 134` when loading the published robot scene. Its current
reader expects schema 134; this is a scene-data migration in memory, not an npm,
project-version or Next.js update. The supplied `interactiverobot3dhero.txt`
reference uses the same published scene URL as `lib/robot.ts` and does not provide
the editable scene or a newer export.

To eliminate the conversion at source, the scene owner must open the same scene
in the current Spline editor and republish/export it, then supply the current
export URL/file. Preserve the head/hand rig IDs if republishing. Without that
asset, the existing compatible runtime and original model remain unchanged; the
warning has not been suppressed and no vendor package has been patched.

## Breadcrumbs

Previously Home had a centred 44px link target while sibling text/separators were
top-aligned flex items. The shared service breadcrumb now uses an ordered list,
centred items, grouped separators and a wrapping current-page label. Home retains
its 44px accessible target. Browser checks passed for all four services at 320,
390 and 1440px: 12 cases, correctly aligned items, current-page semantics and no
horizontal overflow. Inspected desktop and mobile breadcrumb screenshots.

## Monogram favicon

The original `public/SE Monogram Logo.png` is unchanged. Static icons are derived
by `node scripts/generate-brand-icons.mjs`, using installed Sharp: remove excess
white margins around the original glyphs, preserve antialiasing, add consistent
white padding, resize and compress. No AI-generated replacement was used.

- `app/favicon.ico`: 16/32/48px RGBA entries, 3,805 bytes.
- `app/icon.png`: 64px, 2,406 bytes.
- `app/apple-icon.png`: 180px, 10,300 bytes.

The former blue chart `app/icon.svg` was replaced by these assets. All three icon
routes returned HTTP 200 with correct image MIME types; page metadata references
the new icons. The initial indexed-PNG ICO was rejected by Turbopack's decoder;
the generator now explicitly uses RGBA PNG entries for ICO compatibility. Each
embedded image was decoded and verified as four-channel RGBA. Inspected the
generated monogram. Source PNG size remains 984,702 bytes.

TypeScript, script syntax and diff checks passed. No build or lint was run for
this task; browser verification used the existing development server, not a
production performance measurement.
