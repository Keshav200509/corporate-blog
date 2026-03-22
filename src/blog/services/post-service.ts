import type { PostWithRelations } from "../repositories/post-repository";
import { PostRepository } from "../repositories/post-repository";
import type { BlogPost, BlogPostFilters, BlogPostStatus } from "../types";

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
    categories: post.postCategories.map((postCategory) => ({
      id: postCategory.category.id,
      name: postCategory.category.name,
      slug: postCategory.category.slug
    })),
    seoTitle: post.seoTitle,
    seoDescription: post.seoDescription
  };
}

export async function listPublishedPosts(filters?: BlogPostFilters): Promise<BlogPost[]> {
  const posts = await postRepository.findPublishedPosts(filters);

  return posts.map((post) => mapToBlogPost(post));
}

export async function getPublishedPostBySlug(slug: string): Promise<BlogPost | null> {
  const post = await postRepository.findPublishedPostBySlug(slug);

  return post ? mapToBlogPost(post) : null;
}

export async function listPublishedPostSlugs(): Promise<string[]> {
  const slugs = await postRepository.findPublishedPostSlugs();

  return slugs.map((entry) => entry.slug);
}
