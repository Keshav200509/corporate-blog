import { prisma } from "../../lib/db/prisma";
import { hasDatabase } from "../../lib/db/has-database";
import { PUBLIC_POST_WHERE } from "../guards/publication";
import { getPublishedPosts } from "../data";
import { listDemoCategories } from "../fallback";

export async function listCategories() {
  if (!hasDatabase()) {
    return listDemoCategories();
  }

  try {
    const categories = await prisma.category.findMany({
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

    return categories.length > 0 ? categories : listDemoCategories();
  } catch {
    return listDemoCategories();
  }
}

export async function getCategoryWithPosts(slug: string) {
  if (!hasDatabase()) {
    const posts = await getPublishedPosts({ categorySlug: slug });
    if (posts.length === 0) {
      return null;
    }

    const category = posts.flatMap((post) => post.categories).find((entry) => entry.slug === slug);
    if (!category) {
      return null;
    }

    return {
      ...category,
      description: `Published posts tagged with ${category.name}.`,
      posts
    };
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

    const posts = await getPublishedPosts({ categorySlug: slug });

    return {
      ...category,
      posts
    };
  } catch {
    const posts = await getPublishedPosts({ categorySlug: slug });
    if (posts.length === 0) {
      return null;
    }

    const category = posts.flatMap((post) => post.categories).find((entry) => entry.slug === slug);
    return category
      ? {
          ...category,
          description: `Published posts tagged with ${category.name}.`,
          posts
        }
      : null;
  }
}
