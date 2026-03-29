// import Link from "next/link";
// import type { Metadata } from "next";
// import { getPublishedPosts } from "../../src/blog/data";
// import { getCanonicalUrl, getSiteName } from "../../src/blog/seo";

// export const revalidate = 300;

// export const metadata: Metadata = {
//   title: `Blog | ${getSiteName()}`,
//   description: "Insights on engineering, SEO, and scalable digital publishing.",
//   alternates: {
//     canonical: getCanonicalUrl("/blog")
//   }
// };

// export default async function BlogIndexPage() {
//   const posts = await getPublishedPosts();

//   return (
//     <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-6 py-12">
//       <header className="space-y-2">
//         <h1 className="text-3xl font-bold tracking-tight">The Corporate Blog</h1>
//         <p className="text-sm text-zinc-500 dark:text-zinc-300">
//           Production-minded articles on platform engineering, SEO, and growth operations.
//         </p>
//       </header>

//       {posts.length === 0 ? (
//         <section className="rounded-xl border border-dashed border-zinc-300 p-8 text-center dark:border-zinc-700">
//           <p className="text-zinc-600 dark:text-zinc-300">No published posts yet.</p>
//         </section>
//       ) : (
//         <section className="space-y-4" aria-label="Published posts">
//           {posts.map((post) => (
//             <article key={post.id} className="rounded-xl border border-zinc-200 p-5 shadow-sm dark:border-zinc-800">
//               <p className="text-xs uppercase tracking-wide text-zinc-500">
//                 {post.categories[0]?.name ?? "General"}
//               </p>
//               <h2 className="mt-2 text-xl font-semibold">
//                 <Link href={`/blog/${post.slug}`} className="hover:underline">
//                   {post.title}
//                 </Link>
//               </h2>
//               <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">{post.excerpt}</p>
//             </article>
//           ))}
//         </section>
//       )}

import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCanonicalUrl, getSiteName } from "../../../src/blog/seo";
import { getCategoryWithPosts, listCategories } from "../../../src/blog/services/category-service";

export async function generateStaticParams() {
  if (!process.env.DATABASE_URL) {
    return [];
  }

  try {
    new URL(process.env.DATABASE_URL);
  } catch {
    return [];
  }

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
