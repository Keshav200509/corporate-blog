import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCanonicalUrl, getSiteName } from "../../../src/blog/seo";
import { getAuthorWithPosts, listAuthors } from "../../../src/blog/services/author-service";
import PostCard, { initials } from "../../../src/components/PostCard";

export async function generateStaticParams() {
  try {
    const authors = await listAuthors();
    return authors.map((author) => ({ slug: author.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const author = await getAuthorWithPosts(slug);
  if (!author) {
    return { title: `Not Found | ${getSiteName()}` };
  }
  return {
    title: `${author.name} | ${getSiteName()}`,
    description: author.bio ?? `Read published articles by ${author.name}.`,
    alternates: {
      canonical: getCanonicalUrl(`/author/${author.slug}`)
    }
  };
}

export default async function AuthorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const author = await getAuthorWithPosts(slug);

  if (!author) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-5xl space-y-10 px-6 py-12">

      {/* ── Author hero ──────────────────────────────────────────── */}
      <header className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 to-indigo-950 px-8 py-12 text-white animate-fade-in">
        {/* Decorative orb */}
        <div className="pointer-events-none absolute right-0 top-0 h-48 w-48 translate-x-1/3 -translate-y-1/3 rounded-full bg-indigo-600/25 blur-3xl" />

        <div className="relative flex flex-col gap-6 md:flex-row md:items-start">
          {/* Avatar */}
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-2xl font-extrabold text-white shadow-lg">
            {initials(author.name)}
          </div>

          <div className="flex-1">
            <nav className="mb-3 flex items-center gap-2 text-sm text-slate-400" aria-label="Breadcrumb">
              <Link href="/" className="transition hover:text-white">Home</Link>
              <span>/</span>
              <Link href="/author" className="transition hover:text-white">Authors</Link>
              <span>/</span>
              <span className="text-white">{author.name}</span>
            </nav>

            <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">{author.name}</h1>
            {author.bio && (
              <p className="mt-3 max-w-2xl text-slate-300 leading-relaxed">{author.bio}</p>
            )}

            {/* Stats */}
            <div className="mt-5 flex flex-wrap gap-4">
              <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center">
                <p className="text-2xl font-bold">{author.posts.length}</p>
                <p className="text-xs uppercase tracking-widest text-slate-400">Articles</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ── Posts ────────────────────────────────────────────────── */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
          Published articles
        </h2>

        {author.posts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-300 p-14 text-center dark:border-zinc-700">
            <p className="text-lg font-semibold text-zinc-500">No published posts yet.</p>
            <Link href="/blog" className="mt-3 inline-block text-sm font-semibold text-indigo-600 hover:underline dark:text-indigo-400">
              Browse all posts →
            </Link>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {author.posts.map((post, i) => (
              <PostCard key={post.id} post={post} variant="default" index={i} />
            ))}
          </div>
        )}
      </section>

      {/* ── Back nav ─────────────────────────────────────────────── */}
      <div>
        <Link
          href="/author"
          className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m15 18-6-6 6-6" />
          </svg>
          All contributors
        </Link>
      </div>

    </main>
  );
}
