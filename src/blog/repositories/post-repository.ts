import { prisma } from "../../lib/db/prisma";
import { PUBLIC_POST_WHERE } from "../guards/publication";
import type { BlogPostFilters } from "../types";

const postInclude = {
  author: true,
  postCategories: {
    include: {
      category: true
    }
  },
  faqs: {
    orderBy: {
      sortOrder: "asc"
    }
  }
};

export type PostWithRelations = any;

function buildPublicWhere(filters?: BlogPostFilters): Record<string, unknown> {
  return {
    ...PUBLIC_POST_WHERE,
    ...(filters?.authorSlug
      ? {
          author: {
            slug: filters.authorSlug
          }
        }
      : {}),
    ...(filters?.categorySlug
      ? {
          postCategories: {
            some: {
              category: {
                slug: filters.categorySlug
              }
            }
          }
        }
      : {}),
    ...(filters?.query
      ? {
          OR: [
            {
              title: {
                contains: filters.query,
                mode: "insensitive"
              }
            },
            {
              excerpt: {
                contains: filters.query,
                mode: "insensitive"
              }
            }
          ]
        }
      : {})
  };
}

export class PostRepository {
  async findPublishedPosts(filters?: BlogPostFilters): Promise<PostWithRelations[]> {
    return prisma.post.findMany({
      where: buildPublicWhere(filters),
      include: postInclude,
      orderBy: [
        {
          publishedAt: "desc"
        },
        {
          updatedAt: "desc"
        }
      ]
    });
  }

  async findPublishedPostBySlug(slug: string): Promise<PostWithRelations | null> {
    return prisma.post.findFirst({
      where: {
        slug,
        ...PUBLIC_POST_WHERE
      },
      include: postInclude
    });
  }

  async findPublishedPostSlugs(): Promise<Array<{ slug: string }>> {
    return prisma.post.findMany({
      where: PUBLIC_POST_WHERE,
      select: {
        slug: true
      },
      orderBy: {
        publishedAt: "desc"
      }
    });
  }
}
