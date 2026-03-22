import { PostStatus } from "@prisma/client";

export const PUBLIC_POST_WHERE = {
  status: PostStatus.PUBLISHED,
  publishedAt: {
    not: null
  }
} as const;
