import type { BlogPost, BlogPostFilters } from "./types";
import { getPublishedPostBySlug as getPublishedPostBySlugFromService, listPublishedPosts } from "./services/post-service";
<<<<<<< HEAD

export async function getPublishedPosts(filters?: BlogPostFilters): Promise<BlogPost[]> {
=======

export async function getPublishedPosts(filters?: BlogPostFilters): Promise<BlogPost[]> {
import { hasDatabase } from "../lib/db/has-database";
import { DEMO_POSTS } from "./demo-content";

function applyFilters(posts: BlogPost[], filters?: BlogPostFilters): BlogPost[] {
  if (!filters) {
    return posts;
  }

  return posts.filter((post) => {
    const byAuthor = !filters.authorSlug || post.author.slug === filters.authorSlug;
    const byCategory = !filters.categorySlug || post.categories.some((category) => category.slug === filters.categorySlug);
    const byQuery =
      !filters.query ||
      `${post.title} ${post.excerpt}`.toLowerCase().includes(filters.query.toLowerCase());

    return byAuthor && byCategory && byQuery;
  });
}

export async function getPublishedPosts(filters?: BlogPostFilters): Promise<BlogPost[]> {
  if (!hasDatabase()) {
    return applyFilters(DEMO_POSTS, filters);
  }
>>>>>>> origin/main
  return listPublishedPosts(filters);
}

export async function getPublishedPostBySlug(slug: string): Promise<BlogPost | null> {
<<<<<<< HEAD
=======
  if (!hasDatabase()) {
    return DEMO_POSTS.find((post) => post.slug === slug) ?? null;
  }
>>>>>>> origin/main
  return getPublishedPostBySlugFromService(slug);
}
