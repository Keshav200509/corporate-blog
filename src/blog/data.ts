// import type { BlogPost, BlogPostFilters } from "./types";
// import { getPublishedPostBySlug as getPublishedPostBySlugFromService, listPublishedPosts } from "./services/post-service";

// function hasDatabase() {
//   return Boolean(process.env.DATABASE_URL);
// }

// export async function getPublishedPosts(filters?: BlogPostFilters): Promise<BlogPost[]> {
//   if (!hasDatabase()) {
//     return [];
//   }

//   return listPublishedPosts(filters);
// }

// export async function getPublishedPostBySlug(slug: string): Promise<BlogPost | null> {
//   if (!hasDatabase()) {
//     return null;
//   }

//   return getPublishedPostBySlugFromService(slug);
// }

import type { BlogPost, BlogPostFilters } from "./types";
import { getPublishedPostBySlug as getPublishedPostBySlugFromService, listPublishedPosts } from "./services/post-service";
import { hasDatabase } from "../lib/db/has-database";
 
export async function getPublishedPosts(filters?: BlogPostFilters): Promise<BlogPost[]> {
  if (!hasDatabase()) {
    return [];
  }
 
  return listPublishedPosts(filters);
}
 
export async function getPublishedPostBySlug(slug: string): Promise<BlogPost | null> {
  if (!hasDatabase()) {
    return null;
  }
 
  return getPublishedPostBySlugFromService(slug);
}
