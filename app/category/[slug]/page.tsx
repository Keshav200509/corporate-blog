import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCanonicalUrl, getSiteName } from "../../../src/blog/seo";
import { getCategoryWithPosts, listCategories } from "../../../src/blog/services/category-service";

export async function generateStaticParams() {
  if (!process.env.DATABASE_URL) return [];
  try { new URL(process.env.DATABASE_URL); } catch { return []; }
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

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-6 py-12">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">{category.name}</h1>
        <p className="mt-2 text-sm text-zinc-400">{category.description ?? "Published posts in this category."}</p>
      </header>

      <section className="space-y-4">
        {category.posts.map((post) => (
          <article key={post.id} className="rounded-xl border border-zinc-700 p-5">
            <h2 className="text-xl font-semibold">
              <Link href={`/blog/${post.slug}`} className="hover:underline">
                {post.title}
              </Link>
            </h2>
            <p className="mt-2 text-sm text-zinc-300">{post.excerpt}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
