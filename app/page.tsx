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

const highlights = [
  { label: "SEO-ready metadata", value: "Canonical + OG + JSON-LD" },
  { label: "Editorial workflow", value: "Writer → Editor publish flow" },
  { label: "Rendering strategy", value: "ISR + dynamic APIs" }
];

export default function HomePage() {
  return (
    <main className="mx-auto max-w-5xl space-y-10 px-6 py-16">
      <header className="space-y-4">
        <p className="inline-flex rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 dark:border-indigo-500/40 dark:bg-indigo-500/10 dark:text-indigo-200">
          Production-ready corporate publishing
        </p>
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">The Corporate Blog</h1>
        <p className="max-w-3xl text-zinc-600 dark:text-zinc-300">
          A production-style publishing application with draft workflows, role-based publishing controls, SEO-first pages, and scalable serverless architecture.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-3" aria-label="Platform highlights">
        {highlights.map((item) => (
          <article key={item.label} className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-xs uppercase tracking-wide text-zinc-500">{item.label}</p>
            <p className="mt-2 text-sm font-medium text-zinc-800 dark:text-zinc-200">{item.value}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {quickPaths.map((path) => (
          <article key={path.href} className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-lg font-semibold">{path.title}</h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">{path.description}</p>
            <Link href={path.href} className="mt-4 inline-block text-sm font-medium text-indigo-700 underline underline-offset-2 dark:text-indigo-300">
              Open
            </Link>
          </article>
        ))}
      </section>
    </main>
  );
}
