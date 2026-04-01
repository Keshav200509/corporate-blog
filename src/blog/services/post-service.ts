import type { PostWithRelations } from "../repositories/post-repository";
import { PostRepository } from "../repositories/post-repository";
import type { BlogPost, BlogPostFilters, BlogPostStatus } from "../types";
import { hasDatabase } from "../../lib/db/has-database";
import { filterDemoPosts, findDemoPostBySlug, listDemoPostSlugs } from "../fallback";

const postRepository = new PostRepository();

function normalizeContent(content: unknown): string[] {
  if (Array.isArray(content)) {
    return content.filter((item): item is string => typeof item === "string");
  }

  return [];
}

function toBlogPostStatus(status: string): BlogPostStatus {
  if (status === "PUBLISHED" || status === "DRAFT" || status === "ARCHIVED") {
    return status;
  }

  return "DRAFT";
}

function mapToBlogPost(post: PostWithRelations): BlogPost {
  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    content: normalizeContent(post.content),
    status: toBlogPostStatus(post.status),
    publishedAt: post.publishedAt ? post.publishedAt.toISOString() : null,
    updatedAt: post.updatedAt.toISOString(),
    author: {
      id: post.author.id,
      name: post.author.name,
      slug: post.author.slug,
      bio: post.author.bio
    },
    categories: (post.postCategories ?? []).map((postCategory: any) => ({
      id: postCategory.category.id,
      name: postCategory.category.name,
      slug: postCategory.category.slug
    })),
    faqs: Array.isArray(post.faqs)
      ? post.faqs.map((faq: any) => ({
          id: faq.id,
          question: faq.question,
          answer: faq.answer,
          sortOrder: faq.sortOrder
        }))
      : [],
    seoTitle: post.seoTitle,
    seoDescription: post.seoDescription
  };
}

export async function listPublishedPosts(filters?: BlogPostFilters): Promise<BlogPost[]> {
  if (!hasDatabase()) {
    return filterDemoPosts(filters);
  }

  try {
    const posts = await postRepository.findPublishedPosts(filters);
    const mapped = posts.map((post) => mapToBlogPost(post));

    return mapped.length > 0 ? mapped : filterDemoPosts(filters);
  } catch {
    return filterDemoPosts(filters);
  }
}

export async function getPublishedPostBySlug(slug: string): Promise<BlogPost | null> {
  if (!hasDatabase()) {
    return findDemoPostBySlug(slug);
  }

  try {
    const post = await postRepository.findPublishedPostBySlug(slug);
    return post ? mapToBlogPost(post) : findDemoPostBySlug(slug);
  } catch {
    return findDemoPostBySlug(slug);
  }
}

export async function listPublishedPostSlugs(): Promise<string[]> {
  if (!hasDatabase()) {
    return listDemoPostSlugs();
  }

  try {
    const slugs = await postRepository.findPublishedPostSlugs();
    return slugs.length > 0 ? slugs.map((entry) => entry.slug) : listDemoPostSlugs();
  } catch {
    return listDemoPostSlugs();
  }
}
