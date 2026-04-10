import Link from "next/link";
import type { Metadata } from "next";
import { getPublishedPosts } from "../../src/blog/data";
import { listCategories } from "../../src/blog/services/category-service";
import { getReadinessSnapshot } from "../../src/ops/readiness";
import { getCanonicalUrl, getSiteName } from "../../src/blog/seo";

export const metadata: Metadata = {
  title: `Explore | ${getSiteName()}`,
  description: "Expanded discovery workflows for posts, categories, and operational readiness.",
  alternates: {
    canonical: getCanonicalUrl("/explore")
  }
};

export const dynamic = "force-dynamic";

export default async function ExplorePage() {
  const [posts, categories, readiness] = await Promise.all([
    getPublishedPosts(),
    listCategories(),
    getReadinessSnapshot()
  ]);

  const latest = posts.slice(0, 5);

  return (
    <main className="mx-auto max-w-7xl space-y-8 px-6 py-10">
      <header className="rounded-2xl bg-white p-8 shadow-sm">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Expanded workflow</p>
        <h1 className="mt-2 text-5xl font-bold tracking-tight text-slate-950">Explore intelligence workflows</h1>
        <p className="mt-3 max-w-3xl text-slate-600">A single hub that ties together editorial discovery, category navigation, and ops-readiness tracking.</p>
      </header>

      <section className="grid gap-6 md:grid-cols-2">
        <article className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-2xl font-semibold">Latest reports</h2>
          <div className="mt-4 space-y-4">
            {latest.map((post) => (
              <div key={post.id}>
                <Link href={`/blog/${post.slug}`} className="font-medium hover:underline">{post.title}</Link>
                <p className="text-sm text-slate-600">{post.excerpt}</p>
              </div>
            ))}
          </div>
          <Link href="/blog" className="mt-6 inline-block text-sm font-semibold hover:underline">Go to full blog feed →</Link>
        </article>

        <article className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-2xl font-semibold">Ops pulse</h2>
          <p className="mt-2 text-sm text-slate-600">
            Current overall status: <span className="font-semibold uppercase">{readiness.overallStatus}</span>
          </p>
          <div className="mt-4 space-y-2">
            {readiness.checks.slice(0, 5).map((check) => (
              <div key={check.key} className="flex items-center justify-between rounded border border-slate-200 px-3 py-2 text-sm">
                <span>{check.title}</span>
                <span className="font-semibold uppercase text-slate-500">{check.status}</span>
              </div>
            ))}
          </div>
          <Link href="/ops/readiness" className="mt-6 inline-block text-sm font-semibold hover:underline">Open readiness board →</Link>
        </article>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-2xl font-semibold">Category launchpads</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map((category) => (
            <Link key={category.id} href={`/category/${category.slug}`} className="rounded border border-slate-200 px-3 py-1.5 text-sm hover:bg-slate-100">
              {category.name}
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
