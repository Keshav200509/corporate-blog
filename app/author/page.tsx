import Link from "next/link";
import type { Metadata } from "next";
import { fetchApiJson } from "../../src/blog/api";
import { getCanonicalUrl, getSiteName } from "../../src/blog/seo";

export const metadata: Metadata = {
  title: `Authors | ${getSiteName()}`,
  description: "Meet the writers behind The Corporate Blog.",
  alternates: {
    canonical: getCanonicalUrl("/author")
  }
};

type AuthorsResponse = {
  items: Array<{ id: string; name: string; slug: string; bio: string | null; _count: { posts: number } }>;
};

export default async function AuthorIndexPage() {
  const { items: authors } = await fetchApiJson<AuthorsResponse>("/api/blog/authors");

  return (
    <main className="mx-auto max-w-7xl space-y-8 px-6 py-10">
      <section className="grid gap-6 rounded-2xl bg-white p-8 shadow-sm md:grid-cols-[1.2fr_1fr]">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Global Editorial Network</p>
          <h1 className="mt-2 text-6xl font-bold tracking-tight text-slate-950">The Curators</h1>
          <p className="mt-4 max-w-2xl text-slate-600">Author data is loaded from the public API route so this directory expands automatically as contributors are added.</p>
        </div>
        <div className="rounded-lg border border-slate-200 p-5 text-slate-600">Need custom headshots, bios, or verification badges? Share those assets and we can wire them into this grid next.</div>
      </section>

      {authors.length === 0 ? (
        <section className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-slate-600">No active authors found yet.</section>
      ) : (
        <section className="grid gap-5 md:grid-cols-3" aria-label="Author list">
          {authors.map((author) => (
            <article key={author.id} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="h-56 rounded-lg bg-gradient-to-br from-slate-300 to-slate-200" />
              <h2 className="mt-4 text-3xl font-semibold">
                <Link href={`/author/${author.slug}`} className="hover:underline">
                  {author.name}
                </Link>
              </h2>
              <p className="mt-2 text-sm text-slate-600">{author.bio ?? "Corporate blog contributor"}</p>
              <p className="mt-4 text-xs uppercase tracking-[0.2em] text-slate-500">{author._count.posts} intelligence report{author._count.posts === 1 ? "" : "s"}</p>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
