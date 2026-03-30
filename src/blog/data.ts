import type { BlogPost, BlogPostFilters } from "./types";
import { getPublishedPostBySlug as getPublishedPostBySlugFromService, listPublishedPosts } from "./services/post-service";
import { hasDatabase } from "../lib/db/has-database";
import { filterDemoPosts, findDemoPostBySlug } from "./fallback";


export async function getPublishedPosts(filters?: BlogPostFilters): Promise<BlogPost[]> {
  if (!hasDatabase()) {
    return filterDemoPosts(filters);
  }
  return listPublishedPosts(filters);
}

export async function getPublishedPostBySlug(slug: string): Promise<BlogPost | null> {
  if (!hasDatabase()) {
    return findDemoPostBySlug(slug);
  }
  return getPublishedPostBySlugFromService(slug);
}
