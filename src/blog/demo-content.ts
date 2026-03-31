import type { BlogPost } from "./types";

const now = new Date();
const daysAgo = (days: number) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000).toISOString();

export const DEMO_POSTS: BlogPost[] = [
  {
    id: "demo-post-1",
    slug: "launching-seo-first-content-platform",
    title: "Launching an SEO-First Content Platform",
    excerpt: "How we launched The Corporate Blog with fast UX, rich metadata, and scalable editorial operations.",
    content: [
      "Building a modern corporate blog requires balancing content velocity with technical quality.",
      "We used an ISR-first strategy for public content and dynamic APIs for internal operations, so pages stay fast while editors retain control.",
      "Structured data, canonical URLs, and clean content architecture were treated as first-class requirements from day one."
    ],
    status: "PUBLISHED",
    publishedAt: daysAgo(14),
    updatedAt: daysAgo(3),
    author: {
      id: "demo-author-1",
      name: "Maya Chen",
      slug: "maya-chen",
      bio: "Editor focused on growth engineering, technical SEO, and content operations."
    },
    categories: [
      { id: "demo-cat-1", name: "Engineering", slug: "engineering" },
      { id: "demo-cat-2", name: "SEO", slug: "seo" }
    ],
    faqs: [
      {
        id: "faq-1",
        question: "Why start with SEO in platform design?",
        answer: "It prevents expensive retrofits and ensures content has compounding distribution from the start.",
        sortOrder: 1
      }
    ],
    seoTitle: "SEO-First Corporate Blog Launch Playbook",
    seoDescription: "A practical guide to launching a fast, scalable corporate blog with strong search foundations."
  },
  {
    id: "demo-post-2",
    slug: "editorial-workflows-that-scale",
    title: "Editorial Workflows That Scale to Millions",
    excerpt: "A practical writer-to-editor workflow that keeps quality high while publishing consistently.",
    content: [
      "Great workflows remove ambiguity for writers and editors.",
      "Draft, review, and publish steps with role-based permissions reduce operational risk.",
      "Audit logs and readiness dashboards help teams ship confidently."
    ],
    status: "PUBLISHED",
    publishedAt: daysAgo(9),
    updatedAt: daysAgo(2),
    author: {
      id: "demo-author-2",
      name: "Aiden Brooks",
      slug: "aiden-brooks",
      bio: "Content systems lead building resilient publishing pipelines."
    },
    categories: [
      { id: "demo-cat-3", name: "Operations", slug: "operations" },
      { id: "demo-cat-1", name: "Engineering", slug: "engineering" }
    ],
    faqs: [],
    seoTitle: "Scalable Editorial Workflow for Corporate Teams",
    seoDescription: "How to run a role-based editorial workflow that scales without sacrificing quality."
  },
  {
    id: "demo-post-3",
    slug: "core-web-vitals-for-content-sites",
    title: "Core Web Vitals for Content Sites",
    excerpt: "Tactical improvements to LCP, CLS, and INP for content-heavy websites.",
    content: [
      "Performance is not a one-time optimization but a continuous discipline.",
      "Focus on image delivery, script constraints, and predictable layout structure.",
      "Treat monitoring dashboards as part of your publishing process."
    ],
    status: "PUBLISHED",
    publishedAt: daysAgo(5),
    updatedAt: daysAgo(1),
    author: {
      id: "demo-author-1",
      name: "Maya Chen",
      slug: "maya-chen",
      bio: "Editor focused on growth engineering, technical SEO, and content operations."
    },
    categories: [
      { id: "demo-cat-1", name: "Engineering", slug: "engineering" },
      { id: "demo-cat-4", name: "Performance", slug: "performance" }
    ],
    faqs: [],
    seoTitle: "Core Web Vitals Optimization for Blog Platforms",
    seoDescription: "Practical performance tuning guidance for high-traffic content experiences."
  }
];
