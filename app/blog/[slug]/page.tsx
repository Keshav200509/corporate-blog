import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublishedPostBySlug } from "../../../src/blog/data";
import { getCanonicalUrl, getPostDescription, getPostTitle, getSiteName } from "../../../src/blog/seo";
import { listPublishedPostSlugs } from "../../../src/blog/services/post-service";
import { buildArticleEnhancedJsonLd, buildAuthorJsonLd, buildBreadcrumbJsonLd, buildFaqJsonLd } from "../../../src/blog/structured-data";

export const revalidate = 86400;

export async function generateStaticParams() {
  if (!process.env.DATABASE_URL) return [];
  try { new URL(process.env.DATABASE_URL); } catch { return []; }
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
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-6 py-12">
      <Link href="/blog" className="text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
        ← All posts
      </Link>
      <article className="space-y-5">
        <header className="space-y-3">
          <div className="flex flex-wrap gap-2 text-xs uppercase tracking-wide text-zinc-400">
            {post.categories.map((category) => (
              <Link key={category.id} href={`/category/${category.slug}`} className="hover:underline">
                {category.name}
              </Link>
            ))}
          </div>
          <h1 className="text-3xl font-bold tracking-tight">{post.title}</h1>
          <p className="text-sm text-zinc-300">{post.excerpt}</p>
          <p className="text-sm text-zinc-400">
            By{" "}
            <Link href={`/author/${post.author.slug}`} className="hover:underline">
              {post.author.name}
            </Link>
          </p>
        </header>
        <div className="space-y-4 text-zinc-200">
          {post.content.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        {post.faqs.length > 0 ? (
          <section className="space-y-3 border-t border-zinc-700 pt-6" aria-label="Frequently asked questions">
            <h2 className="text-xl font-semibold">Frequently asked questions</h2>
            {post.faqs.map((faq) => (
              <details key={faq.id} className="rounded border border-zinc-700 p-3">
                <summary className="cursor-pointer font-medium">{faq.question}</summary>
                <p className="mt-2 text-sm text-zinc-300">{faq.answer}</p>
              </details>
            ))}
          </section>
        ) : null}
      </article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(authorJsonLd) }} />
      {faqJsonLd ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} /> : null}
    </main>
  );
}
