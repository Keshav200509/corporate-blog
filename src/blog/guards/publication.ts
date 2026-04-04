
// Using string literal instead of PostStatus enum to avoid requiring
// `prisma generate` before tests run. "PUBLISHED" === PostStatus.PUBLISHED at runtime.
export const PUBLIC_POST_WHERE = {
  status: "PUBLISHED" as const,
  publishedAt: {
    not: null
  }
} as const;
