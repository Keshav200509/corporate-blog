// import type { Metadata } from "next";
// import { getCanonicalUrl } from "../../../src/blog/seo";
// import { getReadinessSnapshot } from "../../../src/ops/readiness";

// export const dynamic = "force-dynamic";

// export const metadata: Metadata = {
//   title: "Operations Readiness",
//   description: "Internal launch-readiness dashboard for The Corporate Blog.",
//   alternates: {
//     canonical: getCanonicalUrl("/ops/readiness")
//   },
//   robots: {
//     index: false,
//     follow: false
//   }
// };

// const STATUS_STYLES: Record<string, string> = {
//   pass: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
//   warn: "bg-amber-500/10 text-amber-300 border-amber-500/30",
//   fail: "bg-rose-500/10 text-rose-300 border-rose-500/30"
// };

// export default async function OpsReadinessPage() {
//   const snapshot = await getReadinessSnapshot();

//   return (
//     <main className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 py-12">
//       <header className="space-y-2">
//         <h1 className="text-3xl font-bold tracking-tight">Launch Readiness Control Board</h1>
//         <p className="text-sm text-zinc-400">Generated at: {new Date(snapshot.generatedAt).toLocaleString("en-US", { timeZone: "UTC" })} UTC</p>
//       </header>

//       <section className="grid gap-4 md:grid-cols-2">
//         <article className="rounded-xl border border-zinc-700 p-5">
//           <h2 className="text-sm uppercase tracking-wide text-zinc-400">Overall status</h2>
//           <p className={`mt-3 inline-flex rounded border px-3 py-1 text-sm font-semibold ${STATUS_STYLES[snapshot.overallStatus]}`}>
//             {snapshot.overallStatus.toUpperCase()}
//           </p>
//         </article>

//         <article className="rounded-xl border border-zinc-700 p-5">
//           <h2 className="text-sm uppercase tracking-wide text-zinc-400">Core content metrics</h2>
//           <ul className="mt-3 space-y-2 text-sm text-zinc-200">
//             <li>Published posts: {snapshot.metrics.publishedPosts}</li>
//             <li>Draft posts: {snapshot.metrics.drafts}</li>
//             <li>Active categories: {snapshot.metrics.categories}</li>
//             <li>Active authors: {snapshot.metrics.authors}</li>
//             <li>Last publish: {snapshot.metrics.lastPublishAt ?? "No publish yet"}</li>
//           </ul>
//         </article>
//       </section>

//       <section className="space-y-3" aria-label="Launch checklist checks">
//         <h2 className="text-xl font-semibold">Automated launch checks</h2>
//         {snapshot.checks.map((check) => (
//           <article key={check.key} className="rounded-xl border border-zinc-700 p-4">
//             <div className="flex items-start justify-between gap-3">
//               <h3 className="font-medium text-zinc-100">{check.title}</h3>
//               <span className={`rounded border px-2 py-0.5 text-xs font-semibold ${STATUS_STYLES[check.status]}`}>{check.status.toUpperCase()}</span>
//             </div>
//             <p className="mt-2 text-sm text-zinc-300">{check.detail}</p>
//           </article>
//         ))}
//       </section>
//     </main>
//   );
// }

import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCanonicalUrl, getSiteName } from "../../../src/blog/seo";
import { getAuthorWithPosts, listAuthors } from "../../../src/blog/services/author-service";

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
        <p className="mt-2 text-sm text-zinc-400">{author.bio ?? "Author profile"}</p>
      </header>

      <section className="space-y-4">
        {author.posts.map((post) => (
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
