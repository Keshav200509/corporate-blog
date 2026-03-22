# Corporate Blog Module (Portable)

This folder contains only the corporate-blog related files extracted from `/workspace/puzzle` and reorganized so they can be copied into another repo without alias-import breakage.

## Folder structure

```
corporate-blog/
  app/
    api/blog/posts/route.ts
    api/blog/posts/[slug]/route.ts
    blog/page.tsx
    blog/[slug]/page.tsx
    robots.ts
    sitemap.ts
  src/blog/
    data.ts
    seo.ts
    types.ts
  tests/
    blog-content.test.ts
```

## Why this works better for migration

- Uses relative imports only (no `@/` alias requirement).
- Keeps blog domain logic in `src/blog` and Next route files in `app`.
- Includes tests scoped to this module.

## Copy plan into another repo

1. Copy `corporate-blog/app/*` into target repo's `app/`.
2. Copy `corporate-blog/src/blog/*` into target repo's `src/blog/`.
3. Copy `corporate-blog/tests/blog-content.test.ts` into target tests folder.
4. Ensure Next + Vitest dependencies are present.