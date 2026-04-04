import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { getCanonicalUrl, getSiteName } from "../src/blog/seo";

export const metadata: Metadata = {
  title: { default: getSiteName(), template: `%s | ${getSiteName()}` },
  metadataBase: new URL(getCanonicalUrl("/")),
  title: getSiteName(),
  description: "SEO-first corporate publishing platform.",
  alternates: { canonical: getCanonicalUrl("/") },
  other: {
    "application-name": getSiteName()
  }
};

const navigationLinks = [
  { href: "/blog", label: "Blog" },
  { href: "/explore", label: "Explore" },
  { href: "/category", label: "Categories" },
  { href: "/author", label: "Authors" },
  { href: "/ops/readiness", label: "Readiness" }
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="alternate" type="application/rss+xml" title={getSiteName()} href="/feed.xml" />
      </head>
      <body className="min-h-screen flex flex-col">
        <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/90 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/90">
          <nav className="mx-auto flex max-w-4xl items-center justify-between px-6 py-3">
            <Link href="/" className="text-lg font-semibold tracking-tight">
              {getSiteName()}
            </Link>
            <div className="flex items-center gap-6 text-sm">
              <Link href="/blog" className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
                Blog
              </Link>
              <Link href="/dashboard/login" className="rounded-md bg-zinc-900 px-3 py-1.5 text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300">
                Sign in
              </Link>
            </div>
          </nav>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="border-t border-zinc-200 dark:border-zinc-800">
          <div className="mx-auto max-w-4xl px-6 py-8 text-sm text-zinc-500">
            <p>
              © {new Date().getFullYear()} {getSiteName()}
    <html lang="en">
      <body>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-md focus:bg-indigo-600 focus:px-3 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>

        <header className="sticky top-0 z-40 border-b border-zinc-200/80 bg-white/95 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/95">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 py-4">
            <Link href="/" className="text-lg font-semibold tracking-tight">
              The Corporate Blog
            </Link>

            <nav aria-label="Main" className="hidden gap-5 text-sm text-zinc-600 md:flex dark:text-zinc-300">
              {navigationLinks.map((link) => (
                <Link key={link.href} href={link.href} className="hover:text-zinc-900 dark:hover:text-white">
                  {link.label}
                </Link>
              ))}
            </nav>

            <form action="/search" className="hidden items-center gap-2 md:flex">
              <input
                name="q"
                type="search"
                required
                minLength={2}
                placeholder="Search posts"
                className="w-44 rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm outline-none ring-indigo-500 transition focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900"
              />
              <button type="submit" className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-500">
                Search
              </button>
            </form>
          </div>
        </header>

        <div id="main-content">{children}</div>

        <footer className="mt-16 border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mx-auto w-full max-w-6xl px-6 py-8">
            <nav aria-label="Footer" className="flex flex-wrap gap-6 text-sm text-zinc-500 dark:text-zinc-400">
              {navigationLinks.map((link) => (
                <Link key={link.href} href={link.href} className="hover:underline">
                  {link.label}
                </Link>
              ))}
            </nav>
            <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
              © {new Date().getFullYear()} {getSiteName()}. SEO-first publishing platform.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
