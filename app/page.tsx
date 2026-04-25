import Link from "next/link";
import { getPublishedPosts } from "../src/blog/data";
import { listAuthors } from "../src/blog/services/author-service";
import { listCategories } from "../src/blog/services/category-service";
import PostCard, { categoryColor, initials } from "../src/components/PostCard";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [posts, authors, categories] = await Promise.all([
    getPublishedPosts(),
    listAuthors(),
    listCategories()
  ]);

  const featured = posts[0];
  const wire = posts.slice(1, 9);
  const stats = {
    posts: posts.length,
    authors: authors.length,
    categories: categories.length,
  };

  return (
    <main className="mx-auto max-w-7xl space-y-16 px-6 py-10">

      {/* ── Hero — Design spec: 135deg gradient, 20px radius, 64px padding, 55/45 grid ── */}
      <section
        className="relative overflow-hidden rounded-[20px] px-16 py-16 text-white md:py-20"
        style={{ background: "linear-gradient(135deg, #020617 0%, #1e1b4b 55%, #0f172a 100%)" }}
      >
        {/* Dot grid texture */}
        <div className="pointer-events-none absolute inset-0 bg-dot-grid" />
        {/* Ambient glows */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full bg-indigo-600/20 blur-[80px]" />
        <div className="pointer-events-none absolute -bottom-20 left-10 h-72 w-72 rounded-full bg-violet-600/15 blur-[60px]" />

        <div className="relative z-10 grid gap-12 md:grid-cols-[55%_45%]">

          {/* Left column */}
          <div className="space-y-8 animate-slide-up">
            {/* Badge pill — pulsing green dot + label */}
            <span
              className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-widest text-white"
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.15)",
              }}
            >
              {/* Design spec: pulsing green dot, 8px, #10b981 */}
              <span
                className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse-dot"
                aria-hidden={true}
              />
              Executive Intelligence Network
            </span>

            {/* Headline — 56–72px/800, "strategy" in #818cf8 (indigo-400) */}
            <h1 className="text-5xl font-extrabold leading-[1.05] tracking-tight md:text-6xl lg:text-[72px]">
              A living newsroom for{" "}
              <span style={{ color: "#818cf8" }}>strategy</span>{" "}
      {/* ── Hero ────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 px-8 py-16 text-white md:px-14 md:py-24">
        {/* Background textures */}
        <div className="pointer-events-none absolute inset-0 bg-dot-grid" />
        <div className="pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full bg-indigo-600/20 blur-[80px]" />
        <div className="pointer-events-none absolute -bottom-20 left-10 h-72 w-72 rounded-full bg-violet-600/15 blur-[60px]" />

        <div className="relative z-10 grid gap-12 md:grid-cols-[1.3fr_0.9fr]">
          <div className="space-y-6 animate-slide-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-indigo-500/40 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-indigo-300">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-indigo-400" aria-hidden />
              Executive Intelligence Network
            </span>
            <h1 className="text-5xl font-extrabold leading-[1.08] tracking-tight md:text-6xl lg:text-7xl">
              A living newsroom for{" "}
              <span className="text-gradient-light">strategy</span>{" "}
              &amp; insight.
            </h1>

            {/* Subheading — 18px/400, rgba(255,255,255,0.65) */}
            <p
              className="max-w-[480px] text-[18px] leading-relaxed"
              style={{ color: "rgba(255,255,255,0.65)" }}
            >
              Real authors, real taxonomy, and market intelligence — curated for
              decision-makers who move fast.
            </p>

            {/* CTAs — primary: white bg; secondary: transparent border */}
            <div className="flex flex-wrap gap-3">
              <Link
                href="/blog"
                className="rounded-[9px] bg-white px-6 py-3 text-[15px] font-semibold text-zinc-900 transition hover:bg-indigo-50"
              >
                Read latest posts
              </Link>
              <Link
                href="/explore"
                className="rounded-[9px] px-6 py-3 text-[15px] font-semibold text-white transition hover:bg-white/5"
                style={{ border: "1.5px solid rgba(255,255,255,0.35)" }}
              >
                Explore workflows
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden><path d="m20 6-11 11-5-5"/></svg>
                No paywalls
              </span>
              <span className="flex items-center gap-1.5">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden><path d="m20 6-11 11-5-5"/></svg>
                Verified authors
              </span>
              <span className="flex items-center gap-1.5">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden><path d="m20 6-11 11-5-5"/></svg>
                Weekly updates
              </span>
            </div>
          </div>

          {/* Right column — stat cards stacked, 12px gap */}
          <div className="animate-slide-up-delay flex flex-col gap-3 self-center">
            {[
              { value: stats.posts,      label: "Published\nPosts"     },
              { value: stats.authors,    label: "Expert\nAuthors"      },
              { value: stats.categories, label: "Topic\nCategories"    },
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex items-center justify-between rounded-[14px] px-7 py-5"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.10)",
                }}
          {/* Stats */}
          <div className="animate-slide-up-delay grid grid-cols-1 gap-4 self-center">
            {[
              { value: stats.posts,      label: "Published Posts",  color: "from-indigo-500/20 to-indigo-600/10" },
              { value: stats.authors,    label: "Expert Authors",    color: "from-violet-500/20 to-violet-600/10" },
              { value: stats.categories, label: "Topic Categories",  color: "from-cyan-500/20 to-cyan-600/10"    },
            ].map((stat) => (
              <div
                key={stat.label}
                className={`rounded-2xl border border-white/10 bg-gradient-to-br ${stat.color} px-6 py-5 backdrop-blur-sm`}
              >
                {/* Stat number — 40px/800 */}
                <p className="text-[40px] font-extrabold tabular-nums leading-none">
                  {stat.value}
                </p>
                {/* Stat label — 11px/600 uppercase, rgba(255,255,255,0.5) */}
                <p
                  className="text-right text-[11px] font-semibold uppercase leading-tight tracking-widest"
                  style={{ color: "rgba(255,255,255,0.5)", whiteSpace: "pre-line" }}
                >
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Story ──────────────────────────────────────── */}
      {featured && (
        <section className="space-y-4">
          <div className="flex items-end justify-between">
            <div>
              <p className="section-eyebrow">Featured Story</p>
              <h2 className="mt-1 text-[28px] font-bold text-zinc-900 dark:text-white">
              <h2 className="mt-1 text-2xl font-bold text-zinc-900 dark:text-white">
                Editor&apos;s Pick
              </h2>
            </div>
            <Link
              href="/blog"
              className="text-sm font-semibold text-zinc-500 transition hover:text-zinc-900 dark:hover:text-white"
            >
              View all {"→"}
            </Link>
          </div>
          <PostCard post={featured} variant="featured" />
        </section>
      )}

      {/* ── Wire + Sidebar ──────────────────────────────────────── */}
      <section className="grid gap-8 lg:grid-cols-[1fr_340px]">

        {/* Latest feed */}
        <div className="card p-6">
          <div className="mb-5 flex items-start justify-between">
            <div>
              <h2 className="text-[22px] font-bold text-zinc-900 dark:text-white">
                Latest from the wire
              </h2>
              <p className="mt-1 text-[15px] text-zinc-500">
                Breaking intelligence across all verticals
              </p>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                Latest from the wire
              </h2>
              <p className="mt-1 text-sm text-zinc-500">Breaking intelligence across all verticals</p>
            </div>
            {wire.length > 0 && (
              <Link
                href="/blog"
                className="shrink-0 text-sm font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
              >
                All posts {"→"}
              </Link>
            )}
          </div>
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {wire.length === 0 ? (
              <p className="py-4 text-sm text-zinc-400">No posts yet — check back soon.</p>
            ) : (
              wire.map((post, i) => (
                <PostCard key={post.id} post={post} variant="compact" index={i} />
              ))
            )}
          </div>
          {posts.length > 9 && (
            <Link
              href="/blog"
              className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
            >
              View full feed {"→"}
            </Link>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-4">

          {/* Topic radar */}
          <div
            className="rounded-2xl p-6 text-white"
            style={{ background: "linear-gradient(135deg, #0f172a, #1e1b4b)" }}
          >
          <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 p-6 text-white">
            <h3 className="text-lg font-bold">Topic Radar</h3>
            <p className="mt-1 text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
              Navigate by expertise area
            </p>
            <div className="mt-4 space-y-2">
              {categories.map((cat) => {
                const color = categoryColor(cat.slug);
                return (
                  <Link
                    key={cat.id}
                    href={`/category/${cat.slug}`}
                    className="flex items-center justify-between rounded-xl px-4 py-3 text-sm transition hover:bg-white/10"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                  >
                    <span className="font-medium">{cat.name}</span>
                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${color.badge}`}>
                      {cat._count.postCategories}
                    </span>
                  </Link>
                );
              })}
              {categories.length === 0 && (
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
                  No categories yet.
                </p>
                <p className="text-sm text-slate-500">No categories yet.</p>
              )}
            </div>
            <Link
              href="/category"
              className="mt-4 block text-center text-xs font-semibold transition hover:text-white"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              All topics {"→"}
            </Link>
          </div>

          {/* Contributors */}
          <div className="card p-5">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white">Our Contributors</h3>
            <p className="mt-0.5 text-xs text-zinc-500">Industry experts &amp; strategists</p>
            <div className="mt-3 flex -space-x-2">
              {authors.slice(0, 7).map((author) => (
                <Link
                  key={author.id}
                  href={`/author/${author.slug}`}
                  title={author.name}
                  className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-indigo-600 text-[10px] font-bold text-white transition hover:z-10 hover:scale-110 dark:border-zinc-900"
                >
                  {initials(author.name)}
                </Link>
              ))}
              {authors.length > 7 && (
                <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-zinc-100 text-[10px] font-semibold text-zinc-500 dark:border-zinc-900 dark:bg-zinc-800 dark:text-zinc-300">
                  +{authors.length - 7}
                </span>
              )}
            </div>
            <Link
              href="/author"
              className="mt-3 block text-xs font-semibold text-indigo-600 transition hover:text-indigo-500 dark:text-indigo-400"
            >
              Meet the team {"→"}
            </Link>
          </div>

          {/* Explore CTA */}
          <div className="rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-50 p-5 dark:from-indigo-950/40 dark:to-violet-950/40">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white">Deep intelligence</h3>
            <p className="mt-1 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
              Editorial workflows, operational readiness, and category launchpads.
              Explore editorial workflows, operational readiness, and category launchpads.
            </p>
            <Link
              href="/explore"
              className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 transition hover:text-indigo-500 dark:text-indigo-400"
            >
              Open explorer {"→"}
            </Link>
          </div>
        </aside>
      </section>

    </main>
  );
}
