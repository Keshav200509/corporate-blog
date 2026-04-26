# Agent Instructions 

This file tells AI coding agents the rules for this repo. **Read before making any change.**

---

## CI Pipeline — What Must Pass

Every push and pull request runs these checks in order. **All must pass before a PR can be merged.**

```
1. npm run check:package-json   — package.json must be valid JSON
2. npm ci                       — deterministic install from lockfile
3. check-conflict-markers.sh    — NO git conflict markers anywhere
4. npm run lint                 — ESLint must pass with zero errors
5. npm run typecheck            — tsc --noEmit must pass (catches TSX syntax errors)
6. npm test                     — All Vitest tests must pass
7. npm run build                — Next.js / Turbopack build must succeed
```

**TypeScript typecheck (step 5) is mandatory.** It catches JSX/TSX syntax errors and type
errors before Turbopack does — and gives clearer messages. Never skip it.

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

The pre-commit hook runs automatically after `npm install`. To run the full suite manually:

```bash
# Quick (runs automatically on every commit)
./scripts/check-conflict-markers.sh
npm run lint
npm run typecheck

# Full verification before pushing
npm run verify
# (equivalent to: check:package-json + check:deps + lint + typecheck + test + build)
```

All checks must succeed. If any fails, fix it before committing.

---

## Merge Strategy — How to Avoid Conflict Disasters

**Root cause of recurring breakages:** branches diverge from `main`, PRs are merged with
conflicts that are badly resolved (no literal markers, but semantically broken code).

### The correct workflow (follow this every time):

```bash
# 1. Keep your feature branch current — do this BEFORE creating a PR
git fetch origin
git rebase origin/main
# Resolve any conflicts file-by-file, then:
git add <resolved-file>
git rebase --continue

# 2. Verify the rebased branch builds cleanly
npm run verify

# 3. Push the rebased branch
git push -u origin <branch-name> --force-with-lease

# 4. Create the PR — CI must pass before merging
```

### Rules:
- **Always rebase** your branch on `main` before opening a PR, not after
- **Never merge `main` into your feature branch** — rebase instead
- **Never merge a PR with failing CI** — wait for all checks to go green
- **After resolving a conflict**, run `npm run typecheck && npm run lint` immediately
- **Never use `git merge --no-ff`** on feature branches; use squash or rebase merge in GitHub UI

### Common merge mistake — duplicated code:
When GitHub shows a conflict and you edit it in the browser, ensure you keep **one** version
of every function/block. The most dangerous pattern is silently getting two copies of an
object literal where the first is unclosed:

```tsx
// BROKEN — stats object not closed, parser errors on `const featured`
const stats = {
  posts: posts.length,
  authors: authors.length,       ← you see this in the log
  categories: categories.length, ← you see this in the log
const featured = posts[0];       ← parser rejects this (still inside stats)
```

```tsx
// CORRECT — one version, object properly closed
const stats = {
  posts: posts.length,
  authors: authors.length,
  categories: categories.length,
};
const featured = posts[0];
```

Run `npm run typecheck` after resolving any conflict — tsc catches these in milliseconds.

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
| Turbopack "Expected '</'..." or "Unexpected token ident" | Bad merge resolution — unclosed JSX/object | Run `npm run typecheck` to find exact line; fix the unclosed tag or brace |
| Pre-commit hook not running | Hooks not installed | Run `bash scripts/setup-hooks.sh` (or `npm install` which runs `prepare`) |
