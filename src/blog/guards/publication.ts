export const PUBLIC_POST_WHERE = {
  status: "PUBLISHED" as const,
  publishedAt: {
    not: null
  }
} as const;
