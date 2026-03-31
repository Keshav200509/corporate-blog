import { prisma } from "../../lib/db/prisma";
import { hasDatabase } from "../../lib/db/has-database";
import { PUBLIC_POST_WHERE } from "../guards/publication";
import { getPublishedPosts } from "../data";
import { listDemoAuthors } from "../fallback";

export async function listAuthors() {
  if (!hasDatabase()) {
    return listDemoAuthors();

export async function listAuthors() {
  if (!hasDatabase()) {
    const posts = await getPublishedPosts();
    const authorMap = new Map<string, { id: string; name: string; slug: string; bio: string | null; _count: { posts: number } }>();

    for (const post of posts) {
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

  try {
    const authors = await prisma.user.findMany({
      where: {
        isActive: true,
        posts: {
          some: PUBLIC_POST_WHERE
        }
      },
      select: {
        id: true,
        name: true,
        slug: true,
        bio: true,
        _count: {
          select: {
            posts: true
          }
        }
      },
      orderBy: {
        name: "asc"
      }
    });

    return authors.length > 0 ? authors : listDemoAuthors();
  } catch {
    return listDemoAuthors();
  }
}

export async function getAuthorWithPosts(slug: string) {
  if (!hasDatabase()) {
    const posts = await getPublishedPosts({ authorSlug: slug });
    if (posts.length === 0) {
      return null;
    }

    const author = posts[0]?.author;
    if (!author) {
      return null;
    }

    return {
      ...author,
      posts
    };
  }

  try {
    const author = await prisma.user.findUnique({
      where: {
        slug,
        isActive: true
      },
      select: {
        id: true,
        name: true,
        slug: true,
        bio: true
      }
    });

    if (!author) {
      return null;
    }

    const posts = await getPublishedPosts({ authorSlug: slug });

    return {
      ...author,
      posts
    };
  } catch {
    const posts = await getPublishedPosts({ authorSlug: slug });
    if (posts.length === 0) {
      return null;
    }

    const author = posts[0]?.author;
    return author ? { ...author, posts } : null;
  }
}
