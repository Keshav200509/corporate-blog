import Link from "next/link";
import type { Metadata } from "next";
import { getPublishedPosts } from "../../src/blog/data";
import { listCategories } from "../../src/blog/services/category-service";
import { getCanonicalUrl, getSiteName } from "../../src/blog/seo";
import PostCard, { categoryColor } from "../../src/components/PostCard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `Blog | ${getSiteName()}`,
  description: "Insights on engineering, SEO, and scalable digital publishing.",
  alternates: {
    canonical: getCanonicalUrl("/blog")
  }
};

export default async function BlogIndexPage() {
  const [posts, categories] = await Promise.all([
    getPublishedPosts(),
    listCategories()
  ]);

  const lead = posts[0];
  const grid = posts.slice(1);

  return (
    <main className="mx-auto max-w-7xl space-y-12 px-6 py-10">

      {/* ── Page Header ──────────────────────────────────────────────── */}
      <header className="space-y-2 animate-fade-in">
        <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
          The Corporate Blog
        </p>
        <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white md:text-5xl">
          All Articles
        </h1>
        <p className="max-w-2xl text-base text-zinc-600 dark:text-zinc-400">
          Curated insights, deep dives, and market intelligence across engineering, strategy, SEO, and operations.
        </p>
      </header>

      {/* ── Category filter tabs ─────────────────────────────────────── */}
      {categories.length > 0 && (
        <section aria-label="Filter by category">
          <div className="flex flex-wrap gap-2">
            <Link
              href="/blog"
              className="rounded-full border border-indigo-600 bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white transition"
            >
              All
            </Link>
            {categories.map((cat) => {
              const color = categoryColor(cat.slug);
              return (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition hover:opacity-80 ${color.badge}`}
                >
                  {cat.name}
                  <span className="ml-1.5 opacity-60">{cat._count.postCategories}</span>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* ── Featured lead ────────────────────────────────────────────── */}
      {lead && (
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
            <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400">Featured</span>
            <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
          </div>
          <PostCard post={lead} variant="featured" />
        </section>
      )}

      {/* ── Post grid ────────────────────────────────────────────────── */}
      {posts.length === 0 ? (
        <section className="rounded-2xl border border-dashed border-zinc-300 p-14 text-center dark:border-zinc-700">
          <p className="text-lg font-semibold text-zinc-500">No published posts yet.</p>
          <p className="mt-2 text-sm text-zinc-400">Check back soon — great content is on its way.</p>
        </section>
      ) : grid.length > 0 ? (
        <section aria-label="Published posts">
          <div className="flex items-center gap-2 mb-6">
            <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
            <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
              {grid.length} more article{grid.length !== 1 ? "s" : ""}
            </span>
            <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {grid.map((post, i) => (
              <PostCard key={post.id} post={post} variant="default" index={i} />
            ))}
          </div>
        </section>
      ) : null}

    </main>
  );
}
