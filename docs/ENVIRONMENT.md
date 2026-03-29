# Environment Variables

This project expects environment variables in a `.env.local` file for local development.

## 1) Quick setup

```bash
cp .env.example .env.local

npm run env:check


```

Then fill in values.

---

## 2) Required variables (current code)

### `DATABASE_URL`
- Used by Prisma-backed services and public page guards.
- If missing, DB-backed routes/pages fall back to empty/public-safe behavior in several places.

Example:
```bash
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DBNAME?sslmode=require
```

### `JWT_SECRET`
- Used for access and refresh JWT signing/verification.
- Must be at least 32 characters.

Generate secure value:
```bash
openssl rand -base64 48
```

### `NEXT_PUBLIC_SITE_URL`
- Used for canonical URL generation and metadata.

Examples:
- Local: `http://localhost:3000`
- Production: `https://your-domain.com`

### `NODE_ENV`
- Standard Node runtime mode (`development` locally, `production` in deploy environments).

---

## 3) Recommended per environment

## Local (`.env.local`)
- `NODE_ENV=development`
- local or cloud dev `DATABASE_URL`
- test-safe `JWT_SECRET`
- `NEXT_PUBLIC_SITE_URL=http://localhost:3000`

## Staging
- staging DB URL
- unique staging JWT secret
- staging canonical URL

## Production
- production DB URL
- strong production JWT secret
- production canonical URL

---


## 4) Where to store secrets securely

### Local machine
- Keep secrets only in `.env.local`.
- `.env.local` must stay uncommitted and ignored by git (`.gitignore`).

### CI/CD and deployment (Netlify/Cloudflare/Render/Vercel)
- Store secrets in the platform's Environment Variables / Secret Manager UI.
- Add these keys at minimum:
  - `DATABASE_URL`
  - `JWT_SECRET`
  - `NEXT_PUBLIC_SITE_URL`
- After updating variables, trigger a redeploy.

## 4) Deployment platform setup

For Netlify/Cloudflare/Render/Vercel, define the same keys in project environment settings:
- `DATABASE_URL`
- `JWT_SECRET`
- `NEXT_PUBLIC_SITE_URL`


Do **not** commit real `.env.local` values.

---


## 5) Verify your env file before deployment

Run:

```bash
npm run env:check
```

This checks required keys exist and that `JWT_SECRET` length is valid, without printing secret values.

---

## 6) Future-ready keys (not required yet)

## 5) Future-ready keys (not required yet)


These are placeholders for later growth:
- `SENTRY_DSN`
- `GA_MEASUREMENT_ID`
- SMTP/email provider keys

Add them only when corresponding integrations are implemented.
