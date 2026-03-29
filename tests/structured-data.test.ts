import { describe, expect, it } from "vitest";
import { buildAuthorJsonLd, buildBreadcrumbJsonLd, buildFaqJsonLd } from "../src/blog/structured-data";
import type { BlogPost } from "../src/blog/types";

const post: BlogPost = {
  id: "post-1",
  slug: "launching-seo-first-content-platform",
  title: "Launching an SEO-First Content Platform",
  excerpt: "How to build a publishing workflow.",
  content: ["one"],
  status: "PUBLISHED",
  publishedAt: "2026-03-17T09:00:00.000Z",
  updatedAt: "2026-03-17T09:00:00.000Z",
  author: {
    id: "author-1",
    name: "Maya Chen",
    slug: "maya-chen",
    bio: "Editor"
  },
  categories: [
    {
      id: "cat-1",
      name: "Engineering",
      slug: "engineering"
    }
  ],
  faqs: [
    {
      id: "faq-1",
      question: "How often should we publish?",
      answer: "Use a consistent cadence.",
      sortOrder: 0
    }
  ],
  seoTitle: null,
  seoDescription: null
};

describe("structured data builders", () => {
  it("builds breadcrumb and author schema", () => {
    const breadcrumb = buildBreadcrumbJsonLd(post);
    const author = buildAuthorJsonLd(post);

    expect(breadcrumb["@type"]).toBe("BreadcrumbList");
    expect(author["@type"]).toBe("Person");
  });

  it("builds faq schema when FAQs are present", () => {
    const faq = buildFaqJsonLd(post);

    expect(faq?.["@type"]).toBe("FAQPage");
    expect(faq?.mainEntity.length).toBe(1);
  });
});
