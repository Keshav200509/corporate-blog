import Link from "next/link";

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
  },
  {
    title: "Operations readiness",
    description: "Internal launch board for content, security, and publishing checks.",
    href: "/ops/readiness"
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

      <section className="grid gap-4 md:grid-cols-2">
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
    </main>
  );
}
