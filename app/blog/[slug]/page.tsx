import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublishedPostBySlug } from "../../../src/blog/data";
import { getCanonicalUrl, getPostDescription, getPostTitle, getSiteName } from "../../../src/blog/seo";
import { listPublishedPostSlugs } from "../../../src/blog/services/post-service";
import { buildArticleEnhancedJsonLd, buildAuthorJsonLd, buildBreadcrumbJsonLd, buildFaqJsonLd } from "../../../src/blog/structured-data";
import ReadingProgress from "../../../src/components/ReadingProgress";
import { categoryColor, initials, readingTime, formatDate } from "../../../src/components/PostCard";

export const revalidate = 86400;

export async function generateStaticParams() {
  try {
    const slugs = await listPublishedPostSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) {
    return { title: `Not Found | ${getSiteName()}` };
  }
  const title = getPostTitle(post);
  const description = getPostDescription(post);
  const canonical = getCanonicalUrl(`/blog/${post.slug}`);
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description, url: canonical, type: "article" },
    twitter: { card: "summary_large_image", title, description }
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) {
    notFound();
  }

  const articleJsonLd = buildArticleEnhancedJsonLd(post);
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(post);
  const authorJsonLd = buildAuthorJsonLd(post);
  const faqJsonLd = buildFaqJsonLd(post);

  const primary = post.categories[0];
  const color = primary ? categoryColor(primary.slug) : { badge: "badge badge-zinc", accent: "bg-zinc-400" };
  const rt = readingTime(post.content);

  return (
    <>
      <ReadingProgress />

      <main className="mx-auto max-w-3xl px-6 py-12">

        {/* ── Breadcrumb ───────────────────────────────────────────── */}
        <nav className="mb-8 flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400" aria-label="Breadcrumb">
          <Link href="/" className="transition hover:text-zinc-900 dark:hover:text-white">Home</Link>
          <span aria-hidden>/</span>
          <Link href="/blog" className="transition hover:text-zinc-900 dark:hover:text-white">Blog</Link>
          {primary && (
            <>
              <span aria-hidden>/</span>
              <Link href={`/category/${primary.slug}`} className="transition hover:text-zinc-900 dark:hover:text-white">
                {primary.name}
              </Link>
            </>
          )}
        </nav>

        {/* ── Article ──────────────────────────────────────────────── */}
        <article>

          {/* Header */}
          <header className="mb-10 space-y-4 animate-slide-up">
            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              {post.categories.map((cat) => {
                const catColor = categoryColor(cat.slug);
                return (
                  <Link key={cat.id} href={`/category/${cat.slug}`}>
                    <span className={catColor.badge}>{cat.name}</span>
                  </Link>
                );
              })}
            </div>

            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-zinc-900 dark:text-white md:text-5xl">
              {post.title}
            </h1>

            <p className="text-xl leading-relaxed text-zinc-600 dark:text-zinc-400">
              {post.excerpt}
            </p>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-b border-zinc-100 py-4 text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
              <span className="flex items-center gap-2">
                <span className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold text-white ${color.accent}`}>
                  {initials(post.author.name)}
                </span>
                <Link
                  href={`/author/${post.author.slug}`}
                  className="font-medium text-zinc-700 transition hover:text-indigo-600 dark:text-zinc-300 dark:hover:text-indigo-400"
                >
                  {post.author.name}
                </Link>
              </span>
              <span>·</span>
              <span>{rt} min read</span>
              {post.publishedAt && (
                <>
                  <span>·</span>
                  <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                </>
              )}
            </div>
          </header>

          {/* Body */}
          <div className="prose-editorial">
            {post.content.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>

          {/* FAQs */}
          {post.faqs.length > 0 && (
            <section className="mt-14 border-t border-zinc-200 pt-10 dark:border-zinc-800" aria-label="Frequently asked questions">
              <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-white">
                Frequently asked questions
              </h2>
              <div className="space-y-3">
                {post.faqs.map((faq) => (
                  <details
                    key={faq.id}
                    className="group rounded-xl border border-zinc-200 bg-zinc-50 transition open:bg-white dark:border-zinc-800 dark:bg-zinc-900 dark:open:bg-zinc-800"
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 font-semibold text-zinc-900 dark:text-white">
                      {faq.question}
                      <svg
                        className="h-4 w-4 shrink-0 text-zinc-400 transition group-open:rotate-180"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </summary>
                    <p className="px-5 pb-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                      {faq.answer}
                    </p>
                  </details>
                ))}
              </div>
            </section>
          )}

        </article>

        {/* ── Author card ──────────────────────────────────────────── */}
        <aside className="mt-14 rounded-2xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-zinc-400">About the author</p>
          <div className="flex items-start gap-4">
            <Link href={`/author/${post.author.slug}`}>
              <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white transition hover:scale-105 ${color.accent}`}>
                {initials(post.author.name)}
              </span>
            </Link>
            <div>
              <Link
                href={`/author/${post.author.slug}`}
                className="font-bold text-zinc-900 transition hover:text-indigo-600 dark:text-white dark:hover:text-indigo-400"
              >
                {post.author.name}
              </Link>
              {post.author.bio && (
                <p className="mt-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {post.author.bio}
                </p>
              )}
              <Link
                href={`/author/${post.author.slug}`}
                className="mt-2 inline-flex text-xs font-semibold text-indigo-600 transition hover:text-indigo-500 dark:text-indigo-400"
              >
                View all articles →
              </Link>
            </div>
          </div>
        </aside>

        {/* ── Back nav ─────────────────────────────────────────────── */}
        <div className="mt-10">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m15 18-6-6 6-6" />
            </svg>
            Back to all articles
          </Link>
        </div>

      </main>

      {/* Structured data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(authorJsonLd) }} />
      {faqJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />}
    </>
  );
}
