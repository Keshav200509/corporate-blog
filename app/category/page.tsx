import Link from "next/link";
import type { Metadata } from "next";
import { listCategories } from "../../src/blog/services/category-service";
import { getCanonicalUrl, getSiteName } from "../../src/blog/seo";
import { categoryColor } from "../../src/components/PostCard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `Topics | ${getSiteName()}`,
  description: "Browse all content categories in The Corporate Blog.",
  alternates: {
    canonical: getCanonicalUrl("/category")
  }
};

export default async function CategoryIndexPage() {
  const categories = await listCategories();

  return (
    <main className="mx-auto max-w-5xl space-y-10 px-6 py-12">

      {/* ── Header ───────────────────────────────────────────────── */}
      <header className="space-y-3 animate-fade-in">
        <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
          The Corporate Blog
        </p>
        <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
          Topics &amp; Verticals
        </h1>
        <p className="max-w-xl text-base text-zinc-600 dark:text-zinc-400">
          Find posts grouped by topic, discipline, and expertise area — built for specialists.
        </p>
      </header>

      {/* ── Category grid ────────────────────────────────────────── */}
      {categories.length === 0 ? (
        <section className="rounded-2xl border border-dashed border-zinc-300 p-14 text-center dark:border-zinc-700">
          <p className="text-lg font-semibold text-zinc-500">No categories found yet.</p>
        </section>
      ) : (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-label="Category list">
          {categories.map((cat, i) => {
            const color = categoryColor(cat.slug);
            return (
              <article
                key={cat.id}
                className="card card-hover group relative overflow-hidden"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                {/* Color accent stripe */}
                <div className={`h-1 w-full ${color.accent}`} />
                <div className="p-6">
                  <span className={color.badge}>{cat.name}</span>
                  {cat.description && (
                    <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 line-clamp-2">
                      {cat.description}
                    </p>
                  )}
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                      {cat._count.postCategories} post{cat._count.postCategories !== 1 ? "s" : ""}
                    </p>
                    <Link
                      href={`/category/${cat.slug}`}
                      className="text-xs font-semibold text-indigo-600 transition hover:text-indigo-500 dark:text-indigo-400 group-hover:translate-x-0.5"
                    >
                      Browse →
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      )}

      {/* ── CTA ─────────────────────────────────────────────────── */}
      <section className="rounded-2xl bg-gradient-to-r from-indigo-50 to-violet-50 p-8 text-center dark:from-indigo-950/40 dark:to-violet-950/40">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
          Looking for something specific?
        </h2>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Use our search to find posts by keyword, topic, or author.
        </p>
        <Link
          href="/search"
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500"
        >
          Search articles →
        </Link>
      </section>

    </main>
  );
}
