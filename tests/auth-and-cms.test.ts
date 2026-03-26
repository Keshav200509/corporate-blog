import { beforeEach, describe, expect, it } from "vitest";
import { createAccessToken, createRefreshToken, verifyToken } from "../src/auth/jwt";
import { createDraftSchema } from "../src/auth/validation";

describe("jwt lifecycle", () => {
  beforeEach(() => {
    process.env.JWT_SECRET = "0123456789abcdef0123456789abcdef";
  });

  it("creates and verifies access tokens", () => {
    const token = createAccessToken("user-1", "WRITER");
    const payload = verifyToken(token);

    expect(payload?.sub).toBe("user-1");
    expect(payload?.role).toBe("WRITER");
    expect(payload?.type).toBe("access");
  });

  it("creates and verifies refresh tokens", () => {
    const token = createRefreshToken("user-2", "EDITOR");
    const payload = verifyToken(token);

    expect(payload?.sub).toBe("user-2");
    expect(payload?.role).toBe("EDITOR");
    expect(payload?.type).toBe("refresh");
  });
});

describe("cms validation", () => {
  it("accepts valid draft payload", () => {
    const parsed = createDraftSchema.safeParse({
      title: "Building a secure editorial pipeline",
      slug: "secure-editorial-pipeline",
      excerpt: "This post describes production controls for draft and publish workflow.",
      content: ["one", "two"],
      categoryIds: ["cat-1"]
    });

    expect(parsed.success).toBe(true);
  });

  it("rejects invalid slug", () => {
    const parsed = createDraftSchema.safeParse({
      title: "Building a secure editorial pipeline",
      slug: "Invalid Slug",
      excerpt: "This post describes production controls for draft and publish workflow.",
      content: ["one"],
      categoryIds: ["cat-1"]
    });

    expect(parsed.success).toBe(false);
  });
});
