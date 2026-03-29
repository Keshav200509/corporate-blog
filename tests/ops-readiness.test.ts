import { describe, expect, it } from "vitest";
import { evaluateReadinessChecks, summarizeOverallStatus } from "../src/ops/readiness";

describe("ops readiness", () => {
  it("returns fail overall status when a critical env check fails", () => {
    const checks = evaluateReadinessChecks({
      hasDatabaseUrl: false,
      hasJwtSecret: true,
      hasPublicSiteUrl: true,
      publishedPosts: 5,
      drafts: 2,
      categories: 3,
      authors: 2,
      hasRecentPublishActivity: true
    });

    expect(checks.find((check) => check.key === "env.database")?.status).toBe("fail");
    expect(summarizeOverallStatus(checks)).toBe("fail");
  });

  it("returns pass overall status when all checks pass", () => {
    const checks = evaluateReadinessChecks({
      hasDatabaseUrl: true,
      hasJwtSecret: true,
      hasPublicSiteUrl: true,
      publishedPosts: 12,
      drafts: 3,
      categories: 4,
      authors: 5,
      hasRecentPublishActivity: true
    });

    expect(checks.every((check) => check.status === "pass")).toBe(true);
    expect(summarizeOverallStatus(checks)).toBe("pass");
  });

  it("returns warn when no critical failures but missing launch signals", () => {
    const checks = evaluateReadinessChecks({
      hasDatabaseUrl: true,
      hasJwtSecret: true,
      hasPublicSiteUrl: false,
      publishedPosts: 0,
      drafts: 0,
      categories: 0,
      authors: 0,
      hasRecentPublishActivity: false
    });

    expect(checks.some((check) => check.status === "warn")).toBe(true);
    expect(summarizeOverallStatus(checks)).toBe("warn");
  });
});
