import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center gap-6 px-6 py-20 text-center">
      {/* Large 404 */}
      <div className="relative">
        <p className="select-none text-[120px] font-extrabold leading-none text-zinc-100 dark:text-zinc-900 md:text-[160px]">
          404
        </p>
        <p className="absolute inset-0 flex items-center justify-center text-4xl font-extrabold text-zinc-900 dark:text-white md:text-5xl">
          Page not found
        </p>
      </div>

      <p className="max-w-sm text-base text-zinc-500 dark:text-zinc-400">
        The page you&apos;re looking for doesn&apos;t exist or may have moved. Let&apos;s get you back on track.
      </p>

      {/* Actions */}
      <div className="flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500"
        >
          Back to home
        </Link>
        <Link
          href="/blog"
          className="rounded-xl border border-zinc-300 px-6 py-3 text-sm font-semibold text-zinc-700 transition hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-300"
        >
          Browse articles
        </Link>
        <Link
          href="/search"
          className="rounded-xl border border-zinc-300 px-6 py-3 text-sm font-semibold text-zinc-700 transition hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-300"
        >
          Search
        </Link>
      </div>

      {/* Quick links */}
      <div className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
        {[
          { href: "/category", label: "Topics" },
          { href: "/author", label: "Authors" },
          { href: "/explore", label: "Explore" },
          { href: "/admin/login", label: "Admin" },
        ].map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-zinc-400 transition hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </main>
  );
}
