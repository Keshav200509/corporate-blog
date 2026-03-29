import type { Post, Prisma } from "@prisma/client";
import { prisma } from "../../lib/db/prisma";
import { PUBLIC_POST_WHERE } from "../guards/publication";
import type { BlogPostFilters } from "../types";

export type PostWithRelations = any;

const postInclude: any = {
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

function buildPublicWhere(filters?: BlogPostFilters): Prisma.PostWhereInput {
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
    try {
      return await prisma.post.findMany({
        where: buildPublicWhere(filters),
        include: postInclude,
        orderBy: [{ publishedAt: "desc" }, { updatedAt: "desc" }]
      });
    } catch {
      return [];
    }
  }

  async findPublishedPostBySlug(slug: string): Promise<PostWithRelations | null> {
    try {
      return await prisma.post.findFirst({
        where: {
          slug,
          ...PUBLIC_POST_WHERE
        },
        include: postInclude
      });
    } catch {
      return null;
    }
  }

  async findPublishedPostSlugs(): Promise<Pick<Post, "slug">[]> {
    try {
      return await prisma.post.findMany({
        where: PUBLIC_POST_WHERE,
        select: {
          slug: true
        },
        orderBy: {
          publishedAt: "desc"
        }
      });
    } catch {
      return [];
    }
  }
}
