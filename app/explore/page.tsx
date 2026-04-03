import Link from "next/link";
import type { Metadata } from "next";
import { fetchApiJson } from "../../src/blog/api";
import { getCanonicalUrl, getSiteName } from "../../src/blog/seo";

export const metadata: Metadata = {
  title: `Explore | ${getSiteName()}`,
  description: "Expanded discovery workflows for posts, categories, and operational readiness.",
  alternates: {
    canonical: getCanonicalUrl("/explore")
  }
};

type OverviewResponse = {
  latest: Array<{ id: string; title: string; slug: string; excerpt: string; author: { name: string } }>;
  categories: Array<{ id: string; name: string; slug: string }>;
};

type ReadinessResponse = {
  overallStatus: string;
  checks: Array<{ key: string; title: string; status: string }>;
};

export const dynamic = "force-dynamic";

export default async function ExplorePage() {
  const [overview, readiness] = await Promise.all([
    fetchApiJson<OverviewResponse>("/api/blog/overview"),
    fetchApiJson<ReadinessResponse>("/api/ops/readiness")
  ]);

  return (
    <main className="mx-auto max-w-7xl space-y-8 px-6 py-10">
      <header className="rounded-2xl bg-white p-8 shadow-sm">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Expanded workflow</p>
        <h1 className="mt-2 text-5xl font-bold tracking-tight text-slate-950">Explore intelligence workflows</h1>
        <p className="mt-3 max-w-3xl text-slate-600">A single hub that ties together editorial discovery, category navigation, and ops-readiness tracking through existing public APIs.</p>
      </header>

      <section className="grid gap-6 md:grid-cols-2">
        <article className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-2xl font-semibold">Latest reports</h2>
          <div className="mt-4 space-y-4">
            {overview.latest.slice(0, 5).map((post) => (
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
          <p className="mt-2 text-sm text-slate-600">Current overall status: <span className="font-semibold uppercase">{readiness.overallStatus}</span></p>
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
          {overview.categories.map((category) => (
            <Link key={category.id} href={`/category/${category.slug}`} className="rounded border border-slate-200 px-3 py-1.5 text-sm hover:bg-slate-100">
              {category.name}
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-700">
        <p className="font-semibold">Input needed from your end for fuller completion:</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Provide final design references (2–3 URLs or screenshots) to align exact visual direction.</li>
          <li>Share approved content/API sources (RSS feeds, partner endpoints, or internal CMS schema) for richer live data ingestion.</li>
          <li>Provide brand assets (logo SVG, palette, typography) for pixel-accurate UI polish.</li>
        </ul>
      </section>
    </main>
  );
}
