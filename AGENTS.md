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
