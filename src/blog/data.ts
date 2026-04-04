import type { BlogPost, BlogPostFilters } from "./types";
import { getPublishedPostBySlug as getPublishedPostBySlugFromService, listPublishedPosts } from "./services/post-service";

function hasDatabase() {
  return Boolean(process.env.DATABASE_URL);
}

export async function getPublishedPosts(filters?: BlogPostFilters): Promise<BlogPost[]> {
  return listPublishedPosts(filters);
}

export async function getPublishedPostBySlug(slug: string): Promise<BlogPost | null> {
  if (!hasDatabase()) {
    return null;
  }

  return getPublishedPostBySlugFromService(slug);
}
