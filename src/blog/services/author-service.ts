import { prisma } from "../../lib/db/prisma";
import { hasDatabase } from "../../lib/db/has-database";
import { PUBLIC_POST_WHERE } from "../guards/publication";
import { getPublishedPosts } from "../data";
import { listDemoAuthors } from "../fallback";

export async function listAuthors() {
  if (!hasDatabase()) {
    return listDemoAuthors();
  }

  try {
    return await prisma.user.findMany({
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
  } catch {
    return [];
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
    return null;
  }
}
