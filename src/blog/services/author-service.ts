import { prisma } from "../../lib/db/prisma";
import { hasDatabase } from "../../lib/db/has-database";
import { PUBLIC_POST_WHERE } from "../guards/publication";
import { listPublishedPosts } from "./post-service";

export async function listAuthors() {
  if (!hasDatabase()) {
    return [];
  }

  return prisma.user.findMany({
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
}

export async function getAuthorWithPosts(slug: string) {
  if (!hasDatabase()) {
    return null;
  }

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

  const posts = await listPublishedPosts({ authorSlug: slug });

  return {
    ...author,
    posts
  };
}
