import { DEMO_POSTS } from "./demo-content";
import type { BlogPost, BlogPostFilters } from "./types";

export function filterDemoPosts(filters?: BlogPostFilters): BlogPost[] {
  return DEMO_POSTS.filter((post) => {
    const byAuthor = !filters?.authorSlug || post.author.slug === filters.authorSlug;
    const byCategory = !filters?.categorySlug || post.categories.some((category) => category.slug === filters.categorySlug);
    const byQuery = !filters?.query || `${post.title} ${post.excerpt}`.toLowerCase().includes(filters.query.toLowerCase());

    return byAuthor && byCategory && byQuery;
  });
}

export function findDemoPostBySlug(slug: string): BlogPost | null {
  return DEMO_POSTS.find((post) => post.slug === slug) ?? null;
}

export function listDemoPostSlugs(): string[] {
  return DEMO_POSTS.map((post) => post.slug);
}

export function listDemoAuthors() {
  const authorMap = new Map<string, { id: string; name: string; slug: string; bio: string | null; _count: { posts: number } }>();

  for (const post of DEMO_POSTS) {
    const existing = authorMap.get(post.author.slug);
    if (existing) {
      existing._count.posts += 1;
      continue;
    }

    authorMap.set(post.author.slug, {
      id: post.author.id,
      name: post.author.name,
      slug: post.author.slug,
      bio: post.author.bio,
      _count: { posts: 1 }
    });
  }

  return Array.from(authorMap.values()).sort((a, b) => a.name.localeCompare(b.name));
}

export function listDemoCategories() {
  const categoryMap = new Map<string, { id: string; name: string; slug: string; _count: { postCategories: number } }>();

  for (const post of DEMO_POSTS) {
    for (const category of post.categories) {
      const existing = categoryMap.get(category.slug);
      if (existing) {
        existing._count.postCategories += 1;
        continue;
      }

      categoryMap.set(category.slug, {
        id: category.id,
        name: category.name,
        slug: category.slug,
        _count: { postCategories: 1 }
      });
    }
  }

  return Array.from(categoryMap.values()).sort((a, b) => a.name.localeCompare(b.name));
}
