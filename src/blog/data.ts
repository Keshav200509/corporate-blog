import type { BlogPost, BlogPostFilters } from "./types";
import { getPublishedPostBySlug as getPublishedPostBySlugFromService, listPublishedPosts } from "./services/post-service";
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
  return listPublishedPosts(filters);
}

export async function getPublishedPostBySlug(slug: string): Promise<BlogPost | null> {
  if (!hasDatabase()) {
    return DEMO_POSTS.find((post) => post.slug === slug) ?? null;
  }
  return getPublishedPostBySlugFromService(slug);
}
