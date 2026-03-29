import { prisma } from "../../lib/db/prisma";
import { hasDatabase } from "../../lib/db/has-database";
import { PUBLIC_POST_WHERE } from "../guards/publication";
import { listPublishedPosts } from "./post-service";

export async function listCategories() {
  if (!hasDatabase()) {
    return [];
  }

  try {
    return await prisma.category.findMany({
      where: {
        isActive: true,
        postCategories: {
          some: {
            post: PUBLIC_POST_WHERE
          }
        }
      },
      select: {
        id: true,
        name: true,
        slug: true,
        _count: {
          select: {
            postCategories: true
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

export async function getCategoryWithPosts(slug: string) {
  if (!hasDatabase()) {
    return null;
  }

  try {
    const category = await prisma.category.findUnique({
      where: {
        slug,
        isActive: true
      },
      select: {
        id: true,
        slug: true,
        name: true,
        description: true
      }
    });

    if (!category) {
      return null;
    }

    const posts = await listPublishedPosts({ categorySlug: slug });

    return {
      ...category,
      posts
    };
  } catch {
    return null;
  }
}
