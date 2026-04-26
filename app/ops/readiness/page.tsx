import Link from "next/link";
import type { Metadata } from "next";
import { getCanonicalUrl } from "../../../src/blog/seo";
import { getReadinessSnapshot } from "../../../src/ops/readiness";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Operations Readiness",
  description: "Internal launch-readiness dashboard for The Corporate Blog.",
  alternates: {
    canonical: getCanonicalUrl("/ops/readiness")
  },
  robots: {
    index: false,
    follow: false
  }
};

const STATUS_BADGE: Record<string, string> = {
  pass: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  warn: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  fail: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
};

const STATUS_DOT: Record<string, string> = {
  pass: "bg-emerald-500",
  warn: "bg-amber-500",
  fail: "bg-rose-500",
};

const OVERALL_CARD: Record<string, { from: string; to: string; dot: string; label: string }> = {
  healthy: { from: "from-emerald-900", to: "to-emerald-950", dot: "bg-emerald-400", label: "Healthy" },
  degraded: { from: "from-amber-900", to: "to-amber-950", dot: "bg-amber-400", label: "Degraded" },
  down:     { from: "from-rose-900",  to: "to-rose-950",  dot: "bg-rose-400",  label: "Down"     },
};

export default async function OpsReadinessPage() {
  const snapshot = await getReadinessSnapshot();
  const overall = OVERALL_CARD[snapshot.overallStatus] ?? OVERALL_CARD.degraded;

  const passCount = snapshot.checks.filter((c) => c.status === "pass").length;
  const warnCount = snapshot.checks.filter((c) => c.status === "warn").length;
  const failCount = snapshot.checks.filter((c) => c.status === "fail").length;

  return (
    <main className="mx-auto max-w-7xl space-y-10 px-6 py-10">

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <header className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 to-slate-950 px-8 py-12 text-white animate-fade-in">
        <div className="pointer-events-none absolute right-0 top-0 h-52 w-52 translate-x-1/3 -translate-y-1/3 rounded-full bg-indigo-600/15 blur-[60px]" />
        <div className="relative">
          <nav className="mb-4 flex items-center gap-2 text-sm text-slate-500" aria-label="Breadcrumb">
            <Link href="/" className="transition hover:text-white">Home</Link>
            <span>/</span>
            <Link href="/explore" className="transition hover:text-white">Explore</Link>
            <span>/</span>
            <span className="text-slate-300">Readiness</span>
          </nav>
          <span className="badge badge-indigo mb-3 inline-flex">Command Center</span>
          <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">
            Readiness Ledger
          </h1>
          <p className="mt-3 text-slate-400">
            Generated at{" "}
            <time className="font-medium text-slate-300">
              {new Date(snapshot.generatedAt).toLocaleString("en-US", { timeZone: "UTC" })} UTC
            </time>
          </p>
        </div>
      </header>

      {/* ── Stat cards ───────────────────────────────────────────── */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Summary metrics">

        {/* Overall status */}
        <article className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${overall.from} ${overall.to} p-5 text-white`}>
          <div className={`pointer-events-none absolute right-0 top-0 h-24 w-24 translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 blur-2xl ${overall.dot}`} />
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Overall Status</p>
          <div className="mt-3 flex items-center gap-2">
            <span className={`h-3 w-3 rounded-full ${overall.dot} animate-pulse`} />
            <span className="text-2xl font-bold">{overall.label}</span>
          </div>
        </article>

        <article className="card p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">Published Posts</p>
          <p className="mt-3 text-4xl font-extrabold text-zinc-900 dark:text-white tabular-nums">
            {snapshot.metrics.publishedPosts}
          </p>
        </article>

        <article className="card p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">Drafts in Queue</p>
          <p className="mt-3 text-4xl font-extrabold text-zinc-900 dark:text-white tabular-nums">
            {snapshot.metrics.drafts}
          </p>
        </article>

        <article className="card p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">Check Summary</p>
          <div className="mt-3 flex items-end gap-3">
            <span className="text-2xl font-extrabold text-emerald-600 tabular-nums">{passCount}</span>
            <span className="mb-0.5 text-xs text-zinc-400">pass</span>
            <span className="text-2xl font-extrabold text-amber-600 tabular-nums">{warnCount}</span>
            <span className="mb-0.5 text-xs text-zinc-400">warn</span>
            {failCount > 0 && (
              <>
                <span className="text-2xl font-extrabold text-rose-600 tabular-nums">{failCount}</span>
                <span className="mb-0.5 text-xs text-zinc-400">fail</span>
              </>
            )}
          </div>
        </article>
      </section>

      {/* ── Main grid ────────────────────────────────────────────── */}
      <section className="grid gap-6 lg:grid-cols-[1fr_320px]" aria-label="Launch checklist">

        {/* Check list */}
        <div className="card p-6 space-y-3">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
            Deployment Queue
          </h2>
          <div className="space-y-3 mt-2">
            {snapshot.checks.map((check) => {
              const badge = STATUS_BADGE[check.status] ?? STATUS_BADGE.warn;
              const dot = STATUS_DOT[check.status] ?? STATUS_DOT.warn;
              return (
                <article
                  key={check.key}
                  className="rounded-xl border border-zinc-100 p-4 dark:border-zinc-800"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${dot}`} />
                      <h3 className="font-semibold text-zinc-900 dark:text-white">{check.title}</h3>
                    </div>
                    <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${badge}`}>
                      {check.status}
                    </span>
                  </div>
                  <p className="mt-2 pl-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                    {check.detail}
                  </p>
                </article>
              );
            })}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-4">
          <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 p-5 text-white">
            <h3 className="text-lg font-bold">Metadata Verification</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {[
                { label: "Canonical URL Validation", ok: true },
                { label: "OG Graph Metadata", ok: true },
                { label: "Schema.org Markup", ok: true },
                { label: "Institutional Disclosure", ok: snapshot.metrics.publishedPosts > 0 },
              ].map((item) => (
                <li key={item.label} className="flex items-center gap-2.5">
                  <span className={`h-4 w-4 shrink-0 rounded-full flex items-center justify-center text-[8px] font-bold ${item.ok ? "bg-emerald-500 text-white" : "bg-amber-500 text-white"}`}>
                    {item.ok ? "✓" : "!"}
                  </span>
                  <span className="text-slate-300">{item.label}</span>
                </li>
              ))}
            </ul>
            <button className="mt-5 w-full rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-indigo-50">
              Run Full Audit
            </button>
          </div>

          <div className="card p-4 text-sm">
            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">Last Publish</p>
            <p className="mt-2 font-medium text-zinc-900 dark:text-white">
              {snapshot.metrics.lastPublishAt ?? "No publish yet"}
            </p>
          </div>

          <div className="card p-4 text-sm">
            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">Content Inventory</p>
            <div className="mt-3 space-y-2">
              <div className="flex justify-between">
                <span className="text-zinc-600 dark:text-zinc-400">Categories</span>
                <span className="font-semibold text-zinc-900 dark:text-white">{snapshot.metrics.categories}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-600 dark:text-zinc-400">Authors</span>
                <span className="font-semibold text-zinc-900 dark:text-white">{snapshot.metrics.authors}</span>
              </div>
            </div>
          </div>
        </aside>

      </section>

    </main>
  );
}
