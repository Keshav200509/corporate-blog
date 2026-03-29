# Netlify deployment guide

This project is configured for Next.js deployment on Netlify.

## 1) Build settings

If Netlify UI asks:

- Build command: `npm ci && npm run build:netlify`
- Publish directory: `.next`
- Node version: `22`

These are also codified in `netlify.toml`.

## 2) Required environment variables

Set these in Netlify **Site settings → Environment variables**:

- `DATABASE_URL`
- `JWT_SECRET`
- `NEXT_PUBLIC_SITE_URL`

Notes:
- `JWT_SECRET` must be at least 32 chars.
- Never commit secret values to git.

## 3) Pre-deploy local verification

```bash
npm ci
npm run check:package-json
npm run lint
npm test
npm run build
```

Optional single command:

```bash
npm run verify
```

## 4) If Netlify shows EJSONPARSE

It means `package.json` is invalid JSON.

Use:

```bash
npm run check:package-json
```

If invalid, restore file and re-check:

```bash
git checkout -- package.json
npm run check:package-json
```

## 5) Trigger deploy

- Push to branch connected to Netlify, or
- Open a PR for Deploy Preview.

Netlify will run the command from `netlify.toml`.
