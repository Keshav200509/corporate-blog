import Link from "next/link";
import type { Metadata } from "next";
import { getPublishedPosts } from "../../src/blog/data";
import { listCategories } from "../../src/blog/services/category-service";
import { getCanonicalUrl, getSiteName } from "../../src/blog/seo";

export const revalidate = 300;
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

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-6 py-12">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">The Corporate Blog</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-300">Production-minded articles on platform engineering, SEO, and growth operations.</p>
      </header>

      {posts.length === 0 ? (
        <section className="rounded-xl border border-dashed border-zinc-300 p-8 text-center dark:border-zinc-700">
          <p className="text-zinc-600 dark:text-zinc-300">No published posts yet.</p>
        </section>
      ) : (
        <section className="space-y-4" aria-label="Published posts">
          {posts.map((post) => (
            <article key={post.id} className="rounded-xl border border-zinc-200 p-5 shadow-sm dark:border-zinc-800">
              <p className="text-xs uppercase tracking-wide text-zinc-500">{post.categories[0]?.name ?? "General"}</p>
              <h2 className="mt-2 text-xl font-semibold">
    <main className="mx-auto max-w-7xl space-y-10 px-6 py-10">
      <section className="grid gap-8 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-8 text-white md:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Featured Deep Dive</p>
          {lead ? (
            <>
              <h1 className="mt-3 text-5xl font-semibold leading-tight">{lead.title}</h1>
              <p className="mt-4 max-w-xl text-slate-300">{lead.excerpt}</p>
              <Link
                href={`/blog/${lead.slug}`}
                className="mt-6 inline-block rounded bg-white px-5 py-2.5 text-sm font-semibold text-slate-950"
              >
                Read Lead Story
              </Link>
            </>
          ) : (
            <h1 className="mt-3 text-5xl font-semibold leading-tight">The Corporate Blog</h1>
          )}
        </div>
        <aside className="space-y-4 rounded-xl border border-white/10 bg-white/5 p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Browse by category</p>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className="rounded border border-white/20 px-3 py-1.5 text-xs hover:bg-white/10"
              >
                {category.name} · {category._count.postCategories}
              </Link>
            ))}
          </div>
        </aside>
      </section>

      {posts.length === 0 ? (
        <section className="rounded-xl border border-dashed border-slate-300 p-10 text-center text-slate-600">
          No published posts yet.
        </section>
      ) : (
        <section className="grid gap-5 md:grid-cols-3" aria-label="Published posts">
          {posts.map((post) => (
            <article key={post.id} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                {post.categories[0]?.name ?? "General"}
              </p>
              <h2 className="mt-2 text-2xl font-semibold leading-tight">
                <Link href={`/blog/${post.slug}`} className="hover:underline">
                  {post.title}
                </Link>
              </h2>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">{post.excerpt}</p>
              <p className="mt-3 text-sm text-slate-600">{post.excerpt}</p>
              <p className="mt-4 text-xs uppercase tracking-wide text-slate-500">By {post.author.name}</p>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
