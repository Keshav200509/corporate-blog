# Dependency installation troubleshooting

If `npm install` fails in this environment, the issue is often network policy, not project scripts.

## Why tests/lint/build fail when install fails
The commands `npm run lint`, `npm test`, and `npm run build` rely on `next` and `vitest` binaries from `node_modules/.bin`.
Without successful dependency install, these binaries do not exist, so errors like `next: not found` appear.

## JSON parse failure (`EJSONPARSE`) fix
If you see:

- `Invalid package.json`
- `Unexpected non-whitespace character after JSON`

Your local `package.json` was corrupted (usually accidental paste/merge debris).

Recover with:

```bash
git checkout -- package.json
npm run check:package-json
```

If this still fails, sync cleanly from your remote main branch:

```bash
git fetch origin
git checkout origin/main -- package.json
npm run check:package-json
```

## Registry/network-related failures observed in restricted environments
- With proxy vars enabled, npm requests may return `403 Forbidden`.
- With proxy vars disabled, npm requests may fail with `ENETUNREACH`.

## Required fix outside codebase
- Allow npm package download through your network policy/proxy for `https://registry.npmjs.org`.

Then run:

```bash
npm ci
npm run lint
npm test
npm run build
```

## Reproducibility hardening
- Commit `package-lock.json`.
- Use `npm ci` in CI for deterministic installs.
