import Link from "next/link";
import { searchPublishedPosts } from "../../src/blog/services/search-service";
import PostCard from "../../src/components/PostCard";

function SearchForm({ query }: { query: string }) {
  return (
    <form action="/search" className="flex w-full gap-2">
      <div className="relative flex-1">
        <svg
          className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          name="q"
          type="search"
          defaultValue={query}
          minLength={2}
          required
          placeholder="Search articles, topics, and ideas…"
          className="w-full rounded-xl border border-zinc-300 bg-white py-3 pl-10 pr-4 text-sm outline-none ring-indigo-500 transition focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:placeholder-zinc-500"
          autoFocus
        />
      </div>
      <button
        type="submit"
        className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500"
      >
        Search
      </button>
    </form>
  );
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const sp = await searchParams;
  const query = (sp.q ?? "").trim();

  if (!query || query.length < 2) {
    return (
      <main className="mx-auto max-w-3xl space-y-10 px-6 py-16">
        <header className="space-y-3 text-center animate-fade-in">
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
            Search
          </p>
          <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
            Find what you&apos;re looking for
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            Search across all published articles, topics, and insights.
          </p>
        </header>
        <SearchForm query={query} />

        {/* Quick links */}
        <section className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">Quick links</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { href: "/blog", label: "All Articles" },
              { href: "/category", label: "Topics" },
              { href: "/author", label: "Authors" },
              { href: "/explore", label: "Explore" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="card card-hover flex items-center justify-center p-4 text-sm font-semibold text-zinc-700 dark:text-zinc-300"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </section>
      </main>
    );
  }

  const posts = await searchPublishedPosts(query);

  return (
    <main className="mx-auto max-w-4xl space-y-8 px-6 py-12">

      {/* ── Search bar ───────────────────────────────────────────── */}
      <header className="space-y-4">
        <div className="flex items-center gap-2">
          <Link href="/search" className="text-sm text-zinc-400 transition hover:text-zinc-700 dark:hover:text-zinc-200">
            Search
          </Link>
          <span className="text-zinc-300 dark:text-zinc-600">/</span>
          <span className="text-sm font-medium text-zinc-900 dark:text-white">&ldquo;{query}&rdquo;</span>
        </div>
        <SearchForm query={query} />
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {posts.length === 0
            ? "No results found"
            : `${posts.length} result${posts.length !== 1 ? "s" : ""} for "${query}"`}
        </p>
      </header>

      {/* ── Results ──────────────────────────────────────────────── */}
      {posts.length === 0 ? (
        <section className="rounded-2xl border border-dashed border-zinc-300 p-14 text-center dark:border-zinc-700">
          <p className="text-lg font-semibold text-zinc-500">No posts found for &ldquo;{query}&rdquo;</p>
          <p className="mt-2 text-sm text-zinc-400">Try a different search term or browse by topic.</p>
          <div className="mt-6 flex justify-center gap-3">
            <Link
              href="/blog"
              className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500"
            >
              Browse all posts
            </Link>
            <Link
              href="/category"
              className="rounded-xl border border-zinc-300 px-5 py-2.5 text-sm font-semibold text-zinc-700 transition hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-300"
            >
              Browse topics
            </Link>
          </div>
        </section>
      ) : (
        <section className="space-y-4" aria-label="Search results">
          {posts.map((post, i) => (
            <PostCard key={post.id} post={post} variant="horizontal" index={i} />
          ))}
        </section>
      )}

    </main>
  );
}
