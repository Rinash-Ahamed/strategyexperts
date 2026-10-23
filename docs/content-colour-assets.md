# Content colour and asset register

## Brand assets

The site owner supplied and confirmed approval of the 16 original-colour logos in
`public/Brand/Ecommerce`, `Restaurant`, `Hotel`, and `DigitalMarketting`.
`lib/platform-assets.ts` records the original paths and intrinsic dimensions.
The originals are not altered, recoloured, cropped, or stretched. Next Image serves
responsive derivatives. References describe platforms covered by the existing
services, not partnerships, endorsements, accreditation, or certification.

## Industry photography

Downloaded 2026-10-23 from Unsplash and served locally as 1200 x 900 WebP files.
The [Unsplash License](https://unsplash.com/license) permits commercial use.
These are illustrative stock photographs, not Strategy Experts offices, clients,
projects, facilities or results. Visible captions make this distinction explicit.

| Local asset | Original source |
| --- | --- |
| `public/images/industries/commerce.webp` | https://images.unsplash.com/photo-1553413077-190dd305871c |
| `public/images/industries/restaurant.webp` | https://images.unsplash.com/photo-1517248135467-4c7edcad34c4 |
| `public/images/industries/hotel.webp` | https://images.unsplash.com/photo-1566665797739-1674de7a421a |
| `public/images/industries/commerce-service.webp` | https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da |
| `public/images/industries/restaurant-service.webp` | https://images.unsplash.com/photo-1414235077428-338989a2e8c0 |
| `public/images/industries/hotel-service.webp` | https://images.unsplash.com/photo-1566073771259-6a8506099945 |

Homepage and service photography use separate source sets, not renamed copies.
Photos retain natural colour without grayscale filters. Industry photographs use
explicit `loading="eager"` so a scroll-restored visit cannot identify a lazily loaded
photograph as its LCP. Service-hero photos use `fetchPriority="high"`; the three
homepage photos use `fetchPriority="low"` to yield to the high-priority robot scene.
This trades earlier discovery of those small local images for reliable restored
views without adding client-side visibility observers. Logo images remain lazy.
Image dimensions and aspect
ratios reserve layout space. No third-party image requests are needed at runtime.

## Visual language

- Obsidian and silver remain on the home robot hero and footer.
- Warm ivory `#F4F2ED` is the primary content surface.
- Cool mist `#D9E7E8` is limited to supporting sections.
- Platinum `#BFC0C2` remains available for subtle accents.
- Botanical `#315B50` is used sparingly for small markers, selected hover details
  and the qualitative growth-path illustration.

No new numerical results, case studies, or performance charts were invented.
The existing approval gate for business metrics is unchanged. The growth-path
illustration is a working framework, not a representation of measured results.
The original colour pass preserved the home robot, rig, renderer, headline,
opening sequence and brush transition. The 24 October performance follow-up
removes the brush with user approval, preserving native full-document links.
It adds restrained terracotta, sand and teal paper surfaces without recolouring
platform marks. See `performance-colour-audit-2026-10-24.md` for the audit.
