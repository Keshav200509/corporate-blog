import { describe, expect, it } from "vitest";
import { getPublishedPostBySlug, getPublishedPosts } from "../src/blog/data";
import { buildArticleJsonLd, getCanonicalUrl, getPostDescription, getPostTitle } from "../src/blog/seo";

describe("blog content selectors", () => {
    it("returns only published posts", () => {
        const posts = getPublishedPosts();

        expect(posts.length).toBeGreaterThan(0);
        expect(posts.every((post) => post.status === "PUBLISHED")).toBe(true);
        expect(posts.every((post) => post.publishedAt)).toBe(true);
    });

    it("does not expose draft posts by slug", () => {
        expect(getPublishedPostBySlug("editorial-workflows-that-scale")).toBeNull();
    });
});

describe("blog seo helpers", () => {
    it("builds canonical URL correctly", () => {
        expect(getCanonicalUrl("/blog")).toBe("https://example.com/blog");
    });

    it("prefers SEO title/description when available", () => {
        const post = getPublishedPostBySlug("launching-seo-first-content-platform");

        if (!post) {
            throw new Error("Expected fixture post to exist");
        }

        expect(getPostTitle(post)).toContain("SEO-First");
        expect(getPostDescription(post)).toContain("launch blueprint");
    });

    it("builds article json-ld payload", () => {
        const post = getPublishedPostBySlug("launching-seo-first-content-platform");

        if (!post) {
            throw new Error("Expected fixture post to exist");
        }

        const jsonLd = buildArticleJsonLd(post);

        expect(jsonLd["@type"]).toBe("Article");
        expect(jsonLd.mainEntityOfPage).toBe("https://example.com/blog/launching-seo-first-content-platform");
    });
});