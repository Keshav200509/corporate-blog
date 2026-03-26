import Link from "next/link";
import type { Metadata } from "next";
import { getPublishedPosts } from "../../src/blog/data";
import { listCategories } from "../../src/blog/services/category-service";
import { getCanonicalUrl, getSiteName } from "../../src/blog/seo";

export const revalidate = 300;

export const metadata: Metadata = {
  title: `Blog | ${getSiteName()}`,
  description: "Insights on engineering, SEO, and scalable digital publishing.",
  alternates: {
    canonical: getCanonicalUrl("/blog")
  }
};

export default async function BlogIndexPage() {
  const [posts, categories] = await Promise.all([getPublishedPosts(), listCategories()]);
  const [featured, ...remaining] = posts;

  const formatDate = (iso: string | null) =>
    iso
      ? new Intl.DateTimeFormat("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric"
        }).format(new Date(iso))
      : "Unscheduled";

  if (posts.length === 0) {
    return (
      <main className="mx-auto flex w-full max-w-4xl flex-col items-center gap-4 px-6 py-16 text-center">
        <h1 className="text-3xl font-bold tracking-tight">The Corporate Blog</h1>
        <p className="max-w-xl text-zinc-500">No published posts yet. Start from the homepage and check back shortly.</p>
        <Link href="/" className="text-sm font-medium underline">
          ← Back home
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-12">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">The Corporate Blog</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-300">Production-minded articles on platform engineering, SEO, and growth operations.</p>
      </header>

      <section className="-mx-2 overflow-x-auto px-2 pb-1" aria-label="Category filters">
        <div className="flex min-w-max gap-2">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="rounded-full border border-zinc-300 px-3 py-1 text-xs font-medium text-zinc-700 hover:border-zinc-900 hover:text-zinc-900 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-300 dark:hover:text-zinc-100"
            >
              {category.name}
            </Link>
          ))}
        </div>
      </section>

      {featured ? (
        <article className="rounded-2xl border border-zinc-200 p-6 shadow-sm dark:border-zinc-800">
          <p className="text-xs uppercase tracking-wide text-zinc-500">{featured.categories[0]?.name ?? "General"}</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight">
            <Link href={`/blog/${featured.slug}`} className="hover:underline">
              {featured.title}
            </Link>
          </h2>
          <p className="mt-3 max-w-3xl text-zinc-600 dark:text-zinc-300">{featured.excerpt}</p>
          <div className="mt-4 flex items-center gap-3 text-sm text-zinc-500 dark:text-zinc-400">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 font-semibold dark:bg-zinc-800">
              {featured.author.name.slice(0, 1).toUpperCase()}
            </span>
            <span>{featured.author.name}</span>
            <span>•</span>
            <span>{formatDate(featured.publishedAt)}</span>
          </div>
          <Link href={`/blog/${featured.slug}`} className="mt-5 inline-block text-sm font-semibold underline">
            Read →
          </Link>
        </article>
      ) : null}

      <section className="grid gap-4 md:grid-cols-2" aria-label="Published posts">
        {remaining.map((post) => (
          <article key={post.id} className="rounded-xl border border-zinc-200 p-5 shadow-sm dark:border-zinc-800">
            <p className="text-xs uppercase tracking-wide text-zinc-500">{post.categories[0]?.name ?? "General"}</p>
            <h2 className="mt-2 text-xl font-semibold">
              <Link href={`/blog/${post.slug}`} className="hover:underline">
                {post.title}
              </Link>
            </h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">{post.excerpt}</p>
            <div className="mt-4 flex items-center gap-3 text-sm text-zinc-500 dark:text-zinc-400">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-100 text-xs font-semibold dark:bg-zinc-800">
                {post.author.name.slice(0, 1).toUpperCase()}
              </span>
              <span>{post.author.name}</span>
              <span>•</span>
              <span>{formatDate(post.publishedAt)}</span>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
