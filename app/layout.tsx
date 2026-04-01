import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { getCanonicalUrl, getSiteName } from "../src/blog/seo";

export const metadata: Metadata = {
  metadataBase: new URL(getCanonicalUrl("/")),
  title: getSiteName(),
  description: "SEO-first corporate publishing platform.",
  alternates: {
    canonical: getCanonicalUrl("/")
  }
};

const navigationLinks = [
  { href: "/blog", label: "Blog" },
  { href: "/explore", label: "Explore" },
  { href: "/category", label: "Categories" },
  { href: "/author", label: "Authors" },
  { href: "/ops/readiness", label: "Readiness" }
];

const trendingItems = [
  "The Sovereignty of Silicon: Deep-dive in tech diplomacy",
  "Q3 Fiscal Outlook: Why central banks are holding steady",
  "Decentralized Power: The rise of micro-grids in emerging markets"
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-100 text-slate-900 antialiased">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-md focus:bg-indigo-600 focus:px-3 focus:py-2 focus:text-white">
          Skip to content
        </a>

        <header className="sticky top-0 z-40 border-b border-slate-200 bg-slate-100/95 backdrop-blur">
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-6 py-4">
            <Link href="/" className="text-2xl font-semibold tracking-tight text-slate-950">
              TCB
            </Link>

            <nav aria-label="Main" className="hidden gap-6 text-sm font-medium text-slate-600 md:flex">
              {navigationLinks.map((link) => (
                <Link key={link.href} href={link.href} className="transition hover:text-slate-950">
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <form action="/search" className="hidden items-center gap-2 md:flex">
                <input
                  name="q"
                  type="search"
                  required
                  minLength={2}
                  placeholder="Search intelligence"
                  className="w-56 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-indigo-500 transition focus:ring-2"
                />
              </form>
              <button className="rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">Subscribe</button>
            </div>
          </div>
          <div className="border-t border-slate-200 bg-slate-950/95 py-2 text-xs text-slate-300">
            <div className="mx-auto flex w-full max-w-7xl gap-8 overflow-hidden whitespace-nowrap px-6">
              <span className="font-semibold text-white">● Trending</span>
              {trendingItems.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>
        </header>

        <div id="main-content">{children}</div>

        <footer className="mt-20 border-t border-slate-200 bg-white">
          <div className="mx-auto grid w-full max-w-7xl gap-8 px-6 py-12 md:grid-cols-4">
            <div>
              <p className="text-3xl font-semibold">TCB</p>
              <p className="mt-3 text-sm text-slate-500">Curated intelligence for the modern executive.</p>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Explore</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                {navigationLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="hover:underline">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Legal</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Cookie Policy</li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Newsletter</p>
              <div className="mt-3 flex gap-2">
                <input className="w-full rounded border border-slate-300 px-3 py-2 text-sm" placeholder="your@email.com" />
                <button className="rounded bg-slate-950 px-4 text-sm font-semibold text-white">Join</button>
              </div>
            </div>
          </div>
          <p className="border-t border-slate-200 px-6 py-4 text-center text-xs text-slate-500">© {new Date().getFullYear()} The Corporate Blog. All intellectual property reserved.</p>
        </footer>
      </body>
    </html>
  );
}
