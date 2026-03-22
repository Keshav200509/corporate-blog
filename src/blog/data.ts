import type { BlogPost, BlogPostFilters } from "./types";
import { getPublishedPostBySlug as getPublishedPostBySlugFromService, listPublishedPosts } from "./services/post-service";

export async function getPublishedPosts(filters?: BlogPostFilters): Promise<BlogPost[]> {
  return listPublishedPosts(filters);
}

export async function getPublishedPostBySlug(slug: string): Promise<BlogPost | null> {
  return getPublishedPostBySlugFromService(slug);
}
