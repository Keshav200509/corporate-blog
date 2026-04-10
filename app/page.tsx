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
  const featured = posts.slice(0, 3);
  const latest = posts.slice(0, 8);
  const stats = {
    posts: posts.length,
    authors: authors.length,
    categories: categories.length
  };

  return (
    <main className="mx-auto max-w-7xl space-y-16 px-6 py-10">

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 px-8 py-16 text-white md:px-14 md:py-24">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full bg-indigo-600/20 blur-[80px]" />
        <div className="pointer-events-none absolute -bottom-20 left-10 h-72 w-72 rounded-full bg-violet-600/15 blur-[60px]" />

        <div className="relative z-10 grid gap-12 md:grid-cols-[1.3fr_0.9fr]">
          <div className="space-y-6 animate-slide-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-indigo-500/40 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-indigo-300">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-indigo-400" />
              Executive Intelligence Network
            </span>
            <h1 className="text-5xl font-extrabold leading-[1.08] tracking-tight md:text-6xl lg:text-7xl">
              A living newsroom for{" "}
              <span className="text-gradient-light">strategy</span>{" "}
              &amp; insight.
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-slate-300">
              Real authors, real taxonomy, and market intelligence — curated for decision-makers who move fast.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/blog"
                className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-indigo-50"
              >
                Read latest posts
              </Link>
              <Link
                href="/explore"
                className="rounded-xl border border-white/25 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/50 hover:bg-white/5"
              >
                Explore workflows
              </Link>
            </div>
          </div>

          {/* Stats panel */}
          <div className="animate-slide-up-delay grid grid-cols-1 gap-4 self-center">
            {[
              { value: stats.posts, label: "Published Posts", color: "from-indigo-500/20 to-indigo-600/10" },
              { value: stats.authors, label: "Expert Authors", color: "from-violet-500/20 to-violet-600/10" },
              { value: stats.categories, label: "Topic Categories", color: "from-cyan-500/20 to-cyan-600/10" },
            ].map((stat) => (
              <div
                key={stat.label}
                className={`rounded-2xl border border-white/10 bg-gradient-to-br ${stat.color} px-6 py-5 backdrop-blur`}
              >
                <p className="text-4xl font-bold tabular-nums">{stat.value}</p>
                <p className="mt-1 text-xs font-medium uppercase tracking-widest text-slate-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Post ────────────────────────────────────────────── */}
      {featured && (
        <section className="space-y-5">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Featured Story</p>
              <h2 className="mt-1 text-2xl font-bold text-zinc-900 dark:text-white">Editor&apos;s Pick</h2>
            </div>
            <Link href="/blog" className="text-sm font-semibold text-zinc-500 transition hover:text-zinc-900 dark:hover:text-white">
              View all →
            </Link>
          </div>
          <PostCard post={featured} variant="featured" />
        </section>
      )}

      {/* ── Latest from the Wire + Category Radar ────────────────────── */}
      <section className="grid gap-8 lg:grid-cols-[1fr_340px]">
        {/* Wire feed */}
        <div className="card p-6">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Latest from the wire</h2>
          <p className="mt-1 text-sm text-zinc-500">Breaking intelligence across all verticals</p>
          <div className="mt-4 divide-y divide-zinc-100 dark:divide-zinc-800">
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
              className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
            >
              View full feed <span aria-hidden>→</span>
            </Link>
          )}
        <div className="grid grid-cols-3 gap-3 rounded-xl border border-white/10 bg-white/5 p-5 text-center backdrop-blur">
          <article>
            <p className="text-3xl font-bold">{stats.posts}</p>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Posts</p>
          </article>
          <article>
            <p className="text-3xl font-bold">{stats.authors}</p>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Authors</p>
          </article>
          <article>
            <p className="text-3xl font-bold">{stats.categories}</p>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Categories</p>
          </article>
        </div>
      </section>

      <section>
        <div className="mb-5 flex items-end justify-between">
          <h2 className="text-3xl font-semibold">Featured analysis</h2>
          <Link href="/blog" className="text-sm font-semibold text-slate-700 hover:underline">
            View all →
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {featured.map((item) => (
            <article key={item.id} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">By {item.author.name}</p>
              <h3 className="mt-2 text-2xl font-semibold leading-tight">{item.title}</h3>
              <p className="mt-3 text-sm text-slate-600">{item.excerpt}</p>
              <Link href={`/blog/${item.slug}`} className="mt-5 inline-block text-sm font-semibold hover:underline">
                Open brief →
              </Link>
            </article>
          ))}
        </div>

        {/* Category radar */}
        <aside className="space-y-4">
          <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 p-6 text-white">
            <h3 className="text-lg font-bold">Topic Radar</h3>
            <p className="mt-1 text-sm text-slate-400">Navigate by expertise area</p>
            <div className="mt-4 space-y-2">
              {categories.map((cat) => {
                const color = categoryColor(cat.slug);
                return (
                  <Link
                    key={cat.id}
                    href={`/category/${cat.slug}`}
                    className="flex items-center justify-between rounded-xl border border-white/8 bg-white/5 px-4 py-3 text-sm transition hover:bg-white/10"
                  >
                    <span className="font-medium">{cat.name}</span>
                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${color.badge}`}>
                      {cat._count.postCategories}
                    </span>
      <section className="grid gap-6 md:grid-cols-[1.4fr_0.8fr]">
        <article className="rounded-2xl border border-slate-200 bg-white p-8">
          <h2 className="text-2xl font-semibold">Latest from the wire</h2>
          <div className="mt-4 space-y-4">
            {latest.map((post) => (
              <div
                key={post.id}
                className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3 last:border-b-0"
              >
                <div>
                  <Link href={`/blog/${post.slug}`} className="font-medium text-slate-900 hover:underline">
                    {post.title}
                  </Link>
                );
              })}
            </div>
            <Link
              href="/category"
              className="mt-4 block text-center text-xs font-semibold text-slate-400 transition hover:text-white"
            >
              All topics →
            </Link>
          </div>

          {/* Authors teaser */}
          <div className="card p-5">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white">Our Contributors</h3>
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
                <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-zinc-200 text-[10px] font-semibold text-zinc-600 dark:border-zinc-900 dark:bg-zinc-700 dark:text-zinc-300">
                  +{authors.length - 7}
                </span>
              )}
            </div>
            <Link
              href="/author"
              className="mt-3 block text-xs font-semibold text-indigo-600 transition hover:text-indigo-500 dark:text-indigo-400"
            >
              Meet the team →
            </Link>
        <aside className="rounded-2xl bg-slate-950 p-8 text-white">
          <h3 className="text-2xl font-semibold">Category radar</h3>
          <div className="mt-4 space-y-2 text-sm text-slate-300">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className="block rounded border border-white/10 px-3 py-2 hover:bg-white/10"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </aside>
      </section>

      {/* ── Newsletter CTA ───────────────────────────────────────────── */}
      <section className="rounded-3xl border border-indigo-100 bg-gradient-to-r from-indigo-50 to-violet-50 px-8 py-12 text-center dark:border-indigo-900/30 dark:from-indigo-950/40 dark:to-violet-950/40">
        <span className="badge badge-indigo mb-3">Stay Informed</span>
        <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">
          Intelligence straight to your inbox
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-zinc-600 dark:text-zinc-400">
          Join thousands of executives who rely on The Corporate Blog for strategic insights, market analysis, and operational intelligence.
        </p>
        <div className="mx-auto mt-6 flex max-w-md gap-2">
          <input
            type="email"
            placeholder="your@company.com"
            className="flex-1 rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm outline-none ring-indigo-500 transition focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:placeholder-zinc-500"
          />
          <button className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500">
            Subscribe
          </button>
        </div>
        <p className="mt-3 text-xs text-zinc-400">No spam. Unsubscribe at any time.</p>
      </section>

    </main>
  );
}
