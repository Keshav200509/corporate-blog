import Link from "next/link";
import { fetchApiJson } from "../src/blog/api";

type OverviewResponse = {
  stats: { posts: number; authors: number; categories: number };
  featured: Array<{ id: string; title: string; excerpt: string; slug: string; author: { name: string } }>;
  latest: Array<{ id: string; title: string; slug: string; publishedAt: string | null; categories: Array<{ name: string }> }>;
  categories: Array<{ id: string; name: string; slug: string; _count?: { postCategories: number } }>;
};

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const overview = await fetchApiJson<OverviewResponse>("/api/blog/overview");

  return (
    <main className="mx-auto max-w-7xl space-y-14 px-6 py-10">
      <section className="grid gap-8 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-8 text-white md:grid-cols-[1.2fr_1fr] md:p-12">
        <div className="space-y-5">
          <p className="inline-flex rounded-full bg-blue-500/30 px-3 py-1 text-xs font-semibold uppercase tracking-wide">Executive Intelligence Network</p>
          <h1 className="text-4xl font-bold leading-tight md:text-6xl">A living newsroom for strategy, operations, and market shifts.</h1>
          <p className="max-w-xl text-slate-300">Real posts, real authors, and real taxonomy pulled through the internal API so every surface reflects current data.</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/blog" className="rounded-md bg-white px-5 py-2.5 text-sm font-semibold text-slate-950">Read latest posts</Link>
            <Link href="/search" className="rounded-md border border-white/30 px-5 py-2.5 text-sm font-semibold">Run strategic search</Link>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 rounded-xl border border-white/10 bg-white/5 p-5 text-center backdrop-blur">
          <article>
            <p className="text-3xl font-bold">{overview.stats.posts}</p>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Posts</p>
          </article>
          <article>
            <p className="text-3xl font-bold">{overview.stats.authors}</p>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Authors</p>
          </article>
          <article>
            <p className="text-3xl font-bold">{overview.stats.categories}</p>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Categories</p>
const quickPaths = [
  {
    title: "The Sovereignty of Silicon",
    description: "How tech giants are reshaping global diplomacy and sovereign policy.",
    href: "/blog/launching-seo-first-content-platform"
  },
  {
    title: "Browse by category",
    description: "Find content grouped by topic.",
    href: "/category"
  },
  {
    title: "Meet the authors",
    description: "Explore profiles and all articles by each writer.",
    href: "/author"
  },
  {
    title: "Operations readiness",
    description: "Internal launch board for content, security, and publishing checks.",
    href: "/ops/readiness"
  }
];

const highlights = [
  { label: "SEO-ready metadata", value: "Canonical + OG + JSON-LD" },
  { label: "Editorial workflow", value: "Writer → Editor publish flow" },
  { label: "Rendering strategy", value: "ISR + dynamic APIs" }
];

export default function HomePage() {
  return (
    <main className="mx-auto max-w-5xl space-y-10 px-6 py-16">
      <header className="space-y-4">
        <p className="inline-flex rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 dark:border-indigo-500/40 dark:bg-indigo-500/10 dark:text-indigo-200">
          Production-ready corporate publishing
        </p>
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">The Corporate Blog</h1>
        <p className="max-w-3xl text-zinc-600 dark:text-zinc-300">
          A production-style publishing application with draft workflows, role-based publishing controls, SEO-first pages, and scalable serverless architecture.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-3" aria-label="Platform highlights">
        {highlights.map((item) => (
          <article key={item.label} className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-xs uppercase tracking-wide text-zinc-500">{item.label}</p>
            <p className="mt-2 text-sm font-medium text-zinc-800 dark:text-zinc-200">{item.value}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {quickPaths.map((path) => (
          <article key={path.href} className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-lg font-semibold">{path.title}</h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">{path.description}</p>
            <Link href={path.href} className="mt-4 inline-block text-sm font-medium text-indigo-700 underline underline-offset-2 dark:text-indigo-300">
              Open
            </Link>
          </article>
        </div>
      </section>

      <section>
        <div className="mb-5 flex items-end justify-between">
          <h2 className="text-3xl font-semibold">Featured analysis</h2>
          <Link href="/blog" className="text-sm font-semibold text-slate-700 hover:underline">View all →</Link>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {overview.featured.map((item) => (
            <article key={item.id} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">By {item.author.name}</p>
              <h3 className="mt-2 text-2xl font-semibold leading-tight">{item.title}</h3>
              <p className="mt-3 text-sm text-slate-600">{item.excerpt}</p>
              <Link href={`/blog/${item.slug}`} className="mt-5 inline-block text-sm font-semibold hover:underline">Open brief →</Link>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-[1.4fr_0.8fr]">
        <article className="rounded-2xl border border-slate-200 bg-white p-8">
          <h2 className="text-2xl font-semibold">Latest from the wire</h2>
          <div className="mt-4 space-y-4">
            {overview.latest.map((post) => (
              <div key={post.id} className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3 last:border-b-0">
                <div>
                  <Link href={`/blog/${post.slug}`} className="font-medium text-slate-900 hover:underline">{post.title}</Link>
                  <p className="text-xs text-slate-500">{post.categories[0]?.name ?? "General"}</p>
                </div>
                <p className="text-xs uppercase tracking-wide text-slate-400">{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("en-US") : "Draft"}</p>
              </div>
            ))}
          </div>
        </article>
        <aside className="rounded-2xl bg-slate-950 p-8 text-white">
          <h3 className="text-2xl font-semibold">Category radar</h3>
          <div className="mt-4 space-y-2 text-sm text-slate-300">
            {overview.categories.map((category) => (
              <Link key={category.id} href={`/category/${category.slug}`} className="block rounded border border-white/10 px-3 py-2 hover:bg-white/10">
                {category.name}
              </Link>
            ))}
          </div>
        </aside>
      </section>
    </main>
  );
}
