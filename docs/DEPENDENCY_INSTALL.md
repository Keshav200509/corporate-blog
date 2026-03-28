# Dependency installation troubleshooting

If `npm install` fails in this environment, the issue is network policy, not project scripts.

## Why tests/lint/build currently fail
The commands `npm run lint`, `npm test`, and `npm run build` rely on `next` and `vitest` binaries from `node_modules/.bin`.
Without successful `npm install`, these binaries do not exist, so shell errors like `next: not found` appear.

## What was verified
- With proxy vars enabled, npm requests return `403 Forbidden` from registry.
- With proxy vars disabled, npm requests fail with `ENETUNREACH`.

## Required fix outside codebase
- Allow npm package download through your network policy/proxy for `https://registry.npmjs.org`.
- Then run:

```bash
npm install
npm run lint
npm test
npm run build
```

## Optional hardening
After successful install on a trusted machine:

```bash
npm install --package-lock-only
```

Commit the generated `package-lock.json` to improve CI reproducibility.
