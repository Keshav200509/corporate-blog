import Link from "next/link";
import type { Metadata } from "next";
import { getPublishedPosts } from "../../src/blog/data";
import { listCategories } from "../../src/blog/services/category-service";
import { getReadinessSnapshot } from "../../src/ops/readiness";
import { getCanonicalUrl, getSiteName } from "../../src/blog/seo";
import PostCard, { categoryColor } from "../../src/components/PostCard";

export const metadata: Metadata = {
  title: `Explore | ${getSiteName()}`,
  description:
    "Expanded discovery workflows for posts, categories, and operational readiness.",
  alternates: {
    canonical: getCanonicalUrl("/explore")
  }
};

export const dynamic = "force-dynamic";

const STATUS_STYLES: Record<string, string> = {
  pass: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  warn: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  fail: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400"
};

const OVERALL_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
  healthy: {
    bg: "bg-emerald-50 dark:bg-emerald-900/20",
    text: "text-emerald-700 dark:text-emerald-400",
    dot: "bg-emerald-500"
  },
  degraded: {
    bg: "bg-amber-50 dark:bg-amber-900/20",
    text: "text-amber-700 dark:text-amber-400",
    dot: "bg-amber-500"
  },
  down: {
    bg: "bg-rose-50 dark:bg-rose-900/20",
    text: "text-rose-700 dark:text-rose-400",
    dot: "bg-rose-500"
  }
};

export default async function ExplorePage() {
  const [posts, categories, readiness] = await Promise.all([
    getPublishedPosts(),
    listCategories(),
    getReadinessSnapshot()
  ]);

  const latest = posts.slice(0, 5);
  const overall = OVERALL_STYLES[readiness.overallStatus] ?? OVERALL_STYLES.degraded;

  return (
    <main className="mx-auto max-w-7xl space-y-12 px-6 py-10">
      <header className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950 px-8 py-14 text-white animate-fade-in">
        <div className="pointer-events-none absolute right-0 top-0 h-60 w-60 translate-x-1/3 -translate-y-1/3 rounded-full bg-indigo-600/20 blur-[60px]" />
        <div className="relative">
          <span className="badge badge-indigo mb-4 inline-flex">Expanded workflow</span>
          <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">
            Explore Intelligence Workflows
          </h1>
          <p className="mt-3 max-w-2xl text-slate-400">
            A single hub that ties together editorial discovery, category navigation, and live
            ops-readiness tracking.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/blog"
              className="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-indigo-50"
            >
              Full blog feed →
            </Link>
            <Link
              href="/ops/readiness"
              className="rounded-xl border border-white/25 px-5 py-2.5 text-sm font-semibold transition hover:border-white/50 hover:bg-white/5"
            >
              Readiness board →
            </Link>
          </div>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <section className="card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Latest Reports</h2>
              <p className="text-sm text-zinc-500">Most recent editorial intelligence</p>
            </div>
            <Link
              href="/blog"
              className="text-sm font-semibold text-indigo-600 transition hover:text-indigo-500 dark:text-indigo-400"
            >
              View all →
            </Link>
          </div>
          <div className="space-y-0">
            {latest.length === 0 ? (
              <p className="py-4 text-sm text-zinc-400">No posts available yet.</p>
            ) : (
              latest.map((post, i) => (
                <PostCard key={post.id} post={post} variant="compact" index={i} />
              ))
            )}
          </div>
        </section>

        <aside className="space-y-5">
          <section className="card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Ops Pulse</h2>
              <Link
                href="/ops/readiness"
                className="text-xs font-semibold text-indigo-600 transition hover:text-indigo-500 dark:text-indigo-400"
              >
                Full board →
              </Link>
            </div>

            <div className={`flex items-center gap-3 rounded-xl px-4 py-3 ${overall.bg}`}>
              <span className={`h-2.5 w-2.5 rounded-full ${overall.dot} animate-pulse`} />
              <span className={`text-sm font-semibold uppercase tracking-wide ${overall.text}`}>
                {readiness.overallStatus}
              </span>
            </div>

            <div className="space-y-2">
              {readiness.checks.slice(0, 6).map((check) => {
                const style = STATUS_STYLES[check.status] ?? STATUS_STYLES.warn;
                return (
                  <div
                    key={check.key}
                    className="flex items-center justify-between rounded-lg border border-zinc-100 px-3 py-2.5 text-sm dark:border-zinc-800"
                  >
                    <span className="text-zinc-700 dark:text-zinc-300">{check.title}</span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${style}`}
                    >
                      {check.status}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Topic Launchpads</h2>
              <Link
                href="/category"
                className="text-xs font-semibold text-indigo-600 transition hover:text-indigo-500 dark:text-indigo-400"
              >
                All topics →
              </Link>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => {
                const color = categoryColor(cat.slug);
                return (
                  <Link
                    key={cat.id}
                    href={`/category/${cat.slug}`}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition hover:opacity-75 ${color.badge}`}
                  >
                    {cat.name}
                    <span className="ml-1 opacity-60">{cat._count.postCategories}</span>
                  </Link>
                );
              })}
            </div>
          </section>
        </aside>
      </div>
    </main>
  );
}
