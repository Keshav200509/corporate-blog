import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { getCanonicalUrl, getSiteName } from "../src/blog/seo";

export const metadata: Metadata = {
  title: { default: getSiteName(), template: `%s | ${getSiteName()}` },
  description: "SEO-first corporate publishing platform.",
  alternates: { canonical: getCanonicalUrl("/") },
  other: {
    "application-name": getSiteName()
  }
};

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
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
