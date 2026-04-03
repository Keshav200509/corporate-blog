import { randomUUID, createHash } from "crypto";
import { AuditAction, PostStatus, Prisma } from "@prisma/client";
import { prisma } from "../lib/db/prisma";

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export async function createRefreshSession(input: { userId: string; token: string; expiresAt: Date; ipAddress?: string | null; userAgent?: string | null }) {
  return prisma.refreshToken.create({
    data: {
      id: randomUUID(),
      tokenHash: hashToken(input.token),
      userId: input.userId,
      expiresAt: input.expiresAt,
      ipAddress: input.ipAddress,
      userAgent: input.userAgent
    }
  });
}

export async function rotateRefreshSession(input: { oldToken: string; newToken: string; userId: string; expiresAt: Date; ipAddress?: string | null; userAgent?: string | null }) {
  const oldHash = hashToken(input.oldToken);

  const session = await prisma.refreshToken.findUnique({ where: { tokenHash: oldHash } });
  if (!session || session.revokedAt || session.expiresAt < new Date()) {
    return null;
  }

  await prisma.$transaction([
    prisma.refreshToken.update({ where: { tokenHash: oldHash }, data: { revokedAt: new Date() } }),
    prisma.refreshToken.create({
      data: {
        id: randomUUID(),
        tokenHash: hashToken(input.newToken),
        userId: input.userId,
        expiresAt: input.expiresAt,
        ipAddress: input.ipAddress,
        userAgent: input.userAgent
      }
    })
  ]);

  return true;
}

export async function revokeRefreshSession(token: string) {
  const tokenHash = hashToken(token);

  await prisma.refreshToken.updateMany({
    where: {
      tokenHash,
      revokedAt: null
    },
    data: {
      revokedAt: new Date()
    }
  });
}

export async function createAuditLog(data: { action: AuditAction; actorId?: string | null; postId?: string | null; metadata?: Prisma.JsonValue }) {
  return prisma.auditLog.create({
    data: data as Prisma.AuditLogUncheckedCreateInput
  });
}

export async function createDraftPost(input: {
  authorId: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string[];
  seoTitle?: string;
  seoDescription?: string;
  categoryIds: string[];
}) {
  return prisma.post.create({
    data: {
      authorId: input.authorId,
      title: input.title,
      slug: input.slug,
      excerpt: input.excerpt,
      content: input.content,
      seoTitle: input.seoTitle,
      seoDescription: input.seoDescription,
      status: PostStatus.DRAFT,
      postCategories: {
        create: input.categoryIds.map((categoryId) => ({ categoryId }))
      }
    }
  });
}

export async function listPostsForCms(input: { authorId?: string; status?: PostStatus }) {
  return prisma.post.findMany({
    where: {
      ...(input.authorId ? { authorId: input.authorId } : {}),
      ...(input.status ? { status: input.status } : {})
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          slug: true
        }
      },
      postCategories: {
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true
            }
          }
        }
      }
    },
    orderBy: {
      updatedAt: "desc"
    }
  });
}

export async function getPostForCms(postId: string, userId: string, role: "WRITER" | "EDITOR" | "ADMIN") {
  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          slug: true
        }
      },
      postCategories: {
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true
            }
          }
        }
      },
      faqs: {
        orderBy: {
          sortOrder: "asc"
        }
      }
    }
  });

  if (!post) {
    return null;
  }

  if (role === "WRITER" && post.authorId !== userId) {
    return null;
  }

  return post;
}

export async function updateDraftPost(postId: string, authorId: string, payload: {
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string[];
  seoTitle?: string;
  seoDescription?: string;
  categoryIds?: string[];
}) {
  const post = await prisma.post.findUnique({ where: { id: postId } });

  if (!post || post.status !== PostStatus.DRAFT || post.authorId !== authorId) {
    return null;
  }

  return prisma.$transaction(async (transaction) => {
    if (payload.categoryIds) {
      await transaction.postCategory.deleteMany({ where: { postId } });
      await transaction.postCategory.createMany({
        data: payload.categoryIds.map((categoryId) => ({ postId, categoryId }))
      });
    }

    return transaction.post.update({
      where: { id: postId },
      data: {
        title: payload.title,
        slug: payload.slug,
        excerpt: payload.excerpt,
        content: payload.content,
        seoTitle: payload.seoTitle,
        seoDescription: payload.seoDescription
      }
    });
  });
}

export async function publishPost(postId: string) {
  const post = await prisma.post.findUnique({ where: { id: postId } });

  if (!post || post.status !== PostStatus.DRAFT) {
    return null;
  }

  return prisma.post.update({
    where: { id: postId },
    data: {
      status: PostStatus.PUBLISHED,
      publishedAt: new Date()
    }
  });
}

export async function unpublishPost(postId: string) {
  const post = await prisma.post.findUnique({ where: { id: postId } });

  if (!post || post.status !== PostStatus.PUBLISHED) {
    return null;
  }

  return prisma.post.update({
    where: { id: postId },
    data: {
      status: PostStatus.DRAFT,
      publishedAt: null
    }
  });
}
