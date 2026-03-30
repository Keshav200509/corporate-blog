import Link from "next/link";
import { searchPublishedPosts } from "../../src/blog/services/search-service";

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const params = await searchParams;
  const query = (params.q ?? "").trim();

  if (!query || query.length < 2) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-16 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Search</h1>
        <p className="mt-3 text-zinc-500 dark:text-zinc-400">Enter a search term (at least 2 characters).</p>
      </main>
    );
  }

  const posts = await searchPublishedPosts(query);

  return (
    <main className="mx-auto max-w-5xl space-y-6 px-6 py-12">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Results for &quot;{query}&quot;</h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">{posts.length} matching posts</p>
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
            <article key={post.id} className="rounded-xl border border-zinc-200 p-5 shadow-sm dark:border-zinc-800">
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
