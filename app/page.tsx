import Link from "next/link";

const featuredCards = [
  {
    title: "The Sovereignty of Silicon",
    excerpt: "How tech giants are reshaping global diplomacy and sovereign policy.",
    href: "/blog/launching-seo-first-content-platform"
  },
  {
    title: "The End of the Bull Market",
    excerpt: "Strategic asset allocation in high-interest macro regimes.",
    href: "/blog/editorial-workflows-that-scale"
  },
  {
    title: "Quantum Supremacy Milestones",
    excerpt: "Practical readiness checkpoints for institutional adoption.",
    href: "/blog/core-web-vitals-for-content-sites"
  }
];

export default function HomePage() {
  return (
    <main className="mx-auto max-w-7xl space-y-16 px-6 py-10">
      <section className="grid gap-8 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-8 text-white md:grid-cols-[1.2fr_1fr] md:p-12">
        <div className="space-y-6">
          <p className="inline-flex rounded-full bg-blue-500/30 px-3 py-1 text-xs font-semibold uppercase tracking-wide">Intelligence Records</p>
          <h1 className="text-4xl font-bold leading-tight md:text-6xl">The Intelligence Engine for the Modern Executive</h1>
          <p className="max-w-xl text-slate-300">Distilling complex global shifts into strategic briefs, deep-dive analysis, and institutional readiness reports.</p>
          <div className="flex gap-3">
            <Link href="/blog" className="rounded-md bg-white px-5 py-2.5 text-sm font-semibold text-slate-950">Explore Briefings</Link>
            <Link href="/ops/readiness" className="rounded-md border border-white/30 px-5 py-2.5 text-sm font-semibold">View Readiness</Link>
          </div>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Curator Note</p>
          <h2 className="mt-3 text-2xl font-semibold">Institutional-grade insights, updated daily.</h2>
          <p className="mt-3 text-sm text-slate-300">A clean editorial framework for decision-makers: categories, curators, and operational readiness in one workflow.</p>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {featuredCards.map((card, index) => (
          <article key={card.title} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">0{index + 1}</p>
            <h2 className="mt-3 text-2xl font-semibold leading-tight">{card.title}</h2>
            <p className="mt-3 text-sm text-slate-600">{card.excerpt}</p>
            <Link href={card.href} className="mt-6 inline-block text-sm font-semibold text-slate-950 hover:underline">
              Read insight →
            </Link>
          </article>
        ))}
      </section>

      <section className="grid gap-8 md:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-2xl border border-slate-200 bg-white p-8">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Serverless Performance</p>
          <h2 className="mt-4 text-4xl font-semibold">Edge Delivery Network</h2>
          <p className="mt-4 text-slate-600">Global low-latency delivery, static-first rendering, and reliability for high-traffic intelligence publishing.</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-slate-200 p-4">
              <p className="text-2xl font-bold">190+</p>
              <p className="text-xs uppercase text-slate-500">Countries reached</p>
            </div>
            <div className="rounded-lg border border-slate-200 p-4">
              <p className="text-2xl font-bold">0ms</p>
              <p className="text-xs uppercase text-slate-500">Avg. queue lag</p>
            </div>
            <div className="rounded-lg border border-slate-200 p-4">
              <p className="text-2xl font-bold">100</p>
              <p className="text-xs uppercase text-slate-500">Lighthouse target</p>
            </div>
          </div>
        </article>
        <aside className="rounded-2xl bg-slate-950 p-8 text-white">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Weekly briefing</p>
          <h3 className="mt-3 text-3xl font-semibold">Stay ahead of macro shifts</h3>
          <p className="mt-3 text-sm text-slate-300">Get a concise institutional briefing every Monday.</p>
          <div className="mt-6 flex gap-2">
            <input className="w-full rounded border border-white/20 bg-white/5 px-3 py-2 text-sm" placeholder="professional@company.com" />
            <button className="rounded bg-white px-4 text-sm font-semibold text-slate-950">Join</button>
          </div>
        </aside>
      </section>
    </main>
  );
}
