import { PostStatus } from "@prisma/client";
import { prisma } from "../lib/db/prisma";

export type ReadinessStatus = "pass" | "warn" | "fail";

export type ReadinessCheck = {
  key: string;
  title: string;
  status: ReadinessStatus;
  detail: string;
};

export type ReadinessSnapshot = {
  generatedAt: string;
  overallStatus: ReadinessStatus;
  checks: ReadinessCheck[];
  metrics: {
    publishedPosts: number;
    drafts: number;
    categories: number;
    authors: number;
    lastPublishAt: string | null;
  };
};

function statusWeight(status: ReadinessStatus): number {
  if (status === "fail") return 3;
  if (status === "warn") return 2;
  return 1;
}

export function summarizeOverallStatus(checks: ReadinessCheck[]): ReadinessStatus {
  if (checks.length === 0) {
    return "warn";
  }

  const highest = checks.reduce((max, check) => Math.max(max, statusWeight(check.status)), 1);
  if (highest === 3) return "fail";
  if (highest === 2) return "warn";
  return "pass";
}

export function evaluateReadinessChecks(input: {
  hasDatabaseUrl: boolean;
  hasJwtSecret: boolean;
  hasPublicSiteUrl: boolean;
  publishedPosts: number;
  drafts: number;
  categories: number;
  authors: number;
  hasRecentPublishActivity: boolean;
}): ReadinessCheck[] {
  return [
    {
      key: "env.database",
      title: "Database connection configured",
      status: input.hasDatabaseUrl ? "pass" : "fail",
      detail: input.hasDatabaseUrl ? "DATABASE_URL is set." : "DATABASE_URL is missing."
    },
    {
      key: "env.jwt",
      title: "Authentication secret configured",
      status: input.hasJwtSecret ? "pass" : "fail",
      detail: input.hasJwtSecret ? "JWT_SECRET is set." : "JWT_SECRET is missing or too short (min 32 chars)."
    },
    {
      key: "env.site",
      title: "Canonical site URL configured",
      status: input.hasPublicSiteUrl ? "pass" : "warn",
      detail: input.hasPublicSiteUrl ? "NEXT_PUBLIC_SITE_URL is set." : "NEXT_PUBLIC_SITE_URL is missing (falls back to example.com)."
    },
    {
      key: "content.published",
      title: "Published content available",
      status: input.publishedPosts > 0 ? "pass" : "warn",
      detail: input.publishedPosts > 0 ? `${input.publishedPosts} published post(s) available.` : "No published posts found yet."
    },
    {
      key: "content.taxonomy",
      title: "Category taxonomy configured",
      status: input.categories > 0 ? "pass" : "warn",
      detail: input.categories > 0 ? `${input.categories} category(ies) available.` : "No categories available."
    },
    {
      key: "content.authors",
      title: "Author roster configured",
      status: input.authors > 0 ? "pass" : "warn",
      detail: input.authors > 0 ? `${input.authors} author account(s) available.` : "No authors available."
    },
    {
      key: "workflow.review",
      title: "Editorial pipeline active",
      status: input.drafts > 0 || input.hasRecentPublishActivity ? "pass" : "warn",
      detail:
        input.drafts > 0 || input.hasRecentPublishActivity
          ? "Draft and/or recent publish activity detected."
          : "No drafts or recent publish activity detected."
    }
  ];
}

export async function getReadinessSnapshot(): Promise<ReadinessSnapshot> {
  const hasDatabaseUrl = Boolean(process.env.DATABASE_URL);
  const hasJwtSecret = Boolean(process.env.JWT_SECRET && process.env.JWT_SECRET.length >= 32);
  const hasPublicSiteUrl = Boolean(process.env.NEXT_PUBLIC_SITE_URL);

  if (!hasDatabaseUrl) {
    const checks = evaluateReadinessChecks({
      hasDatabaseUrl,
      hasJwtSecret,
      hasPublicSiteUrl,
      publishedPosts: 0,
      drafts: 0,
      categories: 0,
      authors: 0,
      hasRecentPublishActivity: false
    });

    return {
      generatedAt: new Date().toISOString(),
      overallStatus: summarizeOverallStatus(checks),
      checks,
      metrics: {
        publishedPosts: 0,
        drafts: 0,
        categories: 0,
        authors: 0,
        lastPublishAt: null
      }
    };
  }

  try {
    const [publishedPosts, drafts, categories, authors, latestPublishedPost] = await Promise.all([
      prisma.post.count({ where: { status: PostStatus.PUBLISHED, publishedAt: { not: null } } }),
      prisma.post.count({ where: { status: PostStatus.DRAFT } }),
      prisma.category.count({ where: { isActive: true } }),
      prisma.user.count({ where: { isActive: true } }),
      prisma.post.findFirst({ where: { status: PostStatus.PUBLISHED, publishedAt: { not: null } }, orderBy: { publishedAt: "desc" } })
    ]);

    const hasRecentPublishActivity = latestPublishedPost?.publishedAt
      ? Date.now() - latestPublishedPost.publishedAt.getTime() < 1000 * 60 * 60 * 24 * 30
      : false;

    const checks = evaluateReadinessChecks({
      hasDatabaseUrl,
      hasJwtSecret,
      hasPublicSiteUrl,
      publishedPosts,
      drafts,
      categories,
      authors,
      hasRecentPublishActivity
    });

    return {
      generatedAt: new Date().toISOString(),
      overallStatus: summarizeOverallStatus(checks),
      checks,
      metrics: {
        publishedPosts,
        drafts,
        categories,
        authors,
        lastPublishAt: latestPublishedPost?.publishedAt?.toISOString() ?? null
      }
    };
  } catch {
    const checks = evaluateReadinessChecks({
      hasDatabaseUrl: false,
      hasJwtSecret,
      hasPublicSiteUrl,
      publishedPosts: 0,
      drafts: 0,
      categories: 0,
      authors: 0,
      hasRecentPublishActivity: false
    });

    return {
      generatedAt: new Date().toISOString(),
      overallStatus: summarizeOverallStatus(checks),
      checks,
      metrics: {
        publishedPosts: 0,
        drafts: 0,
        categories: 0,
        authors: 0,
        lastPublishAt: null
      }
    };
  };
}
