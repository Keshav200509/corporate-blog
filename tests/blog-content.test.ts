import { beforeAll, describe, expect, it, vi } from "vitest";

vi.mock("../src/blog/services/post-service", () => ({
  listPublishedPosts: vi.fn(async () => [
    {
      id: "p-1",
      slug: "launching-seo-first-content-platform",
      title: "Launching an SEO-First Content Platform",
      excerpt: "How to build a publishing workflow that balances editorial velocity.",
      content: ["First", "Second"],
      status: "PUBLISHED",
      publishedAt: "2026-03-17T09:00:00.000Z",
      updatedAt: "2026-03-17T09:00:00.000Z",
      author: {
        id: "a-1",
        name: "Maya Chen",
        slug: "maya-chen",
        bio: "Editor"
      },
      faqs: [],
      categories: [
        {
          id: "c-1",
          name: "Engineering",
          slug: "engineering"
        }
      ],
      seoTitle: "SEO-First Content Platform Launch Guide",
      seoDescription: "A practical launch blueprint for building a secure corporate blog."
    }
  ]),
  getPublishedPostBySlug: vi.fn(async (slug: string) =>
    slug === "launching-seo-first-content-platform"
      ? {
          id: "p-1",
          slug,
          title: "Launching an SEO-First Content Platform",
          excerpt: "How to build a publishing workflow that balances editorial velocity.",
          content: ["First", "Second"],
          status: "PUBLISHED",
          publishedAt: "2026-03-17T09:00:00.000Z",
          updatedAt: "2026-03-17T09:00:00.000Z",
          author: {
            id: "a-1",
            name: "Maya Chen",
            slug: "maya-chen",
            bio: "Editor"
          },
          faqs: [],
          categories: [
            {
              id: "c-1",
              name: "Engineering",
              slug: "engineering"
            }
          ],
          seoTitle: "SEO-First Content Platform Launch Guide",
          seoDescription: "A practical launch blueprint for building a secure corporate blog."
        }
      : null
  )
}));

import { getPublishedPostBySlug, getPublishedPosts } from "../src/blog/data";
import { buildArticleJsonLd, getCanonicalUrl, getPostDescription, getPostTitle } from "../src/blog/seo";

beforeAll(() => {
  process.env.DATABASE_URL = "postgresql://test/test";
});

describe("blog content selectors", () => {
  it("returns only published posts", async () => {
    const posts = await getPublishedPosts();

    expect(posts.length).toBeGreaterThan(0);
    expect(posts.every((post) => post.status === "PUBLISHED")).toBe(true);
    expect(posts.every((post) => post.publishedAt)).toBe(true);
  });

  it("does not expose draft posts by slug", async () => {
    await expect(getPublishedPostBySlug("editorial-workflows-that-scale")).resolves.toBeNull();
  });
});

describe("blog seo helpers", () => {
  it("builds canonical URL correctly", () => {
    expect(getCanonicalUrl("/blog")).toBe("https://example.com/blog");
  });

  it("prefers SEO title/description when available", async () => {
    const post = await getPublishedPostBySlug("launching-seo-first-content-platform");

    if (!post) {
      throw new Error("Expected fixture post to exist");
    }

    expect(getPostTitle(post)).toContain("SEO-First");
    expect(getPostDescription(post)).toContain("launch blueprint");
  });

  it("builds article json-ld payload", async () => {
    const post = await getPublishedPostBySlug("launching-seo-first-content-platform");

    if (!post) {
      throw new Error("Expected fixture post to exist");
    }

    const jsonLd = buildArticleJsonLd(post);

    expect(jsonLd["@type"]).toBe("Article");
    expect(jsonLd.mainEntityOfPage).toBe("https://example.com/blog/launching-seo-first-content-platform");
  });
});
