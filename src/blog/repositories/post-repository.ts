import type { Post, Prisma } from "@prisma/client";
import { prisma } from "../../lib/db/prisma";
import { PUBLIC_POST_WHERE } from "../guards/publication";
import type { BlogPostFilters } from "../types";

<<<<<<< HEAD
export type PostWithRelations = Prisma.PostGetPayload<{
  include: {
    author: true;
    postCategories: {
      include: {
        category: true;
      };
    };
  };
}>;

const postInclude = {
=======
export type PostWithRelations = any;

const postInclude: any = {
>>>>>>> origin/codex/implement-phase-1-for-corporate-blog-cramvb
  author: true,
  postCategories: {
    include: {
      category: true
    }
<<<<<<< HEAD
  }
} satisfies Prisma.PostInclude;
=======
  },
  faqs: {
    orderBy: {
      sortOrder: "asc"
    }
  }
};
>>>>>>> origin/codex/implement-phase-1-for-corporate-blog-cramvb

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
<<<<<<< HEAD
=======
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
>>>>>>> origin/codex/implement-phase-1-for-corporate-blog-cramvb
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

  async findPublishedPostSlugs(): Promise<Pick<Post, "slug">[]> {
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
