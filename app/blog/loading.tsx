export default function BlogLoading() {
  return (
    <main className="mx-auto max-w-5xl space-y-6 px-6 py-12" aria-busy="true">
      <div className="h-8 w-64 animate-pulse rounded bg-zinc-100 dark:bg-zinc-800" />
      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <article key={index} className="space-y-3 rounded-xl border border-zinc-200 p-5 dark:border-zinc-800">
            <div className="h-3 w-24 animate-pulse rounded bg-zinc-100 dark:bg-zinc-800" />
            <div className="h-6 w-3/4 animate-pulse rounded bg-zinc-100 dark:bg-zinc-800" />
            <div className="h-4 w-full animate-pulse rounded bg-zinc-100 dark:bg-zinc-800" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-zinc-100 dark:bg-zinc-800" />
          </article>
        ))}
      </div>
    </main>
  );
}
