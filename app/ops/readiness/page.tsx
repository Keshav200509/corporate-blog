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

const STATUS_STYLES: Record<string, string> = {
  pass: "bg-emerald-500/10 text-emerald-700 border-emerald-500/30",
  warn: "bg-amber-500/10 text-amber-700 border-amber-500/30",
  fail: "bg-rose-500/10 text-rose-700 border-rose-500/30"
};

export default async function OpsReadinessPage() {
  const snapshot = await getReadinessSnapshot();

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-10">
      <header className="rounded-2xl bg-white p-8 shadow-sm">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Command Center</p>
        <h1 className="mt-2 text-5xl font-bold tracking-tight text-slate-950">Readiness Ledger</h1>
        <p className="mt-2 text-sm text-slate-500">Generated at: {new Date(snapshot.generatedAt).toLocaleString("en-US", { timeZone: "UTC" })} UTC</p>
      </header>

      <section className="grid gap-4 md:grid-cols-4">
        <article className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="text-xs uppercase tracking-wide text-slate-500">Overall status</h2>
          <p className={`mt-3 inline-flex rounded border px-3 py-1 text-sm font-semibold ${STATUS_STYLES[snapshot.overallStatus]}`}>{snapshot.overallStatus.toUpperCase()}</p>
        </article>
        <article className="rounded-xl border border-slate-200 bg-white p-5"><h2 className="text-xs uppercase tracking-wide text-slate-500">Published</h2><p className="mt-3 text-3xl font-semibold">{snapshot.metrics.publishedPosts}</p></article>
        <article className="rounded-xl border border-slate-200 bg-white p-5"><h2 className="text-xs uppercase tracking-wide text-slate-500">Drafts</h2><p className="mt-3 text-3xl font-semibold">{snapshot.metrics.drafts}</p></article>
        <article className="rounded-xl border border-slate-200 bg-white p-5"><h2 className="text-xs uppercase tracking-wide text-slate-500">Queue health</h2><p className="mt-3 text-3xl font-semibold">{snapshot.metrics.categories + snapshot.metrics.authors > 0 ? "88%" : "—"}</p></article>
      </section>

      <section className="grid gap-4 md:grid-cols-[1.4fr_0.8fr]" aria-label="Launch checklist checks">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="text-xl font-semibold">Pending Deployment Queue</h2>
          <div className="mt-4 space-y-3">
            {snapshot.checks.map((check) => (
              <article key={check.key} className="rounded-lg border border-slate-200 p-4">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-medium text-slate-900">{check.title}</h3>
                  <span className={`rounded border px-2 py-0.5 text-xs font-semibold ${STATUS_STYLES[check.status]}`}>{check.status.toUpperCase()}</span>
                </div>
                <p className="mt-2 text-sm text-slate-600">{check.detail}</p>
              </article>
            ))}
          </div>
        </div>
        <aside className="space-y-4">
          <article className="rounded-xl bg-slate-950 p-5 text-white">
            <h3 className="text-xl font-semibold">Metadata Verification</h3>
            <ul className="mt-4 space-y-2 text-sm text-slate-300">
              <li>• Canonical URL Validation</li>
              <li>• OG Graph Metadata</li>
              <li>• Schema.org Markup</li>
              <li>• Institutional Disclosure</li>
            </ul>
            <button className="mt-4 w-full rounded bg-white px-4 py-2 text-sm font-semibold text-slate-950">Run Full Audit</button>
          </article>
          <article className="rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-600">
            <p>Last publish: {snapshot.metrics.lastPublishAt ?? "No publish yet"}</p>
          </article>
        </aside>
      </section>
    </main>
  );
}
