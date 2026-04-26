import { beforeEach, describe, expect, it } from "vitest";
import { getPublishedPostBySlug, getPublishedPosts } from "../src/blog/data";
import { listAuthors } from "../src/blog/services/author-service";
import { listCategories } from "../src/blog/services/category-service";

describe("fallback preview mode", () => {
  beforeEach(() => {
    delete process.env.DATABASE_URL;
  });

  it("returns demo posts without a database", async () => {
    const posts = await getPublishedPosts();

    expect(posts.length).toBeGreaterThan(0);
    expect(posts.every((post) => post.status === "PUBLISHED")).toBe(true);
  });

  it("resolves demo post by slug", async () => {
    const post = await getPublishedPostBySlug("launching-seo-first-content-platform");

    expect(post?.author.slug).toBe("maya-chen");
  });

  it("builds demo author and category indexes", async () => {
    const [authors, categories] = await Promise.all([listAuthors(), listCategories()]);

    expect(authors.length).toBeGreaterThan(0);
    expect(categories.length).toBeGreaterThan(0);
  });
});
