import Link from "next/link";
import { searchPublishedPosts } from "../../src/blog/services/search-service";

function SearchForm({ query }: { query: string }) {
  return (
    <form action="/search" className="flex w-full max-w-xl flex-col gap-3 sm:flex-row">
      <input
        name="q"
        type="search"
        defaultValue={query}
        minLength={2}
        required
        placeholder="Search articles, topics, and ideas"
        className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none ring-indigo-500 transition focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900"
      />
      <button type="submit" className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500">
        Search
      </button>
    </form>
  );
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const params = await searchParams;
  const query = (params.q ?? "").trim();

  if (!query || query.length < 2) {
    return (
      <main className="mx-auto max-w-4xl space-y-6 px-6 py-16 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Search</h1>
        <p className="text-zinc-500 dark:text-zinc-400">Enter a search term (at least 2 characters) to discover relevant articles.</p>
        <div className="flex justify-center">
          <SearchForm query={query} />
        </div>
      </main>
    );
  }

  const posts = await searchPublishedPosts(query);

  return (
    <main className="mx-auto max-w-5xl space-y-6 px-6 py-12">
      <header className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight">Results for &quot;{query}&quot;</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">{posts.length} matching post{posts.length === 1 ? "" : "s"}</p>
        <SearchForm query={query} />
      </header>

      {posts.length === 0 ? (
        <section className="rounded-xl border border-dashed border-zinc-300 p-8 text-center dark:border-zinc-700">
          <p className="text-zinc-600 dark:text-zinc-300">No posts found for &quot;{query}&quot;.</p>
          <Link href="/blog" className="mt-3 inline-block text-sm font-medium underline">
            Browse all posts
          </Link>
        </section>
      ) : (
        <section className="grid gap-4 md:grid-cols-2" aria-label="Search results">
          {posts.map((post) => (
            <article key={post.id} className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-xs uppercase tracking-wide text-zinc-500">{post.categories[0]?.name ?? "General"}</p>
              <h2 className="mt-2 text-xl font-semibold">
                <Link href={`/blog/${post.slug}`} className="hover:underline">
                  {post.title}
                </Link>
              </h2>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">{post.excerpt}</p>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
