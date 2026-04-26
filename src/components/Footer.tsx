import Link from "next/link";
import NewsletterForm from "./NewsletterForm";

const CONTENT_LINKS = [
  { href: "/blog",     label: "All Articles" },
  { href: "/category", label: "Topics" },
  { href: "/author",   label: "Authors" },
  { href: "/search",   label: "Search" },
];

const PLATFORM_LINKS = [
  { href: "/explore",       label: "Explore" },
  { href: "/ops/readiness", label: "Readiness" },
  { href: "/admin/login",   label: "Admin Login" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-zinc-200 dark:border-zinc-800">

      {/* Newsletter banner */}
      <div className="bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-start justify-between gap-6 px-6 py-10 md:flex-row md:items-center">
          <div>
            <h3 className="text-lg font-bold text-white">Stay in the intelligence loop</h3>
            <p className="mt-1 text-sm text-indigo-200">Top stories, delivered weekly. No spam, ever.</p>
          </div>
          <NewsletterForm />
        </div>
      </div>

      {/* Main footer */}
      <div className="bg-zinc-50 dark:bg-zinc-950">
        <div className="mx-auto w-full max-w-7xl px-6 py-12">
          <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">

            {/* Brand */}
            <div>
              <Link href="/" className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 text-sm font-bold text-white shadow-sm">
                  CB
                </span>
                <span className="text-base font-bold text-zinc-900 dark:text-white">The Corporate Blog</span>
              </Link>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                A living newsroom for strategy, operations, and market intelligence. Real authors, real taxonomy, real insights.
              </p>
              <p className="mt-6 text-xs text-zinc-400 dark:text-zinc-600">
                Powered by Next.js · PostgreSQL · Prisma
              </p>
            </div>

            {/* Content */}
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-600">
                Content
              </p>
              <nav className="flex flex-col gap-2.5">
                {CONTENT_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Platform */}
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-600">
                Platform
              </p>
              <nav className="flex flex-col gap-2.5">
                {PLATFORM_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-zinc-200 pt-6 sm:flex-row sm:items-center dark:border-zinc-800">
            <p className="text-xs text-zinc-400 dark:text-zinc-600">
              © {year} The Corporate Blog. SEO-first publishing platform.
            </p>
            <div className="flex items-center gap-1.5">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" aria-hidden />
              <span className="text-xs text-zinc-400 dark:text-zinc-600">All systems operational</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
