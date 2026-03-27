export default function AuthorLoading() {
  return (
    <main className="mx-auto max-w-3xl space-y-4 px-6 py-12" aria-busy="true">
      <div className="h-8 w-48 animate-pulse rounded bg-zinc-100 dark:bg-zinc-800" />
      <div className="h-4 w-64 animate-pulse rounded bg-zinc-100 dark:bg-zinc-800" />
      <div className="grid gap-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="h-24 animate-pulse rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900" />
        ))}
      </div>
    </main>
  );
}
