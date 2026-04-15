export default function SelfieGeneratorLoading() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-indigo-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
      <section className="border-b border-zinc-200/60 bg-white/70 px-6 py-10 text-center backdrop-blur">
        <div className="mx-auto max-w-2xl animate-pulse">
          <div className="mx-auto mb-3 h-6 w-48 rounded-full bg-zinc-200" />
          <div className="mx-auto h-10 w-80 rounded-xl bg-zinc-200" />
          <div className="mx-auto mt-3 h-5 w-96 rounded-lg bg-zinc-100" />
        </div>
      </section>
      <div className="mx-auto max-w-xl px-6 py-16">
        <div className="animate-pulse rounded-2xl border-2 border-dashed border-zinc-200 bg-white px-8 py-20 text-center">
          <div className="mx-auto mb-4 h-10 w-10 rounded-full bg-zinc-200" />
          <div className="mx-auto h-5 w-48 rounded-lg bg-zinc-200" />
          <div className="mx-auto mt-2 h-4 w-64 rounded bg-zinc-100" />
          <div className="mx-auto mt-6 h-10 w-32 rounded-xl bg-zinc-200" />
        </div>
      </div>
    </main>
  );
}
