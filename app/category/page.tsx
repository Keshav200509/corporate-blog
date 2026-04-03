
import Link from "next/link";
import type { Metadata } from "next";
import { listCategories } from "../../src/blog/services/category-service";
import { getCanonicalUrl, getSiteName } from "../../src/blog/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `Categories | ${getSiteName()}`,
  description: "Browse all content categories in The Corporate Blog.",
  alternates: {
    canonical: getCanonicalUrl("/category")
  }
};

export default async function CategoryIndexPage() {
  const categories = await listCategories();

  return (
    <main className="mx-auto max-w-5xl space-y-6 px-6 py-12">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-300">Find posts grouped by topic and expertise area.</p>
      </header>

      {categories.length === 0 ? (
        <section className="rounded-xl border border-dashed border-zinc-300 p-8 text-center dark:border-zinc-700">
          <p className="text-zinc-600 dark:text-zinc-300">No categories found yet.</p>
        </section>
      ) : (
        <section className="grid gap-4 md:grid-cols-3" aria-label="Category list">
          {categories.map((category) => (
            <article
              key={category.id}
              className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
            >
              <h2 className="text-lg font-semibold">
                <Link href={`/category/${category.slug}`} className="hover:underline">
                  {category.name}
                </Link>
              </h2>
              <p className="mt-3 text-xs uppercase tracking-wide text-zinc-500">
                {category._count.postCategories} post{category._count.postCategories === 1 ? "" : "s"}
              </p>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
