# Agent Instructions 

This file tells AI coding agents the rules for this repo. **Read before making any change.**

---

## CI Pipeline — What Must Pass

Every push and pull request runs these checks in order. A failure in any step blocks the merge.

```
1. npm run check:package-json   — package.json must be valid JSON
2. npm ci                       — deterministic install from lockfile
3. check-conflict-markers.sh    — NO git conflict markers anywhere
4. npm run lint                 — ESLint must pass with zero errors
5. npm test                     — All Vitest tests must pass
6. npm run build                — Next.js build must succeed
```

Failing early often means steps 1–4 (invalid JSON, dependency mismatch, conflict markers, or lint/syntax errors).

---

## The #1 Rule — Never Commit Conflict Markers

**Never leave git conflict markers in any file.** This includes:

```
<<<<<<< HEAD
=======
>>>>>>> some-branch
```

These cause an immediate CI failure. If you see them in a file, remove the entire block and keep only the correct version before committing.

**Quick scan command:**
```bash
grep -rn "<<<<<<\|=======\|>>>>>>>" app src tests prisma .github scripts
```

This must return zero results before any commit.

---

## package.json Rules

- Do not add new dependencies without also running `npm install` to update `package-lock.json`
- The `next` version in `package.json` must exactly match the version in `package-lock.json`
- `eslint-config-next` must match the `next` version exactly (currently both `15.2.3`)
- After editing `package.json`, always run: `npm run check:package-json`

---

## Before Every Commit — Checklist

Run this before committing anything:

```bash
# 1. Check for conflict markers
grep -rn "<<<<<<\|=======\|>>>>>>>" app src tests prisma .github scripts

# 2. Validate package.json
npm run check:package-json

# 3. (Optional, recommended) Run TypeScript/TSX checks
npm run typecheck

# 4. Run lint
npm run lint

# 5. Run tests
npm test

# 6. Run production build
npm run build
```

All checks must succeed. If any fails, fix it before committing.

---

## Merge Strategy

- **Never use `git merge` directly** on a branch with conflicts without resolving them first
- Prefer rebasing on top of `origin/main` to keep PR history linear
- Use the contributor-safe sync command before pushing: `npm run sync:main`
- If a conflict appears, resolve it immediately and rerun:
  - `./scripts/check-conflict-markers.sh`
  - `npm run lint`
  - `npm test`
  - `npm run build:netlify`
- Prefer small, focused commits over large batched changes

---

## File Locations

| Purpose | Path |
|---|---|
| Blog pages | `app/blog/` |
| API routes | `app/api/` |
| Blog logic | `src/blog/` |
| Auth logic | `src/auth/` |
| DB client | `src/lib/db/` |
| Tests | `tests/` |
| DB schema | `prisma/schema.prisma` |

---

## Environment Setup

```bash
cp .env.example .env.local
# Fill in DATABASE_URL, JWT_SECRET (min 32 chars), NEXT_PUBLIC_SITE_URL
npm run env:check

# Install git hooks (run once)
bash scripts/setup-hooks.sh
```

---

## Common Failure Patterns and Fixes

| Symptom | Cause | Fix |
|---|---|---|
| CI fails after 7–11s | Conflict markers in files | `grep -rn '<<<<<<<' .` then remove markers |
| CI fails at `check:package-json` | Invalid JSON in package.json | `git checkout -- package.json` |
| `next` / `eslint-config-next` mismatch | package.json edited without lockfile update | Run `npm install` |
| Build fails with Prisma error | `DATABASE_URL` not set or invalid | Set valid `DATABASE_URL` or check `hasDatabase()` guard |
| Tests fail on `verifyToken` | `JWT_SECRET` not set in test env | Tests set it in `beforeEach` — check test file |
