import Link from "next/link";
import type { Metadata } from "next";
import { listAuthors } from "../../src/blog/services/author-service";
import { getCanonicalUrl, getSiteName } from "../../src/blog/seo";
import { initials } from "../../src/components/PostCard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `Authors | ${getSiteName()}`,
  description: "Meet the writers behind The Corporate Blog.",
  alternates: {
    canonical: getCanonicalUrl("/author")
  }
};

const AVATAR_COLORS = [
  "bg-indigo-600",
  "bg-violet-600",
  "bg-emerald-600",
  "bg-amber-600",
  "bg-rose-600",
  "bg-cyan-600",
  "bg-blue-600",
];

export default async function AuthorIndexPage() {
  const authors = await listAuthors();

  return (
    <main className="mx-auto max-w-5xl space-y-10 px-6 py-12">

      {/* ── Header ───────────────────────────────────────────────── */}
      <header className="space-y-3 animate-fade-in">
        <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
          The Corporate Blog
        </p>
        <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
          Our Contributors
        </h1>
        <p className="max-w-xl text-base text-zinc-600 dark:text-zinc-400">
          Industry experts, strategists, and operators sharing actionable intelligence.
        </p>
      </header>

      {/* ── Author grid ──────────────────────────────────────────── */}
      {authors.length === 0 ? (
        <section className="rounded-2xl border border-dashed border-zinc-300 p-14 text-center dark:border-zinc-700">
          <p className="text-lg font-semibold text-zinc-500">No active authors found yet.</p>
        </section>
      ) : (
        <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-label="Author list">
          {authors.map((author, i) => {
            const avatarColor = AVATAR_COLORS[i % AVATAR_COLORS.length];
            return (
              <article
                key={author.id}
                className="card card-hover group p-6"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="flex items-start gap-4">
                  <Link href={`/author/${author.slug}`}>
                    <span
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white transition group-hover:scale-105 ${avatarColor}`}
                    >
                      {initials(author.name)}
                    </span>
                  </Link>
                  <div className="min-w-0">
                    <h2 className="font-bold text-zinc-900 dark:text-white">
                      <Link
                        href={`/author/${author.slug}`}
                        className="transition hover:text-indigo-600 dark:hover:text-indigo-400"
                      >
                        {author.name}
                      </Link>
                    </h2>
                    <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                      {author.bio ?? "Corporate blog contributor"}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-4 dark:border-zinc-800">
                  <span className="text-xs text-zinc-400 uppercase tracking-wider">
                    {author._count.posts} post{author._count.posts !== 1 ? "s" : ""}
                  </span>
                  <Link
                    href={`/author/${author.slug}`}
                    className="text-xs font-semibold text-indigo-600 transition hover:text-indigo-500 dark:text-indigo-400"
                  >
                    View profile →
                  </Link>
                </div>
              </article>
            );
          })}
        </section>
      )}

    </main>
  );
}
