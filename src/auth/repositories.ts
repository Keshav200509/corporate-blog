import { randomUUID, createHash } from "crypto";
import { AuditAction, PostStatus, Prisma } from "@prisma/client";
import { prisma } from "../lib/db/prisma";

const db = prisma as any;

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export async function createRefreshSession(input: { userId: string; token: string; expiresAt: Date; ipAddress?: string | null; userAgent?: string | null }) {
  return db.refreshToken.create({
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

  const session = await db.refreshToken.findUnique({ where: { tokenHash: oldHash } });
  if (!session || session.revokedAt || session.expiresAt < new Date()) {
    return null;
  }

  await prisma.$transaction([
    db.refreshToken.update({ where: { tokenHash: oldHash }, data: { revokedAt: new Date() } }),
    db.refreshToken.create({
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

  await db.refreshToken.updateMany({
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
    data: data as any
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
