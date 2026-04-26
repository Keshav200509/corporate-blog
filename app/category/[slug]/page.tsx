import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCanonicalUrl, getSiteName } from "../../../src/blog/seo";
import { getCategoryWithPosts, listCategories } from "../../../src/blog/services/category-service";
import PostCard, { categoryColor } from "../../../src/components/PostCard";

export async function generateStaticParams() {
  try {
    const categories = await listCategories();
    return categories.map((category) => ({ slug: category.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryWithPosts(slug);
  if (!category) {
    return { title: `Not Found | ${getSiteName()}` };
  }
  return {
    title: `${category.name} | ${getSiteName()}`,
    description: category.description ?? `Read published articles in ${category.name}.`,
    alternates: {
      canonical: getCanonicalUrl(`/category/${category.slug}`)
    }
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await getCategoryWithPosts(slug);

  if (!category) {
    notFound();
  }

  const color = categoryColor(category.slug);

  return (
    <main className="mx-auto max-w-5xl space-y-10 px-6 py-12">

      {/* ── Hero banner ──────────────────────────────────────────── */}
      <header className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 to-slate-950 px-8 py-12 text-white animate-fade-in">
        {/* Accent orb */}
        <div className={`pointer-events-none absolute right-0 top-0 h-48 w-48 translate-x-1/3 -translate-y-1/3 rounded-full opacity-30 blur-3xl ${color.accent}`} />
        <div className="relative">
          <nav className="mb-6 flex items-center gap-2 text-sm text-slate-400" aria-label="Breadcrumb">
            <Link href="/" className="transition hover:text-white">Home</Link>
            <span>/</span>
            <Link href="/category" className="transition hover:text-white">Topics</Link>
            <span>/</span>
            <span className="text-white">{category.name}</span>
          </nav>

          <span className={color.badge}>{category.name}</span>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight md:text-5xl">
            {category.name}
          </h1>
          <p className="mt-3 max-w-2xl text-slate-400">
            {category.description ?? `All published posts in the ${category.name} vertical.`}
          </p>
          <p className="mt-4 text-sm font-medium text-slate-400">
            {category.posts.length} article{category.posts.length !== 1 ? "s" : ""} published
          </p>
        </div>
      </header>

      {/* ── Posts ────────────────────────────────────────────────── */}
      {category.posts.length === 0 ? (
        <section className="rounded-2xl border border-dashed border-zinc-300 p-14 text-center dark:border-zinc-700">
          <p className="text-lg font-semibold text-zinc-500">No published posts in this category yet.</p>
          <Link href="/blog" className="mt-3 inline-block text-sm font-semibold text-indigo-600 hover:underline dark:text-indigo-400">
            Browse all posts →
          </Link>
        </section>
      ) : (
        <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-label={`Posts in ${category.name}`}>
          {category.posts.map((post, i) => (
            <PostCard key={post.id} post={post} variant="default" index={i} />
          ))}
        </section>
      )}

      {/* ── Back nav ─────────────────────────────────────────────── */}
      <div>
        <Link
          href="/category"
          className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m15 18-6-6 6-6" />
          </svg>
          All topics
        </Link>
      </div>

    </main>
  );
}
