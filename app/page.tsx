import Link from "next/link";
import { fetchApiJson } from "../src/blog/api";

type OverviewResponse = {
  stats: { posts: number; authors: number; categories: number };
  featured: Array<{ id: string; title: string; excerpt: string; slug: string; author: { name: string } }>;
  latest: Array<{ id: string; title: string; slug: string; publishedAt: string | null; categories: Array<{ name: string }> }>;
  categories: Array<{ id: string; name: string; slug: string; _count?: { postCategories: number } }>;
};

export const dynamic = "force-dynamic";

const quickPaths = [
  { href: "/blog", label: "Read latest posts" },
  { href: "/search", label: "Run strategic search" },
  { href: "/explore", label: "Explore workflows" }
];

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
            {quickPaths.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className={index === 0 ? "rounded-md bg-white px-5 py-2.5 text-sm font-semibold text-slate-950" : "rounded-md border border-white/30 px-5 py-2.5 text-sm font-semibold"}
              >
                {item.label}
              </Link>
            ))}
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
