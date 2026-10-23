# Repository instructions for coding agents

These instructions apply to the entire repository.

## Automatic versioning

- Every completed agent-authored change must increment the project version before handoff.
- Use semantic versioning. Unless the user explicitly requests a minor or major release, increment the patch version by one.
- Keep the root `version` fields in `package.json` and `package-lock.json` synchronized.
- Prefer `npm version patch --no-git-tag-version` (or the corresponding `minor`/`major` command) so npm updates both files consistently.
- Perform the version increment after all other edits so one agent task produces exactly one version bump.
- Do not create a Git commit or version tag unless the user explicitly requests it.
- If a task makes no repository changes, do not increment the version.

## Verification

- After changing the version, confirm that `package.json`, the top-level `package-lock.json` version, and `packages[""]` in `package-lock.json` all match.
- Do not run build or lint commands unless the user explicitly asks for them in the current request.
- Do not treat a general request to implement, fix, or verify something as permission to run build or lint.
