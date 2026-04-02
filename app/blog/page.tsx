import Link from "next/link";
import type { Metadata } from "next";
import { fetchApiJson } from "../../src/blog/api";
import { getCanonicalUrl, getSiteName } from "../../src/blog/seo";

export const revalidate = 300;
export const dynamic = "force-dynamic";

type PostsResponse = {
  items: Array<{ id: string; slug: string; title: string; excerpt: string; author: { name: string }; categories: Array<{ name: string }>; publishedAt: string | null }>;
  total: number;
};

type CategoryResponse = {
  items: Array<{ id: string; slug: string; name: string; _count: { postCategories: number } }>;
};

export const metadata: Metadata = {
  title: `Blog | ${getSiteName()}`,
  description: "Insights on engineering, SEO, and scalable digital publishing.",
  alternates: {
    canonical: getCanonicalUrl("/blog")
  }
};

export default async function BlogIndexPage() {
  const [postsData, categoriesData] = await Promise.all([
    fetchApiJson<PostsResponse>("/api/blog/posts"),
    fetchApiJson<CategoryResponse>("/api/blog/categories")
  ]);

  const lead = postsData.items[0];
  const posts = await getPublishedPosts();
  const lead = posts[0];

  return (
    <main className="mx-auto max-w-7xl space-y-10 px-6 py-10">
      <section className="grid gap-8 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-8 text-white md:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Live Intelligence Feed</p>
          <h1 className="mt-3 text-5xl font-semibold leading-tight">Editorial command deck powered by API data.</h1>
          <p className="mt-4 max-w-xl text-slate-300">This index hydrates through /api/blog/posts and /api/blog/categories to keep the front page aligned with the latest records.</p>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Featured Deep Dive</p>
          <h1 className="mt-3 text-5xl font-semibold leading-tight">The Sovereign Ledger: Global Liquidity in 2025</h1>
          <p className="mt-4 max-w-xl text-slate-300">An institutional analysis of decentralized finance architectures and macro policy responses.</p>
          {lead ? (
            <Link href={`/blog/${lead.slug}`} className="mt-6 inline-block rounded bg-white px-5 py-2.5 text-sm font-semibold text-slate-950">
              Read Lead Story
            </Link>
          ) : null}
        </div>
        <aside className="space-y-4 rounded-xl border border-white/10 bg-white/5 p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Browse by desk</p>
          <div className="flex flex-wrap gap-2">
            {categoriesData.items.map((category) => (
              <Link key={category.id} href={`/category/${category.slug}`} className="rounded border border-white/20 px-3 py-1.5 text-xs hover:bg-white/10">
                {category.name} · {category._count.postCategories}
              </Link>
            ))}
          </div>
        </aside>
      </section>

      {postsData.items.length === 0 ? (
        <section className="rounded-xl border border-dashed border-slate-300 p-10 text-center text-slate-600">No published posts yet.</section>
      ) : (
        <section className="grid gap-5 md:grid-cols-3" aria-label="Published posts">
          {postsData.items.map((post) => (
          <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Executive Brief</p>
          <p className="text-sm text-slate-300">Join 45,000+ leaders receiving our weekly synthesis of high-impact shifts.</p>
          <input className="w-full rounded border border-white/20 bg-white/5 px-3 py-2 text-sm" placeholder="Professional email" />
          <button className="w-full rounded bg-white px-4 py-2 text-sm font-semibold text-slate-950">Subscribe Now</button>
        </aside>
      </section>

      {posts.length === 0 ? (
        <section className="rounded-xl border border-dashed border-slate-300 p-10 text-center text-slate-600">No published posts yet.</section>
      ) : (
        <section className="grid gap-5 md:grid-cols-3" aria-label="Published posts">
          {posts.map((post) => (
            <article key={post.id} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{post.categories[0]?.name ?? "General"}</p>
              <h2 className="mt-2 text-2xl font-semibold leading-tight">
                <Link href={`/blog/${post.slug}`} className="hover:underline">
                  {post.title}
                </Link>
              </h2>
              <p className="mt-3 text-sm text-slate-600">{post.excerpt}</p>
              <p className="mt-4 text-xs uppercase tracking-wide text-slate-500">By {post.author.name}</p>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
