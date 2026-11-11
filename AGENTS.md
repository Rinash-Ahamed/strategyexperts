# Repository instructions for coding agents

These instructions apply to the entire repository.

## Automatic versioning

- Every completed agent-authored change must increment the project version before handoff.
- Use semantic versioning based on the impact of the completed task, not its line count:
  - Patch: bug fixes, performance/accessibility improvements, styling or copy adjustments, dependency maintenance, refactors, tests and documentation without a new feature or breaking change.
  - Minor: a new backward-compatible page, feature, integration or substantial new user-facing capability.
  - Major: an intentionally breaking change to an existing public contract, URL, integration, required configuration or supported workflow. A visual revamp alone is not a major release.
- Honour any explicit version/release instruction from the user. If a change's compatibility impact is unclear, explain the uncertainty before choosing a major release; do not infer a breaking change from task size alone.
- Keep the root `version` fields in `package.json` and `package-lock.json` synchronized.
- Prefer `npm version patch --no-git-tag-version` (or the corresponding `minor`/`major` command) so npm updates both files consistently.
- Perform the version increment after all other edits so one agent task produces exactly one version bump.
- Do not create a Git commit or version tag unless the user explicitly requests it.
- If a task makes no repository changes, do not increment the version.
- In the handoff, state the resulting version and briefly explain why that release level applies.

## Verification

- After changing the version, confirm that `package.json`, the top-level `package-lock.json` version, and `packages[""]` in `package-lock.json` all match.
- Do not run build or lint commands unless the user explicitly asks for them in the current request.
- Do not treat a general request to implement, fix, or verify something as permission to run build or lint.

## Folder-driven logo libraries

- Client logos are discovered from `public/clients` by `lib/logo-library.ts`.
- Homepage service-banner logos are discovered from the matching `public/Brand/Restaurant`, `Hotel`, `Ecommerce`, or `DigitalMarketting` folder.
- PNG, JPG/JPEG, WebP, AVIF and SVG files are included automatically. Use descriptive filenames for accessible names; preserve original brand colours and proportions.
- Do not add manual image imports or a separate logo manifest for new assets. Existing name overrides are optional accessibility refinements, not an inclusion list.
- PDFs are source artwork, not browser logos. Convert and visually verify requested artwork before removing source PDFs, and only remove sources when the user authorizes it.
- Folder discovery runs during server rendering: refresh in development; rebuild/redeploy production after adding, replacing or removing files. This is not a live-upload CMS.
- Preserve the build-time logo derivatives in `lib/logo-variants.ts` and `scripts/prepare-images.mjs`. Generated variants are not a manual logo manifest. Keep originals intact, retain transparent backgrounds and existing quality levels, and pass discovered variants to every logo consumer. Use `npm run build` so preparation precedes production asset packaging. Unprepared imagery must retain Next optimization; do not disable it globally.

## Current architecture and visual contract

- Read `README.md` before changing structure or deployment behaviour. Detailed service content is in `lib/service-details.ts`; shared identity, contacts and service metadata are in `lib/site.ts`. Some section copy is colocated with components.
- Preserve native page navigation and four separate service routes. Product opens an external dashboard in a new tab; do not describe that dashboard as functionality implemented here.
- The hero is currently text-led. The robot, opening screen and earlier brush implementations are historical, not features to restore without a new request.
- The hero background and service icons stay lavender. Preserve background motion, but do not restore the removed green/teal colour cycle without a request.
- Preserve the black/lavender/teal identity, gradient timings, icon synchronization, banner, client choreography, report switching and reduced-motion behaviour unless explicitly asked to change them. The scrollbar stays lavender, independent of the hero colour cycle.
- Our Approach has been removed from all four service pages; do not restore it without a request. The homepage approach section remains. Supplied service process copy is retained as source content in `lib/service-details.ts`.
- Keep text readable and free of clipping. Prefer scoped CSS and inspect stylesheet import order in `app/layout.tsx` before adding global overrides. Do not add animation dependencies or per-frame React state for decorative motion.
- Restaurant reports are Daily, Payout, Ticketing, Leaderboard, Visibility. Preserve five-second rotation, manual controls, reduced-motion support and off-screen/interaction pausing. Do not restore captions beneath images without a request.
- Impact counters retain source values/suffixes, stable width and accessible final text. Restaurant impact claims are in `lib/service-details.ts` and are not gated by the legacy `NEXT_PUBLIC_SHOW_METRICS` flag. Never invent figures, testimonials or endorsements.
- Both TypeScript packages have tooling consumers; verify compiler/framework usage before declaring either unused.

## Enquiries and secrets

- Never read or print `.env.local` or secret files just to inspect configuration. Use `.env.example` and named presence checks that do not reveal values. Keep secrets out of logs, reports, screenshots, docs and archives.
- SMTP credentials stay server-only, without `NEXT_PUBLIC_`. If a credential is shared, do not echo it: advise revocation/replacement and restart/redeploy after rotation. Never silently rotate account credentials.
- Contact and Straty use `/api/enquiry`. Preserve consent, validation, size limits, escaping, fixed recipients, source labels, Reply-To and honest success/error semantics. SMTP acceptance is not proof of inbox delivery.
- Automated enquiry tests mock SMTP. Do not send actual enquiries/email, alter credentials or mutate production data without explicit authorization.
- Hosting needs Node.js, outbound SMTP and Next image optimization. In-process enquiry limits need edge/shared protection for multi-instance deployments; do not present them as distributed rate limiting.

## Audits and handoff

- A request to review/check is read-only unless fixes are also requested. Preserve user-owned dirty-worktree edits; never reset the repository to obtain a clean baseline.
- Reuse previews where possible. Never kill unrelated servers, delete Next lockfiles or start competing dev servers to bypass a lock.
- Measure performance only on production builds. Prior build/lint permission or README commands do not authorize a fresh build/lint run in a later request.
- Report actual commands, measurement conditions, warnings and untested areas. Distinguish mocked SMTP, local browser checks, real inbox delivery and deployed performance. Do not guarantee FPS or blanket security/accessibility compliance.
- Historical audit reports describe their measured versions, not automatic certification of the current tree. Do not present old scores as current results.
- For release reviews, check representative mobile/tablet/desktop layouts, links, artwork, metadata and enquiry states in proportion to scope. Use existing tools; do not install dependencies or a new audit framework without authorization.
- Documentation must match current code. Keep credentials and machine-specific temporary paths out of durable docs. Link to `docs/email-setup.md` for SMTP details and identify unresolved deployment requirements honestly.

## Temporary audit cleanup

- After browser checks or audits, remove temporary directories created by the agent for that task, including disposable browser profiles, caches, screenshots and reports. Keep only artifacts the user explicitly asks to retain, copying them to the agreed destination before cleanup.
- Record the exact temporary directory when creating it. Before recursive removal, resolve its absolute path and verify it is the task-owned directory inside the intended temporary root, not the root itself. Never select deletion targets using broad prefixes, wildcards or an age-based sweep.
- Close and wait for the task's own browser/helper processes to exit before cleanup. Use a finally/cleanup path for success and failure, including one-off audit commands, so normal failures do not leave profiles behind. Do not stop unrelated processes or delete personal browser profiles.
- Do not remove pre-existing audit folders, unrelated Temp files or user-owned artifacts without separate authorization. Respect filesystem approvals and any later user instruction revoking cleanup.
- If cleanup is blocked by permissions or locked files, report the remaining directory and reason; do not broaden deletion scope or bypass a denial. Confirm what was removed at handoff and do not claim cleanup succeeded without verifying it.
