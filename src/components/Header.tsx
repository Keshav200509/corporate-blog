"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";

const NAV = [
  { href: "/blog",     label: "Blog" },
  { href: "/category", label: "Topics" },
  { href: "/author",   label: "Authors" },
  { href: "/explore",  label: "Explore" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href + "/"));

  return (
    <header
      className={`sticky top-0 z-40 border-b border-zinc-200 bg-white transition-shadow dark:border-zinc-800 dark:bg-zinc-950 ${
        scrolled ? "shadow-[0_1px_3px_rgba(0,0,0,0.08)]" : ""
      }`}
    >
      {/* Design spec: height 60px */}
      <div className="mx-auto flex h-[60px] w-full max-w-7xl items-center justify-between gap-4 px-6">

        {/* Logo — gradient 40×40, border-radius 10px, "CB" 16px/700, wordmark 18px/700 */}
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center text-sm font-bold text-white"
            style={{
              background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
              borderRadius: "10px",
            }}
          >
            CB
          </span>
          <span className="hidden text-[18px] font-bold tracking-tight text-zinc-900 sm:block dark:text-white">
            The Corporate Blog
          </span>
        </Link>

        {/* Desktop nav — active: #eef2ff bg, #4f46e5 text, radius 8px, padding 6px 14px */}
        <nav aria-label="Main navigation" className="hidden md:flex items-center gap-1">
          {NAV.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-lg px-3.5 py-1.5 text-[15px] font-medium transition-colors ${
                isActive(link.href)
                  ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400"
                  : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right: search + theme toggle + admin */}
        <div className="hidden md:flex items-center gap-2">
          <form action="/search" className="flex items-center gap-2">
            <input
              name="q"
              type="search"
              required
              minLength={2}
              placeholder="Search articles..."
              className="w-[240px] rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:placeholder-zinc-500"
            />
            <button
              type="submit"
              aria-label="Search"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white transition hover:bg-indigo-500"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden={true}>
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </button>
          </form>

          <ThemeToggle />

          <Link
            href="/admin/login"
            className="rounded-lg border border-zinc-200 px-3.5 py-1.5 text-sm font-medium text-zinc-500 transition hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            Admin
          </Link>
        </div>

        {/* Mobile: theme + hamburger */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setOpen(!open)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 text-zinc-500 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden={true}><path d="M18 6 6 18M6 6l12 12"/></svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden={true}><path d="M4 6h16M4 12h16M4 18h16"/></svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-zinc-200 bg-white px-6 py-4 md:hidden dark:border-zinc-800 dark:bg-zinc-950 animate-slide-up">
          <nav className="flex flex-col gap-1">
            {NAV.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  isActive(link.href)
                    ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400"
                    : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/admin/login"
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
            >
              Admin
            </Link>
          </nav>
          <form action="/search" className="mt-4 flex gap-2">
            <input
              name="q"
              type="search"
              required
              minLength={2}
              placeholder="Search articles..."
              className="flex-1 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
            />
            <button type="submit" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white">
              Go
            </button>
          </form>
        </div>
      )}
    </header>
  );
}
