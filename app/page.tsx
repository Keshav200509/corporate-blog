import Link from "next/link";

<<<<<<< HEAD
export default function HomePage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold">The Corporate Blog</h1>
      <p className="mt-4 text-zinc-600">Production-grade editorial platform with strict draft isolation.</p>
      <Link href="/blog" className="mt-6 inline-block underline">
        Visit Blog
      </Link>
=======
const quickPaths = [
  {
    title: "Read latest posts",
    description: "See published articles on engineering and growth.",
    href: "/blog"
  },
  {
    title: "Browse by category",
    description: "Find content grouped by topic.",
    href: "/category/engineering"
  },
  {
    title: "Meet the authors",
    description: "Explore profiles and all articles by each writer.",
    href: "/author/maya-chen"
  }
];

export default function HomePage() {
  return (
    <main className="mx-auto max-w-4xl space-y-8 px-6 py-16">
      <header className="space-y-3">
        <h1 className="text-4xl font-bold tracking-tight">The Corporate Blog</h1>
        <p className="max-w-2xl text-zinc-600">
          A production-style publishing application with draft workflows, role-based publishing controls, and SEO-first pages.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        {quickPaths.map((path) => (
          <article key={path.href} className="rounded-xl border border-zinc-200 p-5 shadow-sm">
            <h2 className="text-lg font-semibold">{path.title}</h2>
            <p className="mt-2 text-sm text-zinc-600">{path.description}</p>
            <Link href={path.href} className="mt-4 inline-block text-sm font-medium underline">
              Open
            </Link>
          </article>
        ))}
      </section>
>>>>>>> origin/codex/implement-phase-1-for-corporate-blog-cramvb
    </main>
  );
}
