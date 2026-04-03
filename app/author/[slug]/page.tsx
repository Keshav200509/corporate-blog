import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCanonicalUrl, getSiteName } from "../../../src/blog/seo";
import { getAuthorWithPosts, listAuthors } from "../../../src/blog/services/author-service";

export const revalidate = 3600;

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
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-6 py-12">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">{author.name}</h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-300">{author.bio ?? "Author profile"}</p>
      </header>

      <section className="space-y-4">
        {author.posts.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-300 p-6 text-sm text-zinc-600 dark:border-zinc-700 dark:text-zinc-300">
            No published posts by this author yet.
          </div>
        ) : (
          author.posts.map((post) => (
            <article key={post.id} className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <h2 className="text-xl font-semibold">
                <Link href={`/blog/${post.slug}`} className="hover:underline">
                  {post.title}
                </Link>
              </h2>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">{post.excerpt}</p>
            </article>
          ))
        )}
      </section>
    </main>
  );
}
