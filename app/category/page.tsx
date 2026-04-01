import Link from "next/link";
import type { Metadata } from "next";
import { listCategories } from "../../src/blog/services/category-service";
import { getCanonicalUrl, getSiteName } from "../../src/blog/seo";

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
<<<<<<< codex/analyze-code-and-identify-errors-3tlzvb
    <main className="mx-auto max-w-7xl space-y-8 px-6 py-10">
      <section className="grid gap-6 rounded-2xl bg-white p-8 shadow-sm md:grid-cols-[1.2fr_1fr]">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Institutional Intelligence</p>
          <h1 className="mt-2 text-6xl font-bold tracking-tight text-slate-950">Categories</h1>
          <p className="mt-4 max-w-2xl text-slate-600">Discover intelligence verticals from technology to governance, macro-economics, and editorial operations.</p>
        </div>
        <div className="rounded-lg border border-slate-200 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Explore by signal strength</p>
          <p className="mt-3 text-sm text-slate-600">Each category is powered by curator recommendations and real engagement patterns.</p>
        </div>
      </section>

      {categories.length === 0 ? (
        <section className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-slate-600">No categories found yet.</section>
      ) : (
        <section className="grid gap-5 md:grid-cols-3" aria-label="Category list">
          {categories.map((category) => (
            <article key={category.id} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-semibold">
=======
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
            <article key={category.id} className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <h2 className="text-lg font-semibold">
>>>>>>> main
                <Link href={`/category/${category.slug}`} className="hover:underline">
                  {category.name}
                </Link>
              </h2>
<<<<<<< codex/analyze-code-and-identify-errors-3tlzvb
              <p className="mt-4 text-sm text-slate-600">Curated reports, essays, and briefings from the {category.name} desk.</p>
              <p className="mt-6 text-xs uppercase tracking-[0.2em] text-slate-500">{category._count.postCategories} archived post{category._count.postCategories === 1 ? "" : "s"}</p>
=======
              <p className="mt-3 text-xs uppercase tracking-wide text-zinc-500">{category._count.postCategories} post{category._count.postCategories === 1 ? "" : "s"}</p>
>>>>>>> main
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
